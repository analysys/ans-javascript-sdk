import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import('./styles/index.scss')
import './js/pace.js'
import "normalize.css/normalize.css"

import App from './App.vue'
import router from './router'
import store from './store'
import AnalysysAgent from "../public/sdk/AnalysysAgent_JS_SDK.es6.min.js";


Vue.use(ElementUI)
Vue.config.productionTip = false



const vue = new Vue({
  router,
  store,
  data () {
  	return {
  		ready: false
  	}
  },
  render () {
    return this.ready ? (<App />) : null
  },
  created () {
    this.ready = true
  }
}).$mount('#app')

// 获取vue版本号
console.log('vue版本号:', Vue.version)

AnalysysAgent.init({
  appkey: '5d4cdff6e4a55cff', //"47fce41a0472c616", //APPKEY
  uploadURL: 'https://uba-up.analysysdata.com', //'https://uba-up.analysysdata.com', //'https://event-ubademo-portal.jiguang.cn',
  debugMode: 2, // 0 1 2
  autoPageViewDuration: true,
  beforePageView (res, setAttrs) {
    // AnalysysAgent.pageView()
    // res.xcontext.$url = 'sadfsdf'
    // console.log('beforePageView', res.xcontext.$url)
    // AnalysysAgent.track('page_view', res.xcontent)
    // return false
    // AnalysysAgent.pageProperty({
    //   $url: 'https://www.baidu.com'
    // })
  },
  beforePageClose (res, setAttrs) {
    // const newRes = setAttrs({
    //   abc: 1234234
    // })

    // // console.log(res, newRes)
    // AnalysysAgent.track('page_close', newRes)
    // return false
  },
});