<template>
  <div id="template-list" >
    <b-layout mode="vertical" placement="top" :space="headHeight" :border="false" :duration="300">
      <page-header slot="first" class="page-header" :title="'我的模板'" :button="'创建模板'" @create="createHandle">
        <template-tool-bar ref="toolBar" interfaceName="getSearchTemplateHistory">
          <!-- <custom-c-b :tagList="tagList" slot="checkbox" ref="tagsBar" @checkedChange="handleSelectTags"/> -->
          <tags-filter-bar ref="tagsFilterBar" slot="tags" :tagList="flowtempTags" @tagsExpend="handleTagsExpend" @tagsChecked="checkTagsHandle"></tags-filter-bar>
        </template-tool-bar>
      </page-header>

      <!-- 常用模板 -->

      <b-layout slot="last" class="template-list" mode="vertical" placement="top" :space="recentUsedSpace" :duration="300" :border="false"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        >
        <!-- <div slot="first" class="placeholder"></div> -->
        <div slot="last" class="all-template">
          <div class="tmpHandle">
            <el-checkbox v-model="flag" class="down">批量操作</el-checkbox>
            <el-button size="mini" :disabled="!flag" @click="batchDownload"><i class="iconfont iconxiazai1"></i>批量下载</el-button>
          </div>
          <!-- <div class="title title-all">
            <span class="title-left">全部模板</span>
          </div> -->
          <b-layout slot="last" class="all-template-list" mode="vertical" placement="bottom" space="40px" :border="false">
            <el-scrollbar slot="first" class="list-scrollbar">
              <div class="template-item-group" v-show="flag">
                <el-checkbox-group v-model="checkList">
                    <el-checkbox
                      class="decorateItem"
                      :label="item.id"
                      v-for="(item,index) in templates"
                      :key="index" border
                      :status="item.status"
                      :disabled="item.status !== 2"
                    >
                      <template-item-edit
                        :template="item"
                        :class="{'remove-border': !flag}"
                        :isBatchHandle="flag"></template-item-edit>
                    </el-checkbox>
                    <div class="empty-space" v-for="index in 10" :key="'es'+index"></div>
                </el-checkbox-group>
              </div>

              <div v-show="!flag" class="template-item-group">
                <template-item-edit
                  :template="item"
                  v-for="(item,index) in templates"
                  :key="index" class="remove-border decorateItem"
                  @preview="previewHandle"
                  @deleteTmp='deleteHandle'
                  @download="downloadHandle"
                  @createFlowFile="createFlowFile"
                  @editTmp="editTmpHandle"
                  @click.native="toDetail(item.id)"
                ></template-item-edit>
                <div class="empty-space" v-for="index in 10" :key="'ts'+index"></div>
              </div>

              <empty-list title="未查询到模板" v-if="!templates.length"/>
            </el-scrollbar>
            <custom-paginator
              slot="last"
              ref="paginator"
              class="template-paginator"
              @pageChange="handlePageChange"
              layout='total, prev, pager, next, jumper'
            />
          </b-layout>
        </div>
      </b-layout>
    </b-layout>
    <flowfile-dialog
      ref="flowFileItemDialog"
      width="320px"
      :title="dlgConfigs.title"
      :btn1="dlgConfigs.btn1"
      :btn2="dlgConfigs.btn2"
      :btn3="dlgConfigs.btn3"
      :type="dlgConfigs.type"
      :showClose="true"
      @clickBtn1="btn1Handle"
      @clickBtn2="btn2Handle"
      @clickBtn3="btn3Handle"
      @beforeClose="beforeCloseHandle"
    >
      <update-file
        v-if="this.childCpt === 'updateFile'"
        slot="one"
        ref="showTag"
        @addTags="addTags"
        :inputRT="handleTemplate && handleTemplate.name"
        :tagList="tagList"
      />

      <delete-template
        slot="three"
        v-if="this.childCpt === 'deleteTmp'"
        :templateName="handleTemplate.name"
      />

      <download-template
        slot="four"
        v-if="this.childCpt === 'downloadTmp'"
        :number="this.checkList.length"
        ref="downloadTmp"
      />

    </flowfile-dialog>
    <template-preview ref="templatePreview"/>
  </div>
</template>

