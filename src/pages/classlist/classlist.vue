<template>
  <view class="classlist">

    <view class="loadingLayout" v-if="!classList.length && !noData">
      <uni-load-more status="loading" />
    </view>

    <view class="content">
      <navigator :url="`/pages/preview/preview?id=${item._id}&name=${pageName}`" class="item" v-for="item in classList"
        :key="item._id">
        <image :src="item.smallPicurl" mode="aspectFill" />
      </navigator>
    </view>

    <view class="loadingLayout" v-if="classList.length || noData">
      <uni-load-more :status="noData ? 'noMore' : 'loading'" />
    </view>

  </view>
</template>

<script lang="ts" setup>
import { apiGetClassList, apiHistoryList } from '@/services/api';
import { ResData, UserWallListData, WallListData } from '@/services/types';
import type { ClassListParam } from '@/services/pages';

const classList = ref<WallListData[]>([])
const noData = ref(false)
let pageName: string;

const queryParams = {
  pageNum: 1,
  pageSize: 12,
  classid: null,
  type: null
}

onLoad(((options: ClassListParam) => {
  let { id = null, name = null, type = null } = options
  if (id) {
    // id有值：从分类或者首页跳转过来
    queryParams.classid = id
  }
  if (type) {
    // type有值：从用户页面跳转过来
    queryParams.type = type
  }
  pageName = name
  //修改导航标题
  uni.setNavigationBarTitle({
    title: name,
  })
  getClassList()
}))

// 上拉加载
onReachBottom(() => {
  if (noData.value) {
    return
  }
  queryParams.pageNum++
  getClassList()
})

// 分享给好友
onShareAppMessage((e) => {
  return {
    title: `壁纸-${pageName}`,
    path: `/pages/classlist/classlist?id=${queryParams.classid}&name=${pageName}`
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: `壁纸-${pageName}`,
    query: `id=${queryParams.classid}&name=${pageName}`
  }
})

const getClassList = async () => {
  let res: (ResData<WallListData[]> | ResData<UserWallListData[]>);
  if (queryParams.classid) {
    res = await apiGetClassList(queryParams)
  }
  if (queryParams.type) {
    res = await apiHistoryList(queryParams)
  }
  classList.value = [...classList.value, ...res.data]
  if (queryParams.pageSize > res.data.length) {
    noData.value = true
  }
  uni.setStorageSync("storeClassList", classList.value)
}

// 退出页面清空缓存
onUnload(() => {
  uni.removeStorageSync("storeClassList")
})
</script>

<style lang="scss" scoped>
.classlist {
  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    padding: 5rpx;

    .item {
      height: 440rpx;

      image {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>