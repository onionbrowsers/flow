<template>
    <div class="edittablejz">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="(it,i) in flowfileDetal.pages" :key="i" :label="it.name" :name="String(it.id)"></el-tab-pane>
        </el-tabs>
        <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            border
            height="70vh"
            class="tablejz"
            >
            <el-table-column  prop="process_number" label="流程名称" width="80"></el-table-column>
            <el-table-column prop="control_object" label="控制目标">
                <!-- eslint-disable-next-line vue/no-unused-vars -->
                <template slot-scope="scope">
                    <el-input type="textarea" :rows="4" v-model="list[0]['control_object']"></el-input>
                </template>
            </el-table-column>
             <el-table-column prop="level_risk" label="风险程度">
                <template slot-scope="scope">
                    <el-select class="w100" v-model="list.filter(v=>v.control_points==scope.row['control_parent'])[0]['level_risk']" placeholder="请选择风险程度">
                        <el-option v-for="it in risklevelli" :label="it.name" :key="it.name+it.value" :value="it.value"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="risk_description" label="重要风险">
                <template slot-scope="scope">
                    <el-input type="textarea" :rows="5" v-model="list.filter(v=>v.control_points==scope.row['control_parent'])[0]['risk_description']"></el-input>
                    <!-- <el-input type="textarea" :rows="4" v-model="scope.row['risk_description']"></el-input> -->
                </template>
            </el-table-column>
            <el-table-column prop="two_risk" label="风险归类" >
                <template slot-scope="scope">
                    <riskselect :curentli="list.filter(v=>v.control_points==scope.row['control_parent'])" @closeMode="riskSeli"></riskselect>
                    <!-- <riskselect :curentli="list" @closeMode="riskSeli"></riskselect> -->
                </template>
            </el-table-column>
            <el-table-column prop="control_points" label="控制点编号" width="80" > </el-table-column>
            <el-table-column prop="control_measures"  width="200" label="主要控制措施">
                <template slot-scope="scope">
                    <el-input type="textarea" style="text-align:center" :rows="5" placeholder="例如: XX人对XX表单/文件进行审核/审议/审批，重点包括。。。”" v-model="scope.row['control_measures']"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="enforcement" label="控制部门/控制岗位">
                <template slot-scope="scope">
                    <el-input type="textarea" placeholder="请输入控制部门/控制岗位" :rows="4" v-model="scope.row['enforcement']"></el-input>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="control_frequency" label="控制行为出现频率">
                <template slot-scope="scope">
                    <el-select class="w100" v-model="scope.row['control_frequency']" placeholder="请选择控制行为出现的频率">
                        <el-option v-for="it in ctrlShowTimesli" :label="it.name" :key="it.name+it.value" :value="it.value"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="control_properties" label="控制属性">
                <template slot-scope="scope">
                    <el-select class="w100" v-model="scope.row['control_properties']" placeholder="请选择控制属性">
                        <el-option label="关键控制" :value="1"></el-option>
                        <el-option label="一般控制" :value="2"></el-option>
                    </el-select>
                </template>
            </el-table-column> -->
            <el-table-column prop="control_evidence" label="控制证据">
                <template slot-scope="scope">
                    <el-input type="textarea" :rows="4" v-model="scope.row['control_evidence']"></el-input>
                </template>
            </el-table-column>
             <el-table-column prop="control_system" label="制度索引" width="80">
                 <template >
                     <a class="syctema" v-if="control_systeminfo" @click="clickSystemName">{{control_systeminfo}}</a>
                     <a v-else >{{control_systeminfo||''}}</a>
                 </template>
             </el-table-column>
        </el-table>
        <div class="btnbom">
            <div class="btnbomdiv">
                <el-button @click="submitRisk" type="primary">确认</el-button>
                <el-button  @click="cancelRisk">取消</el-button>
            </div>
             <!-- <span @click="downloadHandle()">
                 <i class="el-icon-download"></i>
                 <span class="db">下载</span>
            </span> -->
             <el-button class="downbtn" @click="downloadHandle()">
                 <i class="el-icon-download"></i>
                 <span class="db">下载</span>
            </el-button>
            <!-- <div class="bar-button" size="mini" @click="downloadHandle()">
                <svg class="icon flow-type-icon" aria-hidden="true">
                    <use :xlink:href="'#iconxiazaimorenbeifen'"></use>
                </svg>
                <div>下载</div>
            </div> -->
                 <el-radio-group class="downriado" v-model="downradio">
                    <el-radio :label="1">当前</el-radio>
                    <el-radio :label="2">全部</el-radio>
                </el-radio-group>
        </div>

        <!-- <iframe :src="pdfUrl" style="width:100%; height:100%" frameborder="0" scrolling="auto"></iframe> -->
    </div>
</template>

