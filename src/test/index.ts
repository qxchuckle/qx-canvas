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
  // .setZIndex(10)
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
    alpha: 0.5,
  })
  .beginLine({
    alpha: 1,
  })
  .drawRect(200, 50, 100, 100)
  .setRotation(45)
  .setPivot(200, 50)
  .addEventListener("click", (e) => {
    console.log(e.clone());
  });

a.add(b);

app.stage.add(a);

// 实现拖动
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
  app.stage.addEventListener(
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
    app.stage.addEventListener(
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
    app.stage.addEventListener(
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
  .setCursor("pointer")
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
    alpha: 0.3,
  })
  .moveTo(100, 100)
  .lineTo(200, 200)
  .lineTo(500, 200)
  .closePath()
  .moveTo(200, 400)
  .lineTo(500, 600)
  .beginLine({ width: 6, color: "red", alpha: 0.5 })
  .beginFill({ color: "blue" })
  .moveTo(200, 50)
  .lineTo(150, 100)
  .lineTo(300, 100)
  .closePath()
  .endFill()
  .beginLine({
    width: 2,
    color: "blue",
  })
  .moveTo(400, 400)
  .bezierCurveTo([400, 400, 500, 500, 600, 400], 1);

app.stage.add(s);

// 生命周期测试
// s.onBeforeMount((item) => {
//   console.log("before mount");
// })
//   .onMounted((item) => {
//     console.log("mounted");
//   })
//   .onBeforeRender((item, renderer) => {
//     console.log("before render");
//   })
//   .onRendering((item, renderer) => {
//     console.log("rendering");
//   })
//   .onRendered((item, renderer) => {
//     console.log("after render");
//     app.stage.remove(s);
//   })
//   .onBeforeUnmount((item) => {
//     console.log("before unmount");
//   })
//   .onUnmounted((item) => {
//     console.log("unmounted");
//   });

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

const text = new QxCanvas.Graphics()
  .beginFill({ color: "blue" })
  .drawText("Hello World", 600, 100, {
    font: "20px Arial",
    align: "center",
    baseline: "bottom",
    direction: "ltr",
    autoBreak: true,
    maxWidth: 60,
  })
  .endFill()
  .beginLine()
  .moveTo(600, 50)
  .lineTo(600, 150)
  .moveTo(550, 100)
  .lineTo(650, 100)
  .setCursor("pointer")
  .addEventListener("mousedown", (e) => {
    const mouseDownPoint = e.global.clone();
    const { x, y } = text.transform.position;
    const onMove = (e: any) => {
      const movePoint = e.global.clone();
      const dx = movePoint.x - mouseDownPoint.x;
      const dy = movePoint.y - mouseDownPoint.y;
      text.setPosition(x + dx, y + dy);
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
app.stage.add(text);

// 剪裁测试
const cp = new QxCanvas.Graphics()
  .beginClip()
  .moveTo(600, 500)
  .lineTo(700, 500)
  .lineTo(650, 600)
  .closePath()
  .beginFill()
  .drawRect(600, 500, 100, 100);

app.stage.add(cp);

const textMask = new QxCanvas.Graphics()
  .beginFill()
  .drawText("qcqx", 600, 250, { font: "48px border Arial" })
  .setPosition(10, 10);
const img = new QxCanvas.Graphics()
  // .beginClip()
  // .moveTo(600, 200)
  // .lineTo(700, 200)
  // .lineTo(650, 300)
  // .closePath()
  .beginFill({
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowBlur: 5,
    shadowColor: "rgba(0,0,0,0.5)",
  })
  // .beginFill()
  .drawImage(
    "https://cdn.qcqx.cn/img/head.webp",
    600,
    200,
    100 // 只传入宽度，高度自适应
  )
  .setCursor("pointer")
  .setMask(600, 200, 100, 100, textMask, "destination-in")
  .setPivot(600, 200)
  .setRotation(45);

app.stage.add(img);
