import Util from '../../../../lib/common/index.js'
import { getElementContent } from '../../heatmap/lib/elementContent.js'
import { domParentList, setIndex, pathContrast, parseEvent } from '../visualShow/common/index.js'
import LogAjax from '../../../../lib/upload/ajax.js'
import Storage from '../../../../lib/storage/index.js'
import { getMsg, sendMsg } from '../visualShow/common/iframeMsg.js'
var visitorConfig = {}
// var elePath = null
var clickEleObj = {}
function loadVisitorSDK () {
  var visitorMsgList = []

  var msgCallback = function (msg) {
    var type = msg.type
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.hash
    switch (type) {
      case 'INIT': // 初始化验证
        if (msg.appid !== visitorConfig.appid) {
          sendMsg({
            code: 400,
            type: 'INIT',
            msg: 'appkey不相同'
          })
          return
        }
        sendMsg({
          code: 200,
          type: 'INIT'
        })
        var obj = {
          type: 'checkUrl',
          code: 200,
          url: url,
          skip: true
        }
        sendMsg(obj)
        break
    }
    if (window.AnalysysModule && window.AnalysysModule.visual) {
      window.AnalysysModule.visual.msg(msg)
    } else {

      visitorMsgList.push(msg)
    }
  }
  var callback = function () {
    Util.removeEvent(window, 'message', msgCallback)
    if (window.AnalysysModule && window.AnalysysModule.visual) {
      for (var i = 0; i < visitorMsgList.length; i++) {
        window.AnalysysModule.visual.msg(visitorMsgList[i])
      }
    }
  }
  Util.addScript('AnalysysAgent_JS_SDK_VISUAL', visitorConfig.SDKFileDirectory, callback)
  window.ARK_VISUAL = {
    config: visitorConfig
  }
  Storage.setSession('visitor', true)

  getMsg(msgCallback)
}
function IsReverse (text) {
  return text.split('').reverse().join('');
}
function checkPointBase (elePath, eventPath) {
  var clickRPath = IsReverse(elePath)
  var eventRpath = IsReverse(eventPath)
  if (clickRPath.indexOf(eventRpath) > -1) {
    return true
  }
  return false
}

function addElesListener (e) {
  e = e || window.event
  if (e.touches && e.touches.length > 0) {
    e = e.touches[0]
  }

  var ele = e.target || e.srcElement
  var patt = /\d{13}/g;

  for (var i = 0; i < visitorEventList.length; i++) {
    var link = visitorEventList[i].link
    var eventElePath = visitorEventList[i].elePath
    var index = visitorEventList[i].index
    var eleClass = visitorEventList[i].eleClass
    var eventName = visitorEventList[i].appEventId
    if (patt.test(link) === true) {
      link = link.replace(/\d{13}/, '')
    }
    if (checkPointBase(clickEleObj.elePath, eventElePath) === true) {
      var eventStatus = false
      if (eleClass === clickEleObj.eleClass && index === clickEleObj.index) {
        eventStatus = true
      } else {
        var listEle = parseEvent(link)[index]
        var eventEleObj = {
          path: link,
          index: index
        }

        if (listEle === ele || pathContrast(clickEleObj, eventEleObj) === true) {
          eventStatus = true
        }
      }

      if (eventStatus === true) {
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
}
var visitorEventList = []

function getVisitorEvent () {
  var hash = window.location.hash
  if (hash.indexOf('?') > -1) {
    hash = hash.split('?')[0]
  }
  var url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
  getPoint(url)
}

function parsePath (path) {
  var clickPathArray = path.split('<')
  var clickClass = clickPathArray[0].split('.')[1] || ''
  var clickPath = []
  for (var i = 0; i < clickPathArray.length; i++) {
    clickPath.push(clickPathArray[i].split('.')[0])
  }
  return {
    class: clickClass,
    clickPath: clickPath.join('<')
  }
}
function getPoint (url) {
  var visitorUrl = visitorConfig.visitorConfigURL

  var success = (function () {
    return function (data) {
      if (data.code !== 0) {
        return
      }
      var list = []
      for (var i = 0; i < data.data.length; i++) {
        var pointEvent = data.data[i]
        var pathObj = parsePath(pointEvent.link)
        var index = pointEvent.index
        var eleClass = pathObj.clickClass
        var elePath = pathObj.clickPath
        var isText = pointEvent.isText
        list.push({
          index: index,
          eleClass: eleClass,
          elePath: elePath,
          isText: isText,
          link: pointEvent.link,
          appEventId: pointEvent.appEventId
        })
      }
      visitorEventList = list
    }
  })()
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
  if (config.visitorConfigURL && config.isHybrid === false) {
    if (config.visitorConfigURL.charAt(config.visitorConfigURL.length - 1) !== '/') {
      config.visitorConfigURL += '/'
    }
    config.visitorConfigURL = config.visitorConfigURL + 'configure'

    getVisitorEvent()
    addEventListener()
  }
}

function pcMouseOver (e) {
  var isTouch = false
  if (e.touches && e.touches.length > 0) {
    e = e.touches[0]
    isTouch = true
  }
  e = e || window.event
  var ele = e.target || e.srcElement
  var path = domParentList(ele)
  var pathObj = parsePath(path)
  var eleClass = pathObj.clickClass
  var elePath = pathObj.clickPath

  var patt = /\d{13}/g;
  if (patt.test(path) === true) {
    path = path.replace(/\d{13}/, '')
  }
  var eleIndex = setIndex(ele, path)
  clickEleObj = {
    path: path,
    eleIndex: eleIndex,
    ele: ele,
    elePath: elePath,
    eleClass: eleClass
  }
  if (isTouch === true) {
    addElesListener()
  } else {
    Util.addEvent(ele, 'mousedown', addElesListener)
  }
}
function pcMouseOut (e) {
  e = e || window.event
  var ele = e.target || e.srcElement
  // eventEle = null
  Util.removeEvent(ele, 'mousedown', addElesListener)
}
// function touchEvent (e) {
//   if (e.touches && e.touches.length > 0) {
//     e = e.touches[0]
//   }
//   var ele = e.target

//   elePath = domParentList(ele)
//   var patt = /\d{13}/g;
//   if (patt.test(elePath) === true) {
//     elePath = elePath.replace(/\d{13}/, '')
//   }
//   eleIndex = setIndex(ele, elePath)
//   addElesListener(e)
// }
/**
 *添加点击监听
 *在dom加载完毕后绑定
 */
function addEventListener () {
  if (Util.deviceType() === 'desktop') {
    Util.addEvent(document, 'mouseover', pcMouseOver, true)
    Util.addEvent(document, 'mouseout', pcMouseOut, true)
  } else {
    Util.addEvent(document, 'touchstart', pcMouseOver)
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
