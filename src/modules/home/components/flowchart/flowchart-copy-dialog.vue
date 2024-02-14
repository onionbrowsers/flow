<template>
  <flow-file-dialog
    class="flowchart-mv-dialog__dialog"
    ref="flowFileItemDialog"
    width="760px"
    :title="dlgConfigs.title"
    :btn1="dlgConfigs.btn1"
    :btn2="dlgConfigs.btn2"
    :showClose="true"
    @clickBtn1="handleClickBtn1"
    @clickBtn2="handleClickBtn2"
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
import FlowchartMv from './flowchart-copy'
import FlowFileDialog from '../../../flowchart/components/public/flowfile-dialog'
export default {
  name: 'flowchart-copy-dialog',
  components: {
    FlowchartMv,
    FlowFileDialog
  },
  data () {
    return {
      dlgConfigs: {
        title: '复制文件',
        btn1: { title: '取 消' },
        btn2: { title: '确 定' }
      }
    }
  },
  methods: {
    handleClickBtn1 () {},
    handleClickBtn2 () {
      this.$refs.flowchartMv.move()
    },
    closeHandle () {
      this.$refs.flowFileItemDialog.updateVisible(false)
    }
  }
}
</script>
