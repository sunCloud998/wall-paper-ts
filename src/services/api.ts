import { request } from "@/utils/request";
import type { BannerData } from "@/services/types";
import type { ClassifyData } from "@/services/types";
import type { WallListData } from "@/services/types";
import type { ScoreData } from "@/services/types";
import type { RandomWallData } from "@/services/types";
import type { DetailWallData } from "@/services/types";
import type { DownloadWallData } from "@/services/types";
import type { UserWallListData } from "@/services/types";
import type { UserInfoData, UserAddres } from "@/services/types";
import type { NoticeDetailData } from "@/services/types";
import type { SearchWallData } from "@/services/types";
import type { NoticeListData } from "@/services/types";

export function apiGetBanner() {
  return request<BannerData[]>({ url: "/homeBanner" });
}

export function apiGetDayRandom() {
  return request<RandomWallData[]>({ url: "/randomWall" });
}

export function apiGetNotice(data = {}) {
  return request<NoticeListData[]>({
    url: "/wallNewsList",
    data,
  });
}

export function apiGetClassify<T>(data = {}) {
  return request<ClassifyData[]>({
    url: "/classify",
    data,
  });
}

export function apiGetClassList(data = {}) {
  return request<WallListData[]>({
    url: "/wallList",
    data,
  });
}

export function apiScoreWall(data = {}) {
  return request<ScoreData>({
    url: "/setupScore",
    data,
  });
}

// 下载记录
export function apiWallDownload(data = {}) {
  return request<DownloadWallData>({
    url: "/downloadWall",
    data,
  });
}

export function apiWallDetail(data = {}) {
  return request<DetailWallData[]>({
    url: "/detailWall",
    data,
  });
}

// 用户信息
export function apiUserInfo(data = {}) {
  return request<UserInfoData>({
    url: "/userInfo",
    data,
  });
}

// 下载和评价记录
export function apiHistoryList(data = {}) {
  return request<UserWallListData[]>({
    url: "/userWallList",
    data,
  });
}

// 公告详情
export function apiNoticeDetail(data = {}) {
  return request<NoticeDetailData>({
    url: "/wallNewsDetail",
    data,
  });
}

// 搜索
export function apiSearchData(data = {}) {
  return request<SearchWallData[]>({
    url: "/searchWall",
    data,
  });
}
