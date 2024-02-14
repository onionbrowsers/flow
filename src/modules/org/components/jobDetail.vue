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
        
        <el-form-item label="岗位名称" prop="name">
          <el-input
            :disabled="disabled"
            v-model="ruleForm.name"
            placeholder="请输入岗位名称"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属组织" prop="org">
          <el-select :disabled="disabled" v-model="ruleForm.folder_id" placeholder="请选择所属组织">
            <el-option
              v-for="item in parentAllOrgList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="岗位描述" prop="desc">
          <el-input rows="3" :disabled="disabled" type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
          :disabled="disabled"
          :inactive-value="2"
          :active-value="1"
          v-model="ruleForm.status"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleValidate" :disabled="disabled">提交</el-button>
          <el-button @click="resetForm" :disabled="disabled">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Detail } from './base'
import Breadcrumb from '@/components/public/Breadcrumb.vue'
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
      formatKeys: ['status', 'id'],
      title: '',
      config: [{ to: '/company/org/job-manage', name: '岗位管理' }],
      levelList: [],
      ruleForm: {
        folder_id: '',
        name: '',
        description: '',
        status: 1,
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        folder_id: [
          { required: true, message: '请选择所属组织', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择组织状态', trigger: 'change' }
        ]
      },
      ...Detail.data,
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
    this.title = this.isNew ? '新建岗位' : '编辑岗位'
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
      this.getFinalOrganization().then(() => {
        const id = this.ruleForm.folder_id
        if (!id) return
        const item = this.parentAllOrgList.find(item => item.id === id)
        if (!item) {
          this.ruleForm.folder_id = ''
        }
      })
      // this.getAllParentOrgList().then(() => {
      //   const id = this.ruleForm.folder_id
      //   if (!id) return
      //   const item = this.parentAllOrgList.find(item => item.id === id)
      //   if (!item) {
      //     this.ruleForm.folder_id = ''
      //   }
      // })
      if (this.isNew) return
      this.getDetail()
    },
    handleSave () {
      const method = this.isNew ? 'createJob' : 'updateJob'
      this.$api[method](this.getParams({
        ...this.ruleForm
      })).then(() => {
        this.handleSaveComplete()
      }).catch((res) => {
        this.$message.error(res.msg)
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    ...Detail.methods
  }
}
</script>

<style lang="scss" scoped>
@import './detail.scss'; 
</style>
