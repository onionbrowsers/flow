<template>
  <div class="drop-down">
    <el-dropdown trigger="click" @command="handleCommand" :class="{ 'drop-down__main-disabled': disabled }">
      <span class="el-dropdown-link">
        {{ dropDownTextComputed }}
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconxiala"></use>
        </svg>
        <!--        <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
      </span>
      <el-dropdown-menu class="drop-down__drop-down-menu" slot="dropdown">
        <el-dropdown-item
          :command="v.command"
          v-for="(v, i) in dropDownConfig"
          :key="i"
          :divided="v.hasOwnProperty('divided') && v.divided"
        >{{ v.label }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
/**
 * dropdown 组件中, 根据用户的角色进行权限管理的限制
 */
export default {
  name: 'cooperate-mng-dropdown',
  props: {
    // dropdown 配置对象
    dropDownConfig: {
      type: Array,
      default: () => [
        // command: command, label: 显示文字
        { command: '1', label: '管理者' },
        { command: '2', label: '仅编辑' },
        { command: '3', label: '仅查看' },
        { command: '0', label: '移除', divided: true }
      ]
    },
    // 权限类型
    type: {
      type: [Number, String]
    },
    // 整个 drop 的禁用状态
    disabled: {
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  computed: {
    dropDownTextComputed () {
      return this.dropDownConfig.find(item => item.command === String(this.type)).label
    }
  },
  methods: {
    handleCommand (command) {
      this.$emit('handle-command', command)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@/styles/index.scss";
  .drop-down{
    .el-dropdown-link{
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: $base-text-color !important;
      cursor: pointer;
    }
    .icon {
      width: 10px;
      height: 7px;
      margin-left: 8px;
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
  .current-dropdown {
    .el-dropdown{
      .el-dropdown-link {
        color:rgba(37,37,37,1) !important;
      }
    }
  }
  .drop-down__drop-down-menu {
    width: 130px !important;
    padding: 6px 0 !important;
    li {
      padding-left: 16px;
      width: auto !important;
    }
  }
  .drop-down__main-disabled {
    cursor: not-allowed;
    position: relative;
    &:after {
      content: '';
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 2100;
      background-color: rgba(255, 255, 255, .5);
      /*background-color: #ff3040;*/
    }
  }

</style>
