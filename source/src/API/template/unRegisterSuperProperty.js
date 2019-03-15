import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate ,resetCode} from '../../lib/fillField/index.js'
import { errorLog ,successLog} from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function unRegisterSuperProperty(superPropertyName) {
    resetCode()
    var status = checkPrivate(superPropertyName)
	baseConfig.status.FnName = '$unregisterSuperProperty'

    if(!status){
    	errorLog()
        return
    }
    
    var arkSuper = Storage.getLocal('ARKSUPER') ||{}
    if (!arkSuper[superPropertyName]) {
        baseConfig.status.successCode = '20011'
        baseConfig.status.value = superPropertyName
        successLog()
        return
    }

    delete arkSuper[superPropertyName]
    Storage.setLocal('ARKSUPER', arkSuper)

    baseConfig.status.successCode = "20003"
    baseConfig.status.value = superPropertyName
    successLog()
}
export { unRegisterSuperProperty }