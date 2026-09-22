<template>
  <div class="goods-details">
    
  </div>
</template>

<script>

import Titles from '@/components/title.vue'
import io from '@/js/io.js'
import editor from '@/components/editor/index.vue'
import keyValue from '@/components/form/keyValue.vue'
import imageArr from '@/components/form/imageArr.vue'
import upload from '@/components/upload.vue'

export default {
  name: 'goods',
  components: { Titles, editor, keyValue, imageArr, upload },
  data () {
    return {
    	
    }
  },
  watch: {
  	
  },
  created () {
  
  },
  mounted () {
   
  },
  methods: {
    
    
  }
}
</script>

<style lang="scss">
.specifications  {
  .w-e-text-container {
    height: 300px !important;
  }
}
</style>