import { temp } from '../../lib/mergeRules/index.js'
import { fillField, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'
import { transporter } from '../../lib/upload/hybrid.js'
function getPresetProperties (callbackFun, callback) {
  baseConfig.status.FnName = '$getPresetProperties'
  resetCode()
  if (baseConfig.base.isHybrid === true) {
    transporter('getPresetProperties', [], callbackFun.name, callback)
    return
  }
  // 检测aliasId
  var getPresetPropertiesTemp = temp('$getPresetProperties')
  var getPresetPropertiesLog = fillField(getPresetPropertiesTemp)
  getPresetPropertiesLog.xcontext.$first_visit_time = Storage.getLocal('ARKFRISTPROFILE') || ''
  delete getPresetPropertiesLog.xcontext.$is_login

  var presetPropertiesLog = Util.delEmpty(getPresetPropertiesLog.xcontext)
  if (Util.paramType(callbackFun) === 'Function') {
    callbackFun.call(callbackFun, presetPropertiesLog)
  }
  return presetPropertiesLog
}
export {
  getPresetProperties
}
