import { Point } from "../math";
import { ShapeType } from "../types";

// 图形基类，所有基本图形都继承自该类
export abstract class Shape {
  // 图形类型
  public abstract type: ShapeType;
  // 判断点是否在图形内
  public abstract contains(p: Point): boolean;
}
