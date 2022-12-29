
import { globalWindow } from "../../constant"
import { isString, isArray, isHtmlCollection } from "../type"

// 获取设备类型
export function getDeviceType (): string {

  const u = globalWindow.navigator.userAgent
  
  if ((u.indexOf('Tablet') > -1 && u.indexOf('PC') < 0) || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1) {
    return 'tablet'
  }
  if (u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1) {
    return 'phone'
  }
  return 'desktop'
}


export function addEvent (el, type, fn, useCapture) {
  if (document.addEventListener) {
    if ((isArray(el) || isHtmlCollection(el)) && el.length && el !== window) {
      for (let i = 0; i < el.length; i++) {
        this.addEvent(el[i], type, fn, useCapture)
      }
    } else {
      el.addEventListener(type, fn, useCapture)
    }
  } else {
    if (el.length && el !== window) {
      for (let index = 0; index < el.length; index++) {
        this.addEvent(el[index], type, fn)
      }
    } else {
      el.attachEvent('on' + type, function () {
        return fn.call(el, window.event)
      })
    }
  }
}

export function removeEvent (el, type, fn, useCapture) {
  if (document.removeEventListener) {
    if (el.length) {
      for (let i = 0; i < el.length; i++) {
        this.removeEvent(el[i], type, fn, useCapture)
      }
    } else {
      el.removeEventListener(type, fn, useCapture)
    }
  } else {
    if (el.length) {
      for (let index = 0; index < el.length; index++) {
        this.removeEvent(el[index], type, fn)
      }
    } else {
      el.detachEvent('on' + type, function () {
        return fn.call(el, window.event)
      })
    }
  }
}

function CheckChinese (val) {
  const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
  if (reg.test(val)) {
    return true
  }
  return false
}

export function getUrlParam (paraName) {
  let url = document.location.toString()
  const wName = window.name
  if (isString(wName) && wName.indexOf(paraName) > -1) {
    url = wName
  }
  const arrObj = url.split('?')
  if (arrObj.length > 1) {
    const arrPara = [] // arrObj[1].split("&")
    for (let i = 1; i < arrObj.length; i++) {
      arrPara.push.apply(arrPara, arrObj[i].split('&'))
    }
    let arr
    for (let index = 0; index < arrPara.length; index++) {
      arr = arrPara[index].split('=')
      if (arr != null && arr[0] === paraName) {
        let value = arr[1]
        if (arr[1].indexOf('#') > -1) {
          value = value.split('#')[0]
        }
        if (value.indexOf('%') > -1) {
          try {
            const utfValue = decodeURI(value)
            if (CheckChinese(utfValue)) {
              return utfValue
            }
          } catch (e) { }

          if (globalWindow.AnalysysModule && globalWindow.AnalysysModule.decodeGBK) {
            try {
              const gbkValue = globalWindow.AnalysysModule.decodeGBK(value, 'gbk')
              return gbkValue
            } catch (e) { }
          }
        }
        
        return value
      }
    }
    return ''
  } else {
    return ''
  }
}

// 动态加载js
export function loadJs (fillPath: string, fn?) {
  const createScript = document.createElement('script')
  createScript.type = 'text/javascript'
  createScript.async = true
  createScript.src = fillPath
  createScript.onload = fn
  const body = document.getElementsByTagName('body')[0] || document.getElementsByTagName('head')[0]
  if (body) {
    body.appendChild(createScript)
  }
}