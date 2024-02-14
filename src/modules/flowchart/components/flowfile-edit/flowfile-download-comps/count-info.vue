<template>
  <div id="count-info">
    <span class="left">当前额度：</span>
    <span class="right">{{total}}</span>
    <span class="left second">本次下载消耗额度：</span>
    <span class="right">-{{consume}}</span>
  </div>
</template>

<script>
export default {
  props: ['total', 'consume'],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
#count-info{
  margin: 15px 0;
  .left{
    &.second{
      margin-left: 30px;
    }
  }
  .right{
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
