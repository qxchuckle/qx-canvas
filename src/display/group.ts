import { LifecycleHooks, LifecycleKey } from "../types";
import { CanvasRenderer } from "../renderer";
import { Node } from "./node";

export class Group extends Node {
  lifecycleHooks: LifecycleHooks = new Map();

  // 添加生命周期钩子
  private addLifecycleHook(
    key: LifecycleKey,
    handler: (item: this, renderer: CanvasRenderer) => void
  ) {
    if (!this.lifecycleHooks.has(key)) {
      this.lifecycleHooks.set(key, new Set());
    }
    this.lifecycleHooks.get(key)?.add(handler);
  }

  // 添加渲染前钩子
  onBeforeRender(handler: (item: this, renderer: CanvasRenderer) => void) {
    this.addLifecycleHook(LifecycleKey.BeforeRender, handler);
  }

  // 添加渲染后钩子
  onAfterRender(handler: (item: this, renderer: CanvasRenderer) => void) {
    this.addLifecycleHook(LifecycleKey.AfterRender, handler);
  }

  // 调用生命周期钩子
  private callLifecycleHook(
    key: LifecycleKey,
    item: this,
    renderer: CanvasRenderer
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
    // 渲染子节点
    this.renderChildren(renderer);
    this.callLifecycleHook(LifecycleKey.AfterRender, this, renderer);
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
    // 添加到当前节点
    this.children.push(child);
    // 设置父节点为当前节点
    child.parent = this;
    // 标记未排序
    this.sorted = false;
  }

  // 添加子节点
  public add(child: this | this[]) {
    if (Array.isArray(child)) {
      for (let i = 0; i < child.length; i++) {
        this.addOneChild(child[i]);
      }
    } else {
      this.addOneChild(child);
    }
    return this;
  }

  // 移除子节点
  public remove(child: this) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
    return this;
  }

  // 清空子节点
  public removeChildren() {
    this.children.length = 0;
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
    renderer.ctx.setTransform(a, b, c, d, tx, ty);
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
