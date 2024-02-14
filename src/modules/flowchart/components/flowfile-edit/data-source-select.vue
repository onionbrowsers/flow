<template>
  <div
    id="data-source"
    v-loading.fullscreen="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <div id="select-box">
      <div class="select-template select-item select-online-flowchart" @click="handleSelectFlowchart">
        <p class="big-desc">在线Smart Flow</p>
        <p class="small-desc">
          <img src="../../assets/flowfile/info-icon.svg" alt="">
          &nbsp;&nbsp;
          <span>导入SmartFlow在线流程图文件</span>
        </p>
      </div>
      <div class="upload">
        <el-upload
          class="upload-demo"
          action=""
          accept=".vsdx"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onVisioChange"
        >
          <p class="big-desc">本地Visio</p>
          <p class="small-desc">
            <img src="../../assets/flowfile/info-icon.svg" alt="">
            &nbsp;&nbsp;
            <span>导入本地Visio流程图文件</span>
          </p>
          <p class="small-desc">
            注: 当前仅支持.vsdx文件类型
          </p>
        </el-upload>
      </div>
    </div>
    <flowfile-edit-container
      v-if="drawIOFlag"
      class="flowfile-edit-container"
      ref="flowfileEditContainer"
      iframeName="iframe2"
      @receiveXml="receiveXml"
      @fileData="handleSaveFileData"
      @importDone="handleImportDone"
      @drawioState="handleDrawioState"
      @newpageReady="handleNewPageReady"
    ></flowfile-edit-container>
  </div>
</template>

<script>
import FlowfileEditContainer from './flowfile-edit-container'
import Bus from '@/utils/event-bus'

const IMPORT_INIT_PAGE = 0 // 初始化导入空数据
const IMPORT_TABLE_HEADER = 1 // 导入表头
const IMPORT_FLOW_CHART = 2 // 导入流程图，通过Excel或模板导入
const IMPORT_WHILE_FRESH = 3 // 保存流程图后刷新后导入

