import Util from '../../../../../lib/common/index.js'

/**
 * [sendMsg description]发送热图SDK初始化完毕信息
 * @return {[type]} [description]
 */
function sendMsg (msg) {
  console.log('发送可视化SDK初始化完毕消息===>', JSON.stringify(msg, null, 2))

  if (Util.paramType(msg) === 'Object') {
    msg = JSON.stringify(msg)
  }
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
    try {
      if (Util.paramType(msg) === 'String') {
        msg = JSON.parse(msg)
      }
    } catch (e) { }
    console.log('获取可视化消息===>', JSON.stringify(msg, null, 2))
    callback(msg)
  })
}
export {
  sendMsg,
  getMsg
}
