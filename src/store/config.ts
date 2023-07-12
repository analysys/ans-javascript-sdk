
import { initConfig } from '../types'
import { optionsDefault } from '../constant'
import { isBoolean, isNumber, isString, isArray, isFunction, isObject } from '../utils/type'
import { lengthCheck, booleanCheck } from '../utils/verify'
import { errorLog, successLog } from '../module/printLog'
import { coreInit } from './core'
import { implementAallbackArr, isReady, implementBeforeInit } from '../module/ready'
import { getServerTime } from './time'
import autoTrigger from '../module/autoTrigger'
import { setPageProperty } from './pageProperty'

function nameListCheck (value: any) {
  if (isString(value)) {
    return true
  } else if(isFunction(value)) {
    return true
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      if (!isString(item) && !isFunction(item)) {
        return false
      }
    }
    return true
  }
}

const configRule = {
  appkey: {
    ck: [isString]
  },
  uploadURL: {
    ck: [isString]
  },
  debugMode: {
    ck: [isNumber]
  },
  name: {
    ck: [isString]
  },
  auto: {
    ck: [booleanCheck]
  },
  autoProfile: {
    ck: [booleanCheck]
  },
  encryptType: {
    ck: [isNumber]
  },
  hash: {
    ck: [booleanCheck]
  },
  allowTimeCheck: {
    ck: [booleanCheck]
  },
  maxDiffTimeInterval: {
    ck: [isNumber, function (value: any) {
      if (value <= 0) {
        return false
      }
      return true
    }]
  },
  autoTrack: {
    ck: [booleanCheck]
  },
  autoCompleteURL: {
    ck: [booleanCheck]
  },
  autoPageViewDuration: {
    ck: [booleanCheck]
  },
  sendDataTimeout: {
    ck: [isNumber]
  },
  sendType: {
    ck: [isString]
  },
  autoClickBlackList: {
    ck: [nameListCheck]
  },
  autoHeatmap: {
    ck: [booleanCheck]
  },
  SDKFileDirectory: {
    ck: [isString]
  },
  visitorConfigURL: {
    ck: [isString]
  },
  crossSubdomain: {
    ck: [booleanCheck]
  },
  pageProperty: {
    ck: [isObject]
  },
  pageViewBlackList: {
    ck: [nameListCheck]
  },
  userClickProperty: {
    ck: [isObject]
  },

  // track上报之前执行该函数，返回false则停止上报
  beforeTrack: {
    ck: [isFunction]
  },
  // pageView上报之前执行该函数，返回false则停止上报
  beforePageView: {
    ck: [isFunction]
  },
  // PageClose上报之前执行该函数，返回false则停止上报
  beforePageClose: {
    ck: [isFunction]
  },
  // 通知sdk客户端程序已经准备好了
  beforeInit: {
    ck: [isFunction]
  }
}

export const config : initConfig = optionsDefault()

// 是否完成初始化参数配置
export let isInitConfig  = false

export function setConfig (options: initConfig, fn?) {
  const optionArr = Object.keys(options)
  optionArr.forEach(o => {
    const rule = configRule[o]
    if (rule && rule.ck.length) {
      let value = options[o]
      let isOk = true
      for (let i = 0; i < rule.ck.length; i++) {
        const fn = rule.ck[i]
        if (!fn(value, o)) {
          isOk = false
          break
        }
      }
      if (isOk) {
        if (o === 'SDKFileDirectory' || o === 'visitorConfigURL') {
          if (value && value[value.length - 1] !== '/') {
            value += '/'
          }
        }
        if (o === 'pageProperty' && value) {
          setPageProperty(value)
        }
        config[o] = value
      }
    }
  })

  function procedure() {
    if (isReady()) {

      successLog({
        code: 20007
      })

      // 执行初始化完成之前缓存的上报
      implementAallbackArr()

      // 自动触发生命周期相关钩子
      autoTrigger()

      fn && fn(config)
    }
  }

  // 客户端程序是否准备就绪
  implementBeforeInit(procedure)

  // 日期校准成功
  getServerTime(procedure)
  
  // 核心内容准备就绪
  coreInit(() => {
    isInitConfig = true
    procedure()
  })
}

export function getConfig (): object {
  return config
}