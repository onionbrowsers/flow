<template>
  <div class="folder-list">
    <el-scrollbar style="height: 300px;">
      <div class="nav-panel" v-show="folderStack.length > 1">
        <FolderNav ref="folderNav" 
          @item-click="handleItemClick"
          @folder-change="handleChangeFolder"
         />
      </div>
      
      <template 
        v-if="list.length">
        <div
          v-loading="loading"
          class="list__list-item"
          :class="{
            'list__list-item--current': item.id === currentId,
            'list__list-item--disabled': item.type === 3,
            'list__list-item--haschild': isOrgType && item.orgfinal === 2
          }"
          :title="item.type === 3 ? '您无权限在此项目新建' : ''"
          v-for="(item) in list"
          :key="item.id"
          @dblclick="handleDetail(item)"
          @click="handleFolderListItemClick({ id: item.id })"
        >
          <svg class="list-item__icon" aria-hidden="true">
            <use :xlink:href="{ value: item.color, context: _self } | folderIconGetter"></use>
          </svg>
          <span class="list-item__text" >{{ item.name }}</span>
          <i class="el-icon-plus icon-child" ></i>
        </div>
      </template>
      <Empty v-else/>
    </el-scrollbar>
  </div>
</template>

<script>
/**
 * 对于只有仅查看权限的文件夹, 禁用还是直接过滤
 */
import FolderNav from '@/modules/home/components/folder-nav.vue'
import Empty from '@/components/Empty.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'folder-list',
  filters: {
    folderIconGetter: ({ value, context }) => {
      // console.log('this is: ', this)
      const iconObj = context.coloredFoldersGetter.find(item => item.value === value)
      const defaultIcon = context.coloredFoldersGetter[0].icon
      return '#' + (iconObj ? iconObj.icon : defaultIcon)
    }
  },
  components: {
    Empty,
    FolderNav
  },
  props: {
    // 文件夹列表数据
    folderData: {
      type: Array,
      default: () => [
        { id: 1, name: '粮农畜牧', colorValue: 4 },
        { id: 2, name: '信息技术', colorValue: 2, type: 3 },
        { id: 3, name: '身无分文', colorValue: 3 }
      ]
    }
  },
  data () {
    return {
      folderStack: [],
      currentFolderList: null,
      loading: false,
      currentId: -1
    }
  },
  computed: {
    isOrgType () {
      return this.currentDataSpaceGetter.c_type === 1
    },
    ...mapGetters(['coloredFoldersGetter', 'currentDataSpaceGetter']),
    list () {
      return this.currentFolderList ? this.currentFolderList : this.folderData
    },
  },
  mounted () {
    console.log('this is: ', this)
  },
  methods: {
    handleChangeFolder (stack) {
      this.folderStack = stack
    },
    handleItemClick (item) {
      if (!item.id) {
        this.currentFolderList = null
        return
      }
      this.loadSubFolder(item.id)
    },
    handleDetail (item) {
      const { orgfinal, id } = item
      if (orgfinal !== 2) return
      this.$refs.folderNav.setFolder(item)
      this.loadSubFolder(id)
    },
    loadSubFolder (id) {
      if (this.loading) return
      this.loading = true
      this.getSubFolder(id, (children = []) => {
        this.currentFolderList = children
        this.loading = false
      })
    },
    getSubFolder (folderId, cb) {
      this.$api.getOrgUserSubFolder({
        folderId,
        company_id: this.currentDataSpaceGetter.id
      }).then(res => {
        cb && cb(res.data)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    },
    /**
     * 处理 文件夹 item 点击函数
     * @param id 文件夹id
     */
    handleFolderListItemClick ({ id }) {
      // 1. 赋给当前index
      this.currentId = id
      // 2. 返回给父组件
      this.$emit('folder-selected', id)
    },
    /**
     * 设置当前 folderId
     * @param id
     */
    setCurrentFolderId (id) {
      console.dir(id)
      console.log('当前id： ', id)
      this.currentId = Number(id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.nav-panel{
  padding: 16px 0 0 16px
}
.folder-list {
  .list__list-item {
    height: 56px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: $base-text-color;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      background-color: $list-background-color-hover;
    }
    .list-item__icon {
      width: 42px;
      height: 32px;
      margin: 0 16px 0 13px;
    }
  }
  .list__list-item--current {
    background-color: $list-background-color-hover;
  }
  .list__list-item--disabled {
    opacity: .5 !important;
    background-color: #fff !important;
    cursor: not-allowed !important;
  }
  .icon-child{
    display: none;
  }
  .list__list-item--haschild{
    position: relative;
    .icon-child{
      display: block;
      position: absolute;
      left: 28px;
      color:#fff;
      font-weight: bold;
      top: 24px;
      font-size: 13px;
    }
  }
}
</style>
