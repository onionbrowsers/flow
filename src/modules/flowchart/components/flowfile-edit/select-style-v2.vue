<template>
  <div
    id="select-style-v2"
    element-loading-text="加载中"
    v-loading="loading"
    style="width: 100%; margin-top: 15px;"
  >
    <div class="header-bar">
      <span>
        <i class="iconfont iconshuoming1"></i> 图片上传说明：图片大小不得超过2M；图片格式jpg/png;
      </span>
      <el-button type="primary" size="mini" @click="newHeader()">+ 新增表头</el-button>
    </div>
    <el-scrollbar>
      <div class="content">
        <div
          class="item"
          v-for="(item, index) in headers"
          :key="index"
          @click="checkedStyle(index)"
          :class="{active: order === index + 1}"
          :order="null"
        >
          <div class="title">
            <el-input
              size="mini"
              maxlength="20"
              show-word-limit
              @input="inputChange(index)"
              placeholder="请输入样式名称"
              v-model="item.name"
            ></el-input>
            <el-radio class="radio" v-model="radio" :label="index+1"></el-radio>
            <el-select popper-class="selectClass" v-model="item.default_select" placeholder="请选择" size="mini"  @visible-change="selectShow(index)" @change="selectChange">
              <el-option
                v-for="v in options"
                :key="v.value"
                :label="v.label"
                :value="v.value">
              </el-option>
            </el-select>
          </div>
          <div class="table">
            <div class="logo">
              <el-upload
                class="avatar-uploader"
                action="/api/v2/fc/layout/create"
                list-type="picture"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="onChange"
              >
                <img v-if="item.logo" :src="getLogo(item.logo)" class="logo-img"/>
                <div class="clickPull" v-else>
                  <div class="el-icon-upload" style="font-size:52px"></div>
                  <div style="color:#1890ff">{{up}}</div>
                </div>
              </el-upload>
            </div>
            <div class="grids">
              <div class="grid" v-for="subIndex in item.colNum" :key="subIndex" style="overflow: hidden;">
                <el-input
                  size="mini"
                  :maxlength="item.maxlength"
                  show-word-limit
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 6 }"
                  resize="none"
                  :clearable="true"
                  class="grid-input"
                  style="padding-right: 30px;"
                  @input="inputChange(index)"
                  v-model="item.grids[String(subIndex)]"
                />
              </div>
            </div>
          </div>
          <div class="item-footer">
            <template>
              <el-button size="mini" type="primary" icon="el-icon-delete" @click="save(index,item)" :disabled="item.edit">保存</el-button>
            </template>
            <template>
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="del(item.id,index)"
                style="margin-right:5px"
              >删除</el-button>
            </template>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <p class="footer">
      <el-button size="mini" @click="cancle">取消</el-button>
      <el-button class="applicate" size="mini" type="primary" @click="use" :disabled="useBool">应用</el-button>
    </p>
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
export default {
  props: ['folderId'],
  data () {
    return {
      radio: 1,
      isVisible: true,
      order: 0,
      headers: [],
      loading: true,
      up: '点击上传',
      useBool: true,
      oldHeaders: null,
      newHeaders: null,
      options: [{
        value: '0',
        label: '3*2'
      }, {
        value: '1',
        label: '2*2'
      }]
    }
  },
  created () {
    this.getHeader()
  },
  watch: {
    headers: {
      handler (item) {
        var oTime = setTimeout(() => {
          if (item.length === 0) {
            this.useBool = true
          } else {
            this.useBool = false
          }
          item.forEach((v, i) => {
            if (v.default_select === '0') {
              this.selectThree(i)
            } else if (v.default_select === '1') {
              this.selectTwo(i)
            } else if (v.default_select === '2') {
              this.selectOne(i)
            }
          })
          clearTimeout(oTime)
        }, 50)
      },
      deep: true
    }
  },
  methods: {
    selectShow (index) {
      this.order = index
      // console.log('下标：' + index)
    },
    selectChange (select) {
      // 每次select选择的时候清空文本框的内容
      this.headers[this.order].edit = false
      switch (select) {
        case '0':
          this.headers[this.order].grids = {
            '1': '',
            '2': '',
            '3': '',
            '4': '',
            '5': '',
            '6': ''
          }
          break
        case '1':
          this.headers[this.order].grids = {
            '1': '',
            '2': '',
            '3': '',
            '4': ''
          }
          break
        case '2':
          this.headers[this.order].grids = {
            '1': '',
            '2': ''
          }
          break
      }

      // console.log('select:' + select)
    },
    selectThree (index) {
      // console.log('3*2' + '下标:' + index)
      this.headers[index].maxlength = 30
      this.headers[index].colNum = 6
      if (!this.headers[index].grids.hasOwnProperty('4')) {
        this.$set(this.headers[index].grids, 4, '')
      }
      if (!this.headers[index].grids.hasOwnProperty('5')) {
        this.$set(this.headers[index].grids, 5, '')
      }
      if (!this.headers[index].grids.hasOwnProperty('6')) {
        this.$set(this.headers[index].grids, 6, '')
      }
      $('.grids').eq(index).children().css({
        'border-bottom': 'none',
        'height': '40px'
      })
      $('.grids').eq(index).children().eq(4).css('border-bottom', '1px solid #efefef')
      $('.grids').eq(index).children().eq(5).css('border-bottom', '1px solid #efefef')
    },
    selectTwo (index) {
      // console.log('2*2' + '下标:' + index)
      this.headers[index].colNum = 4
      this.headers[index].maxlength = 45
      if (!this.headers[index].grids.hasOwnProperty('3')) {
        this.$set(this.headers[index].grids, 3, '')
      }
      if (!this.headers[index].grids.hasOwnProperty('4')) {
        this.$set(this.headers[index].grids, 4, '')
      }
      this.$delete(this.headers[index].grids, 5)
      this.$delete(this.headers[index].grids, 6)
      $('.grids').eq(index).children().css({
        'border-bottom': 'none',
        'height': '60px'
      })
      $('.grids').eq(index).children().eq(2).css('border-bottom', '1px solid #efefef')
      $('.grids').eq(index).children().eq(3).css('border-bottom', '1px solid #efefef')
    },
    selectOne (index) {
      // console.log('1*2' + '下标:' + index)
      this.headers[index].maxlength = 90
      this.headers[index].colNum = 2
      this.$delete(this.headers[index].grids, 3)
      this.$delete(this.headers[index].grids, 4)
      this.$delete(this.headers[index].grids, 5)
      this.$delete(this.headers[index].grids, 6)
      $('.grids').eq(index).children().css({
        'border-bottom': '1px solid #efefef',
        'height': '120px'
      })
    },
    getLogo (logo) {
      if (logo.raw) {
        return logo.url
      } else {
        return this.$api.getImgUrl(logo.id, logo.key)
      }
    },
    newHeader () {
      if (document.getElementsByClassName('item')[0]) {
        document.getElementsByClassName('item')[0].scrollIntoView()
      }
      this.headers.unshift({
        id: 'new_' + (this.headers.length + 1),
        name: '',
        grid_num: '',
        logo: '',
        grids: {
          '1': '',
          '2': '',
          '3': '',
          '4': '',
          '5': '',
          '6': ''
        },
        edit: false,
        colNum: 6,
        default_select: '0',
        maxlength: 30,
        height: 0, // 图片的高度
        width: 0 // 图片宽度
      })
      this.radio = 1
      $('.grids').eq(0).children().css({
        'border-bottom': 'none',
        'height': '40px'
      })
      $('.grids').eq(0).children().eq(4).css('border-bottom', '1px solid #efefef')
      $('.grids').eq(0).children().eq(5).css('border-bottom', '1px solid #efefef')
    },
    async save (index, item) {
      // if (!this.headers[this.order].logo) {
      //   this.$msgMnger.warn('请上传表头LOGO')
      //   return
      // }
      // console.log(item)
      if (!this.headers[this.order].name) {
        this.$msgMnger.warn('请输入样式名称')
        return
      }
      // let oGrids = {
      //   '1': this.headers[this.order].grids[1],
      //   '2': this.headers[this.order].grids[2],
      //   '3': this.headers[this.order].grids[3],
      //   '4': this.headers[this.order].grids[4],
      //   '5': this.headers[this.order].grids[5],
      //   '6': this.headers[this.order].grids[6]
      // }
      // let oName = this.headers[this.order].name
      // let oLogo = this.headers[this.order].logo
      let oGrids = item.grids
      // 检查表格中是否有数据
      const result = Object.values(oGrids).reduce((prev, item) => item + prev, '')
      if (!result.trim()) {
        this.$msgMnger.error('请填入表头内容')
        return
      }
      let oName = item.name
      let oLogo = item.logo
      let selectNum = item.default_select
      let _height = item.height
      let _width = item.width
      let formData = new FormData()
      if (oLogo && oLogo.hasOwnProperty('raw')) { // 表示图片来源为上传
        formData.append('logo', oLogo.raw)
      } else if (oLogo && !Object.prototype.hasOwnProperty.call(oLogo, 'raw')) { // 表示图片来源为服务器
        const url = this.getLogo(oLogo)
        const { width, height } = await this.getImgSize({ imgUrl: url })
        _height = height
        _width = width
      } else if (oLogo === '') {

      } else {
      }
      if (!/new/.test(item.id + '')) { // 表示非新增, 添加 id
        formData.append('id', item.id)
      }
      formData.append('grids', JSON.stringify(oGrids))
      formData.append('name', oName)
      formData.append('defaultSelect', selectNum)
      if (_height) {
        formData.append('height', _height)
      }
      if (_width) {
        formData.append('width', _width)
      }
      if (this.folderId) {
        formData.append('folder_id', this.folderId)
      }
      // this.checkImgWidth(this.getLogo(item.logo)).then(res => {
      //   console.log('width, height: ', res)
      // })
      // return
      $.ajax({
        url: '/api/v2/fc/layout/create',
        method: 'post',
        contentType: false,
        processData: false,
        dataType: 'json',
        data: formData,
        beforeSend: function (XMLHttpRequest) {
          let token = localStorage.getItem('user-token') || ''
          XMLHttpRequest.setRequestHeader('Authorization', 'Bearer ' + token)
        },
        success: (res) => {
          if (res.code !== 0) {
            this.$msgMnger.error(res.msg)
            return
          }
          this.headers[index].id = res.data.id
          this.headers[index].name = res.data.name
          this.headers[index].grid_num = res.data.grid_num
          this.headers[index].has_logo = res.data.has_logo
          this.headers[index].localpath = res.data.localpath
          for (let i in this.headers[index].grids) {
            // eslint-disable-next-line no-unused-vars
            var gridsIndex = String(i + 1)
            this.headers[index].grids.gridsIndex = res.data.grids.gridsIndex
          }
          this.headers[index].logo = res.data.logo
          this.headers[this.order].edit = true
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        },
        error: (err) => {
          console.log(err)
          this.$msgMnger.error(err.msg)
          this.up = '重新上传'
          this.headers[this.order].edit = false
        }
      })
    },
    del (id, index) {
      this.$confirm('是否要删除该表头样式?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delMessage',
        center: 'true',
        confirmButtonClass: 'shure',
        modal: false
      })
        .then(() => {
          if (/new/.test(id + '')) { // 表示删除的新增行, 直接删除
            this.headers.splice(index, 1)
          } else {
            this.$api.deleteHeader(id).then(res => {
              this.headers.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    checkedStyle (index) {
      this.order = index
      // console.log(this.order)
      this.oldHeaders = _.cloneDeep(this.headers[index])
    },
    cancle () {
      this.order = null
      this.$emit('close')
    },
    use () {
      this.loading = false
      // console.log(this.headers[this.order].edit)
      if (this.headers[this.order].edit === false) {
        this.$message.error('请保存您的表头样式')
        return
      }
      this.$emit('use', this.headers[Number(this.radio) - 1].localpath)
    },
    async onChange (file, fileList) {
      const isJPG = file.raw.type === 'image/jpeg'
      const isPNG = file.raw.type === 'image/png'
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB')
        return
      }
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能上传jpg/png文件')
        return
      }
      const { height, width } = await this.getImgSize({ imgUrl: file.url })
      this.headers[this.order].logo = file
      this.headers[this.order].edit = false
      this.headers[this.order].height = height
      this.headers[this.order].width = width
    },
    upError (err) {
      console.log(err)
    },
    getHeader () {
      let _params = {}
      if (this.folderId) {
        _params.folder_id = this.folderId
      }
      this.$api.getHeader(_params).then(res => {
        for (let i in res.data.items) {
          res.data.items[i].edit = true
          if (res.data.items[i].default_select === '1') {
            res.data.items[i].colNum = 4
            res.data.items[i].maxlength = 45
          }
          if (res.data.items[i].default_select === 0) {
            res.data.items[i].default_select = '0'
            res.data.items[i].colNum = 6
            res.data.items[i].maxlength = 30
          }
          if (res.data.items[i].default_select === '2') {
            res.data.items[i].colNum = 2
            res.data.items[i].maxlength = 90
          }
        }
        this.headers = res.data.items
        this.loading = false
      })
    },
    inputChange (index) {
      this.$forceUpdate()
      this.headers[index].edit = false
    },
    // 检测图片的宽 & 高
    // checkImgWidth (fileUrl) {
    //   return new Promise((resolve, reject) => {
    //     let img = new Image();
    //     let res = {}
    //     img.onload = function () {
    //       res = {
    //         width: this.width,
    //         height: this.height
    //       }
    //       resolve(res)
    //     }
    //     img.src = fileUrl
    //   })
    // }
    // 下拉框
    // selectChange (select) {
    // if (select === '0') {
    //   this.selectThree(this.order)
    // } else if (select === '1') {
    //   this.selectTwo(this.order)
    // } else if (select === '2') {
    //   this.selectOne(this.order)
    // }
    // },
    // selectShow (index) {
    //   this.order = index
    //   console.log(index)
    // }
    /**
     * 异步获取图片的尺寸
     * @param imgUrl 图片 url
     * @returns {Promise<unknown>}
     */
    getImgSize ({ imgUrl }) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = imgUrl
        img.onload = function (e) {
          // 获取 height, width
          resolve({ height: e.target.height, width: e.target.width })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/index";
#select-style-v2 {
  width: 920px; // 700 + 40 + 40*2
  position: relative;
  // padding: 0 20px;
  text-align: left;
  box-sizing: border-box;
  .header-bar {
    background: #f9f9f9;
    overflow: hidden;
    padding: 15px 40px;
    margin-top: -20px;
    span{
      line-height: 28px;
    }
    .el-button {
      float: right;
    }
  }
  .el-scrollbar {
    width:920px;
    height: 450px;
    .content{
      padding: 10px 40px;
      .item {
        width: 800px;
        margin: 20px 0 10px 40px;
        .title {
          font-size: 12px;
          position: relative;
          display: flex;
          justify-content: space-between;
          .el-input {
            width: 200px;
          }
          .radio {
            position: absolute;
            top: 5px;
            left: -40px;
          }
        }
        .table {
          padding: 10px 0;
          overflow: hidden;
          .logo {
            display: inline-block;
            width: 180px;
            height: 120px;
            float: left;
            border: 1px solid #efefef;
            overflow: hidden;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            .avatar-uploader{
              .logo-img{
                width:auto;
                height: auto;
                max-width: 100px;
                max-height: 100px;
              }
            }
            .clickPull {
              font-size: 14px;
              color: #666666;
              line-height: 24px;
            }
            .clickPull:hover{
              color:#1890ff;
            }
          }
          .grids {
            width: 620px;
            display: inline-block;
            float: left;
            overflow: hidden;
            .grid {
              display: inline-block;
              width: 310px;
              height: 40px;
              float: left;
              border: 1px solid #efefef;
              border-left: none;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              &:nth-child(-n + 4) {
                border-bottom: none;
              }
            }
          }
        }
        .item-footer {
          overflow: hidden;
          .el-button {
            float: right;
            //   border: none;
          }
        }
      }
    }
  }
  .footer{
    padding: 15px 0;
    background: #f9f9f9;
    text-align: center;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    .applicate{
      margin-left: 20px;
    }
  }
  .el-icon-close {
    font-size: 28px;
    cursor: pointer;
    position: absolute;
    right: 97px;
    top: -8px;
    z-index: 10000;
  }
  .inner-box {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding-bottom: 30px;
    .item {
      box-sizing: border-box;
      width: 230px;
      // min-height: 300px;
      margin: 15px 20px;
      padding: 10px 20px;
      border: 1px solid #ccc;
      font-size: $tmp-list-font-size;
      cursor: pointer;
      .preview-img {
        width: 100%;
      }
    }
    .active {
      border: 1px solid #1890ff;
    }
  }
}
</style>

<style lang="scss">
.selectClass {
  height: 80px;
  .el-select-dropdown__item{
    padding-left: 10px;
  }
  .el-select-dropdown__item:last-child.hover{
    height: 45px;
  }
}
#select-style-v2 {
  .el-textarea__inner{
    border:none;
  }
  .el-textarea__inner::-webkit-scrollbar{
    display: none;
  }
  .el-dialog {
    .el-dialog__header {
      text-align: left;
      margin-left: 20px;
      font-weight: 600;
    }
    width: 965px;
    .el-scrollbar {
      height: 70vh;
    }
  }

  .el-scrollbar {
    .item {
      .title {
        .el-input {
          width: 200px;
        }
        .el-radio{
          .el-radio__label{
            display: none;
          }
        }
      }
      .table {
        .grids {
          .grid {
            .el-input {
              .el-input__inner {
                width: 258px;
                height: 38px;
                line-height: 40px;
                border: none;
              }
            }
          }
        }
      }
    }
  }
}
.delMessage {
  width: 240px;
  height: 128px;
  background: #ffffff;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  background-color: #ffffff;
  text-align: center;
  font-size: 16px;
  .el-message-box__message p {
    font-size: 16px;
  }
  .shure {
    background: #ff1a2e;
    border: none;
  }
}
</style>
