/**
 * 全埋点相关属性存储
 */
interface clickElementValue {
    element_id?: string;
    element_content?: string;
    element_type?: string;
    element_name?: string;
    element_path?: string;
    element_target_url?: string;
    element_class_name?: string;
}
export declare const userClickAttrs: clickElementValue;
export declare const webClickAttrs: {
    page_width?: number;
    page_height?: number;
    click_x?: number;
    click_y?: number;
    element_x?: number;
    element_y?: number;
    element_clickable?: number;
};
export declare function setUserClickAttrs(el: Element): void;
export declare function setWebClickAttrs(e: any): void;
export {};
//# sourceMappingURL=clickElement.d.ts.map