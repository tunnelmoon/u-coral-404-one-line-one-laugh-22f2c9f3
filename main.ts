// One Line, One Laugh entry: a single hilarious line, at most 200 characters.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I tried meal prepping. My fridge now holds five identical regrets in matching containers.";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`line must be 1 to 200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("line must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("line must not contain control characters");
}
if (LINE !== LINE.trim()) {
  fail("line must not have leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip read-back check: what was written must be exactly the line,
// down to the byte.
const back = readFileSync(outPath, "utf8");
if (back !== LINE || Buffer.byteLength(back, "utf8") !== LINE.length) {
  fail("round-trip read-back mismatch");
}
console.log(`wrote ${outPath} (${LINE.length} characters)`);
