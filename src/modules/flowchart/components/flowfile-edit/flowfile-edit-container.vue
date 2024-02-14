<template>
  <div id="flowfile-edit-page">
    <iframe
      class="iframe-src"
      ref="iframe"
      :name="iframeName"
      :src="embed"
      frameborder="0"
      scrolling="auto">
    </iframe>
  </div>
</template>

<script>
import $ from 'jquery'
import { drawioUrl } from '@/utils/urls'
import myEvent from '@/utils/event-handler'
import { mapGetters } from 'vuex'
export default {
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'iframeName': {
      type: String,
      default: 'iframe'
    }
  },
  data () {
    return {
      iframeWin: {},
      embed: drawioUrl
      // iframe: document.getElementsByClassName('iframe-src')[0].offsetLeft
    }
  },
  computed: {
    ...mapGetters({
      penetrate: 'penetrate'
    })
  },
  watch: {
    penetrate () {
      if (this.penetrate) {
        $('.iframe-src').css('pointer-events', 'auto')
      } else {
        $('.iframe-src').css('pointer-events', 'none')
      }
    }
  },
  mounted () {
    window.addEventListener('message', this.handleMessage)
    this.iframeWin = this.$refs.iframe.contentWindow
    if (document.getElementsByClassName('iframe-src')[0]) {
      var oLeft = document.getElementsByClassName('iframe-src')[0].offsetLeft
      this.$store.commit('getIframe', oLeft)
    }
    var that = this
    this.iframeWin.addEventListener('click', e => {
      console.log(e.target) // 不跨越的话就可以操作内部的dom啥的
    })
    // 监听窗口大小变化
    window.onresize = function () {
      if (document.getElementsByClassName('iframe-src')[0]) {
        var oLeft = document.getElementsByClassName('iframe-src')[0].offsetLeft
        that.$store.commit('getIframe', oLeft)
      }
    }
  },
  methods: {
    sendMessage ({ cmd, params }) {
      // 外部vue向iframe内部传数据
      let _params = params
      _params.iframeName = this.iframeName
      console.log('传can', cmd, params)
      this.iframeWin.postMessage({
        from: 'vue',
        to: 'drawio',
        cmd: cmd,
        params: _params
      }, '*')
    },
    handleMessage (event) {
      // 根据上面制定的结构来解析iframe内部发回来的数据
      let msg = event.data
      if (msg.to !== 'vue' || msg.from !== 'drawio') {
        return
      }
      if (this.iframeName !== msg.params.iframeName) {
        return
      }
      console.log('huoqu', msg)
      switch (msg.cmd) {
        case 'test':
          console.log('#msg from drawio', msg)
          this.sendTestXml()
          break
        case 'export':
          this.$emit('fileData', msg.params)
          break
        case 'download':
          break
        case 'sendXml':
          this.$emit('receiveXml', msg.params) // 导出 xml，用于训练模板
          break
        case 'updateDrawioState':
          this.$emit('drawioState', msg.params)
          break
        case 'updateDrawioEdited':
          this.$emit('editedState', msg.params)
          break
        case 'newpageReady':
          this.$emit('newpageReady', msg.params)
          break
        case 'selectPage':
          this.$emit('selectPage', msg.params)
          myEvent.fire({ event: 'page-selected', payload: msg.params })
          break
        case 'importDone':
          this.$emit('importDone', msg.params)
          break
        case 'currentPageMxCells':
          // console.log('ifroamhahshsahsahsasa',msg.params)
          this.$emit('currentPageMxCells', msg.params)
          break
        case 'changeLoadingStatus':
          this.$emit('changeLoadingStatus', msg.params)
          break
        case 'refresh-last-active-time-stamp': // 刷新最后活动时间时间戳, 用于 ws
          this.$emit('refresh-last-active-time-stamp', msg.params)
          break
        case 'tab-renamed': // 用户操作 drawIO 而改变了 tab 名字
          this.$emit('tab-renamed-by-draw-i-o', msg.params)
          break
        case 'updateStyle':
          this.$emit('updateStyle', msg.params)
          break
        default:
          break
      }
    },
    sendTableBool (tableBool) {
      this.sendMessage({
        cmd: 'tableBool',
        params: { tableBool }
      })
    },
    sendTableWidth (tableWidth) {
      this.sendMessage({
        cmd: 'tableWidth',
        params: { tableWidth }
      })
    },
    downloadFileData (file) {
      this.sendMessage({
        cmd: 'download',
        params: this.getParams(file)
      })
    },
    exportFileData (file) { // 导出数据，保存到服务器, 通过 currentPage 判断是否只导出当前页
      this.sendMessage({
        cmd: 'export',
        params: Object.assign({}, { saveType: file.saveType, currentPage: file.currentPage }, this.getParams(file))
      })
    },
    exportPngWithXml (file) {
      this.sendMessage({
        cmd: 'exportPngWithXml',
        params: Object.assign({}, { saveType: file.saveType, currentPage: file.currentPage, xml: file.xml }, this.getParams(file))
      })
    },
    importFileData (file, position) {
      let _params = this.getParams(file)
      if (position) {
        _params.position = position
      }
      this.sendMessage({
        cmd: 'import',
        params: _params
      })
    },
    newPage () {
      this.sendMessage({
        cmd: 'newpage',
        params: {}
      })
    },
    delMxCell (e) {
      this.sendMessage({
        cmd: 'delMxCell',
        params: {
          mxCell: e
        }
      })
    },
    getParams (file) {
      return {
        format: file.format,
        filename: file.filename,
        data: file.data,
        sheetName: file.sheetName
      }
    },
    /**
     * 1. ref
     * 2. 发送获取图片的命令 -> drawIO
     */
    refGetAllImageUrls ({ scale, tabIndexes }) {
      this.sendMessage({
        cmd: 'getAllImages',
        params: {
          format: 'png',
          scale: scale,
          tabIndexes: tabIndexes
        }
      })
    },
    // /**
    //  * 设置流程图可编辑性
    //  */
    // setDiagramDisabled () {
    //   this.sendMessage({
    //     cmd: 'setDiagramDisabled',
    //     params: {
    //       disabled: this.$store.getters.disabledGetter
    //     }
    //   })
    // }
    /**
     * 编辑状态改变时, 通知 drawIO
     * @param status
     */
    editingStatusChanged ({ status }) {
      this.sendMessage({
        cmd: 'editor.editingStatusChanged',
        params: { status }
      })
    },
    /**
     * 通知 drawIO 修改当前页名
     * @param name
     */
    renameCurrentPage ({ name }) {
      this.sendMessage({
        cmd: 'rename-current-page',
        params: { name }
      })
    },
    /**
     * 利用 promise 和 自定义事件 将 drawIO 操作封装为异步 api
     * @param tabId
     * @param flag
     * @returns {Promise<unknown>}
     */
    selectPage ({ tabId, flag = '' }) {
      this.sendMessage({
        cmd: 'select-page',
        params: {
          tabId,
          flag // 唯一标识符
        }
      })
      return new Promise((resolve, reject) => {
        myEvent.addHandler({
          event: 'page-selected',
          handler: (payload) => {
            myEvent.removeHandler({ event: 'page-selected' })
            resolve(payload)
          }
        })
      })
    },
    toShowView () {
      this.sendMessage({
        cmd: 'editor.toShowView',
        params: {
          flag: '视图模式'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
#flowfile-edit-page{
  height: 100%;
  background: white;
  .iframe-src{
    border: 1px solid #dadce0;
    width: 100%;
    height: 100%;
    /*pointer-events: none;*/
  }
}
</style>
