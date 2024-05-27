import { CanvasRenderer } from "../renderer";
import { Point } from "../math";
import { ShapeType } from "../types";
import { Shape } from "./shape";
import { GraphicsData } from "../graphics";
import { FillStyle, LineStyle } from "../graphics/style";
import { isIntersect } from "../utils";

export class Path extends Shape {
  public readonly type = ShapeType.Path;
  public readonly points: number[];
  // 记录样式状态，points 的索引作为 key，样式作为 value
  private readonly state: {
    [key: number]: {
      fillStyle?: FillStyle;
      lineStyle?: LineStyle;
      closePath?: boolean;
    };
  } = {};
  private lastStateIndex = -1;
  // 记录当前绘制样式
  private readonly fillStyle: FillStyle = new FillStyle();
  private readonly lineStyle: LineStyle = new LineStyle();
  private closePath: boolean = false;
  private path2D = {
    fillPath: new Path2D(),
    linePath: new Path2D(),
  };

  constructor(points: number[] = []) {
    super();
    this.points = points;
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

  // 添加状态
  pushState(style?: FillStyle | LineStyle, closePath: boolean = false) {
    const index = Math.max(this.points.length - 1, 0);
    if (!this.state[index]) {
      this.state[index] = {
        lineStyle: undefined,
        fillStyle: undefined,
        closePath: false,
      };
    }
    if (style) {
      if (style instanceof LineStyle) {
        this.state[index].lineStyle = style;
      } else {
        this.state[index].fillStyle = style;
      }
    }
    this.state[index].closePath = closePath;
    this.lastStateIndex = index;
    console.log(this.state);
  }

  pushClosePath() {
    if (this.lastStateIndex >= 0) {
      this.state[this.lastStateIndex].closePath = true;
    }
  }

  // 更新当前样式
  private updateStyle(
    ctx: CanvasRenderingContext2D,
    index: number,
    worldAlpha: number
  ) {
    const style = this.state[index];
    if (!style) {
      return;
    }
    if (style.lineStyle) {
      this.stroke(ctx);
      this.lineStyle.set(style.lineStyle);
      if (this.lineStyle.visible) {
        ctx.lineWidth = this.lineStyle.width;
        ctx.lineCap = this.lineStyle.cap;
        ctx.lineJoin = this.lineStyle.join;
        ctx.strokeStyle = this.lineStyle.color;
        ctx.globalAlpha = this.lineStyle.alpha * worldAlpha;
      }
    }
    if (style.fillStyle) {
      this.fill(ctx);
      this.fillStyle.set(style.fillStyle);
      if (this.fillStyle.visible) {
        ctx.fillStyle = this.fillStyle.color;
        ctx.globalAlpha = this.fillStyle.alpha * worldAlpha;
      }
    }
    this.closePath = style.closePath ?? false;
  }

  // 当前路径描边
  private stroke(ctx: CanvasRenderingContext2D) {
    if (this.lineStyle.visible && this.points.length > 0) {
      if (this.closePath) {
        this.path2D.linePath.closePath();
      }
      ctx.stroke(this.path2D.linePath);
    }
    this.path2D.linePath = new Path2D();
  }

  // 当前路径填充
  private fill(ctx: CanvasRenderingContext2D) {
    if (this.fillStyle.visible && this.points.length > 0) {
      ctx.fill(this.path2D.fillPath);
    }
    this.path2D.fillPath = new Path2D();
  }

  // 当前路径的画笔移动到指定点
  private moveTo(x: number, y: number) {
    this.fillStyle.visible && this.path2D.fillPath.moveTo(x, y);
    this.lineStyle.visible && this.path2D.linePath.moveTo(x, y);
  }

  // 当前路径的画笔连线到指定点
  private lineTo(x: number, y: number) {
    this.fillStyle.visible && this.path2D.fillPath.lineTo(x, y);
    this.lineStyle.visible && this.path2D.linePath.lineTo(x, y);
  }

  render(
    renderer: CanvasRenderer,
    data: GraphicsData,
    worldAlpha: number
  ): void {
    const ctx = renderer.ctx;
    this.updateStyle(ctx, 0, worldAlpha);
    this.updateStyle(ctx, 1, worldAlpha);
    this.moveTo(this.points[0], this.points[1]);
    for (let i = 2; i < this.points.length; i += 2) {
      const x = this.points[i];
      const y = this.points[i + 1];
      // 绘制路径
      if (Number.isNaN(x) || Number.isNaN(y)) {
        this.moveTo(this.points[i + 2], this.points[i + 3]);
      } else {
        this.lineTo(x, y);
      }
      // 更新样式
      this.updateStyle(ctx, i, worldAlpha);
      this.updateStyle(ctx, i + 1, worldAlpha);
    }
    // 应用最后一次状态
    if (this.lastStateIndex >= 0) {
      this.stroke(ctx);
      this.fill(ctx);
    }
    this.lineStyle.reset();
    this.fillStyle.reset();
  }

  pushPoint(x: number, y: number) {
    this.points.push(x, y);
  }
}