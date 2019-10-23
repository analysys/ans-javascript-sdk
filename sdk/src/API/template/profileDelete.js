import { temp } from '../../lib/mergeRules/index.js'
import { fillField, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'

function profileDelete() {
    baseConfig.status.FnName = '$profile_delete'

    resetCode()
    var profileDeleteTemp = temp('$profile_delete')

    var profileDeleteLog = fillField(profileDeleteTemp)

    //如字段中有不合法内容则打印错误日志
    // if (!profileDeleteLog) {
    //     errorLog()
    //     return
    // }
    //去除空数据后上传数据
    upLog(profileDeleteLog)
}
export { profileDelete }