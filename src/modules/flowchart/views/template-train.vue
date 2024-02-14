<template>
  <div id="template-train">
    <b-layout mode="vertical" placement="top" :space="headHeight" :border="false">
      <template-train-header
        slot="first"
        ref="template-train-header"
        :details="templateDetail"
        @changeLoadingStatus="changeLoadingStatus"
        @getTemplateDetail="getTemplateDetail"
        @changeTemplateStatus="changeTemplateStatus"/>
      <b-layout slot="last" mode="vertical" placement="bottom" :border="false" class="upload-concent" :space="contentHeight"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        >
        <template-train-filelist
        slot="first"
        :fileList="fileList"
        :templateDetail="templateDetail"
        :listLoading="templateDetail['status'] === 1"
        @getTemplateStatus="getTemplateStatus"
        @changeShowTips="changeShowTips"
        @deleteVisio="deleteVisio"
        @changeLoadingStatus="changeLoadingStatus"
        @getTemplateDetail="getTemplateDetail"/>
        <train-upload  slot="last" @addFile="addFile" @showHelp="showHelp"></train-upload>
      </b-layout>
    </b-layout>
    <flowfile-edit-container
      class="flowfile-edit-container"
      ref="flowfileEditContainer"
      @receiveXml="receiveXml"
    ></flowfile-edit-container>
  </div>
</template>

<script>
import BLayout from '@/layouts/BinaryLayout'
import TemplateTrainHeader from '../../flowchart/components/template-train/template-train-header.vue'
import TemplateTrainFilelist from '../../flowchart/components/template-train/template-train-filelist.vue'
import TrainUpload from '../../flowchart/components/template-train/upload-train-file'
import FlowfileEditContainer from '../components/flowfile-edit/flowfile-edit-container'
import $ from 'jquery'
export default {
  components: {
    BLayout,
    TemplateTrainHeader,
    TemplateTrainFilelist,
    TrainUpload,
    FlowfileEditContainer
  },
  data () {
    return {
      headHeight: '160px',
      contentHeight: '165px',
      currentFileName: '',
      fileList: [],
      templateDetail: {},
      loading: false,
      loadingText: '加载中...'
    }
  },
  methods: {
    getTemplateDetail () {
      this.changeLoadingStatus(true, '加载中...')
      let { templateId } = this.$route.params
      this.$api.getTemplateDetail(templateId).then(data => {
        this.templateDetail = data.data
        this.fileList = data.data.visios
        this.changeLoadingStatus()
      }).catch(e => {
        this.changeLoadingStatus()
      })
    },
    receiveXml ({ xml }) {
      this.changeLoadingStatus(true, '正在上传，请稍后...')
      let { templateId } = this.$route.params
      this.$api.uploadVisioXml(templateId, { visio: xml, file_name: this.currentFileName }).then(data => {
        this.fileList = [...this.fileList, data.data]
        this.reloadIframe() // 刷新iframe，目的是重置sheets
        this.changeLoadingStatus()
      }).catch(e => {
        this.reloadIframe() // 刷新iframe，目的是重置sheets
        this.changeLoadingStatus()
      })
    },
    reloadIframe () {
      let iframe = $('iframe.iframe-src')
      iframe.attr('src', iframe.attr('src'))
    },
    addFile (file) {
      this.currentFileName = file.name
      let _file = {
        format: 'vsdx',
        data: file,
        filename: file.name
      }
      this.$refs['flowfileEditContainer'].importFileData(_file)
    },
    showHelp () {
      window.open('/fc/filestyle/visio')
    },
    deleteVisio (vid) {
      let fileList = this.fileList
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index]
        if (element.id === vid) {
          this.fileList.splice(index, 1)
          break
        }
      }
    },
    changeLoadingStatus (loading = false, loadingText) {
      this.loading = loading
      this.loadingText = loadingText || this.loadingText
    },
    getTemplateStatus (bool) {
      this.$refs['template-train-header'].updateTraining(true)
      this.$refs['template-train-header'].getTemplateStatus(bool)
    },
    changeShowTips (bool) {
      this.$refs['template-train-header'].changeShowTips(bool)
    },
    changeTemplateStatus (data) { // 作用是定时请求模板状态，要更新旧的模板数据中的状态
      let { status } = data
      this.templateDetail['status'] = status
      console.log(data.status)
    }
  },
  mounted () {
    this.getTemplateDetail()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
#template-train{
  overflow: auto;
  height: 100%;
  background: $secondary-bg-color;
  margin: 0 auto;
  width: 1200px;
  font-size: 14px;
  .upload-concent{
    // width: calc(100% - 20px);
    // height: calc(100% - 20px);
    background: $primary-bg-inverse-color;
    margin: 10px 0 0 0;
  }
  .flowfile-edit-container{
    height: 0;
    overflow: hidden;
  }
}
</style>
<style lang="scss">
@import '@/styles/index.scss';
#template-train #page-header .create-btn{
  top: 17px;
}
#page-header .title{
  line-height: 20px!important;
}
.cursor{
  cursor: pointer;
  margin-left: 20px;
}
#only-header {
  background: $secondary-bg-color;
}
</style>
