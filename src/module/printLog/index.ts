import { config } from '../../store/config'
import { $lib, $lib_version } from '../../constant/index'
import getType from '../../utils/type'
import { msgetype } from '../../types'
import { readOnlyAttrs } from '../../constant/eventAttrs'

const errorMessage = {
	'common': '',
	'60001': '{FN}:Property key invalid, support type: String \n' +
		'current key:{KEY}\n' +
		'current keyType:{KEYTYPE}',
	'60002': '{FN}:Property value invalid of key[{KEY}], support type: Number \n' +
		'current value: {VALUE}\n' +
		'current type: {VALUETYPE}',
	'60003': '{FN}:Property value invalid of key[{KEY}], support type: Boolean \n' +
		'current value:{VALUE}\n' +
		'current type: {VALUETYPE}',
	'60005': '{FN}:The length of the property[{KEY}] value (string[{VALUE}]) needs to be 1-255 !',
	'60006': 'Please set appkey first.',
	'60007': 'Please set uploadURL first.',
	'60008': 'Send message failed.',
	'60009': '{FN}:The length of the property key (string[{KEY}]) needs to be 1-125 !',
	'600010': '{FN}:The length of the property key (string[{KEY}]) needs to be 1-99 !',
	'600012': '{FN}:Property key invalid, nonsupport value: '+ readOnlyAttrs.join('/') +' \n' +
		'current KEY:{KEY}',
	'600016': '{FN}: Property value invalid, support type: Object \n' +
		'current value:{VALUE}\n' +
		'current type: {VALUETYPE}',
	'600020': 'DebugMode only can be 0,1,2',
	'600022': '{FN}: 属性[{KEY}]的值[{VALUE}]无效，支持类型：String/Number/Boolean/string[]，若为字符串，长度范围1-255字符',
	'600023': '{FN}: 属性key的名称[{KEY}]无效，属性key是以字母开头的字符串，由字母、数字、下划线组成，字母不区分大小写，不支持乱码、中文、空格等，长度范围1-99字符；',
	'600025': '{FN}: 事件名称[{VALUE}]无效，事件ID必须字母或者$开头，可包含数字字母与下划线，1-99个字符；'
}
const successMessage = {
	'common': '',
	'20001': 'Send message success',
	'20002': '{FN}: set success ({VALUE})',
	'20003': '{FN}:({VALUE}) delete success',
	'20004': '{FN}:clear success',
	'20005': '{FN}:reset success',
	'20006': 'set appkey success. current appkey : {VALUE}',
	'20007': 'Init Analysysdata ' + $lib + ' sdk success, version : '+ $lib_version +'',
	'20008': 'set uploadURL success. current uploadURL : {VALUE}',
	'20009': '{FN}:[{KEY}] : get failed',
	'20010': '{FN}:[{KEY}] : get success. ({VALUE})',
	'20011': '{FN}:({VALUE}) delete failed',
	'20012': 'Send Message to Server: {KEY} \n' +
		'data:{VALUE}',
	'20013': "收到服务器的时间: {VALUE} \n" +
		"本地时间: {KEY} \n" +
		"时间相差:  {FN} \n" +
		"数据将会进行时间校准",
	'20014': 'aliasID already bound'
}

export function successLog(opt: msgetype) {
	if (config.debugMode === 1 || config.debugMode === 2) {
		const msgTemp = successMessage[opt.code] || successMessage.common
		const showMsg = msgTemp.replace(/{FN}/, opt.fn).replace(/{KEY}/g, opt.key || '').replace(/{VALUE}/g, JSON.stringify(opt.value))
		console.log(showMsg)
	}
}


export function errorLog(opt: msgetype, isInit?: boolean) {
	const msgTemp = errorMessage[opt.code] || errorMessage.common;
	const showMsg = msgTemp.replace(/{FN}/g, opt.fn || '')
		.replace(/{KEY}/g, JSON.stringify(opt.key || ''))
		.replace(/{VALUE}/g, JSON.stringify(opt.value))
		.replace(/{VALUETYPE}/g, getType(opt.value))
		.replace(/{KEYTYPE}/g, getType(opt.key))
	if (config.debugMode === 1 || config.debugMode === 2 || isInit) {
		console.warn(showMsg)
	}
}