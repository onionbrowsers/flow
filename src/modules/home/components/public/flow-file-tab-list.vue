<template>
  <div
    class="flow-file-tab-list"
    v-loading="pageInfo.loading"
  >
    <div class="flowchart-list-header">
      <!--      <el-input v-model="flowchartName"></el-input>-->
      <!--      <el-button type="primary">搜索</el-button>-->
      <el-input
        placeholder="请输入关键词查找流程图"
        v-model="pageInfo.flowName"
        @keydown.enter.native="handleSearch"
        :maxlength="20"
      >
        <template slot="append">
          <el-button type="primary" @click="handleSearch">搜&nbsp;&nbsp;索</el-button>
        </template>
      </el-input>
    </div>
    <el-scrollbar
      class="fft-list__scroll-container"
    >
      <div
        class="fft-list__list"
        v-infinite-scroll="getFlowchartList"
        :infinite-scroll-immediate="false"
        :infinite-scroll-disabled="computedInfiniteScrollDisabled"
        :infinite-scroll-delay="200"
        :infinite-scroll-distance="20"
      >
<!--        <div-->
<!--          v-for="item in count"-->
<!--          :key="item"-->
<!--        >{{ item }}</div>-->
        <div v-for="item in flowList" :key="item.id">
          <flowchart-item
            :current-flowchart-id="currentFlow.flowId"
            :flowchart-item="item"
            :style-obj="flowchartItemStyleObj"
            :need-folder="false"
            @select-flowchart="handleSelectFlowchart(item)"
          ></flowchart-item>
          <div class="fft-list__tab-list" v-if="currentFlow.flowId === item.id && type === 'page'">
            <div
              v-for="page in item.hint"
              :key="page.label"
              style="padding: 5px;"
              @click="handleSelectPage(page)"
              class="fft-list__tab-item"
              :class="{ 'fft-list__tab-item--current': currentFlow.pageId === page.page }"
            >
              <i class="el-icon-check" v-if="currentFlow.pageId === page.page"></i>
              <span>标签页: {{ page.label }}</span>
            </div>
            <el-alert
              v-if="!item.hint || !item.hint.length"
              class="fft-list__no-tab"
              title="该流程图没有标签页"
              type="warning"
              :closable="false"
            ></el-alert>
          </div>
        </div>
        <div v-if="pageInfo.loading" class="fft-list__loading fft-list__status">- 加载中 -</div>
        <div v-if="pageInfo.noMore" class="fft-list__no-more fft-list__status">- 没有了 -</div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import FlowchartItem from '@/modules/flowchart/components/flowfile-edit/flowchart-item'
export default {
  name: 'flow-file-tab-list',
  components: {
    FlowchartItem
  },
  props: {
    folderId: {
      type: [Number, String],
      default: 0
    },
    type: {
      type: String,
      default: 'flow'
    }
  },
  data () {
    return {
      count: 0,
      pageInfo: {
        page: 1,
        page_size: 10,
        total: -1,
        flowName: '',
        pageName: '',
        loading: false,
        noMore: false
      },
      flowList: [], // 流程文件列表
      currentFlow: {
        flowId: 0,
        flowName: '',
        pageName: '',
        pageId: 0
      },
      flowchartItemStyleObj: {
        'flowchart-item': {
          height: '80px',
          padding: '5px 10px',
          margin: '10px 0 0 0',
          cursor: 'pointer',
          'border-radius': '4px',
          overflow: 'hidden'
        },
        'preview': {
          width: '60px',
          height: '60px',
          'margin-right': '20px'
        },
        'content-item': {
          'line-height': '25px'
        }
      }
    }
  },
  computed: {
    computedInfiniteScrollDisabled () {
      return this.count < 2
    }
  },
  mounted () {
    this.getFlowchartList().then(() => this.getFlowchartList())
  },
  methods: {
    /**
     * 获取 flow 列表
     */
    async getFlowchartList () {
      try {
        // console.log(this.pageInfo.total, this.flowList.length)
        if (this.pageInfo.total === this.flowList.length) {
          this.pageInfo.noMore = true
          return
        }
        this.pageInfo.loading = true
        this.count++
        let params = {
          page_size: this.pageInfo.page_size,
          page: this.pageInfo.page
        }
        if (this.folderId) { // 非默认0则表示有传入folderId
          params.folder_id = this.folderId
        }
        if (this.pageInfo.flowName) {
          params.keywords = this.pageInfo.flowName
        }
        const res = await this.$api.getFile(params)
        this.pageInfo.page++
        this.pageInfo.total = res.total
        // this.pageInfo.has_next = res.data.page.has_next
        let _data = res.data
        this.flowList.push(..._data)
        this.pageInfo.loading = false
        // this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      } catch (err) {
        this.pageInfo.loading = false
        // this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.$msgMnger.httpError(err)
      }
    },
    /**
     * 选中某个 flowchart
     * @param flow
     */
    handleSelectFlowchart (flow) {
      if (this.currentFlow.flowId !== flow.id) {
        this.currentFlow.pageId = 0
        this.currentFlow.pageName = ''
      }
      this.currentFlow.flowId = flow.id
      this.currentFlow.flowName = flow.name
    },
    /**
     * 选中某个 page 页
     * @param page
     */
    handleSelectPage (page) {
      this.currentFlow.pageName = page.label
      this.currentFlow.pageId = page.page
    },
    /**
     * 点击搜索
     */
    handleSearch () {
      // 初始化
      // flow list
      this.flowList = []
      // page info
      this.pageInfo.page = 1
      this.pageInfo.total = -1
      this.pageInfo.noMore = false
      // currentFlow
      this.currentFlow.flowId = 0
      this.currentFlow.flowName = ''
      this.currentFlow.pageId = 0
      this.currentFlow.pageName = ''
      // count
      this.count = 0
      this.getFlowchartList().then(() => this.getFlowchartList())
    },
    /**
     * $refs 获取 当前 flow 信息
     * @returns {{pageId: number, flowId: number, flowName: string, pageName: string}|string}
     */
    getCurrentFlow () {
      // 根据 type 进行验证
      // type === flow, 保证 this.currentFlow.flowId this.currentFlow.flowName 都有内容
      // type === flow, 保证 都有内容
      if (this.type === 'flow' && this.currentFlow.flowId && this.currentFlow.flowName) {
        return this.currentFlow
      } else if (
        this.type === 'page' &&
        this.currentFlow.flowId &&
        this.currentFlow.flowName
      ) {
        return this.currentFlow
      } else {
        return this.type === 'flow' ? '请选择流程文件' : '请选择流程图'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.flow-file-tab-list {
  text-align: left;
  .fft-list__scroll-container {
    height: 465px;
    .fft-list__list {
      .fft-list__tab-list {
        .fft-list__tab-item {
          cursor: pointer;
          padding: 5px;
          overflow: hidden;
          border-radius: 4px;
          .el-icon-check{
            float: right;
            margin-top: 2px;
          }
        }
        .fft-list__tab-item--current {
          background-color: $--background-color-base;
        }
        .fft-list__no-tab {
        }
      }
    }
    .fft-list__status {
      text-align: center;
      height: 25px;
      line-height: 25px;
    }
  }
  .flowchart-list-header {
  }
}
</style>
