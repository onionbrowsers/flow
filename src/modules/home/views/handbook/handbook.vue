<template>
  <div class="handbook">
    <div class="handbooktitle">
        <div class="titlebook">新建手册</div>
        <div class="backbtn">
            <el-button  class="w90btn "  @click="reback()">返回</el-button>
        </div>
    </div>
    <div class="addnewrisk">
        <div class="serach">
            <span class="serachtitle">手册名称：</span>
            <el-input  class="elinput" clearable v-model="book_name" placeholder="请输入手册名称"></el-input>
        </div>
        <div class="serachtitle bookcataname">手册目录：</div>
        <div class="bookcatalo">
            <el-tree :data="bookLiData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <div >
            <el-button type="primary" class="w90btn" @click="editBookli()">编辑</el-button>
            <!-- <el-button type="danger" class="w90btn" >删除</el-button> -->
            <el-button  class="w90btn" @click="resetBookli()">重置</el-button>
        </div>
    </div>
    <el-tabs style="margin-top:20px;" v-model="navigation" @tab-click="handleTabClick">
        <el-tab-pane label="全部内容" :name="1"></el-tab-pane>
        <el-tab-pane label="流程图" :name="2"></el-tab-pane>
        <el-tab-pane label="风险控制矩阵" :name="3"></el-tab-pane>
    </el-tabs>
    <el-table
        :data="tableData"
        border height="calc(100% - 120px)"
        style="width: 100%; margin-top: 20px">
        <el-table-column
            prop="manual_name"
            label="内容名称"
            >
            <template slot-scope="scope" >
                <a  class="syctema"  @click="clickSystemName(scope.row['manual_name'])">{{scope.row['manual_name']}}</a>
            </template>
        </el-table-column>
        <el-table-column
            prop="user_name"
            label="目录位置"
            >
        </el-table-column>
        <el-table-column
            prop="folder_name"
            label="来源"
            >
        </el-table-column>
        <el-table-column
            prop="create_type"
            label="类型"
            class-name="nocenter"
            >
            <template slot-scope="scope" >
                {{scope.row.create_type}}
            </template>
        </el-table-column>
        <el-table-column
            prop="create_time"
            label="创建时间"
            >
        </el-table-column>
        <el-table-column   width="80" prop="action" label="操作">
            <template slot-scope="scope" >
                <span class="setspan">
                    <i  class="el-icon-download iconscope mr10" title="修改"  @click="changeBookImg(scope.row)"></i>
                    <i  class="el-icon-delete iconscope" title="删除"  @click="handleDeleteimg(scope.row)"></i>
                </span>
            </template>
        </el-table-column>

    </el-table>
    <div style="text-align: left;">
        <custom-paginator :tolital="total" :nowpage="page" slot="last" ref="paginator" class="file-paginator" @pageChange="handlePageChange"/>
    </div>

    <el-dialog
        title="编辑目录信息"
        :close-on-click-modal="false"
        custom-class="file-edit-dialog"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        :footer="null"
        width="40%"
        >
        <el-form style="padding:0 10px;width:90%;text-align: left;" :model="forbookm" :label-position="'right'" label-width="100px">
            <el-form-item label="新增目录级别" prop="booklevel">
                <el-radio-group v-model="forbookm.booklevel" @change="changebooklevel">
                    <el-radio :label="1">一级</el-radio>
                    <el-radio :label="2">二级</el-radio>
                    <el-radio :label="3">三级</el-radio>
                    <el-radio :label="4">四级</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上级目录" prop="paraentBookliid">
                <el-select  clearable  v-model="forbookm.paraentBookliid" placeholder="请选择上级目录">
                    <!-- <el-option  label="主目录" :value="-1"></el-option> -->
                    <el-option v-for="it in choiceBookli" :key="it.id" :label="it.title_name" :value="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="当前目录" prop="booklistname">
                <el-input v-model="forbookm.booklistname"></el-input>
            </el-form-item>
        </el-form>
        <div>
            <el-button  size="small" @click="cancelEidtbook">取消</el-button>
            <el-button type="primary" size="small" @click="submitHandleBook">确认</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CustomPaginator from '../pagecom.vue'
