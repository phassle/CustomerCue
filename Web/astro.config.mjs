import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import preact from "@astrojs/preact";

export default defineConfig({
  adapter: node({ mode: "standalone" }),
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
