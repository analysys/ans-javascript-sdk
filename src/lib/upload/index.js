import Util from '../common/index.js'
import LogAjax from './ajax.js'
import Storage from '../storage/index.js'
import baseConfig from '../baseConfig/index.js'
import { errorLog, successLog } from '../printLog/index.js'
import { lifecycle } from '../../configure/index.js'

var postStatus = true
var sendType = 'img'
var rxDangerous = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g

function delRx (list) {
  if (Util.paramType(list) === 'Array') {
    for (var i = 0; i < list.length; i++) {
      list[i] = delRx(list[i])
    }
  }
  if (Util.paramType(list) === 'Object') {
    for (var key in list) {
      var value = list[key]
      list[key] = delRx(value)
    }
  }
  if (Util.paramType(list) === 'String') {
    var rplist = list.replace(rxDangerous, function (a) {
      return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
    })
    if (Util.paramType(rplist) !== 'Sting') {
      return list
    } else {
      return rplist
    }
  }
  return list
}

function sendPost (data, callback) {
  if (Util.GetUrlParam('visual') && Util.GetUrlParam('visual').indexOf('true') > -1) {
    return
  }
  if (sendType !== 'img') {
    postStatus = false
  }

  var msg = data
  if (Util.paramType(data) === 'Array') {
    data = delRx(data)
    msg = JSON.stringify(data)
  }
  if (window.AnalysysModal && typeof (window.AnalysysModal) === 'function') {
    window.AnalysysModal(data)
  }
  // 发送日志发送失败，进入缓存序列
  var error = function () {
    postStatus = true
    baseConfig.status.errorCode = '60008'
    errorLog()
    Util.paramType(callback) === 'Function' && callback.call(callback)
  }
  // 发送成功后，将缓存序列对应数据去除
  var successCheckPost = function (data) {
    postStatus = true

    var postDataList = Storage.getLocal('POSTDATA') || []
    if (Util.isEmptyObject(postDataList)) {
      postDataList = []
      Storage.removeLocal('POSTDATA')
    }
    if (postDataList.length === 0) {
      Storage.removeLocal('POSTDATA')
      return
    }
    var saveData = []
    for (var i = 0; i < postDataList.length; i++) {
      var delData = false
      for (var y = 0; y < data.length; y++) {
        if (data[y].xwhen === postDataList[i].xwhen || !data[y].xwhen || !postDataList[i].xwhen) {
          delData = true
        }
      }
      if (delData === false && Util.paramType(postDataList[i]) === 'Object' && !Util.isEmptyObject(postDataList[i])) {
        saveData.push(postDataList[i])
      }
    }
    if (saveData.length > 0 && sendType !== 'img') {
      Storage.setLocal('POSTDATA', saveData)
      sendPost(saveData)
    } else {
      Storage.removeLocal('POSTDATA')
    }
  }
  // 发送成功执行
  var success = (function (data) {
    return function (msg) {
      if (msg.code === 200 || msg.code === 400 || msg.code === 4200) {
        baseConfig.status.successCode = '20001'
        successLog()
        successCheckPost(data)
        if (Util.paramType(callback) === 'Function') {
          callback.call(callback)
        }
      } else {
        error()
      }
    }
  })(data)
  var url = baseConfig.base.uploadURL + 'up?appid=' + baseConfig.base.appid
  var postMsg = {
    url: url,
    data: msg,
    success: success,
    error: error
  }
  successLog('Send message to server: ' + baseConfig.base.uploadURL + 'up?appid=' + baseConfig.base.appid + '\ndata:' + msg)
  if (lifecycle.upload && lifecycle.upload.init) {
    postMsg = lifecycle.upload.init(postMsg)
  } else if (window.AnalysysModule && Util.paramType(window.AnalysysModule) === 'Object' && Util.paramType(window.AnalysysModule.uploadData) === 'Function') {
    window.AnalysysModule.encryptInit(baseConfig.base)
    postMsg = window.AnalysysModule.uploadData(postMsg)
  }
  // if (sendType === 'get') {
  //   snedGet(postMsg)
  //   return
  // }
  if (sendType === 'img') {
    snedGet(postMsg, 'img')
    return
  }
  if (sendType === 'post') {
    new LogAjax().post(postMsg)
    return
  }
  if (sendType === 'send') {
    snedGet(postMsg, 'send')
    return
  }
  new LogAjax().post(postMsg)
}

