<template>
  <div class="fail-item">
    <div class="fail-item-header">
      {{ failItem.name }}
    </div>
    <div class="fail-item-content">
      <div
        class="warn-item"
        v-for="item in failItem.warn"
        :key="item"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fail-item.vue',
  props: {
    failItem: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.fail-item {
  text-align: left;
  .fail-item-header {
    height: 50px;
    line-height: 50px;
    padding: 0 30px;
    border-bottom: 2px solid #E8E8E8;
  }
  .fail-item-content {
    padding: 5px 30px;
    .warn-item {
      margin: 5px 0;
      padding: 15px 30px;
      border: 1px solid #E8E8E8;
    }
  }
}
</style>
