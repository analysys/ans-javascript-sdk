import { eventAttribute } from '../../store/eventAttribute'
import { getNow } from '../../store/time'


/**
 * 记录自定义事件的持续时长
 * @param eventName 事件名称
 */
function timeEvent (eventName: string) {
  eventAttribute.timeEvent[eventName] = getNow()
}

export default timeEvent