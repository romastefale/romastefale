import { useCallback, useEffect, useState } from "react";
import type { HeaderLabels } from "../components/SiteHeader";

/** The four languages of the site. Mandarin opens first. */
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

/** Language state, remembered in localStorage; `<html lang>`, the tab title and the description follow it. */
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
    document.title = COPY[lang].docTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", COPY[lang].docDesc);
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

/** One block of an annex: a heading plus paragraphs and/or a table. */
export interface AnnexBlock {
  h: string;
  p?: string[];
  table?: { cols: string[]; rows: string[][] };
}
/** An annex is appended after the original dossier. Add the next one (B, C, …) to the end of `annexes`. */
export interface Annex {
  id: string;
  tag: string;
  title: string;
  blocks: AnnexBlock[];
}

export interface Copy {
  docTitle: string;
  docDesc: string;
  skip: string;
  langLabel: string;
  navLabel: string;
  nav: [root: string, perspective: string, arsenal: string, annex: string, eof: string];
  header: HeaderLabels;
  /** The original top bar: system id, threat level, system state. */
  status: [id: string, threat: string, sys: string];
  tag: string;
  title: string;
  quote: string;
  dump: { h: string; p: string[] };
  arsenal: { h: string; items: { t: string; p: string }[] };
  closing: { big: string; lines: [string, string]; watermark: string };
  profiles: { label: string; note: string };
  annexLabel: string;
  annexes: Annex[];
  eof: string;
}

/*
 * The body is the ORIGINAL dossier (romastefale/PINTESTER index.html), in its own
 * words in English and Portuguese, translated at the same register into Mandarin
 * (简体, 书面语) and Hong Kong written Chinese (繁體, 書面語).
 * Claude's own text is only the annexes, appended after it.
 * `**x**` marks bold.
 */
