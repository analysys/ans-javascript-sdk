import { isGetServerTime } from '../../store/time'
import { isInitConfig } from '../../store/config'
import { globalWindow } from '../../constant/index'

/**
 * 准备就绪后开始上报数据
 */

interface callbackArrType {
  fn: (args: any[]) => void;
  arg: any;
}

let isReady = false

// 缓存sdk异步加载完成前的函数调用
let cacheFn = globalWindow.AnalysysAgent && globalWindow.AnalysysAgent.param ? globalWindow.AnalysysAgent.param : []

export let callbackArr: callbackArrType[] = []

// 执行缓存函数
export function implementAallbackArr () {
  if (isGetServerTime && isInitConfig) {

    // 执行sdk异步加载完成前的缓存函数
    if (cacheFn && cacheFn.length) {
      cacheFn.forEach(o => {
        const fn = globalWindow.AnalysysAgent[o.fn]
        fn && fn(...o.arg)
      })
      cacheFn = null
    }

    // 执行sdk没有初始化完成之前缓存函数
    if (callbackArr && callbackArr.length) {
      callbackArr.forEach(o => {
        o.fn.apply(o.fn, o.arg)
      })
      callbackArr = []
    }
    
    isReady = true
  }
}


function ready (callback, isTop?: boolean) {
  return function(...args: any[]) {
    
    // 没有获取到ServerTime 和 初始化之前先把触发事件存起来，等初始化和ServerTime完成后再调用
    if (!isGetServerTime || !isInitConfig || !isReady) {
      const obj = {
        fn: callback,
        arg: args
      }
      isTop ? callbackArr.unshift(obj) : callbackArr.push(obj)
    } else {
      callback.apply(callback, args)
    }
  }
}

export default ready