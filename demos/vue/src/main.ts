
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"

// import '../public/sdk/AnalysysAgent_xmHybrid.min.js'

// import ('../public/sdk/AnalysysAgent_Encrypt.min.js')
import AnalysysAgent from "../public/sdk/AnalysysAgent_JS_SDK.es6.min.js";
// import ('../public/sdk/AnalysysAgent_ExposurePoint.min.js')


createApp(App).use(router).mount('#app')

AnalysysAgent.init({
  appkey: '5d4cdff6e4a55cff', //"47fce41a0472c616", //APPKEY
  uploadURL: 'https://uba-up.analysysdata.com', //'https://event-ubademo-portal.jiguang.cn',
  debugMode: 2, // 0 1 2
  // SDKFileDirectory: '/sdk',
  // auto: false,
  // allowTimeCheck: true,
  // autoPageViewDuration: true,
  // autoTrack: true,
  // visitorConfigURL: 'https://uba-up.analysysdata.com',
  // autoClickBlackList: ['http://127.0.0.1:5173/#/'],
  // pageViewBlackList: ['http://127.0.0.1:5173/#/'],
  // autoHeatmap: false,
  // sendType: 'post',
  // encryptType: 2,
  // crossSubdomain: true,
  // exposure: {
  //   element_list: [],
  //   exposure: false
  // },
  // userClickProperty: {
  //   'isClickEle': true
  // },

  // sdk初始化完成之前钩子，支持执行异步逻辑，执行完通过next()完成执行，也可以返回一个Promise任务
  // beforeInit (config, next) {
  //   setTimeout(() => {
  //     next()
  //   }, 1000)
  // },
  // // 页面浏览上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  // beforePageView (res, setAttrs) {
    
  // },
  // // 页面关闭上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  // beforePageClose (res, setAttrs) {
    
  // },
  // // 页面关闭上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  // beforeTrack(res, setAttrs) {
    
  // },

})