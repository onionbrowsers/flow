export const ADownload = function (config = {}) {
    const {href, downloadName} = config
    const oA = document.createElement('a');
    oA.href = href
    oA.download = downloadName || ''
    oA.click()
    oA.remove()
}