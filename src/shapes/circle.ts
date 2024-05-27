import { CanvasRenderer } from "../renderer";
import { Point } from "../math";
import { ShapeType } from "../types";
import { Shape } from "./shape";
import { GraphicsData } from "../graphics";

export class Circle extends Shape {
  public readonly type = ShapeType.Circle;
  public x: number;
  public y: number;
  public radius: number;

  constructor(x: number, y: number, radius: number) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  contains(p: Point): boolean {
    return (
      Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2) <=
      Math.pow(this.radius, 2)
    );
  }

  public render(renderer: CanvasRenderer, data: GraphicsData): void {
    const ctx = renderer.ctx;
    const fillStyle = data.fillStyle;
    const lineStyle = data.lineStyle;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    if (fillStyle.visible) {
      ctx.fill();
    }
    if (lineStyle.visible) {
      ctx.stroke();
    }
  }
}
