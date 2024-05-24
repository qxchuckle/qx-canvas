import { Point } from "../math";
import { ShapeType } from "../types";
import { Shape } from "./shape";

// 矩形
export class Rectangle extends Shape {
  public readonly type = ShapeType.Rectangle;
  // 矩形左上角坐标
  public x: number;
  public y: number;
  // 矩形宽高
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(p: Point): boolean {
    if (
      p.x > this.x &&
      p.x < this.x + this.width &&
      p.y > this.y &&
      p.y < this.y + this.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
