/**
 * 准备就绪后开始上报数据
 */
interface callbackArrType {
    fn: (args: any[]) => void;
    arg: any;
    xwhen?: number;
}
export declare let callbackArr: callbackArrType[];
export declare function implementAallbackArr(): void;
export declare const implementBeforeInit: (fn: () => any) => void;
export declare const isReady: () => boolean;
declare function ready(callback: any, isTop?: boolean): (...args: any[]) => any;
export default ready;
//# sourceMappingURL=index.d.ts.map