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
        <el-form-item label="组织级别" prop="level">
          <el-select :disabled="disabled || !this.isNew" @change="handleLevelChange" v-model="ruleForm.level" placeholder="请选择组织级别">
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级组织" prop="uppid">
          <el-select :disabled="disabled" v-model="ruleForm.uppid" placeholder="请选择上级组织">
            <el-option
              v-for="item in parentOrgList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织名称" @change="handleChangeOwner" prop="name">
          <el-input
            :disabled="disabled"
            v-model="ruleForm.name"
            placeholder="请输入组织名称"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="组织负责人" prop="manager">
          <el-select :disabled="disabled" v-model="ruleForm.leader_id" @change="handleSelectOwner" placeholder="请选择组织负责人">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人电话" prop="leader_phone">
          <el-input
            disabled
            v-model="ruleForm.leader_phone"
            placeholder="请输入负责人电话"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="组织描述" prop="description">
          <el-input :disabled="disabled" rows="3" type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="是否为末级组织" prop="orgfinal">
          <el-switch 
          :disabled="disabled"
            :inactive-value="2"
            :active-value="1"
          v-model="ruleForm.orgfinal" ></el-switch>
        </el-form-item>
        <el-form-item label="组织状态" prop="status">
          <el-switch 
            :disabled="disabled"
            :inactive-value="2"
            :active-value="1"
            v-model="ruleForm.status"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleValidate" :disabled="disabled">提交</el-button>
          <el-button :disabled="disabled" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Detail } from './base'
import { isDef } from '@/utils/utils'
import Breadcrumb from '@/components/public/Breadcrumb.vue'
import { LEVELS } from '../constant/index'
export default {
  name: 'detail',
  components: {
    Breadcrumb
  },
  filters: {

  },
  props: [],
  data () {
    return {
      formatKeys: ['status', 'uppid', 'leader_id', 'id', 'level', 'orgfinal'],
      title: '',
      config: [{ to: '/company/org/org-manage', name: '组织管理' }],
      parentOrgList: [],
      userList: [],
      levelList: LEVELS,
      ruleForm: {
        level: '',
        uppid: '',
        name: '',
        leader_id: '',
        description: '',
        status: 1,
        orgfinal: 2
      },
      rules: {
        level: [
          { required: true, message: '请选择组织级别', trigger: 'change' }
        ],
        uppid: [
          { required: false, message: '请选择上级组织', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择组织状态', trigger: 'change' }
        ]
      }
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
    this.title = this.isNew ? '新建组织' : '编辑组织'
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
      this.getSimpleStaffList()
      if (this.isNew) return
      this.getDetail((params) => {
        if (params.uppid === -1) {
          params.uppid = ''
        }
      })
      this.getParentOrgList()
    },
    handleChangeOwner () {
      this.getSimpleStaffList()
    },
    handleSelectOwner () {
      this.userList.forEach((item) => {
        if (item.id === this.ruleForm.leader_id) {
          this.ruleForm.leader_phone = item.phone
        }
      })
    },
    async getSimpleStaffList () {
      const res = await this.$api.getSimpleStaffList(this.getParams({ 
      }))
      this.userList = res.data
    },
    handleLevelChange () {
      const required = !!(this.ruleForm.level !== 1)
      this.rules.uppid[0].required = required
      this.getParentOrgList()
    },
    async getParentOrgList () {
      const { level } = this.ruleForm
      if (!level) return
      const res = await this.$api.getSimpleOrgList(this.getParams({
        level
      }))
      if (res.code !== 0) return
      this.parentOrgList = res.data
      const id = this.ruleForm.uppid
      if (!id) return
      const item = this.parentOrgList.find(item => item.id === id)
      if (!item) {
        this.ruleForm.uppid = ''
      }
    },
    handleSave () {
      const id = this.ruleForm.uppid
      const method = this.isNew ? 'createOrg' : 'updateOrg'
      this.$api[method](this.getParams({
        ...this.ruleForm,
        uppid: isDef(id) ? id : -1
      })).then(() => {
        this.handleSaveComplete()
      }).catch((res) => {
        this.$message.error(res.msg)
      })
    },
    resetForm () {
      this.userList = []
      this.ruleForm.leader_id = ''
      this.$refs.ruleForm.resetFields()
    },
    ...Detail.methods
  }
}
</script>

<style lang="scss" scoped>
@import './detail.scss'; 
</style>
