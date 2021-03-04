import 'intersection-observer'
import 'mutationobserver-shim'
import Util from '../../../lib/common/index.js'
import { domParentList } from '../visual/visualShow/common/index.js'
import { getElementContent } from '../heatmap/lib/elementContent.js'
var Version = '4.5.2'
// 创建与视界相交监听
var io = new IntersectionObserver(sendExposure, {
    threshold: [0.01]
});
// 创建dom结构改变监听
var mutation = new MutationObserver(domChange);
var timer = null
var eleList = []
/**
 *  处理与视界相交元素消息
 * @param {Array} exposures
 */
function sendExposure (exposures) {
    clearTimeout(timer)
    for (var i = 0; i < exposures.length; i++) {
        var exposure = exposures[i]
        var ele = exposure.target
        if (exposure.intersectionRatio > 0 && ele['isARKExposure'] !== 1) {
            eleList.push(ele)
        } else if (exposure.intersectionRatio === 0 && config.exposure && Util.paramType(config.exposure.valid_time) === 'Number') {

            for (var y = 0; y < eleList.length; y++) {
                if (eleList[y] === ele) {
                    eleList.splice(y, 1)
                }
            }
        }
    }
    var stayTime = Util.paramType(config.exposure.valid_time) === 'Number' && config.exposure.valid_time > 300 ? config.exposure.valid_time : 300
    timer = setTimeout(function () {
        if (eleList.length > 0) {
            upLog()
        }
    }, stayTime)

}
/**
 * url标准化
 *
 * @returns url
 */
function getUrl () {
    var url = window.location.href
    try {
        url = decodeURIComponent(url)
    } catch (e) { }
    try {
        if (window.AnalysysAgent.config.isHybrid === true) {
            url = url.replace(/"/g, '\\"')
        }
    } catch (e) { }
    return url
}
/**
 * 上报日志
 */
function upLog () {
    var exPro = {}
    var multiple = config.exposure.multiple

    for (var i = 0; i < eleList.length; i++) {
        var ele = eleList[i]
        var pro = getPro(ele)
        var userPro = {}
        for (var key in pro) {
            if (Util.paramType(pro[key]) === 'Number' || Util.paramType(pro[key]) === 'Boolean' || Util.paramType(pro[key]) === 'String') {
                userPro[key] = [pro[key].toString()]
                if (Util.objHasKay(exPro, key) === false) {
                    exPro[key] = []
                }
                exPro[key].push.apply(exPro[key], userPro[key])
            }
        }
        if (config.exposure && config.exposure.exposure_click === true && ele['isARKExposureClick'] !== 1) {
            ele['isARKExposureClick'] = 1
            var callback = (function (ele, pro) {
                return function () {
                    pro['$url'] = getUrl()
                    pro['$title'] = document.title || ''
                    window.AnalysysAgent && window.AnalysysAgent.track('exposure_click', pro)
                }
            })(ele, userPro)
            Util.addEvent(ele, 'click', callback, true)
        }
        ele['isARKExposure'] = 1
        if (Util.paramType(multiple) === 'Function') {
            multiple = multiple.call(multiple, ele)
        }
        if (Util.paramType(multiple) === 'Number' || multiple === true) {
            var multipleTime = multiple === true ? 0 : multiple
            var multipleCallback = (function (ele) {
                return function () {
                    ele['isARKExposure'] = 0
                }
            })(ele)
            setTimeout(multipleCallback, multipleTime)
        }
    }
    exPro['$url'] = getUrl()
    exPro['$title'] = document.title || ''
    window.AnalysysAgent && window.AnalysysAgent.track('exposure_points', exPro)
    eleList = []
}
/**
 * 获取曝光点自定义属性
 * @param {Element} ele 曝光点元素
 * @returns {JSON} attr 元素自定义信息
 */
function getPro (ele) {
    var attr = {}
    if (Util.paramType(config.exposure) === 'Object') {
        var property = config.exposure.property
        if (Util.paramType(property) === 'Object') {
            for (var key in property) {
                if (Util.paramType(property[key]) === 'Function') {
                    attr[key] = property[key].call(property[key], ele)
                } else {
                    attr[key] = property[key]
                }
            }
        } else if (Util.paramType(property) === 'Function') {
            var pros = property.call(property, ele)
            if (Util.paramType(pros) === 'Object') {
                attr = pros
            }
        }
    }
    // 优先去当前元素曝光点自定义元素
    // 如当前无自定义属性 则查找直系父元素自定义属性
    // 元素tag自定义属性>初始化配置自定义属性
    var eleAttr = ele.getAttribute('data-ark-exposure') || ele.parentNode.getAttribute('data-ark-exposure-child')
    if (eleAttr) {
        try {
            eleAttr = JSON.parse(eleAttr)
            attr = Util.objMerge(attr, eleAttr)
        } catch (e) { }
    }
    if (!attr['exposure_id']) {
        var newPath = domParentList(ele).newPath
        attr['exposure_id'] = Util.MD5(JSON.stringify(newPath))
    }
    var content = getElementContent(ele)
    if (content !== '') {
        if (Util.paramType(content) === 'String' && content.length > 255) {
            content = Util.stringSlice(content, 254) + '$'
        }
        attr['exposure_content'] = content
    }
    return attr
}
/**
 * 根据dom变化，将符合曝光采集元素添加曝光监听
 * @param {Mut} mutations
 */
function domChange (mutations) {
    for (var y = 0; y < mutations.length; y++) {
        var addedNodes = mutations[y].addedNodes
        addIo(addedNodes)
    }
}
/**
 * 创建就document.body变化监听
 * 包含dom树及属性变化
 */
function addMutation () {
    mutation.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    })
}
/**
 *  判断是否为曝光元素
 *
 * @param {Element} ele dom元素
 * @returns {Boolean}
 */
