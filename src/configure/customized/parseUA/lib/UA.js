import UA from './UA/ua-device.js'

// var UAInfo = new UAParser();
// var parser = UAInfo.getResult()
// var os = parser.os.name || ''
// var os_version = (os + ' ' + parser.os.version) || ''
// var model = parser.device.model || ''
// var brand = parser.device.vendor || ''
// var browser = (os + ' ' + parser.browser.name) || ''
// var browser_version = browser + ' ' + (parser.browser.version || '')

var parser = new UA(navigator.userAgent)
var os = parser.os.name || ''
var osVersion = parser.os.version && parser.os.version.original ? (os + ' ' + parser.os.version.original) : ''
var model = parser.device.model || ''
var brand = parser.device.manufacturer || ''
var browser = parser.browser.name ? parser.browser.name.indexOf(os) > -1 ? parser.browser.name : (os + ' ' + parser.browser.name) : ''
var browserVersion = parser.browser.version && parser.browser.version.original ? (browser + ' ' + parser.browser.version.original) : ''
var deviceType = 'desktop'
switch (parser.device.type) {
  case 'mobile':
    deviceType = 'phone'
    break
  case 'tablet':
    deviceType = 'tablet'
    break
  default:
    break
}
export {
  os,
  osVersion,
  model,
  brand,
  browser,
  browserVersion,
  deviceType
}
