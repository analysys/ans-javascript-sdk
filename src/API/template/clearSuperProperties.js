import { resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Storage from '../../lib/storage/index.js'
import Util from '../../lib/common/index.js'
import { transporter, backParamsArray } from '../../lib/upload/hybrid.js'
function clearSuperProperties (callback) {
  baseConfig.status.FnName = '$clearSuperProperties'
  resetCode()
  if (baseConfig.base.isHybrid === true) {
    var backParams = backParamsArray(callback)
    var paramArray = backParams.argArray
    transporter('clearSuperProperties', paramArray, backParams.callback)
    return
  }

  Storage.setLocal('ARKSUPER', {})

  baseConfig.status.successCode = '20004'
  successLog()
  Util.paramType(callback) === 'Function' && callback.call(callback)
}
export { clearSuperProperties }
