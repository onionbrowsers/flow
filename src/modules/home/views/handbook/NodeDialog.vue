<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    size="mini"
    custom-class="node-dialog"
  >
    <div v-if="showTable" class="upload-img-wrapper">
      <el-button size="small" type="primary" @click="clickToUpload">
        上传图片
      </el-button>
    </div>
    <div class="dialog-content" style="overflow: hidden;">
      <div class="header">
        <div class="title">当前目录位置：</div>
        <span class="desc">{{dirName}}</span>
      </div>
      <div class="select-panel">
        <div class="title">
          当前已包含内容：
        </div>
        <div class="select-content">
          <el-tag
            @close="handleClose(tag, index)"
            size="mini"
            v-for="(tag, index) in tags"
            :key="index"
            closable
          >
            {{tag.name}}
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
        <div>
          *请从相关部门中勾选流程图或矩阵后入册
        </div>
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
            <SearchItem title="部门">
              <el-select v-model="toolbar.project" clearable
                @change="handleSearch"
                size="small"
                placeholder="请选择部门">
                <el-option
                  v-for="item in flodList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </SearchItem>
            <SearchItem title="类型">
              <el-select v-model="toolbar.type"
                @change="handleSearch"
                size="small"
                placeholder="请选择类型">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </SearchItem>
          </template>
          <template slot="aside">
            <el-button type="primary" class="w90btn" 
                size="small" @click="handleSearch">查询</el-button>
            <!-- <el-button class="w90btn" 
                size="small" @click="handleReset">重置</el-button> -->
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
      <el-button type="primary" @click="validate">确 定</el-button>
      <el-button @click="hide">取 消</el-button>
    </span>
    <el-dialog
      title="上传图片"
      :visible.sync="uploadVisible"
      append-to-body
      destroy-on-close
      size="mini"
      custom-class="upload-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload-content-wrapper">
        <el-radio-group v-model="imgType">
          <el-radio :label="1">流程图</el-radio>
          <el-radio :label="2">矩阵图</el-radio>
        </el-radio-group>
        <div class="upload-content">
          <el-upload
            class="upload-demo"
            action="#"
            accept="image/*"
            :on-remove="handleRemove"
            :on-error="handleError"
            :on-change="handleChange"
            :auto-upload="false"
            :limit="100"
            multiple
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传图片文件</div>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmUpload" :loading="confirmLoading">确 定</el-button>
        <el-button @click="cancelUpload">取 消</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
// import CustomPaginator from '@/components/public/Pagination.vue'
import TableList from '@/components/public/TableList.vue'
import Toolbar from '@/components/public/Toolbar.vue'
import SearchItem from '@/components/public/SearchItem.vue'
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import msgMixin from './msgMixin'

const fileModuleObj = {
  1: '流程图',
  2: '矩阵图'
}

