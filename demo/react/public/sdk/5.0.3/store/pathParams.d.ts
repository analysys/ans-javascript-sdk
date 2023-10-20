/**
 * 路径相关参数信息存储
 */
interface paramsValue {
    scene?: number | string;
    campaign_id?: string;
    utm_campaign_id?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_term?: string;
    utm_content?: string;
    utm_campaign?: string;
    share_id?: any;
    share_level?: any;
    share_path?: any;
}
export declare const pathParams: paramsValue;
export declare function getPathParams(): object;
export declare function setPathParams(option: {
    query: paramsValue;
    scene: number;
}): any;
export {};
//# sourceMappingURL=pathParams.d.ts.map