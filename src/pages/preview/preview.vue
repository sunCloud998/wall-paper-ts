<template>
  <view class="preview" v-if="currentInfo">
    <swiper circular :current="currentIndex" @change="swiperChange">
      <swiper-item v-for="(item, index) in classList" :key="item._id">
        <image v-if="readImgs.includes(index)" @click="maskChange" :src="item.picurl" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="mask" v-if="maskState">
      <!-- #ifndef MP-TOUTIAO -->
      <view class="goBack" @click="goBack" :style="{ top: getStatusBarHeight() + 'px' }">
        <uni-icons type="back" color="#fff" size="20" />
      </view>
      <!-- #endif -->
      <view class="count">{{ currentIndex + 1 }} / {{ classList.length }}</view>
      <view class="time">
        <uni-dateformat :date="Date.now()" format="hh:mm" />
      </view>
      <view class="date">
        <uni-dateformat :date="Date.now()" format="MM月dd日" />
      </view>
      <view class="footer">
        <view class="box" @click="clickInfo">
          <uni-icons type="info" size="28" />
          <view class="text">信息</view>
        </view>

        <view class="box" @click="clickScore">
          <uni-icons type="star" size="28" />
          <view class="text">{{ isNaN(Number(currentInfo.score)) ? "未评" : currentInfo.score }}分</view>
        </view>

        <view class="box" @click="clickDownload">
          <uni-icons type="download" size="23" />
          <view class="text">下载</view>
        </view>
      </view>
    </view>

    <uni-popup ref="infoPopup" type="bottom">
      <view class="infoPopup">
        <view class="popHeader">
          <view></view>
          <view class="title">壁纸信息</view>
          <view class="close" @click="clickInfoClose">
            <uni-icons type="closeempty" color="#999" size="18" />
          </view>
        </view>
        <scroll-view scroll-y>
          <view class="content">
            <view class="row">
              <view class="label">壁纸ID:</view>
              <view selectable class="value">{{ currentInfo._id }}</view>
            </view>
            <view class="row">
              <view class="label">分类:</view>
              <view class="value class">{{ classifyName }}</view>
            </view>
            <view class="row">
              <view class="label">发布者:</view>
              <view class="value">{{ currentInfo.nickname }}</view>
            </view>
            <view class="row">
              <view class="label">评分:</view>
              <view class="value roteBox">
                <uni-rate readonly touchable :value="Number(currentInfo.score)" size="16" />
                <text class="score">{{ currentInfo.score }}分</text>
              </view>
            </view>
            <view class="row">
              <view class="label">摘要：</view>
              <view class="value">
                {{ currentInfo.description }}
              </view>
            </view>
            <view class="row">
              <view class="label">标签：</view>
              <view class="value tabs">
                <view class="tab" v-for="item in currentInfo.tabs">{{ item }}</view>
              </view>
            </view>
            <view class="copyright">
              声明：本图片来用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸ID举报至平台，邮箱513894357@qq.com，管理将删除侵权壁纸，维护您的权益。
            </view>
            <view class="safe-area-inset-bottom"></view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <uni-popup ref="scorePopup" :is-mask-click="false">
      <view class="scorePopup">
        <view class="popHeader">
          <view></view>
          <view class="title">{{ isScore ? '评过分了~' : '壁纸评分' }}</view>
          <view class="close" @click="clickScoreClose">
            <uni-icons type="closeempty" color="#999" size="18" />
          </view>
        </view>

        <view class="content">
          <uni-rate v-model="userScore" :disabled="isScore" disabled-color="#FFCA3E" allowHalf />
          <text class="text">{{ userScore }}分</text>
        </view>

        <view class="footer">
          <button @click="submitScore" :disabled="isScore" type="default" size="mini" plain>确认评分</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { WallListData } from '@/services/types';
import { getStatusBarHeight } from '@/utils/system';
import { apiScoreWall, apiWallDownload, apiWallDetail } from '@/services/api';
import { ref } from 'vue';

const maskState = ref(true)
const infoPopup = ref()
const scorePopup = ref()
const userScore = ref<string>("0")
const classList = ref<WallListData[]>([])
const currentId = ref<string>()
const currentIndex = ref(0)
const currentInfo = ref<WallListData>(null)
const isScore = ref(false)
const readImgs = ref([])
let classifyName = "未知"

