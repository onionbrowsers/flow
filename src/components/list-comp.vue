<template>
  <div class="member">
    <div class="head-portrait">
      <div class="img">
        <img :src="memberItem.image ? memberItem.image : require('@/modules/company/assets/man-head-portrait.png')" alt="">
      </div>
      <div class="txt">
        <span class="name">{{memberItem.username || '--'}}</span>
        <div class="phone">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icondianhuahaoma"></use>
          </svg>
          <!-- <span>{{memberItem.phone ||'--'}}</span> -->
          <span>{{memberItem.phone? memberItem.phone.substr(0,3)+'****'+memberItem.phone.substring(memberItem.phone.length-4):'--' }}</span>
        </div>
      </div>
    </div>
    <div class="menu">
      <slot name="drop-down" :dropdown-config="{ config: dropDownConfig, userType, context: _self } | dropdownConfigFilter"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-comp',
  components: {

  },
  filters: {
    dropdownConfigFilter ({ config, userType, context }) {
      // console.log(config.filter((item, index) => index < 2))
      // 1. memberItem === 当前用户id， 展示 item.type >= userType
      const currentId = context.$store.getters.userInfo.id
      var res = null
      if (currentId === context.memberItem.id) {
        res = config.filter(item => item.type === userType)
        return res
      } else {
        // 2. 否则 展示 item.type > userType
        res = config.filter(item => {
          if (item.type === 0) {
            return userType <= 2
          } else {
            return item.type === 1 ? item.type >= userType : item.type > userType
          }
        })
        return res
      }
    }
  },
  props: {
    memberItem: {
      type: Object
    },
    // 当前登录到系统的用户的权限
    userType: {
      type: Number
    }
  },
  data () {
    return {
      dropDownConfig: [
        {
          command: 1,
          label: '超级管理员',
          type: 1
        },
        {
          command: 2,
          label: '管理员',
          type: 2
        },
        {
          command: 3,
          label: '企业用户',
          type: 3
        },
        {
          command: -1,
          label: '从企业移除',
          type: 0
        }
      ]
    }
  },
  computed: {
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
    // handleCommand (command) {
    //   console.log(command)
    //   this.$emit('handleCommand', command)
    // }
  }
}
</script>

<style lang="scss" scoped>
.member{
  width: calc(100% - 23px);
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  align-items: center;
  height: 96px;
  .head-portrait{
    display: flex;
    align-items: flex-end;
    .img{
      width:64px;
      height:64px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .txt{
      display: flex;
      flex-direction: column;
      margin-left: 12px;
      .name{
        font-size: 18px;
        color: #252525;
      }
      .phone{
        .icon{
          margin-right: 4px;
        }
        span{
          font-size: 14px;
          color: #666666;
          margin-top: 8px;
        }
      }
    }
    .member:last-of-type{
      margin-bottom: 0;
    }
  }
  .menu{
  }
}
.current-selected{
  background:rgba(245,245,245,1);
  /*.el-dropdown{*/
  /*  .icon{*/
  /*    fill: #666666;*/
  /*  }*/
  /*  .el-dropdown-link {*/
  /*    color:rgba(37,37,37,1) !important;*/
  /*  }*/
  /*}*/
}
.member {
  &:hover {
    background:rgba(245,245,245,1);
    /*.el-dropdown {*/
    /*  .icon{*/
    /*    fill: #666666;*/
    /*  }*/
    /*  .el-dropdown-link {*/
    /*    color:rgba(37,37,37,1) !important;*/
    /*  }*/
    /*}*/
  }
}
</style>

<style lang="scss">
.el-dropdown-menu__item:hover {
  background-color: #1890FF !important;
  color: #ffffff !important;
}
.el-dropdown-menu__item--divided{
  color: #FF1A2E;
  margin-top: 0;
  line-height: 36px;
}
.el-dropdown-menu__item--divided::before{
  height: 0;
}
</style>
