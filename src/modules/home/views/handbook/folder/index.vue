<template>
  <div v-bind="$attrs" class="folder">
    <div :size="16" :horizontal="false">
      <div class="header" :style="headerStyle">
        <div class="title">{{title}}</div>
        <div>
          <div v-if="showUpload" style="margin-top: -14px; margin-right: 10px; display: inline-block; position: relative;">
            <el-button size="mini" type="primary" @click="clickUpload">导入手册目录</el-button>
            <div
              style="font-size: 12px; color: #aaa; margin-top: 4px; position: absolute; top: 24px; left: -50%; width: 200%;"
            >
              只能上传docx文件，小于200m
            </div>
          </div>
          <el-button size="mini" v-if="allowRootAdd && !uploadManual" type="primary" icon="el-icon-plus" @click="createNode"></el-button>
          <!-- <el-button size="mini" icon="el-icon-refresh-right" @click="getTreeData"></el-button> -->
          <more size="medium" :data="dropdownList" @command="handleCommand">
            <el-button size="mini" :style="{marginLeft: '10px'}">
              操作
              <i class="el-icon-expand"></i><i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </more>
        </div>
      </div>
      <el-input :style="{width: '100%'}" size="small" placeholder="请搜索" @input="handleSearch" clearable v-model="search" />
      <div class="folder__tree">
        <el-tree
          ref="myTree"
          v-loading="loading"
          :data="tree"
          :props="defaultProps"
          node-key="id"
          :current-node-key="currentNodeKey"
          @node-click="handleNodeClick"
          :highlight-current="true"
          :default-expand-all="defaultExpandAll"
          :default-expanded-keys="defaultExpandKeys"
          :filter-node-method="filterNode"
          @node-drop="handleDrop"
        >
          <div class="node" slot-scope="{ node, data }">
            <div :class="['label', data.flag && 'can-edit']">{{node.label}}</div>
            <div v-if="!isDisabledAll(node)" :class="['action-panel', currentNodeKey === data.id ? 'action-panel--selected': '']">
              <el-tooltip effect="dark" content="在当前目录下增加下级目录" placement="top">
                <el-button
                  :disabled="!(!depth || node.level < depth) || !isAllowed(node, 'add')"
                  type="text"
                  size="default"
                  icon="el-icon-plus"
                  @click.stop="handleAction('add', data, node)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑当前目录下的内容" placement="top">
                <el-button
                  type="text"
                  :disabled="!isAllowed(node, 'edit')"
                  size="default"
                  icon="el-icon-edit"
                  @click.stop="handleAction('edit', data, node)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除当前目录及子目录的内容" placement="top">
                <el-button
                  type="text"
                  :disabled="!isAllowed(node, 'delete')"
                  size="default"
                  icon="el-icon-delete"
                  @click.stop="handleAction('delete', data, node)"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
import Operations from './operation'
import More from './more.vue'

