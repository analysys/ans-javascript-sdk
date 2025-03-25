import { getSuperProperty} from '../../../store/core'
import { setAttrs } from './utils'
import ready from '../../ready'

/**
 * 设置多个属性
 * @param superProperty 属性
 * @returns 
 */
function registerSuperProperties (superProperty: object, fn?) {
  setAttrs(superProperty, '$registerSuperProperties')
  fn && fn(getSuperProperty())
}

export default ready(registerSuperProperties, true)