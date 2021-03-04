var ua = window.navigator.userAgent.toLowerCase()

function isPhone () {
  var isMobile = /Mobile(\/|\s)/.test(ua)

  // Either:
  // - iOS but not iPad
  // - Android 2
  // - Android with "Mobile" in the UA

  return /(iPhone|iPod)/.test(ua) ||
    (!/(Silk)/.test(ua) && (/(Android)/.test(ua) && (/(Android 2)/.test(ua) || isMobile))) ||
    (/(BlackBerry|BB)/.test(ua) && isMobile) ||
    /(Windows Phone)/.test(ua)
}

function isTablet () {
  return !isPhone() && (/iPad/.test(ua) || /Android/.test(ua) || /(RIM Tablet OS)/.test(ua) ||
    (/MSIE 10/.test(ua) && /; Touch/.test(ua)))
}

function isMobile () {
  if (isPhone()) {
    return 'phone'
  }
  if (isTablet()) {
    return 'tablet'
  }
  return 'desktop'
}
var deviceType = isMobile() || ''
export { deviceType }
