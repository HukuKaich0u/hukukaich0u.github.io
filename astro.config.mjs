import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";

export default defineConfig({
  site: "https://hukukaich0u.github.io",
  integrations: [mdx(), icon()]
});
