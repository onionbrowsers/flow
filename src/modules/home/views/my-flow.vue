<template>
  <div id="my-flow">
<!--    =================== navigator ======================-->
    <!-- <div class="my-flow__nav">
      <span class="nav__folder-item nav__folder-item--hover" @click="handleNavFolderClick({ folderId: 'all', isLast: false })">全部项目</span>
      <i class="nav__nav-icon el-icon el-icon-arrow-right"></i>
      <template v-for="(item, i) in folders">

        <span
          class="nav__folder-item"
          :class="i === folders.length - 1 ? '' : 'nav__folder-item--hover'"
          :key="item.folderId + 'text'"
          @click="handleNavFolderClick({ isLast: folders.length - 1 === i, folderId: item.folderId })"
        >{{ item.folderName }}</span>
      </template>
      <template v-if="params.currentFolder">
        <span style="margin-left: 20px; color: #ff3040; cursor: pointer;" @click="handleCatalog">项目目录</span>
      </template>
    </div> -->
    <div class="flow-condition-wrapper">
      <el-button type="primary" size="small" @click="goFlowCondition">
        流程关系
      </el-button>
    </div>
    <div class="nav-panel">
      <FolderNav ref="folderNav" @item-click="handleItemClick"/>
    </div>
<!--    ======================== search =====================-->
    <div class="my-flow__search">
      <el-select v-if="isZhlicom" class="flodselect" clearable  filterable @change="departChangeId" v-model="secondary_id" placeholder="请选择所属企业">
          <el-option v-for="it in secondaryList" :key="it.id" :label="it.departname" :value="it.id"></el-option>
      </el-select>
      <custom-input-v2
        size="normal"
        style="display:inline-block"
        append-btn-text="搜索"
        placeholder="请输入关键字查找流程"
        width="430"
        @input-confirm="handleInputConfirm"
      ></custom-input-v2>
      <el-select
        class="my-flow__search-selector"
        v-model="params.sortMethod"
        placeholder="请选择排序方式"
        size="small"
        @change="handleSortMethodChange"
      >
        <el-option
          v-for="item in sortMethodsList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
<!--    ======================== list =====================-->
    <div class="my-flow__flowchart-list">
      <div
        style="height: calc(100vh - 153px);"
      >
<!--        排序方式为最近修改时间时:-->
        <template v-if="sortFlag === 'lastModified'">
          <div
            v-for="item in flowchartListConfig"   :key="item.flag + '-divider'"
          >
            <!--      === divider ===-->
            <custom-divider

              :label="item.label"
              @expansion-change="handleExpansionChange($event, item.flag)"
            ></custom-divider>
            <!--      === sublist ===-->
            <div
              :key="item.flag + '-sublist'"
              :ref="item.flag + 'List'"
              class="my-flow__flowchart-list-sublist"
              :class="'my-flow__flowchart-list-' + item.flag"
            >
    <!--            <div v-for="i in item.data" :key="i">{{ i ** 2 }}</div>-->
              <flowchart-item
                :class="{ 'my-flow__flowchart-list-item--current': itemData === currentFlowchartData }"
                v-for="(itemData) in item.data"
                :key="itemData.id"
                :item-data="itemData"
                :need-to-folder="folders.length === 0"
                @contextmenu="handleContextMenu($event, { data: itemData })"
              ></flowchart-item>
    <!--            TODO: 空列表展示-->
            </div>
          </div>
        </template>
<!--        排序方式非 上次修改时间 时, 如 'name'-->
        <template v-if="sortFlag === 'name'">
          <div
            :key="params.sortMethod + '-sublist'"
            :ref="params.sortMethod + 'List'"
            class="my-flow__flowchart-list-sublist"
            :class="'my-flow__flowchart-list-' + params.sortMethod"
          >
            <!--            <div v-for="i in item.data" :key="i">{{ i ** 2 }}</div>-->
            <flowchart-item
              :class="{ 'my-flow__flowchart-list-item--current': itemData === currentFlowchartData }"
              v-for="(itemData) in flowchartList"
              :key="itemData.id"
              :item-data="itemData"
              :need-to-folder="folders.length === 0"
              @contextmenu="handleContextMenu($event, { data: itemData })"
            ></flowchart-item>
            <!--            TODO: 空列表展示-->
          </div>
        </template>
        <div v-if="noMoreData" style="height: 40px; text-align: center; line-height: 40px; font-size: 14px; color: #999;">没有更多数据了~</div>
      </div>
    </div>
