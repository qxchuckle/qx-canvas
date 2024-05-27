import { CanvasRenderer } from "../renderer";
import { Point } from "../math";
import { ShapeType } from "../types";
import { Shape } from "./shape";
import { GraphicsData } from "../graphics";
import { isIntersect } from "../utils";

// 多边形，可以是封闭也可以是开放的，它是复杂图形的基础
export class Polygon extends Shape {
  public readonly type = ShapeType.Polygon;
  // 多边形的顶点，每两个元素组成一个点
  public points: number[];
  public closePath: boolean;

  constructor(points: number[], closePath: boolean = false) {
    super();
    this.points = points;
    this.closePath = closePath;
  }

  contains(p: Point): boolean {
    // 相交计数
    let count = 0;
    const len = this.points.length;
    // 遍历每条边
    for (let i = 0; i < len - 2; i += 2) {
      // 射线与边相交，则相交计数加一
      if (
        isIntersect(
          p.x,
          p.y,
          this.points[i],
          this.points[i + 1],
          this.points[i + 2],
          this.points[i + 3]
        )
      ) {
        count++;
      }
    }
    // 还需要判断起点和终点的连线
    if (
      isIntersect(
        p.x,
        p.y,
        this.points[0],
        this.points[1],
        this.points[len - 2],
        this.points[len - 1]
      )
    ) {
      count++;
    }
    // 如果相交次数为奇数，则点在多边形内
    if (count % 2 === 0) {
      return false;
    } else {
      return true;
    }
  }

  render(renderer: CanvasRenderer, data: GraphicsData): void {
    const ctx = renderer.ctx;
    const fillStyle = data.fillStyle;
    const lineStyle = data.lineStyle;
    ctx.moveTo(this.points[0], this.points[1]);
    for (let i = 2; i < this.points.length; i += 2) {
      const x = this.points[i];
      const y = this.points[i + 1];
      if (Number.isNaN(x) || Number.isNaN(y)) {
        ctx.moveTo(this.points[i + 2], this.points[i + 3]);
      } else {
        ctx.lineTo(x, y);
      }
    }
    if (this.closePath) {
      ctx.closePath();
    }
    if (fillStyle.visible) {
      ctx.fill();
    }
    if (lineStyle.visible) {
      ctx.stroke();
    }
  }

  reset() {
    this.points = [];
    this.closePath = false;
  }

  clone(): Polygon {
    return new Polygon(this.points.slice(), this.closePath);
  }
}
