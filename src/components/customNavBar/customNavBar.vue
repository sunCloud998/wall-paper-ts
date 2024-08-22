<template>
  <view class="layout">
    <view class="navbar">
      <view class="statusBar" :style="{ height: getStatusBarHeight() + 'px' }"></view>
      <view class="titleBar" :style="{ height: getTitleBarHeight() + 'px', marginLeft: getLeftIconLeft() + 'px' }">
        <view class="title">{{ title }}</view>
        <navigator url="/pages/search/search" class="search">
          <uni-icons class="icon" type="search" color="#888" size="18" />
          <text class="text">搜索</text>
        </navigator>
      </view>
    </view>

    <view class="fill" :style="{ height: getNavBarHeight() + 'px' }"></view>
  </view>
</template>

<script lang="ts" setup>
import { getStatusBarHeight, getTitleBarHeight, getNavBarHeight, getLeftIconLeft } from "@/utils/system"
defineProps({
  title: {
    type: String,
    default: "壁纸"
  }
});
</script>

<style lang="scss" scoped>
.layout {
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    background:
      linear-gradient(to bottom, transparent, #fff 400rpx),
      linear-gradient(to right, #beecd8 25%, #f2b7b4);

    .titleBar {
      display: flex;
      align-items: center;
      /* #ifdef H5 */
      justify-content: space-between;
      /* #endif */
      padding: 0 30rpx;

      .title {
        font-size: 28rpx;
        font-weight: 700;
        color: $text-font-color-1;
      }

      .search {
        /* #ifdef H5 */
        flex: 1;
        /* #endif */
        /* #ifndef H5 */
        width: 220rpx;
        /* #endif */
        height: 50rpx;
        border-radius: 60rpx;
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid #fff;
        margin-left: 30rpx;
        color: #999;
        font-size: 28rpx;
        display: flex;
        align-items: center;

        .icon {
          margin-left: 5rpx;
        }

        .text {
          padding-left: 10rpx;
        }
      }
    }
  }
}
</style>