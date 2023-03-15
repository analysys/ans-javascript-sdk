import Util from '../../../../lib/common/index.js'
import { getElementContent } from '../../heatmap/lib/elementContent.js'
import { domParentList, setIndex, pathContrast, getProperties, getRelated, backH5PathProPath, checkNewPathBase } from '../visualShow/common/index.js'
import LogAjax from '../../../../lib/upload/ajax.js'
import Storage from '../../../../lib/storage/index.js'
import { getMsg } from '../visualShow/common/iframeMsg.js'
import { HybridAns } from '../../hybrid/lib/hybrid.js'
import { successLog } from '../../../../lib/printLog/index.js'

// import { elePostion } from '../../heatmap/lib/getField.js'
var visitorConfig = {}

var patt = /\d{13}/g;

var clickEleObj = {
  path: '',
  index: 0,
  ele: null,
  newPath: {},
  elePostion: {}
}

function loadVisitorSDK () {
  var visitorMsgList = []

  var msgCallback = function (msg) {
    if (window.AnalysysModule && window.AnalysysModule.visual) {
      window.AnalysysModule.visual.msg(msg)
    } else {
      visitorMsgList.push(msg)
    }
  }
  var callback = function () {
    // Util.removeEvent(self, 'message', msgCallback)
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
function addElesListener () {
  if (visitorConfig.isHybrid === true) {
    visitorEventList = HybridAns.visitorEventList
  }
  var clickEle = clickEleObj.ele

  var tempPosObj = clickEleObj.elePostion;
  if (Util.paramType(tempPosObj) === 'Object' && clickEle) {
    tempPosObj['$pos_width'] = clickEle.offsetWidth * detect;
    tempPosObj['$pos_height'] = clickEle.offsetHeight * detect;
  }

  var pathObj = domParentList(clickEle)
  var path = pathObj.path
  var elePathObj = parsePath(path)
  clickEleObj['elePath'] = elePathObj.clickPath
  clickEleObj['path'] = pathObj.path
  clickEleObj['newPath'] = pathObj.newPath
  var trackList = []
  for (var i = 0; i < visitorEventList.length; i++) {
    var eventEleObj = Util.toDeep(visitorEventList[i])
    eventEleObj.newPath = eventEleObj.new_path
    var link = eventEleObj.path
    var index = eventEleObj.index
    var newPath = eventEleObj.newPath

    var bindings = eventEleObj.bindings
    var eleClass = eventEleObj.eleClass
    var status = false
    if ((newPath || bindings) && checkNewPathBase(clickEleObj.newPath, newPath) == true && pathContrast(clickEleObj, eventEleObj) === true) {
      status = true
    } else if (!newPath && !bindings && checkPointBase(clickEleObj.elePath, link) === true) {
      clickEleObj.index = setIndex(clickEleObj.ele, clickEleObj.path)
      if (eleClass === clickEleObj.eleClass && index === clickEleObj.index || pathContrast(clickEleObj, eventEleObj) === true) {
        status = true
      }
    }
    if (status === true) {
      eventEleObj.ele = clickEleObj.ele
      eventEleObj.elePostion = clickEleObj.elePostion
      trackList.push(eventEleObj)
    }
  }
  for (var y = 0; y < trackList.length; y++) {
    var trackEvent = trackList[y]
    var trackNewPath = trackEvent.new_path
    var trackBindings = trackEvent.bindings
    var ele = trackEvent.ele
    var eventName = trackEvent.appEventId || trackEvent.event_id
    var trackIsText = trackEvent.isText

    if (trackNewPath || trackBindings) {
      // 新版可视化逻辑
      var TimeId = 'Track' + +new Date()
      var callback = (function (eventName, properties, elePostion) {
        return function (pro) {
          pro = pro || {}
          if (properties && properties.length > 0) {
            pro = Util.objMerge(pro, getProperties(properties))
          }
          pro = Util.delEmpty(pro)
          if (visitorConfig.isHybrid === true) {
            if (Util.isiOS === true && window.AnalysysModule && window.AnalysysModule.moduleStatus === true) {
              window.AnalysysModule.track(eventName, pro, elePostion)
            } else if (Util.isiOS === true) {
              window.webkit.messageHandlers.AnalysysAgentTrack.postMessage([eventName, JSON.stringify(pro), JSON.stringify(elePostion)]);
              // console.log('触发的埋点发送到ios', [eventName, JSON.stringify(pro), JSON.stringify(elePostion)])
            } else {
              window.AnalysysAgentHybrid.AnalysysAgentTrack(eventName, JSON.stringify(pro), JSON.stringify(elePostion))
              // console.log('触发的埋点发送到android', [eventName, JSON.stringify(pro), JSON.stringify(elePostion)])
            }
          } else {
            window.AnalysysAgent.track(eventName, pro)
          }
        }
      })(eventName, trackEvent.properties, trackEvent.elePostion)
      if (trackEvent.related && trackEvent.related.length > 0) {
        for (var z = 0; z < trackEvent.related.length; z++) {
          var eRelated = trackEvent.related[z].target
          if (eRelated.h5_path) {
            eRelated['path'] = eRelated.h5_path
            trackEvent.related[z].target.h5_path = backH5PathProPath(trackEvent.newPath, eRelated)
          }
        }
      } else {
        trackEvent.related = []
      }
      if (Util.isiOS === true && visitorConfig.isHybrid === true) {
        getRelated(trackEvent.related, callback, TimeId, ele)
        return
      }
      var relatePros = getRelated(trackEvent.related, null, null, ele)
      callback(relatePros)
    } else {
      // 旧版可视化逻辑
      if (trackIsText) {
        var eleText = getElementContent(ele)
        if (trackIsText === eleText) {
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
  if (visitorConfig.isHybrid === true) {
    if (window.AnalysysModule && window.AnalysysModule.moduleStatus === true) {
      window.AnalysysModule.eventList()
    } else if (Util.isiOS === true && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.AnalysysAgentGetEventList) {
      window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.AnalysysAgentGetEventList.postMessage([])
    } else if (window.AnalysysAgentHybrid) {
      var hybridVisitorList = window.AnalysysAgentHybrid.getEventList()
      if (hybridVisitorList) {
        HybridAns.onEventList(hybridVisitorList)
      }
    }

  } else if (visitorConfig.visitorConfigURL) {


    var hash = window.location.hash
    if (hash && hash.indexOf('?') > -1) {
      hash = hash.split('?')[0]
    }
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname + hash
    visitorEventList = []
    getPoint(url)
  }

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
  var visitorUrl = visitorConfig.visitorConfigURL + 'configure'

  var success = function (data) {
    data = visitorConfig.visitorEventList || data
    if (data.code !== 0) {
      return
    }
    var list = []
    var listName = []
    // var checkPointMap = {}
    for (var i = 0; i < data.data.length; i++) {
      var pointEvent = data.data[i]
      var pathObj = parsePath(pointEvent.link)
      var index = pointEvent.index
      var eleClass = pathObj.clickClass
      var elePath = pathObj.clickPath
      var isText = pointEvent.isText
      var link = pointEvent.link
      if (patt.test(link) === true) {
        link = link.replace(patt, '')
      }
      list.push({
        index: index,
        eleClass: eleClass,
        elePath: elePath,
        isText: isText,
        path: link,
        appEventId: pointEvent.appEventId,
        new_path: pointEvent.new_path,
        bindings: pointEvent.props_binding,
        related: pointEvent.related,
        properties: pointEvent.properties
      })
      var listNameObj = {
        'eventID': pointEvent.appEventId,
        'eventName': pointEvent.appEventName || ''
      }
      // if (pointEvent.appEventName) {
      //   listNameObj['eventName'] = pointEvent.appEventName
      // }
      listName.push(listNameObj)
    }
    visitorEventList = list
    successLog('Get Visual Event List from ' + visitorUrl)
    successLog(JSON.stringify(listName, null, 2))
  }
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
var detect = Util.detectZoom()
function pcMouseOver (e) {
  var isTouch = false
  if (e.touches && e.touches.length > 0) {
    e = e.touches[0]
    isTouch = true
  }
  var ele = e.target || e.srcElement

  var classNameList = Util.paramType(ele.className) !== 'String' ? [] : ele.className.split(' ')
  var classPath = ''
  for (var i = 0; i < classNameList.length; i++) {
    if (classNameList[i] && classNameList[i].indexOf('ARK') < 0) {
      classPath += '.' + classNameList[i]
    }
  }
  clickEleObj = {
    ele: ele,
    eleClass: classPath,
    index: 0
  }

  clickEleObj.elePostion = {
    '$pos_left': e.clientX * detect,
    '$pos_top': e.clientY * detect,
    // '$pos_width': ele.offsetWidth * detect,
    // '$pos_height': ele.offsetHeight * detect
  }
  if (isTouch) {
    addElesListener()
  } else {
    Util.addEvent(ele, 'mousedown', addElesListener, true)
  }
}
function pcMouseOut (e) {
  e = e || window.event
  var ele = e.target || e.srcElement
  clickEleObj = {}
  Util.removeEvent(ele, 'mousedown', addElesListener, true)
}
/**
 *添加点击监听
 *在dom加载完毕后绑定
 */
function addEventListener () {
  if (Util.deviceType() === 'desktop' && visitorConfig.isHybrid === false) {
    Util.addEvent(document, 'mouseover', pcMouseOver, true)
    Util.addEvent(document, 'mouseout', pcMouseOut, true)
    // Util.addEvent(document, 'mousedown', pcMouseOver, true)
  } else {
    Util.addEvent(document, 'touchstart', pcMouseOver, true)
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
  visitorConfig.visitorConfigURL = Util.trim(visitorConfig.visitorConfigURL)
  if (config.isHybrid === false && window.self !== window.top && (Util.GetUrlParam('visual') || (Storage.getSession('visitor') === true) && window.location.href.indexOf('arkheatmap=true') < 0)) {
    if (!document.getElementById('AnalysysAgent_JS_SDK_VISUAL')) {
      loadVisitorSDK()
    }
  } else if (visitorConfig.visitorConfigURL || config.isHybrid === true) {
    if (visitorConfig.visitorConfigURL && visitorConfig.visitorConfigURL.charAt(visitorConfig.visitorConfigURL.length - 1) !== '/') {
      visitorConfig.visitorConfigURL += '/'
    }
    getVisitorEvent()//获取
    addEventListener()
  }
  return config
}
export { visitorInit }
