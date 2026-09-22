import { config } from '../../store/config'
import { $lib, $lib_version } from '../../constant/index'
import getType from '../../utils/type'
import { msgetype } from '../../types'
import { readOnlyAttrs } from '../../constant/eventAttrs'

function keyErr (type: string) {
	return `{FN}:Property value invalid of key[{KEY}], support type: ${type}
	current value: {VALUE}
	current type: {VALUETYPE}`
}

export const errorMessage = {
	'common': '',
	'60001': keyErr('String'),
	'60002': keyErr('Number'),
	'60003': keyErr('Boolean'),
	'60004': keyErr('Function'),
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
	'600022': '{FN}: The value [{VALUE}] for attribute [{KEY}] is invalid. Supported types are: String, Number, Boolean, or string[]. If the value is a string, its length must be between 1 and 255 characters.',
	'600023': '{FN}: The name of the attribute key [{KEY}] is invalid. The attribute key is a string starting with a letter, consisting of letters, numbers, and underscores. Letters are not case sensitive and do not support garbled characters, Chinese characters, spaces, etc. The length range is 1-99 characters;',
	'600025': '{FN}: The event name [{VALUE}] is invalid. Event IDs must start with a letter or $, and can contain letters, numbers, and underscores. The length must be between 1 and 99 characters.'
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
	'20013': "Received server time: {VALUE} \n" +
		"local time: {KEY} \n" +
		"Time difference:  {FN} \n" +
		"The data will undergo time calibration",
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

export function printLog(msg:string) {
	console.log(msg)
}