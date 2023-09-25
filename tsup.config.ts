import type { Options } from "tsup";

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: true,
  sourcemap: false,
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  minify: false,
  bundle: true,
  target: ["es2020", "chrome90"],
  watch: env === "development",
  skipNodeModulesBundle: true,
  entryPoints: ["src/index.ts"],
  treeshake: true,
};
