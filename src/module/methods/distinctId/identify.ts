

import { setAnonymousID } from '../../../store/core'
import { lengthCheck } from '../../../utils/verify/index'
import { successLog, errorLog } from '../../printLog'
import { globalWindow } from '../../../constant'
import ready from '../../ready'

/**
 * 唯一匿名ID标识设置
 * @param distinctId 自定义设备身份标识，取值长度 1 - 255字符, 支持类型：String
 */
function identify(distinctId: string, fn?: Function) : void {
  if (lengthCheck(distinctId)) {
    
    setAnonymousID(distinctId)
    
    successLog({
      code: 20002,
      value: distinctId,
      fn: 'identify'
    })

    fn && fn()

    // ea 触达
    globalWindow.AnalysysModal && globalWindow.AnalysysModal([{ xwhat: '$identify', xwho: distinctId }])
  } else {
    errorLog({
      code: 60009,
      fn: 'identify',
      value: distinctId
    })
  }
}


export default ready(identify)