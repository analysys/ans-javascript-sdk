import Util from '../common/index.js'
import ajax from './ajax.js'
import Storage from '../storage/index.js'
import baseConfig from '../baseConfig/index.js'
import {
    errorLog,
    successLog
} from '../printLog/index.js'
import {
    lifecycle
} from '../../configure/index.js'

var postStatus = true
var send_type = 'img'
var rx_dangerous = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

function delRx(list) {
    if (Util.paramType(list) === 'Array') {
        for (var i = 0; i < list.length; i++) {
            list[i] = delRx(list[i])
        }
    }
    if (Util.paramType(list) === 'Object') {
        for (var key in list) {
            var value = list[key]
            list[key] = delRx(value)
        }
    }
    if (Util.paramType(list) === 'String') {
        list = list.replace(rx_dangerous, function (a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        });
    }
    return list
}

function sendPost(data, storageStatus) {
    if (Util.GetUrlParam('visual') && Util.GetUrlParam('visual').indexOf('true') > -1) {
        return
    }
    if (send_type !== 'img' && storageStatus !== 'NOT_STORAGE') {
        postStatus = false
    }

    var msg = data
    if (Util.paramType(data) === 'Array') {
        data = delRx(data)
        msg = JSON.stringify(data)
    }

    //发送日志发送失败，进入缓存序列
    var error = function (msg) {
        postStatus = true
        baseConfig.status.errorCode = '60008'
        errorLog()
    }
    //发送成功后，将缓存序列对应数据去除
    var successCheckPost = function (data, storageStatus) {
        postStatus = true

        var postDataList = Storage.getLocal("POSTDATA") || []
        if (Util.isEmptyObject(postDataList)) {
            postDataList = []
            Storage.removeLocal("POSTDATA")
        }
        if (postDataList.length === 0) {
            Storage.removeLocal("POSTDATA")
            return
        }
        var saveData = []
        for (var i = 0; i < postDataList.length; i++) {
            var delData = false
            for (var y = 0; y < data.length; y++) {
                if (data[y].xwhen === postDataList[i].xwhen || !data[y].xwhen || !postDataList[i].xwhen) {
                    delData = true
                }

            }
            if (delData === false && Util.paramType(postDataList[i]) === 'Object' && !Util.isEmptyObject(postDataList[i])) {

                saveData.push(postDataList[i])
            }
        }
        postDataList = null

        if (saveData.length > 0 && storageStatus !== 'NOT_STORAGE' && send_type !== 'img') {
            Storage.setLocal("POSTDATA", saveData)
            sendPost(saveData)
        } else {
            Storage.removeLocal("POSTDATA")
        }

    }
    //发送成功执行
    var success = (function (data) {
        return function (msg) {
            if (msg.code == 200 || msg.code == 400 || msg.code == 4200) {
                baseConfig.status.successCode = '20001'
                successLog()
                successCheckPost(data, storageStatus)
            } else {
                error()
            }
        }
    })(data)
    var url = baseConfig.base.uploadURL + 'up?appid=' + baseConfig.base.appid
    var postMsg = {
        url: url,
        data: msg,
        success: success,
        error: error
    }
    successLog('Send message to server: ' + baseConfig.base.uploadURL + 'up?appid=' + baseConfig.base.appid + '\ndata:' + msg)
    if (lifecycle.upload && lifecycle.upload.init) {
        postMsg = lifecycle.upload.init(postMsg)
    } else if (window.AnalysysModule && Util.paramType(window.AnalysysModule) == 'Object' && Util.paramType(window.AnalysysModule.uploadData) == 'Function') {
        window.AnalysysModule.encryptInit(baseConfig.base)
        postMsg = window.AnalysysModule.uploadData(postMsg)
    }
    if (send_type == 'get') {
        snedGet(postMsg)
        return
    }
    if (send_type == 'img') {
        snedGet(postMsg, 'img')
        return
    }
    if (send_type == 'post') {
        new ajax().post(postMsg)
        return
    }
    if (send_type == 'send') {
        snedGet(postMsg, 'send')
        return
    }
    new ajax().post(postMsg)
}

