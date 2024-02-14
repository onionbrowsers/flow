<template>
  <div class="content-wrapper" >
    <Breadcrumb :config="config"/>
    <!-- <title-comp :txt="title"></title-comp> -->
    <div class="content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="form-panel">
        
        <el-form-item label="员工姓名" prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入员工姓名"
            size="small"
            :disabled="disabled"
          ></el-input>
        </el-form-item>        
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="ruleForm.phone"
            placeholder="请输入手机号"
            size="small"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属组织" prop="org_id">
          <el-select :disabled="disabled" v-model="ruleForm.org_id" @change="handleChangeOrg" placeholder="请选择所属组织">
            <el-option
              v-for="item in finalOrgList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="job_id">
          <el-select :disabled="disabled" v-model="ruleForm.job_id" placeholder="请选择所属岗位">
            <el-option
              v-for="item in jobList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="type">
          <el-select :disabled="disabled" v-model="ruleForm.type" placeholder="请选择空间权限">
            <el-option
              v-for="item in authList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工介绍" prop="introduce">
          <el-input :disabled="disabled" rows="3" 
            type="textarea" 
            :inactive-value="2"
            :active-value="1"
          v-model="ruleForm.introduce"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch 
          :disabled="disabled"
          :inactive-value="2"
          :active-value="1"
          v-model="ruleForm.status"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :disabled="disabled" @click="handleValidate">提交</el-button>
          <el-button :disabled="disabled" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Detail } from './base'
import Breadcrumb from '@/components/public/Breadcrumb.vue'
import { AUTH } from '../constant/index'
import { phoneRule } from '@/utils/validate-rules'
export default {
  name: 'detail',
  components: {
    Breadcrumb
  },
  filters: {

  },
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {
      formatKeys: ['status', 'type', 'id', 'job_id', 'org_id'],
      title: '',
      config: [{ to: '/company/org/staff-manage', name: '员工管理' }],
      jobList: [],
      finalOrgList: [],
      authList: AUTH,
      ruleForm: {
        username: '',
        phone: '',
        org_id: '',
        job_id: '',
        type: '',
        introduce: '',
        status: 1
      },
      rules: {
        username: [
          { required: true, message: '请输入员工姓名', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { required: false, validator: phoneRule, trigger: 'blur' }
        ],
        // org_id: [
        //   { required: true, message: '请选择组织', trigger: 'change' }
        // ],
        // job_id: [
        //   { required: true, message: '请选择岗位', trigger: 'blur' }
        // ],
        type: [
          { required: true, message: '请选择权限', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      ...Detail.data
    }
  },
  computed: {
    ...Detail.computed
  },
  watch: {
    ...Detail.watch
  },
  created () {

  },
  mounted () {
    this.title = this.isNew ? '新建员工信息' : '编辑员工信息'
    this.config.push(this.title)
 
    this.init()
  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    init () {
      if (this.currentDataSpaceIdGetter < 0) return
      this.getFinalOrgList()
      if (this.isNew) return
      this.getDetail()
      this.getJobList()
    },
    async getFinalOrgList () {
      const res = await this.$api.getFinalOrgList(this.getParams({}))
      if (res.code !== 0) return
      this.finalOrgList = res.data
      const id = this.ruleForm.uppid
      if (!id) return
      const item = this.finalOrgList.find(item => item.id === id)
      if (!item) {
        this.ruleForm.uppid = ''
      }
    },
    handleChangeOrg () {
      this.ruleForm.job_id = ''
      this.getJobList()
    },
    async getJobList () {
      const res = await this.$api.getSimpleJobList(this.getParams({
        org_id: this.ruleForm.org_id
      }))
      if (res.code !== 0) return
      this.jobList = res.data
      const item = this.jobList.find((item) => item.id === this.ruleForm.job_id)
      if (!item) {
        this.ruleForm.job_id = ''
      }
    },
    handleSave () {
      const method = this.isNew ? 'createStaff' : 'updateStaff'
      this.$api[method](this.getParams({
        ...this.ruleForm,
        folder_old_id: this.params.org_id || ''
      })).then(() => {
        this.handleSaveComplete()
      }).catch((res) => {
        this.$message.error(res.msg)
      })
    },
    resetForm () {
      this.ruleForm.job_id = ''
      this.getJobList = []
      this.$refs.ruleForm.resetFields()
    },
    ...Detail.methods
  }
}
</script>

<style lang="scss" scoped>
@import './detail.scss'; 
</style>
