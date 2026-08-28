import { put } from "@vercel/blob";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

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

const [dmgPath, version] = process.argv.slice(2);
if (!dmgPath || !version) {
  console.error(
    "Usage: node scripts/upload-dmg.mjs <path-to-CleanBrowse.dmg> <version>\n" +
      "Example: node scripts/upload-dmg.mjs ~/Desktop/CleanBrowse.dmg 1.2.0\n" +
      "(reads BLOB_READ_WRITE_TOKEN from .env.local or the environment)"
  );
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN not found — add it to .env.local or pass it in the environment.");
  process.exit(1);
}

const file = readFileSync(resolve(dmgPath));

// Versioned, immutable copy — this is what appcast.xml must point to.
// Sparkle verifies the EdDSA signature against the exact bytes, so a
// version's URL must never be overwritten with a different binary.
const versioned = await put(`CleanBrowse-${version}.dmg`, file, {
  access: "public",
  addRandomSuffix: false,
});

// Stable URL used by the website's download button.
const stable = await put("CleanBrowse.dmg", file, {
  access: "public",
  addRandomSuffix: false,
});

console.log("Upload complete!");
console.log("Appcast URL (immutable):", versioned.url);
console.log("Website download URL (stable):", stable.url);
console.log(
  "\nNext steps:\n" +
    "  1. Sign the DMG for Sparkle: ./bin/sign_update " + dmgPath + "\n" +
    "  2. Add a new <item> to public/appcast.xml using the appcast URL above\n" +
    "     plus the sparkle:edSignature and length printed by sign_update.\n" +
    "  3. Deploy the website."
);
