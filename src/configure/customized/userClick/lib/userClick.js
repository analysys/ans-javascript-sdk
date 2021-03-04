import Util from '../../../../lib/common/index.js'
import {
  getElementClickable,
  elePostion,
  getParentClickableElement,
} from '../../heatmap/lib/getField.js'
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
  var config = userClickConfig.user_click_property
  var userClickPro = {}
  if (Util.paramType(config) === 'Object') {
    for (var key in config) {
      if (Util.paramType(config[key]) === 'Function') {
        config[key] = config[key].call(config[key], ele)
      }
    }
    userClickPro = config
  } else if (Util.paramType(config) === 'Function') {
    userClickPro = config.call(config, ele)
  }

  var property = elePostion.ele.getAttribute('data-ark-click') || {}
  if (Util.paramType(property) === 'String') {
    try {
      property = JSON.parse(property)
    } catch (e) { }
  }
  if (Util.paramType(property) !== 'Object') {
    property = {}
  }
  if (Util.paramType(userClickPro) === 'Object') {
    property = Util.objMerge(userClickPro, property)
  }
  window.AnalysysAgent.freeApi('$user_click', property)
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
