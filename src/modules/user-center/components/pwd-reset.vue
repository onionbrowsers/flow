<template>
  <div id="pwd-reset" v-loading="loading">
    <title-comp txt="修改密码"></title-comp>
    <div class="form">
      <el-form ref="form" :model="form" :rules="rules" label-width="79px">
        <el-form-item label="旧密码：" prop="oldPwd">
          <el-input type="password" v-model="form.oldPwd" placeholder="请输入您的旧密码" class="input"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPwd">
          <el-input type="password" v-model="form.newPwd" placeholder="请输入您的新密码" class="input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')" class="btn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import titleComp from '../../../components/title-comp'
import { mapGetters } from 'vuex'
export default {
  name: 'pwd-reset',
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
        oldPwd: '',
        newPwd: ''
      },
      loading: false,
      rules: {
        oldPwd: [
          { required: true, message: '请输入您的旧密码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入您的新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              this.form.oldPwd === this.form.newPwd ? callback(new Error('新密码不能和旧密码相同')) : callback()
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'isAuthenticated'
    })
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
    onSubmit (form) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.userRestPwd()
        } else {
          return false
        }
      })
    },
    userRestPwd () {
      var params = {
        old_pwd: md5(this.form.oldPwd),
        pwd: md5(this.form.newPwd)
      }
      this.loading = true
      this.$api.userRestPwd(params).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$msgMnger.success('修改成功，请您重新登录')
          this.unsubscribe()
        }
      }).catch(err => {
        this.loading = false
        this.$msgMnger.error(err.msg)
      })
    },
    unsubscribe () {
      this.$store.dispatch('AUTH_LOGOUT').then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#pwd-reset {
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
  }
}
</style>

<style lang="scss">
#pwd-reset {
}
</style>
