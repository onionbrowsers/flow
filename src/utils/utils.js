// 防抖函数
export const debounce = function (fn, gapTime = 1000) {
  let timer = null
  return function () {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, gapTime)
  }
}

export function isDef (val) {
  return val !== undefined && val !== null
}

export function getTextClientWidth (text, container = document.body) {
  const div = document.createElement('div')
  try {
    div.setAttribute('style', 'visibility: hidden;display:inline-block;white-space: nowrap')
    div.setAttribute('id', 'fake_container')
    div.innerHTML = text
    container.appendChild(div)
    return div.clientWidth
  } finally {
    container.removeChild(div)
  }
}

export function getOverflowText (container, text) {
  const width = container.clientWidth
  const textWidth = getTextClientWidth(text, container)
  const everyCharWidth = textWidth / text.length
  return width + 5 > textWidth ? text : text.slice(0, Math.floor(width / everyCharWidth) - 2) + '...'
}

export function translatePhone (phone = '') {
  phone = phone.toString()
  if (!phone) return ''
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

export default {
  debounce
}