function setValidKey(option) {
    var data = {
        data: Util.encode(option.data),
        send_type: ''
    }
    var param = []
    for (var key in data) {
        param.push(key + '=' + encodeURIComponent(data[key]))
    }
    var validurl = option.url.indexOf('?') > -1 ? (option.url + '&' + param.join('&')) : (option.url + '?' + param.join('&'))

    validurl = validurl.replace(baseConfig.base.uploadURL, "/")

    var validValue = Util.MD5(validurl, 32).split("")
    var validkey = validValue[2] + '' + validValue[0] + '' + validValue[4]
    return validkey
}

function snedGet(option, type) {

    if (type == 'send' && navigator.sendBeacon) {
        var sendStatus = navigator.sendBeacon(option.url, option.data)
        if (sendStatus) {
            option.success({
                code: 200
            })
        }
        return
    }
    if (type == 'send' && !navigator.sendBeacon) {
        type = 'img'
    }
    var validkey = setValidKey(option)
    option.data = {
        data: Util.encode(option.data),
        send_type: validkey
    }
    if (type == 'img') {
        var param = []
        for (var key in option.data) {
            param.push(key + '=' + encodeURIComponent(option.data[key]))
        }
        var url = option.url.indexOf('?') > -1 ? (option.url + '&' + param.join('&')) : (option.url + '?' + param.join('&'))

        var dom = document
        var createImg = dom.createElement('img')
        // var callbackTimer = null
        createImg.src = url
        createImg.width = 1
        createImg.height = 1
        createImg.onload = function (e) {
            // clearTimeout(callbackTimer)
            // callbackTimer = null;
            this.src = ''
            this.onload = null, this.onerror = null, this.onabort = null
            // option.success({ code: 200 })
        };
        createImg.onerror = function (e) {
            // clearTimeout(callbackTimer)
            // callbackTimer = null;
            this.src = ''
            this.onload = null, this.onerror = null, this.onabort = null
            // option.success({ code: 200 })
        };
        createImg.onabort = function (e) {
            // clearTimeout(callbackTimer)
            // callbackTimer = null;
            this.src = ''
            this.onload = null, this.onerror = null, this.onabort = null
            // option.success({ code: 200 })
        };
        // callbackTimer = setTimeout(function() {
        // createImg.src = ''
        // createImg.onload = null, createImg.onerror = null, createImg.onabort = null
        option.success({
            code: 200
        })
        // }, 600)
    }

    if (type == 'get') {
        new ajax().get(option)
    }

}

function checkLogBaseJson(obj) {
    if (Util.paramType(obj) === 'Object' && !Util.isEmptyObject(obj)) {
        var status = true
        for (var i = 0; i < baseConfig.baseJson.length; i++) {
            var key = baseConfig.baseJson[i]
            if (key === 'xwhat') {
                continue
            }
            if (!obj[key] || (Util.paramType(obj[key]) == 'Object' && Util.isEmptyObject(obj[key]))) {
                status = false
            }
        }
        return status
    }
    return false
}

function checkSavaData(list) {
    var dataList = []
    if (Util.paramType(list) === 'Array' && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var itemList = checkSavaData(list[i])
            if (itemList.length > 0) {
                dataList.push.apply(dataList, itemList)
            }
        }
    }
    if (Util.paramType(list) === 'Object' && !Util.isEmptyObject(list) &&
        checkLogBaseJson(list)) {
        dataList.push(list)
    }
    return dataList
}

function upLog(log, storageStatus) {
    if (baseConfig.base['sendType']) {
        send_type = baseConfig.base['sendType']
    }
    var upData = []
    if (storageStatus == 'NOT_STORAGE' || send_type == 'img') {
        upData = checkSavaData(log)
    } else {
        var postDataList = Storage.getLocal("POSTDATA") || []
        postDataList = checkSavaData(postDataList)

        if (postDataList.length == 0) {
            Storage.removeLocal("POSTDATA")
        } else {
            upData = postDataList
        }
        upData = postDataList
        if (postDataList.length < 500) {
            upData.push.apply(upData, checkSavaData(log))
        } else {
            upData = checkSavaData(log)
        }
        Storage.setLocal("POSTDATA", upData)
    }

    if (postStatus === false && send_type !== 'img' && storageStatus !== 'NOT_STORAGE') return
    if (upData.length > 0) {
        if (send_type === 'img') {
            for (var i = 0; i < upData.length; i++) {
                sendPost([upData[i]])
            }
        } else {
            sendPost(upData, storageStatus)
        }
    }
}

export {
    upLog
}