import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate ,resetCode} from '../../lib/fillField/index.js'
import { errorLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function track(eventName, obj) {
    resetCode()
    //检测aliasId
    var status = checkPrivate(eventName, '$track')

    if (obj && status) {
        //检测distinctId
        status = checkPrivate(obj)
        obj = { 'xcontext': obj }
    }

    baseConfig.status.FnName = '$track'

    if (!status) {
        errorLog()
        return
    }

    var arkSuper = Storage.getLocal('ARKSUPER') ||{}

    obj = Util.objMerge({ 'xcontext': arkSuper }, obj)
    var trackTemp = temp('$track')
    var trackObj = fillField(trackTemp)
    //如字段中有不合法内容则打印错误日志
    if (!trackObj) {
        errorLog()
        return
    }
    
    var trackLog = Util.objMerge(trackObj, obj)
    
    //去除空数据后上传数据
    upLog(Util.delEmpty(trackLog))
}
export { track }