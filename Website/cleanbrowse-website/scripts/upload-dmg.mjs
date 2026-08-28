import { put } from "@vercel/blob";
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from "fs";
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
//
// Optional flags (release.sh passes these; with them the script also writes the
// new <item> into public/appcast.xml so no manual paste step remains):
//   --build <n>     CFBundleVersion of the release (sparkle:version)
//   --min-os <v>    LSMinimumSystemVersion (sparkle:minimumSystemVersion)
// Release notes come from the APPCAST_NOTES env var (plain text, one bullet per line).
const rawArgs = process.argv.slice(2);
let buildNumber = null;
let minOS = null;
const args = [];
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === "--build") buildNumber = rawArgs[++i];
  else if (rawArgs[i] === "--min-os") minOS = rawArgs[++i];
  else args.push(rawArgs[i]);
}
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
      "  Optional: --build <CFBundleVersion> --min-os <version>  (also updates public/appcast.xml)\n" +
      "Example: node scripts/upload-dmg.mjs 1.2.0 --build 2 --min-os 14.6"
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

// 3. Sign the DMG for Sparkle, then write the new <item> into public/appcast.xml
//    (falls back to printing a paste-ready enclosure when --build wasn't given).
const signUpdate = findSignUpdate();
let signed = false;
if (signUpdate) {
  try {
    const output = execFileSync(signUpdate, [dmgPath], { encoding: "utf8" }).trim();
    signed = true;
    const enclosure =
      `      <enclosure\n` +
      `        url="${versioned.url}"\n` +
      `        type="application/octet-stream"\n` +
      `        ${output.replace(/ length=/, `\n        length=`)} />`;

    if (buildNumber) {
      updateAppcast(enclosure);
    } else {
      console.log("\nPaste this into the <item> in public/appcast.xml:\n");
      console.log(enclosure);
    }
  } catch (err) {
    console.error("\nsign_update failed:", err.message);
  }
} else {
  console.error("\nsign_update not found in DerivedData — build the app in Xcode once, or sign manually.");
}

function updateAppcast(enclosure) {
  const appcastPath = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "appcast.xml");
  let xml = readFileSync(appcastPath, "utf8");

  // Notes: plain text from APPCAST_NOTES, one bullet per line ("- " prefix optional).
  const notesLines = (process.env.APPCAST_NOTES || "")
    .split("\n")
    .map((l) => l.replace(/^\s*[-•]\s*/, "").trim())
    .filter(Boolean);
  const notesHtml = notesLines.length
    ? `        <ul>\n${notesLines.map((l) => `          <li>${l.replaceAll("]]>", "]]&gt;")}</li>`).join("\n")}\n        </ul>`
    : `        <ul>\n          <li>Bug fixes and improvements.</li>\n        </ul>`;

  const item =
    `    <item>\n` +
    `      <title>Version ${version}</title>\n` +
    `      <sparkle:version>${buildNumber}</sparkle:version>\n` +
    `      <sparkle:shortVersionString>${version}</sparkle:shortVersionString>\n` +
    (minOS ? `      <sparkle:minimumSystemVersion>${minOS}</sparkle:minimumSystemVersion>\n` : "") +
    `      <description><![CDATA[\n` +
    `        <h2>What's new in ${version}</h2>\n` +
    `${notesHtml}\n` +
    `      ]]></description>\n` +
    `      <pubDate>${new Date().toUTCString()}</pubDate>\n` +
    `${enclosure}\n` +
    `    </item>`;

  // Idempotent re-runs: drop any existing item for this same version first.
  // Anchored on the exact structure this script generates (<item> then <title>),
  // so free text in comments can never satisfy the match.
  const sameVersion = new RegExp(
    `\\n?[ \\t]*<item>\\s*<title>Version ${version.replaceAll(".", "\\.")}</title>[\\s\\S]*?</item>`,
    "g"
  );
  xml = xml.replace(sameVersion, "");

  // Newest item goes first, right after the <language> line.
  const anchor = /(<language>[^<]*<\/language>)/;
  if (!anchor.test(xml)) {
    console.error("\nCould not find insertion point in appcast.xml — paste this <item> manually:\n\n" + item);
    return;
  }
  xml = xml.replace(anchor, `$1\n${item}`);
  writeFileSync(appcastPath, xml);
  console.log(`\nUpdated public/appcast.xml with the ${version} item (build ${buildNumber}).`);
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

if (buildNumber && signed) {
  console.log("\nRemaining: review the appcast.xml diff, then commit and deploy the website.");
} else {
  console.log("\nRemaining: update public/appcast.xml (version, notes, enclosure) and deploy the website.");
}
