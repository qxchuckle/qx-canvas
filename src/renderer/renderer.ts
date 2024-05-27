import { IAppOptions, IContext } from "../types";
import { Group } from "../display/group";

export abstract class Renderer<T extends IContext["ctx"]> {
  protected canvas: IContext["canvas"];
  private options: Required<IAppOptions>;
  abstract ctx: T;

  constructor(options: Required<IAppOptions>) {
    this.canvas = options.canvas;
    this.options = options;
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }

  get backgroundColor() {
    return this.options.backgroundColor;
  }

  get backgroundAlpha() {
    return this.options.backgroundAlpha;
  }

  abstract render(stage: Group): void;
}
