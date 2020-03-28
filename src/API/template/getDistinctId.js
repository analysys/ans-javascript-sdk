import { getUUId, getIdentifyId } from '../../lib/fillField/id.js'
import Util from '../../lib/common/index.js'
function getDistinctId (callback) {
  var id = getIdentifyId() || getUUId()
  if (Util.paramType(callback) === 'Function') {
    callback.call(callback, id)
  }
  return id
}
export { getDistinctId }
