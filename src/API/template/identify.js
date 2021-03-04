import { checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Storage from '../../lib/storage/index.js'
import Util from '../../lib/common/index.js'
import { backParamsArray, transporter } from '../../lib/upload/hybrid.js'
function identify (distinctId, isLogin, callback) {
  baseConfig.status.FnName = '$identify'
  resetCode()
  if (baseConfig.base.isHybrid === true) {
    var backParams = backParamsArray(distinctId, callback)
    var paramArray = backParams.argArray
    transporter('identify', paramArray, backParams.callback)
    return
  }
  var status = checkPrivate(distinctId, '$alias', true)
  if (!status) {
    return
  }
  if (Util.paramType(isLogin) === 'Boolean' && isLogin === true) {
    Storage.setLocal('ARK_TRACK_LOGIN', true)
  } else if (Util.paramType(isLogin) === 'Function') {
    callback = isLogin
  }

  Storage.setLocal('ARK_TRACKID', distinctId)
  Storage.setCookie('ARK_ID', distinctId)
  baseConfig.status.successCode = '20002'
  baseConfig.status.value = distinctId
  successLog()
  if (Util.paramType(callback) === 'Function') {
    callback.call(callback)
  }
  if (window.AnalysysModal && typeof (window.AnalysysModal) === 'function') {
    window.AnalysysModal([{ xwhat: '$identify', xwho: distinctId }])
  }
}
export { identify }
