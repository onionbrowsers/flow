<!--  -->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :top="top"
    :width="width"
    :showClose="true"
    :modal="true"
    :lock-scroll="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
    :custom-class="getCustomClass()"
    :destroy-on-close="!!destroyOnClose"
    @closed="$emit('closed')"
    >
      <slot name="one"></slot>
      <slot name="two"></slot>
      <slot name="three"></slot>
      <slot name="four"></slot>
      <slot name="five"></slot>
    <span slot="footer" class="dialog-footer" v-if="flag">
      <el-button size="mini" v-if="btn0" type="primary" @click="clickBtn0()">{{btn0.title}}</el-button>
      <el-button size="mini" v-if="btn1" @click="clickBtn1()">{{btn1.title}}</el-button>
      <el-button size="mini" v-if="btn2" type="primary" @click="clickBtn2()">{{btn2.title}}</el-button>
      <el-button size="mini" v-if="btn3" type="danger" @click="clickBtn3()">{{btn3.title}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['title', 'top', 'width', 'btn1', 'btn2', 'btn3', 'btn0', 'customClass', 'destroyOnClose'],
  data () {
    return {
      dialogVisible: false,
      data: null,
      flag: true
    }
  },
  mounted () {
    // console
  },
  methods: {
    getCustomClass () {
      return this.customClass || 'dialog-style'
    },
    updateVisible (visible, data) {
      this.dialogVisible = visible
      this.data = data
      return this
    },
    closeDialog () {
      this.dialogVisible = false
      this.$emit('beforeClose')
    },
    clickBtn0 () {
      this.$emit('clickBtn0', this.data)
    },
    clickBtn1 () {
      this.$emit('clickBtn1', this.data)
      this.dialogVisible = false
    },
    clickBtn2 () {
      this.$emit('clickBtn2', this.data)
      // this.dialogVisible = false
    },
    clickBtn3 () {
      this.$emit('clickBtn3', this.data)
      this.dialogVisible = false
    },
    removeFooter () {
      this.flag = false
      return this
    },
    useFooter () {
      this.flag = true
      return this
    }
  }
}
</script>
