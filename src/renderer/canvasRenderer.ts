import { createRefThrottle } from "src/utils";
import { Group } from "../display/group";
import { IAppOptions } from "../types";
import { Renderer } from "./renderer";

export class CanvasRenderer extends Renderer<CanvasRenderingContext2D> {
  public ctx: CanvasRenderingContext2D;

  constructor(options: Required<IAppOptions>) {
    super(options);
    console.log("QxCanvas 使用 Canvas2D 渲染中");
    this.ctx = this.canvas.getContext("2d")!;
    this.dprInit();
    window.addEventListener("resize", () => {
      this.dprInit();
    });
  }

  public render(stage: Group): void {
    stage.updateTransform();
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

  protected dprInit = createRefThrottle(() =>{
    const dpr = window.devicePixelRatio || 1;
    Promise.resolve().then(() => {
      this.canvas.style.width = this.width + "px";
      this.canvas.style.height = this.height + "px";
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      // 使画布内容也跟着缩放
      this.ctx.scale(dpr, dpr);
    });
  })
}