export default {
  components: {
    CustomPaginator
  },
  data () {
    return {
      navigation: 1, // tabs
      book_name: '', // 手册名称
      bookId: '', // 手册id
      tableData: [], // 数据列表
      page: 1,
      pageSize: 15,
      total: 0, // 总数
      dialogVisible: false, // 编辑目录弹窗
      choiceBookli: [], // 根据级别回显目录
      forbookm: {
        booklevel: '',
        paraentBookliid: '',
        booklistname: ''
      }, // 新增目录数据
      bookLiData: [], // 目录列表
      defaultProps: { children: 'children', label: 'name' }// 树形列表展示字段
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter',
      'personalDataSpaceGetter'])
  },
  mounted () {
    console.log(this.personalDataSpaceGetter)
    if (this.bookId) {
      this.getBookli()
    }
  },
  methods: {
    // 返回
    reback () {
      this.$router.back()
    },
    // 保存手册名称
    saveBookname () {
      if (!this.book_name) return
      let params = {
        company_id: this.currentDataSpaceIdGetter,
        user_name: this.personalDataSpaceGetter.user_name,
        user_id: this.personalDataSpaceGetter.user_id,
        manual_name: this.book_name.trim()
      }
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.saveNewCatalogName(params).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        if (res.code == 0) {
          this.bookId = res.data.id
          this.getParentCatage()
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    // 目录树形点击
    handleNodeClick (data) {

    },
    // 编辑目录
    editBookli () {
      if (!this.book_name && !this.bookId) {
        this.$msgMnger.warn('请先输入手册名称')
        return
      }
      this.forbookm.booklevel = 1
      if (!this.bookId) {
        this.saveBookname()
      } else {
        this.getParentCatage()
      }
      this.forbookm.paraentBookliid = ''
      this.forbookm.booklistname = ''
      this.dialogVisible = true
    },
    // 选择目录级别
    changebooklevel (val) {
      this.getParentCatage()
    },
    // 获取上级目录
    getParentCatage () {
      if (!this.bookId) return
      let params = {
        manual_id: this.bookId,
        title_level: this.forbookm.booklevel
      }
      this.$api.getParentCatalogBook(params).then(res => {
        if (res.code == 0) {
          this.choiceBookli = res.parent_title_list || []
        } else {
          this.$msgMnger.warn(res.msg)
        }
      })
    },
    // 取消编辑目录
    cancelEidtbook () {
      this.dialogVisible = false
    },
    // 确认编辑目录
    submitHandleBook () {
      if (!this.forbookm.booklevel ||
            !this.forbookm.paraentBookliid ||
            !this.forbookm.booklistname) {
        this.$msgMnger.warn('请先填写完整信息!')
        return
      }
      let params = {
        manual_id: this.bookId,
        title_level: this.forbookm.booklevel,
        parent_title_id: this.forbookm.paraentBookliid,
        title_name: this.forbookm.booklistname
      }
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.editSaveCatalogBook(params).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        if (res.code == 0) {
          this.dialogVisible = false
          this.getBookli()
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    // 重置手册目录
    resetBookli () {
      let _this = this
      this.$confirm('此操作将清空手册目录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.resetCatalogbook({ isreset: true, manual_id: this.bookId }).then(res => {
          if (res.code == 0) {
            _this.$msgMnger.success('操作成功')
            _this.getBookli()
          } else {
            _this.$msgMnger.warn(res.msg)
          }
        }, err => {
          _this.$msgMnger.warn(err.msg)
        })
      }).catch(() => {

      })
    },
    // 切换tab
    handleTabClick (tab, event) {
      console.log(tab, event)
      this.page = 1
      this.getAllBookli()
    },
    // 获取手册目录列表
    getBookli () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getCatalogBookLiById({ manual_id: this.bookId }).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        if (res.code == 0) {
          this.dialogVisible = false
          this.bookLiData = res.data || []
          this.navigation = 1
          this.page = 1
          this.getAllBookli()
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    // 获取手册所有流程图
    getAllBookli () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getCatalogPageImg(this.bookId, { navigation: this.navigation, page: this.page, page_size: this.pageSize }).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        if (res.code == 0) {
          this.tableData = res.data || []
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    // 修改手册流程图
    changeBookImg (data) {

    },
    // 删除手册流程图
    handleDeleteimg (data) {

    },
    handlePageChange (page) { // 分页搜索
      this.page = page.page
      this.pageSize = page.pagesize
      this.getAllBookli()
    }
  }
}
</script>

<style lang="scss" scoped>
.handbooktitle{
    display: flex;
    .backbtn{
        flex:1;
        text-align: right;
    }
}

.handbook{
    height: 100%;
    box-sizing: border-box;
    padding: 24px;
    background: white;
    overflow-y: auto;
    .serachtitle{
        font-size: 16px;
        font-weight: 500;
    }
    .bookcataname{
        text-align: left;
        margin:10px 0;
    }
    .bookcatalo{
        height:300px;
        overflow: auto;
        text-align: center;
        width: 70%;
        margin-left: 30%;
        /deep/ .el-tree-node__label{
            font-size:16px;
        }
    }
    .titlebook{
        text-align: left;
        margin-bottom:10px;
        font-size: 18px;
        font-weight: 600;
    }
    .addnewrisk{
        .w90btn{
            width:90px;
        }
        .serach{
            text-align: left;
            border-bottom:1px solid #ccc;
            padding-bottom:10px;
            .elinput{
                // min-width:200px;
                width:300px;
                margin-right:10px;
            }
        }
    }
}
</style>
