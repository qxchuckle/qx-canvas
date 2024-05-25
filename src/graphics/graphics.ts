import { Rectangle, Shape } from "../shapes";
import { Group } from "../display/group";
import { CanvasRenderer } from "../renderer";
import { GraphicsData } from "./graphicsData";
import { FillStyle, LineStyle, FillStyleType, LineStyleType } from "./style";
import { Point } from "../math";

// Graphics 类包含一组用于创建各种形状的方法。
export class Graphics extends Group {
  // 图形数据列表
  graphicsDataArr: GraphicsData[] = [];
  // 当前图形样式
  fillStyle: FillStyle = new FillStyle();
  lineStyle: LineStyle = new LineStyle();

  // 渲染自身
  public renderSelf(renderer: CanvasRenderer) {
    const ctx = renderer.ctx;
    ctx.save();
    // 应用变换
    this.applyTransform(renderer);
    // 遍历图形数据列表，渲染图形
    for (let i = 0; i < this.graphicsDataArr.length; i++) {
      const data = this.graphicsDataArr[i];
      ctx.save();
      // 设置样式
      if (data.fillStyle.visible) {
        ctx.fillStyle = data.fillStyle.color;
        ctx.globalAlpha = data.fillStyle.alpha * this.worldAlpha;
      }
      if (data.lineStyle.visible) {
        ctx.lineWidth = data.lineStyle.width;
        ctx.lineCap = data.lineStyle.cap;
        ctx.lineJoin = data.lineStyle.join;
        ctx.strokeStyle = data.lineStyle.color;
        ctx.globalAlpha = data.lineStyle.alpha * this.worldAlpha;
      }
      // 渲染图形
      data.shape.render(renderer, data);
      ctx.restore();
    }
    ctx.restore();
    return this;
  }

  // 设置填充样式，开始填充
  public beginFill(style: Partial<FillStyleType> = {}) {
    this.fillStyle.set(style);
    this.fillStyle.visible = style.visible ?? true;
    return this;
  }

  // 设置描边样式，开始描边
  public beginLine(style: Partial<LineStyleType & FillStyleType> = {}) {
    this.lineStyle.set(style);
    this.lineStyle.visible = style.visible ?? true;
    return this;
  }

  // 绘制形状
  private drawShape(
    shape: Shape,
    fillStyle: FillStyle,
    lineStyle: LineStyle
  ): void {
    // 记录此时的样式信息
    const data = new GraphicsData(shape, fillStyle, lineStyle);
    this.graphicsDataArr.push(data);
  }

  // 碰撞检测
  public contains(p: Point): boolean {
    // 如果有自定义的碰撞区域，直接判断
    if (this.hitArea) {
      return this.hitArea.contains(p);
    }
    // 遍历图形数据列表，判断点是否在图形内
    for (let i = 0; i < this.graphicsDataArr.length; i++) {
      const data = this.graphicsDataArr[i];
      // 只有填充的形状才进行碰撞检测
      if (data.fillStyle.visible && data.shape.contains(p)) {
        return true;
      }
    }
    return false;
  }

  // 绘制矩形
  public drawRect(x: number, y: number, width: number, height: number) {
    this.drawShape(
      new Rectangle(x, y, width, height),
      this.fillStyle.clone(),
      this.lineStyle.clone()
    );
    return this;
  }
}
