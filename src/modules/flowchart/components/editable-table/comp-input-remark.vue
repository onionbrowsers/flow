<template>
  <span
    class="cell-input-remark"
    :class="dynamicClassName"
    @blur="handleEditComplete(prop, rowIndex, $event)"
    @keydown.enter="handleEnter($event)"
    @focus="handleFocus(prop, $event)"
    @paste="handlePaste"
    :contenteditable="computedContentEditable"
    v-html="computedInputValue"
  >
<!--        @keydown.enter="handleEnter($event)"-->
  </span>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'cell-input',
  props: {
    prop: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => {}
    },
    placeholderData: {
      type: Object,
      default: () => {}
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    autoNumber: {
      type: Array,
      default: () => ['no']
    }
  },
  data () {
    return {
      dynamicClassName: '',
      rowData: {}
    }
  },
  computed: {
    computedContentEditable () {
      // if (this.prop === 'no') {
      //   return false
      // } else {
      //   return true
      // }
      return !this.$store.getters.disabledGetter ? 'true' : 'false'
    },
    computedInputValue () {
      if (this.rowData[this.prop]) {
        let temp = this.rowData[this.prop].replace(/↵↵/g, '<br>')
        return temp
      } else {
        return this.placeholderData[this.prop]
      }
      // return this.rowData[this.prop] ? this.rowData[this.prop] : this.placeholderData[this.prop]
    }
  },
  watch: {
    row: {
      handler () {
        this.updateDataAndClass()
      },
      deep: true
    }
  },
  mounted () {
    this.updateDataAndClass()
  },
  methods: {
    updateDataAndClass () {
      this.rowData = _.cloneDeep(this.row)
      this.dynamicClassName = this.rowData[this.prop] ? 'show-cell' : 'show-cell-placeholder'
    },
    // handleEnter (e) {
    //   e.target.blur()
    // },
    handleEditComplete (prop, rowIndex, $event) {
      let remarkEle = $event.target
      // console.dir(remarkEle)
      // let tempArr = []
      // remarkEle.childNodes.forEach(item => {
      //   if (item.nodeType === 3) {
      //     tempArr.push(item.textContent)
      //   } else if (item.nodeType === 1) {
      //     if (item.nodeName === 'BR') {
      //     } else {
      //       tempArr.push(item.innerText.replace(/[\n\r]/g, ''))
      //     }
      //   }
      // })
      // tempArr = tempArr.filter(item => item.trim())
      // this.rowData[prop] = tempArr.join('<br>')
      this.rowData[prop] = remarkEle.innerHTML
      this.$store.commit('HANDLE_EDIT', { rowIndex: rowIndex, prop: prop, value: this.rowData[prop].trim() })
      if (!this.rowData[prop]) {
        this.dynamicClassName = 'show-cell-placeholder'
        $event.target.innerText = this.placeholderData[prop]
      }
    },
    handleFocus (prop, $event) {
      if (!this.rowData[prop]) {
        this.dynamicClassName = 'show-cell'
        $event.target.innerText = ''
      }
    },
    handleEnter (e) {
      // let selection = window.getSelection()
      // let range = selection.getRangeAt(0)
      // this.$nextTick(t => {
      //   let lineFeedNode = document.createElement('br')
      //   // let lineFeedNode = document.createTextNode('---')
      //   range.insertNode(lineFeedNode)
      //   range.setStartAfter(lineFeedNode)
      //   range.collapse(true)
      // })
    },
    /**
     * @description: paste event handler
     * @param {type} obj
     * @return: undefined
     */
    handlePaste (e) {
      // console.log('paste event is: ', e)
      // from mdn https://developer.mozilla.org/zh-CN/docs/Web/Events/paste
      const text = e.clipboardData.getData('text')
      // console.log('text is: ', text)
      const selection = window.getSelection()
      if (!selection.rangeCount) return
      selection.deleteFromDocument()
      selection.getRangeAt(0).insertNode(document.createTextNode(text))
      e.preventDefault()
    }
  }
}
</script>

<style lang="scss">
.cell-input-remark {
  display: inline-block;
  width: 100%;
  min-height: 69px;
  vertical-align: middle;
  /*white-space: nowrap;*/
  /*text-overflow: ellipsis;*/
  /*overflow: hidden;*/
  // line-height: 18px;
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: #333;
  outline: none;
  text-align: left;
}
.show-cell-placeholder {
  color: #999;
}
</style>
