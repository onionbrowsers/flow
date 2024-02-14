<template>
  <Breadcrumb class="bread-panel" :config="folderStack" v-show="folderStack.length > 1" @item-click='handleItemClick'/>
</template>

<script>
// import Popup from './popup'
import { cloneDeep } from 'lodash'
import Breadcrumb from '@/components/public/Breadcrumb.vue'
import { mapGetters } from 'vuex'

const DEFAULT_BREAD = {
  name: '我的项目',
  type: 'home',
  to: { path: '' }
}
export default {
  components: {
    Breadcrumb,
  },
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      folderStack: []
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceGetter'])
  },
  mounted () {
  },
  methods: {
    setDefault (options) {
      this.folderStack = cloneDeep(options)
    },

    handleItemClick (item) {
      const { id, name, type } = item
      let index = 0
      this.folderStack.forEach((item, i) => {
        if (item.id === id) {
          index = i
        }
      })
      
      this.folderStack.splice(index, this.folderStack.length - index)
      if (type !== 'home') {
        this.setFolder({ name, id })
      }
      this.$emit('item-click', item, this.folderStack)
    },
    setFolder (item) {
      const { name, id } = item
      if (!this.folderStack.length) {
        this.folderStack.push(DEFAULT_BREAD)
      }
      this.folderStack.push({
        name,
        id,
        to: { path: '' }
      })
      
      this.$emit('folder-change', this.folderStack)
    }
  }
}
</script>

<style lang="scss" scoped>
.bread-panel{
  padding: 0 0 16px 0;
}
</style>
