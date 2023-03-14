
import { globalWindow } from "../constant"
import { isFunction, isString } from "../utils/type"

export let isHybrid = false

export const hybrid = {
  userId: ''
}

/**
 * 初始化webViewHybrid模式
 */
export function webViewHybridInit () {
  
  const AnalysysAgentHybrid = globalWindow.AnalysysAgentHybrid
  
  if (AnalysysAgentHybrid) {

    if (AnalysysAgentHybrid.isHybrid) {
      isHybrid = AnalysysAgentHybrid.isHybrid()
    }

    if (AnalysysAgentHybrid.getAppStartInfo && isFunction(AnalysysAgentHybrid.getAppStartInfo)) {
      let webViewHybridData = AnalysysAgentHybrid.getAppStartInfo()
      if (isString(webViewHybridData)) {
        webViewHybridData = JSON.parse(webViewHybridData)
      }
      hybrid.userId = webViewHybridData.userId
    }
  }

  
}