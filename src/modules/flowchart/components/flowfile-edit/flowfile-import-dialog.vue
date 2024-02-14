<template>
  <div id="flowfile-import-dialog">
    <custom-dialog
      :isVisible="isShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="dialogWidth"
      :title="dialogTitle()"
      :showClose="true"
      marginTop="15vh"
      @close="closeHandle"
    >
      <data-source-select
        slot="content4"
        v-if="isShow"
        :isShow="childCpt === 'dataSourceSelect'"
        :style="getDataSourceSelectStyle()"
        @upload-visio-done="handleUploadVisioDone"
        @update-visio-done="handleUpdateVisioDone"
        @select-flowchart="childCpt = 'flowchartList'"
        @import-from-event="handleImportFrom"
      />
      <flowchart-list
        slot="content1"
        v-if="childCpt === 'flowchartList'"
        :folderId="folderId"
        @cancel="backToDataSourceSelect"
        @import-from-event="handleImportFrom"
      />
      <visio-tab-list
        slot="content1"
        v-if="childCpt === 'visioTabList'"
        @cancel="backToDataSourceSelect"
        @view-fail-list="childCpt = 'failList'"
        @comfirm-import="handleComfirmImport"
        :fail-list="failList"
        v-model="resOfUploadVisio.success"
      />
      <fail-list
        slot="content1"
        v-if="childCpt === 'failList'"
        @cancel="backToDataSourceSelect"
        @ignore="childCpt = 'visioTabList'"
        :fail-list="failList"
        :success-list="successList"
      />
    </custom-dialog>
  </div>
</template>

<script>
import CustomDialog from './custom-edit-dialog'
import DataSourceSelect from './data-source-select'
import FlowchartList from './flowchart-list'
import VisioTabList from './visio-tab-list'
import FailList from './fail-list'

export default {
  props: ['folderId'],
  components: {
    CustomDialog,
    DataSourceSelect,
    FlowchartList,
    VisioTabList,
    FailList
  },
  data () {
    return {
      isShow: false,
      childCpt: 'dataSourceSelect',
      importFrom: 'local', // 导入数据来源，本地 visio 或线上流程图，local / online
      resOfUploadVisio: {}, // 上传visio解析后的返回数据，结构为 { success: [], fail: [], file: {} }
      slotCompInfo: {
        dataSourceSelect: {
          width: '750px',
          title: '数据源选择'
        },
        failList: {
          width: '920px',
          title: '导入$1流程图--导入错误'
        },
        visioTabList: {
          width: '1200px',
          title: ''
        },
        flowchartList: {
          width: '920px',
          title: '导入在线 SmartFlow 流程图--选择流程图文件'
        }
      }
    }
  },
  computed: {
    dialogWidth () {
      return this.slotCompInfo[this.childCpt].width
    },
    failList () {
      return this.resOfUploadVisio.fail ? this.resOfUploadVisio.fail : []
    },
    successList () {
      return this.resOfUploadVisio.success ? this.resOfUploadVisio.success : []
    }
  },
  methods: {
    show () {
      this.childCpt = 'dataSourceSelect'
      this.isShow = true
    },
    closeHandle () {
      this.isShow = false
      this.childCpt = 'dataSourceSelect'
    },
    getDataSourceSelectStyle () {
      return {
        height: this.childCpt === 'dataSourceSelect' ? '100%' : '0',
        overflow: this.childCpt === 'dataSourceSelect' ? '' : 'hidden'
      }
    },
    backToDataSourceSelect () {
      this.childCpt = 'dataSourceSelect'
    },
    handleImportFrom ($event) {
      this.importFrom = $event.from
    },
    dialogTitle () {
      const failListTitleMap = {
        'local': '本地Visio',
        'online': '在线'
      }
      return this.childCpt !== 'failList'
        ? this.slotCompInfo[this.childCpt].title
        : this.slotCompInfo['failList'].title.replace('$1', failListTitleMap[this.importFrom])
    },
    handleUploadVisioDone (res) {
      // 上传 visio 或导入在线流程图成功, 通过bus接收信息
      this.resOfUploadVisio = res
      let filename = ''
      if (res.file.hasOwnProperty('name')) {
        filename = res.file.name
      } else {
        let temp = res.file.name ? res.file.name : res.file.filename.split('.')
        temp.pop()
        filename = temp.join('')
      }
      this.slotCompInfo.visioTabList.title = `导入流程图: ${filename}`
      this.childCpt = 'visioTabList'
    },
    handleUpdateVisioDone (res) {
      this.resOfUploadVisio = res // 更新缩略图中
    },
    handleComfirmImport (list) {
      // 确认导入在线流程图
      this.$emit('loadingVisible', true)
      let checkedPage = []
      list.forEach(item => {
        if (item.checked) {
          checkedPage.push(item.id)
        }
      })
      this.isShow = false
      let { flowfileId } = this.$route.params
      let fileId = this.resOfUploadVisio.file.id
      this.$api.confirmImportInterface(flowfileId, fileId, { check_page: JSON.stringify(checkedPage), flag: this.resOfUploadVisio.flag }).then(res => {
        // console.log('+++++++++++++++导入已选流程图成功, res is: ', res)
        this.$emit('importData', res.data.success)
      }).catch(err => {
        this.$emit('loadingVisible', false)
        this.$msgMnger.httpError(err)
      })
    }
  }
}
</script>

<style lang="scss">
#flowfile-import-dialog{
}
</style>
