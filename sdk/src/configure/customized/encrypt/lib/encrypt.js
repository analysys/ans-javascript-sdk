import encUtf8 from 'crypto-js/enc-utf8'
import aes from 'crypto-js/aes'
import ecb from 'crypto-js/mode-ecb'
import pako from 'pako'
import base64js from './base64js.min.js'
import Util from '../../../../lib/common/index.js'
import Storage from '../../../../lib/storage/index.js'

var encryptType = 0

var reqt = ''

function getSpv(lib, appid, lib_version) {
    var policyversion = ''
    var appversion = ''
    var spv = lib + '|' + appid + '|' + lib_version + '|' + policyversion + '|' + appversion

    return encodeURIComponent(Util.encode(spv))
}

function encryptKey(lib, appid, lib_version) {
    reqt = +new Date() + (Storage.getLocal("ANSSERVERTIME") ? Number(Storage.getLocal("ANSSERVERTIME")) : 0)
    var orgkey = lib + appid + lib_version + reqt
    //MD5+base64+切割为数组
    var base64Str = Util.encode(Util.MD5(new String(orgkey), 32).toUpperCase()).split('')
    var F = lib_version.split('.')
    var F1 = F[F.length - 1]
    var F2 = F[F.length - 2]
    if (!(Number(F2) % 2) == 0) {
        //倒叙
        base64Str = base64Str.reverse();
    } else {
        base64Str = base64Str
    }
    var key = ''
    for (var i = 0; i < base64Str.length; i++) {
        //偶数位
        if (i % 2 == 0 && !(Number(F1) % 2 == 0)) {
            key += base64Str[i]
        } else if (!(i % 2 == 0) && Number(F1) % 2 == 0) {
            key += base64Str[i]
        }
    }
    if (key.length < 16) {
        key += key.split('').reverse().join('')
    }
    return key.slice(0, 16)
}

function getEncryptData(data, lib, appid, lib_version) {

    var key = encryptKey(lib, appid, lib_version)
    key = encUtf8.parse(key);
    var encryptData = ''
    if (encryptType === 1) {
        encryptData = aes.encrypt(data, key, {
            mode: ecb
        })
    }
    if (encryptType === 2) {
        var iv = encUtf8.parse('Analysys_315$CBC');
        encryptData = aes.encrypt(data, key, {
            iv: iv
        })
    }
    encryptData = encryptData.ciphertext.toString().toUpperCase()
    var pakoZip = pako.gzip(encryptData)
    return base64js.fromByteArray(pakoZip)
}

function encryptInit(config) {
    if (config.encryptType === 1) {
        encryptType = 1
    }
    if (config.encryptType === 2) {
        encryptType = 2
    }

    return config
}

function uploadData(option) {
    if (encryptType !== 1 && encryptType !== 2) {
        return option
    }
    var dataArray = JSON.parse(option.data)
    var lib = dataArray[0].xcontext.$lib
    var appid = dataArray[0].appid
    var lib_version = dataArray[0].xcontext.$lib_version
    option.data = getEncryptData(option.data, lib, appid, lib_version)
    option.url += '&spv=' + getSpv(lib, appid, lib_version) + '&reqt=' + reqt + '&reqv=' + encryptType

    return option
}

function zipInflate(data) {
    return JSON.parse(pako.inflate(base64js.toByteArray(data), {
        to: 'string'
    }))
}
window.AnalysysModule = Util.objMerge(window.AnalysysModule || {}, {
    encryptInit,
    uploadData,
    zipInflate
})
export {
    encryptInit,
    uploadData,
    zipInflate
}