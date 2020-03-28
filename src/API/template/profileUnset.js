import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'

function profileUnset (key, callback) {
  baseConfig.status.FnName = '$profile_unset'
  resetCode()
  if (Util.paramType(key) === 'Function') {
    key = key.call(key)
  }
  checkPrivate(key, '$profile_unset', key)
  var obj = Util.toObj(key, '')

  checkPrivate(obj, '$profile_unset')

  var profileUnsetTemp = temp('$profile_unset')

  var profileUnsetObj = fillField(profileUnsetTemp)

  var profileUnsetLog = Util.objMerge(profileUnsetObj, { xcontext: obj })

  // 如字段中有不合法内容则打印错误日志
  // if (!profileUnsetLog) {
  //     errorLog()
  //     return
  // }
  // 去除空数据后上传数据
  upLog(profileUnsetLog, callback)
}
export { profileUnset }
