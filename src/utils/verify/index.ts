
import { isString, isArray, isNumber, isBoolean, isObject, isFunction } from "../type"
import { errorLog } from '../../module/printLog/index'
import { msgetype } from '../../types'
import { readOnlyAttrs } from '../../constant/eventAttrs'
import { config } from '../../store/config'

/**
 * 长度校验
 * @param value 
 * @param max 
 * @param min
 * @returns 
 */

export function lengthCheck(value: string, max  = 255, min  = 1): boolean {
  if (!isString(value)) {
    return false
  }
  const len = value.length
  return len < max && len >= min
}

/**
 * 自定义属性key校验
 * @param value 
 * @param eventName 
 * @returns 
 */

export function attrNameCheck (value: string, logObj?: msgetype): boolean {
  let state = true
  if (!lengthCheck(value, 99)) {
    state = false
  } else if (readOnlyAttrs.indexOf(value) > -1){
    state = false
    if (logObj) {
      logObj.code = 600012
    }
  } else {
    state = /^[$a-zA-Z][a-zA-Z0-9_$]{0,}$/.test(value)
  }
  if (logObj && logObj.fn && !state) {
    errorLog(logObj)
  }
  return state
}

/**
 * 自定义属性值校验
 * @param value 
 */
export function attrValueCheck (value: any, logObj?: msgetype): boolean {

  let state = false

  if (isString(value) || isNumber(value) || isArray(value) || isBoolean(value)) {
    state = true
    if (isString(value)) {
      if (!lengthCheck(value, 255)) {
        state = false
      }
    } else if (isArray(value)) {
      const some = value.some(o => lengthCheck(o, 255))
      state = some
    }
  }

  if (logObj && logObj.fn && logObj.key && !state) {
    errorLog(logObj)
  }

  return state
}

/**
 * 属性校验，不通过的提示并删除
 * @param value 
 * @param eventName 事件名称, 如果存在则抛出错误提示
 */
export function attrCheck (value: any, eventName?: string): object {

  const arrs = {}
  
  if (!isObject(value)) {
    errorLog({
      code: 600016,
      fn: eventName,
      value: value
    })
    return {}
  }

  for (const key in value) {
    const item = isFunction(value[key]) ? value[key]() : value[key]
    if (attrNameCheck(key, {code: 600023, fn: eventName, key: key}) && attrValueCheck(item, {code: 600022, fn: eventName, key: key, value: item})) {
      arrs[key] = item
    }
  }

  return arrs
}

/**
 * 验证是否全埋点统计黑名单
 * @param autoClickBlackList 全埋点统计黑名单
 * @param el 
 * @returns boo
 */
export function autoClickBlackListCheck (autoClickBlackList: any, el?: EventTarget): boolean {
  if (autoClickBlackList) {
    const location = window.location
    if (isString(autoClickBlackList)) {
      const url = location.href,
          urlHost = location.protocol + '//' + location.host,
          urlPath = urlHost + location.pathname,
          urlIndex = urlPath + 'index.html',
          urlHash = urlPath + location.hash,
          urlArray = [url, urlHost, urlIndex, urlPath, urlHash];
      if (urlArray.indexOf(autoClickBlackList) > -1) {
        return true
      }
    } else if (isFunction(autoClickBlackList)) {
      return autoClickBlackList(el)
    } else if (isArray(autoClickBlackList)) {
      for (let i = 0; i < autoClickBlackList.length; i++) {
        if (autoClickBlackListCheck(autoClickBlackList[i], el) === true) {
          return true
        }
      }
    }
  }
  return false
}


function checkElementConfig (trackList, el) {
  if (!trackList || (isArray(trackList) && trackList.length === 0) || (isString(trackList) && trackList === '')) {
    return false
  }
  if (isString(trackList)) {
    const tagName = el.tagName.toLowerCase()
    const className = '.' + el.className.split(' ').join('.')
    const id = el.id ? '#' + el.id : ''

    if (tagName === trackList.toLowerCase() || className === trackList || id === trackList || tagName + className === trackList || tagName + id === trackList || id + className === trackList || tagName + id + className === trackList) {
      return true
    }
  } else if (isArray(trackList)) {
    for (let i = 0; i < trackList.length; i++) {
      if (checkElementConfig(trackList[i], el)) {
        return true
      }
    }
  } else if (isFunction(trackList)) {
    return trackList.call(trackList, el) || false
  } else if (isObject(trackList) && trackList === el) {
    return true
  }
  return false
}


/**
 * 判断当前元素是否为可触控元素
 */
 export function elementClickableCheck (el) {
  const trackList = config.trackList
  let tagName = el.tagName.toLowerCase()
  const clickableElementList = ['a', 'button', 'input', 'select', 'textarea', 'svg'] // option无法触发点击事件

  function getElementAttrClick () {
   return el.getAttribute('data-ark-click') !== null
  }
  
  let parent = el.parentNode
  if (parent && parent.tagName && clickableElementList.indexOf(tagName) === -1) {
    while (parent) {
      if (parent.tagName) {
        const parentTagName = parent.tagName.toLowerCase();
        if (['button', 'select', 'body'].indexOf(parentTagName) > -1) {
          tagName = parentTagName
          break
        }
        parent = parent.parentNode
      } else {
        break
      }
    }
  }
  
  if (clickableElementList.indexOf(tagName) > -1 || getElementAttrClick() || checkElementConfig(trackList, el)) {
    if (tagName === 'svg' && el.children && el.children.length > 0) {
      let svgIsClickable = false
      const svgChildren = el.children
      for (let i = 0; i < svgChildren.length; i++) {
        if (svgChildren[i].tagName.toLowerCase() === 'use' &&
          (svgChildren[i].getAttribute('xlink:href') || getElementAttrClick() || checkElementConfig(trackList, el))) {
          svgIsClickable = true
        }
      }
      return svgIsClickable
    }
    return true
  }
  return false
}