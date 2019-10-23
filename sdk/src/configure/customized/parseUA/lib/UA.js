import UA from './UA/ua-device.js';

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
var device_type = 'desktop'
switch(parser.device.type){
	case 'mobile':
		device_type='phone'
		break;
	case 'tablet':
		device_type='tablet'
		break;
	default:
		break;
}
export {
    os,
    os_version,
    model,
    brand,
    browser,
    browser_version,
    device_type
}