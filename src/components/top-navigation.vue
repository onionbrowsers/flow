<template>
  <div id="user-info-nav-header">
    <el-menu :default-active="onRoutes" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#666666" active-text-color="#1890FF">
      <el-menu-item v-for="v in navItem" :key="v.routerPath" :index="v.routerPath">{{v.name}}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'top-navigation',
  components: {

  },
  filters: {

  },
  props: {
    navItem: {
      type: Array
    }
  },
  data () {
    return {
      activeIndex: '/user-center/usr-info/my-company'
    }
  },
  computed: {
    onRoutes () {
      const route = this.$route
      if (!route) return
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path 
    }
  },
  watch: {
    '$route': {
      handler (val) {
        // this.setActiveIndex()
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
  destroyed () {
  },
  methods: {
    handleSelect (val) {
      // if (val === this.activeIndex) {
      //   return
      // }
      this.$router.replace({
        path: val,
        query: this.$route.query
      }, () => {
        this.setActiveIndex()
      }, () => {})
    },
    setActiveIndex () {
      let { path } = this.$route
      this.activeIndex = path
    }
  }
}
</script>

<style lang="scss" scoped>
#user-info-nav-header{
  width: 100%;
  height: 60px;
  background: white;
  display: flex;
  justify-content: flex-start;
  color: #666666;
  font-size: 20px;
  padding: 0 24px;
  box-sizing: border-box;
}
</style>

<style lang="scss">
#user-info-nav-header{
  .el-menu-item{
    font-size: 20px;
    margin-right: 56px;
    padding: 0;
  }
  .el-menu-item:last-of-type{
    margin-right: 0;
  }
  .el-menu--horizontal > .el-menu-item.is-active{
    border-bottom: 4px solid #1890FF !important;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none !important;
  }
}
</style>
