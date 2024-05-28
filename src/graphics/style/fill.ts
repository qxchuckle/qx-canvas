const defaultStyle = {
  color: "#000" as string | CanvasGradient | CanvasPattern,
  alpha: 1,
  visible: false,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowColor: "#000",
};
export type FillStyleType = typeof defaultStyle;

export class FillStyle {
  public color = defaultStyle.color;
  public alpha = defaultStyle.alpha;
  public visible = defaultStyle.visible;
  public shadowOffsetX = defaultStyle.shadowOffsetX;
  public shadowOffsetY = defaultStyle.shadowOffsetY;
  public shadowBlur = defaultStyle.shadowBlur;
  public shadowColor = defaultStyle.shadowColor;

  constructor(style: Partial<FillStyleType> = {}) {
    this.set(style);
  }

  set(style: Partial<FillStyleType> = {}) {
    this.color = style.color ?? defaultStyle.color;
    this.alpha = style.alpha ?? defaultStyle.alpha;
    this.visible = style.visible ?? defaultStyle.visible;
    this.shadowOffsetX = style.shadowOffsetX ?? defaultStyle.shadowOffsetX;
    this.shadowOffsetY = style.shadowOffsetY ?? defaultStyle.shadowOffsetY;
    this.shadowBlur = style.shadowBlur ?? defaultStyle.shadowBlur;
    this.shadowColor = style.shadowColor ?? defaultStyle.shadowColor;
  }

  public clone(): FillStyle {
    const obj = new FillStyle();
    obj.set(this);
    return obj;
  }

  public reset(): void {
    this.set(defaultStyle);
  }

  public isSameOf(style: FillStyleType): boolean {
    return (
      this.color === style.color &&
      this.alpha === style.alpha &&
      this.visible === style.visible &&
      this.shadowOffsetX === style.shadowOffsetX &&
      this.shadowOffsetY === style.shadowOffsetY &&
      this.shadowBlur === style.shadowBlur &&
      this.shadowColor === style.shadowColor
    );
  }
}
