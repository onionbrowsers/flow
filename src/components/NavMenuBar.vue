<template>
  <div id="nav-bar">
    <el-menu :default-active="activeIndex" :collapse="true" @select="handleSelect">
      <el-menu-item index="0">
        <i class="iconfont iconwodeliuchengtu"></i>
        <span slot="title">流程文件管理</span>
      </el-menu-item>
      <el-menu-item index="1">
        <i class="iconfont iconmobanguanli"></i>
        <span slot="title">流程模板管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      navToRoutes: ['/fc/flowfile', '/fc/template'],
      routeNames: ['fc-flowfile-list', 'fc-template-list']
    }
  },
  created () {
    let _pathname = window.location.pathname
    if (_pathname.indexOf('/fc/flowfile') > -1) {
      this.activeIndex = '0'
    } else if (_pathname.indexOf('/fc/template') > -1) {
      this.activeIndex = '1'
    }
  },
  watch: {
    '$route': {
      handler (val) {
        let index = this.routeNames.indexOf(val.name)
        if (index > -1) {
          this.activeIndex = `${index}`
        }
      },
      deep: true
    }
  },
  methods: {
    handleSelect (val) {
      // console.log(val, '```')
      if (val === this.activeIndex) {
        return
      }
      this.$router.push(this.navToRoutes[Number(val)])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/index.scss';
#nav-bar{
  height: 100%;
  background: $primary-bg-color-nav;
  float: left;
  .iconfont{
    font-size: 20px !important;
  }
}
</style>
<style lang="scss">
@import '../styles/index.scss';
#nav-bar{
  .el-menu{
    border: none !important;
    outline: none !important;
    .el-menu-item{
      &:hover{
        background: $primary-bg-color !important;
      }
    }
  }
}
</style>
