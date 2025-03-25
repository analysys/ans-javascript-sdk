/**
 * js标准版sdk
 */
import { initConfig } from './types'
import { setConfig, config } from './store/config'
import { globalWindow } from './constant/index'
import { webViewHybridInit, isHybrid } from './store/hybrid'
import {
  startUp,
  pageView,
  profileSetOnce, profileSet, profileAppend, profileIncrement, profileDelete, profileUnset,
  reset,
  track,
  timeEvent,
  alias,
  registerSuperProperty, registerSuperProperties, getSuperProperty, getSuperProperties,
  unRegisterSuperProperty,
  clearSuperProperties,
  getPresetProperties,
  identify,
  getDistinctId,
  pageProperty,
  nativeCallback,
  on
} from './module/methods/index'
import { errorMessage } from './module/printLog'
import './plugIn/index'

webViewHybridInit()

class ArkJsSdk {
  constructor () {}
  isInit: boolean = false;
  isHybrid: boolean = isHybrid;
  config: initConfig = config;
  appStart = startUp;
  pageView = pageView;
  registerSuperProperty = registerSuperProperty;
  registerSuperProperties = registerSuperProperties;
  getSuperProperty = getSuperProperty;
  getSuperProperties = getSuperProperties;
  unRegisterSuperProperty = unRegisterSuperProperty;
  clearSuperProperties = clearSuperProperties;
  profileSetOnce = profileSetOnce;
  profileSet = profileSet;
  profileAppend = profileAppend;
  profileIncrement = profileIncrement;
  profileDelete = profileDelete;
  profileUnset = profileUnset;
  reset = reset;
  track = track;
  timeEvent= timeEvent;
  alias = alias;
  getPresetProperties = getPresetProperties;
  identify = identify;
  getDistinctId = getDistinctId;
  pageProperty = pageProperty;
  nativeCallback = nativeCallback;

  on = on;

  // 初始化传入配置
  init (config: initConfig) {
    if (this.isInit) return
    if (!config.appkey) throw errorMessage['60006']
    if (!config.uploadURL) throw errorMessage['60007']
    
    setConfig(config, (o) => {
      if (this.config.name) {
        globalWindow[this.config.name] = globalWindow.AnalysysAgent
      }
      this.isInit = true
    })
  }
}

const ArkSdk = new ArkJsSdk()
globalWindow.AnalysysAgent = ArkSdk

export default ArkSdk

export {
  startUp as appStart, pageView, reset, track, pageProperty, alias, registerSuperProperty, registerSuperProperties, getSuperProperty, profileSetOnce, profileSet, profileAppend, profileIncrement, profileDelete, profileUnset, identify, getDistinctId, timeEvent
}