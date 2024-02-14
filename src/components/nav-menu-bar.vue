<template>
  <div id="nav-menu-bar">
    <div class="tools-bar">
      <div class="btn" v-for="(v, i) in toolsItems" :key="i" :class="{'btn-selected':btnActiveIndex === i}" @click="handleBtnSelect(i)">
        <i class="iconfont" :class="v.icon"></i>
        <span>{{v.txt}}</span>
      </div>
    </div>
    <div class="menu-bar">
      <div class="item" v-for="(v, i) in menuItems" :key="i" :class="[activeIndex === i ? 'selected' : 'default', {'circle':v.type === 'circle'}]" @click="handleSelect(i)">
        <div class="inner">
          <img :src="activeIndex === i ? v.selected : v.default" alt="">
        </div>
        <span>{{v.txt}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/event-bus'
export default {
  components: {

  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      btnActiveIndex: 0,
      activeIndex: 0,
      toolsItems: [
        {
          txt: '创建流程图',
          icon: 'iconxinjian',
          func: this.createFlowchart
        }
        // {
        //   txt: '导入viso流程图文件',
        //   icon: 'icontianjia'
        // },
        // {
        //   txt: '其他常用工具',
        //   icon: 'iconqitachangyonggongju'
        // }
      ],
      menuItems: [
        {
          txt: '我的项目',
          default: require('@/modules/home/assets/folder.png'),
          selected: require('@/modules/home/assets/folder-selected.png'),
          routerPath: '/home/my-folder'
        },
        {
          txt: '流程图',
          default: require('@/modules/home/assets/flow.png'),
          selected: require('@/modules/home/assets/flow-selected.png'),
          routerPath: '/home/my-flow'
        },
        {
          txt: '我的图库',
          default: require('@/modules/home/assets/imglibraryh.png'),
          selected: require('@/modules/home/assets/imglibraryb.png'),
          routerPath: '/home/myvisiolibrary'
        },
        {
          txt: '我的矩阵库',
          default: require('@/modules/home/assets/juzhenh.png'),
          selected: require('@/modules/home/assets/juzhenb.png'),
          routerPath: '/home/myriskmatrix'
        },
        {
          txt: '我的制度库',
          default: require('@/modules/home/assets/zhiduh.png'),
          selected: require('@/modules/home/assets/zhidub.png'),
          routerPath: '/home/systemctrl'
        },
        {
          txt: '我的手册库',
          default: require('@/modules/home/assets/neikh.png'),
          selected: require('@/modules/home/assets/neikb.png'),
          routerPath: '/home/interctrllib'
        },
        {
          txt: '我的风险识别库',
          default: require('@/modules/home/assets/riskidenh.png'),
          selected: require('@/modules/home/assets/riskidenb.png'),
          routerPath: '/home/myriskidentifi'
        },
        {
          txt: '我的表单文件库',
          default: require('@/modules/home/assets/formfileh.png'),
          selected: require('@/modules/home/assets/formfileb.png'),
          routerPath: '/home/myformfile'
        },

        {
          txt: '风险数据库',
          default: require('@/modules/home/assets/riskstoreh.png'),
          selected: require('@/modules/home/assets/riskstoreb.png'),
          routerPath: '/home/riskdatastore'
        },
        {
          txt: '控制证据库',
          default: require('@/modules/home/assets/evih.png'),
          selected: require('@/modules/home/assets/evib.png'),
          routerPath: '/home/eviliststore'
        },
        {
          txt: '风险类型库',
          default: require('@/modules/home/assets/riskh.png'),
          selected: require('@/modules/home/assets/riskb.png'),
          routerPath: '/home/riskctrl'
        },
        {
          txt: '方案中心',
          default: require('@/modules/home/assets/neikh.png'),
          selected: require('@/modules/home/assets/neikb.png'),
          routerPath: '/inner-control/plan-center'
        }

        // {
        //   txt: '回收站',
        //   default: require('@/modules/home/assets/recycle-bin.png'),
        //   selected: require('@/modules/home/assets/recycle-bin.png'),
        //   type: 'circle'
        // }
      ]
    }
  },
  computed: {

  },
  watch: {
    '$route': {
      handler () {
        this.setActiveIndex()
      },
      deep: true
    }
  },
  created () {

  },
  mounted () {
    this.setActiveIndex()
  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    handleBtnSelect (val) {
      this.btnActiveIndex = val
      // 2. 触发函数
      this.toolsItems[val].func()
    },
    handleSelect (val) {
      this.activeIndex = val
      this.$router.push(this.menuItems[val].routerPath)
    },
    setActiveIndex () {
      let { path } = this.$route
      this.menuItems.forEach((item, index) => {
        if (path.indexOf(item.routerPath) > -1) {
          this.activeIndex = index
        }
      })
    },
    /**
     * 用户创建流程图的入口, 展示创建流程图文件夹;
     * 通过 bus 发送消息
     */
    createFlowchart () {
      Bus.$emit('create-flowchart')
    }
  }
}
</script>

<style lang="scss" scoped>
#nav-menu-bar{
  display: flex;
  .tools-bar{
    border-right: 1px solid #E8E8E8;
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn{
      width:166px;
      height:46px;
      background:rgba(240,243,247,1);
      color: #778796;
      font-size: 14px;
      border-radius:4px;
      margin-top: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont{
        margin-right: 6px;
      }
    }
    .btn-selected{
      background:rgba(24,144,255,1);
      color: white;
    }
  }
  .tools-bar, .menu-bar{
    width: 214px;
    height: 100%;
  }
  .menu-bar{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: auto;
    .item{
      width:112px;
      height:103px;
      border-radius:4px;
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .inner{
        width:42px;
        height:42px;
        border-radius:4px;
        margin-bottom: 7px;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 24px;
          height: 21px;
        }
      }
      span{
        font-size:16px;
        color: #92A3B3;
        font-weight:400;
        line-height:22px;
      }
    }
    .selected{
      background:rgba(245,245,245,1);
      .inner{
        background:rgba(24,144,255,1);
        color:rgba(24,144,255,1);
      }
      span{
        color: #1890FF;
      }
    }
    .circle{
      position: absolute;
      bottom: 24px;
      .inner{
        border-radius: 50%;
      }
    }
  }
}
</style>
