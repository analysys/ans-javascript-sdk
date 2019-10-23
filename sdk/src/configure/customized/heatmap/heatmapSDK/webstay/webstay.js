import Util from '../../../../../lib/common/index.js'
import ajax from '../../../../../lib/upload/ajax.js'
import './webStayLine.css'
import { heatmapConfig, showMapConfig, backParam } from '../common/config.js'
import { loadingStatus, noDataStatus } from '../head/index.js'
import { getConstantStyle } from '../common/index.js'


import { webStayPageLineTemp, webStayMouseLineTemp } from './webStayDom.js'
var webStayDatas = {}

function setMouseLine(event) {
    var e = event || window.event
    var y = e.pageY || e.clientY + scrollY;

    var lineNum = Math.floor(y / 10)

    var detail = webStayDatas.detail || []
    if (detail.length == 0) {
        return
    }
    var uv = webStayDatas.uv
    var value = 0
    if (lineNum < detail.length) {
        value = Math.ceil(detail[lineNum] / uv * 10000) / 100
    }
    var mouseLineEle = document.getElementById('ARKMOUSELINE')
    if (!mouseLineEle) {
        mouseLineEle = Util.addEleLable('div', 'ARK_PAGE_LINE_BOX', 'ARKMOUSELINE', document.body)
        mouseLineEle.innerHTML = webStayMouseLineTemp
    }
    document.getElementById("ARK_MOUSE_LINE_VALUE").innerHTML = value + '%的人浏览到了这里'
    mouseLineEle.style.top = y + 5 + 'px';
    if (!webStayLineStatus) {
        mouseLineEle.style.display = 'none';
    }
}
// var noDataStatus = false
var isDepth = false

function setline(data) {
    webStayDatas = data.datas
    if (showMapConfig.type == 'depth') {
        loadingStatus(false)
    }

    if (showMapConfig.type == 'depth') {
        if (data.code == 0 && (!webStayDatas || (webStayDatas.detail && webStayDatas.detail.length == 0))) {
            noDataStatus(0)
            return
        }
        // return
        if (data.code == 201 && isDepth) {
            noDataStatus(201)
            return
        }
        if (data.code == 100) {
            noDataStatus(100)
            return
        }
        if (data.code == 1302) {
            noDataStatus(1302)
            return
        }
    }

    var pageHeight = document.documentElement.scrollHeight
    var lineList = webStayDatas.detail
    var uv = webStayDatas.uv
    var max = 0
    for (var i = 0; i < lineList.length; i++) {
        // var value = Math.ceil(lineList[i] / uv * 100)
        var value = Math.ceil(lineList[i] / uv * 10000) / 100
        max = Math.max(max, value)
        if (i * 10 > pageHeight) {
            break
        }
        if (i * 10 < 600) {
            if (i > 0 && value != 100 && lineList[i - 1] == uv) {
                var lineEle = Util.addEleLable('div', 'ARK_PAGE_LINE_BOX', '', document.body)
                var lineNum = i - 1 < 0 ? 0 : (i - 1)
                lineEle.style.top = i * 10 + 'px';
                if (!webStayLineStatus) {
                    lineEle.style.display = 'none';
                }
                lineEle.innerHTML = webStayPageLineTemp.replace('{LINENUM}', 100)
            }
        } else if (i * 10 % 200 == 0) {
            var lineEle = Util.addEleLable('div', 'ARK_PAGE_LINE_BOX', '', document.body)
            var lineNum = i - 1 < 0 ? 0 : (i - 1)
            lineEle.style.top = i * 10 + 'px';
            if (!webStayLineStatus) {
                lineEle.style.display = 'none';
            }
            lineEle.innerHTML = webStayPageLineTemp.replace('{LINENUM}', value)
        }
    }

    Util.removeEvent(document, 'mousemove', setMouseLine)
    Util.addEvent(document, 'mousemove', setMouseLine)
}

function removeLineEvent() {
    Util.removeEvent(document, 'mousemove', setMouseLine)
}

function removeLine() {
    var lineEleList = document.getElementsByClassName("ARK_PAGE_LINE_BOX")
    if (lineEleList.length > 0) {
        while (lineEleList.length > 0) {
            lineEleList[0].parentNode.removeChild(lineEleList[0]);
        }
    }
}

function clearWebStay() {
    removeLine()
    removeLineEvent()
    noDataStatus(200)
    loadingStatus(false)
}
var webStayLineStatus = true

function toggleWebStay() {
    var webStayLineList = document.querySelectorAll(".ARK_PAGE_LINE_BOX")
    for (var i = 0; i < webStayLineList.length; i++) {
        if (getConstantStyle(webStayLineList[i], 'display') == 'block' ||
            getConstantStyle(webStayLineList[i], 'display') == '') {
            webStayLineStatus = false
            webStayLineList[i].style.display = 'none'
        } else {
            webStayLineStatus = true
            webStayLineList[i].style.display = 'block'
        }
    }
}

function hiddenWebStay() {
    webStayLineStatus = false
    var webStayLineList = document.querySelectorAll(".ARK_PAGE_LINE_BOX")
    for (var i = 0; i < webStayLineList.length; i++) {
        if (getConstantStyle(webStayLineList[i], 'display') == 'block' ||
            getConstantStyle(webStayLineList[i], 'display') == '') {
            webStayLineList[i].style.display = 'none'
        }
    }
}


function showWebStay() {
    webStayLineStatus = true
    var webStayLineList = document.querySelectorAll(".ARK_PAGE_LINE_BOX")
    for (var i = 0; i < webStayLineList.length; i++) {

        webStayLineStatus = true
    }
}

function initWebStay() {
    if (showMapConfig.type == 'depth') {
        loadingStatus(true)
    }
    var param = backParam()
    var option = {
        url: heatmapConfig.uploadURL + 'ark/sdk/heatmap/scrollreach/analysis',
        data: param,
        success: setline,
        error: function() {
            loadingStatus(false)
            if (showMapConfig.type == 'depth') {
                noDataStatus(402)
            }

        }
    }
    new ajax().post(option)
}

export { initWebStay, toggleWebStay, clearWebStay, showWebStay }