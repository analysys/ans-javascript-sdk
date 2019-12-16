import Util from '../../../../lib/common/index.js'

var interval = null
var topValue = 0

function initWebStay() {
    var scroll = window.onscroll
    window.onscroll = function() {
        if (scroll && Util.paramType(scroll) === 'Function') {
            scroll()
        }
        clearTimeout(interval);
        interval = setTimeout(isScroll, 1000);
        topValue = document.documentElement.scrollTop || document.body.scrollTop;
    }

    function isScroll() {
        var m2 = document.documentElement.scrollTop || document.body.scrollTop
        if (topValue === m2) {
            clearTimeout(interval);
            interval = null;

            if (!AnalysysAgent || !AnalysysAgent.freeApi) {
                setTimeout(function() { isScroll() }, 100)
            } else {
                AnalysysAgent.freeApi('$webstay')
            }
        }
    }
    setTimeout(startScroll,1000)
}

function startScroll() {
    var fristScrollTop = document.documentElement.scrollTop || document.body.scrollTop 
    if (fristScrollTop== 0) {

        if (!AnalysysAgent || !AnalysysAgent.freeApi) {
            setTimeout(function() { startScroll() }, 100)
        } else {
            AnalysysAgent.freeApi('$webstay')
        }
    }
}

function autoWebstayInit(config) {
    if (config.autoHeatmap === true && config.autoWebstay === true) {
        initWebStay()
    }
    return config
}

export { autoWebstayInit }