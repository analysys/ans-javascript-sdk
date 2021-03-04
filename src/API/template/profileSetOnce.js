import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import { backParamsArray, transporter } from '../../lib/upload/hybrid.js'
function profileSetOnce (key, value, callback) {
  baseConfig.status.FnName = '$profile_set_once'
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
    var backParams = backParamsArray(obj, callback)
    var paramArray = backParams.argArray
    transporter('profileSetOnce', paramArray, backParams.callback)
    return
  }
  checkPrivate(obj, '$profile_set_once')

  var profileSetOnceTemp = temp('$profile_set_once')

  var profileSetOnceObj = Util.delEmpty(fillField(profileSetOnceTemp))

  var profileSetOnceLog = Util.objMerge(profileSetOnceObj, { xcontext: obj })

  // 如字段中有不合法内容则打印错误日志
  // if (!profileSetOnceLog) {
  //     errorLog()
  //     return
  // }
  // 去除空数据后上传数据
  upLog(profileSetOnceLog, callback)
}
export { profileSetOnce }
