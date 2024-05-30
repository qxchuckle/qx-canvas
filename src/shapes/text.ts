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
  private isInit: boolean = false;
  // 文本实际左上角坐标
  private _x: number = NaN;
  private _y: number = NaN;
  // 文本实际宽高
  private _width: number = NaN;
  private _height: number = NaN;
  // 自动换行所需的记录
  private lines: string[] = [];
  private _lineHeight: number = 0;

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
    const {
      font,
      align,
      baseline,
      direction,
      maxWidth,
      autoBreak,
      lineHeight,
    } = this.textStyle;
    font && (ctx.font = font);
    align && (ctx.textAlign = align);
    baseline && (ctx.textBaseline = baseline);
    direction && (ctx.direction = direction);

    if (autoBreak && maxWidth && maxWidth > 0) {
      // 自动换行
      if (!this.isInit) {
        this.autoBreakInit(ctx);
      }
      let y = this.y;
      for (let n = 0; n < this.lines.length; n++) {
        if (fillStyle.visible) {
          setCtxStyle(ctx, data, true);
          ctx.fillText(this.lines[n], this.x, y, maxWidth);
        }
        if (lineStyle.visible) {
          setCtxStyle(ctx, data, false);
          ctx.strokeText(this.lines[n], this.x, y, maxWidth);
        }
        y += this._lineHeight;
      }
    } else {
      // 普通单行文本
      // 计算宽高和文本实际左上角坐标
      if (!this.isInit) {
        this.textInit(ctx);
      }
      // 不自动换行
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

  // 普通文本初始化
  private textInit(ctx: CanvasRenderingContext2D) {
    const metrics = ctx.measureText(this.text);
    this._x = this.x - metrics.actualBoundingBoxLeft;
    this._y = this.y - metrics.actualBoundingBoxAscent;
    this._height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    this._width =
      metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;
    this.isInit = true;
  }

  // 自动换行初始化
  private autoBreakInit(ctx: CanvasRenderingContext2D) {
    const { maxWidth, autoBreak, lineHeight } = this.textStyle;
    if (!autoBreak || !maxWidth) {
      return;
    }
    const words = this.text.split("");
    let line = "";
    let _x = 0;
    let _y = 0;
    let _width = 0;
    let _height = 0;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth =
        metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;
      const testHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      if (testWidth > maxWidth && n > 0) {
        this.lines.push(line);
        line = words[n];
      } else {
        _width = Math.max(_width, testWidth);
        _height = Math.max(_height, testHeight);
        _x = Math.max(_x, metrics.actualBoundingBoxLeft);
        if (this.lines.length === 0) {
          _y = Math.max(_y, metrics.actualBoundingBoxAscent);
        }
        line = testLine;
      }
    }
    this.lines.push(line);
    this._x = this.x - _x;
    this._y = this.y - _y;
    this._width = _width;
    this._height = (lineHeight ?? _height) * this.lines.length;
    this._lineHeight = lineHeight ?? _height;
    this.isInit = true;
  }
}
