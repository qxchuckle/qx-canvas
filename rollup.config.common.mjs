import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: {
    index: "./src/index.ts",
  }, // 打包入口
  plugins: [
    json(),
    nodeResolve(),
    commonjs({ extensions: [".js", ".ts"] }),
  ],
};
