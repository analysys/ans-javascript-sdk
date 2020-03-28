import baseConfig from '../baseConfig/index.js'
import Util from '../common/index.js'
import Storage from '../storage/index.js'
import sessionId from './sessionId.js'
import extractDomain from './domain.js'
import { checkSpider } from './spider.js'
import { UTM, clearUTM } from './UTM.js'

import { getId, getUUId, getAliasId, getIdentifyId } from './id.js'

var base = baseConfig.base

function appkey (appkey) {
  base.appid = appkey
}

function getAppId () {
  return base.appid
}

function debugMode (debug) {
  base.$debug = debug
}

function getDebugMode () {
  return base.$debug
}

function uploadURL (url) {
  if (url.charAt(url.length - 1) !== '/') {
    url += '/'
  }
  base.uploadURL = url
}

function getUploadURL () {
  if (base.uploadURL.charAt(base.uploadURL.length - 1) !== '/') {
    base.uploadURL += '/'
  }
  return base.uploadURL
}

function nowDate () {
  return +new Date() + (Storage.getLocal('ANSSERVERTIME') ? Number(Storage.getLocal('ANSSERVERTIME')) : 0)
}

function timeCalibration () {
  if (Storage.getLocal('ANSSERVERTIME')) {
    return true
  }
  return false
}

function getXwhat () {
  return baseConfig.status.FnName
}

function isLogin () {
  return !!((getAliasId() || Storage.getLocal('ARK_TRACK_LOGIN')))
}

var timeZone = 'GMT' + Util.clientTimeZone()

var language = (navigator.language || navigator.browserLanguage).toLowerCase()

// var device_type = deviceType

function getSessionId () {
  return sessionId.getId()
}

function isFirstTime () {
  var timeStatus = Storage.getLocal('FRISTIME')
  Storage.setLocal('FRISTIME', false)
  return timeStatus
}

function isFirstDay () {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  month = month < 10 ? '0' + month : month
  var day = date.getDate()
  day = day < 10 ? '0' + day : day

  var todayDate = year + '' + month + '' + day
  var storageDay = Storage.getLocal('FRISTDAY')
  if (storageDay && todayDate !== storageDay) {
    return false
  }
  // Storage.setLocal("FRISTDAY", todayDate)
  return true
}

function originalId () {
  return getIdentifyId() || getUUId()
}

function getReferrer () {
  return document.referrer
}

function getReferrerDomain () {
  return extractDomain(document.referrer)
}

function getTitle () {
  return document.title
}

function startupTime () {
  return Storage.getSession('STARTUPTIME') || ''
}

function getUrl () {
  return window.location.href
}

function getLibVersion () {
  return base.$lib_version
}

function getScreenWidth () {
  var width = Util.paramType(Number(window.screen.width)) === 'Number' ? Number(window.screen.width) : 0
  return width
}

function getScreenHeight () {
  var height = Util.paramType(Number(window.screen.height)) === 'Number' ? Number(window.screen.height) : 0
  return height
}
/**
 * UTM参数控制逻辑
 * UTM参数改变切换session
 * UTM参数不满足条件 清空UTM参数
 */

var oldUTM = Storage.getSession('ARK_UTM') || ''

if (UTM.utm_campaign || UTM.utm_source || UTM.utm_medium || UTM.campaign_id || UTM.utm_term || UTM.utm_content) {
  if (oldUTM !== JSON.stringify(UTM)) {
    sessionId.setId()
  }
  Storage.setSession('ARK_UTM', JSON.stringify(UTM))
} else {
  clearUTM()
  Storage.removeSession('ARK_UTM')
}

function utmCampaignId () {
  return UTM.utm_campaign_id
}

function utmSource () {
  return UTM.utm_source
}

function utmMedium () {
  return UTM.utm_medium
}

function utmTerm () {
  return UTM.utm_term
}

function utmContent () {
  return UTM.utm_content
}

function utmCampaign () {
  return UTM.utm_campaign
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
  timeZone,
  language,
  getSessionId,
  isFirstTime,
  isFirstDay,
  originalId,
  getReferrer,
  getReferrerDomain,
  getTitle,
  getUrl,
  getScreenWidth,
  getScreenHeight,
  startupTime,
  checkSpider,
  getLibVersion,
  utmCampaignId,
  utmSource,
  utmMedium,
  utmTerm,
  utmContent,
  utmCampaign,
  timeCalibration
  // device_type
}
