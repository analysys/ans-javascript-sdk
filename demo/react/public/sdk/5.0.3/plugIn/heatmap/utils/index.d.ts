export declare function createElement(tag: string, attrs?: {
    class?: string;
    id?: string;
    content?: string;
    style?: object;
}, el?: Element): HTMLElement;
export declare function pathContrast(eventPath: any, elePath: any): boolean;
export declare function parseEvent(path: any): any;
export declare function getPathEle(path: any): Element;
/**
 * [parserDom description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
export declare function parserDom(path: any): any[];
/**
 * [parserDom description]根据元素及其上层元素获取元素位置及显示/隐藏
 * @param  {[type]} ele [description] 元素Dom对象
 * @return {[type]} obj [description] 元素对应位置与显示/隐藏
 */
export declare function getEleOffset(ele: any): {
    top: number;
    left: number;
    hidden: boolean;
};
/**
 * [eleCss description]根据元素对应css列表获取对应属性
 * @param  {[type]} element  [description]元素dom
 * @param  {[type]} property [description]css名称
 * @return {[type]} value [description]css名称对应值
 */
export declare function eleCss(element: any, property: any): any;
/**
 * [getConstantStyle description] 返回元素对应的样式值
 * @param  {[type]} el     [description] 元素
 * @param  {[type]} pelStr [description] 样式名称
 * @return {[type]}        [description]
 */
export declare function getConstantStyle(el: any, pelStr: any): any;
export declare function eleScroll(ele: any): {
    scrollLeft: number;
    scrollTop: number;
};
//# sourceMappingURL=index.d.ts.map