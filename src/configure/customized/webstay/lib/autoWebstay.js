import Util from '../../../../lib/common/index.js'

var interval = null
var topValue = 0

function initWebStay () {
  var scroll = window.onscroll
  window.onscroll = function () {
    if (scroll && Util.paramType(scroll) === 'Function') {
      scroll()
    }
    clearTimeout(interval)
    interval = setTimeout(isScroll, 1000)
    topValue = document.documentElement.scrollTop || document.body.scrollTop
  }

  function isScroll () {
    var m2 = document.documentElement.scrollTop || document.body.scrollTop
    if (topValue === m2) {
      clearTimeout(interval)
      interval = null

      if (!window.AnalysysAgent || !window.AnalysysAgent.freeApi) {
        setTimeout(function () { isScroll() }, 100)
      } else {
        window.AnalysysAgent.freeApi('$webstay')
      }
    }
  }
  // setTimeout(startScroll, 1000)
}

function startScroll () {
  if (!window.AnalysysAgent || !window.AnalysysAgent.freeApi || !document.body) {
    setTimeout(function () { startScroll() }, 100)
  } else {
    var fristScrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (fristScrollTop === 0) {

      window.AnalysysAgent.freeApi('$webstay')
    }
  }
}

function autoWebstayInit (config) {
  if (config.autoHeatmap === true && config.autoWebstay === true && config.isHybrid === false) {
    initWebStay()
  }
  return config
}

export { autoWebstayInit }
