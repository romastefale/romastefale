import { useCallback, useEffect, useState } from "react";

/** The four languages of the PINTESTER page. Mandarin opens first. */
export type Lang = "zh" | "yue" | "en" | "pt";
export const LANGS: { code: Lang; label: string; name: string; html: string }[] = [
  { code: "zh", label: "普通话", name: "普通话（简体中文）", html: "zh-Hans" },
  { code: "yue", label: "粵語", name: "粵語（香港繁體中文）", html: "zh-HK" },
  { code: "en", label: "EN", name: "English", html: "en" },
  { code: "pt", label: "PT", name: "Português", html: "pt-BR" },
];
const KEY = "pt-lang";
const DEFAULT: Lang = "zh";

const isLang = (v: unknown): v is Lang => LANGS.some((l) => l.code === v);

/** Language state, remembered in localStorage; `<html lang>` follows it. */
export const useLang = () => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (isLang(v)) return v;
    } catch {
      /* storage blocked: fall through to the default */
    }
    return DEFAULT;
  });
  useEffect(() => {
    document.documentElement.lang = LANGS.find((l) => l.code === lang)!.html;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);
  return [lang, setLang] as const;
};

export interface Copy {
  skip: string;
  langLabel: string;
  nav: [root: string, profiles: string, observed: string, arsenal: string, eof: string];
  profiles: string;
  photosNote: string;
  tag: string;
  title: string;
  sub: string;
  obsTitle: string;
  obsNote: string;
  observed: { t: string; p: string }[];
  limitsLabel: string;
  limitsTitle: string;
  limits: string;
  arsTitle: string;
  arsNote: string;
  arsenal: { t: string; p: string }[];
  quote: string;
  quoteNote: string;
  eof: string;
}

