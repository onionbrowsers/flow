<template>
  <div class="cell-demo">
    {{ row[calcProp] === undefined ? prop.map(item => row[item]).join(', ') : row[calcProp] }}
  </div>
</template>

<script>
export default {
  name: 'cell-demo',
  props: {
    prop: {
      type: [Array, String],
      default: ''
    },
    row: {
      type: Object,
      default: () => {}
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    colIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
    }
  },
  computed: {
    calcProp () {
      return Object.prototype.toString.call(this.prop) === '[object Array]' ? this.prop.join('/') : this.prop
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
