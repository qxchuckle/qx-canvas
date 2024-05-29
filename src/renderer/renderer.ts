import { IAppOptions, IContext } from "../types";
import { Group } from "../display/group";

export abstract class Renderer<T extends IContext["ctx"]> {
  protected canvas: IContext["canvas"];
  private options: Required<IAppOptions>;
  abstract ctx: T;
  private originalState = {
    width: 0,
    height: 0,
  };

  constructor(options: Required<IAppOptions>) {
    this.canvas = options.canvas;
    this.options = options;
    this.originalState.width = options.width;
    this.originalState.height = options.height;
  }

  resize(width: number, height: number): void {
    // this.canvas.width = width;
    // this.canvas.height = height;
    this.originalState.width = width;
    this.originalState.height = height;
    this.dprInit();
  }

  get width(): number {
    return this.originalState.width;
  }

  get height(): number {
    return this.originalState.height;
  }

  get backgroundColor() {
    return this.options.backgroundColor;
  }

  get backgroundAlpha() {
    return this.options.backgroundAlpha;
  }

  // dpr优化
  protected abstract dprInit(): void;

  public abstract render(stage: Group): void;
}
