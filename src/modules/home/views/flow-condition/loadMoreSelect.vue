<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        append-to-body
        custom-class="node-dialog"
    >
        <div class="select-wrapper" ref="rootLoad">
            <ul class="select-content">
                <li
                    :key="item.id"
                    v-for="item in options"
                    @click="clickItem(item)"
                    class="select-item"
                >
                    {{ item.name }}
                </li>
            </ul>
            <span class="load-more" ref="loadMore"></span>
        </div>
    </el-dialog>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: '请选择'
    }
  },
  watch: {
    visible (val) {
      if (val === true) {
        this.$nextTick(() => {
          this.observer = new IntersectionObserver(entries => {
            const { isIntersecting } = entries[0]
            if (isIntersecting) {
              this.$emit('load-more')
            }
          }, {
            root: this.$refs.rootLoad
          })
          this.observer.observe(this.$refs.loadMore)
        })
      } else {
        this.observer && this.observer.disconnect()
      }
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    toggleSelect () {
      this.visible = !this.visible
    },
    clickItem (item) {
      this.$emit('click-item', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.node-dialog {
    width: 800px;
    padding: 24px;
    .select-wrapper {
        width: 100%;
        max-height: 500px;
        overflow-y: auto;
    }
    
    .select-item {
        font-size: 14px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;

        &:hover {
            background-color: #f5f7fa
        }
    }

    .load-more {
        display: block;
        width: 100%;
        height: 10px;
        background-color: transparent;
    }
}
</style>
