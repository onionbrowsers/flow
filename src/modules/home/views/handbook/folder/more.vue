<template>
  <el-dropdown @command="handleCommand" :size="size" placement="bottom-start" v-bind="$attrs">
    <el-button :disabled="!(data&&data.length)" type="text" size="default" v-if="!$slots.default" >
      <i class="el-icon-more" ></i>
    </el-button>
    <slot v-else></slot>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item, index) in data"
        :key="index"
        :command="item.value"
        :disabled="item.disabled"
      >
        {{item.label}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'More',
  mixins: [],
  components: {},
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    handleCommand (command) {
      this.$listeners.command(command)
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {},
  beforeUpdate () {
  },
  updated () {
  },
  beforeDestroy () {
  }
}
</script>