<script>
import BLayout from '@/layouts/BinaryLayout'
import PageHeader from '@/components/public/PageHeader'
import TemplateToolBar from '../components/template-list/template-tool-bar'
import CustomPaginator from '@/components/public/CustomPaginator'
import EmptyList from '@/components/public/empty-list'
import TagsFilterBar from '../components/public/tags-filter-bar'
import TemplateItemEdit from '../components/template-list/template-item-edit'
import FlowfileDialog from '../components/public/flowfile-dialog'
import UpdateFile from '../components/flowfile-list/update-file'
import TemplatePreview from '../components/template-train/template-preview'
import DeleteTemplate from '../components/template-list/delete-template'
import DownloadTemplate from '../components/template-list/download-template'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

const imgList = ['aircraft.svg', 'butterfly.svg', 'seals.svg', 'envelope.svg']

export default {
  components: {
    BLayout,
    PageHeader,
    TemplateToolBar,
    TemplateItemEdit,
    CustomPaginator,
    EmptyList,
    TagsFilterBar,
    FlowfileDialog,
    UpdateFile,
    TemplatePreview,
    DeleteTemplate,
    DownloadTemplate
  },
  data () {
    return {
      flag: false,
      loading: false,
      isExpend: true,
      isMore: false,
      headHeight: '180px',
      checkList: [],
      templates: [],
      tagList: [],
      childCpt: '',
      src: '',
      handleTemplate: null,
      dlgConfigs: {
        title: '创建',
        type: 'createTmp',
        btn1: { title: '取 消' },
        btn2: { title: '保 存' },
        btn3: null,
        checkedTags: []
      }
    }
  },
  computed: {
    recentUsedSpace () {
      if (!this.isExpend) {
        return '20px'
      } else {
        return this.isMore ? '360px' : '0px' // 116+40
      }
    },
    ...mapGetters([
      'flowtempTags',
      'flowfileTags',
      'token'
    ])
  },
  mounted () {
    this.updateTags({ context: this }) // 获取模板标签
    this.updateFlowFileTags({ context: this })
    this.configState(this.$route)
    this.debounceQuery(this.$route)
  },
  methods: {
    ...mapActions({
      updateTags: 'UPDATE_FLOWTEMP_TAGS',
      updateFlowFileTags: 'UPDATE_FLOWFILE_TAGS'
    }),
    configState (val, tags) {
      this.$refs.toolBar.$refs.searchInput.inputS = this.$route.query.k || ''
      const _checkedTags = val.query.tags ? val.query.tags.split(',') : []
      this.$refs.tagsFilterBar && this.$refs.tagsFilterBar.updateChecked(_checkedTags)
    },
    debounceQuery: _.debounce(function (val) {
      this.loading = true
      this.getTempaltes(val).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 1000)
        // this.templates = res.data.items
        res.data.items.forEach((item, index) => {
          item.src = imgList[item.id % 4]
        })
        console.log(res.data.items)
        this.templates = res.data.items
        this.$refs.paginator && this.$refs.paginator.updateTotal(res.data.page.total)
        this.$refs.paginator && this.$refs.paginator.updatePage(12, val.query.p, [12])
      }).catch(err => {
        this.loading = false
        this.$msgMnger.httpError(err)
      })
    }, 300),
    checkTagsHandle (item) {
      let obj = {
        name: this.$route.name,
        params: {
          type: this.$route.params.type
        },
        query: {
          ps: this.$route.query.ps,
          p: 1
        }
      }
      if (this.$route.query.k) {
        obj.query.k = this.$route.query.k
      }
      if (item.length) {
        obj.query.tags = item.join(',')
      }
      this.$router.push(obj)
    },
    handleTagsExpend (state) {
      this.headHeight = state ? '256px' : '200px'
    },
    expend () {
      this.isExpend = !this.isExpend
    },
    getTempaltes (val) {
      let params = {
        page_size: val.query.ps,
        page: val.query.p
      }

      if (val.query.k) {
        params.keyword = val.query.k
      }

      if (val.query.tags) {
        params.tags = val.query.tags
      }

      return new Promise((resolve, reject) => {
        this.$api.getTemplates(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getIcon () {
      return this.isExpend ? 'iconxiala' : 'iconjiantou'
    },
    handlePageChange (page) {
      let obj = {
        name: this.$route.name,
        params: {
        },
        query: {
          ps: page.pagesize,
          p: page.page
        }
      }
      if (this.$route.query.k) {
        obj.query.k = this.$route.query.k
      }
      if (this.$route.query.tags) {
        obj.query.tags = this.$route.query.tags
      }
      this.$router.push(obj)
    },
    createHandle () {
      this.dlgConfigs = {
        title: '创建模板',
        type: 'createTmp',
        btn1: { title: '取 消' },
        btn2: { title: '保 存' },
        btn3: null,
        checkedTags: []
      }
      this.$refs.flowFileItemDialog.updateVisible(true).useFooter()
      this.childCpt = 'updateFile'
      this.tagList = this.flowtempTags
    },
    previewHandle (id) {
      this.$refs.templatePreview.updateTemplatePreview(id)
    },
    deleteHandle (template) {
      this.dlgConfigs = {
        title: '删除文件',
        btn1: { title: '取消' },
        btn3: { title: '删除' },
        type: 'delete'
      }

      this.$refs.flowFileItemDialog.updateVisible(true).useFooter()
      this.childCpt = 'deleteTmp'
      this.handleTemplate = template
    },
    downloadHandle (id) {
      window.open(`/api/v2/fc/template/down/${id}?_token=${this.token}`)
    },
    btn1Handle () {
      if (this.$refs.showTag) {
        // 清空状态
        this.$refs.showTag.$refs.titleTags && this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags([])
        this.$refs.showTag.$refs.titleTags.inputD = ''
      }
    },
    beforeCloseHandle () {
      this.btn1Handle()
    },
    btn2Handle () {
      if (this.dlgConfigs.type === 'createTmp') { // 新建模板
        const name = this.$refs.showTag.$refs.titleTags.inputD
        const tags = this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.join(',')
        this.loading = true
        this.$api.createTmp(name, tags).then(res => {
          this.$refs.flowFileItemDialog.dialogVisible = false
          this.loading = false
          this.$router.push(`/fc/template/${res.data.id}/train`)
        }).catch(err => {
          this.loading = false
          this.$msgMnger.httpError(err)
        })
      } else if (this.dlgConfigs.type === 'downloadTmp') { // 下载模板
        let merge = ''
        if (this.$refs.downloadTmp.mergeList.length > 0) {
          merge = this.$refs.downloadTmp.mergeList.join()
        }
        this.$refs.flowFileItemDialog.dialogVisible = false
        window.open(`/api/v2/fc/template/down?template_ids=${this.checkList.join()}&merge=${merge}&_token=${this.$store.getters.token}`)
        // this.$api.batchDownloadTmp(this.checkList.join(), merge).then(res => {
        //   console.log(res)
        //   if (res.code) {
        //     this.$msgMnger.error(res.msg)
        //   } else {
        //     window.open(`/api/v2/fc/template/down?template_ids=${this.checkList.join()}&merge=${merge}`)
        //   }
        // }).catch(err => {
        //   this.$msgMnger.httpError(err)
        //   this.loading = false
        // })
      } else if (this.dlgConfigs.type === 'editTmp') { // 修改模板
        this.loading = true
        const name = this.$refs.showTag.$refs.titleTags.inputD
        const tags = this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.join(',')
        this.$api.editTmp(this.handleTemplate.id, name, tags).then(res => {
          this.$refs.flowFileItemDialog.dialogVisible = false
          this.$msgMnger.success('修改成功')
          this.debounceQuery(this.$route)
          this.loading = false
          // 清空回填的状态
          this.$refs.showTag && this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags([])
          this.$refs.showTag.$refs.titleTags.inputD = ''
        }).catch(err => {
          this.loading = false
          this.$msgMnger.httpError(err)
        })
      } else if (this.dlgConfigs.type === 'createFlowFile') { // 创建流程图
        this.loading = true
        const params = {
          name: this.$refs.showTag.$refs.titleTags.inputD,
          tags: this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.join(','),
          template_id: this.handleTemplate.id
        }
        this.$api.createFlowFile(params).then(res => {
          this.$refs.flowFileItemDialog.dialogVisible = false
          this.$msgMnger.success('创建成功')
          this.loading = false
          this.$router.push({
            name: 'fc-flowfile-edit',
            params: {
              flowfileId: res.data.id
            }
          })
        }).catch(err => {
          this.loading = false
          this.$msgMnger.httpError(err)
        })
      }
    },
    btn3Handle () {
      if (this.dlgConfigs.type === 'delete') { // 删除模板
        this.$api.deleteTmp(this.handleTemplate.id).then(res => {
          this.$msgMnger.success('删除成功')
          this.debounceQuery(this.$route)
        }).catch(err => {
          this.$msgMnger.httpError(err.msg)
        })
      }
    },
    addTags (item) {
      if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.indexOf(item) > -1) {
        this.$msgMnger.warn('标签不允许重复')
        return
      }

      if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.length > 5 - 1) {
        this.$msgMnger.warn('最多可添加5个标签')
        return
      }

      this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.push(item)
    },
    /**
     * 批量下载
     */
    batchDownload () {
      if (this.checkList.length !== 0) {
        this.dlgConfigs = {
          title: '下载',
          type: 'downloadTmp',
          btn1: { title: '取 消' },
          btn2: { title: '确 认' }
        }
        this.childCpt = 'downloadTmp'
        this.$refs.flowFileItemDialog.updateVisible(true).useFooter()
      } else {
        this.$msgMnger.warn('请先选择要下载的模板')
      }
    },
    createFlowFile (template) {
      this.dlgConfigs = {
        title: '新建流程图',
        btn1: { title: '取 消' },
        btn2: { title: '保 存' },
        type: 'createFlowFile',
        checkedTags: []
      }
      this.handleTemplate = template
      this.tagList = this.flowfileTags
      this.childCpt = 'updateFile'
      this.$refs.flowFileItemDialog.updateVisible(true).useFooter()
      setTimeout(() => {
        this.$refs.showTag.$refs.titleTags.inputD = ''
      }, 1)
    },
    editTmpHandle (template) {
      this.dlgConfigs = {
        title: '修改模板信息',
        btn1: { title: '取 消' },
        btn2: { title: '保 存' },
        type: 'editTmp',
        checkedTags: []
      }
      this.childCpt = 'updateFile'
      this.tagList = this.flowtempTags
      this.handleTemplate = template
      this.$refs.flowFileItemDialog.updateVisible(true).useFooter()
      setTimeout(() => { // 不用延时拿不到 showTag
        this.$refs.showTag.$refs.titleTags && this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags(template.tags)
        this.$refs.showTag.$refs.titleTags.inputD = template.name
      }, 1)
    },
    toDetail (id) {
      this.$router.push(`/fc/template/${id}/train`)
    }
  },
  watch: {
    '$route': {
      handler (val) {
        this.debounceQuery(val)
        this.isExpend = !Object.keys(val.query).length
      },
      deep: true
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/index.scss';
#template-list{
  height: 100%;
  // max-width: $content-area-max-width;
  min-width: $content-area-min-width;
  width: 100%;
  background: $secondary-bg-color;
  margin: 0 auto;
  box-sizing: border-box;
  #template-tool-bar{
    .top-block{
      border: 0px !important;
    }
  }
  #ba-binary-layout{
    width: auto !important;
    .page-header{
      height: 100%;
      margin: 0 10px;
    }
    .template-list{
      margin: -10px 10px 10px 10px;
      height: calc(100% - 20px);
      padding: 0 20px;
      background: $primary-bg-inverse-color;
      .title{
        font-size: 14px;
        font-weight: bold;
        padding: 8px 0;
        line-height: 14px;
        height: 14px;
        text-align: left;
        .title-left{
          display: inline-block;
          padding-left: 10px;
          border-left: 4px solid $primary-color;
        }
      }
      .disable-style{
        cursor: not-allowed;
      }
      .all-template{
        height: 100%;
        box-sizing: border-box;
        .tmpHandle{
          text-align: right;
          margin-top: 10px;
          // margin-bottom: 10px;
          .iconxiazai1{
            margin-right: 5px;
          }
          .down{
            margin-right: 30px;
          }
        }
        .all-template-list{
          height: calc(100% - 60px);
          // border-top: 1px solid $seprator-line-color;
          #custom-paginator{
            padding-top: 0 !important;
          }
          .list-scrollbar{
            height: 100%;
            .template-item-group{
              padding: 10px 0px;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              .empty-space{
                box-sizing: border-box;
                width: 343px;
              }
              .remove-border{
                border: 1px solid #ccc;
              }
              .decorateItem{
                margin-bottom: 20px;
              }
              .template-item{
                &:hover{
                  cursor: default;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
#template-list{
  #ba-binary-layout{
    .template-list{
      .all-template-list{
        .el-checkbox-group{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .template-item-group{
        .el-checkbox{
            display: block;
            height: auto;
            padding: 0px !important;
            margin-left: 0px;
            margin-right: 0px;
            border: none;
            .el-checkbox__label{
              padding-left: 0;
              // margin-left: -15px;
              border: none;
            }
            .el-checkbox__input{
              // left: 346px;
              // top: -130px;
              position: absolute;
              right: 25px;
              top: 6px;
            }
          }
        }
      }
    }
  }
  .el-dialog__header{
    text-align: left;
  }
  #page-header .create-btn{
    top: 45px;
  }
}
</style>
