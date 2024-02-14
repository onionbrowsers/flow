<template>
  <div class="my-flow__flowchart-list-sublist-item"
       @contextmenu.prevent="$emit('contextmenu', $event)">
    <div class="item__thumbnail-container">
<!--      <img-->
<!--        v-if="itemDataComputed.preview"-->
<!--        class="item__thumbnail-img item__thumbnail-item"-->
<!--        :src="'/' + itemDataComputed.preview"-->
<!--        alt=""-->
<!--      >-->
      <el-image
        v-if="itemDataComputed.preview"
        class="item__thumbnail-img item__thumbnail-item"
        :src="'/' + itemDataComputed.preview"
        :preview-src-list="itemDataComputed.preview | previewSrcListFilter">
      </el-image>
      <span
        v-else
        class="item__thumbnail-text item__thumbnail-item"
      >
        {{ itemDataComputed.thumbnailText }}
      </span>
    </div>
    <div class="item__content" @click="handleFlowchartItemClick">
      <!--      === title === -->
      <div class="item__content-row-title">
        <!--        <div v-if="itemDataComputed.folderName" class="title__folder">-->
        <div class="title__folder" v-show="needToFolder">
          <span class="folder__name" @click.stop.self="toFolder">{{ itemData.folder_name }}</span>
          <i class="el-icon el-icon-arrow-right"></i>
        </div>
        <div class="title__title">{{ itemDataComputed.name }}</div>
        <!--        正在编辑中 图标-->
        <!--        <div class="title__editing-icon">-->
        <!--          <svg class="icon" aria-hidden="true">-->
        <!--            <use xlink:href="#iconbianji"></use>-->
        <!--          </svg>-->
        <!--        </div>-->
      </div>
      <!--      === info === -->
      <div class="item__content-row-info">
        <div class="item__content-row-info-left">
          <svg class="info__icon icon" aria-hidden="true">
            <use xlink:href="#iconzhanghu"></use>s
          </svg>
          <div class="info__usr-name">
            <span>{{ itemDataComputed.editor || itemDataComputed.owner_name || itemDataComputed.username }}</span>
            <span>{{{ value: itemDataComputed.last_modified, _self: _self } | formatMsgTimeFilter }}</span>
          </div>
        </div>
        <div class="item__content-row-right">
          <div class="item__timestamp">
            <span title="文件创建者">{{ itemDataComputed.username }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'flowchart-item',
  filters: {
    previewSrcListFilter (value) {
      return ['/' + value]
    },
    formatMsgTimeFilter ({ value, _self }) {
      return _self.formatMsgTime(value)
    }
  },
  props: {
    itemData: {
      type: Object,
      default: () => ({
        img: '',
        title: '我的流程图',
        usrName: '林冬冬',
        company: '中天恒会计事务所',
        timeStamp: '20分钟前'
      })
    },
    needToFolder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 格式化传过来的prop值
    itemDataComputed () {
      const tmpData = {}
      if (!this.itemData.preview) {
        this.$set(tmpData, 'thumbnailText', this.itemData.name[0])
      }
      return Object.assign({}, tmpData, this.itemData)
    }
  },
  methods: {
    /**
       * 点击打开某个文件夹
       */
    toFolder () {
      console.log('打开文件夹: ', this.itemData)
      this.$router.replace({
        name: 'my-flow',
        query: { folderId: this.itemData.folder_id, folderName: this.itemData.folder_name }
      })
    },
    /**
       * 点击某个流程图, 获取可编辑性, 传给父组件
       */
    handleFlowchartItemClick () {
      this.$router.push({
        name: 'fc-flowfile-edit',
        params: {
          flowfileId: this.itemData.id
        }
      })
    },
    /**
     *
     * @param timespan 将时间戳转换为几分钟，几小时，几天前
     * @returns {string}
     */
    formatMsgTime (timespan) {
      let dateTime = new Date(timespan) // 将传进来的时间戳转为标准时间
      let year = dateTime.getFullYear()
      let month = dateTime.getMonth() + 1
      let day = dateTime.getDate()
      let hour = dateTime.getHours()
      let minute = dateTime.getMinutes()
      // var second = dateTime.getSeconds()
      let millisecond = dateTime.getTime() // 将当前编辑的时间转换为毫秒
      let now = new Date() // 获取本机当前的时间
      let nowNew = now.getTime() // 将本机的时间转换为毫秒
      let milliseconds = 0
      let timeSpanStr
      milliseconds = nowNew - millisecond
      if (milliseconds <= 1000 * 60) { // 小于一分钟展示为刚刚
        timeSpanStr = '刚刚'
      } else if (1000 * 60 < milliseconds && milliseconds <= 1000 * 60 * 60) { // 大于一分钟小于一小时展示为分钟
        timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
      } else if (1000 * 60 * 60 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) { // 大于一小时小于一天展示为小时
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
      } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) { // 大于一天小于十五天展示位天
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前'
      } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
        timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute
      } else {
        timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
      }
      return timeSpanStr
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/index.scss";

  @at-root .my-flow__flowchart-list-sublist-item {
    height: 66px;
    padding: 12px 16px 0 8px;
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    &:hover,
    &:active {
      background-color: $list-background-color-hover;
    }

    .item__thumbnail-container {
      flex: none;

      .item__thumbnail-item {
        display: inline-block;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-top: 7px;
      }

      .item__thumbnail-img {
      }

      .item__thumbnail-text {
        font-size: 20px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background-color: #B87ED5;
      }
    }

    .item__content {
      flex: auto;
      text-align: left;
      padding-left: 7px;

      .item__content-row-title {
        display: flex;
        color: $base-text-color;
        font-size: 18px;
        margin-bottom: 8px;

        .title__folder {
          /*text-decoration: underline;*/
          &:hover {
            color: $primary-color;
          }
        }
      }

      .item__content-row-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: $base-text-color-lighter;
        font-size: 14px;
        .item__content-row-info-left {
          display: flex;
          align-items: center;
        }

        .info__icon {
          /*height: 13px;*/
          /*width: 11px;*/
          margin-right: 3px;
        }

        .info__usr-name {
          span:first-of-type {
            margin-right: 13px;
          }
        }
      }
    }

    .item__timestamp {
      flex: none;
      height: 100%;
      font-size: 14px;
      display: flex;
      justify-content: flex-start;
      color: $base-text-color-lighter;

      span:first-of-type {
        margin-right: 16px;
      }
    }
  }
</style>

<style lang="scss">
.item__thumbnail-img {
  .el-image-viewer__close {
    top: 80px;
  }
}
</style>
