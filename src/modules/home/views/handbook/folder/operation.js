
const TARGET_NODE_TYPE = {
  before: 1,
  after: 2,
  inner: 2
}

export default {
  editAction (data, node) {
    this.$emit('edit', {
      data, node
    })
  },

  createNode () {
    this.addAction({ data: { id: '0' } })
  },

  addAction (data, node) {
    this.$emit('add', {
      data, 
      node
    })
  },

  deleteAction (data, node) {
    this.$msgbox({
      title: '提示',
      message: this.deleteTipContent,
      type: 'warning',
      showCancelButton: true,
      beforeClose: (action, instance, done) => {
        if (action !== 'confirm') {
          return done()
        }
        instance.confirmButtonLoading = true
        this.$emit('delete', {
          data,
          node,
          callback: () => {
            instance.confirmButtonLoading = false
            done()
          }
        })
      }
    })
  },

  copyAction (data) {
    this.$refs.copyDialog.show(({ nodeId, nodeType, isCopyChildNode }) => {
      this.$emit('copy', {
        params: {
          sourceNodeId: data.id,
          targetNodeId: nodeId,
          targetNodeType: nodeType,
          isCopyChildNode
        },
        callback: () => {
          this.$refs.copyDialog.hide()
        }
      })
    }, data.id, this.treeData)
  },

  shouldDrop (depth) {
    if (!this.depth) return true

    if (depth > this.depth) {
      this.$message.warning(`目录层级最大为${this.depth}级`)
      this.getTreeData()
      return false
    }
    return true
  },

  getTargetByOuterActions (dropNode, targetLevel, currentDepth, dropType) {
    // 目标节点所在的层级+源节点children的层级
    if (!this.shouldDrop(targetLevel + currentDepth)) {
      return
    }
    return {
      targetNodeId: dropNode.data.id,
      targetNodeType: TARGET_NODE_TYPE[dropType],
      targetParentNodeId: dropNode.data.pid
    }
  },

  getTargetByInnerActions (dropNode, targetLevel, currentDepth, dropType) {
    // 目标节点所在的层级+源节点children的层级+1
    if (!this.shouldDrop(targetLevel + currentDepth + 1)) {
      return
    }
    let targetNodeType = null; let targetNodeId = null
    const targetParentNodeId = dropNode.data.id
    const target = this.treeData.getNodeById(targetParentNodeId)
    if (target && target.children && target.children.length) {
      const len = target.children.length
      const last = target.children[len - 1]
      targetNodeType = TARGET_NODE_TYPE[dropType]
      targetNodeId = last.id
    }
    return {
      targetNodeType,
      targetNodeId,
      targetParentNodeId
    }
  },

  handleDrop (draggingNode, dropNode, dropType) {
    const sourceNodeId = draggingNode.data.id
    // 目标节点所在的层级
    const { targetLevel } = this.treeData.getTreeLevel(this.treeData.tree, dropNode.data.id)
    // 源节点children的层级
    const source = this.treeData.getNodeById(sourceNodeId)
    const { max } = this.treeData.getTreeLevel(source.children || [])

    const dropActions = {
      before: this.getTargetByOuterActions,
      after: this.getTargetByOuterActions,
      inner: this.getTargetByInnerActions
    }
    if (!(dropType in dropActions)) return

    const target = dropActions[dropType](dropNode, targetLevel, max, dropType)
    if (!target) return
    this.$emit('move', {
      sourceNodeId,
      ...target
    })
  }
}
