import { checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'
import { backParamsArray, transporter } from '../../lib/upload/hybrid.js'
function registerSuperProperties (key, value, callback) {
  baseConfig.status.FnName = '$registerSuperProperties'
  resetCode()
  if (Util.paramType(key) === 'Object' && Util.paramType(value) === 'Function') {
    callback = value
    value = ''
  } else if (Util.paramType(key) === 'String' && Util.paramType(value) === 'Function') {
    value = value.call(value)
  }
  var obj = Util.toObj(key, value)
  for (var itemKey in obj) {
    if (Util.paramType(obj[itemKey]) === 'Function') {
      obj[itemKey] = obj[itemKey].call(obj[itemKey])
    }
  }
  if (baseConfig.base.isHybrid === true) {
    var backParams = backParamsArray(key, value, callback)
    var paramArray = backParams.argArray
    transporter('registerSuperProperties', paramArray, backParams.callback)
    return
  }
  checkPrivate(obj, '$registerSuperProperties')

  var arkSuper = Storage.getLocal('ARKSUPER') || {}
  // obj = Util.delEmpty(obj)
  var saveArkSuper = Util.objMerge(arkSuper, obj)
  Storage.setLocal('ARKSUPER', saveArkSuper)

  baseConfig.status.successCode = '20002'
  baseConfig.status.value = JSON.stringify(obj)
  successLog()
  Util.paramType(callback) === 'Function' && callback.call(callback)
}
export { registerSuperProperties }
