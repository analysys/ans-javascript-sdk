
import { attrNameCheck } from '../../../utils/verify'
import { getSuperProperty} from '../../../store/core'
import { isObject } from '../../../utils/type'
import { setAttrs } from './utils'
import ready from '../../ready'

/**
 * 设置单个通用属性
 * @param name string
 * @param value string  number  boolean Array<string>
 */
function registerSuperProperty (name: string, value: string | number | boolean | Array<string>, fn?) {
  const methodName = '$registerSuperProperty'

  // 兼容用友传入的是对象
  if (isObject(name)) {
    setAttrs(name, methodName)
    fn && fn(getSuperProperty())
    return
  }

  if (attrNameCheck(name, {code: 600023, fn: methodName, key: name})) {
    const obj = {
      [name]: value
    }
    setAttrs(obj, methodName)
    fn && fn(getSuperProperty())
  }
}

export default ready(registerSuperProperty, true)