import { Rectangle } from "../shapes";
import { Group } from "../display/group";

// Graphics 类包含一组用于创建各种形状的方法。
export class Graphics extends Group {
  drawRect(x: number, y: number, width: number, height: number): void {
    new Rectangle(x, y, width, height);
  }
}
