import Util from '../common/index.js'
import { successLog } from '../printLog/index.js'
function loadIframeUrl (url, callback) {
    if (!document.body) {
        setTimeout(function () { loadIframeUrl(url, callback) }, 200)
        return
    }
    var iframe = document.createElement('iframe')
    iframe.setAttribute('src', url)
    iframe.setAttribute('id', 'AnalysysAgentIframe')
    iframe.setAttribute('style', 'display:none;')

    document.body.appendChild(iframe)
    iframe.parentNode.removeChild(iframe)
}

function transporter (funName, paramArray, callbackFunName, callback) {
    var params = {
        functionName: funName,
        functionParams: paramArray
    }
    if (Util.paramType(callbackFunName) === 'String') {
        params.callbackFunName = callbackFunName
    } else if (Util.paramType(callbackFunName) === 'Function') {
        callback = callbackFunName
    }
    var msg = JSON.stringify(params)
    successLog('Send message to app: \ndata:' + msg)
    if (window.AnalysysModule && window.AnalysysModule.moduleStatus === true) {
        window.AnalysysModule.upData(params)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.AnalysysAgent) {
        postMessage(params)
    } else if (window.AnalysysAgentHybrid && window.AnalysysAgentHybrid.analysysHybridCallNative) {
        callNative(msg)
    } else {
        var url = 'analysysagent:' + msg
        loadIframeUrl(url)
    }
    if (Util.paramType(callback) === 'Function') {
        callback.call(callback)
    }
}

function backParamsArray () {
    var arg = arguments
    var argArray = []
    var callback = null
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] !== undefined) {
            if (Util.paramType(arg[i]) === 'Object') {
                for (var key in arg[i]) {
                    if (Util.paramType(arg[i][key]) === 'Function') {
                        arg[i][key] = arg[i][key].call(arg[i][key])
                    }
                }
            }
            if (Util.paramType(arg[i]) === 'Function') {
                callback = arg[i]
            } else {
                argArray.push(arg[i])
            }
        }
    }
    return {
        argArray: argArray,
        callback: callback
    }
}

function postMessage (obj) {
    window.webkit.messageHandlers.AnalysysAgent.postMessage(obj)
}
function callNative (msg) {
    window.AnalysysAgentHybrid.analysysHybridCallNative(msg)
}
export { transporter, backParamsArray }