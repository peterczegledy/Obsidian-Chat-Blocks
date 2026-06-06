import esbuild from "esbuild";

const prod = process.argv.includes("production");

esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "dist/main.js",
  external: ["obsidian"],
  format: "cjs",
  sourcemap: !prod,
  minify: prod,
  target: "es2020"
}).catch(() => process.exit(1));