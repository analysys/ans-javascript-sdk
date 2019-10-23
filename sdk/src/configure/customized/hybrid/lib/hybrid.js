import Util from '../../../../lib/common/index.js'

var hybridAns = {
    //设置TRACKID
    identify: function(distinctId) {
        var paramArray = backParamsArray(distinctId)
        transporter("identify", paramArray)
    },
    //设置及关联LOGINID TRACKID
    alias: function(aliasId, originalId) {
        var paramArray = backParamsArray(aliasId, originalId)
        transporter("alias", paramArray)
    },
    //清除所有ID 超级属性 profile设置
    reset: function() {
        transporter("reset", [])
    },
    //自定义事件
    track: function(eventName, eventInfo) {
        var paramArray = backParamsArray(eventName, eventInfo)
        transporter("track", paramArray)

    },
    // 设置用户属性
    profileSet: function(propertyName, propertyValue) {
        var paramArray = backParamsArray(propertyName, propertyValue)
        transporter("profileSet", paramArray)
    },
    //设置用户超级属性
    profileSetOnce: function(propertyName, propertyValue) {
        var paramArray = backParamsArray(propertyName, propertyValue)
        transporter("profileSetOnce", paramArray)
    },
    //设置用户超级属性自增
    profileIncrement: function(propertyName, propertyValue) {
        var paramArray = backParamsArray(propertyName, propertyValue)
        transporter("profileIncrement", paramArray)
    },
    //增加用户超级属性
    profileAppend: function(propertyName, propertyValue) {
        var paramArray = backParamsArray(propertyName, propertyValue)
        transporter("profileAppend", paramArray)
    },
    //删除单个用户超级属性
    profileUnset: function(property) {
        var paramArray = backParamsArray(property)
        transporter("profileUnset", paramArray)
    },
    //删除所有用户超级属性
    profileDelete: function() {
        transporter("profileDelete", [])
    },
    //设置超级属性
    registerSuperProperty: function(superPropertyName, superPropertyValue) {
        var paramArray = backParamsArray(superPropertyName, superPropertyValue)
        transporter("registerSuperProperty", paramArray)
    },
    //
    registerSuperProperties: function(superPropertyName, superProperies) {
        var paramArray = backParamsArray(superPropertyName, superProperies)
        transporter("registerSuperProperties", paramArray)
    },
    //删除超级属性
    unRegisterSuperProperty: function(superPropertyName) {
        var paramArray = backParamsArray(superPropertyName)
        transporter("unRegisterSuperProperty", paramArray)
    },
    //清除超级属性
    clearSuperProperties: function() {
        transporter("clearSuperProperties", [])
    },
    // 获取单个超级属性
    getSuperProperty: function(superPropertyName, callbackFun) {
        var paramArray = backParamsArray(superPropertyName)
        transporter("getSuperProperty", paramArray, callbackFun.name)
    },
    // 获取超级属性
    getSuperProperties: function(callbackFun) {
        transporter("getSuperProperties", [], callbackFun.name)
    },
    //页面初始化
    pageView: function(pageName, pageInfo) {
        if (pageInfo) {
            pageInfo["$url"] = location.href
            pageInfo["$title"] = document.title
        } else {
            pageInfo = {
                '$url': location.href,
                '$title': document.title
            }
        }
        var paramArray = backParamsArray(pageName, pageInfo)
        transporter("pageView", paramArray)
    },
    getDistinctId:function(callbackFun){
        transporter("getDistinctId", [], callbackFun.name)
    }
}

function loadIframeUrl(url) {
    var iframe = document.createElement("iframe")
    iframe.setAttribute("src", url)
    iframe.setAttribute("id", "AnalysysAgentIframe")
    iframe.setAttribute("style", "display:none;")
    if (!document.body) {
        setTimeout(function() { loadIframeUrl(url) }, 200)
        return
    }
    document.body.appendChild(iframe)
    iframe.parentNode.removeChild(iframe)

}

function transporter(funName, paramArray, callbackFunName) {
    var params = {
        functionName: funName,
        functionParams: paramArray
    }
    if (callbackFunName !== undefined) {
        params["callbackFunName"] = callbackFunName
    }
    var url = "analysysagent:" + JSON.stringify(params)
    loadIframeUrl(url)
}

function backParamsArray() {
    var arg = arguments
    var argArray = []
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] !== undefined) {
            argArray.push(arg[i])
        }
    }
    return argArray
}

function initHybrid() {
    var initObj = window.AnalysysAgent
    var auto = true
    var pageProperty = null
    for (var i = 0; i < initObj.length; i++) {
        if (initObj[i][0] === 'auto' && initObj[i][1] === false) {
            auto = false
        }
        if (initObj[i][0] === 'pageProperty' && Util.paramType(initObj[i][1]) === 'Object') {
            pageProperty = initObj[i][1]
        }

        if (Util.paramType(hybridAns[initObj[i][0]]) === 'Function') {
            hybridAns[initObj[i][0]](initObj[i][1], initObj[i][2])
            continue
        }
    }
    if (auto === false) return;
    if (pageProperty) {
        pageProperty["$url"] = location.href
        pageProperty["$title"] = document.title
    } else {
        pageProperty = { '$url': pageHash, '$title': document.title }
    }
    var paramArray = backParamsArray('', pageProperty)
    transporter("pageView", paramArray)
    checkHash()
}
var pageHash = location.href

function hashView() {
    if (pageHash === location.href) return;
    pageHash = location.href

    var pageProperty = { '$url': pageHash, '$title': document.title }
    var paramArray = backParamsArray('', pageProperty)
    transporter("pageView", paramArray)
}

function checkHash() {
    Util.changeHash(function() {
            hashView()
    })
}

export { initHybrid, hybridAns }