const storeClassList = uni.getStorageSync<WallListData[]>("storeClassList") || []
classList.value = storeClassList.map(item => {
  return {
    ...item,
    picurl: item.smallPicurl.replace("_small.webp", ".jpg")
  }
})

// 获取组件传递的参数
onLoad(async (e) => {
  currentId.value = e.id
  // 预览图片分享后点击查看(没有缓存数据，所以需要调用接口查询)
  if (e.type === "share") {
    let res = await apiWallDetail({ id: currentId.value })
    classList.value = res.data.map(item => {
      return {
        ...item,
        picurl: item.smallPicurl.replace("_small.webp", ".jpg")
      }
    })
  }
  if (e.name) {
    classifyName = e.name
  }
  currentIndex.value = classList.value.findIndex(item => item._id === currentId.value)
  currentInfo.value = classList.value[currentIndex.value]
  readImagesArr()
})

// 滑动预览图片
const swiperChange = (e) => {
  currentIndex.value = e.detail.current
  currentInfo.value = classList.value[currentIndex.value]
  readImagesArr()
}

// 信息弹窗
const clickInfo = () => {
  infoPopup.value.open()
}
// 返回上一层
const goBack = () => {
  uni.navigateBack({
    success: () => {
      console.log("预览返回成功")
    },
    fail: (err) => {
      uni.reLaunch({
        url: '/pages/index/index',
      })
    }
  });
}
// 关闭信息弹窗
const clickInfoClose = () => {
  infoPopup.value.close();
}
// 评分弹框
const clickScore = () => {
  if (currentInfo.value.score && !isNaN(Number(currentInfo.value.score))) {
    isScore.value = true
    userScore.value = currentInfo.value.score
  }
  scorePopup.value.open();
}
// 关闭评分弹窗
const clickScoreClose = () => {
  scorePopup.value.close();
  userScore.value = "0"
  isScore.value = false
}
// 预览状态
const maskChange = () => {
  maskState.value = !maskState.value
}
// 评分
const submitScore = async () => {
  try {
    uni.showLoading({
      title: '加载中....',
    })
    let { classid, _id: wallId } = currentInfo.value
    let res = await apiScoreWall({
      classid,
      wallId,
      userScore: userScore.value
    })
    if (res.errCode === 0) {
      uni.showToast({
        title: "评分成功"
      })
      classList.value[currentIndex.value].score = userScore.value
      classList.value[currentIndex.value].userScore = userScore.value
      // 更新缓存
      uni.setStorageSync("storeClassList", classList.value)
      currentInfo.value.score = userScore.value
      clickScoreClose()
    }
  } finally {
    uni.hideLoading()
  }
}

//下载
const clickDownload = async () => {
  // #ifdef H5
  uni.showModal({
    content: "请长按保存壁纸",
    showCancel: false,
  })
  // #endif
  // #ifndef H5
  try {
    uni.showLoading({
      title: '下载中...',
      mask: true,
    })
    // 提交下载记录
    let { classid, _id: wallId } = currentInfo.value
    let res = await apiWallDownload({
      classid,
      wallId
    })
    if (res.errCode != 0) {
      throw res
    }
    uni.getImageInfo({
      src: currentInfo.value.picurl,
      success: (success) => {
        uni.saveImageToPhotosAlbum({
          filePath: success.path,
          success: (success) => {
            uni.showToast({
              title: "保存成功，请到相册查看"
            })
          },
          fail: (fail) => {
            if (fail.errMsg == "saveImageToPhotosAlbum:fail cancel") {
              uni.showToast({
                title: "下载失败，请重新点击下载"
              })
              return
            }
            uni.showModal({
              title: '授权提示',
              content: '需要授权保存相册',
              success: (success) => {
                if (success.confirm) {
                  uni.openSetting({
                    success(result) {
                      if (result.authSetting['scope.writePhotosAlbum']) {
                        uni.showToast({
                          title: "获取授权成功"
                        })
                      } else {
                        uni.showToast({
                          title: "获取授权失败"
                        })
                      }
                    },
                  })
                }
              },
            })
          },
        })
      },
      complete: (complete) => {
        uni.hideLoading()
      },
    })
  } catch (err) {
    uni.hideLoading()
  }
  // #endif
}

