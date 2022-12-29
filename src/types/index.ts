/**
 * sdk配置参数类型
 */

export interface initConfig {
  appkey?: string;
  uploadURL?: string;
  debugMode?: number;
  name?: string; //设置 JS SDK 全局对象别名

  auto?: boolean;
  pageProperty?: object; //设置自动采集时页面自定义属性
  pageViewBlackList?: any; //设置自动采集页面统计黑名单

  autoProfile?: boolean;
  encryptType?: number;
  allowTimeCheck?: boolean; //设置是否开启时间校准
  maxDiffTimeInterval?: number; //设置最大时间校准分
  autoPageViewDuration?: boolean; //设置是否开启页面关闭事件自动采集
  sendDataTimeout?: number; // 上报超时时间

  hash?: boolean; //设置检测 url hash 变化： 

  sendType?: string; //设置上传日志方式
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