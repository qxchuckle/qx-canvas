import { Shape } from "../shapes/shape";
import { FillStyle, LineStyle } from "./style";

// GraphicsData 类包含图形对象及其样式信息，作为一个多顶点图形对象的数据结构存在。
export class GraphicsData {
  public shape: Shape;
  public lineStyle: LineStyle;
  public fillStyle: FillStyle;

  constructor(shape: Shape, fillStyle: FillStyle, lineStyle: LineStyle) {
    this.shape = shape;
    this.lineStyle = lineStyle;
    this.fillStyle = fillStyle;
  }
}
