<template>
  <div class="org-page">
    <el-menu
      @select="handleSelect"
      background-color="#fff"
      text-color="#303133"
      active-text-color="#409eff"
      class="left-menu"
      mode="vertical"
      :default-active="onRoutes">
      <el-menu-item v-for="v in navItem" :key="v.routerPath" :index="v.routerPath">{{v.name}}</el-menu-item>
    </el-menu>
    <div class="org-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'company',
  components: {
    
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      navItem: [
        {
          name: '组织管理',
          routerPath: '/company/org/org-manage',
          type: '组织',
        },
        {
          name: '组织架构图',
          routerPath: '/company/org/org-chart'
        },
        {
          name: '员工管理',
          routerPath: '/company/org/staff-manage',
          type: '员工'
        },
        {
          name: '岗位管理',
          routerPath: '/company/org/job-manage',
          type: '岗位'
        }
      ]
    }
  },
  computed: {
    onRoutes () {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeSubMenu) {
        return meta.activeSubMenu
      }
      return path
    }
  },
  watch: {

  },
  created () {

  },
  mounted () {
  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    handleSelect (val) {
      const item = this.navItem.find(nav => nav.routerPath === val) || {}
      this.$router.replace({
        path: val,
        query: {
          type: item.type
        }
      }, () => {
      }, () => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.org-page{
  margin-top: 16px;
  width: 100%;
  height: 100%;
  background: #F0F3F7;
  padding: 0;
  box-sizing: border-box;
  .left-menu{
    width: 130px;
    background-color: #fff;
  }
  .org-content{
    flex: 1;
    width:0;
    overflow: auto;
    background-color: #fff;
  }
  @at-root .company-nav-header {
    display: flex;
    justify-content: space-around;
    @at-root .company-nav-header__item {
      background-color: pink;
      &:hover {
        background-color: skyblue;
      }
    }
    .company-nav-header__item--current {
      background-color: #ff3040;
      color: #fff;
    }
  }
}
</style>

<style lang="scss">
.org-page{
  display: flex;
  text-align: left !important;
  .el-input{
    width:260px;
  }
  .el-input__inner{
    border-radius:4px;
    line-height: 40px;
    height: 40px;
    border:1px solid rgba(217,217,217,1);
    color: #252525;
  }
  .el-input__inner::placeholder{
    color:#999999;
    font-size: 14px;
  }
  .form{
    background: white;
    padding: 23px 24px;
    box-sizing: border-box;
    border-top: 1px solid #E8E8E8;
  }
  .el-form-item.is-success .el-input__inner{
    border-color: #d9d9d9;
  }
}
</style>
