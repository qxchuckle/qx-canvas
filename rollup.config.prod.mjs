import common from "./rollup.config.common.mjs";
import { name } from "./config.mjs";
import dts from "rollup-plugin-dts";
import clear from "rollup-plugin-clear";
import typescript from "@rollup/plugin-typescript";

export default [
  Object.assign({}, common, {
    output: [
      {
        dir: "dist",
        entryFileNames: "[name].js",
        format: "umd",
        name,
      },
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
      typescript({
        compilerOptions: {
          outDir: "./dist",
        },
      }),
      clear({
        targets: ["dist"],
      }),
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
