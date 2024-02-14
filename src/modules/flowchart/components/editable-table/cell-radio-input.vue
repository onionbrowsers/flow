<template>
  <div class="cell-radio-input">
<!--    v-mask="{ _self: _self, pos: ['end'], rowIndex: rowIndex }"-->
    <el-row>
      <el-col :span="12" v-progressive="{ _self, prop: 'risk_point' }">
        <el-checkbox :disabled="$store.getters.disabledGetter" @click.native.stop.capture="handleClick()" @change="handleRadioChange" v-model="radioData" true-label="1">{{ placeholderData['risk_point'] }}</el-checkbox>
      </el-col>
      <el-col :span="12" v-progressive="{ _self, prop: 'risk_point_no' }">
        <!-- <a class="bluerisk" @click="clickRisk()" v-if="rowData.risk_point_no&&rowData.risk_point&&!$store.getters.disabledGetter" >{{rowData.risk_point_no}}</a> -->
        <input
          type="text"
          :style="{ cursor: rowData.risk_point ? 'text' : 'not-allowed' }"
          v-model.lazy="rowData.risk_point_no"
          :placeholder="placeholderData['risk_point_no']"
          :disabled="!rowData.risk_point || $store.getters.disabledGetter"
          @change="handleDataChange('input')"
          maxlength="8"
        />
         <i  class="el-icon-edit iconscope" v-if="rowData.risk_point_no&&rowData.risk_point&&!$store.getters.disabledGetter" title="编辑"  @click="clickRisk()"></i>
         <!-- <i  class="el-icon-edit iconscope" title="编辑"  @click="clickRisk()"></i> -->
        <!-- <a class="hrisk"  v-if="rowData.risk_point_no&&(!rowData.risk_point || $store.getters.disabledGetter)" >{{rowData.risk_point_no}}</a> -->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" v-progressive="{ _self, prop: 'control_point' }">
        <el-checkbox :disabled="$store.getters.disabledGetter" @click.native.stop.capture="handleClick1()" @change="handleRadio1Change" v-model="radioData1" true-label="2">{{ placeholderData['control_point'] }}</el-checkbox>
      </el-col>
      <el-col :span="12" v-progressive="{ _self, prop: 'control_point_no' }">
         <!-- <a class="bluerisk" @click="clickCtrl()" v-if="rowData.control_point_no&&rowData.control_point&&!$store.getters.disabledGetter" >{{rowData.control_point_no}}</a> -->
        <input
          type="text"
          :style="{ cursor: rowData.control_point ? 'text' : 'not-allowed' }"
          v-model="rowData.control_point_no"
          :placeholder="placeholderData['risk_point_no']"
          :disabled="!rowData.control_point || $store.getters.disabledGetter"
          @change="handleDataChange('input')"
          maxlength="8"
        />
         <i  class="el-icon-edit iconscope" v-if="rowData.control_point_no&&rowData.control_point&&!$store.getters.disabledGetter" title="编辑"  @click="clickCtrl()"></i>
         <!-- <i  class="el-icon-edit iconscope"  title="编辑"  @click="clickCtrl()"></i> -->
        <!-- <a class="hrisk" v-if="rowData.control_point_no&&(!rowData.control_point || $store.getters.disabledGetter)" >{{rowData.control_point_no}}</a> -->
      </el-col>
    </el-row>
    <!-- 风险 -->
    <el-dialog
      title="编辑风险点信息"
      :close-on-click-modal="false"
      custom-class="file-edit-dialog"
      v-if="isdialogVis"
      :visible.sync="isdialogVis"
      :footer="null"
      width="70%"
     >
     <cellclickRisk :pageId="currentPageId" :folderId="folderId" :pageName="pageName" :flowfileDetal="rowData" @closeModel="closeRisk"></cellclickRisk>
    </el-dialog>
    <!-- 控制点 -->
    <el-dialog
      title="编辑控制点信息"
      :close-on-click-modal="false"
      custom-class="file-edit-dialog"
      v-if="isctrlDialog"
      :visible.sync="isctrlDialog"
      :footer="null"
      width="70%"
     >
     <cellclickctrl :pageId="currentPageId" :folderId="folderId" :pageName="pageName" :allData="tableData" :flowfileDetal="rowData"  @closeModel="closeCtrl"></cellclickctrl>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import cellclickRisk from './cell-radio-input-riskdialog.vue'// 风险点弹窗