// 分享给朋友
onShareAppMessage(() => {
  return {
    title: "好看壁纸",
    path: `/pages/preview/preview?id=${currentId.value}&type=share`
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: "好看壁纸",
    query: `id=${currentId.value}&type=share`
  }
})

const readImagesArr = () => {
  readImgs.value.push(
    currentIndex.value <= 0 ? classList.value.length - 1 : currentIndex.value - 1,
    currentIndex.value,
    currentIndex.value >= classList.value.length - 1 ? 0 : currentIndex.value + 1
  )
}
</script>

<style lang="scss" scoped>
.preview {
  width: 100%;
  height: 100vh;
  position: relative;

  swiper {
    width: 100%;
    height: 100%;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .mask {
    &>view {
      position: absolute;
      left: 0;
      margin: auto;
      color: #fff;
      right: 0;
      width: fit-content;
    }

    .goBack {
      width: 38rpx;
      height: 38rpx;
      background: rgba(0, 0, 0, 0.5);
      left: 30rpx;
      margin-left: 0;
      border-radius: 100rpx;
      top: 0;
      backdrop-filter: blur(10rpx);
      border: 1rpx solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .count {
      top: 10vh;
      background: rgba(0, 0, 0, 0.3);
      font-size: 28rpx;
      border-radius: 40rpx;
      padding: 8rpx 28rpx;
      backdrop-filter: blur(10rpx);
    }

    .time {
      font-size: 140rpx;
      top: calc(10vh + 80rpx);
      font-weight: 300;
      line-height: 1em;
      text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
    }

    .date {
      font-size: 34rpx;
      top: calc(10vh + 240rpx);
      text-shadow: 0 2rpx rgba(0, 0, 0, 0.3);
    }

    .footer {
      background: rgba(255, 255, 255, 0.8);
      bottom: 10vh;
      width: 65vw;
      height: 120rpx;
      border-radius: 120rpx;
      color: #000;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(20rpx);

      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rpx 12rpx;

        .text {
          font-size: 26rpx;
          color: $text-font-color-2;
        }
      }
    }
  }

  .popHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      color: $text-font-color-2;
      font-size: 26rpx;
    }

    .close {
      padding: 6rpx;
    }
  }

  .infoPopup {
    background: #fff;
    padding: 30rpx;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;

    scroll-view {
      max-height: 60vh;

      .content {
        .row {
          display: flex;
          padding: 16rpx 0;
          font-size: 32rpx;
          line-height: 1.7em;

          .label {
            color: $text-font-color-3;
            width: 120rpx;
            text-align: right;
            font-size: 30rpx;
          }

          .value {
            flex: 1;
            width: 0;
            margin-left: 10rpx;
          }

          .roteBox {
            display: flex;
            align-items: center;

            .score {
              font-size: 26rpx;
              color: $text-font-color-2;
              padding-left: 10rpx;
            }
          }

          .tabs {
            display: flex;
            flex-wrap: wrap;

            .tab {
              border: 1px solid $brand-theme-color;
              color: $brand-theme-color;
              font-size: 22rpx;
              padding: 10rpx 30rpx;
              border-radius: 40rpx;
              line-height: 1em;
              margin: 0 10rpx 10rpx 0;
            }
          }

          .class {
            color: $brand-theme-color;
          }
        }

        .copyright {
          font-size: 28rpx;
          padding: 20rpx;
          background: #F6F6F6;
          color: #666;
          border-radius: 10rpx;
          margin: 20rpx 0;
          line-height: 1.6em;
        }
      }
    }
  }

  .scorePopup {
    background: #fff;
    padding: 30rpx;
    width: 70vw;
    border-radius: 30rpx;

    .content {
      padding: 30rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .text {
        color: #FFCA3E;
        padding-left: 10rpx;
        width: 80rpx;
        line-height: 1em;
        text-align: right;
        font-size: 28rpx;
      }
    }

    .footer {
      padding: 10rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>