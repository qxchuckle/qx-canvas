import {
  Rectangle,
  Shape,
  Circle,
  Ellipse,
  RoundRect,
  Polygon,
  Path,
  Text,
} from "../shapes";
import { Group } from "../display/group";
import { CanvasRenderer } from "../renderer";
import { GraphicsData } from "./graphicsData";
import { FillStyle, LineStyle, FillStyleType, LineStyleType } from "./style";
import { Point, bezier } from "../math";
import { TextStyle } from "../types";

// Graphics 类包含一组用于创建各种形状的方法。
export class Graphics extends Group {
  // 图形数据列表
  // 一个 Graphics 对象可以包含多个图形数据
  // 若需要实现复杂操作，可以操作该列表
  public readonly graphicsDataList: GraphicsData[] = [];
  // 当前图形样式
  private readonly fillStyle: FillStyle = new FillStyle();
  private readonly lineStyle: LineStyle = new LineStyle();
  // 除了能绘制各种图形外，本身也可以自由绘制
  private currentPath = new Path();

  constructor() {
    super();
    this.drawShape(this.currentPath);
  }

  // 设置上下文样式
  private setCtxStyle = (
    ctx: CanvasRenderingContext2D,
    data: GraphicsData,
    isFill: boolean
  ) => {
    // 设置样式
    if (data.fillStyle.visible && isFill) {
      ctx.fillStyle = data.fillStyle.color;
      ctx.globalAlpha = data.fillStyle.alpha * this.worldAlpha;
      ctx.shadowOffsetX = data.fillStyle.shadowOffsetX;
      ctx.shadowOffsetY = data.fillStyle.shadowOffsetY;
      ctx.shadowBlur = data.fillStyle.shadowBlur;
      ctx.shadowColor = data.fillStyle.shadowColor;
    }
    if (data.lineStyle.visible && !isFill) {
      ctx.lineWidth = data.lineStyle.width;
      ctx.lineCap = data.lineStyle.cap;
      ctx.lineJoin = data.lineStyle.join;
      ctx.strokeStyle = data.lineStyle.color;
      ctx.globalAlpha = data.lineStyle.alpha * this.worldAlpha;
      ctx.shadowOffsetX = data.lineStyle.shadowOffsetX;
      ctx.shadowOffsetY = data.lineStyle.shadowOffsetY;
      ctx.shadowBlur = data.lineStyle.shadowBlur;
      ctx.shadowColor = data.lineStyle.shadowColor;
      ctx.setLineDash(data.lineStyle.lineDash);
    }
  };

  // 渲染自身
  protected renderSelf(renderer: CanvasRenderer) {
    const ctx = renderer.ctx;
    ctx.save();
    // 应用变换
    this.applyTransform(renderer);
    // 遍历图形数据列表，渲染图形
    for (let i = 0; i < this.graphicsDataList.length; i++) {
      const data = this.graphicsDataList[i];
      // ctx.save();
      ctx.beginPath();
      data.shape.render(renderer, data, this.worldAlpha, this.setCtxStyle);
      // ctx.restore();
    }
    ctx.restore();
    return this;
  }

  // 设置填充样式，开始填充
  public beginFill(style: Partial<FillStyleType> = {}) {
    this.fillStyle.set(style);
    this.fillStyle.visible = style.visible ?? true;
    this.currentPath.pushState(this.fillStyle.clone());
    return this;
  }

  // 设置描边样式，开始描边
  public beginLine(style: Partial<LineStyleType> = {}) {
    this.lineStyle.set(style);
    this.lineStyle.visible = style.visible ?? true;
    this.currentPath.pushState(this.lineStyle.clone());
    return this;
  }

  public beginClip() {
    this.currentPath.pushClip();
    return this;
  }

  // 绘制形状
  private drawShape(shape: Shape): void {
    // 记录此时的样式信息
    const data = new GraphicsData(
      shape,
      this.fillStyle.clone(),
      this.lineStyle.clone()
    );
    this.graphicsDataList.push(data);
  }

  // 碰撞检测
  public contains(p: Point): boolean {
    // 对点进行逆变换
    p = this.transform.worldMatrix.applyInverse(p);
    // 如果有自定义的碰撞区域，直接判断
    if (this.hitArea) {
      return this.hitArea.contains(p);
    }
    // 遍历图形数据列表，判断点是否在图形内
    for (let i = 0; i < this.graphicsDataList.length; i++) {
      const data = this.graphicsDataList[i];
      // 只有填充的形状才进行碰撞检测
      if (data.fillStyle.visible && data.shape.contains(p)) {
        return true;
      }
    }
    return false;
  }

  // 绘制矩形
  public drawRect(x: number, y: number, width: number, height: number) {
    this.drawShape(new Rectangle(x, y, width, height));
    return this;
  }

  // 绘制圆
  public drawCircle(x: number, y: number, radius: number) {
    this.drawShape(new Circle(x, y, radius));
    return this;
  }

  // 绘制椭圆
  public drawEllipse(x: number, y: number, radiusX: number, radiusY: number) {
    this.drawShape(new Ellipse(x, y, radiusX, radiusY));
    return this;
  }

  // 绘制圆角矩形
  public drawRoundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    this.drawShape(new RoundRect(x, y, width, height, radius));
    return this;
  }

  // 绘制多边形
  public drawPolygon(points: number[]) {
    this.drawShape(new Polygon(points, true));
    return this;
  }

  // 绘制文本
  public drawText(text: string, x: number, y: number, textStyle?: TextStyle) {
    this.drawShape(new Text(text, x, y, textStyle));
    return this;
  }

  // 移动画笔
  moveTo(x: number, y: number) {
    // 获取路径最后一个点，判断是否为 NaN
    const points = this.currentPath.points;
    const len = points.length;
    if (len > 1) {
      const lastX = points[len - 2];
      const lastY = points[len - 1];
      // 如果上一个点和当前点相同，则不添加
      if (lastX === x && lastY === y) {
        return this;
      }
      // 如果上一个点不为NaN，则添加一个NaN，作为move分割
      if (!Number.isNaN(lastX) && !Number.isNaN(lastY)) {
        this.currentPath.pushPoint(NaN, NaN);
      }
    }
    this.currentPath.pushPoint(x, y);
    return this;
  }

  // 画线
  lineTo(x: number, y: number) {
    this.currentPath.pushPoint(x, y);
    return this;
  }

  // 贝塞尔曲线
  bezierCurveTo(controlPoints: number[], t: number = 1, accuracy = 100) {
    this.currentPath.points.push(...bezier(controlPoints, t, accuracy));
    return this;
  }

  // 闭合路径
  closePath() {
    this.currentPath.pushClosePath();
    return this;
  }

  // 开始新路径
  beginPath() {
    this.currentPath = new Path();
    this.drawShape(this.currentPath);
    return this;
  }

  // 结束填充
  endFill() {
    this.beginFill({ visible: false });
    return this;
  }

  // 结束描边
  endLine() {
    this.beginLine({ visible: false });
    return this;
  }

  // 清除路径绘制
  clearPath() {
    this.currentPath.reset();
    return this;
  }
}
