import { CanvasRenderer } from "../renderer";
import { Point } from "../math";
import { ShapeType } from "../types";
import { Shape } from "./shape";
import { GraphicsData } from "../graphics";

export class Ellipse extends Shape {
  public readonly type = ShapeType.Ellipse;
  public x: number;
  public y: number;
  public radiusX: number;
  public radiusY: number;

  constructor(x: number, y: number, radiusX: number, radiusY: number) {
    super();
    this.x = x;
    this.y = y;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }

  contains(p: Point): boolean {
    return (
      Math.pow(p.x - this.x, 2) / Math.pow(this.radiusX, 2) +
        Math.pow(p.y - this.y, 2) / Math.pow(this.radiusY, 2) <=
      1
    );
  }

  public render(renderer: CanvasRenderer, data: GraphicsData): void {
    const ctx = renderer.ctx;
    const fillStyle = data.fillStyle;
    const lineStyle = data.lineStyle;
    ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
    if (fillStyle.visible) {
      ctx.fill();
    }
    if (lineStyle.visible) {
      ctx.stroke();
    }
  }
}
