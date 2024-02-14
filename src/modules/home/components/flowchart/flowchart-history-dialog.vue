<template>
    <flow-file-dialog
      class="flowchart-mv-dialog__dialog"
      ref="flowFileItemDialog"
      :title="'历史版本'"
      width="760px"
      :showClose="true"
    >
      <flowchart-mv
        slot="one"
        ref="flowchartMv"
        @close="closeHandle"
      ></flowchart-mv>
    </flow-file-dialog>
  </template>

<script>
/**
   * 注意:
   * 若在个人空间, 可移动到所有有权限的空间;
  * 若企业空间, 不可切换
  */
import FlowchartMv from './flowchart-history'
import FlowFileDialog from '../../../flowchart/components/public/flowfile-dialog'
export default {
  name: 'flowchart-copy-dialog',
  components: {
    FlowchartMv,
    FlowFileDialog
  },
  data () {
    return {

    }
  },
  methods: {
    closeHandle () {
      this.$refs.flowFileItemDialog.updateVisible(false)
    }
  }
}
</script>
