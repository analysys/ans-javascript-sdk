import { temp } from '../../lib/mergeRules/index.js'
import { checkPrivate ,resetCode} from '../../lib/fillField/index.js'
import { errorLog ,successLog} from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function getSuperProperty(superPropertyName) {
    resetCode()

    var status = checkPrivate(superPropertyName)
	baseConfig.status.FnName = '$getSuperProperty'

    if(!status){
    	errorLog()
        return
    }
    
    var arkSuper = Storage.getLocal('ARKSUPER') ||{}
    var superProperty = arkSuper[superPropertyName]
    if (!superProperty) {
        baseConfig.status.successCode = '20009'
        baseConfig.status.key = superPropertyName
        successLog()
        return ''
    }

    baseConfig.status.successCode = "20010"
    baseConfig.status.key = superPropertyName
    baseConfig.status.value = superProperty
    successLog()
    return superProperty
}
export { getSuperProperty }