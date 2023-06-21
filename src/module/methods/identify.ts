

import { setAnonymousID, getAnonymousID } from '../../store/core'
import { lengthCheck } from '../../utils/verify/index'
import { successLog, errorLog } from '../printLog'
import { globalWindow } from '../../constant'
import { callNativeCallback } from '../sendData/hybrid'
import { isHybrid } from '../../store/hybrid'

/**
 * 唯一匿名ID标识设置
 * @param distinctId 自定义设备身份标识，取值长度 1 - 255字符, 支持类型：String
 */
export function identify(distinctId: string, fn?: Function) : void {
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


/**
 * 获取用户通过identify接口设置或自动生成的id，优先级如下： 用户设置的id > 代码自动生成的id
 * @returns 
 */

export function getDistinctId(fn?: Function) : string {
  if (isHybrid) {
    callNativeCallback('getDistinctId', null, fn)
  } else {
    const id = getAnonymousID()
    fn && fn(id)
    return id
  }
  
}