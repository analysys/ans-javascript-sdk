import Util from '../../../../lib/common/index.js'
import {
  sendMsg,
  getMsg
} from './common/iframeMsg.js'
import {
  heatmapConfig,
  ifarmeMessageList,
  showMapConfig
} from './common/config.js'
import {
  isEmbedded,
  pipParam,
  isElmentReady
} from './common/index.js'
import {
  heatmap,
  clearHeatmap,
  createColorRange,
  changeColorRange,
  setHeatmapOpacity
} from './heatMap/index.js'
import {
  creatHeadElement,
  createIframeElement,
  headBtnMap,
  initContent,
  noDataStatus
} from './head/index.js'
import {
  initWebStay,
  clearWebStay
} from './webstay/webstay.js'
import {
  showElementMap,
  delElementMap
} from './heatElement/heatElement.js'
var isInitHeatmap = false

/**
 * [processMsg description]过滤符合热图消息规则的iframe 消息，且在页面未加载完毕时，保存所收取消息
 * @param  {[type]} msg [description] iframe 消息
 * @return {[type]}     [description]
 */
function processMsg (msg) {
  if (msg.code === 'ark/heatmap' ||
    msg.code === 'ark/depth' ||
    msg.code === 'ark/element' ||
    msg.code === 'ark/attention') {
    if (!isInitHeatmap) {
      ifarmeMessageList.push(msg)
    } else {
      showIframeMap(msg)
    }
  }
}

/**
 * [clearMap description] tab切换重置无关页面
 * @return {[type]} [description]
 */
function clearMap () {
  // if (msg.code !== 'ark/heatmap') {
  clearHeatmap()
  clearWebStay()
  delElementMap()
  // }
}
var isWebstayShow = false

function showIframeMap (msg) {
  if (ifarmeMessageList.length > 0) {
    for (var i = ifarmeMessageList.length - 1; i >= 0; i--) {
      showMap(ifarmeMessageList[i])
    }
  }

  showMapConfig.content = msg.content
  if (showMapConfig.content.appKey !== heatmapConfig.appid) {
    noDataStatus(500)
    return
  }
  var control = msg.control
  var type = control.type
  showMapConfig.control = control
  if (msg.code === 'ark/heatmap') {
    if (showMapConfig.type !== 'heatmap') {
      isMapClose = false
      clearMap()
    }
    showMapConfig.type = 'heatmap'
    if (control.type === 'openHeatMap') {
      isMapClose = false
      heatmap()
      if (showMapConfig.control && showMapConfig.control.value && Util.paramType(showMapConfig.control.value.min) === 'Number') {
        changeColorRange({
          min: showMapConfig.control.value.min,
          max: showMapConfig.control.value.maxValue
        })
        setHeatmapOpacity(showMapConfig.control.value.opacity)
      }
    } else if (type === 'closeHeatMap') {
      isMapClose = true
      clearHeatmap()
    } else if (type === 'openDepth') {
      isWebstayShow = true
      initWebStay()
    } else if (type === 'closeDepth') {
      isWebstayShow = false
      clearWebStay()
    } else if (type === 'refresh' || type === 'getHeatmapData') {
      refreshBtnClick()
    } else if (type === 'heatmapcolorRange') {
      changeColorRange({
        min: control.value.min,
        max: control.value.maxValue
      })
    } else if (type === 'heatmapOpacity') {
      setHeatmapOpacity(control.value.opacity)
    }
  }
  if (msg.code === 'ark/depth') {
    if (showMapConfig.type !== 'depth') {
      clearMap()
    }
    showMapConfig.type = 'depth'
    if (type === 'openDepth') {
      initWebStay()
    } else if (type === 'closeDepth') {
      clearWebStay()
    } else if (type === 'refresh') {
      refreshBtnClick()
    }
  }
  if (msg.code === 'ark/element') {
    if (showMapConfig.type !== 'element') {
      isMapClose = false
      clearMap()
    }
    showMapConfig.type = 'element'
    if (type === 'openHeatMap' || type === 'openElementMap') {
      isMapClose = false
      showElementMap()
    } else if (type === 'closeHeatMap' || type === 'closeElementMap') {
      isMapClose = true
      delElementMap()
    } else if (type === 'openDepth') {
      isWebstayShow = true
      initWebStay()
    } else if (type === 'closeDepth') {
      isWebstayShow = false
      clearWebStay()
    } else if (type === 'refresh') {
      refreshBtnClick()
    } else if (type === 'getElmentData') {
      refreshPoints()
    }
  }
  // if (msg.code === 'ark/attention') {

  // }
}

function setMapType (msg) {
  if (msg.code === 'ark/heatmap') {
    showMapConfig.type = 'heatmap'
  }
  if (msg.code === 'ark/depth') {
    showMapConfig.type = 'depth'
  }
  if (msg.code === 'ark/element') {
    showMapConfig.type = 'element'
  }
  if (msg.code === 'ark/attention') {
    showMapConfig.type = 'attention'
  }
}
/**
 * [showMap description]根据消息或url参数展示对应热图
 * @return {[type]} [description]
 */
