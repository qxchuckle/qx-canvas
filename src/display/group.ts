import { CanvasRenderer } from "../renderer";
import { Node } from "./node";

export class Group extends Node {
  // 子节点列表
  children: Group[] = [];

  // 渲染自身，及其子节点
  public renderCanvas(renderer: CanvasRenderer) {
    // 如果不可见，直接返回
    if (!this.visible) {
      return;
    }
    // 渲染自身
    this.renderSelf(renderer);
    // 渲染子节点
    this.renderChildren(renderer);
    return this;
  }

  // 渲染自身
  // 子元素应该重写或继续扩展这个方法以绘制图形
  public renderSelf(renderer: CanvasRenderer) {
    this.applyTransform(renderer);
    return this;
  }

  // 渲染子节点
  protected renderChildren(renderer: CanvasRenderer) {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].renderCanvas(renderer);
    }
    return this;
  }

  // 添加子节点
  public add(child: Group) {
    // 如果子节点已经有父节点，先从父节点移除
    child.parent?.remove(child);
    // 添加到当前节点
    this.children.push(child);
    // 设置父节点为当前节点
    child.parent = this;
    // 标记未排序
    this.sorted = false;
    return this;
  }

  // 移除子节点
  public remove(child: Group) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
    return this;
  }

  // 应用变换
  public applyTransform(renderer: CanvasRenderer) {
    const { a, b, c, d, tx, ty } = this.transform.worldMatrix;
    renderer.ctx.setTransform(a, b, c, d, tx, ty);
  }
}