import cellclickctrl from './cell-radio-inputctrldialog.vue'// 控制点弹窗
export default {
  name: 'cell-radio-input',
  components: {
    cellclickRisk, cellclickctrl
  },
  props: {
    prop: {
      type: [Array, String],
      default: ''
    },
    row: {
      type: Object,
      default: () => ({})
    },
    pageName: {
      type: String,
      default: ''
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    tableData: {
      type: Array,
      default: () => []
    },
    placeholderData: {
      type: Object,
      default: () => {}
    },
    currentPageId: {
      type: [Number, String],
      default: ''
    },
    folderId: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      isdialogVis: false, // 是否展示风险弹窗
      isctrlDialog: false, // 展示控制点
      radioData: '',
      radioData1: '',
      rowData: {
        risk_point: false,
        risk_point_no: '',
        control_point: false,
        control_point_no: ''
      },
      flag: 0 // 控制开启与关闭

    }
  },
  watch: {
    row: {
      handler (newValue) {
        this.rowData = _.cloneDeep(newValue)
        this.initRadioData()
      },
      deep: true
    }
  },
  mounted () {
    this.rowData = _.cloneDeep(this.row)
    this.initRadioData()
  },
  beforeDestroy () {
  },
  methods: {
    initRadioData () {
      // this.radioData = ''
      // this.radioData1 = ''
      if (this.rowData.risk_point) {
        this.radioData = '1'
      } else {
        this.radioData = ''
      }
      if (this.rowData.control_point) {
        this.radioData1 = '2'
      } else {
        this.radioData1 = ''
      }
    },
    handleRadio1Change () {
      if (this.radioData1 == '2') {
        this.rowData.control_point = true
      } else {
        this.rowData.control_point = false
      }
      this.handleDataChange()
    },
    handleRadioChange () {
      if (this.radioData == '1') {
        this.rowData.risk_point = true
      } else {
        this.rowData.risk_point = false
      }
      this.handleDataChange()
    },
    // 点击控制点
    clickCtrl () {
      this.isctrlDialog = true
    },
    // 关闭控制点
    closeCtrl (data) {
      this.isctrlDialog = false
    },

    // 点击风险点
    clickRisk () {
      this.isdialogVis = true
    },
    // 关闭风险点
    closeRisk (data) {
      this.isdialogVis = false
    },
    handleDataChange (flag) {
      const autoNumber = this.$store.getters.columnPropsGetter.autoNumber
      // 如果 flag === 'input' 且 开启自动编号 且 改变了 control_point_no 或 risk_point_no
      if (
        flag === 'input' &&
        (autoNumber.risk_point_no.value || autoNumber.control_point_no.value) &&
        (
          this.rowData.control_point_no !== this.row.control_point_no ||
            this.rowData.risk_point_no !== this.row.risk_point_no
        )
      ) {
        this.$confirm('此操作将关闭风险点和控制点的自动编号功能, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('UPDATE_AUTO_NUMBER', {
            autoNumber: {
              no: { value: autoNumber.no.value },
              control_point_no: { value: false },
              risk_point_no: { value: false }
            }
          })
          this.$store.commit('HANDLE_EDIT_RISK_CONTROL_POINT', { rowIndex: this.rowIndex, data: this.rowData })
        }).catch(() => {
          this.rowData.control_point_no = this.row.control_point_no
          this.rowData.risk_point_no = this.row.risk_point_no
        })
      } else {
        this.$store.commit('HANDLE_EDIT_RISK_CONTROL_POINT', { rowIndex: this.rowIndex, data: this.rowData })
      }
    },
    handleClick () {
      if (this.$store.getters.disabledGetter) {
        return
      }
      this.flag++
      if (this.flag === 2) {
        this.flag = 0
        return false
      }
      let tempRadioData = this.radioData // radioData 值变化之前的值, old value
      setTimeout(() => {
        // 此处 this.radioData 为更新之后的值
        if (tempRadioData === this.radioData) {
          // oldValue === newValue, 表示点击了同一个
          this.rowData.risk_point = false
          this.rowData.risk_point_no = ''
          // this.rowData.control_point = false
          // this.rowData.control_point_no = ''
          this.handleDataChange()
        }
      })
    },
    handleClick1 () {
      if (this.$store.getters.disabledGetter) {
        return
      }
      this.flag++
      if (this.flag === 2) {
        this.flag = 0
        return false
      }
      let tempRadioData = this.radioData1 // radioData 值变化之前的值, old value
      setTimeout(() => {
        // 此处 this.radioData 为更新之后的值
        if (tempRadioData === this.radioData1) {
          // oldValue === newValue, 表示点击了同一个
          // this.rowData.risk_point = false
          // this.rowData.risk_point_no = ''
          this.rowData.control_point = false
          this.rowData.control_point_no = ''
          this.handleDataChange()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-radio-input {
  width: 100%;
  input {
    width: 70%;
    border-bottom: 1px solid #bbb;
    border-top: none;
    border-left: none;
    border-right: none;
    outline: none;
    padding: 0 0 0 5px;
    background-color: transparent;
    color: #333;
    &:placeholder-shown {
      background-color: transparent;
    }
    &::placeholder {
      color: #999;
    }
    &:disabled {
      &::placeholder {
        color: #999;
      }
    }
  }
  .iconscope{
    color:#1890ff;
    cursor:pointer;
  }
}
.bluerisk{
  width: 80%;
  cursor:pointer;
  color:#409EFF;
}
.hrisk{
  width: 80%;
  color: #333;
}
.demo-ruleForm{
  padding:20px 20px 10px;
  width:80%;
  margin:20px auto ;
}
.w100{
  width:100%;
}
</style>
