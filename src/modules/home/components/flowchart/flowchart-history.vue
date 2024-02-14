<template>
    <div class="flowchart-mv">
      <div class="mv__folder">
        <el-scrollbar v-if="folders.length" style="height: 300px;">
          <flowchart-item
                class="my-flow__flowchart-list-item--current"
                v-for="(itemData) in folders"
                :key="itemData.id"
                :item-data="itemData"
                :need-to-folder="folders.length === 0"
              ></flowchart-item>
        </el-scrollbar>
      </div>
      <div v-if="folders.length==0" style="height: 300px;">
        <span>暂无数据</span>
      </div>
    </div>
  </template>

<script>
import { mapGetters } from 'vuex'
import Bus from '@/utils/event-bus'
import FlowchartItem from './flowchart-item'
export default {
  name: 'flowchart-mv',
  components: {
    FlowchartItem
  },
  data () {
    return {
      currentDataSpace: '',
      currentFolder: '',
      folders: [],
      targetId: ''
    }
  },
  computed: {
    ...mapGetters({
      allDataSpaceGetter: 'allDataSpaceGetter',
      currentDataSpaceIdGetter: 'currentDataSpaceIdGetter',
      currentDataSpaceGetter: 'currentDataSpaceGetter',
      currentHandleFileData: 'currentHandleFileData'
    })
    // curFolders () {
    //   return this.options.find(item => item.value === this.currentDataSpace).folder
    // }
  },
  mounted () {
    // this.currentDataSpace = this.currentDataSpaceIdGetter
    // this.getUserFolder(this.currentDataSpaceIdGetter)
  },
  methods: {
    /**
       * 设置组件当前企业空间, ref 调用; 用于展示对话框时的初始化
       * @param dataSpace
       */
    setCurrentDataSpace (dataSpace) {
      this.currentDataSpace = dataSpace
      this.getUserFolder(dataSpace)
    },

    getUserFolder (id) {
      console.log(id, 'hahahah')
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.flowhistoryver(id).then(res => {
        this.folders = res.data || []
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.$message.httpError(err)
      })
    },
    changeHandle () {
      this.getUserFolder(this.currentDataSpace)
    },
    /**
       * 文件夹选择处理函数
       * @param itemData
       */
    handleFolderItemClick (item) {
      // this.currentFolder = itemData
      this.targetId = item.id
    },
    /**
       * 创建新文件夹 prompt 弹窗
       */
    createNewFolder () {
      this.$prompt('请输入名称', '新建项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /^.{1,10}$/,
        // inputErrorMessage: '项目名称限定1到10字符长度'
      }).then(({ value }) => {
        const targetSpace = this.allDataSpaceGetter.find(item => item.id === this.currentDataSpace)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        this.$api.addFolder({ name: value, companyId: targetSpace.id, type: targetSpace.type }).then(res => {
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
          this.$message.success('新建成功')
          this.getUserFolder(this.currentDataSpace)
        }).catch(err => {
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
          this.$message.httpError(err)
        })
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import "@/styles/index.scss";
  @at-root .flowchart-mv {
    padding: 0 20px;
    .mv__select-container {
      .mv__select-select {
        width: 100%;
      }
    }
    .mv__folder-path {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #f1f1f1;
      .folder-path__path {
        .path__folder {
          color: $base-text-color;
          font-size: 14px;
          font-weight: 400;
        }
        .path__flowchart {
          font-size: 16px;
          font-weight: bold;
        }
      }
      .folder-path__create-folder {
        .create-folder__button {
          border: 1px solid $primary-color;
          color: $primary-color;
        }
      }
    }
    .mv__folder {
      .folder__item {
        height: 56px;
        display: flex;
        align-items: center;
        .item__img {
          height: 32px;
          width: 42px;
          margin-left: 13px;
        }
        .item__text {
          margin-left: 20px;
        }
      }
      .active{
        background-color: $list-background-color-hover;
      }
    }
  }
  </style>

  <style lang="scss">
  .mv__select-select {
    .el-select-dropdown__list {
      /*padding: 6px 0 20px;*/
      li {
        padding: 0 12px;
      }
    }
  }
  </style>
