import React from "react";
import "@fontsource-variable/jetbrains-mono";
import { SiteHeader, type NavItem } from "../components/SiteHeader";
import { ProfileLinks } from "../components/ProfileLinks";
import { LangSwitch } from "../components/LangSwitch";
import { GlassPanel } from "../components/Surfaces";
import { COPY, useLang, type Lang } from "../lib/pintester-i18n";
import "./Pintester.css";

const SECTIONS: Record<Lang, string> = { zh: "本页章节", yue: "本頁章節", en: "Sections of this page", pt: "Seções desta página" };
const HREFS = ["#topo", "#perfis", "#observado", "#arsenal", "#fim"];

export const Pintester: React.FC = () => {
  const [lang, setLang] = useLang();
  const c = COPY[lang];
  const nav: NavItem[] = HREFS.map((href, i) => ({ href, label: c.nav[i] }));
  return (
    <>
      <a className="skip" href="#conteudo">
        {c.skip}
      </a>
      <SiteHeader items={nav} current={"pintester"} label={SECTIONS[lang]} hideTheme />
      <div className="pt-bg" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="pt-scan" aria-hidden="true" />
      <main className="pt" id="conteudo">
        <LangSwitch lang={lang} onChange={setLang} label={c.langLabel} />

        <GlassPanel className="card-glass">
          <header className="pt-hero" id="topo">
            <p className="pt-tag">{c.tag}</p>
            <h1 className="pt-glitch">{c.title}</h1>
            <p className="pt-sub">{c.sub}</p>
          </header>
        </GlassPanel>

        <section id="perfis" aria-label={c.profiles}>
          <ProfileLinks label={c.profiles} />
          <p className="pt-note pt-live">
            <span className="pt-dot" aria-hidden="true" />
            {c.photosNote}
          </p>
        </section>

        <GlassPanel className="card-glass">
          <section className="pt-sec" id="observado" aria-labelledby="obs-h">
            <h2 id="obs-h">{c.obsTitle}</h2>
            <p className="pt-note">{c.obsNote}</p>
            <ul className="pt-obs">
              {c.observed.map((o) => (
                <li key={o.t}>
                  <strong>{o.t}</strong>
                  <span>{o.p}</span>
                </li>
              ))}
            </ul>
            <aside className="pt-limits" aria-label={c.limitsLabel}>
              <h3>{c.limitsTitle}</h3>
              <p>{c.limits}</p>
            </aside>
          </section>
        </GlassPanel>

        <GlassPanel className="card-glass">
          <section className="pt-sec" id="arsenal" aria-labelledby="ars-h">
            <h2 id="ars-h">{c.arsTitle}</h2>
            <p className="pt-note">{c.arsNote}</p>
            <div className="pt-cards">
              {c.arsenal.map((a) => (
                <article className="pt-card" key={a.t}>
                  <h3>{a.t}</h3>
                  <p>{a.p}</p>
                </article>
              ))}
            </div>
          </section>
        </GlassPanel>

        <GlassPanel className="card-glass">
          <footer className="pt-sec pt-end" id="fim">
            <p className="pt-big">{c.quote}</p>
            <p className="pt-note">{c.quoteNote}</p>
            <p className="pt-eof">{c.eof}</p>
          </footer>
        </GlassPanel>
      </main>
    </>
  );
};
