<template>
  <flow-file-dialog
    class="flowfile-tab-list-dialog"
    ref="flowFileDialog"
    :width="btnConfig.width + 20 + 'px'"
    :title="btnConfig.title"
    :btn0="btnConfig.btn0"
    :btn1="btnConfig.btn1"
    :btn2="btnConfig.btn2"
    :showClose="true"
    :destroyOnClose="true"
    @clickBtn1="handleClickBtn1"
    @clickBtn2="btnConfig.btn2.handler"
    @closed="handleDialogClosed"
  >
    <flow-file-tab-list
      slot="one"
      v-if="isShow"
      ref="flowFileTabList"
      type="page"
      :folderId="folderId"
    ></flow-file-tab-list>
  </flow-file-dialog>
</template>

<script>
import FlowFileDialog from '../public/flowfile-dialog'
import FlowFileTabList from '@/modules/home/components/public/flow-file-tab-list'
export default {
  name: 'flowfile-tab-list-dialog',
  props: ['folderId'],
  components: {
    FlowFileDialog,
    FlowFileTabList
  },
  data () {
    return {
      isShow: false,
      btnConfig: {
        title: '流程选择',
        width: 570,
        btn2: { title: '确 定', handler: this.select },
        btn1: { title: '取 消' },
        btn0: null
      },
      // 传递过来的参数
      params: {
        rowIndex: -1,
        prop: ''
      }
    }
  },
  methods: {
    /**
     * 点击取消按钮
     */
    handleClickBtn1 () {},
    /**
     * dialog 关闭完成时的动作
     */
    handleDialogClosed () {
      this.isShow = false
    },
    /**
     * 打开dialog
     * @param rowIndex
     * @param prop
     */
    showDialog ({ rowIndex, prop }) {
      this.isShow = true
      this.params.rowIndex = rowIndex
      this.params.prop = prop
      this.$refs.flowFileDialog.updateVisible(true)
    },
    /**
     * 选中处理函数
     */
    select () {
      const _flow = this.$refs.flowFileTabList.getCurrentFlow()
      if (typeof _flow === 'string') { // 说明没有获取到
        this.$message({
          type: 'error',
          message: _flow
        })
        return
      }
      const _payload = {
        rowIndex: this.params.rowIndex,
        prop: this.params.prop,
        value: _flow.pageName ? _flow.pageName : _flow.flowName
      }
      this.$store.commit('HANDLE_EDIT', _payload)
      this.$refs.flowFileDialog.updateVisible(false)
    }
  }
}
</script>

<style scoped lang="scss">
.flowfile-tab-list-dialog{
  .flow-file-tab-list{
    padding: 15px;
  }
}
</style>
