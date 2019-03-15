import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate ,resetCode} from '../../lib/fillField/index.js'
import { errorLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
function profileAppend(key, value) {
    resetCode()
    var obj = Util.toObj(key,value)

    var status = checkPrivate(obj)
    baseConfig.status.FnName = '$profile_append'
    
    if(!status){
    	errorLog()
        return
    }
    var profileAppendTemp = temp('$profile_append')

    var profileAppendObj = fillField(profileAppendTemp)
    
    var profileAppendLog = Util.objMerge(profileAppendObj,{'xcontext':obj})

    //如字段中有不合法内容则打印错误日志
    if (!profileAppendLog) {
        errorLog()
        return
    }
    //去除空数据后上传数据
    upLog(Util.delEmpty(profileAppendLog))
}
export { profileAppend }