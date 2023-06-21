
import { successLog } from '../printLog'
import { attrCheck, attrNameCheck } from '../../utils/verify'
import { setSuperProperty, getSuperProperty as getSuperAttrs, delSuperProperty } from '../../store/core'
import { isObject } from '../../utils/type'
import { callNativeCallback } from '../sendData/hybrid'
import { isHybrid } from '../../store/hybrid'

function setAttrs (superProperty, methodName) {
  const attrs = attrCheck(superProperty, methodName)
  if (Object.keys(attrs).length) {
    setSuperProperty(attrs)
    successLog({
      fn: methodName,
      code: 20002,
      value: superProperty
    })
  }
}

/**
 * 设置单个通用属性
 * @param name string
 * @param value string  number  boolean Array<string>
 */
export function registerSuperProperty (name: string, value: string | number | boolean | Array<string>, fn?) {
  const methodName = '$registerSuperProperty'

  // 兼容用友传入的是对象
  if (isObject(name)) {
    setAttrs(name, methodName)
    fn && fn(getSuperAttrs())
    return
  }

  if (attrNameCheck(name, {code: 600023, fn: methodName, key: name})) {
    const obj = {
      [name]: value
    }
    setAttrs(obj, methodName)
    fn && fn(getSuperAttrs())
  }
}

/**
 * 设置多个属性
 * @param superProperty 属性
 * @returns 
 */
export function registerSuperProperties (superProperty: object, fn?) {
  setAttrs(superProperty, '$registerSuperProperties')
  fn && fn(getSuperAttrs())
}

/**
 * 获取单个通用属性
 */
export function getSuperProperty (superPropertyName: string, fn?) {
  if (isHybrid) {
    callNativeCallback('getSuperProperty', superPropertyName, fn)
  } else {
    const value = getSuperAttrs(superPropertyName)
    fn && fn(value)
    return value
  }
  
}

/**
 * 获取所有通用属性
 */
export function getSuperProperties (fn?) {
  if (isHybrid) {
    callNativeCallback('getSuperProperties', null, fn)
  } else {
    const value = getSuperAttrs()
    fn && fn(value)
    return value
  }
}


/**
 * 删除单个属性
 * @param superPropertyName 属性名称
 */
export function unRegisterSuperProperty (superPropertyName: string, fn?) {

  delSuperProperty(superPropertyName)

  successLog({
    fn: '$unRegisterSuperProperty',
    code: 20003,
    value: superPropertyName
  })
  fn && fn(getSuperAttrs())
}

/**
 * 删除所有属性
 */
export function clearSuperProperties (fn?) {
  delSuperProperty()
  successLog({
    fn: '$clearSuperProperties',
    code: 20004
  })
  fn && fn(getSuperAttrs())
}