import Util from '../../../../lib/common/index.js'
import { getElementContent } from './elementContent.js'
var elePostion = {
    ele: '',
    click_x: 0,
    click_y: 0,
}

function domParentList(ele) {
    var list = []
    var parent = ele
    while (parent != null) {
        var index = 0
        if (parent.parentNode) {
            var clildrenEles = parent.parentNode.children
            if (clildrenEles) {
                for (var i = 0; i < clildrenEles.length; i++) {
                    if (clildrenEles[i] == parent) {
                        index = i
                    }
                }
            }
        }
        var tagName = parent.tagName
        if (!tagName) {
            parent = parent.parentNode
            continue
        }
        tagName = tagName.toLowerCase()
        var parentID = parent.id ? ('#' + parent.id) : ''
        if (parent.classList && parent.classList.length > 0) {
            var classList = ''
            for (var i = 0; i < parent.classList.length; i++) {
                if (parent.classList[i] && parent.classList[i].indexOf('ARK') < 0) {
                    classList += '.' + parent.classList[i]
                }
            }
            list.push(tagName + parentID + classList + '|' + index)

        } else {
            list.push(tagName + parentID + '|' + index)
        }

        parent = parent.parentNode

    }
    return list.join('<')
}

function getPageWidth() {
    return document.documentElement.scrollWidth
}

function getPageHeight() {
    return document.documentElement.scrollHeight
}

function getClickX() {
    return elePostion.click_x
}

function getClickY() {
    return elePostion.click_y
}

function getElementPath() {
    return domParentList(elePostion.ele)
}

function getUrlPath() {
    return location.protocol + '//' + location.host + location.pathname + location.hash
}

function getElementX() {
    return elePostion.elementX
}

function getElementY() {
    return elePostion.elementY
}

function getElementType() {
    return elePostion.ele.tagName.toLowerCase()
}

function getElementClickable() {
    var tagName = getElementType()
    var clickableElementList = ['a', 'button', 'input', 'select', 'textarea', 'svg'] //option无法触发点击事件
    if (clickableElementList.indexOf(tagName) > -1) {
        if (tagName == 'svg' && elePostion.ele.children && elePostion.ele.children.length > 0) {
            var svgIsClickable = 0
            var svgChildren = elePostion.ele.children
            for (var i = 0; i < svgChildren.length; i++) {
                if (svgChildren[i].tagName.toLowerCase() == 'use' &&
                    svgChildren[i].getAttribute("xlink:href")) {
                    svgIsClickable = 1
                }
            }
            return svgIsClickable
        }
        return 1
    }
    return 0
}

function getEleContent() {
    return getElementContent(elePostion.ele)
}

function getDeviceType() {
    return Util.deviceType()
}

function getElementId() {
    return elePostion.ele.id || elePostion.ele.getAttribute('id') || ''
}

function getElementName() {
    return elePostion.ele.getAttribute('name') || ''
}

function getElementClassName() {
    var eleClassName = elePostion.ele.getAttribute("class") || ''
    if (eleClassName) {

        var eleClassList = eleClassName.split(" ")
        var eleClassArray = []
        for (var i = 0; i < eleClassList.length; i++) {
            if (eleClassList[i] != '') {
                eleClassArray.push(eleClassList[i])
            }
        }
        eleClassName = '.' + eleClassArray.join('.')
    }
    return eleClassName
}

function getElementTargetUrl() {
    return elePostion.ele.getAttribute('href') || ''
}
export {
    elePostion,
    getPageWidth,
    getPageHeight,
    getClickX,
    getClickY,
    getElementPath,
    getUrlPath,
    getElementX,
    getElementY,
    getElementType,
    getElementClickable,
    domParentList,
    getEleContent,
    getDeviceType,
    getElementId,
    getElementName,
    getElementClassName,
    getElementTargetUrl
}