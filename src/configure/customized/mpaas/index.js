import Util from '../../../lib/common/index.js'
var moduleStatus = Util.isiOS === true ? true : false
function isHybrid () {
    document.addEventListener("AlipayJSBridgeReady", function () {
        window.AlipayJSBridge.call('isHybrid', {}, function (msg) {
            if (msg === true) {
                // console.log('mPaas 启动Hybrid模式')
                checkAnalysys()
            }
        })
    })
}
function checkAnalysys () {
    if (window.AnalysysAgent && Util.paramType(window.AnalysysAgent.init) === 'Function') {
        var config = Util.objMerge(window.AnalysysAgent.config || {}, {
            isHybrid: true
        })
        window.AnalysysAgent.init(config)
    } else {
        setTimeout(checkAnalysys, 30)
    }
}
var checkNum = 0
function checkBridge () {
    if (checkNum > 3) {

        if (checkNum > 5) {
            // console.log('mPaas Hybrid模式失败,为正常接入JS SDK')
            return
        } else if (window.AnalysysAgent && Util.paramType(window.AnalysysAgent.init) === 'Function') {
            window.AnalysysAgent.init({
                isARKH5: true
            })
        } else {
            checkNum++
            setTimeout(checkBridge, 300)
        }
        return
    }
    if (window.AlipayJSBridge) {
        isHybrid()
    } else {
        setTimeout(checkBridge, 300)
    }
    checkNum++
}
if (window.AnalysysAgent && !window.AnalysysAgent.isInit && moduleStatus === true) {
    checkBridge()
}

function upData (params) {
    // var callback = (function (params) {
    //     return function (resulut) {
    //         if (resulut.resulut === 'failure') {
    //             BaseUpdata(params)
    //         }
    //     }
    // })(params)
    // window.AlipayJSBridge.call('analysysAgentCallNaitve', params, callback)
    BaseUpdata(params)
}
function BaseUpdata (params) {
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.AnalysysAgent) {
        window.webkit.messageHandlers.AnalysysAgent.postMessage(params)
    } else {
        var msg = JSON.stringify(params)
        var url = 'analysysagent:' + msg
        loadIframeUrl(url)
    }
}
function loadIframeUrl (url) {
    if (!document.body) {
        setTimeout(function () { loadIframeUrl(url) }, 200)
        return
    }
    var iframe = document.createElement('iframe')
    iframe.setAttribute('src', url)
    iframe.setAttribute('id', 'AnalysysAgentIframe')
    iframe.setAttribute('style', 'display:none;')

    document.body.appendChild(iframe)
    iframe.parentNode.removeChild(iframe)
}
function track (eventName, pro, elePostion) {
    window.AlipayJSBridge.call('AnalysysAgentTrack', { 'props': [eventName, JSON.stringify(pro), JSON.stringify(elePostion)] }, function () { });

}
function eventList () {
    window.AlipayJSBridge.call('AnalysysAgentGetEventList', {}, function () { });

}
function getPro (appRelateds, timeId) {
    window.AlipayJSBridge.call('AnalysysAgentGetProperty', { 'props': [JSON.stringify(appRelateds), timeId] }, function () { });

}
function onEvent (hybridKey, HybridAns) {
    return HybridAns[hybridKey]
}
window.AnalysysModule = Util.objMerge(window.AnalysysModule || {}, {
    moduleStatus: moduleStatus,
    isHybrid: isHybrid,
    upData: upData,
    track: track,
    eventList: eventList,
    getPro: getPro,
    onEvent: onEvent
})