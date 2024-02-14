<template>
  <div id="usr-center">
    <div class="usr-center-menu">
      <el-menu router :default-active="activeIndex">
        <el-menu-item
          v-for="(item, index) in navItem" :key="index"
          :index="item.routerPath"
        >{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <div class="usr-center-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      navItem: [
        {
          name: '额度管理',
          routerPath: '/user-center/quota-mng'
        },
        {
          name: '下载记录',
          routerPath: '/user-center/download-record'
        },
        {
          name: '个人资料',
          routerPath: '/user-center/usr-info'
        }
      ],
      activeIndex: ''
    }
  },
  mounted () {
    this.setActiveIndex()
  },
  watch: {
    '$route': {
      handler (val) {
        this.setActiveIndex()
      },
      deep: true
    }
  },
  methods: {
    setActiveIndex () {
      let { path } = this.$route
      if (path.indexOf('/user-center/usr-info') > -1) {
        path = '/user-center/usr-info'
      }
      this.activeIndex = path
    }
  }
}
</script>

<style lang="scss" scoped>
#usr-center{
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 16px;
  background: #F0F3F7;
  .usr-center-menu{
    width: 150px;
    flex: none;
    background: #fff;
    .el-menu{
      height: 100%;
    }
  }
  .usr-center-content{
    flex: auto;
    width: 500px;
  }
}
</style>

<style lang="scss">
#usr-center{
  .el-menu{
    .el-menu-item{
      &:hover{
        color: #1890FF;
        background: #ccc;
      }
      &.is-active{
        background: #fff;
      }
    }
  }
}
</style>
