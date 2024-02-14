<template>
  <flow-file-dialog
    class="flowfile-catalog-dialog"
    ref="flowFileDialog"
    :width="viewConfig[currentView].width + 20 + 'px'"
    :title="viewConfig[currentView].title"
    :btn0="viewConfig[currentView].btn0"
    :btn1="viewConfig[currentView].btn1"
    :btn2="viewConfig[currentView].btn2.title ? viewConfig[currentView].btn2 : null"
    :showClose="true"
    :destroyOnClose="true"
    @clickBtn0="handleClickBtn0"
    @clickBtn1="handleClickBtn1"
    @clickBtn2="viewConfig[currentView].btn2.handler"
    @closed="handleDialogClosed"
  >
    <div
      slot="one"
      class="b-generate-container"
      v-loading="loading"
      element-loading-text="加载中"
    >
      <div v-show="currentView === 'one'" :style="{ width: viewConfig['one'].width + 'px' }">
        <el-scrollbar style="height: 500px;">
          <el-tree
            ref="elTree"
            :data="catalogData"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :default-expand-all="true"
          >
            <!-- 树状结构 -->
            <div slot-scope="{ node, data }" class="b-tree__item">
              <div class="b-tree__item-content">
                <span>{{ data.catalog_number + data.catalog_name }} {{ data.department ? `(${data.department}, ${data.complete_percent ? data.complete_percent : '0'}%)` : '' }}</span>
              </div>
              <div class="b-tree__item-operation">
                <!-- 按钮切换显示规则: node.level === 1, 只能添加,
                  node 为末级目录, 只有编辑和删除 -->
                <el-button v-if="node.level < 5 && node.data.is_leaf !== 1" type="text" @click="handleNodeAdd({ node, data })">
                  <i class="el-icon el-icon-plus"></i>
                </el-button>
                <template v-if="node.level !== 1">
                  <el-button type="text" @click="handleNodeEdit({ node, data })">
                    <i class="el-icon el-icon-edit"></i>
                  </el-button>
                  <el-button type="text" @click="handleNodeDel({ node, data })">
                    <i class="el-icon el-icon-delete"></i>
                  </el-button>
                </template>
              </div>
            </div>
          </el-tree>
        </el-scrollbar>
      </div>
      <div v-show="currentView === 'two'" :style="{ width: viewConfig['two'].width + 'px' }">
        <el-form
          :model="formView.formData"
          :rules="formView.rules"
          ref="ruleForm"
          size="small"
          label-width="120px"
          class="catalog_form"
        >
          <el-form-item :label="formView.formConfig.catalog_number.label">
            <span>{{ formView.formData.catalog_number }}</span>
          </el-form-item>
          <el-form-item :label="formView.formConfig.catalog_name.label">
            <el-input v-model="formView.formData.catalog_name" v-bind="formView.formConfig.catalog_name.compConfig"></el-input>
          </el-form-item>
          <!-- 上级目录, node.level !== 1 显示 -->
          <el-form-item v-show="currentNode && currentNode.level > 2" :label="formView.formConfig.parent_name.label">
            <span>{{ formView.formData.parent_name }}</span>
          </el-form-item>
          <!-- 是否末级目录, node.level !== 1 显示 -->
          <el-form-item v-show="currentNode && currentNode.level > 2" :label="formView.formConfig.is_leaf.label">
            <el-radio-group v-model="formView.formData.is_leaf">
              <el-radio
                v-for="item in formView.formConfig.is_leaf.options"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 责任部门, node.level !== 1 显示 -->
          <el-form-item v-show="currentNode && currentNode.level > 2" :label="formView.formConfig.department.label">
            <el-input
              v-model="formView.formData.department"
              v-bind="formView.formConfig.department.compConfig"
              :disabled="departmentDisabled"
            ></el-input>
          </el-form-item>
          <!-- 完成度, node.level !== 1 显示 -->
          <el-form-item v-show="currentNode && currentNode.level > 2" :label="formView.formConfig.complete_percent.label">
            <el-input-number
              v-model="formView.formData.complete_percent"
              v-bind="formView.formConfig.complete_percent.compConfig"
              :disabled="departmentDisabled"
            ></el-input-number>
            %
          </el-form-item>
          <!-- 关联流程文件, node.level === 1 显示 -->
          <el-form-item v-show="currentNode && currentNode.level <= 2" :label="formView.formConfig.flow_name.label">
            <el-input v-model="formView.formData.flow_name" v-bind="formView.formConfig.flow_name.compConfig"></el-input>
            <span class="catalog_form--load-more" @click="handleLoadMore('flow')" :style="{ cursor: 'pointer' }">
              <i class="el-icon el-icon-more"></i>
            </span>
          </el-form-item>
          <!-- 关联流程图, node.level !== 1 显示 -->
          <el-form-item v-show="currentNode && currentNode.level > 2" :label="formView.formConfig.page_name.label">
            <el-input v-model="formView.formData.page_name" v-bind="formView.formConfig.page_name.compConfig"></el-input>
            <span class="catalog_form--load-more" @click="handleLoadMore('page')"  :style="{ cursor: departmentDisabled ? 'not-allowed' : 'pointer' }">
              <i class="el-icon el-icon-more"></i>
            </span>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="currentView === 'three'" :style="{ width: viewConfig['three'].width + 'px' }">
        <flow-file-tab-list
          ref="flowFileTabList"
          :type="getNameType"
          :folderId="folder.folderId"
        ></flow-file-tab-list>
      </div>
      <div v-show="currentView === 'four'" :style="{ width: viewConfig['four'].width + 'px' }">
        <catalog-view
          ref="catalogView"
          :folder-id="folder.folderId"
          @change-loading="changeLoading"
        ></catalog-view>
      </div>
    </div>
  </flow-file-dialog>
