
import { globalWindow } from '../../constant/index'
import sendData from '../sendData'
import fillData from '../fillData'
import { getPageProperty, delPageProperty } from '../../store/pageProperty'
import { getSuperProperty } from '../../store/core'
import { eventAttribute } from '../../store/eventAttribute'
import { config } from '../../store/config'
import { assign } from '../../utils/object'
import { attrCheck } from '../../utils/verify/index'

function pageClose () {

  // 获取上报数据模块
  const res = fillData('page_close')

  // 过滤掉某些机型获取不到$url的pageclose
  if (res.xcontext && !res.xcontext.$url) {
    return
  }

  function getHideTime () {
    const pageCloseAttr = eventAttribute.pageClose
    const hideTime = pageCloseAttr.hideTime
    return !pageCloseAttr.hideStartTime ? hideTime : (hideTime + (res.xwhen - pageCloseAttr.hideStartTime))
  }

  // 获取访问时长，排除小于0情况
  const pagestaytime = res.xwhen - eventAttribute.pageview.xwhen - getHideTime()
  const attrs = {
    pagestaytime: pagestaytime > 0 ? pagestaytime : res.xwhen - eventAttribute.pageview.xwhen
  }

  // 填充当前pv上报的title
  const title = eventAttribute.pageview['$title']
  if (title) {
    attrs['$title'] = title
  }

  // 合并通用属性 // 绑定页面属性
  res.xcontext = assign({}, res.xcontext, getSuperProperty(), getPageProperty(), attrs)
  
  // 删除页面属性
  delPageProperty()

  eventAttribute.pageClose.hideStartTime = 0
  eventAttribute.pageClose.hideTime = 0

  // 执行beforePageClose钩子，返回false则停止上报
  const beforePageClose = config.beforePageClose
  if (beforePageClose) {
    
    const obj = {...res, xcontext: {...res.xcontext}}

    // 设置属性
    const setAttrs = (attrs: object) => {
      const obj = attrCheck(attrs, 'page_close')
      res.xcontext = assign({}, res.xcontext, obj)
      return res.xcontext
    }

    if (beforePageClose.call(globalWindow.AnalysysAgent, obj, setAttrs) === false) {
      return res
    }
  }
  sendData(res)
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
if (document.hidden) {
  eventAttribute.pageClose.hideStartTime = +new Date()
}
export function setPageHideTime () {
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