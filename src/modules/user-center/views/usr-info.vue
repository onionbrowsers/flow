<template>
  <div id="usr-info">
    <top-navigation :navItem="navItem" class="nav-item"></top-navigation>
    <div class="usr-info-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import topNavigation from '@/components/top-navigation'
export default {
  name: 'usr-info',
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
          name: '我的邀请/我的企业和组织',
          routerPath: '/user-center/usr-info/my-company'
        },
        {
          name: '个人资料',
          routerPath: '/user-center/usr-info/my-info'
        },
        {
          name: '修改密码',
          routerPath: '/user-center/usr-info/pwd-reset'
        },
        {
          name: '修改手机号',
          routerPath: '/user-center/usr-info/phone-reset'
        }
      ]
    }
  },
  computed: {

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

  }
}
</script>

<style lang="scss" scoped>
#usr-info{
  width: 100%;
  height: 100%;
  background: #F0F3F7;
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
  .usr-info-content{
    height: calc(100% - 76px);
  }
  .nav-item{
    margin-bottom: 16px;
  }
}
</style>

<style lang="scss">
#usr-info{
  text-align: left !important;
  .el-input{
    width:368px;
    height:40px;
    float: left;
  }
  .el-input__inner{
    background:rgba(247,247,247,1);
    border-radius:4px;
    color: #252525;
    border:1px solid rgba(217,217,217,1);
  }
  .el-input__inner::placeholder{
    color:#999999;
    font-size: 14px;
  }
}
</style>
