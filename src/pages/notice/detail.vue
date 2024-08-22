<template>
    <view class="loadingLayout" v-if="!detail">
        <view :style="{ height: getNavBarHeight() + 'px' }"></view>
        <uni-load-more status="loading"></uni-load-more>
    </view>

    <view class="noticeLayout" v-else>
        <view class="title">
            <view class="tag" v-if="detail.select">
                <uni-tag text="置顶" inverted size="normal" type="error" />
            </view>
            <view class="font">{{ detail.title }}</view>
        </view>

        <view class="info">
            <view class="item">{{ detail.author }}</view>
            <view class="item">
                <uni-dateformat :date="detail.publish_date" format="yyyy-MM-dd hh:mm:ss" />
            </view>
        </view>

        <view class="content">
            <MpHtml :content="detail.content" />
        </view>

        <view class="count">阅读 {{ detail.view_count }}</view>
    </view>
</template>

<script lang="ts" name="" setup>
import { apiNoticeDetail } from '@/services/api';
import { NoticeDetailData } from '@/services/types';
import { getNavBarHeight } from '@/utils/system';
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'

const detail = ref<NoticeDetailData>(null)
let noticeId: string
onLoad((op) => {
    noticeId = op.id
    if (op.name) {
        uni.setNavigationBarTitle({
            title: op.name,
        })
    }
    getNoticeDetail()
})

const getNoticeDetail = () => {
    apiNoticeDetail({ id: noticeId }).then(res => {
        detail.value = res.data
    })
}

</script>

<style lang="scss" scoped>
.noticeLayout {
    padding: 30rpx;

    .title {
        display: flex;
        align-items: center;
        font-size: 40rpx;
        color: #111;
        padding-bottom: 30rpx;
        line-height: 1.6em;

        .tag {
            transform: scale(0.8);
            transform-origin: left center;
            flex-shrink: 0;
        }

        .font {
            padding-left: 6rpx;
        }
    }

    .info {
        display: flex;
        align-items: center;
        color: #999;
        font-size: 28rpx;

        .item {
            padding-right: 20rpx;
        }
    }

    .content {
        padding: 50rpx 0;
    }

    .count {
        color: #999;
        font-size: 28rpx;
    }
}
</style>