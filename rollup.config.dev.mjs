import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import common from "./rollup.config.common.mjs";
import { name } from "./config.mjs";
import clear from "rollup-plugin-clear";
import typescript from "@rollup/plugin-typescript";

export default Object.assign({}, common, {
  input: {
    index: "./src/test/index.ts",
  },
  output: [
    {
      dir: "dev",
      entryFileNames: "[name].js",
      format: "umd",
      name,
    },
  ],
  plugins: [
    ...common.plugins,
    typescript({
      compilerOptions: {
        outDir: "./dev",
        sourceMap: true,
      },
    }),
    clear({
      targets: ["dev"],
      // 在监视模式下进行汇总重新编译时是否清除目录
      watch: false, // default: false
    }),
    serve({
      port: 3000, // 端口
      contentBase: "", // 输出目录
      openPage: "/index.html",
      open: false, // 自动打开浏览器
    }),
    livereload(),
  ],
});
