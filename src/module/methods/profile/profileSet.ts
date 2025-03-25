import { sendProfile } from './utils'
import ready from '../../ready'


/**
 * 给用户设置单个或多个属性，如果之前不存在，则新建，否则覆盖
 * @param propertyName 
 * @param propertyValue 
 */
function profileSet (propertyName, propertyValue, fn?: Function) {
  sendProfile('$profile_set', propertyName, propertyValue, fn)
}

export default ready(profileSet)