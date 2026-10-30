import React from "react";
import { GlassPanel } from "./Surfaces";
import { LANGS, type Lang } from "../lib/pintester-i18n";
import "./LangSwitch.css";

/** Four big glass buttons, always one tap away at the top of the page. */
export const LangSwitch: React.FC<{ lang: Lang; onChange: (l: Lang) => void; label: string }> = ({ lang, onChange, label }) => (
  <GlassPanel className="ls-wrap">
    <div className="ls" role="group" aria-label={label}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className="ls-btn"
          lang={l.html}
          aria-pressed={lang === l.code}
          title={l.name}
          onClick={() => onChange(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  </GlassPanel>
);
