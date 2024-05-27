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
  .drawRect(300, 50, 50, 50)
  .setZIndex(10);
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

a.add(b).setCursor("pointer");

app.stage.add(a);

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

// 绘制圆形
const c = new RollupDemo.Graphics()
  .beginFill({
    color: "red",
  })
  .drawCircle(400, 300, 100)
  .setCursor("pointer");
app.stage.add(c);

// 绘制椭圆
const d = new RollupDemo.Graphics()
  .beginFill({
    color: "green",
  })
  .drawEllipse(400, 100, 100, 50)
  .setCursor("pointer");
app.stage.add(d);

// 绘制圆角矩形
const rt = new RollupDemo.Graphics()
  .beginFill({
    color: "black",
  })
  .drawRoundRect(200, 200, 100, 50, 20)
  .setCursor("pointer");
app.stage.add(rt);

rt.addEventListener("click", (e) => {
  console.log(e.clone());
});

rt.addEventListener("mousedown", (e) => {
  const mouseDownPoint = e.global.clone();
  const { x, y } = rt.transform.position;
  const onMove = (e: any) => {
    const movePoint = e.global.clone();
    const dx = movePoint.x - mouseDownPoint.x;
    const dy = movePoint.y - mouseDownPoint.y;
    rt.setPosition(x + dx, y + dy);
  };
  app.stage.addEventListener("mousemove", onMove);
  rt.addEventListener(
    "mouseup",
    () => {
      app.stage.removeEventListener("mousemove", onMove);
    },
    { once: true }
  );
});

// 绘制多边形
const p = new RollupDemo.Graphics()
  .beginFill({
    color: "purple",
  })
  .beginLine({
    width: 2,
    color: "yellow",
  })
  .drawPolygon([150, 100, 200, 200, 100, 200])
  .setCursor("pointer");
p.addEventListener("mousedown", (e) => {
  const mouseDownPoint = e.global.clone();
  const { x, y } = p.transform.position;
  const onMove = (e: any) => {
    const movePoint = e.global.clone();
    const dx = movePoint.x - mouseDownPoint.x;
    const dy = movePoint.y - mouseDownPoint.y;
    p.setPosition(x + dx, y + dy);
  };
  app.stage.addEventListener("mousemove", onMove);
  p.addEventListener(
    "mouseup",
    () => {
      app.stage.removeEventListener("mousemove", onMove);
    },
    { once: true }
  );
});
app.stage.add(p);
