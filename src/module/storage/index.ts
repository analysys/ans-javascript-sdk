import { getCore } from '../../store/core'
import { config } from '../../store/config'
import { getCookie, setCookie, setLocalStorage, getLocalStorage } from '../../utils/storage'
import { getDomainFromUrl } from '../../utils/path'
import IndexedDb from '../../utils/IndexedDb'
import { globalWindow, storageKey } from '../../constant/index'

const domainUrl = getDomainFromUrl(true)
const cookieKey = domainUrl ? `${storageKey}.` + domainUrl : ''

const storeDb = new IndexedDb()
let dBhasData = false

export function getStorage (fn: Function) {
  const cookieStore = () => cookieKey ? getCookie(cookieKey) : null
  const store = getLocalStorage() || cookieStore() || null

  if (!globalWindow.indexedDB) {
    config.crossSubdomain ? fn(cookieStore() || getLocalStorage() || null) : fn(store)
  } else {
    const get = () => {
      storeDb.get((res) => {
        dBhasData = !!res
        const content = res ? res.content : store
        config.crossSubdomain ? fn(cookieStore() || content) : fn(content)
      })
    }
    storeDb.isOpen ? get() : storeDb.onConnectSuccess = get
  }
}

export function setStorage () {

  const data = getCore()

  if (config.crossSubdomain && cookieKey) {
    // 通用属性不存储在cookie里，防止太大
    const cookieData = { ...data }
    delete cookieData.ARKSUPER

    setCookie(cookieKey, cookieData, {
      expires: 365 * 20,
      domain: domainUrl
    })
    
  }

  if (globalWindow.indexedDB) {
    if (!dBhasData) {
      storeDb.add({
        id: 1,
        content: data
      })
    } else {
      storeDb.put({
        id: 1,
        content: data
      })
    }
  } else {
    setLocalStorage(storageKey, data)
  }
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

  // 如果indexedDb打开成功 删掉Storage
  if (storeDb.isOpen) {
    globalWindow.localStorage.removeItem(storageKey)
  }
}