export interface ResData<T> {
  errCode: number;
  errMsg: string;
  data: T;
  total?: number;
  timeCost?: number;
}

// 首页轮播数据类型
export interface BannerData {
  _id: string;
  sort: number;
  target: string;
  picurl: string;
  url: string;
  appid: string;
}

// 分类
export interface ClassifyData {
  name: string;
  sort?: number;
  picurl?: string;
  select?: boolean;
  updateTime?: number;
  _id?: string;
}

// 分类中的数据列表
export interface WallListData {
  description: string;
  classid: string;
  smallPicurl: string;
  tabs: string[];
  _id: string;
  score: string;
  nickname: string;
  picurl?: string;
  userScore?: string;
}

// 评分
export interface ScoreData {
  id: string;
}

// 每日推荐
export interface RandomWallData {
  description: string;
  classid: string;
  smallPicurl: string;
  tabs: string[];
  _id: string;
  score: string;
  nickname: string;
}

// 壁纸详情
export interface DetailWallData {
  _id: string;
  description: string;
  classid: string;
  smallPicurl: string;
  tabs: string[];
  score: string;
  nickname: string;
}

// 壁纸下载
export interface DownloadWallData {
  id: string;
}

// 用户评分或者下载列表
export interface UserWallListData {
  classid: string;
  createTime: number;
  userScore: string;
  _id: string;
  classname: string;
  description: string;
  nickname: string;
  score: string;
  smallPicurl: string;
  tabs: string[];
}

// 用户地址
export interface UserAddres {
  country: string;
  province: string;
  city: string;
}

// 用户信息
export interface UserInfoData {
  IP: string;
  address: UserAddres;
  downloadSize: number;
  scoreSize: number;
}

// 公告列表
export interface NoticeListData {
  _id: string;
  view_count: number;
  publish_date: number;
  title: string;
  author: string;
  select: boolean;
}

// 公告详情
export interface NoticeDetailData {
  _id: string;
  view_count: number;
  publish_date: number;
  article_status: number;
  title: string;
  author: string;
  content: string;
  select: boolean;
}

// 搜索
export interface SearchWallData {
  description: string;
  classid: string;
  smallPicurl: string;
  tabs: string[];
  _id: string;
  score: string;
  nickname: string;
}
