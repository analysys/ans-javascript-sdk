import moveBox from './boxMove.js'
import './visual.css'
import Util from '../../../../lib/common/index.js'
import elePostion from '../lib/postion.js'
import msg from './iframeMsg.js'
import './box.css'
import { getShowLog } from './initDebug.js'
import checkRule from '../../../../lib/checkField/index.js'
var win = window
var loc = win.location
var host = loc.protocol + '//' + loc.host
var hash = loc.hash
if (hash.indexOf("?") > -1) {
    hash = hash.split("?")[0]
}
var url = loc.protocol + '//' + loc.host + loc.pathname + hash

var eventHeader = '<div class="ARK_BOX_HEADER mb-20" id="ARK_BOX_HEADER">' +
    '<span class="ARK_BOX_CENTER" id="ARK_BOX_TITLE">创建事件</span>' +
    '<span class="ARK_BOX_CENTER ARK_BOX_SMALL">对选定的页面 UI 元素<span id="ARK_BOX_HEADER_TEXT"></span>进行命名定义</span>' +
    '</div>'

var eventIDBox = '<div class="ARK_BOX_EVENT_ID">' +
    '<span class="title">事件ID：</span>' +
    '<input id="ARK_BOX_EVENT_ID" type="text" placeholder="事件唯一标识，仅支持字母、数字和下划线">' +
    '<span class="ARK_BOX_EVENT_ID_ERROR" id="ARK_BOX_EVENT_ID_ERROR">仅支持字母、数字和下划线,且以字母开头</span>' +
    '</div>' +
    '<div class="ARK_BOX_EVENT_ID">' +
    '<span class="title">事件名称：</span>' +
    '<input id="ARK_BOX_EVENT_NAME" type="text" placeholder="事件显示名称，用于分析时方便查看">' +
    '<span class="ARK_BOX_EVENT_ID_ERROR" id="ARK_BOX_EVENT_NAME_ERROR">建议您命名不超过50个字符,便于阅读</span>' +
    '</div>'

var eventPage = '<div class="ARK_BOX_PAGE mb-15">' +
    '<span class="title">限制条件：</span>' +
    '<div class="boxRadio">' +
    '<label class="mb-8 v-radio-wrapper " for="ARK_BOX_ISPAGE">' +
    '<span class="v-radio-ARK">' +
    '<span class="v-radio-inner"></span> ' +
    '<input type="checkbox" class="v-radio-input" name="ARK_BOX_ISPAGE" id="ARK_BOX_ISPAGE">' +
    '</span>  限制在当前页面<span>（未选中表示应用于所有页面）</span>' +
    '</label>' +
    '<label class="mb-8 v-radio-wrapper " for="ARK_BOX_ISTEXT">' +
    '<span class="v-radio-ARK">' +
    '<span class="v-radio-inner"></span> ' +
    '<input type="checkbox" class="v-radio-input" name="ARK_BOX_ISTEXT" id="ARK_BOX_ISTEXT">' +
    '</span> <span id="isTextValue" class="wbText">无文本</span>' +
    '</label>' +
    '</div>' +
    '</div>'

// var stateBox = '<div class="ARK_BOX_PAGE mb-16">' +
//     '<span class="title">生效版本：</span>' +
//     '<div class="boxRadio" style="display: inline-block;">' +
//     '<label class="v-radio-wrapper " for="ARK_BOX_ISVISION">' +
//     '<span class="v-radio">' +
//     '<span class="v-radio-inner"></span> ' +
//     '<input type="radio" class="v-radio-input" name="ARK_BOX_ISVISION" value="false" id="ARK_BOX_ISVISION">' +
//     '</span> 仅当前版本' +
//     '</label>' +
//     '<label class="v-radio-wrapper " for="ARK_BOX_AllVISION">' +
//     '<span class="v-radio ml-24">' +
//     '<span class="v-radio-inner"></span> ' +
//     '<input type="radio" class="v-radio-input" name="ARK_BOX_AllVISION"  value="true" id="ARK_BOX_AllVISION">' +
//     '</span>  全部版本' +
//     '</label>' +
//     '</div>' +
//     '</div>'

