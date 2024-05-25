import * as RollupDemo from "../index";

const app = new RollupDemo.App({
  canvas: document.querySelector("canvas")!,
  backgroundAlpha: 1,
});
const a = new RollupDemo.Graphics()
  .beginFill()
  .drawRect(0, 0, 100, 100)
  .beginFill({
    color: "blue",
  })
  .drawRect(300, 50, 50, 50);
a.transform.rotate = 45 * (Math.PI / 180);
a.transform.scale.set(2, 2);

const b = new RollupDemo.Graphics().beginFill().drawRect(200, 50, 100, 100);
b.transform.rotate = 45 * (Math.PI / 180);
b.transform.pivot.set(200, 50);
b.addEventListener("click", (e) => {
  console.log(e.clone());
});

a.setAlpha(0.6).addEventListener("click", (e) => {
  console.log(e.clone());
});

a.add(b);

app.stage.add(a).setCursor("pointer");

// 实现一个拖动
a.addEventListener("mousedown", (e) => {
  const mouseDownPoint = e.global.clone();
  const { x, y } = a.transform.position;
  const onMove = (e: any) => {
    const movePoint = e.global.clone();
    const dx = movePoint.x - mouseDownPoint.x;
    const dy = movePoint.y - mouseDownPoint.y;
    a.setPosition(x + dx, y + dy);
  };
  app.stage.addEventListener("mousemove", onMove);
  a.addEventListener(
    "mouseup",
    () => {
      app.stage.removeEventListener("mousemove", onMove);
    },
    { once: true }
  );
});

// 绘制10w个矩形
// for (let i = 0; i < 100000; i++) {
//   const g = new RollupDemo.Graphics()
//     .beginFill({
//       color: `rgb(${Math.random() * 255},${Math.random() * 255},${
//         Math.random() * 255
//       })`,
//     })
//     .drawRect(
//       Math.random() * 800,
//       Math.random() * 600,
//       Math.random() * 100,
//       Math.random() * 100
//     );
//   app.stage.add(g);
//   g.addEventListener("click", (e) => {
//     console.log(e.clone());
//   });
// }
