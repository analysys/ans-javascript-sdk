
import { isObject, isFunction } from '../../../utils/type'
import sendData from '../../sendData'
import fillData from '../../fillData'
import { attrCheck, lengthCheck, attrValueCheck, attrNameCheck } from '../../../utils/verify'
import { commonAttrs } from '../../../constant/eventAttrs'
import { assign } from '../../../utils/object'

export function sendProfile (eventName, propertyName, propertyValue, fn?: Function) {
  // 获取上报数据模块
  const res = fillData(eventName)

  // 删除掉不相关属性
  commonAttrs.forEach(o => {
    if (res.xcontext[o]) {
      delete res.xcontext[o]
    }
  })

  let property = {}

  if (isObject(propertyName)) {
    property = propertyName
  }

  if (lengthCheck(propertyName) && attrValueCheck(propertyValue)) {
    property[propertyName] = propertyValue
  }

  res.xcontext = assign({}, res.xcontext, attrCheck(property, eventName))

  // 回调函数
  let callback = fn ? fn : null
  if (isFunction(propertyValue) && !fn) {
    callback = propertyValue
  }
  sendData(res, callback)
}