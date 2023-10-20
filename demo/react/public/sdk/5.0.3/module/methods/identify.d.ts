/**
 * 唯一匿名ID标识设置
 * @param distinctId 自定义设备身份标识，取值长度 1 - 255字符, 支持类型：String
 */
export declare function identify(distinctId: string, fn?: Function): void;
/**
 * 获取用户通过identify接口设置或自动生成的id，优先级如下： 用户设置的id > 代码自动生成的id
 * @returns
 */
export declare function getDistinctId(fn?: Function): string;
//# sourceMappingURL=identify.d.ts.map