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
  target: ["es2019", "chrome80"],
  watch: env === "development",
  skipNodeModulesBundle: true,
  entryPoints: ["src/index.ts"],
};
