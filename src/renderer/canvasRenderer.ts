import { Group } from "../display/group";
import { IAppOptions } from "../types";
import { Renderer } from "./renderer";

export class CanvasRenderer extends Renderer {
  public ctx: CanvasRenderingContext2D;

  constructor(options: Required<IAppOptions>) {
    super(options);
    console.log("使用Canvas2D渲染中");
    this.ctx = this.canvas.getContext("2d")!;
  }

  render(stage: Group): void {
    this.renderBackground();
    // 渲染根节点
    stage.renderCanvas(this);
  }

  // 渲染背景
  private renderBackground() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalAlpha = this.backgroundAlpha;
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }
}
