<template>
  <div id="app">
   <head-nav></head-nav>
   <left-menu></left-menu>
   <layout-body>
     <router-view></router-view>
   </layout-body>
  </div>
</template>


<script>
import headNav from './components/layout/nav/index.vue'
import leftMenu from './components/layout/menu/index.vue'
import layoutBody from './components/layout/body/index.vue'

export default {
  name: 'app',
  components: {
    headNav, leftMenu, layoutBody
  }
}
</script>

<style lang="scss">

</style>
