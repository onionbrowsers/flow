<template>
  <div id="sing-in" v-loading.fullscreen.lock="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="" prop="account" class="account">
        <i class="el-icon-user icon"></i>
        <el-input type="text"
                  @blur="blurHandle"
                  v-model.trim="ruleForm.account"
                  placeholder="请输入注册时的手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="" prop="password" class="password">
        <i class="el-icon-lock icon"></i>
        <el-input type="password"
                  v-model.trim="ruleForm.password"
                  @blur="blurHandle"
                  @keyup.enter.native="submitForm('ruleForm')"
                  placeholder="密码" clearable></el-input>
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
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'js-md5'

export default {
  name: 'sign-in',
  data () {
    return {
      errMsg: '',
      loading: false,
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            validator: (rule, phone, callback) => {
              const re = /^0?(13|14|15|17|18|19)[0-9]{9}|(852)[0-9]{8}$/
              re.test(phone) ? callback() : callback(new Error('请输入正确的手机号'))
            },
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.login()
        } else {
          return false
        }
      })
    },
    login () {
      this.loading = true
      let { account, password } = this.ruleForm
      this.$api.bcLogin({ phone: account, pwd: md5(password) }).then(res => {
        this.loading = false
        let _userInfo = JSON.parse(JSON.stringify(res.data))
        _userInfo['username'] = account
        this.$store.dispatch('AUTH_TOKEN', res.data.token)
        this.$store.commit('SET_USER_INFO', _userInfo)
        localStorage.setItem('user-info', JSON.stringify(_userInfo))
        this.$store.dispatch('GET_USER_INFO', this)
        this.$store.dispatch('GET_RECEIVED_LIST', this)
        this.$store.dispatch('GET_COMPANIES_ACTION', this) // 请求数据空间数据
        let nextPath = this.$route.query.next || '/'
        this.$router.push(nextPath)
        this.$msgMnger.success('登录成功')
      }).catch(err => {
        this.loading = false
        if (!err.msg) {
          this.$msgMnger.httpError(err)
        } else {
          this.errMsg = err.msg
        }
      })
    },
    blurHandle () {
      this.errMsg = ''
    }
  }
}
</script>

<style scoped lang="scss">
#sing-in{
  .account{
    position: relative;
  }
  .err{
    margin-top: -10px;
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
#sing-in{
  .el-form-item__content{
    position: relative;
    .icon{
      position: absolute;
      z-index: 1;
      top: 13px;
      left: 15px;
      font-size: 14px;
    }
    .el-input__inner{
      padding-left: 36px;
    }
  }
  .el-button--primary{
    width: 100% !important;
  }
}
</style>
