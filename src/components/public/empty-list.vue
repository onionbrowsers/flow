<template>
  <div id="empty-list">
    <i class="iconfont icon-ba-search"></i>
    <!-- <div>{{title}}</div> -->
    <img src="../../assets/nodata.svg" alt />
    <h4>{{title}}~</h4>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '未查询到报告'
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
#empty-list {
  padding-top: 10%;
  color: $tertiary-text-color;
  img {
    width: 100px;
    height: 100px;
  }
  h4 {
    color: #95b2c8;
    margin-top: 20px;
  }
  p {
    color: rgba(0, 0, 0, 0.25);
    font-size: 14px;
    margin: 20px;
  }
  i {
    font-size: 20px;
  }
  div {
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
