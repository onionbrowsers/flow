<template>
  <div
    id="b-editable-table"
    :style="{ width: tableWidth, height: tableHeight + 'px' }"
    @contextmenu.prevent
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <collapse-btn></collapse-btn>
    <div class="title">
      <div class="update-drawio-btn">
        <el-button
          :disabled="isGenerateFlowDisabled || $store.getters.disabledGetter"
          size="mini"
          @click="generateFlowChart"
          type="primary"
          :loading="updateDrawioBtnLoading"
          :title="isGenerateFlowDisabled ? '数据量过少' : ''"
        >
          <span v-if="updateDrawioBtnLoading">生成中...</span>
          <span v-else>
            <i class="iconfont iconzhinengshengcheng"></i>
            生成流程图
          </span>
        </el-button>
        <!-- <el-button size="mini" @click="handleTestVuex">test vuex value</el-button> -->
      </div>
      <div class="flow-name-container">
        <!-- <el-tooltip :value="!pageName?true:false" :manual="true"  placement="right" effect="light">
          <div slot="content">请输入流程图名称</div> -->
          <el-input
            ref="pageNameInputComp"
            v-model="pageName"
            placeholder="请输入流程图名称"
            size="mini"
            @change="handlePageNameChange"
            :maxlength="20"
            :clearable="true"
            :disabled="$store.getters.disabledGetter"
          ></el-input>
        <!-- </el-tooltip> -->
      </div>
      <div
        @click="handleFlowHeaderButtonClick"
        class="flow-header-button"
        :class="{ 'flow-header-button__disabled': $store.getters.disabledGetter }"
      >
        <svg class="icon flow-type-icon" aria-hidden="true">
          <use :xlink:href="'#' + mapFlowNName[flowType].icon"></use>
        </svg>
        {{ mapFlowNName[flowType].name }}
        <i class="el-icon el-icon-arrow-down"></i>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="1000px"
      custom-class="excel-dialog"
      style="text-align:left"
      @closed="closeDialog"
    >
      <div v-if="!customBool">
        <div class="flow-category">
          <div
            class="item"
            @click="handleFlowTypeRadioClick(key)"
            v-for="(item, key) in mapFlowNName"
            :key="key"
            :class="radio === key ? 'current-item' : ''"
          >
            <img :src="item.imgSrc" alt width="203px" height="225px" />
            <div>{{ item.name }}</div>
          </div>
        </div>
      </div>
      <custom-flow
        v-else
        ref="customFlow"
        @setConfirmBool="setConfirmBool"
        :current-flow-type="radio"
      ></custom-flow>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="back()" v-if="customBool">上一步</el-button>
        <el-button type="primary" @click="confirmFlow()" :disabled="confirmBool">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="tableData"
      border
      :height="tableHeight - 44 + 'px'"
      :header-cell-class-name="cellHeaderClass"
      @row-contextmenu="handleContextMenu"
      :span-method="handleSpan"
      row-key="id"
      stripe
      size="mini"
      :cell-class-name="getCellClassName"
      header-row-class-name="header-row-class"
      ref="excel"
      @row-click="handleRowClick"
    >
<!--      highlight-current-row-->
      <el-table-column
        label="\"
        :fixed="true"
        :width="22"
      >
        <template slot-scope="{ row, $index }">
          <comp-arrows
            :multi-selected-list="multiSelectListGetter"
            :row-id="row.id"
            :row-step-no="row.no"
            :row-index="$index"
            :max-length="tableData.length"
            :break-row-id="pageNumGetter"
          ></comp-arrows>
        </template>
      </el-table-column>
      <el-table-column
        :fixed="col.prop[0] === 'step' || col.prop[0] === 'no'"
        v-for="(col, i) in columns"
        :key="col.id"
        :label="col.label"
        :min-width="col.width + 'px'"
        :width="col.prop[0] === 'no' ? col.width : ''"
      >
        <template slot-scope="{ row, $index }">
          <component
            v-if="row.id !== 'global_remark'"
            :prop="col.prop"
            :currentPageId="currentPageId"
            :folderId="folderId"
            :pageName="pageName"
            :table-data="tableData"
            :row-index="$index"
            :row="row"
            :col-index="i"
            :is="col.component"
            :placeholderData="placeholderData"
            @select-flow-page="handleSelectFlowPage"
          ></component>
          <span v-else-if="row.id === 'global_remark' && i === 0">备注</span>
          <comp-input-remark
            v-else
            prop="global_remark"
            :row="row"
            :placeholder-data="placeholderData"
            :row-index="$index"
          ></comp-input-remark>
        </template>
      </el-table-column>
    </el-table>
    <popup
      :left="popupLeft"
      :top="popupTop"
      :can-do-operate="canDoOperateComputed"
      :can-paste="canPasteComputed"
      v-show="isShowPopup"
      ref="popup"
      @addRow="addRowHandle"
      @deleteRow="deleteRowHandle"
      @cancel="cancelHandle"
      @add-copied-row="addCopiedRowHandle"
      @pasteRow="pasteRowHandle"
      @auto-number-r-click="handleAutoNumberRClick"
    ></popup>
    <flowfile-tab-list-dialog
      ref="flowfileTabListDialog"
      :folderId="folderId"
    ></flowfile-tab-list-dialog>
  </div>
</template>

<script>
import { mapPropPlaceholder, columnsConfig, mapFlowNName, mapPropInitData } from '../init-data/init-config'
import { initTableData } from '../init-data/init-table-data.js'
import { mapGetters } from 'vuex'

import _ from 'lodash'
import $ from 'jquery'
import Bus from '@/utils/event-bus'

// 注册全局表格组件
import Vue from 'vue'
// import CellDemo from '../components/editable-table/cell-demo'
import CellReuseInput from '../components/editable-table/cell-reuse-input'
import CellDropdown from '../components/editable-table/cell-dropdown'
import CellPopover from '../components/editable-table/cell-popover'
import CellRadioInput from '../components/editable-table/cell-radio-input'
import CellRadio from '../components/editable-table/cell-radio'

