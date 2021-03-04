/**
 * 合并定制模块
 *
 * base:基础模块
 * encrypt:数据加密模块
 * visitor:可视化模块
 * webstay:深度线采集模块
 * zh:招行模块
 * heatmap:热图采集及展示模块
 * device:设备信息模块
 * ua:上报ua模块
 * errorLog:校验失败上报$errorLog模块
 */
import * as base from './base/index.js'
import * as webstay from './customized/webstay/index.js'
import * as heatmap from './customized/heatmap/index.js'
import * as ua from './customized/UA/index.js'
import * as userClick from './customized/userClick/index.js'
import Util from '../lib/common/index.js'

var plugList = [webstay, heatmap, ua, userClick]
/**
 * 合并定制化模板 根据输入模板列表不同集合出不同的定制化模板
 */
var fieldRules = base.fieldRules || {}
var fieldTemplate = base.fieldTemplate || {}
var lifecycle = base.lifecycle || {}
for (var i = 0; i < plugList.length; i++) {
  if (plugList[i].fieldRules) {
    fieldRules = Util.objMerge(fieldRules, plugList[i].fieldRules)
  }
  if (plugList[i].fieldTemplate) {
    fieldTemplate = Util.objMerge(fieldTemplate, plugList[i].fieldTemplate)
  }
  if (plugList[i].lifecycle) {
    lifecycle = Util.fnMerge(lifecycle, plugList[i].lifecycle)
  }
}
export { fieldRules, fieldTemplate, lifecycle }
