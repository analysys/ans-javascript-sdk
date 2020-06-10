/**
 * 生产事件日志模板
 * commonTemp 为公用事件模板，用于自定义事件日志
 */
import { fieldTemplate } from '../../configure/index.js'
import Util from '../common/index.js'
var eventTemp = {}
var commonTemp = {}
var baseTemp = fieldTemplate.base
var outerTemp = baseTemp.outer
for (var i = 0; i < outerTemp.length; i++) {
  if (baseTemp[outerTemp[i]]) {
    commonTemp[outerTemp[i]] = Util.toObj(baseTemp[outerTemp[i]])
  } else {
    commonTemp[outerTemp[i]] = ''
  }
}

for (var key in fieldTemplate) {
  if (key !== 'base') {
    var keyTemp = Util.toDeepObj(fieldTemplate[key])
    eventTemp[key + 'base'] = keyTemp
    eventTemp[key] = Util.objMerge(commonTemp, keyTemp)
  }
}

eventTemp.commonTemp = commonTemp

function temp (eventName) {
  return eventTemp[eventName] || eventTemp.commonTemp
}

export { temp }
