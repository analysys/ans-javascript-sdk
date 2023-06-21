import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from './views/index/index.vue'

const routes: RouteRecordRaw[] = [{
  path: "/",
  component: Index
}, {
  path: '/product',
  component: () => import("./views/product/index.vue")
}, {
  path: '/sdk',
  component: () => import("./views/sdk/index.vue")
}]

export default createRouter({
  history: createWebHistory(),
  routes
});