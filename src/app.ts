import { IAppOptions } from "./types";
import { Renderer, CanvasRenderer } from "./renderer";
import { Group } from "./display/group";

export class App {
  // renderer 是实际具有绘制能力的对象
  public renderer: Renderer;
  private options: Required<IAppOptions>;
  // 根节点 stage 也是一个组
  public stage: Group = new Group();

  constructor(options: IAppOptions) {
    this.options = {
      canvas: options.canvas,
      backgroundColor: options.backgroundColor ?? "#000",
      backgroundAlpha: options.backgroundAlpha ?? 1,
    };
    this.renderer = new CanvasRenderer(this.options);
    this.init();
  }

  // 初始化
  private init() {
    this.render();
  }

  // 持续渲染
  private render() {
    this.renderer.render(this.stage);
    requestAnimationFrame(this.render.bind(this));
  }
}