// 注册组件内组件
import CustomFlow from '../components/editable-table/custom-flow'
import CompInput from '../components/editable-table/comp-input'
import CompInputRemark from '../components/editable-table/comp-input-remark'
import Popup from '../components/editable-table/popup'
import CollapseBtn from '../components/editable-table/collapse-btn'
import CompArrows from '../components/editable-table/comp-arrows'
import FlowfileTabListDialog from '../components/editable-table/flowfile-tab-list-dialog'

// Vue.component('cell-demo', CellDemo)
Vue.component('cell-reuse-input', CellReuseInput)
Vue.component('cell-dropdown', CellDropdown)
Vue.component('cell-popover', CellPopover)
Vue.component('cell-radio-input', CellRadioInput)
Vue.component('cell-radio', CellRadio)

export default {
  components: {
    CustomFlow,
    Popup,
    CompInput,
    CompInputRemark,
    CollapseBtn,
    CompArrows,
    FlowfileTabListDialog
  },
  props: {
    folderId: {
      type: [String, Number],
      default: 0
    },
    flowId: {
      type: [String, Number],
      default: 0
    },
    isShow: {
      type: Boolean,
      default: false
    },
    currentPageId: {
      type: [String, Number],
      default: ''
    },
    currentTabId: {
      type: [String, Number],
      default: ''
    },
    animateBool: {
      type: Boolean
    },
    styleConfig: {
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      initFlow: '', // 初始化流程图
      tableData: [],
      columns: [],
      tableWidth: '0px',
      tableHeight: '0px',
      placeholderData: mapPropPlaceholder,
      dialogVisible: false,
      radio: 'initKPMGCrossFunctionFlow',
      flowType: 'initKPMGCrossFunctionFlow',
      title: '请选择要生成的流程图类别',
      confirmBool: true, // 按钮
      customBool: false, // 自定义
      selectArr: [],
      popupLeft: 0, // popup
      popupTop: 0,
      isShowPopup: false,
      curPosInfo: {}, // current operation position obj
      pageName: '', // flow name
      // timeoutId: -1, // timeout id 用于右键菜单计时关闭, 已废弃
      pageId: '',
      flowConfig: null,
      updateDrawioBtnLoading: false,
      tempTableData: [], // 组件频繁刷新
      radioClickController: 0,
      tabIdPrev: '', // 保存初始化步骤完毕之后的 tab_id, 用于判断是不是导入的数据
      storedDataForPaste: null, // 暂时保存复制的数据, 为粘贴使用
      autoNumber: {
        no: {
          value: true
        },
        risk_point_no: {
          value: false
        },
        control_point_no: {
          value: false
        }
      }, // 自动编号对象, 默认为 no 列自动编号
      failedRows: [],
      isNewPage: false,
      operationStack: [] // 鼠标点击操作栈, 保存鼠标的点击操作, 上限50个; 多行选中行由此计算
      // multiSelectList: [] // 多行选择 id 列表
    }
  },
  computed: {
    ...mapGetters(['tableDataGetter', 'columnPropsGetter', 'dataGetter', 'currentTabIdGetter',
      'dataNoArrGetter', 'newTableWidth', 'pageNameGetter', 'pageNumGetter', 'multiSelectListGetter', 'xmlDataGetter']),
    mapFlowNName () {
      return mapFlowNName
    },
    isGenerateFlowDisabled () {
      let tableDataForCheck = this.tableData.slice(0, this.tableData.length - 1)
      let checkNum = 0 // check 符合要求的行数
      tableDataForCheck.forEach(item => {
        if (item.id === 'global_remark') {
          return false
        } else {
          if (item.no && item.step) {
            checkNum++
          }
        }
      })
      return checkNum < 2
    },
    canDoOperateComputed () {
      return this.multiSelectListGetter.length !== 0
    },
    canPasteComputed () {
      return Object.prototype.toString.call(this.storedDataForPaste) === '[object Array]' &&
        this.storedDataForPaste.length >= 0
    }
  },
  watch: {
    animateBool () {
      $('#b-editable-table').css('transition', 'width 0.8s')
    },
    newTableWidth: {
      handler (f) {
        this.tableWidth = f + 'px'
        $('#b-editable-table').css('transition', 'all 0s')
      },
      deep: true
    },
    // 监听当用户重新选择模板之后, 或者 自定义模板修改配置项之后
    initFlow: {
      handler (newValue) {
        // init Flow 有改变, 表示用户正在进行表格的选择
        if (!newValue) {
          return false
        }
        this.tempTableData = this.tableData
        this.flowConfig = []
        this.initTable({ flag: 'flowConfigChanged' })
        // 微调高度值触发 elementUI中的重排
        this.handleDoForceLayout()
      },
      deep: true
    },
    tableDataGetter: {
      handler (newValue) {
        this.tableData = _.cloneDeep(newValue)
        // 触发表格layout
        // 微调高度值触发 elementUI中的重排
        this.handleDoForceLayout()
      },
      deep: true
    },
    isShow: {
      handler (newValue) {
        this.$nextTick(t => {
          if (!newValue) {
            this.tableWidth = 0
          } else {
            this.resizeTable()
          }
        })
      }
    },
    currentPageId: {
      handler (newValue) {
        // console.log('current page id changed, value is: ', newValue, ', timeStamp: ', +new Date())
        this.pageId = newValue
        if (this.isNewPage) {
          return false
        }
        if (newValue) {
          // reset true columns data and page name
          this.pageName = ''
          this.tempTableData = []
          setTimeout(() => {
            // console.log('++++++++++++++++++++++++ page id changed, trigger init')
            // console.log('page id in set timeout', this.pageId)
            this.getPageAndExcelData()
          })
        }
        // console.log('************************* page id changed', newValue)
      }
    },
    currentTabId: {
      handler (newValue, oldValue) {
        // console.log('current tab id changed, value is: ', newValue, ', timeStamp: ', +new Date())
        // update currentTableId to vuex
        this.$store.commit('HANDLE_CURRENT_TAB_ID_CHANGE', newValue)
        if (!this.currentPageId) {
          // 如果 page id 为空
          this.pageName = ''
          this.tempTableData = []
          if (this.initFlow) {
            this.initFlow = ''
          }
          setTimeout(() => {
            // console.log('++++++++++++++++++++++++ tab id changed, trigger init')
            this.getPageAndExcelData()
          })
        }
      // console.log('--------------------- tab id changed: ', newValue)
      }
    },
    operationStack: {
      /**
       * operation stack 操作栈的监听处理函数;
       * 根据操作的改变, 改变多选列表;
       */
      handler (stack) {
        let length = stack.length
        let lastOperation = stack[length - 1]
        let tmpMultiSelectList = _.cloneDeep(this.multiSelectListGetter)
        if (length === 0) {
          return
        }
        let tmpId = lastOperation.row.id
        if (lastOperation.type === '') {
          tmpMultiSelectList = []
          tmpMultiSelectList.push(tmpId)
        }
        if (lastOperation.type === 'c') {
          let tmpIndex = tmpMultiSelectList.findIndex(item => item === tmpId)
          if (tmpIndex === -1) {
            tmpMultiSelectList.push(tmpId)
          } else {
            tmpMultiSelectList.splice(tmpIndex, 1)
          }
        }
        if (lastOperation.type === 's') {
          if (typeof stack[length - 2] === 'undefined') {
            tmpMultiSelectList = []
            tmpMultiSelectList.push(tmpId)
          } else {
            tmpMultiSelectList = []
            let prevIndex = this.tableDataGetter.findIndex(item => item.id === stack[length - 2].row.id)
            let curIndex = this.tableData.findIndex(item => item.id === lastOperation.row.id)
            let max = Math.max(prevIndex, curIndex)
            let min = Math.min(prevIndex, curIndex)
            for (let i = min; i <= max; i++) {
              tmpMultiSelectList.push(this.tableDataGetter[i].id)
            }
          }
        }
        this.$store.commit('SET_LOCAL_INFO', { attr: 'multiSelectList', value: tmpMultiSelectList })
        this.$nextTick(() => {
        })
        this.$refs.excel.doLayout()
      },
      deep: true
    }
  },
  created () {
    this.pageId = this.currentPageId
    this.$store.commit('RESET_VUEX_DATA')
    this.$store.commit('HANDLE_CURRENT_TAB_ID_CHANGE', this.currentTabId)
  },
  mounted () {
    this.$nextTick(t => {
      this.tableHeight = window.innerHeight - 55
    })
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 55
    })
    Bus.$on('do-force-layout', this.handleDoForceLayout)
  },
  beforeDestroy () {
    Bus.$off('do-force-layout')
  },
  methods: {
    // 自定义流程数组
    setConfirmData (val) {
      this.selectArr = val
    },
    // 自定义复选框选中状态
    setConfirmBool (val) {
      this.confirmBool = Boolean(val)
    },
    // 确定
    confirmFlow () {
      if (
        this.radio === 'initBasicFlow' ||
        this.radio === 'initGeneralCrossFunctionFlow'
      ) {
        this.initFlow = this.radio
      }
      if (
        this.radio !== 'initBasicFlow' &&
        this.radio !== 'initGeneralCrossFunctionFlow'
      ) {
        this.initFlow = this.$refs.customFlow.selectedDataFilter()
      }
      this.flowType = this.radio

      this.dialogVisible = false
      this.confirmBool = true
    },
    back () {
      // 上一步
      this.confirmBool = true
      this.customBool = !this.customBool
    },
    // 关闭弹窗的时候
    closeDialog () {
      this.radio = this.flowType
      $('.m-box').eq(1).css('display', 'none').eq(0).css('display', 'none')
      this.confirmBool = true
      if (this.customBool) {
        this.customBool = false
      }
    },
    // handleFlowTypeRadioClick
    // 使用点击事件, change事件无法捕捉到选中同一个
    handleFlowTypeRadioClick (flowType) {
      this.radio = flowType
      // console.log('this.radio is: ', this.radio)
      setTimeout(() => {
        if (this.radio !== 1) {
          this.confirmBool = false
        }
        if (this.radio === 'initCustomFlow' || this.radio === 'initKPMGCrossFunctionFlow') {
          this.title = '请选择要生成的流程图类别-自定义'
          this.customBool = !this.customBool
          this.confirmBool = true
        }
      })
    },
    resizeTable () {
      let maxWidth = window.innerWidth
      if (maxWidth > 1440) {
        this.tableWidth = 802 + 'px'
      } else if (maxWidth > 1280 && maxWidth <= 1440) {
        // 修改宽度
        this.tableWidth = maxWidth / 2 + 'px'
      } else if (maxWidth <= 1280) {
        this.tableWidth = 502 + 'px'
      }
    },
    // get page and excel data
    async getPageAndExcelData () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'init-table' })
      // 清空操作栈
      this.operateOperationStack('clear')
      if (this.tableDataGetter && this.tableDataGetter.length !== 0 && this.tabIdPrev !== this.currentTabId) {
        // console.log('从 vuex 中获取数据')
        // table data getter 非空数组, 表示 vuex 中有数据, 使用之
        // tableData, pageName, flowConfig, radio, flowType
        this.tempTableData = _.cloneDeep(this.tableDataGetter)
        this.pageName = this.pageNameGetter
        this.flowConfig = this.columnPropsGetter.props
        this.radio = this.columnPropsGetter.flag ? this.columnPropsGetter.flag : this.radio
        this.flowType = this.columnPropsGetter.flag ? this.columnPropsGetter.flag : this.flowType
        this.autoNumber = this.columnPropsGetter.autoNumber ? _.cloneDeep(this.columnPropsGetter.autoNumber) : {
          no: {
            value: true
          },
          risk_point_no: {
            value: false
          },
          control_point_no: {
            value: false
          }
        }
        this.initTable({ flag: 'normal' })
      } else if (this.pageId) {
        // console.log('向服务器请求数据')
        // vuex 中没有时, 表示为 已存在标签但是没加载过 或者 新数据
        try {
          let { data, page } = await this.$api.getPageNExcelData(Number(this.$route.params.flowfileId), this.pageId)
          let _temp = data.pop()
          let filteredData1 = data.filter(item => { // 备注
            let temp = Number(item.no)
            return isNaN(temp) || item.no === ''
          })
          let filteredData2 = data.filter(item => { // 不包含备注的所有步骤
            let temp = Number(item.no)
            return !isNaN(temp) && item.no !== ''
          })
          filteredData2.sort((a, b) => Number(a.no) > Number(b.no) ? 1 : -1)
          // console.log('previous data: ', data)
          data = filteredData2.concat(filteredData1)
          data.push(_temp)
          data.forEach(item => {
            if (item.hasOwnProperty('no')) {
              item.no = item.no + ''
            }
          })
          this.tempTableData = data
          this.pageName = page.name
          this.handlePageNameChange()
          // this.$store.commit('HANDLE_PAGE_NAME_CHANGE', this.pageName)
          this.radio = page.title_type ? page.title_type : this.radio
          this.flowType = page.title_type ? page.title_type : this.flowType
          if (!page.hasOwnProperty('title') || page.title === null) {
            this.flowConfig = []
            this.autoNumber = {
              no: {
                value: true
              },
              risk_point_no: {
                value: false
              },
              control_point_no: {
                value: false
              }
            }
            this.$store.commit('UPDATE_DEPARTMENT_LIST', { departmentList: [] })
          } else {
            this.flowConfig = page.title.title ? page.title.title : []
            this.autoNumber = page.title.auto_number ? page.title.auto_number : {
              no: {
                value: true
              },
              risk_point_no: {
                value: false
              },
              control_point_no: {
                value: false
              }
            }
            setTimeout(() => {
              this.$store.commit('UPDATE_DEPARTMENT_LIST', { departmentList: page.title.department_list || [] })
            }, 500)
          }
          this.initTable({ flag: 'normal' })
        } catch (err) {
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'init-table' })
          if (err.msg === 'no data') {
            this.$msgMnger.error('无数据')
          } else {
            this.$msgMnger.error('未知错误')
          }
          console.error(err)
          this.$emit('changeLoading', false)
        }
      } else {
        // console.log('initTable 中初始化数据')
        this.radio = 'initKPMGCrossFunctionFlow'
        this.flowType = 'initKPMGCrossFunctionFlow'
        this.autoNumber = {
          no: {
            value: true // 初始化数据进行自动编号
          },
          risk_point_no: {
            value: false
          },
          control_point_no: {
            value: false
          }
        }
        this.initTable({ flag: 'normal' })
      }
    },
    // init tableData & columns
    async initTable ({ flag }) {
      // console.log('start init table')
      this.$store.commit('TOGGLE_IS_NEW_EXCEL', true)
      // 1. 调取 初始化 tableData 数据
      let _tableData = []
      if (this.tempTableData.length) {
        // 后台传回了数据
        // 后台传回数据为复显表格
        this.$store.commit('TOGGLE_IS_NEW_EXCEL', false)
        _tableData = this.tempTableData
        // 若有空缺值, 用默认值填充, no 字段单独处理
        _tableData.forEach(item => {
          if (item.id === 'global_remark') {
            return false
          } else {
            for (let key in mapPropInitData) {
              if (!item.hasOwnProperty(key)) {
                if (key === 'no') {
                  let max = _.maxBy(_tableData, item => Number(item.no))
                  this.$set(item, 'no', Number(max.no) + 1)
                } else {
                  this.$set(item, key, mapPropInitData[key].initValue)
                }
              }
            }
          }
        })
      } else {
        // 根据本地数据初始化
        _tableData = _.cloneDeep(initTableData)
        if (_tableData[_tableData.length - 1].id !== 'global_remark') {
          // 添加最后备注行
          _tableData.push({
            id: 'global_remark',
            global_remark: '1.本流程图编制依据：《》。<div>2.本流程图节点（）中：</div><div>3.</div>'
          })
        }
        // 自动编号
        // this.autoNumberFunc(_tableData)
      }
      // 3. 初始化表格列
      let _flowConfig = []
      let _autoNumber = null
      let _typeOfFlow = Object.prototype.toString.call(this.initFlow)
      if (this.flowConfig && this.flowConfig.length !== 0) {
        // 如果从后台返回了 flowConfig 配置项 (后台字段中的 title, 用此初始化)
        _flowConfig = this.flowConfig
      } else if (_typeOfFlow === '[object Array]') {
        _flowConfig = this.initFlow[1]
        _autoNumber = this.initFlow[0] || {
          no: {
            value: true
          },
          risk_point_no: {
            value: false
          },
          control_point_no: {
            value: false
          }
        }
      } else {
        // 为字符串时, import 配置好的项,
        let res = await import('../init-data/init-config.js')
        _flowConfig = res[this.initFlow ? this.initFlow : 'initDefaultFlow']
      }
      this.autoNumber = _autoNumber ? _.cloneDeep(_autoNumber) : this.autoNumber
      // 存入vuex中
      this.$store.commit('HANDLE_SET_COLUMN_PROPS', { columnProps: { flag: this.flowType, props: _flowConfig, autoNumber: _.cloneDeep(this.autoNumber) } })
      // 根据配置, 生成初始化 tableData 和 columns
      // 1. 过滤出 根据配置文件所需要的列, 作为 columns
      let _columns = []
      _flowConfig.forEach(levelOneItem => {
        let _temp = columnsConfig.find(levelTwoItem => {
          return levelTwoItem.prop.indexOf(levelOneItem) !== -1
        })
        if (_columns.findIndex(item => _.isEqual(_temp, item)) === -1) {
          _columns.push(_temp)
        }
      })
      this.columns = []
      this.$nextTick(() => {
        this.columns = _columns
      })
      // 滚动到顶部
      let tableWrapper = document.getElementsByClassName('el-table__body-wrapper')[0]
      // let tableWrapperScrollTop = tableWrapper.scrollTop
      tableWrapper.scrollBy({
        top: 1,
        left: 0,
        behavior: 'smooth'
      })
      // 根据 _flowConfig 过滤
      // 2. 存到 vuex 中
      // 切换 流程图类型 时, 对 _flowConfig 中不存在的属性置为初始值
      if (flag === 'flowConfigChanged') {
        _tableData.forEach(item => {
          for (let key in mapPropInitData) {
            if (_flowConfig.some(prop => prop === key) && !item.hasOwnProperty(key)) {
              if (key === 'no') {
                let max = _.maxBy(_tableData, item => Number(item.no))
                this.$set(item, 'no', max)
              } else {
                this.$set(item, key, mapPropInitData[key].initValue)
              }
            }
          }
        })
      }
      this.tempTableData = _tableData
      this.initStore()
      this.tabIdPrev = this.currentTabId
      // console.log('===================== init table has done')
      this.changeLoading(false)
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'init-table' })
    },
    // init tableData in store
    initStore () {
      let tableData = _.cloneDeep(this.tempTableData)
      this.$store.commit('INIT_TABLE_DATA', { tableData })
    },
    getIndex (row, column) {
      let colIndex = this.columns.findIndex(item => column && item.label === column.label)
      let rowIndex = this.tableData.findIndex(item => item.id === row.id)
      return { colIndex, rowIndex }
    },
    cellHeaderClass ({ row, column, rowIndex, columnIndex }) {
      return columnIndex <= 4 ? 'table-header-class-primary' : 'table-header-class'
    },
    /**
     * 计算单元格样式
     * @params Object row 行
     * return {String} class name
     */
    getCellClassName ({ row }) {
      let tmpIndex = this.multiSelectListGetter.findIndex(item => row.id === item)
      if (tmpIndex === -1) {
        return ''
      } else {
        return 'selected-row-class'
      }
    },
    // row on click mouse R button
    handleContextMenu (row, column, event) {
      event.preventDefault() // prevent default
      let indexObj = this.getIndex(row, column)
      if (indexObj.rowIndex === this.tableData.length - 1) {
        return false
      }
      this.$set(indexObj, 'row', row)
      this.$set(indexObj, 'column', column)
      this.curPosInfo = indexObj // 组成位置信息对象
      this.isShowPopup = true // show popup
      this.popupLeft = event.clientX
      this.popupTop = window.innerHeight - event.clientY < 188 ? event.clientY - 188 : event.clientY
      // 优化体验, 等待3秒钟无操作, 隐藏掉 popup
      // if (this.timeoutId) {
      //   clearTimeout(this.timeoutId)
      // }
      // this.timeoutId = setTimeout(() => {
      //   this.isShowPopup = false
      // }, 3000)
      document.addEventListener('click', this.handleDocumentMouseDown)
      // 2. 更新鼠标操作栈
      let mouseOperationInfo = _.cloneDeep(indexObj)
      mouseOperationInfo.type = ''
      this.operateOperationStack('push', mouseOperationInfo)
    },
    addRowHandle (flag) {
      this.isShowPopup = false
      // judgement: before -> addRowBefore, after -> addRowAfter
      if (flag === 'before') {
        // add row before
        if (this.curPosInfo.rowIndex === 0 && this.tableData[0].no === '0') {
          if (this.tableData[0].id !== -999) {
            this.$msgMnger.error('不允许在开始行或跨页引用行之前插入数据!')
            return false
          }
        }
      } else {
        // add row after
        if (this.curPosInfo.rowIndex >= this.tableData.length - 1) {
          this.$msgMnger.error('不允许在此行后插入数据!')
          return false
        }
      }
      let tempData = {
        id: +new Date(),
        no: '',
        department: '',
        position: '',
        step: '',
        step_type: '',
        is_true: '',
        risk_point: false,
        risk_point_no: '',
        control_point: false,
        control_point_no: '',
        dashed: false,
        next_step: [],
        document: ''
      }
      console.log(tempData, 77777)
      this.$store.commit('HANDLE_ADD_ROW', { rowIndex: this.curPosInfo.rowIndex, rowData: tempData, flag: flag })
      this.$msgMnger.info('添加成功')
    },
    deleteRowHandle () {
      // only the end row is not allowed to del
      this.isShowPopup = false
      // if (this.curPosInfo.rowIndex === this.tableData.length - 1) {
      //   this.$msgMnger.error('不允许删除此行!')
      //   return false
      // }
      if (this.tableData.length === this.multiSelectListGetter.length + 1) {
        this.$msgMnger.error('删除后表格将清空!')
        return false
      }
      this.$store.commit('HANDLE_DEL_ROW')
      this.$msgMnger.info('删除成功')
    },
    addCopiedRowHandle () {
      this.isShowPopup = false
      // if (this.curPosInfo.rowIndex === 0 && this.tableData[0].no === '0') {
      //   this.$msgMnger.error('不允许复制开始行或跨页引用行!')
      //   return false
      // }
      // this.storedDataForPaste = _.cloneDeep(this.tableData[this.curPosInfo.rowIndex])
      // 1. 根据 multiSelectListGetter 生成复制行;
      // 复制时不进行重置id
      this.storedDataForPaste = _.cloneDeep(this.tableData.filter(dataItem =>
        this.multiSelectListGetter.findIndex(selectedItem =>
          dataItem.id === selectedItem) !== -1))
      this.$msgMnger.success('复制行成功')
    },
    pasteRowHandle (behavior = 'contextmenu') {
      this.isShowPopup = false
      // this.storedDataForPaste.id = +new Date()
      if (this.curPosInfo.rowIndex >= this.tableData.length - 1) {
        this.$msgMnger.error('不允许在此行后添加!')
        return false
      }
      // 2. 为了防止重复, 下一步骤中的id要跟最新赋给的id对应, 因此先遍历找到引用了id的路径,
      // 2. 然后在步骤3中将id同步得修正过去
      let nextStepPathList = {} // 保存id引用路径, 以id作键
      let nextStepPathListByNewId = {} // 保存 id 引用路径, 以 newId 作键
      this.storedDataForPaste.forEach((item1, index1, arr1) => {
        let id = item1.id
        arr1.forEach((item2, index2) => {
          item2.next_step.findIndex((item3, index3) => {
            if (item3.id === id) {
              if (!nextStepPathList.hasOwnProperty(id)) {
                nextStepPathList[id] = []
              }
              nextStepPathList[id].push([index2, index3])
            }
          })
        })
      })
      // 3. 为了保证粘贴列时的兼容性, 创建新的数组, 数组中数据有绝对多的属性, 以便于粘贴
      let newData = this.storedDataForPaste.map((item, index) => {
        let id = item.id
        let newId = +new Date() + '_' + index
        // 3.1. newId 更新到下一步骤路径列表
        if (nextStepPathList.hasOwnProperty(id)) {
          nextStepPathListByNewId[newId] = nextStepPathList[id]
        }
        // 3.2. 创建临时对象
        let tmp = {
          id: newId,
          no: '',
          department: '',
          position: '',
          step: '',
          step_type: '',
          is_true: '',
          risk_point: false,
          risk_point_no: '',
          control_point: false,
          control_point_no: '',
          dashed: false,
          next_step: [],
          document: ''
        }
        // 3.3. 取值填充到临时对象
        for (let key in tmp) {
          if (!tmp.hasOwnProperty(key) || key === 'id') {
            continue
          }
          if (item.hasOwnProperty(key)) {
            tmp[key] = item[key]
          }
        }
        return tmp
      })
      // 4. 修正 next_step 的id
      // debugger
      newData.forEach((item, index, arr) => {
        if (!nextStepPathListByNewId.hasOwnProperty(item.id)) {
          return
        }
        nextStepPathListByNewId[item.id].forEach(path => {
          let thatStep = arr[path[0]].next_step[path[1]]
          thatStep.id = item.id
          thatStep.no = item.no
        })
      })
      // 5. 净化 next_step
      newData.forEach((item, index, arr) => {
        item.next_step = item.next_step.filter(nextStepItem =>
          arr.findIndex(arrItem => arrItem.id === nextStepItem.id) !== -1)
      })
      this.storedDataForPaste = newData
      // this.$store.commit('HANDLE_ADD_ROW', { rowIndex: this.curPosInfo.rowIndex, rowData: _.cloneDeep(this.storedDataForPaste) })
      // 6. 进行粘贴操作
      let tmpIndex
      if (behavior === 'contextmenu') {
        tmpIndex = this.curPosInfo.rowIndex
      } else if (behavior === 'keydown') {
        let indexArr = this.multiSelectListGetter.map(item => this.tableData.findIndex(dataItem => dataItem.id === item))
        let maxIndex = -1
        for (let i = 0; i < indexArr.length; i++) {
          if (indexArr[i] >= maxIndex) {
            maxIndex = indexArr[i]
          }
        }
        if (maxIndex !== -1 && maxIndex <= this.tableData.length - 2) {
          tmpIndex = maxIndex
        } else {
          tmpIndex = this.tableData.length - 2
        }
      }
      this.$store.commit('HANDLE_PASTE_ROWS', { rowIndex: tmpIndex, rowData: this.storedDataForPaste })
      this.$msgMnger.info('粘贴成功')
    },
    cancelHandle () {
      this.isShowPopup = false
    },
    handleAutoNumberRClick () {
      let rowIndex = this.curPosInfo.rowIndex
      let startNumber = this.tableData[rowIndex].hasOwnProperty('no') ? this.tableData[rowIndex].no : ''
      let numPattern = /(([0-9]+)\.?)+/g
      let res = numPattern.exec(startNumber)
      if (res) {
        startNumber = Number(res[2])
        // revoke auto number mutation function in store
        this.$store.commit('AUTO_NUMBER_FOR_R_CLICK', { rowIndex, startNumber })
        this.$msgMnger.success('编号成功')
      } else {
        this.$msgMnger.error('请检查当前行编号格式')
      }
      this.isShowPopup = false
    },
    // 合并单元格
    handleSpan (cellInfo) {
      if (cellInfo.row.id === 'global_remark' && cellInfo.columnIndex === 1) {
        return [1, 3]
      } else if (cellInfo.row.id === 'global_remark' && cellInfo.columnIndex === 3) {
        return [1, this.columns.length - 1]
      } else if (cellInfo.row.id !== 'global_remark') {
        return [1, 1]
      } else {
        return [0, 0]
      }
    },
    handlePageNameChange () {
      this.$store.commit('HANDLE_PAGE_NAME_CHANGE', this.pageName)
      if (this.pageName) {
        this.$emit('rename-current-page', { name: this.pageName })
      }
    },
    changeLoading (loading = false) {
      this.updateDrawioBtnLoading = loading
      this.$emit('changeLoading', loading)
    },
    async handleSaveTemp (tabId, pageId, titles, pageName, flowType, autoNumber, departmentList, flag = 'save') {
      // 改为只修改发送得数据
      // await this.$store.commit('CORRECT_NEXT_STEP', tabId)
      // console.log(111, pageName)
      // if(!pageName){
      //   this.$message.error('请输入流程图名称！')
      //   return
      // }
      let data = this.correctNextStep(tabId)
      return new Promise((resolve, reject) => {
        let _titleConfig = { title: titles, auto_number: autoNumber, department_list: departmentList || [], graph_size: this.styleConfig.graphSize }
        this.$api.savePageNExcelData(this.$route.params.flowfileId, {
          flow_id: this.$route.params.flowfileId,
          page_id: pageId,
          name: pageName,
          // data: JSON.stringify(this.dataGetter[tabId].data),
          data: JSON.stringify(data),
          title: JSON.stringify(_titleConfig),
          title_type: flowType,
          save: flag === 'save' ? flag : ''
        }).then(res => {
          let page = res.page
          // 不相等 即为 新的一页, 或者是导入的, 区分新的一页还是导入的?
          // debugger
          if (pageId === '' && String(pageId) !== String(page.id)) {
            // 新的一页, 数据不进行更新
            this.isNewPage = true
            setTimeout(() => {
              this.isNewPage = false
            }, 500)
          }
          if (String(pageId) !== String(page.id)) {
            pageId = Number(page.id)
            this.$emit('change-drawio-tabs-page', tabId, pageId)
          }
          resolve(res)
        }).catch(err => {
          // 出错时如果为空页也保存
          if (!err.page) {
            console.log(err)
            resolve(err)
            return false
          }
          if (pageId !== err.page.id) {
            pageId = err.page.id
            this.$emit('change-drawio-tabs-page', tabId, pageId)
          }
          console.log(err)
          resolve(err)
        })
      })
    },
    storeXMLToVuex (data) {
      if (data.xml) {
        this.$emit('xml-data-change', { xmlData: data.xml })
      } else {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'generate-flow-chart' })
      }
    },
    async generateFlowChart () {
      // this.changeLoading(true)
      if (!this.pageName) {
        this.$message.error('请输入流程图名称!')
        return
      }
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'generate-flow-chart' })
      this.handleSaveTemp(this.currentTabId, this.pageId, this.columnPropsGetter.props, this.pageName, this.flowType, this.columnPropsGetter.autoNumber, this.columnPropsGetter.departmentList, 'generate')
        .then(res => {
          // this.changeLoading(false)
          if (res.code === 0) {
            this.storeXMLToVuex(res.data)
            // NOTE: 改变pageNum的值
            let pageNum = res.data.hasOwnProperty('page_num') ? res.data.page_num : -1
            if (Object.prototype.toString.call(pageNum) === '[object Null]') {
              pageNum = -1
            }
            console.log('pageNum is: ', pageNum)
            this.$store.commit('SET_LOCAL_INFO', { attr: 'pageNum', value: pageNum })
          } else {
            // 错误
            console.log(res)
            this.$msgMnger.httpError(res)
            this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'generate-flow-chart' })
          }
        }).catch(err => {
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'generate-flow-chart' })
          console.log(err)
        })
    },
    handleTestVuex () {
      console.log('vuex value is: ', this.dataGetter)
      // console.log('vuex tableDataGetter is: ', this.tableDataGetter)
      // console.log('vuex currentTabIdGetter is: ', this.currentTabIdGetter)
      // console.log('vuex columnPropsGetter is: ', this.columnPropsGetter)
    },
    handleDoForceLayout () {
      this.tableHeight++
      setTimeout(() => {
        this.tableHeight--
      })
    },
    /**
     * 操作: 鼠标点击操作栈 的函数
     * @param flag push: 入栈, clear: 清空
     * @param data 入栈的数据
     */
    operateOperationStack (flag, data = null) {
      if (flag === 'push') {
        // 入栈
        this.operationStack.push(data)
        if (this.operationStack.length > 5) {
          this.operationStack.shift()
        }
      } else if (flag === 'clear') {
        // 清空栈
        this.operationStack = []
      }
    },
    /**
     * 获取鼠标点击类型的 type 字符串
     * @param e event
     * @return {String}
     */
    getMouseClickType (e) {
      if (e.ctrlKey && e.shiftKey) {
        return 'cs'
      } else if (e.ctrlKey && !e.shiftKey) {
        return 'c'
      } else if (!e.ctrlKey && e.shiftKey) {
        return 's'
      } else {
        return ''
      }
    },
    /**
     * 点击行的处理函数, 对行为进行区分
     * 1. 普通 click
     * 2. ctrl + click
     * 3. shift + click
     * @param row
     * @param column
     * @param e
     * @returns {boolean}
     */
    handleRowClick (row, column, e) {
      // 1. 计算最新的位置信息
      let indexObj = this.getIndex(row, column)
      if (indexObj.rowIndex === this.tableData.length - 1) {
        return false
      }
      this.$set(indexObj, 'row', row)
      this.$set(indexObj, 'column', column)
      if (!_.isEqual(indexObj, this.curPosInfo)) {
        this.isShowPopup = false
      }
      // 2. 更新鼠标操作栈
      let mouseOperationInfo = _.cloneDeep(indexObj)
      mouseOperationInfo.type = this.getMouseClickType(e)
      this.operateOperationStack('push', mouseOperationInfo)

      // 3. 更新 curPosInfo
      this.curPosInfo = indexObj // 组成位置信息对象
    },
    handleTableKeydown (e) {
      // console.log(e)
      if (e.target.nodeName !== 'BODY') {
        return false
      }
      if (e.keyCode === 67 && e.ctrlKey && !e.altKey && !e.shiftKey) {
        // ctrl + c
        if (this.canDoOperateComputed) {
          this.addCopiedRowHandle()
        }
      } else if (e.keyCode === 86 && e.ctrlKey && !e.altKey && !e.shiftKey) {
        // ctrl + v
        if (this.canDoOperateComputed && this.canPasteComputed) {
          this.pasteRowHandle('keydown')
        }
      } else if (e.keyCode === 46 && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault()
        if (this.canDoOperateComputed) {
          this.deleteRowHandle()
        }
      } else if (e.keyCode === 87 && !e.ctrlKey && e.altKey && !e.shiftKey) {
        // alt + w
        e.preventDefault()
        this.addRowHandle('before')
      } else if (e.keyCode === 83 && !e.ctrlKey && e.altKey && !e.shiftKey) {
        // alt + s
        e.preventDefault()
        this.addRowHandle('after')
      } else {}
    },
    handleMouseEnter () {
      // console.log('mouse enter')
      document.addEventListener('keydown', this.handleTableKeydown)
    },
    handleMouseLeave () {
      // console.log('mouse leave')
      document.removeEventListener('keydown', this.handleTableKeydown)
    },
    // 修正 next_step 属性, 发送请求之前进行修正, 发送的数据为修正版, 但本地数据为脏数据
    correctNextStep (tabId) {
      let tempData = _.cloneDeep(this.dataGetter[tabId].data)
      // 过滤掉 next_step 中 tableData 中没有的
      tempData.forEach((outerItem, outerIndex, arr) => {
        if (outerItem.id === 'global_remark' || !outerItem.hasOwnProperty('next_step')) {
          return false
        }
        outerItem.next_step = outerItem.next_step.filter(middleItem => {
          return arr.some(innerItem => innerItem.id === middleItem.id)
        })
      })
      // 修正值
      tempData.forEach((outerItem, outerIndex, arr) => {
        if (outerItem.id === 'global_remark' || !outerItem.hasOwnProperty('next_step')) {
          return false
        }
        outerItem.next_step.forEach(middleItem => {
          arr.forEach(innerItem => {
            if (outerItem.id === 'global_remark' || !outerItem.hasOwnProperty('next_step')) {
              return false
            } else if (innerItem.id === middleItem.id) {
              middleItem.step = innerItem.step
              middleItem.no = innerItem.no
            }
          })
        })
        // 修正之后再进行过滤
        outerItem.next_step = outerItem.next_step.filter(middleItem => {
          return middleItem.no !== '' && middleItem.step !== ''
        })
      })
      // 当自身步骤得 no 和 step 为空时, 判定为残缺步骤, 后台不进行生成, 因此进行修正与过滤
      // 返回修正值
      return tempData
    },
    /**
     * 选择流程图类型按钮的点击事件处理函数
     * 添加禁用拦截
     * @returns {boolean}
     */
    handleFlowHeaderButtonClick () {
      if (this.$store.getters.disabledGetter) {
        return false
      }
      this.dialogVisible = true
    },
    /**
     * 检测 document 的 mousedown 事件, 保证点击的是左键, 且在 popup 区域之外
     * @param e
     */
    handleDocumentMouseDown (e) {
      if (e.button === 0) { // 点击鼠标左键
        this.isShowPopup = false
        document.removeEventListener('click', this.handleDocumentMouseDown)
      }
    },
    /**
     * 触发选择
     */
    handleSelectFlowPage ({ rowIndex, prop }) {
      this.$refs.flowfileTabListDialog.showDialog({ rowIndex, prop })
    }
  }
}
</script>

