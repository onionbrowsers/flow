<template>
  <div class="usr-item" :class="{ 'usr-item--mask': mask }">
    <div class="usr-item__usr-info">
      <div class="usr-info__avatar"><!-- 头像 -->
        <!--        有图片优先显示图片-->
        <img class="avatar__image" v-if="usrInfo.hasOwnProperty('image') && usrInfo.image" :src="usrInfo.image" alt="">
        <!--        无图片, 有gender且gender === 2 显示女头像-->
        <template v-else>
          <svg v-if="usrInfo.hasOwnProperty('gender') && usrInfo.gender === 2" class="icon avatar__image avatar__icon-female" aria-hidden="true">
            <use xlink:href="#iconnvtouxiang"></use>
          </svg>
          <svg v-else class="icon avatar__image avatar__icon-male" aria-hidden="true">
            <use xlink:href="#iconnantouxiang"></use>
          </svg>
        </template>
      </div>
      <div class="usr-info__info"><!-- 姓名等信息 -->
        <div class="info__name">{{ usrInfo.name }}</div>
        <div class="info__phone">
          <svg class="icon phone_icon" aria-hidden="true">
            <use xlink:href="#icondianhuahaoma"></use>
          </svg>
          <!-- <span v-if="usrInfo.gender==-1">{{ usrInfo.phone }}</span> -->
          <span >{{ usrInfo.phone.substr(0,3)+'****'+usrInfo.phone.substring(usrInfo.phone.length-4) }}</span>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'usr-item',
  props: {
    usrInfo: {
      type: Object,
      default: () => ({
        image: '',
        gender: 2,
        name: '蕉皮',
        phone: '18323232323'
      })
    },
    mask: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.usr-item {
  height: 96px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: $list-background-color-hover;
  }
  .usr-item__usr-info {
    margin-left: 24px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .usr-info__avatar {
      height: 64px;
      width: 64px;
      margin-right: 12px;
      .avatar__image {
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }
    .usr-info__info {
      text-align: left !important;
      .info__name {
        margin-bottom: 8px;
        font-size: 18px;
        color: $base-text-color;
      }
      .info__phone {
        font-size: 14px;
        color: $base-text-color-middle;
        .phone_icon {
          margin-right: 3px;
        }
      }
    }
  }
}
.usr-item--mask {
  position: relative;
  &::after {
    content: '';
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, .3);
    z-index: 2100;
  }
  &:hover {
    background-color: #fff !important;
  }
}
</style>
