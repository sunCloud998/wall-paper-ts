<template>
    <view class="classLayout pageBg">
        <!-- #ifndef MP-TOUTIAO -->
        <customNavBar title="分类"></customNavBar>
        <!-- #endif -->
        <view class="classify">
            <themeItem v-for="item in classifyList" :key="item._id" :item="item"></themeItem>
        </view>
    </view>
</template>

<script lang="ts" name="" setup>
import { ref, type Ref } from 'vue'
import themeItem from '@/components/themeItem/themeItem.vue';
import customNavBar from '@/components/customNavBar/customNavBar.vue';
import { apiGetClassify } from '@/services/api';
import { ClassifyData } from '@/services/types';

const classifyList = ref<ClassifyData[]>([])

onMounted(() => {
    getClassify()
})

const getClassify = async () => {
    let res = await apiGetClassify({
        pageSize: 15
    });
    classifyList.value = res.data
}

// 分享给好友
onShareAppMessage((e) => {
    return {
        title: "精选分类",
        path: "/pages/classify/classify"
    }
})

// 分享给朋友圈
onShareTimeline(() => {
    return {
        title: "精选分类"
    }
})

</script>

<style lang="scss" scoped>
.classify {
    padding: 30rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15rpx;
}
</style>