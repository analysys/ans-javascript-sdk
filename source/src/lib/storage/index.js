/**
 * 存储模块。集中处理本地缓存内容
 * API：
 * 	Local相关:永久存储数据相关操作
 * 	session相关：临时存储数据相关操作
 * 	
 */

import Util from '../common/index.js'

var Local = window.localStorage
var Session = window.sessionStorage

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
        Local.setItem(this.localName, Util.encode(JSON.stringify(this.localObj)))
    } catch (e) {}
}

Storage.prototype.getLocal = function(key) {

    try {
        var localData = Local.getItem(this.localName)||Util.encode('{}')
        this.localObj = JSON.parse(Util.decode(localData))
        if (!key) {
            return this.localObj
        }
        return this.localObj[key]
    } catch (e) {
        return {}
    }
}

Storage.prototype.removeLocal = function(key) {
	this.localObj = this.getLocal()
	if(Util.objHasKay(this.localObj,key)){
		delete this.localObj[key]
	}

	if(Util.isEmptyObject(this.localObj)){
		try{
			Local.removeItem(this.localName)
		}catch(e){
		}
	}else{
		Local.setItem(this.localName,Util.encode(JSON.stringify(this.localObj)))
	}
}

Storage.prototype.setSession = function(key, value) {
    this.sessionObj = this.getSession()
    this.sessionObj[key] = value
    try {
        Session.setItem(this.sessionName, Util.encode(JSON.stringify(this.sessionObj)))
    } catch (e) {}
}

Storage.prototype.getSession = function(key) {

    try {
        var sessionData = Session.getItem(this.sessionName)||Util.encode('{}')
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
	if(Util.objHasKay(this.sessionObj,key)){
		delete this.sessionObj[key]
	}

	if(Util.isEmptyObject(this.sessionObj)){
		try{
			Session.removeItem(this.sessionName)
		}catch(e){
		}
	}else{
		Session.setItem(this.sessionName,Util.encode(JSON.stringify(this.sessionObj)))
	}
}

export default new Storage()