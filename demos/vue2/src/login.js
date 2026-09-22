import Vue from 'vue'
import login from '@/views/login/index.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


Vue.use(ElementUI)

new Vue({
	render () {
    return (<login />)
  }
}).$mount('#app')