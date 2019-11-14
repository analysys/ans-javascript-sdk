/**
 * 存储模块。集中处理本地缓存内容
 * API：
 *  Local相关:永久存储数据相关操作
 *  session相关：临时存储数据相关操作
 *  
 */

import Util from '../common/index.js'

var endings = ['/', ':', '?', '#'];
var starters = ['.', '/', '@'];

function getDomainFromUrl(url) {
    if (typeof url !== 'string') {
        return ''
    }

    let domainInc = 0;
    let offsetDomain = 0;
    let offsetStartSlice = 0;
    let offsetPath = 0;
    let len = url.length;
    let i = 0;

    // Find end offset of domain
    while (len-- && ++i) {
        if (domainInc && endings.toString().indexOf(url[i]) > -1) {
            break;
        }

        if (url[i] !== '.') {
            continue;
        }

        ++domainInc;

        offsetDomain = i;
    }

    offsetPath = i;

    i = offsetDomain;

    // Find offset before domain name.
    while (i--) {
        // Look for sub domain, protocol or basic auth
        if (starters.toString().indexOf(url[i]) === -1) {
            continue;
        }

        offsetStartSlice = i + 1;

        break;
    }

    // offsetStartSlice should always be larger than protocol
    if (offsetStartSlice < 2) {
        return '';
    }

    // Tried several approaches slicing a string. Can't get it any faster than this.
    return url.slice(offsetStartSlice, offsetPath);
}
var Local = ''
var Session = ''
try {
    Local = typeof window.localStorage == 'object' ? window.localStorage : ''
    Session = typeof window.sessionStorage == 'object' ? window.sessionStorage : ''
} catch (e) {}

function Storage() {
    this.localName = 'FZ_STROAGE'
    this.sessionName = 'FZ_SESSION'
    this.localObj = this.getLocal()
    this.sessionObj = this.getSession()
}

Storage.prototype.setLocal = function(key, value) {
    this.localObj = this.getLocal()
    this.localObj[key] = value
    try {
        if (!Local) {
            if (key !== 'POSTDATA') {
                this.setCookie(this.localName, encodeURIComponent(Util.encode(JSON.stringify(this.localObj))))
            }
        } else {
            Local.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
            Session.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
            this.removeCookie(this.localName)
        }
    } catch (e) {}
}

Storage.prototype.getLocal = function(key) {

    try {
        var localData = {}
        if (!Local) {

            localData = this.getCookie(this.localName)
            if (localData) {
                localData = decodeURIComponent(localData)
            } else {
                localData = Util.encode('{}')
            }

        } else {
            localData = Local.getItem(this.localName)
            if (!localData) {
                var sessionLocal = Session.getItem(this.localName)
                if (sessionLocal) {
                    localData = Session.getItem(this.localName)
                    Local.setItem(this.localName, localData)
                } else {
                    localData = Util.encode('{}')
                }
            }
            this.removeCookie(this.localName)
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

Storage.prototype.removeLocal = function(key) {
    this.localObj = this.getLocal()
    if (Util.objHasKay(this.localObj, key)) {
        delete this.localObj[key]
    }

    if (Util.isEmptyObject(this.localObj)) {
        try {
            if (!Local) {
                this.removeCookie(this.localName)
            } else {
                Local.removeItem(this.localName)
                Session.removeItem(this.localName)
                this.removeCookie(this.localName)
            }
        } catch (e) {}
    } else {
        if (!Local) {
            if (key !== 'POSTDATA' && key != 'ARK_ID') {
                this.setCookie(this.localName, Util.encode(JSON.stringify(this.localObj)))
            }
        } else {
            Local.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
            Session.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
            this.removeCookie(this.localName)
        }
    }
}

Storage.prototype.setSession = function(key, value) {
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
    } catch (e) {}
}

Storage.prototype.getSession = function(key) {

    try {
        var sessionData = {}
        if (!Session) {
            sessionData = this.getCookie(this.sessionName) || Util.encode('{}')
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

Storage.prototype.removeSession = function(key) {
    this.sessionObj = this.getSession()
    if (Util.objHasKay(this.sessionObj, key)) {
        delete this.sessionObj[key]
    }

    if (Util.isEmptyObject(this.sessionObj)) {
        try {
            if (!Local) {
                this.removeCookie(this.sessionName)
            } else {
                Session.removeItem(this.sessionName)
                this.removeCookie(this.sessionName)
            }
        } catch (e) {}
    } else {
        if (!Session) {
            if (key !== 'POSTDATA' && key != 'ARK_ID') {
                this.setCookie(this.sessionName, Util.encode(JSON.stringify(this.sessionObj)), 'session')
            }
        } else {
            Session.setItem(this.sessionName, Util.encode(JSON.stringify(this.sessionObj)))
            this.removeCookie(this.sessionName)
        }
    }
}
Storage.prototype.setCookie = function(name, value, type) {
    var urlDomain = getDomainFromUrl(location.href)
    var path = "; path=/"
    var domain = !urlDomain ? "" : ("; domain=." + urlDomain)

    var time = ""
    if (type !== 'session') {
        var date = new Date()
        date.setTime(date.getTime() + 1 * 365 * 24 * 60 * 60 * 1000)
        time = "; expires=" + date.toGMTString()
    }
    document.cookie = name + "=" + value + time + path + domain
}
Storage.prototype.getCookie = function(name) {
    var text = document.cookie
    if (typeof text !== "string") {
        return '';
    }
    var nameEQ = name + "=",
        ca = text.split(/[;&]/),
        i, c;
    for (i = 0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
}
Storage.prototype.removeCookie = function(name) {
    var urlDomain = getDomainFromUrl(location.href)
    var path = "; path=/"
    var domain = urlDomain ? "" : ("; domain=." + urlDomain)
    var date = new Date()
    date.setTime(date.getTime() - 1000)
    var time = date.toGMTString()
    document.cookie = name + "=; expires=" + time + path + domain
}

export default new Storage()