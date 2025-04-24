import {defineConfig} from "vite";

export default defineConfig({
    root: "client",
    base: "./",
    build: {
        outDir: "../docs",
        emptyOutDir: true,
    }
});