<template>
  <div>
    <el-switch
      v-model="value"
      active-color="#13ce66"
      inactive-color="#ff4949">
    </el-switch>
  </div>
</template>

<script>
export default {
  name: 'c',
  data () {
    return {
      value: true
    }
  }
}
</script>

<style scoped>

</style>
