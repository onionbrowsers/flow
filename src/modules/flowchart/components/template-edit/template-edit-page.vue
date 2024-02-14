<template>
  <div id="t-doc-edit-page">
    <edit-tool-bar
      ref="editToolBar"
      :funcList="toolBarOptions.funcs"
      :selectedPrg="selectedPrg"
      @clickEvent="handleClickEvent"
    />
    <div class="doc-wraper">
      <doc-page-s ref="docPage" :docId="templateId" @insertFinish="handleInsertFinish" @selectedPrg="handleSelectPrg"/>
    </div>
    <help-dialog ref="helpDialog"/>
  </div>
</template>

<script>
import EditToolBar from '@/components/doc-page/EditToolBar.vue'
import DocPageS from '@/components/doc-page/DocPageS.vue'
import HelpDialog from '@/components/doc-page/dialog/HelpDialog.vue'
import bus from '@/utils/event-bus'
import dsi from '../doc-page/doc-style.js'
export default {
  props: ['templateId'],
  components: {
    EditToolBar,
    DocPageS,
    HelpDialog
  },
  data () {
    return {
      toolBarOptions: {
        funcs: ['table', 'diagram', 'save', 'help', 'back']
      },
      selectedPrg: false
    }
  },
  beforeDestroy () {
    bus.$off('to-home', this.back)
    bus.$off('select-single-cell', this.selectSingleCell)
  },
  mounted () {
    bus.$on('to-home', this.back)
    bus.$on('select-single-cell', this.selectSingleCell)
    this.getDefaultConfig()
    this.$store.commit('UPDATE_STYLE_EDITED', false)
    this.$store.commit('UPDATE_TEMPLATE_EDITED', false)
  },
  methods: {
    handleSelectPrg (bool) {
      this.selectedPrg = bool
    },
    handleClickEvent (event) {
      if (event === 'back') {
        this.back()
      } else if (event === 'save') {
        // save binding
        let p1 = this.saveBinding()
        let p2 = this.saveTemplateDoc()
        let p3 = this.saveStyle()
        Promise.all([p1, p2, p3]).then(() => {
          this.$msgMnger.success('保存模板成功')
          this.$store.commit('UPDATE_STYLE_EDITED', false)
          this.$store.commit('UPDATE_TEMPLATE_EDITED', false)
        }).catch(err => {
          this.$msgMnger.httpError(err)
        })
      } else if (event === 'help') {
        this.$refs.helpDialog.updateVisible(true, { event: 'help' })
      } else if (event === 'table') {
        this.$refs.docPage.addTableDiagram('TABLE')
      } else if (event.indexOf('diagram') > -1) {
        this.$refs.docPage.insertDiagramType = event.split('/')[1]
        this.$refs.docPage.addTableDiagram('DIAGRAM')
      }
    },
    saveBinding () {
      return new Promise((resolve, reject) => {
        this.$api.bindTemplateWithData(this.templateId, JSON.stringify(this.$store.getters.binding)).then(res => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    saveStyle () {
      return new Promise((resolve, reject) => {
        this.$api.saveStyleT(this.templateId, this.$store.getters.style).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    saveTemplateDoc () {
      let templateStr = JSON.stringify(this.$refs.docPage.getDoc())
      return new Promise((resolve, reject) => {
        this.$api.postDocContentT(this.templateId, templateStr).then(res => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    handleInsertFinish () {
      this.$refs.editToolBar.resetSelected()
    },
    getDefaultConfig () {
      this.getTemplateDoc().then((data) => {
        let p1 = this.getTemplateBinding()
        let p2 = this.getStyle(data.template)
        Promise.all([p1, p2]).then(([obj, binding]) => {
          this.$store.dispatch('EDIT_NAME', data.name)
          this.$refs.docPage && this.$refs.docPage.initDocContent(data.template, binding)
        }).catch(err => {
          this.$msgMnger.httpError(err)
        })
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    getTemplateDoc () {
      return new Promise((resolve, reject) => {
        // this.$refs.docPage.updateLoading(true)
        this.$refs.docPage.originDocContent = []
        this.$api.getDocContentT(this.templateId).then(res => {
          resolve(res.data)
        }).catch(err => {
          this.$refs.docPage.updateLoading(false)
          reject(err)
        })
      })
    },
    getTemplateBinding () {
      return new Promise((resolve, reject) => {
        this.$api.getBindingParameters(this.templateId).then(res => {
          this.$store.commit('CONFIG_BINDING', res.data)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getStyle (docTemplate) {
      return new Promise((resolve, reject) => {
        this.$api.getStyleT(this.templateId).then(res => {
          if (Object.keys(res.data).length) {
            this.$store.dispatch('CONFIG_STYLE', res.data)
          } else {
            dsi.configStoreStyle.call(this, docTemplate)
          }
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    selectSingleCell (value) {
      this.$refs.docPage.updateDocVarValue(value)
    },
    back () {
      // 检测到未保存的内容，是否在离开页面前保存修改？
      if (!this.$store.getters.styleEdited && !this.$store.getters.templateEdited) {
        this.$router.push('/template')
        return
      }
      this.$confirm('是否在离开页面前保存修改？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '保 存',
        cancelButtonText: '放弃修改'
      }).then(() => {
        this.handleClickEvent('save')
        setTimeout(() => {
          this.$router.push({ path: '/template' })
        }, 1000)
      }).catch(action => {
        if (action === 'cancel') {
          this.$router.push({ path: '/template' })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#t-doc-edit-page{
  height: 100%;
  .doc-wraper{
    height: -moz-calc(100% - 50px);
    height: -webkit-calc(100% - 50px);
    height: calc(100% - 50px);
  }
}
</style>
