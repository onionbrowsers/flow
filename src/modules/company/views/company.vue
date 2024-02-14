<template>
  <div id="company">
    <top-navigation :navItem="navItem"></top-navigation>
    <div class="company-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import topNavigation from '@/components/top-navigation'
import { mapGetters } from 'vuex'
export default {
  name: 'company',
  components: {
    topNavigation
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      navItem: [
        {
          name: '企业组织信息',
          routerPath: '/company/company-info'
        },
        {
          name: '成员管理',
          routerPath: '/company/member-mng',
          showFunc (type) {
            return !type || type == 2
          }
        },
        {
          name: '组织架构',
          routerPath: '/company/org',
          showFunc (type) {
            return type == 1
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      companyDataSpaceGetter: 'companyDataSpaceGetter',
      currentDataSpaceIdGetter: 'currentDataSpaceIdGetter'
    })
  },
  watch: {
    companyDataSpaceGetter (val) {
      if (val.length) {
        this.changeNavItem(val)
      }
    }
  },
  created () {
    this.changeNavItem()
  },
  mounted () {

  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    changeNavItem (val = this.companyDataSpaceGetter) {
      if (!val.length) return
      const company = val.find(item => item.id == (this.$route.query.id || this.currentDataSpaceIdGetter))
      console.log(company)
      if (!company) {
        return
      }
      this.navItem = this.navItem.filter(item => {
        if (item.showFunc) {
          return item.showFunc(company.c_type)
        }
        return true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#company{
  width: 100%;
  height: 100%;
  background: #F0F3F7;
  padding:  0 16px 16px 16px;
  box-sizing: border-box;
  .company-content{
    height: calc(100% - 60px);
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
#company{
  text-align: left !important;

}
</style>
