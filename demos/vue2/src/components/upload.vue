<template>
  <div>
    <el-upload
      action="/stock/api/upload"
      list-type="picture-card"
      :limit="limit"
      :on-preview="handlePictureCardPreview"
      :fileList="fileList"
      :on-remove="onRemove"
      :on-exceed="onExceed"
      :on-success="onSuccess">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
	export default {
  data () {
    return {
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      limit: 1
    }
  },
  props: {

    value: {
      type: String,
      default: null
    },

    // 是否上传多个
    multiple: {
      type: Boolean,
      default: false
    }
  },

  created () {
    
    this.limit = this.multiple ? 5 : 1

    if (this.multiple) {
      if (this.value) {
        let arr = this.value.split(','), list = []
        arr.forEach(o => {
          list.push({url: o})
        })
        this.fileList = list
      } else {
        this.fileList = []
      }
    } else {
      if (this.value) {
        this.fileList = [{url: this.value}]
      } else {
        this.fileList = []
      }
    }
  },

  mounted () {
    
  },

  methods: {

    getValue (arr) {
      let str = []
      arr.forEach(o => {
        if (o.response) {
          str.push(o.response.data.url)
        } else {
          str.push(o.url)
        }
      })
      return str.join()
    },

    handlePictureCardPreview (file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },

    onRemove (file, fileAll) {
      console.log(this.getValue(fileAll))
      this.$emit('change', this.getValue(fileAll))
    },

    onSuccess (response, file, fileAll) {
      console.log(this.getValue(fileAll))
      this.$emit('change', this.getValue(fileAll))
    },

    onExceed () {
      this.$alert('上传数量超限')
    }
  }
}
</script>

<style lang="scss">

</style>