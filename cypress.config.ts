/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from "cypress";
import { loadEnvConfig } from "@next/env";

const { combinedEnv } = loadEnvConfig(process.cwd());
export default defineConfig({
  env: combinedEnv,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    viewportHeight: 720,
    viewportWidth: 1280,
    env: {
      NODE_ENV: "test",
    },
  },
});
