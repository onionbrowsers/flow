<template>
  <div id="flowfile-table-header-dialog">
    <custom-dialog
      ref="tableHeaderDialog"
      width="920px"
      title="表头设置"
      marginTop='15vh'
      :isVisible="isShow"
      :showClose="true"
      @close="closeHandle"
    >
      <select-style-v2
        slot="content5"
        :folderId="folderId"
        @close="closeHandle"
        @use="useStyleHandle"/>
    </custom-dialog>
  </div>
</template>

<script>
import CustomDialog from './custom-edit-dialog'
import SelectStyleV2 from './select-style-v2'

export default {
  props: ['folderId'],
  components: {
    CustomDialog,
    SelectStyleV2
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    useStyleHandle (localpath) {
      this.isShow = false
      this.$api.getFlowfile(localpath.id, localpath.key).then(res => {
        this.$emit('loadTableHeader', res)
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    closeHandle () {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss">
#flowfile-table-header-dialog{
}
</style>
