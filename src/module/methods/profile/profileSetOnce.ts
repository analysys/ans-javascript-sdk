import { sendProfile } from './utils'
import ready from '../../ready'

/**
 * 设置用户固有属性
 * @param propertyName 
 * @param propertyValue 
 */
function profileSetOnce (propertyName?: any, propertyValue?: any, fn?: Function) {

  sendProfile('$profile_set_once', propertyName, propertyValue, fn)
}

export default ready(profileSetOnce)