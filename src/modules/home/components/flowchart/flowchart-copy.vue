<template>
  <div class="flowchart-mv">
    <div class="mv__select-container">
      <el-select popper-class="mv__select-select" class="mv__select-select" v-model="currentDataSpace" placeholder="请选择" @change="changeHandle">
        <el-option
          v-for="item in dataSpaceOptionComputed"
          :key="item.id"
          :label="Number(item.type) === 2 ? '个人空间' : item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="mv__folder-path">
      <div class="folder-path__path">
        <span class="path__folder">全部项目</span>
        <i class="path__icon el-icon el-icon-arrow-right"></i>
        <span class="path__flowchart">{{ currentFolder }}</span>
      </div>
      <div class="folder-path__create-folder">
        <el-button class="create-folder__button" @click="createNewFolder">新建项目</el-button>
      </div>
    </div>
    <div class="mv__folder">
      <el-scrollbar style="height: 300px;">
        <div
          v-for="item in folders"
          :key="item.id"
          class="folder__item"
          :class="{ active: item.id === targetId }"
          @click="handleFolderItemClick(item)"
        >
          <img class="item__img" src="../../assets/folder-img/folder2.png" alt="">
          <span class="item__text">{{ item.name }}</span>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Bus from '@/utils/event-bus'
export default {
  name: 'flowchart-mv',
  data () {
    return {
      currentDataSpace: '',
      currentFolder: '',
      folders: '',
      targetId: ''
    }
  },
  computed: {
    ...mapGetters({
      allDataSpaceGetter: 'allDataSpaceGetter',
      currentDataSpaceIdGetter: 'currentDataSpaceIdGetter',
      currentDataSpaceGetter: 'currentDataSpaceGetter',
      currentHandleFileData: 'currentHandleFileData'
    }),
    // 可以移动的数据空间 option, 根据当前的数据空间进行判断: 当前个人: 可移入所有空间; 当前非个人: 只可移入当前
    dataSpaceOptionComputed () {
      return this.currentDataSpaceGetter.type === 2
        ? this.allDataSpaceGetter : [this.currentDataSpaceGetter]
    }
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
    move () {
      if (Number(this.currentDataSpaceGetter.type) !== 2) {
        if (!this.targetId) {
          this.$msgMnger.error('请选择要移入的项目')
          return
        }
        if (this.currentDataSpace !== this.currentDataSpaceIdGetter) {
          // 移动到非当前企业空间的文件夹
          this.$msgMnger.error('当前企业数据不能复制到别的企业空间')
          return
        } else {
          this.copyApi()
        }
        console.log('currentDataSpace', this.currentDataSpace, this.currentDataSpaceIdGetter)
      } else {
        // 个人空间中的文件  随便移
        if (!this.targetId) {
          this.$msgMnger.error('请选择要移入的项目')
          return
        }
        this.copyApi()
      }
    },
    copyApi () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      console.log('this.currentHandleData', this.currentHandleFileData)
      this.$api.copyFoldFiles(this.currentHandleFileData.id, { folder_id: this.targetId }).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        if (res.code == 0) {
          this.$msgMnger.success(res.msg)
        } else {
          this.$msgMnger.warn(res.msg)
        }
        // 触发列表刷新
        Bus.$emit('refresh-flowchart-list')
        this.$emit('close')
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.$msgMnger.httpError(err)
      })
    },
    getUserFolder (id) {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getUserFolder({ companyId: id }).then(res => {
        this.folders = res.data.filter(item => item.id !== this.currentHandleFileData.folder_id)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$message.httpError(err)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
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
