/**
 * 发布API
 */
import * as ans from './API/index.js'
import Util from './lib/common/index.js'
import baseConfig from './lib/baseConfig/index.js'
import * as getField from './lib/fillField/getField.js'
import { lifecycle } from './configure/index.js'
import { startUp, clearCache } from './API/template/startUp.js'
import { ieCreat } from './lib/compatible/index.js'

function _createAnsSDK () {
  if (Util.paramType(window.AnalysysAgent) === 'Array') {
    var AnalysysAgent = []
    Array.prototype.push.apply(AnalysysAgent, window.AnalysysAgent)
    window.AnalysysAgent = ans
    ieCreat()
    if (window.navigator.userAgent.indexOf('AnalysysAgent/Hybrid') > -1) {
      if (lifecycle.AnalysysAgent && Util.paramType(lifecycle.AnalysysAgent.hybridAns) === 'Object') {
        lifecycle.AnalysysAgent.hybrid(AnalysysAgent)

        for (var i = 0; i < AnalysysAgent.length; i++) {
          var item = AnalysysAgent[i]
          if (item[0] === 'name') {
            window[item[1]] = lifecycle.AnalysysAgent.hybridAns
          }
          if (item[0] === 'SDKFileDirectory') {
            lifecycle.AnalysysAgent.hybridAns.SDKFileDirectory = item[1]
          }
        }
        window.AnalysysAgent = lifecycle.AnalysysAgent.hybridAns
      }
    } else {
      for (var index = 0; index < AnalysysAgent.length; index++) {
        var indexItem = AnalysysAgent[index]

        if (Util.paramType(getField[indexItem[0]]) === 'Function') {
          getField[indexItem[0]](indexItem[1])
        } else {
          baseConfig.base[indexItem[0]] = indexItem[1]
        }
      }
      clearCache()
      for (var y = 0; y < AnalysysAgent.length; y++) {
        var yItem = AnalysysAgent[y]
        if (Util.objHasKay(ans, yItem[0]) && (yItem[0] === 'identify' || yItem[0] === 'alias' || yItem[0].indexOf('Super') > -1)) {
          var args = yItem.length > 1 ? yItem.slice(1, yItem.length) : []
          ans[yItem[0]].apply(ans[yItem[0]], args)
        }
      }

      if (lifecycle.AnalysysAgent && lifecycle.AnalysysAgent.init) {
        lifecycle.AnalysysAgent.init(baseConfig.base)
      }

      // 如存在修改则重置登录及启动状态
      startUp()
      try {
        // 启动完毕后执行调用上报日志累接口
        if (Util.paramType(AnalysysAgent) === 'Array') {
          for (var z = 0; z < AnalysysAgent.length; z++) {
            var zItem = AnalysysAgent[z]
            if (Util.objHasKay(ans, zItem[0]) && zItem[0] !== 'identify' && zItem[0] !== 'alias' && zItem[0].indexOf('Super') < 0) {
              var zArgs = zItem.length > 1 ? zItem.slice(1, zItem.length) : []
              ans[zItem[0]].apply(ans[zItem[0]], zArgs)
            }
            if (zItem[0] === 'name') {
              window[zItem[1]] = ans
            }
          }
        }
      } catch (e) { }
    }
  }
}
var ansConfig = window.AnalysysAgent
var ansObj = Util.objMerge({
  init: function (config) {
    if (!ansConfig && Util.paramType(config) === 'Object') {
      window.AnalysysAgent = []

      for (var key in config) {
        window.AnalysysAgent.push([key, config[key]])
      }
      _createAnsSDK()
      this.config = Util.objMerge(this.config, config)
    }
  },
  config: baseConfig.base
}, ans)
if (Util.paramType(ansConfig) === 'Array') {
  var config = {}
  for (var i = 0; i < ansConfig.length; i++) {
    config[window.AnalysysAgent[i][0]] = window.AnalysysAgent[i][1]
  }
  _createAnsSDK()
  window.AnalysysAgent.config = Util.objMerge(ansObj.config, config)
}
export default ansObj