var eventSaveBox = '<div class="ARK_BOX_SAVE">' +
    '<button id="ARK_BOX_CANCEL">取消</button>' +
    '<button id="ARK_BOX_SAVE">确认</button>' +
    '</div>'
var BOX = eventHeader + eventIDBox + eventPage + eventSaveBox

function checkSKey(val) {
    if (checkRule.isString(val) && checkRule.nimLength(val) && checkRule.notSpecialCharacters(val) && checkRule.length99(val)) {
        return {
            code: 200
        }
    }
    return {
        code: 400
    }
}

function initVisual() {
    this.isAll = false;
    this.hasTouch = window.document && window.document.documentElement.ontouchstart !== undefined
    this.eleList = ''
}

// function getAllEle(elem) {
//     var targetName = elem.tagName.toLowerCase()
//     var classList = elem.classList
//     if (classList.length == 0) {
//         return 0
//     }
//     var classValue = "." + classList.value.replace(' ARK_ISCLICK', '').replace(' ARK_BASICS', '').replace(' ARK_HOVER', '').replace(' ARK_SHOW', '').split(" ").join(".")
//     var domList = document.querySelectorAll(classValue);
//     return domList
// }

function setIndex(ele, likeDomList) {

    var link = domParentList(ele)
    var eleObj = parserDom(link)
    if (eleObj.length === 0) {
        return
    }
    var baseEle = eleObj[0]
    var eleList = document.querySelectorAll(baseEle.link)
    var allEleList = []
    for (var i = 0; i < eleList.length; i++) {
        if (domParentList(eleList[i]) === link) {
            allEleList.push(eleList[i])
        }
    }
    for (var i = 0; i < allEleList.length; i++) {
        if (allEleList[i] === ele) {
            return i
        }
    }
    return 0
}

function parserDom(path) {
    var eleList = []
    if (path.indexOf("<") < -1) {
        return eleList
    }
    var pathObj = path.split("<")
    for (var i = 0; i < pathObj.length; i++) {
        var link = pathObj[i].split("#")
        eleList.push({
            link: link[0]
        })
        if (link.length > 1) {
            eleList.push({
                link: '#' + link[1]
            })
        }
    }
    return eleList
}

function parseEvent(obj) {
    var path = obj.link
    var index = obj.index
    var eleObj = parserDom(path)
    if (eleObj.length === 0) {
        return
    }
    var baseEle = eleObj[0]
    var eleList = document.querySelectorAll(baseEle.link)
    var allEleList = []
    for (var i = 0; i < eleList.length; i++) {
        if (domParentList(eleList[i]) === path) {
            allEleList.push(eleList[i])
        }
    }
    eleList = []
    obj.ele = allEleList[index]
    return {
        allEleList: allEleList,
        obj: obj,
        index: index
    }
}

function compare(elePath, likePath) {
    var elePathObj = elePath.split("<")
    var likePathObj = likePath.split("<")
    var likeNum = 0
    var haveLike = false

    if (elePathObj.length === likePathObj.length) {
        for (var i = 0; i < elePathObj.length; i++) {
            if (elePathObj[i] !== likePathObj[i]) {
                likeNum++
            } else {
                haveLike = true
            }
        }

        if (haveLike) {
            return likeNum < 3 ? true : false
        }
    }
    return haveLike
}

