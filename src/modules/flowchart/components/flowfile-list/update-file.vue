<!--  -->
<template>
<div id="update-file">
    <edit-title-tags slot="three" ref="titleTags" type="文件" :inputRT="inputRT">
    <div slot="two" class="prompt">
      *最多可添加5个标签
    </div>
    <div slot="one" class="usefullTag">
      <span>常用标签：</span>
      <div class="tag-club">
        <el-tag
          v-for="(tag, index) in tagList"
          :key="index"
          @click="addTag(tag)"
          size="mini"
          class="tagTag"
          >
          {{tag}}
        </el-tag>
      </div>
    </div>
  </edit-title-tags>
</div>
</template>

<script>
import EditTitleTags from '@/components/public/EditTitleTags.vue'

export default {
  props: ['inputRT', 'tagList'],
  data () {
    return {
      checkedTagsV: []
    }
  },
  components: {
    EditTitleTags
  },
  mounted () {
  },
  methods: {
    addTag (item) {
      this.$emit('addTags', item)
    }
  }
}
</script>

<style lang='scss'>
#update-file{
  .prompt{
    text-align: left;
    margin-left: 70px;
  }
  .el-tag{
    line-height: 18px !important;
    margin-bottom: 5px !important;
    margin-left: 10px;
  }
}
.tag-club {
  margin-left:63px;
  position: relative;
  top: -14px;
  overflow: hidden;
  height: 72px;
}
</style>
