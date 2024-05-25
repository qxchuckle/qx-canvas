import { Cursor, EventPhase } from "../types";
import { Group } from "../display/group";
import { EventObject } from "./eventObject";
import { Point } from "../math";
import { getArrLast } from "../utils";

// 事件管理器
export class EventAdmin {
  private stage: Group; // 舞台，根节点
  public cursor: Cursor = "auto"; // 鼠标样式
  private hitTarget: Group | null = null; // 碰撞到的目标节点
  // 事件处理函数映射
  private eventHandlerMap: {
    [anyKey: string]: (e: EventObject) => any;
  } = {};
  // 保存鼠标按下事件的传播路径
  private pressTargetsMap: { [key: number]: Group[] } = {};
  private overTargets: Group[] = []; // 鼠标悬停的节点

  constructor(stage: Group) {
    this.stage = stage;
    // 绑定事件处理函数
    this.eventHandlerMap.mousemove = this.onMouseMove;
    this.eventHandlerMap.mousedown = this.onMouseDown;
    this.eventHandlerMap.mouseup = this.onMouseUp;
    this.eventHandlerMap.mouseleave = this.onMouseLeave;
  }

  // 鼠标移动事件处理函数
  // 在 dom 的 mousemove 事件触发时，会调用此函数
  // 以实现 canvas 内部图形的 mouseenter、mouseleave、mousemove、mouseout、mouseover 事件
  private onMouseMove = (e: EventObject) => {
    // 获取鼠标碰撞到的目标节点
    const hitTarget = this.hitTest(e.global);
    // 获取悬浮目标中最顶层节点
    const topTarget = getArrLast(this.overTargets);
    // 记录 hitTarget 的传播路径，在后续需要时获取
    let hitPath;

    // 如果存在 topTarget，且 topTarget 和碰撞目标不一致，说明鼠标移出了 topTarget
    // 触发 mouseout、mouseleave 事件
    if (topTarget && hitTarget !== topTarget) {
      // 先处理 mouseout 事件
      // 冒泡，移入和移出其子元素时也会触发
      e.target = topTarget;
      e.type = "mouseout";
      // 派发当前事件
      this.dispatchEvent(e);

      // 触发了 mouseout 事件，那么肯定触发了 mouseleave 事件
      // 当鼠标移出元素以及元素的所有子元素时，触发mouseleave事件，不传播
      // 如果 hitTarget 不存在，则肯定触发 mouseleave
      // 再看是否真的移出了 topTarget，而不是进入了其子节点，即判断 hitTarget 是否是 topTarget 的后代节点。
      !hitPath && (hitPath = this.spreadPath(hitTarget));
      if (!hitTarget || !hitPath.includes(topTarget)) {
        e.type = "mouseleave";
        // 下面又分两种情况
        // 如果 hitTarget 不存在，说明鼠标离开了整个舞台，原本的悬浮节点都要触发 mouseleave 事件
        if (!hitTarget) {
          // 遍历悬浮目标，触发 mouseleave 事件
          for (let i = this.overTargets.length - 1; i >= 0; i--) {
            this.emitAtTargetEvent(this.overTargets[i], e);
          }
        } else {
          // 如果 hitTarget 存在，说明鼠标移出了 topTarget，但是进入了 hitTarget
          // 要找到两者的最近公共父节点，触发 topTarget 到公共父节点的 mouseleave 事件
          // 从 topTarget 向根节点遍历，直到父节点在 hitPath 中，说明是最近公共父节点，不触发 mouseleave
          for (let i = this.overTargets.length - 1; i >= 0; i--) {
            if (hitPath.includes(this.overTargets[i])) {
              break;
            }
            this.emitAtTargetEvent(this.overTargets[i], e);
          }
        }
      }
    }

    // 处理 mouseover 和 mouseenter 事件
    // 即 hitTarget 存在，且 hitTarget 和 topTarget 不一致
    if (hitTarget && hitTarget !== topTarget) {
      // 同样，先处理会冒泡的 mouseover 事件
      e.target = hitTarget;
      e.type = "mouseover";
      this.dispatchEvent(e);

      // 再处理 mouseenter
      !hitPath && (hitPath = this.spreadPath(hitTarget));
      e.type = "mouseenter";
      // 如果没有 topTarget，说明鼠标从舞台外部直接进入了 hitTarget
      if (!topTarget) {
        // 直接遍历 hitPath，触发 mouseenter 事件
        for (let i = 0; i < hitPath.length; i++) {
          this.emitAtTargetEvent(hitPath[i], e);
        }
      } else {
        // 如果有 topTarget，说明鼠标从 topTarget 移入了 hitTarget
        // 找到两者的最近公共父节点，触发 hitTarget 到公共父节点的 mouseenter 事件
        for (let i = hitPath.length - 1; i >= 0; i--) {
          // overTargets 存在 hitPath[i]，说明 hitPath[i] 是公共父节点
          if (this.overTargets.includes(hitPath[i])) {
            break;
          }
          this.emitAtTargetEvent(hitPath[i], e);
        }
      }
    }

    // 处理 mousemove 事件
    if (hitTarget) {
      !hitPath && (hitPath = this.spreadPath(hitTarget));
      e.target = hitTarget;
      e.type = "mousemove";
      this.dispatchEvent(e);
    }

    // 更新悬浮目标
    this.overTargets = hitPath ?? [];

    // 更新鼠标样式
    // 从悬浮目标根元素开始找到首个不为 auto 的 cursor，实现继承 cursor 的效果
    this.cursor = "auto";
    for (let i = this.overTargets.length - 1; i >= 0; i--) {
      this.cursor = this.overTargets[i].cursor;
      if (this.cursor !== "auto") {
        break;
      }
    }
  };