function setValidKey (option) {
  var data = {
    data: option.data,
    send_type: ''
  }
  var param = []
  for (var key in data) {
    param.push(key + '=' + encodeURIComponent(data[key]))
  }
  var validurl = option.url.indexOf('?') > -1 ? (option.url + '&' + param.join('&')) : (option.url + '?' + param.join('&'))

  validurl = validurl.replace(baseConfig.base.uploadURL, '/')

  var validValue = Util.MD5(validurl, 32).split('')
  var validkey = validValue[2] + '' + validValue[0] + '' + validValue[4]
  data.send_type = validkey
  return data
}

function snedGet (option, type) {
  if (type === 'send' && navigator.sendBeacon) {
    var sendStatus = navigator.sendBeacon(option.url, option.data)
    if (sendStatus) {
      option.success({
        code: 200
      })
    }
    return
  }
  if (type === 'send' && !navigator.sendBeacon) {
    type = 'img'
  }
  option.data = Util.encode(option.data)
  option.data = setValidKey(option)
  // option.data = {
  //   data: option.data,
  //   send_type: validkey
  // }
  if (type === 'img') {
    var param = []
    for (var key in option.data) {
      param.push(key + '=' + encodeURIComponent(option.data[key]))
    }
    var url = option.url.indexOf('?') > -1 ? (option.url + '&' + param.join('&')) : (option.url + '?' + param.join('&'))

    var dom = document
    var createImg = dom.createElement('img')
    var sendTimer = null
    createImg.width = 1
    createImg.height = 1
    createImg.onerror = createImg.onload = function () {
      clearTimeout(sendTimer)
      option.success({ code: 200 })
      this.src = ''
      this.onload = null
      this.onerror = null
      this.onabort = null
    }
    createImg.onabort = function () {
      this.src = ''
      this.onload = null
      this.onerror = null
      this.onabort = null
      option.error()
    }
    if (Util.paramType(baseConfig.base.sendDataTimeout) === 'Number') {
      sendTimer = setTimeout(function () {
        createImg.onabort()
      }, baseConfig.base.sendDataTimeout)
    }
    createImg.src = url
  }
}

function checkLogBaseJson (obj) {
  if (Util.paramType(obj) === 'Object' && !Util.isEmptyObject(obj)) {
    var status = true
    for (var i = 0; i < baseConfig.baseJson.length; i++) {
      var key = baseConfig.baseJson[i]
      if (key === 'xwhat') {
        continue
      }
      if (!obj[key] || (Util.paramType(obj[key]) === 'Object' && Util.isEmptyObject(obj[key]))) {
        status = false
      }
    }
    return status
  }
  return false
}

function checkSavaData (list) {
  var dataList = []
  if (Util.paramType(list) === 'Array' && list.length > 0) {
    for (var i = 0; i < list.length; i++) {
      var itemList = checkSavaData(list[i])
      if (itemList.length > 0) {
        dataList.push.apply(dataList, itemList)
      }
    }
  }
  if (Util.paramType(list) === 'Object' && !Util.isEmptyObject(list) &&
    checkLogBaseJson(list)) {
    dataList.push(list)
  }
  return dataList
}

function upLog (log, callback) {
  try {
    if (baseConfig.base.sendType) {
      sendType = baseConfig.base.sendType
    }
    if (baseConfig.base.uploadURL.charAt(baseConfig.base.uploadURL.length - 1) !== '/') {
      baseConfig.base.uploadURL += '/'
    }

    var upData = []
    if (sendType === 'img') {
      upData = checkSavaData(log)
    } else {
      var postDataList = Storage.getLocal('POSTDATA') || []
      postDataList = checkSavaData(postDataList)

      if (postDataList.length === 0) {
        Storage.removeLocal('POSTDATA')
      }
      upData = postDataList
      if (postDataList.length < 500) {
        upData.push.apply(upData, checkSavaData(log))
      } else {
        upData = checkSavaData(log)
      }
      Storage.setLocal('POSTDATA', upData)
    }

    if (postStatus === false && sendType !== 'img') {
      Util.paramType(callback) === 'Function' && callback.call(callback)
      return
    }
    if (upData.length > 0) {
      if (sendType === 'img') {
        for (var i = 0; i < upData.length; i++) {
          if (i === 0) {
            sendPost([upData[i]], callback)
          } else {
            sendPost([upData[i]])
          }
        }
      } else {
        sendPost(upData, callback)
      }
    }
  } catch (e) {
  }
}

export { upLog }
