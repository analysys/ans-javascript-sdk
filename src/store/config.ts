
import { initConfig } from '../types'
import { optionsDefault } from '../constant'
import { isBoolean, isNumber, isString, isArray, isFunction, isObject } from '../utils/type'
import { lengthCheck } from '../utils/verify'
import { errorLog, successLog } from '../module/printLog'
import { coreInit } from './core'
import { implementAallbackArr } from '../module/ready'
import { getServerTime } from './time'
import autoTrigger from '../module/autoTrigger'

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
    verify: [lengthCheck]
  },
  uploadURL: {
    verify: [lengthCheck]
  },
  debugMode: {
    verify: [isNumber]
  },
  name: {
    verify: [isString]
  },
  auto: {
    verify: [isBoolean]
  },
  autoProfile: {
    verify: [isBoolean]
  },
  encryptType: {
    verify: [isNumber]
  },
  hash: {
    verify: [isBoolean]
  },
  allowTimeCheck: {
    verify: [isBoolean]
  },
  maxDiffTimeInterval: {
    verify: [isNumber, function (value: any){
      if (value <= 0) {
        return false
      }
      return true
    }]
  },
  autoTrack: {
    verify: [isBoolean]
  },
  autoCompleteURL: {
    verify: [isBoolean]
  },
  autoPageViewDuration: {
    verify: [isBoolean]
  },
  sendDataTimeout: {
    verify: [isNumber]
  },
  sendType: {
    verify: [isString]
  },
  autoClickBlackList: {
    verify: [nameListCheck]
  },
  autoHeatmap: {
    verify: [isBoolean]
  },
  SDKFileDirectory: {
    verify: [isString]
  },
  visitorConfigURL: {
    verify: [isString]
  },
  crossSubdomain: {
    verify: [isBoolean]
  },
  pageProperty: {
    verify: [isObject]
  },
  pageViewBlackList: {
    verify: [nameListCheck]
  },
  userClickProperty: {
    verify: [isObject]
  }
}

export const config : initConfig = optionsDefault()

// 是否初始化参数配置
export let isInitConfig  = false

export function setConfig (options: initConfig, fn?) {
  const optionArr = Object.keys(options)
  optionArr.forEach(o => {
    const rule = configRule[o]
    if (rule && rule.verify.length) {
      let value = options[o]
      let isOk = true
      for (let i = 0; i < rule.verify.length; i++) {
        const fn = rule.verify[i]
        if (!fn(value)) {
          isOk = false
          break
        }
      }
      if (!isOk) {
        errorLog({
          key: o,
          code: 60002,
          value: value
        }, true)
      } else {
        if (o === 'SDKFileDirectory' || o === 'visitorConfigURL') {
          if (value && value[value.length - 1] !== '/') {
            value += '/'
          }
        }
        config[o] = value
      }
    }
  })

  isInitConfig = true

  coreInit()

  successLog({
    code: 20007
  })

  // 自动触发生命周期相关钩子
  autoTrigger()

  getServerTime(() => {
    implementAallbackArr()
  })

  implementAallbackArr()

  fn && fn(config)
}

export function getConfig (): object {
  return config
}