<template>
  <div class="folder-belonged">
<!--    ========== header ==========-->
    <div class="folder-belonged__header">
      <span class="header__title">归属项目: </span>
      <el-button v-show="!isOrgType" class="header__button" @click="handleNewFolderBtnClick">新建项目</el-button>
    </div>
    <div v-if="isShowNewFolder" class="folder-belonged__create">
      <svg class="create__icon" aria-hidden="true">
        <use xlink:href="#iconfolder4"></use>
      </svg>
      <el-input
        class="create__el-input"
        v-model="folderName"
        placeholder="请输入项目名称"
        @change="handleInputCompleted"
      ></el-input>
      <!--  maxlength="10" -->
    </div>
    <folder-list
      ref="folderList"
      :folder-data="folderList"
      @folder-selected="handleFolderSelected"
    ></folder-list>
  </div>
</template>

<script>
/**
 * 归属文件夹组件
 */
import FolderList from './folder-list'
export default {
  name: 'folder-belonged',
  components: {
    FolderList
  },
  data () {
    return {
      // 当前的 文件夹 id
      currentFolderId: -1,
      // 文件夹名称
      folderName: '',
      // 是否展示新建文件夹
      isShowNewFolder: false,
      // 文件夹列表数据
      folderList: []
    }
  },
  computed: {
    isOrgType () {
      return this.$store.getters.currentDataSpaceGetter.c_type === 1
    },
  },
  mounted () {
    // 如果当前在 我的流程图视图 且 打开了某个文件夹， 则默认选中该文件夹
    this.getUserFolder()
  },
  methods: {
    /**
     * 处理文件夹选中的函数
     * @param id
     */
    handleFolderSelected (id) {
      this.currentFolderId = id
      console.log('当前选中的id为', id)
    },
    /**
     * 新建文件夹按钮点击事件
     */
    handleNewFolderBtnClick () {
      this.isShowNewFolder = true
    },
    /**
     * 输入完成事件
     */
    handleInputCompleted (event) {
      console.log('输入完成, ', event)
      // 1. check 用户输入内容
      const reg = /^[\u4e00-\u9fa5 0-9a-zA-Z_-]+$/
      // const reg = /^[\u4e00-\u9fa5 0-9a-zA-Z_-]{1,20}$/
      const _name = this.folderName.trim()
      if (!reg.test(_name)) {
        this.$msgMnger.error(new Error('请输入正确的文件名'))
        return false
      }
      // 2. check成功后调用新建文件夹的接口
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      // 添加文件夹
      this.$api.addFolder({
        name: _name,
        companyId: this.$store.getters.currentDataSpaceGetter.id,
        type: this.$store.getters.currentDataSpaceGetter.type
      }).then(res => {
        this.$emit('refresh-folder-list')
        this.$message({
          type: 'success',
          message: '新建成功'
        })
        // 3. 接口成功后
        // event.target.blur()
        this.isShowNewFolder = false
        // 4. 触发重新刷新列表的事件
        this.getUserFolder()
        // 5. 重置 folderName
        this.folderName = ''
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        console.log(err)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    
    getUserFolder () {
      if (this.isOrgType) {
        this.getOrgUserFolder()
        return
      }
      this.getNormalUserFolder()
    },
    getOrgUserFolder () {
      this.$api.getOrgUserFolder({
        companyId: this.$store.getters.currentDataSpaceIdGetter
      }).then(res => {
        this.folderList = res.data
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    },
    /**
     * 获取用户的folder
     */
    getNormalUserFolder () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getUserFolder({ companyId: this.$store.getters.currentDataSpaceIdGetter }).then(res => {
        this.folderList = res.data
        // 设置默认选中文件夹
        if (this.$route.query.hasOwnProperty('folderId')) {
          // 判断是否对参数中的文件夹有编辑权限
          // 默认文件夹
          const _defaultFolder = this.folderList.find(item => Number(item.id) === Number(this.$route.query.folderId))
          // 是否对此文件夹有编辑权限?
          const _isWithPermission = _defaultFolder.type !== 3
          if (_isWithPermission) { // 若有权限, 设置默认选中, 若无则不进行操作
            this.currentFolderId = Number(this.$route.query.folderId)
            this.$refs.folderList.setCurrentFolderId(this.currentFolderId)
          }
        }
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    },
    /**
     * 获取当前选中的 folderId, ref;
     * 没选中时是 -1
     * @returns {number}
     */
    getCurrentFolderId () {
      return this.currentFolderId
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.folder-belonged {
  padding: 0 20px !important;
  .folder-belonged__header {
    padding-bottom: 12px;
    border-bottom: 1px solid $divided-line-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header__title {
      font-size: 14px;
      color: $base-text-color-middle;
    }
    .header__button {
      height: 32px;
      /*line-height: 30px;*/
      width: 102px;
      padding: 0 20px;
      border: 1px solid $primary-color;
      color: $primary-color;
      text-align: center;
      line-height: 30px;
    }
  }
  .folder-belonged__create {
    height: 56px;
    display: flex;
    align-items: center;
    .create__icon {
      width: 42px;
      height: 32px;
      margin: 0 16px 0 13px;
      flex: none;
    }
    .create__el-input {
      flex: auto;
    }
  }
}
</style>

<style lang="scss">
.folder-belonged {
  .create__el-input {
    .el-input__inner {
      border-bottom: 1px solid #d9d9d9;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-radius: 0;
    }
  }
}
</style>
