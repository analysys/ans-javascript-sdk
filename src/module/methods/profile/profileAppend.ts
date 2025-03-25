import { sendProfile } from './utils'
import ready from '../../ready'


/**
 * 用户列表属性增加元素。
 * @param propertyName 
 * @param propertyValue 
 */
function profileAppend (propertyName, propertyValue, fn?: Function) {
  sendProfile('$profile_append', propertyName, propertyValue, fn)
}

export default ready(profileAppend)