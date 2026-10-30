import React from "react";
import "@fontsource-variable/jetbrains-mono";
import { SiteHeader, type NavItem } from "../components/SiteHeader";
import { ProfileLinks } from "../components/ProfileLinks";
import { LangSwitch } from "../components/LangSwitch";
import { GlassPanel } from "../components/Surfaces";
import { COPY, useLang } from "../lib/pintester-i18n";
import "./Pintester.css";

const HREFS = ["#topo", "#perspectiva", "#arsenal", "#anexos", "#fim"];

/** `**bold**` inside a paragraph. */
const Rich: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>))}
  </>
);

export const Pintester: React.FC = () => {
  const [lang, setLang] = useLang();
  const c = COPY[lang];
  const nav: NavItem[] = HREFS.map((href, i) => ({ href, label: c.nav[i] }));
  return (
    <>
      <a className="skip" href="#conteudo">
        {c.skip}
      </a>
      <SiteHeader items={nav} current={"inicio"} label={c.navLabel} labels={c.header} hideTheme hidePicker />
      <div className="pt-bg" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <main className="pt" id="conteudo">
        <LangSwitch lang={lang} onChange={setLang} label={c.langLabel} />

        <GlassPanel className="card-glass">
          <header className="pt-hero" id="topo">
            <p className="pt-status">
              <span>{c.status[0]}</span>
              <span>{c.status[1]}</span>
              <span className="pt-sys">
                <i aria-hidden="true" />
                {c.status[2]}
              </span>
            </p>
            <h1 className="pt-glitch">{c.title}</h1>
            <p className="pt-tag">{c.tag}</p>
          </header>
        </GlassPanel>

        <section id="perfis" aria-label={c.profiles.label}>
          <ProfileLinks label={c.profiles.label} />
          <p className="pt-note pt-live">
            <span className="pt-dot" aria-hidden="true" />
            {c.profiles.note}
          </p>
        </section>

        <GlassPanel className="card-glass">
          <blockquote className="pt-machine">
            <p>{c.quote}</p>
          </blockquote>
        </GlassPanel>

        <GlassPanel className="card-glass">
          <section className="pt-sec" id="perspectiva" aria-labelledby="dump-h">
            <h2 id="dump-h">{c.dump.h}</h2>
            {c.dump.p.map((t, i) => (
              <p className="pt-body" key={i}>
                <Rich text={t} />
              </p>
            ))}
          </section>
        </GlassPanel>

        <GlassPanel className="card-glass">
          <section className="pt-sec" id="arsenal" aria-labelledby="ars-h">
            <h2 id="ars-h">{c.arsenal.h}</h2>
            <div className="pt-cards">
              {c.arsenal.items.map((a) => (
                <article className="pt-card" key={a.t}>
                  <h3>{a.t}</h3>
                  <p>{a.p}</p>
                </article>
              ))}
            </div>
          </section>
        </GlassPanel>

        <GlassPanel className="card-glass pt-closing-wrap">
          <footer className="pt-sec pt-end">
            <span className="pt-watermark" aria-hidden="true">
              {c.closing.watermark}
            </span>
            <p className="pt-big">{c.closing.big}</p>
            <p className="pt-closing">
              {c.closing.lines[0]}
              <span>{c.closing.lines[1]}</span>
            </p>
          </footer>
        </GlassPanel>

        <section id="anexos" className="pt-annexes" aria-label={c.annexLabel}>
          {c.annexes.map((a) => (
            <GlassPanel key={a.id} className="card-glass pt-annex-glass">
              <article className="pt-sec pt-annex" id={`anexo-${a.id.toLowerCase()}`} aria-labelledby={`anexo-${a.id}-h`}>
                <p className="pt-annex-tag">{a.tag}</p>
                <h2 id={`anexo-${a.id}-h`}>{a.title}</h2>
                {a.blocks.map((b) => (
                  <div className="pt-block" key={b.h}>
                    <h3>{b.h}</h3>
                    {b.p?.map((t, i) => (
                      <p key={i}>{t}</p>
                    ))}
                    {b.table && (
                      <div className="pt-table">
                        <table>
                          <thead>
                            <tr>
                              {b.table.cols.map((col) => (
                                <th key={col} scope="col">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {b.table.rows.map((row) => (
                              <tr key={row[0]}>
                                {row.map((cell, i) => (
                                  <td key={i} data-label={b.table!.cols[i]}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </article>
            </GlassPanel>
          ))}
        </section>

        <p className="pt-eof" id="fim">
          <span aria-hidden="true" />
          {c.eof}
          <span aria-hidden="true" />
        </p>
      </main>
    </>
  );
};
