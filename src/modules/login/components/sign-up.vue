<template>
  <div id="register" v-loading.fullscreen.lock="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="" prop="name" class="account">
        <el-input type="text" v-model.trim="ruleForm.name" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="" prop="tel">
        <el-input v-model.trim="ruleForm.tel" placeholder="手机号码" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input
          v-model.trim="ruleForm.password"
          placeholder="密码"
          type="password"
          clearable
          autocomplete="off"
          @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="verificationCode">
        <el-row>
          <el-col :span="9">
            <el-input
              v-model.trim="ruleForm.verificationCode"
              clearable
              @blur="blurHandle"
              placeholder="验证码"
              autocomplete="off">
            </el-input>
          </el-col>
          <el-col :span="13" :offset="2">
            <el-button
              clearable
              :disabled="getVerificationCodeDisabled"
              type="primary"
              style="width: 100%;"
              class="get-verification-code-button"
              :class="{ disabled: getVerificationCodeDisabled }"
              :title="getVerificationCodeDisabled ? '请输入正确的手机号以获取验证码' : ''"
              @click="getVerificationCode"
            >
              {{ verificationCodeDisabled ? '获取验证码' : (getVerificationCodeDisabled ? `${countDown}秒后重试` : '获取验证码') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="errMsg" class="err">
        <div class="error-tip">
          <svg class="err-icon" aria-hidden="true">
            <use xlink:href="#iconcuowutishi"></use>
          </svg>
          {{errMsg}}
        </div>
      </el-form-item>
      <el-form-item>
        <el-button class="cus-btn" type="primary" @click="submitForm('ruleForm')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'js-md5'
import validate from '../../../utils/validate'
export default {
  name: 'sign-up',
  data () {
    return {
      errMsg: '',
      ruleForm: {
        name: '',
        tel: '',
        verificationCode: '',
        password: ''
      },
      loading: false,
      verificationCodeDisabled: true,
      getVerificationCodeDisabled: true,
      countDown: 60,
      buttonStatus: 0,
      signUpButtonDisabled: true,
      interval: null,
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入4位验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '请输入4位验证码', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    checkUserPhone () {
      // return this.$api.checkUserName(this.ruleForm.tel)
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(valid)
          this.signUp()
        } else {
          return false
        }
      })
    },
    signUp () {
      this.loading = true
      const paramsData = {
        phone: this.ruleForm.tel,
        pwd: md5(this.ruleForm.password),
        username: this.ruleForm.name,
        code: this.ruleForm.verificationCode
      }
      this.$api.bcRegister(paramsData).then(res => {
        this.loading = false
        this.$msgMnger.success('注册成功')
        this.$emit('handEnd')
        // Bus.$emit('signUp', 'left')
      }).catch(err => {
        // this.$msgMnger.httpError(err)
        this.loading = false
        this.errMsg = err.msg
      })
    },
    blurHandle () {
      this.errMsg = ''
    },
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
      this.$api.getVerifyCode(this.ruleForm.tel).then(res => {
        this.$msgMnger.success('验证码发送成功, 请注意查收!')
      }).catch(err => {
        // this.$msgMnger.error(err.msg)
        this.errMsg = err.msg
      })
    }
  },
  watch: {
    'ruleForm.tel': {
      handler () {
        if (this.ruleForm.name.length > 2 < 15 && validate.validatePhone(this.ruleForm.tel) && !this.interval) {
          this.getVerificationCodeDisabled = false
        } else {
          this.getVerificationCodeDisabled = true
        }
        // let flag = true
        // this.$refs['ruleForm'].validateField('name', (err) => {
        //   if (err) { flag = false }
        // })
        // if (flag && this.ruleForm.tel.length === 11) {
        //   this.getVerificationCodeDisabled = false
        //   console.log(this.getVerificationCodeDisabled)
        // }
        // if (this.ruleForm.name && this.ruleForm.tel && flag) {
        //   this.getVerificationCodeDisabled = false
        // }
        // if (this.ruleForm.name && this.)
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
#register{
  .get-verification-code-button{

  }
  .cus-btn{
    width: 100%;
  }
  .err{
    margin-top: -10px
  }
  .error-tip{
    height:30px;
    line-height: 30px;
    background:rgba(255,235,236,1);
    border-radius:4px;
    border:1px solid rgba(195,60,62,1);
    color: #C33C3E;
    text-align: left;
    padding-left: 16px;
    box-sizing: border-box;
    .err-icon{
      width: 1em; height: 1em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
<style lang="scss">
#register{
  .el-button--primary.is-disabled{
    background: #f4f5f6;
    border-color: #f4f5f6;
    color: #999;
  }
}
</style>
