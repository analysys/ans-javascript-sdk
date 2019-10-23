import msg from './iframeMsg.js'
import elePostion from '../lib/postion.js'
import {
    getLibVersion
} from '../../../../lib/fillField/getField.js'
import {
    os,
    os_version,
    browser,
    browser_version
} from '../../parseUA/lib/UA.js'
var win = window
var loc = win.location
var url = loc.protocol + '//' + loc.host + loc.pathname + loc.hash

var logBossEle = null
var showLog = false
var eventList = []

function setShowLog(type) {
    showLog = type
}

function setEventList(list) {
    eventList = list
}

function getShowLog(type) {
    return showLog
}

function upLog(event) {
    if (!showLog) return
    var ele = event.target
    logBossEle = ele
    var eventId = logBossEle.getAttribute("ark_id")
    if (eventId === "" || !eventId) {
        return
    }
    for (var i = 0; i < eventList.length; i++) {
        if (eventList[i].appEventId === eventId) {
            AnalysysAgent.track(eventList[i].appEventId)
        }
    }

    var logMsg = {
        "event_info": {
            "$event_id": eventId,
            "$os": os,
            "$os_version": os_version,
            "$browser": browser,
            "$browser_version": browser_version,
            "$lib_version": getLibVersion,
            "$screen_width": window.screen.width,
            "$screen_height": window.screen.height
        },
        "type": "debug",
        "target_page": url
    }
    msg.postMsg(logMsg)
}

function showDebug(obj) {
    removeDebug()
    var elem = logBossEle
    var logObj = obj.event_info
    var position = elePostion.boxPosition(elem, 'debug')
    var logBOX = document.createElement('div')
    logBOX.id = 'ARK_DEBUG_BOX'
    logBOX.className = 'debugLog'
    logBOX.style.top = position.top + 'px';
    logBOX.style.left = position.left + 'px';
    logBOX.style.position = 'absolute';

    var listBOX = document.createElement('div')
    listBOX.className = 'l-list'
    var bgBOX = document.createElement('div')
    bgBOX.className = 'bg'
    logBOX.onclick = function(e) {
        e.stopPropagation();
    }
    for (var i = 0; i < logObj.length; i++) {
        var logSpan = document.createElement('div')
        logSpan.innerHTML = logObj[i].title + ":" + logObj[i].val + "<br>"
        listBOX.appendChild(logSpan)
    }
    logBOX.appendChild(bgBOX)
    logBOX.appendChild(listBOX)
    var xBOX = document.createElement('img')
    xBOX.className = 'cha'
    xBOX.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDcwM0Y3NzQ3MzJEMTFFODhFNDFEQjRCQTQ3NDU1ODYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDcwM0Y3NzU3MzJEMTFFODhFNDFEQjRCQTQ3NDU1ODYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NTlBNDc3RjcyQzgxMUU4OEU0MURCNEJBNDc0NTU4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NTlBNDc4MDcyQzgxMUU4OEU0MURCNEJBNDc0NTU4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtVAdZIAAACKSURBVHjadI/dDcMwCIRxxD5Jn6N0gqRdpMvlZ4NUeU08ETkqkJDlIh3G5jPikoh8iOgLXVSPFhoapB2aoO4P9IYORsr2+LLTJ3c2YIVOtkeFkzU8tN4U0guHxhUAipBGU+yUQi2xESc+oBFaws7iHrgC5fDZDWY2SPeaC8gN/iYr2Feg0uDzFmAA00Ef4tAWMJcAAAAASUVORK5CYII='
    xBOX.onclick = function() {
        document.body.removeChild(logBOX)
    }
    logBOX.appendChild(xBOX)

    document.body.appendChild(logBOX)

}

function removeDebug() {
    var ele = document.getElementById("ARK_DEBUG_BOX")
    if (ele) {
        var parent = ele.parentNode
        parent.removeChild(ele)
    }
}
export { upLog, showDebug, removeDebug, setShowLog, getShowLog, setEventList }