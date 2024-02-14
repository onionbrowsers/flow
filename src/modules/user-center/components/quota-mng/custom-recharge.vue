<template>
  <div class="custom-recharge" id="custom-recharge">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      label-position="left"
      size="small"
    >
      <el-row :gutter="50">
        <el-col :span="8">
          <el-form-item label="购买单位" prop="cid">
            <el-select
              v-model="ruleForm.cid"
              clearable
              filterable
              remote
              placeholder="请输入购买单位/企业名称"
              :remote-method="remoteMethod"
              :loading="compLoading"
              @change="compSelectChange">
              <el-option
                v-for="item in compOptions"
                :key="item.company_id"
                :label="item.company_name"
                :value="item.company_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="payMethod">
            <el-select v-model="ruleForm.payMethod" placeholder="请选择支付方式">
              <el-option label="线下支付" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同编号" prop="contractNumber">
            <el-input v-model="ruleForm.contractNumber" clearable></el-input>
          </el-form-item>
          <el-form-item label="企业空间管理员" prop="admin">
            <el-input v-model="ruleForm.adminInfo" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买额度" prop="purchaseLimit">
            <!-- <el-select v-model="ruleForm.purchaseLimit" @change="purchaseLimitChange" filterable placeholder="请选择购买额度">
              <el-option v-for="item in purchaseLimitOptions" :key="item.value" :label="`${item.label}张 - 赠${item.presenter}`" :value="item.value"></el-option>
            </el-select> -->
            <el-autocomplete
              v-model="ruleForm.purchaseLimit"
              @select="purchaseLimitChange"
              :fetch-suggestions="querySearch"
              placeholder="请选择或输入购买额度"
              clearable>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="套餐金额" prop="amountPack">
            <el-input-number v-model="ruleForm.amountPack" :precision="2" :min="0" :max="9999999" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item label="实付金额" prop="amountActually">
            <el-input-number v-model="ruleForm.amountActually" :precision="2" :min="0" :max="9999999" :controls="false"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开始服务时间" prop="startTime">
            <el-date-picker
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              v-model="ruleForm.startTime"
              type="date"
              placeholder="请选择开始服务时间"
              @change="startTimeChange"
              clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="服务暂停时间" prop="endTime">
            <el-date-picker
              :picker-options="endPickerOptions"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              v-model="ruleForm.endTime"
              type="date"
              placeholder="请选择服务暂停时间"
              clearable>
            </el-date-picker>
          </el-form-item>
          <!-- <div>服务时限：自充值之日起，1年内有效</div> -->
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="submitLoading" :loading="submitLoading">确认充值</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      ruleForm: {
        cid: '',
        name: '',
        payMethod: '0',
        contractNumber: '',
        admin: '',
        adminId: '',
        adminInfo: '',
        purchaseLimit: '',
        amountPack: '',
        amountActually: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        cid: [
          { required: true, message: '请输入购买单位', trigger: 'change' }
        ],
        payMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        admin: [
          { required: true, message: '企业空间管理员不能为空', trigger: 'change' }
        ],
        adminInfo: [
          { required: true, message: '企业空间管理员不能为空', trigger: 'change' }
        ],
        purchaseLimit: [
          { required: true, message: '请选择购买额度', trigger: 'change' },
          { required: true, pattern: /^-?[1-9]\d*$/, message: '购买额度必须为非0整数', trigger: 'blur' }
        ],
        amountPack: [
          { required: true, message: '请输入套餐金额', trigger: 'change' }
        ],
        amountActually: [
          { required: true, message: '请输入实付金额', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始服务时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择服务暂停时间', trigger: 'change' }
        ]
      },
      purchaseLimitOptions: [
        { value: '200张 - 赠40张', input: '240', cost: '5000' },
        { value: '500张 - 赠100张', input: '600', cost: '12000' },
        { value: '1000张 - 赠200张', input: '1200', cost: '20000' },
        { value: '2000张 - 赠200张', input: '2200', cost: '30000' },
        { value: '3000张 - 赠200张', input: '3200', cost: '38000' },
        { value: '4000张 - 赠200张', input: '4200', cost: '45000' },
        { value: '5000张 - 赠200张', input: '5200', cost: '50000' }
      ],
      compOptions: [],
      compLoading: false,
      submitLoading: false,
      endPickerOptions: {
        disabledDate: (time) => {
          let startTime = this.ruleForm.startTime
          if (startTime) {
            let startTime1 = new Date(this.ruleForm.startTime).getTime()
            let endTime1 = time.getTime()
            if (startTime1 > endTime1) {
              return true
            }
          } else {
            return true
          }
          return false
        }
      }
    }
  },
  methods: {
    createFilter (queryString) {
      return (options) => {
        return options.value.indexOf(queryString) === 0
      }
    },
    querySearch (queryString, cb) {
      let options = this.purchaseLimitOptions
      let results = queryString ? options.filter(this.createFilter(queryString)) : options
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.acountCharge()
        } else {
          return false
        }
      })
    },
    acountCharge () {
      this.submitLoading = true
      let { cid, name, payMethod, contractNumber,
        admin, adminId, purchaseLimit, amountPack,
        amountActually, startTime, endTime } = this.ruleForm
      let parms = {
        company_id: cid,
        company_name: name,
        buy_numbers: purchaseLimit,
        pay_type: payMethod,
        amt: amountPack,
        real_amt: amountActually,
        contract_no: contractNumber,
        manager_id: adminId,
        manager_name: admin,
        start_time: startTime,
        end_time: endTime
      }
      this.$api.acountCharge(parms).then(res => {
        this.$msgMnger.success('充值成功')
        this.submitLoading = false
        this.resetForm()
      }).catch(err => {
        this.$msgMnger.error(err.msg)
        this.submitLoading = false
      })
    },
    resetForm () {
      this.$refs['ruleForm'].resetFields()
    },
    remoteMethod (queryString) {
      this.compLoading = true
      let parms = {}
      if (queryString) {
        parms.k = queryString
      }
      this.$api.companySearch(parms).then(data => {
        this.compOptions = data.data
        this.compLoading = false
      }).catch(e => {
        this.compLoading = false
        this.$msgMnger.httpError(e)
      })
    },
    compSelectChange (cid) {
      if (cid) {
        this.compOptions.forEach(e => {
          if (e.company_id === cid) {
            this.ruleForm.name = e.company_name
          }
        })
      } else {
        this.ruleForm.name = ''
      }
      this.memberMngList(cid)
    },
    // 获取成员管理列表
    memberMngList (cid) {
      this.ruleForm.admin = ''
      this.ruleForm.adminId = ''
      this.ruleForm.adminInfo = ''
      if (!cid) {
        return
      }
      this.$api.memberMngList(cid).then(res => {
        res.data.map(e => {
          if (e.type === 1) {
            this.ruleForm.adminInfo = `${e.username} - ${e.phone}`
            this.ruleForm.admin = e.username
            this.ruleForm.adminId = e.id
          }
        })
      }).catch(err => {
        this.$msgMnger.error(err.msg)
      })
    },
    startTimeChange (start) {
      let end = this.ruleForm.endTime
      // console.log('SSS', start, end)
      if (end && start) {
        let endTime = new Date(end)
        let startTime = new Date(start)
        if (startTime.getTime() >= endTime.getTime()) {
          this.ruleForm.endTime = moment(start).add(1, 'year').format('YYYY-MM-DD')
        }
      } else if (!end) {
        this.ruleForm.endTime = moment(start).add(1, 'year').format('YYYY-MM-DD')
      }
    },
    purchaseLimitChange (item) {
      this.ruleForm.purchaseLimit = item.input
      this.ruleForm.amountPack = item.cost
      this.ruleForm.amountActually = item.cost
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-recharge{
  text-align: left;
}
</style>
