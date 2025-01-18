import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: isDev ? [legacy(), react()] : [],
    resolve: {
      alias: {
        // for TypeScript path alias import like : @/x/y/z
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          secure: false,
          rewrite: path => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/components/index.tsx"),
        name: "CodermeyUI",
        fileName: format => `codermey-ui.${format}.js`,
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["react", "react-dom"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
  };
});
