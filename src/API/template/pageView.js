import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { setReferrer } from '../../lib/fillField/getField.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'
import { transporter, backParamsArray } from '../../lib/upload/hybrid.js'

var pageCloseStatus = false
var pageUrl = window.location.href

/**
 * @method pageView 统计页面事件
 * 第一个参数为页面名称 类型：String
 * 第二个参数为自定义属性 类型：Object/Function
 * 第三个参数为回调函数 类型：Function
 * 示例:
 * AnalysysAgent.pageView('首页')
 * AnalysysAgent.pageView('首页',{ 'commodityName': 'iPhone'})
 * AnalysysAgent.pageView('首页',{
 *  'commodityName': function(){
 *    return 'iPhone'
 *  }
 * })
 * AnalysysAgent.pageView('首页',{
 *  'commodityName': function(){
 *    return 'iPhone'
 *  }
 * },function(){
 *  console.log('上报日志成功')
 * })
 * @param {String} pageName
 * @param {Object} obj
 * @param {function} callback
 */
function pageView (pageName, obj, callback) {
  var log = pageViewLog(pageName, obj, callback)

  // 去除空数据后上传数据
  upLog(log, callback)
}

function pageViewLog (p, o, c) {
  var pageName = p
  var obj = o
  var callback = c
  // 页面关闭组件发送
  if (window.AnalysysModule && window.AnalysysModule.pageClose) {
    if (pageCloseStatus === true) {
      window.AnalysysModule.pageClose.pageEndTrack()
    } else {
      pageCloseStatus = true
    }
    if (Util.paramType(pageName) === 'String') {
      window.AnalysysModule.pageClose.createTime(+new Date(), pageName)
    } else {
      window.AnalysysModule.pageClose.createTime(+new Date())
    }
  }

  baseConfig.status.FnName = '$pageview'
  resetCode()
  var nameObj = {}
  if (Util.paramType(pageName) === 'String') {
    nameObj = {
      $title: pageName
    }
    checkPrivate(nameObj)
  } else if (Util.paramType(pageName) === 'Object') {
    if (Util.paramType(obj) === 'Function') {
      callback = obj
    }
    obj = pageName
    pageName = ''
  } else if (Util.paramType(pageName) === 'Function') {
    callback = pageName
    obj = ''
    pageName = ''
  }
  if (Util.paramType(obj) === 'Function') {
    callback = obj
    obj = ''
  }
  var userProp = {}

  if (Util.paramType(obj) === 'Object') {
    for (var key in obj) {
      if (Util.paramType(obj[key]) === 'Function') {
        obj[key] = obj[key].call(obj[key])
      }
    }
    // 检测用户自定义属性
    if (baseConfig.base.isHybrid === false) {
      checkPrivate(obj)
    }
    userProp = {
      xcontext: obj || {}
    }
  }

  var arkSuper = Storage.getLocal('ARKSUPER') || {}
  if (baseConfig.base.isHybrid === true) {
    arkSuper = {}
  }
  /**
     * 超级属性与用户自定义属性合并
     */
  var xcontext = Util.objMerge({
    xcontext: arkSuper
  }, userProp)
  /**
     * 与$pagename属性合并
     */
  xcontext = Util.objMerge(xcontext, {
    xcontext: nameObj
  })

  var pageViewTemp = temp('$pageview')
  var pageViewObj = Util.delEmpty(fillField(pageViewTemp))
  if (baseConfig.base.isHybrid === true) {
    pageViewTemp = temp('$pageviewbase')
    pageViewObj = Util.delEmpty(fillField(pageViewTemp))
    var hybridPageViewLog = Util.objMerge(pageViewObj, xcontext)
    hybridPageViewLog = Util.delNotHybrid(Util.delEmpty(hybridPageViewLog.xcontext))
    var backParams = backParamsArray(pageName || '', hybridPageViewLog, callback)
    var paramArray = backParams.argArray
    transporter('pageView', paramArray, backParams.callback)
    setReferrer(pageUrl)

    return
  }

  setReferrer(pageUrl)
  /**
     * 自动采集与个性化属性合并
     */
  return Util.objMerge(pageViewObj, xcontext)
}


function hashPageView () {
  Util.changeHash(function () {
    if (pageUrl !== window.location.href) {
      pageUrl = window.location.href
      /**
     * 判断黑白名单
     * 符合黑名单，不上报
     * 有白名单，且不符合白名单，不上报
     */
      var listStatus = false
      if (baseConfig.base.pageViewWhiteList && Util.checkTypeList(baseConfig.base.pageViewWhiteList)) {
        listStatus = true
      } else if (!Util.checkTypeList(baseConfig.base.pageViewBlackList)) {
        listStatus = true
      }
      if (listStatus === true) {
        pageView()
      }
    }
  })
}
export { pageView, hashPageView, pageViewLog }
