
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"

import '../public/sdk/AnalysysAgent_xmHybrid.min.js'

// import ('../public/sdk/AnalysysAgent_Encrypt.min.js')
import AnalysysAgent from "../public/sdk/AnalysysAgent_JS_SDK.es6.min.js";
// import ('../public/sdk/AnalysysAgent_ExposurePoint.min.js')


createApp(App).use(router).mount('#app')

AnalysysAgent.init({
  appkey: '5d4cdff6e4a55cff', //"47fce41a0472c616", //APPKEY
  uploadURL: 'https://uba-up.analysysdata.com', //'https://uba-up.analysysdata.com', //'https://event-ubademo-portal.jiguang.cn',
  debugMode: 2, // 0 1 2
  sendType: 'img',
  // isHybrid: true,
  // auto: false,
  // autoPageViewDuration: true
  // // 页面浏览上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  // beforePageView (res, setAttrs) {
  //   setAttrs({
  //     a: 1
  //   })
  // },
  // // 页面关闭上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  // beforePageClose (res, setAttrs) {
    
  // },
  // // 页面关闭上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  // beforeTrack(res, setAttrs) {
    
  // },

})