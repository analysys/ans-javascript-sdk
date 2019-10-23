import { temp } from '../../lib/mergeRules/index.js'
import { fillField, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function getPresetProperties() {
    baseConfig.status.FnName = '$getPresetProperties'
    resetCode()
    //检测aliasId
    var getPresetPropertiesTemp = temp('$getPresetProperties')
    var getPresetPropertiesLog = fillField(getPresetPropertiesTemp)
    getPresetPropertiesLog.xcontext['$first_visit_time'] =  Storage.getLocal('ARKFRISTPROFILE') || ''
    delete getPresetPropertiesLog.xcontext['$is_login']
    return Util.delEmpty(getPresetPropertiesLog.xcontext)
}
export { getPresetProperties }