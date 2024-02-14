<template>
  <div id="find-password" v-loading.fullscreen.lock="loading">
    <div class="desc">{{step === 1 ? '第1步：请输入注册时预留的手机号码' : '第2步：重置密码'}}</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="" prop="tel" v-if="step === 1">
        <el-input
         type="text"
         @change="changeHandle('tel')"
         v-model="ruleForm.tel"
         clearable
         placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="" v-if="step === 1" prop="verificationCode">
        <el-row>
          <el-col :span="11">
            <el-input
              clearable
              @change="changeHandle('code')"
              placeholder="验证码"
              v-model="ruleForm.verificationCode"></el-input>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-button
              :disabled="getVerificationCodeDisabled"
              type="primary"
              style="width: 100%;"
              class="get-verification-code-button"
              :class="{ disabled: getVerificationCodeDisabled }"
              @click="getVerificationCode"
            >
              {{ verificationCodeDisabled ? '获取验证码' : (getVerificationCodeDisabled ? `${countDown}秒后重新获取` : '获取验证码') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="step === 2">
        <el-input type="password" v-model="ruleForm.password" placeholder="密码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          style="width: 100%; margin-top: 60px"
          type="primary"
          :disabled="allowSubmit"
          @click="submitForm('ruleForm')">{{btnText}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import validate from '../../../utils/validate'
import md5 from 'js-md5'
export default {
  name: 'find-password',
  data () {
    return {
      ruleForm: {
        tel: '',
        verificationCode: '',
        password: ''
      },
      rules: {
        tel: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      loading: false,
      verificationCodeDisabled: true,
      getVerificationCodeDisabled: true,
      countDown: 60,
      buttonStatus: 0,
      signUpButtonDisabled: true,
      interval: null,
      step: 1,
      btnText: '确定',
      allowSubmit: true
    }
  },
  methods: {
    getVerificationCode () {
      this.verificationCodeDisabled = false
      this.getVerificationCodeDisabled = true
      this.signUpButtonDisabled = false
      this.interval = setInterval(() => {
        this.countDown--
        if (this.countDown === 0) {
          this.countDown = 60
          clearInterval(this.interval)
          this.interval = null
          this.getVerificationCodeDisabled = false
        }
      }, 1000)
      // 调用接口
      this.$api.getVerifyCode(this.ruleForm.tel, 1).then(res => {
        this.$msgMnger.success('验证码发送成功, 请注意查收!')
      }).catch(err => {
        this.$msgMnger.error(err.msg)
      })
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.step === 1) {
            this.checkCode()
          } else {
            this.resetPassword()
          }
        } else {
          return false
        }
      })
    },
    checkCode () {
      const paramsData = {
        phone: this.ruleForm.tel,
        code: this.ruleForm.verificationCode
      }
      this.loading = true
      this.$api.checkCode(paramsData).then(res => {
        this.loading = false
        console.log('checkCode Api', res)
        this.step = 2
        this.btnText = '重置密码'
      }).catch(err => {
        this.loading = false
        this.$msgMnger.httpError(err)
      })
    },
    resetPassword () {
      const { tel, password } = this.ruleForm
      this.$api.resetPwd({ phone: tel, pwd: md5(password) }).then(res => {
        this.$msgMnger.success(res.data)
        this.$emit('handEnd')
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    changeHandle () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.allowSubmit = false
        } else {
          this.allowSubmit = true
        }
      })
    }
  },
  watch: {
    'ruleForm': {
      handler () {
        if (validate.validatePhone(this.ruleForm.tel)) {
          this.getVerificationCodeDisabled = false
        } else {
          this.getVerificationCodeDisabled = true
        }

        if (validate.validatePhone(this.ruleForm.tel) && this.ruleForm.verificationCode.length === 4) {
          this.allowSubmit = false
        } else {
          this.allowSubmit = true
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
#find-password{
  .desc{
    color: #666666;
    text-align: left;
    margin-bottom: 45px;
  }
}
</style>
