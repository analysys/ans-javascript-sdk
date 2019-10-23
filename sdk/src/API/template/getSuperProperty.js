import { checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { successLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Storage from '../../lib/storage/index.js'

function getSuperProperty(superPropertyName) {
    baseConfig.status.FnName = '$getSuperProperty'
    resetCode()

    var status = checkPrivate(superPropertyName, '$getSuperProperty', true)
    // if (!status) {
    //     return
    // }
    var arkSuper = Storage.getLocal('ARKSUPER') || {}
    var superProperty = arkSuper[superPropertyName]
    if (!superProperty) {
        baseConfig.status.successCode = '20009'
        baseConfig.status.key = superPropertyName
        successLog()
        return ''
    }

    baseConfig.status.successCode = "20010"
    baseConfig.status.key = superPropertyName
    baseConfig.status.value = superProperty
    successLog()
    return superProperty
}
export { getSuperProperty }