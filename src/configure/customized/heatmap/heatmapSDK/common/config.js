import Util from '../../../../../lib/common/index.js'
import Storage from '../../../../../lib/storage/index.js'

var heatmapConfig = window.ARK_HEATMAP && window.ARK_HEATMAP.config
var ifarmeMessageList = []
var showMapConfig = {
  type: 'heatmap',
  content: {},
  control: {},
  contentText: {},
  isRefresh: false,
  max: 10,
  rightMaxNum: 100
}

function backParam () {
  var params = {
    content: showMapConfig.content,
    times: +new Date() + (Storage.getLocal('ANSSERVERTIME') ? Number(Storage.getLocal('ANSSERVERTIME')) : 0)
  }
  params.content.requestType = 'web'

  params.content.appKey = heatmapConfig.appid
  if (!params.content.deviceType) {
    params.content.deviceType = Util.deviceType()
  }
  if (showMapConfig.isRefresh === true) {
    params.content.useCache = false
  } else {
    params.content.useCache = true
  }
  // if (!params.content["dbUrlDomain"]) {
  // var urlPath = params.content["urlDomain"] || params.content["urlPath"]
  // if (!urlPath) {
  //     urlPath = location.protocol + '//' + location.host + location.pathname + location.hash
  //     urlPath = urlPath.split('?')[0]
  // }
  // // urlPath = urlPath.split('#')[0]
  // params.content["urlDomain"] = params.content["urlPath"] = urlPath
  // }

  showMapConfig.isRefresh = false
  params.content = JSON.stringify(params.content)

  var param = []
  for (var key in params) {
    param.push(key + '=' + encodeURIComponent(params[key]))
  }
  param = param.join('&')
  return param
}
export {
  heatmapConfig,
  ifarmeMessageList,
  showMapConfig,
  backParam
}
