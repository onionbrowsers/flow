/**
 * events.js
 * @file msg manager
 * @author bayesba
 */

import { code2msg, warningMsg, complexMsg } from './code2msg.js'

function bindContext (context) {
  this.context = context
}

function error (data, options = {}) {
  this.context.$message({ type: 'error', message: data, duration: options.duration || 1500, offset: 40 })
}

function warn (data, options = {}) {
  this.context.$message({ type: 'warning', message: data, duration: options.duration || 1500, offset: 40 })
}

function success (data, options = {}) {
  this.context.$message({ type: 'success', message: data, duration: options.duration || 1500, offset: 40 })
}

function info (data, options = {}) {
  this.context.$message({ type: 'info', message: data, duration: options.duration || 1500, offset: 40 })
}

function httpError (data) {
  if (data.hasOwnProperty('response')) {
    if (data.response.status === 403) {
      return
    }
  }
  if (data.hasOwnProperty('code')) {
    if (data.code !== 0) {
      let _msg = (data.code > 0 && !complexMsg(data)) ? data.msg : code2msg(data)
      let _message = { type: 'error', message: _msg, duration: 1500, offset: 40 }
      if (complexMsg(data)) {
        _message.dangerouslyUseHTMLString = true
        _message.iconClass = 'without-icon'
        // _message.center = true
      }
      this.context.$message(_message)
    }
  } else {
    this.context.$message({ type: 'error', message: data.message, duration: 1500, offset: 40 })
  }
}

function httpWarning (data) {
  this.context.$message({ type: 'warning', message: warningMsg(data), duration: 1500, offset: 40 })
}

export default {
  bindContext,
  error,
  warn,
  success,
  info,
  httpError,
  httpWarning
}
