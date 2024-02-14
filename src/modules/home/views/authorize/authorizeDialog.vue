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
        <div class="select-panel">
          <div class="title">当前已包含内容：</div>
          <div class="select-content">
            <el-tag
              @close="handleClose(tag, index)"
              size="mini"
              v-for="(tag, index) in tags"
              :key="tag.page_id"
              closable
            >
              {{tag.page_name}}
            </el-tag>
          </div>
        </div>
        <div class="table-wrapper">
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
                  type="selection"
                  width="55">
                  <template slot-scope="{row}">
                    <el-checkbox v-model="row.checked" @change="changeTableCheckbox(row)"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="page_name"
                  show-overflow-tooltip
                  label="名称"
                  min-width="180">
                </el-table-column>
                <el-table-column
                  prop="folder_name"
                  min-width="100"
                  show-overflow-tooltip
                  label="所在项目">
                </el-table-column>
                <el-table-column
                  prop="create_at"
                  width="180"
                  align="center"
                  label="创建时间">
                </el-table-column>
                <el-table-column
                  prop="user_name"
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
        <el-button type="primary" @click="handleSave">确 定</el-button>
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
      tableData: [],
      loading: false,
      visible: false,
      toolbar: {
        name: ''
      },
      current: 1,
      size: 10,
      total: 0,
      currentData: {}
    }
  },
  computed: {
    title () {
      return '编辑'
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
      this.tableData.forEach(item => {
        if (tag.page_id === item.page_id) {
          item.checked = false
        }
      })
      this.tags.splice(index, 1)
    },
    changeTableCheckbox (item) {
      const index = this.tags.findIndex(tag => tag.page_id === item.page_id)
      if (item.checked && index === -1) {
        const copyItem = {
          ...item
        }
        delete copyItem.checked
        this.tags.push(copyItem)
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
        name: ''
      }
      this.handleSearch()
    },
    commonHandleDialog () {
      this.visible = true
      this.parentNodes = []
      this.handleGetVisioFile()
    },
    edit (data) {
      this.currentData = data
      const { tags = [] } = data
      this.commonHandleDialog()
      this.tags = tags
    },
  
    hide () {
      this.visible = false
      this.currentData = {}
      this.tags = []
      this.tableData = []
      this.current = 1
      this.size = 10
      this.total = 0
      this.toolbar = {
        name: ''
      }
    },
  
    handleSave () {
      this.$emit('saveNode', {
        tags: this.tags,
        currentData: this.currentData
      })
      this.visible = false
    },
    handleGetVisioFile () {
      const { name } = this.toolbar
      this.$api.showAuthorizeFlowTableData({
        keywords: name,
        company_id: this.companyId,
        page: this.current,
        page_size: this.size
      }).then(res => {
        const { code, data, total } = res
        if (code === 0) {
          this.tableData = data.map(item => {
            item.checked = this.tags.some(tag => tag.page_id === item.page_id)
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
