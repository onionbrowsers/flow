<template>
  <div id="fc-flowfile-list">
    <b-layout mode="vertical" placement="top" :space="headHeight" :border="false" :duration="100">
      <page-header slot="first" class="page-header" :title="'我的流程图'" :button="' + 创建流程图'" @create="creatNew">
        <flowfile-toolbar ref="toolBar" @selectFile="handleSelect">
          <tags-filter-bar
            class="tags-filter-bar"
            ref="tagsFilterBar"
            :tagList="flowfileTags"
            @tagsExpend="handleTagsExpend"
            @tagsChecked="handleTagsChecked"
            >
          </tags-filter-bar>
        </flowfile-toolbar>
      </page-header>
      <b-layout
        slot="last"
        class="file-list"
        mode="vertical"
        placement="top"
        space="54px"
        :border="false"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        >
        <el-row slot="first" class="head-title">
          <el-col :span="4" :offset="2" class="file">文件</el-col>
          <el-col :span="3" :offset="0">作者</el-col>
          <el-col :span="6" :offset="0">标签</el-col>
          <el-col :span="4" :offset="0">创建时间</el-col>
          <el-col :span="5">操作</el-col>
        </el-row>
        <el-scrollbar slot="last" class="list-scrollbar">
          <div class="file-item-group">
            <!-- 文件列表 -->
            <flowfile-item
            :flowfile="item"
            :tagList="flowfileTags"
            v-for="(item,index) in flowfileList"
            :key="index"
            @newList="handleRes"
            />
          </div>
          <empty-list v-if="emptyVisible"/>
        </el-scrollbar>
        <custom-paginator slot="last" ref="paginator" class="file-paginator" @pageChange="handlePageChange"/>
      </b-layout>
    </b-layout>
    <!-- 新建流程弹框 -->
    <flowfile-creat ref="flowfile-creat"/>
  </div>
</template>