function domlike(ele) {
    var link = domParentList(ele)
    var eleObj = parserDom(link)
    if (eleObj.length === 0 || !ele) {
        return []
    }
    var baseEle = eleObj[0]

    var eleTagName = ele.tagName.toLowerCase()
    var baseLink = baseEle.link.replace('#', ',#').replace('.', ',.')
    if (baseLink.replace(eleTagName + ',', '') !== '') {
        baseLink = baseLink.replace(eleTagName + ',', '')
    }
    var eleList = document.querySelectorAll(baseLink)
    var allEleList = []

    for (var i = 0; i < eleList.length; i++) {

        var eleOnceLink = domParentList(eleList[i])


        if (eleList[i] !== ele &&
            eleList[i].tagName === ele.tagName) {
            if (eleOnceLink === link && domChildList(eleList[i]) === domChildList(ele)) {
                allEleList.push(eleList[i])
                continue
            }

            if (compare(link, eleOnceLink) && domChildList(eleList[i]) === domChildList(ele)) {
                allEleList.push(eleList[i])
            }
        }

    }

    return allEleList
};



function domChildPath(ele) {
    var path = ''
    if (!ele) {
        return path
    }
    var tagName = ele.tagName
    if (!tagName) {
        return path
    }
    tagName = tagName.toLowerCase()
    var eleID = ele.id ? ('#' + ele.id) : ''
    if (ele.classList && ele.classList.length > 0) {
        var classList = ''
        for (var i = 0; i < ele.classList.length; i++) {
            if (ele.classList[i].indexOf('ARK') < 0) {
                classList += '.' + ele.classList[i]
            }
        }
        path = tagName + eleID + classList

    } else {
        path = tagName + eleID
    }
    return path
}

function domChildList(ele) {
    var child = ele.childNodes
    var list = []
    var path = []

    for (var i = 0; i < child.length; i++) {
        path.push(domChildPath(child[i]))
    }
    list.push(path.join("&"))

    for (var i = 0; i < child.length; i++) {
        if (child[i].childNodes.length > 0) {
            list.push(domChildList(child[i]))
        }
    }
    return list.join('>')
}

function domParentList(ele) {
    var list = []
    var parent = ele
    var num = 0
    while (parent != null) {

        var tagName = parent.tagName
        if (!tagName) {
            break
        }
        tagName = tagName.toLowerCase()
        var parentID = parent.id ? ('#' + parent.id) : ''
        if (parent.classList && parent.classList.length > 0) {
            var classList = ''
            for (var i = 0; i < parent.classList.length; i++) {
                if (parent.classList[i].indexOf('ARK') < 0) {
                    classList += '.' + parent.classList[i]
                }
            }
            list.push(tagName + parentID + classList)

        } else {
            list.push(tagName + parentID)
        }

        parent = parent.parentNode

    }
    return list.join('<')
}

function addVisualLister() {
    Util.addEvent(document.body, 'mouseover', hoverBox, true)
    Util.addEvent(document.body, 'mouseout', blurBox, true)
    Util.addEvent(document.body, 'click', clickBox, true)
}

function delVisualLister() {
    Util.removeEvent(document.body, 'mouseover', hoverBox, true)
    Util.removeEvent(document.body, 'mouseout', blurBox, true)
    Util.removeEvent(document.body, 'click', clickBox, true)
}

function isParent(obj, parentObj) {
    if (obj.parentNode === parentObj) {
        return true
    }
    while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
}

function clickBox(eventClick) {
    var target = eventClick.target;
    if (target.classList.value.indexOf("ARK_SAVE_") > -1) {
        return true
    }
    if (isParent(target, document.getElementById("ARK_BOX"))) {
        return true
    }
    if (isParent(target, document.body)) {
        return true
    }
    eventClick.preventDefault();
    eventClick.stopPropagation();
    removeEle('ARK_BOX')
    moveBox.remove()
    removeClickBox()
    // removeLikeBox()

    addClickBox(target)
    return false
}

function addClickBox(event) {
    var elem = event
    var parent = addBoxEle(elem, 'ARK_CLICK ARK_ISCLICK', true);
    if (parent) {
        elem.classList.add('ARK_ISCLICK', 'ARK_BASICS')
        // var likeList = domlike(event)
        // showLikeEles(event, likeList)
        box(event)
    }
}

