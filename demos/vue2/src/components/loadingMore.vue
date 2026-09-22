<template>
  <div class="loading-more" @click="$emit('click')">
    <i class="el-icon-loading" v-show="loading"></i> {{loading ? '正在加载中...' : '点击加载更多'}}
  </div>
</template>

<script>
export default {
  props: {

    loading: {
      type: Boolean,
      default: false
    }
    
  }
}
</script>

<style lang="scss">
.loading-more {
	margin: 5px 0;
  border: solid #eee 1px;
  line-height: 35px;
  text-align: center;
  font-size: 13px;
  background: #fff;
  color: #409EFF;
  cursor: pointer;
  i {
    font-size: 14px;
    margin-right: 5px;
  }
}
</style>