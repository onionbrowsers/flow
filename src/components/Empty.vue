<template>
  <div class="no-data">
    暂无数据
  </div>
</template>

<script>
export default {
  name: 'empty',
  props: [],
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.no-data {
  margin-top: 60px;
  font-size: 14px;
  color: $base-text-color-lighter;
  text-align: center;
}
</style>