export default {
  components: {
    FlowfileEditContainer
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      headers: null,
      currentFileName: '',
      xml: '',
      successList: [],
      failList: [],
      fileInfo: {},
      tabNameThumbnail: [],
      currentIndexOfTabNameThumbnail: -1,
      resOfUploadVisio: {},
      drawIOFlag: 1,
      drawIOState: false // 当前页面的 drawIO 加载状态
    }
  },
  watch: {
    tabNameThumbnail: {
      handler (newValue) {
        // JSON.parse(JSON.stringify(newValue))
        this.$emit('update-visio-done', { success: newValue, fail: this.resOfUploadVisio.fail, file: this.resOfUploadVisio.file, flag: this.resOfUploadVisio.flag }) // 传到 fail-list 与 visio-tab-list 组件
      },
      deep: true
    },
    isShow: {
      handler (newValue) {
        this.tabNameThumbnail = newValue ? [] : this.tabNameThumbnail
      }
    }
  },
  mounted () {
    this.headers = {
      Authorization: this.$store.getters.token
    }
    Bus.$on('import-flowchart-existed-done', this.handleImportFlowchartExistedDone)
  },
  beforeDestroy () {
    Bus.$off('import-flowchart-existed-done')
  },
  methods: {
    onVisioChange (file) {
      this.loading = true
      this.addFile(file.raw)
    },
    receiveXml ({ xml }) {
      // 触发事件, 告诉 flowfile-edit 当前从哪处导入
      this.$emit('import-from-event', { from: 'local' })
      this.xml = xml
      // this.changeLoadingStatus(true, '正在上传，请稍后...')
      let { flowfileId } = this.$route.params
      this.$api.flowUploadVisio(flowfileId, { visio: xml, file_name: this.currentFileName }).then(data => {
        this.loading = false
        if (data.data.success.length === 0 && data.data.fail.length === 0) {
          this.$msgMnger.error('无数据!请检查您上传的Visio文件!')
          return false
        }
        this.resOfUploadVisio = data.data
        this.tabNameThumbnail = data.data.success.map(item => {
          this.$set(item, 'imgSrc', '')
          return item
        })
        this.$emit('upload-visio-done', { success: this.resOfUploadVisio.success, fail: this.resOfUploadVisio.fail, file: this.resOfUploadVisio.file, flag: this.resOfUploadVisio.flag }) // 传到 fail-list 与 visio-tab-list 组件
        this.currentIndexOfTabNameThumbnail = 0
        // 如果是空的, 不进行导入 xml 操作
        if (this.tabNameThumbnail.length === 0) {
          return
        }
        this.reloadIframe()
      }).catch(e => {
        this.reloadIframe() // 刷新iframe，目的是重置sheets
        this.loading = false
        this.$msgMnger.httpError(e)
      })
    },
    reloadIframe () {
      this.drawIOFlag = 0
      this.drawIOState = false // 重置 drawIO 加载状态
      this.$nextTick(() => {
        this.drawIOFlag = 1
      })
    },
    addFile (file) {
      // 若此时 drawIO 没有加载完成
      if (!this.drawIOState) {
        this.$msgMnger.warn('加载中, 请等待')
        return
      }
      this.currentFileName = file.name
      let _file = {
        format: 'vsdx',
        data: file,
        filename: file.name
      }
      this.$refs['flowfileEditContainer'].importFileData(_file)
    },
    handleImportXml (xml) {
      // 向 drawIO 导入 xml 的函数, 一次导入一个, 一页只容纳一个 xml
      let file = {
        format: 'xml',
        data: xml
      }
      let _position = this.getImportXmlPosition(IMPORT_FLOW_CHART)
      this.$refs['flowfileEditContainer'].importFileData(file, _position)
    },
    handleImportDone () {
      // 导入 xml 数据完成, 添加新页, 准备导入下一个 xml; 当 完全导入完成时, 导出所有页的缩略图
      if (this.tabNameThumbnail === []) {
        return false
      }
      // 索引 +1
      this.currentIndexOfTabNameThumbnail++
      if (this.currentIndexOfTabNameThumbnail === this.tabNameThumbnail.length) { // 如果导入已完成, 导出所有图片
        this.$refs.flowfileEditContainer.refGetAllImageUrls({ scale: 1, tabIndexes: [] })
        return
      }
      // 添加新页
      this.$refs.flowfileEditContainer.newPage()
    },
    handleNewPageReady () {
      // 添加的新页已准备完成, 继续导入下一 xml
      this.handleImportXml(this.tabNameThumbnail[this.currentIndexOfTabNameThumbnail].xml)
    },
    handleSaveFileData (params) {
      // 导出数据成功的回调，params 包含从 drawIO 导出的信息
      if (params.format === 'png') {
        let data = params.data
        if (params.hasOwnProperty('action') && params.action === 'get-all-images') {
          // 1. action 为 获取所有的图片 get-all-images
          // console.log('draw接收到的png文件信息: ', params)
          // 因为按照顺序导出, 所以导出顺序可与 tabNameThumbnail 的 xml 对应
          for (let item of this.tabNameThumbnail) {
            if (item.imgSrc === '') {
              item.imgSrc = data
              break
            }
          }
        }
      }
    },
    getImportXmlPosition (type) {
      let position = {}
      switch (type) {
        case IMPORT_INIT_PAGE:
          position = { dx: 0, dy: 0 }
          break
        case IMPORT_TABLE_HEADER:
          position = { dx: 80, dy: 68 }
          break
        case IMPORT_FLOW_CHART:
          position = { dx: 80, dy: 210 }
          break
        case IMPORT_WHILE_FRESH:
          position = { dx: 0, dy: 0 }
          break
        default:
          position = { dx: 0, dy: 0 }
          break
      }
      return position
    },
    handleSelectFlowchart () {
      this.$emit('select-flowchart')
    },
    handleImportFlowchartExistedDone (data) {
      // 导入在线流程图成功
      this.resOfUploadVisio = data.data
      this.tabNameThumbnail = data.data.success.map(item => {
        this.$set(item, 'imgSrc', '')
        return item
      })
      this.$emit('upload-visio-done', { success: this.resOfUploadVisio.success, fail: this.resOfUploadVisio.fail, file: this.resOfUploadVisio.file, flag: this.resOfUploadVisio.flag }) // 传到 fail-list 与 visio-tab-list 组件
      this.currentIndexOfTabNameThumbnail = 0
      // 如果是空的, 不进行导入 xml 操作
      if (this.tabNameThumbnail.length === 0) {
        return
      }
      this.reloadIframe()
    },
    handleDrawioState () {
      // 监听到 drawIO 加载状态改变
      // 1. 改变状态
      this.drawIOState = true
      // 2. 判断是哪一次的加载
      if (this.tabNameThumbnail.length === 0) { // 表示为了导入 visio 进行的加载 drawIO
        return
      }
      // 3. 如果是为了导入 xml 和 导出 png
      this.handleImportXml(this.tabNameThumbnail[this.currentIndexOfTabNameThumbnail].xml)
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/index';
  #data-source{
    // width: 900px;
    width: 620px;
    margin-left: auto;
    margin-right: auto;
    max-height: 290px !important;
    overflow: hidden !important;
  }
  #select-box{
    .flowfile-edit-container{
      height: 0 !important;
      overflow: hidden !important;
    }
    padding-bottom: 40px;
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .select-online-flowchart {
      background-image: url("../../assets/flowfile/visio-online.svg");
      background-repeat: no-repeat;
      background-size: 71px 80px;
      background-position: center 30px;
      &:hover {
        background-image: url("../../assets/flowfile/visio-online-selected.svg");
        /*.big-desc {*/
        /*  */
        /*}*/
        color: #1890FF;
      }
    }
    .select-item,
    .el-upload{
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      img {
        transform: translateY(2px);
      }
    }
    .el-icon-close{
      position: absolute;
      right: 3px;
      top: -40px;
      font-size: 28px;
      cursor: pointer;
    }
    .select-template{
      position: relative;
      box-sizing: border-box;
      width: 280px;
      height: 210px;
      border: 1px dashed #ccc;
      float: left;
      border-radius: 6px;
      font-size: 28px;
      cursor: pointer;
      .select-template-icon {
        position: absolute;
        top: 45px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 55px !important;
        color: #999;
      }
      &:hover{
        border: 1px dashed #1890ff;
        color: #1890ff;
        .select-template-icon {
          color: #1890ff;
        }
      }
    }
    .iconfont{
      display: inline-block;
      // color: #8c939d;
      font-size: 28px !important;
    }
    .upload{
      float: right;
      .el-upload{
        box-sizing: border-box;
        width: 280px;
        height: 210px;
        border: 1px dashed #ccc;
        border-radius: 6px;
        background-image: url("../../assets/flowfile/visio-local.svg");
        background-repeat: no-repeat;
        background-size: 71px 80px;
        background-position: center 30px;
        &:hover{
          background-image: url("../../assets/flowfile/visio-local-selected.svg");
          border: 1px dashed #1890ff;
          .big-desc{
            color: #1890ff !important;
          }
        }
        line-height: 21px !important;
      }
    }
    .big-desc{
      font-size: 16px;
      margin-top: 120px;
      margin-bottom: 10px;
    }
    .small-desc{
      font-size: 12px;
      color: #ccc;
      line-height: 21px;
    }
    .tip{
      .link{
        color: #4C99FF;
      }
      .super-small-desc{

      }
    }
    .el-upload:focus{
      color: #606266;
    }
  }
</style>

<style lang="scss" scoped>
#select-box{
}
</style>

<style lang="scss">
#data-source {
  .flowfile-edit-container {
    height: 0;
    overflow: hidden;
    .iframe-src {
      width: 100% !important;
    }
  }
}
</style>
