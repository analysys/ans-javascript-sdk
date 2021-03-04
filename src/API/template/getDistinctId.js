import { getUUId, getIdentifyId } from '../../lib/fillField/id.js'
import Util from '../../lib/common/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { transporter } from '../../lib/upload/hybrid.js'
function getDistinctId (callback) {
  if (baseConfig.base.isHybrid === true) {
    var callbackFn = 'AnsCallback' + +new Date()
    window[callbackFn] = function () {
      callback.apply(callback, arguments)
      delete window[callbackFn]
    }
    transporter('getDistinctId', [], callbackFn)
    return
  }
  var id = getIdentifyId() || getUUId()
  if (Util.paramType(callback) === 'Function') {
    callback.call(callback, id)
  }
  return id
}
export { getDistinctId }
