/**
 * 与drawio相关的工具方法
 */

/** *************************************************** 位置相关 */
export const positionType = {
  IMPORT_INIT_PAGE: 0, // 初始化导入空数据
  IMPORT_TABLE_HEADER: 1, // 导入表头
  IMPORT_FLOW_CHART: 2, // 导入流程图，通过Excel或模板导入
  IMPORT_WHILE_FRESH: 3 // 保存流程图后刷新后导入
}

function getImportXmlPosition (type) {
  let position = {}
  switch (type) {
    case positionType.IMPORT_INIT_PAGE:
      position = { dx: 0, dy: 0 }
      break
    case positionType.IMPORT_TABLE_HEADER:
      position = { dx: 80, dy: 42 }
      break
    case positionType.IMPORT_FLOW_CHART:
      position = { dx: 80, dy: 182 }
      break
    case positionType.IMPORT_WHILE_FRESH:
      position = { dx: 0, dy: 0 }
      break
    default:
      position = { dx: 0, dy: 0 }
      break
  }
  return position
}

/** *************************************************** tab相关 */
// 获取tab名称
function getSheetName (xmlData, isInitLoadXmlData) {
  if (!isInitLoadXmlData) {
    return ''
  }
  let index = xmlData.indexOf('name="')
  if (index === -1) {
    return ''
  }
  let start = index + 6
  let tmpStr = xmlData.substring(start, start + 100)
  let _name = tmpStr.split('">')[0]
  console.log('获取tab名称: ', _name)
  return _name
}

// 获取相同的tab名称
function sameDrawioTabNames (drawioTabsLabels) {
  let tabNames = drawioTabsLabels
  let res = []
  console.log('获取相同的tab名称: ', tabNames)
  tabNames.reduce((p, c) => {
    if (p.includes(c)) {
      if (!res.includes(c)) {
        res.push(c)
      }
      return p
    } else {
      return p.concat(c)
    }
  }, [])
  console.log('res: ', res)
  return res
}

// 判断改变页的行为是否为复制
function pageIsDuplicated (selctedTab, drawioTabsLabels) {
  // 只需要保证新数组比原数组多一个元素(插入 与 复制); 且多的元素有 '的副本字样' (复制)
  let prevLabels = drawioTabsLabels
  let curLabels = selctedTab.tabLabels
  // 1. cur 长度 - prev 长度 === 1
  if (curLabels.length - prevLabels.length !== 1) {
    return false
  }
  // 2. 多的元素有 '的副本'
  let reg = /\u7684\u526f\u672c/
  return reg.test(selctedTab.currentLabel)
}

export const drawioUtils = {
  positionType,
  getImportXmlPosition,
  getSheetName,
  sameDrawioTabNames,
  pageIsDuplicated
}
