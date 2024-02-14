<template>
  <div class="content-wrapper" v-loading="loading">
    <div class="information">
      <title-comp txt="组织架构图">
        <el-button class="btn" type="primary" @click="handleChange">{{showTree ? '切换为树形结构展示' : '切换为平铺形态展示'}}</el-button>
      </title-comp>
      <div ref="vEl" class="virtual-el"></div>
    </div>
    <div class="content">
      <div id="container" v-if="showTree" ref="container"></div>
      <el-tree class="tree-wrapper" v-else :data="treeData" default-expand-all :props="defaultProps" >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="tree-item">{{ data.name }}</span>
          <span class="tree-item-sub" @click="loadStaffPage(data)" v-if="data.number != null">{{'（' + data.number + '人）'}}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import G6 from '@antv/g6'
import titleComp from '@/components/title-comp'
import { getDefaultConfig, graphConfg, tooltip, registerFn } from './customize'
// import { mockData } from './data'
export default {
  name: 'orgChart',
  components: {
    titleComp
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showTree: true,
      treeData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      currentDataSpaceIdGetter: 'currentDataSpaceIdGetter'
    }),
  },
  watch: {
    currentDataSpaceIdGetter () {
      this.init()
    }
  },
  created () {

  },
  mounted () {
    this.init()
  },
  activated () {

  },
  beforeDestroy () {
  },
  methods: {
    loadStaffPage (row) {
      location.href = `/company/org/staff-manage?select_org_id=${row.id}&flag=1`
    },
    handleChange () {
      this.showTree = !this.showTree
      this.init()
    },
    init () {
      if (this.currentDataSpaceIdGetter < 0) return
      this.getOrgTree((data) => {
        if (this.showTree) {
          this.initTree(data)
        } else {
          this.initFolder(data)
        }
      })
    },
    getParams (params) {
      const id = this.currentDataSpaceIdGetter

      return Object.assign({
        ...params,
        company_id: id
      })
    },
    initFolder (data) {
      this.treeData = [data]
    },
    initTree (res) {
      const data = JSON.stringify(res, (key, value) => {
        if (key === 'id') {
          return value + ''
        }
        return value
      })
      registerFn(this.$refs.vEl)
      this.listen()
      this.initGraph(JSON.parse(data))
    },
    async getOrgTree (cb) {
      this.loading = true
      const res = await this.$api.getOrgTree(this.getParams({}))

      this.loading = false
      cb && cb(res.data)
    },
    listen () {
      window.onresize = () => {
        const graph = this.graph
        if (!graph || graph.get('destroyed')) return
        const { width, height } = this.getContainerInfo()
        graph.changeSize(width, height)
      }
    },
    getContainerInfo () {
      const container = this.$refs.container
      const width = container.scrollWidth
      const height = container.scrollHeight || 800
      return {
        width,
        height
      }
    },
    initGraph (data) {
      if (!data) return
      const graph = new G6.TreeGraph({
        container: 'container',
        ...getDefaultConfig(this.getContainerInfo()),
        ...graphConfg,
        plugins: [tooltip],
      })
      this.graph = graph
      graph.data(data)
      graph.render()

      const handleCollapse = (e) => {
        const target = e.target
        const id = target.get('modelId')
        const item = graph.findById(id)
        const nodeModel = item.getModel()
        nodeModel.collapsed = !nodeModel.collapsed
        graph.layout()
        graph.setItemState(item, 'collapse', nodeModel.collapsed)
      }
      graph.on('collapse-text:click', (e) => {
        handleCollapse(e)
      })
      graph.on('collapse-back:click', (e) => {
        handleCollapse(e)
      })
      setTimeout(() => {
        const el = graph.findById('-1')
        graph.focusItem(el)
        setTimeout(() => {
          graph.translate(0, -(this.$refs.container.clientHeight * 0.3))
        })
      }, 0)

      // 监听画布缩放，缩小到一定程度，节点显示缩略样式
      let currentLevel = 1
      const briefZoomThreshold = Math.max(graph.getZoom(), 0.5)
      graph.on('viewportchange', e => {
        if (e.action !== 'zoom') return
        const currentZoom = graph.getZoom()
        let toLevel = currentZoom < briefZoomThreshold ? 0 : 1

        if (toLevel !== currentLevel) {
          currentLevel = toLevel
          graph.getNodes().forEach(node => {
            graph.updateItem(node, {
              level: toLevel
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content{
    flex: 1;
    background-color: #fff;
    #container{
      height: 100%;
    }
    .tree-wrapper{
      padding: 16px;
      .tree-item{
        font-size: 16px;
        color:#606266
      }
      .tree-item-sub{
        font-size: 14px;
        margin-left: 8px;
        color:#1890FF;
        cursor: pointer;

      }
    }
    .container{

    }
  }
  .information{
    font-size: 0;
    .virtual-el{
      display: inline-block;
      visibility: hidden;
      height: 0;
      width: 210px;
      font-size: 18px;
      font-weight: 700;
    }
    .btn{
      margin-left: 8px;
    }
  }
}
</style>
