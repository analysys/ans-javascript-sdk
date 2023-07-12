

import { globalWindow } from '../../constant/index'
import sendData from '../sendData'
import fillData from '../fillData'
import { getSuperProperty } from '../../store/core'
import { attrCheck } from '../../utils/verify'
import { errorLog } from '../printLog'
import { isFunction } from '../../utils/type'
import { assign } from '../../utils/object'
import { config } from '../../store/config'
import { eventAttribute } from '../../store/eventAttribute'
import { getNow } from '../../store/time'

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
  const res = fillData('track')
  let trackAttrs = eventAttrs && !isFunction(eventAttrs) ? attrCheck(eventAttrs, eventName) : {}

  // 增加使用时长属性
  if (eventAttribute.timeEvent[eventName]) {
    trackAttrs['$duration'] = getNow() - eventAttribute.timeEvent[eventName]
    delete eventAttribute[eventName]
  }

  res.xwhat = eventName
  // 合并通用属性
  res.xcontext = assign({}, res.xcontext, getSuperProperty(), trackAttrs)

  // 回调函数
  let callback = fn ? fn : null
  if (isFunction(eventAttrs) && !fn) {
    callback = eventAttrs
  }

  // 执行beforeTrack钩子，返回false则停止上报
  const beforeTrack = config.beforeTrack

  if (beforeTrack) {

    // 设置属性
    const setAttrs = (attrs: object) => {
      let obj = attrCheck(attrs, eventName)
      res.xcontext = assign({}, res.xcontext, obj)
      return res.xcontext
    }

    const obj = {...res, xcontext: {...res.xcontext}}
    if (beforeTrack.call(globalWindow.AnalysysAgent, obj, setAttrs) === false) {
      return res
    }
  }

  sendData(res, callback, true)
  return res
}

export default track