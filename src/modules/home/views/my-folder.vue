<template>
  <div id="my-folder">
    <div>
      <el-select v-if="isZhlicom" class="flodselect" clearable  filterable @change="departChangeId" v-model="secondary_id" placeholder="请选择所属企业">
          <el-option v-for="it in secondaryList" :key="it.id" :label="it.departname" :value="it.id"></el-option>
      </el-select>
    </div>
    <folder-list ref="folderList" :folderList="folderList" @create-folder-complete="getUserFolder(currentDataSpaceIdGetter)"></folder-list>
  </div>
</template>

<script>
import folderList from '../components/folder-list'
import { mapGetters } from 'vuex'
import Bus from '@/utils/event-bus'
export default {
  name: 'my-folder',
  components: {
    folderList
  },
  data () {
    return {
      secondaryList: [], // 企业列表
      secondary_id: '', // 二级企业id
      isZhlicom: false, // 是否是显示所属企业的
      folderList: []
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter']),
    isOrgType () {
      return this.currentDataSpaceGetter.c_type === 1
    },
  },
  watch: {
    currentDataSpaceIdGetter (newValue, oldValue) {
      this.isZhlicom = this.currentDataSpaceIdGetter == 131
      if (this.isZhlicom) {
        this.getsecondaryS()
      }
      this.folderList = []
      this.$refs.folderList.reset()
      this.getUserFolder(newValue)
    }
  },
  mounted () {
    try {
      const list = JSON.parse(this.$route.query.navList) || []
      if (list.length) {
        this.$refs.folderList.setDefault(list)
      }
    } catch (e) {}

    // current data space id 不是 -1, 表示非初始状态
    if (this.currentDataSpaceIdGetter !== -1) {
      this.getUserFolder(this.currentDataSpaceIdGetter)
    }
    this.isZhlicom = this.currentDataSpaceIdGetter == 131
    if (this.isZhlicom) {
      this.getsecondaryS()
    }
    // 建平刷新列表的事件, 刷新文件夹列表
    Bus.$on('refresh-folder-list', () => this.getUserFolder(this.currentDataSpaceIdGetter))
  },
  beforeDestroy () {
    Bus.$off('refresh-folder-list')
  },
  methods: {
    // 获取企业列表
    getsecondaryS () {
      this.$api.getSecondaryLi(this.currentDataSpaceIdGetter).then(res => {
        this.secondaryList = res.data || []
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    // 选择所属企业变化
    departChangeId (val) {
      this.getUserFolder(this.currentDataSpaceIdGetter)
    },
    getOrgUserFolder () {
      this.$api.getOrgUserFolder({
        companyId: this.currentDataSpaceIdGetter
      }).then(res => {
        this.folderList = res.data
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    },
    getUserFolder () {
      if (this.isOrgType) {
        this.getOrgUserFolder()
        return
      }
      this.getNormalUserFolder(this.currentDataSpaceIdGetter)
    },
    /**
     * 获取用户的folder
     * @param id 数据空间 id
     */
    getNormalUserFolder (id) {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getUserFolder({ companyId: id, secondary_id: this.secondary_id || '' }).then(res => {
        this.folderList = res.data
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#my-folder{
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  background: white;
  overflow-y: auto;
}
.flodselect{
    margin-bottom:10px;
    min-width:210px;
}
</style>
