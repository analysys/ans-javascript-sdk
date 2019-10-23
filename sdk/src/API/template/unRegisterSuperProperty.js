import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Storage from '../../lib/storage/index.js'

function unRegisterSuperProperty(superPropertyName) {
    baseConfig.status.FnName = '$unregisterSuperProperty'
    resetCode()
    var status = checkPrivate(superPropertyName, '$unregisterSuperProperty', true)
    var arkSuper = Storage.getLocal('ARKSUPER') || {}
    if (!arkSuper[superPropertyName]) {
        baseConfig.status.successCode = '20011'
        baseConfig.status.value = superPropertyName
        successLog()
        return
    }

    delete arkSuper[superPropertyName]
    Storage.setLocal('ARKSUPER', arkSuper)

    baseConfig.status.successCode = "20003"
    baseConfig.status.value = superPropertyName
    successLog()
}
export { unRegisterSuperProperty }