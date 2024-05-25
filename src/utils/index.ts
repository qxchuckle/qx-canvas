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
