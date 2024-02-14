<template>
  <span class="template-train-status" :class="statusObj[status].className">
    <i class="iconfont" :class="statusObj[status].icon"></i>
    <span>{{statusObj[status].text}}</span>
  </span>
</template>

<script>
export default {
  props: {
    status: {
      default: 0
    }
  },
  data () {
    return {
      statusObj: {
        0: { icon: 'iconweixunlianchenggong', text: '未训练过', className: '' },
        1: { icon: 'iconxunlianmoxing rotate-anime', text: '训练中', className: 'train-success' },
        2: { icon: 'iconchenggong', text: '训练成功', className: 'train-success' },
        3: { icon: 'iconshibai', text: '训练失败', className: 'train-failed' }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
.template-train-status{
  color: $--color-info;
  .iconfont{
    margin-right: 3px;
  }
  &.train-failed{
    color: $--color-danger;
  }
  &.train-success{
    color: $--color-success;
  }
  i, span{
    float: left;
  }
  i{
    font-size: 20px !important;
    font-weight: 100 !important;
  }
  .rotate-anime{
    -webkit-animation: spin 1s linear 1s 5 alternate;
    animation: spin 1s linear infinite;
  }
  @-webkit-keyframes spin {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
