<template>
    <div class="create-flow-condition-wrapper">
        <el-form ref="flowForm" :rules="rules" :model="flowForm" label-width="110px">
            <el-form-item :prop="formKey[0]" label="流程图名称：">
                <div class="item-wrapper">
                    <el-input disabled placeholder="请选择" clearable v-model="flowForm[formKey[0]]"></el-input>
                    <i @click="showVisioSelect" class="el-icon-circle-plus-outline icon-wrapper"></i>
                </div>
            </el-form-item>
            <el-form-item :prop="formKey[1]" label="涉及制度：">
                <div class="item-wrapper">
                    <el-input placeholder="请选择" clearable v-model="flowForm[formKey[1]]"></el-input>
                    <i class="el-icon-circle-plus-outline icon-wrapper"></i>
                </div>
            </el-form-item>
            <el-form-item :prop="formKey[2]" label="岗位手册：">
                <div class="item-wrapper">
                    <el-input placeholder="请选择" clearable v-model="flowForm[formKey[2]]"></el-input>
                    <i class="el-icon-circle-plus-outline icon-wrapper"></i>
                </div>
            </el-form-item>
            <el-form-item :prop="formKey[3]" label="部门手册：">
                <div class="item-wrapper">
                    <el-input placeholder="请选择" clearable v-model="flowForm[formKey[3]]"></el-input>
                    <i class="el-icon-circle-plus-outline icon-wrapper"></i>
                </div>
            </el-form-item>
            <el-form-item :prop="formKey[4]" label="公司手册：">
                <div class="item-wrapper">
                    <el-input placeholder="请选择" clearable v-model="flowForm[formKey[4]]"></el-input>
                    <i class="el-icon-circle-plus-outline icon-wrapper"></i>
                </div>
            </el-form-item>
            <el-form-item :prop="formKey[5]"  label="主责部门：">
                <div class="item-wrapper">
                    <el-select style="width:100%" v-model="flowForm[formKey[5]]" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <i class="el-icon-circle-plus-outline icon-wrapper"></i>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
        <loadMoreSelect @load-more="loadMore" @click-item="clickItem" :options="visioData" ref="visioSelect" />
    </div>
</template>

<script>
import { initForm, formKey } from './constant'
import { mapGetters } from 'vuex'
import loadMoreSelect from './loadMoreSelect.vue'
export default {
  components: { loadMoreSelect },
  data () {
    return {
      flowForm: {
        ...initForm
      },
      formKey: [...formKey],
      rules: {
        [formKey[0]]: [
          { required: true, message: '请选择流程图', trigger: 'blur' }
        ],
        [formKey[formKey.length - 2]]: [
          { required: true, message: '请选择主责部门', trigger: 'change' }
        ]
      },
      options: [],
      visioData: [],
      visioPage: {
        current: 1,
        page_size: 10,
        currentLength: 0,
        total: 0
      },
      visioResult: {}
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter'])
  },
  watch: {
    currentDataSpaceIdGetter (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.init()
      }
    }
  },
  created () {
    this.init()
    if (this.$route.query.id) {
      this.getFormData()
    }
  },
  methods: {
    loadMore () {
      if (this.visioPage.total <= this.visioPage.currentLength) return
      this.visioPage.current++
      this.getVisioData()
    },
    clickItem (item) {
      this.visioResult = { ...item }
      this.flowForm[formKey[0]] = item.name
      this.$refs.visioSelect.toggleSelect()
    },
    init () {
      if (this.currentDataSpaceIdGetter === -1) return
      this.getUserFolder()
      this.getVisioData()
    },
    getVisioData () {
      this.$api.getVisioFile({
        company_id: this.currentDataSpaceIdGetter,
        page: this.visioPage.current,
        page_size: this.visioPage.page_size
      }).then(res => {
        const { code, data, total } = res
        if (code == 0) {
          data.forEach(item => {
            if (item.hint && item.hint.length) {
              item.hint.forEach(page => {
                this.visioData.push({
                  name: page.label,
                  id: page.page,
                  parentId: item.id
                })
              })
            }
          })
          this.visioPage.currentLength += data.length
          this.visioPage.total = total
        }
      })
    },
    getUserFolder () {
      this.$api.getUserFolder({
        companyId: this.currentDataSpaceIdGetter
      }).then(res => {
        const { code, data } = res
        if (code == 0) {
          this.options = data
        }
      })
    },
    getFormData () {
      this.$api.showFlowConditionData({
        relation_id: this.$route.query.id
      }).then(res => {
        const { code, data = {} } = res
        if (code == 0) {
          this.flowForm = { ...data }
        }
      }).catch(err => {
        this.$msgMnger.error(err.msg || '查询失败')
      })
    },
    onReset () {
      this.flowForm = initForm
    },
    onSubmit () {
      this.$refs.flowForm.validate(valid => {
        if (!valid) return
        const params = {
          ...this.flowForm,
          flow_id: this.visioResult.parentId || this.flowForm.flow_id,
          company_id: this.currentDataSpaceIdGetter
        }
        if (this.$route.query.id) {
          this.$api.editFlowConditionData({
            ...params,
            relation_id: this.$route.query.id,
          }).then(res => {
            this.$msgMnger.success('编辑成功')
            this.$router.back()
          }).catch(err => {
            this.$msgMnger.error(err.msg || '添加失败')
          })
          return
        }
        this.$api.saveFlowConditionData(params).then(res => {
          const { code } = res
          if (code === 0) {
            this.$msgMnger.success('添加成功')
            this.$router.back()
          }
        }).catch(err => {
          this.$msgMnger.error(err.msg || '添加失败')
        })
      })
    },
    showVisioSelect () {
      this.$refs.visioSelect.toggleSelect()
    }
  }
}
</script>

<style lang="scss" scoped>
.create-flow-condition-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    padding: 24px;
    box-sizing: border-box;

    .item-wrapper {
        display: flex;
        overflow: hidden;
        .icon-wrapper {
            font-size: 20px;
            margin: auto;
            margin-left: 16px;
            cursor: pointer;
        }
    }
}
</style>
