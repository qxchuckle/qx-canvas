import { matrixMultiply } from "../utils";
import { Point } from "./point";

// 变换矩阵类，包含一些矩阵的基本方法
export class Matrix {
  public a: number;
  public b: number;
  public c: number;
  public d: number;
  public tx: number;
  public ty: number;
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }

  // 设置矩阵
  set(a: number, b: number, c: number, d: number, tx: number, ty: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    return this;
  }

  // 将当前矩阵右乘一个矩阵
  public append(m: Matrix) {
    const { a, b, c, d, tx, ty } = matrixMultiply(this, m);
    this.set(a, b, c, d, tx, ty);
    return this;
  }

  // 将当前矩阵左乘一个矩阵
  public prepend(m: Matrix) {
    const { a, b, c, d, tx, ty } = matrixMultiply(m, this);
    this.set(a, b, c, d, tx, ty);
    return this;
  }

  // 对传入的点应用当前矩阵变换，返回变换后的新点
  apply(p: Point) {
    const newPos = new Point();
    const x = p.x;
    const y = p.y;
    newPos.x = this.a * x + this.c * y + this.tx;
    newPos.y = this.b * x + this.d * y + this.ty;
    return newPos;
  }

  // 对传入的点应用当前矩阵的逆变换，返回变换后的新点
  applyInverse(p: Point) {
    const newPos = new Point();
    const id = 1 / (this.a * this.d + this.c * -this.b);
    const x = p.x;
    const y = p.y;
    newPos.x =
      this.d * id * x +
      -this.c * id * y +
      (this.ty * this.c - this.tx * this.d) * id;
    newPos.y =
      this.a * id * y +
      -this.b * id * x +
      (-this.ty * this.a + this.tx * this.b) * id;
    return newPos;
  }

  // 克隆当前矩阵
  public clone() {
    const matrix = new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    return matrix;
  }

  // 返回一个id，用于判断两个矩阵是否相等
  public getID() {
    // 将矩阵的参数拼接成一个字符串
    return `${this.a},${this.b},${this.c},${this.d},${this.tx},${this.ty}`;
  }
}
