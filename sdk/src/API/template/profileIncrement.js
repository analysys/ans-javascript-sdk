import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'

function profileIncrement(key, value) {
    baseConfig.status.FnName = '$profile_increment'
    resetCode()
    var obj = Util.toObj(key, value)
    checkPrivate(obj, '$profile_increment')

    var profileIncrementTemp = temp('$profile_increment')

    var profileIncrementObj = Util.delEmpty(fillField(profileIncrementTemp))

    var profileIncrementLog = Util.objMerge(profileIncrementObj, { 'xcontext': obj })

    //如字段中有不合法内容则打印错误日志
    // if (!profileIncrementLog) {
    //     errorLog()
    //     return
    // }
    //去除空数据后上传数据
    upLog(profileIncrementLog)
}
export { profileIncrement }