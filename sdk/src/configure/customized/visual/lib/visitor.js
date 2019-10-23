import Util from '../../../../lib/common/index.js'
// import elePostion from './postion.js'
import { getElementContent } from '../../heatmap/lib/elementContent.js'
import { parseEvent, parserDom, domParentList, isParent, setIndex ,pathContrast} from '../visualShow/common/index.js'
import ajax from '../../../../lib/upload/ajax.js'
import Storage from '../../../../lib/storage/index.js'
var visitorConfig = {}

function loadVisitorSDK() {
    Util.addScript('AnalysysAgent_JS_SDK_VISUAL')
    window.ARK_VISUAL = {
        config: visitorConfig
    }
    Storage.setSession('visitor', true)
}

// function setIndex(ele, likeDomList) {

//     var link = likeDomList
//     var eleObj = parserDom(link)
//     if (eleObj.length === 0) {
//         return
//     }
//     var baseEle = eleObj[0]
//     var eleList = document.querySelectorAll(baseEle.link)
//     var allEleList = []
//     for (var i = 0; i < eleList.length; i++) {
//         if (domParentList(eleList[i]) === link) {
//             allEleList.push(eleList[i])
//         }
//     }
//     for (var i = 0; i < allEleList.length; i++) {
//         if (allEleList[i] === ele) {
//             return i
//         }
//     }
//     return 0
// }

function addElesListener(event) {
    var e = event || window.event;
    if (e.touches && e.touches.length > 0) {
        e = e.touches[0]
    }

    var ele = e.target || e.srcElement

    var elePath = domParentList(ele)
    var eleIndex = setIndex(ele, elePath)
    for (var i = 0; i < visitorEventList.length; i++) {
        var link = visitorEventList[i].link
        var index = visitorEventList[i].index
        var eventName = visitorEventList[i].appEventId
        var visualEle = parseEvent(link)

        if (!visualEle || visualEle.length < index) {
            continue;
        }
        if (visualEle[index] == ele || isParent(ele, visualEle[index]) || (eleIndex == index && pathContrast(elePath, link))) {
            var isText = visitorEventList[i].isText
            if (isText) {
                var eleText = getElementContent(ele)
                if (isText === eleText) {
                    AnalysysAgent.track(eventName)
                }

            } else {

                AnalysysAgent.track(eventName)
            }
        }
    }
}
var visitorEventList = []

function getVisitorEvent() {
    var visitorUrl = visitorConfig.visitorConfigURL
    var success = function(data) {
        if (data.code !== 0) {
            return
        }

        visitorEventList = data.data

    }
    var hash = window.location.hash
    if (hash.indexOf("?") > -1) {
        hash = hash.split("?")[0]
    }
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
    var option = {
        url: visitorUrl,
        data: {
            appkey: visitorConfig.appid,
            lib: "Js",
            url: url
        },
        success: success,
        error: function() {}
    }
    new ajax().get(option)
}
var istVisitor = false
var url = window.location.href

function visitorPageViewInit(config) {
    if (config.visitorConfigURL) {
        istVisitor = true
        if (config.visitorConfigURL.charAt(config.visitorConfigURL.length - 1) !== "/") {
            config.visitorConfigURL += '/'
        }
        config.visitorConfigURL = config.visitorConfigURL + 'configure'

        getVisitorEvent()

        if (Util.deviceType() == 'desktop') {
            Util.addEvent(document, 'mousedown', addElesListener)
        } else {
            Util.addEvent(document, 'touchstart', addElesListener)
        }
        Util.changeHash(function() {
            if (url != window.location.href) {
                url = window.location.href
                getVisitorEvent()
            }
        })
    }
}

function visitorInit(config) {
    visitorConfig = config

    if (Util.paramType(window.top) != 'Undefined' && (top !== self) && (window.location.href.indexOf("visual=true") > -1 || Storage.getSession('visitor') == true)) {

        loadVisitorSDK()
    } else {
        visitorPageViewInit(config)
    }

    return config
}
export { visitorInit }