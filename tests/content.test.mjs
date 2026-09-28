import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const data = JSON.parse(
  readFileSync(new URL("../content/portfolio.json", import.meta.url)),
);
test("public profile uses new GitHub and all work routes are safe and unique", () => {
  assert.equal(data.profile.github, "https://github.com/cam3715");
  assert.equal(new Set(data.work.map((w) => w.id)).size, data.work.length);
  for (const w of data.work) {
    assert.match(w.id, /^[a-z0-9-]+$/);
    assert.ok(w.summary);
    assert.ok(w.contribution);
    assert.ok(w.boundary);
  }
});
test("content covers the three new teams and original projects", () => {
  assert.deepEqual(
    data.work.map((w) => w.id),
    [
      "mobile-apis",
      "plume",
      "professional-indexer",
      "retrospective-board",
      "code-editor",
    ],
  );
  assert.ok(data.profile.revision);
});
