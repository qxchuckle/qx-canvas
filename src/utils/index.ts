import { Matrix } from "../math";

// 获取数组最后一个元素
export const getArrLast = <T>(arr: T[]): T | null => {
  return arr.length > 0 ? arr[arr.length - 1] : null;
};
// 两个矩阵相乘
export function matrixMultiply(m1: Matrix, m2: Matrix) {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
    ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
  };
}
// 判断线段与从某个点发出的水平向右的射线是否相交
// ox, oy 是射线起点，px1, py1, px2, py2 是线段两个端点
export function isIntersect(
  ox: number,
  oy: number,
  px1: number,
  py1: number,
  px2: number,
  py2: number
) {
  // 线段在射线下方，不可能相交
  if (py1 < oy && py2 < oy) return false;
  // 线段在射线上方，不可能相交
  if (py1 > oy && py2 > oy) return false;
  // 都在左边，不可能相交
  if (px1 < ox && px2 < ox) return false;
  // 都在右边，一定相交
  if (px1 > ox && px2 > ox) return true;
  // 到这里说明两点分布在射线对角两侧，需要计算交点 x 坐标
  // 相似三角形法计算交点 x 坐标
  const x = ((oy - py1) * (px2 - px1)) / (py2 - py1) + px1;
  // 如果交点在射线右侧，返回 true
  return x > ox;
}
// 判断两个数组的元素是否一样
export function isSameArray(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((item, index) => item === arr2[index]);
}
