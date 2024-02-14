export default {
  data () {
    return {
      message: {
        test: false,
        success: (msg) => {
          this.$msgMnger.success(msg, { duration: 5000 })
        },
        error: (msg) => {
          this.$msgMnger.error(msg, { duration: 5000 })
        },
        info: (msg) => {
          this.$msgMnger.info(msg, { duration: 5000 })
        },
        warn: (msg) => {
          this.$msgMnger.warn(msg, { duration: 5000 })
        },
      },
    }
  }
}
