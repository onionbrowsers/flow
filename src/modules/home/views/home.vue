<template>
  <div
    id="home"
  >
    <router-view></router-view>
    <cooperate-mng-dialog
      ref="cooperateMngDialog"
    ></cooperate-mng-dialog>
    <flowchart-file-dialog ref="flowchartFileDialog"></flowchart-file-dialog>
    <flowfile-catalog-dialog ref="flowfileCatalogDialog"></flowfile-catalog-dialog>
  </div>
</template>

<script>
import CooperateMngDialog from '../components/public/cooperate-mng-dialog'
import FlowchartFileDialog from '../components/flowchart/flowchart-file-dialog'
import FlowfileCatalogDialog from '../components/public/flowfile-catalog-dialog'
import Bus from '@/utils/event-bus'
export default {
  name: 'my-folder',
  components: {
    CooperateMngDialog,
    FlowchartFileDialog, // 用于修改文件名 + 创建新文件
    FlowfileCatalogDialog // 用于生成 or 查看目录
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      // 用户表示当前协作成员管理的类型, 文件? 文件夹?
      flag: 'file'
    }
  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mounted () {
    // 1. 挂载事件监听
    Bus.$on('cooperate-mng', this.handleCooperateMemMng)
    Bus.$on('create-flowchart', this.handleCreateFlowchart)
    Bus.$on('flowchart-rename', this.handleFlowchartRename)
    Bus.$on('flowfile-catalog', this.handleShowFlowfileCatalogDialog)
  },
  activated () {

  },
  beforeDestroy () {
    Bus.$off('cooperate-mng')
    Bus.$off('create-flowchart')
    Bus.$off('flowchart-rename')
    Bus.$off('flowfile-catalog')
  },
  methods: {
    /**
     * 管理协作成员
     */
    handleCooperateMemMng ({ flag, data }) {
      console.log('管理协作成员: , flag is: ', flag, ', id is: ', data)
      this.$refs.cooperateMngDialog.setCooperateType({ flag: flag, data: data })
      this.$refs.cooperateMngDialog.$refs.flowFileDialog.updateVisible(true)
    },
    /**
     * 新建流程图
     */
    handleCreateFlowchart () {
      this.$refs.flowchartFileDialog.createNew()
    },
    /**
     * 流程图重命名
     * @param flowchartData 文件信息(如 id, 文件名)
     */
    handleFlowchartRename (flowchartData) {
      console.log('重命名的文件信息: ', flowchartData)
      this.$refs.flowchartFileDialog.flowchartRename(flowchartData)
    },
    /**
     * 打开对话框, 传递参数
     * @param folder 文件夹信息
     */
    handleShowFlowfileCatalogDialog (folder) {
      this.$refs.flowfileCatalogDialog.showDialog(folder)
    }
  }
}
</script>

<style lang="scss" scoped>
#home{
  width: 100%;
  flex:1;
  height: 100%;
  background: #F0F3F7;
  padding: 16px;
  overflow: auto;
  box-sizing: border-box;
}
</style>

<style lang="scss">
#home {
  .el-dialog {
    .el-dialog__header {
      text-align: left;
    }
  }
}
</style>
