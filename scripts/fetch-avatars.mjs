// Fetches the current profile photos into public/avatars/ before the build, so
// the Pages workflow publishes them (hourly, see .github/workflows/pages.yml).
// GitHub's photo is read live by the page; it is saved here only as a fallback.
// A failure never fails the build: the page falls back to the initials.
import { mkdir, writeFile } from "node:fs/promises";

const OUT = new URL("../public/avatars/", import.meta.url);
const UA = { "user-agent": "Mozilla/5.0 (compatible; romastefale-avatars)" };

const save = async (name, url) => {
  const r = await fetch(url, { headers: UA, redirect: "follow" });
  if (!r.ok) throw new Error(`${name}: ${url} → HTTP ${r.status}`);
  const type = r.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error(`${name}: ${url} → ${type || "no content-type"}`);
  await writeFile(new URL(`${name}.jpg`, OUT), Buffer.from(await r.arrayBuffer()));
  console.log(`ok   ${name}  ←  ${url}`);
};

const sources = {
  github: async () => save("github", "https://github.com/romastefale.png?size=160"),
  // t.me/<user> publishes the photo as og:image; with no photo it has none.
  telegram: async () => {
    const r = await fetch("https://t.me/tigrao", { headers: UA });
    const html = await r.text();
    const m = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (!m) throw new Error("telegram: no og:image (profile has no public photo?)");
    await save("telegram", m[1].replaceAll("&amp;", "&"));
  },
  // The .ton name is an NFT; its image is the closest thing to a photo.
  ton: async () => {
    const r = await fetch("https://tonapi.io/v2/dns/romastefale.ton", { headers: UA });
    if (!r.ok) throw new Error(`ton: tonapi HTTP ${r.status}`);
    const img = (await r.json())?.item?.metadata?.image;
    if (!img) throw new Error("ton: no image in the DNS item metadata");
    await save("ton", img);
  },
};

await mkdir(OUT, { recursive: true });
let failed = 0;
for (const [name, run] of Object.entries(sources)) {
  try {
    await run();
  } catch (e) {
    failed++;
    console.warn(`::warning::avatar ${name} not updated: ${e.message}`);
  }
}
await writeFile(new URL("meta.json", OUT), JSON.stringify({ updated: new Date().toISOString(), failed }) + "\n");
