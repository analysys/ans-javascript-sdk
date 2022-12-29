# [易观方舟](https://www.analysys.cn/) asd-javascript-sdk [![NPM version][npm-image]][npm-url] [![License](https://img.shields.io/github/license/analysys/ans-wechat-sdk.svg)](https://github.com/analysys/ans-wechat-sdk/blob/master/LICENSE) [![GitHub release](https://img.shields.io/github/release/analysys/ans-wechat-sdk.svg)](https://github.com/analysys/ans-wechat-sdk/releases)

## 安装

```sh
$ npm install asd-javascript-sdk --save 
```

## javascript SDK 基础说明

#### 快速集成
##### 引入sdk模块并初始化
```js

import AnalysysAgent from "asd-javascript-sdk"

// 引入加密模块(非必须)
import AnalysysEncryption  from 'asd-javascript-sdk/dist/AnalysysAgent_encryption.min.js';
AnalysysAgent.encrypt = AnalysysEncryption;

//初始化
AnalysysAgent.init({
  appkey: '',
  uploadURL: ''
})
```

##### 初始化参数说明 

参数 | 是否必须| 类型 | 默认值 | 说明
--- | :--- | :--- | :--- | :---
appkey | 是 | string | - |  在网站获取的AppKey
uploadURL | 是 | string | - | 自定义上传地址
debugMode | 否 | number | 0 |  0: 关闭调试模式；1 - 开启调试模式，数据不入库；2 - 开启调试模式，数据入库
autoProfile | 否 | boolean | true | 设置是否追踪新用户的首次属性
encryptType | 否 | number | 0 | 设置是否对上传数据加密：0 - 对上传数据不加密(默认)；1 - 对上传数据进行AES 128位ECB加密；2 对上传数据进行AES 128位CBC加密
allowTimeCheck | 否 | boolean | false | 设置是否开启时间校准
maxDiffTimeInterval | 否 | number | 30 | 设置最大时间校准分为：30s(默认) ，当设置的时间差值小于他，将不开启校准。否则将会进行时间校准。假如设置成为负值，将默认为 30s。
autoTrack | 否 | boolean | false | 设置是否开启全埋点，开启全埋点将会上报所有绑定（支持tab、longtab、longpress）事件,并上报$user_click 事件,设置data-content为采集的 $element_content、data-type为采集的 $element_type、data-name为采集的$element_name、id为采集的$element_id。不设置采集不到。不支持系统方法包括生命周期事件的上报，如果要采集tabbar切换，务必在注册Page的时候注册OnTabItemTap方法，否则采集不到。
autoCompleteURL | 否 | boolean | true | 设置是否采集完整URL，true - 采集URL包括参数；false - 采集URL不包括参数
autoPageViewDuration | 否 | boolean | false | 是否采集页面离开事件

> 通过以上步骤您即可验证SDK是否已经集成成功，更多Api使用方法参考：[易观方舟 wechat SDK 文档](https://docs.analysys.cn/ark/integration/sdk/wx/wxsdkcustom)

> 注意 SDK 可能不完全向前兼容，请查看版本更新说明 [Release及版本升级记录](https://github.com/analysys/ans-wechat-sdk/releases)。如果有说明不兼容的话，需要升级易观方舟对应的版本。 请根据需要前往 [Release](https://github.com/analysys/ans-wechat-sdk/releases) 里下载对应的文件


## 版本升级记录
请参见 [Release及版本升级记录](https://github.com/analysys/ans-wechat-sdk/releases)




**禁止一切基于易观方舟 wechat 开源 SDK 的所有商业活动！**

---

[![NPM downloads][npm-downloads]][npm-url]




[homepage]: https://github.com/analysys/ans-javascript-sdk
[npm-url]: https://www.npmjs.com/package/asd-javascript-sdk
[npm-image]: https://img.shields.io/npm/v/asd-javascript-sdk.svg?style=flat
[npm-downloads]: https://img.shields.io/npm/dm/asd-javascript-sdk.svg?style=flat

