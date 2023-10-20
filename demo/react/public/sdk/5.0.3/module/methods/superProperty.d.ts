/**
 * 设置单个通用属性
 * @param name string
 * @param value string  number  boolean Array<string>
 */
export declare function registerSuperProperty(name: string, value: string | number | boolean | Array<string>, fn?: any): void;
/**
 * 设置多个属性
 * @param superProperty 属性
 * @returns
 */
export declare function registerSuperProperties(superProperty: object, fn?: any): void;
/**
 * 获取单个通用属性
 */
export declare function getSuperProperty(superPropertyName: string, fn?: any): any;
/**
 * 获取所有通用属性
 */
export declare function getSuperProperties(fn?: any): any;
/**
 * 删除单个属性
 * @param superPropertyName 属性名称
 */
export declare function unRegisterSuperProperty(superPropertyName: string, fn?: any): void;
/**
 * 删除所有属性
 */
export declare function clearSuperProperties(fn?: any): void;
//# sourceMappingURL=superProperty.d.ts.map