import Storage from '../storage/index.js'
import Util from '../common/index.js'
import baseConfig from '../baseConfig/index.js'

function getJSON (data) {
  if (Util.paramType(data) === 'String') {
    if (data.indexOf('\n') > -1) {
      data = data.replace(/[\r\n]/g, '')
    }

    try {
      return JSON.parse(data)
    } catch (e) { }
    try {
      return window.AnalysysModule.zipInflate(data)
    } catch (e) { }
    if (data === 'H4sIAAAAAAAAAKtWSs5PSVWyMjIwqAUAVAOW6gwAAAA=') {
      return {
        code: 200
      }
    } else if (data === 'H4sIAAAAAAAAAKtWSs5PSVWyMjUwqAUA7TtBdwwAAAA=') {
      return {
        code: 500
      }
    } else if (data === 'H4sIAAAAAAAAAKtWSs5PSVWyMjEy0FHKLU5XslJySSxJVHBJTS6qLChRcC0qyi/S01OqBQBdATGSKQAAAA==') {
      return {
        code: 420
      }
    }
    return {
      code: 200
    }
  } else if (Util.paramType(data) === 'Object') {
    return data
  } else {
    return {
      code: 200
    }
  }
}

function GetHttpObj () {
  var httpobj = null
  if (window.XDomainRequest) {
    return new window.XDomainRequest()
  }
  if (window.XMLHttpRequest) {
    httpobj = new window.XMLHttpRequest()
  } else {
    try {
      httpobj = new window.ActiveXObject('Microsoft.XMLHTTP')
    } catch (e) {
      try {
        httpobj = new window.ActiveXObject('Msxml2.XMLHTTP')
      } catch (e1) {
        httpobj = new window.XMLHttpRequest()
      }
    }
  }
  return httpobj
}

function xmlhttp (_this) {
  var sendStatus = false
  var xhr = new GetHttpObj()
  // xhr.setRequestHeader("reqt",+new Date())
  // xhr.setRequestHeader("reqv",1)
  xhr.onload = function () {
    if (sendStatus) return
    sendStatus = true
    _this.success(getJSON(xhr.responseText), xhr)
  }
  xhr.onerror = function () {
    if (sendStatus) return
    sendStatus = true
    _this.error(getJSON(xhr.responseText), xhr)
  }
  xhr.onreadystatechange = (function (xhr, _this) {
    return function () {
      if (xhr.readyState === 4) {
        try {
          if (xhr.getAllResponseHeaders().indexOf('Date') > -1 || xhr.getAllResponseHeaders().indexOf('date') > -1) {
            var time = +new Date()
            var date = xhr.getResponseHeader('Date') || xhr.getResponseHeader('date')
            if (date && baseConfig.base.allowTimeCheck === true) {
              Storage.setLocal('ANSSERVERTIME', +new Date(date) - time)
            } else {
              Storage.setLocal('ANSSERVERTIME', 0)
            }
          }
        } catch (e) { }

        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          if (sendStatus) return
          sendStatus = true
          _this.success(getJSON(xhr.responseText), xhr)
        } else {
          if (sendStatus) return
          sendStatus = true
          _this.error()
        }
        xhr.onreadystatechange = null
        xhr.onload = null
      }
    }
  })(xhr, _this)
  try {
    xhr.open(_this.type, _this.url, true)
    // xhr.setRequestHeader("Content-Type","multipart/form-data")
    try {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    } catch (e) { }
    var timeNum = baseConfig.base.sendDataTimeout
    if (_this.type === 'GET') {
      timeNum = baseConfig.base.getDataTimeout
      xhr.send(null)
    } else {
      xhr.send(_this.data)
    }

    if (Util.paramType(timeNum) === 'Number') {
      if (Util.paramType(xhr.timeout) === 'Number') {
        xhr.timeout = timeNum
      } else {
        var timeCallback = (function (xhr) {
          return function () {
            xhr.abort()
          }
        })(xhr)
        setTimeout(timeCallback, timeNum)
      }

    }
  } catch (e) {
  }
}

// function lengthBaty(str) {
//     var bytesCount = 0
//     for (var i = 0; i < str.length; i++) {
//         var c = str.charAt(i)
//         if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
//         {
//             bytesCount += 1
//         } else {
//             bytesCount += 2
//         }
//     }
//     return bytesCount
// }

function ajax () {
  this.url = ''
  this.data = ''
  this.type = 'GET'
  this.success = function () { }
  this.error = function () { }
}
ajax.prototype.get = function (option) {
  var param = []
  for (var key in option.data) {
    param.push(key + '=' + encodeURIComponent(option.data[key]))
  }
  var url = option.url.indexOf('?') > -1 ? (option.url + '&' + param.join('&')) : (option.url + '?' + param.join('&'))
  this.url = url
  this.data = option.data
  this.type = 'GET'
  this.success = option.success || function () { }
  this.error = option.error || function () { }
  xmlhttp(this)
}
ajax.prototype.post = function (option) {
  this.url = option.url
  this.data = option.data
  this.type = 'POST'
  this.success = option.success || function () { }
  this.error = option.error || function () { }
  xmlhttp(this)
}
export default ajax
