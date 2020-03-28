import Util from '../../../../lib/common/index.js'
import baseConfig from '../../../../lib/baseConfig/index.js'
var hybridAns = {
  // 设置TRACKID
  identify: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('identify', paramArray, backParams.callback)
  },
  // 设置及关联LOGINID TRACKID
  alias: function (aliasID, trackID, callback) {
    if (Util.paramType(trackID) === 'Function') {
      callback = trackID
      trackID = ''
    }
    var backParams = backParamsArray.call(backParamsArray, aliasID, trackID || '', callback)
    var paramArray = backParams.argArray
    transporter('alias', paramArray, backParams.callback)
  },
  // 清除所有ID 超级属性 profile设置
  reset: function (callback) {
    transporter('reset', [], callback)
  },
  // 自定义事件
  track: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('track', paramArray, backParams.callback)
  },
  // 设置用户属性
  profileSet: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('profileSet', paramArray, backParams.callback)
  },
  // 设置用户超级属性
  profileSetOnce: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('profileSetOnce', paramArray, backParams.callback)
  },
  // 设置用户超级属性自增
  profileIncrement: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('profileIncrement', paramArray, backParams.callback)
  },
  // 增加用户超级属性
  profileAppend: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('profileAppend', paramArray, backParams.callback)
  },
  // 删除单个用户超级属性
  profileUnset: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('profileUnset', paramArray, backParams.callback)
  },
  // 删除所有用户超级属性
  profileDelete: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('profileDelete', paramArray, backParams.callback)
  },
  // 设置超级属性
  registerSuperProperty: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('registerSuperProperty', paramArray, backParams.callback)
  },
  //
  registerSuperProperties: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('registerSuperProperties', paramArray, backParams.callback)
  },
  // 删除超级属性
  unRegisterSuperProperty: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('unRegisterSuperProperty', paramArray, backParams.callback)
  },
  // 清除超级属性
  clearSuperProperties: function () {
    var backParams = backParamsArray.apply(backParamsArray, arguments)
    var paramArray = backParams.argArray
    transporter('clearSuperProperties', paramArray, backParams.callback)
  },
  // 获取单个超级属性
  getSuperProperty: function (superPropertyName, callbackFun, callback) {
    var paramArray = backParamsArray(superPropertyName)
    transporter('getSuperProperty', paramArray.argArray, callbackFun.name, callback)
  },
  // 获取超级属性
  getSuperProperties: function (callbackFun, callback) {
    transporter('getSuperProperties', [], callbackFun.name, callback)
  },
  // 页面初始化
  pageView: function (pageName, pageInfo, callback) {
    if (Util.checkTypeList(baseConfig.base.pageViewBlackList) || (baseConfig.base.pageViewWhiteList && !Util.checkTypeList(baseConfig.base.pageViewWhiteList))) return
    if (pageInfo) {
      pageInfo.$url = window.location.href
      pageInfo.$title = pageInfo.$title || document.title
    } else {
      pageInfo = {
        $url: window.location.href,
        $title: document.title
      }
    }
    if (Util.paramType(pageName) === 'String') {
      pageInfo.$title = pageName
    }
    if (window.AnalysysModule && window.AnalysysModule.pageClose && Util.paramType(window.AnalysysModule.pageClose.createTime) === 'Function') {
      window.AnalysysModule.pageClose.pageEndTrack()
      window.AnalysysModule.pageClose.createTime(+new Date(), pageInfo.$title)
    }
    var backParams = backParamsArray(pageName, pageInfo, callback)
    var paramArray = backParams.argArray
    transporter('pageView', paramArray, backParams.callback)
  },
  getDistinctId: function (callbackFun, callback) {
    transporter('getDistinctId', [], callbackFun.name, callback)
  },
  /**
     * 标记SDK存放目录
     * 如无该设置
     * 默认查询JS SDK 目录
     */
  SDKFileDirectory: ''
}

