import { isSameArray } from "../../utils";
import { LINE_CAP, LINE_JOIN } from "../../types";
import { FillStyle, FillStyleType } from "./fill";

const defaultStyle = {
  width: 0,
  cap: LINE_CAP.BUTT,
  join: LINE_JOIN.MITER,
  miterLimit: 10,
  lineDash: [] as number[],
};
export type LineStyleType = typeof defaultStyle & FillStyleType;

export class LineStyle extends FillStyle {
  public width = defaultStyle.width;
  public cap = LINE_CAP.BUTT;
  public join = LINE_JOIN.MITER;
  public miterLimit = 10;
  public lineDash = [] as number[];

  constructor(style: Partial<LineStyleType> = {}) {
    super(style);
    this.set(style);
  }

  set(style: Partial<LineStyleType> = {}): void {
    super.set(style);
    this.width = style.width ?? defaultStyle.width;
    this.cap = style.cap ?? defaultStyle.cap;
    this.join = style.join ?? defaultStyle.join;
    this.miterLimit = style.miterLimit ?? defaultStyle.miterLimit;
    this.lineDash = style.lineDash ?? defaultStyle.lineDash;
  }

  public clone(): LineStyle {
    const obj = new LineStyle();
    obj.set(this);
    return obj;
  }

  public reset(): void {
    super.reset();
    this.set(defaultStyle);
  }

  public isSameOf(style: LineStyleType): boolean {
    return (
      super.isSameOf({
        color: style.color,
        alpha: style.alpha,
        visible: style.visible,
        shadowOffsetX: style.shadowOffsetX,
        shadowOffsetY: style.shadowOffsetY,
        shadowBlur: style.shadowBlur,
        shadowColor: style.shadowColor,
      }) &&
      this.width === style.width &&
      this.cap === style.cap &&
      this.join === style.join &&
      this.miterLimit === style.miterLimit &&
      isSameArray(this.lineDash, style.lineDash)
    );
  }
}
