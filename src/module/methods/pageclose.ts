
import { globalWindow } from '../../constant/index'
import sendData from '../sendData'
import fillData from '../fillData'
import { getPageProperty, delPageProperty } from '../../store/pageProperty'
import { getSuperProperty } from '../../store/core'
import { eventAttribute } from '../../store/eventAttribute'
import { config } from '../../store/config'
import { assign } from '../../utils/object'
import { attrCheck } from '../../utils/verify/index'
import { getHref } from '../../utils'
import { getDeviceType } from "../../utils/browser"

function pageClose () {

  // 获取上报数据模块
  const res = fillData('page_close')

  // 过滤掉某些机型获取不到$url的pageclose
  if (res.xcontext && !res.xcontext.$url) {
    return
  }

  // 过滤异常数据，用户不太可能在一个页面上持续活跃超过60分钟
  const MAX_STAY_TIME = 60 * 60 * 1000; 

  // 获取访问时长，排除小于0情况
  const attrs = {
    pagestaytime: Math.max(300, Math.min(res.xwhen - eventAttribute.pageview.xwhen, MAX_STAY_TIME))
  }

  // 填充当前pv上报的title
  const title = eventAttribute.pageview['$title']
  if (title) {
    attrs['$title'] = title
  }

  // 合并通用属性 // 绑定页面属性
  // globalWindow.AnalysysModule?.pageClose?.pageEndProperty 兼容PageViewStayTime设置的页面属性
  res.xcontext = assign({}, res.xcontext, getSuperProperty(), getPageProperty(), attrs, globalWindow.AnalysysModule?.pageClose?.pageEndProperty)
  
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
  eventAttribute.pageview.path = getHref()
}