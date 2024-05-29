import { LifecycleHooks, LifecycleKey } from "../types";
import { CanvasRenderer } from "../renderer";
import { Node } from "./node";
import { nextTick } from "../utils";

export class Group extends Node {
  private lifecycleHooks: LifecycleHooks = new Map();

  // 添加生命周期钩子
  private addLifecycleHook(
    key: LifecycleKey,
    handler: (...argv: any[]) => void
  ) {
    if (!this.lifecycleHooks.has(key)) {
      this.lifecycleHooks.set(key, new Set());
    }
    this.lifecycleHooks.get(key)?.add(handler);
  }

  // 添加挂载前钩子
  onBeforeMount(handler: (item: this) => void) {
    this.addLifecycleHook(LifecycleKey.BeforeMount, handler);
    return this;
  }

  // 添加挂载后钩子
  onMounted(handler: (item: this) => void) {
    this.addLifecycleHook(LifecycleKey.Mounted, handler);
    return this;
  }

  // 添加渲染前钩子
  onBeforeRender(handler: (item: this, renderer: CanvasRenderer) => void) {
    this.addLifecycleHook(LifecycleKey.BeforeRender, handler);
    return this;
  }

  // 添加渲染中钩子，自身已经渲染完，但子节点还未渲染
  onRendering(handler: (item: this, renderer: CanvasRenderer) => void) {
    this.addLifecycleHook(LifecycleKey.Rendering, handler);
    return this;
  }

  // 添加渲染后钩子
  onRendered(handler: (item: this, renderer: CanvasRenderer) => void) {
    this.addLifecycleHook(LifecycleKey.Rendered, handler);
    return this;
  }

  // 添加卸载前钩子
  onBeforeUnmount(handler: (item: this) => void) {
    this.addLifecycleHook(LifecycleKey.BeforeUnmount, handler);
    return this;
  }

  // 添加卸载后钩子
  onUnmounted(handler: (item: this) => void) {
    this.addLifecycleHook(LifecycleKey.Unmounted, handler);
    return this;
  }

  // 调用生命周期钩子
  protected callLifecycleHook(
    key: LifecycleKey,
    item: this,
    renderer?: CanvasRenderer
  ) {
    const hooks = this.lifecycleHooks.get(key);
    if (hooks && hooks.size > 0) {
      for (const hook of hooks) {
        hook.call(this, item, renderer);
      }
    }
  }

  // 渲染自身，及其子节点
  public renderCanvas(renderer: CanvasRenderer) {
    this.callLifecycleHook(LifecycleKey.BeforeRender, this, renderer);
    // 如果不可见，直接返回
    if (!this.visible) {
      return;
    }
    // 渲染自身
    this.renderSelf(renderer);
    this.callLifecycleHook(LifecycleKey.Rendering, this, renderer);
    // 渲染子节点
    this.renderChildren(renderer);
    this.callLifecycleHook(LifecycleKey.Rendered, this, renderer);
    return this;
  }

  // 渲染自身
  // 子元素应该重写或继续扩展这个方法以绘制图形
  protected renderSelf(renderer: CanvasRenderer) {
    renderer.ctx.save();
    this.applyTransform(renderer);
    renderer.ctx.restore();
    return this;
  }

  // 渲染子节点
  protected renderChildren(renderer: CanvasRenderer) {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].renderCanvas(renderer);
    }
    return this;
  }

  private addOneChild(child: this) {
    // 如果子节点已经有父节点，先从父节点移除
    child.parent?.remove(child);
    child.callLifecycleHook(LifecycleKey.BeforeMount, child);
    // 添加到当前节点
    this.children.push(child);
    // 设置父节点为当前节点
    child.parent = this;
    // 标记未排序
    this.sorted = false;
    child.callLifecycleHook(LifecycleKey.Mounted, child);
  }

  // 添加子节点
  public add(child: this | this[]) {
    nextTick(() => {
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          this.addOneChild(child[i]);
        }
      } else {
        this.addOneChild(child);
      }
    });
    return this;
  }

  // 移除子节点
  public remove(child: this) {
    nextTick(() => {
      const index = this.children.indexOf(child);
      if (index !== -1) {
        child.callLifecycleHook(LifecycleKey.BeforeUnmount, child);
        this.children.splice(index, 1);
        child.parent = null;
        child.callLifecycleHook(LifecycleKey.Unmounted, child);
      }
    });
    return this;
  }

  // 清空子节点
  public removeChildren() {
    for (let i = 0; i < this.children.length; i++) {
      this.remove(this.children[i]);
    }
    return this;
  }

  // 移除自身
  public removeSelf() {
    this.parent?.remove(this);
    return this;
  }

  // 销毁
  public destroy() {
    this.removeChildren();
    this.removeSelf();
  }

  // 应用变换
  protected applyTransform(renderer: CanvasRenderer) {
    const { a, b, c, d, tx, ty } = this.transform.worldMatrix;
    renderer.ctx.transform(a, b, c, d, tx, ty);
  }

  // 获取传播路径
  getSpreadPath() {
    const res: Group[] = [];
    let target: Group | null = this;
    while (target) {
      res.push(target);
      // 如果节点有父节点，则继续向上查找
      target = target.parent;
    }
    return res.reverse();
  }
}
