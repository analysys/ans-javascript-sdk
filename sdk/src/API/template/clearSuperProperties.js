import { resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function clearSuperProperties() {
    baseConfig.status.FnName = '$clearSuperProperties'
    resetCode()

    Storage.setLocal('ARKSUPER', {})

    baseConfig.status.successCode = "20004"
    successLog()
}
export { clearSuperProperties }