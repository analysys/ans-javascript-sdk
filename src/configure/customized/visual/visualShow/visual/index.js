import { setEventTemp } from '../templete/index.js'
import Util from '../../../../../lib/common/index.js'
import { isParent, setIndex, domParentList, parseEvent, boxPosition } from '../common/index.js'
import { checkPrivate } from '../../../../../lib/fillField/index.js'
import { getElementContent } from '../../../heatmap/lib/elementContent.js'
import { sendMsg } from '../common/iframeMsg.js'

import moveBox from '../common/boxMove.js'

function openVisualBox (ele) {
  delClickBox()
  checkChildrenEvent(ele)
  var tagName = ele.tagName
  // var elePosition = boxPosition(ele)
  // var elePath = domParentList(ele)
  // var eleIndex = setIndex(ele, elePath)

  var hash = window.location.hash
  if (hash.indexOf('?') > -1) {
    hash = hash.split('?')[0]
  }
  var config = {
    id: 0,
    url: window.location.protocol + '//' + window.location.host + window.location.pathname + hash,
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
    config.link = elePath
    config.index = eleIndex

  } else {
    if (!ele.className || ele.className.indexOf('ARK_CLICK') < 0) {
      ele.className += ' ARK_CLICK'
    }
  }
  config.url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
  var clickBoxTemp = setEventTemp(config)

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

function isTextAndIsAllEleClick (e) {
  var ele = e.target
  var parentEle = ele.parentNode
  var eleChecked = ele.getAttribute('checked')
  if (eleChecked !== 'checked') {
    parentEle.className += ' v-radio-checked'
    ele.setAttribute('checked', 'checked')
  } else {
    parentEle.className = parentEle.className ? parentEle.className.replace(/ v-radio-checked/g, '') : ''
    ele.removeAttribute('checked')
  }
}

function inputOnblur (e) {
  var ele = e.target
  var nextEle = ele.nextSibling
  var value = ele.value || ''
  var eleId = ele.id

  var status = true
  if (eleId === 'ARK_BOX_EVENT_ID') {
    status = checkPrivate(value, '$track', true)
  } else {
    if (value && value.length > 50) {
      status = false
    }
  }

  if (!status) {
    ele.className += ' error'
    nextEle.style.display = 'block'
  }
}

function inputOnfocus (e) {
  var ele = e.target
  var nextEle = ele.nextSibling
  ele.className = ele.className ? ele.className.replace(/ error/g, '') : ''
  nextEle.style.display = 'none'
}

function initClickBoxActive (ele, config) {
  var saveEle = document.getElementById('ARK_BOX_SAVE')
  var cancelEle = document.getElementById('ARK_BOX_CANCEL')
  var isPageEle = document.getElementById('ARK_BOX_ISPAGE')
  var isTextEle = document.getElementById('ARK_BOX_ISTEXT')
  var eventIDEle = document.getElementById('ARK_BOX_EVENT_ID')
  var eventIdErrorEle = document.getElementById('ARK_BOX_EVENT_ID_ERROR')
  var eventNameEle = document.getElementById('ARK_BOX_EVENT_NAME')
  var eventNameErrorEle = document.getElementById('ARK_BOX_EVENT_NAME_ERROR')
  var headMove = document.getElementById('ARK_BOX_HEADER')

  moveBox.init(headMove)
  isPageEle.onclick = isTextEle.onclick = isTextAndIsAllEleClick
  eventIDEle.focus()
  if (Util.paramType(eventIDEle.createTextRange) !== 'Undefined') {
    var rtextRange = eventIDEle.createTextRange()
    rtextRange.moveStart('character', eventIDEle.value.length)
    rtextRange.collapse(true)
    rtextRange.select()
  } else if (Util.paramType(eventIDEle.selectionStart) !== 'Undefined') {
    eventIDEle.selectionStart = eventIDEle.value.length
  }
  // eventNameEle.onblur = eventIDEle.onblur = inputOnblur
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

    var isAll = isPageEle.getAttribute('checked') === 'checked' ? 0 : 1
    var isText = isTextEle.getAttribute('checked') === 'checked' ? 1 : 0
    config = Util.objMerge(config, {
      appEventId: eventID,
      appEventName: eventName,
      isAll: isAll,
      isText: isText === 1 ? config.content : ''
    })
    var isChange = config.isChange
    delete config.content
    delete config.isChange

    var obj = {
      type: isChange ? 'change_update' : 'change_request',
      payload: {
        path: [config]
      }
    }
    sendMsg(obj)
    delClickBox()
  }
  cancelEle.onclick = delClickBox
}

