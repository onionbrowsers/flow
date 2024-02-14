<template>
  <div
    id="visio-tab-list"
  >
    <div class="tab-list-container">
      <div class="tab-list-left-arrow tab-list-arrow" :class="startIndex === 0 ? 'not-visible' : ''">
        <img
          @click="handleArrowClick('prev')"
          src="../../assets/flowfile/arrow_prev.png"
        >
<!--        :style="{ cursor: this.startIndex === 0 ? 'not-allowed' : 'default' }"-->
      </div>
      <div class="list-sub-container">
        <div
          class="item"
          v-for="item in sliceSuccessList"
          :key="item.name"
        >
          <div class="item-img-box">
            <img v-if="item.imgSrc" :src="item.imgSrc">
            <div v-else>
              <div>
                <i class="el-icon el-icon-loading"></i>
              </div>
              <span>加载缩略图中...</span>
            </div>
          </div>
          <div class="item-checkbox-box">
            <el-checkbox v-model="item.checked">
              {{ item.name }}
            </el-checkbox>
          </div>
        </div>
      </div>
      <div class="tab-list-right-arrow tab-list-arrow" :class="startIndex + 3 >= successListData.length ? 'not-visible' : ''">
        <img
          @click="handleArrowClick('next')"
          src="../../assets/flowfile/arrow_next.png"
        >
<!--        :style="{ cursor: startIndex + 3 >= successListData.length ? 'not-allowed' : 'default' }"-->
      </div>
    </div>
    <div class="footer">
      <div class="select-button-container">
        <el-button @click="handleSelectAll">全选</el-button>
        <el-button @click="handleSelectReverse">反选</el-button>
      </div>
      <div class="operation-button-container">
        <el-button v-if="failList.length > 0" type="primary" @click="handleViewFailList">查看错误</el-button>
        <el-button type="primary" @click="handleConfirmImport" :disabled="this.successListData.length === 0 || computedImportDisabled">导入</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'visio-tab-list',
  model: {
    prop: 'successList',
    event: 'change'
  },
  props: {
    failList: { // 错误列表, 用于判断查看错误的显示隐藏
      type: Array,
      default: () => []
    },
    successList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      successListData: [],
      startIndex: 0
    }
  },
  computed: {
    sliceSuccessList () {
      return this.successListData.slice(this.startIndex, this.startIndex + 3)
    },
    computedImportDisabled () {
      return !this.successListData.some(item => item.checked)
    }
  },
  watch: {
    successList: {
      handler (newValue) {
        this.initSuccessList(newValue)
      },
      deep: true
    }
  },
  mounted () {
    if (this.successList.length === 0) {
      this.handleViewFailList()
    }
    this.initSuccessList(this.successList)
  },
  methods: {
    initSuccessList (successList) {
      if (!successList) { // 如果传入的数据为 Boolean(xx) is false
        successList = []
      }
      let temp = JSON.parse(JSON.stringify(successList))
      this.successListData = temp.map((item, index) => {
        if (this.successListData.length === 0) {
          // 如果 空数组, 且 item 并没有 checked 字段, 添加 checked 字段, 赋给默认值 true
          if (!item.hasOwnProperty('checked')) {
            this.$set(item, 'checked', true)
          }
        } else {
          // 如果 不是空数组, 根据已经存在得 checked 字段值 修改 checked 字段
          this.$set(item, 'checked', this.successListData[index].checked)
        }
        return item
      })
    },
    handleSelectAll () {
      this.successListData.forEach(item => {
        if (item.hasOwnProperty('checked')) {
          item.checked = true
        }
      })
    },
    handleSelectReverse () {
      this.successListData.forEach(item => {
        if (item.hasOwnProperty('checked')) {
          item.checked = !item.checked
        }
      })
    },
    handleViewFailList () {
      this.$emit('change', this.successListData)
      // view error and reason
      this.$emit('view-fail-list')
    },
    handleConfirmImport () {
      this.$emit('comfirm-import', this.successListData)
    },
    handleCancel () {
      this.$emit('cancel')
    },
    handleArrowClick (flag) {
      // startIndex, this.successListData.length
      let maxLength = this.successListData.length
      let start = this.startIndex
      if (flag === 'next') {
        this.startIndex = start + 3 < maxLength ? start + 3 : start
      } else {
        // flag === 'prev'
        this.startIndex = start === 0 ? 0 : start - 3
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#visio-tab-list {
  .tab-list-container {
    height: 520px;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    .tab-list-arrow {
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        transition: all .1s;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .list-sub-container {
      flex: auto;
      display: flex;
      justify-content: space-around;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .item-img-box {
          height: 386px;
          width: 270px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 30px;
          transform: scale(1.1);
          img {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
  .footer {
    height: 64px;
    width: 100%;
    background-color: rgba(250,250,250,1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .select-button-container {
      padding-left: 30px;
    }
    .operation-button-container {
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
  .not-visible {
    visibility: hidden;
  }
}
</style>
