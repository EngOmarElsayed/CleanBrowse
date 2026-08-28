import { put } from "@vercel/blob";
import { readFileSync, existsSync, readdirSync, unlinkSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";
import { execFileSync } from "child_process";

// Load BLOB_READ_WRITE_TOKEN from .env.local (gitignored — never commit the token).
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  }
}

// Usage:
//   node scripts/upload-dmg.mjs <version>              → uses ~/Desktop/CleanBrowse.dmg, deletes it on success
//   node scripts/upload-dmg.mjs <dmg-path> <version>   → uses the given file, keeps it
const args = process.argv.slice(2);
let dmgPath, version, deleteAfter;
if (args.length === 1) {
  dmgPath = join(homedir(), "Desktop", "CleanBrowse.dmg");
  version = args[0];
  deleteAfter = true;
} else if (args.length === 2) {
  dmgPath = resolve(args[0]);
  version = args[1];
  deleteAfter = false;
} else {
  console.error(
    "Usage:\n" +
      "  node scripts/upload-dmg.mjs <version>              (uses ~/Desktop/CleanBrowse.dmg, deletes it when done)\n" +
      "  node scripts/upload-dmg.mjs <dmg-path> <version>   (uses the given file, keeps it)\n" +
      "Example: node scripts/upload-dmg.mjs 1.2.0"
  );
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN not found — add it to .env.local or pass it in the environment.");
  process.exit(1);
}

if (!existsSync(dmgPath)) {
  console.error(`DMG not found at ${dmgPath} — export it there first.`);
  process.exit(1);
}

// Find Sparkle's sign_update in the SPM artifacts of any CleanBrowse DerivedData folder.
function findSignUpdate() {
  const derivedData = join(homedir(), "Library/Developer/Xcode/DerivedData");
  if (!existsSync(derivedData)) return null;
  for (const dir of readdirSync(derivedData)) {
    if (!dir.startsWith("CleanBrowse-")) continue;
    const tool = join(derivedData, dir, "SourcePackages/artifacts/sparkle/Sparkle/bin/sign_update");
    if (existsSync(tool)) return tool;
  }
  return null;
}

const file = readFileSync(dmgPath);

// 1. Versioned, immutable copy — this is what appcast.xml must point to.
//    Sparkle verifies the EdDSA signature against the exact bytes, so a
//    version's URL must never be overwritten with a different binary.
const versioned = await put(`CleanBrowse-${version}.dmg`, file, {
  access: "public",
  addRandomSuffix: false,
  allowOverwrite: true, // safe for re-runs of the SAME version; never reuse a version number after shipping
});
console.log("Uploaded (appcast, immutable):", versioned.url);

// 2. Stable URL used by the website's download button.
const stable = await put("CleanBrowse.dmg", file, {
  access: "public",
  addRandomSuffix: false,
  allowOverwrite: true, // this URL is meant to always serve the latest release
});
console.log("Uploaded (website button, stable):", stable.url);

// 3. Sign the DMG for Sparkle and print a ready-to-paste appcast enclosure.
const signUpdate = findSignUpdate();
let signed = false;
if (signUpdate) {
  try {
    const output = execFileSync(signUpdate, [dmgPath], { encoding: "utf8" }).trim();
    signed = true;
    console.log("\nPaste this into the <item> in public/appcast.xml:\n");
    console.log(`      <enclosure`);
    console.log(`        url="${versioned.url}"`);
    console.log(`        type="application/octet-stream"`);
    console.log(`        ${output.replace(/ length=/, `\n        length=`)} />`);
  } catch (err) {
    console.error("\nsign_update failed:", err.message);
  }
} else {
  console.error("\nsign_update not found in DerivedData — build the app in Xcode once, or sign manually.");
}

// 4. Clean up the Desktop copy — but only if signing succeeded, so the
//    file is still around to sign manually if something went wrong.
if (deleteAfter) {
  if (signed) {
    unlinkSync(dmgPath);
    console.log(`\nDeleted ${dmgPath}`);
  } else {
    console.log(`\nKept ${dmgPath} so you can sign it manually.`);
  }
}

console.log("\nRemaining: update public/appcast.xml (version, notes, enclosure) and deploy the website.");
