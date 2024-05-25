import { Point } from "../math";
import { EventPhase, EventType } from "../types";
import { Group } from "../display/group";

// 事件类型映射
const eventMap: {
  [key: string]: EventType;
} = {
  pointermove: "mousemove",
  pointerleave: "mouseleave",
  pointerdown: "mousedown",
  pointerup: "mouseup",
};

// 事件对象
export class EventObject {
  public isTrusted = true;
  public timeStamp = 0; // 时间戳
  public type: EventType = "mousemove"; // 事件类型
  public button = 0;
  public buttons = 0;
  public global = new Point(); // 全局坐标
  public propagationStopped = false; // 事件停止传播
  public eventPhase = EventPhase.NONE; // 事件触发阶段
  public target = new Group(); // 事件目标
  public currentTarget = new Group(); // 事件当前目标

  // 阻止事件传播
  public stopPropagation() {
    this.propagationStopped = true;
  }

  // 将原生事件转换为内部事件的 EventObject 对象
  public convertPointerEvent(nativeEvent: PointerEvent) {
    this.isTrusted = nativeEvent.isTrusted;
    this.timeStamp = nativeEvent.timeStamp;
    this.type = eventMap[nativeEvent.type];
    this.button = nativeEvent.button;
    this.buttons = nativeEvent.buttons;
    // 使用 offsetX 和 offsetY 作为全局坐标，鼠标指针位置相对于事件目标元素的内边距的偏移量。
    // 但这可能导致一些问题，比如 CSS 变换导致无法获取到正确的值，但总体还是可以满足需求
    this.global.set(nativeEvent.offsetX, nativeEvent.offsetY);
  }
}
