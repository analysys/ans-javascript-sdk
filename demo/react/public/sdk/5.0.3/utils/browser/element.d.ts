/**
 * [getConstantStyle description] 返回元素对应的样式值
 * @param  {[type]} el     [description] 元素
 * @param  {[type]} pelStr [description] 样式名称
 * @return {[type]}        [description]
 */
export declare function getConstantStyle(el: any, pelStr: any): any;
/**
 * [eleCss description]根据元素对应css列表获取对应属性
 * @param  {[type]} element  [description]元素dom
 * @param  {[type]} property [description]css名称
 * @return {[type]} value [description]css名称对应值
 */
export declare function eleCss(element: any, property: any): any;
export declare function getElementClassName(el: Element): string;
export declare function getElementTargetUrl(el: Element): string;
export declare function getElementContent(el: Element): string;
export declare function getElementPath(el: any): string;
export declare function getElementScroll(ele: any): {
    scrollLeft: number;
    scrollTop: number;
};
/**
 * [parserDom description]根据元素及其上层元素获取元素位置及显示/隐藏
 * @param  {[type]} ele [description] 元素Dom对象
 * @return {[type]} obj [description] 元素对应位置与显示/隐藏
 */
export declare function getElementOffset(ele: any): {
    top: number;
    left: number;
    hidden: boolean;
};
/**
 * document.querySelectorAll 兼容方法
 * @param {Sting} selectors 选择器 不包含伪类
 * @returns {Array} elements 符合条件的元素列表
 */
export declare function selectorAllEleList(selectors: any): any[] | HTMLCollectionOf<any> | NodeListOf<any>;
export declare function addEleLable(eleName: any, className: any, id: any, parent: any): any;
export declare function domParentList(ele: any): string;
//# sourceMappingURL=element.d.ts.map