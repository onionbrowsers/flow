<template>
  <div id="file-style-des">
    <div class="left">
      <div class="catalog">
        <div class="main_title">操作说明手册</div>
        <div @click="anchorPoint(1)" class="item">一、在线智能生成流程图</div>
        <div @click="anchorPoint(2)" class="item">二、导入流程图时的Excel填写标准</div>
        <div @click="anchorPoint(3)" class="item">三、流程图的表头维护功能</div>
        <div @click="anchorPoint(4)" class="item">四、系统使用中的错误提示说明</div>
        <div class="crude_hr"></div>
        <div class="fine_hr"></div>
      </div>
    </div>
    <div class="right">
      <p class="env-suggest">注：建议使用谷歌或火狐浏览器以获得更好的体验效果!</p>
      <div class="title" ref="one">
        <!-- 一、{{titles[type]}}的填写标准说明 -->
        一、在线智能生成流程图
      </div>
      <p class="small-title">SmartFlow提供在线实时编写并生成流程图的功能，如下图所示，</p>
      <p class="h1">
        点击
        <span style="color:rgba(0,0,0,0.85);font-weight:bold">“智能生成”</span>，打开左侧填写面板，填写或选择表格内的内容，完成后，点击”更新到流程图“，即可查看右侧流程图生成情况；在编辑过程中，您可随时点击”更新到流程图“，查看您的流程图生成样式。
      </p>
      <img
        src="../assets/flowstyle/1.png"
        alt
        width="1058px"
        height="750px"
        style="margin-top:20px;"
      />
      <div class="title" ref="two">
        <!-- 一、{{titles[type]}}的填写标准说明 -->
        二、导入流程图时的Excel填写标准
      </div>
      <p class="small-title">1. 如下所示为Excel的填写示例，您可查看左侧表格内容与右侧流程图之间的对应关系</p>
      <p class="h1">上传sheet名称为《开发计划制定》的Excel表格，系统生成如图所示的流程图：</p>
      <!-- <div class="content" v-if="type==='excel'"> -->
      <div class="content">
        <!-- <p>1.表格样式</p>
        <img class="excel" src="../assets/flowstyle/excel.png" alt="">-->
        <div class="excel">
          <div class="bottom">
            <div>
              <el-button type="primary" size="mini" @click="download">下载示例Excel</el-button>
              <img src="../assets/flowstyle/2.png" width="569px" height="652px" alt />
            </div>
            <img src="../assets/flowstyle/visio0001.png" alt />
          </div>
          <div class="top">
            <span class="left-1">1</span>
            <span class="left-2">2</span>
            <span class="left-3">3</span>
            <span class="left-4">4</span>
            <span class="left-5">5</span>
            <span class="left-6">6</span>
            <span class="left-7">7</span>
            <span class="left-8">8</span>
            <span class="left-9">9</span>
            <span class="left-10">10</span>
            <span class="right-1">1</span>
            <span class="right-2">2</span>
            <span class="right-3">3</span>
            <span class="right-4">4</span>
            <span class="right-5">5</span>
            <span class="right-6">6</span>
            <span class="right-7">7</span>
            <span class="right-8">8</span>
            <span class="right-9">9</span>
            <span class="right-10">10</span>
          </div>
        </div>
        <p class="subTitle">2. 请您按照如下标准要求填写Excel的各项字段</p>
        <!-- <div>字段说明</div> -->
        <div class="keywords">
          <img src="../assets/flowstyle/3.png" width="951px" alt />
          <p class="ts_ins">*请避免特殊字符的使用，如&#38; \ &lt; >；留空的格子无需填写任何内容。</p>
        </div>
        <!-- <div>图形说明</div>
        <img class="keywords" src="../assets/flowstyle/shapes.png" alt="">-->
        <!-- <p>3.其他说明</p> -->
        <p class="subTitle">3. 您可以对应如下说明来填写Excel中的“步骤类型”字段内容</p>
        <img class="keywords" src="../assets/flowstyle/4.png" />
        <p class="subTitle">4. 在系统中生成流程图时，您可能还会碰到以下图形</p>
        <!-- <div>Excel表格中不包含虚线节点的设定，请在生成流程图后自行修改。虚线节点示例如下：</div> -->
        <img class="keywords" src="../assets/flowstyle/fouth.png" alt />
      </div>
      <!-- <div class="content" v-if="type==='visio'">
        <p>1.样式说明</p>
        <div>
          <div>（1）若需生成一个Excel模板，则上传的Visio需为同类业务流程图，且业务差异不能过大；否则只能针对每个Visio单独生成Excel模板；</div>
          <div>（2）风险点采用红色标出，控制点采用绿色标出；</div>
          <div>（3）步骤的节点编号要有且唯一，不能重复；</div>
          <div>（4）一个visio里包含两个以上流程的话，不同流程之间要用虚线隔开。</div>
        </div>
        <img class="excel" src="../assets/flowstyle/excel.png" alt="">
        <p>2.样式参考</p>
        <img class="visio" src="../assets/flowstyle/visio01.png" alt="">
        <img class="visio right" src="../assets/flowstyle/visio02.png" alt="">
      </div>-->

      <div class="crude_hr"></div>
      <div class="fine_hr"></div>
      <div class="bottom_explain">
        <div class="title" ref="three">三、流程图的表头维护功能</div>
        <p
          class="h1"
        >1. SmartFlow提供了方便的表头管理功能，您可在生成的流程图页面单机”设置表头“选择您的历史表头，或添加和编辑表头；完成后单击“应用”即可快捷应用到流程图页面中。</p>
        <img src="../assets/flowstyle/5.png" width="910px" alt />
      </div>
      <div class="bottom_explain">
        <div class="title" ref="four">四、系统使用中的错误提示说明</div>
        <p class="h1">1. 您在上传Excel生成流程图时，可能会碰到如下两类的提示信息：</p>
        <p class="h2">(1) Excel 文件步骤和进入步骤的规范检查提示：</p>
        <p class="h3">当碰到该类提示时，您需要在Excel表格中填写步骤和进入步骤的内容，再重新上传文件，否则不能生成流程图</p>
        <img src="../assets/flowstyle/001.png" alt />
        <p class="h2">(2) Excel文件其他填写内容的规范检查提示:</p>
        <p class="h3">该提示信息会出现在系统生成的流程图页面上，点击“Excel规范检查结果”可展开或收起提示信息的面板。</p>
        <p class="h3">您可根据该提示信息，修改流程图对应的Excel原文件，修改完成后，在重新上传，即可生成标准的流程图。</p>
        <img src="../assets/flowstyle/err02.jpg" alt />
        <p class="h1">2. 您在系统上采用Visio训练模板时，请注意以下建议：</p>
        <p class="h2">(1) 建议您可上传单个流程图文件生成Excel模板，或上传同类业务相似的流程图文件来训练Excel模板</p>
        <p class="h2">(2) 当上传多个流程图的时候，请保持业务流程图的名称一致；如下图为业务流程名称不一样的的错误提示。</p>
        <img class="ppp" src="../assets/flowstyle/ppp2.png" alt />
        <p class="h2">(3) 当上传多个流程图时，请保持流程图的泳道数一致；如下图为泳道数不一样的错误提示。</p>
        <img class="ppp" src="../assets/flowstyle/ppp1.png" alt />
      </div>
      <div class="crude_hr"></div>
      <div class="fine_hr"></div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      type: '',
      titles: {
        excel: 'Excel',
        visio: 'Visio'
      }
    }
  },
  computed: {
    ...mapGetters({
      token: 'token'
    })
  },
  mounted () {
    this.type = this.$route.params.type
    this.suspension()
    $('.left').css('height', window.innerHeight + 'px')
  },
  methods: {
    suspension () {
      for (let i = 1; i < 11; i++) {
        // $('.left-' + i).mouseover(function () {
        //   let ele = $('<span style="display: block; width: 30px; height: 30px; background: red; transform: translate(-15%, -85%); ' +
        //           'opacity: 0.5; border-radius: 50%"></span>')
        //   ele.appendTo($('.right-' + i))
        // })

        $('.left-' + i).mouseover(function () {
          $('.right-' + i).addClass('animate')
        })

        $('.right-' + i).mouseover(function () {
          $('.left-' + i).addClass('animate')
        })

        $('.left-' + i).mouseout(function () {
          $('.right-' + i).removeClass('animate')
        })

        $('.right-' + i).mouseout(function () {
          $('.left-' + i).removeClass('animate')
        })
      }
    },
    anchorPoint (item) {
      if (item === 4) this.$refs.four.scrollIntoView()
      if (item === 3) this.$refs.three.scrollIntoView()
      if (item === 2) this.$refs.two.scrollIntoView()
      if (item === 1) this.$refs.one.scrollIntoView()
    },
    download () {
      window.open(`/api/v2/fc/file/shili?_token=${this.token}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
#file-style-des {
  height: 100%;
  text-align: left;
  width: 1400px;
  margin: 0 auto;
  position: relative;
  .left {
    width: 264px;
    background: #ffffff;
    box-shadow: 5px 0px 5px -5px #E2E9F0,-5px 0px 5px -5px #E2E9F0;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    .catalog {
      .main_title {
        height: 30px;
        width: 144px;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.85);
        margin: 24px auto 0;
        line-height: 31px;
        font-weight: 600;
      }
      .item {
        height: 40px;
        width: 244px;
        line-height: 40px;
        background: white;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        padding-left: 20px;
        margin: 10px 0;
        cursor: pointer;
      }
      .item:hover {
        background: #f1f5f8;
      }
    }
  }
  .right {
    width: 1128px;
    height: 100%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #fafafa;
    box-sizing: border-box;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.65);
    position: absolute;
    left: 284px;
    top: 0;
    overflow-y: auto;
    overflow-x: hidden;
    .small-title{
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(0,0,0,0.85);
      font-weight: bold;
      margin-bottom: 10px;
    }
    .h1 {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #666666;
      letter-spacing: 0;
      line-height: 40px;
    }
    .h2 {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #666666;
      letter-spacing: 0;
      line-height: 40px;
    }
    .h3 {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #666666;
      letter-spacing: 0;
      line-height: 40px;
      padding-left: 80px;
      margin-top: 10px;
    }
    .env-suggest {
      font-size: 16px;
      color: $primary-color;
    }

    .crude_hr {
      margin-top: 35px;
      width: 100%;
      height: 2px;
      background: #4a4a4a;
    }
    .fine_hr {
      margin-top: 10px;
      height: 1px;
      background: #a2a2a2;
    }
    .title {
      font-size: 24px;
      color: #6E6E6E;
      margin-top: 60px;
      font-size: 24px;
      font-weight: 600;
      line-height: 30px;
      margin-bottom: 20px;
      // border-bottom: 1px solid $seprator-line-color;
    }
    .content {
      .excel {
        width: 100%;
        position: relative;
        .bottom {
          display: flex;
          margin-top: 30px;
          justify-content: left;
          div:first-child {
            img {
              height: 718px;
            }
          }
          > img:last-child {
            flex: 1;
            max-width: 500px;
            height: 766px;
            margin-top: 0;
          }
        }
        .top {
          position: relative;
          left: 0;
          top: 0;
          width: 100%;
          @keyframes mymove {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(2);
            }
            100% {
              transform: scale(1);
            }
          }
          > span {
            position: absolute;
            text-align: center;
            line-height: 20px;
            display: block;
            width: 20px;
            height: 20px;
            background: #1890ff;
            color: #fff;
            color: 12px;
            border-radius: 50%;
            cursor: pointer;
          }
          .animate {
            animation: mymove 1.5s ease infinite;
            background: red;
          }
          // display: block; width: 30px; height: 30px; background: blue; transform: translateY(-100%); opactity: .5
          .left-1 {
            top: -719px;
            left: 247px;
          }
          .left-2 {
            top: -610px;
            left: 85px;
          }
          .left-3 {
            top: -524px;
            left: 85px;
          }
          .left-4 {
            top: -524px;
            left: 314px;
          }
          .left-5 {
            top: -524px;
            left: 467px;
          }
          .left-6 {
            top: -442px;
            left: 281px;
          }
          .left-7 {
            top: -353px;
            left:85px;
          }
          .left-8 {
            top: -176px;
            left: 84px;
          }
          .left-9 {
            top: -80px;
            left: 408px;
          }
          .left-10 {
            top: -80px;
            left: 182px;
          }
          .right-1 {
            top: -732px;
            left: 904px;
          }
          .right-2 {
            top: -675px;
            left: 937px;
          }
          .right-3 {
            top: -561px;
            left: 927px;
          }
          .right-4 {
            top: -533px;
            left: 896px;
          }
          .right-5 {
            top: -505px;
            left: 942px;
          }
          .right-6 {
            top: -578px;
            left: 686px;
          }
          .right-7 {
            top: -410px;
            left: 709px;
          }
          .right-8 {
            top: -330px;
            left: 920px;
          }
          .right-9 {
            top: -233px;
            left: 920px;
          }
          .right-10 {
            top: -125px;
            left: 928px;
          }
        }
      }
      .subTitle {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0,0,0,0.85);
        font-weight: bold;
        margin-top: 40px;
        margin-bottom: 40px;
        // font-size: 16px;
        // color: #272727;
        // font-weight: bold;
        // line-height: 30px;
        // margin: 50px 0 10px 0;
      }
      > div {
        margin-top: 20px;
        font-weight: bold;
        div {
          font-size: 14px;
          font-weight: bold;
          line-height: 24px;
        }
      }
      .keywords {
        // width: 65%;
        display: block;
        width: 883px;
        img {
          display: block;
          margin-left: auto;
          margin-right: auto;
          // width: 100%;
        }
        .ts_ins {
          font-size: 14px;
          padding-top: 20px;
          font-weight: normal;
          // text-align: center;
          font-weight: 700;
        }
      }
      img {
        margin-top: 20px;
        &.diamonds {
          width: 180px;
        }
        &.visio {
          width: 48%;
          &.right {
            margin-left: 4%;
          }
        }
      }
    }
    .bottom_explain {
      margin-top: 40px;
      padding-bottom: 50px;
      font-size: 24px;
      .h1{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0,0,0,0.85);
        font-weight: bold;
      }
      img {
        display: block;
        margin: 50px 0 50px 0;
      }
      .ppp {
        width: 88%;
      }
    }
  }
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
