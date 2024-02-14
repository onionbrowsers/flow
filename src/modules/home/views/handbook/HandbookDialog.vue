<template>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      append-to-body
      destroy-on-close
      size="mini"
      custom-class="node-dialog"
    >
      <div class="dialog-content" style="overflow: hidden;">
        <div class="header">
          <div class="title">当前目录位置：</div>
          <span class="desc">{{dirName}}</span>
        </div>
        <div class="select-panel">
          <div class="title">当前已包含内容：</div>
          <div class="select-content">
            <el-tag
              @close="handleClose(tag, index)"
              size="mini"
              v-for="(tag, index) in tags"
              :key="tag.page"
              closable
            >
              {{tag.label || tag.name}}
            </el-tag>
          </div>
        </div>
        <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent label-width="80px">
          <el-form-item label="目录名称" prop="name" >
            <el-input v-model="form.name" :style="{width: '260px'}" maxlength="20" placeholder="请输入"></el-input>
            <!-- <el-button type="primary" class="w90btn" @click="handleSearch">查询</el-button> -->
          </el-form-item>
          <!-- <el-form-item label="描述" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入内容"  maxlength="128" show-word-limit></el-input>
          </el-form-item> -->
        </el-form>
        <div class="table-wrapper" v-if="showTable">
          <Toolbar>
            <template slot="content">
              <SearchItem title="名称">
                <el-input
                  v-model="toolbar.name"
                  placeholder="请输入名称"
                  size="small"
                  clearable
                ></el-input>
              </SearchItem>
              <SearchItem title="项目">
                <el-select v-model="toolbar.project" clearable
                  @change="handleSearch"
                  size="small"
                  placeholder="请选择项目">
                  <el-option
                    v-for="item in flodList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </SearchItem>
            </template>
            <template slot="aside">
              <el-button type="primary" class="w90btn" 
                  size="small" @click="handleSearch">查询</el-button>
              <el-button class="w90btn" 
                  size="small" @click="handleReset">重置</el-button>
            </template>
          </Toolbar>
          <TableList title="">
            <div>
              <el-table
                class="select-table"
                ref="multipleTable"
                v-loading="loading"
                :max-height="300"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  type="expand"
                >
                  <template slot-scope="{row}">
                    <div v-if="row.hint && row.hint.length" class="child-row-wrapper">
                        <div v-for="item in row.hint" :key="item.page" class="child-row-item">
                            <el-checkbox v-model="item.checked" @change="changeTableCheckbox(item)"></el-checkbox>
                            <span>{{ item.label }}</span>
                        </div>
                    </div>
                    <div v-else>
                        暂无数据
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  label="名称"
                  min-width="180">
                </el-table-column>
                <el-table-column
                  prop="folder_name"
                  min-width="180"
                  show-overflow-tooltip
                  label="所在项目">
                </el-table-column>
                <el-table-column
                  prop="last_modified"
                  width="180"
                  align="center"
                  label="创建时间">
                </el-table-column>
                <el-table-column
                  prop="username"
                  width="100"
                  label="创建人">
                </el-table-column>
              </el-table>
              <el-pagination
                  class="folder-pagination"
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="current"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="size"
                  layout="slot, sizes, prev, pager, next, jumper"
                  :total="total">
                  <div class="page-desc">共{{ total }}条记录，第{{ current }}/{{ Math.ceil(total / size) || 1 }}页</div>
              </el-pagination>
            </div>
          </TableList>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="validate">确 定</el-button>
        <el-button @click="hide">取 消</el-button>
      </span>
    </el-dialog>
  </template>
  
