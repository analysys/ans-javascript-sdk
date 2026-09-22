<template>
  <div class="key-value">
    <el-row>
      <el-col :span="8" v-for="(item, i) in attrList" :key="i">
        <el-row :gutter="10">
          <el-col :span="8" class="row-cell"><el-input v-model="item.name" :placeholder="'key' + 1"></el-input> </el-col>
          <el-col :span="10" class="row-cell"><el-input v-model="item.value" :placeholder="'value' + 1"></el-input></el-col>
          <el-col :span="2" class="row-cell"><i class="el-icon-delete" @click="del(i)"></i></el-col>
        </el-row>
      </el-col>
      <el-col :span="8" >
        <el-button type="success" @click="add()">+添加商品属性</el-button>      
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['attribute'],
  data () {
    return {
      attrList: []
    }
  },

  created () {
    if(this.attribute) {
      this.attrList = this.attribute
    }
  },

  watch: {
    attribute (v) {
      if(v) {
        this.attrList = this.attribute
      }
    }
  },

  methods: {
    add () {
      this.attrList.push({
        id: Math.round(Math.random()*10000),
        name: '',
        value: ''
      })
    },

    del (i) {
      this.attrList.splice(i, 1)
    },

    // 验证
    check () {
      let isCheck = true
      this.attrList.forEach(o => {
        if(!o.name.trim() || !o.value.trim()) {
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