function addSaveclickAttri(ele, name, data) {
    ele.setAttribute(name, data)
}

function getSaveclickAttri(ele, name) {
    return ele.getAttribute(name)
}

function removeSaveclickAttri(ele, name) {
    if (ele && name) {
        ele.removeAttribute(name)
    }
}

function removeSaveBox(ele) {
    removeSaveclickAttri(ele, 'ark_data')
    removeSaveclickAttri(ele, 'ark_id')
    removeSaveClickClass(ele, "ARK_SAVE_DISPOSE")
    removeSaveClickClass(ele, "ARK_SAVE_NO_DISPOSE")
    removeSaveClickClass(ele, "ARK_SAVE_CHANGE_DISPOSE")
}

function addSaveClickBox(event, saveClickObj) {
    var elem = event
    if(!elem){
        return
    }
    removeSaveBox(elem)
    var className = 'ARK_SAVE_NO_DISPOSE'
    if (saveClickObj.dispose === 1) {
        className = 'ARK_SAVE_DISPOSE'
    } else if (saveClickObj.dispose === 2) {
        className = 'ARK_SAVE_CHANGE_DISPOSE'
    } else {
        className = 'ARK_SAVE_NO_DISPOSE'
    }
    addSaveClickClass(elem, className);
    addSaveclickAttri(elem, 'ark_data', 'ARK_ID_' + saveClickObj.id)
    addSaveclickAttri(elem, 'ark_id', saveClickObj.appEventId)
    elem.onclick = setSaveEventClick(elem, saveClickObj)
    // Util.addEvent(elem,'click', setSaveEventClick(elem, saveClickObj))
}

function addSaveClickClass(ele, className) {
    if(ele){
        ele.classList.add(className)
    }
    
}

function removeSaveClickClass(ele, classlist) {
    if (ele) {
        ele.classList.remove(classlist)
    }
}

function removeClickBox() {
    var tempEles = document.getElementsByClassName('ARK_ISCLICK')
    while (tempEles.length !== 0) {
        if (tempEles[0].classList.contains('ARK_CLICK')) {
            var parent = tempEles[0].parentNode
            while ((parent != null) && ['TABLE', 'TR', 'TD', 'TH'].indexOf(parent.tagName) !== -1) {
                parent = parent.parentNode;
            }
            parent.removeChild(tempEles[0])
        } else {
            tempEles[0].classList.remove('ARK_ISCLICK', 'ARK_BASICS')

        }
    }
    return false
}

function removeEle(classList) {
    var tempEles = document.getElementsByClassName(classList)
    while (tempEles.length != 0) {
        var parent = tempEles[0].parentNode
        while ((parent != null) && ['TABLE', 'TR', 'TD', 'TH'].indexOf(parent.tagName) !== -1) {
            parent = parent.parentNode;
        }
        parent.removeChild(tempEles[0])
    }

}

function getStyle(ele) {
    var style = null
    if (window.getComputedStyle) {
        style = window.getComputedStyle(ele, null);
    } else {
        style = ele.currentStyle;
    }
    return style
}

function addBoxEle(elem, classList, blo, callback) {
    var parent = null
    var childNode = null

    if (getStyle(elem).display === "none") {
        elem.classList.add("ARK_SHOW")
    }
    if (parent = elem.parentNode) {
        if (!parent || ['HTML'].indexOf(parent.tagName) !== -1) {
            return false
        }
        while ((parent != null) && ['TABLE', 'TR', 'TD', 'TH'].indexOf(parent.tagName) !== -1) {
            parent = parent.parentNode;
        }
        var position = elePostion.position(elem) || { top: 0, left: 0 };
        var clickDiv = document.createElement('div')
        clickDiv.className = classList
        clickDiv.style.width = elePostion.width(elem) + 'px';
        clickDiv.style.height = elePostion.height(elem) + 'px';
        clickDiv.style.top = position.top + 'px';
        clickDiv.style.left = position.left + 'px';
        clickDiv.style.display = blo ? 'block' : 'none'
        clickDiv.style.position = 'absolute';
        clickDiv.onclick = callback ? callback : removeClickBox
        if (parent) {
            parent.appendChild(clickDiv);
            return parent
        } else {
            return false
        }
    }
    return false
}



