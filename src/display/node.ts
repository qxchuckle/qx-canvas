import { Cursor, EventType, EventListener, EventOptions } from "../types";
import { Point, Transform } from "../math";
import { Group } from "./group";
import { Shape } from "../shapes";
import Eventemitter from "eventemitter3";

const EE = new Eventemitter();

// 节点基类，所有节点都继承自该类，节点直接继承自 EventEmitter，实现事件机制
export abstract class Node {
  public visible = true; // 是否可见
  public alpha = 1; // 透明度
  public worldAlpha = 1; // 世界透明度，由父节点透明度计算得到
  public _zIndex = 0; // 层级
  public transform = new Transform(); // 变换对象
  public parent: Group | null = null; // 父节点
  public cursor: Cursor = "auto"; // 鼠标样式
  public hitArea: Shape | null = null; // 节点图形、碰撞区域
  protected sorted = false; // 记录是否已按照 zIndex 排序
  abstract children: Node[]; // 子节点

  get zIndex(): number {
    return this._zIndex;
  }

  set zIndex(value: number) {
    if (this._zIndex === value) return;
    this._zIndex = value;
    // 标记父元素未排序，下次渲染时重新排序
    this.parent && (this.parent.sorted = false);
  }

  // 根据 zIndex 从小到大排序，保证层级越高的节点越后渲染
  public sort() {
    if (this.sorted) return;
    this.children.sort((a, b) => a.zIndex - b.zIndex);
    this.sorted = true;
  }

  // 判断一个点是否在当前节点内
  public contains(p: Point): boolean {
    if (!this.hitArea) {
      return false;
    }
    return this.hitArea.contains(p);
  }

  // 更新 Transform
  public updateTransform() {
    this.sort();
    // 跟随父节点更新变换
    this.transform.updateTransform(this.parent?.transform ?? new Transform());
    // 跟随父节点更新世界透明度
    this.worldAlpha = (this.parent?.worldAlpha ?? 1) * this.alpha;
    // 如果世界透明度为 0 或者不可见，则不继续更新子节点
    if (this.worldAlpha <= 0 || !this.visible) {
      return;
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateTransform();
    }
  }

  once(type: string, listener: EventListener) {
    EE.once(type, listener);
  }

  on(type: string, listener: EventListener) {
    EE.on(type, listener);
  }

  off(type: string, listener: EventListener) {
    EE.off(type, listener);
  }

  emit(type: string, ...args: any[]) {
    EE.emit(type, ...args);
  }

  // 绑定事件监听器
  public addEventListener(
    type: EventType,
    listener: EventListener,
    options?: boolean | EventOptions
  ) {
    const opts = this.analyzeEventOptions(options);
    // 根据捕获或冒泡，获取实际的内部事件类型
    const realType = opts.capture ? `${type}_capture` : `${type}_bubble`;
    if (opts.once) {
      this.once(realType, listener);
    } else {
      this.on(realType, listener);
    }
  }

  // 移除事件监听器
  public removeEventListener(
    type: EventType,
    listener: EventListener,
    capture?: boolean
  ) {
    const realType = capture ? `${type}_capture` : `${type}_bubble`;
    this.off(realType, listener);
  }

  private analyzeEventOptions(options?: boolean | EventOptions): EventOptions {
    if (typeof options === "boolean") {
      return {
        capture: options,
        once: false,
      };
    }
    return {
      capture: options?.capture ?? false,
      once: options?.once ?? false,
    };
  }
}
