<template>
  <div class="search-item">
    <span class="title">{{title}}</span>
    <div class="aside">
      <slot ></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
.search-item{
  display: flex;
  align-items: center;
  margin-right: 24px;
  margin-bottom: 16px;
  &:last-child{
    margin-right:0;
  }
  .title{
    margin-right: 16px;
    font-size: 14px;
    color: #606266
  }
}
</style>
