import * as QxCanvas from "qx-canvas";

const color = document.querySelector("#color") as HTMLInputElement;

const app = new QxCanvas.App({
  canvas: document.querySelector("canvas")!,
});

const rect1 = new QxCanvas.Graphics()
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

const circle1 = new QxCanvas.Graphics()
  .beginLine({
    width: 5,
  })
  .setPosition(0, 100) // 设置位置偏移量
  .drawCircle(200, 0, 20);
rect1.add(circle1); // 作为rect1的子节点

const path1 = new QxCanvas.Graphics()
  .beginLine()
  .moveTo(100, 100)
  .lineTo(200, 200)
  .lineTo(300, 100)
  .closePath()
  .beginLine({
    width: 5,
    color: "blue",
  })
  .beginFill({
    color: "red",
  })
  .bezierCurveTo([400, 100, 500, 200, 600, 100], 1)
  .closePath();
app.stage.add(path1);