<style lang="scss" scoped>
.error-row-class {
  td {
    background-color: #ff3040;
  }
}
.default-row-class {
}
#b-editable-table {
  position: absolute;
  top: 56px;
  transition: width 0.5s;
  user-select: none;
  /*overflow: hidden;*/
  .title {
    font-size: 12px;
    height: 44px;
    min-width: 0px;
    font-weight: 500;
    background-color: #f4f4f4;
    line-height: 44px;
    margin: 0;
    cursor: default;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .flow-name-container {
      // margin-left: 35px;
      flex: auto;
      text-align: left;
      .el-input{
        transform: translateY(-1px);
        width: 200px;
        .el-input__inner{
          color: #000;
        }
      }
    }
    .flow-header-button {
      display: inline-block;
      line-height: 44px;
      // height: 26px;
      // width: 176px;
      padding: 0 20px;
      // border-radius: 3px;
      // background-color: #fff;
      // border: 1px solid #EBECF0;
      cursor: pointer;
      // line-height: 26px;
      // text-align: center;
      color: #333;
      .el-icon-arrow-down {
        font-size: 16px;
        font-weight: 600;
        padding-left: 5px;
        transform: translate(0, 2px);
      }
    }
    .flow-header-button__disabled {
      position: relative;
      cursor: not-allowed;
      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(255, 255, 255, .5);
      }
    }
  }
  .update-drawio-btn{
    margin: 0 35px;
    .el-button {
      padding: 0 13px;
      text-align: center;
      border-radius: 5px;
      height: 28px;
      line-height: 26px;
      .iconfont {
        margin-right: 3px;
      }
    }
  }
  .excel-dialog {
    width: 925px;
    height: 558px;
    .flow-category {
      padding-top: 50px;
      display: flex;
      justify-content: space-around;
      .current-item {
        background-color: #efefef;
      }
      .item {
        padding: 10px 15px 20px;
        margin-bottom: 20px;
        text-align: center;
        transition: all .3s;
        img {
          background-color: white;
          margin-bottom: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, .2);
        }
        &:hover {
          background-color: #efefef;
        }
        .m-box {
          width: 180px;
          height: 180px;
          margin: 100px auto;
          background: #1890FF;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 22px;
          display: none;
        }
        .m-duigou {
          width: 100px;
          height: 50px;
          position: absolute;
          left: 50%;
          top: 50%;
          margin: -40px 0 0 -50px;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          overflow: hidden;
        }
        .m-duigou:before,
        .m-duigou:after {
          content: "";
          position: absolute;
          background: #fff;
          border-radius: 2px;
        }
        .m-duigou:before {
          width: 2px;
          height: 50px;
          left: 0;
          -webkit-animation: dgLeft 0.5s linear 3s 1 both;
          animation: dgLeft 0.5s linear 0s 1 both;
        }
        .m-duigou:after {
          width: 100px;
          height: 2px;
          bottom: 0;
          -webkit-animation: dgRight 0.5s linear 3.5s 1 both;
          animation: dgRight 0.5s linear 0.5s 1 both;
        }
      }
    }
    .el-dialog__footer {
      background: red;
    }
  }
  .edit-cell {
    display: inline-block;
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    width: 100%;
    height: 100%;
    min-height: 40px;
    text-align: center;
    vertical-align: middle;
  }
  .show-cell {
  }
}
@-webkit-keyframes dgLeft {
  0% {
    top: -100%;
  }
  100% {
    top: 0%;
  }
}
@-webkit-keyframes dgLeft {
  0% {
    top: -100%;
  }
  100% {
    top: 0%;
  }
}
@-webkit-keyframes dgRight {
  0% {
    left: -100%;
  }
  100% {
    left: 0%;
  }
}
@-webkit-keyframes dgRight {
  0% {
    left: -100%;
  }
  100% {
    left: 0%;
  }
}
</style>

