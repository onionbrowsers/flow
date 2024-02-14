<template>
    <div
      id="flowfile-edit"
      v-loading="loading || $store.getters.loadingGetter"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <table-toggle-v2 @sendTableBool="sendTableBool" :is-show="showTable"></table-toggle-v2>
      <drawio-mxcells :mxCells="mxCells" @delMxCell="delMxCell" v-if="false"/>
      <editable-table
        ref="editableTable"
        :current-page-id="drawioTabsPage[currentTabId]"
        :current-tab-id="currentTabId"
        :is-show="showTable"
        :animateBool="showTable"
        :styleConfig="styleConfig"
        :folderId="this.flowfileDetal.folder_id"
        @change-drawio-tabs-page="changeDrawioTabsPage"
        @changeLoading="changeLoadingByTable"
        @rename-current-page="handleRenameCurrentPage"
        @xml-data-change="handleXMLDataChange"
      ></editable-table>
      <b-layout mode="vertical" placement="top" space="54px" :border="false">
        <flowfile-edit-top
          ref="flowFileEditTop"
          slot="first"
          :authTYpes="authTYpes"
          :filename="flowfileName"
          :current-page-id="drawioTabsPage[currentTabId]"
          :flowfileDetal="flowfileDetal"
          :flowId="$route.params.flowfileId"
          :companyId="companyId"
          @clickEvent="handleClick"
          @triggerAutoSave="handleAutoSave"
          @editingEnd="handleEditingEnd"
        ></flowfile-edit-top>
        <flowfile-edit-container
          slot="last"
          ref="flowfileEditContainer"
          @fileData="handleSaveXmlOrImgFromDrawio"
          @drawioState="handleDrawioState"
          @editedState="handleEditedState"
          @newpageReady="handleNewpageReady"
          @selectPage="handleSelectPage"
          @importDone="importDone"
          @currentPageMxCells="handleCurrentPageMxCells"
          @changeLoadingStatus="changeLoadingByDrawio"
          @refresh-last-active-time-stamp="handleRefreshLastActiveTimeStamp"
          @tab-renamed-by-draw-i-o="handleTabRenamedByDrawIO"
          @updateStyle="handleUpdateStyle"
        ></flowfile-edit-container>
      </b-layout>
      <flowfile-table-header-dialog ref="tableHeaderDialog" :folderId="this.flowfileDetal.folder_id" @loadTableHeader="loadTableHeaderToDrawio"/>
      <flowfile-leave-edit-dialog ref="leaveEditDialog" @saveBeforeLeave="handleSaveEvent"/>
      <flowfile-import-dialog ref="importDialog" :folderId="this.flowfileDetal.folder_id" @loadingVisible="handleLoadingVisible" @importData="handleImportData"/>
      <ws-tool
        ref="wsTool"
        @ws-open-success="handleWSOpenSuccess"
        @ws-close-success="handleWSCloseSuccess"
      ></ws-tool>
    </div>
  </template>
  
<script>
import BLayout from '@/layouts/BinaryLayout.vue'
import FlowfileEditTop from '../components/flowfile-edit/flowfile-edit-top'
import FlowfileEditContainer from '../components/flowfile-edit/flowfile-edit-container'
import TableToggleV2 from '../components/flowfile-edit/table-toggle-v2'
import EditableTable from './editable-table'
import drawioMxcells from '../components/flowfile-edit/drawio-mxcells'
  
import WsTool from '../components/flowfile-edit/ws-tool'
import { mapGetters } from 'vuex'
import Bus from '@/utils/event-bus.js'
import { drawioUtils, positionType } from '../components/flowfile-edit/drawio-utils'
import { downloadUtils } from '../components/flowfile-edit/download-utils'
  
import FlowfileTableHeaderDialog from '../components/flowfile-edit/flowfile-table-header-dialog'
import FlowfileLeaveEditDialog from '../components/flowfile-edit/flowfile-leave-edit-dialog'
import FlowfileImportDialog from '../components/flowfile-edit/flowfile-import-dialog'
  
