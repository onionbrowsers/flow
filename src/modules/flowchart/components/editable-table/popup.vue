<template>
  <div
    id="popup"
    :style="{ left: left + 'px', top: top + 'px' }"
    @contextmenu.prevent="oncontextmenuHandle"
  >
    <div class="context-menu">
      <ul class="context-menu-container">
<!--        <li @click="handleClick('pick-row')" class="select-row-button">选中行/点击编号</li>-->
        <li @click="handleClick('cancel')" class="cancel context-menu-item">取消</li>
        <li :class="{ 'btn-disabled': !canDoOperate }" @click="handleClick('copy-row')" class="row-copy context-menu-item">
          <span>复制行</span>
          <span>Ctrl+c</span>
        </li>
        <li :class="{ 'btn-disabled': !canDoOperate, 'cant-edit': $store.getters.disabledGetter }" @click="handleClick('paste-row')" class="row-paste context-menu-item">
          <span>粘贴行</span>
          <span>Ctrl+v</span>
        </li>
        <li :class="{ 'btn-disabled': !canDoOperate, 'cant-edit': $store.getters.disabledGetter }" @click="handleClick('del-row')" class="row-del context-menu-item">
          <span>删除行</span>
          <span>Del</span>
        </li>
        <li :class="{ 'btn-disabled': !canDoOperate, 'cant-edit': $store.getters.disabledGetter }" @click="handleClick('add-row-prev')" class="row-insert-above context-menu-item">
          <span>在上方插入行</span>
<!--          <span>上插</span>-->
          <span>Alt+w</span>
        </li>
        <li :class="{ 'btn-disabled': !canDoOperate, 'cant-edit': $store.getters.disabledGetter }" @click="handleClick('add-row-next')" class="row-insert-below context-menu-item">
          <span>在下方插入行</span>
<!--          <span>下插</span>-->
          <span>Alt+s</span>
        </li>
<!--        TODO: 添加 从此行开始自动编号 -->
        <li :class="{ 'btn-disabled': !canDoOperate, 'cant-edit': $store.getters.disabledGetter }" @click="handleClick('auto-number-r-click')" class="row-insert-below context-menu-item">
          <span>从此行开始自动编号</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    left: Number,
    top: Number,
    canDoOperate: Boolean,
    canPaste: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    oncontextmenuHandle () {
      return false
    },
    handleClick (flag) {
      if (flag !== 'copy-row' && flag !== 'cancel') {
        if (this.$store.getters.disabledGetter) {
          return false
        }
      }
      switch (flag) {
        case 'copy-row':
          if (this.canDoOperate) {
            this.$emit('add-copied-row')
          }
          break
        case 'del-row':
          if (this.canDoOperate) {
            this.$emit('deleteRow')
          }
          break
        case 'add-row-prev':
          this.$emit('addRow', 'before')
          break
        case 'add-row-next':
          this.$emit('addRow', 'after')
          break
        case 'cancel':
          this.$emit('cancel')
          break
        case 'paste-row':
          if (this.canDoOperate && this.canPaste) {
            this.$emit('pasteRow')
          }
          break
        // TODO: 处理 自动编号
        case 'auto-number-r-click':
          this.$emit('auto-number-r-click')
          break
        default:
          this.$msgMnger.info('该功能暂未开放, 敬请期待!')
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
#popup{
  position: fixed;
  width: 220px;
  z-index: 9999;
  .context-menu {
    .context-menu-container {
      list-style: none;
      padding: 0;
      margin: 0;
      background-color: #fff;
      text-align: left;
      font-size: 12px;
      color: #51667b;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 1px 3px 5px rgba(225, 238, 255, 1);
      .context-menu-item {
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        cursor: context-menu;
        &:hover {
          background-color: #E1EEFF;
          /*background-color: #F3F8FF;*/
        }
      }
      .cancel,
      .row-del{
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #EDEDF0;
      }
      .row-del {
        border-top: 1px solid #EDEDF0;
      }
      .row-copy,
      .row-paste,
      .row-insert-above,
      .row-insert-below {
        height: 25px;
        line-height: 25px;
      }
    }
  }
  .btn-disabled {
    cursor: not-allowed!important;
    &:hover {
      background-color: #efefef!important;
    }
  }
  .cant-edit {
    cursor: not-allowed !important;
    &:hover {
      background-color: #efefef !important;
    }
  }
}
</style>
