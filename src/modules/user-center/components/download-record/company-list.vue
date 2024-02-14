<template>
  <div id="company-list">
    <b-layout mode="vertical" placement="top" space="90px" :border="false">
      <div slot="first">
        <div class="title">企业名单</div>
        <el-input
          v-model="inputValue"
          placeholder="搜索购买单位/企业名称"
          size="mini"
          clearable
          @change="confirmEvent()"
          @clear="clearEvent()"
        ></el-input>
      </div>
      <div slot="last" class="bottom-list">
        <el-scrollbar class="scroll-bar">
          <div class="pinyin-list">
            <el-tag
              size="mini"
              v-for="(item, index) in pinyinList"
              :key="index"
              @click="handleClick(item)"
              :class="{'selected-tag': selectedTag === item}"
            >{{item}}</el-tag>
          </div>
          <div
            v-for="(item, index) in companyList"
            :key="index"
            @click="handleSelect(item)"
            class="company"
            :class="{'selected-company': item.company_id === selectedCompany}"
            >{{item.company_name}}</div>
        </el-scrollbar>
      </div>
    </b-layout>
  </div>
</template>

<script>
import BLayout from '@/layouts/BinaryLayout'

export default {
  components: {
    BLayout
  },
  data () {
    return {
      inputValue: '',
      selectedTag: '',
      pinyinList: [],
      selectedCompany: -1,
      companyList: []
    }
  },
  mounted () {
    this.getCompanyPinyi()
  },
  methods: {
    getCompanyPinyi () {
      this.$api.companyPinyin().then(res => {
        this.pinyinList = res.data
        this.pinyinList.length && this.handleClick(this.pinyinList[0])
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    getCompanyList (params) {
      this.$api.companySearch(params).then(res => {
        this.companyList = res.data
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    handleClick (tag) {
      this.selectedTag = tag
      this.getCompanyList({ pinyin: tag })
    },
    confirmEvent () {
      this.inputValue && this.getCompanyList({ k: this.inputValue })
    },
    clearEvent () {
      // this.companyList = []
    },
    handleSelect (company) {
      this.selectedCompany = company.company_id
      this.$emit('select', company)
    }
  }
}
</script>

<style scoped lang="scss">
#company-list{
  width: 100%;
  height: 100%;
  padding: 10px 5px;
  box-sizing: border-box;
  text-align: left;
  border-right: 1px solid #eee;
  .title{
    font-weight: bold;
    margin: 15px 0;
  }
  .pinyin-list{
    margin: 10px 0;
    .el-tag{
      margin-right: 5px;
      cursor: pointer;
    }
    .selected-tag{
      background-color: #1890FF;
      color: #fff;
    }
  }
  .company{
    padding: 5px;
    cursor: pointer;
    border-radius: 2px;
    font-size: 13px;
    &.selected-company{
      background: #eee;
    }
  }
  .bottom-list{
    height: 100%;
    padding-bottom: 10px;
    box-sizing: border-box;
    .scroll-bar{
      height: 100%;
    }
  }
}
</style>
