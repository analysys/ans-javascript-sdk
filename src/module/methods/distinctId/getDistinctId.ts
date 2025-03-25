

import { getAnonymousID } from '../../../store/core'
import { callNativeCallback } from '../../sendData/hybrid'
import { isHybrid } from '../../../store/hybrid'
import ready from '../../ready'

/**
 * 获取用户通过identify接口设置或自动生成的id，优先级如下： 用户设置的id > 代码自动生成的id
 * @returns 
 */

function getDistinctId(fn?: Function) : string {
  if (isHybrid) {
    callNativeCallback('getDistinctId', null, fn)
  } else {
    const id = getAnonymousID()
    fn && fn(id)
    return id
  }
}

export default ready(getDistinctId)