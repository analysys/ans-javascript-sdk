import Util from '../../../lib/common/index.js'
var Version = '4.4.1'

/**
 * @method pageEndTrack [发送页面关闭事件]
 * @param {Function} callback 发送数据后的回调函数
 */
function pageEndTrack (callback) {
  var time = +new Date()
  if (isPageShow === false) {
    /**
     * 页面离开时间为 关闭时间-切换tab的时间+之前tab切换离开的时间
     */
    pageLeaveTime = time - pageHiddenTime + pageLeaveTime
  }
  /**
   * 页面停留时间为 当前时间 - 页面打开时间 - 页面隐藏时间
   */

  var pageStay = Number(time - pageStartTime - pageLeaveTime)
  if (pageStay < 0) {
    pageStay = Number(time - pageStartTime)
  }
  if (window.AnalysysAgent && window.AnalysysAgent.track) {
    window.AnalysysAgent.track('page_close', {
      pageStayTime: pageStay,
      $url: url,
      $title: pageTitle
      // sdkVersion: Version,
      // pageOpenTime: Util.format(new Date(pageOpenTime), 'yyyy-MM-dd hh:mm:ss.SSS')
    })

    Util.paramType(callback) === 'Function' && callback.call(callback, null)
  } else {
  }
  createTime()
}
/**
 * url标准化
 *
 * @returns url
 */
function getUrl () {
  var url = window.location.href
  try {
    url = decodeURIComponent(url)
  } catch (e) { }
  try {
    if (window.AnalysysAgent.config.isHybrid === true) {
      url = url.replace(/"/g, '\\"')
    }
  } catch (e) { }
  return url
}
/**
 * 初始化参数
 */
/**
 * @method createTime [初始化参数]
 */
function createTime (startTime, title) {
  var time = +new Date()
  pageStartTime = startTime || time
  pageHiddenTime = startTime || time
  pageLeaveTime = 0
  isPageShow = true
  url = getUrl()
  pageTitle = arguments.length > 1 ? title : document.title
}
var pageOpenTime = +new Date()
var pageStartTime = pageOpenTime
var pageHiddenTime = pageOpenTime
var pageLeaveTime = 0
var isPageShow = true
var url = getUrl()
var pageTitle = document.title
var autoPageClose = true
/**
 * 监听页面打开与关闭事件
 */
if ('onpageShow' in window) {
  Util.addEvent(window, 'pageShow', function () {
    pageStartTime = pageHiddenTime = +new Date()
  })
  Util.addEvent(window, 'pagehide', function () {
    if (autoPageClose === true) {
      pageEndTrack()
    }
  })
} else {
  Util.addEvent(window, 'load', function () {
    pageStartTime = pageHiddenTime = +new Date()
  })
  Util.addEvent(window, 'beforeunload', function () {
    if (autoPageClose === true) {
      pageEndTrack()
    }
  })
}
/**
 * 监听离开/返回tab且未关闭页面
 */
if ('onvisibilitychange' in document) {
  Util.addEvent(document, 'visibilitychange', function () {
    if (document.hidden) {
      isPageShow = false
      pageHiddenTime = +new Date()
    } else {
      isPageShow = true
      pageLeaveTime = +new Date() - pageHiddenTime + pageLeaveTime
    }
  })
}

function pageCloseInit (obj) {
  if (Util.paramType(obj) === 'Object' && Util.paramType(obj.autoPageClose) === 'Boolean') {
    autoPageClose = obj.autoPageClose
  }
}
window.AnalysysModule = Util.objMerge(window.AnalysysModule || {}, {
  pageClose: {
    Version: Version,
    pageEndTrack: pageEndTrack,
    init: pageCloseInit,
    createTime: createTime
  }
})
export { pageCloseInit, pageEndTrack }
