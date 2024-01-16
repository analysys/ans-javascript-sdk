/**
 * sdk配置参数类型
 */
export interface initConfig {
  appkey: string;
  uploadURL: string;
  debugMode?: 0 | 1 | 2;
  name?: string; //设置 JS SDK 全局对象别名

  auto?: boolean; //是否自动采集pageview
  pageProperty?: object; //设置自动采集时页面自定义属性
  pageViewBlackList?: any; //设置自动采集页面统计黑名单

  autoProfile?: boolean;
  encryptType?: number;
  allowTimeCheck?: boolean; //设置是否开启时间校准
  maxDiffTimeInterval?: number; //设置最大时间校准分
  autoPageViewDuration?: boolean; //设置是否开启页面关闭事件自动采集
  sendDataTimeout?: number; // 上报超时时间

  hash?: boolean; //设置检测 url hash 变化： 

  sendType?: 'img' | 'post'; //设置上传日志方式
  crossSubdomain?: boolean; //设置在二级域名下存储cookie

  visitorConfigURL?: string; //(若使用可视化埋点，则必须) 设置可视化配置获取接口
  SDKFileDirectory?: string; //设置可视化模块SDK与热图模块SDK存放目录
  getDataTimeout?: number; //设置获取可视化埋点列表的超时时间

  autoTrack?: boolean; // 
  autoClickBlackList?: string | (() => boolean) | Array<string>; //设置全埋点统计黑名单
  userClickProperty?: any | object | (() => boolean); //设置全部或某个全埋点元素自定义属性
  trackList?: Array<string> | ((path: string) => boolean); //设置除默认可输出元素外的可触控元素列表

  autoHeatmap?: boolean; //设置是否启用热图数据采集，即在产品当中可使用热图分析功能
  autoWebstay?: boolean; //在开启热图功能(autoHeatmap设置为true)后，设置是否追踪页面滚动行为，即在产品当中可分析页面浏览深度
  webstayDuration?: number; //设置追踪页面滚动行为时，最大停留时长
  heatMapBlackList?: string; //设置热图统计黑名单

  exposure: {
    valid_time: number;
    element_list: () => void | Array<any>;
    exposure_click: boolean;
    property: object | (() => void);
    multiple: boolean | number
  };

  beforePageView?: ((res:buriedPointData, setAttrs: Function) => boolean);  //pageView上报之前钩子，若返回false，则终止pageView上报
  beforePageClose?: ((res:buriedPointData, setAttrs: Function) => boolean); //pageClose上报之前钩子，若返回false，则终止pageView上报
  beforeTrack?: ((res:buriedPointData, setAttrs: Function) => boolean); //track之前的钩子，参数为当前上报的数据对象，若返回false，就会终止track上报

  beforeInit?: ((config:initConfig, next: Function) => Promise<any>); //通知sdk客户端程序已经准备就绪了，你可以开始工作了
}


/**
 * 埋点数据类型
 */

export interface xcontextValue {
  $url?: string;
  $is_login?: boolean;
}


// 上报数据格式
export interface buriedPointData {
  appid: string;
  xwho: string;
  xwhat: string;
  xwhen: number;
  xcontext: xcontextValue;
}

// 日志提示类型
export interface msgetype {
	key?: string
	value?: any
	code: string | number
	fn?: string
	keyType?: string
}

// 请求入参
export interface requestOptions {
  url: string;
  data?: any;
  method?: string;
  header?: object;
  timeout?: number;
  success?: Function;
  error?: Function;
}

type distinctId = string

type attrs = {[key:string]: any}
type superAttrs = attrs
type eventAttrs = attrs
type userAttrs = attrs
type presetAttrs = attrs

declare class arkSdk {
  config: initConfig;
  init(config: initConfig): void;
  pageView(pageTitle: string, pageProperties: object): buriedPointData;
  track(eventName: string, eventAttrs: eventAttrs): buriedPointData;
  timeEvent(eventName: string): void;
  alias(aliasId: string, callback?: () => void): void;
  identify(distinctId: distinctId, callback?: () => void): void;
  getDistinctId(callback?: (distinctId: distinctId) => void): distinctId;
  registerSuperProperty(attrKey: string, attrValue: any, callback?: (attrs: superAttrs) => void): void;
  registerSuperProperties(attrs: superAttrs, callback?: (attrs: superAttrs) => void): void;
  getSuperProperty(attrName: string, callback?: (attrs: superAttrs) => void): superAttrs;
  getSuperProperties(callback?: (attrs: superAttrs) => void): superAttrs;
  unRegisterSuperProperty(attrName: string, callback?: (attrs: superAttrs) => void): void;
  clearSuperProperties(callback?: (attrs: superAttrs) => void): void;
  pageProperty(attrs: attrs): void;
  profileSetOnce(attrs: userAttrs): void;
  profileSet(attrs: userAttrs): void;
  profileAppend(attrKey: string, attrValue: any): void;
  profileIncrement(attrs: userAttrs): void;
  profileDelete(): void;
  profileUnset(attrName: string): void;
  getPresetProperties(callback?: (attrs: presetAttrs) => void): presetAttrs;
  reset(callback?: () => void): void;
}

export const AnalysysAgent: arkSdk

export default AnalysysAgent