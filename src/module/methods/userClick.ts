
import sendData from '../sendData'
import fillData from '../fillData'
import { isFunction, isObject, isString } from '../../utils/type'
import { getSuperProperty } from '../../store/core'
import { setUserClickAttrs } from '../../store/clickElement'
import { config } from '../../store/config'
import { autoClickBlackListCheck, elementClickableCheck } from '../../utils/verify/index'
import { assign } from '../../utils/object'

function userClick(event) {

  if (!config.autoTrack) {
    return
  }
  
  const el = event.target || event.srcElement
  
  // 不做上报的页面路径
  const autoClickBlackList = config.autoClickBlackList
  if (autoClickBlackListCheck(autoClickBlackList, el)) {
    return
  }

  // 是否可以点击的页面元素
  if (!elementClickableCheck(el)) {
    return
  }

  // 获取用户自定义上报属性
  const configUserClickPro = config.userClickProperty
  let userClickPro = {}
  if (isObject(configUserClickPro)) {
    for (const key in configUserClickPro) {
      const item = configUserClickPro[key]
      if (isFunction(item)) {
        userClickPro[key] = item.call(item, el)
      } else {
        userClickPro[key] = item
      }
    }
  } else if (isFunction(configUserClickPro)) {
    userClickPro = configUserClickPro.call(configUserClickPro, el)
  }

  // ???属性
  let property = el.getAttribute('data-ark-click') || {}
  if (isString(property)) {
    try {
      property = JSON.parse(property)
    } catch (e) { }
  }
  if (!isObject(property)) {
    property = {}
  }

  // 设置全埋点预制属性
  setUserClickAttrs(el)

  // 获取上报数据模块
  const res = fillData('$user_click')

  // 合并通用属性
  res.xcontext = assign({}, res.xcontext, getSuperProperty(), userClickPro, property)

  sendData(res)
  
}

export default userClick