<!--    ==================== paginator =====================-->
   <custom-paginator
     class="my-flow__paginator"
     ref="paginator" :tolital="params.total" :nowpage="params.page"
     @pageChange="handlePageChange"
   >
   </custom-paginator>
<!--    ===================== popup ========================-->
    <popup
      v-if="popupConfig.isShowPopup"
      :left="popupConfig.left"
      :top="popupConfig.top"
      @hide-popup="popupConfig.isShowPopup = false"
    >
      <div class="popup__contextmenu" slot="contextmenu">
        <div
          class="popup__contextmenu-item"
          :class="{ 'popup__contextmenu-item--disabled': item.disabled }"
          v-for="(item, index) in contextMenuComputed"
          :key="index"
          @click="item.func"
        >
              <span
                class="popup__contextmenu-item-text"
                :class="{ 'popup__contextmenu-item--special': item.hasOwnProperty('specialColor') }"
              >
                {{ item.label }}
              </span>
        </div>
      </div>
    </popup>
<!--    ===================== dialog ====================-->
    <flowchart-mv-dialog ref="flowchartMvDialog"></flowchart-mv-dialog>
    <flowchart-copy-dialog ref="FlowchartCopyDialog"></flowchart-copy-dialog>
    <flowchart-history-dialog ref="FlowchartHistoryDialog"></flowchart-history-dialog>
  </div>
</template>

<script>
// components
import FolderNav from '@/modules/home/components/folder-nav.vue'
import Popup from '../components/popup'
import CustomPaginator from './pagecom.vue'
// import CustomPaginator from '@/components/public/CustomPaginator'
import CustomInputV2 from '../components/flowchart/custom-input-v2'
import CustomDivider from '../components/flowchart/custom-divider'
import FlowchartItem from '../components/flowchart/flowchart-item'
import FlowchartMvDialog from '../components/flowchart/flowchart-mv-dialog'
import FlowchartCopyDialog from '../components/flowchart/flowchart-copy-dialog'
import FlowchartHistoryDialog from '../components/flowchart/flowchart-history-dialog'

