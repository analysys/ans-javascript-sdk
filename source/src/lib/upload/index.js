import Util from '../common/index.js'
import ajax from './ajax.js'
import Storage from '../Storage/index.js'
import baseConfig from '../baseConfig/index.js'
import { errorLog, successLog } from '../printLog/index.js'
import { lifecycle } from '../../configure/index.js'

var postStatus = true
var send_type = 'post'

function sendPost(data) {
    postStatus = false

    var msg = data
    if (Util.paramType(data) === 'Array') {
        msg = JSON.stringify(data)
    }

    //发送日志发送失败，进入缓存序列
    var error = function(msg) {
        postStatus = true
        baseConfig.status.errorCode = '60008'
        errorLog()
    }
    //发送成功后，将缓存序列对应数据去除
    var successCheckPost = function(data) {
        postStatus = true
        var postDataList = Storage.getLocal("POSTDATA") || []
        if (postDataList.length === 0) return
        var saveData = []
        for (var i = 0; i < postDataList.length; i++) {
            var delData = false
            for (var y = 0; y < data.length; y++) {
                if (data[y].xwhen === postDataList[i].xwhen) {
                    delData = true
                }

            }
            if (delData === false) {
                saveData.push(postDataList[i])
            }
        }
        postDataList = null
        if (saveData.length > 0) {
            Storage.setLocal("POSTDATA", saveData)
            sendPost(saveData)
            //
        } else {
            Storage.removeLocal("POSTDATA")
        }

    }
    //发送成功执行
    var success = (function(data) {
        return function(msg) {
            if (msg.code === 200) {
                baseConfig.status.successCode = '20001'
                successLog()
                successCheckPost(data)
            } else {
                baseConfig.status.errorCode = '60008'
                errorLog()
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
    successLog('Send message to server: ' + baseConfig.base.uploadURL + '?appid=' + baseConfig.base.appid + '\ndata:' + msg)
    if (lifecycle.upload && lifecycle.upload.init) {
        postMsg = lifecycle.upload.init(postMsg)
    }
    if (send_type == 'get') {
        snedGet(postMsg)
    } else {
        new ajax().post(postMsg)
    }
}

function snedGet(option) {
    var data = {
        data: Util.encode(option.data),
        send_type: 'get'
    }
    option.data = data
    new ajax().get(option)

}

function upLog(log) {

    var postDataList = Storage.getLocal("POSTDATA") || []

    var saveData = []
    if (postDataList.length >= 0 && postDataList.length < 500) {
        for (var i = 0; i < postDataList.length; i++) {
            if (Util.paramType(postDataList[i]) === 'Array') {
                saveData.push.apply(saveData, postDataList[i])
            } else {
                saveData.push(postDataList[i])
            }
        }

        if (Util.paramType(log) === 'Array') {
            for (var i = 0; i < log.length; i++) {
                saveData.push(log[i])
            }
        } else {
            saveData.push(log)
        }

    } else {
        saveData = postDataList
    }
    Storage.setLocal("POSTDATA", saveData)
    if (postStatus === false) return

    if (send_type === 'get') {
        var dataToString = JSON.stringify(saveData)
        while (dataToString.length > 1800 && saveData.length > 1) {
            saveData.splice(saveData.length - 1, 1)
            dataToString = JSON.stringify(saveData)
        }
    }
    sendPost(saveData)
}

export { upLog }