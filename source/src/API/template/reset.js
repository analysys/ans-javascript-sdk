import sessionId from '../../lib/fillField/sessionId.js'
import {clearSuperProperties} from './clearSuperProperties.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { successLog } from '../../lib/printLog/index.js'
import Util from '../../lib/common/index.js'
import { resetCode} from '../../lib/fillField/index.js'
import {
    getId,
    setUUId,
    getUUId,
    removeUUId,
    setAliasId,
    getAliasId,
    removeAliasId,
    setIdentifyId,
    getIdentifyId,
    removeIdentifyId
} from '../../lib/fillField/id.js'

function reset(resetId, distinctId) {
    resetCode()
    removeUUId()
    removeIdentifyId()
    removeAliasId()
    clearSuperProperties()
    sessionId.setId()
    if (baseConfig.base.autoProfile === true) {
    	var resetTime ={
            '$reset_time': Util.format(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
        }
        profileSetOnce(resetTime)
    }
    baseConfig.status.FnName = '$reset'
    
    baseConfig.status.successCode = "20005"
    successLog()
}
export { reset }