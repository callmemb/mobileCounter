/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      // routesDirectory: "./src/routes", // Folder z trasami
      // generatedRouteTree: "./src/routeTree.gen.ts", // Wygenerowane drzewo tras
      // autoCodeSplitting: true, // Ważne: włącza dynamiczne importy
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'out',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    },
    minify: true,
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: ['./setupTests.ts'],
  // },
});
