<template>
  <div id="quota-mng">
    <quota-mng-admin v-if="quotaManager"></quota-mng-admin>
    <quota-mng-normal v-else></quota-mng-normal>
  </div>
</template>

<script>
import quotaMngNormal from '../components/quota-mng/quota-mng-normal'
import quotaMngAdmin from '../components/quota-mng/quota-mng-admin'
import { mapGetters } from 'vuex'
export default {
  components: {
    quotaMngNormal,
    quotaMngAdmin
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    quotaManager () {
      return this.userInfo.user_role === 'QuotaManager'
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
#quota-mng{
  padding: 0 10px 10px 10px;
}
</style>

<style lang="scss">
</style>
