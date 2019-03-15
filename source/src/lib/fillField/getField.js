import baseConfig from '../baseConfig/index.js'
import Util from '../common/index.js'
import Storage from '../Storage/index.js'
// import UAParser from './ua-parser.js'
import UA from './UA/ua-device.js';
import sessionId from './sessionId.js'
import extractDomain from './domain.js'
import { checkSpider } from './spider.js'
import { UTM } from './UTM.js'

import {
    getId,
    setUUId,
    getUUId,
    removeUUId,
    setAliasId,
    getAliasId,
    removeAliasId,
    setIdentifyId,
    getIdentifyId,
    removeIdentifyId
} from './id.js'



var base = baseConfig.base

function appkey(appkey) {
    base.appid = appkey

}

function getAppId() {
    return base.appid
}

function debugMode(debug) {
    base.$debug = debug
}

function getDebugMode() {
    return base.$debug
}

function uploadURL(url) {
    if (url.charAt(url.length - 1) !== "/") {
        url += '/'
    }
    base.uploadURL = url
}

function getUploadURL(url) {
    if (base.uploadURL.charAt(base.uploadURL.length - 1) !== "/") {
        base.uploadURL += '/'
    }
    return base.uploadURL
}

function nowDate() {
    return +new Date() + (Storage.getLocal("ANSSERVERTIME") ? Number(Storage.getLocal("ANSSERVERTIME")) : 0)
}
function timeCalibration(){
    if(Storage.getLocal("ANSSERVERTIME")){
        return true
    }
    return false
}
function getXwhat() {
    return baseConfig.status.FnName
}

function isLogin() {

    return getAliasId() ? true : false
}

// var UAInfo = new UAParser();
// var parser = UAInfo.getResult()
// var os = parser.os.name || ''
// var os_version = (os + ' ' + parser.os.version) || ''
// var model = parser.device.model || ''
// var brand = parser.device.vendor || ''
// var browser = (os + ' ' + parser.browser.name) || ''
// var browser_version = browser + ' ' + (parser.browser.version || '')

var parser = new UA(navigator.userAgent);
var os = parser.os.name || ''
var os_version = parser.os.version && parser.os.version.original ? (os + ' ' + parser.os.version.original) : ''
var model = parser.device.model || ''
var brand = parser.device.manufacturer || ''
var browser = parser.browser.name ? parser.browser.name.indexOf(os) > -1 ? parser.browser.name : (os + ' ' + parser.browser.name) : ''
var browser_version = parser.browser.version && parser.browser.version.original ? (browser + ' ' + parser.browser.version.original) : ''

var time_zone = 'GMT' + Util.clientTimeZone()

var language = (navigator.language || navigator.browserLanguage).toLowerCase()

function getSessionId() {
    return sessionId.getId()
}

function is_first_time() {
    var timeStatus = Storage.getLocal("FRISTIME")
    Storage.setLocal("FRISTIME", false)
    return timeStatus
}

function is_first_day() {

    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    var day = date.getDate()
    day = day < 10 ? '0' + day : day

    var todayDate = year + '' + month + '' + day
    var storageDay = Storage.getLocal("FRISTDAY")
    if (storageDay && todayDate !== storageDay) {
        return false
    }
    // Storage.setLocal("FRISTDAY", todayDate)
    return true
}

function original_id() {
    return getIdentifyId() || getUUId()
}

function getReferrer() {
    return document.referrer
}

function getReferrerDomain() {
    return extractDomain(document.referrer)
}

function getTitle() {
    return document.title
}

function startup_time() {
    return Storage.getSession("STARTUPTIME") || ''
}

function getUrl() {
    return window.location.href
}

function getLibVersion() {
    return base.$lib_version
}


var old_UTM = Storage.getSession('ARK_UTM') || ''

if (UTM["utm_campaign_id"] && UTM["utm_source"] && UTM["utm_medium"]) {
    if (old_UTM !== JSON.stingify(UTM)) {
        sessionId.setId()
    }
    Storage.setSession('ARK_UTM', JSON.stringify(UTM))
} else {
    Storage.removeSession('ARK_UTM')
}

function utm_campaign_id() {
    return UTM["utm_campaign_id"]
}

function utm_source() {
    return UTM["utm_source"]
}

function utm_medium() {
    return UTM["utm_medium"]
}

function utm_term() {
    return UTM["utm_term"]
}

function utm_content() {
    return UTM["utm_content"]
}

function utm_campaign() {
    return UTM["utm_campaign"]
}


export {
    getAppId,
    getId,
    getUploadURL,
    appkey,
    debugMode,
    uploadURL,
    getDebugMode,
    nowDate,
    getXwhat,
    isLogin,
    os,
    os_version,
    model,
    brand,
    browser,
    browser_version,
    time_zone,
    language,
    getSessionId,
    is_first_time,
    is_first_day,
    original_id,
    getReferrer,
    getReferrerDomain,
    getTitle,
    getUrl,
    startup_time,
    checkSpider,
    getLibVersion,
    utm_campaign_id,
    utm_source,
    utm_medium,
    utm_term,
    utm_content,
    utm_campaign,
    timeCalibration
}