import { debounce, cloneDeep } from 'lodash'
import TreeData from './TreeData'
const COMMAND_FLOD = 'flod'
const COMMAND_EXPAND = 'expand'
const RESET = 'reset'
export default {
  name: 'GdmpFolder',
  mixins: [],
  components: {
    More
  },
  computed: {
    dropdownList () {
      return this.uploadManual ? this.dropdown.filter(item => item.value !== RESET) : this.dropdown
    }
  },
  props: {
    headerStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    showUpload: {
      type: Boolean,
      default: false
    },
    uploadManual: {
      type: Boolean,
      default: false
    },
    copyMethod: {
      type: Function,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    deleteTipContent: { type: String, default: '此操作将删除该目录及目录下所有数据，是否继续？' },
    depth: { type: Number, default: 5 },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'name'
        }
      }
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    allowRootAdd: {
      type: Boolean,
      default: true
    },
    allowAdd: {
      type: Boolean,
      default: true
    },
    allowDelete: {
      type: Boolean,
      default: true
    },
    allowEdit: {
      type: Boolean,
      default: true
    },
    allowCopy: {
      type: Boolean,
      default: true
    },
    dropdown: {
      type: Array,
      default () {
        return [
          { value: COMMAND_FLOD, label: '全部折叠' },
          { value: COMMAND_EXPAND, label: '全部展开' },
          { value: RESET, label: '重置' }
        ]
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        setTimeout(() => {
          el.querySelector('input').focus()
        }, 100)
      }
    }
  },
  data () {
    return {
      search: '',
      loading: false,
      tree: [],
      count: 0,
      currentNodeKey: '',
      treeData: null,
      defaultExpandKeys: []
    }
  },
  methods: {
    ...Operations,
    clickUpload () {
      this.$emit('click-upload')
    },
    isAllowDrag (node) {
      return this.isAllowed(node, 'drag')
    },
    isAllowDrop (node, dropNode) {
      return this.isAllowed(node, 'drop') && dropNode.level < this.depth
    },
    isAllowed (node, type = 'drag') {
      const suffix = type.charAt(0).toUpperCase() + type.slice(1)
      const key = 'allow' + suffix
      return this[key] && !node.data[`is${suffix}Disabled`] && !(node.data.flag === false) && (type === 'edit' || !this.uploadManual)
    },
    isDisabledAll (node) {
      let flag = true
      const keys = ['add', 'edit', 'copy', 'delete', 'drag', 'drop']
      keys.forEach((key) => {
        flag = flag && !this.isAllowed(node, key)
      })
      return flag
    },
    handleDropdownChange (visible, data) {
      if (visible) {
        this.setCurrentKey(data.id)
      }
    },
    toggleExpand (nodes, expanded) {
      nodes.forEach(node => {
        node.expanded = expanded
        if (node.childNodes) {
          this.toggleExpand(node.childNodes, expanded)
        }
      })
    },

    handleCommand (command) {
      if (this[command]) {
        return this[command]()
      }
      const root = this.$refs.myTree.root
      this.toggleExpand(root.childNodes, command === COMMAND_EXPAND)
    },

    reset () {
      this.$emit('reset')
    },

    handleSearch: debounce(function () {
      this.$refs.myTree.filter(this.search)
    }, 200),

    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].toLowerCase().indexOf(value.toLowerCase()) !== -1
    },

    handleNodeClick: debounce(function (data) {
      const { id } = data
      this.setCurrentKey(id)
      this.$emit('node-click', data)
    }, 300),

    handleAction (type, data = {}, node) {
      console.log(node, '-------')
      const actions = {
        edit: this.editAction,
        add: this.addAction,
        delete: this.deleteAction,
        copy: this.copyMethod || Operations.copyAction.bind(this)
      }
      if (!(type in actions)) return
      actions[type](data, node)
    },

    /* 查询目录树 */
    getTreeData () {
      this.loading = true
      this.$emit('load', (data) => {
        this.loading = false
        this.tree = data || []
        this.treeData = new TreeData(cloneDeep(this.tree))
      })
    },

    setTreeData (tree) {
      this.tree = tree
    },

    /**
       * @function 展开某个节点
       * @param id {string} 要展开节点的id
    * */
    expandNode (id) {
      this.$refs.myTree.store.nodesMap[id].expanded = true
    },

    /**
     * @function 删除节点
     * @param data {object} 要删除节点数据
    * */
    removeNode (data) {
      this.$refs.myTree.remove(data)
    },

    setCurrentKey (id) {
      this.currentNodeKey = id
      this.$nextTick(() => {
        this.$refs.myTree.setCurrentKey(id)
      })
    },

    getNode (id) {
      return this.$refs.myTree.getNode(id)
    },

    /**
      * @function 更新节点状态
    * */
    updateStatus (id, data) {
      const node = this.getNode(id)
      Object.assign(node.data, data)
    }
  },
  created () {
    this.getTreeData()
  },
  mounted () {
  },
  activated () {
  },
  watch: {},
  beforeUpdate () {
  },
  updated () {
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss" scoped> 
.folder{
  padding: 16px;
  background-color: #fff;
  .header{
    color:#262626;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .folder__tree{
    margin-top: 8px;
    .node{
      text-align: left;
      flex:1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label{
        font-size: 14px;
        border-color: transparent!important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.can-edit {
          color: #1890ff;
        }
      }
      .action-panel{
        min-width: 90px;
        display: none;
        flex: 1;
        margin-left: 16px;
        .action-panel--selected {
          display: block;
        }
        /deep/ .el-button + .el-button {
          margin-left: 24px;
        }
      }
      .customize-panel{
        .customize-panel--focusout {
          display: none;
        }
      }
      &:hover .action-panel{
        display: block;
      }
      &:hover .customize-panel{
        display: none;
      }
    }
  }
}

</style>
