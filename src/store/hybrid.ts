
import { globalWindow } from "../constant"
import { isFunction, isString } from "../utils/type"

export let isHybrid = false

export const hybrid = {
  userId: ''
}


// hybrid模式下缓存获取类方法用户回调函数
export const nativeCallbackFn = {}

/**
 * 初始化webViewHybrid模式
 */
export function webViewHybridInit () {
  
  const AnalysysAgentHybrid = globalWindow.AnalysysAgentHybrid
  
  if (AnalysysAgentHybrid) {

    if (AnalysysAgentHybrid.isHybrid) {
      isHybrid = AnalysysAgentHybrid.isHybrid()
    }

    // let info = AnalysysAgentHybrid.getAppStartInfo

    // if (info && isFunction(info)) {
    //   let webViewHybridData = info()

    //   console.log('Hybrid模式注入参数', webViewHybridData)
    //   if (isString(webViewHybridData)) {
    //     webViewHybridData = JSON.parse(webViewHybridData)
    //   }
    //   hybrid.userId = webViewHybridData.userId
    // }
  }
}