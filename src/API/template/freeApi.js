import { temp } from '../../lib/mergeRules/index.js'
import { fillField, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'
import { transporter, backParamsArray } from '../../lib/upload/hybrid.js'
function freeApi (apiName, property) {

  baseConfig.status.FnName = apiName
  resetCode()
  var freeApiTemp = temp(apiName)
  if (!freeApiTemp) {
    return
  }
  if (baseConfig.base.isHybrid === true) {
    var hybridTemp = temp(apiName + 'base')
    var hybridLog = fillField(hybridTemp)
    var log = Util.delNotHybrid(Util.delEmpty(hybridLog.xcontext))

    var backParams = backParamsArray(apiName, log)
    var paramArray = backParams.argArray
    transporter('track', paramArray)
    return
  }
  var freeApiLog = fillField(freeApiTemp)
  var arkSuper = Storage.getLocal('ARKSUPER') || {}
  if (Util.paramType(property) === 'Object') {
    arkSuper = Util.objMerge(arkSuper, property)
  }
  freeApiLog = Util.objMerge(freeApiLog, { xcontext: arkSuper })

  upLog(Util.delEmpty(freeApiLog))
}
export { freeApi }
