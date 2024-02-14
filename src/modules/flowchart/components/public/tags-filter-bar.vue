<template>
  <div id="tags-filter-bar">
    <div class="top-block">
      <span class="tag-bar-title">标签搜索：</span>
      <el-autocomplete
        class="tag-search"
        size="mini"
        style="width:220px"
        v-model="searchInput"
        placeholder="请输入标签"
        clearable
        @select="handleSearchSelect"
        @clear="clearInput"
        ref="searchInput"
        :debounce="300"
        :select-when-unmatched="true"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        type="text"
        :maxlength="10"
        :show-word-limit="true"
      ></el-autocomplete>
      <el-button size="mini" type="text" @click="expend()" class="showMore">
        {{this.tagsExpend ? '收起' : '展开'}}
        <i class="iconfont"  :class="getIcon()"></i>
      </el-button>
    </div>
    <el-scrollbar
      class="tags-block"
    >
      <custom-c-b
      class="tags-bar"
      :class="{'expanded': tagsExpend}"
      ref="tagsBar"
      :tagList="tagList"
      @checkedChange="handleSelectTags"/>
    </el-scrollbar>
  </div>
</template>

<script>
import CustomCB from '@/components/public/CustomCB.vue'
export default {
  props: ['tagList'],
  components: {
    CustomCB
  },
  data () {
    return {
      searchInput: '',
      tagsExpend: false
    }
  },
  methods: {
    expend (val) {
      this.tagsExpend = !this.tagsExpend
      this.$emit('tagsExpend', this.tagsExpend)
    },
    getIcon () {
      return this.tagsExpend ? 'iconxiala' : 'iconjiantou'
    },
    querySearch (queryString, cb) {
      if (queryString.trim().length === 0) {
        cb(null)
      }
      let res = this.tagList
      let list = []
      if (!res.includes(queryString)) {
        // eslint-disable-next-line
        cb([{ id: 0, value: '未搜索到任何结果' }])
        return
      }
      res.forEach((el, id) => {
        if (el.indexOf(queryString) > -1) {
          list.push({
            id: id,
            value: el
          })
        }
      })
      cb(list)
    },
    handleSearchSelect (item) {
      if (!this.tagList.includes(item.value)) {
        this.$msgMnger.warn('未搜索到任何结果')
        return
      }
      console.log('item', item)
      this.searchInput = ''
      let tmpCheckedTags = JSON.parse(JSON.stringify(this.$refs.tagsBar.checkedTagsV))

      if (!tmpCheckedTags.includes(item.value)) {
        tmpCheckedTags.push(item.value)
      }

      this.$refs.tagsBar.updateChecked(this.tagList, tmpCheckedTags)
      this.$emit('tagsChecked', tmpCheckedTags)
    },
    clearInput () {
      this.searchInput = ''
    },
    handleSelectTags (tags) {
      this.$emit('tagsChecked', tags)
    },
    updateChecked (checkedTags) {
      this.$refs.tagsBar.updateChecked(this.tagList, checkedTags)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
#tags-filter-bar{
  height: 120px;
  margin: 10px 0;
  box-sizing: border-box;
  .top-block{
    height: 30px;
    line-height: 30px;
    margin: 5px 0;
    .tag-bar-title{
      font-size: 14px;
      font-weight: bold;
    }
    .tag-search{
      margin-right: 30px;
    }
  }
  .tags-block{
    height: 100%;
    .tags-bar{
      padding: 10px 0;
      height: 20px;
      &.expanded{
        height: auto;
      }
    }
  }
}
</style>

<style lang="scss">
  .top-block{
    .el-autocomplete-suggestion__list li:last-child{
      padding-bottom: 20px;
    }
    li:last-child{
      padding-bottom: 20px !important;
    }
  }
</style>
