/**
 * 设置用户固有属性
 * @param propertyName
 * @param propertyValue
 */
export declare function profileSetOnce(propertyName?: any, propertyValue?: any, fn?: Function): void;
/**
 * 给用户设置单个或多个属性，如果之前不存在，则新建，否则覆盖
 * @param propertyName
 * @param propertyValue
 */
export declare function profileSet(propertyName: any, propertyValue: any, fn?: Function): void;
/**
 * 设置用户属性的相对变化值(相对增加，减少)，只能对数值型属性进行操作，如果这个 Profile之前不存在，则初始值为0。
 * @param propertyName
 * @param propertyValue
 */
export declare function profileIncrement(propertyName: any, propertyValue: any, fn?: Function): void;
/**
 * 用户列表属性增加元素。
 * @param propertyName
 * @param propertyValue
 */
export declare function profileAppend(propertyName: any, propertyValue: any, fn?: Function): void;
/**
 * 删除当前用户单个属性值
 * @param propertyName
 */
export declare function profileUnset(propertyName: string, fn?: Function): void;
/**
 * 删除当前用户所有属性值
 */
export declare function profileDelete(fn?: Function): void;
//# sourceMappingURL=profile.d.ts.map