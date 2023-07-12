# [易观方舟](https://www.analysys.cn/) asd-javascript-sdk [![NPM version][npm-image]][npm-url] [![License](https://img.shields.io/github/license/analysys/ans-javascript-sdk.svg)](https://github.com/analysys/ans-wechat-sdk/blob/master/LICENSE) [![GitHub release](https://img.shields.io/github/release/analysys/ans-javascript-sdk.svg)](https://github.com/analysys/ans-javascript-sdk/releases)

## 安装

```sh
$ npm install asd-javascript-sdk --save 
```

## javascript SDK 说明

#### 快速集成
##### 引入sdk模块并初始化
```js

import AnalysysAgent from "asd-javascript-sdk"

//初始化
AnalysysAgent.init({
  appkey: '',
  uploadURL: ''
})
```

##### 初始化参数说明 

参数 | 是否必须| 类型 | 默认值 | 说明
--- | :--- | :--- | :--- | :---
appkey | 是 | string | - |  项目数据的唯一标识，在产品当中_ 数据接入管理 _模块获取的 AppKey
uploadURL | 是 | string | - | 设置上传数据接口，在 _数据接入管理-集成SDK接入数据 _模块获取
visitorConfigURL | 否 | string | - | 设置可视化配置获取接口
debugMode | 否 | number | 0 |  0: 关闭调试模式；1 - 开启调试模式，数据不入库；2 - 开启调试模式，数据入库
name | 否 | string | - | 设置 JS SDK 全局对象别名
auto | 否 | boolean | true | 设置自动采集页面打开事件
autoProfile | 否 | boolean | true | 设置是否追踪新用户的首次属性
autoTrack | 否 | boolean | false | 设置是否启用全埋点功能
autoPageViewDuration | 否 | boolean | false | 是否采集页面离开事件
allowTimeCheck | 否 | boolean | false | 设置是否开启时间校准
maxDiffTimeInterval | 否 | number | 30 | 设置最大时间校准分为：30s(默认) ，当设置的时间差值小于他，将不开启校准。否则将会进行时间校准。假如设置成为负值，将默认为 30s。
autoHeatmap | 否 | boolean | false | 设置是否启用热图数据采集，即在产品当中可使用热图分析功能
autoWebstay | 否 | boolean | true | 在开启热图功能(autoHeatmap设置为true)后，设置是否追踪页面滚动行为，即在产品当中可分析页面浏览深度
hash | 否 | boolean | true | 设置检测 url hash 变化
encryptType | 否 | number | 0 | 设置是否对上传数据加密：0 - 对上传数据不加密(默认)；1 - 对上传数据进行AES 128位ECB加密；2 对上传数据进行AES 128位CBC加密
pageProperty | 否 | object | - | 设置自动采集时页面自定义属性
SDKFileDirectory | 否 | string | - | 设置可视化模块SDK与热图模块SDK存放目录
sendType | 否 | string | img | 设置上传日志方式
webstayDuration | 否 | number | 5小时，单位毫秒 | 设置追踪页面滚动行为时，最大停留时长
cross_subdomain | 否 | boolean | false | 设置在二级域名下存储cookie
sendDataTimeout | 否 | number | 10000，单位：毫秒 | 设置上报日志超时时间
getDataTimeout | 否 | number | 10000，单位：毫秒 | 设置获取可视化埋点列表的超时时间
trackList | 否 | String[] / () => boolean | - | 设置除默认可输出元素外的可触控元素列表

> 注意 SDK 可能不完全向前兼容，请查看版本更新说明 [Release及版本升级记录](https://github.com/analysys/ans-javascript-sdk/releases)。如果有说明不兼容的话，需要升级易观方舟对应的版本。 请根据需要前往 [Release](https://github.com/analysys/ans-javascript-sdk/releases) 里下载对应的文件


## 版本升级记录
请参见 [Release及版本升级记录](https://github.com/analysys/ans-javascript-sdk/releases)




**禁止一切基于易观方舟 javascript 开源 SDK 的所有商业活动！**

---

[![NPM downloads][npm-downloads]][npm-url]




[homepage]: https://github.com/analysys/ans-javascript-sdk
[npm-url]: https://www.npmjs.com/package/asd-javascript-sdk
[npm-image]: https://img.shields.io/npm/v/asd-javascript-sdk.svg?style=flat
[npm-downloads]: https://img.shields.io/npm/dm/asd-javascript-sdk.svg?style=flat

