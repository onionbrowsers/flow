<template>
  <div class="toolbar-wrapper">
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="aside">
      <slot name="aside"></slot>
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
    create () {
      this.$emit('create')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
.toolbar-wrapper{
  border-top: 1px solid #eaeaea;
  display: flex;
  background-color: #fff;
  padding: 16px 16px 0 16px;
  align-items: baseline;
  .content{
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: wrap;
  }
  .aside{
    margin-left: 24px;
  }
}
</style>
