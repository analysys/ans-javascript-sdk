import Util from '../../../../lib/common/index.js'
import { getElementClickable, elePostion, getParentClickableElement } from '../../heatmap/lib/getField.js'
var userClickConfig = {}

function addClickEvent (event) {
  var e = event || window.event
  if (e.touches && e.touches.length > 0) {
    e = e.touches[0]
  }
  var ele = e.target || e.srcElement
  if (Util.checkTypeList(userClickConfig.autoClickBlackList, ele) ||
    (userClickConfig.autoClickWhiteList &&
    !Util.checkTypeList(userClickConfig.autoClickWhiteList, ele))) return
  elePostion.ele = ele
  getParentClickableElement()
  if (getElementClickable() !== 1) return
  if (!window.AnalysysAgent || !window.AnalysysAgent.freeApi) {
    setTimeout(function () {
      addClickEvent(event)
    }, 100)
  } else {
    window.AnalysysAgent.freeApi('$user_click')
  }
}

function addListenerUserClick () {
  if (Util.deviceType() === 'desktop') {
    Util.addEvent(document, 'mousedown', addClickEvent)
  } else {
    Util.addEvent(document, 'touchstart', addClickEvent)
  }
}

function userClickInit (config) {
  userClickConfig = config
  if (config.autoTrack === true) {
    addListenerUserClick()
  }
  return config
}

export { userClickInit }
