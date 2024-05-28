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
  plugins: [...common.plugins],
});
