<template>
  <div id="main">
    <div id="login">
  <!--    左侧-->
      <div class="index-body">
        <div class="login-banner">
          <div class="title">
            <span>SmartFlow</span>
            <span>让流程绘制进入智能时代</span>
          </div>
          <img src="../assets/img/banner.png" alt="">
        </div>
        <!--    右侧-->
        <div class="login-div">
          <img class="login" src="../assets/img/logo.png" alt="">
          <div class="function">
            <div class="switch" v-if="handType !== 'find'">
              <span :class="{ active: handType === 'login' }" @click="handSwitch('login')">登录</span>
              <span :class="{ active: handType === 'register' }" @click="handSwitch('register')">注册</span>
            </div>
            <div v-else class="find-password-title">
              <i class="el-icon-back" @click="end"></i>
              <span>找回密码</span>
            </div>
            <sign-in v-if="handType === 'login'"></sign-in>
            <sign-up v-if="handType === 'register'" @handEnd="end"></sign-up>
            <find-password
              @passwordEmit="passwordEmitHandle"
              @handEnd="end"
              v-if="handType === 'find'"></find-password>
            <span class="forget" v-if="handType === 'login'" @click="handType = 'find'">忘记密码?</span>
          </div>
        </div>
      </div>
  <!--    <div class="login-div">
        <div class="login-title"></div>
        <div class="login-input-submit">
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="0" label-position="left">
        <el-form-item prop="user">
        <el-input v-model="loginForm.user" placeholder="用户名">
        <img class="input-img" slot="prefix" src="../assets/img/login/user.svg"/>
        </el-input>
        </el-form-item>
        <el-form-item prop="pwd">
        <el-input type="password" v-model="loginForm.pwd" @keyup.enter.native="submitForm()" placeholder="密码">
        <img class="input-img" slot="prefix" src="../assets/img/login/pwd.svg"/>
        </el-input>
        </el-form-item>
        </el-form>
        <div>
        <el-button type="primary" @click="submitForm()">
        登录
        <img src="../assets/img/login/login.svg"/>
        </el-button>
        </div>
        </div>
        </div>-->
    </div>
    <div class="index-footer">
<!--      <span class="index__copyright">Copyright © 2019 | 西安贝业思版权所有&nbsp;&nbsp;</span>-->
      <a class="index__record-anchor" target="_blank" href="http://www.beian.miit.gov.cn">
        京ICP备20024270号-1
      </a>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import signIn from '../components/sign-in'
import signUp from '../components/sign-up'
import findPassword from '../components/find-password'
export default {
  components: {
    signIn,
    signUp,
    findPassword
  },
  data () {
    return {
      handType: 'login',
      loginForm: {
        user: '',
        pwd: ''
      },
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'change' }
          // { validator: validatePass, trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'change' }
          // { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.login()
        } else {
          return false
        }
      })
    },
    login () {
      let { user, pwd } = this.loginForm
      this.$api.bcLogin({ name: user, pwd: md5(pwd) }).then(res => {
        let _userInfo = JSON.parse(JSON.stringify(res.data))
        _userInfo['username'] = user
        this.$store.dispatch('AUTH_TOKEN', res.data.token)
        this.$store.commit('SET_USER_INFO', _userInfo)
        localStorage.setItem('user-info', JSON.stringify(_userInfo))
        // this.$store.dispatch('GET_USER_INFO', this)
        let nextPath = this.$route.query.next || '/'
        this.$router.push(nextPath)
        this.$msgMnger.success('登录成功')
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    end () {
      this.handType = 'login'
    },
    passwordEmitHandle () {
      this.handType = 'login'
    },
    handSwitch (handType) {
      this.handType = handType
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
#main{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
#login{
  width: 1169px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login-banner{
    width: 700px;
    .title{
      display: flex;
      font-size: 32px;
      color: #224380;
      span:last-child{
        margin-left: 20px;
      }
    }
    img{
      width: 650px;
      height: 331px;
      margin-left: 50px;
      margin-top: 64px;
    }
  }
  .login-div{
    margin-left: 106px;
    width:369px;
    .logo{
      width: 330px;
      height: 69px;
    }
    .function{
      height: 465px;
      margin-top: 37px;
      box-shadow:0 4px 10px 0 rgba(24,144,255,0.1);
      border-radius:8px;
      font-size: 16px;
      color: #888;
      padding: 45px 25px 25px 25px;
      box-sizing: border-box;
      .switch{
        margin-bottom: 45px;
        text-align: left;
        span{
          cursor: pointer;
        }
        span:last-child{
          margin-left: 12px;
        }
      }
      .find-password-title{
        font-size: 20px;
        color: #252525;
        text-align: left;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        span{
          margin-left: 40px;
        }
        .el-icon-back{
          cursor: pointer;
        }
      }
      .forget{
        display: block;
        text-align: left;
        cursor: pointer;
      }
      .active{
        font-size: 20px;
        color: #252525;
      }
    }
  }
}
#login {
  position: relative;
  .index-body {
    width: 100%;
    display: flex;
  }
}
#main {
  position: relative;
  .index-footer {
    position: absolute;
    bottom: 20px;
    width: 100%;
    padding-top: 20px;
    border-top: 1px solid #efefef;
    .index__copyright {
      font-size: 14px;
      color: $base-text-color-middle;
    }
    .index__record-anchor {
      font-size: 14px;
      color: $base-text-color-middle;
      text-decoration: none;
      &:hover {
        color: $base-text-color-lighter;
      }
    }
  }
}
</style>

<style lang="scss">
#login{
  .el-form{
    .el-form-item__label{
      // color: #fff;
    }
  }
}
</style>
