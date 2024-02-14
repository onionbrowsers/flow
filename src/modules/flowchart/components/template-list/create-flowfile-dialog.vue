<template>
  <div id="create-report-dialog" v-load="{loading: loading, options: {text: '加载中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.8)', fullscreen: true}}">
    <custom-dialog
      ref="createTemplateDialog"
      width="320px"
      :title="dlgConfig.title"
      customClass="create-template-dialog-class"
      :button1="dlgConfig.btn1"
      :button2="dlgConfig.btn2"
      :showClose="true"
      @clickBtn1="handleClickBtn1"
      @clickBtn2="handleClickBtn2"
      @beforeClose="handleBeforeClose"
      >
      <edit-title-tags slot="part4" ref="titleTags" type="报告" :inputRT="inputRT" v-if="dlgConfig.hasOwnProperty('checkedTags')"/>
    </custom-dialog>
  </div>
</template>

<script>
import CustomDialog from '@/components/public/CustomDialog.vue'
import EditTitleTags from '@/components/public/EditTitleTags.vue'
import { updateTags } from '@/components/public/tags-mng.js'
export default {
  props: ['template'],
  components: {
    CustomDialog,
    EditTitleTags
  },
  data () {
    return {
      loading: false,
      inputRT: '',
      dlgConfig: {
        title: '创建报告',
        btn1: { title: '取 消' },
        btn2: { title: '确 定' },
        btn3: null,
        checkedTags: []
      }
    }
  },
  methods: {
    updateVisible (templateTags) {
      this.$refs.createTemplateDialog.updateVisible(true, { event: 'new-report' })
      this.$nextTick(() => {
        this.$refs.titleTags.$refs.tagsBar.updateTags(templateTags)
      })
    },
    updateTags () {
    },
    handleBeforeClose () {
    },
    handleClickBtn1 () {
      this.$refs.titleTags.$refs.tagsBar.updateTags([])
    },
    handleClickBtn2 (data) {
      if (data.event === 'new-report') {
        if (!this.$refs.titleTags.inputD) {
          this.$msgMnger.warn('报告名称不能为空')
          return
        }
        if (!this.$refs.titleTags.inputD.trim()) {
          this.$msgMnger.warn('报告名称不能全部由空格组成')
          return
        }
        let _inputRT = this.$refs.titleTags.inputD
        let _checkedTagsV = this.$refs.titleTags.$refs.tagsBar.dynamicTags
        this.toSaveCreate(_inputRT, _checkedTagsV)
      }
    },
    toSaveCreate (name, tags) {
      let params = { template_id: this.template.id, name: name }
      if (tags.length) {
        params.tags = tags.join(',')
      }
      // this.loading = true
      updateTags.call(this, tags, 'report').then(() => {
        this.$api.createReport(params).then(res => {
          this.$msgMnger.success('新建报告成功')
          let data = res.data
          setTimeout(() => {
            this.$router.push({
              name: 'report-edit',
              params: {
                reportId: data.report_id
              }
            })
          }, 500)
        }).catch(err => {
          this.$msgMnger.httpError(err)
        })
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
#create-report-dialog{
}
</style>
