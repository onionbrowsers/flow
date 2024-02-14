<template>
  <div
    class="handbook"
    v-loading.fullscreen.lock="submitLoading"
    :element-loading-text=loadingText
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    @click="clickLoading"
  >
    <div class="form-content">
      <el-form
        inline
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="form-panel">
        
        <el-form-item label="手册名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入手册名称"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属企业" prop="flodId">
          <el-select :disabled="disabled" v-model="ruleForm.companyId" placeholder="请选择所属企业">
            <el-option
              v-for="item in secondaryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="所属部门" prop="flodId">
          <el-select style="width:110px;" :disabled="disabled" v-model="ruleForm.flodId" placeholder="请选择所属部门">
            <el-option
              v-for="item in flodList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手册级别" prop="level">
          <el-select style="width: 110px;" :disabled="disabled" v-model="ruleForm.level" placeholder="请选择手册级别">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="width: 0; height: 0; overflow: hidden;">
        <el-upload
            ref="uploadRef"
            class="upload-demo"
            action="#"
            accept=".docx"
            :on-error="handleError"
            :on-change="handleUploadSuccess"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :limit="1"
            :file-list="uploadList">
            <!-- <el-button type="primary" ref="uploadRef">导入手册目录</el-button>
            <div slot="tip" class="el-upload__tip">只能上传docx文件，小于200m</div> -->
        </el-upload>
      </div>
      <div class="save-button-wrapper">
        <el-button type="primary" @click="handleValidate" :disabled="disabled">
          {{ manualId ? '生成手册文档' : '保存' }}
        </el-button>
      </div>
    </div>
    <div class="main" >
      <div v-if="!manualId" class="handle-mask" @click.stop @contextmenu.stop></div>
      <div class="folder-content">
        <my-folder
          :uploadManual="uploadManualFlag"
          :showUpload="true"
          :headerStyle="{
            marginTop: '-14px',
            marginBottom: '24px'
          }"
          ref="treeFolder"
          @load='loadTree'
          :depth="4"
          title='手册目录'
          @add="handleAdd"
          @node-click="handleLoadDetail"
          @edit="handleEdit"
          @delete="handleDelete"
          @reset="resetHandbook"
          @click-upload="clickUpload"
          :defaultProps="defaultProps"
          :defaultExpandAll="true"
          :defaultExpandKeys="['6']"
          >
        </my-folder>
      </div>
      <div class="table-content">
        <FolderTable ref="folderTable"></FolderTable>
      </div>
    </div>
    <NodeDialog :uploadManual="uploadManualFlag" @initIframe="initIframeData" @changeTableItem="changeTableItem" @saveNode="saveNode" :flodList="flodList" ref="addDialog"/>
    <div v-if="flowfileId" style="width: 0; height: 0; overflow: hidden; position: absolute; z-index: -99">
      <iframe ref="xmlToImgIframe" :src="iframeUrl" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import NodeDialog from './NodeDialog.vue'
