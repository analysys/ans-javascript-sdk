import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from './views/index/index.vue'

const routes: RouteRecordRaw[] = [{
  path: "/",
  component: Index,
  meta: {
    title: '首页'
  }
}, {
  path: '/product',
  component: () => import("./views/product/index.vue"),
  meta: {
    title: '产品'
  }
}, {
  path: '/sdk',
  component: () => import("./views/sdk/index.vue"),
  meta: {
    title: 'sdk'
  }
}]

 const router =  createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach((to, from) => {
  document.title = to.meta.title
  // window.AnalysysAgent.pageProperty({
  //   subTitle: to.meta.title
  // })
})

export default router