import { checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function registerSuperProperty(key, value) {
    baseConfig.status.FnName = '$registerSuperProperty'
    resetCode()
    var obj = Util.toObj(key, value)
    checkPrivate(obj, '$registerSuperProperty')
    // obj = Util.delEmpty(obj)
    var arkSuper = Storage.getLocal('ARKSUPER') || {}

    var saveArkSuper = Util.objMerge(arkSuper, obj)
    Storage.setLocal('ARKSUPER', saveArkSuper)

    baseConfig.status.successCode = "20002"
    baseConfig.status.value = JSON.stringify(obj)
    successLog()

}
export { registerSuperProperty }