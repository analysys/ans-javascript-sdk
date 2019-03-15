/**
 * 用户ID 操作集
 * ARK_LOGINID>ARK_TRACKID>ARK_ID
 */
import Storage from '../Storage/index.js'
import Util from '../common/index.js'

function getId() {
    var id = Storage.getLocal('ARK_LOGINID') || Storage.getLocal('ARK_TRACKID') || Storage.getLocal('ARK_ID')
    if (!id) {
        id = setUUId()
        Storage.setLocal('ARK_ID', id)
    }
    return id
}

function setUUId() {
    var timeRandom = new String(new Date().getTime()) + new String(Math.random() * 10000);
    return 'JS' + Util.MD5(new String(timeRandom),32) + Util.MD5(new String(timeRandom),32).slice(0, 4);
}


function getUUId() {
    var id = Storage.getLocal('ARK_ID')
    if (!id) {
        id = createId()
    }
    Storage.setLocal('ARK_ID', id)
    return id
}

function removeUUId() {
    Storage.removeLocal('ARK_ID')
}

function setAliasId(id) {
    Storage.setLocal('ARK_LOGINID', id)
}

function getAliasId() {
    return Storage.getLocal('ARK_LOGINID')
}

function removeAliasId() {
    Storage.removeLocal('ARK_LOGINID')
}


function setIdentifyId(id) {
    Storage.setLocal('ARK_TRACKID', id)
}

function getIdentifyId() {
    return Storage.getLocal('ARK_TRACKID')
}

function removeIdentifyId() {
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