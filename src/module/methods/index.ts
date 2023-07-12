
import { registerSuperProperty, registerSuperProperties, getSuperProperty, getSuperProperties, unRegisterSuperProperty, clearSuperProperties} from './superProperty'
import pageView from './pageView'
import pageClose from './pageClose'
import startUp from './startUp'
import appStart from './appStart'
import end from './end'
import alias from './alias'
import userClick from './userClick'
import webClick from './webClick'
import webstay from './webstay'
import { profileSetOnce, profileSet, profileAppend, profileIncrement, profileDelete, profileUnset } from './profile'
import reset from './reset'
import { getPresetProperties } from './presetProperties'
import track from './track'
import timeEvent from './timeEvent'
import { identify, getDistinctId} from './identify'
import { pageProperty } from './pageProperty'
import nativeCallback from './nativeCallback'

export {
  startUp,
  appStart,
  registerSuperProperty,
  registerSuperProperties,
  getSuperProperty,
  getSuperProperties,
  unRegisterSuperProperty,
  clearSuperProperties,
  pageView,
  pageClose,
  end,
  track,
  timeEvent,
  alias,
  userClick,
  webClick,
  webstay,
  profileSetOnce, profileSet, profileAppend, profileIncrement, profileDelete, profileUnset,
  reset,
  getPresetProperties,
  identify,
  getDistinctId,
  pageProperty,
  nativeCallback
}