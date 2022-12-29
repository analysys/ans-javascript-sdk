import { getCore } from '../../store/core'
import { config } from '../../store/config'
import { getCookie, setCookie, setLocalStorage, getLocalStorage } from '../../utils/storage'
import { getDomainFromUrl } from '../../utils/path'

const domainUrl = getDomainFromUrl(true)
const cookieKey = domainUrl ? 'FZ_STROAGE.' + domainUrl : ''


// 获取缓存数据
export function getStorage() {

  // 跨子域
  if (config.crossSubdomain) {
    return (cookieKey ? getCookie(cookieKey) : null) || getLocalStorage() || null
  }
  return getLocalStorage() || getCookie(cookieKey) || null
}

// 设置缓存数据
export function setStorage() {

  const data = getCore()

  if (config.crossSubdomain) {

    // 通用属性不存储在cookie里，防止太大
    const cookieData = { ...data }
    delete cookieData.ARKSUPER

    if (cookieKey) {
      setCookie(cookieKey, cookieData, {
        expires: 365 * 20,
        domain: domainUrl
      })
    }
  }

  setLocalStorage('FZ_STROAGE', data)
}

// 清空历史cookie，根据场景只保留一个
export function emptyHistoryCookie () {
  
  const ARKID = getCookie('ARK_ID')
  const ARKSTARTUP = getCookie('ARK_STARTUP')

  if (ARKID) {
    setCookie('ARK_ID', null, {
      domain: domainUrl
    })
  }

  if (ARKSTARTUP) {
    setCookie('ARK_STARTUP', null, {
      domain: domainUrl
    })
  }

  // 删掉cookie
  if (!config.crossSubdomain) {
    const cookie = cookieKey ? getCookie(cookieKey) : null
    if (cookie) {
      setCookie(cookieKey, null, {
        domain: domainUrl
      })
    }
  }
}