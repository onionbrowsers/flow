<template>
    <div id="systemctrl">
        <div class="addnewrisk">
             <div class="serach">
                 <el-date-picker
                     v-model="timeRange"
                     type="daterange" class="elinput"
                     @change="timeRaChange"
                     value-format="yyyy-MM-dd"
                     range-separator="至"
                     start-placeholder="开始日期"
                     end-placeholder="结束日期">
                 </el-date-picker>
                 <el-select v-if="isZhlicom" class="flodselect" clearable  filterable @change="departChangeId" v-model="secondary_id" placeholder="请选择所属企业">
                    <el-option v-for="it in pridepartList" :key="it.id" :label="it.departname" :value="it.id"></el-option>
                </el-select>
                 <el-select  class="flodselect" clearable filterable @change="flodChangeId" v-model="flodId" placeholder="请选择所属部门">
                    <el-option v-for="it in flodList" :key="it.id" :label="it.name" :value="it.id"></el-option>
                </el-select>
                <el-select  class="flodselect" style="margin-bottom:10px" filterable  clearable @change="ownerChange" v-model="owner_id" placeholder="请选择创建者">
                    <el-option v-for="it in ownerList" :key="it.id" :label="it.username" :value="it.id"></el-option>
                </el-select>
            </div>
            <el-button type="primary" class="w90btn"  style="height:40px" @click="newaddrisk">上传</el-button>
        </div>
        <div style="text-align: left;">
            <el-input  class="elinput" clearable v-model="matrixName" placeholder="请输入文件名称"></el-input>
            <el-button type="primary" class="w90btn" @click="searchInfo()">查询</el-button>

        </div>
        <el-table
            :data="tableData"
            border height="calc(100% - 153px)"
            style="width: 100%; margin-top: 20px">
            <el-table-column
                type="index"
                   label="序号"
                width="80">
                <template slot-scope="scope" >
                   {{(page-1)*pageSize+scope.$index+1}}
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
               >
               <template slot-scope="scope" >
                    <a  class="syctema"  @click="clickSystemName(scope.row)">{{scope.row['name']}}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="user_name"
                label="创建者"
                >
            </el-table-column>
            <el-table-column
                prop="departname"
                label="所属企业"
                >
            </el-table-column>
            <el-table-column
                prop="folder_name"
                label="所属部门"
                >
            </el-table-column>
            <el-table-column
                prop="upload_date"
                label="上传时间"
               >
            </el-table-column>
            <el-table-column   width="80" prop="action" label="操作">
                <template slot-scope="scope" >
                    <span class="setspan">
                        <i  class="el-icon-download iconscope mr10" title="下载"  @click="suredownurl(scope.row)"></i>
                        <i  class="el-icon-delete iconscope" title="删除"  @click="handleDelete(scope.row)"></i>
                    </span>
                </template>
            </el-table-column>

        </el-table>
        <div style="text-align: left;">
            <custom-paginator :tolital="total" :nowpage="page" slot="last" ref="paginator" class="file-paginator" @pageChange="handlePageChange"/>
        </div>
        <el-dialog
        title="上传文件"
        :close-on-click-modal="false"
        custom-class="file-edit-dialog"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        :footer="null"
        width="30%"
        >
        <el-select v-if="isZhlicom" class="flodselect" clearable  filterable @change="departChangeId" v-model="secondary_id" placeholder="请选择所属企业">
            <el-option v-for="it in pridepartList" :key="it.id" :label="it.departname" :value="it.id"></el-option>
        </el-select>
        <el-select  class="flodselect mb10" clearable  filterable v-model="flodId" placeholder="请选择所属部门">
            <el-option v-for="it in flodList" :key="it.id" :label="it.name" :value="it.id"></el-option>
        </el-select>
        <file-upload-comp class="upload" :accept="'.xlsx, .xls, .doc, .docx, .tar, .rar, .zip'" ref="fileUploadCom" @uploadSuccess="handleUploadSuccess"/>
        <div>
            <el-button type="primary" size="small" @click="submitHandle">提交</el-button>
            <el-button  size="small" @click="cancelHan">取消</el-button>
        </div>
        </el-dialog>
        <!-- 下载提示 -->
        <el-dialog
            title="提示"
            :visible.sync="isDownTimes"
            class="downfiletimes"
            v-if="isDownTimes"
           >
            <span class="left">当前剩余额度：</span>
            <span class="right ">{{dowmActotal}} ,</span>
            <span class="left second"> 本次下载消耗额度：</span>
            <span class="right redfont">-{{consume}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isDownTimes = false">取 消</el-button>
                <el-button type="primary" @click="suredownurl()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Base64 } from 'js-base64'
import $ from 'jquery'
import FileUploadComp from '../components/public/file-upload-comp.vue'
import CustomPaginator from './pagecom.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    FileUploadComp, CustomPaginator
  },
  data () {
    return {
      pridepartList: [], // 企业列表
      secondary_id: '', // 企业id
      isZhlicom: false, // 是否是显示所属企业的
      flodList: [],
      flodId: '', // 文件夹id
      matrixName: '', // 文件名称
      dowmActotal: 1, // 当前下载额度
      consume: 1, // 本次下载额度
      isDownTimes: false, // 下载弹窗
      sysName: '', // 制度名称
      tableData: [],
      dialogVisible: false,
      page: 1,
      pageSize: 15,
      total: 0, // 总数
      owner_id: '', // 创建者id
      timeRange: [], // 选择时间
      ownerList: []// 创建者列表
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter'])
  },
  mounted () {
    this.isZhlicom = this.currentDataSpaceIdGetter == 131
    this.getSystemli()

    if (this.isZhlicom) {
      this.getpridepartS()
    } else {
      this.getFlodS()
    }
  },
  watch: {
    currentDataSpaceIdGetter (newValue, oldValue) {
      this.isZhlicom = this.currentDataSpaceIdGetter == 131
      if (this.isZhlicom) {
        this.getpridepartS()
      } else {
        this.getFlodS()
      }
      this.getSystemli()
    }
  },
  methods: {
    // 点击名称
    clickSystemName (rows) {
      this.$api.downmyformfile(rows.id).then(res => {
        if (res.code == 0) {
          let downloadURL = res.data + `?_token=${this.$store.getters.token}`
          // window.location.origin+
          window.open(window.location.origin + '/preview/onlinePreview?url=' + encodeURIComponent(Base64.encode(window.location.origin + downloadURL)))
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$msgMnger.warn(err.msg)
      })
    },
    // 获取流程文件夹
    getFlodS () {
      this.$api.getUserFolder({ companyId: this.currentDataSpaceIdGetter, secondary_id: this.secondary_id }).then(res => {
        this.flodList = res.data || []
        this.memberLibList()
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    // 获取企业列表
    getpridepartS () {
      this.$api.getSecondaryLi(this.currentDataSpaceIdGetter).then(res => {
        this.pridepartList = res.data || []
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    // 获取成员管理列表
    memberLibList () {
      this.ownerList = []
      let params = {
        company_id: this.currentDataSpaceIdGetter,
        secondary_id: this.secondary_id,
        folder_id: this.flodId
      }
      this.$api.memberLibList(params).then(res => {
        this.ownerList = res.data || []
      }).catch(err => {
        this.$msgMnger.error(err.msg)
      })
    },
    // 搜索
    searchInfo () {
      this.page = 1
      this.getSystemli()
    },
    // 下载制度清单
    downRisk (rows) {
      this.dowmActotal = 1
      let params = {
        // flow_id: flowId,
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.accountBilling(params).then(res => {
        let data = res.data
        // this.isDownTimes = true
        this.dowmActotal = data.last_number || 0
        this.$confirm(`当前剩余额度：${this.dowmActotal}, 本次下载消耗额度：-${this.consume}`, '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确 认',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          this.suredownurl(rows)
        }).catch(action => {
        })
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    // 下载接口
    suredownurl (rows) {
      // if (this.dowmActotal<=0) {
      //     this.$msgMnger.warn('额度不足，请充值后下载')
      //     return
      // }
      // let params = {
      //   company_id:this.currentDataSpaceIdGetter,
      //   system_name:this.sysName,
      // }
      this.$api.downmyformfile(rows.id).then(res => {
        if (res.code == 0) {
          this.isDownTimes = false
          let downloadURL = res.data + `?_token=${this.$store.getters.token}`
          // this.$api.accountdownlibrary({company_id:this.currentDataSpaceIdGetter,flow_name:'制度库',lines:1}).then()
          window.open(downloadURL)
        } else {
          this.$msgMnger.warn(res.msg)
        }
      })
    },
    // 选择所属企业变化
    departChangeId (val) {
      this.page = 1
      this.flodId = ''
      this.owner_id = ''
      this.getFlodS(this.secondary_id)
      this.getSystemli()
    },
    handlePageChange (page) { // 分页搜索
      this.page = page.page
      this.pageSize = page.pagesize
      this.getSystemli()
    },
    // 选择文件夹变化
    flodChangeId (val) {
      this.page = 1
      this.owner_id = ''
      this.memberLibList()
      this.getSystemli()
    },
    // 选择创建者变化
    ownerChange (val) {
      this.page = 1
      this.getSystemli()
    },
    // 选择时间变化
    timeRaChange (val) {
      this.timeRange = val || []
      this.page = 1
      this.getSystemli()
    },
    // 获取矩阵列表
    getSystemli () {
      let params = {
        company_id: this.currentDataSpaceIdGetter,
        page: this.page,
        page_size: this.pageSize,
        folder_id: this.flodId || '',
        name: this.matrixName,
        start_time: this.timeRange && this.timeRange.length ? this.timeRange[0] : '',
        end_time: this.timeRange && this.timeRange.length ? this.timeRange[1] : '',
        owner_id: this.owner_id || '',
        secondary_id: this.secondary_id || ''
      }
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.showmyformfile(params).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        if (res.code == 0) {
          this.tableData = res.data.items || []
          this.total = res.data.page.total || 0
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    // 新增上传文件弹窗
    newaddrisk () {
      this.dialogVisible = true
    },
    // 确认上传
    submitHandle () {
      let fileArr = this.$refs.fileUploadCom.fileArray || []
      if (!fileArr.length) {
        this.$message.error('请先选择上传的文件！')
        return
      }
      if (!this.secondary_id && this.isZhlicom) {
        this.$message.error('请先选择企业！')
        return
      }
      if (!this.flodId) {
        this.$message.error('请先选择文件夹！')
        return
      }
      let _formData = new FormData()
      _formData.append('company_id', this.currentDataSpaceIdGetter)
      if (this.isZhlicom) {
        _formData.append('secondary_id', this.secondary_id)
      }
      _formData.append('folder_id', this.flodId)
      fileArr.forEach(el => {
        _formData.append('file', el.raw)
      })
      let _token = this.$store.getters.token
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      $.ajax({
        url: '/api/v2/fc/flow/add_formfile',
        method: 'post',
        contentType: false,
        processData: false,
        dataType: 'json',
        data: _formData,
        beforeSend: XMLHttpRequest => {
          XMLHttpRequest.setRequestHeader('Authorization', 'Bearer ' + _token)
        },
        success: res => {
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
          if (res.code == 0) {
            this.dialogVisible = false
            this.$msgMnger.success('操作成功')
            this.flodId = ''
            this.getSystemli()
          } else {
            this.$msgMnger.warn(res.msg)
          }
        },
        error: err => {
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
          this.$msgMnger.warn(err.msg)
        }
      })
      // this.$api.addMySystem(_formData).then(res=>{
      //     if(res.code == 0){
      //         this.dialogVisible =false

      //     }
      // })
    },
    // 取消上传
    cancelHan () {
      this.dialogVisible = false
    },
    handleUploadSuccess (uploadId) {

    },
    // 删除制度
    handleDelete (data) {
      let _this = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.deletemyformfile(data.id).then(res => {
          if (res.code == 0) {
            _this.$msgMnger.success('操作成功')
            if (_this.tableData.length == 1 && _this.page > 1) {
              _this.page--
            }
            _this.getSystemli()
          } else {
            _this.$msgMnger.warn(res.msg)
          }
        }, err => {
          _this.$msgMnger.warn(err.msg)
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mb10{
    margin-bottom:10px;
}
.syctema{
    color: #1977af;
    cursor: pointer;
}
#systemctrl{
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  background: white;
  overflow-y: auto;
}
.flodselect{
    margin-right:10px;
     width:210px;
}
.elinput{
    // min-width:200px;
    width:260px;
    margin-right:10px;
}
.addnewrisk{
    .w90btn{
        width:90px;
    }
      display:flex;
    .serach{
        flex:1;
        text-align: left;

    }
}
.demo-ruleForm{
    width:80%;
    margin:20px auto 10px;
}
.w100{
    width:100%;
}
.setspan{
    text-align: center;
    display: block;
    width:100%;
    .el-icon-download{
        color:#1890FF;
        display:inline-block;
        margin-right:10px;
        cursor:pointer;
        font-size:16px;
    }
    .el-icon-delete{
        cursor: pointer;
        color:#db2b2b;
    }
}
/deep/ .el-table__cell div{
    color: #6c6b6b;
    font-size:16px;
     text-align:center;
}
/deep/ .el-table__header .el-table__cell div{
    text-align:center;
}
</style>
