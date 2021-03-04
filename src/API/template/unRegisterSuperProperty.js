import { checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Storage from '../../lib/storage/index.js'
import Util from '../../lib/common/index.js'
import { backParamsArray, transporter } from '../../lib/upload/hybrid.js'
function unRegisterSuperProperty (superPropertyName, callback) {
  baseConfig.status.FnName = '$unregisterSuperProperty'
  resetCode()
  if (baseConfig.base.isHybrid === true) {
    var backParams = backParamsArray.apply(superPropertyName, arguments)
    var paramArray = backParams.argArray
    transporter('unRegisterSuperProperty', paramArray, backParams.callback)
    return
  }
  checkPrivate(superPropertyName, '$unregisterSuperProperty', true)
  var arkSuper = Storage.getLocal('ARKSUPER') || {}
  if (!Object.prototype.hasOwnProperty.call(arkSuper, superPropertyName)) {
    baseConfig.status.successCode = '20011'
  } else {
    delete arkSuper[superPropertyName]
    Storage.setLocal('ARKSUPER', arkSuper)
    baseConfig.status.successCode = '20003'
  }
  baseConfig.status.value = superPropertyName
  successLog()
  Util.paramType(callback) === 'Function' && callback.call(callback)
}
export { unRegisterSuperProperty }
