
import { getSuperProperty, delSuperProperty} from '../../../store/core'
import { successLog } from '../../printLog'
import ready from '../../ready'

/**
 * 删除所有属性
 */
function clearSuperProperties (fn?) {
  delSuperProperty()
  successLog({
    fn: '$clearSuperProperties',
    code: 20004
  })
  fn && fn(getSuperProperty())
}

export default ready(clearSuperProperties)