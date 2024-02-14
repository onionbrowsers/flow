<template>
  <div
    id="header-bar"
    :class="{fixed: fixed}"
    v-loading.fullscreen="$store.getters.loadingGetter"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <div class="logo" @click="toHome()">
      <!-- <span class="title">智能流程</span> -->
    </div>
<!--    暂时隐藏操作使用手册-->
<!--    <span @click="toInstruction" class="manual"><i class="iconfont iconshuoming" style="margin-right:5px"></i>操作使用手册</span>-->
    <el-popover
      placement="bottom"
      popper-class="header-bar__el-popover"
      @show="showHandle"
      @after-leave="hideHandle"
      trigger="click"
      v-if="isShowDataSpace"
    >
      <drop-down v-if="isShowDropDown" @hide-popover="handleControlPopoverVisible"></drop-down>
      <div
        class="center-btn"
        ref="centerBtn"
        slot="reference"
      >
        <span>{{ dataSpaceNameGetter }}</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconzhankai"></use>
        </svg>
      </div>
    </el-popover>

<!--    <button @click="$router.push({ name: 'fc' })">去原始 list</button>-->
    <div class="profile">
<!--      <el-button type="text" v-if="isAuthenticated" @click="clickEvent()">退出登录</el-button>-->
<!--      <span class="name" @click="$router.push({ name: 'usr-info' })">{{accountTitle}}</span>-->
<!--      准备做 header-bar 右侧的优化, 让用户的入口更加明显 -->
      <div class="profile__dropdown" style="float: right;">
        <el-popover
          placement="bottom-end"
          popper-class="header-bar__profile-el-popover"
          trigger="hover"
        >
          <div class="profile__btn-container">
            <div
              class="profile__btn-item"
              :class="item.className"
              v-for="item in profileBtnConfigsComputed"
              :key="item.value"
              @click="handleProfileBtnClick(item.value)"
            >
              {{ item.label }}
            </div>
          </div>
          <div
            class="profile_drop-down-handler"
            ref="profileHandler"
            slot="reference"
          >
            <img :src="userInfo.image" alt="" class="img">
            <span class="username" :class="{ has_received: receivedList.length}" style="margin-right: 5px;">{{accountTitle}}</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconzhankai"></use>
            </svg>
          </div>
        </el-popover>
      </div>
    </div>
