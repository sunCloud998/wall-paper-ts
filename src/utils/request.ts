import type { ResData } from "@/services/types";
const BASE_URL = "https://tea.qingnian8.com/api/bizhi";

export function request<T>(config: UniApp.RequestOptions) {
  let { url, data = {}, method = "GET", header = {} } = config;
  url = BASE_URL + url;
  header["access-key"] = "sun12345";
  return new Promise<ResData<T>>((resolve, reject) => {
    uni.request({
      url,
      data,
      method,
      header,
      // 响应成功
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 提取核心数据 res.data
          let resData = res.data as ResData<T>;
          if (resData.errCode === 0) {
            resolve(resData);
          } else if (resData.errCode === 400) {
            uni.showModal({
              title: "错误提示",
              content: resData.errMsg,
              showCancel: false,
            });
            reject(resData);
          } else {
            uni.showToast({
              title: resData.errMsg,
              icon: "none",
            });
            reject(resData);
          }
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: "none",
          title: "网络错误，换个网络试试",
        });
        reject(err);
      },
    });
  });
}
