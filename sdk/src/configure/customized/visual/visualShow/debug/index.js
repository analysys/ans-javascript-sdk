import Util from '../../../../../lib/common/index.js'
import {
    boxPosition
} from '../common/index.js'
import {
    setDebugTemp
} from '../templete/debug.js'
import {
    sendMsg
} from '../common/iframeMsg.js'
import {
    getLibVersion
} from '../../../../../lib/fillField/getField.js'
import {
    os,
    os_version,
    browser,
    browser_version
} from '../../../parseUA/lib/UA.js'
/**
 * @param  {Object} obj 触发debug框的元素信息表
 */
function openDebugBox(obj) {
    delDebugBox()
    var ele = debugELe
    /**
     * 当前元素如无埋点信息 则不显示debug框
     */
    if (!ele.getAttribute('data-ark-attr')) {
        return
    }
    var elePosition = boxPosition(ele, 'debug')

    var config = {
        top: elePosition.top,
        left: elePosition.left,
        list: obj.event_info || []
    }
    var debugTemp = setDebugTemp(config)
    var eleDiv = document.createElement('div')
    eleDiv.innerHTML = debugTemp
    document.body.appendChild(eleDiv.childNodes[0])


    var cancelEle = document.getElementById('ARK_DEBUG_CHA')
    Util.addEvent(cancelEle, 'click', delDebugBox)

    debugELe = null
}
/**
 * 清除当前展示的debug框
 */
function delDebugBox() {
    var ele = document.getElementById("ARK_DEBUG_BOX")
    if (ele) {
        var parent = ele.parentNode
        parent.removeChild(ele)
    }
}
/**
 * debug模式下点击的元素
 */
var debugELe = null
/**
 * 
 * @param {element} e debug模式时点击的dom对象
 */
function sendDebugMsg(e) {
    var ele = e.target
    var eventConfig = ele.getAttribute('data-ark-attr')
    if (!eventConfig) return
    debugELe = ele
    var eventId = JSON.parse(eventConfig).appEventId
    var hash = location.hash
    if (hash.indexOf("?") > -1) {
        hash = hash.split("?")[0]
    }
    var url = location.protocol + '//' + location.host + location.pathname + hash
    var config = {
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
    sendMsg(config)
}


function setDebugHover(event) {
    var ele = event.target
    if (ele.onclick) {
        var userClick = ele.onclick
        ele._user_click = userClick
    }
    ele.onclick = function (e) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        event.preventDefault();
        sendDebugMsg(e)
        return false
    }
    Util.addEvent(ele, 'mouseout', removeDebugHover)
}


function removeDebugHover() {
    var ele = event.target
    ele.onclick = null
    if (ele._user_click) {
        var userClick = ele._user_click
        ele.onclick = userClick
    }
    ele._user_click = null
    Util.removeEvent(ele, 'mouseout', removeDebugHover)
}

function addDebugListener() {
    delDebugBox()
    Util.addEvent(document, 'mouseover', setDebugHover)
}

function removeDebugListener() {
    delDebugBox()
    Util.removeEvent(document, 'mouseover', setDebugHover)
}

function hiddenDebugEvent(status) {
    delDebugBox()
    var eleList = document.querySelectorAll("[data-ark-attr]")
    for (var i = 0; i < eleList.length; i++) {
        var ele = eleList[i]
        if (!status) {
            removeDebugListener()
            var eleClassName = ele.className
            if (eleClassName) {
                ele.className = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
                    .replace(' ARK_SAVE_DISPOSE', '')
                    .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
            }
        } else {
            addDebugListener()
            var eleAttr = ele.getAttribute("data-ark-attr")
            var eleClassName = ele.className
            if (eleClassName) {
                eleClassName = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
                    .replace(' ARK_SAVE_DISPOSE', '')
                    .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
            }
            if (config.dispose == 1) {
                eleClassName += ' ARK_SAVE_DISPOSE'
            } else if (config.dispose == 2) {
                eleClassName += ' ARK_SAVE_CHANGE_DISPOSE'
            } else {
                eleClassName += ' ARK_SAVE_NO_DISPOSE'
            }
            ele.className = eleClassName
        }
    }
}
export {
    addDebugListener,
    removeDebugListener,
    openDebugBox,
    hiddenDebugEvent,
    delDebugBox
}