function delClickBox () {
  var clickBoxElement = document.getElementById('ARK_BOX')
  if (clickBoxElement) {
    var boxParent = clickBoxElement.parentNode || document.body
    boxParent.removeChild(clickBoxElement)
  }

  var arkClickEles = document.getElementsByClassName('ARK_CLICK')
  for (var i = 0; i < arkClickEles.length; i++) {
    arkClickEles[i].className = arkClickEles[i].className.replace(' ARK_CLICK', '')
  }
}

function showEleHover (event) {
  var ele = event.target
  var tagName = ele.tagName
  if (isParent(ele, document.getElementById('ARK_BOX')) || isParent(ele, document.body) || ['body', 'hr', 'br', 'canvas', 'svg', 'use'].indexOf(tagName) > -1 || ele.id === 'ARK_CLICK') {
    clearTimeout(timer)
    timer = null
    return true
  }
  var hoverEles = document.getElementsByClassName('ARK_HOVER')
  for (var i = 0; i < hoverEles.length; i++) {
    if (hoverEles[i].className && hoverEles[i].className.indexOf('ARK_HOVER') > -1) {
      hoverEles[i].className = hoverEles[i].className.replace(' ARK_HOVER', '')
    }
  }
  if (!ele.className || ele.className.indexOf('ARK_') < 0) {
    ele.className += ' ARK_HOVER'
  }
}


function setVisualEvent (ele, config) {
  ele.setAttribute('data-ark-attr', JSON.stringify(config))
  var eleClassName = ele.className
  if (eleClassName) {
    eleClassName = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
      .replace(' ARK_SAVE_DISPOSE', '')
      .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
  }
  if (config.dispose === 1) {
    eleClassName += ' ARK_SAVE_DISPOSE'
  } else if (config.dispose === 2) {
    eleClassName += ' ARK_SAVE_CHANGE_DISPOSE'
  } else {
    eleClassName += ' ARK_SAVE_NO_DISPOSE'
  }
  ele.className = eleClassName
}

function removeVisualEvent (ele) {
  delClickBox()
  ele.removeAttribute('data-ark-attr')
  var eleClassName = ele.className
  if (eleClassName) {
    ele.className = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
      .replace(' ARK_SAVE_DISPOSE', '')
      .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
  }
}
var mouseMoveEle = null
var elePosition = null
var elePath = null
var eleIndex = null
var patt = /\d{13}/g;

function callbackMouseMove () {
  elePosition = boxPosition(mouseMoveEle)
  elePath = domParentList(mouseMoveEle)
  if (patt.test(elePath) === true) {
    elePath = elePath.replace(patt, '')
  }
  eleIndex = setIndex(mouseMoveEle, elePath)

  openVisualBox(mouseMoveEle)
}
function checkChildrenEvent (ele) {
  var eleAttr = ele.getAttribute('data-ark-attr')
  if (!eleAttr && visualEvetnList.length > 0) {
    var list = visualEvetnList
    var childPath = domParentList(ele)
    if (patt.test(childPath) === true) {
      childPath = childPath.replace(patt, '')
    }
    var childIndex = setIndex(ele, childPath)
    for (var i = 0; i < list.length; i++) {
      var path = list[i].link
      if (patt.test(path) === true) {
        path = path.replace(patt, '')
      }
      var index = list[i].index
      var listEle = parseEvent(path)[index]
      if (path === childPath && index === childIndex || (ele === listEle)) {
        setVisualEvent(ele, list[i])
      }
    }
  }

}
function offset (curEle) {
  var totalLeft = null, totalTop = null, par = curEle.offsetParent;
  //首先加自己本身的左偏移和上偏移
  totalLeft += curEle.offsetLeft;
  totalTop += curEle.offsetTop
  //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
  while (par) {
    if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
      //累加父级参照物的边框
      totalLeft += par.clientLeft;
      totalTop += par.clientTop
    }

    //累加父级参照物本身的偏移
    totalLeft += par.offsetLeft;
    totalTop += par.offsetTop
    par = par.offsetParent;
  }

  return {
    left: totalLeft,
    top: totalTop
  }
}
var moveX = 0
var moveY = 0
function mouseMoveEvent (e) {
  var ele = e.target
  var tagName = ele.tagName
  eleDiv = document.getElementById('ARK_CLICK')
  if (eleDiv && (Math.abs(e.clientX - moveX) > 3 || Math.abs(e.clientY - moveY) > 3)) {
    eleDiv.style.display = 'none'
  }
  moveX = e.clientX
  moveY = e.clientY
  if (!tagName || ele.id === 'ARK_CLICK' || isParent(ele, document.getElementById('ARK_BOX')) || ['html', 'body', 'hr', 'br', 'canvas', 'svg', 'use'].indexOf(tagName.toLowerCase()) > -1) {
    return true
  }

  var eleParent = ele.parentNode || document.body
  if (ele !== eleDiv && mouseMoveEle !== ele) {
    mouseMoveEle = ele
    if (eleDiv) {
      var parentEle = eleDiv.parentNode || document.body
      parentEle.removeChild(eleDiv)
    }
    eleDiv = document.createElement('div')
    eleDiv.id = 'ARK_CLICK'
    eleDiv.className = 'ARK_CLICK_ELE'
    var eleOffsetParent = mouseMoveEle.offsetParent || document.body
    var y = offset(mouseMoveEle).top - offset(eleOffsetParent).top
    var x = offset(mouseMoveEle).left - offset(eleOffsetParent).left
    var width = mouseMoveEle.offsetWidth
    var height = mouseMoveEle.offsetHeight
    eleDiv.style.top = y + 'px'
    eleDiv.style.left = x + 'px'
    eleDiv.style.width = width + 'px'
    eleDiv.style.height = height + 'px'
    eleParent.appendChild(eleDiv)
    Util.addEvent(eleDiv, 'click', callbackMouseMove)
    // checkChildrenEvent(mouseMoveEle)
  }

  clearTimeout(timer)
  timer = null
  timer = setTimeout(function () {
    if (!eleDiv) return
    eleDiv.style.display = 'block'
  }, 20)
}
var eleDiv = null
var timer = null

