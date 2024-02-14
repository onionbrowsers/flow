<template>
  <div class="layouts-outside-div">
    <header-bar :fixed="true"></header-bar>
    <div class="admin-content">
      <nav-menu-bar></nav-menu-bar>
      <slot/>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar'
// import NavMenuBar from '@/components/NavMenuBar'
import NavMenuBar from '@/components/nav-menu-bar'

export default {
  components: {
    NavMenuBar,
    HeaderBar
  }
}
</script>

<style lang="scss" scoped>
  .admin-content{
    min-width: 1080px;
    display: flex;
    box-sizing: border-box;
    height: 100%;
    padding-top: 60px;
  }
</style>
