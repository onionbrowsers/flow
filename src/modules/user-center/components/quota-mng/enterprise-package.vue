<template>
  <div id="enterprise-package">
    <div class="enterprise-package-item" v-for="(item, index) in listData" :key="index">
      <div class="discount">
        <span>{{item.discount}}</span>
      </div>
      <div class="quota">额度：{{item.quota}}张</div>
      <div class="price">￥<span>{{item.price}}</span></div>
      <div>
        <div class="gPrice" v-if="item.gPrice">商品金额：{{item.gPrice}}</div>
        <div class="dPrice" v-if="item.dPrice">优惠金额：{{item.dPrice}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      listData: [
        {
          quota: '100',
          price: '2375',
          gPrice: '2500',
          dPrice: '125',
          discount: '9.5折优惠'
        },
        {
          quota: '500',
          price: '11250',
          gPrice: '12500',
          dPrice: '1250',
          discount: '9.0折优惠'
        },
        {
          quota: '1000',
          price: '21250',
          gPrice: '25000',
          dPrice: '3750',
          discount: '8.5折优惠'
        },
        {
          quota: '大于1000',
          price: '25000',
          gPrice: '',
          dPrice: '',
          discount: '无限下载'
        }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
#enterprise-package{
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  font-size: 14px;
  .enterprise-package-item{
    border: 1px solid #ddd;
    padding: 0 20px 20px 20px;
    display: flex;
    flex-direction: column;
    height: 300px;
    width: 188px;
    justify-content: space-between;
    transition: .2s all;
    &:hover{
      box-shadow: -2px 2px 6px 0px #dedede;
      transform: translate(2px, -2px);
    }
    .discount{
      text-align: right;
      margin-right: -20px;
      >span{
        display: inline-block;
        padding: 5px 10px;
        background: rgb(241, 241, 241);
        color: #208de1;
      }
    }
    .quota{
      text-align: left;
      margin: 40px 0;
    }
    .price{
      flex: auto;
      >span{
        font-size: 30px;
        font-weight: bold;
      }
    }
    .gPrice,.dPrice{
      margin-right: -20px;
      padding-left: 90px;
      text-align: left;
      color: rgb(161, 161, 161);
    }
  }
}
</style>

<style lang="scss">
</style>
