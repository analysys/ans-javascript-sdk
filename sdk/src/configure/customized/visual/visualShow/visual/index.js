import {
    setEventTemp
} from '../templete/index.js'
import Storage from '../../../../../lib/storage/index.js'
import Util from '../../../../../lib/common/index.js'
import {
    isParent,
    setIndex,
    domParentList,
    parseEvent,
    boxPosition
} from '../common/index.js'
import {
    checkPrivate
} from '../../../../../lib/fillField/index.js'
import {
    getElementContent
} from '../../../heatmap/lib/elementContent.js'
import {
    sendMsg
} from '../common/iframeMsg.js'

import moveBox from '../common/boxMove.js'

function openVisualBox(event) {
    delClickBox()
    var ele = event.target
    var tagName = ele.tagName
    var elePosition = boxPosition(ele)
    var elePath = domParentList(ele)
    var eleIndex = setIndex(ele)
    if (elePath.indexOf('|') > -1) {
        var pathList = elePath.split('<')
        var pathArray = []
        for (var i = 0; i < pathList.length; i++) {
            pathArray.push(pathList[i].split('|')[0])
        }
        elePath = pathArray.join("<")
    }
    var hash = location.hash
    if (hash.indexOf("?") > -1) {
        hash = hash.split("?")[0]
    }
    var config = {
        id: 0,
        url: location.protocol + '//' + location.host + location.pathname + hash,
        tagName: tagName,
        appEventId: '',
        appEventName: '',
        isAll: 0,
        allVersion: 0,
        dispose: 0,
        isText: '',
        link: elePath,
        index: eleIndex,
        content: getElementContent(ele),
        isChange: false
    }
    var eventAttri = ele.getAttribute('data-ark-attr')
    if (eventAttri) {
        config = Util.objMerge(config, JSON.parse(eventAttri))
        config.isChange = true
    }
    var clickBoxTemp = setEventTemp(config)

    var parent = ele.parentNode || document.body
    var eleDiv = document.createElement('div')
    eleDiv.style.top = elePosition.top + 'px'
    eleDiv.style.left = elePosition.left + 'px'
    eleDiv.className = 'ARK_BOX'
    eleDiv.id = 'ARK_BOX'
    eleDiv.style.position = 'absolute'
    eleDiv.innerHTML = clickBoxTemp
    document.body.appendChild(eleDiv)

    initClickBoxActive(eleDiv, config)
}

function isTextAndIsAllEleClick(e) {
    var ele = e.target
    var parentEle = ele.parentNode
    var eleChecked = ele.getAttribute("checked")
    if (eleChecked !== 'checked') {
        parentEle.className += ' v-radio-checked'
        ele.setAttribute("checked", "checked")
    } else {
        parentEle.className = parentEle.className ? parentEle.className.replace(/ v-radio-checked/g, '') : ''
        ele.removeAttribute("checked")
    }
}

function inputOnblur(e) {
    var ele = e.target
    var nextEle = ele.nextSibling
    var value = ele.value || ''
    var eleId = ele.id

    var status = true
    if (eleId == 'ARK_BOX_EVENT_ID') {
        status = checkPrivate(value, '$track', true)
    } else {
        if (value && value.length > 50) {
            status = false
        }
    }

    if (!status) {
        ele.className += ' error'
        nextEle.style.display = "block"
    }

}

function inputOnfocus(e) {
    var ele = e.target
    var nextEle = ele.nextSibling
    ele.className = ele.className ? ele.className.replace(/ error/g, '') : ''
    nextEle.style.display = "none"
}

function initClickBoxActive(ele, config) {
    var saveEle = document.getElementById("ARK_BOX_SAVE")
    var cancelEle = document.getElementById("ARK_BOX_CANCEL")
    var isPageEle = document.getElementById("ARK_BOX_ISPAGE")
    var isTextEle = document.getElementById("ARK_BOX_ISTEXT")
    var eventIDEle = document.getElementById("ARK_BOX_EVENT_ID")
    var eventIdErrorEle = document.getElementById("ARK_BOX_EVENT_ID_ERROR")
    var eventNameEle = document.getElementById("ARK_BOX_EVENT_NAME")
    var eventNameErrorEle = document.getElementById("ARK_BOX_EVENT_NAME_ERROR")
    var headMove = document.getElementById("ARK_BOX_HEADER")

    moveBox.init(headMove)
    isPageEle.onclick = isTextEle.onclick = isTextAndIsAllEleClick
    eventNameEle.onblur = eventIDEle.onblur = inputOnblur
    eventNameEle.onfocus = eventIDEle.onfocus = inputOnfocus

    saveEle.onclick = function () {
        inputOnblur({
            target: eventIDEle
        })
        if ((eventIdErrorEle.style.display && eventIdErrorEle.style.display !== 'none') ||
            (eventNameErrorEle.style.display && eventNameErrorEle.style.display !== 'none')) {
            return
        }

        var eventName = eventNameEle.value || ''
        var eventID = eventIDEle.value || ''

        var isAll = isPageEle.getAttribute("checked") == 'checked' ? 0 : 1
        var isText = isTextEle.getAttribute("checked") == 'checked' ? 1 : 0
        config = Util.objMerge(config, {
            appEventId: eventID,
            appEventName: eventName,
            isAll: isAll,
            isText: isText == 1 ? config.content : ''
        })
        var isChange = config.isChange
        delete config.content
        delete config.isChange

        var obj = {
            "type": isChange ? "change_update" : "change_request",
            "payload": {
                path: [config]
            }
        }
        sendMsg(obj)
        delClickBox()
    }
    cancelEle.onclick = delClickBox
}