function blurBox(event) {
    var target = event.target;
    if (target.classList.value.indexOf("ARK_HOVER") < 0) {
        return true
    }
    target.classList.remove('ARK_HOVER')
    var tempEles = document.getElementsByClassName('ARK_HOVER')
    while (tempEles.length != 0) {
        var ele = tempEles[0]
        ele.classList.remove('ARK_HOVER')
    }
    return true
}

function hoverBox(event) {
    var target = event.target;

    if (isParent(target, document.getElementById("ARK_BOX"))) {
        return true
    }
    if (isParent(target, document.body)) {
        return true
    }
    if (target.classList.value.indexOf("ARK_SAVE_") > -1) {
        return true
    }
    var tagName = target.tagName.toLowerCase();
    if (['body', 'hr', 'br', 'canvas'].indexOf(tagName) !== -1) {
        return;
    }
    if (['I', 'SPAN'].indexOf(target.tagName) !== -1 && target.parentNode && ['A', 'BUTTON'].indexOf(target.parentNode.tagName) !== -1) {
        target = target.parentNode;
    }
    target.classList.add('ARK_HOVER')
    return true
}

function postVisualMsg(msgObj) {
    msg.postMsg(msgObj)
}

function box(event, saveClickObj) {
    var elem = event
    var position = elePostion.boxPosition(elem)
    var clickBOX = document.createElement('div')
    clickBOX.id = 'ARK_BOX'
    clickBOX.className = 'ARK_BOX'
    clickBOX.style.top = position.top + 'px';
    clickBOX.style.left = position.left + 'px';
    clickBOX.style.position = 'absolute';
    clickBOX.innerHTML = BOX
    clickBOX.onclick = function(e) {
        e.stopPropagation();
    }
    document.body.appendChild(clickBOX)

    setBoxMsg(elem, saveClickObj)
}

// function delDom(parent, childs, className) {
//     var delDoms = []

//     for (var i = 0; i < childs.length; i++) {
//         if (childs[i].classList && childs[i].classList.value.indexOf(className) > -1) {
//             delDoms.push(childs[i])
//         }
//     }
//     while (delDoms[0]) {
//         parent.removeChild(delDoms[0])
//         delete delDoms[0]
//     }

// }

