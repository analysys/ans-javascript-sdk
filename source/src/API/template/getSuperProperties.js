import { temp } from '../../lib/mergeRules/index.js'
import { checkPrivate ,resetCode} from '../../lib/fillField/index.js'
import { errorLog ,successLog} from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function getSuperProperties() {
    resetCode()
    baseConfig.status.FnName = '$getSuperProperties'
    var arkSuper = Storage.getLocal('ARKSUPER') ||{}
    baseConfig.status.successCode = "20002"
    baseConfig.status.value = JSON.stringify(arkSuper)
    successLog()
    return arkSuper
}
export { getSuperProperties }