/**
 * 存储模块。集中处理本地缓存内容
 * API：
 *  Local相关:永久存储数据相关操作
 *  session相关：临时存储数据相关操作
 *
 */

import Util from '../common/index.js'
import baseConfig from '../baseConfig/index.js'


var Local = ''
var Session = ''
try {
  Local = typeof window.localStorage === 'object' ? window.localStorage : ''
  Session = typeof window.sessionStorage === 'object' ? window.sessionStorage : ''
} catch (e) { }

function Storage () {
  this.localName = 'FZ_STROAGE'
  this.sessionName = 'FZ_SESSION'
  this.cookieName = 'FZ_STROAGE' + '.' + Util.getDomainFromUrl(baseConfig.base.cross_subdomain)
  this.checkSubdomain()
  this.localObj = this.getLocal()
  this.sessionObj = this.getSession()
}
Storage.prototype.checkSubdomain = function () {
  var ans = window.AnalysysAgent || []
  if (Util.paramType(ans) === 'Array') {
    for (var i = 0; i < ans.length; i++) {
      if (ans[i][0] === 'cross_subdomain' && Util.paramType(ans[i][1]) === 'Boolean') {
        baseConfig.base.cross_subdomain = ans[i][1]
      }
    }
  }
  if (ans && Util.objHasKay(ans.config || {}, 'cross_subdomain')) {
    baseConfig.base.cross_subdomain = ans.config.cross_subdomain
  }
  if (baseConfig.base.cross_subdomain === true) {
    var cookieObj = this.getCookie(this.cookieName) || Util.encode('{}')
    cookieObj = JSON.parse(Util.decode(decodeURIComponent(cookieObj)))
    if (Util.paramType(cookieObj) === 'Object' && !Util.isEmptyObject(cookieObj)) {
      var cookieId = cookieObj['ARK_ID']
      var cookieSuper = {}
      if (Util.objHasKay(cookieObj, 'ARKSUPER') === true) {
        cookieSuper = cookieObj['ARKSUPER']
        delete cookieObj['ARKSUPER']
      }
      var mergeObj = Util.objMerge(this.localObj || {}, cookieObj)
      if (baseConfig.base.cross_subdomain_super === true && !Util.isEmptyObject(cookieSuper)) {
        mergeObj = Util.objMerge({ 'ARKSUPER': cookieSuper }, mergeObj)
      }
      this.setLocal(this.localName, mergeObj)
      this.setCookie('ARK_ID', cookieId)
    }
  }
}
Storage.prototype.setLocal = function (key, value) {
  this.localObj = this.getLocal()
  if (key === this.localName) {
    this.localObj = value
  } else {
    this.localObj[key] = value
  }
  try {
    if (!Local) {
      if (key !== 'POSTDATA') {
        this.setCookie(this.cookieName, encodeURIComponent(Util.encode(JSON.stringify(this.localObj))))
      }
    } else {
      Local.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
      Session.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
    }
    if (key !== 'POSTDATA' && baseConfig.base.cross_subdomain === true) {
      var saveLocalObj = Util.toDeep(this.localObj)
      delete saveLocalObj['POSTDATA']
      this.setCookie(this.cookieName, encodeURIComponent(Util.encode(JSON.stringify(saveLocalObj))))
    }
  } catch (e) { }
}

Storage.prototype.getLocal = function (key) {
  try {
    var localData = Util.encode('{}')
    if (!Local) {
      localData = this.getCookie(this.cookieName)
      if (localData) {
        localData = decodeURIComponent(localData)
      } else {
        localData = Util.encode(JSON.stringify(this.localObj))
      }
    } else {
      localData = Local.getItem(this.localName)
      if (!localData) {
        var sessionLocal = Session.getItem(this.localName)
        if (sessionLocal) {
          localData = Session.getItem(this.localName)
          Local.setItem(this.localName, localData)
        }
      }
    }
    this.localObj = JSON.parse(Util.decode(localData))
    if (!key) {
      return this.localObj
    }
    return this.localObj[key]
  } catch (e) {
    if (!key) {
      return {}
    } else {
      return ''
    }
  }
}

