<template>
  <div id="operation-box" class="clearfloat">
    <div class="operation-box-sub-container">
      <div class="title">
        <div class="bar-title-btn" @click="handleClick('back')">
          <i class="iconfont iconfanhui"></i>
          <span v-if="filename" :title="filename">{{filename}}</span>
          <span v-else class="placeholder">
            <i class="el-icon-loading"></i>
          </span>
        </div>
      </div>
      <div class="operations">
        <div class="bar-button" size="mini" v-if="!disabledGetter" @click="handleClick('selectStyle')">
          <svg class="icon flow-type-icon" aria-hidden="true">
            <use :xlink:href="'#' + funcs.selectStyle.icon"></use>
          </svg>
          <div>{{funcs.selectStyle.title}}</div>
        </div>
        <div class="bar-button" size="mini" v-if="!disabledGetter" @click="handleClick('importData')">
          <svg class="icon flow-type-icon" aria-hidden="true">
            <use :xlink:href="'#' + funcs.importData.icon"></use>
          </svg>
          <div>{{funcs.importData.title}}</div>
        </div>
        <div class="bar-button" size="mini" v-if="!disabledGetter" @click="handleClick('sync-to-left')">
          <i :class="'el-icon ' + funcs.syncToLeft.icon + ' bar-button__sync-to-left-icon'"></i>
          <div>{{funcs.syncToLeft.title}}</div>
        </div>
        <div class="bar-button" size="mini" v-if="!disabledGetter" @click="showriskjuzhen()">
          <i :class="'el-icon el-icon-s-grid bar-button__sync-to-left-icon'"></i>
          <div>风险控制矩阵</div>
        </div>
        <!-- <div class="bar-button" size="mini" @click="showriskjuzhen()">
          <i :class="'el-icon el-icon-s-grid bar-button__sync-to-left-icon'"></i>
          <div>风险控制矩阵</div>
        </div> -->
      </div>
      <div class="operations">
        <div v-if="!isEditing" class="hint">您当前在查看视图，任何改动将不会被保存</div>
        <span
          class="bar__edit--editing"
          :style="{
            'margin-top': '17px',
            'font-size': '14px',
            'color': '#666'
          }"
          v-if="isEditing"
        >
          <i class="iconfont iconbianji" style="margin-right: 5px;"></i>
          <span>编辑中……</span>
        </span>
        <el-button
          size="mini"
          style="height: 30px; margin-top: 10px; margin-left: 10px;"
          type="primary"
          @click="handleEditButtonClick"
        >
          <i class="iconfont iconbianji" style="font-size: 14px; margin-right: 5px;"></i>
          <span>{{isEditing ? '编辑完成' : '编辑'}}</span>
        </el-button>
        <div v-if="isAutoSaving" class="bar-button bar-autosave" size="mini">
          <i class="el-icon el-icon-loading flow-type-icon"></i>
          <div>自动保存中</div>
        </div>
        <div v-else-if="isAutoSaveCompleted" class="bar-button bar-autosave-complete" size="mini">
          <i class="el-icon el-icon-success flow-type-icon"></i>
          <div>自动保存成功!</div>
        </div>
        <div v-else style="margin-left: 15px">
          <div class="bar-button" v-if="!disabledGetter" size="mini" @click="handleClick('save')">
            <svg class="icon flow-type-icon" aria-hidden="true">
              <use :xlink:href="'#' + funcs.save.icon"></use>
            </svg>
            <div>{{funcs.save.title}}</div>
          </div>
        </div>
        <div class="bar-button" size="mini" @click="handleClick('download')" v-if="!isPersonalSpace&&authTYpes!=3">
          <svg class="icon flow-type-icon" aria-hidden="true">
            <use :xlink:href="'#' + funcs.download.icon"></use>
          </svg>
          <div>{{funcs.download.title}}</div>
        </div>
        <div class="bar-button"  size="mini"  v-if="!isPersonalSpace&&authTYpes==3">
          <svg style="filter: grayscale(100%);" class="icon flow-type-icon" aria-hidden="true">
            <use :xlink:href="'#' + funcs.download.icon"></use>
          </svg>
          <div style="color: gray;">{{funcs.download.title}}</div>
        </div>
      </div>
    </div>
    <custom-dialog
      ref="downloadDialog"
      width="320px"
      :title="dlgConfig.title"
      customClass="create-template-dialog-class"
      :button1="dlgConfig.btn1"
      :button2="dlgConfig.btn2"
      :showClose="true"
      @clickBtn1="handleClickBtn1"
      @clickBtn2="handleClickBtn2"
    >
      <div class="download-div" slot="part4" style="padding: 0 0 40px 40px ;">
        <el-form label-position="right" label-width="100px" size="mini">
          <el-form-item label="文件：">
            <span>{{filename}}</span>
          </el-form-item>
          <el-form-item label="格式选择：">
            <el-select popper-class="download-type-select" v-model="downloadType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </custom-dialog>
    <flowfile-download-dialog ref="flowfileDownloadDialog" :filename="filename"/>

    <el-dialog
      :title="'风险控制矩阵'"
      :close-on-click-modal="false"
      custom-class="file-edit-dialog"
      v-if="isctrlDialog"
      :visible.sync="isctrlDialog"
      :footer="null"
     >
     <processEdit :currentPageId="currentPageId" :flowId="flowId" :filename="filename" :flowDetal="flowfileDetal" @closeModel="closeRiskjz"></processEdit>
    </el-dialog>
  </div>