function showMap (msg) {
  if (msg.code === 'ark/heatmap') {
    heatmap()
  }
  if (msg.code === 'ark/depth') {
    initWebStay()
  }
  if (msg.code === 'ark/element') {
    showElementMap()
  }
  // if (msg.code === 'ark/attention') {

  // }
}

/**
 * [creatHeadTabBntClick description]交互式时初始化头部按钮事件
 * @return {[type]} [description]
 */
var isMapClose = false

function creatHeadTabBntClick () {
  Util.addEvent(headBtnMap.heatmapTab, 'click', refreshPoints)
  Util.addEvent(headBtnMap.elementMapTab, 'click', refreshPoints)
  Util.addEvent(headBtnMap.depthMapTab, 'click', refreshPoints)
  Util.addEvent(headBtnMap.refreshBtn, 'click', refreshBtnClick)
  Util.addEvent(headBtnMap.heatSwitch, 'click', function (e) {
    var ele = e.target || e.srcElement
    if (ele.checked === false) {
      isMapClose = true
      if (showMapConfig.type === 'element') {
        delElementMap()
      } else if (showMapConfig.type === 'heatmap') {
        clearHeatmap()
      }
      if (headBtnMap.depthSwitchBtn.checked === true) {
        clearWebStay()
      }
    } else {
      isMapClose = false
      if (showMapConfig.type === 'element') {
        showElementMap()
      } else if (showMapConfig.type === 'heatmap') {
        heatmap()
      }
      if (headBtnMap.depthSwitchBtn.checked === true) {
        initWebStay()
      }
    }
  })
  Util.addEvent(headBtnMap.depthSwitchBtn, 'click', function () {
    if (headBtnMap.depthSwitchBtn.checked === false) {
      clearWebStay()
    } else {
      initWebStay()
    }
  })
  createColorRange()
}

/**
 * [initHeatmap description]初始化热图并建立通讯
 * @return {[type]} [description]
 */
function initHeatmap () {
  if (isElmentReady()) {
    if (isEmbedded('arkheatmap')) {
      createIframeElement()
      isInitHeatmap = true
      sendMsg()
      getMsg(processMsg)
    } else if (document.readyState === 'complete') {
      var arkcontent = Util.GetUrlParam('arkcontent')
      var arkcontentText = Util.GetUrlParam('arkcontentText')
      arkcontent = pipParam(pipParam(arkcontent, '/'), '#')
      if (!arkcontent) {
        noDataStatus(400)
        return
      }
      try {
        var params = unescape(arkcontent)
        showMapConfig.content = JSON.parse(params)
      } catch (e) {
        creatHeadTabBntClick()
        noDataStatus(400)
        return
      }
      if (!Util.isEmptyObject(showMapConfig.content)) {
        setMapType(showMapConfig.content)
      }
      creatHeadElement()
      creatHeadTabBntClick()
      if (showMapConfig.content.appKey !== heatmapConfig.appid) {
        noDataStatus(500)
        return
      }
      showMap(showMapConfig.content)

      if (arkcontentText) {
        try {
          arkcontentText = pipParam(pipParam(arkcontentText, '/'), '#')
          var testParams = unescape(arkcontentText)
          showMapConfig.contentText = JSON.parse(testParams)
          initContent()
        } catch (e) { }
      }
    } else {
      setTimeout(initHeatmap, 20)
      return
    }

    Util.addEvent(window, 'resize', resizeHeatmap)
  } else {
    setTimeout(initHeatmap, 20)
  }
}

function refreshPoints () {
  if (headBtnMap.heatSwitch && headBtnMap.heatSwitch.checked === true) {
    isMapClose = false
  }
  if (isMapClose === true && (showMapConfig.type === 'heatmap' || showMapConfig.type === 'element')) {
    return
  }
  clearMap()

  if (showMapConfig.content.appKey !== heatmapConfig.appid) {
    noDataStatus(500)
    return
  }
  if (!showMapConfig.content) {
    noDataStatus(400)
    return
  }
  if (showMapConfig.type === 'heatmap') {
    heatmap()
    var min = null
    var max = null
    var opt = null
    if (showMapConfig.control && showMapConfig.control.value && showMapConfig.control.value.min) {
      min = showMapConfig.control.value.min
      max = showMapConfig.control.value.maxValue
      opt = showMapConfig.control.value.opacity
    }
    changeColorRange({
      min: min,
      max: max
    })
    setHeatmapOpacity(opt)
  } else if (showMapConfig.type === 'element') {
    showElementMap()
  }
  if (showMapConfig.type === 'depth' || (headBtnMap.depthSwitchBtn && headBtnMap.depthSwitchBtn.checked === true)) {
    initWebStay()
  }
  if (isWebstayShow === true) {
    initWebStay()
  }
}

function refreshBtnClick () {
  showMapConfig.isRefresh = true
  refreshPoints()
  showMapConfig.isRefresh = false
}
var resizeTimer = null
var windowHeight = document.documentElement.clientHeight || document.body.clientHeight

function resizeHeatmap () {
  var changeHeight = document.documentElement.clientHeight || document.body.clientHeight
  if (windowHeight !== changeHeight) {
    windowHeight = changeHeight
  } else {
    clearTimeout(resizeTimer)
    refreshPoints()
    return
  }
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(resizeHeatmap, 1000)
}
initHeatmap()