export default {
  name: 'NodeDialog',
  mixins: [msgMixin],
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
    },
    uploadManual: {
      type: Boolean,
      default: false
    },
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
        project: '',
        type: 1
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
      total: 0,
      uploadVisible: false,
      imgType: 1,
      manualId: '',
      fileList: [],
      typeList: [
        {
          name: '流程图',
          id: 1
        },
        {
          name: '矩阵图',
          id: 2
        }
      ],
      confirmLoading: false,
      imgLoading: null,
      getListCount: 0
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑' : '新建'
    },
    ...mapGetters(['currentDataSpaceIdGetter'])
  },
  methods: {
    formatUploadImgData (data, type = '流程图', flowId = '') {
      const filterList = data.filter(item => {
        const has = this.tags.some(tag => {
          console.log(tag, 'item')
          return tag.name === item.name
        })
        return !has
      })
      if (filterList.length !== data.length) {
        this.message.warn('有同名图片存在，请重新选择。')
        return []
      }
      this.message.success('上传成功')
      const formatData = data.map(item => ({
        img_id: -1,
        module: type,
        ...item,
        name: item.name || '无名称',
        flow_id: flowId
      }))
      return formatData
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    handleError (err, file, fileList) {
      this.fileList = fileList
      this.message.error('上传失败')
    },
    handleChange (file, fileList) {
      this.fileList = fileList
    },
    clickToUpload () {
      this.uploadVisible = true
    },
    confirmUpload () {
      if (!this.fileList.length) {
        this.message.warn('请先上传图片')
        return
      }
      const formData = new FormData()
      const imgType = this.imgType
      this.fileList.forEach(item => {
        formData.append('image', item.raw)
      })
      formData.append('file_moudle', imgType)
      formData.append('manual_id', this.manualId)
      this.confirmLoading = true
      this.$api.uploadImgByHandbook(formData).then(res => {
        const { code, data, msg } = res
        if (code !== 0) {
          this.message.warn(msg || '上传图片失败')
          return
        }
        this.uploadVisible = false
        this.tags = this.tags.concat(this.formatUploadImgData(data, fileModuleObj[imgType]))
      }).catch(err => {
        this.message.warn(err.msg || '上传图片失败')
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    cancelUpload () {
      this.uploadVisible = false
    },
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
        if (tag.img_id == row.page_id && tag.module == fileModuleObj[row.file_moudle]) {
          this.$set(row, 'checked', false)
        }
      })
      this.tags.splice(index, 1)
    },
    changeTableCheckbox (row) {
      if (!row.checked) {
        const index = this.tags.findIndex(tag => tag.img_id == row.page_id && tag.module == fileModuleObj[row.file_moudle])
        if (index !== -1) {
          this.tags.splice(index, 1)
        }
        return
      }
      this.imgLoading = Loading.service({
        lock: true,
        text: '图片转换中，可能会花费几分钟的时间，请耐心等待。',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.8)'
      })
      if (this.toolbar.type === 2) {
        this.handleMatrixToImg(row)
      } else {
        this.currentRow = row
        this.$emit('changeTableItem', row)
      }
    },
    getFile (data = {}) {
      this.$emit('initIframe')
      if (data.data) {
        this.$api.xmlToImgApi({
          preview: data.data.split('base64,')[1],
          file_name: this.currentRow.page_name,
          sheet_id: this.currentRow.page_id,
          file_moudle: 1
        }).then(res => {
          const { code, data } = res
          if (code === 0) {
            this.tags = this.tags.concat(this.formatUploadImgData(data, '流程图', this.currentRow.flow_id))
            return
          }
          this.$set(this.currentRow, 'checked', false)
          this.message.error('图片上传失败')
        }).catch(() => {
          this.$set(this.currentRow, 'checked', false)
          this.message.error('图片上传失败')
        }).finally(() => {
          this.imgLoading && this.imgLoading.close()
        })
        return
      }
      this.$set(this.currentRow, 'checked', false)
      this.imgLoading && this.imgLoading.close()
      this.message.error('图片上传失败')
    },
    handleMatrixToImg (row) {
      const { page_name, page_id } = row
      this.$api.matrixToImgApi({
        data: JSON.stringify([{
          page_name,
          page_id,
          file_moudle: 2
        }])
      }).then(res => {
        console.log(res)
        const { code, data } = res
        if (code === 0) {
          this.tags = this.tags.concat(this.formatUploadImgData(data, '矩阵图', row.flow_id))
          this.message.success('添加成功')
        }
      }).catch(err => {
        this.message.warn(err.msg || '添加失败')
        this.$set(row, 'checked', false)
      }).finally(() => {
        this.imgLoading && this.imgLoading.close()
      })
    },
    getList () {
      this.getListCount++
      const curCount = this.getListCount
      this.tableData = []
      this.total = 0 
      this.loading = true
      this.$api.getVisioByCatalogId({
        keywords: this.toolbar.name,
        folder_id: this.toolbar.project,
        file_moudle: this.toolbar.type,
        company_id: this.currentDataSpaceIdGetter,
        page: this.current,
        page_size: this.size
      }).then(res => {
        if (curCount !== this.getListCount) {
          return
        }
        const { code, data, total } = res
        if (code === 0) {
          const formatData = data.map(item => {
            if (this.tags.some(tag => tag.img_id == item.page_id && tag.module == fileModuleObj[item.file_moudle])) {
              item.checked = true
            }
            return item
          })
          this.tableData = formatData
          this.total = total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.current = 1
      this.getList()
    },
    handleReset () {
      this.toolbar = {
        name: '',
        project: '',
        type: 1
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
    },
    add ({ data, node, showTable = false }) {
      this.commonHandleDialog(node, data)
      this.showTable = showTable
      this.handleSearch()
    },
    edit ({ data, node }) {
      const { name } = data
      this.form.name = name
      this.commonHandleDialog(node, data)
      this.isEdit = true
      this.showTable = true
      this.getCatelogContent()
      this.handleSearch()
    },
    getCatelogContent () {
      this.$api.getHandbookCatalogContent({
        manual_id: this.manualId,
        title_id: this.currentData.id
      }).then(res => {
        const { code, data = [] } = res
        if (code === 0) {
          this.tags = data.map(item => {
            return {
              img_id: item.img_sheet_id,
              name: item.img_name,
              localpath: item.img_path,
              module: item.img_type,
              flow_id: item.img_flow_id,
              ...item
            }
          })
        }
      }).catch(err => {
        this.message.error(err.msg || '加载当前标题数据失败，请重试')
      })
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
        project: '',
        type: 1
      }
    },

    validate () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.handleSave()
      })
    },

    handleSave () {
      const form = { ...this.form }
      this.$emit('saveNode', {
        form,
        tags: this.tags,
        node: this.currentNode,
        data: this.currentData,
        isEdit: this.isEdit,
        cb: this.saveCallback
      })
    },
    saveCallback () {
      this.visible = false
      console.log('callback')
    }
  },
  created () {
    this.manualId = this.$route.query.manual_id
  },
  watch: {
    visible (val) {
      if (!val) {
        this.hide()
      }
    },
    uploadVisible (val) {
      if (!val) {
        this.fileList = []
        this.imgType = 1
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
  width: 900px;
  position: relative;

  .upload-img-wrapper {
    position: absolute;
    top: 80px;
    right: 16px;
  }

  .el-dialog__footer{
    padding-top: 0;
    text-align: center;
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
}
.upload-content-wrapper {
  padding: 0 24px;

  .upload-content {
    margin-top: 16px;
  }

  .el-icon-close {
    text-align: center;
  }
}

.upload-dialog {
  .el-dialog__body, .el-dialog__footer {
    text-align: center;
  }
}
</style>
