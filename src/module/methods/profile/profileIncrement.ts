import { sendProfile } from './utils'
import ready from '../../ready'


/**
 * 设置用户属性的相对变化值(相对增加，减少)，只能对数值型属性进行操作，如果这个 Profile之前不存在，则初始值为0。
 * @param propertyName 
 * @param propertyValue 
 */
function profileIncrement (propertyName, propertyValue, fn?: Function) {
  sendProfile('$profile_increment', propertyName, propertyValue, fn)
}

export default ready(profileIncrement)