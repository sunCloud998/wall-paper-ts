const SYSTEM_INFO = uni.getSystemInfoSync();

export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15;

export const getTitleBarHeight = () => {
  let titleBarHeight = 40;
  // #ifdef MP
  let { top, height } = uni.getMenuButtonBoundingClientRect();
  titleBarHeight = height + (top - getStatusBarHeight()) * 2;
  // #endif
  return titleBarHeight;
};

export const getNavBarHeight = () => getStatusBarHeight() + getTitleBarHeight();

export const getLeftIconLeft = () => {
  let leftIcon = 0;
  // #ifdef MP-TOUTIAO
  let {
    leftIcon: { left, width },
  } = tt.getCustomButtonBoundingClientRect();
  leftIcon = left + parseInt(width);
  // #endif
  return leftIcon;
};
