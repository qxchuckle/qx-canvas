import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import common from "./rollup.config.common.mjs";
import { name } from "./config.mjs";
import dts from "rollup-plugin-dts";

export default [
  Object.assign({}, common, {
    output: [
      {
        dir: "dist",
        entryFileNames: "[name].js",
        format: "umd",
        name,
      },
      // {
      //   dir: "dist",
      //   entryFileNames: "[name].min.js",
      //   format: "umd",
      //   name,
      //   plugins: [terser()],
      // },
      {
        dir: "dist",
        entryFileNames: "[name].cjs.js",
        format: "cjs",
      },
      {
        dir: "dist",
        entryFileNames: "[name].esm.js",
        format: "es",
      },
    ],
    plugins: [
      ...common.plugins,
      // babel({
      //   exclude: "**/node_modules/**",
      //   babelHelpers: "runtime",
      //   extensions: [".js", ".ts"],
      // }),
    ],
  }),
  {
    // 打包d.ts
    input: {
      index: "./src/index.ts",
    },
    output: {
      dir: "dist",
      entryFileNames: "[name].d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
