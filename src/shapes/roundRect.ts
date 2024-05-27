import { CanvasRenderer } from "../renderer";
import { Point } from "../math";
import { ShapeType } from "../types";
import { Shape } from "./shape";
import { GraphicsData } from "../graphics";

export class RoundRect extends Shape {
  public readonly type = ShapeType.RoundRect;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public radius: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // 圆角矩形的圆角半径不能大于矩形宽高的最小值的一半
    const r = Math.min(width, height) / 2;
    this.radius = radius > r ? r : radius;
  }

  contains(p: Point): boolean {
    // 如果点在矩形外部，返回false
    if (
      !(
        p.x > this.x &&
        p.x < this.x + this.width &&
        p.y > this.y &&
        p.y < this.y + this.height
      )
    ) {
      return false;
    }
    // 还需要判断点是否在圆角矩形的四个圆角内
    // 左上角圆角圆心
    const x1 = this.x + this.radius;
    const y1 = this.y + this.radius;
    if (p.x < x1 && p.y < y1) {
      return (
        Math.pow(p.x - x1, 2) + Math.pow(p.y - y1, 2) <=
        Math.pow(this.radius, 2)
      );
    }
    // 右上角圆角圆心
    const x2 = this.x + this.width - this.radius;
    const y2 = this.y + this.radius;
    if (p.x > x2 && p.y < y2) {
      return (
        Math.pow(p.x - x2, 2) + Math.pow(p.y - y2, 2) <=
        Math.pow(this.radius, 2)
      );
    }
    // 左下角圆角圆心
    const x3 = this.x + this.radius;
    const y3 = this.y + this.height - this.radius;
    if (p.x < x3 && p.y > y3) {
      return (
        Math.pow(p.x - x3, 2) + Math.pow(p.y - y3, 2) <=
        Math.pow(this.radius, 2)
      );
    }
    // 右下角圆角圆心
    const x4 = this.x + this.width - this.radius;
    const y4 = this.y + this.height - this.radius;
    if (p.x > x4 && p.y > y4) {
      return (
        Math.pow(p.x - x4, 2) + Math.pow(p.y - y4, 2) <=
        Math.pow(this.radius, 2)
      );
    }
    return true;
  }

  render(renderer: CanvasRenderer, data: GraphicsData) {
    const ctx = renderer.ctx;
    ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
    const fillStyle = data.fillStyle;
    const lineStyle = data.lineStyle;
    if (fillStyle.visible) {
      ctx.fill();
    }
    if (lineStyle.visible) {
      ctx.stroke();
    }
  }
}
