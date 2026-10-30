import React, { useEffect, useState } from "react";
import { GlassPanel } from "./Surfaces";
import { asset } from "./Surfaces";
import "./ProfileLinks.css";

interface Profile {
  key: string;
  name: string;
  handle: string;
  href: string;
  initials: string;
  /** The live photo. GitHub serves it at a stable URL; the others are fetched by
   *  scripts/fetch-avatars.mjs (hourly, in the Pages workflow) into public/avatars/. */
  photo: string;
}

const PROFILES: Profile[] = [
  {
    key: "github",
    name: "GitHub",
    handle: "@romastefale",
    href: "https://github.com/romastefale",
    initials: "GH",
    photo: "https://github.com/romastefale.png?size=160",
  },
  {
    key: "telegram",
    name: "Telegram",
    handle: "@tigrao",
    href: "https://t.me/tigrao",
    initials: "TG",
    photo: asset("avatars/telegram.jpg"),
  },
  {
    key: "ton",
    name: "TON",
    handle: "romastefale.ton",
    href: "https://tonviewer.com/romastefale.ton",
    initials: "TON",
    photo: asset("avatars/ton.jpg"),
  },
];

/** Photos the build fetched (public/avatars/meta.json, written by scripts/fetch-avatars.mjs).
 *  GitHub's is read live, so it never waits for this. Until the list arrives, or if it
 *  is missing, only the initials show: the page never requests a file that may not exist. */
const useFetchedPhotos = () => {
  const [have, setHave] = useState<string[]>([]);
  useEffect(() => {
    let live = true;
    fetch(asset("avatars/meta.json"))
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => live && Array.isArray(m?.have) && setHave(m.have))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return have;
};

const Photo: React.FC<{ p: Profile; show: boolean }> = ({ p, show }) => {
  // If the photo fails to load, the initials stay.
  const [ok, setOk] = useState(true);
  return (
    <span className="pl-avatar" aria-hidden="true">
      <span className="pl-initials">{p.initials}</span>
      {show && ok && <img src={p.photo} alt="" width={48} height={48} referrerPolicy="no-referrer" onError={() => setOk(false)} />}
    </span>
  );
};

/** Profile buttons: frosted glass, each with the profile's current photo. */
export const ProfileLinks: React.FC<{ label: string }> = ({ label }) => {
  const have = useFetchedPhotos();
  return (
    <nav className="pl" aria-label={label}>
      {PROFILES.map((p) => (
        <GlassPanel key={p.key} className="pl-card">
          <a className="pl-link" href={p.href} target="_blank" rel="noopener noreferrer">
            <Photo p={p} show={p.key === "github" || have.includes(p.key)} />
            <span className="pl-text">
              <strong>{p.name}</strong>
              <span>{p.handle}</span>
            </span>
          </a>
        </GlassPanel>
      ))}
    </nav>
  );
};