function setBoxMsg(elem, saveClickObj) {
    // removeHove()
    var headerEle = document.getElementById("ARK_BOX_HEADER")
    var headerEleText = document.getElementById("ARK_BOX_HEADER_TEXT")
    var eventIdEle = document.getElementById("ARK_BOX_EVENT_ID")
    var eventNameEle = document.getElementById("ARK_BOX_EVENT_NAME")
    var seveEle = document.getElementById("ARK_BOX_SAVE")
    var cancleEle = document.getElementById("ARK_BOX_CANCEL")
    var isPageEle = document.getElementById("ARK_BOX_ISPAGE")
    var isTextEle = document.getElementById("ARK_BOX_ISTEXT")
    var isTextValueEle = document.getElementById("isTextValue")
    // var isVisionEle = document.getElementById("ARK_BOX_ISVISION")
    // var allVisionEle = document.getElementById("ARK_BOX_AllVISION")
    var eventIdErrorEle = document.getElementById("ARK_BOX_EVENT_ID_ERROR")
    var eventNameErrorEle = document.getElementById("ARK_BOX_EVENT_NAME_ERROR")

    var titleEle = document.getElementById("ARK_BOX_TITLE")
    var saveType = true
    var dispose = 0

    titleEle.textContent = "创建事件"
    eventIdErrorEle.style.display = "none"
    eventNameErrorEle.style.display = "none"
    headerEleText.textContent = ' ' + elem.tagName + ' '
    var likeList = domlike(elem)
    var eleIndex = setIndex(elem, likeList)
    moveBox.init(headerEle)
    isPageEle.checked = true
    isPageEle.parentNode.classList.add('v-radio-checked')
    isTextEle.checked = false
    isTextEle.parentNode.classList.remove('v-radio-checked')
    var text = elePostion.content(elem)
    isTextEle.parentNode.parentNode.style.visibility = "hidden"
    if (text === '') {
        text = '无文本'
        isTextEle.parentNode.classList.add('v-radio-wrapper-disabled')
        isTextEle.parentNode.parentNode.classList.add('v-radio-wrapper-disabled')
        isTextEle.disabled = true
    } else if (text.length > 20) {
        text = '文本过长'
        isTextEle.parentNode.classList.add('v-radio-wrapper-disabled')
        isTextEle.parentNode.parentNode.classList.add('v-radio-wrapper-disabled')
        isTextEle.disabled = true
    } else {
        text = text
        isTextEle.parentNode.classList.remove('v-radio-wrapper-disabled')
        isTextEle.parentNode.childNodes[0].classList.remove('v-radio-wrapper-disabled')
        isTextEle.disabled = false
        isTextEle.parentNode.parentNode.style.visibility = "visible"
        isTextValueEle.textContent = '限制在文本： ' + ((text && text.length > 10) ? text.substring(0, 10) + '...' : text)
        isTextValueEle.title = text
    }

    // isVisionEle.checked = true
    // isVisionEle.parentNode.classList.add('v-radio-checked')
    // allVisionEle.checked = false
    // allVisionEle.parentNode.classList.remove('v-radio-checked')
    if (saveClickObj) {
        titleEle.textContent = "编辑事件"
        eventIdEle.value = saveClickObj.appEventId || ''
        eventNameEle.value = saveClickObj.appEventName || ''
        eleIndex = saveClickObj.index
        if (saveClickObj.isAll === 1 || saveClickObj.isAll === "1") {
            isPageEle.checked = false
            isPageEle.parentNode.classList.remove('v-radio-checked')
        }
        if (saveClickObj.isText && (saveClickObj.isText !== 0 || saveClickObj.isText !== "")) {
            isTextEle.checked = true
            text = saveClickObj.isText
            isTextEle.parentNode.classList.remove('v-radio-wrapper-disabled')
            isTextEle.parentNode.childNodes[0].classList.remove('v-radio-wrapper-disabled')
            isTextEle.parentNode.classList.add('v-radio-checked')
            isTextEle.disabled = false
            isTextValueEle.textContent = '限制在文本： ' + ((text && text.length > 10) ? text.substring(0, 10) + '...' : text)
            isTextValueEle.title = text
        }
        // if (saveClickObj.allVersion === 1 || saveClickObj.allVersion === "1") {
        //     isVisionEle.checked = false
        //     isVisionEle.parentNode.classList.remove('v-radio-checked')
        //     allVisionEle.checked = true
        //     allVisionEle.parentNode.classList.add('v-radio-checked')
        // }
        if (saveClickObj.dispose) {
            dispose = saveClickObj.dispose
        }
    }

    var isPageType = isPageEle.checked
    isPageEle.onclick = function(event) {
        var clickEle = event.target
        var getFirst = clickEle.parentNode

        if (!isPageType) {
            getFirst.classList.add('v-radio-checked')
            isPageEle.checked = isPageType = true
        } else {
            getFirst.classList.remove('v-radio-checked')
            isPageEle.checked = isPageType = false
        }
    }

    var isTextType = isTextEle.checked
    isTextEle.onclick = function(event) {
        var clickEle = event.target
        var getFirst = clickEle.parentNode

        if (!isTextType) {
            getFirst.classList.add('v-radio-checked')
            isTextEle.checked = isTextType = true
        } else {
            getFirst.classList.remove('v-radio-checked')
            isTextEle.checked = isTextType = false
        }
    }

    // var isVisionType = isVisionEle.checked
    // var allVisionType = allVisionEle.checked

    // isVisionEle.onclick = function(event) {
    //     var clickEle = event.target
    //     var getFirst = clickEle.parentNode

    //     if (!isVisionType) {
    //         getFirst.classList.add('v-radio-checked')
    //         allVisionEle.parentNode.classList.remove('v-radio-checked')
    //         isVisionEle.checked = isVisionType = true
    //         allVisionEle.checked = allVisionType = false
    //     }
    // }
    // allVisionEle.onclick = function(event) {
    //     var clickEle = event.target
    //     var getFirst = clickEle.parentNode

    //     if (!allVisionType) {
    //         getFirst.classList.add('v-radio-checked')
    //         isVisionEle.parentNode.classList.remove('v-radio-checked')
    //         allVisionEle.checked = allVisionType = true
    //         isVisionEle.checked = isVisionType = false
    //     }
    // }

    seveEle.onclick = function() {
        var eventId = eventIdEle.value
        var eventName = eventNameEle.value
        var errorName = checkSKey(eventId)

        if (errorName.code === 400) {
            eventIdEle.classList.add("error");
            eventIdErrorEle.style.display = "block"
            saveType = false
        } else {
            eventIdEle.classList.remove("error");
            eventIdErrorEle.style.display = "none"
            saveType = true
        }
        if (eventName && eventName.length > 50) {
            eventNameEle.classList.add("error");
            eventNameErrorEle.style.display = "block"
            saveType = false
        } else {
            eventNameEle.classList.remove("error");
            eventNameErrorEle.style.display = "none"
        }
        if (!eventId || !saveType) {
            return
        }
        var eventAll = isPageType === false ? 1 : 0
        var url = loc.protocol + '//' + loc.host + loc.pathname + hash
        var obj = {
            "type": saveClickObj ? "change_update" : "change_request",
            "payload": {
                path: [{
                    "link": domParentList(elem),
                    "appEventId": eventId,
                    "url": saveClickObj ? (saveClickObj.url || url) : url,
                    "isAll": eventAll,
                    "index": eleIndex,
                    "isText": isTextType === true ? text : '',
                    "appEventName": eventName,
                    "allVersion": 0,
                    "dispose": saveClickObj ? (saveClickObj.dispose || 0) : 0,
                    "id": saveClickObj ? saveClickObj.id : 0
                }]
            }
        }
        postVisualMsg(obj)
        removeClickBox()
        removeEle("ARK_BOX")
        moveBox.remove()

    }
    cancleEle.onclick = function() {
        removeEle("ARK_BOX")
        moveBox.remove()
        removeClickBox()
        var obj = {
            "type": "change_cancel",

        }
        postVisualMsg(obj)
    }
    eventNameEle.onblur = function() {
        var value = this.value
        if (value && value.length > 50) {
            eventNameEle.classList.add("error");
            eventNameErrorEle.style.display = "block"
            saveType = false
            return
        }
        eventNameEle.classList.remove("error");
        eventNameErrorEle.style.display = "none"
        saveType = true
    }
    eventNameEle.onfocus = function() {
        eventNameEle.classList.remove("error");
        eventNameErrorEle.style.display = "none"
        saveType = true
    }
    eventIdEle.onblur = function() {
        var value = this.value
        var errorName = checkSKey(value)
        if (errorName.code === 400) {
            eventIdEle.classList.add("error");
            eventIdErrorEle.style.display = "block"
            saveType = false
            return
        }
        eventIdEle.classList.remove("error");
        eventIdErrorEle.style.display = "none"
        saveType = true
    }
    eventIdEle.onfocus = function() {
        eventIdEle.classList.remove("error");
        eventIdErrorEle.style.display = "none"
        saveType = true
    }
}

