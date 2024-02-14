<template>
  <div class="cooperate-mng">
    <el-scrollbar style="height: 550px;">
      <div class="cooperate-mng__subcontainer">
        <div class="coop-head">
          <div class="coop-head__title">已加入</div>
          <div
            class="coop-head__operation"
          >
            <el-switch
              v-if="flag === 'file'"
              v-model="isSameWithFolder"
              active-color="#1890FF"
              active-text="与项目一致"
              @change="handleIsSameWithFolderChange"
            >
            </el-switch>
          </div>
        </div>
        <div class="coop-info">
          <!--      此处为了使第一个权限项 hover 的时候展示 el-popover, 采用了 v-for 且 单独处理 index = 0 的情况-->
          <template
            v-for="(item, index) in roleInfoConfig"
          >
            <el-popover
              v-if="index === 0"
              :key="item.title"
              placement="bottom-start"
              popper-class="coop-info__info-popover"
              width="324"
              trigger="hover">
              <div class="coop-info__info-popover-content">{{ infoDetail['folder'] }}</div>
              <div
                slot="reference"
                style="display: flex; align-items: center; cursor:pointer;"
              >
                <i class="coop-info__icon el-icon el-icon-warning-outline"></i>
                <div
                  class="coop-info__info-item"
                >
                  <span class="info-item__title">{{ item.title }}</span>
                  <span class="info-item__info">{{ item.info }}</span>
                </div>
              </div>
            </el-popover>
            <div
              class="coop-info__info-item"
              :key="item.title"
              v-else
            >
              <span class="info-item__title">{{ item.title }}</span>
              <span class="info-item__info">{{ item.info }}</span>
            </div>
          </template>
        </div>
        <!--    ============ list in ============-->
        <div class="coop-list coop-list--in">
          <usr-item
            v-for="(item, index) in staffData.staff_infolder"
            :key="item.user_id"
            :usr-info="{ image: item.useravator, name: item.username ? item.username: item.user_id, phone: item.userphone }"
            :mask="isSameWithFolder"
          >
            <drop-down
              style="margin-right: 20px;"
              :type="item.type"
              :disabled="{ userInfo: item, context: _self } | dropdownDisabled"
              @handle-command="handleDropDownChange($event, { index: index })"
            ></drop-down>
          </usr-item>
        </div>
        <div class="coop-head">
          <div class="coop-head__title">未加入</div>
        </div>
        <!--    =============== list not in =============-->
        <div class="coop-list coop-list--not-in">
          <usr-item
            v-for="(item, index) in staffData.staff_outfolder"
            :key="item.user_id"
            :usr-info="{ image: item.useravator, name: item.username ? item.username: item.user_id, phone: item.userphone }"
            :mask="isSameWithFolder"
          >
            <el-button
              style="margin-right: 20px;"
              type="text"
              @click="handleAddToInListClick(index)"
              :disabled="false"
            >添加</el-button>
          </usr-item>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
/**
 * 1. 根据当前用户的权限, 进行权限按钮的禁用与否
 * 2. dropdown 组件中, 根据用户的角色进行权限管理的限制
 * 3. 添加成员按钮, 根据用户的角色进行权限管理的限制
 */
