import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
    ...(process.env.CHROMIUM_PATH
      ? {
          launchOptions: {
            executablePath: process.env.CHROMIUM_PATH,
            args: ["--no-sandbox", "--disable-dev-shm-usage"],
          },
        }
      : {}),
  },
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
  },
  reporter: "list",
});
