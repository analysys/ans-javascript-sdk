import { temp } from '../../lib/mergeRules/index.js'
import { fillField, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function freeApi(apiName) {
    baseConfig.status.FnName = apiName
    resetCode()
    var freeApiTemp = temp(apiName)
    if (!freeApiTemp) {
        return
    }
    var freeApiLog = fillField(freeApiTemp)

    var arkSuper = Storage.getLocal('ARKSUPER') || {}

    freeApiLog = Util.objMerge({ 'xcontext': arkSuper }, freeApiLog)

    //如字段中有不合法内容则打印错误日志
    // if (!freeApiLog) {
    //     errorLog()
    //     // return
    // }
    //去除空数据后上传数据
    upLog(Util.delEmpty(freeApiLog), 'NOT_STORAGE')
}
export { freeApi }