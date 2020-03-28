import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./sdk/AnalysysAgent_GBK.es6.min.js";
import "./sdk/AnalysysAgent_Encrypt.es6.min.js";
import "./sdk/AnalysysAgent_PageViewStayTime.es6.min.js";
import AnalysysAgent from "./sdk/AnalysysAgent_JS_SDK.es6.min.js";

AnalysysAgent.init({
  appkey: "commondebug", //APPKEY
  debugMode: 2,
  uploadURL: "https://sdk.analysys.cn:4089/",
  visitorConfigURL: "https://sdk.analysys.cn:4089/",
  SDKFileDirectory: "./js/sdk/",
  encryptType: 2
  /**如无自定义配置，则与uploadURL相同**/
});
console.log(window.AnalysysModule)
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