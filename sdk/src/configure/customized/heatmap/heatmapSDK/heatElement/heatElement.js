import Util from '../../../../../lib/common/index.js'
import ajax from '../../../../../lib/upload/ajax.js'
import { elementPostion, eleCss, parseEvent, parserDom, domParentList } from './../common/index.js'
import { getElementContent } from '../../lib/elementContent.js'
import { heatmapConfig, showMapConfig, backParam } from '../common/config.js'
import { loadingStatus, noDataStatus, setElementMap } from '../head/index.js'
var elementMapDatas = {}

var colors = ['63,81,181', '33,150,243', '0,188,212', '87,201,92', '205,220,57', '255,235,59', '255,152,0', '255,87,34', '229,57,53', '183,28,28']

function thousands(num) {
    var str = num.toString();
    var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
}

function buildElemetMap(ele, elementObj, index) {
    var uv = elementObj.uv
    var pv = elementObj.clickNum
    var pvPercent = Math.round(elementObj.clickNumPercent * 10000) / 100
    var ele_porint = ele
    var ele_width = ele_porint.offsetWidth + 10
    var ele_height = ele_porint.offsetHeight + 10
    var ele_position = elementPostion(ele_porint)
    if (ele_position.hidden == true) {
        return
    }
    var parent = ele_porint.parentNode || document.body

    // var ele_parent_position = elementPostion(parent)
    var ele_context = getElementContent(ele_porint)

    elementObj.clickNumPercent = pvPercent
    elementObj['content'] = (ele_context || '-')
    var top = ele_porint.offsetTop - 5 //ele_position.y - ele_parent_position.y
    var left = ele_porint.offsetLeft - 5 //ele_position.x - ele_parent_position.x
    // if (pvPercent != 1) {
    var color_index = Math.ceil((pv / max) * 10) - 1
    // }
    if (ele_width < 55) {

        ele_width = 55
    }
    var color = colors[color_index]

    var ele_div = document.createElement('div')
    // var ele_css = 'top: ' + top + 'px;left: ' + left + 'px;background-color:rgba(' + color + ',.8);width:' + ele_width + 'px;height:' + ele_height + 'px;line-height:' + ele_height + 'px;text-align:center;' //'
    ele_div.style.top = top + 'px'
    ele_div.style.left = left + 'px'
    ele_div.style.backgroundColor = 'rgba(' + color + ',.8)'
    ele_div.style.width = ele_width + 'px'
    ele_div.style.height = ele_height + 'px'
    ele_div.style.lineHeight = ele_height + 'px'
    ele_div.style.textAlign = 'center'
    var classList = 'ARK_HEAT_ELEMENT_POINT'
    if (index > 19) {
        classList += ' ARK_OPACITY'
    }
    ele_div.className = classList
    var pageHeight = document.body.offsetHeight
    var status = ''
    var top = 'top:' + (ele_height + 6) + 'px;'
    if (pageHeight < (ele_width + ele_porint.offsetTop + 78)) {
        status = 'up';
        top = 'top: -82px;'
    }
    var chlid_html = `<span>` + pvPercent + `%</span>
                <div class="ARK_HEAT_ELEMENT_POINT_MSG ` + status + `" style="` + top + `">
                    <div class="ARROWLIST"></div>
                    <table>
                        <thead>
                            <td>点击数</td>
                            <td>点击占比</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td>` + thousands(pv) + `</td>
                                <td>` + pvPercent + `%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
    `
    ele_div.innerHTML = chlid_html
    ele_div.onclick = function(event) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        event.preventDefault();
        return false

    }
    parent.appendChild(ele_div)


    var hoverCallback = (function() {
        return function() {

            var top = this.offsetTop - 5 //ele_position.y - ele_parent_position.y
            var left = this.offsetLeft - 5 //ele_position.x - ele_parent_position.x
            ele_div.style.top = top
            ele_div.style.left = left
            // ele_div.style = 'top: ' + top + 'px;left: ' + left + 'px;background-color:rgba(' + color + ',.7);width:' + ele_width + 'px;height:' + ele_height + 'px;line-height:' + ele_height + 'px;text-align:center;'
        }
    })()
    Util.addEvent(ele, 'mouseover', hoverCallback)
    return `<tr>
                <td title="` + ele_context + `" ` + (ele_context ? '' : 'style="color:#BBBBBB"') + `>` + (ele_context || '-') + `</td>
                <td>` + elementObj.type + `</td>
                <td>` + uv + `</td>
                <td>` + thousands(pv) + `</td>
                <td>` + pvPercent + `%</td>
            </tr>`

}
var max = 0

