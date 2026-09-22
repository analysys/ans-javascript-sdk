import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/index.vue'

// 获取Router版本号
console.log('vue Router版本号:', Router.version)

Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/goods',
      name: 'goodsList',
      component: ()=> import ('./views/goods/goods.vue')
    },
    {
      path: '/goods/details',
      name: 'goodsDetails',
      component: ()=> import ('./views/goods/goodsDetails.vue')
    },
    {
      path: '/goods/type',
      name: 'goodsType',
      component: ()=> import ('./views/goods/goodsType.vue')
    },
    {
      path: '/goods/brand',
      name: 'goodsBrand',
      component: ()=> import ('./views/goods/brand.vue')
    },
    {
      path: '/stock',
      name: 'stock',
      component: ()=> import ('./views/stock/index.vue')
    }
  ]
})
