import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import common from "./rollup.config.common.mjs";

export default Object.assign({}, common, {
  output: [
    {
      dir: "dist",
      entryFileNames: "[name].js",
      format: "umd",
      name: "test",
    },
  ],
  plugins: [
    ...common.plugins,
    serve({
      port: 3001, // 端口
      contentBase: "", // 输出目录
      openPage: "/index.html",
      open: false, // 自动打开浏览器
    }),
    livereload(),
  ],
});
