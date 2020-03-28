import Util from '../../../../lib/common/index.js'
import { getElementContent } from '../../heatmap/lib/elementContent.js'
import { domParentList, setIndex, pathContrast, parseEvent } from '../visualShow/common/index.js'
import LogAjax from '../../../../lib/upload/ajax.js'
import Storage from '../../../../lib/storage/index.js'
var visitorConfig = {}
var elePath = null
var eleIndex = null
function loadVisitorSDK () {
  Util.addScript('AnalysysAgent_JS_SDK_VISUAL', visitorConfig.SDKFileDirectory)
  window.ARK_VISUAL = {
    config: visitorConfig
  }
  Storage.setSession('visitor', true)
}

function addElesListener (e) {
  // var e = eventEle
  // if (!e) {
  //   return
  // }
  if (e.touches && e.touches.length > 0) {
    e = e.touches[0]
  }

  var ele = e.target || e.srcElement

  // var elePath = domParentList(ele)
  // var eleIndex = setIndex(ele, elePath)
  var patt = /\d{13}/g;
  if (patt.test(elePath) === true) {
    elePath = elePath.replace(patt, '')
  }
  var clickEleObj = {
    path: elePath,
    index: eleIndex,
    ele: ele
  }
  for (var i = 0; i < visitorEventList.length; i++) {
    var link = visitorEventList[i].link
    var index = visitorEventList[i].index
    var eventName = visitorEventList[i].appEventId
    var listEle = parseEvent(link)[index]
    if (patt.test(link) === true) {
      link = link.replace(/\d{13}/, '')
    }
    var eventEleObj = {
      path: link,
      index: index
    }
    if (pathContrast(clickEleObj, eventEleObj) === true || listEle === ele) {
      var isText = visitorEventList[i].isText
      if (isText) {
        var eleText = getElementContent(ele)
        if (isText === eleText) {
          window.AnalysysAgent.track(eventName)
        }
      } else {
        window.AnalysysAgent.track(eventName)
      }
    }
  }
}
var visitorEventList = []

function getVisitorEvent () {
  var hash = window.location.hash
  if (hash.indexOf('?') > -1) {
    hash = hash.split('?')[0]
  }
  var url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
  // var noProUrl = '//' + window.location.host + window.location.pathname + hash
  getPoint(url)
  // getPoint(noProUrl, true)
}
function getPoint (url, status) {
  var visitorUrl = visitorConfig.visitorConfigURL

  var success = (function (status) {
    return function (data) {
      if (data.code !== 0) {
        return
      }

      if (!status) {
        if (visitorEventList.length === 0) {
          visitorEventList = data.data
        } else {
          var list = data.data
          for (var i = 0; i < list.length; i++) {
            var isInArray = true
            for (var y = 0; y < visitorEventList.length; y++) {
              if (visitorEventList[y].appEventId === list[i].appEventId) {
                isInArray = false
              }
            }
            if (isInArray === true) {
              visitorEventList.push(list[i])
            }
          }
        }
      } else {
        if (visitorEventList.length === 0) {
          visitorEventList = data.data
        } else {
          var listF = data.data
          for (var x = 0; x < listF.length; x++) {
            var isInArrayX = true
            for (var z = 0; z < visitorEventList.length; z++) {
              if (visitorEventList[y].appEventId === list[i].appEventId) {
                isInArrayX = false
                visitorEventList[y] = list[z]
              }
            }
            if (isInArrayX === true) {
              visitorEventList.push(list[i])
            }
          }
        }
      }
      visitorEventList = data.data
    }
  })(status)
  var option = {
    url: visitorUrl,
    data: {
      appkey: visitorConfig.appid,
      lib: 'Js',
      url: url
    },
    success: success,
    error: function () { }
  }
  new LogAjax().get(option)
}
var url = window.location.href

function visitorPageViewInit (config) {
  if (config.visitorConfigURL) {
    if (config.visitorConfigURL.charAt(config.visitorConfigURL.length - 1) !== '/') {
      config.visitorConfigURL += '/'
    }
    config.visitorConfigURL = config.visitorConfigURL + 'configure'

    getVisitorEvent()
    addEventListener()
  }
}

function pcMouseOver (e) {
  // eventEle = e
  var ele = e.target

  elePath = domParentList(ele)
  var patt = /\d{13}/g;
  if (patt.test(elePath) === true) {
    elePath = elePath.replace(/\d{13}/, '')
  }
  eleIndex = setIndex(ele, elePath)
  Util.addEvent(ele, 'mousedown', addElesListener)
}
function pcMouseOut (e) {
  var ele = e.target
  // eventEle = null
  Util.removeEvent(ele, 'mousedown', addElesListener)
}
/**
 *添加点击监听
 *在dom加载完毕后绑定
 */
function addEventListener () {
  if (document.readyState !== 'complete') {
    setTimeout(addEventListener, 500)
    return
  }
  if (Util.deviceType() === 'desktop') {
    Util.addEvent(document, 'mouseover', pcMouseOver, true)
    Util.addEvent(document, 'mouseout', pcMouseOut, true)
  } else {
    Util.addEvent(document, 'touchstart', addElesListener)
  }
  Util.changeHash(function () {
    if (url !== window.location.href) {
      url = window.location.href
      getVisitorEvent()
    }
  })
}

function visitorInit (config) {
  visitorConfig = config
  if (Util.paramType(window.top) !== 'Undefined' && (window.top !== window.self) && (window.location.href.indexOf('visual=true') > -1 || Storage.getSession('visitor') === true)) {
    loadVisitorSDK()
  } else {
    visitorPageViewInit(config)
  }

  return config
}
export { visitorInit }
