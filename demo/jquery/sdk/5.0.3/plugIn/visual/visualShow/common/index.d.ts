/**
 * [elementPostion description] 返回标签元素坐标及是否隐藏
 * @param  {[type]} elem [description]标签元素
 * @return {[type]}     [description]x-横坐标 number y-纵坐标 number hidden-是否隐藏隐藏 Bloon
 */
export function elementPostion(elem: [any]): [any];
/**
 * [eleCss description]根据元素对应css列表获取对应属性
 * @param  {[type]} element  [description]元素dom
 * @param  {[type]} property [description]css名称
 * @return {[type]} value [description]css名称对应值
 */
export function eleCss(element: [any], property: [any]): [any];
/**
 * 通过Path查找元素
 *
 * @param {String} path 元素Path
 * @returns
 */
export function parseEvent(path: string): any[];
/**
 * [parserDom description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
export function parserDom(path: [any]): [any];
export function domParentList(ele: any, status: any): {
    path: string;
    newPath: {}[];
};
/**
 * [isEmbedded description] 判断是否为嵌入式
 * @return {Boolean} [description] true - 嵌入式 false - 交互式
 */
export function isEmbedded(key: any): boolean;
export function isElmentReady(): boolean;
/**
 * [isParent description] 判断是当前元素否为指定元素的子元素
 * @param  {[type]}  ele       [description] 当前元素
 * @param  {[type]}  parentEle [description] 指定元素
 * @return {Boolean}           [description]
 */
export function isParent(ele: [any], parentEle: [any]): boolean;
/**
 * [getConstantStyle description] 返回元素对应的样式值
 * @param  {[type]} el     [description] 元素
 * @param  {[type]} pelStr [description] 样式名称
 * @return {[type]}        [description]
 */
export function getConstantStyle(el: [any], pelStr: [any]): [any];
/**
 * [pipParam description] 去除字符串后面最后一位
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
export function pipParam(param: [any], str: any): [any];
export function setIndex(ele: any, link: any): number;
export function boxPosition(ele: any, blo: any): {
    top: number;
    left: any;
};
/**
 * 点击元素是否符合可视化元素列表中的元素
 * @param {JSON} clickEleObj 点击元素
 * @param {JSON} eventEleObj 可视化元素
 * @returns {Boolean} 是否符合
 */
export function pathContrast(clickEleObj: JSON, eventEleObj: JSON, isNotDeep: any): boolean;
/**
 * [parserDom description]根据元素及其上层元素获取元素位置及显示/隐藏
 * @param  {[type]} ele [description] 元素Dom对象
 * @return {[type]} obj [description] 元素对应位置与显示/隐藏
 */
export function eleOffset(ele: [any]): [any];
export function getAttr(ele: any): {
    prop_name: string;
    name: string;
    prop_type: string;
    value: any;
    isChoice: boolean;
}[];
/**
 * 通过new_path 查找元素
 * @param {JSON} path
 * @returns {Element} ele 解析到的元素
 */
export function parseNewPath(path: JSON, step: any, parentTarger: any): Element;
export function getRelated(relateds: any, callback: any, timeId: any, clickEle: any): {};
export function getProperties(properties: any, value: any): {};
/**
 * 拥有new_path时，点击元素是否符合可视化元素列表中的元素
 *
 * @param {*} clickEleObj 点击元素
 * @param {*} eventEleObj 可视化元素
 * @returns {Boolean} 是否符合
 */
export function newPathContrast(clickObj: any, eventNewPath: any, isNotDeep: any): boolean;
export function cssContrast(clickPathList: any, eventPathList: any): boolean;
export function parentContrast(clickPathList: any, eventPathList: any): boolean;
export function delPathRow(pathList: any): any[];
/**
 * 根据查找元素
 * @param {Map} pageEvents 埋点列表
 * @param {Map} ele 元素列表
 * @returns {Map} eleList 命中元素
 */
export function parserPageEvents(pageEvents: Map<any, any>, ele: Map<any, any>): Map<any, any>;
export function backH5PathProPath(clickPath: any, related: any): any[];
export function checkNewPathBase(clickPathList: any, eventPathList: any): boolean;
//# sourceMappingURL=index.d.ts.map