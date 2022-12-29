

import sendData from '../sendData'
import fillData from '../fillData'
import { getSuperProperty } from '../../store/core'
import { attrCheck } from '../../utils/verify'
import { errorLog } from '../printLog'
import { isFunction } from '../../utils/type'
import { eventAttribute } from '../../store/eventAttribute'
import { assign } from '../../utils/object'

function track (eventName : string, eventAttrs, fn?: Function) {

  if (!/^[a-zA-Z$][a-zA-Z0-9_]{1,99}$|^[a-zA-Z]$/.test(eventName)) {
    errorLog({
      code: 600025,
      fn: 'track',
      value: eventName
    })
    return 
  }

  // 获取上报数据模块
  const res = fillData(eventName)
  
  let trackAttrs = {}

  
  if (eventAttrs && !isFunction(eventAttrs)) {
    trackAttrs = attrCheck(eventAttrs, eventName)
  }

  // 合并通用属性
  res.xcontext = assign({}, res.xcontext, getSuperProperty(), trackAttrs)



  // 回调函数
  let callback = fn ? fn : null
  if (isFunction(eventAttrs) && !fn) {
    callback = eventAttrs
  }

  sendData(res, callback)

}

export default track