Storage.prototype.removeLocal = function (key) {
  this.localObj = this.getLocal()
  if (Util.objHasKay(this.localObj, key)) {
    delete this.localObj[key]
  }

  if (Util.isEmptyObject(this.localObj)) {
    try {
      if (Local) {
        Local.removeItem(this.localName)
        Session.removeItem(this.localName)
      }
      this.removeCookie(this.cookieName)
    } catch (e) { }
  } else {
    if (Local) {
      Local.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
      Session.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
    }
    if (key !== 'POSTDATA' && key !== 'ARK_ID' && baseConfig.base.cross_subdomain === true) {
      var saveLocalObj = Util.toDeep(this.localObj)
      delete saveLocalObj['POSTDATA']
      delete saveLocalObj['ARK_ID']

      this.setCookie(this.cookieName, Util.encode(JSON.stringify(saveLocalObj)))
    }
  }
}

Storage.prototype.setSession = function (key, value) {
  this.sessionObj = this.getSession()
  this.sessionObj[key] = value
  try {
    if (!Session) {
      if (key !== 'POSTDATA') {
        this.setCookie(this.sessionName, Util.encode(JSON.stringify(this.sessionObj)), 'session')
      }
    } else {
      Session.setItem(this.sessionName, Util.encode(JSON.stringify(this.sessionObj)))
      this.removeCookie(this.sessionName)
    }
  } catch (e) { }
}

Storage.prototype.getSession = function (key) {
  try {
    var sessionData = Util.encode('{}')
    if (!Session) {
      sessionData = this.getCookie(this.sessionName)
      if (!sessionData) {
        sessionData = Util.encode(JSON.stringify(this.sessionObj))
      }
    } else {
      sessionData = Session.getItem(this.sessionName) || Util.encode('{}')
      this.removeCookie(this.sessionName)
    }
    this.sessionObj = JSON.parse(Util.decode(sessionData))

    if (!key) {
      return this.sessionObj
    }
    return this.sessionObj[key]
  } catch (e) {
    return {}
  }
}

Storage.prototype.removeSession = function (key) {
  this.sessionObj = this.getSession()
  if (Util.objHasKay(this.sessionObj, key)) {
    delete this.sessionObj[key]
  }

  if (Util.isEmptyObject(this.sessionObj)) {
    try {
      if (!Session) {
        this.removeCookie(this.sessionName)
      } else {
        Session.removeItem(this.sessionName)
        this.removeCookie(this.sessionName)
      }
    } catch (e) { }
  } else {
    if (Session) {
      Session.setItem(this.sessionName, Util.encode(JSON.stringify(this.sessionObj)))
    }
    // if (key !== 'POSTDATA' && key !== 'ARK_ID') {
    //   this.setCookie(this.sessionName, Util.encode(JSON.stringify(this.sessionObj)), 'session')
    // }
  }
}
Storage.prototype.setCookie = function (name, value, type) {
  // if (this.getCookie(name) && this.getCookie(name) !== value) {
  //   this.removeCookie(name, !baseConfig.base.cross_subdomain, type)
  // }
  // this.removeCookie(name, baseConfig.base.cross_subdomain, type)
  var urlDomain = '.' + Util.getDomainFromUrl(baseConfig.base.cross_subdomain)
  var path = '; path=/'
  var domain = !urlDomain ? '' : ('; domain=' + urlDomain)
  var time = ''
  if (type !== 'session') {
    var date = new Date()
    date.setTime(date.getTime() + 1 * 365 * 24 * 60 * 60 * 1000)
    time = '; expires=' + date.toGMTString()
  }
  document.cookie = name + '=' + value + time + path + domain
}
Storage.prototype.getCookie = function (name) {
  name = name || this.localName
  var text = document.cookie
  if (typeof text !== 'string') {
    return ''
  }
  var nameEQ = name + '='
  var ca = text.split(/[;&]/)
  var i; var c
  for (i = 0; i < ca.length; i++) {
    c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length) || ''
    }
  }
}
Storage.prototype.removeCookie = function (name, domainStatus, type) {
  domainStatus = Util.paramType(domainStatus) === 'Boolean' ? domainStatus : baseConfig.base.cross_subdomain
  var urlDomain = '.' + Util.getDomainFromUrl(domainStatus)
  var path = '; path=/'
  var domain = !urlDomain ? '' : ('; domain=' + urlDomain)
  if (type !== 'session') {
    var date = new Date()
    date.setTime(date.getTime() - 3 * 365 * 24 * 60 * 60 * 1000)
    var time = '; expires=' + date.toGMTString()
  }
  document.cookie = name + '=' + time + path + domain
}


export default new Storage()
