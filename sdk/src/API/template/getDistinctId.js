import { getUUId, getIdentifyId } from '../../lib/fillField/id.js'

function getDistinctId() {
    return getIdentifyId() || getUUId()
}
export { getDistinctId }