function setSaveEventClick(ele, obj) {
    return function(e) {
        //js阻止事件冒泡
        e.cancelBubble = true;
        e.stopPropagation();

        //js阻止链接默认行为，没有停止冒泡
        e.preventDefault();
        e.returnValue = false;
        if (getShowLog()) return
        delete obj.ele
        var url =loc.protocol + '//' + loc.host + loc.pathname + hash
        if (url !== obj.url) {
            msg.postMsg({
                type: "change_page",
                code: 200,
                msg: "跳转埋点页面",
                path: [obj],
                url: obj.url
            })
            return
        }
        msg.postMsg({
            type: "start_update",
            code: 200,
            msg: "开始编辑已埋元素"
        })
        removeEle("ARK_BOX")
        moveBox.remove()
        // addBoxEle(ele, 'ARK_CLICK ARK_ISCLICK', true);
        box(ele, obj)
        return false;

    }
}

function saveEventBlur(event) {
    var saveEventBOX = document.getElementById("ARK_EVENT_LIST")

    if (isParent(event.target, saveEventBOX) && event.target !== saveEventBOX) {
        return false
    }
    saveEventBOX.style.display = "none"
}


function changeEvent(ele, saveClickObj) {
    var likeList = domlike(ele)
    removeSaveBox(ele, saveClickObj.id)
    removeEle("ARK_BOX")
    moveBox.remove()
    addSaveClickBox(ele, saveClickObj)
};

