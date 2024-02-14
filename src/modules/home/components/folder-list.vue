<template>
  <div>
    <FolderNav ref="folderNav" 
      @item-click="handleItemClick"
      @folder-change="handleChangeFolder"
      v-show="folderStack.length > 1"/>
    <div class="floder-list" v-loading="loading" v-if="showNew ? true : list.length">
      <div class="folder-item" v-if="showNew" >
        <div class="folder-item-img creat-fold" @click="creatFolder">
          <i class="el-icon-plus"></i>
        </div>
        <div class="text-ellipsis folder-item-name">新建项目</div>
      </div>
      <div class="folder-item"  v-for="(item, index) in list" :key="index">
        <div 
          class="folder-item-img"
          :class="[ !showNew && item.orgfinal === 2 ? 'list__list-item--haschild': '']"
          @contextmenu.prevent="handleContextMenu($event, item)"
          @dblclick="handleDetail(item)"
        >
          <!-- <img :src="item.icon"> -->
          <svg class="iconfont-symbol" aria-hidden="true">
            <use :xlink:href="`#iconfolder${item.color || 1}`"></use>
          </svg>
          <i class="el-icon-plus icon-child" ></i>
          <div v-show="item.orgfinal != 2" class="more-div" @click="handleContextMenu($event, item)">
            <img class="more-img" src="../assets/more.png">
            <div class="tips-div">
              <span class="arrow"></span>
              更多
            </div>
          </div>
        </div>
        <div class=" folder-item-name">{{item.name}}</div>
        <!-- <div class="text-ellipsis folder-item-name">{{item.name}}</div> -->
      </div>
      <el-dialog
        :title="currentFolder.name"
        custom-class="file-edit-dialog"
        v-if="popupConfig.isShowPopup"
        :visible.sync="popupConfig.isShowPopup"
        :footer="null"
      >
      <div class="menu-div">
          <div class="title" @click="$router.push({ path: `my-folder-detail/${currentFolder.id}`, query: { folderId: currentFolder.id, folderName: currentFolder.name } })">打开项目</div>
          <div class="color-select-div">
            <span class="color-select" v-for="(item, index) in colors" :key="index" :style="`background:${item}`" @click="changeColor(index)">
              <i class="el-icon-check" v-if="currentFolder.color ? currentFolder.color - 1 === index : index === 0"></i>
            </span>
          </div>
          <div
            v-for="(item, index) in operateList" :key="index"
            @click="operateClick(item)"
            v-show="!(item.hide && item.hide())"
          >
            {{item.name}}
          </div>
          <div>
            <numbering-style :currentFolder="currentFolder" @refreshFolderList="refreshFolderList"></numbering-style>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        title="编辑状态"
        :visible.sync="editStatus"
        width="30%"
        :footer="null"
        >
        <span v-if="!editDatas">无人编辑</span>
        <div v-if="editDatas" style="padding:0 20px;">
          <el-table
              :data="editDatas"
              border
              style="width: 100%; margin-top: 20px;max-height:500px; overflow: auto;">
              <el-table-column
                  prop="flow_name"
                  label="文件名称"
                >
              </el-table-column>
              <el-table-column
                  prop="user_name"
                  label="编辑人员"
                >
              </el-table-column>
              <el-table-column
                  prop="status"
                  label="状态"
                  >
              </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- <popup
        v-if="popupConfig.isShowPopup"
        :left="popupConfig.left"
        :top="popupConfig.top"
        @hide-popup="popupConfig.isShowPopup = false"
      >
        <div slot="contextmenu" class="menu-div">
          <div class="title" @click="$router.push({ path: `my-folder/${currentFolder.id}`, query: { folderId: currentFolder.id, folderName: currentFolder.name } })">打开项目</div>
          <div class="color-select-div" :class="{disable: ![1, 2].includes(currentFolder.type)}">
            <span class="color-select" v-for="(item, index) in colors" :key="index" :style="`background:${item}`" @click="changeColor(index)">
              <i class="el-icon-check" v-if="currentFolder.color ? currentFolder.color - 1 === index : index === 0"></i>
            </span>
          </div>
          <div
            v-for="(item, index) in operateList" :key="index"
            @click="operateClick(item)"
            v-show="!(item.hide && item.hide())"
            :class="{disable: !item.enableType.includes(currentFolder.type)}"
          >
            {{item.name}}
          </div>
          <div>
            <numbering-style :currentFolder="currentFolder" @refreshFolderList="refreshFolderList"></numbering-style>
          </div>
        </div>
      </popup> -->
    </div>
    <Empty v-if="!list.length && !showNew"/>
  </div>
