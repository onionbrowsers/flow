<template>
  <div class="breadcrumb">
    <div class="breadcrumb-content">
      <el-breadcrumb v-show="config.length > 0">
        <el-breadcrumb-item
          v-for="(item, index) in configFormat"
          :key="index"
          :to="item.to || ''"
        >
        <span @click="handleItemClick(item)">{{item.name}}</span>
      </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  components: {
  },
  props: {
    backFn: Function, // 自定义返回操作函数
    config: {
      type: Array,
      default: () => ([])
    },
    showBack: {
      type: Boolean,
      default: true
    },
    backUrl: {
      type: String,
      default: ''
    },
    isReplace: {
      type: Boolean,
      default: true
    }
  },
  created () {
  },
  data () {
    return {}
  },
  computed: {
    configFormat () {
      return this.config.map(item => {
        if (toString.call(item) === '[object String]') {
          return {
            to: '',
            name: item
          }
        }
        return item
      })
    }
  },
  methods: {
    handleItemClick (item) {
      this.$emit('item-click', item)
    },
    handleBack () {
      if (this.backFn) {
        return this.backFn()
      }
      if (!this.backUrl) {
        return this.$router.back()
      }
      const method = this.isReplace ? 'replace' : 'push'
      this.$router[method](this.backUrl)
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.breadcrumb {
  background-color: #fff;
  padding: 16px 0 0 24px;
}
</style>
