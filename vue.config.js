/*
 * @Description: vue project config for cli3
 * @Author: bayesba
 * @Date: 2019-02-13 14:07:26
 * @LastEditTime: 2019-07-06 10:08:34
 * @LastEditors: Please set LastEditors
 */
// const target = 'http://172.16.20.54:8022'
// const target = 'http://172.16.20.17:8022'
const target = 'http://123.56.205.122:8022'
// const target = 'http://www.fgtsoft.com'
module.exports = {
  // chainWebpack:  config => {
  //   config
  //   .entry('index')
  //     .add('babel-polyfill')
  // },
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 9001,
    https: false,
    hotOnly: false,
    proxy: {
      '/api/v2': {
        target,
        // target: 'http://localhost:8022/',
        // timeout: 12*60*1000,
        ws: true,
        changeOrigin: true
      },
      '/template': {
        target,
        // target: 'http://localhost:8022/',
        ws: true,
        changeOrigin: true
      },
      '/flow': {
        target,
        // target: 'http://localhost:8022/',
        ws: true,
        changeOrigin: true
      },
      '/file': {
        target,
        // target: 'http://localhost:8022/',
        ws: true,
        changeOrigin: true
      },
      '/pdf': {
        target,
        // target: 'http://localhost:8022/',
        ws: true,
        changeOrigin: true
      },
      '/draw': {
        target,
        ws: true,
        changeOrigin: true
      }
      // '/api/user': {
      //   target: 'http://localhost:8020/',
      //   ws: true,
      //   changeOrigin: true
      // }
    }
  },
  productionSourceMap: false
}
