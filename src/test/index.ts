import * as QxCanvas from "../index";

const color = document.querySelector("#color") as HTMLInputElement;

const app = new QxCanvas.App({
  canvas: document.querySelector("canvas")!,
  backgroundAlpha: 1,
});
const a = new QxCanvas.Graphics()
  .beginFill()
  .drawRect(0, 0, 100, 100)
  .beginFill({
    color: "blue",
  })
  .drawRect(300, 50, 50, 50)
  .setZIndex(10)
  .setRotation(45)
  .setScale(2, 2)
  .setAlpha(0.6)
  .addEventListener("click", (e) => {
    console.log(e.clone());
  })
  .setCursor("pointer");

const b = new QxCanvas.Graphics()
  .beginFill({
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowBlur: 5,
  })
  .drawRect(200, 50, 100, 100)
  .setRotation(45)
  .setPivot(200, 50)
  .addEventListener("click", (e) => {
    console.log(e.clone());
  });

a.add(b);

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
//   const g = new QxCanvas.Graphics()
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
const c = new QxCanvas.Graphics()
  .beginFill({
    color: "red",
  })
  .drawCircle(400, 300, 100)
  .setCursor("pointer");
app.stage.add(c);

// 绘制椭圆
const d = new QxCanvas.Graphics()
  .beginFill({
    color: "green",
  })
  .drawEllipse(400, 100, 100, 50)
  .setCursor("pointer");
app.stage.add(d);

// 绘制圆角矩形
const rt = new QxCanvas.Graphics()
  .beginFill({
    color: "black",
  })
  .drawRoundRect(200, 200, 100, 50, 20)
  .setCursor("pointer")
  .addEventListener("click", (e) => {
    console.log(e.clone());
  })
  .addEventListener("mousedown", (e) => {
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
app.stage.add(rt);

// 绘制多边形
const p = new QxCanvas.Graphics()
  .beginFill({
    color: "purple",
  })
  .beginLine({
    width: 2,
    color: "yellow",
  })
  .drawPolygon([150, 100, 200, 200, 100, 200])
  .setCursor("pointer")
  .addEventListener("mousedown", (e) => {
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

// 自由绘制线段
const s = new QxCanvas.Graphics()
  .beginLine({
    width: 2,
    color: "green",
    lineDash: [12, 3, 3],
  })
  .beginFill({
    color: "pink",
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowBlur: 5,
  })
  .moveTo(100, 100)
  .lineTo(200, 200)
  .lineTo(500, 200)
  .closePath()
  .moveTo(200, 400)
  .lineTo(500, 600)
  .beginLine({ width: 6, color: "red" })
  .beginFill({ color: "blue" })
  .moveTo(200, 50)
  .lineTo(150, 100)
  .lineTo(300, 100)
  .closePath();

app.stage.add(s);

// 自由绘制线段
const s1 = new QxCanvas.Graphics();
app.stage.add(s1).addEventListener("mousedown", (e) => {
  // s1.beginPath();
  s1.beginLine({ width: 2, color: color.value });
  const onMove = (e: any) => {
    s1.lineTo(e.global.x, e.global.y);
  };
  app.stage.addEventListener("mousemove", onMove);
  app.stage.addEventListener(
    "mouseup",
    () => {
      app.stage.removeEventListener("mousemove", onMove);
    },
    { once: true }
  );
});
