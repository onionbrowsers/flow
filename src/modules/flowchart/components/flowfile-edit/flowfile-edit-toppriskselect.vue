<template>
    <div class="edittablejz">
        <div>
            <el-select @change="riskSelect" class="riskselect"  v-model="curentli[0]['firstRisk']" placeholder="请选择一级风险类型">
                <el-option v-for="it in firstriskli" :key="it.id" :label="it.risk_name" :value="it.id"></el-option>
            </el-select>
            <div>|</div>
            <el-select  class="riskselect" @change="riskSecond" v-model="curentli[0]['twoRisk']" placeholder="请选择二级风险类型">
                <el-option v-for="it in sencondLi" :key="it.id" :label="it.risk_name" :value="it.id"></el-option>
            </el-select>
            <div>|</div>
            <el-select  class="riskselect" @change="riskthree" v-model="curentli[0]['threeRisk']" placeholder="请选择三级风险类型">
                <el-option v-for="it in threeriskLi" :key="it.id" :label="it.risk_name" :value="it.id"></el-option>
            </el-select>
            <div>|</div>
            <el-select  class="riskselect" v-model="curentli[0]['fourRisk']" placeholder="请选择四级风险类型">
                <el-option v-for="it in fourriskLi" :key="it.id" :label="it.risk_name" :value="it.id"></el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['curentli'],
  data () {
    return {
      firstriskli: [{ risk_name: '战略风险', id: 1 }, { risk_name: '运营风险', id: 2 },
        { risk_name: '财务风险', id: 3 }, { risk_name: '法律风险', id: 4 }, { risk_name: '市场风险', id: 5 }],
      sencondLi: [], // 二级风险列表
      threeriskLi: [], // 三级风险
      fourriskLi: []// 四级风险
    }
  },
  watch: {
    curentli () {
      // this.getJzInfo()
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter'])
  },
  mounted () {
    this.getJzInfo()
  },
  methods: {
    // 选择一级风险
    riskSelect (val) {
      this.curentli[0].twoRisk = ''
      this.curentli[0].threeRisk = ''
      this.curentli[0].fourRisk = ''
      this.sencondLi = []
      this.threeriskLi = []
      this.fourriskLi = []
      this.getTwoLevel(val, 1)
    },
    // 选择二级风险
    riskSecond (val) {
      this.curentli[0].threeRisk = ''
      this.curentli[0].fourRisk = ''
      this.threeriskLi = []
      this.fourriskLi = []
      this.getTwoLevel(val, 2)
    },
    // 选择三级级风险
    riskthree (val) {
      this.curentli[0].fourRisk = ''
      this.fourriskLi = []
      this.getTwoLevel(val, 3)
    },
    // 获取风险级列表
    getTwoLevel (val, index) {
      this.$emit('closeMode', this.curentli[0])
      if (index == 1) {
        this.$api.getformLevelriskinfo(val, { company_id: this.currentDataSpaceIdGetter }).then(res => {
          if (res.code == 0) {
            this.sencondLi = res.data || []
          }
        })
      }
      if (index == 2) {
        this.$api.getformLevelriskinfo(val, { company_id: this.currentDataSpaceIdGetter }).then(res => {
          if (res.code == 0) {
            this.threeriskLi = res.data || []
          }
        })
      }
      if (index == 3) {
        this.$api.getformLevelriskinfo(val, { company_id: this.currentDataSpaceIdGetter }).then(res => {
          if (res.code == 0) {
            this.fourriskLi = res.data || []
          }
        })
      }
    },
    // 获取矩阵信息
    getJzInfo () {
      if (this.curentli[0] && this.curentli[0].firstRisk) {
        this.getTwoLevel(this.curentli[0].firstRisk, 1)
      }
      if (this.curentli[0] && this.curentli[0].twoRisk) {
        this.getTwoLevel(this.curentli[0].twoRisk, 2)
      }
      if (this.curentli[0] && this.curentli[0].threeRisk) {
        this.getTwoLevel(this.curentli[0].threeRisk, 3)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.riskselect{
    padding:5px 0 ;
    // width:calc(100% - 20px)
}
</style>
