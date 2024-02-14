
/**
 * code2msg.js
 * msg content config
 * @author bayesba
 */

export const obj = [
  1125
]

export function complexMsg (error) {
  return obj.indexOf(error.code) > -1
}

export function code2msg (error) {
  if (!error.msg) {
    return `错误码：${error.code}`
  }

  if (error.code === 1125) {
    let _msg = error.msg
    let toastMsg = `<h3>模板《${_msg.name}》不可用</h3>`
    _msg.info.forEach(el => {
      toastMsg += `<br><p>${el}</p>`
    })
    return toastMsg
  }
  return '系统异常'
}

export function warningMsg (warning) {
  return ''
}