function delClickBox() {
    var clickBoxElement = document.getElementById("ARK_BOX")
    if (clickBoxElement) {
        var boxParent = clickBoxElement.parentNode || document.body
        boxParent.removeChild(clickBoxElement)
    }
}

function showEleHover(event) {
    var ele = event.target
    var tagName = ele.tagName
    if (isParent(ele, document.getElementById("ARK_BOX")) || isParent(ele, document.body) || ['body', 'hr', 'br', 'canvas', 'svg', 'use'].indexOf(tagName) > -1) {
        return true
    }
    if (!ele.className || ele.className.indexOf('ARK_') < 0) {
        ele.className += ' ARK_HOVER'
    }
    if (ele.onclick) {
        var userClick = ele.onclick
        ele._user_click = userClick
    }
    ele.onclick = function (e) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        event.preventDefault();
        openVisualBox(e)
        return false
    }

    // Util.addEvent(ele, 'click', openVisualBox)
    Util.addEvent(ele, 'mouseout', showEleoOut)
}

function showEleoOut(event) {
    var ele = event.target
    if (ele.className && ele.className.indexOf(' ARK_HOVER') > -1) {
        ele.className = ele.className.replace(' ARK_HOVER', '')
    }
    ele.onclick = null
    if (ele._user_click) {
        var userClick = ele._user_click
        ele.onclick = userClick
    }
    ele._user_click = null
    Util.removeEvent(ele, 'mouseout', showEleoOut)
}

function setVisualEvent(ele, config) {
    ele.setAttribute('data-ark-attr', JSON.stringify(config))
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

function removeVisualEvent(ele) {
    delClickBox()
    ele.removeAttribute('data-ark-attr')
    var eleClassName = ele.className
    if (eleClassName) {
        ele.className = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
            .replace(' ARK_SAVE_DISPOSE', '')
            .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
    }
}

function addVisualListener() {
    delClickBox()
    Util.addEvent(document, 'mouseover', showEleHover)
    // Util.addEvent(document, 'click', openVisualBox)
}

function removeVisualListener() {
    delClickBox()
    Util.removeEvent(document, 'mouseover', showEleHover)
}

function showVisualEvent(list) {
    for (var i = 0; i < list.length; i++) {
        var elePath = list[i].link
        var index = list[i].index
        var ele = parseEvent(elePath)[index]
        if (ele) {
            setVisualEvent(ele, list[i])
        }
    }
}

function delVisualEvent(obj) {
    var elePath = obj.link
    var index = obj.index
    var ele = parseEvent(elePath)[index]
    if (ele) {
        removeVisualEvent(ele)
    }
}

function hiddenVisualEvent(status) {
    delClickBox()
    var eleList = document.querySelectorAll("[data-ark-attr]")
    for (var i = 0; i < eleList.length; i++) {
        var ele = eleList[i]
        if (!status) {
            removeVisualListener()
            var eleClassName = ele.className
            if (eleClassName) {
                ele.className = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
                    .replace(' ARK_SAVE_DISPOSE', '')
                    .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
            }
        } else {
            addVisualListener()
            var eleAttr = ele.getAttribute("data-ark-attr")
            setVisualEvent(ele, JSON.parse(eleAttr))
        }
    }

}

function openVisualEvent(obj) {
    var elePath = obj.link
    var index = obj.index
    var ele = parseEvent(elePath)[index]
    if (ele) {
        openVisualBox({
            target: ele
        })
    }
}
export {
    addVisualListener,
    removeVisualListener,
    showVisualEvent,
    delVisualEvent,
    hiddenVisualEvent,
    openVisualEvent
}