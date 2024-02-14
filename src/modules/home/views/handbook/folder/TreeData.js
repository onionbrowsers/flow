import { cloneDeep } from 'lodash'
class TreeData {
  constructor (tree) {
    this.tree = tree || []
  }

  /**
   * @function 根据id查询节点
   * @param id {string} 目标id
   * @param arr {array} 查询数组，默认是该树
   * */
  getNodeById (id, arr) {
    arr = arr || this.tree
    for (const node of arr) {
      if (node.id === id) {
        return node
      }
      if (node.children && node.children.length > 0) {
        const obj = this.getNodeById(id, node.children)
        if (obj) return obj
      }
    }
  }

  cloneDeepTree () {
    return cloneDeep(this.tree)
  }

  /**
   * @function 遍历树结构，满足条件执行一次cb
   * @param condition {function} 条件函数
   * @param cb {function} 满足条件执行的方法
   * */
  traverseTree (condition, cb, arr) {
    arr = arr || this.tree
    for (const node of arr) {
      if (condition && condition(node)) {
        cb && cb(node)
      }
      if (node.children && node.children.length > 0) {
        this.traverseTree(condition, cb, node.children)
      }
    }
  }

  /**
   * @function 过滤节点
   * @param condition {()=>boolean} 过滤条件
   * @param newSub {boolean} 为true时会深拷贝一棵树，在新树上过滤，不会影响原树，返回新的子树；为false时在原树上过滤
   * @param arr {array} 默认是当前树
   * */
  filterTree (condition, newSub = false, arr) {
    arr = arr || (newSub ? this.cloneDeepTree() : this.tree)

    if (!(arr && arr.length)) {
      return []
    }
    const newArr = []
    for (const node of arr) {
      // 如果当前节点满足条件，将该节点直接压入newArr
      if (condition(node)) {
        newArr.push(node)
        continue
      }
      // 如果不满足条件，递归查询子节点
      const subArr = this.filterTree(condition, false, node.children || [])
      // 子节点中有满足条件的节点，就将该节点children重写，并将该节点压入newArr
      // 注意：重写该节点children意味着改变了这棵树，如果不想改变，可以在第一执行filterTree时参数newSub传入true
      if (subArr.length) {
        node.children = subArr
        newArr.push(node)
      }
    }
    return newArr
  }

  /**
   * @function 获取所有叶子节点组成的数组
   * @param nodes {array} 默认是该树
   * @param leafs {array} 存放叶节点，最终被返回
   * */
  getLeafs (nodes = this.tree, leafs = []) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].isLeaf) {
        leafs.push(nodes[i])
      } else {
        if (nodes[i].children && nodes[i].children.length) {
          this.getLeafs(nodes[i].children, leafs)
        }
      }
    }
    return leafs
  }

  /**
   * @function 获取固定层级以上的子树
   * @param level {number} 限制层级
   * */
  getSubTreeByLevel (level) {
    // 深拷贝一棵树，以免影响原树
    const subTree = this.cloneDeepTree()

    const fn = (level, count, arr) => {
      for (let i = 0; i < arr.length; i += 1) {
        if (level == count) {
          arr[i].children = null
        } else {
          fn(level, count + 1, arr[i].children || [])
        }
      }
    }

    fn(level, 1, subTree)
    return subTree
  }

  /**
   * @function 添加子节点
   * @param parentId 父节点id
   * @param child 子节点
   * */
  addChild (parentId, child) {
    const node = this.getNodeById(parentId)
    if (node && node.children && Array.isArray(node.children)) {
      node.children.push(child)
    } else {
      node.children = [child]
    }
  }

  /**
   * @function 删除所有子节点
   * @param parentId 父节点id
   * */
  removeChild (parentId) {
    const node = this.getNodeById(parentId)
    node.children = []
  }

  /**
   * @function 获取树的最大层级，目标节点所在层级
   * @param tree {array} 树结构
   * @param id {string} 目标节点id
   * */
  getTreeLevel (tree = [], id) {
    let targetLevel = 0
    let max = 0
    const fn = (tree, floor) => {
      tree.forEach(item => {
        if (floor > max) {
          max = floor
        }
        if (id && id === item.id) {
          targetLevel = floor
        }
        if (item.children && item.children.length) {
          fn(item.children, floor + 1)
        }
      })
    }
    fn(tree, 1)
    return { max, targetLevel }
  }
}

export default TreeData