<style lang="scss">
#b-editable-table {
  // TODO: 表头样式 class
  .selected-row-class {
    background-color: rgb(232, 244, 255);
  }
  .table-header-class-primary {
    background-color: #E1EEFF;
    color: #262739;
    font-weight: normal;
    font-size: 12px;
    /*border: 1px solid #cecece;*/
  }
  .table-header-class {
    background-color: #F3F8FF;
    color: #262739;
    font-weight: normal;
    font-size: 12px;
  }
  .header-row-class {
    height: 40px;
  }
  .cell {
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 3px;
    overflow: visible;
  }
  .el-table__header tr,
  .el-table__header th {
    padding: 0 !important;
    height: 40px;
  }
  /*.el-table__body tr,*/
  /*.el-table__body td {*/
  /*  padding: 0 !important;*/
  /*  height: 40px;*/
  /*}*/
  .directive-arrow {
    font-size: 18px;
  }
  .beginRowArrow,
  .endRowArrow {
    color: #E6A23C;
  }
  .currentArrow {
    color: #409EFF;
    transform: scale(1.5);
  }
  .defaultRowArrow {
    color: #67C23A;
  }
  /*单选小圆点色值*/
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #AAB6C2;
    background-color: #AAB6C2;
  }
  .el-radio__inner {
    &:hover {
      border-color: #AAB6C2;
    }
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #606266;
  }
  .title {
    .flow-name-container {
      .el-input{
        .el-input__inner{
          color: #333;
          font-weight: normal;
        }
      }
    }
  }
  .flow-type-icon {
    font-size: 16px;
    transform: translateY(1px);
  }
  .el-table__fixed {
    .el-table__fixed-body-wrapper {
      tbody {
        td {
          overflow: hidden !important;
        }
      }
    }
  }
}
</style>
