import { getUUId, getIdentifyId } from '../../lib/fillField/id.js'
import Util from '../../lib/common/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { transporter } from '../../lib/upload/hybrid.js'
function getDistinctId (callbackFun, callback) {
  if (baseConfig.base.isHybrid === true) {
    transporter('getDistinctId', [], callbackFun.name, callback)
    return
  }
  var id = getIdentifyId() || getUUId()
  if (Util.paramType(callbackFun) === 'Function') {
    callbackFun.call(callbackFun, id)
  }
  return id
}
export { getDistinctId }
