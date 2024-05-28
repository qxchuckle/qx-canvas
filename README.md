# QxCanvas
这是一个小巧、高性能的 Canvas2D 渲染引擎。

基于树结构，可以像 DOM 一样操作 Canvas 图形，并很容易进行事件交互。

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
















