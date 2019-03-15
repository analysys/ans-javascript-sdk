import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate ,resetCode} from '../../lib/fillField/index.js'
import { errorLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function alias(aliasId, distinctId) {
    resetCode()
    
    //检测aliasId
    var status = checkPrivate(aliasId,'$alias')

    if (distinctId && status) {
        //检测distinctId
        status = checkPrivate(distinctId,'$alias')
        if(status){
            Storage.setLocal('ARK_TRACKID',distinctId)
        }
    }
    baseConfig.status.FnName = '$alias'
    
    if (!status) {
        errorLog()
        return
    }

    Storage.setLocal('ARK_LOGINID',aliasId)

    var aliasTemp = temp('$alias')
    var aliasLog = fillField(aliasTemp)
    //如字段中有不合法内容则打印错误日志
    if (!aliasLog) {
        errorLog()
        return
    }
    //去除空数据后上传数据
    upLog(Util.delEmpty(aliasLog))
}
export { alias }