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

a.setAlpha(0.6);

a.add(b);

app.stage.add(a).setCursor("pointer");