</template>

<script>
// databaseMap: { // 数据结构
//   'cid': '唯一id, int',
//     'catalog_number': '目录编号, str',
//     'catalog_name': '目录名称, str',
//     'parent_id': '上级id, int',
//     'is_leaf': '是否是叶子节点, bool',
//     'department': '责任部门, str',
//     'complete_percent': '完成度, tinyint',
//     'flow_id': '关联流程图, int',
//     'flow_name': '关联流程图名字, str',
//     'page_name': '流程图的 tab 名字, str',
//     'folder_id': '文件夹id, int',
//     'create_time': '',
//     'update_time': '',
//     'level': 1,
//     'is_del': '' // 硬删除也可以感觉
// },
import FlowFileDialog from '../../../flowchart/components/public/flowfile-dialog'
import FlowFileTabList from './flow-file-tab-list'
import CatalogView from './catalog-view'
const PID = 'parent_id'
const CID = 'cid'
const CHILDREN = 'children'
export default {
  name: 'flowfile-catalog-dialog',
  components: {
    FlowFileDialog,
    FlowFileTabList,
    CatalogView
  },
  data () {
    return {
      loading: false,
      permission: -1, // 权限
      folder: { folderId: '', folderName: '' },
      catalogData: [
        {
          [CID]: '1',
          catalog_number: '',
          catalog_name: 'xx 项目流程目录',
          is_leaf: 2,
          department: '',
          complete_percent: 0,
          flow_id: '',
          flow_name: '',
          page_name: '',
          level: 0,
          [CHILDREN]: [
          ]
        }
      ],
      initNodeData: {
        [CID]: '',
        catalog_number: '',
        catalog_name: '',
        is_leaf: 2,
        department: '',
        complete_percent: 0,
        flow_id: '',
        flow_name: '',
        page_name: '',
        level: 0
      },
      currentNode: null, // 当前正在编辑的节点 id
      currentData: null, // 当前正在编辑的节点的 数据
      // 三种视图切换, 配置对象
      viewConfig: {
        'one': {
          title: '编辑',
          width: 650,
          btn2: { title: '编辑完成', handler: this.editComplete },
          btn1: { title: '取消' },
          btn0: null
        },
        'two': {
          title: '编辑 > 目录编辑',
          width: 570,
          btn2: { title: '确 定', handler: this.submit },
          btn1: null,
          btn0: { title: '返 回' }
        },
        'three': {
          title: '编辑 > 目录编辑 > 流程选择',
          width: 570,
          btn2: { title: '确认选中', handler: this.select },
          btn1: null,
          btn0: { title: '返 回' }
        },
        'four': {
          title: '项目目录',
          width: 800,
          btn2: { handler: this.toEdit },
          btn1: { title: '取 消' },
          btn0: null
        }
      },
      currentView: 'one', // 当前视图
      getNameType: 'flow', // 选择流程file/page_name
      formView: {
        formData: {
          catalog_number: '',
          catalog_name: '',
          is_leaf: 2,
          parent_name: '',
          department: '',
          complete_percent: 0,
          flow_id: '',
          flow_name: '',
          page_name: ''
        },
        rules: {},
        formConfig: {
          catalog_number: {
            label: '目录编号: '
          },
          catalog_name: {
            label: '目录名称: ',
            compConfig: {
              placeholder: '请输入目录名称',
              maxlength: 20,
              'show-word-limit': true,
              clearable: true
            }
          },
          parent_name: {
            label: '上级目录: '
          },
          is_leaf: {
            label: '是否末级目录: ',
            options: [
              { value: 1, label: '是' },
              { value: 2, label: '否' }
            ],
            compConfig: {
            }
          },
          department: {
            label: '责任部门: ',
            compConfig: {
              placeholder: '请输入责任部门',
              maxlength: 20,
              'show-word-limit': true,
              clearable: true
            }
          },
          complete_percent: {
            label: '完成度: ',
            compConfig: {
              min: 0,
              max: 100,
              step: 1,
              'step-strictly': true,
              controls: false,
              style: {
                'width': '50px'
              }
            }
          },
          flow_name: {
            label: '关联流程文件: ',
            compConfig: {
              placeholder: '请选择流程文件',
              disabled: true,
              style: 'width: 200px;'
            }
          },
          page_name: {
            label: '关联流程图: ',
            compConfig: {
              placeholder: '请选择流程图',
              disabled: true,
              style: 'width: 200px;'
            }
          }
        }
      }
    }
  },
  computed: {
    // 根据是否末级目录进行禁用与否
    departmentDisabled () {
      return this.formView.formData.is_leaf !== 1
    }
  },
  methods: {
    handleClickBtn0 () {
      if (this.currentView === 'three') {
        this.currentView = 'two'
      } else if (this.currentView === 'two') {
        this.currentView = 'one'
      } else {
      }
    },
    handleClickBtn1 () {
      if (this.currentView === 'three') {
        this.currentView = 'two'
      } else if (this.currentView === 'two') {
        this.currentView = 'one'
      } else {
      }
    },
    /**
     * dialog完全关闭
     */
    handleDialogClosed () {
      this.viewConfig['four'].btn2 = { handler: this.toEdit }
      this.currentView = 'four'
    },
    /**
     * ref 打开对话框
     * @param folderId
     * @param folderName
     */
    async showDialog ({ folderId, folderName }) {
      try {
        this.changeLoading({ loading: true })
        // 1. 存值
        this.folder.folderId = folderId
        this.folder.folderName = folderName
        this.catalogData[0].catalog_name = folderName
        // 2. 改 view 为查看
        this.currentView = 'four'
        // 3. 打开
        this.$refs.flowFileDialog.updateVisible(true)
        // 4. 获取数据
        const res = await this.$api.getFolderCatalog({ folderId: this.folder.folderId })
        // 5. 直接赋值给列表
        this.$refs.catalogView.setTableData(res.data)
        // 6. 转树赋值给 树
        const _tmp = this.getTree(res.data)
        this.catalogData = _tmp.length ? _tmp : this.catalogData
        // 7. 获取权限
        const permissionParams = {
          folder_id: folderId,
          company_id: this.$store.getters.currentDataSpaceIdGetter,
          check_type: 2
        }
        const resOfPermission = await this.$api.getUserPermission(permissionParams)
        // 8. 赋值权限
        this.permission = resOfPermission.data // 赋值权限 1 管理员 2 编辑 3 查看
        // 9.1 根据权限判断是否开放编辑, 防止数据获取中点击编辑, 所以放到最后
        if (resOfPermission.data === 1 || resOfPermission.data === 2) {
          this.viewConfig['four'].btn2 = { title: '编 辑', handler: this.toEdit }
        }
        this.changeLoading({ loading: false })
      } catch (err) {
        this.changeLoading({ loading: false })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    },
    /**
     * 编辑按钮 handler
     * @param node 节点
     * @param data 此节点下的数据
     */
    handleNodeEdit ({ node, data }) {
      this.currentNode = node
      this.currentData = data
      this.currentView = 'two'
      const _formData = Object.assign({}, data)
      const _parentData = node.parent.data
      _formData.parent_name = _parentData.catalog_number + _parentData.catalog_name
      this.formView.formData = _formData
    },
    async handleNodeDel ({ node, data }) {
      try {
        if (node.childNodes.length) {
          await this.$confirm('此操作将删除该目录以及其子目录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
        const _children = node.parent.data[CHILDREN]
        const _index = _children.findIndex(item => item[CID] === data[CID])
        _children.splice(_index, 1)
        this.autoNumber({ data: this.catalogData[0][CHILDREN], numberPrefix: '' })
      } catch (err) {
        console.log(err)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    handleNodeAdd ({ node, data }) {
      // 根据 level 规定不同的行为
      // node.level === 1 创建流程(成图中的一级)
      // node.level === 2 时, 创建tab or 更下级
      // 做一个假结点
      this.currentNode = { level: node.level + 1 }
      this.currentData = data
      this.currentView = 'two'
      const _formData = Object.assign({}, this.initNodeData)
      _formData.level = node.level
      _formData[CID] = +new Date() + ''
      _formData.parent_name = data.catalog_number + data.catalog_name
      _formData.catalog_number = this.getNewCatalogNumber({ node, data })
      this.formView.formData = _formData
    },
    /**
     * 加载流程图 or 流程文件
     */
    handleLoadMore (type) {
      if (this.departmentDisabled && type === 'page') {
        return
      }
      this.getNameType = type
      this.currentView = 'three'
    },
    /**
     * 生成 新的编号
     * @param node
     * @param data
     */
    getNewCatalogNumber ({ node, data }) {
      // number 构成: 父 number + (子在父中的index + 1)
      // node.level === 1, 说明根节点, 父 number 为空
      const _parentNodeNumber = node.level === 1 ? '' : data.catalog_number
      const _index = node.childNodes.length
      return _parentNodeNumber + (_index + 1 + '').padStart(2, '0') + '.'
    },
    /**
     * view: one 编辑完成逻辑
     */
    async editComplete () {
      try {
        this.changeLoading({ loading: true })
        // 获取 list
        let _list = this.getListRecursive(this.catalogData, [], '')
        // 数据清洗一下, 只挑选需要的字段, 且如果是 null 置为 ''
        const propList = [CID, 'catalog_number', 'catalog_name', 'is_leaf', 'department', 'complete_percent', 'flow_id', 'flow_name', 'page_name', 'level', PID, 'folder_id']
        _list = _list.map(item => {
          const tmpItem = {}
          propList.forEach(propItem => {
            if (propItem === 'level' && Object.prototype.toString.call(item[propItem]) === '[object Null]') {
              tmpItem[propItem] = 0
              return
            }
            tmpItem[propItem] = Object.prototype.toString.call(item[propItem]) === '[object Null]' ? '' : item[propItem]
          })
          tmpItem.folder_id = this.folder.folderId
          return tmpItem
        })
        const res = await this.$api.addUpdateCatalog({ catalogList: _list })
        this.$message({
          type: 'success',
          message: res.data
        })
        this.currentView = 'four'
        const resList = await this.$api.getFolderCatalog({ folderId: this.folder.folderId })
        // 7. 直接赋值给列表
        this.$refs.catalogView.setTableData(resList.data)
        // 8. 转树赋值给 树
        const _tmp = this.getTree(resList.data)
        this.catalogData = _tmp.length ? _tmp : this.catalogData
        this.changeLoading({ loading: false })
      } catch (err) {
        this.changeLoading({ loading: false })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    },
    /**
     * view: two 表单提交逻辑
     */
    submit () {
      // 区分添加还是编辑, 因为添加和编辑层级不一样
      if (!this.formView.formData.catalog_name.trim()) {
        this.$message({
          type: 'error',
          message: '请输入目录名称'
        })
        return
      }
      if (!Object.prototype.hasOwnProperty.call(this.currentNode, 'parent')) { // 添加/新增
        if (!Object.prototype.hasOwnProperty.call(this.currentData, CHILDREN) || !this.currentData[CHILDREN]) {
          this.$set(this.currentData, CHILDREN, [])
        }
        this.currentData[CHILDREN].push(this.formView.formData)
        // 初始化变量
        this.currentNode = null
        this.currentData = null
        // 切换视图
        this.currentView = 'one'
      } else { // 编辑
        // 1. 赋值逻辑
        for (const [key] of Object.entries(this.currentData)) {
          if (key === CID || key === CHILDREN) {
            continue
          }
          this.currentData[key] = this.formView.formData[key]
        }
        // 2. 初始化
        this.currentNode = null
        this.currentData = null
        // 3. 切换视图
        this.currentView = 'one'
      }
    },
    /**
     * view: three 流程文件/流程图 选中逻辑
     */
    select () {
      const _flow = this.$refs.flowFileTabList.getCurrentFlow()
      if (typeof _flow === 'string') { // 说明没有获取到
        this.$message({
          type: 'error',
          message: _flow
        })
        return
      }
      this.formView.formData.flow_id = _flow.flowId
      this.formView.formData.flow_name = _flow.flowName
      this.formView.formData.page_name = _flow.pageName
      this.currentView = 'two'
    },
    toEdit () {
      this.currentView = 'one'
    },
    /**
     *
     * @param list 根列表
     * @param result 结果
     * @param pid 父id
     * @returns {*}
     */
    getListRecursive (list, result, pid) {
      if (list) {
        list.forEach(item => {
          result.push(Object.assign({}, item, { [CHILDREN]: null, [PID]: pid }))
          this.getListRecursive(item[CHILDREN], result, item[CID])
        })
      }
      return result
    },
    /**
     * 获得树状结构
     * @param data
     * @returns {*}
     */
    getTree (data) {
      const parentIdMap = {
        root: []
      }
      data.forEach(item => {
        if (!item[PID]) {
          parentIdMap['root'].push(item)
          return
        }
        if (!Object.prototype.hasOwnProperty.call(parentIdMap, item[PID])) {
          parentIdMap[item[PID]] = []
        }
        parentIdMap[item[PID]].push(item)
      })
      const result = {}
      this.combineTreeCursive(result, 'root', parentIdMap)
      return result.children
    },
    /**
     * combineTreeCursive
     * @param result
     * @param key
     * @param parentMap
     * @returns {*}
     */
    combineTreeCursive (result, key, parentMap) {
      if (parentMap[key]) {
        this.$set(result, CHILDREN, parentMap[key])
        result[CHILDREN].forEach(item => {
          this.combineTreeCursive(item, item[CID], parentMap)
        })
      } else {
        return result
      }
    },
    /**
     * 自动编号, 递归修改编号规则
     */
    autoNumber ({ data, numberPrefix }) {
      if (data) {
        data.forEach((item, index) => {
          item.catalog_number = numberPrefix + (index + 1 + '').padStart(2, '0') + '.'
          this.autoNumber({ data: item[CHILDREN], numberPrefix: item.catalog_number })
        })
      }
    },
    /**
     * 改变 loading
     * @param loading
     */
    changeLoading ({ loading }) {
      this.loading = loading
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.b-generate-container {
  height: 500px;
  display: flex;
  justify-content: space-around;
}
.b-tree__item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.b-tree__item-operation {
  width: 120px;
  display: flex;
  justify-content: flex-start;
}
.catalog_form {
  text-align: left;
  .catalog_form--load-more {
    display: inline-block;
    height: 30px;
    width: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    border: $--border-width-base $--border-style-base $--border-color-base;
    background-color: $--background-color-base;
    margin-left: 15px;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.b-generate-container {
  .el-tree-node__content {
    height: 40px;
  }
  .el-input-number {
    .el-input__inner {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}
</style>