function addVisualListener () {
  delClickBox()
  Util.addEvent(document, 'mousemove', mouseMoveEvent, true)
  Util.addEvent(document, 'mouseover', showEleHover, true)
}

function removeVisualListener () {
  delClickBox()
  Util.removeEvent(document, 'mouseover', showEleHover, true)
  Util.removeEvent(document, 'mousemove', mouseMoveEvent, true)
  var hoverEle = document.getElementById('ARK_CLICK')
  if (hoverEle) {
    var parentEle = hoverEle.parentNode || document.body
    parentEle.removeChild(hoverEle)
  }
  var hoverEles = document.getElementsByClassName('ARK_HOVER')
  for (var i = 0; i < hoverEles.length; i++) {
    if (hoverEles[i].className && hoverEles[i].className.indexOf('ARK_HOVER') > -1) {
      hoverEles[i].className = hoverEles[i].className.replace(' ARK_HOVER', '')
    }
  }
}
var visualEvetnList = []
function showVisualEvent (list) {
  visualEvetnList = list || []
  for (var i = 0; i < list.length; i++) {
    var eleShowPath = list[i].link
    if (patt.test(eleShowPath) === true) {
      eleShowPath = eleShowPath.replace(patt, '')
    }
    var index = list[i].index
    var ele = parseEvent(eleShowPath)[index]
    if (ele) {
      setVisualEvent(ele, list[i])
    }
  }
}

function delVisualEvent (obj) {
  var eleShowPath = obj.link
  var index = obj.index
  var ele = parseEvent(eleShowPath)[index]
  if (ele) {
    removeVisualEvent(ele)
  }
}

function hiddenVisualEvent (status) {
  delClickBox()
  var eleList = Util.selectorAllEleList('[data-ark-attr]') // document.querySelectorAll('[data-ark-attr]')
  if (!status) {
    removeVisualListener()
  } else {
    addVisualListener()
  }
  for (var i = 0; i < eleList.length; i++) {
    var ele = eleList[i]
    if (!status) {
      var eleClassName = ele.className
      if (eleClassName) {
        ele.className = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
          .replace(' ARK_SAVE_DISPOSE', '')
          .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
      }
    } else {
      var eleAttr = ele.getAttribute('data-ark-attr')
      setVisualEvent(ele, JSON.parse(eleAttr))
    }
  }
}

function openVisualEvent (obj) {
  var eleShowPath = obj.link
  var index = obj.index
  var ele = parseEvent(eleShowPath)[index]
  if (ele) {
    elePosition = boxPosition(ele)
    elePath = domParentList(ele)
    eleIndex = setIndex(ele, elePath)
    openVisualBox(ele)
  }
}
export { addVisualListener, removeVisualListener, showVisualEvent, delVisualEvent, hiddenVisualEvent, openVisualEvent }
