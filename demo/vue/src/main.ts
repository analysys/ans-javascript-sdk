
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"

// import AnalysysAgent from "asd-javascript-sdk";


createApp(App).use(router).mount('#app')

// AnalysysAgent.init({
//   appkey: "47fce41a0472c616", //APPKEY
//   uploadURL: 'https://uba-up.analysysdata.com',
//   debugMode: 2,
//   // hash: true,
//   // SDKFileDirectory: '/sdk/5.0.0',
//   // allowTimeCheck: false,
//   // autoPageViewDuration: true,
//   // autoTrack: true,
//   // visitorConfigURL: 'https://yaodandan-up.analysysdata.com',
//   // autoClickBlackList: ['http://127.0.0.1:5173/#/'],
//   // pageViewBlackList: ['http://127.0.0.1:5173/#/'],
//   // autoHeatmap: true,
//   sendType: 'ajax',
//   // crossSubdomain: true,
//   // pageProperty: {
//   //   'add': 12333
//   // },
//   // userClickProperty: {
//   //   'isClickEle': true
//   // }
// })

