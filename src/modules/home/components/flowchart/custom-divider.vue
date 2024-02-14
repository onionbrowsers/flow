<template>
  <div class="custom-divider">
    <div class="custom-divider__label" @click="handleLabelClick">
      <i class="el-icon el-icon-arrow-up custom-divider__label-icon--normal" :class="{ 'custom-divider__label-icon--reverse': expansion }"></i>
      <span>{{ label }}</span>
    </div>
    <div class="custom-divider__line"></div>
  </div>
</template>

<script>
export default {
  name: 'custom-divider',
  props: {
    // 文字
    label: { type: String }
  },
  data () {
    return {
      // 展开状态, 默认展开
      expansion: true
    }
  },
  methods: {
    /**
     * 点击label, 切换展开状态
     */
    handleLabelClick () {
      this.expansion = !this.expansion
      this.$emit('expansion-change', this.expansion)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-divider {
  display: flex;
  align-items: center;
  @at-root {
    .custom-divider__label {
      flex: none;
      font-size: 12px;
      padding-right: 10px;
      cursor: pointer;
      color: #92A3B3;
      user-select: none;
      .custom-divider__label-icon--normal {
        transform-origin: center center;
        transition: all .3s;
        margin-right: 6px;
      }
    }
    .custom-divider__line {
      flex: auto;
      height: 0;
      border-top: 1px solid #E8E8E8;
    }
  }
  .custom-divider__label-icon--reverse {
    transform: rotate(180deg);
  }
}
</style>
