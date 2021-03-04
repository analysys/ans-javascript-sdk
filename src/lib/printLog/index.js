import baseConfig from '../baseConfig/index.js'
import Util from '../common/index.js'
import { lifecycle } from '../../configure/index.js'
var errorMessage = {
  common: '{FN}:Property key invalid, nonsupport value: $lib/$lib_version/$platform/$first_visit_time/$debug/$is_login \n' +
    'current KEY:{KEY}',
  60001: '{FN}:Property key invalid, support type: String \n' +
    'current key:{KEY}\n',
  60002: '{FN}:Property value invalid of key[{KEY}], support type: Number \n' +
    'current value:{VALUE}\n' +
    'current type: {VALUETYPE}',
  60003: '{FN}:Property value invalid of key[{KEY}], support type: Boolean \n' +
    'current value:{VALUE}\n' +
    'current type: {VALUETYPE}',
  60004: '{FN}:Property value invalid of key[{KEY}], support type: Array \n' +
    'current value:{VALUE}\n' +
    'current type: {VALUETYPE}',
  60005: '{FN}:The length of the property[{KEY}] value (string[{VALUE}]) needs to be 1-255 !',
  60006: 'Please set appkey first.',
  60007: 'Please set uploadURL first.',
  60008: 'Send message failed.',
  60009: '{FN}:The length of the property key (string[{KEY}]) needs to be 1-125 !',
  600010: '{FN}:The length of the property key (string[{KEY}]) needs to be 1-99 !',
  600011: '{FN}:[{KEY}] does not conform to naming rules!',
  600012: '{FN}:Property key invalid, nonsupport value: $lib/$lib_version/$platform/$first_visit_time/$debug/$is_login \n' +
    'current KEY:{KEY}',
  600013: '{FN}:Property value invalid of key[{KEY}], support type: Array with String as its internal element \n' +
    'current value:{VALUE}\n' +
    'current type: {VALUETYPE}',
  600016: '{FN}:Property value invalid of key[{KEY}], support type: Object \n' +
    'current value:{VALUE}\n' +
    'current type: {VALUETYPE}',
  600017: '{FN}:The length of the property key (string[{KEY}]) needs to be 1-255 !',
  600018: '{FN}:Property value invalid of key[{KEY}] invalid, support type: String \n' +
    'current value:{VALUE}\n' +
    'current type: {VALUETYPE}',
  600019: '{FN}:The length of the property[{KEY}] value (string[{VALUE}]) needs to be 1-255 !',
  600020: '{FN}:Property value invalid of key[{KEY}], support type: Boolean/Array/String/Number \n' +
    'current value:{VALUE}\n' +
    'current type: {VALUETYPE}'
}
var successMessage = {
  common: '',
  20001: 'Send message success',
  20002: '{FN}: set success ({VALUE})',
  20003: '{FN}:({VALUE}) delete success',
  20004: '{FN}:clear success',
  20005: '{FN}:reset success',
  20006: 'set appkey success. current appkey : {VALUE}',
  20007: 'Init Analysys JS sdk success, version : {VALUE}',
  20008: 'set uploadURL success. current uploadURL : {VALUE}',
  20009: '{FN}:[{KEY}] : get failed',
  20010: '{FN}:[{KEY}] : get success. ({VALUE})',
  20011: '{FN}:({VALUE}) delete failed',
  20013: 'aliasID already bound'
}

function successLog (msg) {
  if (baseConfig.base.$debug !== 1 && baseConfig.base.$debug !== 2) {
    return
  }
  var status = baseConfig.status
  var successCode = status.successCode
  var fn = status.FnName
  var key = status.key
  var value = status.value
  var msgTemp = successMessage[successCode] || successMessage.common
  if (Util.paramType(key) === 'String' && key.length > 30) {
    key = Util.stringSlice(key, 30) + '...'
  }
  if (Util.paramType(fn) === 'String' && fn.length > 30) {
    fn = Util.stringSlice(fn, 30) + '...'
  }
  var showMsg = msgTemp.replace('{FN}', fn)
    .replace('{KEY}', key)
    .replace('{VALUE}', value)
  if (msg) {
    showMsg = msg
  }
  if (!showMsg) return

  window.console && window.console.log && window.console.log(showMsg)
}

function errorLog () {
  if (baseConfig.base.$debug !== 1 && baseConfig.base.$debug !== 2) {
    return
  }

  var status = baseConfig.status
  var errorCode = status.errorCode
  var fn = status.FnName
  var key = status.key
  var value = status.value
  if (Util.paramType(value) === 'Object') {
    value = JSON.stringify(value)
  }
  var valueType = Util.paramType(value)
  if (errorCode === '600018' && !key) {
    errorCode = '600011'
  }
  if (errorCode === '60005' && !key) {
    errorCode = '600017'
  }
  if ((errorCode === '600017' || errorCode === '600019' || errorCode === '60009' || errorCode === '600010' || errorCode === '60005') && Util.paramType(value) === 'String' && value.length && value.length > 30) {
    value = Util.stringSlice(value, 30) + '...'
  }
  if (Util.paramType(key) === 'String' && key.length > 30) {
    key = Util.stringSlice(key, 30) + '...'
  }
  if (Util.paramType(fn) === 'String' && fn.length > 30) {
    fn = Util.stringSlice(fn, 30) + '...'
  }
  var msgTemp = errorMessage[errorCode] || errorMessage.common
  var showMsg = msgTemp.replace('{FN}', fn)
    .replace('{KEY}', key)
    .replace('{VALUE}', value)
    .replace('{VALUETYPE}', valueType)

  window.console && window.console.warn && window.console.warn(showMsg)
  if (lifecycle.errorLog && lifecycle.errorLog.init && errorCode !== '60008') {
    var FnName = baseConfig.status.FnName
    lifecycle.errorLog.init(showMsg)
    baseConfig.status.FnName = FnName
  }
}
export { errorLog, successLog }
