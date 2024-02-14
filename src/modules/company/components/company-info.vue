<template>
  <div id="company-info" v-loading="loading">
    <div class="information">
      <title-comp txt="企业信息"></title-comp>
      <div class="form">
        <el-form ref="form" :rules="enterpriseRules" :model="form" label-width="130px">
          <el-form-item label="企业/组织名称：" prop="enterpriseName">
            <el-input v-model="form.enterpriseName" placeholder="请输入您的企业名称" class="input" :disabled="userType !== 1 && userType !== 2 "></el-input>
          </el-form-item>
          <el-form-item label="人员规模：">
            <el-select v-model="form.enterpriseScale" placeholder="请选择" popper-class="selectClass" :disabled="userType !== 1 && userType !== 2 ">
              <el-option
                v-for="item in form.options"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话：" prop="enterprisePhone">
            <el-input v-model="form.enterprisePhone" placeholder="请输入您的企业联系电话" class="input" :disabled="userType !== 1 && userType !== 2 "></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="informationFormOnSubmit('form')" class="btn" :disabled="userType !== 1 && userType !== 2 ">更新资料</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
<!--    <div class="business-card">-->
<!--      <title-comp :txt="userName + '企业名片'"></title-comp>-->
<!--      <div class="form">-->
<!--        <el-form ref="userForm" :model="userForm" label-width="116px">-->
<!--          <el-form-item label="头像：">-->
<!--            <el-upload-->
<!--              ref="upload"-->
<!--              class="avatar-uploader"-->
<!--              action="https://jsonplaceholder.typicode.com/posts/"-->
<!--              :before-upload="beforeAvatarUpload"-->
<!--              :show-file-list="false"-->
<!--              :auto-upload="false">-->
<!--              <div class="img">-->
<!--                <img v-if="userForm.userHeadPortrait" :src="userForm.userHeadPortrait" class="avatar">-->
<!--                <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--              </div>-->
<!--              <div slot="tip" class="el-upload__tip">点击更换头像</div>-->
<!--            </el-upload>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="姓名：">-->
<!--            <el-input v-model="userForm.userName" placeholder="请输入您的姓名" class="input"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="联系电话：">-->
<!--            <el-input v-model="userForm.userPhone" placeholder="请输入您的联系电话" class="input"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="businessCardFormOnSubmit" class="btn">更新资料</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import titleComp from '@/components/title-comp'
import { mapGetters } from 'vuex'
export default {
  name: 'company-info',
  components: {
    titleComp
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      userName: '我的',
      loading: false,
      form: {
        enterpriseName: '',
        enterprisePhone: '',
        enterpriseScale: null,
        options: [{
          value: 1,
          label: '1~30人'
        }, {
          value: 2,
          label: '30~50人'
        }, {
          value: 3,
          label: '50~100人'
        }, {
          value: 4,
          label: '100~500人'
        }, {
          value: 5,
          label: '500人以上'
        }]
      },
      userForm: {
        userHeadPortrait: '',
        userName: '',
        userPhone: ''
      },
      enterpriseRules: {
        enterpriseName: [
          { required: true, message: '请输入您的企业名称', trigger: 'blur' }
        ],
        enterprisePhone: [
          { required: true, message: '请输入您的企业联系电话', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const re = /^0?(13|14|15|17|18|19)[0-9]{9}|(852)[0-9]{8}$/
              this.getVerificationCodeDisabled = !re.test(value)
              re.test(value) ? callback() : callback(new Error('请输入正确的手机号'))
            },
            trigger: 'blur'
          }
        ]
      },
      // 当前用户在某企业中的权限
      userType: -1 // 1 超管 2 管理员 3 普通成员 -1 无权限
    }
  },
  computed: {
    ...mapGetters({
      companyDataSpaceGetter: 'companyDataSpaceGetter',
      currentDataSpaceIdGetter: 'currentDataSpaceIdGetter'
    })
  },
  watch: {
    companyDataSpaceGetter: {
      handler (companyDataSpaceGetter) {
        this.setForm(companyDataSpaceGetter)
      },
      deep: true
    }
  },
  created () {

  },
  mounted () {
    if (this.companyDataSpaceGetter.length) {
      this.setForm(this.companyDataSpaceGetter)
    }
  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    setForm (companyDataSpaceGetter) {
      var _form = companyDataSpaceGetter.find(item => item.id === Number(this.$route.query.id || this.currentDataSpaceIdGetter))
      if (!_form) return
      this.form.enterpriseName = _form.name
      this.form.enterprisePhone = _form.phone
      this.form.enterpriseScale = Number(_form.size)
      // 获取当前用户在企业中的权限
      this.getUserPermission(this.$route.query.id || this.currentDataSpaceIdGetter)
    },
    informationFormOnSubmit (form) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.updateEnterpriseInformation()
        } else {
          return false
        }
      })
    },
    updateEnterpriseInformation () {
      var params = {
        name: this.form.enterpriseName,
        size: this.form.enterpriseScale,
        phone: this.form.enterprisePhone,
        company_id: this.$route.query.id || this.currentDataSpaceIdGetter
      }
      this.loading = true
      this.$api.updateEnterpriseInformation(params).then(res => {
        this.loading = false
        this.$msgMnger.success(res.msg)
        this.$store.dispatch('GET_COMPANIES_ACTION', this)
      }).catch(err => {
        this.loading = false
        this.$msgMnger.error(err.msg)
      })
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      return isJPG || isPNG
    },
    /**
     * 获取用户在某企业中的权限
     * res: 1 超管 2 管理员 3 成员
     * @param id 某企业的id
     */
    getUserPermission (id) {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getUserPermission({ company_id: id, check_type: 1 }).then(res => {
        // 赋值
        this.userType = res.data
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#company-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  .information{
    /*height: 338px;*/
    height: 100%;
    .form{
      height: calc(100% - 66px);
      background: white;
    }
  }
  .el-input{
    width:368px;
    height:40px;
    float: left;
  }
  .el-input__inner{
    background:rgba(247,247,247,1);
    border-radius:4px;
    border:1px solid rgba(217,217,217,1);
    color: #252525;
  }
  .el-input__inner::placeholder{
    color:#999999;
    font-size: 14px;
  }
  .form{
    background: white;
    padding: 23px 24px;
    box-sizing: border-box;
    border-top: 1px solid #E8E8E8;
  }
  
  .business-card{
    height: calc(100% - 338px);
    .form{
      height: calc(100% - 66px);
    }
    .avatar-uploader{
      width: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .img{
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #C0C0C0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-upload__tip{
      font-size: 12px;
      color: #92A3B3;
      margin-top: 4px;
      line-height: 12px;
    }
  }
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
</style>

<style lang="scss">
  .selectClass{
    .el-select-dropdown__list{
      padding-bottom: 20px !important;
    }
  }
</style>
