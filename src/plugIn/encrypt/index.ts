import encUtf8 from 'crypto-js/enc-utf8'
import aes from 'crypto-js/aes'
import ecb from 'crypto-js/mode-ecb'
import pako from 'pako'
import base64js from 'base64-js'
import MD5 from "../../utils/md5"
import { encode } from '../../utils/base64'
import { globalWindow } from '../../constant/index'

let reqt:string = ''

function getSpv(lib, appid, lib_version) {
  const policyversion = ''
  const appversion = ''
  const spv = lib + '|' + appid + '|' + lib_version + '|' + policyversion + '|' + appversion
  return encodeURIComponent(encode(spv))
}

function encryptKey(lib, appid, libVersion) {
  reqt = +new Date() + ''
  const orgkey : string = lib + appid + libVersion + reqt
  //MD5+base64+切割为数组
  let base64Str = encode(MD5(orgkey, 32).toUpperCase()).split('')
  const F = libVersion.split('.')
  const F1 = F[F.length - 1]
  const F2 = F[F.length - 2]
  if (!((Number(F2) % 2) == 0)) {
    //倒叙
    base64Str = base64Str.reverse();
  }
  let key = ''
  for (let i = 0; i < base64Str.length; i++) {
    //偶数位
    if (i % 2 === 0 && !(Number(F1) % 2 === 0)) {
      key += base64Str[i]
    } else if (!(i % 2 === 0) && Number(F1) % 2 === 0) {
      key += base64Str[i]
    }
  }
  if (key.length < 16) {
    key += key.split('').reverse().join('')
  }
  return key.slice(0, 16)
}

function getEncryptData(data, lib, appid, libVersion, encryptType) {
  let key = encryptKey(lib, appid, libVersion)
  key = encUtf8.parse(key);
  let encryptData = ''
  if (encryptType === 1) {
    encryptData = aes.encrypt(data, key, {
      mode: ecb
    })
  }
  if (encryptType === 2) {
    const iv = encUtf8.parse('Analysys_315$CBC');
    encryptData = aes.encrypt(data, key, {
      iv: iv
    });
  }
  encryptData = encryptData.ciphertext.toString().toUpperCase()
  const pakoZip = pako.gzip(encryptData)
  return base64js.fromByteArray(pakoZip)
}

function uploadData(option) {
  const dataArray = option.data;
  const lib = dataArray[0].xcontext.$lib
  const appid = dataArray[0].appid
  const libVersion = dataArray[0].xcontext.$lib_version
  option.data = getEncryptData(JSON.stringify(dataArray), lib, appid, libVersion, option.encryptType);
  option.url += '&spv=' + getSpv(lib, appid, libVersion) + '&reqt=' + reqt + '&reqv=' + option.encryptType;
  return option
}

globalWindow.AnalysysModule ? globalWindow.AnalysysModule.uploadData = uploadData : globalWindow.AnalysysModule = { uploadData }

export {
  uploadData
}