</template>

<script>
import processEdit from './flowfile-edit-top-process-new.vue'// 风险矩阵列表
import CustomDialog from '@/components/public/CustomDialog'
import flowfileDownloadDialog from '../flowfile-edit/flowfile-download-dialog'
import { mapGetters } from 'vuex'
export default {
  components: {
    CustomDialog,
    flowfileDownloadDialog,
    processEdit
  },
  props: ['filename', 'flowId', 'companyId', 'flowfileDetal', 'currentPageId', 'authTYpes'],
  data () {
    return {
      isctrlDialog: false, // 展示矩阵图
      funcs: {
        back: { title: '', icon: 'el-icon-back' },
        save: { title: '保存', icon: 'iconbaocunmorenbeifen' },
        download: { title: '下载', icon: 'iconxiazaimorenbeifen' },
        selectStyle: { title: '表头设置', icon: 'iconbiaotoushezhimorenbeifen' },
        importData: { title: '导入流程图', icon: 'icondaoruliuchengtumorenbeifen' },
        syncToLeft: { title: '同步到左侧', icon: 'el-icon-refresh' },
        saveAsTemplate: { title: '另存为模板', icon: 'iconlingcunweimobanmorenbeifen' },
        saveAs: { title: '另存为', icon: 'iconlingcunweimobanmorenbeifen' }
      },
      dlgConfig: {
        title: '下载',
        btn1: { title: '取 消' },
        btn2: { title: '确 定' }
      },
      options: [
        {
          value: 'vsdx',
          label: 'Visio绘图(*.vsdx)'
        },
        {
          value: 'pdf',
          label: 'PDF文件(*.pdf)'
        },
        {
          value: 'docx',
          label: 'Word文档(*.docx)'
        }
      ],
      downloadType: 'vsdx',
      isAutoSaving: false, // 用于处理执行自动保存过程中的状态维护
      isAutoSaveCompleted: false, // 用于显示自动保存成功提示
      autoSaveIntervalId: null, // 自动保存计时器ID
      isEditing: false // 在编辑中状态
    }
  },
  computed: {
    ...mapGetters({
      company: 'currentDataSpaceGetter',
      disabledGetter: 'disabledGetter'
    }),
    isPersonalSpace () {
      return this.company.type === 2 // 个人空间，屏蔽下载
    }
  },
  beforeDestroy () {
    // 清除计时器
    this.clearAutoSaveInterval()
  },
  methods: {
    // 点击风险矩阵
    showriskjuzhen (data) {
      this.$nextTick(() => {
        if (this.flowfileDetal.pages || data) {
          this.isctrlDialog = true
        }
      })
    },
    // 取消展示矩阵
    closeRiskjz () {
      this.isctrlDialog = false
    },
    handleClick (event) {
      if (event === 'download') {
        // this.$refs['downloadDialog'].updateVisible(true, {})
        this.$refs['flowfileDownloadDialog'].show(this.flowId, this.companyId)
      } else {
        this.$emit('clickEvent', { type: event })
      }
    },
    handleClickBtn1 () {},
    handleClickBtn2 () {
      this.$emit('clickEvent', { type: 'download', value: this.downloadType })
    },
    handleEditButtonClick () {
      if (!this.$store.getters.drawIOStateGetter) { // 当 drawIO 没有加载完成时, 禁用按钮的点击
        this.$msgMnger.warn('加载中, 请稍等')
        return
      }
      if (!this.isEditing) { // 点击编辑，需刷新页面重新加载数据
        window.location.reload()
        return
      }
      // 编辑完成
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$nextTick(() => {
        this.$emit('editingEnd')
      })
    },
    setIsEditing ({ isEditing }) {
      this.isEditing = isEditing
      this.$nextTick(() => {
        // 关闭初始化的 loading
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'init-flowfile-info' })
      })
    },
    getIsEditing () {
      return this.isEditing
    },
    clearAutoSaveInterval () {
      // 清空计时器
      if (this.autoSaveIntervalId) {
        clearInterval(this.autoSaveIntervalId)
        this.autoSaveIntervalId = null
      }
    },
    setAutoSaveInterval () {
      // 开始或重置自动保存计时器
      this.clearAutoSaveInterval()
      this.autoSaveIntervalId = setInterval(() => {
        this.isAutoSaving = true // 自动保存过程中通过loading锁定操作
        this.$emit('triggerAutoSave')
      }, 1000 * 60 * 30)
    },
    autoSaveSuccess () {
      // 自动保存成功
      this.isAutoSaving = false
      this.isAutoSaveCompleted = true
      setTimeout(() => {
        this.isAutoSaveCompleted = false
      }, 3000)
    }
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/index.scss";
#operation-box {
  min-width: $content-area-min-width;
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  background-color: #f4f4f4;
  .operation-box-sub-container {
    display: flex;
    justify-content: space-between;
    .title {
      height: 100%;
      display: inline-block;
      width: 400px;
      float: left;
      .bar-title-btn {
        display: flex;
        justify-items: flex-start;
        align-items: center;
        /*display: inline-block;*/
        cursor: pointer;
        overflow: hidden;
        line-height: 54px;
        &:hover {
          color: $primary-color;
        }
        span {
          display: inline-block;
          /*float: right;*/
          height: 54px;
          line-height: 54px;
          margin-left: 10px;
          opacity: 0.85;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 1px;
          font-size: 18px;
          &.placeholder {
            color: $disable-text-color;
          }
        }
        .iconfanhui {
          font-size: 18px !important ;
          margin-left: 10px;
        }
      }
    }
    .operations {
      // width: 200px ;
      opacity: 0.8;
      height: 54px;
      float: left;
      // margin-right: 180px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      width: 500px;
      .hint{
        color: $base-text-color-middle;
        font-size: 12px;
        line-height: 54px;
        margin-right: 16px;
      }
      &:last-child {
        margin-right: 30px;
      }
      .bar-autosave {
        color: $primary-color;
        font-size: 14px;
        transform: translateY(-2px);
      }
      .bar-autosave-complete {
        color: #67C23A;
        font-size: 14px;
        transform: translateY(-2px);
      }
      .bar-button {
        display: inline-block;
        cursor: pointer;
        text-align: center;
        height: 47px;
        margin-top: 7px;
        &:hover {
          color: $primary-color;
        }
        &:not(:first-child) {
          margin-left: 20px;
        }
        i {
          margin-top: 7px;
          &.iconxiazai {
            font-size: 16px !important ;
          }
        }
        div {
          font-size: 12px;
        }
      }
    }
    .operations-2 {
      // width: calc(100% - 600px);
      width: 640px;
      display: inline-block;
      opacity: 0.8;
      height: 54px;
      float: right;
      .bar-button {
        display: inline-block;
        cursor: pointer;
        margin: 12px 0 0 10px;
        height: 28px;
        > span {
          font-size: 12px;
          display: inline-block;
          padding-top: 6px;
        }
        .import-button {
          height: 28px;
          .icon {
            display: inline-block;
            font-size: 16px;
            float: left;
            margin: -2px 2px 0 0;
          }
        }
      }
    }
  }
  .bar-button__sync-to-left-icon {
    margin: 0 !important;
    color: #489FF4;
  }
}

</style>

<style lang="scss">
#operation-box {
  .el-dialog__header {
    padding-bottom: 20px;
  }
  .file-edit-dialog{
    border-radius: 6px;
    margin-top: 20px !important;
    width:90% !important;
  }
}

.download-type-select {
  .el-select-dropdown__wrap {
    margin-bottom: 0px !important ;
  }
  .el-select-dropdown__item {
    padding: 0 20px !important ;
  }
}
</style>
