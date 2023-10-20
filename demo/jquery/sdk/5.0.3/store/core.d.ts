import { buriedPointData } from '../types';
export interface coreInterface {
    ARKAPPID: string;
    ARKDEBUG: number;
    ARKUPLOADURL: string;
    ARKFRISTPROFILE: string;
    ARKSUPER: object;
    ARK_ID: string;
    ARK_TRACKID?: string;
    ARK_LOGINID?: string;
    FRISTDAY: number | string;
    POSTDATA?: Array<buriedPointData>;
    SEESIONDATE: number;
    SEESIONID: string;
}
/**
 * 返回核心数据默认值
 * @returns object
 */
export declare function coreDefault(): coreInterface;
export declare let core: coreInterface;
/**
 * 初始化
 */
export declare function coreInit(fn?: Function): void;
export declare function getCore(): coreInterface;
export declare function resetCore(): void;
/**
 * 设置参数
 */
export declare function setCoreParam(key: any, value: any): void;
/**
 * 设置多个参数
 */
export declare function setCoreParams(obj: object): void;
/**
 * 获取当前用户id
 * 优先获取登录后id => 用户自定义匿名id => 系统生成匿名id
 */
export declare function getId(): string;
/**
 * 系统设置匿名id
 * @returns
 */
export declare function setId(): string;
/**
 * 获取sessionId
 */
export declare function getSessionId(): string;
/**
 * 设置sessionid
 */
export declare function setSessionId(): void;
/**
 * 用户手动设置匿名id
 * @param xwho
 */
export declare function setAnonymousID(xwho: string): void;
/**
 * 获取用户通过identify接口设置或自动生成的id，优先级如下： 用户设置的id > 代码自动生成的id
 */
export declare function getAnonymousID(): string;
/**
 * 获取指定通用属性或全部通用属性
 * @param superPropertyName 属性名称
 * @returns
 */
export declare function getSuperProperty(superPropertyName?: string): any;
/**
 * 设置通用属性
 * @param property 属性
 */
export declare function setSuperProperty(property: object): void;
/**
 * 删除指定通用属性或全部通用属性
 * @param superPropertyName 属性名称
 */
export declare function delSuperProperty(superPropertyName?: string): void;
export declare function addPostData(option: buriedPointData): void;
export declare function delPostData(arrData: Array<buriedPointData>): void;
export declare function getPostData(): Array<buriedPointData>;
//# sourceMappingURL=core.d.ts.map