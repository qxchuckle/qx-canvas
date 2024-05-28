// 形状类型
export enum ShapeType {
  Rectangle = "rectangle",
  Polygon = "polygon",
  Circle = "circle",
  Ellipse = "ellipse",
  RoundRect = "roundRect",
  Path = "path",
}

// 线条端点样式，对应 lineCap 属性
export enum LINE_CAP {
  BUTT = "butt",
  ROUND = "round",
  SQUARE = "square",
}

// 线条连接样式，对应 lineJoin 属性
export enum LINE_JOIN {
  MITER = "miter",
  BEVEL = "bevel",
  ROUND = "round",
}

// 事件阶段
export enum EventPhase {
  NONE = "none", // 无阶段
  CAPTURING = "capturing", // 捕获阶段
  AT_TARGET = "atTarget", // 目标阶段
  BUBBLING = "bubbling", // 冒泡阶段
}

// 生命周期key
export enum LifecycleKey {
  BeforeMount = "beforeMount",
  Mounted = "mounted",
  BeforeRender = "beforeRender",
  Rendering = "rendering",
  Rendered = "rendered",
  BeforeUnmount = "beforeUnmount",
  Unmounted = "unmounted",
}
