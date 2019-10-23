import Util from '../common/index.js'
// import ajax from './ajax.js'
import Storage from '../storage/index.js'
import baseConfig from '../baseConfig/index.js'
import { errorLog, successLog } from '../printLog/index.js'
import { lifecycle } from '../../configure/index.js'

// var postStatus = true
var send_type = 'img'

function sendPost(data) {
    if (Util.GetUrlParam('visual') && Util.GetUrlParam('visual').indexOf('true')>-1) {
        return
    }
    // if (send_type === 'get') {
    //     var dataToString = JSON.stringify(data)
    //     while (dataToString.length > 900 && data.length > 1) {
    //         data.splice(data.length - 1, 1)
    //         dataToString = JSON.stringify(data)
    //     }
    // }
    // postStatus = false

    var msg = data
    if (Util.paramType(data) === 'Array') {
        msg = JSON.stringify(data)
    }

    // //发送日志发送失败，进入缓存序列
    // var error = function(msg) {
    //     postStatus = true
    //     baseConfig.status.errorCode = '60008'
    //     errorLog()
    // }
    // //发送成功后，将缓存序列对应数据去除
    // var successCheckPost = function(data) {
    //     postStatus = true
    //     var postDataList = Storage.getLocal("POSTDATA") || []
    //     if (Util.isEmptyObject(postDataList)) {
    //         postDataList = []
    //         Storage.removeLocal("POSTDATA")
    //     }
    //     if (postDataList.length === 0) return
    //     var saveData = []
    //     for (var i = 0; i < postDataList.length; i++) {
    //         var delData = false
    //         for (var y = 0; y < data.length; y++) {
    //             if (data[y].xwhen === postDataList[i].xwhen || !data[y].xwhen || !postDataList[y].xwhen) {
    //                 delData = true
    //             }

    //         }
    //         if (delData === false && Util.paramType(postDataList[i]) === 'Object' && !Util.isEmptyObject(postDataList[i])) {
    //             saveData.push(postDataList[i])
    //         }
    //     }
    //     postDataList = null
    //     if (saveData.length > 0) {
    //         // Storage.setLocal("POSTDATA", saveData)
    //         sendPost(saveData)
    //     } else {
    //         Storage.removeLocal("POSTDATA")
    //     }

    // }
    // //发送成功执行
    // var success = (function(data) {
    //     return function(msg) {
    //         if (msg.code === 200) {
    //             baseConfig.status.successCode = '20001'
    //             successLog()
    //             successCheckPost(data)
    //         } else {
    //             error()
    //         }
    //     }
    // })(data)
    var url = baseConfig.base.uploadURL + 'up?appid=' + baseConfig.base.appid
    var postMsg = {
        url: url,
        data: msg,
        // success: success,
        // error: error
    }
    successLog('Send message to server: ' + baseConfig.base.uploadURL + 'up?appid=' + baseConfig.base.appid + '\ndata:' + msg)
    if (lifecycle.upload && lifecycle.upload.init) {
        postMsg = lifecycle.upload.init(postMsg)
    }
    // if (send_type == 'get') {
    //     snedGet(postMsg)
    // } else if (send_type == 'script') {
    //     snedGet(postMsg, 'script')
    // } else if (send_type == 'img') {
    snedGet(postMsg, 'img')
    // } else {
    //     // new ajax().post(postMsg)
    // }
}

function snedGet(option, type) {
    var data = {
        data: Util.encode(option.data),
        send_type: ''
    }
    var param = []
    option.data = data
    for (var key in option.data) {
        param.push(key + '=' + encodeURIComponent(option.data[key]))
    }
    var validurl = option.url.indexOf('?') > -1 ? (option.url + '&' + param.join('&')) : (option.url + '?' + param.join('&'))
    validurl = validurl.replace(baseConfig.base.uploadURL, "/")
    var validValue = Util.MD5(validurl, 32).split("")
    var validkey = validValue[2] + '' + validValue[0] + '' + validValue[4]
    option.data.send_type = validkey

    if (type == 'img') {
        var param = []
        for (var key in option.data) {
            param.push(key + '=' + encodeURIComponent(option.data[key]))
        }
        var url = option.url.indexOf('?') > -1 ? (option.url + '&' + param.join('&')) : (option.url + '?' + param.join('&'))

        var dom = document
        var createImg = dom.createElement('img')
        createImg.src = url
        createImg.onload = function(e) {
            this.onload = null;
            createImg.src = ''
        };
        createImg.onerror = function(e) {
            this.onerror = null;
            createImg.src = ''
        };
        createImg.onabort = function(e) {
            this.onabort = null;
            createImg.src = ''
        };
        setTimeout(function() {
            createImg.src = ''
            createImg.onload = null, createImg.onerror = null, createImg.onabort = null
        }, 200)
    }

}

function upLog(log) {

    // var postDataList = []
    // var postDataList = Storage.getLocal("POSTDATA") || []
    // if (Util.isEmptyObject(postDataList)) {
    //     postDataList = []
    //     Storage.removeLocal("POSTDATA")
    // }
    var saveData = []
    // if (postDataList.length >= 0 && postDataList.length < 500) {
    //     for (var i = 0; i < postDataList.length; i++) {
    //         if (Util.paramType(postDataList[i]) === 'Array' && postDataList[i].length > 0) {
    //             saveData.push.apply(saveData, postDataList[i])
    //         } else {
    //             if (Util.paramType(postDataList[i]) == 'Object' && !Util.isEmptyObject(postDataList[i])) {
    //                 saveData.push(postDataList[i])
    //             }
    //         }
    //     }

    if (Util.paramType(log) === 'Array' && log.length > 0) {
        for (var i = 0; i < log.length; i++) {
            if (Util.paramType(log[i]) == 'Object' && !Util.isEmptyObject(log[i])) {
                saveData.push(log[i])

            }
        }
    } else {
        if (Util.paramType(log) == 'Object' && !Util.isEmptyObject(log)) {
            saveData.push(log)
        }
    }

    // } else {
    //     saveData = postDataList
    // }
    // Storage.setLocal("POSTDATA", saveData)

    // if (postStatus === false) return

    if (saveData.length > 0) {
        sendPost(saveData)
    }
}

export { upLog }