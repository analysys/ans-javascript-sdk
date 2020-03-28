import Util from '../../../../../lib/common/index.js'
import { isParent, boxPosition } from '../common/index.js'
import { setDebugTemp } from '../templete/debug.js'
import { sendMsg } from '../common/iframeMsg.js'
import { getLibVersion } from '../../../../../lib/fillField/getField.js'
import { os, osVersion, browser, browserVersion } from '../../../parseUA/lib/UA.js'
/**
 * @param  {Object} obj 触发debug框的元素信息表
 */
function openDebugBox (obj) {
  delDebugBox()
  var ele = debugELe
  /**
     * 当前元素如无埋点信息 则不显示debug框
     */
  if (!ele.getAttribute('data-ark-attr')) {
    return
  }

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
function delDebugBox () {
  var ele = document.getElementById('ARK_DEBUG_BOX')
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
function sendDebugMsg (ele) {
  var eventConfig = ele.getAttribute('data-ark-attr')
  if (!eventConfig) return
  debugELe = ele
  var eventId = JSON.parse(eventConfig).appEventId
  var hash = window.location.hash
  if (hash.indexOf('?') > -1) {
    hash = hash.split('?')[0]
  }
  var url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
  var config = {
    event_info: {
      $event_id: eventId,
      $os: os,
      $os_version: osVersion,
      $browser: browser,
      $browser_version: browserVersion,
      $lib_version: getLibVersion,
      $screen_width: window.screen.width,
      $screen_height: window.screen.height
    },
    type: 'debug',
    target_page: url
  }
  sendMsg(config)
}

function setDebugHover (event) {
  var ele = event.target
  var tagName = ele.tagName
  if (isParent(ele, document.getElementById('ARK_DEBUG_BOX')) || isParent(ele, document.body) || ['body', 'hr', 'br', 'canvas', 'svg', 'use'].indexOf(tagName) > -1 || ele.id === 'ARK_CLICK') {
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
  // if (ele.onclick) {
  //   var userClick = ele.onclick
  //   ele._user_click = userClick
  // }
  // ele.onclick = function (e) {
  //   e = e || window.event
  //   e.cancelBubble = true
  //   e.stopPropagation()
  //   e.preventDefault()
  //   sendDebugMsg(e)
  //   return false
  // }
  // Util.addEvent(ele, 'mouseout', removeDebugHover)
  // Util.addEvent(ele, 'click', actionClick, true)
}
// function actionClick (e) {
//   e = e || window.event
//   e.cancelBubble = true
//   e.stopPropagation()
//   e.preventDefault()
//   sendDebugMsg(e)
//   return false
// }
// function removeDebugHover (event) {
//   var ele = event.target
//   // ele.onclick = null
//   // if (ele._user_click) {
//   //   var userClick = ele._user_click
//   //   ele.onclick = userClick
//   // }
//   // ele._user_click = null
//   Util.removeEvent(ele, 'mouseout', removeDebugHover)
//   Util.removeEvent(ele, 'click', actionClick, true)
// }
var mouseMoveEle = null
var elePosition = null
var elePath = null
var patt = /\d{13}/g;
function callbackMouseMove () {
  elePosition = boxPosition(mouseMoveEle, 'debug')
  if (patt.test(elePath) === true) {
    elePath = elePath.replace(patt, '')
  }
  sendDebugMsg(mouseMoveEle)
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
  if (!tagName || ele.id === 'ARK_CLICK' || isParent(ele, document.getElementById('ARK_DEBUG_BOX')) || ['html', 'body', 'hr', 'br', 'canvas', 'svg', 'use'].indexOf(tagName.toLowerCase()) > -1) {
    clearTimeout(timer)
    timer = null
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
function addDebugListener () {
  delDebugBox()
  Util.addEvent(document, 'mousemove', mouseMoveEvent)
  Util.addEvent(document, 'mouseover', setDebugHover)
  // Util.addEvent(document, 'mouseover', removeDebugHover)
}

function removeDebugListener () {
  delDebugBox()
  Util.removeEvent(document, 'mouseover', setDebugHover)
  Util.removeEvent(document, 'mousemove', mouseMoveEvent)
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

function hiddenDebugEvent (status) {
  delDebugBox()
  var eleList = Util.selectorAllEleList('[data-ark-attr]') // document.querySelectorAll('[data-ark-attr]')
  // var eleClassName = ''
  if (!status) {
    removeDebugListener()
  } else {
    addDebugListener()
  }
  for (var i = 0; i < eleList.length; i++) {
    var ele = eleList[i]
    var eleConfig = ele.getAttribute('data-ark-attr')
    if (eleConfig) {
      eleConfig = JSON.parse(eleConfig)
    }
    var eleClassName = ele.className

    if (!status) {
      if (eleClassName) {
        ele.className = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
          .replace(' ARK_SAVE_DISPOSE', '')
          .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
      }
    } else {
      // var eleAttr = ele.getAttribute('data-ark-attr')
      if (eleClassName) {
        eleClassName = eleClassName.replace(' ARK_SAVE_NO_DISPOSE', '')
          .replace(' ARK_SAVE_DISPOSE', '')
          .replace(' ARK_SAVE_CHANGE_DISPOSE', '')
      }
      if (eleConfig.dispose === 1) {
        eleClassName += ' ARK_SAVE_DISPOSE'
      } else if (eleConfig.dispose === 2) {
        eleClassName += ' ARK_SAVE_CHANGE_DISPOSE'
      } else {
        eleClassName += ' ARK_SAVE_NO_DISPOSE'
      }
      ele.className = eleClassName
    }
  }
}
export { addDebugListener, removeDebugListener, openDebugBox, hiddenDebugEvent, delDebugBox }
