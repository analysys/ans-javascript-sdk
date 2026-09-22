<template>
  <div class="layout-body">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'leftMenu',
  components: {
    // HelloWorld
  }
}
</script>

<style lang="scss">
.layout-body {
	position: fixed;
	top: 61px;
  left: 230px;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  .content {
    padding: 25px 20px;
  }
}
</style>
