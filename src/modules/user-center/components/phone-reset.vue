<template>
  <div id="phone-reset" v-loading="loading">
    <title-comp txt="修改手机号"></title-comp>
    <div class="form">
      <el-form ref="form" :model="form" :rules="rules" label-width="93px">
        <el-form-item label="旧手机号：" prop="oldPhone">
          <el-input v-model="form.oldPhone" placeholder="请输入您的旧手机号" class="input"></el-input>
        </el-form-item>
        <el-form-item label="新手机号：" prop="newPhone">
          <el-input v-model="form.newPhone" placeholder="请输入您的新手机号" class="input"></el-input>
        </el-form-item>
        <el-form-item label="验证码："  prop="verificationCode">
          <el-input v-model="form.verificationCode" placeholder="验证码" class="verification-code"></el-input>
          <el-button type="primary"
                     :disabled="getVerificationCodeDisabled"
                     class="send-verification-code"
                     @click="getVerificationCode">
            {{ getVerificationCodeDisabled ? (verificationCodeTxt ? `${countDown}秒后重试` : '发送验证码') : '发送验证码'}}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')" class="btn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import titleComp from '../../../components/title-comp'
export default {
  name: 'phone-reset',
  components: {
    titleComp
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      form: {
        oldPhone: '',
        newPhone: '',
        verificationCode: '',
        interval: null
      },
      loading: false,
      countDown: 60,
      rules: {
        oldPhone: [
          { required: true, message: '请输入您的旧手机号', trigger: 'blur' },
          { pattern: /^0?(13|14|15|17|18|19)[0-9]{9}|(852)[0-9]{8}$/, message: '请输入正确的手机号', trigger: 'blur' },
          {
            validator: (rule, phone, callback) => {
              this.getVerificationCodeDisabled = phone === this.form.newPhone || !/^0?(13|14|15|17|18|19)[0-9]{9}|(852)[0-9]{8}$/.test(phone)
              phone === this.form.newPhone && /^0?(13|14|15|17|18|19)[0-9]{9}|(852)[0-9]{8}$/.test(phone) ? callback(new Error('新手机和旧手机号码不能相同')) : callback()
            },
            trigger: 'change'
          }
        ],
        newPhone: [
          { required: true, message: '请输入您的新手机号', trigger: 'blur' },
          { pattern: /^0?(13|14|15|17|18|19)[0-9]{9}|(852)[0-9]{8}$/, message: '请输入正确的手机号', trigger: 'blur' },
          {
            validator: (rule, phone, callback) => {
              this.getVerificationCodeDisabled = phone === this.form.oldPhone || !/^0?(13|14|15|17|18|19)[0-9]{9}|(852)[0-9]{8}$/.test(phone)
              phone === this.form.oldPhone ? callback(new Error('新手机和旧手机号码不能相同')) : callback()
            },
            trigger: 'change'
          }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      getVerificationCodeDisabled: false, // 发送验证码禁用
      verificationCodeTxt: false
    }
  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    submitForm (form) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.userPhoneReset()
        } else {
        }
      })
    },
    userPhoneReset () {
      var params = {
        old_phone: this.form.oldPhone,
        phone: this.form.newPhone,
        code: this.form.verificationCode
      }
      this.loading = true
      this.$api.userPhoneReset(params).then(res => {
        this.loading = false
        this.$store.dispatch('GET_USER_INFO', this)
        this.$store.dispatch('GET_RECEIVED_LIST', this)
        this.$msgMnger.success(this.$msgMnger.success('修改成功，请您重新登录'))
        this.$store.dispatch('AUTH_LOGOUT').then(() => {
          this.$router.push('/login')
        })
      }).catch(err => {
        this.loading = false
        this.$msgMnger.error(err.msg)
      })
    },
    getVerificationCode () {
      if (!this.form.newPhone) {
        this.$msgMnger.warn('请输入您的新手机号')
        return
      }
      this.getVerificationCodeDisabled = true
      this.verificationCodeTxt = true
      this.interval = setInterval(() => {
        this.countDown--
        if (this.countDown === 0) {
          this.countDown = 60
          clearInterval(this.interval)
          this.interval = null
          this.getVerificationCodeDisabled = false
          this.verificationCodeTxt = false
        }
      }, 1000)
      this.getVerifyCode(this.form.newPhone)
    },
    getVerifyCode (phone) {
      this.$api.getVerifyCode(phone).then(res => {
        this.$msgMnger.success('验证码发送成功, 请注意查收!')
      }).catch(err => {
        this.$msgMnger.error(err.msg)
        console.log(err.msg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#phone-reset {
  height: calc(100% - 16px);
  .form{
    height: calc(100% - 34px);
    background: white;
    padding: 23px 24px;
    box-sizing: border-box;
    border-top: 1px solid #E8E8E8;
    .btn{
      float: left;
      width:96px;
      height:32px;
      line-height: 32px;
      background:rgba(24,144,255,1);
      border-radius:4px;
      padding: 0;
    }
    .btn:hover{
      background: #46a6ff;
      border-color: #46a6ff;
      color: #fff;
    }
    .btn:active{
      background: #1682e6;
      border-color: #1682e6;
      color: #fff;
      outline: none;
    }
    .send-verification-code{
      width:113px;
      height:40px;
      margin-left: 21px;
      border:1px solid rgba(24,144,255,1);
      background: white;
      color: #1890FF;
    }
    .send-verification-code:hover{
      background: #46a6ff;
      border-color: #46a6ff;
      color: #fff;
    }
    .send-verification-code:active{
      background: #1682e6;
      border-color: #1682e6;
      color: #fff;
      outline: none;
    }
  }
}
</style>

<style lang="scss">
#phone-reset {
  .verification-code{
    .el-input__inner::placeholder{
      font-size: 16px;
    }
  }
}
</style>
