
import { isObject, isFunction } from '../../utils/type'
import sendData from '../sendData'
import fillData from '../fillData'
import { errorLog } from '../printLog'
import { attrCheck, lengthCheck, attrValueCheck, attrNameCheck } from '../../utils/verify'
import { commonAttrs } from '../../constant/eventAttrs'
import { assign } from '../../utils/object'

function sendProfile (eventName, propertyName, propertyValue, fn?: Function) {
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

/**
 * 设置用户固有属性
 * @param propertyName 
 * @param propertyValue 
 */
export function profileSetOnce (propertyName?: any, propertyValue?: any, fn?: Function) {

  sendProfile('$profile_set_once', propertyName, propertyValue, fn)
}


/**
 * 给用户设置单个或多个属性，如果之前不存在，则新建，否则覆盖
 * @param propertyName 
 * @param propertyValue 
 */
export function profileSet (propertyName, propertyValue, fn?: Function) {
  sendProfile('$profile_set', propertyName, propertyValue, fn)
}


/**
 * 设置用户属性的相对变化值(相对增加，减少)，只能对数值型属性进行操作，如果这个 Profile之前不存在，则初始值为0。
 * @param propertyName 
 * @param propertyValue 
 */
export function profileIncrement (propertyName, propertyValue, fn?: Function) {
  sendProfile('$profile_increment', propertyName, propertyValue, fn)
}


/**
 * 用户列表属性增加元素。
 * @param propertyName 
 * @param propertyValue 
 */
export function profileAppend (propertyName, propertyValue, fn?: Function) {
  sendProfile('$profile_append', propertyName, propertyValue, fn)
}

/**
 * 删除当前用户单个属性值
 * @param propertyName 
 */
export function profileUnset (propertyName: string, fn?: Function) {

  // 获取上报数据模块
  const res = fillData('$profile_unset')

  // 删除掉不相关属性
  commonAttrs.forEach(o => {
    if (res.xcontext[o]) {
      delete res.xcontext[o]
    }
  })

  if (attrNameCheck(propertyName)) {
    res.xcontext = assign({}, res.xcontext, {
      [propertyName]: ''
    })
  } else {
    errorLog({
      code: 600010,
      fn: 'profileUnset',
      key: propertyName
    })
  }

  sendData(res, fn)
}


/**
 * 删除当前用户所有属性值
 */
export function profileDelete (fn?: Function) {

  // 获取上报数据模块
  const res = fillData('$profile_delete')

  // 删除掉不相关属性
  commonAttrs.forEach(o => {
    if (res.xcontext[o]) {
      delete res.xcontext[o]
    }
  })

  sendData(res, fn)
}