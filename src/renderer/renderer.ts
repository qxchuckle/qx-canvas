import { IAppOptions } from "../types";
import { Group } from "../display/group";

export abstract class Renderer {
  protected canvas: HTMLCanvasElement;
  private options: Required<IAppOptions>;

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