import UsrItem from '@/components/public/usr-item'
import DropDown from '../flowchart/cooperate-mng-dropdown'
export default {
  name: 'cooperate-mng',
  filters: {
    dropdownDisabled ({ userInfo, context }) {
      // 1. 如果协作成员为 超管 / 管理 则一定禁用
      console.log('重新计算: ', userInfo)
      if (userInfo.hasOwnProperty('role_type')) {
        return true
      } else {
        // 2. 如果为普通成员, 则
        // 2.1 如果我是超管/管理, 则对其他的都拥有操作权限
        if (context.userRole === 1 || context.userRole === 2) {
          return false
        } else {
          // 2.2 如果我不是超管, 则我至少是管理员，我对除了自己的都有权限
          return userInfo.user_id === context.$store.getters.userInfo.id
        }
        // return !(context.userRole === 1 || context.userRole === 2)
      }
    }
  },
  components: {
    UsrItem,
    DropDown
  },
  props: {
    flag: {
      type: String,
      default: 'file'
    },
    // 用户在企业中的角色 1 超管 2 管理 3 成员 -1 初始
    userRole: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      // 是否与文件夹相同 bool
      isSameWithFolder: false,
      // 信息
      roleInfoConfig: [
        { title: '管理者：', info: '协作成员管理、编辑、查看权限；' },
        { title: '仅编辑：', info: '编辑、查看权限；' },
        { title: '仅查看：', info: '查看权限；' }
      ],
      // 信息详情, 区分文件夹和文件
      infoDetail: {
        'folder': '设置后对该项目及项目内全部文件（文件单独设置权限除外）具有协作成员管理、编辑、查看全部权限。',
        'file': '设置后对该文件具有协作成员管理、编辑、查看全部权限。'
      },
      staffData: {
        staff_infolder: [],
        staff_outfolder: []
      }
      // staffData: {
      //   staff_infolder: [
      //     {
      //       user_id: 1,
      //       company_id: 1,
      //       name: '吕建平',
      //       phone: '1843374894334',
      //       image: '',
      //       type: 1
      //     }
      //   ],
      //   staff_outfolder: [
      //     {
      //       user_id: 2,
      //       company_id: 1,
      //       name: '寒王',
      //       phone: '1843374894334',
      //       image: ''
      //     }
      //   ]
      // }
    }
  },
  mounted () {
    console.log('我在啥时候触发呢')
  },
  methods: {
    /**
     * 是否与文件夹相同switch控件事件处理函数
     * @param newValue
     */
    handleIsSameWithFolderChange (newValue) {
      console.log('new value is: ', newValue)
    },
    /**
     * dropdown 组件命令选择处理函数
     * @param command 组件传出的最新命令, 当前是权限类型id
     * @param data 用户id 和 用户对象index
     */
    handleDropDownChange (command, { index }) {
      // console.log('dropdown 命令改变, 命令: ', command, ', 用户id: ', id)
      if (command === '0') {
        // 表示移除, 从 已加入 剪出, 放入 未加入
        const removeList = this.staffData.staff_infolder.splice(index, 1)
        this.staffData.staff_outfolder.unshift(...removeList)
      } else {
        this.staffData.staff_infolder[index].type = Number(command)
      }
    },
    /**
     * 添加到已加入列表按钮, 点击事件处理函数
     * @param index 未加入的用户在未加入列表中的index
     */
    handleAddToInListClick (index) {
      let addList = this.staffData.staff_outfolder.splice(index, 1)
      addList = addList.map(item => {
        this.$set(item, 'type', 3)
        return item
      })
      this.staffData.staff_infolder.push(...addList)
    },
    /**
     * 外部调用, 获取到 staff 数据
     * @returns {{staff_outfolder: [{image: string, company_id: number, user_id: number, phone: string, name: string}], staff_infolder: [{image: string, company_id: number, user_id: number, phone: string, name: string, type: number}]}}
     */
    getStaffData () {
      return this.staffData
    },
    /**
     * 设置staffData, ref
     * @param data
     */
    setStaffData (data) {
      console.log('设置 staffData: ', data)
      this.staffData = data
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.cooperate-mng {
  padding: 0 3px;
  .cooperate-mng__subcontainer {
    padding: 10px 37px;
  }
  .coop-head {
    height: 50px;
    border-bottom: 1px solid $divided-line-color;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .coop-head__title {
      font-size: 16px;
      color: $base-text-color;
      font-weight: bold;
    }
  }
  .coop-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .coop-info__icon {
      margin-right: 3px;
      color: #f8b704;
      cursor: pointer;
    }
    .coop-info__info-item {
      margin-right: 20px;
      font-size: 14px;
      .info-item__title {
        color: $base-text-color;
      }
      .info-item__info {
        color: $base-text-color-middle;
      }
    }
  }
}
</style>

<style lang="scss">
@import "@/styles/index.scss";
.coop-info__info-popover {
  background-color: $list-background-color-hover !important;
  border-color: #b8b8b8;
  .coop-info__info-popover-content {
    font-family: 'PingFangSC-light', 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: $base-text-color-middle;
  }
  .popper__arrow {
    border-bottom-color: #b8b8b8 !important;
    &:after {
      border-bottom-color: $list-background-color-hover !important;
    }
    // background-color: $list-background-color-hover !important;
  }
}
</style>