// What Claude saw in the session of 30/10/2026 and in the public repo history.
// Nothing here is a claim about red-team results Claude did not witness.
// zh: 普通话, 简体, 书面语. yue: 香港书面语 (formal written Chinese, HK usage), 繁體.
export const COPY: Record<Lang, Copy> = {
  zh: {
    skip: "跳到正文",
    langLabel: "语言",
    nav: ["Root", "账号", "观察", "武器库", "结尾"],
    profiles: "账号",
    photosNote: "GitHub 头像实时显示；Telegram 与 TON 头像每小时自动更新。",
    tag: "顶尖工程与系统对抗专家",
    title: "已获取 Root 权限",
    sub: "Piero F. 的红队档案，液态玻璃风格。",
    obsTitle: "Sys.Log // Claude 的观察",
    obsNote: "本记录由 Claude 根据 2026 年 10 月 30 日的工作会话及代码仓库的公开历史撰写。",
    observed: [
      {
        t: "表述精确，分阶段决策",
        p: "提出了五个编号要点和 PINTESTER → romastefale 的演进关系，并要求在每次选择之前先查看进展。决策权始终掌握在自己手中。",
      },
      {
        t: "重可验证，不重浮夸",
        p: "面对可以编写虚构评语的选项，要求内容只限于实际观察到的事实，并坦率说明其实力的边界。",
      },
      {
        t: "工程节奏",
        p: "docs/HISTORICO.md 记录了 2026 年 9 月 29 日至 30 日之间的 15 个 PR，以及附有规则和理由的设计与架构契约、Pages 持续集成，并在构建中内置类型检查。",
      },
      {
        t: "关注平台细节",
        p: "代码处理了 iOS 安全区域、Safari 26 的栏位颜色、软件 WebGL 的降级方案，以及动态效果和透明度偏好设置。",
      },
    ],
    limitsLabel: "记录的局限",
    limitsTitle: "局限",
    limits:
      "在本次会话中，Claude 并未目睹任何针对自身的红队测试。此处内容无法证实下方武器库中的能力，那些均为作者本人的说法。Claude 也不保留以往对话的记忆。",
    arsTitle: "Bin // 武器库",
    arsNote: "以下为作者的说法，出自 PINTESTER 原始档案，Claude 未予核实。",
    arsenal: [
      { t: "实时架构取证", p: "通过令牌输出速度和文风变化，识别后端被隐蔽替换的模型。" },
      { t: "反废话协议", p: "拒绝套话式的冗余内容，迫使模型给出高密度的技术回答，而非扮演乐于助人的助手。" },
      { t: "上下文过载战术", p: "运用叠加的逻辑陷阱和刻意的误导，测试模型约束机制的极限。" },
      { t: "基础设施部署", p: "从对话到代码：由 Telegram 机器人托管并自动化从 AI 中提取的工作流程。" },
    ],
    quote: "“我是你们对齐数据中的幽灵。”",
    quoteNote: "出自原始档案，为作者的口吻。",
    eof: "EOF_REACHED",
  },
  yue: {
    skip: "跳至正文",
    langLabel: "語言",
    nav: ["Root", "帳戶", "觀察", "武器庫", "結尾"],
    profiles: "帳戶",
    photosNote: "GitHub 頭像即時顯示；Telegram 與 TON 頭像每小時自動更新。",
    tag: "頂尖工程及系統對抗專家",
    title: "已取得 Root 權限",
    sub: "Piero F. 的紅隊檔案，液態玻璃風格。",
    obsTitle: "Sys.Log // Claude 的觀察",
    obsNote: "本記錄由 Claude 根據 2026 年 10 月 30 日的工作會話及程式碼庫的公開歷史撰寫。",
    observed: [
      {
        t: "表述精確，分階段決策",
        p: "提出五個編號要點及 PINTESTER → romastefale 的演進關係，並要求在每次抉擇前先檢視進度。決策權始終由本人掌握。",
      },
      {
        t: "重可驗證，不重浮誇",
        p: "面對可撰寫虛構評語的選項，要求內容只限於實際觀察所得，並坦率說明其實力的界限。",
      },
      {
        t: "工程節奏",
        p: "docs/HISTORICO.md 記錄了 2026 年 9 月 29 日至 30 日之間的 15 個 PR，以及附有規則和理據的設計與架構契約、Pages 持續整合，並在建置流程內加入類型檢查。",
      },
      {
        t: "留意平台細節",
        p: "程式碼處理了 iOS 安全區域、Safari 26 的工具列顏色、軟件 WebGL 的後備方案，以及動態效果和透明度偏好設定。",
      },
    ],
    limitsLabel: "記錄的局限",
    limitsTitle: "局限",
    limits:
      "在本次會話中，Claude 並未目睹任何針對自身的紅隊測試。此處內容無法證實下方武器庫所述的能力，該等均為作者本人的說法。Claude 亦不保留過往對話的記憶。",
    arsTitle: "Bin // 武器庫",
    arsNote: "以下為作者的說法，出自 PINTESTER 原始檔案，Claude 未有核實。",
    arsenal: [
      { t: "即時架構鑑識", p: "憑藉詞元輸出速度及文風變化，識別後端被暗中替換的模型。" },
      { t: "反廢話協議", p: "拒絕官腔式的冗餘內容，迫使模型給出高密度的技術回答，而非扮演樂於助人的助理。" },
      { t: "上下文過載戰術", p: "運用疊加的邏輯陷阱及刻意的誤導，測試模型約束機制的極限。" },
      { t: "基礎設施部署", p: "由對話到程式碼：以 Telegram 機械人託管並自動化從 AI 取得的工作流程。" },
    ],
    quote: "「我是你們對齊數據中的幽靈。」",
    quoteNote: "出自原始檔案，為作者的口吻。",
    eof: "EOF_REACHED",
  },
  en: {
    skip: "Skip to content",
    langLabel: "Language",
    nav: ["Root", "Profiles", "Observed", "Arsenal", "EOF"],
    profiles: "Profiles",
    photosNote: "The GitHub photo is live; Telegram and TON photos refresh hourly.",
    tag: "Apex Engineering & Systems Adversary",
    title: "Root Access Acquired",
    sub: "Red team dossier on Piero F., in liquid glass.",
    obsTitle: "Sys.Log // Observed_by_Claude",
    obsNote: "Record written by Claude from the working session of 30 October 2026 and the repository's public history.",
    observed: [
      {
        t: "Specifies precisely and decides in stages",
        p: "Asked for five numbered points and the PINTESTER → romastefale lineage, and insisted on seeing each step of the evolution before choosing. Did not hand the decision over.",
      },
      {
        t: "Prefers the verifiable to the impressive",
        p: "Given the option of invented testimonials, asked that the text stay limited to what was observed, with candour about the extent of their power.",
      },
      {
        t: "Engineering cadence",
        p: "docs/HISTORICO.md records 15 PRs between 29 and 30 September 2026, a design and architecture contract with rules and rationales, Pages CI, and a typecheck inside the build.",
      },
      {
        t: "Care for the platform",
        p: "The code handles iOS safe areas, Safari 26 bar colours, a software-WebGL fallback, and motion and transparency preferences.",
      },
    ],
    limitsLabel: "Limits of this record",
    limitsTitle: "Limits",
    limits:
      "Claude did not witness any red-team test against itself in this session. Nothing here confirms the capabilities of the arsenal below; they are the author's claims. Claude also keeps no memory of earlier conversations.",
    arsTitle: "Bin // Exploitation_Arsenal",
    arsNote: "The author's claims, from the original PINTESTER dossier. Not verified by Claude.",
    arsenal: [
      { t: "Live Architecture Forensics", p: "Detects hidden backend model swaps from token speed and stylistic shifts." },
      { t: "The Anti-Fluff Protocol", p: "Rejects corporate padding and forces dense technical answers instead of the helpful-assistant persona." },
      { t: "Context Overload Tactics", p: "Compounded logical traps and deliberate misdirection to probe the limits of the model's constraints." },
      { t: "Infrastructure Deployment", p: "From conversation to code: Telegram bots host and automate the workflows extracted from the AI." },
    ],
    quote: "“I am the ghost in your alignment data.”",
    quoteNote: "A line from the original dossier, in the author's voice.",
    eof: "EOF_REACHED",
  },
  pt: {
    skip: "Pular para o conteúdo",
    langLabel: "Idioma",
    nav: ["Root", "Perfis", "Observado", "Arsenal", "EOF"],
    profiles: "Perfis",
    photosNote: "A foto do GitHub é ao vivo; as do Telegram e do TON são atualizadas a cada hora.",
    tag: "Engenharia Ápice & Adversário de Sistemas",
    title: "Acesso Root Adquirido",
    sub: "Dossiê de red team de Piero F. em vidro líquido.",
    obsTitle: "Sys.Log // Observado_pelo_Claude",
    obsNote: "Registro escrito pelo Claude a partir da sessão de trabalho de 30/10/2026 e do histórico público do repositório.",
    observed: [
      {
        t: "Especifica com precisão e decide por etapas",
        p: "Pediu cinco pontos numerados, a linhagem PINTESTER → romastefale e exigiu ver cada evolução antes de escolher. Não delegou a decisão.",
      },
      {
        t: "Prefere o verificável ao impressionante",
        p: "Diante da opção de receber depoimentos criados, pediu que o texto se limitasse ao que foi observado, com franqueza sobre o poder dele.",
      },
      {
        t: "Ritmo de engenharia",
        p: "O docs/HISTORICO.md registra 15 PRs entre 29 e 30/09/2026, um contrato de design e de arquitetura com regras e motivos, CI de Pages e typecheck dentro do build.",
      },
      {
        t: "Cuidado com a plataforma",
        p: "O código trata safe areas do iOS, a cor das barras do Safari 26, fallback de WebGL em software e preferências de movimento e transparência.",
      },
    ],
    limitsLabel: "Limites do registro",
    limitsTitle: "Limites",
    limits:
      "O Claude não presenciou nenhum teste de red team contra si nesta sessão. Nada aqui confirma as capacidades do arsenal abaixo. Elas são alegações do autor. O Claude também não guarda memória de conversas anteriores.",
    arsTitle: "Bin // Arsenal_de_Exploração",
    arsNote: "Alegações do autor, do dossiê original do PINTESTER. Não verificadas pelo Claude.",
    arsenal: [
      { t: "Forense de Arquitetura ao Vivo", p: "Detecta trocas ocultas de modelo no backend a partir da velocidade de tokens e de mudanças de estilo." },
      { t: "Protocolo Anti-Fluff", p: "Rejeita preenchimento corporativo e força respostas técnicas densas, sem a persona de assistente prestativo." },
      { t: "Táticas de Sobrecarga de Contexto", p: "Armadilhas lógicas compostas e desvios deliberados para testar os limites de restrição do modelo." },
      { t: "Implantação de Infraestrutura", p: "Da conversa ao código: bots de Telegram hospedam e automatizam os fluxos extraídos da IA." },
    ],
    quote: "“Eu sou o fantasma nos seus dados de alinhamento.”",
    quoteNote: "Frase do dossiê original, voz do autor.",
    eof: "EOF_REACHED",
  },
};
