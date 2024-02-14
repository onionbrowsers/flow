/**
 * 与文件下载相关的工具方法
 */

import { drawioUtils } from './drawio-utils'
import _ from 'lodash'

/**
 * 添加下载记录接口, 下载之前调用, 记录用户的下载行为
 * @params tabIds 选择下载的tab的id
 * return <Promise>
 */
async function addDownloadLog (tabIds) {
  try {
    this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'add-download-log' })
    await this.$api.accountDownload({
      flow_id: this.$route.params.flowfileId,
      flow_name: this.flowfileName,
      company_id: this.companyId,
      sheet_ids: JSON.stringify(tabIds)
    })
    this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'add-download-log' })
  } catch (err) {
    this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'add-download-log' })
    this.$msgMnger.httpError(err)
  }
}

function downloadVsdx (tabIds) {
  let _format = 'vsdx'
  let _file = {
    format: _format,
    filename: this.flowfileName,
    data: ''
  }
  let sameNames = drawioUtils.sameDrawioTabNames(this.drawioTabsLabels)
  if (sameNames.length > 0) {
    this.$confirm(`页名${JSON.stringify(sameNames)}重复出现，建议修改名称。否则下载为Visio文件会导致页面缺失，是否继续？`, '提示', {
      confirmButtonText: '下载',
      cancelButtonText: '放弃',
      type: 'warning'
    }).then(() => {
      addDownloadLog.call(this, tabIds).then(() => {
        this.$refs.flowfileEditContainer.downloadFileData(_file)
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消下载'
      })
    })
  } else {
    addDownloadLog.call(this, tabIds).then(() => {
      this.$refs.flowfileEditContainer.downloadFileData(_file)
    })
  }
}

function downloadPdf (tabIndexes, tabIds) {
  // 图片上传到服务器进行下载
  return new Promise((resolve, reject) => {
    this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'download-pdf-word' })
    addDownloadLog.call(this, tabIds).then(() => {
      getAllImages.call(this, tabIndexes)
      resolve()
    })
  })
}

function downloadWord (tabIndexes, tabIds) {
  // 下载前进行记录, 成功记录后再进行下载
  this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start', module: 'download-pdf-word' })
  addDownloadLog.call(this, tabIds).then(() => {
    this.mimeType = 'docx'
    getAllImages.call(this, tabIndexes)
  })
}

// 通过drawio导出所有图片（导出后上传服务器生成word/pdf，然后下载）
function getAllImages (tabIndexes) {
  this.$refs.flowfileEditContainer.refGetAllImageUrls({ scale: 6, tabIndexes: tabIndexes })
}

// 等待所有图片数据收集完成，将图片保存为word的逻辑, 同时可适用于pdf
const saveImgsAsWordOrPdf = _.debounce(function (ctx) {
  let _tmpList = this.imgListForDownload
  this.imgListForDownload = [] // 清空全局队列，为后续下载使用
  console.log('mimeType: ', this.mimeType)

  let _flowId = this.$route.params.flowfileId
  let _promiseList = []
  // docx 下载时压缩图片, pdf 下载时添加边距
  if (this.mimeType === 'pdf') {
    _promiseList = _tmpList.map(item => imgWrapper({ imgUrl: item.image }))
  } else {
    _promiseList = _tmpList.map(item => imgCompress({ dataUrl: item.image, quality: 0.2 }))
  }
  Promise.all(_promiseList).then(res => {
    // res 为 base64 图片的队列，截取需要上传的内容
    let _tmpList2 = res.map(item => item.split(',')[1])
    this.$api.saveImagesAsWord({
      flowId: _flowId,
      previews: JSON.stringify(_tmpList2), // 一次性上传所有图片的base64
      mimeType: this.mimeType,
      fileName: this.flowfileName
    }).then(res => {
      const filePath = res.file_path
      window.open(`${filePath.substr(8)}?_token=${this.token}`) // 通过打开链接的方式进行下载
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'download-pdf-word' })
    }).catch(err => {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'download-pdf-word' })
      this.$msgMnger.httpError(err)
    })
  }).catch(err => {
    this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end', module: 'download-pdf-word' })
    this.$msgMnger.httpError(err)
  })
}, 4000)

/** *************************************************** 图片处理相关 */
// 图片压缩
function imgCompress ({ dataUrl, quality }) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = dataUrl
    img.onload = function (e) {
      const imgRect = {
        h: e.target.height,
        w: e.target.width
      }
      const canvas = document.createElement('canvas')
      canvas.height = imgRect.h
      canvas.width = imgRect.w
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, imgRect.w, imgRect.h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
  })
}

// 给 img 添加 padding, 适配到整页大小
function imgWrapper ({ imgUrl }) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = imgUrl
    img.onload = (e) => {
      const result = img2Base64({ w: e.target.width, h: e.target.height, img, imgRect: { h: e.target.height, w: e.target.width } })
      resolve(result)
    }
  })
}

// 图片转 base 64
function img2Base64 ({ w, h, img, imgRect }) {
  const PAGE_HEIGHT = imgRect.h / (83 - 10) * 83
  const PAGE_WIDTH = imgRect.w / (83 - 10) * 83
  // 横向格子数量
  // const verGridNum = 117
  const horGridNum = 83
  const pixelPurGrid = PAGE_WIDTH / horGridNum
  const PADDING_LEFT = 5 * pixelPurGrid
  const PADDING_TOP = 5 * pixelPurGrid
  const PADDING_RIGHT = 5 * pixelPurGrid
  const PADDING_BOTTOM = 5 * pixelPurGrid
  const MAX_WIDTH = PAGE_WIDTH - PADDING_LEFT - PADDING_RIGHT
  const MAX_HEIGHT = PAGE_HEIGHT - PADDING_TOP - PADDING_BOTTOM
  const canvas = document.createElement('canvas')
  const tmpWidth = w
  w = MAX_WIDTH
  h = MAX_WIDTH * h / tmpWidth
  canvas.width = PAGE_WIDTH
  if (h > MAX_HEIGHT) {
    canvas.height = h + PADDING_TOP + PADDING_BOTTOM
  } else {
    canvas.height = PAGE_HEIGHT
  }
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, PADDING_LEFT, PADDING_TOP, w, h)
  return canvas.toDataURL('image/jpeg', 0.2)
}

export const downloadUtils = {
  addDownloadLog,
  downloadVsdx,
  downloadPdf,
  downloadWord,
  saveImgsAsWordOrPdf
}
