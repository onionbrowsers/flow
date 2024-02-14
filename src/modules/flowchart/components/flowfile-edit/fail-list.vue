<template>
  <div id="import-error-reason">
    <el-scrollbar style="height: 400px;">
      <div class="info-container">
        <fail-item
          v-for="(item, index) in failList"
          :key="index"
          :fail-item="item"
        ></fail-item>
      </div>
    </el-scrollbar>
    <div class="footer">
      <el-button type="primary" @click="handleIgnore" v-show="successList.length !== 0">忽略, 下一步</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import FailItem from './fail-item'
export default {
  name: 'import-error-reason',
  components: {
    FailItem
  },
  props: {
    failList: {
      type: Array,
      default: () => []
    },
    successList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleIgnore () {
      this.$emit('ignore')
    },
    handleCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
#import-error-reason {
  .footer {
    height: 64px;
    width: 100%;
    background-color: rgba(250,250,250,1);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      margin: 0 10px;
      padding: 0 20px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      &:last-child {
        margin: 0 50px 0 10px;
      }
    }
  }
}
</style>
