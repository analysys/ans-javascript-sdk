
import { getSuperProperty, delSuperProperty} from '../../../store/core'
import { successLog } from '../../printLog'
import ready from '../../ready'

/**
 * 删除单个属性
 * @param superPropertyName 属性名称
 */
function unRegisterSuperProperty (superPropertyName: string, fn?) {
  delSuperProperty(superPropertyName)
  successLog({
    fn: '$unRegisterSuperProperty',
    code: 20003,
    value: superPropertyName
  })
  fn && fn(getSuperProperty())
}

export default ready(unRegisterSuperProperty)