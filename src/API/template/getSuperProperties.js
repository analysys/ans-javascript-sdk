import { resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Storage from '../../lib/storage/index.js'
import Util from '../../lib/common/index.js'
import { transporter } from '../../lib/upload/hybrid.js'
function getSuperProperties (callbackFun, callback) {
  baseConfig.status.FnName = '$getSuperProperties'
  resetCode()
  if (baseConfig.base.isHybrid === true) {
    transporter('getSuperProperties', [], callbackFun.name, callback)
    return
  }
  var arkSuper = Storage.getLocal('ARKSUPER') || {}
  baseConfig.status.successCode = '20010'
  baseConfig.status.value = JSON.stringify(arkSuper)
  successLog()
  if (Util.paramType(callbackFun) === 'Function') {
    callbackFun.call(callbackFun, arkSuper)
  }
  return arkSuper
}
export { getSuperProperties }
