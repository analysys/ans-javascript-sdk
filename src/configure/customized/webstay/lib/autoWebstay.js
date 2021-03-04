import Util from '../../../../lib/common/index.js'
import { isElmentReady } from '../../heatmap/heatmapSDK/common/index.js'
import { setRootEle } from './getField.js'
var interval = null
var topValue = 0

function initWebStay () {
  // var scroll = window.onscroll
  // window.onscroll = function () {
  //   if (scroll && Util.paramType(scroll) === 'Function') {
  //     scroll()
  //   }
  //   clearTimeout(interval)
  //   interval = setTimeout(isScroll, 1000)
  //   topValue = document.documentElement.scrollTop || document.body.scrollTop
  // }
  function getScroll () {
    if (isRoot === true) {
      return document.documentElement.scrollTop || document.body.scrollTop
    } else {
      return rootEle.scrollTop || 0
    }
  }
  function isScroll () {
    var m2 = getScroll()
    if (topValue === m2) {
      clearTimeout(interval)
      interval = null

      if (!window.AnalysysAgent || !window.AnalysysAgent.freeApi) {
        setTimeout(function () { isScroll() }, 100)
      } else {
        window.AnalysysAgent.freeApi('$webstay')
      }
    }
  }
  Util.addEvent(rootEle, 'scroll', function () {
    clearTimeout(interval)
    interval = setTimeout(isScroll, 1000)
    topValue = getScroll()
  })
  // setTimeout(startScroll, 1000)
}

// function startScroll () {
//   if (!window.AnalysysAgent || !window.AnalysysAgent.freeApi || !document.body) {
//     setTimeout(function () { startScroll() }, 100)
//   } else {
//     var fristScrollTop = document.documentElement.scrollTop || document.body.scrollTop
//     if (fristScrollTop === 0) {

//       window.AnalysysAgent.freeApi('$webstay')
//     }
//   }
// }
function getChildEle (ele) {
  var parentEle = ele || document.body
  var childList = parentEle.childNodes
  var scrollEle = document.body
  for (var i = 0; i < childList.length; i++) {
    if (childList[i].nodeType === 1) {
      if (hasScrollbar(childList[i]) === true) {
        isRoot = false
        return childList[i]
      } else {
        scrollEle = getChildEle(childList[i])
      }
    }
  }
  return scrollEle
}
function hasScrollbar (ele) {

  var scrollHeight = 0
  var innerHeight = 0
  var baseHeight = document.body.scrollHeight
  if (ele) {
    scrollHeight = ele.scrollHeight
    innerHeight = ele.clientHeight
  } else {
    scrollHeight = document.body.scrollHeight
    innerHeight = window.innerHeight || document.documentElement.clientHeight
  }
  return scrollHeight > innerHeight && scrollHeight > baseHeight
}

var rootEle = null
var isRoot = true
function getRootEle (config) {
  var userEle = null

  if (config.autoHeatmap === true && config.autoWebstay === true && config.isHybrid === false) {
    var webstayRootEleConfig = config.webstayRootEle

    if (webstayRootEleConfig) {
      if (Util.paramType(webstayRootEleConfig) === 'String') {
        var eleList = Util.selectorAllEleList(webstayRootEleConfig)
        if (eleList.length > 0) {
          userEle = eleList[0]
        }
      } else if (Util.paramType(webstayRootEleConfig) === 'Function') {
        userEle = webstayRootEleConfig.call(webstayRootEleConfig) || null
      } else if (typeof webstayRootEleConfig === 'object' && webstayRootEleConfig.nodeType === 1) {
        userEle = webstayRootEleConfig
      }
    }
    if (userEle) {
      isRoot = false
      rootEle = userEle
    } else {
      rootEle = getChildEle()
    }
    if (rootEle === document.body || !rootEle) {
      rootEle = window
    }
    setRootEle(rootEle)
    initWebStay()
  }

}
function autoWebstayInit (config) {
  if (window.location.href.indexOf('visual=true') > -1 || window.location.href.indexOf('arkheatmap=true') > -1) {
    return config
  }
  if (isElmentReady() === false) {
    setTimeout(function () {
      autoWebstayInit(config)
    }, 300)
  } else {
    getRootEle(config)
  }
  return config
}

export { autoWebstayInit }
