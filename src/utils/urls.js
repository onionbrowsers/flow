// const localDrawioUrl = 'http://localhost:8099/draw/?lang=zh'
// const localDrawioUrl = 'http://www.fgtsoft.com/draw/?lang=zh'
// const localDrawioUrl = 'http://172.16.20.54:8022/draw/?lang=zh'
const localDrawioUrl = 'http://127.0.0.1:9001/draw/?lang=zh'

const productDrawioUrl = '/draw/?lang=zh'

export const drawioUrl = process.env.NODE_ENV === 'production' ? productDrawioUrl : localDrawioUrl
