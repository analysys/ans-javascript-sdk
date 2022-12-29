import { getServerTime, isGetServerTime } from '../../store/time'
import { core, resetCore, setCoreParams } from '../../store/core'
import { config, isInitConfig } from '../../store/config'
/**
 * 准备就绪后开始上报数据
 */

interface callbackArrType {
  fn: (args: any[]) => void;
  arg: any;
}

let isReady = false

export let callbackArr: callbackArrType[] = []

// 执行缓存函数
export function implementAallbackArr () {
  if (isGetServerTime && isInitConfig && callbackArr.length) {
    callbackArr.forEach(o => {
      o.fn.apply(o.fn, o.arg)
    })
    callbackArr = []
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
      // if (!isReady) {
      //   Promise.all([getServerTime()]).then(function() {
      //     const ARKDEBUG = core.ARKDEBUG
      //     if (config.appkey !== core.ARKAPPID || (ARKDEBUG === 1 && ARKDEBUG !== config.debugMode) || core.ARKUPLOADURL !== config.uploadURL) {
      //       if (core.ARKAPPID) {
      //         resetCore()
      //       }
      //       setCoreParams({
      //         ARKAPPID: config.appkey,
      //         ARKDEBUG: config.debugMode,
      //         ARKUPLOADURL: config.uploadURL
      //       })
      //     }
      //     callbackArr.forEach(o => {
      //       o.fn.apply(o.fn, o.arg)
      //     })
          
      //   })
      //   isReady = true
      // }
    } else {
      callback.apply(callback, args)
    }
  }
}

export default ready