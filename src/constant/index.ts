import { initConfig } from '../types'

export const $lib = '$LIB'
export const $lib_version = '$LibVERSION'
export const $ans = '$ANS'

export const storageKey = 'FZ_STROAGE'


export const globalWindow = window as any;

// sdk配置参数默认值
export function optionsDefault() : initConfig {
  return {
    appkey: '',
    uploadURL: '',
    debugMode: 0,
    visitorConfigURL: '',
    name: '',

    autoStartUp: true,
    auto: true,
    

    SDKFileDirectory: '',

    autoTrack: false,
    autoClickBlackList: '',
    userClickProperty: {},
    trackList: [],

    autoHeatmap: false,
    autoWebstay: true,
    webstayDuration: 18000000,
    autoProfile: true,
    hash: true,
    encryptType: 0,
    allowTimeCheck: false,
    maxDiffTimeInterval: 30,
    autoPageViewDuration: false,
    sendDataTimeout: 10000,
    getDataTimeout: 10000,
    sendType: 'img',
    crossSubdomain: false
  }
}

const lifeCycleList = []