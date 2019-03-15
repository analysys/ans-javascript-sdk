import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate ,resetCode} from '../../lib/fillField/index.js'
import { errorLog ,successLog} from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function clearSuperProperties() {
    resetCode()
	baseConfig.status.FnName = '$clearSuperProperties'

    Storage.setLocal('ARKSUPER', {})

    baseConfig.status.successCode = "20004"
    successLog()
}
export { clearSuperProperties }