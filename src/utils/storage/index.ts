
import { globalWindow } from '../../constant/index'
import { getCore } from '../../store/core'
import { encode, decode } from '../base64/index'
import cookie from '../../utils/cookie'


const storageKey = 'FZ_STROAGE'

export const getLocalStorage = function (key = storageKey, isSession?: boolean) {
  try {
    const storage = isSession ? globalWindow.sessionStorage : globalWindow.localStorage
    const data = storage.getItem(key)
    return data ? JSON.parse(decode(data)) : null
  } catch(e) {

  }
}

export const setLocalStorage = function (key = storageKey, data: any = getCore(), isSession?: boolean) {
  try {
    const storage = isSession ? globalWindow.sessionStorage : globalWindow.localStorage
    storage.setItem(key, encode(JSON.stringify(data)))
  } catch(e) {

  }
}

export const getCookie = function(key = storageKey) {
  const data = cookie(key)
  if (data) {
    try {
      return JSON.parse(decode(data))
    } catch (e) {
      return data
    }
  }
  return null
}

export const setCookie = function(key = storageKey, data, option?) {
  cookie(key, data !== null ? encode(JSON.stringify(data)) : null, option)
}