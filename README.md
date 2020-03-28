
# Analysys JavaScript SDK [![NPM version][npm-image]][npm-url] [![License](https://img.shields.io/github/license/analysys/ans-javascript-sdk.svg)](https://github.com/analysys/ans-javascript-sdk/blob/master/LICENSE)  [![GitHub release](https://img.shields.io/github/release/analysys/ans-javascript-sdk.svg)](https://github.com/analysys/ans-javascript-sdk/releases) 

========

This is the official JavaScript SDK for Analysys.

# JavaScript SDK目录说明：
* demo——API调用演示
* SDK——SDK文件
* src——SDK源码
* vue-demo——VUE框架API调用演示

# 安装

```
    npm install ans-javascript-sdk --save
```

# JavaScript 基础说明：

JS SDK 用于由 HTML 、 Css 及 Javascript 制作成的网站，集成前请先安装SDK

## 快速集成
如果您是第一次使用易观方舟产品，可以通过阅读本文快速了解此产品
1. 选择集成方式
目前我们提供了异步集成、同步集成的方式
2. 设置初始化接口
通过初始化代码的配置参数配置您的 AppKey
3. 设置上传地址
通过初始化代码的配置参数 uploadURL 设置您上传数据的地址。
4. 设置需要采集的页面或事件
通过手动埋点，设置需要采集的页面或事件。
5. 打开Debug模式查看日志
通过设置 Ddebug 模式，开(debugMode为1或2)/关(debugMode为0或不设置) log 查看日志。

> 通过以上步骤您即可验证SDK是否已经集成成功，具体使用方法参考：[易观方舟 JavaScript SDK 文档](https://docs.analysys.cn/ark/integration/sdk/js/js)

> 注意 SDK 可能不完全向前兼容，请查看版本更新说明 [Release及版本升级记录](https://github.com/analysys/ans-javascript-sdk/releases)。如果有说明不兼容的话，需要升级易观方舟对应的版本。 请根据需要前往 [Release](https://github.com/analysys/ans-javascript-sdk/releases) 里下载对应的文件

## 版本升级记录
请参见 [Release及版本升级记录](https://github.com/analysys/ans-wechat-sdk/releases)
更多Api使用方法参考：[易观方舟 JavaScript SDK 文档](https://docs.analysys.cn/ark/integration/sdk/js/js)

# 讨论
* 微信号：nlfxwz
* 钉钉群：30099866
* 邮箱：nielifeng@analysys.com.cn
  

# License

[gpl-3.0](https://www.gnu.org/licenses/gpl-3.0.txt)

**禁止一切基于易观方舟 javascript 开源 SDK 的所有商业活动！**

---

[![NPM downloads][npm-downloads]][npm-url]


[homepage]: https://github.com/analysys/ans-javascript-sdk
[npm-url]: https://www.npmjs.com/package/ans-javascript-sdk
[npm-image]: https://img.shields.io/npm/v/ans-javascript-sdk.svg?style=flat
[npm-downloads]: https://img.shields.io/npm/dm/ans-javascript-sdk.svg?style=flat
