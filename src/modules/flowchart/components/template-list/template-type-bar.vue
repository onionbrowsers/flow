<template>
  <!-- <div class="type-box"> -->
    <div class="tmp-type-bar">
      <div class="vertical"></div>
      <div>{{head}}</div>
      <div class="handle" @click="clickHandle" v-if="iconIsShow">
        <i :class="[ flag ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i>
        <!-- <span>{{btnc}}</span> -->
        {{btnc}}
      </div>
    </div>
    <!-- <div class="bottom-line"></div>
  </div> -->
</template>

<script>
export default {
  props: {
    head: String,
    iconIsShow: Boolean
  },
  data () {
    return {
      btnc: '收起',
      flag: true
    }
  },
  mounted () {
    console.log(this.dom)
  },
  methods: {
    clickHandle () {
      this.$emit('changeHeight')
      this.flag = !this.flag
      if (this.flag) {
        this.btnc = '收起'
      } else {
        this.btnc = '展开'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/index';
.tmp-type-bar{
  padding-top: 20px;
  box-sizing: border-box;
  margin-left: 20px;
  margin-right: 32px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  &::after{
    display: block;
    content: '';
    clear: both;
  }
  >div{
    float: left;
  }
  >.handle{
    color: #3F51B5;
    font-size: 12px;
    padding: 0 5px;
    float: right;
    border: 1px solid #3F51B5;
    border-radius: 5px;
    &:hover{
      cursor: pointer;
    }
  }
  >div:nth-child(2){
    color: #333;
    font-size: 14px;
    font-weight: 600;
    padding-left: 10px;
  }
  >div:first-child{
    width: 5px;
    height: 18px;
    background: #aaaaaa;
  }
}
.bottom-line{
  box-sizing: border-box;
  height: 1px;
  background: #ddd;
}
</style>
