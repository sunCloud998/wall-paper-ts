<template>
  <view class="searchLayout">
    <view class="search">
      <uni-search-bar focus v-model="queryParams.keyword" @confirm="onSearch" @cancel="onClear" @clear="onClear" />
    </view>

    <view v-if="!classList.length || noSearch">
      <!--搜索历史-->
      <view class="history" v-if="historySearch.length">
        <view class="topTitle">
          <view class="text">最近搜索</view>
          <view class="icon" @click="removeHistory">
            <uni-icons type="trash" size="25" />
          </view>
        </view>

        <view class="tabs">
          <view class="tab" v-for="tab in historySearch" :key="tab" @click="clickTab(tab)"> {{ tab }}</view>
        </view>
      </view>
      <!--热门搜索-->
      <view class="recommend">
        <view class="topTitle">
          <view class="text">热门搜索</view>
        </view>
        <view class="tabs">
          <view class="tab" v-for="tab in recommendList" :key="tab" @click="clickTab(tab)">{{ tab }}</view>
        </view>
      </view>
    </view>

    <view class="noSearch" v-if="noSearch">
      <uv-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png"></uv-empty>
    </view>

    <!--搜索内容-->
    <view v-else>
      <view class="list">
        <navigator :url="`/pages/preview/preview?id=${item._id}`" class="item" v-for="item in classList"
          :key="item._id">
          <image :src="item.smallPicurl" mode="aspectFill" />
        </navigator>
      </view>
      <view class="loadingLayout" v-if="noData || classList.length">
        <uni-load-more :status="noData ? 'noMore' : 'loading'" />
      </view>
    </view>

  </view>
</template>

<script lang="ts" setup>
import { apiSearchData } from '@/services/api';
import { SearchWallData } from '@/services/types';

const queryParams = ref({
  pageNum: 1,
  pageSize: 12,
  keyword: ""
})
//搜索历史词
const historySearch = ref<string[]>(uni.getStorageSync("historySearch") || []);

//热门搜索词
const recommendList = ref(["美女", "帅哥", "宠物", "卡通"]);

//没有更多
const noData = ref(false);
//没有搜索结果
const noSearch = ref(false);
//搜索结果列表
const classList = ref<SearchWallData[]>([]);

// 点击搜索
const onSearch = () => {
  uni.showLoading()
  historySearch.value = [...new Set([queryParams.value.keyword, ...historySearch.value])].slice(0, 10)
  uni.setStorageSync("historySearch", historySearch.value)
  initData(queryParams.value.keyword)
  searchData()
}

// 点击清除按钮
const onClear = () => {
  initData()
}

// 清空搜索记录
const removeHistory = () => {
  uni.showModal({
    title: '是否清空历史搜索?',
    success: (success) => {
      if (success.confirm) {
        uni.removeStorageSync("historySearch")
        historySearch.value = []
      }
    },
  })
}

// 点击标签搜索
const clickTab = (tab: string) => {
  initData(tab)
  onSearch()
}

// 触底加载更多
onReachBottom(() => {
  if (noData.value) {
    return;
  }
  queryParams.value.pageNum++
  searchData()
})

// 清除搜索数据缓存
onUnload(() => {
  uni.removeStorageSync("storgClassList")
})

// 搜索
const searchData = async () => {
  try {
    let res = await apiSearchData(queryParams.value)
    classList.value = [...classList.value, ...res.data]
    uni.setStorageSync("storeClassList", classList.value)
    if (queryParams.value.pageSize > res.data.length) {
      noData.value = true
    }
    if (res.data.length === 0 && classList.value.length === 0) {
      noSearch.value = true
    }
  } finally {
    uni.hideLoading()
  }

}

// 初始化数据
const initData = (key = "") => {
  classList.value = []
  noData.value = false
  noSearch.value = false
  queryParams.value = {
    pageNum: 1,
    pageSize: 12,
    keyword: key
  }
}

</script>

<style lang="scss" scoped>
.searchLayout {
  .search {
    padding: 0 10rpx;
  }

  .topTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32rpx;
    color: #999;
  }

  .history {
    padding: 30rpx;
  }

  .recommend {
    padding: 30rpx;
  }

  .tabs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 20rpx;

    .tab {
      background: #f4f4f4;
      font-size: 28rpx;
      color: #333;
      padding: 10rpx 28rpx;
      border-radius: 50rpx;
      margin-right: 20rpx;
      margin-top: 20rpx;
    }
  }

  .list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    padding: 20rpx 5rpx;

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