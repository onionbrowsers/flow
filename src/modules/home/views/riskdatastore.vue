<template>
    <div id="systemctrl">
        <div class="addnewrisk">
            <div class="serach">
                <el-input  class="elinput" clearable v-model="riskName" placeholder="请输入风险名称"></el-input>
                <el-select v-if="isZhlicom" class="flodselect" clearable  filterable @change="departChangeId" v-model="secondary_id" placeholder="请选择所属企业">
                    <el-option v-for="it in secondaryList" :key="it.id" :label="it.departname" :value="it.id"></el-option>
                </el-select>
                <el-select  class="flodselect threewidth" clearable  v-model="flodId" placeholder="请选择所属部门">
                    <el-option v-for="it in flodList" :key="it.id" :label="it.name" :value="it.id"></el-option>
                </el-select>
                <el-button type="primary" class="w90btn" @click="searchInfo()">查询</el-button>
            </div>
            <el-button type="primary" class="w90btn" @click="downRisk()" icon="el-icon-download">下载</el-button>
        </div>
        <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            border height="calc(100% - 120px)"
            style="width: 100%; margin-top: 20px">
            <el-table-column
                type="index"
                label="序号"
                width="80">
                <template slot-scope="scope" >
                   {{list.findIndex(v=>v.excel_id == scope.row.control_parent)+1}}
                   <!-- {{(page-1)*pageSize+list.findIndex(v=>v.excel_id == scope.row.control_parent)+1}} -->
                </template>
            </el-table-column>
            <el-table-column
                prop="process_number"
                label="风险名称"
                width="220"
                class-name="riskname"
               >
            </el-table-column>
            <el-table-column
                prop="three_risk"
                label="三级风险名称"
                 width="220"
                class-name="threewidth"
                >
            </el-table-column>
            <el-table-column
                prop="risk_description"
                label="重要风险"
                class-name="nocenter"
               >
            </el-table-column>
            <!-- <el-table-column   width="50" prop="action" label="操作">
                <template slot-scope="scope" >
                    <span class="setspan">
                        <i  class="el-icon-delete iconscope" title="删除"  @click="handleDelete(scope.row)"></i>
                    </span>
                </template>
            </el-table-column> -->
        </el-table>
        <div style="text-align: left;">
            <custom-paginator :tolital="total" :nowpage="page" slot="last" ref="paginator" class="file-paginator" @pageChange="handlePageChange"/>
        </div>
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
import CustomPaginator from './pagecom.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    CustomPaginator
  },
  data () {
    return {
      secondaryList: [], // 企业列表
      secondary_id: '', // 二级企业id
      isZhlicom: false, // 是否是显示所属企业的
      dowmActotal: 1, // 当前下载额度
      consume: 1, // 本次下载额度
      isDownTimes: false, // 下载弹窗
      flodId: '',
      flodList: [],
      tableData: [],
      dialogVisible: false,
      page: 1,
      pageSize: 15,
      total: 0, // 总数
      riskName: '', // 风险名称
      list: [],
      tempIndex: []
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter'])
  },
  mounted () {
    this.getSystemli()
    this.isZhlicom = this.currentDataSpaceIdGetter == 131
    if (this.isZhlicom) {
      this.getsecondaryS()
    } else {
      this.getFlodS()
    }
  },
  watch: {
    currentDataSpaceIdGetter (newValue, oldValue) {
      this.isZhlicom = this.currentDataSpaceIdGetter == 131
      if (this.isZhlicom) {
        this.getsecondaryS()
      } else {
        this.getFlodS()
      }
      this.getSystemli()
    },
    list: {
      handler (nv) {
        let arr = []
        let tempMergeIndex = []
        let pos
        nv.forEach((item, i) => {
          if (item.data_dict && item.data_dict.length) {
            let sourceArr = item.data_dict.map(_ => {
              return {
                process_number: item.process_number,
                ..._,
                flag: i + '',
                control_parent: item.excel_id
              }
            })
            arr.push(...sourceArr)
          } else {
            arr.push(item)
          }
        })
        this.tableData = arr
        console.log(this.tableData)
        // 处理arr，生成一个与行数相同的数组记录每一行设置的合并数
        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            tempMergeIndex.push(1)
            pos = 0
          } else {
            if (arr[i].flag && (arr[i].flag === arr[i - 1].flag)) {
              tempMergeIndex[pos] += 1
              tempMergeIndex.push(0)
            } else {
              tempMergeIndex.push(1)
              pos = i
            }
          }
        }
        this.tempIndex = tempMergeIndex
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 获取流程文件夹
    getFlodS () {
      this.$api.getUserFolder({ companyId: this.currentDataSpaceIdGetter, secondary_id: this.secondary_id }).then(res => {
        this.flodList = res.data
      }).catch(err => {
        this.$msgMnger.httpError(err)
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
    // 搜索
    searchInfo () {
      this.page = 1
      this.getSystemli()
    },
    // 下载制度清单
    downRisk () {
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
          this.suredownurl()
        }).catch(action => {
        })
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    // 下载接口
    suredownurl () {
      if (this.dowmActotal <= 0) {
        this.$msgMnger.warn('额度不足，请充值后下载')
        return
      }
      let params = {
        company_id: this.currentDataSpaceIdGetter,
        process_number: this.riskName,
        flod_id: this.flodId
      }
      this.$api.downriskDataStoreli(params).then(res => {
        if (res.code == 0) {
          this.isDownTimes = false
          let downloadURL = res.data + `?_token=${this.token}`
          this.$api.accountdownlibrary({ company_id: this.currentDataSpaceIdGetter, flow_name: '风险数据库', lines: 1 }).then()
          window.open(downloadURL)
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$msgMnger.warn(err.msg)
      })
    },
    // 选择所属企业变化
    departChangeId (val) {
      this.page = 1
      this.flodId = ''
      this.getFlodS(this.secondary_id)
      this.getSystemli()
    },
    handlePageChange (page) { // 分页搜索
      this.page = page.page
      this.pageSize = page.pagesize
      this.getSystemli()
    },
    // 获取风险数据库列表
    getSystemli () {
      let params = {
        company_id: this.currentDataSpaceIdGetter,
        page: this.page,
        page_size: this.pageSize,
        process_number: this.riskName,
        flod_id: this.flodId,
        secondary_id: this.secondary_id || ''
      }
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getriskDataStoreli(params).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        if (res.code == 0) {
          // this.tableData = res.data.items||[]
          this.list = res.data || []
          this.total = res.total || 0
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    // 行数合并
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      let _this = this
      if (columnIndex === 1 || columnIndex === 0) {
        return { rowspan: this.tempIndex[rowIndex], colspan: 1 }
      }
    },
    // 删除
    handleDelete (data) {
      let _this = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.deleMySystem(data.id).then(res => {
          if (res.code == 0) {
            _this.$msgMnger.success('操作成功')
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
.flodselect{
    margin-right:10px;
}
/deep/ .threewidth{
    width:210px;
    // width: 23%;
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td{
     background-color: #fff;
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
    background-color: #fff;
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
.addnewrisk{
    display:flex;
    .w90btn{
        width:90px;
    }
    .serach{
        flex:1;
        text-align: left;
        .elinput{
            // min-width:200px;
            width:300px;
            margin-right:10px;
        }
    }
}
/deep/ .riskname{
    min-width:120px;
    width:calc(30% - 80px);
}
.setspan{
    text-align: center;
    display: block;
    width:100%;
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
 /deep/ .el-table__body .nocenter div{
    text-align:left !important;
}
</style>
