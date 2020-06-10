import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import { backParamsArray, transporter } from '../../lib/upload/hybrid.js'
function profileSet (key, value, callback) {
  baseConfig.status.FnName = '$profile_set'
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
    transporter('profileSet', paramArray, backParams.callback)
    return
  }
  checkPrivate(obj, '$profile_set')

  var profileSetTemp = temp('$profile_set')

  var profileSetObj = Util.delEmpty(fillField(profileSetTemp))

  var profileSetLog = Util.objMerge(profileSetObj, { xcontext: obj })

  // 如字段中有不合法内容则打印错误日志
  // if (!profileSetLog) {
  //     errorLog()
  //     return
  // }
  // 去除空数据后上传数据
  upLog(profileSetLog, callback)
}
export { profileSet }
