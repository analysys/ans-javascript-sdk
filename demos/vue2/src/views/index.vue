<template>
  <div class="home">
    <h2>首页</h2>
    <div @click="alias()">绑定用户id</div>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'home',
  components: {
    
  },
  data(){
    return {
      
    };
  },
  methods: {
    alias () {
      AnalysysAgent.alias('user_id_123456');
    }
  },
  mounted () {
    
  }
}
</script>
