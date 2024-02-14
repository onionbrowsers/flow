<template>
    <div id="riskctrl">
        <div class="addnewrisk">
            <el-button type="primary" class="w90btn" @click="newaddrisk">新增</el-button>
            <!-- <el-button type="primary" @click="getRiskli">查询</el-button> -->
        </div>
        <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px">
            <el-table-column
                prop="level"
                label="一级风险"
                width="100">
            </el-table-column>
            <el-table-column v-for="it in firstriskli" :key="it.id" :prop="it.id" :label="it.risk_name">
                <template slot-scope="scope" >
                    <div class="scopeclu" @mouseover="handleover(scope.row,scope.row[it.id])" @mouseleave="handleleave()">
                        <span  class="scopespan">{{scope.row[it.id]?scope.row[it.id].split(',')[0]:''}}</span>
                        <span class="showiconf" v-if="curId == scope.row[it.id]&&scope.row[it.id]">
                            <i  class="el-icon-delete iconscope" title="删除"  @click="handleDelete(it.id, scope.row)"></i>
                        </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div></div>
        <el-dialog
        :title="'新增风险信息'"
        :close-on-click-modal="false"
        custom-class="file-edit-dialog"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        :footer="null"
        width="40%"
        >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item class="downriado" label="新增级别" prop="risklevel">
                <el-radio-group  v-model="ruleForm.risklevel" @change="choicelevel">
                    <el-radio :label="1">二级</el-radio>
                    <el-radio :label="2">三级</el-radio>
                    <el-radio :label="3">四级</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上级风险" prop="risktype">
            <el-select class="w100" :disabled="!ruleForm.risklevel?true:false" v-model="ruleForm.risktype" placeholder="请选择风险类型">
                <el-option v-for="(it,i) in curentLevelli" :key="i" :label="it.risk_name" :value="it.id"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="当前风险" prop="scendRisk">
            <el-input :disabled="!ruleForm.risklevel?true:false" clearable v-model="ruleForm.scendRisk" placeholder="请输入风险名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="风险描述" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
            </el-form-item> -->
            <div style="text-align: center;">
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
            </div>
        </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      ruleForm: {
        scendRisk: '', risklevel: '', risktype: ''
      },
      curentLevelli: [], // 当前上级风险列表
      rules: {
        risklevel: [
          { required: true, message: '请选择新增级别', trigger: 'change' }
        ],
        risktype: [
          { required: true, message: '请选择上级风险', trigger: 'change' }
        ],
        scendRisk: [
          { required: true, message: '请输入当前风险', trigger: 'blur' }
        ]
      },
      currentData: {}, // 选择的数据
      dialogVisible: false, // 新增弹窗
      tableData: [],
      firstriskli: [{ risk_name: '战略风险', id: '1' }, { risk_name: '运营风险', id: '2' },
        { risk_name: '财务风险', id: '3' }, { risk_name: '法律风险', id: '4' }, { risk_name: '市场风险', id: '5' }], // 一级风险列表
      curId: '',
      tempIndex: []
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter'])
  },
  watch: {
    currentDataSpaceIdGetter (newValue, oldValue) {
      this.getRiskli()
    },
    tableData: {
      handler (nv) {
        let arr = this.tableData
        let tempMergeIndex = []
        let pos
        // 处理arr，生成一个与行数相同的数组记录每一行设置的合并数
        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            tempMergeIndex.push(1)
            pos = 0
          } else {
            if (arr[i].risk_level && (arr[i].risk_level === arr[i - 1].risk_level)) {
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
      deep: true
    }
  },
  mounted () {
    this.getRiskli()
  },
  methods: {
    // 选择风险级别
    choicelevel (val) {
      this.ruleForm.risklevel = val
      this.$nextTick(() => {
        this.ruleForm.scendRisk = ''
        this.ruleForm.risktype = ''
      })
      if (val == 1) {
        this.curentLevelli = [{ risk_name: '战略风险', id: '1', risk_base: '1' }, { risk_name: '运营风险', id: '2', risk_base: '2' },
          { risk_name: '财务风险', id: '3', risk_base: '3' }, { risk_name: '法律风险', id: '4', risk_base: '4' }, { risk_name: '市场风险', id: '5', risk_base: '5' }]
      } else {
        this.curentLevelli = []
        this.$api.getMyRiskLevelinfo(val, { company_id: this.currentDataSpaceIdGetter }).then(res => {
          if (res.code == 0) {
            this.curentLevelli = res.data || []
          } else {
            this.$msgMnger.warn(res.msg)
          }
        })
      }
    },
    // 获取风险列表
    getRiskli () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getMyRiskCtrl({ company_id: this.currentDataSpaceIdGetter }).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        if (res.code == 0) {
          let arrda = res.data || []
          // this.getTableDat(arrda)
          this.tableData = [...this.getTableDat(arrda, '二', 2), ...this.getTableDat(arrda, '三', 3), ...this.getTableDat(arrda, '四', 4)]
          // console.log(this.tableData,arrda.filter(v=>v.risk_level==3) )
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },

    // 新增二级风险
    newaddrisk () {
      this.currentData = {}
      this.curentLevelli = []
      this.dialogVisible = true
      this.$nextTick(() => {
        this.ruleForm.scendRisk = ''
        this.ruleForm.risktype = ''
        this.ruleForm.risklevel = ''
        // this.ruleForm.resetFields();
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let baseId = this.curentLevelli.find(v => v.id == this.ruleForm.risktype) ? this.curentLevelli.find(v => v.id == this.ruleForm.risktype).risk_base : ''
          let params = {
            risk_name: this.ruleForm.scendRisk.trim(),
            risk_level: Number(this.ruleForm.risklevel + 1),
            risk_parent: Number(this.ruleForm.risktype),
            risk_base: baseId,
            company_id: Number(this.currentDataSpaceIdGetter)
          }

          this.$api['addNewMyRisk'](params).then(res => {
            if (res.code == 0) {
              this.$msgMnger.success('操作成功')
              this.getRiskli()
              this.currentData = {}
              this.curId = ''
              this.dialogVisible = false
            } else {
              this.$msgMnger.warn(res.msg)
            }
          })
        }
      })
    },
    resetForm (formName) {
      this.dialogVisible = false
      this.currentData = {}
    },
    handleover (data, id) {
      this.currentData = data
      this.curId = id
    },
    handleleave () {
      this.currentData = {}
      this.curId = ''
    },
    // 删除
    handleDelete (id, row) {
      let _this = this
      this.$confirm(`此操作将删除风险 ${row[id].split(',')[0]}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api.deleteMyRiskInfo(row[id].split(',')[1]).then(res => {
          if (res.code == 0) {
            _this.$msgMnger.success('操作成功')
            _this.currentData = {}
            _this.curId = ''
            _this.getRiskli()
          } else {
            _this.$msgMnger.warn(res.msg)
          }
        }, err => {
          _this.$msgMnger.warn(err.msg)
        })
      }).catch(() => {
      })
    },
    // 行数合并
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      let _this = this
      if (columnIndex === 0) {
        return {
          rowspan: this.tempIndex[rowIndex],
          colspan: 1
        }
      }
      // if (columnIndex === 0) {
      //    if (rowIndex % _this.tableData.length === 0) { // 判断第一列合并成一项（目前只有二级，所以是全部）
      //         return {
      //         rowspan: _this.tableData.length,
      //         colspan: 1
      //         };
      //     } else {
      //         return {
      //             rowspan: 0,
      //             colspan: 0
      //         };
      //     }
      // }
    },

    // 筛选根据一级风险里的五个风险类型筛选列表，目前只有二级让每一行数据都包含这五个风险字段，保持每个一级风险的下级长度相等
    getTableDat (datas, name, level) {
      let onearr = { type: 1, arr: datas.filter(v => v.risk_base == 1 && v.risk_level == level) }
      let twoarr = { type: 2, arr: datas.filter(v => v.risk_base == 2 && v.risk_level == level) }
      let threearr = { type: 3, arr: datas.filter(v => v.risk_base == 3 && v.risk_level == level) }
      let fourarr = { type: 4, arr: datas.filter(v => v.risk_base == 4 && v.risk_level == level) }
      let fivearr = { type: 5, arr: datas.filter(v => v.risk_base == 5 && v.risk_level == level) }
      let max = [onearr, twoarr, threearr, fourarr, fivearr].reduce((pre, next) => {
        return pre.arr.length > next.arr.length ? pre : next
      })

      let names = name + '级风险'
      let arrdata = []
      max.arr.forEach((v, i) => {
        if (max.type == 5) {
          arrdata.push(
            {
              level: names,
              '5': v ? v.risk_name + ',' + v.id : '',
              ...v,
              '1': onearr.arr[i] ? onearr.arr[i].risk_name + ',' + onearr.arr[i].id : '',
              '2': twoarr.arr[i] ? twoarr.arr[i].risk_name + ',' + twoarr.arr[i].id : '',
              '3': threearr.arr[i] ? threearr.arr[i].risk_name + ',' + threearr.arr[i].id : '',
              '4': fourarr.arr[i] ? fourarr.arr[i].risk_name + ',' + fourarr.arr[i].id : ''

            }
          )
        }
        if (max.type == 4) {
          arrdata.push(
            {
              level: names,
              '4': v ? v.risk_name + ',' + v.id : '',
              ...v,
              '1': onearr.arr[i] ? onearr.arr[i].risk_name + ',' + onearr.arr[i].id : '',
              '2': twoarr.arr[i] ? twoarr.arr[i].risk_name + ',' + twoarr.arr[i].id : '',
              '3': threearr.arr[i] ? threearr.arr[i].risk_name + ',' + threearr.arr[i].id : '',
              '5': fivearr.arr[i] ? fivearr.arr[i].risk_name + ',' + fivearr.arr[i].id : ''

            }
          )
        }
        if (max.type == 3) {
          arrdata.push(
            {
              level: names,
              '3': v ? v.risk_name + ',' + v.id : '',
              ...v,
              '1': onearr.arr[i] ? onearr.arr[i].risk_name + ',' + onearr.arr[i].id : '',
              '2': twoarr.arr[i] ? twoarr.arr[i].risk_name + ',' + twoarr.arr[i].id : '',
              '5': fivearr.arr[i] ? fivearr.arr[i].risk_name + ',' + fivearr.arr[i].id : '',
              '4': fourarr.arr[i] ? fourarr.arr[i].risk_name + ',' + fourarr.arr[i].id : ''

            }
          )
        }
        if (max.type == 2) {
          arrdata.push(
            {
              level: names,
              '2': v ? v.risk_name + ',' + v.id : '',
              ...v,
              '1': onearr.arr[i] ? onearr.arr[i].risk_name + ',' + onearr.arr[i].id : '',
              '5': fivearr.arr[i] ? fivearr.arr[i].risk_name + ',' + fivearr.arr[i].id : '',
              '3': threearr.arr[i] ? threearr.arr[i].risk_name + ',' + threearr.arr[i].id : '',
              '4': fourarr.arr[i] ? fourarr.arr[i].risk_name + ',' + fourarr.arr[i].id : ''

            }
          )
        }
        if (max.type == 1) {
          arrdata.push(
            {
              level: names,
              '1': v ? v.risk_name + ',' + v.id : '',
              ...v,
              '5': fivearr.arr[i] ? fivearr.arr[i].risk_name + ',' + fivearr.arr[i].id : '',
              '2': twoarr.arr[i] ? twoarr.arr[i].risk_name + ',' + twoarr.arr[i].id : '',
              '3': threearr.arr[i] ? threearr.arr[i].risk_name + ',' + threearr.arr[i].id : '',
              '4': fourarr.arr[i] ? fourarr.arr[i].risk_name + ',' + fourarr.arr[i].id : ''

            }
          )
        }
      })
      return arrdata
    }
    // getTableDat(datas){
    //     let onearr =  {type:1,arr:datas.filter(v=>v.risk_parent==1)}
    //     let twoarr =  {type:2,arr:datas.filter(v=>v.risk_parent==2)}
    //     let threearr = {type:3,arr:datas.filter(v=>v.risk_parent==3)}
    //     let fourarr = {type:4,arr:datas.filter(v=>v.risk_parent==4)}
    //     let fivearr =  {type:5,arr:datas.filter(v=>v.risk_parent==5)}
    //     let max = [onearr,twoarr,threearr,fourarr,fivearr].reduce((pre,next)=>{
    //         return pre.arr.length>next.arr.length?pre:next
    //     })

    //     let arrdata = []
    //     max.arr.forEach((v,i)=>{
    //         if(max.type==5){
    //             arrdata.push(
    //                 {
    //                     level: "二级风险",'5': v ? v.risk_name + ',' + v.id: '',...v,
    //                     '1': onearr.arr[i] ? onearr.arr[i].risk_name + ',' + onearr.arr[i].id: '',
    //                     '2': twoarr.arr[i] ? twoarr.arr[i].risk_name + ',' + twoarr.arr[i].id: '',
    //                     '3': threearr.arr[i] ? threearr.arr[i].risk_name + ',' + threearr.arr[i].id: '',
    //                     '4': fourarr.arr[i] ? fourarr.arr[i].risk_name + ',' + fourarr.arr[i].id: '',

    //                 }
    //             )
    //         }
    //         if(max.type==4){
    //             arrdata.push(
    //                 {
    //                     level: "二级风险",'4':v ? v.risk_name + ',' + v.id: '',...v,
    //                     '1': onearr.arr[i] ? onearr.arr[i].risk_name + ',' + onearr.arr[i].id: '',
    //                     '2': twoarr.arr[i] ? twoarr.arr[i].risk_name + ',' + twoarr.arr[i].id: '',
    //                     '3': threearr.arr[i] ? threearr.arr[i].risk_name + ',' + threearr.arr[i].id: '',
    //                     '5': fivearr.arr[i] ? fivearr.arr[i].risk_name + ',' + fivearr.arr[i].id: '',

    //                 }
    //             )
    //         }
    //         if(max.type==3){
    //             arrdata.push(
    //                 {
    //                     level: "二级风险",'3': v ? v.risk_name + ',' + v.id: '',...v,
    //                     '1': onearr.arr[i] ? onearr.arr[i].risk_name + ',' + onearr.arr[i].id: '',
    //                     '2': twoarr.arr[i] ? twoarr.arr[i].risk_name + ',' + twoarr.arr[i].id: '',
    //                     '5': fivearr.arr[i] ? fivearr.arr[i].risk_name + ',' + fivearr.arr[i].id: '',
    //                     '4': fourarr.arr[i] ? fourarr.arr[i].risk_name + ',' + fourarr.arr[i].id: '',

    //                 }
    //             )
    //         }
    //         if(max.type==2){
    //             arrdata.push(
    //                 {
    //                     level: "二级风险",'2': v ? v.risk_name + ',' + v.id: '',...v,
    //                     '1': onearr.arr[i] ? onearr.arr[i].risk_name + ',' + onearr.arr[i].id: '',
    //                     '5': fivearr.arr[i] ? fivearr.arr[i].risk_name + ',' + fivearr.arr[i].id: '',
    //                     '3': threearr.arr[i] ? threearr.arr[i].risk_name + ',' + threearr.arr[i].id: '',
    //                     '4': fourarr.arr[i] ? fourarr.arr[i].risk_name  +  ',' + fourarr.arr[i].id: ''

    //                 }
    //             )
    //         }
    //         if(max.type==1){
    //             arrdata.push(
    //                 {
    //                     level: "二级风险",'1': v ? v.risk_name + ',' + v.id: '',...v,
    //                     '5': fivearr.arr[i] ? fivearr.arr[i].risk_name + ',' + fivearr.arr[i].id: '',
    //                     '2': twoarr.arr[i] ? twoarr.arr[i].risk_name + ',' + twoarr.arr[i].id: '',
    //                     '3': threearr.arr[i] ? threearr.arr[i].risk_name + ',' + threearr.arr[i].id: '',
    //                     '4': fourarr.arr[i] ? fourarr.arr[i].risk_name + ',' + fourarr.arr[i].id : ''

    //             }
    //         )
    //         }
    //     })
    //     this.tableData = arrdata
    // }
  }
}
</script>

<style lang="scss" scoped>
.downriado{
    /deep/ .el-form-item__content{
        text-align: left;
    }
}
#riskctrl{
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  background: white;
  overflow-y: auto;
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
    background-color: #fff;
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td{
     background-color: #fff;
}
.addnewrisk{
    .w90btn{
        width:90px;
    }
    text-align: right;
}
.demo-ruleForm{
    width:80%;
    margin:20px auto 10px;
}
.w100{
    width:100%;
}
.scopeclu{
    display:flex;
    .el-icon-edit{
        color:#1890ff;
    }
    .el-icon-delete{
        color:#ff4d4f;
        margin-left:5px;
    }
    .iconscope{
        cursor: pointer;
    }
    .scopespan{
        flex:1;
        display: inline-block;
        font-size:15px;
        display: inline-block;
        // color:#1890ff;
    }
}
/deep/ .el-table__cell div{
    color: #6c6b6b;
    font-size:16px;
}
</style>
