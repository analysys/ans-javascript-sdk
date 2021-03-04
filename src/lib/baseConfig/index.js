import fieldTemplate from '../../configure/base/fieldTemplate.js'
export default {
  base: {
    appid: '', // APPID
    $debug: 0, // debug状态 
    uploadURL: '', // 上传地址
    auto: true, // 自动采集页面打开
    autoProfile: true, //自动采集用户首次属性
    hash: true, // 自动采集单页面应用
    autoWebstay: true, // 自动采集访问深度
    singlePage: true, // 自动采集单页面应用
    pageProperty: {}, // 自动采集页面打开时页面自定义属性
    $lib_version: '4.5.5', // sdk版本号
    cross_subdomain: true, // 跨子域存储cookie
    cross_subdomain_super: true, // 同步跨子域存储cookie时 同步通用属性
    allowTimeCheck: false, // ajax上报日志 开启时间校准
    isHybrid: false, // 是否为Hybrid模式
    getDataTimeout: 10000, // 获取数据超时时间
    sendDataTimeout: 10000,// 上报数据超时时间
    isMessageSDK: false
  },
  status: {
    code: 200,
    FnName: '',
    key: '',
    value: '',
    errorCode: '',
    successCode: ''
  },
  keywords: fieldTemplate.base.xcontext,
  baseJson: fieldTemplate.base.outer,
  sendNum: 1800,

}