export default {
  components: {
    BLayout,
    FlowfileEditTop,
    FlowfileEditContainer,
    TableToggleV2,
    EditableTable,
    drawioMxcells,
    WsTool,
    FlowfileTableHeaderDialog,
    FlowfileLeaveEditDialog,
    FlowfileImportDialog
  },
  props: {
    flowfileId: {
      type: String,
      default: ''  
    }
  },
  data () {
    return {
      authTYpes: '', // 权限
      flowfileName: '',
      loading: false,
      drawioEdited: false, // drawio页面是否有编辑
      isInitLoadXmlData: true,
      drawioList: [],
      warnList: [],
      pageList: [], // 保存 excel page id 的数组
      pageNumList: [], // 保存 上传之后分页提醒的 page_num 数组
      currentPageIndex: 0,
      drawioTabsWarn: {},
      drawioTabsIdLink: [],
      drawioTabsLabels: [],
      currentTabId: '',
      currentLabel: '',
      flowfileDetal: {},
      hint: [],
      isSavedXml: false,
      isForseSave: false,
      importDoneDisabled: false,
      showTable: false,
      mxCells: { header: [], content: [] },
      drawioTabsPage: {},
      count: 0, // 初始化函数重复调用, 用于过滤
      setTimeoutIdForLoading: -1,
      imgListForDownload: [], // 图片的队列，为另存为word/pdf做准备
      lastModified: null, // 记录最新修改时间, 用于编辑时, 服务器版本与当前不同步, 拉取最新数据
      mimeType: 'docx', // doc or pdf, 用于区分下载 pdf 还是 word
      styleConfig: {
        graphSize: {
          diamond: [100, 60]
        }
      },
      isViewDataMounted: false // 标志页面组件加载完成，以及drawio数据和表格数据加载完成
    }
  },
  computed: {
    ...mapGetters({
      activeTimeStampGetter: 'activeTimeStampGetter',
      newTableWidth: 'newTableWidth',
      dataGetter: 'dataGetter',
      token: 'token',
      companyId: 'currentDataSpaceIdGetter',
      drawIOState: 'drawIOStateGetter'
    })
  },
  watch: {
    newTableWidth () {
      this.$refs.flowfileEditContainer.sendTableWidth(this.newTableWidth)
    },
    activeTimeStampGetter: {
      handler (val) {
        this.$refs.flowFileEditTop.setAutoSaveInterval() // 有点击可编辑表格的操作，则重置计时器
      }
    },
    drawIOState (val) {
      if (val && this.flowfileName) {
        setTimeout(() => {
          let file = {
            format: 'png',
            filename: this.flowfileName,
            data: '',
            saveType: 'normal-save',
            sheetName: this.$route.query.sheetName
          }
          this.$refs.flowfileEditContainer.exportFileData(file)
        }, 4000)
      }
    }
  },
  mounted () {
    // 保险起见, mouted 时同步 drawIO 加载状态为否, 当 drawIO 加载完成时, 再进行改变
    this.$store.commit('MUTATE_DRAW_IO_STATE', { flag: 'not-yet' })
    Bus.$on('sendTableBool', this.sendTableBool)
    Bus.$on('download-confirm', this.handleDownload)
    window.addEventListener('message', this.listenEvent)
  },
  beforeDestroy () {
    Bus.$off('sendTableBool')
    Bus.$off('download-confirm')
    window.removeEventListener('message', this.listenEvent)
  },
  methods: {
    listenEvent (event) {
      const { data } = event
      if (data && data.type === 'xmlToImg') {
        this.sheetName = data.sheetName
      }
    },
    handleClick ({ type, value }) {
      switch (type) {
        case 'back':
          this.handleBack()
          break
        case 'save':
          this.handleSaveEvent()
          break
        case 'selectStyle':
          this.$refs.tableHeaderDialog.show()
          break
        case 'importData':
          this.$refs.importDialog.show()
          break
        case 'sync-to-left':
          this.handleSyncToLeft()
          break
        default:
          break
      }
    },
    handleLoadingVisible (state) {
      this.loading = state
    },
    sendTableBool (visible) {
      // 设置可编辑表格显示状态
      this.showTable = visible
      Bus.$emit('setButtonDefaultLeft', visible)
      this.$refs.flowfileEditContainer.sendTableBool(visible)
    },
    cutWarnList (index) { // 剪切导入excel后产生的warn
      let res = this.warnList.splice(index, 1)
      return res[0]
    },
    cutPageList (index) {
      let res = this.pageList.splice(index, 1)
      return res[0]
    },
    handleImportData (data) {
      // 从在线流程图导入数据
      this.drawioList = []
      this.warnList = []
      this.pageList = []
      this.pageNumlist = []
      let hasError = false
      data.forEach(el => {
        if (el.code && el.code !== 0) { // 上传excel存在解析失败的情况，如果是选择模板则不返回code
          hasError = true
        } else {
          let drawio = el.page_info.drawio || {}
          drawio['sheetName'] = el.page_info.name
          drawio['xmlData'] = el.xml || ''
          this.drawioList.push(drawio)
          let _warn = el.warn || []
          let _pageId = el.page_info.id
          let _pageNum = el.page_num || -1
          this.warnList.push(_warn)
          this.pageList.push(_pageId)
          let _pageNumInfo = {
            pageId: _pageId,
            pageNum: _pageNum
          }
          this.pageNumList.push(_pageNumInfo)
        }
      })
      // 导入后, 当前页 替换为导入之后的页
      // this.changeDrawioTabsPage(this.currentTabId, pageId[0])
      this.changeDrawioTabsWarn(this.currentTabId, this.cutWarnList(0)) // 导入excel后第一个sheet对应当前的tab页
      this.changeDrawioTabsPage(this.currentTabId, this.cutPageList(0))
      if (!this.warnList.length) { // 如果导入的是一页，此时需要设置一下hint
        this.hint = this.getHint()
      }
      if (!this.pageList.length) {
        this.hint = this.getHint()
      }
      if (hasError) {
        this.$msgMnger.error('解析流程文件失败')
        return
      }
  
      this.toRequestAndLoadXml() // 默认当前已打开新的page页
    },
    handleBack () {
      if (!this.$store.getters.disabledGetter && this.drawioEdited) {
        // 页面为可编辑状态，且流程图有编辑，返回时提示保存
        this.$refs.leaveEditDialog.show()
      } else {
        // 页面为不可编辑状态（查看视图）或者为进行任何编辑操作时, 不提示
        this.$router.back()
      }
    },
    async handleAutoSave () {
      // 同步的方式执行异步的网络请求操作，避免数据错误
      try {
        await this.saveExcelData() // save excel
      } catch (err) {
        console.log(err)
      }
  
      // export file to save xml/png
      let file = {
        format: 'xml',
        filename: this.flowfileName,
        data: '',
        saveType: 'auto-save'
      }
      this.$refs.flowfileEditContainer.exportFileData(file) // save xml
      file.format = 'png'
      this.$refs.flowfileEditContainer.exportFileData(file) // save png
  
      this.$refs.flowFileEditTop.clearAutoSaveInterval()
    },
    async handleSaveEvent () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'loading-for-save' })
      try {
        await this.saveExcelData()
      } catch (err) {
        console.log(err)
      }
  
      let file = {
        format: 'xml',
        filename: this.flowfileName,
        data: '',
        saveType: 'normal-save',
        sheetName: '8.6工程预验收与结算'
      }
      // 重名检测
      let sameNames = drawioUtils.sameDrawioTabNames(this.drawioTabsLabels)
      console.log(sameNames, 'sameNames')
      if (sameNames.length > 0) {
        try {
          await this.$confirm(`页名${JSON.stringify(sameNames)}重复出现，建议修改名称。`, '提示', {
            confirmButtonText: '继续保存',
            cancelButtonText: '放弃',
            type: 'warning'
          })
          this.$refs.flowfileEditContainer.exportFileData(file)
          // 同时保存png，用于流程缩略图展示
          file.format = 'png'
          this.$refs.flowfileEditContainer.exportFileData(file)
        } catch {
          this.$message({
            type: 'info',
            message: '已取消保存'
          })
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'loading-for-save' })
          return false
        }
      }
      this.$refs.flowfileEditContainer.exportFileData(file)
      // 同时保存png，用于流程缩略图展示
      file.format = 'png'
      console.log(file, 'sameNames')
      this.$refs.flowfileEditContainer.exportFileData(file)
  
      this.$refs.flowFileEditTop.clearAutoSaveInterval()
    },
    async saveExcelData () {
      return new Promise(async (resolve, reject) => {
        let promiseArr = [] // save promise arr
        for (let tabId in this.dataGetter) {
          if (!Object.prototype.hasOwnProperty.call(this.dataGetter, tabId)) continue
          let temp = this.dataGetter[tabId]
          let res = this.$refs.editableTable.handleSaveTemp(
            tabId,
            this.drawioTabsPage[tabId],
            temp.columnProps.props,
            temp.name ? temp.name : '',
            temp.columnProps.flag,
            temp.columnProps.autoNumber,
            temp.columnProps.departmentList
          )
          promiseArr.push(res)
        }
        try {
          await Promise.all(promiseArr)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    getHint () {
      let res = []
      this.drawioTabsIdLink.map((e, index) => {
        res.push({
          label: this.drawioTabsLabels[index],
          warn: this.drawioTabsWarn[e] || [],
          page: this.drawioTabsPage[e] || ''
        })
      })
      return res
    },
    handleDownload (event) {
      if (event.format === 'vsdx') {
        downloadUtils.downloadVsdx.call(this, event.tabIds)
      } else if (event.format === 'pdf') {
        downloadUtils.downloadPdf.call(this, event.tabIndexes, event.tabIds).then(() => {
          this.mimeType = 'pdf' // 或者在downloadUtils中进行设置，赋值都有效
        })
      } else if (event.format === 'docx') {
        downloadUtils.downloadWord.call(this, event.tabIndexes, event.tabIds)
      }
    },
    handleDrawioState (params) {
      // 监听从drawio传回的消息
      if (params.data) { // drawio加载完成时，开始请求流程信息
        this.laodPlaceholderToDrawio()
        // 请求流程信息
        this.getInitFlowfileInfo()
      }
    },
    handleEditedState (params) {
      if (!this.drawioList.length) {
        this.loading = false
      }
      // 如果是页面初始化加载xml数据，则不设置已编辑状态（也不需要启动自动保存计时器）
      if (this.isInitLoadXmlData) {
        return
      }
      this.drawioEdited = params.data
      this.$refs.flowFileEditTop.setAutoSaveInterval() // drawio发生编辑操作时，重置
    },
    handleNewpageReady (params) {
      // 新建tab页后，请求并导入xml数据
      this.toRequestAndLoadXml()
    },
    handleSelectPage (params) {
      // drawio切换tab页事件监听，params为切换页的参数
      if (this.currentTabId !== params.id && this.warnList.length > 0) {
        this.changeDrawioTabsWarn(params.id, this.cutWarnList(0))
      }
      if (this.currentTabId !== params.id && this.pageList.length > 0) {
        this.changeDrawioTabsPage(params.id, this.cutPageList(0))
      }
      // console.log('page selected and in flowFile-edit, before the currentTabId changing, the tabs page obj is: ', this.drawioTabsPage)
      // 判断是否为复制而来
      if (drawioUtils.pageIsDuplicated(params, this.drawioTabsLabels)) {
        this.$store.commit('HANDLE_PAGE_DUPLICATED', { curTabId: params.id })
      }
      this.currentTabId = params.id
      this.drawioTabsIdLink = params.idLink
      this.drawioTabsLabels = params.tabLabels
      this.currentLabel = params.currentLabel
      this.hint = this.getHint()
    },
    handleSaveXmlOrImgFromDrawio (params) {
      // 接收到从drawIO传回的消息，params格式为{ format: String, filename: String, data: String }
      // 保存xml和png
      let id = this.$route.params.flowfileId || this.flowfileId
      let _params = {}
      if (params.format === 'png') {
        window.parent && window.parent.postMessage(params, '*')
        if (this.flowfileId) {
          this.$emit('getImgBase', params)
        }
      }
    },
    retsetForseSaveTag () {
      setTimeout(() => {
        this.isForseSave = false
      }, 1000)
    },
    saveFlowfileToServer (id, params) {
      params['hint'] = JSON.stringify(this.getHint()) // 保存每个sheet的提示信息
      params['style_config'] = JSON.stringify(this.styleConfig)
      if (this.isForseSave) { // 添加参数，表示强制保存
        params['force'] = true
      }
      return new Promise((resolve, reject) => {
        this.$api.saveFlowfile(id, params).then(res => {
          this.lastModified = new Date(res.last_modified.replace(/T/, ' '))
          this.drawioEdited = false
          this.retsetForseSaveTag()
          resolve(res)
        }).catch(err => {
          if (err.code !== 11) {
            this.retsetForseSaveTag()
            this.$msgMnger.httpError(err)
            return
          }
          if (params.format === 'xml') {
            this.$confirm(`文件修改后仅保留一个流程页面，请确认是否保存？`, '提示', {
              confirmButtonText: '确认保存',
              cancelButtonText: '放弃',
              type: 'warning'
            }).then(() => {
              this.isForseSave = true // 如果选择“确认”，则重新执行保存过程，并上传force=true参数
              this.handleSaveEvent()
            })
          }
        })
      })
    },
    async getInitFlowfileInfo () {
      // 页面加载时获取默认流程信息
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'init-flowfile-info' })
        let id = this.$route.params.flowfileId || this.flowfileId
        // 获取详细流程信息
        const res = await this.$api.getFlowfileDetail(id)
        // 缓存编号样式
        this.$store.commit('changeNumberStyle', { riskConfig: res.data.risk_config || '1', controlConfig: res.data.control_config || '1' })
        // 初始化样式信息
        this.styleConfig = Object.assign({}, this.styleConfig, res.data.style_config)
        // 记录上次修改时间
        this.lastModified = new Date(res.data.last_modified)
        this.flowfileDetal = res.data
        if (this.$route.query.openjz) {
          if (this.flowfileDetal.pages[0]) {
            this.$refs['flowFileEditTop'].showriskjuzhen(this.flowfileDetal.pages[0])
          }
        }
        this.hint = res.data.hint
        let data = res.data
        this.flowfileName = data.name
  
        this.drawioList = []
        this.isInitLoadXmlData = true
        if (data.path && Object.keys(data.path).length) {
          this.isSavedXml = Boolean(data.preview) // 如果有预览图，则表示执行过保存操作
          let drawio = data.path
          if (data.hint && data.hint[0]) {
            drawio['sheetName'] = data.hint[0].label || '第 1 页'
          } else {
            drawio['sheetName'] = '第 1 页'
          }
          this.drawioList.push(drawio)
        } else {
          // 刚创建的我的流程图没有xml，必须初始化加载一个空的，标志位也要置正确
          this.loadNoneXmlDataToDrawio()
        }
        this.toRequestAndLoadXml()
  
        // 准备进入编辑模式
        // 1. 获取权限
        const permissionRes = await this.getUserPermission()
        if (!permissionRes || permissionRes.data === 3 || permissionRes.data === -1) {
          // 表示接口错or无权限or查看权限
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'init-flowfile-info' }) // 关闭 loading
          this.$store.commit('MUTATE_DRAW_IO_STATE', { flag: 'done' })
          return
        }
        // 2. 有权限, 检查文件在编辑状态
        const flowInfoRes = await this.$api.getFlowInfo({ flowId: this.$route.params.flowfileId || this.flowfileId })
        const status = flowInfoRes.data.status // 编辑状态 1 空闲 2 占用
        if (status === 1) { // 空闲, 可进编辑
          this.$refs.wsTool.open()
        } else if (status === 2) { // 占用, 区分占用者
          const occupier = flowInfoRes.data.occupier
          const occupierId = flowInfoRes.data.occupier_id
          if (occupier) {
            if (occupierId) {
              const currentUserId = this.$store.getters.userInfo.id
              if (currentUserId + '' === occupierId + '') { // 当前用户 与 占用者 一致
                await this.$confirm('检测到您上次编辑未关闭或非正常关闭, 是否继续?')
                this.$refs.wsTool.open()
                // 为了保持 loading 的平衡, 下方会取消掉 init-flowfile-info 的loading, 因此在此处再push一个loading
                this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'init-flowfile-info' })
              } else {
                this.$msgMnger.warn(`用户“${occupier}”正在编辑中，当前仅可以查看。`)
              }
            } else {
              this.$msgMnger.warn(`用户“${occupier}”正在编辑中，当前仅可以查看。`)
            }
          } else {
            this.$msgMnger.warn(`有其他用户正在编辑中，获取该用户信息失败。`)
          }
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'init-flowfile-info' })
        }
        // 改变 drawIO 加载状态为 加载完成 done, 可以进行页面操作
        this.$store.commit('MUTATE_DRAW_IO_STATE', { flag: 'done' })
        this.$emit('loadDrawIO')
      } catch (err) {
        console.log(err)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'init-flowfile-info' })
        this.$store.commit('MUTATE_DRAW_IO_STATE', { flag: 'done' })
        if (err === 'cancel') { // 表示确认框选择了取消
        } else {
          this.$msgMnger.httpError(err)
        }
      }
    },
    // 请求加载 xml 信息
    toRequestAndLoadXml () {
      if (!this.drawioList.length) {
        this.loading = false
        return
      }
      if (this.drawioList.length > 1) {
        this.loading = true
      }
      let drawio = this.drawioList[0]
      if (!drawio) {
        this.loadNoneXmlDataToDrawio(false)
        return
      }
      const { id, key, sheetName, xmlData } = drawio
      if (id) {
        this.$api.getFlowfile(id, key).then(res => {
          this.drawioList.shift()
          this.loadXmlDataToDrawio(res, sheetName)
          setTimeout(() => {
            // 队列中还有未加载的xml，则新建tab页
            if (this.drawioList.length) {
              this.$refs.flowfileEditContainer.newPage()
            }
          }, 2000)
        }).catch(err => {
          this.$msgMnger.httpError(err)
          this.loading = false
        })
      } else {
        this.loadXmlDataToDrawio(xmlData, sheetName)
        this.drawioList.shift()
        setTimeout(() => {
          // 队列中还有未加载的xml，则新建tab页
          if (this.drawioList.length) {
            this.$refs.flowfileEditContainer.newPage()
          }
        }, 2000)
      }
    },
    laodPlaceholderToDrawio () {
      // 加载占位符到drawio，是一个1*1大小的透明矩形，占位避免流程图显示偏移（页面刷新时，下载vsdx用visio打开时）
      let placeholderXml = '<?xml version="1.0" encoding="utf-8"?><mxGraphModel arrows="1" connect="1" fold="1" grid="1" gridSize="10" guides="1" math="0" page="1" pageHeight="1169" pageScale="1" pageWidth="827" shadow="0" tooltips="1"><root><mxCell id="0"/><mxCell id="1" parent="0" value="流程图"/><mxCell id="-1" parent="1" value="" placeholder_DPA="1" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=none;" vertex="1"><mxGeometry x="10" y="10" width="0" height="0" as="geometry"/></mxCell></root></mxGraphModel>'
      let file = {
        format: 'xml',
        data: placeholderXml
      }
      let _position = drawioUtils.getImportXmlPosition(positionType.IMPORT_WHILE_FRESH)
      this.importFileDataToDrawio(file, _position)
    },
    loadTableHeaderToDrawio (xmlData) {
      // 加载表头到drawio
      this.mxCells.header.forEach(el => {
        this.delMxCell(el)
      })
      let file = {
        format: 'xml',
        data: xmlData
      }
      let _position = drawioUtils.getImportXmlPosition(positionType.IMPORT_TABLE_HEADER)
      this.importFileDataToDrawio(file, _position)
    },
    loadXmlDataToDrawio (xmlData, sheetName) {
      // 加载流程数据到drawio, 参数为xml数据和sheet页名字
      this.mxCells.content.forEach(el => {
        this.delMxCell(el)
      })
      let file = {
        format: 'xml',
        filename: drawioUtils.getSheetName(xmlData, this.isInitLoadXmlData),
        data: xmlData,
        sheetName
      }
      let _importType = this.isSavedXml ? positionType.IMPORT_WHILE_FRESH : positionType.IMPORT_FLOW_CHART
      let _position = drawioUtils.getImportXmlPosition(_importType)
      this.isSavedXml = false
      this.importFileDataToDrawio(file, _position)
    },
    loadNoneXmlDataToDrawio (withName = true) {
      // 新建流程图，加载一个空的xml，为了不影响后续的操作
      let file = {
        format: 'xml',
        filename: withName ? '第 1 页' : '',
        data: '',
        sheetName: '第 1 页'
      }
      let _position = drawioUtils.getImportXmlPosition(positionType.IMPORT_INIT_PAGE)
      this.importFileDataToDrawio(file, _position)
    },
    handleXMLDataChange ({ xmlData }) {
      // 生成流程图之后导入到drawio
      this.mxCells.content.forEach(el => {
        this.delMxCell(el)
      })
      let file = {
        format: 'xml',
        data: xmlData
      }
      let _position = drawioUtils.getImportXmlPosition(positionType.IMPORT_FLOW_CHART)
      this.importFileDataToDrawio(file, _position)
    },
    importDone (params) {
      // 导入数据drawio加载完成，发出的消息
      if (this.count === 0) {
        // 过滤掉第一次, 暂时如此处理
        this.count++
        return false
      }
      setTimeout(() => {
        this.initDrawioTabsWarn(params)
        // 表示生成的 loading
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'generate-flow-chart' })
      }, 100)
    },
    handleCurrentPageMxCells (params) {
      this.mxCells = params.mxCells
    },
    delMxCell (e) {
      this.$refs.flowfileEditContainer.delMxCell(e)
    },
    importFileDataToDrawio (file, position) {
      this.$refs.flowfileEditContainer.importFileData(file, position)
    },
    initDrawioTabsWarn ({ tabIds, tabLabels, currentLabel }) {
      this.drawioTabsIdLink = tabIds
      this.drawioTabsLabels = tabLabels
      this.currentLabel = currentLabel
      let res = {}
      let pageRes = {}
      if (!this.hint) {
        this.hint = this.getHint()
      }
      let hint = this.hint
      tabIds.map((e, index) => {
        if (!hint[index]) {
          res[e] = []
          pageRes[e] = ''
        } else {
          res[e] = Array.isArray(hint[index].warn) ? hint[index].warn : []
          pageRes[e] = hint[index].page ? hint[index].page : ''
        }
      })
      this.currentTabId = this.currentTabId ? this.currentTabId : tabIds[0]
  
      this.drawioTabsWarn = res
      this.drawioTabsPage = pageRes
      this.importDoneDisabled = true
    },
    changeDrawioTabsWarn (key, warn) {
      this.drawioTabsWarn[key] = warn
    },
    changeDrawioTabsPage (key, page) {
      this.drawioTabsPage[key] = page
      this.hint = this.getHint()
      setTimeout(() => {
        let _tmp = this.pageNumList.find(item => item.pageId === page)
        // 当新页时也会触发, 新页时并没有 pageNumList
        if (!_tmp) {
          return
        }
        this.$store.commit('SET_LOCAL_INFO', { attr: 'pageNum', value: _tmp.pageNum })
      }, 200)
    },
    changeLoadingByTable (loading) {
      if (!loading) {
        this.isViewDataMounted = true
      }
      this.$store.commit('MUTATE_LOADING_STACK', { flag: loading ? 'start' : 'end' }, 'editable-table')
    },
    changeLoadingByDrawio ({ status, module }) {
      // 切换页面时 loading
      if (this.$refs.flowFileEditTop.isAutoSaving) {
        return
      }
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module })
      this.setTimeoutIdForLoading = setTimeout(() => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module })
      }, 1000)
    },
    async getUserPermission () {
      // 获取用户对当前文件的权限, 如果权限为仅查看, 禁用编辑
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'get-user-permission' })
        this.$store.commit('MUTATE_DISABLED', { disabled: true }) // 初始化 store 中的 disable 状态, 默认 true
        // 当 company_id 为 -1, 则表示接口还在响应中, 暂时选择重新请求的方式
        if (this.companyId === -1) {
          await this.$store.dispatch('GET_COMPANIES_ACTION', this)
        }
        const params = {
          // 暂时使用 folderId 进行权限的获取(默认与文件夹一致)
          file_id: this.$route.params.flowfileId || this.flowfileId,
          company_id: this.companyId,
          check_type: 3
        }
        const res = await this.$api.getUserPermission(params) // res.type: 3 仅查看, -1 无权限
        this.authTYpes = res.data
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'get-user-permission' })
        return res
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'get-user-permission' })
        this.$msgMnger.httpError(err)
      }
    },
    handleEditingEnd () {
      // 编辑完成，关闭ws
      this.$refs.wsTool.close()
    },
    handleWSOpenSuccess (e) {
      // 处理 ws 打开
      this.$store.commit('MUTATE_DISABLED', { disabled: false })
      this.$refs.flowFileEditTop.setIsEditing({ isEditing: true }) // 修改编辑中状态
      this.$refs.flowfileEditContainer.editingStatusChanged({ status: 'edit' }) // 通知 drawIO 编辑状态改为编辑模式
      setTimeout(() => {
        this.isInitLoadXmlData = false // 表示加载完成且进入了编辑状态
      }, 2000)
    },
    handleWSCloseSuccess () {
      // 处理 ws 关闭
      this.$store.commit('MUTATE_DISABLED', { disabled: true })
      const isEditing = this.$refs.flowFileEditTop.getIsEditing()
      if (isEditing && this.isViewDataMounted) { // 通过isViewDataMounted避免页面数据加载失败时，ws关闭触发保存空数据而覆盖原数据
        this.handleSaveEvent()
      }
      this.$refs.flowFileEditTop.setIsEditing({ isEditing: false })
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' }) // 关闭由点击 `编辑完成` 按钮产生的 loading
      this.$refs.flowfileEditContainer.editingStatusChanged({ status: 'show' }) // 通知 drawIO 编辑状态改为查看视图模式
    },
    handleRefreshLastActiveTimeStamp () {
      // 处理 drawIO 发送回的 activeTime 刷新的消息
      this.$refs.wsTool.mouseDownHandlerForActive()
    },
    checkForNewVersion (lastModified) {
      // 检查是否有新版本，true 有新版本, false 无新版本
      this.lastModified = lastModified // 更新上次修改时间
      return new Date(lastModified).toLocaleString() !== this.lastModified.toLocaleString()
    },
    handleTabRenamedByDrawIO ({ data: { tabName, tabId } }) {
      // 用户通过 drawIO 重命名了 底部 tab
      this.$store.commit('HANDLE_PAGE_NAME_CHANGE', tabName)
      this.$refs.editableTable.pageName = tabName
    },
    handleRenameCurrentPage ({ name }) {
      this.$refs.flowfileEditContainer.renameCurrentPage({ name })
    },
    handleSyncToLeft () {
      // 同步到左侧，由流程图生成表格内容
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'sync-to-left' })
      let file = {
        format: 'xml',
        filename: this.flowfileName,
        data: '',
        currentPage: true
      }
      this.$refs.flowfileEditContainer.exportFileData(file) // save xml
    },
    async flowchartToExcel ({ params }) {
      try {
        if (!params.data) {
          this.$msgMnger.error('导出数据失败')
          return
        }
        const res = await this.$api.xmlToData({ xmlStr: params.data })
        const data = res.data.data // excel 数据
        const pageName = res.data.flow_name // 流程图名字
  
        this.$store.commit('UPDATE_TABLE_DATA', { data }) // 修改表格数据
        this.handleTabRenamedByDrawIO({ data: { tabName: pageName } }) // 修改表格中 name
        this.handleRenameCurrentPage({ name: pageName }) // 修改 drawIO 中 tabName
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'sync-to-left' })
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'sync-to-left' })
        this.$msgMnger.error(err.msg)
      }
    },
    handleUpdateStyle (style) {
      let diamond = [
        style.width || this.styleConfig.graphSize.diamond[0],
        style.height || this.styleConfig.graphSize.diamond[1]
      ]
      this.styleConfig.graphSize.diamond = diamond
    }
  }
}
</script>
  
  <style lang="scss" scoped>
  @import "@/styles/index.scss";
  </style>
  
  <style lang="scss">
  #flowfile-edit {
    height: 100%;
    .el-dialog {
      max-width: 1400px;
      // height:600px;
      .el-dialog__body {
        padding: 0 !important;
      }
    }
    .el-checkbox {
      border: none;
      position: relative;
    }
    #cutomDialog {
      &::-webkit-scrollbar {
        display: none;
      }
      .el-dialog {
        margin-top: 0 !important;
      }
    }
  }
  </style>