<script>
import riskselect from './flowfile-edit-toppriskselect.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    riskselect
  },
  props: ['flowDetal', 'currentPageId', 'flowId', 'filename'],
  data () {
    return {
      dowmActotal: 1, // 当前下载额度
      consume: 1, // 本次下载额度

      flowfileDetal: {},
      downradio: 1,
      activeName: '', // tabs当前页
      tableData: [], // 数据列表
      ctrlShowTimesli: [
        { name: '每年一次', value: 1 }, { name: '每季度一次', value: 2 }, { name: '每月一次', value: 3 },
        { name: '每周一次', value: 4 }, { name: '按需不定期', value: 5 }
      ], // 控制行为频率
      risklevelli: [{ name: '重大风险', value: 1 }, { name: '中等风险', value: 2 }, { name: '一般风险', value: 3 }],
      list: [],
      tempIndex: [],
      pdfUrl: ''
    }
  },
  watch: {
    list: {
      handler (nv) {
        // let arr = [];
        // let tempMergeIndex = [];
        // let pos;
        // nv.forEach((item, i) => {
        //     if (item.matrix && item.matrix.length) {
        //         let sourceArr = item.matrix.map(_ => {
        //             return {
        //                 // control_object:item.control_object,
        //                 // one_risk:item.one_risk,
        //                 process_number:item.process_number,
        //                 // risk_description:item.risk_description,
        //                 // two_risk:item.two_risk,
        //                 ..._,
        //                 flag: i + '',
        //                  control_parent:item.control_points,
        //                 // control_points: item.control_points
        //             };
        //         });
        //         arr.push(...sourceArr);
        //     } else {
        //         arr.push(item);
        //     }
        // });
        // this.tableData = arr;
        // // 处理arr，生成一个与行数相同的数组记录每一行设置的合并数
        // for (let i = 0; i < arr.length; i++) {
        //     if (i === 0) {
        //         tempMergeIndex.push(1);
        //         pos = 0;
        //     } else {
        //         if (arr[i].flag && (arr[i].flag === arr[i - 1].flag)) {
        //             tempMergeIndex[pos] += 1;
        //             tempMergeIndex.push(0);
        //         } else {
        //             tempMergeIndex.push(1);
        //             pos = i;
        //         }
        //     }
        // }
        // this.tempIndex = tempMergeIndex;
      },
      deep: true,
      immediate: true,
      control_systeminfo: ''// 控制制度
    },
    flowId () {
      this.getDetails()
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter'])
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      this.$api.getFlowfileDetail(this.flowId).then(res => {
        if (res.code == 0) {
          this.flowfileDetal = res.data || this.flowDetal
          // 获取详细流程信息
          this.activeName = this.currentPageId ? String(this.currentPageId) : this.flowfileDetal.pages && this.flowfileDetal.pages[0] ? String(this.flowfileDetal.pages[0].id) : ''
          this.getJzInfo()
        } else {
          this.flowfileDetal = this.flowDetal
        }
      })
    },

    // 下载查看剩余下载次数
    downloadHandle (type) {
      if (!this.flowfileDetal.hint.length) {
        this.$msgMnger.warn('请先保存本流程图，再进行下载!!!')
        return
      }
      this.dowmActotal = 1
      let params = {
        flow_id: this.flowId,
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.accountBilling(params).then(res => {
        let data = res.data
        this.dowmActotal = data.last_number || 0
        if (this.downradio == 1) {
          this.consume = this.flowfileDetal.hint.filter(v => v.page == this.activeName).length
        } else {
          this.consume = this.flowfileDetal.hint.length
        }
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
      if (this.downradio == 1) {
        let arrd = this.flowfileDetal.hint.filter(v => v.page == this.activeName)
        if (this.dowmActotal < this.consume) {
          this.$msgMnger.warn('额度不足，请充值后下载')
          return
        }
        this.download(JSON.stringify(arrd))
      } else {
        if (this.dowmActotal < this.consume) {
          this.$msgMnger.warn('额度不足，请充值后下载')
          return
        }
        let arrsd = JSON.stringify(this.flowfileDetal.hint)
        this.download(arrsd)
      }
    },
    download (data) {
      let params = {
        data: data,
        name: this.flowfileDetal.name
      }
      this.$api.lcAlldownmatrix(params).then(res => {
        if (res.code == 0) {
          let downloadURL = res.data + `?_token=${this.token}`
          this.$api.accountdownlibrary({ company_id: this.currentDataSpaceIdGetter, flow_name: this.filename, lines: this.consume }).then()
          window.open(downloadURL)
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$msgMnger.warn(err.msg)
      })
    },
    handleClick (val, e) {
      this.activeName = val._props.name
      this.getJzInfo()
    },
    // 点击控制制度
    clickSystemName () {
      let params = {
        control_system: this.control_systeminfo,
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.getctrlSystemName(params).then(res => {
        if (res.code == 0) {
          window.open(`/fcFlowfilePdf/${this.control_systeminfo}/${this.currentDataSpaceIdGetter}`)
          // this.pdfUrl = 'http://172.16.20.54:8022/api/v2'+res.data
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$msgMnger.warn(err.msg)
      })
    },

    // 获取矩阵信息
    getJzInfo () {
      if (this.flowfileDetal) {
        this.list = []
        this.$api.getRiskJuzInfo(Number(this.activeName)).then(res => {
          if (res.code == 0) {
            this.list = res.data.data_value || []
            this.control_systeminfo = res.data.control_system || ''
            this.list.forEach(v => {
              v.excel_id = Number(this.activeName)
              v.folder_id = Number(this.flowfileDetal.folder_id)
              v.company_id = this.currentDataSpaceIdGetter
              v.one_risk = v.one_risk == '-1' ? null : v.one_risk
              v.two_risk = v.two_risk == '-1' ? null : v.two_risk
              v.four_risk = v.four_risk == '-1' ? null : v.four_risk
              v.three_risk = v.three_risk == '-1' ? null : v.three_risk
              v.level_risk = v.level_risk == '-1' ? null : v.level_risk
              if (v.matrix) {
                v.matrix.forEach(b => {
                  b.control_frequency = b.control_frequency == '-1' ? null : b.control_frequency
                  b.control_properties = b.control_properties == '-1' ? null : b.control_properties
                })
              }
              v.risk_description = v.risk_description ? v.risk_description : '由于'
            })
            this.list[0].control_object = this.list[0].control_object ? this.list[0].control_object : '保证'
            let arr = []
            let tempMergeIndex = []
            let pos
            this.list.forEach((item, i) => {
              if (item.matrix && item.matrix.length) {
                let sourceArr = item.matrix.map(_ => {
                  return {
                    // control_object:item.control_object,
                    // one_risk:item.one_risk,
                    process_number: item.process_number,
                    // risk_description:item.risk_description,
                    // two_risk:item.two_risk,
                    ..._,
                    flag: i + '',
                    control_parent: item.control_points
                  }
                })
                arr.push(...sourceArr)
              } else {
                arr.push(item)
              }
            })
            this.tableData = arr
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
          } else {
            this.$msgMnger.warn(res.msg)
          }
        })
      }
    },
    // 获取风险分类
    riskSeli (data) {
      if (data) {
        this.list.forEach(v => {
          if (v.number_id == data.number_id) {
            v.one_risk = data.one_risk
            v.two_risk = data.two_risk
            v.four_risk = data.four_risk
            v.three_risk = data.three_risk
          }
        })
      }
    },
    // 提交
    submitRisk () {
      this.list.forEach(v => {
        v.control_object = this.list[0].control_object
        v.matrix = this.tableData.filter(b => b.control_parent == v.control_points)
      })
      // if(this.list.filter(v=>!v.one_risk||!v.two_risk).length){
      //     this.$msgMnger.warn('请选择风险归类！')
      //     return
      // }
      // if(this.tableData.filter(v=>!v.control_frequency).length){
      //     this.$msgMnger.warn('请选择控制行为出现频率！')
      //     return
      // }
      // if(this.tableData.filter(v=>!v.control_properties).length){
      //     this.$msgMnger.warn('请选择控制属性！')
      //     return
      // }
      console.log(this.list)
      let params = {
        control_system: this.control_systeminfo,
        data: JSON.stringify(this.list)
      }
      this.$api.changeRiskJuzInfo(Number(this.activeName), params).then(res => {
        if (res.code == 0) {
          this.$msgMnger.success('操作成功！')
          this.$emit('closeModel', true)
        } else {
          this.$msgMnger.warn(res.msg)
        }
      })
    },
    // 取消提交
    cancelRisk () {
      this.$emit('closeModel', false)
    },
    // 行数合并
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      let _this = this
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 9) {
        if (rowIndex % _this.tableData.length === 0) {
          return { rowspan: _this.tableData.length, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
      if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
        return {
          rowspan: this.tempIndex[rowIndex],
          colspan: 1
        }
        // if (rowIndex % (_this.tableData.length) === 0) {
        //     return {rowspan: _this.tableData.length, colspan: 1 };
        // } else {
        //     return { rowspan: 0,  colspan: 0 };
        // }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.downriado{
    margin:5px 10px 0;
    vertical-align: middle;
    /deep/ .el-radio{
        line-height:35px;
        margin-right: 15px;
    }
}

    .downbtn{
        margin-top:5px;
        padding: 0px 10px;
        font-size: 12px;
        height: 35px;
        vertical-align: middle;
    }
.btnbom{
    margin:15px auto;
    text-align: center;
    padding-bottom:20px;
    display:flex;
    .btnbomdiv{
        padding-left: 258px;
        flex:1;
    }
}
.edittablejz{
    padding:0 10px;
    .tablejz{
        width: 100%;
        overflow: auto;
    }
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
    background-color: transparent;
}
.riskselect{
    padding:5px 0 ;
    // width:calc(100% - 20px)
}
/deep/ .el-table__cell div{
    color: #6c6b6b;
    text-align: center;
}
.syctema{
    color: #1977af;
    cursor: pointer;
}
.edittablejz{
    /deep/ .el-table td.el-table__cell,/deep/  .el-table th.el-table__cell.is-leaf,
    /deep/ .el-table td.el-table__cell,/deep/ .el-table td.el-table__cel,/deep/ .el-table--group,/deep/ .el-table--border{
        border-color:#d5d3d3    !important;
    }
    /deep/ .el-table--group::after,/deep/  .el-table--border::after,/deep/  .el-table::before{
        background-color: #d5d3d3   ;
    }

}
</style>
