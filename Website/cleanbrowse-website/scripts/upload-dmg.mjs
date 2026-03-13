import { put } from "@vercel/blob";
import { readFileSync } from "fs";
import { resolve } from "path";

const dmgPath = process.argv[2];
if (!dmgPath) {
  console.error("Usage: BLOB_READ_WRITE_TOKEN=<token> node scripts/upload-dmg.mjs <path-to-CleanBrowse.dmg>");
  process.exit(1);
}

const file = readFileSync(resolve(dmgPath));

const blob = await put("CleanBrowse.dmg", file, {
  access: "public",
  addRandomSuffix: false,
});

console.log("Upload complete!");
console.log("Download URL:", blob.url);
console.log("\nUpdate the download href in src/app/page.tsx with this URL.");
