<template>
    <div
        class="judge-handbook-wrapper"
        v-loading.fullscreen.lock="loadingPage"
        element-loading-text="手册正在努力生成中，可能会需要一段时间。（可点击页面退回到列表页面，稍后在手册库中查看）"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        @click="clickLoading"
    >
        <div class="form-content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="form-panel">

                <el-form-item label="手册名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入手册名称"></el-input>
                </el-form-item>

                <el-form-item label="所属部门" prop="flodId">
                    <el-select :disabled="disabled" v-model="ruleForm.flodId" placeholder="请选择所属部门">
                        <el-option
                        v-for="item in flodList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="button-wrapper">
                    <el-button type="primary" @click="handleValidate" :disabled="disabled">提交</el-button>
                    <el-button v-if="changeHandbook" type="primary" @click="handleShow" :disabled="disabled">预览</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tree-wrapper">
            <div :class="['folder-content', this.$route.query.manual_id && 'flex-wrapper']">
                <my-folder
                    ref="treeFolder"
                    @load='loadTree'
                    :depth="3"
                    title='手册目录 *仅可编辑附件1中第三部分控制活动，其他部分如需修改可下载手册至本地后编辑。'
                    @add="handleAdd"
                    @node-click="handleLoadDetail"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    :defaultProps="defaultProps"
                    :defaultExpandAll="false"
                    :dropdown="[
                        { value: 'flod', label: '全部折叠' },
                        { value: 'expand', label: '全部展开' }
                    ]"
                    :allowRootAdd="false"
                >
                </my-folder>
            </div>
            <div v-if="this.$route.query.manual_id" class="folder-table-wrapper">
                <JudgeTable></JudgeTable>
            </div>
        </div>
        <HandBookDialog :companyId="currentDataSpaceIdGetter" @saveNode="saveNode" :flodList="flodList" ref="addDialog"/>
    </div>
</template>

<script>
import { Base64 } from 'js-base64'
import { mapGetters } from 'vuex'
import HandBookDialog from '../handbook/HandbookDialog.vue'
import MyFolder from '../handbook/folder/index.vue'
import JudgeTable from './judgeTable.vue'
import { cloneDeep } from 'lodash'

const specialId = '6-3'

