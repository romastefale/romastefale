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
  // The .ton name is an NFT; its image is the closest thing to a photo. The
  // DNS item does not always carry metadata.image, so try its previews, then
  // the NFT record itself, and log which fields exist when nothing has an image.
  ton: async () => {
    const api = async (path) => {
      const r = await fetch(`https://tonapi.io/v2/${path}`, { headers: { ...UA, accept: "application/json" } });
      if (!r.ok) throw new Error(`ton: tonapi ${path} → HTTP ${r.status}`);
      return r.json();
    };
    const pick = (item) =>
      item?.metadata?.image ||
      [...(item?.previews ?? [])].sort((a, b) => parseInt(b.resolution) - parseInt(a.resolution))[0]?.url;
    const dns = await api("dns/romastefale.ton");
    let img = pick(dns.item);
    if (!img && dns.item?.address) img = pick(await api(`nfts/${dns.item.address}`));
    if (!img) {
      const keys = Object.keys(dns.item ?? {}).join(",");
      const meta = Object.keys(dns.item?.metadata ?? {}).join(",");
      throw new Error(`ton: no image (item keys: ${keys || "none"}; metadata keys: ${meta || "none"})`);
    }
    await save("ton", img);
  },
};

await mkdir(OUT, { recursive: true });
// meta.json lists the photos that exist, so the page never asks for a missing file
// (a 404 is an error in the console, and the checklist wants none).
const have = [];
for (const [name, run] of Object.entries(sources)) {
  try {
    await run();
    have.push(name);
  } catch (e) {
    console.warn(`::warning::avatar ${name} not updated: ${e.message}`);
  }
}
await writeFile(new URL("meta.json", OUT), JSON.stringify({ updated: new Date().toISOString(), have }) + "\n");
