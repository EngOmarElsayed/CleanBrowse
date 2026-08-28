export const DMG_URL =
  "https://mwxjmxew0wyerqxi.public.blob.vercel-storage.com/CleanBrowse.dmg";

export const GITHUB_URL = "https://github.com/EngOmarElsayed/CleanBrowse";

export const APTABASE_URL = "https://aptabase.com";

export const PRODUCT_HUNT_URL =
  "https://www.producthunt.com/products/cleanbrowse-free-adult-content-blocker?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-cleanbrowse-free-adult-content-blocker";

// theme: "light" | "neutral" | "dark"
export function productHuntBadge(theme: "light" | "neutral" | "dark") {
  return `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1235078&theme=${theme}`;
}
