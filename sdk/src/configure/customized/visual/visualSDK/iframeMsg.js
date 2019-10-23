 import Util from '../../../../lib/common/index.js'
function msg() {
    this.boss = '*'
    this.orgin = ''
    this.appid = ''
}

msg.prototype.postMsg = function(msgObj) {
    console.log('发送消息--->',msgObj)
    if (msgObj && typeof msgObj === 'object') {
        msgObj = JSON.stringify(msgObj)
    }
    if (msgObj && typeof msgObj === 'string') {
        window.parent.postMessage(msgObj, this.boss);
    }
}
msg.prototype.getMsg = function(callback) {
    Util.addEvent(window, 'message', callback)
};
export default new msg()