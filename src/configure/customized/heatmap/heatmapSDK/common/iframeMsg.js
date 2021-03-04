import Util from '../../../../../lib/common/index.js'
import { heatmapConfig } from './config.js'

/**
 * [sendMsg description]发送热图SDK初始化完毕信息
 * @return {[type]} [description]
 */
function sendMsg () {
  var msg = JSON.stringify({
    code: 'ark/heatmap',
    appkey: heatmapConfig.appid
  })
  // console.log('发送热图SDK初始化完毕消息===>', msg)
  window.parent.postMessage(msg, '*')
}

/**
 * [getMsg description]接收iframe消息
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getMsg (callback) {
  Util.addEvent(window, 'message', function (msgObj) {
    var msg = msgObj.data
    // console.log('获取服务端热图命令===>', JSON.stringify(msgObj.data))

    try {
      if (Util.paramType(msg) === 'String') {
        msg = JSON.parse(msg)
      }
    } catch (e) { }
    callback(msg)
  })
}
export {
  sendMsg,
  getMsg
}
