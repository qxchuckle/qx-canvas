// 形状类型
export enum ShapeType {
  Rectangle = "rectangle",
  Polygon = "polygon",
  Circle = "circle",
  Ellipse = "ellipse",
  RoundedRectangle = "roundedRectangle",
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
  NONE = 0, // 无阶段
  CAPTURING = 1, // 捕获阶段
  AT_TARGET = 2, // 目标阶段
  BUBBLING = 3, // 冒泡阶段
}
