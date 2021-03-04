import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import AnalysysAgent from "./sdk/AnalysysAgent_JS_SDK.es6.min.js";

import "./sdk/AnalysysAgent_GBK.es6.min.js";
import "./sdk/AnalysysAgent_Encrypt.es6.min.js";
import "./sdk/AnalysysAgent_PageViewStayTime.es6.min.js";

import "./sdk/AnalysysAgent_ExposurePoint.es6.min.js";

AnalysysAgent.init({
  appkey: "commondebug", //APPKEY
  debugMode: 2,
  uploadURL: "https://sdk.analysys.cn:4089/",
  visitorConfigURL: "https://sdk.analysys.cn:4089/",
  SDKFileDirectory: "./js/sdk/",
  encryptType: 2,
  exposure: {
    valid_time: 300,//停留有效时间
    property: {
      cc: function () {
        return +new Date()
      }
    },//自定义参数
    exposure_click: true, // 是否自动采集曝光元素点击事件
    multiple: 5000,//true或毫秒值, 是否重复采集曝光点数据或多少毫秒后可再次采集
    element_list: function () {
      var list = [].slice.call(document.getElementsByTagName('a'), 0)
      var spanList = [].slice.call(document.getElementsByTagName('span'), 0)
      list.push.apply(list, spanList)
      return list
    }
  }
  /**如无自定义配置，则与uploadURL相同**/
});
Vue.config.productionTip = false
Vue.prototype.AnalysysAgent = AnalysysAgent
Vue.use(VueRouter)
Vue.use(ElementUI)
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')