
import sendData from '../sendData'
import fillData from '../fillData'
import { getPageProperty, delPageProperty } from '../../store/pageProperty'
import { getSuperProperty } from '../../store/core'
import { eventAttribute } from '../../store/eventAttribute'
import { config } from '../../store/config'
import { assign } from '../../utils/object'

function pageClose () {

  // 获取上报数据模块
  const res = fillData('page_close')

  // 过滤掉某些机型获取不到$url的pageclose
  if (res.xcontext && !res.xcontext.$url) {
    return
  }

  function getHideTime () {
    if (!eventAttribute.pageClose.hideStartTime) {
      return eventAttribute.pageClose.hideTime
    } else {
     return eventAttribute.pageClose.hideTime + (res.xwhen - eventAttribute.pageClose.hideStartTime)
    }
  }

  const attrs = {
    pagestaytime: res.xwhen - eventAttribute.pageview.xwhen - getHideTime()
  }

  // 合并通用属性 // 绑定页面属性
  res.xcontext = assign({}, res.xcontext, getSuperProperty(), getPageProperty(), attrs)
  
  // 删除页面属性
  delPageProperty()

  sendData(res)

  eventAttribute.pageClose.hideStartTime = 0
  eventAttribute.pageClose.hideTime = 0
}

export default pageClose


// 触发pageclose
export function triggerPageClose () {
  if (config.autoPageViewDuration && eventAttribute.pageview.xwhen) {
    pageClose()
  }
  eventAttribute.pageview.prevPath = eventAttribute.pageview.path
  eventAttribute.pageview.path = document.location.href
}

// 设置页面隐藏时间
export function setPageHideTime (hideFn?, showFn?) {
  if ('onvisibilitychange' in document && config.autoPageViewDuration) {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        eventAttribute.pageClose.hideStartTime = +new Date()
      } else {
        eventAttribute.pageClose.hideTime = eventAttribute.pageClose.hideTime + (+new Date() - eventAttribute.pageClose.hideStartTime)
        eventAttribute.pageClose.hideStartTime = 0
      }
    })
  }
}