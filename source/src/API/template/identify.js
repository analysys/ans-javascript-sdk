import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate ,resetCode} from '../../lib/fillField/index.js'
import { errorLog ,successLog} from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function identify(distinctId) {
    resetCode()
   //检测aliasId
    var status = checkPrivate(distinctId,'$alias')

	baseConfig.status.FnName = '$identify'

    if(!status){
    	errorLog()
        return
    }
    
    Storage.setLocal('ARK_TRACKID',distinctId)

    baseConfig.status.successCode = "20002"
    baseConfig.status.value = distinctId
    successLog()

}
export { identify }