function isExposureEle (ele) {
    if (config.exposure.element_list) {
        var list = getConfigEles()

        for (var i = 0; i < list.length; i++) {
            if (ele === list[i]) {
                return true
            }
        }
    }
    if (!ele.getAttribute('data-ark-ignore') && (ele.getAttribute('data-ark-exposure') !== null || (ele.parentNode && ele.parentNode.getAttribute('data-ark-exposure-child') !== null))) {
        return true
    }
    return false
}
/**
 * 根据元素列表添加曝光监听
 * @param {Element & Array<Element>} eles 元素列表
 */
function addIo (eles) {
    for (var i = 0; i < eles.length; i++) {
        var ele = eles[i]
        if (ele.nodeType === 1) {
            if (!ele['hasARKExposure'] && isExposureEle(ele) === true) {
                io.observe(ele)
                ele['hasARKExposure'] = 1
            }
            if (ele.childNodes.length > 0) {
                addIo(ele.childNodes)
            }
        }
    }
}
/**
 * 子元素添加曝光监听
 *
 * @param {Element} ele 父元素
 */
function getChildIo (ele) {
    var childList = ele.childNodes
    addIo(childList)
}
function getConfigEles () {
    var list = []
    if (config.exposure.element_list) {
        var configlist = config.exposure.element_list
        if (Util.paramType(configlist) === 'Array' || Util.paramType(configlist) === 'HTMLCollection') {
            list = configlist
        } else if (Util.paramType(configlist) === 'Function') {
            configlist = configlist.call(configlist)
            if (Util.paramType(configlist) === 'HTMLCollection' || Util.paramType(configlist) === 'Array') {
                list = configlist
            }
        }
    }
    return list
}
var config = {
    exposure: {
        valid_time: 300,//停留有效时间
        property: {},//自定义参数
        exposure_click: false, // 是否自动采集曝光元素点击事件
        multiple: false,//true或毫秒值, 是否重复采集曝光点数据或多少毫秒后可再次采集
        element_list: [],
        Version: Version
    }
}
function startIo () {

    if (window.AnalysysAgent) {
        config = Util.objMerge(config, window.AnalysysAgent.config)
    }
    // 监听dom变动
    addMutation()
    // 添加当前已存在曝光点
    var eles = Util.selectorAllEleList('[data-ark-exposure]')
    addIo(eles)
    // 添加config中 element_list设置的元素
    var configList = getConfigEles()
    addIo(configList)
    // // 添加批量曝光点
    var elePanentList = Util.selectorAllEleList('[data-ark-exposure-child]')
    for (var i = 0; i < elePanentList.length; i++) {
        getChildIo(elePanentList[i])
    }
}
function isElmentReady () {
    if (document && document.documentElement && document.getElementsByTagName && document.getElementById && document.body && document.documentElement.scrollWidth !== 0) {
        return true
    } else {
        return false
    }
}
function init () {
    if (isElmentReady()) {
        startIo()
    } else {
        setTimeout(init, 300)
    }
}
// 添加监听，页面加载完毕后开始生效
if (window.location.href.indexOf('visual=true') < 0 && window.location.href.indexOf('arkheatmap=true') < 0) {
    init()
}
export default {}