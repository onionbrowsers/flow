<template>
    <div v-loading="loadingPdf" class="pdfdiv">
            <iframe :src="pdfUrl" style="width:100%; height:100%" frameborder="0" scrolling="auto"></iframe>
    </div>
</template>

<script>
export default {
  data () {
    return {
      pdfUrl: '',
      loadingPdf: false, // pdf转换耗时，独立loading
      cachedData: new Map(),
      isqueryType: ''
    }
  },
  mounted () {
    this.getPDF()
  },
  methods: {
    // 获取pdf
    getPDF () {
      this.isqueryType = this.$route.query.type || ''
      // let params ={
      //     control_system:this.$route.params.sysinfo,
      //     company_id:this.$route.params.comId,
      // }
      this.loadingPdf = true
      if (this.isqueryType) {
        let params = {
          manual_name: this.$route.params.sysinfo,
          company_id: this.$route.params.comId
        }
        this.$api.getctrlneiCtrlName(params).then(res => {
          this.loadingPdf = false
          if (res.code == 0) {
            this.pdfUrl = res.data
            // this.pdfUrl = 'http://172.16.20.54:8022/api/v2'+res.data
          }
        }, err => { this.loadingPdf = false })
      } else {
        let params = {
          control_system: this.$route.params.sysinfo,
          company_id: this.$route.params.comId
        }
        this.$api.getctrlSystemName(params).then(res => {
          this.loadingPdf = false
          if (res.code == 0) {
            this.pdfUrl = res.data
            // this.pdfUrl = 'http://172.16.20.54:8022/api/v2'+res.data
          }
        }, err => { this.loadingPdf = false })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pdfdiv{
    height: 100%;
}
</style>
