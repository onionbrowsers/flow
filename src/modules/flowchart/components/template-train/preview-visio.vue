<!--  -->
<template>
  <div
    id="preview-visio"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <el-scrollbar class="img-container">
      <img :src="previewSrc">
    </el-scrollbar>
    <flowfile-edit-container
      class="flowfile-edit-container"
      ref="flowfileEditContainer"
      @fileData="handleFileData"
      @drawioState="handleDrawioState"
      @editedState="handleEditedState"
    ></flowfile-edit-container>
  </div>
</template>

<script>
import FlowfileEditContainer from '../flowfile-edit/flowfile-edit-container'
export default {
  props: ['xmlData'],
  components: {
    FlowfileEditContainer
  },
  data () {
    return {
      imgData: null,
      loading: false
    }
  },
  computed: {
    previewSrc () {
      return this.imgData
    }
  },
  mounted () {
    this.loading = true
  },
  methods: {
    addXmlFile () {
      if (!this.xmlData) {
        this.$msgMnger.warn('未生成xml')
        return
      }
      let _file = {
        format: 'xml',
        data: this.xmlData,
        filename: ''
      }
      let _position = { dx: 80, dy: 68 }
      this.$refs.flowfileEditContainer.importFileData(_file, _position)
    },
    handleDrawioState (params) {
      if (params.data) { // drawio加载完成时，开始导入xml
        this.addXmlFile()
      }
    },
    handleEditedState (params) { // 表示xml导入完成
      let file = {
        format: 'png',
        filename: '',
        data: ''
      }
      // 导出png，用于模板预览展示
      this.$refs.flowfileEditContainer.exportFileData(file)
    },
    handleFileData (params) {
      this.loading = false
      if (params.format === 'png') {
        this.imgData = params.data
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#preview-visio{
  height: 100%;
  margin: 0 auto;
  padding: 0 10px;
  .img-container{
    height: 100%;
    text-align: center;
    img{
      width: 60%;
    }
  }
  .flowfile-edit-container{
    height: 0;
    overflow: hidden;
  }
}
</style>
