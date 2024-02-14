<template>
  <div class="cell-demo">
    <el-radio @change="handleIsDashedChange()" v-model="isDashed" :label="true" :disabled="$store.getters.disabledGetter">是</el-radio>
    <el-radio @change="handleIsDashedChange" v-model="isDashed" :label="false" :disabled="$store.getters.disabledGetter">否</el-radio>
  </div>
</template>

<script>
export default {
  name: 'cell-radio',
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
      isDashed: false
    }
  },
  watch: {
    row: {
      handler () {
        this.isDashed = this.row[this.prop[0]]
      },
      deep: true
    }
  },
  computed: {
  },
  created () {
    this.isDashed = this.row[this.prop[0]]
  },
  methods: {
    handleIsDashedChange () {
      console.log('is dashed: ', this.isDashed)
      this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: this.prop[0], value: this.isDashed })
    }
  }
}
</script>

<style lang="scss">
.cell-demo {
  .el-radio {
    margin-right: 15px;
  }
}
</style>
