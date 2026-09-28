import { test, expect } from "@playwright/test";
test("team explorer and work filter expose the right content", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Reliable backends",
  );
  await page.getByRole("button", { name: /02 Plume/ }).click();
  await expect(
    page.getByRole("heading", { name: "From research to a working draft." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore my work" }).click();
  await page.getByRole("button", { name: "AI & Search", exact: true }).click();
  await expect(page.locator(".work-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Fullstack", exact: true }).click();
  await expect(page.locator(".work-card")).toHaveCount(2);
});
test("search finds real experience and handles no matches", async ({
  page,
}) => {
  await page.goto("/search/");
  await page.getByRole("searchbox").fill("Solr");
  await page.getByRole("button", { name: "Search ↗", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Professional Indexer", exact: true }),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("zzzzunknown");
  await page.getByRole("button", { name: "Search ↗", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No matching work yet." }),
  ).toBeVisible();
});
test("mobile routes fit viewport and navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/work/",
    "/work/plume/",
    "/about/",
    "/contact/",
    "/resume/",
    "/search/",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\/$/);
});
test("static pages remain useful without JavaScript", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:3000/work/");
  await expect(page.locator(".work-card")).toHaveCount(5);
  await page.getByRole("link", { name: /Plume · GenAI/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "From research",
  );
  await ctx.close();
});
test("keyboard skip link and updated GitHub", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await expect(page.getByRole("link", { name: "GitHub ↗" })).toHaveAttribute(
    "href",
    "https://github.com/cam3715",
  );
});

test("project source links appear in homepage, projects, detail and resume", async ({
  page,
}) => {
  for (const route of ["/", "/projects/", "/work/code-editor/", "/resume/"]) {
    await page.goto(route);
    await expect(
      page.locator('a[href="https://github.com/cam3715/CodeCollab"]'),
    ).toBeVisible();
  }
  await page.goto("/projects/");
  await expect(
    page.getByRole("heading", { name: "Retrospective Board for Teams" }),
  ).toBeVisible();
  await expect(
    page.getByText("No public repository or demo link supplied.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("a a")).toHaveCount(0);
});