</template>

<script>
// import Popup from './popup'
import FolderNav from './folder-nav.vue'
import Empty from '@/components/Empty.vue'
import Bus from '@/utils/event-bus'
import { mapGetters } from 'vuex'
import numberingStyle from './public/numbering-style'

export default {
  components: {
    // Popup,
    numberingStyle,
    Empty,
    FolderNav
  },
  props: {
    folderList: {
      default: []
    }
  },
  data () {
    return {
      loading: false,
      folderStack: [],
      currentFolderList: null,
      editStatus: false,
      editDatas: '',
      // 右键弹出框的配置对象
      popupConfig: {
        isShowPopup: false,
        left: 0,
        top: 0
      },
      // 文件夹颜色 1:默认 2:蓝色 3:绿色 4:黄色 5:红色 6:橙色
      colors: ['#A1ADBB', '#619CF8', '#73CE78', '#F6CE51', '#F97870', '#F7A763', '#B87ED5'],
      currentFolder: {},
      operateList: [
        { name: '重命名', func: this.rename, enableType: [1, 2] },
        { name: '协作成员', func: this.handleCooperateMng, enableType: [1], hide: () => this.currentDataSpaceGetter.type === 2 },
        { name: '项目目录', func: this.handleCatalog, enableType: [1, 2, 3] },
        { name: '查询编辑状态', func: this.handleEditStatus, enableType: [1, 2, 3] },
        { name: '删除', func: this.delete, enableType: [1, 2] }
      ]
    }
  },
  computed: {
    showNew () {
      return this.currentDataSpaceGetter.c_type !== 1
    },
    list () {
      return this.currentFolderList ? this.currentFolderList : this.folderList
    },
    ...mapGetters(['currentDataSpaceGetter'])
  },
  methods: {
    reset () {
      this.currentFolderList = null
      this.folderStack = []
      this.$refs.folderNav.setDefault([])
    },
    setDefault (list = []) {
      if (!list.length) return
      const item = list[list.length - 1]
      this.$refs.folderNav.setDefault(list)
      this.loadSubFolder(item.id)
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
    handleItemClick (item) {
      if (!item.id) {
        this.currentFolderList = null
        return
      }
      this.loadSubFolder(item.id)
    },
    loadSubFolder (id) {
      if (this.loading) return
      this.loading = true
      this.getSubFolder(id, (children = []) => {
        this.currentFolderList = children
        this.loading = false
      })
    },
    handleChangeFolder (stack) {
      this.folderStack = stack
    },
    handleDetail (item) {
      // 非末级节点
      const { name, orgfinal, id } = item
      this.$refs.folderNav.setFolder(item)
      if (orgfinal !== 2) {
        this.$router.push({ path: `my-folder-detail/${id}`, query: { folderId: id, folderName: name, navList: JSON.stringify(this.folderStack) } })
        return
      }
      this.loadSubFolder(id)
    },
    /**
     * 处理右键点击事件
     * @param event
     */
    handleContextMenu (event, data) {
      if (data.orgfinal == 2) {
        return
      }
      this.popupConfig.left = event.x
      this.popupConfig.top = event.y
      this.popupConfig.isShowPopup = true
      this.currentFolder = data
    },
    creatFolder () {
      if (Object.keys(this.currentDataSpaceGetter).length === 0) {
        console.log(new Error('当前企业数据为空'))
      }
      this.$prompt('', '新建项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入名称',
        // inputPattern: /^.{1,10}$/,
        // inputErrorMessage: '项目名称限定1到10字符长度',
        closeOnClickModal: false
      }).then(({ value }) => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        // 添加文件夹
        this.$api.addFolder({
          name: value,
          companyId: this.currentDataSpaceGetter.id,
          type: this.currentDataSpaceGetter.type
        }).then(res => {
          this.$emit('create-folder-complete')
          this.$message({
            type: 'success',
            message: '新建成功'
          })
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        }).catch(err => {
          console.error(err)
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        })
      })
    },
    operateClick (item) {
      if (this.currentFolder.orgfinal === 2) {
        return
      }
      // 1. close popup
      this.popupConfig.isShowPopup = false
      item.func()
    },
    /**
     * 文件夹协作成员管理
     */
    handleCooperateMng () {
      // 1. close popup
      this.popupConfig.isShowPopup = false
      // 2. show dialog
      Bus.$emit('cooperate-mng', { flag: 'folder', data: this.currentFolder })
    },
    changeColor (index) {
      if (this.currentFolder.orgfinal === 2) {
        return
      }
      this.popupConfig.isShowPopup = false
      this.updateFolderInfo({ color: index + 1, folder_id: this.currentFolder.id })
    },
    rename () {
      this.$prompt('', '修改项目名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入名称',
        inputPattern: /^.+$/,
        inputErrorMessage: '项目名称格式不正确',
        closeOnClickModal: false
      }).then(({ value }) => {
        this.updateFolderInfo({ folder_name: value, folder_id: this.currentFolder.id })
      })
    },
    // 查看项目状态
    handleEditStatus () {
      this.editStatus = true
      this.$api.searchFoldEditus(this.currentFolder.id).then(res => {
        console.log(res)
        if (res.code == 0) {
          this.editDatas = res.data
        } else {
          this.$msgMnger.httpError(res.message)
        }
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        console.error(err)
        this.$msgMnger.httpError(err)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    delete () {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.updateFolderInfo({ deleted: 1, folder_id: this.currentFolder.id })
      })
    },
    updateFolderInfo (param) {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.updateFolderInfo(param).then(res => {
        this.$emit('create-folder-complete')
        this.$msgMnger.success(res.msg)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        console.error(err)
        this.$msgMnger.httpError(err)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    /**
     * 点击目录按钮
     */
    handleCatalog () {
      Bus.$emit('flowfile-catalog', {
        folderId: this.currentFolder.id,
        folderName: this.currentFolder.name
      })
    },
    refreshFolderList () {
      this.$emit('create-folder-complete')
    }
  }
}
</script>

<style lang="scss" scoped>
.bread-panel{
  padding: 0 0 16px 0;
}
.floder-list{
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  // grid-template-rows: repeat(auto-fill, 150px);
  grid-row-gap: 30px; // 行间距
  grid-column-gap: 80px; // 列间距
  .folder-item{
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .icon-child{
      display: none;
    }
    .list__list-item--haschild{
      position: relative;
      .icon-child{
        display: block;
        position: absolute;
        left: 82px;
        color:#fff;
        font-weight: bold;
        top: 60px;
        font-size: 24px;
      }
    }
    .folder-item-img{
      // flex: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 120px;
      .iconfont-symbol {
        width: 130;
        height: 100px;
        // vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
      .more-div{
        position: absolute;
        top: 0;
        right: 0;
        display: none;
        user-select: none;
        cursor: pointer;
        .more-img{
          width: 15px;
          padding: 10px;
        }
        &:hover{
          .tips-div{
            display: inline-block;
          }
        }
        .tips-div{
          background: #515961;
          color: #fff;
          font-size: 12px;
          position: absolute;
          bottom: -15px;
          left: 0;
          padding: 2px 5px;
          display: none;
          .arrow{
            width: 0;
            height: 0;
            border: 5px solid transparent;
            border-bottom-color: #515961;
            position: absolute;
            bottom: 100%;
            left: 12px;
          }
        }
      }
      &:hover{
        background: #F5F5F5;
        .more-div{
          display: inline-block;
        }
      }
    }
    .creat-fold{
      border: 1px dashed #92A3B3;
      cursor: pointer;
      border-radius: 5px;
      height: 120px;
      box-sizing: border-box;
      >i{
        color: #92A3B3;
        font-size: 50px;
      }
    }
    .folder-item-name {
      flex: none;
      line-height: 30px;
      word-break: break-all;
      user-select: none;
    }
  }
  .menu-div{
    cursor: pointer;
    background: #fff;
    box-shadow:0px 3px 8px 0px rgba(0,0,0,0.08);
    border-radius:1px;
    color: #666666;
    text-align: left;
    font-size: 14px;
    padding: 0 16px;
    >div{
      padding: 10px 0;
      border-bottom: 1px solid #E8E8E8;
      &:last-child{
        border: none;
      }
    }
    .title{
      background: #F5F5F5;
      margin: 0 -16px 0 -16px;
      padding: 10px 16px;
    }
    .color-select-div{
      display: flex;
      align-items: center;
      .color-select{
        width: 24px;
        height: 24px;
        border-radius: 100%;
        flex: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        >i{
          font-size: 16px;
          color: #fff;
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .disable{
      cursor: not-allowed;
      color: rgb(206, 206, 206);
    }
  }
}
</style>
