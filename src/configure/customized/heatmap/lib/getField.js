import Util from '../../../../lib/common/index.js'
import { getElementContent } from './elementContent.js'
import baseConfig from '../../../../lib/baseConfig/index.js'
var elePostion = {
  ele: '',
  click_x: 0,
  click_y: 0,
  clickEle: ''
}

function domParentList (ele) {
  var list = []
  var parent = ele
  while (parent != null) {
    var index = 0
    if (parent.parentNode) {
      var clildrenEles = parent.parentNode.children
      if (clildrenEles) {
        for (var i = 0; i < clildrenEles.length; i++) {
          if (clildrenEles[i] === parent) {
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
    var eleClassNameList = parent.className && Util.paramType(parent.className) === 'String' ? parent.className.split(' ') : []

    if (eleClassNameList.length > 0) {
      var eleClassName = ''
      for (var y = 0; y < eleClassNameList.length; y++) {
        if (eleClassNameList[y] && eleClassNameList[y].indexOf('ARK') < 0) {
          eleClassName += '.' + eleClassNameList[y]
        }
      }
      list.push(tagName + parentID + eleClassName + '|' + index)
    } else {
      list.push(tagName + parentID + '|' + index)
    }

    parent = parent.parentNode
  }
  return list.join('<')
}

function getPageWidth () {
  return document.documentElement.scrollWidth
}

function getPageHeight () {
  return document.documentElement.scrollHeight
}

function getClickX () {
  return elePostion.click_x
}

function getClickY () {
  return elePostion.click_y
}

function getElementPath () {
  return domParentList(elePostion.ele)
}

function getUrlPath () {
  var url = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.hash
  try {
    url = decodeURIComponent(url)
  } catch (e) { }
  if (baseConfig.base.isHybrid === true) {
    url = url.replace(/"/g, '\\"')
  }
  return url
}

function getElementX () {
  return elePostion.elementX
}

function getElementY () {
  return elePostion.elementY
}

function getElementType () {
  return elePostion.ele.tagName.toLowerCase()
}

function getElementClick () {
  return Util.paramType(elePostion.ele.onclick) === 'Function'
}
function getElementAttrClick () {
  return elePostion.ele && elePostion.ele.getAttribute('data-ark-click') !== null
}

function checkElementConfig (eleConfig) {
  if (!eleConfig || (Util.paramType(eleConfig) === 'Array' && eleConfig.length === 0) || (Util.paramType(eleConfig) === 'String' && eleConfig === '')) {
    return false
  }
  var ele = elePostion.ele
  if (Util.paramType(eleConfig) === 'String') {
    var tagName = ele.tagName.toLowerCase()
    var className = Util.paramType(ele.className) === 'String' ? '.' + ele.className.split(' ').join('.') : ''
    var id = ele.id ? '#' + ele.id : ''
    if (tagName === eleConfig.toLowerCase() || className === eleConfig || id === eleConfig || tagName + className === eleConfig || tagName + id === eleConfig || id + className === eleConfig || tagName + id + className === eleConfig) {
      return true
    }
  } else if (Util.paramType(eleConfig) === 'Array') {
    for (var i = 0; i < eleConfig.length; i++) {
      if (checkElementConfig(eleConfig[i]) === true) {
        return true
      }
    }
  } else if (Util.paramType(eleConfig) === 'Function') {
    return eleConfig.call(eleConfig, ele) || false
  } else if (typeof eleConfig === 'object' && eleConfig === ele) {
    return true
  }
  return false
}
function getParentClickableElement () {
  var clickEle = elePostion.ele
  while (elePostion.ele != null) {
    if (elePostion.ele.nodeType !== 1) {
      elePostion.ele = elePostion.ele.parentNode
      continue
    }

    if (getElementClick() || getElementClickable() === 1 || getElementAttrClick() || checkElementConfig(baseConfig.base.trackList)) {
      clickEle = elePostion.ele
      break
    }
    elePostion.ele = elePostion.ele.parentNode
  }
  elePostion.ele = clickEle
}
/**
 * 判断当前元素是否为可触控元素
 */
function getElementClickable () {
  var tagName = getElementType()
  var clickableElementList = ['a', 'button', 'input', 'select', 'textarea', 'svg'] // option无法触发点击事件
  if (clickableElementList.indexOf(tagName) > -1 || getElementAttrClick() || checkElementConfig(baseConfig.base.trackList)) {
    if (tagName === 'svg' && elePostion.ele.children && elePostion.ele.children.length > 0) {
      var svgIsClickable = 0
      var svgChildren = elePostion.ele.children
      for (var i = 0; i < svgChildren.length; i++) {
        if (svgChildren[i].tagName.toLowerCase() === 'use' &&
          (svgChildren[i].getAttribute('xlink:href') || getElementAttrClick() || checkElementConfig(baseConfig.base.trackList))) {
          svgIsClickable = 1
        }
      }
      return svgIsClickable
    }
    return 1
  }
  return 0
}

function getEleContent () {
  return getElementContent(elePostion.ele)
}

function getDeviceType () {
  return Util.deviceType()
}

function getElementId () {
  return elePostion.ele.id || elePostion.ele.getAttribute('id') || ''
}

function getElementName () {
  return elePostion.ele.getAttribute('name') || ''
}

function getElementClassName () {
  var eleClassName = elePostion.ele.getAttribute('class') || ''
  if (eleClassName) {
    var eleClassList = eleClassName.split(' ')
    var eleClassArray = []
    for (var i = 0; i < eleClassList.length; i++) {
      if (eleClassList[i] !== '') {
        eleClassArray.push(eleClassList[i])
      }
    }
    eleClassName = '.' + eleClassArray.join('.')
    return eleClassName
  }
  return ''
}

function getElementTargetUrl () {
  var href = elePostion.ele.getAttribute('href')
  if (href && href.indexOf('javascript:') < 0) {
    try {
      href = decodeURIComponent(href)
    } catch (e) { }
    if (baseConfig.base.isHybrid === true) {
      href = href.replace(/"/g, '\\"')
    }
    return href
  }
  return ''
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
  getParentClickableElement,
  domParentList,
  getEleContent,
  getDeviceType,
  getElementId,
  getElementName,
  getElementClassName,
  getElementTargetUrl
}
