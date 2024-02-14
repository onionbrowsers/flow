<template>
  <!-- 新建流程弹框 -->
  <flow-file-dialog
    ref="flowFileDialog"
    width="762px"
    :title="dlgConfig.title"
    :btn1="dlgConfig.btn1"
    :btn2="dlgConfig.btn2"
    :showClose="true"
    :destroyOnClose="true"
    @beforeClose="handleClose"
    @clickBtn1="handleClickBtn1"
    @clickBtn2="() => dlgConfig.btn2Func()">
    <div class="dialog__input" slot="one">
      <span class="dialog__input-title">文件名称: </span>
      <el-input
        class="dialog__input-context"
        v-model="inputD"
        :maxlength="20"
        :show-word-limit="true"
        placeholder="请输入流程图名称"
        size="small"
        clearable
      ></el-input>
    </div>
<!--    <update-file-->
<!--      v-if="isSlotContentVisible"-->
<!--      slot="one"-->
<!--      ref="showTag"-->
<!--      @addTags="addTags"-->
<!--      :inputRT="''"-->
<!--      :tagList="flowfileTags">-->
<!--    </update-file>-->
    <folder-belonged
      slot="two"
      ref="folderBelonged"
      v-if="flag === 'create' && isSlotContentVisible"
      @refresh-folder-list="handleRefresh('folder')"
    ></folder-belonged>
  </flow-file-dialog>
</template>

<script>
/**
 * 用于文件的 新建 / 修改文件名
 */
import FlowFileDialog from '../../../flowchart/components/public/flowfile-dialog'
// import FlowchartMv from './flowchart-mv'
import FolderBelonged from './folder-belonged'
// import UpdateFile from '../../../flowchart/components/flowfile-list/update-file'
import { mapGetters, mapMutations } from 'vuex'
import Bus from '@/utils/event-bus'

export default {
  components: {
    FlowFileDialog,
    // UpdateFile,
    FolderBelonged
    // FlowchartMv
  },
  props: {
    templateId: {
      default: ''
    }
  },
  data () {
    return {
      dlgConfigs: {
        'rename': {
          title: '文件信息',
          btn1: { title: '取 消' },
          btn2: { title: '确 定' },
          btn3: null,
          checkedTags: [],
          btn2Func: this.handleClickBtn2
        },
        'create': {
          title: '创建流程图',
          btn1: { title: '取 消' },
          btn2: { title: '确 定' },
          btn3: null,
          checkedTags: [],
          btn2Func: this.handleCreate
        }
      },
      dlgConfig: {},
      // 表征用于何种情形
      flag: 'rename',
      renameInfo: '',
      // 用于显示隐藏插槽内容, 如上 update-file 和 folder-belonged
      isSlotContentVisible: false,
      // 流程图名称输入框
      inputD: ''
    }
  },
  computed: {
    ...mapGetters([
      'flowfileTags'
    ])
  },
  watch: {
  },
  mounted () {
    // this.updateTag({ context: this })
  },
  methods: {
    // ...mapActions({
    //   updateTag: 'UPDATE_FLOWFILE_TAGS'
    // }),
    ...mapMutations({
      setFlowId: 'SET_FLOW_ID'
    }),
    /**
     * 创建新文件入口函数, ref 调用
     */
    createNew () {
      this.flag = 'create'
      this.dlgConfig = this.dlgConfigs[this.flag]
      this.$refs.flowFileDialog.updateVisible(true)
      // 显示插槽内容
      this.isSlotContentVisible = true
    },
    /**
     * 修改文件名入口函数, ref 调用
     */
    flowchartRename (data) {
      this.flag = 'rename'
      this.renameInfo = data
      // 填入默认文件名
      this.inputD = data.name
      this.dlgConfig = this.dlgConfigs[this.flag]
      this.$refs.flowFileDialog.updateVisible(true)
      // 显示插槽内容
      this.isSlotContentVisible = true
    },
    handleClickBtn1 () {
      // this.$refs.showTag.$refs.titleTags && this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags([])
      this.inputD = ''
    },
    handleClickBtn2 () {
      const params = {
        file_name: this.inputD,
        file_id: this.renameInfo.id
      }
      // name 校验
      if (!params.file_name) {
        this.$msgMnger.error('流程图名字不能为空')
        return
      }
      // folderId
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.updateFile(params).then(res => {
        this.$message.success(res.msg)
        this.$refs.flowFileDialog.updateVisible(false)
        // window.location.reload()
        // 修改成功后刷新列表
        this.handleRefresh('flowchart')
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$msgMnger.httpError(err)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    /**
     * 用户点击确认创建流程图按钮
     */
    handleCreate () {
      console.log('确认创建流程图')
      // 创建新的模板
      const params = {
        name: this.inputD
        // tags: this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.join(',')
      }
      // if (this.templateId) {
      //   params['template_id'] = this.templateId - 0
      // }
      // name 校验
      if (!params.name) {
        this.$msgMnger.error('流程图名字不能为空')
        return
      }
      // folderId
      const folderId = this.$refs.folderBelonged.getCurrentFolderId()
      if (folderId === -1) {
        this.$msgMnger.error('请选择项目')
        return false
      }
      params['folder_id'] = folderId
      params['company_id'] = this.$store.getters.currentDataSpaceIdGetter
      // this.$api.createFlowFile(params).then((res) => {
      //   this.$refs.flowFileDialog.dialogVisible = false
      //   this.$msgMnger.success('创建成功')
      //   this.setFlowId(res.data.id)
      //   this.$router.push(`/fc/flowfile/${res.data.id}/edit`)
      // }).catch((err) => {
      //   this.$msgMnger.httpError(err)
      // })
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.addFlow(params).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.$msgMnger.success('创建成功!')
        this.$router.push({
          name: 'fc-flowfile-edit',
          params: {
            flowfileId: res.flow_id
          }
        })
      }).catch(err => {
        console.log(err)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.$msgMnger.httpError(err)
      })
    },
    // addTags (item) {
    //   // console.log(item)
    //   if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.indexOf(item) > -1) {
    //     this.$msgMnger.warn('标签不允许重复')
    //     return
    //   }
    //   if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.length > 5 - 1) {
    //     this.$msgMnger.warn('最多可添加5个标签')
    //     return
    //   }
    //   this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.push(item)
    // },
    /**
     * 关闭时的回调函数
     * 关闭时销毁插槽组件
     */
    handleClose () {
      this.isSlotContentVisible = false
      this.inputD = ''
    },
    /**
     * 刷新列表
     * @param flag flowchart or folder
     */
    handleRefresh (flag) {
      Bus.$emit(`refresh-${flag}-list`)
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.dialog__input {
  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .dialog__input-title {
    flex: none;
    margin-right: 20px;
  }
}
</style>
