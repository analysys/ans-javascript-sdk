import { resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Storage from '../../lib/storage/index.js'

function getSuperProperties() {
    baseConfig.status.FnName = '$getSuperProperties'
    resetCode()
    var arkSuper = Storage.getLocal('ARKSUPER') || {}
    baseConfig.status.successCode = "20010"
    baseConfig.status.value = JSON.stringify(arkSuper)
    successLog()
    return arkSuper
}
export { getSuperProperties }