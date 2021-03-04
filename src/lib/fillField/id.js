/**
 * 用户ID 操作集
 * ARK_LOGINID>ARK_TRACKID>ARK_ID
 */
import Storage from '../storage/index.js'
import Util from '../common/index.js'

function getId () {
  var id = Storage.getLocal('ARK_LOGINID') || Storage.getLocal('ARK_TRACKID') || Storage.getLocal('ARK_ID')
  if (!id || id === '[object Object]') {
    id = setUUId()
    Storage.setLocal('ARK_ID', id)
  }
  // if(!Storage.getCookie("ARK_ID")){
  Storage.setCookie('ARK_ID', getIdentifyId() || getUUId())
  // }
  return id
}

function setUUId () {
  var timeRandom = (new Date().getTime()).toString() + (Math.random() * 10000).toString()
  var id = 'JS' + Util.MD5((timeRandom).toString(), 32) + Util.MD5((timeRandom).toString(), 32).slice(0, 4)

  // var storageId = Storage.getCookie("ARK_ID")
  // if (storageId && storageId.length > 10) {
  //     id = Storage.getCookie("ARK_ID")
  // }
  Storage.setCookie('ARK_ID', id)
  return id
}

function getUUId () {
  var id = Storage.getLocal('ARK_ID')
  if (!id) {
    id = setUUId()
    Storage.setLocal('ARK_ID', id)
  }
  return id
}

function removeUUId () {
  Storage.removeLocal('ARK_ID')
}

function setAliasId (id) {
  Storage.setLocal('ARK_LOGINID', id)
}

function getAliasId () {
  return Storage.getLocal('ARK_LOGINID')
}

function removeAliasId () {
  Storage.removeLocal('ARK_LOGINID')
}

function setIdentifyId (id) {
  Storage.setLocal('ARK_TRACKID', id)
}

function getIdentifyId () {
  return Storage.getLocal('ARK_TRACKID')
}

function removeIdentifyId () {
  Storage.removeLocal('ARK_TRACK_LOGIN')
  Storage.removeLocal('ARK_TRACKID')
}

export {
  getId,
  setUUId,
  getUUId,
  removeUUId,
  setAliasId,
  getAliasId,
  removeAliasId,
  setIdentifyId,
  getIdentifyId,
  removeIdentifyId
}
