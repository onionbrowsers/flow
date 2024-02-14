<template>
  <!-- 新建流程弹框 -->
  <flow-file-dialog
    ref="flowFileItemDialog"
    width="320px"
    :title="dlgConfigs.title"
    :btn1="dlgConfigs.btn1"
    :btn2="dlgConfigs.btn2"
    :showClose="true"
    @clickBtn1="handleClickBtn1"
    @clickBtn2="handleClickBtn2">
    <update-file
      slot="one"
      ref="showTag"
      @addTags="addTags"
      :inputRT="''"
      :tagList="flowfileTags">
    </update-file>
  </flow-file-dialog>
</template>

<script>
import FlowFileDialog from './flowfile-dialog.vue'
import UpdateFile from '../flowfile-list/update-file'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    FlowFileDialog,
    UpdateFile
  },
  props: {
    templateId: {
      default: ''
    }
  },
  data () {
    return {
      dlgConfigs: {
        title: '创建流程图',
        btn1: { title: '取 消' },
        btn2: { title: '保 存' },
        btn3: null,
        checkedTags: []
      }
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
    this.updateTag({ context: this })
  },
  methods: {
    ...mapActions({
      updateTag: 'UPDATE_FLOWFILE_TAGS'
    }),
    ...mapMutations({
      setFlowId: 'SET_FLOW_ID'
    }),
    creatNew () {
      this.dlgConfig = JSON.parse(JSON.stringify(this.dlgConfigs))
      this.$refs.flowFileItemDialog.updateVisible(true)
    },
    handleClickBtn1 () {
      this.$refs.showTag.$refs.titleTags && this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags([])
      this.$refs.showTag.$refs.titleTags.inputD = ''
    },
    handleClickBtn2 () {
      // 创建新的模板
      const params = {
        name: this.$refs.showTag.$refs.titleTags.inputD,
        tags: this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.join(',')
      }
      if (this.templateId) {
        params['template_id'] = this.templateId - 0
      }

      if (!params.name) {
        this.$msgMnger.error('流程图名字不能为空')
        return
      }
      this.$api.createFlowFile(params).then((res) => {
        this.$refs.flowFileItemDialog.dialogVisible = false
        this.$msgMnger.success('创建成功')
        this.setFlowId(res.data.id)
        this.$router.push({
          name: 'fc-flowfile-edit',
          params: {
            flowfileId: res.data.id
          }
        })
      }).catch((err) => {
        this.$msgMnger.httpError(err)
      })
    },
    addTags (item) {
      // console.log(item)
      if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.indexOf(item) > -1) {
        this.$msgMnger.warn('标签不允许重复')
        return
      }
      if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.length > 5 - 1) {
        this.$msgMnger.warn('最多可添加5个标签')
        return
      }
      this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.push(item)
    }
  }
}
</script>
