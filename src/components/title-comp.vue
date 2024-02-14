<template>
  <div id="title-comp">
    {{txt}}
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'title-comp',
  components: {

  },
  filters: {

  },
  props: {
    txt: {
      type: String
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
#title-comp{
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  background: white;
  text-align: left;
  color: #252525;
  font-weight: 600;
  padding: 0 24px;
  box-sizing: border-box;
}
</style>
