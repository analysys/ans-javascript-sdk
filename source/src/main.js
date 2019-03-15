/**
 * 发布API
 */
import * as ans from './API/index.js'
import Util from './lib/common/index.js'

if (Util.paramType(AnalysysAgent) === 'Array') {
    for (var i = 0; i < AnalysysAgent.length; i++) {
        var item = AnalysysAgent[i]
    	if(Util.objHasKay(ans,item[0])){
    		ans[item[0]](item[1])
    	}
    }
}
window.AnalysysAgent =ans
export default AnalysysAgent