export default {
  components: { MyFolder, HandBookDialog, JudgeTable },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter'])
  },
  watch: {
    currentDataSpaceIdGetter (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.getFlodS()
      }
    }
  },
  mounted () {
    this.getFlodS()
    document.addEventListener('click', this.clickLoading)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickLoading)
  },
  data () {
    return {
      defaultTree: [],
      saveTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      flodList: [],
      disabled: false,
      ruleForm: {
        name: '',
        flodId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入手册名称', trigger: 'blur' },
        ],
        flodId: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ],
      },
      loadingPage: false,
      changeHandbook: false,
      createId: -1
    }
  },
  methods: {
    clickLoading (event) {
      const { target } = event
      if (!target.className.includes('el-loading-mask') || !target.className.includes('fullscreen')) {
        return
      }
      this.$router.back()
    },
    handleEdit (params) {
      this.$refs.addDialog.edit(params)
    },
    handleAdd (params) {
      this.$refs.addDialog.add(params)
    },
    formatTreeData (data = [], id) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        !node.id && (node.id = id ? `${id}-${i + 1}` : `${i + 1}`)
        if (node.id === specialId) {
          node.isEditDisabled = true
          node.isDeleteDisabled = true
        }
        node.tags = []
        if (node.section) {
          node.tags = node.section.map(item => ({
            ...item,
            page: item.id
          }))
        }
        if (node.children && node.children.length) {
          this.formatTreeData(node.children, node.id)
        }
      }
    },
    formatResultData (res, cb) {
      const { code, data } = res
      if (code === 0) {
        if (data.name) {
          this.ruleForm = {
            name: data.name,
            flodId: data.folder_id
          }
        }
        const copyData = cloneDeep(data.data || data)
        this.formatTreeData(copyData)
        this.defaultTree = copyData
        this.$refs.treeFolder.defaultExpandKeys = ['6']
        cb(this.defaultTree)
      }
    },
    loadTree (cb) {
      if (this.$route.query.manual_id) {
        this.$api.getJudgeHandbook({
          manual_id: this.$route.query.manual_id
        }).then(res => this.formatResultData(res, cb))
        return
      }
      this.$api.getJudgeHandbookDirectory().then(res => this.formatResultData(res, cb))
    },
    handleLoadDetail (node) {
      console.log(node)
    },
    handleDelete (params) {
      const { node, data, callback } = params
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      callback()
    },
    handleFormatSaveData (saveData, tree = this.defaultTree) {
      tree.forEach(item => {
        if (item.flag) {
          saveData.push({
            id: item.id,
            name: item.name,
            excel_id: item.excel_id || this.getExcelId(item.tags)
          })
        }
        if (item.children && item.children.length) {
          this.handleFormatSaveData(saveData, item.children)
        }
      })
    },
    handleSave () {
      const saveData = []
      this.handleFormatSaveData(saveData)
      this.loadingPage = true
      this.$api.createJudgeHandbook({
        manual_name: this.ruleForm.name,
        manual_id: this.$route.query.manual_id || '',
        company_id: this.currentDataSpaceIdGetter,
        folder_id: this.ruleForm.flodId,
        json_data: JSON.stringify(saveData.filter(item => item.id !== specialId))
      }).then(res => {
        const { code, muanual_id = 0 } = res
        if (code === 0) {
          this.$msgMnger.success('保存成功')
          this.changeHandbook = true
          this.createId = muanual_id
        }
      }).finally(() => {
        this.loadingPage = false
      })
    },
    handleShow () {
      this.$api.downloadInterNallibs(this.manual_id || this.createId).then(res => {
        if (res.code == 0) {
          let downloadURL = res.data + `?_token=${this.$store.getters.token}`
          window.open(window.location.origin + '/preview/onlinePreview?url=' + encodeURIComponent(Base64.encode(window.location.origin + downloadURL)))
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$msgMnger.warn(err.msg)
      })
    },
    handleValidate () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        this.handleSave()
      })
    },
    getFlodS (id) {
      this.$api.getUserFolder({ companyId: this.currentDataSpaceIdGetter }).then(res => {
        this.flodList = res.data || []
        // this.memberLibList()
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    getExcelId (tags = []) {
      return tags.map(item => item.page || item.id)
    },
    createNode ({ form, tags, node, data }) {
      if (!node) {
        this.defaultTree.push({
          id: this.defaultTree.length,
          name: form.name,
          tags,
          flag: true,
          excel_id: this.getExcelId(tags)
        })
        return
      }
      const nodeData = {
        id: `${data.id}${data.children ? data.children.length + 1 : 1}`,
        name: form.name,
        flag: true,
        excel_id: this.getExcelId(tags),
        tags
      }
      this.$set(data, 'children', [...(data.children || []), nodeData])
    },
    editNode ({ form, tags, data }) {
      this.$set(data, 'name', form.name)
      this.$set(data, 'tags', tags)
      this.$set(data, 'excel_id', this.getExcelId(tags))
    },
    saveNode (params) {
      if (params.isEdit) {
        this.editNode(params)
        return
      }
      this.createNode(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.judge-handbook-wrapper {
    background-color: #fff;
    width: 100%;
    height: 100%;
    text-align: left;
    padding: 24px;
    box-sizing: border-box;
    overflow-y: auto;
    .form-content{
        background-color: #fff;
        position: relative;
        .form-panel{
            width: 400px;
        }
        .button-wrapper {
            position: absolute;
            right: 0;
            top: 0;
        }
    }

    .folder-content {
        width: 100%;
    }
}
</style>