function loadIframeUrl (url, callback) {
  if (!document.body) {
    setTimeout(function () { loadIframeUrl(url, callback) }, 200)
    return
  }
  var iframe = document.createElement('iframe')
  iframe.setAttribute('src', url)
  iframe.setAttribute('id', 'AnalysysAgentIframe')
  iframe.setAttribute('style', 'display:none;')

  document.body.appendChild(iframe)
  iframe.parentNode.removeChild(iframe)
  if (Util.paramType(callback) === 'Function') {
    callback.call(callback)
  }
}

function transporter (funName, paramArray, callbackFunName, callback) {
  var params = {
    functionName: funName,
    functionParams: paramArray
  }
  if (Util.paramType(callbackFunName) === 'String') {
    params.callbackFunName = callbackFunName
  } else if (Util.paramType(callbackFunName) === 'Function') {
    callback = callbackFunName
  }
  var url = 'analysysagent:' + JSON.stringify(params)
  loadIframeUrl(url, callback)
}

function backParamsArray () {
  var arg = arguments
  var argArray = []
  var callback = null
  for (var i = 0; i < arg.length; i++) {
    if (arg[i] !== undefined) {
      if (Util.paramType(arg[i]) === 'Object') {
        for (var key in arg[i]) {
          if (Util.paramType(arg[i][key]) === 'Function') {
            arg[i][key] = arg[i][key].call(arg[i][key])
          }
        }
      }
      if (Util.paramType(arg[i]) === 'Function') {
        callback = arg[i]
      } else {
        argArray.push(arg[i])
      }
    }
  }
  return {
    argArray: argArray,
    callback: callback
  }
}

function initHybrid (initObj) {
  var pageProperty = null
  for (var i = 0; i < initObj.length; i++) {
    if (initObj[i][0] === 'pageProperty' && Util.paramType(initObj[i][1]) === 'Object') {
      pageProperty = initObj[i][1]
    }

    if (Util.paramType(hybridAns[initObj[i][0]]) === 'Function') {
      var args = initObj[i].length > 1 ? initObj[i].slice(1, initObj[i].length) : []
      hybridAns[initObj[i][0]].apply(hybridAns[initObj[i][0]], args)
    } else {
      baseConfig.base[initObj[i][0]] = initObj[i][1]
    }
  }
  if (baseConfig.base.auto === false) return
  if (pageProperty) {
    pageProperty.$url = window.location.href
    if (!Object.prototype.hasOwnProperty.call(pageProperty, '$title')) {
      pageProperty.$title = document.title
    }
  } else {
    pageProperty = { $url: pageHash, $title: document.title }
  }
  if (window.AnalysysModule && window.AnalysysModule.pageClose && Util.paramType(window.AnalysysModule.pageClose.createTime) === 'Function') {
    window.AnalysysModule.pageClose.createTime(+new Date(), pageProperty.$title)
  }
  if (baseConfig.base.hash === true || baseConfig.base.singlePage === true) {
    checkHash()
  }
  /**
     * 判断黑白名单
     * 符合黑名单，不上报
     * 有白名单，且不符合白名单，不上报
     */
  if (Util.checkTypeList(baseConfig.base.pageViewBlackList) || (baseConfig.base.pageViewWhiteList && !Util.checkTypeList(baseConfig.base.pageViewWhiteList))) return

  var paramArray = backParamsArray('', pageProperty)
  transporter('pageView', paramArray.argArray)
}
var pageHash = window.location.href

function hashView () {
  if (pageHash === window.location.href) return
  pageHash = window.location.href

  // var pageProperty = { $url: pageHash, $title: document.title }
  // var paramArray = backParamsArray('', pageProperty)
  // transporter('pageView', paramArray.argArray)
  hybridAns.pageView(document.title || '')
}

function checkHash () {
  Util.changeHash(function () {
    hashView()
  })
}

export { initHybrid, hybridAns }
