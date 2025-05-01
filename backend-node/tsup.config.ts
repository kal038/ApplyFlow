// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"], // or wherever your entrypoint is
  outDir: "dist",
  format: ["esm"], // since you're using import/export
  sourcemap: true,
  clean: true,
  splitting: false,
  target: "es2020",
  dts: false, // no .d.ts files needed for backend
});