<script>
import FlowfileToolbar from '../components/flowfile-list/flowfile-list-toolbar'
import FlowfileItem from '../components/flowfile-list/flowfile-item'
import BLayout from '@/layouts/BinaryLayout'
import PageHeader from '@/components/public/PageHeader.vue'
import CustomPaginator from '@/components/public/CustomPaginator.vue'
import tagsFilterBar from '../components/public/tags-filter-bar'
import EmptyList from '@/components/public/empty-list.vue'
import FlowfileCreat from '../components/public/flowfile-creat'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  components: {
    FlowfileToolbar,
    FlowfileItem,
    BLayout,
    EmptyList,
    CustomPaginator,
    tagsFilterBar,
    PageHeader,
    FlowfileCreat
  },
  data () {
    return {
      headHeight: '180px',
      flowfileList: [],
      tagList: [],
      emptyVisible: false,
      preview: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'flowfileTags'
    ])
  },
  watch: {
    '$route': {
      handler (val) {
        this.debounceQuery(val)
      },
      deep: true
    },
    'flowfileTags': {
      handler (val) {
        this.tagList = val
        let _checkedTags = this.$route.query.tags ? this.$route.query.tags.split(',') : []
        this.$refs.tagsFilterBar && this.$refs.tagsFilterBar.updateChecked(_checkedTags)
      },
      deep: true
    }
  },
  mounted () {
    this.updateTag({ context: this })
    this.configState(this.$route)
    this.debounceQuery(this.$route)
    this.getImg()
  },
  methods: {
    ...mapActions({
      updateTag: 'UPDATE_FLOWFILE_TAGS'
    }),
    ...mapMutations({
      setFlowId: 'SET_FLOW_ID'
    }),
    getFlowfileList (val) {
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
      this.loading = true
      this.flowfileList = []
      return new Promise((resolve, reject) => {
        this.$api.getFlowfileListFC(params).then(res => {
          let data = res.data
          resolve(data)
        }).catch(err => {
          this.$msgMnger.httpError(err)
          reject(err)
        })
      })
    },
    debounceQuery: _.debounce(function (route) { // 文件预览列表初始化
      this.getFlowfileList(route).then(data => {
        let list = []
        data.items.forEach(e => {
          let flowfile = {
            id: e.id,
            title: e.name,
            author: e.author_name,
            time: e.last_modified,
            tags: e.tags,
            img: e.preview
          }
          list.push(flowfile)
        })
        this.emptyVisible = !list.length
        if (!list.length && data.page.page > 1) {
          let page = data.page.page
          this.$refs.paginator.handleCurrentChange(page - 1)
        } else {
          this.flowfileList = list
          this.$refs.paginator && this.$refs.paginator.updateTotal(data.page.total)
        }
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }).catch(err => {
        this.$msgMnger.httpError(err.msg)
        this.loading = false
      })
    }, 300),
    configState (route) {
      let _checkedTags = this.$route.query.tags ? this.$route.query.tags.split(',') : []
      this.$refs.tagsFilterBar.updateChecked(_checkedTags)
      this.$refs.toolBar.$refs.searchInput.inputS = this.$route.query.k || ''
      this.$refs.paginator && this.$refs.paginator.updatePage(Number(this.$route.query.ps), Number(this.$route.query.p))
    },
    handleRes () {
      this.updateTag({ context: this })
      this.debounceQuery(this.$route)
    },
    handlePageChange (page) { // 分页搜索
      let obj = {
        name: this.$route.name,
        params: {
          type: this.$route.params.type
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
    handleSelect (item) { // 输入框搜索
      let obj = {
        name: this.$route.name,
        query: {
          ps: this.$route.query.ps,
          p: 1
        }
      }
      if (item) {
        obj.query.k = item
      }
      if (this.$route.query.tags) {
        obj.query.tags = this.$route.query.tags
      }
      this.$router.push(obj)
    },
    handleTagsChecked (item) {
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
    creatNew () {
      this.$refs['flowfile-creat'].$refs['flowFileItemDialog'].updateVisible(true)
    },
    getImg () {
      if (this.flowfileList.img) {
        let id = this.flowfileList.img.id
        let key = this.flowfileList.img.key
        this.preview = `/api/v2/fc/file/${id}/${key}`
      } else {
        this.preview = `/api/v2/fc/file/2/2`
      }
    },
    handleTagsExpend (state) {
      this.headHeight = state ? '240px' : '180px'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
#fc-flowfile-list{
  height: 100%;
  min-width: $content-area-min-width;
  background: $secondary-bg-color;
  #ba-binary-layout{
    width: auto !important;
    .page-header{
      margin: 0 10px;
      .tagFilter{
        position: relative;
        left: 0;
        top: 10px;
        height: 30px;
        margin-bottom: 20px;
        border-top: 1px solid #ccc;
        padding-top: 20px;
        .showMore{
          margin-left: 20px;
          border: 1px solid transparent;
          background: #fff
        }
      }
    }
    .file-list{
      margin: 10px;
      height: calc(100% - 20px);
      background: #fff;
      .head-title{
        border-bottom: 1px solid $seprator-line-color;
        height: 54px;
        line-height: 54px;
        font-size: 14px;
        background: $tertiary-bg-color;
        font-weight: bold;
        padding: 0 20px;
        .file{
          text-align: left;
        }
      }
      .list-scrollbar{
        height: calc(100% - 54px);
        .file-item-group{
          height: 100%;
          padding: 0 20px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-autocomplete-suggestion__list{
  padding-bottom: 15px;
}
.el-autocomplete-suggestion li{
  padding: 0 15px !important;
  padding-right: 30px !important;
  line-height: 26px !important;
  font-size: 12px !important;
}
.tag-search.el-autocomplete-suggestion.el-popper .el-autocomplete-suggestion__wrap {
  margin-bottom: 0 !important;
  padding: 5px 0 !important;
}
</style>