import MyFolder from './folder/index.vue'
import FolderTable from './folder/folderTable.vue'
import { Levels } from './constant'
import { mapGetters } from 'vuex'
import msgMixin from './msgMixin'
export default {
  components: {
    MyFolder,
    NodeDialog,
    FolderTable
  },
  mixins: [msgMixin],
  data () {
    return {
      loadingText: '手册库正在努力生成中，可能会需要一段时间，请耐心等待，稍后在手册库中查看。',
      defaultJson: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      disabled: false,
      ruleForm: {
        name: '',
        flodId: '',
        level: '',
        companyId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入手册名称', trigger: 'blur' }
        ],
        flodId: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择手册级别', trigger: 'change' }
        ]
      },
      levelList: Levels,
      flodList: [],
      secondaryList: [],
      pageInfo: {},
      manualId: null,
      dialogVisible: false,
      uploadList: [],
      flowfileId: '',
      selectRow: {},
      submitLoading: false,
      uploadManualFlag: true
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter', 'personalDataSpaceGetter']),
    iframeUrl () {
      return `/xmlToImg/${this.flowfileId}?sheetName=${this.selectRow.page_name}`
    }
  },
  mounted () {
    this.getFlodS()
    window.addEventListener('message', this.getFile)
    document.addEventListener('click', this.clickLoading)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickLoading)
  },
  created () {
    if (this.$route.query.manual_id) {
      this.manualId = this.$route.query.manual_id
      this.$api.getHandbookTableData({
        navigation: 1,
        page: 1,
        page_size: 1,
        manual_id: this.manualId
      }).then(res => {
        const { code, imported } = res
        if (code === 0) {
          this.uploadManualFlag = imported === 1
        }
      })
      this.$api.showHandbookByManualId({
        manual_id: this.manualId
      }).then(res => {
        const { code, data } = res
        if (code === 0) {
          this.ruleForm = {
            name: data.filename,
            flodId: data.department,
            level: data.level,
            companyId: data.company_id
          }
        }
      }).catch(() => {
        this.message.error('获取手册信息失败')
      })
    }
  },
  watch: {
    currentDataSpaceIdGetter () {
      this.getFlodS()
    }
  },
  methods: {
    clickUpload () {
      if (!this.manualId) {
        this.$refs.uploadRef.$refs['upload-inner'].handleClick()
        return
      }
      this.$msgbox({
        title: '',
        message: '导入手册后当前已编辑目录会被覆盖或丢失，请确认是否导入？',
        type: 'warning',
        showCancelButton: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.$refs.uploadRef.$refs['upload-inner'].handleClick()
          }
          return done()
        }
      })
    },
    clickLoading (event) {
      const { target } = event
      if (!target.className.includes('el-loading-mask') || !target.className.includes('fullscreen')) {
        return
      }
      this.$router.back()
    },
    changeTableItem (row) {
      this.flowfileId = row.flow_id
      this.selectRow = row
    },
    initIframeData () {
      this.flowfileId = ''
      this.selectRow = {}
    },
    getFile ({ data = {} }) {
      if (data.iframeName !== 'iframe') {
        return
      }
      this.$refs.addDialog.getFile(data)
    },
    uploadManual () {
      this.dialogVisible = true
    },
    saveNode (params) {
      if (params.isEdit) {
        this.editNode(params)
        return
      }
      this.createNode(params)
    },
    createNode ({ form, node, data, cb }) {
      this.$api.addHandbookTitle({
        title_level: !node ? 1 : node.level + 1,
        parent_title_id: !node ? -1 : data.id,
        title_name: form.name,
        manual_id: this.manualId
      }).then(res => {
        const { code } = res
        if (code === 0) {
          cb && cb()
          this.$refs.treeFolder.getTreeData()
          this.message.success('添加成功')
        }
      }).catch(err => {
        this.message.error(err.msg || '添加失败')
      })
    },
    editNode ({ form, tags, data, cb }) {
      this.$api.editManualCatalog({
        data_list: JSON.stringify(tags.map(item => {
          const { flow_id, img_id, name, localpath, module } = item
          return {
            flow_id,
            page_id: img_id,
            page_name: name,
            path: localpath,
            moudle: module
          }
        })),
        title_id: data.id,
        manual_id: this.manualId,
        titlename: form.name
      }).then(res => {
        const { code } = res
        if (code === 0) {
          this.message.success('添加成功')
          this.$refs.folderTable.getTableData()
          this.$refs.treeFolder.getTreeData()
          cb && cb()
        }
      }).catch(err => {
        if (err.code == -2) {
          this.message.warn(err.msg || '添加失败')
          return
        }
        this.message.error(err.msg || '添加失败')
      })
    },
    resetHandbook () {
      this.$msgbox({
        title: '重置',
        message: '重置后目录内容将被清空，请确认是否重置？',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.$api.resetHandbook({
              isreset: true,
              manual_id: this.manualId
            }).then(res => {
              const { code, data } = res
              if (code === 0) {
                this.message.success('重置成功')
                this.$refs.treeFolder.getTreeData()
                this.$refs.folderTable.getTableData()
              }
            }).catch(err => {
              this.message.success(err.msg || '重置失败')
            })
          }
          return done()
        }
      })
    },
    handleEdit (params) {
      this.$refs.addDialog.edit(params)
    },
    handleAdd (params) {
      this.$refs.addDialog.add(params)
    },
    loadTree (cb) {
      this.getManualContent(cb)
    },
    handleLoadDetail (node) {
      console.log(node)
    },
    handleDelete (params) {
      const { data, callback } = params
      this.$api.deleteHandbookTitle({
        manual_id: this.manualId,
        title_id: data.id
      }).then(res => {
        const { code } = res
        if (code === 0) {
          this.message.success('删除成功')
          this.$refs.treeFolder.getTreeData()
        } else {
          this.message.error('删除失败')
        }
      }).finally(() => {
        callback()
      })
    },
    handleValidate () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        this.handleSave()
      })
    },
    handleSave () {
      this.submitLoading = true
      if (this.$route.query.manual_id) {
        this.handleEditHandbook()
        return
      }
      this.handleCreateHandbook()
    },
    handleEditHandbook () {
      const { name, flodId, level, companyId } = this.ruleForm
      this.$api.createHandbookDoc({
        manual_id: this.$route.query.manual_id,
        manualname: name,
        folder_id: flodId,
        level: level,
        company_id: companyId || this.currentDataSpaceIdGetter
      }).then(res => {
        const { code } = res
        if (code === 0) {
          this.message.success('生成文档成功')
          this.$router.back()
        }
      }).catch(err => {
        this.message.error(err.msg || '生成文档失败')
      }).finally(() => {
        this.submitLoading = false
      })
    },
    handleUploadHandbook (file) {
      const formData = new FormData()
      formData.append('manual_id', this.manualId)
      formData.append('file', file.raw)
      this.submitLoading = true
      this.$api.uploadHandbook(formData).then(res => {
        const { code } = res
        if (code === 0) {
          this.ruleForm.name = file.name.replace(/.docx$/, '')
          this.uploadManualFlag = true
          this.$refs.treeFolder.getTreeData()
        }
      }).finally(() => {
        this.submitLoading = false
      })
    },
    handleCreateHandbook () {
      const { name, flodId, level, companyId } = this.ruleForm
      this.$api.createHandBook({
        manual_name: name,
        folder_id: flodId,
        manual_level: level,
        company_id: companyId || this.currentDataSpaceIdGetter
      }).then(this.successCreate).finally(() => {
        this.submitLoading = false
      })
    },
    successCreate (res) {
      const { data, code } = res 
      if (code === 0) {
        this.uploadList = []
        this.message.success('新增成功')
        this.manualId = data.id
        this.$router.replace({
          name: this.$route.name,
          query: {
            manual_id: data.id || data.manual_id
          }
        })
        location.reload()
      } else {
        this.message.error('新增失败')
      }
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    // 返回
    reback () {
      this.$router.back()
    },
    getFlodS (id) {
      this.$api.getUserFolder({ companyId: this.currentDataSpaceIdGetter }).then(res => {
        this.flodList = res.data || []
        // this.memberLibList()
      }).catch(err => {
        this.message.httpError(err)
      })
    },
    getManualContent (cb) {
      if (!this.$route.query.manual_id) {
        cb(this.defaultJson)
        return
      }
      this.$api.getHandBookContentById({
        manual_id: this.$route.query.manual_id
      }).then(res => {
        const { code, data } = res
        if (code === 0) {
          this.defaultJson = data || []
          cb(this.defaultJson)
        }
      })
    },
    beforeUpload (file, fileList) {
      let filesize = 0
      fileList.forEach(ele => {
        filesize += ele.size
      })
      const isLt200M = filesize / 1024 / 1024 <= 200
      if (!isLt200M) {
        this.message.warn('上传文件大小不能超过 200MB!')
        return false
      }
      return true
    },
    handleUploadSuccess (file, fileList) {
      this.handleUploadHandbook(file)
    },
    handleError (err, file, fileList) {
      this.fileList = fileList
      this.message.error('上传失败')
    },
  }
}
</script>

<style lang="scss" scoped>
.handbook {
  height: 100%;
  overflow-y: auto;
  .el-form-item{
   &:last-child{
    margin: 0
   } 
  }
  .form-content{
    padding: 16px;
    background-color: #fff;
    margin-top: 10px;
    overflow: auto;
    position: relative;
    .form-panel{
      text-align: left;
      margin-right: 180px;
      .el-select{
        width: 100%
      }
    }

    .save-button-wrapper {
      position: absolute;
      right: 16px;
      top: 16px;
    }
  }
  .main{
    margin-top: 8px;
    background-color: #fff;
    position: relative;
    .table-content{
      padding-left: 16px;
    }
    .handle-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 9;
    }
  }
}
</style>
