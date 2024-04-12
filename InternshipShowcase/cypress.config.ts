import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 10000,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 0,
  e2e: {
      experimentalStudio: true,
      viewportHeight: 794,
      viewportWidth: 1440,
  }
});
