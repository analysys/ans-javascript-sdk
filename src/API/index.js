// import '../lib/compatible/index.js'
import { pageView } from './template/pageView.js'
import { track } from './template/track.js'
import { freeApi } from './template/freeApi.js'
import { getPresetProperties } from './template/getPresetProperties.js'
import { alias } from './template/alias.js'
import { identify } from './template/identify.js'
import { profileSet } from './template/profileSet.js'
import { profileSetOnce } from './template/profileSetOnce.js'
import { profileIncrement } from './template/profileIncrement.js'
import { profileAppend } from './template/profileAppend.js'
import { profileUnset } from './template/profileUnset.js'
import { profileDelete } from './template/profileDelete.js'
import { registerSuperProperty } from './template/registerSuperProperty.js'
import { registerSuperProperties } from './template/registerSuperProperties.js'
import { getSuperProperty } from './template/getSuperProperty.js'
import { getSuperProperties } from './template/getSuperProperties.js'
import { unRegisterSuperProperty } from './template/unRegisterSuperProperty.js'
import { clearSuperProperties } from './template/clearSuperProperties.js'
import { reset } from './template/reset.js'
// import { push } from './template/push.js'
import { getDistinctId } from './template/getDistinctId.js'

export {
  pageView,
  profileSet,
  profileSetOnce,
  profileIncrement,
  profileAppend,
  profileUnset,
  profileDelete,
  alias,
  identify,
  track,
  registerSuperProperty,
  registerSuperProperties,
  getSuperProperty,
  getSuperProperties,
  unRegisterSuperProperty,
  clearSuperProperties,
  reset,
  freeApi,
  // push,
  getDistinctId,
  getPresetProperties
}
