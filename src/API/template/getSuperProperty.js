import { checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Storage from '../../lib/storage/index.js'
import Util from '../../lib/common/index.js'
import { backParamsArray, transporter } from '../../lib/upload/hybrid.js'
function getSuperProperty (superPropertyName, callbackFun, callback) {
  baseConfig.status.FnName = '$getSuperProperty'
  resetCode()
  if (baseConfig.base.isHybrid === true) {
    var paramArray = backParamsArray(superPropertyName)
    transporter('getSuperProperty', paramArray.argArray, callbackFun.name, callback)
    return
  }
  checkPrivate(superPropertyName, '$getSuperProperty', true)
  // if (!status) {
  //     return
  // }
  var arkSuper = Storage.getLocal('ARKSUPER') || {}
  var superProperty = arkSuper[superPropertyName]

  if (!{}.hasOwnProperty.call(arkSuper, superPropertyName)) {
    baseConfig.status.successCode = '20009'
    superProperty = ''
  } else {
    baseConfig.status.successCode = '20010'
    baseConfig.status.value = superProperty
  }
  baseConfig.status.key = superPropertyName
  successLog()
  if (Util.paramType(callbackFun) === 'Function') {
    callbackFun.call(callbackFun, superProperty)
  }
  return superProperty
}
export { getSuperProperty }
