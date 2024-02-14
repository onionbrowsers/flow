import * as templateList from './template-list'
import { getFlowfileListFC, deleteFlowList, updateFile, downloadFile } from './flowfile-list'
import * as FlowfileEdit from './flowfile-edit'
import * as Tags from './tags'
import * as templateCreate from './template-create'
import * as templateEdit from './template-edit'
import * as EditableTable from './editable-table'

function mount () {
  // 流程文件列表
  this.$api['getFlowfileListFC'] = getFlowfileListFC
  this.$api['deleteFlowList'] = deleteFlowList
  this.$api['updateFile'] = updateFile
  this.$api['downloadFile'] = downloadFile

  // 标签
  this.$api['getFlowfileTags'] = Tags.getFlowfileTags
  this.$api['getFlowtempTags'] = Tags.getFlowtempTags

  // 编辑流程文件
  this.$api['getTemplates'] = templateList.getTemplates
  this.$api['getSearchTemplateHistory'] = templateList.getSearchTemplateHistory
  this.$api['getTemplateHot'] = templateList.getTemplateHot
  this.$api['createFlowFile'] = FlowfileEdit.createFlowFile
  this.$api['uploadExcel'] = FlowfileEdit.uploadExcel
  this.$api['analysisSheet'] = FlowfileEdit.analysisSheet
  this.$api['deleteExcel'] = FlowfileEdit.deleteExcel
  this.$api['selectStyle'] = FlowfileEdit.selectStyle
  this.$api['useStyle'] = FlowfileEdit.useStyle
  this.$api['getImgUrl'] = FlowfileEdit.getImgUrl
  this.$api['getFlowfile'] = FlowfileEdit.getFlowfile
  this.$api['getFlowfileDetail'] = FlowfileEdit.getFlowfileDetail
  this.$api['getRiskJuzInfo'] = FlowfileEdit.getRiskJuzInfo
  this.$api['changeRiskJuzInfo'] = FlowfileEdit.changeRiskJuzInfo
  this.$api['getRiskdotInfo'] = FlowfileEdit.getRiskdotInfo
  this.$api['gettwoRisklist'] = FlowfileEdit.gettwoRisklist
  this.$api['getctrlSystemName'] = FlowfileEdit.getctrlSystemName
  this.$api['lcAlldownmatrix'] = FlowfileEdit.lcAlldownmatrix
  this.$api['changeRiskdotInfo'] = FlowfileEdit.changeRiskdotInfo
  this.$api['getContdotInfo'] = FlowfileEdit.getContdotInfo
  this.$api['changeContdotInfo'] = FlowfileEdit.changeContdotInfo
  this.$api['saveFlowfile'] = FlowfileEdit.saveFlowfile
  this.$api['saveHistoryfirst'] = FlowfileEdit.saveHistoryfirst
  this.$api['saveHistorySecond'] = FlowfileEdit.saveHistorySecond
  this.$api['saveHistorythird'] = FlowfileEdit.saveHistorythird
  this.$api['selectTemplate'] = FlowfileEdit.selectTemplate
  this.$api['deleteHeader'] = FlowfileEdit.deleteHeader
  this.$api['getHeader'] = FlowfileEdit.getHeader
  this.$api['addHeader'] = FlowfileEdit.addHeader
  this.$api['deleteTmp'] = templateList.deleteTmp
  this.$api['downloadTmp'] = templateList.downloadTmp
  this.$api['batchDownloadTmp'] = templateList.batchDownloadTmp

  // 模板列表文件
  this.$api['createTmp'] = templateCreate.createTmp
  this.$api['editTmp'] = templateCreate.editTmp

  /**
   * 编辑模板
   */
  this.$api['getTemplateDetail'] = templateEdit.getTemplateDetail
  this.$api['uploadVisioXml'] = templateEdit.uploadVisioXml
  this.$api['deleteVisio'] = templateEdit.deleteVisio
  this.$api['templateTrain'] = templateEdit.templateTrain
  this.$api['getTemplateStatus'] = templateEdit.getTemplateStatus
  this.$api['getTemplatePreview'] = templateEdit.getTemplatePreview

  // 可编辑表格接口
  this.$api['getPageNExcelData'] = EditableTable.getPageNExcelData
  this.$api['savePageNExcelData'] = EditableTable.savePageNExcelData

  // 另存为模板
  this.$api['saveAsTemplate'] = FlowfileEdit.saveAsTemplate

  // 流程图 上传 visio
  this.$api['flowUploadVisio'] = FlowfileEdit.flowUploadVisio
  this.$api['confirmImportInterface'] = FlowfileEdit.confirmImportInterface
  this.$api['importFlowchartExisted'] = FlowfileEdit.importFlowchartExisted

  // 上传图片存为word
  this.$api['saveImagesAsWord'] = FlowfileEdit.saveImagesAsWord
  // 下载word
  this.$api['downloadWordURL'] = FlowfileEdit.downloadWordURL
  // 保存下载记录
  this.$api['addDownLog'] = FlowfileEdit.addDownLog
  // 获取计费信息
  this.$api['accountBilling'] = FlowfileEdit.accountBilling
  // 制度库等计算下载
  this.$api['accountdownlibrary'] = FlowfileEdit.accountdownlibrary
  // 计费下载记录
  this.$api['accountDownload'] = FlowfileEdit.accountDownload
  // 获取流程图信息, 主要是为了获取实时的流程图编辑状态
  this.$api['getFlowInfo'] = FlowfileEdit.getFlowInfo
  // 由xml生成数据
  this.$api['xmlToData'] = FlowfileEdit.xmlToData
}

export default {
  mount
}
