<template>
  <div class="editor">
  	<div ref="$editor"></div>
  </div>
</template>

<script>
	export default {
  components: { },
  data () {
    return {
      editorContent: '',
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    menus: {
      type: Array,
      default() {
        return ['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'image', 'table', 'video', 'code','undo','redo']
      } 
    }
  },

  mounted () {
    let E = window.wangEditor
  	this.editor = new E(this.$refs.$editor)
  	this.editor.customConfig.onchange = (html) => {
      this.editorContent = html
      this.$emit('change', html)
    }
    this.editor.customConfig.menus = this.menus
  	this.editor.create()
    this.editor.txt.html(this.value)
  },
  methods: {
    html (html) {
      this.editor.txt.html(html)
    }
  }
}
</script>

<style lang="scss">
.editor {
	background: #fff;
}
</style>