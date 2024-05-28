import * as QxCanvas from "qx-canvas";

const color = document.querySelector("#color") as HTMLInputElement;

const app = new QxCanvas.App({
  canvas: document.querySelector("canvas")!,
});

const rect1 = new QxCanvas.Graphics()
  .beginFill({
    color: "blue",
  })
  .drawRect(0, 0, 100, 100)
  .setRotation(45)
  .setScale(2, 2)
  .setAlpha(0.6)
  .setCursor("pointer");
rect1.addEventListener("click", (e) => {
  console.log(e.clone());
});
app.stage.add(rect1);

const circle1 = new QxCanvas.Graphics()
  .beginLine({
    width: 5,
  })
  .drawCircle(200, 200, 50);
rect1.add(circle1);

const path1 = new QxCanvas.Graphics()
  .beginLine()
  .moveTo(0, 0)
  .lineTo(100, 100)
  .lineTo(200, 0)
  .closePath();
app.stage.add(path1);
