<template>
  <el-dialog
    id="cutomDialog"
    :title="title"
    :visible.sync="isVisible"
    :width="width"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :style="{marginTop: marginTop}"
    custom-class="file-edit-dialog"
  >
    <i class="el-icon-close edit-dialog-close" v-show="showClose" @click="closeHandle"></i>
    <slot name="content1"></slot>
    <slot name="content2"></slot>
    <slot name="content3"></slot>
    <slot name="content4"></slot>
    <slot name="content5"></slot>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    isVisible: Boolean,
    width: String,
    CloseOnClickModal: Boolean,
    showClose: Boolean,
    marginTop: String
  },
  mounted () {
    // console.log('ffffffffff', this.width)
  },
  methods: {
    closeHandle () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='scss'>
@import '@/styles/index.scss';
  .file-edit-dialog{
    border-radius: 6px;
    .el-dialog__header{
      text-align: left;
      .el-dialog__title{
        color: #fff !important;
      }
    }

    .edit-dialog-close{
      font-size: 20px;
      position: absolute;
      right: 10px;
      top: 20px;
      cursor: pointer;
    }
  }
</style>
