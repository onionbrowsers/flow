<template>
  <div class="table-list">
    <div class="header" v-if="title" >
      <div class="title">{{title}}</div>
      <div class="aisde">
        <slot name="header"></slot>
      </div>
    </div>
    <div class="content">
      <slot></slot>
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
.table-list{
  background-color: #fff;
  padding: 0 16px;
  .header{
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .title{
      font-weight: bold;
      color:#262626;
      font-size: 16px;
      flex: 1;
    }
    .aside{
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