<!--    <div class="dropdown" v-if="isShowDropDown"-->
<!--    >-->
<!--      <drop-down></drop-down>-->
<!--    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from '@/utils/event-bus.js'
import dropDown from '@/modules/home/components/flowchart/drop-down'
export default {
  name: 'header-bar',
  props: ['fixed'],
  components: {
    dropDown
  },
  data () {
    return {
      isShowDropDown: false,
      // popover visibility
      isPopoverVisible: false,
      profileBtnConfigs: [
        { label: '额度管理', value: 'quota-mng', className: 'normal' },
        { label: '下载记录', value: 'download-record', className: 'normal' },
        { label: '个人资料', value: 'usr-info', className: 'normal' },
        { label: '管理当前企业', value: 'company-info', className: 'normal' },
        { label: '退出登录', value: 'logout', className: 'logout' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'isAuthenticated',
      userInfo: 'userInfo',
      currentDataSpaceGetter: 'currentDataSpaceGetter',
      allDataSpaceGetter: 'allDataSpaceGetter',
      receivedList: 'receivedList'
    }),
    accountTitle () {
      // return this.isAuthenticated ? '注销' : '未登录'
      return this.isAuthenticated ? this.userInfo.nickname || this.userInfo.username || this.getLocalname() : '未登录'
    },
    dataSpaceNameGetter () {
      // if (this.$route.path.includes('/company/')) {
      //   let handleDataSpace = this.allDataSpaceGetter.find(item => item.id === Number(this.$route.query.id))
      //   return handleDataSpace ? handleDataSpace.type === 2 ? '个人空间' : handleDataSpace.name ? handleDataSpace.name : '' : '程序内部出错'
      // } else {
      return Object.prototype.toString.call(this.$store.getters.currentDataSpaceGetter.name) === '[object Null]'
        ? '个人空间' : (
          this.$store.getters.currentDataSpaceGetter.name ? this.$store.getters.currentDataSpaceGetter.name : ''
        )
      // }
    },
    profileBtnConfigsComputed () {
      const routePattern = /usr-info/
      // return this.currentDataSpaceGetter.type === 2 ? this.profileBtnConfigs.filter(item => item.value !== 'company-mng') : this.profileBtnConfigs
      if (this.currentDataSpaceGetter.type === 2) {
        return this.profileBtnConfigs.filter(item => item.value !== 'company-mng')
      } else if (routePattern.test(this.$route.path)) {
        return this.profileBtnConfigs.filter(item => item.value !== 'company-mng')
      } else {
        return this.profileBtnConfigs
      }
    },
    isShowDataSpace () {
      return !this.$route.path.includes('user-center')
    }
  },
  mounted () {
    // this.getUserCompany()
  },
  methods: {
    getLocalname () {
      let userInfo = JSON.parse(localStorage.getItem('user-info'))
      return userInfo.username
    },
    toHome () {
      if (['report-edit', 'template-edit'].indexOf(this.$route.name) > -1) {
        bus.$emit('to-home')
        return
      }
      this.$router.push('/')
    },
    toInstruction () {
      window.open('/fc/filestyle/excel')
    },
    logout () {
      this.$confirm('注销后将跳转到授权登录页面？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确 认',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        if (this.isAuthenticated) {
          this.$store.dispatch('AUTH_LOGOUT').then(() => {
            this.$router.push('/login')
          })
        }
      }).catch(action => {
      })
    },
    showHandle () {
      this.isShowDropDown = true
    },
    hideHandle () {
      this.isShowDropDown = false
    },
    /**
     * 控制 popover 的显隐
     * 主动触发 centerBtn 的点击事件
     */
    handleControlPopoverVisible () {
      this.$refs.centerBtn.click()
    },
    /**
     * 点击 资料按钮 处理事件
     * @param value
     */
    handleProfileBtnClick (value) {
      if (value === 'logout') {
        this.logout()
        return
      }
      let routerObj = {
        name: value
      }
      if (value === 'company-info') {
        const company = this.allDataSpaceGetter.find(item => item.id === localStorage.getItem('currentDataSpaceId')) || this.allDataSpaceGetter[0] || {}
        const id = this.$store.getters.currentDataSpaceIdGetter || company.id
        if (!id) {
          this.$message.error('获取企业失败，请刷新重试')
          return
        }
        routerObj.query = { id }
      }
      this.$router.push(routerObj)
      // switch (value) {
      //   case 'profile':
      //     this.$router.push({ name: 'usr-info' })
      //     break
      //   case 'company-mng':
      //     this.$router.push({ name: 'company-info', query: { id: this.$store.getters.currentDataSpaceIdGetter } })
      //     break
      //   case 'logout':
      //     this.logout()
      // }
    }
  },
  watch: {
    '$route': {
      handler () {
        if (this.$route.path.includes('/company/')) {
          let handleDataSpace = this.allDataSpaceGetter.find(item => item.id === Number(this.$route.query.id))
          if (!handleDataSpace) return
          this.$store.commit('SET_CURRENT_DATA_SPACE_MUTATION', handleDataSpace.id)
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
#header-bar{
  height: $header-bar-height;
  background: #00152A;
  color: #fff;
  user-select: none;
  &.fixed{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
  }
  .profile_drop-down-handler{
    .img{
      width: 24px;
      height: 24px;
      border-radius: 50%;
      vertical-align: middle;
    }
    span{
      vertical-align: middle;
      margin-left: 8px;
    }
  }
  .logo{
    display: inline-block;
    width: 200px;
    height: 100%;
    float: left;
    cursor: pointer;
    padding-left: 60px;
    background: url('../assets/logo.svg') 20px center no-repeat #03091A;
  }
  .manual{
    color: #1890FF;
    font-size: 14px;
    float:left;
    margin-left:32px;
    line-height: 60px;
    cursor: pointer;
  }
  .profile{
    width: 400px;
    height: 100%;
    line-height: $header-bar-height;
    padding: 0 30px;
    float: right;
    font-size: 14px;
    .name{
      float: right;
      margin-right: 20px;
      font-size: 14px;
    }
    .el-button{
      float: right;
      height: 100%;
    }
    span{
      cursor: pointer;
    }
    .has_received:after{
      display: inline-block;
      content: '';
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: $primary-dangerous-color;
      position: relative;
      left: 5px;
      top: -5px
    }
    .icon{
      margin-left: 8px;
    }
  }
  .center-btn{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    svg{
      margin-left: 10px;
    }
  }
  .dropdown{
    position: absolute;
    left: 50%;
    top: 60px;
    transform: translateX(-50%);
    box-shadow:4px 6px 16px 0px rgba(0,21,41,0.14);
    border:1px solid rgba(0,21,41,1);
    border-top: none;
    text-align: left;
    z-index: 20030;
  }
}
</style>
<style lang="scss">
  @import "@/styles/index.scss";
  .el-select-dropdown__item{
    padding: 0 20px !important
  }
  .el-select-dropdown__list{
    padding-bottom: 20px;
  }
  .header-bar__el-popover {
    padding: 12px 0;
  }
  .profile__btn-container {
    font-size: 14px;
    color: $base-text-color;
    .profile__btn-item {
      min-width: 90px;
      height: 30px;
      line-height: 30px;
      padding: 0 6px;
      cursor: pointer;
      &:hover {
        color: #fff;
        background-color: $primary-color;
      }
      &.logout {
        border-top: 1px solid $divided-line-color;
        color: $primary-dangerous-color;
        &:hover {
          color: #fff;
        }
      }
    }
  }
  .header-bar__profile-el-popover {
    min-width: auto !important;
    padding: 6px 0;
    transform: translateY(-20px);
  }
</style>
