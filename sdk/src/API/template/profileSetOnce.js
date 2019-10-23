import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'

function profileSetOnce(key, value) {
    baseConfig.status.FnName = '$profile_set_once'
    resetCode()
    var obj = Util.toObj(key, value)

    checkPrivate(obj, '$profile_set_once')

    var profileSetOnceTemp = temp('$profile_set_once')

    var profileSetOnceObj = Util.delEmpty(fillField(profileSetOnceTemp))

    var profileSetOnceLog = Util.objMerge(profileSetOnceObj, { 'xcontext': obj })

    //如字段中有不合法内容则打印错误日志
    // if (!profileSetOnceLog) {
    //     errorLog()
    //     return
    // }
    //去除空数据后上传数据
    upLog(profileSetOnceLog)
}
export { profileSetOnce }