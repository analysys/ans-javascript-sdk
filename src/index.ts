/**
 * js标准版sdk
 */
import { initConfig } from './types'
import { setConfig, config } from './store/config'
import { globalWindow, optionsDefault } from './constant/index'
import ready from './module/ready'
import { webViewHybridInit } from './store/hybrid'
import {
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
  nativeCallback
} from './module/methods/index'
import { errorMessage } from './module/printLog'

webViewHybridInit()

class ArkJsSdk {
  constructor () {
    
  }
  isInit = false;
  config: initConfig = config;
  pageView = ready(pageView);
  registerSuperProperty = ready(registerSuperProperty, true);
  registerSuperProperties = ready(registerSuperProperties, true);
  getSuperProperty = ready(getSuperProperty);
  getSuperProperties = ready(getSuperProperties);
  unRegisterSuperProperty = ready(unRegisterSuperProperty);
  clearSuperProperties = ready(clearSuperProperties);
  profileSetOnce = ready(profileSetOnce);
  profileSet = ready(profileSet);
  profileAppend = ready(profileAppend);
  profileIncrement = ready(profileIncrement);
  profileDelete = ready(profileDelete);
  profileUnset = ready(profileUnset);
  reset = ready(reset);
  track = ready(track);
  timeEvent= timeEvent;
  alias = ready(alias);
  getPresetProperties = ready(getPresetProperties);
  identify = ready(identify);
  getDistinctId = ready(getDistinctId);
  pageProperty = ready(pageProperty);
  nativeCallback = nativeCallback;


  // 初始化传入配置
  init (config: initConfig) {
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