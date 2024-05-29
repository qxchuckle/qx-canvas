import { CanvasRenderer } from "../renderer";
import { Point } from "../math";
import { ShapeType, TextStyle } from "../types";
import { SetCtxStyle, Shape } from "./shape";
import { GraphicsData } from "../graphics";

export class Text extends Shape {
  public readonly type = ShapeType.Text;
  private text: string;
  private x: number;
  private y: number;
  private textStyle: TextStyle;
  // 文本实际左上角坐标
  private _x: number = NaN;
  private _y: number = NaN;
  // 文本实际宽高
  private _width: number = NaN;
  private _height: number = NaN;

  constructor(text: string, x: number, y: number, textStyle?: TextStyle) {
    super();
    this.text = text;
    this.x = x;
    this.y = y;
    this.textStyle = textStyle ?? {};
  }

  public contains(p: Point) {
    if (
      p.x > this._x &&
      p.x < this._x + this._width &&
      p.y > this._y &&
      p.y < this._y + this._height
    ) {
      return true;
    } else {
      return false;
    }
  }

  public render(
    renderer: CanvasRenderer,
    data: GraphicsData,
    worldAlpha: number,
    setCtxStyle: SetCtxStyle
  ): void {
    const ctx = renderer.ctx;
    const fillStyle = data.fillStyle;
    const lineStyle = data.lineStyle;
    const { font, align, baseline, direction, maxWidth } = this.textStyle;
    font && (ctx.font = font);
    align && (ctx.textAlign = align);
    baseline && (ctx.textBaseline = baseline);
    direction && (ctx.direction = direction);
    // 计算宽高和文本实际左上角坐标
    if (Number.isNaN(this._height)) {
      const metrics = ctx.measureText(this.text);
      this._x = this.x - metrics.actualBoundingBoxLeft;
      this._y = this.y - metrics.actualBoundingBoxAscent;
      this._height =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      this._width =
        metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;
    }
    if (fillStyle.visible) {
      setCtxStyle(ctx, data, true);
      ctx.fillText(this.text, this.x, this.y, maxWidth);
    }
    if (lineStyle.visible) {
      setCtxStyle(ctx, data, false);
      ctx.strokeText(this.text, this.x, this.y, maxWidth);
    }
  }
}
