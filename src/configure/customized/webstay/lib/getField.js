import Util from '../../../../lib/common/index.js'
import conifg from '../../../../lib/baseConfig/index.js'
var startDate = +new Date()
var root = null

function setRootEle (ele) {
  if (ele) {
    root = ele
  } else {
    root = document.body
  }
}
// 获取浏览器窗口的可视区域的宽度
function getViewPortWidth () {
  return document.documentElement.clientWidth || document.body.clientWidth
}

// 获取浏览器窗口的可视区域的高度
function getViewPortHeight () {
  return document.documentElement.clientHeight || document.body.clientHeight
}

// 获取浏览器窗口垂直滚动条的位置
function getScrollTop () {
  return root.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
}

function getDuration () {
  var nowTime = +new Date()
  var duration = nowTime - startDate
  startDate = nowTime
  if (Util.paramType(conifg.base.webstayDuration) === 'Number' && conifg.base.webstayDuration > 0) {
    if (duration > conifg.base.webstayDuration) {
      return conifg.base.webstayDuration
    }
  } else {
    if (duration > 5 * 60 * 60 * 1000) {
      return 5 * 60 * 60 * 1000
    }
  }
  return duration
}
function getDeviceType () {
  return Util.deviceType()
}
export { getViewPortWidth, getViewPortHeight, getScrollTop, getDuration, getDeviceType, setRootEle }
