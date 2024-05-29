// app配置项
export interface IAppOptions {
  // 传入的canvas元素
  canvas: HTMLCanvasElement;
  width?: number;
  height?: number;
  // 背景颜色
  backgroundColor?: string;
  // 背景透明度
  backgroundAlpha?: number;
}
// context
export interface IContext {
  // 画布
  canvas: HTMLCanvasElement;
  // 画布上下文
  ctx:
    | CanvasRenderingContext2D
    | WebGLRenderingContext
    | WebGL2RenderingContext;
}
