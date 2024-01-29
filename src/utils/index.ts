

import { isString } from './type'


// 字符串超过255截取
export function stringSlice (str) {
  if (isString(str) && str.length > 255) {
    return str.slice(0, 254) + '$'
  }
  return str
}