<template>
  <div id="flowfile-leave-edit-dialog">
    <custom-dialog
      width="600px"
      title="提示"
      marginTop='15vh'
      :isVisible="isShow"
      :showClose="true"
      @close="closeHandle"
    >
      <leave-edit
        slot="content4"
        @save-before-leave="handleSaveBeforeLeave"/>
    </custom-dialog>
  </div>
</template>

<script>
import CustomDialog from './custom-edit-dialog'
import LeaveEdit from './leave-edit'

export default {
  components: {
    CustomDialog,
    LeaveEdit
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    handleSaveBeforeLeave (localpath) {
      this.$emit('saveBeforeLeave')
      this.isShow = false
    },
    closeHandle () {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss">
#flowfile-leave-edit-dialog{
}
</style>
