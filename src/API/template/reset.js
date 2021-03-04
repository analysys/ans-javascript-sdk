import sessionId from '../../lib/fillField/sessionId.js'
import { clearSuperProperties } from './clearSuperProperties.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { successLog } from '../../lib/printLog/index.js'
import Util from '../../lib/common/index.js'
import { resetCode, clearCache } from '../../lib/fillField/index.js'
import { removeUUId } from '../../lib/fillField/id.js'
import { profileSetOnce } from './profileSetOnce.js'
import { transporter } from '../../lib/upload/hybrid.js'
function reset (callback) {
  if (baseConfig.base.isHybrid === true) {
    transporter('reset', [], callback)
    return
  }
  resetCode()
  removeUUId()
  clearSuperProperties()
  clearCache(true)
  sessionId.setId()
  if (baseConfig.base.autoProfile === true) {
    var resetTime = {
      $reset_time: Util.format(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    }
    profileSetOnce(resetTime, callback)
  } else {
    if (Util.paramType(callback) === 'Function') {
      callback.call(callback)
    }
  }
  baseConfig.status.FnName = '$reset'
  baseConfig.status.successCode = '20005'
  successLog()
}
export { reset }
