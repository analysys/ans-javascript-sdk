import { isGetServerTime } from '../../store/time'
import { isInitConfig, config } from '../../store/config'
import { globalWindow } from '../../constant/index'
import { isFunction } from '../../utils/type'
import { getNow } from '../../store/time'

/**
 * 准备就绪后开始上报数据
 */

interface callbackArrType {
  fn: (args: any[]) => void;
  arg: any;
  xwhen?: number;
}

// 缓存sdk异步加载完成前的函数调用
let cacheFn = globalWindow.AnalysysAgent && globalWindow.AnalysysAgent.param ? globalWindow.AnalysysAgent.param : []

export let callbackArr: callbackArrType[] = []

// 执行缓存函数
export function implementAallbackArr () {
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
}

// sdk初始化前钩子是否执行完成
let beforeInitReady = false
export const implementBeforeInit= (fn: () => any) => {
  function next () {
    if (!beforeInitReady) {
      beforeInitReady = true
      fn()
    }
  }
  const beforeInit = config.beforeInit
  if (beforeInit) {
    const f:any = beforeInit.call(globalWindow.AnalysysAgent, config, next)
    if (f instanceof Promise || (f && isFunction(f.then))) {
      f.then(() => {
        next()
      })
    }
  } else {
    next()
  }
}


// sdk是否准备就绪
export const isReady = () => {
  return isGetServerTime && isInitConfig && beforeInitReady
}

function ready (callback, isTop?: boolean) {
  return function(...args: any[]) {
    
    // 没有获取到ServerTime 和 初始化之前先把触发事件存起来，等初始化和ServerTime完成后再调用
    if (!isReady()) {
      const obj = {
        fn: callback,
        arg: args,
        xwhen: getNow()
      }
      isTop ? callbackArr.unshift(obj) : callbackArr.push(obj)
    } else {
      return callback.apply(callback, args)
    }
  }
}

export default ready