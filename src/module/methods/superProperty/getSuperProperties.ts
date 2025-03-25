
import { getSuperProperty as getSuperAttrs} from '../../../store/core'
import { callNativeCallback } from '../../sendData/hybrid'
import { isHybrid } from '../../../store/hybrid'
import ready from '../../ready'

/**
 * 获取所有通用属性
 */
function getSuperProperties (fn?) {
  if (isHybrid) {
    callNativeCallback('getSuperProperties', null, fn)
  } else {
    const value = getSuperAttrs()
    fn && fn(value)
    return value
  }
}

export default ready(getSuperProperties)