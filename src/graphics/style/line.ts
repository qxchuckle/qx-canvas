import { LINE_CAP, LINE_JOIN } from "../../types";
import { FillStyle, FillStyleType } from "./fill";

const defaultStyle = {
  width: 0,
  cap: LINE_CAP.BUTT,
  join: LINE_JOIN.MITER,
  miterLimit: 10,
};
export type LineStyleType = typeof defaultStyle;

export class LineStyle extends FillStyle {
  public width;
  public cap;
  public join;
  public miterLimit;

  constructor(style: Partial<LineStyleType & FillStyleType> = {}) {
    super(style);
    this.width = style.width ?? defaultStyle.width;
    this.cap = style.cap ?? defaultStyle.cap;
    this.join = style.join ?? defaultStyle.join;
    this.miterLimit = style.miterLimit ?? defaultStyle.miterLimit;
  }

  set(style: Partial<LineStyleType & FillStyleType> = {}): void {
    super.set(style);
    this.width = style.width ?? defaultStyle.width;
    this.cap = style.cap ?? defaultStyle.cap;
    this.join = style.join ?? defaultStyle.join;
    this.miterLimit = style.miterLimit ?? defaultStyle.miterLimit;
  }

  public clone(): LineStyle {
    const obj = new LineStyle();
    obj.color = this.color;
    obj.alpha = this.alpha;
    obj.visible = this.visible;
    obj.width = this.width;
    obj.cap = this.cap;
    obj.join = this.join;
    obj.miterLimit = this.miterLimit;
    return obj;
  }

  public reset(): void {
    super.reset();
    this.width = defaultStyle.width;
    this.cap = LINE_CAP.BUTT;
    this.join = LINE_JOIN.MITER;
    this.miterLimit = 10;
  }
}
