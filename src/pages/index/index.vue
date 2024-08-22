<template>
	<view class="homeLayout pageBg">
		<!-- #ifndef MP-TOUTIAO -->
		<customNavBar title="推荐"></customNavBar>
		<!-- #endif -->
		<!--顶部区域-->
		<view class="banner">
			<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff"
				autoplay>
				<swiper-item v-for="item in bannerList" :key="item._id">
					<!--点击打开其他小程序-->
					<navigator v-if="item.target === 'miniProgram'" :url="item.url" class="like" target="miniProgram"
						:app-id="item.appid">
						<image :src="item.picurl" mode="aspectFill"></image>
					</navigator>
					<navigator v-else :url="`/pages/classlist/classlist?${item.url}`" class="like">
						<image :src="item.picurl" mode="aspectFill"></image>
					</navigator>
				</swiper-item>
			</swiper>
		</view>

		<!--公告区域-->
		<view class="notice">
			<view class="left">
				<uni-icons type="sound-filled" size="20"></uni-icons>
				<text class="text">公告</text>
			</view>

			<view class="center">
				<swiper vertical autoplay circular :interval="1500" :duration="300">
					<swiper-item v-for="item in noticeList" :key="item._id">
						<navigator :url="`/pages/notice/detail?id=${item._id}`">
							{{ item.title }}
						</navigator>
					</swiper-item>
				</swiper>
			</view>

			<view class="right">
				<uni-icons type="right" color="#333" size="16" />
			</view>
		</view>

		<!--推荐区域-->
		<view class="select">
			<commonTitle>
				<template #name>每日推荐</template>
				<template #custom>
					<view class="date">
						<uni-icons type="calendar" size="18" />
						<view class="text">
							<uni-dateformat :date="Date.now()" format="dd日" />
						</view>
					</view>
				</template>
			</commonTitle>
			<view class="content">
				<scroll-view scroll-x>
					<view class="box" v-for="item in randomList" :key="item._id" @click="goPreview(item._id)">
						<image :src="item.smallPicurl" mode="aspectFill" />
					</view>
				</scroll-view>
			</view>
		</view>

		<!--精选区域-->
		<view class="theme">
			<commonTitle>
				<template #name>专题精选</template>
				<template #custom>
					<navigator url="/pages/classify/classify" open-type="reLaunch" class="more">More+</navigator>
				</template>
			</commonTitle>

			<view class="content">
				<themeItem v-for="item in classifyList" :key="item._id" :item="item"></themeItem>
				<themeItem :isMore="true"></themeItem>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import commonTitle from '@/components/commonTitle/commonTitle.vue';
import themeItem from '@/components/themeItem/themeItem.vue';
import customNavBar from '@/components/customNavBar/customNavBar.vue';
import { onMounted, ref } from 'vue';
import { apiGetBanner, apiGetClassify, apiGetDayRandom, apiGetNotice } from '@/services/api';
import type { BannerData, ClassifyData, NoticeListData, RandomWallData } from '@/services/types';

const bannerList = ref<BannerData[]>([])
const randomList = ref<RandomWallData[]>([])
const noticeList = ref<NoticeListData[]>([])
const classifyList = ref<ClassifyData[]>([])

onMounted(() => {
	getBannerData()
	getDayRandom()
	getNoticeData()
	getClassify()
})

// 每日推荐跳转预览页面
const goPreview = (id: string) => {
	uni.setStorageSync("storeClassList", randomList.value)
	uni.navigateTo({
		url: `/pages/preview/preview?id=${id}`
	})
}
// 轮播图
const getBannerData = async () => {
	let res = await apiGetBanner()
	bannerList.value = res.data
}
// 每日推荐
const getDayRandom = async () => {
	let res = await apiGetDayRandom()
	randomList.value = res.data
}
// 公告
const getNoticeData = async () => {
	let res = await apiGetNotice({ select: true })
	noticeList.value = res.data
}
// 精选
const getClassify = async () => {
	let res = await apiGetClassify({ select: true });
	classifyList.value = res.data
}

// 分享给好友
onShareAppMessage(() => {
	return {
		title: "好看的手机壁纸",
		path: "/pages/classify/classify"
	}
})

// 分享到朋友圈
onShareTimeline(() => {
	return {
		title: "好看的壁纸"
	}
})

</script>

<style lang="scss" scoped>
.homeLayout {
	.banner {
		width: 750rpx;
		padding: 30rpx 0;

		swiper {
			width: 750rpx;
			height: 340rpx;

			&-item {
				width: 100%;
				height: 100%;
				padding: 0 30rpx;

				.like {
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
			}
		}
	}

	.notice {
		width: 690rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #f9f9f9;
		margin: 0 auto;
		border-radius: 80rpx;
		display: flex;

		.left {
			width: 140rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			:deep() {
				.uni-icons {
					color: $brand-theme-color !important;
				}
			}

			.text {
				color: $brand-theme-color;
				font-weight: 600;
				font-size: 28rpx;
			}
		}

		.center {
			flex: 1;

			swiper {
				height: 100%;

				&-item {
					height: 100%;
					font-size: 30rpx;
					color: #666;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}

		.right {
			width: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.select {
		padding-top: 50rpx;

		.date {
			color: $brand-theme-color;
			display: flex;
			align-items: center;

			:deep() {
				.uni-icons {
					color: $brand-theme-color !important;
				}
			}

			.text {
				margin-left: 5rpx;
			}
		}

		.content {
			width: 720rpx;
			margin-left: 30rpx;
			margin-top: 30rpx;

			scroll-view {
				white-space: nowrap;

				.box {
					width: 200rpx;
					height: 430rpx;
					display: inline-block;
					margin-right: 15rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}

				.box:last-child {
					margin-right: 30rpx;
				}
			}
		}
	}

	.theme {
		padding: 50rpx 0;

		.more {
			font-size: 32rpx;
			color: #888;
		}

		.content {
			margin-top: 30rpx;
			padding: 0 30rpx;
			display: grid;
			gap: 15rpx;
			grid-template-columns: repeat(3, 1fr);
		}
	}
}
</style>
