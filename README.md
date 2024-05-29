# QxCanvas
这是一个小巧、高性能的 Canvas2D 渲染引擎。

基于树结构，可以像 DOM 一样操作 Canvas 图形，并很容易进行事件交互。

> 自用学习为主，不保证稳定性。

# 快速开始
安装：

```bash
pnpm i qx-canvas -S
```

将 `canvas` 元素传入 `App` 类，即可创建一个 `App` 实例。`App` 用于管理整个 canvas 及其事件系统。

```ts
import * as QxCanvas from "qx-canvas";
const app = new QxCanvas.App({
  canvas: document.querySelector("canvas")!,
});
```

接着使用 `Graphics` 类创建**图案对象**，并挂载到 `app.stage` 舞台(根节点)上。

**绘制图形：**  
`Graphics` 具有一系列绘制基础图形的方法，它们以 **draw** 开头，如 `drawRect`、`drawCircle`、`drawLine` 等。  
但你应该先调用 `beginFill` 或 `beginLine` 方法，以表明开始**填充**或**描边**，并传入样式参数。

**添加事件：**  
你可以为**图案对象**添加事件监听器，如 `click`、`mousedown`、`mousemove` 等，并具有和 DOM 一样的事件传播机制。

```ts
const rect1 = new QxCanvas.Graphics()
  // `Graphics` 的所有方法都支持链式调用
  .beginFill({
    color: "blue",
  })
  .drawRect(200, 0, 100, 100)
  .setPivot(200, 0) // 设置变换中心
  .setRotation(45) // 顺时针旋转45度
  .setScale(2, 2) // 放大两倍
  .setAlpha(0.5) // 透明度
  .setCursor("pointer") // 鼠标样式
  .addEventListener("click", (e) => {
    // 若你需要在异步环境中使用事件对象，需要调用 clone 方法，以拷贝其副本。
    console.log(e.clone());
  });
app.stage.add(rect1);
```

`app.stage` 是**舞台**、根节点，所有 `Graphics` 图形都是其后代节点，其类型为 `Group` 表示**组**的概念。

`Graphics` 继承自 `Group`，也就是说，所有图形节点本身也是**组**，可以添加子节点，以此形成树结构。

```ts
const circle1 = new QxCanvas.Graphics()
  .beginLine({
    width: 5,
  })
  .setPosition(0, 100) // 设置位置偏移量
  .drawCircle(200, 0, 20);
rect1.add(circle1); // 作为rect1的子节点
```

在同一个组中，其透明度、变换(旋转、缩放等)是共享叠加的，如：父节点的变换叠加上子节点自身的局部变换，形成子节点最终的全局变换效果。

`Graphics` 除了可以绘制基础图形，还可以绘制**路径**，这和原生 Canvas 类似，不过和绘制图形一样，需要提前调用 `beginFill` 或 `beginLine` 方法。

```ts
const path1 = new QxCanvas.Graphics()
  .beginLine()
  .moveTo(100, 100)
  .lineTo(200, 200)
  .lineTo(300, 100)
  .closePath();
app.stage.add(path1);
```

# API 文档
较为详细的 API 文档。

## App
`App` 类是整个引擎的入口，用于管理整个 canvas 及其事件系统。

```ts
const app = new QxCanvas.App({
  canvas: document.querySelector("canvas")!,
});
```

参数：

```ts
export interface IAppOptions {
  // 传入的canvas元素
  canvas: HTMLCanvasElement;
  // canvas 元素宽高
  width?: number;
  height?: number;
  // 背景颜色
  backgroundColor?: string;
  // 背景透明度
  backgroundAlpha?: number;
}
```

属性和方法：
  
```ts
declare class App<T extends IContext["ctx"] = CanvasRenderingContext2D> {
  readonly stage: Group; // 舞台，根节点
  constructor(options: IAppOptions);
  clear(): void; // 清空舞台
  resize(width: number, height: number): void; // 调整canvas大小
  get ctx(): T; // 获取canvas上下文
  get canvas(): HTMLCanvasElement; // 获取canvas元素
}
```

## Node
`Node` 类是所有节点的基类，具有一些基础的属性和方法。(内部类，未向外暴露)

