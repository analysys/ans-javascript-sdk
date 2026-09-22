<template>
  <div class="menu-left">
    <el-menu background-color="whitesmoke" :router="true" :default-openeds="['1']" :defaultActive="defaultActive">
      <el-menu-item index="/">首页</el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="iconfont">&#xe676;</i>
          <span>商品管理</span>
        </template>
        <el-menu-item index="/goods">商品列表</el-menu-item>
        <el-menu-item index="/goods/details">添加商品</el-menu-item>
        <el-menu-item index="/goods/type">商品分类</el-menu-item>
        <el-menu-item index="/goods/brand">商品品牌</el-menu-item>
      </el-submenu>

      <el-menu-item index="/stock">
        <i class="iconfont">&#xe711;</i>
        <span slot="title">库存管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>


export default {
  name: 'leftMenu',
  components: {

  },
  data () {
    return {
      defaultActive: ''
    }
  },

  mounted () {
    this.defaultActive = document.location.hash.split('#')[1]
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
.menu-left {
  width: 230px;
	position: fixed;
	background: rgba(245, 245, 245, 1);
	border-right: solid #E6E6E6 1px;
	top: 61px;
  left: 0;
  bottom: 0;
  box-shadow: 2px 2px 5px rgba(204, 204, 204, 0.35);
  padding-top: 25px;
  overflow-y: auto;
  .iconfont {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 17px;
    vertical-align: middle;
  }
  .el-menu {
    border-right: 0;
  }
  .el-menu-item, .el-submenu__title {
    height: 50px;
    line-height: 50px;
  }
  .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
}
</style>
