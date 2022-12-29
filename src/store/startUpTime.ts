
import { config } from "./config"
import { getLocalStorage, getCookie, setLocalStorage } from '../utils/storage'
import { dateFormat } from "../utils/date"


// 启动时间
export let startUpTime : {
  STARTUP?: boolean
  STARTUPTIME?: string
}

// 初始化时获取启动时间
export function initStartUpTime () {
  const data = getCookie('ARK_STARTUP') || getLocalStorage('FZ_SESSION', true) || {}
  startUpTime = data
}

// 设置启动时间
export function setStartUpTime () {
  startUpTime = {
    STARTUP: true,
    STARTUPTIME: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
  }
  setLocalStorage('FZ_SESSION', startUpTime, true)
}

// 清空时间
export function clearStartUpTime () {
  startUpTime = {}
  window.sessionStorage.removeItem('FZ_SESSION')
}