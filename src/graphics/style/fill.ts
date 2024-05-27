const defaultStyle: FillStyleType = {
  color: "#000",
  alpha: 1,
  visible: false,
};
export type FillStyleType = {
  color: string | CanvasGradient | CanvasPattern;
  alpha: number;
  visible: boolean;
};

export class FillStyle {
  public color: FillStyleType["color"];
  public alpha: FillStyleType["alpha"];
  public visible: FillStyleType["visible"];

  constructor(style: Partial<FillStyleType> = {}) {
    this.color = style.color ?? defaultStyle.color;
    this.alpha = style.alpha ?? defaultStyle.alpha;
    this.visible = style.visible ?? defaultStyle.visible;
  }

  set(style: Partial<FillStyleType> = {}) {
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

  public isSameOf(style: FillStyleType): boolean {
    return (
      this.color === style.color &&
      this.alpha === style.alpha &&
      this.visible === style.visible
    );
  }
}