<script>
// import CustomPaginator from '@/components/public/Pagination.vue'
import TableList from '@/components/public/TableList.vue'
import Toolbar from '@/components/public/Toolbar.vue'
import SearchItem from '@/components/public/SearchItem.vue'
export default {
  name: 'NodeDialog',
  mixins: [],
  components: {
    TableList,
    Toolbar,
    SearchItem
  },
  props: {
    flodList: {
      type: Array,
      default () {
        return []
      }
    },
    companyId: {
      type: Number,
      default () {
        return -1
      }
    }
  },
  data () {
    return {
      tags: [],
      parentNodes: [],
      dirName: '',
      tableData: [],
      loading: false,
      currentNode: null,
      currentData: null,
      projectList: [],
      value: '',
      data: [],
      visible: false,
      form: {
        name: ''
      },
      toolbar: {
        name: '',
        project: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入目录名称' },
        ]
      },
      isEdit: false,
      showTable: true,
      current: 1,
      size: 10,
      total: 0
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑' : '新建'
    }
  },
  methods: {
    handleSizeChange (size) {
      this.size = size
      this.current = 1
      this.getList()
    },
    handleCurrentChange (current) {
      this.current = current
      this.getList()
    },
    handleClose (tag, index) {
      this.tableData.forEach((row, i) => {
        if (row.hint && row.hint.length) {
          row.hint.forEach(subItem => {
            if (tag.page === subItem.page) {
              subItem.checked = false
            }
          })
        }
      })
      this.tags.splice(index, 1)
    },
    changeTableCheckbox (item) {
      const index = this.tags.findIndex(tag => tag.page === item.page)
      if (item.checked && index === -1) {
        this.tags.push(item)
      } else {
        this.tags.splice(index, 1)
      }
    },
    getList () {
      this.loading = true
      this.handleGetVisioFile()
    },
    handleSearch () {
      this.current = 1
      this.getList()
    },
    handleReset () {
      this.toolbar = {
        name: '',
        project: ''
      }
      this.handleSearch()
    },
    setParentName (node) {
      if (!node) return
      const name = node.data.name
      if (!name) return
      this.parentNodes.unshift(name)
      this.dirName = this.parentNodes.join('/')
  
      if (node.parent) {
        this.setParentName(node.parent)
      }
    },
    commonHandleDialog (node, data) {
      this.currentNode = node
      this.currentData = data
      this.visible = true
      this.parentNodes = []
      this.setParentName(node)
      this.handleGetVisioFile()
    },
    add ({ data, node, showTable = true }) {
      this.commonHandleDialog(node, data)
      this.showTable = showTable
    },
    edit ({ data, node }) {
      const { name, tags = [] } = data
      this.form.name = name
      this.commonHandleDialog(node, data)
      this.tags = tags
      this.isEdit = true
    },
  
    hide () {
      this.isEdit = false
      this.form.name = ''
      this.visible = false
      this.dirName = ''
      this.tags = []
      this.currentData = null
      this.currentNode = null
      this.tableData = []
      this.current = 1
      this.size = 10
      this.total = 0
      this.toolbar = {
        name: '',
        project: ''
      }
    },
  
    validate () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.handleSave()
      })
    },
  
    handleSave () {
      this.$emit('saveNode', {
        form: this.form,
        tags: this.tags,
        node: this.currentNode,
        data: this.currentData,
        isEdit: this.isEdit
      })
      this.visible = false
    },
    handleGetVisioFile () {
      const { name, project } = this.toolbar
      this.$api.getVisioFile({
        keywords: name,
        folder_id: project,
        company_id: this.companyId,
        page: this.current,
        page_size: this.size
      }).then(res => {
        const { code, data, total } = res
        if (code === 0) {
          this.tableData = data.map(item => {
            if (item.hint && item.hint.length) {
              item.hint.forEach(item => {
                item.checked = false
                if (this.tags.some(tag => tag.page === item.page)) {
                  item.checked = true
                }
              })
            }
            return item
          })
          this.total = total
        }
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created () {
  },
  watch: {
    visible (val) {
      if (!val) {
        this.hide()
      }
    }
  },
  beforeUpdate () {
  },
  updated () {
  },
  beforeDestroy () {
  }
}
</script>
  
  <style lang="scss" scoped>
  </style>
  <style lang="scss">
  .node-dialog{
    min-width: 680px!important;
    width: 850px;
  
    .el-dialog__footer{
      padding-top: 0;
    }
    .el-dialog__body{
      padding: 0px !important;
    }
    .select-panel{
      .title{
        color:#262626;
        margin-bottom: 8px;
      }
      .select-content{
        max-height: 84px;
        overflow: auto;
      }
      margin-bottom: 12px;
      .el-icon-close{
        background-color: #ecf5ff;
        color: #409eff;
        font-size: 12px;
        height: 16px!important;
        width: 16px!important;
        line-height: 16px!important;
        &:hover{
          background-color: #409eff;
          color:#fff
        }
      }
      .el-tag{
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }
    .dialog-content{
      padding:24px 16px;
      .table-wrapper{
        margin-top: 24px;
        .toolbar-wrapper{
          padding: 16px 0 0 0;
          .search-item:not(:last-child){
            margin-right: 16px;
          }
        }
        .table-list{
          padding: 0 8px;
          margin: 0;
        }
      }
      .el-form{
        .el-form-item{
          &:last-child{
            margin: 0
          }
        }
      }
      .header{
        display: flex;
        margin-bottom: 12px;
        align-items: center;
        .title{
          color:#262626;
        }
        .desc{
          margin-left: 8px;
        }
      }
    }
    .folder-pagination {
        text-align: right;
        margin-top: 12px;
        overflow-x: auto;
        width: 100%;
  
        .page-desc {
            height: 28px;
            line-height: 28px;
            float: left;
            color: #606266;
            font-size: 13px;
            font-weight: normal;
        }
    }
    .select-table {
      thead {
        .el-table-column--selection {
          .cell {
            display: none;
          }
        }
      }
    }
    .child-row-item {
        & > span {
            margin-left: 8px;
        }
    }
    .child-row-item + .child-row-item {
        margin-top: 16px;
    }
  }
  </style>
