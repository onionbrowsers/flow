<template>
  <div id="download-list">
    <div v-show="isNoRecords" class="no-records">暂无下载记录</div>
    <b-layout v-show="!isNoRecords" slot="last" mode="vertical" placement="bottom" space="80px" :border="false">
      <el-scrollbar slot="first" class="scroll-bar">
        <div class="list">
          <div class="item" v-for="(item, index) in records" :key="index">
            <div class="date" v-show="item.download_date">
              {{item.download_date}}
            </div>
            <div class="log-info">
              <b-layout slot="last" mode="horizontal" placement="left" space="150px" :border="false">
                <div slot="first" class="folder">
                  <svg class="iconfont-symbol" aria-hidden="true">
                    <use :xlink:href="`#iconfolder${item.color || 4}`"></use>
                  </svg>
                  <div>{{item.download_log.folder_name}}</div>
                </div>
                <el-row slot="last" class="log">
                  <el-col class="left" :span="12">
                    <div class="top">
                      <span>{{item.download_log.flow_name}}</span>
                      <el-tag class="tag" size="mini">{{tag(item)}}</el-tag>
                    </div>
                    <div class="bottom">
                      <span>{{item.download_log.create_time}}</span>
                      <span class="user">下载人：{{item.download_log.user_name}}</span>
                    </div>
                  </el-col>
                  <el-col class="right" :span="12">
                    <div>额度：{{item.download_log.use_number}}</div>
                    <div class="bottom">剩余额度：{{item.download_log.last_number}}</div>
                  </el-col>
                </el-row>
              </b-layout>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div slot="last" class="dl-paginator">
        <custom-paginator ref="paginator" @pageChange="handlePageChange"/>
      </div>
    </b-layout>
  </div>
</template>

<script>
import BLayout from '@/layouts/BinaryLayout'
import CustomPaginator from '@/components/public/CustomPaginator'
export default {
  props: {
    records: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BLayout,
    CustomPaginator
  },
  data () {
    return {
    }
  },
  computed: {
    isNoRecords () {
      return Boolean(!this.records.length)
    }
  },
  mounted () {
    this.$refs.paginator && this.$refs.paginator.updateTotal(54)
    this.$refs.paginator && this.$refs.paginator.updatePage(10, 1, [10])
  },
  methods: {
    tag () {
      return '已计费'
    },
    handlePageChange (page) {
      this.$emit('page-changed', page)
    },
    updatePageInfo (total, page, pagesize = 10, pagesizes = [10]) {
      this.$refs.paginator && this.$refs.paginator.updateTotal(total)
      this.$refs.paginator && this.$refs.paginator.updatePage(pagesize, page, pagesizes)
    }
  }
}
</script>

<style lang="scss" scoped>
#download-list{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: left;
  padding: 0 20px;
  border-left: 5px;
  border-color: lightcyan;
  .no-records{
    font-size: 24px;
    padding: 200px;
    text-align: center;
    color: #ccc;
  }
  .scroll-bar{
    height: 100%;
    .list{
      padding-right: 10px;
      .item{
        padding: 10px;
        .date{
          font-weight: bold;
        }
        .log-info{
          padding: 10px 0;
          margin-left: 100px;
          border-bottom: 1px solid lightgray;
          .folder{
            width: 120px;
            height: 56px;
            // background: #eee;
            text-align: center;
            .iconfont-symbol {
              width: 39px;
              height: 30px;
              fill: currentColor;
              overflow: hidden;
            }
            div{
              font-size: 12px;
            }
          }
          .log{
            .left{
              .top{
                .tag{
                  margin-left: 20px;
                }
              }
              .bottom{
                font-size: 14px;
                margin-top: 15px;
                .user{
                  margin-left: 20px;
                }
              }
            }
            .right{
              text-align: right;
              font-size: 14px;
              .bottom{
                margin-top: 15px;
              }
            }
          }
        }
      }
    }
  }
  .dl-paginator{
    text-align: center;
    padding: 10px;
  }
}
</style>
