
import { initConfig } from '../types'
import { optionsDefault } from '../constant'
import { isString, isArray, isFunction } from '../utils/type'
import { booleanCheck, functionCheck, numberCheck, stringCheck, objectCheck } from '../utils/verify'
import { successLog } from '../module/printLog'
import { coreInit } from './core'
import { implementAallbackArr, isReady, implementBeforeInit } from '../module/ready'
import { getServerTime } from './time'
import autoTrigger from '../module/autoTrigger'
import { setPageProperty } from './pageProperty'
import { loadVisual } from '../module/methods/visual'

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
    ck: [stringCheck]
  },
  uploadURL: {
    ck: [stringCheck]
  },
  debugMode: {
    ck: [numberCheck]
  },
  name: {
    ck: [stringCheck]
  },
  auto: {
    ck: [booleanCheck]
  },
  autoProfile: {
    ck: [booleanCheck]
  },
  encryptType: {
    ck: [numberCheck]
  },
  hash: {
    ck: [booleanCheck]
  },
  allowTimeCheck: {
    ck: [booleanCheck]
  },
  maxDiffTimeInterval: {
    ck: [numberCheck, function (value: any) {
      if (value <= 0) {
        return false
      }
      return true
    }]
  },
  autoTrack: {
    ck: [booleanCheck]
  },
  trackList: {
    ck: [nameListCheck]
  },
  autoCompleteURL: {
    ck: [booleanCheck]
  },
  autoPageViewDuration: {
    ck: [booleanCheck]
  },
  sendDataTimeout: {
    ck: [numberCheck]
  },
  sendType: {
    ck: [stringCheck]
  },
  autoClickBlackList: {
    ck: [nameListCheck]
  },
  autoHeatmap: {
    ck: [booleanCheck]
  },
  SDKFileDirectory: {
    ck: [stringCheck]
  },
  visitorConfigURL: {
    ck: [stringCheck]
  },
  crossSubdomain: {
    ck: [booleanCheck]
  },
  pageProperty: {
    ck: [objectCheck]
  },
  pageViewBlackList: {
    ck: [nameListCheck]
  },
  userClickProperty: {
    ck: [objectCheck]
  },

  // track上报之前执行该函数，返回false则停止上报
  beforeTrack: {
    ck: [functionCheck]
  },
  // pageView上报之前执行该函数，返回false则停止上报
  beforePageView: {
    ck: [functionCheck]
  },
  // PageClose上报之前执行该函数，返回false则停止上报
  beforePageClose: {
    ck: [functionCheck]
  },
  // 通知sdk客户端程序已经准备好了
  beforeInit: {
    ck: [functionCheck]
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

  // 动态加载可视化交互文件
  loadVisual()

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