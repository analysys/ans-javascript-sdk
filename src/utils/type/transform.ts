// 类型转换

import { isObject, isString } from "./index"

/**
 * 值转换成字符串
 */

export function valToString(value: any) : string {
  if (value === undefined || value === null) {
    return ''
  }
  if (isObject(value)) {
    return JSON.stringify(value)
  }
  return value + ''
}


/**
 * 值转换成数字
 * @param value 
 */

export function valToNumber (value: any) : number | '' {
  if (value === undefined || value === null || value === '') {
    return ''
  }
  if (value >= -Infinity) {
    return value - 0
  }
  return ''
}

/**
 * json转换为串行字符串
 * @param value 
 */
export function jsonToString (value: object): string {
  const strArr = []
  for (const key in value) {
    let newValue = value[key]
    if (isString(newValue)) {
      newValue = encodeURIComponent(value[key])
    } else if (isObject(newValue)) {
      newValue = encodeURIComponent(JSON.stringify(value[key]))
    }
    strArr.push(key + '=' + newValue)
  }
  return strArr.join('&')
}


/**
 * headers字符串转json
 */

export function headersToJson (headers: string): object {
  const arr = headers.trim().split(/[\r\n]+/)
  const headerMap = {}
  arr.forEach((line) => {
    const parts = line.split(': ')
    const header = parts.shift()
    const value = parts.join(': ')
    headerMap[header] = value
  })
  return headerMap
}