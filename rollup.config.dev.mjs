import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import common from "./rollup.config.common.mjs";
import { name } from "./config.mjs";

export default Object.assign({}, common, {
  input: {
    test: "./src/test/index.ts",
  },
  output: [
    {
      dir: "dist",
      entryFileNames: "[name].js",
      format: "umd",
      name,
    },
  ],
  plugins: [
    ...common.plugins,
    serve({
      port: 3000, // 端口
      contentBase: "", // 输出目录
      openPage: "/index.html", // 打开的是哪个文件
      open: false, // 自动打开浏览器
    }),
    livereload(),
  ],
});