// utils
import $ from 'jquery'
import Bus from '@/utils/event-bus'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'my-flow',
  components: {
    FolderNav,
    Popup,
    CustomPaginator,
    CustomInputV2,
    CustomDivider,
    FlowchartItem,
    FlowchartMvDialog,
    FlowchartCopyDialog,
    FlowchartHistoryDialog
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      folderStack: [],
      secondaryList: [], // 企业列表
      secondary_id: '', // 二级企业id
      isZhlicom: false, // 是否是显示所属企业的
      // 右键弹出框的配置对象
      popupConfig: {
        isShowPopup: false,
        left: 0,
        top: 0
      },
      // 右键菜单
      contextMenu: [
        { disabled: false, value: 'open', label: '打开', func: this.toEditView },
        { disabled: false, value: 'open', label: '打开风险控制矩阵', func: this.opendEditView },
        { disabled: false, value: 'modify', label: '修改文件名', func: this.modifyFlowchartFileName },
        { disabled: false, value: 'move', label: '移动文件', func: this.mvFile },
        { disabled: false, value: 'copy', label: '复制文件', func: this.cpFile },
        { disabled: false, value: 'qyHistory', label: '查询历史版本', func: this.qyHistoryFile },
        // { disabled: false, value: 'mem-mng', label: '成员管理', func: this.cooperateMng },
        { disabled: false, value: 'del', label: '删除', func: this.handleDelete, specialColor: true }
      ],
      // 流程图列表, 配置对象, 分两个今天区和更早区
      flowchartListConfig: [
        { flag: 'today', label: '今天', data: [] },
        { flag: 'earlier', label: '更早', data: [] }
      ],
      // 流程图列表, 当排序方法非 lastModified 时使用
      flowchartList: [],
      // 临时流程图列表, 存于内存中, 用于无限滚动
      tmpList: [],
      reqPageList: [], // 已经请求过得页, 用于防止重复的请求
      currentFlowchartData: null, // 当前 右键菜单正在操作的流程图
      // 顶部导航文件夹
      folders: [],
      // 查询参数
      params: {
        page: 1, // 同时用于禁用无限滚动, 防止无限滚动函数绑定时即执行函数
        pageSize: 15,
        keyword: '',
        currentFolder: null,
        sortMethod: 1, // 排序方式
        total: 0 // 列表中数据总数
      },
      // 在企业空间下, 权限 与 右键菜单的显示关系
      permissionAndContextMenuConfig: [
        { type: 1, value: ['open', 'modify', 'move', 'mem-mng', 'del', 'copy', 'qyHistory'] },
        { type: 2, value: ['open', 'modify', 'move', 'del', 'copy', 'qyHistory'] },
        { type: 3, value: ['open', 'qyHistory'] }
      ],
      // 排序规则列表
      sortMethodsList: [
        { value: 1, flag: 'lastModified', label: '修改时间' },
        { value: 2, flag: 'name', label: '流程图名' }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter']),
    contextMenuComputed () {
      // 先获取到当前路程图的权限配置对象
      const _type = this.currentFlowchartData.type // 当前流程图的权限
      const permissionItem = this.permissionAndContextMenuConfig.find(item => item.type === _type) // 找到配置对象
      return this.contextMenu.map(item => {
        // 如果个人空间, 则只禁用协作成员
        if (this.currentDataSpaceGetter.type === 2) {
          if (item.value === 'mem-mng') {
            item.disabled = true
          }
        } else {
          // 如果企业空间, 根据当前文件的权限判断
          if (permissionItem.value.findIndex(innerItem => item.value === innerItem) === -1) {
            item.disabled = true
          }
        }
        return item
      })
    },
    noMoreData () {
      // 根据排序类型进行判断
      let _totalList = 0
      if (this.sortFlag === 'lastModified') { // 排序方式为最近修改时间时, 计算 flowchartListConfig 的数据
        _totalList = this.flowchartListConfig.reduce((prev, item) => prev + item.data.length, 0)
      } else { // 排序方式为其他时
        _totalList = this.flowchartList.length
      }
      // 1.1 计算 当前的数据 与 接口返回的 total 的值
      const _totalServer = this.params.total // 接口返回的 total 值
      // if (_totalServer !== 0 && _totalServer === _totalList) { // 不为 0 且 两个 total 相等, 表示没有下一页
      //   console.warn('no another page')
      //   return true
      // }
      return _totalServer !== 0 && _totalServer === _totalList
    },
    infiniteScrollDisabled () {
      return this.params.page < 3
    },
    // 排序 flag, 用此判断使用的视图
    sortFlag () {
      return this.sortMethodsList.find(item => item.value === this.params.sortMethod).flag
    }
  },
  watch: {
    currentDataSpaceIdGetter (newValue) {
      // this.getFile(newValue)
      this.isZhlicom = this.currentDataSpaceIdGetter == 131
      if (this.isZhlicom) {
        this.getsecondaryS()
      }
      this.getFileInit()
    },
    $route: {
      handler ($route) {
        // 1. 查询参数中获取 文件夹名称, 更新到 params
        const folderId = $route.query.folderId || -1
        const folderName = $route.query.folderName || ''
        if (folderId !== -1 && folderName !== '') {
          this.params.currentFolder = {
            folderId,
            folderName
          }
          this.folders = [
            { folderId, folderName }
          ]
        } else {
          this.params.currentFolder = null
          this.folders = []
        }
        // 2. 请求 数据
        // 如果当前 数据空间 id 已经获取到了
        if (this.currentDataSpaceIdGetter !== -1) {
          // this.getFile(this.currentDataSpaceIdGetter)
          this.getFileInit()
        }
      },
      deep: true
    }
  },
  mounted () {
    try {
      const list = JSON.parse(this.$route.query.navList)
      this.$refs.folderNav.setDefault(list)
    } catch (e) {
      this.$refs.folderNav.setDefault([])
    }
    // 1. 查询参数中获取 文件夹名称, 更新到 params
    const folderId = this.$route.query.folderId || -1
    const folderName = this.$route.query.folderName || ''
    if (folderId !== -1 && folderName !== '') {
      this.params.currentFolder = {
        folderId,
        folderName
      }
      this.folders = [
        { folderId, folderName }
      ]
    }
    this.isZhlicom = this.currentDataSpaceIdGetter == 131
    if (this.isZhlicom) {
      this.getsecondaryS()
    }
    // 2. 请求 数据
    // 如果当前 数据空间 id 已经获取到了
    if (this.currentDataSpaceIdGetter !== -1) {
      // this.getFile(this.currentDataSpaceIdGetter)
      this.getFileInit()
    }
    // 绑定事件监听, 用于刷新列表
    // Bus.$on('refresh-flowchart-list', () => this.getFile(this.currentDataSpaceIdGetter))
    Bus.$on('refresh-flowchart-list', () => this.getFileInit())
  },
  beforeDestroy () {
    Bus.$off('refresh-flowchart-list')
  },
  methods: {
    goFlowCondition () {
      this.$router.push({
        name: 'condition-flow'
      })
    },
    handleItemClick (item, folder) {
      console.log('6666', JSON.parse(JSON.stringify(folder)))
      this.$router.replace({
        name: 'my-folder',
        query: { navList: JSON.stringify(folder) }
      })
    },
    // 获取企业列表
    getsecondaryS () {
      this.$api.getSecondaryLi(this.currentDataSpaceIdGetter).then(res => {
        this.secondaryList = res.data || []
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    // 选择所属企业变化
    departChangeId (val) {
      this.params.page = 1
      this.getFileInit()
    },
    /**
     * 初始化请求流程图列表, 共请求两次
     */
    getFileInit () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      // console.log('here')
      // 1. init
      // this.params.page = 1
      this.flowchartListConfig.forEach(item => { item.data = [] })
      this.flowchartList = []
      this.reqPageList = []
      // 2. get data
      this.getFile()
      // await this.getFile()
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
    },
    /**
     * 请求流程图列表数据
     * @param id 数据空间id
     */
    getFile (id) {
      return new Promise((resolve, reject) => {
        // console.log('get file')
        // 1. 首先判断有无下一页
        // if (this.noMoreData) {
        //   resolve()
        //   return
        // }
        // // 2. 判断当前页是否已经请求过
        // if (this.reqPageList.findIndex(item => item === this.params.page) !== -1) {
        //   resolve()
        //   return
        // }
        // 过滤掉无意义参数
        const _params = {}
        if (this.params.keyword) {
          _params.keywords = this.params.keyword
        }
        if (this.params.currentFolder && Object.keys(this.params.currentFolder).length !== 0) {
          _params.folder_id = this.params.currentFolder.folderId
        }
        _params.company_id = this.currentDataSpaceIdGetter + ''
        _params.secondary_id = this.secondary_id || ''
        // 添加 分页 参数
        _params.page = this.params.page
        // this.reqPageList.push(this.params.page)
        _params.page_size = this.params.pageSize
        _params.sort_type = this.params.sortMethod
        // 请求数据
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        this.$api.getFile(_params).then(res => {
          // 0. page++
          // this.params.page++
          // 1. total
          this.params.total = res.total
          // 2. 数据处理
          if (this.sortFlag == 'name') {
            this.flowchartList = res.data
          } else {
            this.preDataProcess({ data: res.data, sortMethod: this.sortFlag })
          }
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
          resolve()
        }).catch(err => {
          reject(err)
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
          console.log(err)
          this.$msgMnger.httpError(err)
        })
      })
    },
    /**
     * 数据前置处理, 用于判断将数据分发给 真实数据组 还是 临时数据组
     * @param data Array 一次请求的数据
     * @param sortMethod 当前排序方式
     */
    preDataProcess ({ data, sortMethod }) {
      if (data.length === 0) {
        return
      }
      let _total = 0
      if (sortMethod === 'lastModified') { // 排序方式为最近修改时间时, 计算 flowchartListConfig 的数据
        _total = this.flowchartListConfig.reduce((prev, item) => prev + item.data.length, 0)
      } else { // 排序方式为其他时
        _total = this.flowchartList.length
      }
      if (_total === 0) {
        this.dataProcess({ data, sortMethod })
      } else {
        this.tmpList = data
      }
    },
    /**
     * 处理数据函数, 用于将数据内容分配到当前的列表
     * @param data 一次请求的数据
     * @param sortMethod 当前排序方式
     */
    dataProcess ({ data, sortMethod }) {
      if (sortMethod === 'lastModified') { // 当前排序方式: 上次修改时间
        // console.log(res)
        const _data = data
        const _today = []
        const _earlier = []
        const _now = moment(new Date()).format('YYYY-MM-DD') // 当前时间字符串
        _data.forEach(item => {
          const lastModifiedDate = moment(item.last_modified).format('YYYY-MM-DD') // 最近修改时间字符串
          if (_now === lastModifiedDate) {
            _today.push(item)
          } else {
            _earlier.push(item)
          }
        })
        this.flowchartListConfig.forEach(item => {
          if (item.flag === 'today') {
            item.data.push(..._today)
          } else {
            item.data.push(..._earlier)
          }
        })
      } else {
        this.flowchartList = data
      }
    },
    /**
     * 临时数据加入到真实数据组中
     */
    pushData () {
      // console.log('push data')
      // 1. tmp -> truly list
      this.dataProcess({ data: this.tmpList, sortMethod: this.sortFlag })
      // 2. tmp = []
      this.tmpList = []
      // 3. load more data
      this.getFile(this.currentDataSpaceIdGetter)
    },
    /**
     * 点击导航文件夹跳转处理函数
     * @param folderId 文件夹id or 全部文件夹的flag: all
     * @param isLast 是否当前最底层文件夹
     */
    handleNavFolderClick ({ folderId, isLast }) {
      if (isLast) {
        return
      }
      if (folderId === 'all') {
        // 转到全部文件夹视图
        if (this.$route.query.hasOwnProperty('folderId') && this.$route.query.folderId !== -1) {
          this.$router.replace({ name: 'my-folder' })
        } else {
          this.$router.replace({ name: 'my-flow' })
        }
      } else {
        // 搜索打开特定文件夹, 支持当前文件夹
      }
    },
    /**
     * 处理右键点击事件
     * @param event
     * @param data 右击行的流程图对象
     */
    handleContextMenu (event, { flag, data }) {
      this.popupConfig.left = event.x
      this.popupConfig.top = event.y
      this.popupConfig.isShowPopup = true
      this.currentFlowchartData = data
      this.$store.commit('SET_CURRENT_FILE_DATA', this.currentFlowchartData)
      // console.log('列表数据: data is: ', data)
    },
    /**
     * 搜索框, 确认输入处理函数
     */
    handleInputConfirm (value) {
      this.params.keyword = value
      // this.getFile(this.currentDataSpaceIdGetter)
      this.getFileInit()
    },
    /**
     * 分割线展开处理函数
     * @param state 展开状态
     * @param flag 哪个分割线, today, earlier
     */
    handleExpansionChange (state, flag) {
      $(this.$refs[flag + 'List']).animate({
        height: 'toggle'
      }, 300)
    },
    /**
     * 点击列表 item 进入编辑视图
     * 根据权限判断可编辑性
     */
    toEditView () {
      this.$router.push({
        name: 'fc-flowfile-edit',
        params: {
          flowfileId: this.currentFlowchartData.id
        }
      })
    },
    /**
     * 点击列表 item 进入编辑视图
     * 根据权限判断可编辑性
     */
    opendEditView () {
      this.$router.push({
        name: 'fc-flowfile-edit',
        params: {
          flowfileId: this.currentFlowchartData.id
        },
        query: {
          openjz: true
        }
      })
    },
    /**
     * 修改文件名处理逻辑
     */
    modifyFlowchartFileName () {
      // console.log('修改文件名')
      // 1. 关闭右键菜单
      this.popupConfig.isShowPopup = false
      // // 2. 打开对话框, 触发 home 中的对话框展示; 使用 事件中心 进行消息的传递
      Bus.$emit('flowchart-rename', this.currentFlowchartData)
    },
    /**
     * 移动文件处理逻辑
     */
    mvFile () {
      // 1. 关闭右键菜单
      this.popupConfig.isShowPopup = false
      // 2. 打开对话框
      this.$refs.flowchartMvDialog.$refs['flowFileItemDialog'].updateVisible(true)
      this.$nextTick().then(() => {
        this.$refs.flowchartMvDialog.$refs['flowchartMv'].setCurrentDataSpace(this.currentDataSpaceIdGetter)
      })
    },
    // 复制文件
    cpFile () {
      // 1. 关闭右键菜单
      this.popupConfig.isShowPopup = false
      this.$refs.FlowchartCopyDialog.$refs['flowFileItemDialog'].updateVisible(true)
      this.$nextTick().then(() => {
        this.$refs.FlowchartCopyDialog.$refs['flowchartMv'].setCurrentDataSpace(this.currentDataSpaceIdGetter)
      })
    },
    // 查询历史版本
    qyHistoryFile () {
      // 1. 关闭右键菜单
      this.popupConfig.isShowPopup = false
      this.$refs.FlowchartHistoryDialog.$refs['flowFileItemDialog'].updateVisible(true)
      this.$nextTick().then(() => {
        console.log(this.currentFlowchartData)
        this.$refs.FlowchartHistoryDialog.$refs['flowchartMv'].setCurrentDataSpace(this.currentFlowchartData.id)
      })
    },
    /**
     * 协作成员管理, 出发 事件, 通过 event-bus 传递到 home, 由home中通用组件处理
     */
    cooperateMng () {
      // 1. 关闭右键菜单
      this.popupConfig.isShowPopup = false
      // 2. 打开共用对话框
      Bus.$emit('cooperate-mng', { flag: 'file', data: this.currentFlowchartData })
    },
    /**
     * 删除流程图
     */
    handleDelete () {
      // 1. 关闭右键菜单
      this.popupConfig.isShowPopup = false
      // console.log('this.currentFlowchartData', this.currentFlowchartData)
      // 2. 删除前的权限认证
      // 3. 删除提示框
      // 4. 删除接口
      // 5. 重新请求列表
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        const paramsData = {
          file_id: this.currentFlowchartData.id,
          deleted: 1
        }
        this.$api.updateFile(paramsData).then(res => {
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
          this.$message({
            type: 'success',
            message: res.msg
          })
          // this.getFile(this.currentDataSpaceIdGetter)
          this.getFileInit()
        }).catch(err => {
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
          this.$msgMnger.httpError(err)
        })
      })
    },
    // 以下分页逻辑
    /**
     * 设置分页的 total 值
     * @param total
     */
    setPaginatorTotal (total) {
      this.$refs.paginator.updateTotal()
    },
    handlePageChange (page) {
      // 1. update params
      // this.params.page = page
      // this.params.pageSize = pagesize
      this.params.page = page.page
      this.params.pageSize = page.pagesize
      this.getFileInit()
      // 2. get list data
    },
    /**
     * 排序方法改变
     */
    handleSortMethodChange () {
      // 切换排序方法时要清空掉 tmpList 防止 上一种排序方法的数据 填充到 当前排序方法的数据
      this.params.page = 1
      this.tmpList = []
      this.getFileInit()
    },
    /**
     * 点击目录按钮
     */
    handleCatalog (flag) {
      Bus.$emit('flowfile-catalog', {
        folderId: this.params.currentFolder.folderId,
        folderName: this.params.currentFolder.folderName
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
#my-flow{
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  position: relative;

  .flow-condition-wrapper {
    position: absolute;
    right: 36px;
    top: 12px;
  }

  @at-root {
    .my-flow__nav {
      padding-left: 24px;
      padding-top: 16px;
      text-align: left;
      color: #5B6977;
      .nav__nav-icon {
        margin: 0 5px;
      }
      .nav__folder-item {
      }
      .nav__folder-item--hover {
        cursor: pointer;
        &:hover {
          color: $primary-color;
          /*text-decoration: underline;*/
        }
      }
    }
    .my-flow__search{
      flex: none;
      position: relative;
      padding:24px 0;
    }
    .my-flow__paginator {
      flex: none;
      padding: 24px 0px 24px 20px;
      position: relative;
      text-align:left;
    }
    .my-flow__flowchart-list {
      flex: auto;
      padding: 0 35px 0 24px;
      height:100%;
      overflow: auto;
      .my-flow__flowchart-list-sublist {
        padding: 10px 0;
        overflow: hidden;
        /*transition: all 2s;*/
      }
    }
  }
  @at-root {
    .popup__contextmenu {
      box-shadow:0 3px 8px 0 rgba(0,0,0,0.08);
      border-radius:1px;
      .popup__contextmenu-item {
        padding: 0 16px;
        &:hover {
          background-color: #f5f5f5;
        }
        &:last-child {
          span {
            border-bottom: none;
          }
        }
        .popup__contextmenu-item-text {
          display: block;
          height: 44px;
          width: 235px;
          border-bottom: 1px solid #E8E8E8;
          line-height: 44px;
          text-align: left;
          color: $base-text-color-middle;
          cursor: pointer;
        }
      }
    }
  }
  .popup__contextmenu-item--special {
    color: #FF1A2E;
  }
  .nav-panel{
    padding: 16px
  }
  .popup__contextmenu-item--disabled {
    position: relative;
    color: $base-text-color-middle !important;
    pointer-events: none;
    &:after {
      content: '';
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2103;
      background-color: rgba(255, 255, 255, .5);
      cursor: not-allowed !important;
    }
  }
  .my-flow__flowchart-list-item--current {
    background-color: $list-background-color-hover !important;
  }
  .my-flow__search-selector {
    position: absolute;
    top: 50%;
    right: 35px;
    width: 130px;
    transform: translateY(-50%);
  }
}
.flodselect{
    margin-right:10px;
    width:210px;
}
</style>
