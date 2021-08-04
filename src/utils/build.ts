/* eslint-disable unicorn/no-process-exit */
/* eslint-disable promise/prefer-await-to-callbacks */
import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { Generator } from "npm-dts";

const main = async () => {
  try {
    await new Generator({
      entry: "src/index.ts",
      output: "dist/index.d.ts",
    }).generate();
  } catch (error) {
    console.log(error);
  }

  const shared = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    incremental: true,
    target: "node12",
    plugins: [nodeExternalsPlugin({ packagePath: "package.json" })],
  };

  await build({
    ...shared,
    logLevel: "info",
    platform: "node",
    outfile: "dist/index.js",
    format: "cjs",
  });

  await build({
    ...shared,
    logLevel: "info",
    platform: "node",
    outfile: "dist/index.esm.js",
    format: "esm",
  });
  console.log("🚀 Build successfully completed");
};

main()
  .catch((error) => {
    console.log("Some error happened during building", error);
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .finally(() => {
    process.exit(0);
  });
