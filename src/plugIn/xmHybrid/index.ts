import { globalWindow } from '../../constant/index'


const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

function hybridSendData(data) {
  if (data.functionName === 'pageClose') {
    // data.functionName = 'page_close'
    return
  }

  // ios下startUp事件走自定义事件类型上报
  if (isIos && data.functionName === 'startUp') {
    // data.functionName = 'track'
    // data.functionParams = ['$startup', data.functionParams[0]]
    return
  }

  // ios
  if (isIos && globalWindow.WebViewJavascriptBridge && globalWindow.WebViewJavascriptBridge.callService) {
    globalWindow.WebViewJavascriptBridge.callService(function(){}, function(){}, 'AnalysysAgentPlugin', data.functionName, { 'props': data.functionParams });
  } else {
    var iframe = document.createElement('iframe')
    iframe.setAttribute('src', 'xib://app/analysysagent:' + JSON.stringify(data))
    iframe.setAttribute('id', 'AnalysysAgentIframe')
    iframe.setAttribute('style', 'display:none;')
    document?.body?.appendChild(iframe)
    iframe?.parentNode?.removeChild(iframe)
  }
}


globalWindow.AnalysysModule ? globalWindow.AnalysysModule.hybridSendData = hybridSendData : globalWindow.AnalysysModule = { hybridSendData }

export { hybridSendData }