```ts
declare abstract class Node extends EventClient {
  visible: boolean; // 节点是否可见
  readonly transform: Transform; // 变换对象
  cursor: Cursor; // 鼠标样式
  hitArea: Shape | null; // 自定义碰撞图形（区域）
  parent: this | null; // 父节点
  readonly children: this[]; // 子节点列表
  id: string; // 节点id
  class: string[]; // 节点类名
  get zIndex(): number; // 获取节点层级
  set zIndex(value: number); // 设置节点层级

  // 一些操作属性的方法，返回this，方便链式调用
  setZIndex(index: number): this; // 设置节点层级
  setAlpha(alpha: number): this; // 设置透明度
  setVisible(visible: boolean): this; // 设置可见性
  setCursor(cursor: Cursor): this; // 设置鼠标样式
  setHitArea(hitArea: Shape): this; // 设置碰撞区域
  setId(id: string): this; // 设置节点id
  setClass(className: string): this; // 覆盖设置类名
  addClass(className: string): this; // 添加类名
  removeClass(className: string): this; // 移除类名
  setScale(x: number, y: number): this; // 设置缩放
  setRotation(rotation: number): this; // 设置旋转角度
  setPosition(x: number, y: number): this; // 设置位置偏移量
  setPivot(x: number, y: number): this; // 设置变换中心
  setSkew(x: number, y: number): this; // 设置倾斜角度

  // 添加事件监听器
  addEventListener(type: EventType, listener: EventListener, options?: boolean | EventOptions): this;
  // 移除事件监听器
  removeEventListener(type: EventType, listener: EventListener, capture?: boolean): this;

  // 根据id或class查找子节点
  findById(id: string): this | null;
  findByClass(className: string): this[];
}
```

## Group
`Group` 类是**组**对象，继承自 `Node`，用于管理子节点。(内部类，未向外暴露)

```ts
declare class Group extends Node {
  add(child: this | this[]): this; // 添加子节点
  remove(child: this): this; // 移除子节点
  removeChildren(): this; // 移除所有子节点
  removeSelf(): this; // 从父节点移除自身
  destroy(): void; // 销毁节点，移除自身及所有子节点
  getSpreadPath(): Group[]; // 获取传播路径，即从根节点到自身的路径

  // 生命周期
  onBeforeMount(handler: (item: this) => void): this;
  onMounted(handler: (item: this) => void): this;
  onBeforeRender(handler: (item: this, renderer: CanvasRenderer) => void): this;
  onRendering(handler: (item: this, renderer: CanvasRenderer) => void): this;
  onRendered(handler: (item: this, renderer: CanvasRenderer) => void): this;
  onBeforeUnmount(handler: (item: this) => void): this;
  onUnmounted(handler: (item: this) => void): this;
}
```

## Graphics
`Graphics` 类是图案对象，继承自 `Group`，用于绘制图形、路径，以及绑定事件监听器。

```ts
declare class Graphics extends Group {
  readonly graphicsDataList: GraphicsData[];
  // 开始填充或描边
  beginFill(style?: Partial<FillStyleType>): this;
  beginLine(style?: Partial<LineStyleType>): this;
  // 结束填充或描边
  endFill(): this;
  endLine(): this;

  // 判断点是否在图形内
  contains(p: Point): boolean;

  // 绘制基础图形
  // 矩形
  drawRect(x: number, y: number, width: number, height: number): this;
  // 圆
  drawCircle(x: number, y: number, radius: number): this;
  // 椭圆
  drawEllipse(x: number, y: number, radiusX: number, radiusY: number): this;
  // 圆角矩形
  drawRoundRect(x: number, y: number, width: number, height: number, radius: number): this;
  // 多边形
  drawPolygon(points: number[]): this;
  // 文本
  drawText(text: string, x: number, y: number, textStyle?: TextStyle): this;

  // 绘制路径
  moveTo(x: number, y: number): this;
  lineTo(x: number, y: number): this;
  // 绘制任意数量控制点的贝塞尔曲线，指定 t 参数，绘制一定曲线阶段，accuracy 参数指定精度
  bezierCurveTo(controlPoints: number[], t?: number, accuracy?: number): this;
  closePath(): this;
  // 开始新路径
  beginPath(): this;
  // 清空路径
  clearPath(): this;
}
```

### 生命周期
每个图案对象 `Graphics`（`Group`）都具有生命周期，以便在特定的时机执行特定的操作。

```ts
const s = new QxCanvas.Graphics()
s.onBeforeMount((item) => {
  console.log("before mount");
})
  .onMounted((item) => {
    console.log("mounted");
  })
  .onBeforeRender((item, renderer) => {
    console.log("before render");
  })
  .onRendering((item, renderer) => {
    console.log("rendering");
  })
  .onRendered((item, renderer) => {
    console.log("after render");
    app.stage.remove(s);
  })
  .onBeforeUnmount((item) => {
    console.log("before unmount");
  })
  .onUnmounted((item) => {
    console.log("unmounted");
  });
```

顺序如下：
1. `onBeforeMount`：挂载到父节点前触发。
2. `onMounted`：挂载到父节点后触发。
3. `onBeforeRender`：每帧渲染前触发。
4. `onRendering`：每帧渲染时触发，此时节点自身已经渲染完毕，但子节点还未渲染。
5. `onRendered`：每帧渲染后触发，此时节点及其子节点都已经渲染完毕。
6. `onBeforeUnmount`：从父节点移除前触发。
7. `onUnmounted`：从父节点移除后触发。






























