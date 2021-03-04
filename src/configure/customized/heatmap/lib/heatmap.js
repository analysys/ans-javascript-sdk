import Util from '../../../../lib/common/index.js'
import { elePostion, getParentClickableElement } from './getField.js'
import { eleScroll, eleOffset } from '../heatmapSDK/common/index.js'
var heatmapConfig = {}

function loadHeatmapSDK () {
  if (!document.body || !document.getElementsByTagName('body')[0]) {
    setTimeout(loadHeatmapSDK, 50)
    return
  }
  Util.addScript('AnalysysAgent_JS_SDK_HEATMAP', heatmapConfig.SDKFileDirectory)
  window.ARK_HEATMAP = {
    config: heatmapConfig
  }
}

// function offset (obj, direction) {
//   var fristText = direction.split('')[0]
//   // 将top,left首字母大写,并拼接成offsetTop,offsetLeft
//   var offsetDir = 'offset' + fristText.toUpperCase() + direction.substring(1)

//   var realNum = obj[offsetDir]
//   var positionParent = obj.offsetParent // 获取上一级定位元素对象

//   while (positionParent != null) {
//     realNum += positionParent[offsetDir]
//     positionParent = positionParent.offsetParent
//   }
//   return realNum
// }

function addClickEvent (event) {
  var e = event || window.event
  if (e.touches && e.touches.length > 0) {
    e = e.touches[0]
  }
  var ele = e.target || e.srcElement

  if (Util.checkTypeList(heatmapConfig.heatMapBlackList, ele) ||
    (heatmapConfig.heatMapWhiteList &&
      !Util.checkTypeList(heatmapConfig.heatMapWhiteList, ele))
  ) return
  // e.stopPropagation()
  // e.preventDefault()
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop
  var x = e.pageX || (e.clientX + scrollX)
  var y = e.pageY || (e.clientY + scrollY)
  elePostion.click_x = x
  elePostion.click_y = y
  elePostion.clickEle = elePostion.ele = ele
  getParentClickableElement()
  var eleScr = eleScroll(elePostion.ele)
  var eleOff = eleOffset(elePostion.ele)
  elePostion.elementX = x - (eleOff.left - eleScr.scrollLeft)
  elePostion.elementY = y - (eleOff.top - eleScr.scrollTop)
  if (!x || !y || x <= 0 || y <= 0) {
    return
  }
  if (!window.AnalysysAgent || !window.AnalysysAgent.freeApi) {
    setTimeout(function () {
      addClickEvent(event)
    }, 100)
  } else {
    window.AnalysysAgent.freeApi('$web_click')
  }
}

function initHeatmap () {
  if (Util.deviceType() == 'desktop') {
    Util.addEvent(document, 'click', addClickEvent)
  } else {
    Util.addEvent(document, 'touchstart', addClickEvent)
  }
}

function heatmapInit (config) {
  heatmapConfig = config
  if (window.location.href.indexOf('arkheatmap=true') > -1 || window.name.indexOf('arkheatmap=true') > -1) {
    if (window.name === '') {
      window.name = window.location.href
    }
    loadHeatmapSDK()
  } else if (config.autoHeatmap === true && config.isHybrid === false) {
    initHeatmap()
  }
  return config
}

export { heatmapInit }
