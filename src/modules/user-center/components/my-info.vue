<template>
  <div id="my-info" v-loading="loading">
    <title-comp txt="基本信息"></title-comp>
    <div class="info-from">
      <el-form ref="form" :rules="rules" :model="form" label-width="82px">
        <el-form-item label="头像：">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="/api/v2/fc/user/update_user_info"
            :on-change="onChange"
            list-type="picture"
            :data="paramsData"
            name="image"
            :headers="headers"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
          >
            <div class="img">
              <img v-if="form.image" :src="form.image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <div slot="tip" class="el-upload__tip">点击更换头像</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名：" prop="user_name">
          <el-input v-model="form.user_name" placeholder="请输入您的用户名" class="input"></el-input>
        </el-form-item>
        <el-form-item label="生日：">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy 年 MM 月 dd 日"
            v-model="form.birthday"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio v-model="form.gender" label="1">男</el-radio>
          <el-radio v-model="form.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="所在城市：">
          <el-input v-model="form.city" placeholder="请输入您的所在城市" class="input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')" class="btn">更新资料</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import titleComp from '../../../components/title-comp'
import { mapGetters } from 'vuex'
import $ from 'jquery'
export default {
  name: 'my-info',
  components: {
    titleComp
  },
  filters: {},
  props: {},
  data () {
    return {
      form: {
        user_name: '',
        city: '',
        gender: '1',
        birthday: '',
        image: ''
      },
      rules: {
        user_name: [
          { required: true, message: '请输入您的用户名', trigger: 'blur' }
        ]
      },
      imageUrlChange: '', // 判断当前用户更新资料时有没有更改图片
      loading: false,
      paramsData: {},
      headers: {}
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    userInfo: {
      handler (userInfo) {
        this.setForm(userInfo)
      },
      deep: true
    }
  },
  created () {},
  mounted () {
    this.setForm(this.userInfo)
  },
  activated () {},
  beforeDestroy () {},
  methods: {
    setForm (userInfo) {
      this.form.user_name = userInfo.username
      if (userInfo.image) {
        this.form.image = userInfo.image
      }
      if (userInfo.gender) {
        this.form.gender = String(userInfo.gender)
      }
      this.form.city = userInfo.city
      this.form.birthday = userInfo.birthday
    },
    onSubmit (form) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let _token = this.$store.getters.token
          if (_token !== '') {
            this.$set(this.headers, 'Authorization', 'Bearer ' + _token)
          }
          this.paramsData = {
            user_name: this.form.user_name,
            birthday: this.form.birthday,
            city: this.form.city,
            gender: this.form.gender
          }
          const formData = new FormData()
          for (const key in this.form) {
            if (
              this.form.hasOwnProperty(key) &&
              this.form[key] &&
              key !== 'image'
            ) {
              formData.append(key, this.form[key])
            }
          }
          if (!this.imageUrlChange) {
            // this.userInfoEdit(fd)
            this.userInfoEditAjax(formData)
          } else {
            this.$nextTick(() => {
              this.$refs.upload.submit()
            })
          }
        } else {
          return false
        }
      })
    },
    userInfoEdit (params) {
      this.loading = true
      this.$api
        .changeUserInfo(params)
        .then(res => {
          this.loading = false
          this.$store.dispatch('GET_USER_INFO', this)
          this.$msgMnger.success(res.data)
        })
        .catch(err => {
          this.loading = false
          this.$msgMnger.error(err.msg)
        })
    },
    uploadSuccess () {
      this.$nextTick(() => {
        this.imageUrlChange = null
        this.$store.dispatch('GET_USER_INFO', this)
        this.$msgMnger.success('操作成功')
      })
    },
    userInfoEditAjax (formData) {
      $.ajax({
        url: '/api/v2/fc/user/update_user_info',
        method: 'post',
        contentType: false,
        processData: false,
        dataType: 'json',
        data: formData,
        beforeSend: function (XMLHttpRequest) {
          let token = localStorage.getItem('user-token') || ''
          XMLHttpRequest.setRequestHeader('Authorization', 'Bearer ' + token)
        },
        success: res => {
          if (res.code !== 0) {
            this.$msgMnger.httpError(res.msg)
            return
          }
          this.$store.dispatch('GET_USER_INFO', this)
          this.$msgMnger.success(res.data)
        },
        error: err => {
          this.$msgMnger.httpError(err.msg)
        }
      })
    },
    onChange (file, fileList) {
      this.form.image = URL.createObjectURL(file.raw)
      this.imageUrlChange = file.raw
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
    }
  }
}
</script>

<style lang="scss" scoped>
#my-info {
  height: calc(100% - 16px);
  .info-from {
    height: calc(100% - 34px);
    background: white;
    padding: 23px 24px;
    box-sizing: border-box;
    border-top: 1px solid #e8e8e8;
    .btn {
      float: left;
      width: 96px;
      height: 32px;
      line-height: 32px;
      background: rgba(24, 144, 255, 1);
      border-radius: 4px;
      padding: 0;
    }
    .btn:hover {
      background: #46a6ff;
      border-color: #46a6ff;
      color: #fff;
    }
    .btn:active {
      background: #1682e6;
      border-color: #1682e6;
      color: #fff;
      outline: none;
    }
    .avatar-uploader {
      width: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #c0c0c0;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .el-upload__tip {
      font-size: 12px;
      color: #92a3b3;
      margin-top: 4px;
      line-height: 12px;
    }
  }
}
</style>

<style lang="scss">
#my-info {
  text-align: left !important;
  .el-form-item {
    margin-bottom: 24px;
  }
}
</style>
