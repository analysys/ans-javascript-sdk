import { msgetype } from '../../types';
/**
 * 长度校验
 * @param value
 * @param max
 * @param min
 * @returns
 */
export declare function lengthCheck(value: string, max?: number, min?: number): boolean;
/**
 * 自定义属性key校验
 * @param value
 * @param eventName
 * @returns
 */
export declare function attrNameCheck(value: string, logObj?: msgetype): boolean;
/**
 * 自定义属性值校验
 * @param value
 */
export declare function attrValueCheck(value: any, logObj?: msgetype): boolean;
/**
 * 属性校验，不通过的提示并删除
 * @param value
 * @param eventName 事件名称, 如果存在则抛出错误提示
 */
export declare function attrCheck(value: any, eventName?: string): object;
/**
 * 初始化布尔类型参数校验
 * @param value
 * @param key
 * @returns
 */
export declare function booleanCheck(value: any, key: any): boolean;
export declare function functionCheck(value: any, key: any): boolean;
export declare function numberCheck(value: any, key: any): boolean;
export declare function stringCheck(value: any, key: any): boolean;
export declare function objectCheck(value: any, key: any): boolean;
/**
 * 验证是否全埋点统计黑名单
 * @param autoClickBlackList 全埋点统计黑名单
 * @param el
 * @returns boo
 */
export declare function autoClickBlackListCheck(autoClickBlackList: any, el?: EventTarget): boolean;
/**
 * 判断当前元素是否为可触控元素
 */
export declare function elementClickableCheck(el: any): boolean;
//# sourceMappingURL=index.d.ts.map