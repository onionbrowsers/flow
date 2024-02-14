<template>
  <div
    class="flowchart-list"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <div class="flowchart-list-header">
<!--      <el-input v-model="flowchartName"></el-input>-->
<!--      <el-button type="primary">搜索</el-button>-->
      <el-input placeholder="请输入关键词查找流程图" v-model="flowchartName" @keydown.enter.native="handleSearch">
        <template slot="append">
          <el-button type="primary" @click="handleSearch">搜&nbsp;&nbsp;索</el-button>
        </template>
      </el-input>
    </div>
    <div class="flowchart-list-body">
      <el-scrollbar style="height: 400px;" ref="elScrollbar">
<!--        当列表有数据时, 展示列表-->
        <template v-if="flowchartList.length">
          <flowchart-item
            v-for="item in flowchartList"
            :key="item.id"
            :flowchart-item="item"
            :current-flowchart-id="currentFlowchartId"
            @select-flowchart="handleSelectFlowchart"
          ></flowchart-item>
        </template>
<!--        无数据时, 展示no-data-->
        <template v-else>
          <div class="flowchart-list-body__list--no-data">
            暂无数据
          </div>
        </template>
        <template v-if="!hasNextComputed">
          <div class="flowchart-list-body__list--no-data">
            无更多数据
          </div>
        </template>
      </el-scrollbar>
    </div>
    <div class="flowchart-list-footer footer">
<!--      <el-button type="primary" @click="handlePrevStep">上一步</el-button>-->
      <el-button type="primary" @click="handleNextStep" :disabled="currentFlowchartId === -1">下一步</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import FlowchartItem from './flowchart-item'
import Bus from '@/utils/event-bus'
export default {
  name: 'flowchart-list.vue',
  props: ['folderId'],
  components: {
    FlowchartItem
  },
  data () {
    return {
      flowchartList: [],
      flowchartName: '',
      pageInfo: {
        page_size: 10,
        page: 1,
        has_next: true,
        total: -1,
        filteredLength: 0
      },
      loading: false,
      currentFlowchartId: -1,
      scrollTimeoutId: -1
    }
  },
  computed: {
    hasNextComputed () { // 是否有下一页
      return !(this.flowchartList.length === (this.pageInfo.total - this.pageInfo.filteredLength))
    }
  },
  mounted () {
    this.getFlowchartList()
    let scrollView = this.$refs.elScrollbar.$refs.wrap
    scrollView.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    let scrollView = this.$refs.elScrollbar.$refs.wrap
    scrollView.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async getFlowchartList () {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        let params = {
          page_size: this.pageInfo.page_size,
          page: this.pageInfo.page,
          folder_id: this.folderId
        }
        // 当当前企业空间为个人空间时, 只请求个人空间的数据
        if (this.$store.getters.currentDataSpaceGetter.type === 2) {
          params['company_id'] = this.$store.getters.currentDataSpaceIdGetter
        } else {
          // 否则, 当企业空间
          params['company_id'] = this.$store.getters.currentDataSpaceIdGetter
          params['user_company'] = this.$store.getters.personalDataSpaceGetter.id
        }
        if (this.flowchartName) {
          params.keywords = this.flowchartName
        }
        const res = await this.$api.getFile(params)
        this.pageInfo.total = res.total
        // this.pageInfo.has_next = res.data.page.has_next
        let _data = res.data
        // 计算过滤的量, total 减去以修正 total 值
        let _lengthBeforeFilter = _data.length
        // this.flowchartList = res.data
        let { flowfileId } = this.$route.params
        _data = _data.filter(item => Number(flowfileId) !== item.id && item.type !== 3)
        let _lengthAfterFilter = _data.length
        this.pageInfo.filteredLength += _lengthBeforeFilter - _lengthAfterFilter
        // 要不要做导入的限制
        // _data = _data.filter(item => item.type !== 3)
        this.flowchartList.push(..._data)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    },
    handleScroll (e) {
      if (this.scrollTimeoutId !== -1) {
        return false
      }
      let targetHeight = 400
      let child = e.target.children[0]
      let childHeight = child.offsetHeight
      let targetScrollTop = e.target.scrollTop
      if (targetScrollTop >= childHeight - targetHeight - 80) {
        if (this.hasNextComputed) {
          if (this.pageInfo.page >= 10) {
            debugger
          }
          this.pageInfo.page++
          this.getFlowchartList()
        } else {
          return false
        }
      } else {
        return false
      }
      this.scrollTimeoutId = setTimeout(() => {
        this.scrollTimeoutId = -1
      }, 1000)
    },
    handleSearch () {
      if (!this.flowchartName || !this.flowchartName.trim()) {
        return false
      }
      this.pageInfo.page = 1
      // this.pageInfo.has_next = false
      this.pageInfo.total = -1
      this.pageInfo.filteredLength = 0
      this.flowchartList = []
      this.getFlowchartList()
    },
    handleSelectFlowchart (flowchartId) {
      this.currentFlowchartId = flowchartId
    },
    // handlePrevStep () {},
    handleNextStep () {
      this.$emit('import-from-event', { from: 'online' })
      // 导入已有流程图
      this.loading = true
      this.$api.importFlowchartExisted(this.currentFlowchartId).then(res => {
        Bus.$emit('import-flowchart-existed-done', res)
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    },
    handleCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.flowchart-list {
  display: flex;
  flex-direction: column;
  text-align: left;
  .flowchart-list-header {
    height: 80px;
    padding: 0 40px;
    display: flex;
    align-items: center;
    .el-input {
      flex: auto;
    }
  }
  .flowchart-list-body {
    height: 400px;
    padding: 0 40px;
    .flowchart-list-body__list--no-data {
      line-height: 60px;
      font-size: 14px;
      color: $base-text-color-lighter;
      text-align: center;
    }
  }
  .footer {
    height: 64px;
    width: 100%;
    background-color: rgba(250,250,250,1);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      margin: 0 10px;
      padding: 0 20px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      &:last-child {
        margin: 0 50px 0 10px;
      }
    }
  }
}
</style>

<style lang="scss">
.flowchart-list {
  .el-input-group__append {
    background-color: #1890ff !important;
    color: #fff;
  }
}
</style>
