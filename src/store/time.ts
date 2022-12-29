


/**
 * 服务器时间，开始时间校准时用到
 */

import io from '../utils/requrst/ajax'
import { config } from './config'
import { successLog } from '../module/printLog'
import { dateFormat } from '../utils/date'

// 服务器时间
export let serverTime  = 0

// 是否已获取过服务器时间
export let isGetServerTime  = false

// 服务器时间与本地时间的差值
export let timeDiff  = 0

/**
 * 返回校准后的当前时间
 * 
 */
export function getNow () : number {
  const now = +new Date()
  return now + timeDiff
}

// 获取服务器时间
export function getServerTime (fn?) {
  
  if (!config.allowTimeCheck || serverTime) {
    isGetServerTime = true
    fn && fn(serverTime)
    return
  }

  io({
    url: config.uploadURL,
    timeout: 800
  }, (res) => {
    if (res && res.header && res.header.date) {
      const timeNow = +new Date()
      serverTime = +new Date(res.header.date)
      const diff = Math.abs((serverTime - timeNow) / 1000)
        // 开启时间校准
      if (diff > config.maxDiffTimeInterval) {
        timeDiff = serverTime - timeNow
        successLog({
          code: 20013,
          value: dateFormat(new Date(serverTime), 'yyyy-MM-dd hh:mm:ss +SSS'),
          key: dateFormat(new Date(timeNow), 'yyyy-MM-dd hh:mm:ss +SSS'),
          fn: diff + 's'
        })
      }
    }
    isGetServerTime = true
    fn && fn(serverTime)
  }, (err) => {
    isGetServerTime = true
    fn && fn(serverTime)
  })
  
}