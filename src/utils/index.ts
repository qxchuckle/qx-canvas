// 获取数组最后一个元素
export const getArrLast = <T>(arr: T[]): T | null => {
  return arr.length > 0 ? arr[arr.length - 1] : null;
};
