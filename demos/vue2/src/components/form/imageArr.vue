<template>
  <div class="key-value">
    <el-row>
      <el-col :span="8" v-for="(item, i) in attrList" :key="i">
        <el-row :gutter="5">
          <el-col :span="20" class="row-cell">
            <el-popover trigger="hover" placement="bottom-end" width="300">
              <div v-if="item">
                <img :src="item" style="max-width: 100%">
              </div>
            <input slot="reference" class="el-input__inner" v-model="attrList[i]" placeholder="image url地址"/>
				  </el-popover>

          </el-col>
          <el-col :span="2" class="row-cell"><i class="el-icon-delete" @click="del(i)"></i></el-col>
        </el-row>
      </el-col>
      <el-col :span="8" >
        <el-button type="success" @click="add()">+添加商品幻灯片</el-button>      
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['imageGallery'],
  data () {
    return {
      attrList: []
    }
  },

  created () {
    
  },

  watch: {
    imageGallery (v) {
      if(v) {
        this.attrList = this.imageGallery
      }
      console.log(this.attrList)
    }
  },

  methods: {
    add () {
      this.attrList.push('')
    },

    del (i) {
      this.attrList.splice(i, 1)
    },

    // 验证
    check () {
      let isCheck = true

      if (this.attrList.length === 0) {
        return false
      }

      this.attrList.forEach(o => {
        if(!o.trim()) {
          isCheck = false
        }
      })

      return isCheck
    },

    // 获取商品规格
    get () {
      return JSON.stringify(this.attrList)
    }
  }
}
</script>

<style lang="scss">
.key-value {
  .row-cell {
    margin-bottom: 10px;
  }
}
</style>