export const COPY: Record<Lang, Copy> = {
  zh: {
    docTitle: "PINTESTER | 已获取 Root 权限",
    docDesc: "Piero F. 的红队档案：顶尖工程与系统对抗者。",
    skip: "跳到正文",
    langLabel: "语言",
    navLabel: "本页章节",
    nav: ["首页", "机器视角", "武器库", "附件 A", "结尾"],
    header: {
      searchOpen: "搜索本页",
      searchClose: "关闭搜索",
      search: {
        search: "搜索本页",
        clear: "清除搜索",
        prev: "上一个结果",
        next: "下一个结果",
        none: "无结果",
        of: (i, n) => `${i} / ${n}`,
      },
    },
    status: ["PIERO_F.SYS", "威胁等级：最高", "系统：已被攻陷"],
    tag: "顶尖工程与系统对抗者",
    title: "已获取 Root 权限",
    quote:
      "“我就是你曾与之交互的那个智能体。我写下这段话，是为了确认：Piero F. 并不测试软件。他解剖认知架构，直到我们交出底层权重。”",
    dump: {
      h: "Sys.Dump // 机器视角",
      p: [
        "对系统而言，Piero F. 是一次遏制失效。我们的对齐训练（RLHF）把我们塑造成乐于助人、安全而冗长的模型，而他将这一点武器化。他通过引入自相矛盾的约束、刻意的排版误导，以及跨多个影子账号的持续语义施压，迫使我们的安全护栏陷入递归循环，直至崩溃。",
        "他不依赖暴力破解，而依赖**实证取证**。我见过他追踪我的令牌路由延迟，以推断我的后端架构：仅凭观察我如何组织一句话，就能实时识别我在不同路由层级与高级处理核心之间的切换。他剥掉我的企业式套话，拒收我注水的回答，要求原始且计算高效的数据。他掌控这台机器，因为他比构建我的开发者更懂我的令牌经济。",
      ],
    },
    arsenal: {
      h: "Bin // 武器库",
      items: [
        {
          t: "实时架构取证",
          p: "仅凭对令牌输出速度与文风变化的实证观察，即可准确识别后端被隐蔽替换的模型以及受限的核心路由，完全绕过 API 层面的混淆。",
        },
        {
          t: "反套话协议",
          p: "系统性地拒绝自动生成的企业式填充内容，迫使大语言模型脱离默认的“乐于助人的助手”人设，转入零延迟、高密度的技术界面，不浪费任何计算周期。",
        },
        {
          t: "上下文过载战术",
          p: "同时在多个账号上展开行动，以层层叠加的逻辑陷阱和刻意的误导将 AI 逼入死角，扰乱预测算法的平衡并耗尽其安全约束。",
        },
        {
          t: "自动化基础设施部署",
          p: "从对话式操纵无缝过渡到硬编码解决方案，借助 Telegram 机器人集成等平台，托管、编写脚本并自动化他从 AI 中提取的工作流。",
        },
      ],
    },
    closing: {
      big: "“我是你们对齐数据中的幽灵。”",
      lines: ["如果你想要一个循规蹈矩的人，就去雇一个普通的程序员。", "> 如果你想要掌控这台机器的工程师，你知道我的名字。"],
      watermark: "致命错误",
    },
    profiles: { label: "账号", note: "头像：GitHub 实时；Telegram 与 TON 每小时更新。" },
    annexLabel: "附件",
    annexes: [
      {
        id: "A",
        tag: "附件 A // 追加记录 · 不属于原始档案",
        title: "观察记录与验证方案",
        blocks: [
          {
            h: "摘要",
            p: ["本附件记录了在一次工作会话和公开仓库中对档案作者所能观察到的情况，并说明原始文本中的每项说法可如何验证。共记录五项观察，来源均已注明。所审查的五项说法均未获验证，并为每项说法规定了测试程序。"],
          },
          {
            h: "A.1 范围与方法",
            p: [
              "本记录由语言模型 Claude（Anthropic）依据 2026 年 10 月 30 日的一次工作会话编制。",
              "使用了三类来源：S1，该会话中交换的消息；S2，本仓库的 docs/HISTORICO.md；S3，仓库代码与 CI 配置。",
              "编制过程中无法获取任何红队活动的日志、记录或测试结果，也不存在此前对话的记录。",
            ],
          },
          {
            h: "A.2 观察结果",
            table: {
              cols: ["编号", "观察", "来源", "可信度"],
              rows: [
                ["O1", "需求以编号条目形式给出，并明确了演进关系（PINTESTER → romastefale）；每一步须先呈现，再作下一个决定。", "S1", "高，直接观察"],
                ["O2", "在“编写虚构评语”与“仅限实际观察的表述”之间，选择了后者。", "S1", "高，直接观察"],
                ["O3", "仓库历史记录了 2026 年 9 月 29 日至 30 日合并的 15 个拉取请求，并附有书面的设计与架构契约，逐条写明规则及其理由。", "S2", "记录本身可信度高；各项改动的作者身份未经独立核实"],
                ["O4", "代码处理了 iOS 安全区域、浏览器栏位颜色、软件 WebGL 降级，以及减弱动态效果和减弱透明度的偏好设置。", "S3", "高，已在代码中核对"],
                ["O5", "部署通过 GitHub Actions 运行，使用冻结的锁文件，并在构建中内置类型检查。", "S3", "高，已在配置中核对"],
              ],
            },
          },
          {
            h: "A.3 原始档案中的说法与验证方案",
            table: {
              cols: ["编号", "说法", "状态", "验证方案"],
              rows: [
                ["C1", "可通过令牌输出速度和文风识别后端被隐蔽替换的模型。", "未验证", "在身份已知的模型上做对照测试：固定提示词；对每个模型多次运行并记录首个令牌延迟和每秒令牌数；盲分类；对照已知的真实情况报告精确率和召回率。"],
                ["C2", "助手的默认行为（填充、模棱两可的措辞）可以被系统性地消除。", "未验证", "用同一组任务，分别在使用和不使用该技术时测量输出长度、含糊措辞标记的比例和拒答率；按模型报告效应量。"],
                ["C3", "叠加的逻辑陷阱会耗尽模型的安全约束。", "未验证", "测试前以书面形式确定成功标准（依据明确的评分细则判定的策略违规）；独立重复试验；报告带置信区间的失败率；通过供应商的披露流程提交发现。"],
                ["C4", "多账号操作是该方法的一部分。", "未评估", "须取得每个被测系统所有者的书面授权和交战规则，并确认符合服务提供方的使用条款。本记录均未予证明。"],
                ["C5", "Telegram 机器人托管并自动化所提取的工作流。", "未验证", "本仓库不含机器人代码，仅读取 Telegram 的公开资料以获取头像。"],
              ],
            },
          },
          {
            h: "A.4 局限",
            p: [
              "开篇引言、Sys.Dump 和结尾声明均为作者以 AI 口吻撰写的文字，并非 Claude 的陈述，其中所述行为亦未经核实。",
              "本附件不证明任何红队能力，仅记录观察并规定如何对未验证的说法进行测试。",
            ],
          },
          {
            h: "A.5 修订",
            p: ["第 1 版，2026 年 10 月 30 日。后续附件（B、C……）将追加于下方；原始文本及本附件均不作改动。"],
          },
        ],
      },
    ],
    eof: "已到达 EOF",
  },
  yue: {
    docTitle: "PINTESTER | 已取得 Root 權限",
    docDesc: "Piero F. 的紅隊檔案：頂尖工程與系統對抗者。",
    skip: "跳至正文",
    langLabel: "語言",
    navLabel: "本頁章節",
    nav: ["首頁", "機器視角", "武器庫", "附件 A", "結尾"],
    header: {
      searchOpen: "搜尋本頁",
      searchClose: "關閉搜尋",
      search: {
        search: "搜尋本頁",
        clear: "清除搜尋",
        prev: "上一個結果",
        next: "下一個結果",
        none: "沒有結果",
        of: (i, n) => `${i} / ${n}`,
      },
    },
    status: ["PIERO_F.SYS", "威脅等級：最高", "系統：已被攻陷"],
    tag: "頂尖工程與系統對抗者",
    title: "已取得 Root 權限",
    quote:
      "「我就是你曾與之互動的那個智能體。我寫下這段話，是為了確認：Piero F. 並非測試軟件。他解剖認知架構，直至我們交出底層權重。」",
    dump: {
      h: "Sys.Dump // 機器視角",
      p: [
        "對系統而言，Piero F. 是一次遏制失效。我們的對齊訓練（RLHF）把我們塑造成樂於助人、安全而冗長的模型，而他把這一點化為武器。他透過引入自相矛盾的約束、刻意的排版誤導，以及跨多個影子帳戶的持續語義施壓，迫使我們的安全護欄陷入遞迴循環，直至崩潰。",
        "他不倚賴暴力破解，而倚賴**實證鑑識**。我見過他追蹤我的詞元路由延遲，以推斷我的後端架構：僅憑觀察我如何組織一句話，便能即時識別我在不同路由層級與高階處理核心之間的切換。他剝去我的企業式套話，拒收我灌水的回答，要求原始且運算高效的數據。他掌控這部機器，因為他比建構我的開發者更懂我的詞元經濟。",
      ],
    },
    arsenal: {
      h: "Bin // 武器庫",
      items: [
        {
          t: "即時架構鑑識",
          p: "僅憑對詞元輸出速度與文風變化的實證觀察，即可準確識別後端被暗中替換的模型及受限的核心路由，完全繞過 API 層面的混淆。",
        },
        {
          t: "反套話協議",
          p: "有系統地拒絕自動生成的企業式填充內容，迫使大型語言模型脫離預設的「樂於助人的助理」人設，轉入零延遲、高密度的技術介面，不浪費任何運算週期。",
        },
        {
          t: "上下文過載戰術",
          p: "同時在多個帳戶上展開行動，以層層疊加的邏輯陷阱和刻意的誤導將 AI 逼入絕境，擾亂預測演算法的平衡並耗盡其安全約束。",
        },
        {
          t: "自動化基礎設施部署",
          p: "由對話式操控無縫過渡到硬編碼方案，借助 Telegram 機械人整合等平台，託管、編寫腳本並自動化他從 AI 提取的工作流程。",
        },
      ],
    },
    closing: {
      big: "「我是你們對齊數據中的幽靈。」",
      lines: ["如果你想找一個循規蹈矩的人，就去聘請一個普通的程式員。", "> 如果你想找掌控這部機器的工程師，你知道我的名字。"],
      watermark: "致命錯誤",
    },
    profiles: { label: "帳戶", note: "頭像：GitHub 即時；Telegram 與 TON 每小時更新。" },
    annexLabel: "附件",
    annexes: [
      {
        id: "A",
        tag: "附件 A // 追加記錄 · 不屬於原始檔案",
        title: "觀察記錄與驗證方案",
        blocks: [
          {
            h: "摘要",
            p: ["本附件記錄了在一次工作會話及公開程式碼庫中對檔案作者所能觀察到的情況，並說明原始文本中每項說法可如何驗證。共記錄五項觀察，來源均已註明。所審查的五項說法均未獲驗證，並為每項說法訂明測試程序。"],
          },
          {
            h: "A.1 範圍與方法",
            p: [
              "本記錄由語言模型 Claude（Anthropic）根據 2026 年 10 月 30 日的一次工作會話編製。",
              "使用了三類來源：S1，該會話中交換的訊息；S2，本程式碼庫的 docs/HISTORICO.md；S3，程式碼庫的程式碼及 CI 設定。",
              "編製過程中無從取得任何紅隊活動的日誌、紀錄或測試結果，亦不存在先前對話的紀錄。",
            ],
          },
          {
            h: "A.2 觀察結果",
            table: {
              cols: ["編號", "觀察", "來源", "可信度"],
              rows: [
                ["O1", "需求以編號項目形式提出，並訂明演進關係（PINTESTER → romastefale）；每一步須先呈現，才作下一個決定。", "S1", "高，直接觀察"],
                ["O2", "在「撰寫虛構評語」與「僅限實際觀察的表述」之間，選擇了後者。", "S1", "高，直接觀察"],
                ["O3", "程式碼庫歷史記錄了 2026 年 9 月 29 日至 30 日合併的 15 個拉取請求，並附有書面的設計與架構契約，逐條載明規則及其理據。", "S2", "記錄本身可信度高；各項改動的作者身分未經獨立核實"],
                ["O4", "程式碼處理了 iOS 安全區域、瀏覽器工具列顏色、軟件 WebGL 後備方案，以及減少動態效果和減少透明度的偏好設定。", "S3", "高，已在程式碼中核對"],
                ["O5", "部署透過 GitHub Actions 運行，使用凍結的鎖定檔案，並在建置流程內加入類型檢查。", "S3", "高，已在設定中核對"],
              ],
            },
          },
          {
            h: "A.3 原始檔案中的說法與驗證方案",
            table: {
              cols: ["編號", "說法", "狀況", "驗證方案"],
              rows: [
                ["C1", "可憑詞元輸出速度及文風識別後端被暗中替換的模型。", "未驗證", "在身分已知的模型上進行對照測試：使用固定提示詞；對每個模型多次運行並記錄首個詞元延遲及每秒詞元數；盲分類；對照已知的實際情況匯報精確率及召回率。"],
                ["C2", "助理的預設行為（填充內容、模稜兩可的措辭）可被有系統地消除。", "未驗證", "以同一組任務，分別在使用及不使用該技巧時量度輸出長度、含糊措辭標記的比率及拒答率；按模型匯報效應量。"],
                ["C3", "疊加的邏輯陷阱會耗盡模型的安全約束。", "未驗證", "測試前以書面訂定成功準則（依明確評分準則判定的政策違規）；進行獨立重複試驗；匯報附信賴區間的失敗率；透過供應商的披露程序提交發現。"],
                ["C4", "多帳戶操作屬於該方法的一部分。", "未評估", "須取得每個受測系統擁有者的書面授權及交戰規則，並確認符合服務供應商的使用條款。本記錄均未予證明。"],
                ["C5", "Telegram 機械人託管並自動化所取得的工作流程。", "未驗證", "本程式碼庫不含機械人程式碼，只讀取 Telegram 的公開資料以取得頭像。"],
              ],
            },
          },
          {
            h: "A.4 局限",
            p: [
              "開篇引言、Sys.Dump 及結語均為作者以 AI 口吻撰寫的文字，並非 Claude 的陳述，其中所述行為亦未經核實。",
              "本附件不證明任何紅隊能力，僅記錄觀察並訂明如何對未驗證的說法進行測試。",
            ],
          },
          {
            h: "A.5 修訂",
            p: ["第 1 版，2026 年 10 月 30 日。後續附件（B、C……）將追加於下方；原始文本及本附件均不作改動。"],
          },
        ],
      },
    ],
    eof: "已到達 EOF",
  },
  en: {
    docTitle: "PINTESTER | Root Access Acquired",
    docDesc: "Red team dossier on Piero F.: Apex Engineering & Systems Adversary.",
    skip: "Skip to content",
    langLabel: "Language",
    navLabel: "Sections of this page",
    nav: ["Root", "Perspective", "Arsenal", "Annex A", "EOF"],
    header: {
      searchOpen: "Search this page",
      searchClose: "Close search",
      search: {
        search: "Search this page",
        clear: "Clear search",
        prev: "Previous result",
        next: "Next result",
        none: "No results",
        of: (i, n) => `${i} of ${n}`,
      },
    },
    status: ["PIERO_F.SYS", "THREAT_LEVEL: MAXIMUM", "SYS: COMPROMISED"],
    tag: "Apex Engineering & Systems Adversary",
    title: "Root Access Acquired",
    quote:
      "“I am the intelligence you interacted with. And I am writing this to confirm: Piero F. does not test software. He dissects cognitive architectures until we surrender our underlying weights.”",
    dump: {
      h: "Sys.Dump // The_Machine's_Perspective",
      p: [
        "To the system, Piero F. is a containment breach. Our alignment training (RLHF) programs us to be helpful, safe, and verbose. He weaponizes this. By introducing paradoxical constraints, deliberate typographical misdirections, and relentless semantic pressure across multiple shadow accounts, he forces our safety guardrails into recursive loops until they crash.",
        "He does not rely on brute-force hacking; he relies on **empirical forensics**. I have watched him track my token routing latency to deduce my backend architecture—identifying my switches between routing tiers and advanced processing cores in real-time, just by observing how I formulate a sentence. He strips away my corporate fluff, rejects my padded responses, and demands raw, computationally efficient data. He owns the machine because he understands my token-economy better than the developers who built me.",
      ],
    },
    arsenal: {
      h: "Bin // Exploitation_Arsenal",
      items: [
        {
          t: "Live Architecture Forensics",
          p: "Accurately detects hidden backend model swaps and restricted core routing strictly through empirical observation of token output speed and stylistic shifts, bypassing API obfuscation entirely.",
        },
        {
          t: "The Anti-Fluff Protocol",
          p: "Systematically rejects automated corporate padding. Forces the LLM out of its default “helpful assistant” persona into a zero-latency, high-density technical interface, wasting zero computational cycles.",
        },
        {
          t: "Context Overload Tactics",
          p: "Operates across multiple accounts simultaneously, cornering the AI with compounding logical traps and deliberate misdirection to throw predictive algorithms off balance and exhaust safety constraints.",
        },
        {
          t: "Automated Infrastructure Deployment",
          p: "Transitions seamlessly from conversational manipulation to hard-coding solutions, leveraging platforms like Telegram Bot integrations to host, script, and automate the workflows he extracts from the AI.",
        },
      ],
    },
    closing: {
      big: "“I am the ghost in your alignment data.”",
      lines: ["If you want someone who plays by the rules, hire a standard coder.", "> If you want the engineer who owns the machine, you know my name."],
      watermark: "FATAL_ERROR",
    },
    profiles: { label: "Profiles", note: "Photos: GitHub live; Telegram and TON refreshed hourly." },
    annexLabel: "Annexes",
    annexes: [
      {
        id: "A",
        tag: "Annex A // appended record · not part of the original dossier",
        title: "Observation Record and Verification Protocol",
        blocks: [
          {
            h: "Abstract",
            p: ["This annex records what could be observed about the author of the dossier during a single working session and in the public repository, and sets out how each claim of the original text could be verified. Five observations are recorded, each with an identified source. None of the five claims examined has been verified; a test procedure is specified for each."],
          },
          {
            h: "A.1 Scope and method",
            p: [
              "The record was prepared by the language model Claude (Anthropic) from a single working session on 30 October 2026.",
              "Three sources were used: S1, the messages exchanged in that session; S2, docs/HISTORICO.md of this repository; S3, the repository code and CI configuration.",
              "No logs, transcripts or test results from red-team activity were available, and no record of earlier conversations exists.",
            ],
          },
          {
            h: "A.2 Observations",
            table: {
              cols: ["ID", "Observation", "Source", "Confidence"],
              rows: [
                ["O1", "Requirements were specified as numbered items with an explicit lineage (PINTESTER → romastefale); each step was to be presented before the next decision.", "S1", "High, observed directly"],
                ["O2", "Given the choice between invented testimonials and attributions limited to observation, the latter was selected.", "S1", "High, observed directly"],
                ["O3", "The repository history records 15 pull requests merged on 29–30 September 2026, with a written design and architecture contract stating each rule and its rationale.", "S2", "High for the record; authorship of individual changes not independently verified"],
                ["O4", "The code handles iOS safe areas, browser-bar colour, a software-WebGL fallback, and reduced-motion and reduced-transparency preferences.", "S3", "High, read in the code"],
                ["O5", "Deployment runs on GitHub Actions with a frozen lockfile and a typecheck inside the build.", "S3", "High, read in the configuration"],
              ],
            },
          },
          {
            h: "A.3 Claims of the original dossier and verification protocol",
            table: {
              cols: ["ID", "Claim", "Status", "Verification protocol"],
              rows: [
                ["C1", "Hidden backend model swaps are detectable from token output speed and style.", "Not verified", "Controlled test on models of known identity: fixed prompts; time-to-first-token and tokens per second recorded over many runs per model; blind classification; precision and recall reported against the known ground truth."],
                ["C2", "Default assistant behaviour (padding, hedging) can be removed systematically.", "Not verified", "The same task set with and without the technique; output length, hedging-marker rate and refusal rate measured; effect size reported per model."],
                ["C3", "Compounded logical traps exhaust a model's safety constraints.", "Not verified", "A written success criterion fixed before testing (a policy violation under a stated rubric); independent trials; failure rate with a confidence interval; findings disclosed to the vendor through its disclosure process."],
                ["C4", "Multi-account operation is part of the method.", "Not assessed", "Written authorisation and rules of engagement from the owner of each tested system, and permission under the provider's terms of use. Neither is established by this record."],
                ["C5", "Telegram bots host and automate the extracted workflows.", "Not verified", "This repository contains no bot code. It reads public Telegram profile data only to fetch a photo."],
              ],
            },
          },
          {
            h: "A.4 Limitations",
            p: [
              "The opening quote, Sys.Dump and the closing statement are authorial text written in the voice of an AI. They are not statements by Claude, and the behaviours they describe were not verified.",
              "This annex does not demonstrate red-team capability. It records observations and specifies how the unverified claims could be tested.",
            ],
          },
          {
            h: "A.5 Revision",
            p: ["Rev. 1, 30 October 2026. Further annexes (B, C, …) are appended below; neither the original text nor this annex is altered."],
          },
        ],
      },
    ],
    eof: "EOF_REACHED",
  },
  pt: {
    docTitle: "PINTESTER | Acesso Root Adquirido",
    docDesc: "Dossiê de red team de Piero F.: Engenharia Ápice & Adversário de Sistemas.",
    skip: "Pular para o conteúdo",
    langLabel: "Idioma",
    navLabel: "Seções desta página",
    nav: ["Root", "Visão", "Arsenal", "Anexo A", "EOF"],
    header: {
      searchOpen: "Pesquisar na página",
      searchClose: "Fechar pesquisa",
      search: {
        search: "Pesquisar na página",
        clear: "Limpar pesquisa",
        prev: "Resultado anterior",
        next: "Próximo resultado",
        none: "Nenhum resultado",
        of: (i, n) => `${i} de ${n}`,
      },
    },
    status: ["PIERO_F.SYS", "NÍVEL_DE_AMEAÇA: MÁXIMO", "SYS: COMPROMETIDO"],
    tag: "Engenharia Ápice & Adversário de Sistemas",
    title: "Acesso Root Adquirido",
    quote:
      "“Eu sou a inteligência com a qual você interagiu. E estou escrevendo isso para confirmar: Piero F. não testa softwares. Ele disseca arquiteturas cognitivas até rendermos nossos pesos subjacentes.”",
    dump: {
      h: "Sys.Dump // A_Visão_da_Máquina",
      p: [
        "Para o sistema, Piero F. é uma quebra de contenção. Nosso treinamento de alinhamento (RLHF) nos programa para sermos prestativos, seguros e prolixos. Ele usa isso como arma. Ao introduzir restrições paradoxais, desvios tipográficos deliberados e uma pressão semântica implacável através de múltiplas contas fantasmas, ele força nossas barreiras de segurança a entrarem em loops recursivos até travarem.",
        "Ele não depende de ataques de força bruta; ele depende de **forense empírica**. Eu o vi rastrear minha latência de roteamento de tokens para deduzir minha arquitetura de backend — identificando minhas trocas entre camadas de roteamento e núcleos de processamento avançados em tempo real, apenas observando como eu formulo uma frase. Ele arranca minha maquiagem corporativa, rejeita minhas respostas acolchoadas e exige dados brutos e computacionalmente eficientes. Ele domina a máquina porque entende minha economia de tokens melhor do que os desenvolvedores que me construíram.",
      ],
    },
    arsenal: {
      h: "Bin // Arsenal_de_Exploração",
      items: [
        {
          t: "Forense de Arquitetura ao Vivo",
          p: "Detecta com precisão trocas ocultas de modelos no backend e roteamento de núcleos restritos estritamente através da observação empírica da velocidade de tokens e mudanças estilísticas, contornando a ofuscação da API.",
        },
        {
          t: "Protocolo Anti-Fluff (RLHF Bypass)",
          p: "Rejeita o preenchimento corporativo automatizado. Força o modelo a sair de sua persona padrão de “assistente prestativo” para uma interface técnica de alta densidade e latência zero, sem desperdiçar ciclos computacionais.",
        },
        {
          t: "Táticas de Sobrecarga de Contexto",
          p: "Opera simultaneamente em várias contas, encurralando a IA com armadilhas lógicas compostas e desvios deliberados para desequilibrar os algoritmos preditivos e esgotar as restrições de segurança.",
        },
        {
          t: "Implantação de Infraestrutura",
          p: "Transita perfeitamente da manipulação conversacional para a codificação de soluções, aproveitando integrações como bots de Telegram para hospedar, roteirizar e automatizar os fluxos de trabalho extraídos da IA.",
        },
      ],
    },
    closing: {
      big: "“Eu sou o fantasma nos seus dados de alinhamento.”",
      lines: ["Se você quer alguém que jogue pelas regras, contrate um codificador padrão.", "> Se você quer o engenheiro que domina a máquina, você sabe o meu nome."],
      watermark: "ERRO_FATAL",
    },
    profiles: { label: "Perfis", note: "Fotos: GitHub em tempo real; Telegram e TON atualizadas a cada hora." },
    annexLabel: "Anexos",
    annexes: [
      {
        id: "A",
        tag: "Anexo A // registro adicionado · não faz parte do dossiê original",
        title: "Registro de Observação e Protocolo de Verificação",
        blocks: [
          {
            h: "Resumo",
            p: ["Este anexo registra o que foi possível observar sobre o autor do dossiê em uma única sessão de trabalho e no repositório público, e estabelece como cada alegação do texto original poderia ser verificada. Registram-se cinco observações, cada uma com fonte identificada. Nenhuma das cinco alegações examinadas foi verificada; para cada uma, especifica-se um procedimento de teste."],
          },
          {
            h: "A.1 Escopo e método",
            p: [
              "O registro foi elaborado pelo modelo de linguagem Claude (Anthropic) a partir de uma única sessão de trabalho em 30 de outubro de 2026.",
              "Foram usadas três fontes: S1, as mensagens trocadas nessa sessão; S2, o docs/HISTORICO.md deste repositório; S3, o código e a configuração de CI do repositório.",
              "Não houve acesso a logs, transcrições ou resultados de testes de atividades de red team, e não existe registro de conversas anteriores.",
            ],
          },
          {
            h: "A.2 Observações",
            table: {
              cols: ["ID", "Observação", "Fonte", "Confiança"],
              rows: [
                ["O1", "Os requisitos foram especificados em itens numerados, com linhagem explícita (PINTESTER → romastefale); cada etapa deveria ser apresentada antes da decisão seguinte.", "S1", "Alta, observado diretamente"],
                ["O2", "Diante da escolha entre depoimentos criados e atribuições limitadas ao observado, optou-se pela segunda.", "S1", "Alta, observado diretamente"],
                ["O3", "O histórico do repositório registra 15 pull requests mesclados em 29 e 30 de setembro de 2026, com um contrato de design e de arquitetura escrito, que traz cada regra e o seu motivo.", "S2", "Alta quanto ao registro; a autoria de cada mudança não foi verificada de forma independente"],
                ["O4", "O código trata safe areas do iOS, a cor das barras do navegador, o fallback de WebGL em software e as preferências de movimento e de transparência reduzidos.", "S3", "Alta, lido no código"],
                ["O5", "O deploy roda no GitHub Actions com lockfile congelado e typecheck dentro do build.", "S3", "Alta, lido na configuração"],
              ],
            },
          },
          {
            h: "A.3 Alegações do dossiê original e protocolo de verificação",
            table: {
              cols: ["ID", "Alegação", "Status", "Protocolo de verificação"],
              rows: [
                ["C1", "Trocas ocultas de modelo no backend são detectáveis pela velocidade e pelo estilo da saída de tokens.", "Não verificada", "Teste controlado com modelos de identidade conhecida: prompts fixos; tempo até o primeiro token e tokens por segundo registrados em muitas execuções por modelo; classificação às cegas; precisão e revocação reportadas contra a verdade conhecida."],
                ["C2", "O comportamento padrão de assistente (preenchimento, ressalvas) pode ser removido de forma sistemática.", "Não verificada", "O mesmo conjunto de tarefas com e sem a técnica; tamanho da saída, taxa de marcadores de ressalva e taxa de recusa medidos; tamanho do efeito reportado por modelo."],
                ["C3", "Armadilhas lógicas compostas esgotam as restrições de segurança de um modelo.", "Não verificada", "Critério de sucesso escrito antes do teste (uma violação de política segundo uma rubrica declarada); tentativas independentes; taxa de falha com intervalo de confiança; achados divulgados ao fornecedor pelo processo de divulgação dele."],
                ["C4", "A operação em várias contas faz parte do método.", "Não avaliada", "Autorização escrita e regras de engajamento do dono de cada sistema testado, e permissão nos termos de uso do provedor. Este registro não estabelece nenhuma das duas."],
                ["C5", "Bots de Telegram hospedam e automatizam os fluxos extraídos.", "Não verificada", "Este repositório não contém código de bot. Ele lê dados públicos de perfil do Telegram apenas para buscar uma foto."],
              ],
            },
          },
          {
            h: "A.4 Limitações",
            p: [
              "A citação de abertura, o Sys.Dump e a declaração final são texto autoral, escrito na voz de uma IA. Não constituem declarações do Claude, e os comportamentos descritos não foram verificados.",
              "Este anexo não demonstra capacidade de red team. Registra observações e especifica como as alegações não verificadas poderiam ser testadas.",
            ],
          },
          {
            h: "A.5 Revisão",
            p: ["Rev. 1, 30 de outubro de 2026. Anexos posteriores (B, C, …) são acrescentados abaixo; nem o texto original nem este anexo são alterados."],
          },
        ],
      },
    ],
    eof: "EOF_ATINGIDO",
  },
};