function upEvent(ele, saveClickObj) {
    removeEle("ARK_DEBUG_BOX")
    changeEvent(ele, saveClickObj)
    removeEle("ARK_BOX")
    moveBox.remove()
    addBoxEle(ele, 'ARK_CLICK ARK_ISCLICK', true);
    box(ele, saveClickObj)
}
initVisual.prototype.changeEvent = upEvent
initVisual.prototype.addClickBox = function(ele, saveClickObj) {
    if (!ele) return
    removeEle("ARK_DEBUG_BOX")
    addSaveClickBox(ele, saveClickObj)
};
initVisual.prototype.delClickBox = function(ele, saveClickObj) {
    removeSaveBox(ele, saveClickObj.id)
};

initVisual.prototype.likeList = function(ele) {
    return domlike(ele)
}
initVisual.prototype.init = function() {
    addVisualLister()
};
initVisual.prototype.delclickLister = function() {
    removeEle("ARK_BOX")
    moveBox.remove()
    delVisualLister()
}
initVisual.prototype.parseEvent = parseEvent
initVisual.prototype.changeEventSuccess = changeEvent
initVisual.prototype.clearEvent = function() {
    removeEle("ARK_BOX")
    moveBox.remove()
}
initVisual.prototype.highlight = function(type) {
    var noDisEleList = document.getElementsByClassName('ARK_SAVE_NO_DISPOSE')
    var disEleList = document.getElementsByClassName('ARK_SAVE_DISPOSE')
    var disChangeEleList = document.getElementsByClassName('ARK_SAVE_CHANGE_DISPOSE')
    for (var i = 0; i < noDisEleList.length; i++) {
        if (type === true) {
            noDisEleList[i].classList.remove("ARK_NO_LIGHT")
        }
        if (type === false) {
            noDisEleList[i].classList.add("ARK_NO_LIGHT")
        }
    }
    for (var i = 0; i < disEleList.length; i++) {
        if (type === true) {
            disEleList[i].classList.remove("ARK_NO_LIGHT")
        }
        if (type === false) {
            disEleList[i].classList.add("ARK_NO_LIGHT")
        }
    }
    for (var i = 0; i < disChangeEleList.length; i++) {
        if (type === true) {
            disChangeEleList[i].classList.remove("ARK_NO_LIGHT")
        }
        if (type === false) {
            disChangeEleList[i].classList.add("ARK_NO_LIGHT")
        }
    }
}
export default new initVisual()