  // 鼠标按下事件处理函数
  private onMouseDown = (e: EventObject) => {
    const hitTarget = this.hitTest(e.global);
    if (!hitTarget) {
      return;
    }
    e.target = hitTarget;
    e.type = "mousedown";
    this.dispatchEvent(e);
    // 记录mousedown时的传播路径
    this.pressTargetsMap[e.button] = this.spreadPath(hitTarget);
  };

  // 鼠标抬起事件处理函数
  private onMouseUp = (e: EventObject) => {
    const hitTarget = this.hitTest(e.global);
    if (!hitTarget) {
      return;
    }
    e.target = hitTarget;
    e.type = "mouseup";
    this.dispatchEvent(e);

    // 获取 mousedown 时对应 button 的传播路径
    const propagationPath = this.pressTargetsMap[e.button];
    if (!propagationPath) {
      return;
    }
    // 获取顶部节点
    const pressTarget = propagationPath[propagationPath.length - 1];
    // 处理click事件
    // mdn上是这么说的：如果在一个元素上按下按钮，而将指针移到元素外再释放按钮，则在包含这两个元素的最具体的父级元素上触发 click 事件。
    let clickTarget = pressTarget;
    // 找到两者的最近公共父节点
    if (pressTarget !== hitTarget) {
      const hitPath = this.spreadPath(hitTarget);
      for (let i = propagationPath.length - 2; i >= 0; i--) {
        if (hitPath.includes(propagationPath[i])) {
          clickTarget = propagationPath[i];
          break;
        }
      }
    }
    if (clickTarget) {
      e.target = clickTarget;
      e.type = "click";
      this.dispatchEvent(e);
    }
  };

  // 鼠标离开事件处理函数
  private onMouseLeave = (e: EventObject) => {
    // 鼠标离开了画布，那就直接将悬浮目标清空
    this.overTargets = [];
  };

  // 触发事件
  public emitEvent = (e: EventObject) => {
    this.eventHandlerMap[e.type]?.(e);
  };

  // 碰撞检测，返回碰撞到的首个节点
  private hitTest = (p: Point): Group | null => {
    this.hitTarget = null;
    // 从根节点开始递归检测
    this.hitTestRecursive(this.stage, p);
    return this.hitTarget;
  };

  private hitTestRecursive = (curTarget: Group, p: Point) => {
    // 如果对象不可见则返回
    if (!curTarget.visible) {
      return;
    }
    // 深度优先遍历子元素
    // 从最后一个子元素开始遍历，因为 zIndex 越大的元素越靠后。
    for (let i = curTarget.children.length - 1; i >= 0; i--) {
      this.hitTestRecursive(curTarget.children[i], p);
      // 找到后直接返回
      if (this.hitTarget) {
        return;
      }
    }
    // 检测当前节点是否碰撞
    if (curTarget.contains(p)) {
      this.hitTarget = curTarget;
    }
  };

  // 获取事件的传播路径，从目标节点到根节点
  private spreadPath = (target: Group | null) => {
    return target?.getSpreadPath() ?? [];
  };

  // 派发事件
  dispatchEvent(e: EventObject) {
    e.propagationStopped = false;
    const spreadPath = this.spreadPath(e.target);
    this.propagateEvent(e, spreadPath);
  }

  // 传播事件
  propagateEvent(e: EventObject, spreadPath: Group[]) {
    // 捕获阶段
    e.eventPhase = EventPhase.CAPTURING;
    // 从根节点向目标节点传播，即正向遍历
    for (let i = 0; i < spreadPath.length; i++) {
      e.currentTarget = spreadPath[i];
      e.currentTarget.emit(`${e.type}_capture`, e);
      // 如果事件停止传播，则直接返回
      if (e.propagationStopped) {
        return;
      }
    }

    // 目标阶段
    this.emitAtTargetEvent(e.target, e);
    if (e.propagationStopped) {
      return;
    }

    // 冒泡阶段
    e.eventPhase = EventPhase.BUBBLING;
    // 从目标节点向根节点传播，即反向遍历，跳过最后一个，因为那是触发事件的目标节点
    for (let i = spreadPath.length - 2; i >= 0; i--) {
      e.currentTarget = spreadPath[i];
      e.currentTarget.emit(`${e.type}_bubble`, e);
      if (e.propagationStopped) {
        return;
      }
    }
  }

  // 触发处于目标节点的事件
  emitAtTargetEvent(target: Group, e: EventObject) {
    e.eventPhase = EventPhase.AT_TARGET;
    e.target = target;
    e.currentTarget = target;
    // 总会触发目标节点的事件，无论是冒泡还是捕获
    e.currentTarget.emit(`${e.type}_capture`, e);
    e.currentTarget.emit(`${e.type}_bubble`, e);
  }

  // 判断某个节点e1是否是另一个节点e2的后代节点
  isDescendantOf(e1: Group, e2: Group): boolean {
    // 获取节点 e1 的传播路径，也就是其父节点链，看是否包含 e2
    return this.spreadPath(e1).includes(e2);
  }
}
