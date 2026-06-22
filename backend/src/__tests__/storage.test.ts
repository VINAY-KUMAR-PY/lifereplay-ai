import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("Storage resilience patterns", () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "lifereplay-test-")); });
  afterEach(async () => { await fs.rm(tmpDir, { recursive: true, force: true }); });

  it("handles missing file by returning empty array", async () => { const file = path.join(tmpDir, "missing.json"); try { await fs.access(file); } catch { await fs.writeFile(file, "[]", "utf-8"); } expect(JSON.parse(await fs.readFile(file, "utf-8"))).toEqual([]); });
  it("handles corrupted JSON by resetting to empty array", async () => { const file = path.join(tmpDir, "corrupted.json"); await fs.writeFile(file, "{ invalid", "utf-8"); let result: unknown[]; try { result = JSON.parse(await fs.readFile(file, "utf-8")); } catch { await fs.writeFile(file, "[]", "utf-8"); result = []; } expect(result).toEqual([]); });
  it("prepends new items and enforces cap", async () => { const file = path.join(tmpDir, "history.json"); const existing = Array.from({ length: 100 }, (_, index) => ({ id: String(index) })); await fs.writeFile(file, JSON.stringify(existing), "utf-8"); const history = JSON.parse(await fs.readFile(file, "utf-8")) as { id: string }[]; await fs.writeFile(file, JSON.stringify([{ id: "new" }, ...history].slice(0, 100), null, 2), "utf-8"); const final = JSON.parse(await fs.readFile(file, "utf-8")) as { id: string }[]; expect(final).toHaveLength(100); expect(final[0].id).toBe("new"); expect(final[99].id).toBe("98"); });
  it("creates nested directories", async () => { const nested = path.join(tmpDir, "deep", "nested", "data"); await fs.mkdir(nested, { recursive: true }); const file = path.join(nested, "test.json"); await fs.writeFile(file, "[]", "utf-8"); expect(await fs.readFile(file, "utf-8")).toBe("[]"); });
});
