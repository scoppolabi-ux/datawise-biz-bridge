/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Shared WCM document engine, reused by the Node release pipeline and
      // by the in-app Word/PDF distribution artifacts.
      "wcm-doc-engine/markdown": path.resolve(__dirname, "./scripts/wcm-documentation/markdown.mjs"),
      "wcm-doc-engine/docx": path.resolve(__dirname, "./scripts/wcm-documentation/docx.mjs"),
      "wcm-doc-engine/pdf-render": path.resolve(__dirname, "./scripts/wcm-documentation/pdfRender.mjs"),
    },
  },
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // Deno-native edge function tests (https: imports) run via the Supabase
      // edge function test runner, not vitest.
      'supabase/functions/wcm-method-projector/normalize.test.ts',
    ],
  },
}));
