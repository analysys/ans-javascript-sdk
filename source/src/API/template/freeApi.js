import { temp } from '../../lib/mergeRules/index.js'
import { fillField ,resetCode} from '../../lib/fillField/index.js'
import { errorLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function freeApi(apiName) {
    resetCode()
    baseConfig.status.FnName = apiName
    var freeApiTemp = temp(apiName)
    var freeApiLog = fillField(freeApiTemp)

    //如字段中有不合法内容则打印错误日志
    if (!freeApiLog) {
        errorLog()
        return
    }
    //去除空数据后上传数据
    upLog(Util.delEmpty(freeApiLog))
}
export { freeApi }