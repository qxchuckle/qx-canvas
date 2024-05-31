import { CanvasRenderer } from "../renderer";
import { Point } from "../math";
import { ShapeType } from "../types";
import { SetCtxStyle, Shape } from "./shape";
import { GraphicsData } from "../graphics";

export type imageClip = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
};

export class CImage extends Shape {
  public readonly type = ShapeType.Image;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public image: CanvasImageSource | string;
  public imageData?: CanvasImageSource;
  public clip?: imageClip;

  constructor(
    image: CanvasImageSource | string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    clip?: imageClip
  ) {
    super();
    this.x = x;
    this.y = y;
    this.width = width ?? 0;
    this.height = height ?? 0;
    this.clip = clip;
    this.image = image;
    if (typeof this.image === "string") {
      const img = new Image();
      img.src = this.image;
      img.onload = () => {
        // 如果没有传入宽度和高度，那么使用原图的宽高
        if (width == undefined && height == undefined) {
          this.width = img.naturalWidth;
          this.height = img.naturalHeight;
        }
        // 如果只传入了宽度或者高度，那么按照原图的比例进行缩放
        if (width == undefined && height != undefined) {
          this.width = (img.naturalWidth / img.naturalHeight) * height;
          this.height = height;
        }
        if (width != undefined && height == undefined) {
          this.width = width;
          this.height = (img.naturalHeight / img.naturalWidth) * width;
        }
        this.imageData = img;
      };
    } else {
      this.imageData = this.image;
    }
  }

  contains(p: Point): boolean {
    if (
      p.x > this.x &&
      p.x < this.x + this.width &&
      p.y > this.y &&
      p.y < this.y + this.height
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
    if (fillStyle.visible) {
      setCtxStyle(ctx, data, true);
      if (this.imageData) {
        if (this.clip) {
          ctx.drawImage(
            this.imageData,
            this.clip.sx,
            this.clip.sy,
            this.clip.sw,
            this.clip.sh,
            this.x,
            this.y,
            this.width,
            this.height
          );
        } else {
          ctx.drawImage(
            this.imageData,
            this.x,
            this.y,
            this.width,
            this.height
          );
        }
      }
    }
  }
}
