import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { errorLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function track(eventName, obj) {
    baseConfig.status.FnName = eventName || '$track'
    resetCode()
    var status = checkPrivate(eventName,'$track',true)
    baseConfig.status.FnName = eventName
    if (obj) {
        checkPrivate(obj)
        obj = { 'xcontext': obj }
    }

    var arkSuper = Storage.getLocal('ARKSUPER') || {}

    obj = Util.objMerge({ 'xcontext': arkSuper }, obj)
    var trackTemp = temp('$track')
    var trackObj = fillField(trackTemp)
    trackObj.xcontext = Util.delEmpty(trackObj.xcontext)
    var trackLog = Util.objMerge(trackObj, obj)
    //去除空数据后上传数据
    upLog(trackLog)
}
export { track }