function setElmentMap(data) {
    if(showMapConfig.type !== 'element')return
    loadingStatus(false)
    elementMapDatas = data.datas
    if (data.code == 0 && (!elementMapDatas || (elementMapDatas.detail && elementMapDatas.detail.length == 0))) {
        noDataStatus(0)
        setElementMap()
        return
    }
    // return
    if (data.code == 201) {
        noDataStatus(201)
        setElementMap()
        return
    }
    if (data.code == 100) {
        noDataStatus(100)
        setElementMap()
        return
    }
    var elementList = elementMapDatas.detail
    // var uv = data.datas.uv

    if (!elementList || elementList.length == 0) {
        noDataStatus(0)
        setElementMap()
        return
    }

    var element_list = ''
    var maxList = 0
    var eleList = []
    var eleMsg = []
    max = 0
    for (var i = 0; i < elementList.length; i++) {
        var path = elementList[i].path
        if (!path) {
            continue
        }
        var ele_porint = parseEvent(path)
        if (ele_porint) {
            if (eleList.indexOf(ele_porint) > -1) {
                eleMsg[eleList.indexOf(ele_porint)].clickNum += elementList[i].clickNum
                eleMsg[eleList.indexOf(ele_porint)].uv += elementList[i].uv
                eleMsg[eleList.indexOf(ele_porint)].clickNumPercent += elementList[i].pvPercent
                eleMsg[eleList.indexOf(ele_porint)].uvPercent += elementList[i].uvPercent
            } else {
                eleList.push(ele_porint)
                eleMsg.push({
                    clickNum: elementList[i].clickNum,
                    uv: elementList[i].uv,
                    clickNumPercent: elementList[i].clickNumPercent,
                    uvPercent: elementList[i].uvPercent,
                    type: elementList[i].type
                })
            }
            if (elementList[i].clickNum > max) {
                max = elementList[i].clickNum
            }
        }

    }

    if (eleList.length > 0) {
        eleList.sort(function(a, b) {
            return a.clickNum - b.clickNum
        })
    } else {
        noDataStatus(0)
        setElementMap()
        return
    }
    var eleMessageList = []
    for (var i = 0; i < eleList.length; i++) {
        var list_html = buildElemetMap(eleList[i], eleMsg[i], maxList)
        if (!list_html) {
            continue
        }
        if (maxList < 20) {
            element_list += list_html
            eleMessageList.push(eleMsg[i])
        }
        maxList++

    }
    setElementMap(element_list)
    if (eleMessageList.length > 0) {
        window.parent.postMessage(JSON.stringify({
            code: 'ark/elementList',
            elementList: eleMessageList
        }), '*');
    }

}

function showElementMap() {
    loadingStatus(true)
    var param = backParam()
    var option = {
        url: heatmapConfig.uploadURL + 'ark/sdk/heatmap/element/analysis',
        data: param,
        success: setElmentMap,
        error: function() {
            noDataStatus(402)
        }
    }
    new ajax().post(option)


}

function getClassNames(classStr, tagName) {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(classStr)
    } else {
        var nodes = document.getElementsByTagName(tagName),
            ret = [];
        for (i = 0; i < nodes.length; i++) {
            if (hasClass(nodes[i], classStr)) {
                ret.push(nodes[i])
            }
        }
        return ret;
    }
}

function delElementMap() {
    var elementEleList = getClassNames("ARK_HEAT_ELEMENT_POINT", "div")
    if (elementEleList.length > 0) {
        while (elementEleList.length > 0) {
            elementEleList[0].parentNode.removeChild(elementEleList[0]);
        }
    }
    noDataStatus(200)
    loadingStatus(false)
}

export { showElementMap, delElementMap }