import { Group } from "src/display/group";
import { EventObject } from "./eventObject";
import { EventAdmin } from "./eventAdmin";

// 事件系统
export class EventSystem {
  private canvas: HTMLCanvasElement;
  private rootEvent = new EventObject();
  private eventAdmin: EventAdmin;

  constructor(canvas: HTMLCanvasElement, stage: Group) {
    this.canvas = canvas;
    // 创建事件管理器
    this.eventAdmin = new EventAdmin(stage);
    // 添加 Dom 事件
    this.addDomEvents();
  }

  // 给 canvas 添加 Dom 事件
  addDomEvents = () => {
    // 使用 pointer 事件，支持触摸和鼠标
    this.canvas.addEventListener("pointermove", this.onPointerMove, true);
    this.canvas.addEventListener("pointerleave", this.onPointerLeave, true);
    this.canvas.addEventListener("pointerdown", this.onPointerDown, true);
    this.canvas.addEventListener("pointerup", this.onPointerup, true);
  };

  // PointerMove 事件处理函数
  private onPointerMove = (nativeEvent: PointerEvent) => {
    this.onEvent(nativeEvent);
    this.setCursor();
  };

  // PointerLeave 事件处理函数
  private onPointerLeave = (nativeEvent: PointerEvent) => {
    this.onEvent(nativeEvent);
  };

  // PointerDown 事件处理函数
  private onPointerDown = (nativeEvent: PointerEvent) => {
    this.onEvent(nativeEvent);
  };

  // Pointerup 事件处理函数
  private onPointerup = (nativeEvent: PointerEvent) => {
    this.onEvent(nativeEvent);
  };

  private onEvent = (nativeEvent: PointerEvent) => {
    // 将原生事件转换为 EventObject 对象
    this.rootEvent.convertPointerEvent(nativeEvent);
    // 发射事件到事件管理器
    this.eventAdmin.emitEvent(this.rootEvent);
  };

  // 设置鼠标样式
  private setCursor = () => {
    this.canvas.style.cursor = this.eventAdmin.cursor;
  };
}
