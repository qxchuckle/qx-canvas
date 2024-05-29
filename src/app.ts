import { IAppOptions, IContext } from "./types";
import { Renderer, CanvasRenderer } from "./renderer";
import { Group } from "./display/group";
import { EventSystem } from "./events";
import { Rectangle } from "./shapes";

export class App<T extends IContext["ctx"] = CanvasRenderingContext2D> {
  // renderer 是实际具有绘制能力的对象
  private renderer: Renderer<T>;
  private options: Required<IAppOptions>;
  // 根节点 stage 也是一个组
  public readonly stage: Group = new Group();
  // 事件系统
  private eventSystem: EventSystem;

  constructor(options: IAppOptions) {
    this.options = {
      canvas: options.canvas,
      width: options.width ?? options.canvas.width,
      height: options.height ?? options.canvas.height,
      backgroundColor: options.backgroundColor ?? "#fff",
      backgroundAlpha: options.backgroundAlpha ?? 1,
    };
    this.renderer = new CanvasRenderer(this.options) as unknown as Renderer<T>;
    this.eventSystem = new EventSystem(this.options.canvas, this.stage);
    this.init();
  }

  // 初始化
  private init() {
    // 将舞台的碰撞区域设置为整个画布
    this.stage.setHitArea(
      new Rectangle(0, 0, this.renderer.width, this.renderer.height)
    );
    this.render();
  }

  // 持续渲染
  private render = () => {
    this.renderer.render(this.stage);
    requestAnimationFrame(this.render);
  };

  // 清空舞台
  clear() {
    this.stage.removeChildren();
  }

  // 修改画布大小
  resize(width: number, height: number) {
    this.renderer.resize(width, height);
  }

  get ctx() {
    return this.renderer.ctx;
  }

  get canvas() {
    return this.options.canvas;
  }
}
