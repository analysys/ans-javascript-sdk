
import { getSuperProperty as getSuperAttrs} from '../../../store/core'
import { callNativeCallback } from '../../sendData/hybrid'
import { isHybrid } from '../../../store/hybrid'
import ready from '../../ready'

/**
 * 获取单个通用属性
 */
function getSuperProperty (superPropertyName: string, fn?) {
  if (isHybrid) {
    callNativeCallback('getSuperProperty', superPropertyName, fn)
  } else {
    const value = getSuperAttrs(superPropertyName)
    fn && fn(value)
    return value
  }
}

export default ready(getSuperProperty)