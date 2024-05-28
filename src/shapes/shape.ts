import { CanvasRenderer } from "../renderer";
import { Point } from "../math";
import { ShapeType } from "../types";
import { GraphicsData } from "../graphics";

export type SetCtxStyle = (
  ctx: CanvasRenderingContext2D,
  data: GraphicsData,
  isFill: boolean
) => void;

// 图形基类，所有基本图形都继承自该类
export abstract class Shape {
  // 图形类型
  public abstract readonly type: ShapeType;
  // 渲染图形
  public abstract render(
    renderer: CanvasRenderer,
    data: GraphicsData,
    worldAlpha: number,
    setCtxStyle: SetCtxStyle
  ): void;
  // 判断点是否在图形内
  public abstract contains(p: Point): boolean;
}
