
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"

import '../public/sdk/AnalysysAgent_xmHybrid.min.js'

// import ('../public/sdk/AnalysysAgent_Encrypt.min.js')
import AnalysysAgent from "../public/sdk/AnalysysAgent_JS_SDK.es6.min.js";
// import ('../public/sdk/AnalysysAgent_ExposurePoint.min.js')


createApp(App).use(router).mount('#app')

const pageViewBlackList = [
  "product",
];

AnalysysAgent.track('AppStart');
AnalysysAgent.registerSuperProperties({
  a: 1
})

AnalysysAgent.init({
  appkey: '5d4cdff6e4a55cff', //"47fce41a0472c616", //APPKEY
  uploadURL: 'https://uba-up.analysysdata.com', //'https://uba-up.analysysdata.com', //'https://event-ubademo-portal.jiguang.cn',
  debugMode: 2, // 0 1 2
  // crossSubdomain: true,
  // sendType: 'img',
  // autoTrack: true,
  // pageViewBlackList: function() {
  //  var url = window.location.href;
  //   if (pageViewBlackList.some(item => url.indexOf(item) > -1)) {
  //     console.warn("黑名单页面，不上报数据");
  //     return true;
  //   }
  //   return false;
  // },
  // isHybrid: true,
  // auto: false,
  autoPageViewDuration: true,
  // // 页面浏览上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  // beforePageView (res, setAttrs) {
  //   setAttrs({
  //     a: 1
  //   })
  // },
  // 页面关闭上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  beforePageClose (res, setAttrs) {
    // const newRes = setAttrs({
    //   abc: 1234234
    // })

    // console.log(res, newRes)
    // AnalysysAgent.track('page_close', {
    //   a: 1
    // })
    // return false
  },
  // // 页面关闭上报之前钩子，返回false则终止上报，可以通过setAttrs设置属性
  // beforeTrack(res, setAttrs) {
    
  // },

})