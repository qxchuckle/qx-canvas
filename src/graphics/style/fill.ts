const defaultStyle = {
  color: "#000",
  alpha: 1,
  visible: false,
};
export type FillStyleType = typeof defaultStyle;

export class FillStyle {
  public color;
  public alpha;
  public visible;

  constructor(style: Partial<typeof defaultStyle> = {}) {
    this.color = style.color ?? defaultStyle.color;
    this.alpha = style.alpha ?? defaultStyle.alpha;
    this.visible = style.visible ?? defaultStyle.visible;
  }

  set(style: Partial<typeof defaultStyle> = {}) {
    this.color = style.color ?? defaultStyle.color;
    this.alpha = style.alpha ?? defaultStyle.alpha;
    this.visible = style.visible ?? defaultStyle.visible;
  }

  public clone(): FillStyle {
    const obj = new FillStyle();
    obj.color = this.color;
    obj.alpha = this.alpha;
    obj.visible = this.visible;
    return obj;
  }

  public reset(): void {
    this.color = defaultStyle.color;
    this.alpha = defaultStyle.alpha;
    this.visible = defaultStyle.visible;
  }
}
