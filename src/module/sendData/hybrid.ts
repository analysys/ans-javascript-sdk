import { globalWindow } from '../../constant/index'
import { isHybrid } from '../../store/hybrid'
import { nativeCallbackFn } from '../../store/hybrid'

const eventMap = {
  '$startup': 'startUp',
  '$pageview': 'pageView',
  '$alias': 'alias',
  'page_close': 'pageClose',
  '$profile_set_once': 'profileSetOnce',
  '$profile_set': 'profileSet',
  '$profile_increment': 'profileIncrement',
  '$profile_append': 'profileAppend',
  '$profile_unset': 'profileUnset',
  '$profile_delete': 'profileDelete'
}


// hybrid模式下上报事件
function callNative (functionName: string, functionParams?: Array<any>, isCallback?:boolean) {
  let obj = {
    functionName: eventMap[functionName] || functionName,
    functionParams: functionParams
  }

  // 是否需要native回调js
  if (isCallback) {
    obj['callbackFunName'] = 'nativeCallback'
  }
  
  // ios
  if (
    globalWindow.webkit && 
    globalWindow.webkit.messageHandlers && 
    globalWindow.webkit.messageHandlers.AnalysysAgent && 
    globalWindow.webkit.messageHandlers.AnalysysAgent.postMessage
  ) {
    globalWindow.webkit.messageHandlers.AnalysysAgent.postMessage(obj)
  }
  
  // 安卓
  if (
    globalWindow.AnalysysAgentHybrid &&
    globalWindow.AnalysysAgentHybrid.analysysHybridCallNative
  ) {
    globalWindow.AnalysysAgentHybrid.analysysHybridCallNative(JSON.stringify(obj))
  }
}

// hybrid模式下回调类方法
export function callNativeCallback(functionName, functionParams, fn) {
  if (fn) {
    nativeCallbackFn[functionName] ? nativeCallbackFn[functionName].push(fn) : nativeCallbackFn[functionName] = [fn]
  }
  callNative(functionName, functionParams ? [functionParams] : [], true)
}

// 实时同步h5的url给原生端
export function setHybirdWebUrl () {
  if (isHybrid) {
    callNative('getHybirdWebURL', [{
      url: document.location.href
    }])
  }
}

export default callNative