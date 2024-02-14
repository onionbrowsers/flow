<!--  -->
<template>
  <div id="template-preview">
    <flowfile-dialog
      customClass="template-preview-dialog"
      ref="previewDialog"
      :isVisible="isShow"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width='1300px'
      top='5%'
      :title="title"
      :showClose="true"
      @beforeClose="closeDialog"
    >
      <div
        class="preview-container"
        slot="one"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        >
        <preview-excel
          :excelData="excelData"
          v-if="visibleType===0"/>
        <preview-visio
          class=""
          :xmlData="xmlData"
          v-if="visibleType===1"/>
      </div>
      <div class="footer" slot="two">
        <el-button
          slot="three"
          class="switch-btn"
          size="mini"
          type="primary"
          icon="el-icon-sort"
          @click="switchType">
          {{ visibleType === 0 ? '切换预览Visio' : '切换预览Excel' }}
        </el-button>
      </div>
    </flowfile-dialog>
  </div>
</template>

<script>
import FlowfileDialog from '../public/flowfile-dialog'
import PreviewExcel from './preview-excel'
import PreviewVisio from './preview-visio'
export default {
  components: {
    FlowfileDialog,
    PreviewExcel,
    PreviewVisio
  },
  data () {
    return {
      title: '预览',
      btn2: { title: '切换显示模式' },
      excelData: {}, // 模板数据,
      excelDataLast: [],
      xmlData: '', // 模板生成的流程xml数据
      isShow: false,
      isActive: true,
      loading: false,
      visibleType: 0 // 0-excel, 1-visio
    }
  },
  methods: {
    closeDialog () {
      this.isShow = false
    },
    updateTemplatePreview (id) {
      this.isShow = true
      this.$refs.previewDialog.updateVisible(true)
      this.getPreviewInfo(id)
    },
    getPreviewInfo (id) {
      this.visibleType = 0
      this.excelData = []
      this.xmlData = ''
      this.loading = true
      this.$api.getTemplatePreview(id).then(res => {
        this.excelData = res.data.table
        this.xmlData = res.data.xml
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$msgMnger.httpError(err)
      })
    },
    switchType () {
      this.visibleType = this.visibleType === 0 ? 1 : 0
      if (!this.xmlData) {
        this.$msgMnger.warn('生成Visio失败')
        this.visibleType = 0
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#template-preview{
  padding-top: 20px;
  margin: 0 auto;
}
</style>
<style lang='scss'>
.template-preview-dialog{
  height: 80%;
  .el-dialog__body{
    height: calc(100% - 122px);
    position: relative;
    .preview-container{
      height: 100%;
    }
    .footer{
      width:100%;
      height: 43px;
      background: #1B2541;
      border-radius: 0px 0px 5px 5px;
      .switch-btn{
        position: absolute;
        width: 132px;
        bottom: -20px;
        right: 50px;
      }
    }
  }
}
</style>
