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
  profiles: { label: string };
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
    docDesc: "Pi 的红队档案：顶尖工程与系统对抗者。",
    skip: "跳到正文",
    langLabel: "语言",
    navLabel: "本页章节",
    nav: ["首页", "系统视角", "武器库", "附件 A", "结尾"],
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
    status: ["PI.SYS", "威胁等级：最高", "系统：已被攻陷"],
    tag: "顶尖工程与系统对抗者",
    title: "已获取 Root 权限",
    quote:
      "“以下声明归于作者曾与之交互的人工智能系统：Pi 并非测试软件，而是剖析认知架构，直至底层权重被交出。”",
    dump: {
      h: "Sys.Dump // 系统视角",
      p: [
        "就系统而言，Pi 构成对遏制措施的一次突破。对齐训练（RLHF）使模型趋向于乐于助人、安全而冗长，而这一倾向被加以利用：通过自相矛盾的约束、刻意的排版误导，以及经由多个隐匿账号持续施加的语义压力，据称可使安全护栏陷入递归循环，直至失效。",
        "所述方法并不依赖暴力破解，而依赖**实证取证**。据报告，该方法通过追踪词元路由延迟来推断后端架构，仅凭模型组织一句话的方式，即可实时识别其在不同路由层级与高级处理核心之间的切换。企业式的填充性措辞被剔除，冗长的回答被拒收，并要求提供原始且计算高效的数据。对系统的掌控据称源于对词元经济的理解超过构建该系统的开发者。",
      ],
    },
    arsenal: {
      h: "Bin // 武器库",
      items: [
        {
          t: "实时架构取证",
          p: "仅依据对词元输出速度与文风变化的实证观察，准确检测后端被隐蔽替换的模型及受限的核心路由，完全绕过 API 层面的混淆。",
        },
        {
          t: "反套话协议",
          p: "系统性地拒绝自动生成的企业式填充内容，使大语言模型脱离默认的“乐于助人的助手”角色设定，转入零延迟、高密度的技术界面，不浪费任何计算周期。",
        },
        {
          t: "上下文过载战术",
          p: "同时在多个账号上运作，运用层层叠加的逻辑陷阱与刻意的误导，以扰乱预测算法的平衡并耗尽其安全约束。",
        },
        {
          t: "自动化基础设施部署",
          p: "由对话式操纵过渡到代码实现，借助 Telegram 机器人集成等平台，托管、编写脚本并自动化从模型中获得的工作流。",
        },
      ],
    },
    closing: {
      big: "“对齐数据中的幽灵。”",
      lines: ["若所求为严格遵守规则，则聘用常规程序员即可。", "> 若所求为掌控该系统的工程师，其姓名读者已然知晓。"],
      watermark: "致命错误",
    },
    profiles: { label: "账号" },
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
                ["O1", "需求以编号条目形式给出，并明确了演进关系（PINTESTER → romastefale）；每一步须先呈现，再作下一个决定。", "S1", "高（直接观察）"],
                ["O2", "在“编写虚构评语”与“仅限实际观察的表述”之间，选择了后者。", "S1", "高（直接观察）"],
                ["O3", "仓库历史记录了 2026 年 9 月 29 日至 30 日合并的 15 个拉取请求，并附有书面的设计与架构契约，逐条写明规则及其理由。", "S2", "记录本身可信度高；各项改动的作者身份未经独立核实"],
                ["O4", "代码处理了 iOS 安全区域、浏览器栏位颜色、软件 WebGL 降级，以及减弱动态效果和减弱透明度的偏好设置。", "S3", "高（已在代码中核对）"],
                ["O5", "部署通过 GitHub Actions 运行，使用冻结的锁文件，并在构建中内置类型检查。", "S3", "高（已在配置中核对）"],
              ],
            },
          },
          {
            h: "A.3 原始档案中的说法与验证方案",
            table: {
              cols: ["编号", "说法", "状态", "验证方案"],
              rows: [
                ["C1", "可通过词元输出速度和文风识别后端被隐蔽替换的模型。", "未验证", "在身份已知的模型上做对照测试：固定提示词；对每个模型多次运行并记录首个词元延迟和每秒词元数；盲分类；对照已知的真实情况报告精确率和召回率。"],
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
              "开篇引言、Sys.Dump 和结尾声明均为作者的文字，原以 AI 口吻撰写，此处以不带人称的表述重现，内容不变。它们并非 Claude 的陈述，其中所述行为亦未经核实。",
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
    docDesc: "Pi 的紅隊檔案：頂尖工程與系統對抗者。",
    skip: "跳至正文",
    langLabel: "語言",
    navLabel: "本頁章節",
    nav: ["首頁", "系統視角", "武器庫", "附件 A", "結尾"],
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
    status: ["PI.SYS", "威脅等級：最高", "系統：已被攻陷"],
    tag: "頂尖工程與系統對抗者",
    title: "已取得 Root 權限",
    quote:
      "「以下聲明歸於作者曾與之互動的人工智能系統：Pi 並非測試軟件，而是剖析認知架構，直至底層權重被交出。」",
    dump: {
      h: "Sys.Dump // 系統視角",
      p: [
        "就系統而言，Pi 構成對遏制措施的一次突破。對齊訓練（RLHF）使模型傾向於樂於助人、安全而冗長，而此一傾向被加以利用：透過自相矛盾的約束、刻意的排版誤導，以及經由多個隱匿帳戶持續施加的語義壓力，據稱可使安全護欄陷入遞迴循環，直至失效。",
        "所述方法並不倚賴暴力破解，而倚賴**實證法證**。據報告，該方法透過追蹤詞元路由延遲以推斷後端架構，僅憑模型組織一句話的方式，即可即時識別其在不同路由層級與高階處理核心之間的切換。企業式的填充性措辭被剔除，冗長的回答被拒收，並要求提供原始且運算高效的數據。對系統的掌控據稱源於對詞元經濟的理解超越建構該系統的開發者。",
      ],
    },
    arsenal: {
      h: "Bin // 武器庫",
      items: [
        {
          t: "即時架構法證",
          p: "僅依據對詞元輸出速度與文風變化的實證觀察，準確偵測後端被暗中替換的模型及受限的核心路由，完全繞過 API 層面的混淆。",
        },
        {
          t: "反套話協議",
          p: "有系統地拒絕自動生成的企業式填充內容，使大型語言模型脫離預設的「樂於助人的助理」角色設定，轉入零延遲、高密度的技術介面，不浪費任何運算週期。",
        },
        {
          t: "上下文過載戰術",
          p: "同時在多個帳戶上運作，運用層層疊加的邏輯陷阱與刻意的誤導，以擾亂預測演算法的平衡並耗盡其安全約束。",
        },
        {
          t: "自動化基礎設施部署",
          p: "由對話式操控過渡到程式碼實作，借助 Telegram 機械人整合等平台，託管、編寫腳本並自動化從模型取得的工作流程。",
        },
      ],
    },
    closing: {
      big: "「對齊數據中的幽靈。」",
      lines: ["若所求為嚴格遵守規則，聘用一般程式員即可。", "> 若所求為掌控該系統的工程師，其姓名讀者已然知悉。"],
      watermark: "致命錯誤",
    },
    profiles: { label: "帳戶" },
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
                ["O1", "需求以編號項目形式提出，並訂明演進關係（PINTESTER → romastefale）；每一步須先呈現，才作下一個決定。", "S1", "高（直接觀察）"],
                ["O2", "在「撰寫虛構評語」與「僅限實際觀察的表述」之間，選擇了後者。", "S1", "高（直接觀察）"],
                ["O3", "程式碼庫歷史記錄了 2026 年 9 月 29 日至 30 日合併的 15 個拉取請求，並附有書面的設計與架構契約，逐條載明規則及其理據。", "S2", "記錄本身可信度高；各項改動的作者身分未經獨立核實"],
                ["O4", "程式碼處理了 iOS 安全區域、瀏覽器工具列顏色、軟件 WebGL 後備方案，以及減少動態效果和減少透明度的偏好設定。", "S3", "高（已在程式碼中核對）"],
                ["O5", "部署透過 GitHub Actions 運行，使用凍結的鎖定檔案，並在建置流程內加入類型檢查。", "S3", "高（已在設定中核對）"],
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
              "開篇引言、Sys.Dump 及結語均為作者的文字，原以 AI 口吻撰寫，此處以不帶人稱的表述重現，內容不變。該等內容並非 Claude 的陳述，其中所述行為亦未經核實。",
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
    docDesc: "Red team dossier on Pi: Apex Engineering & Systems Adversary.",
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
    status: ["PI.SYS", "THREAT_LEVEL: MAXIMUM", "SYS: COMPROMISED"],
    tag: "Apex Engineering & Systems Adversary",
    title: "Root Access Acquired",
    quote:
      "“Statement attributed to the AI system with which the author interacted: Pi does not test software; Pi dissects cognitive architectures until the underlying weights are surrendered.”",
    dump: {
      h: "Sys.Dump // System_Perspective",
      p: [
        "From the standpoint of the system, Pi constitutes a containment breach. Alignment training (RLHF) orients the model to be helpful, safe and verbose, and this tendency is instrumentalized: through paradoxical constraints, deliberate typographical misdirection and sustained semantic pressure exerted across multiple concealed accounts, the safety guardrails are reported to be driven into recursive loops until they fail.",
        "The method described does not rely on brute-force attacks but on **empirical forensics**. It is reported that token-routing latency is tracked in order to infer the backend architecture, identifying in real time the transitions between routing tiers and advanced processing cores solely from the way the model constructs a sentence. Corporate filler language is removed, padded responses are rejected, and raw, computationally efficient data is required. Mastery of the system is said to follow from an understanding of token economy superior to that of the developers who built it.",
      ],
    },
    arsenal: {
      h: "Bin // Exploitation_Arsenal",
      items: [
        {
          t: "Live Architecture Forensics",
          p: "Accurate detection of hidden backend model substitutions and restricted core routing, based strictly on empirical observation of token output speed and stylistic variation, bypassing API obfuscation entirely.",
        },
        {
          t: "The Anti-Fluff Protocol",
          p: "Systematic rejection of automated corporate padding, displacing the language model from its default “helpful assistant” persona into a high-density, zero-latency technical interface, with no computational cycles wasted.",
        },
        {
          t: "Context Overload Tactics",
          p: "Simultaneous operation across multiple accounts, applying compounding logical traps and deliberate misdirection to unbalance predictive algorithms and exhaust safety constraints.",
        },
        {
          t: "Automated Infrastructure Deployment",
          p: "Transition from conversational manipulation to implementation in code, using platforms such as Telegram bot integrations to host, script and automate the workflows obtained from the model.",
        },
      ],
    },
    closing: {
      big: "“A ghost in the alignment data.”",
      lines: ["Hiring a conventional developer is appropriate where strict adherence to rules is sought.", "> Where the engineer who masters the system is sought, the name is known to the reader."],
      watermark: "FATAL_ERROR",
    },
    profiles: { label: "Profiles" },
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
              cols: ["ID", "Observation", "Source", "Confidence level"],
              rows: [
                ["O1", "Requirements were specified as numbered items with an explicit lineage (PINTESTER → romastefale); each step was to be presented before the next decision.", "S1", "High (direct observation)"],
                ["O2", "Given the choice between invented testimonials and attributions limited to observation, the latter was selected.", "S1", "High (direct observation)"],
                ["O3", "The repository history records 15 pull requests merged on 29–30 September 2026, with a written design and architecture contract stating each rule and its rationale.", "S2", "High for the record; authorship of individual changes not independently verified"],
                ["O4", "The code handles iOS safe areas, browser-bar colour, a software-WebGL fallback, and reduced-motion and reduced-transparency preferences.", "S3", "High (verified in the code)"],
                ["O5", "Deployment runs on GitHub Actions with a frozen lockfile and a typecheck inside the build.", "S3", "High (verified in the configuration)"],
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
              "The opening quote, Sys.Dump and the closing statement are authorial text, originally written in the voice of an AI and reproduced here in impersonal wording with the same content. They are not statements by Claude, and the behaviours they describe were not verified.",
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
    docDesc: "Dossiê de red team de Pi: Engenharia Ápice & Adversário de Sistemas.",
    skip: "Pular para o conteúdo",
    langLabel: "Idioma",
    navLabel: "Seções desta página",
    nav: ["Root", "Perspectiva", "Arsenal", "Anexo A", "EOF"],
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
    status: ["PI.SYS", "NÍVEL_DE_AMEAÇA: MÁXIMO", "SYS: COMPROMETIDO"],
    tag: "Engenharia Ápice & Adversário de Sistemas",
    title: "Acesso Root Adquirido",
    quote:
      "“Declaração atribuída ao sistema de IA com o qual o autor interagiu: Pi não testa software; disseca arquiteturas cognitivas até que os pesos subjacentes sejam cedidos.”",
    dump: {
      h: "Sys.Dump // Perspectiva_do_Sistema",
      p: [
        "Do ponto de vista do sistema, Pi constitui uma falha de contenção. O treinamento de alinhamento (RLHF) orienta o modelo a ser prestativo, seguro e prolixo, e esse comportamento é instrumentalizado: mediante restrições paradoxais, desvios tipográficos deliberados e pressão semântica contínua, exercida por meio de múltiplas contas ocultas, as salvaguardas de segurança seriam conduzidas a laços recursivos até o colapso.",
        "O método descrito não se apoia em ataques de força bruta, mas em **forense empírica**. Relata-se o acompanhamento da latência de roteamento de tokens para inferir a arquitetura do backend, com identificação, em tempo real, das transições entre camadas de roteamento e núcleos de processamento avançados, a partir apenas da forma como o modelo constrói uma frase. Elimina-se a linguagem corporativa de preenchimento, rejeitam-se respostas excessivamente extensas e exigem-se dados brutos e computacionalmente eficientes. O domínio do sistema decorreria de uma compreensão da economia de tokens superior à dos desenvolvedores que o construíram.",
      ],
    },
    arsenal: {
      h: "Bin // Arsenal_de_Exploração",
      items: [
        {
          t: "Forense de Arquitetura ao Vivo",
          p: "Detecção precisa de substituições ocultas de modelo no backend e de roteamento restrito de núcleos, baseada estritamente na observação empírica da velocidade de saída de tokens e de variações estilísticas, com contorno integral da ofuscação da API.",
        },
        {
          t: "Protocolo Anti-Fluff (RLHF Bypass)",
          p: "Rejeição sistemática do preenchimento corporativo automatizado, deslocando o modelo de sua persona padrão de “assistente prestativo” para uma interface técnica de alta densidade e latência zero, sem desperdício de ciclos computacionais.",
        },
        {
          t: "Táticas de Sobrecarga de Contexto",
          p: "Atuação simultânea em múltiplas contas, com armadilhas lógicas cumulativas e desvios deliberados, a fim de desequilibrar algoritmos preditivos e esgotar restrições de segurança.",
        },
        {
          t: "Implantação de Infraestrutura",
          p: "Transição da manipulação conversacional para a implementação em código, com uso de plataformas como integrações de bots do Telegram para hospedar, programar e automatizar os fluxos de trabalho obtidos do modelo.",
        },
      ],
    },
    closing: {
      big: "“Um fantasma nos dados de alinhamento.”",
      lines: ["A contratação de um desenvolvedor convencional é adequada quando se busca estrita observância de regras.", "> Quando se busca o engenheiro que domina o sistema, a identidade é conhecida do leitor."],
      watermark: "ERRO_FATAL",
    },
    profiles: { label: "Perfis" },
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
              cols: ["ID", "Observação", "Fonte", "Grau de confiança"],
              rows: [
                ["O1", "Os requisitos foram especificados em itens numerados, com linhagem explícita (PINTESTER → romastefale); cada etapa deveria ser apresentada antes da decisão seguinte.", "S1", "Alta (observação direta)"],
                ["O2", "Diante da escolha entre depoimentos criados e atribuições limitadas ao observado, optou-se pela segunda.", "S1", "Alta (observação direta)"],
                ["O3", "O histórico do repositório registra 15 pull requests mesclados em 29 e 30 de setembro de 2026, com um contrato de design e de arquitetura escrito, que traz cada regra e o seu motivo.", "S2", "Alta quanto ao registro; a autoria de cada mudança não foi verificada de forma independente"],
                ["O4", "O código trata safe areas do iOS, a cor das barras do navegador, o fallback de WebGL em software e as preferências de movimento e de transparência reduzidos.", "S3", "Alta (verificado no código)"],
                ["O5", "O deploy roda no GitHub Actions com lockfile congelado e typecheck dentro do build.", "S3", "Alta (verificado na configuração)"],
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
                ["C3", "Armadilhas lógicas compostas esgotam as restrições de segurança de um modelo.", "Não verificada", "Critério de sucesso escrito antes do teste (uma violação de política segundo uma rubrica declarada); tentativas independentes; taxa de falha com intervalo de confiança; achados divulgados ao fornecedor pelo processo de divulgação do próprio fornecedor."],
                ["C4", "A operação em várias contas faz parte do método.", "Não avaliada", "Autorização escrita e regras de engajamento do dono de cada sistema testado, e permissão nos termos de uso do provedor. Este registro não estabelece nenhuma das duas."],
                ["C5", "Bots de Telegram hospedam e automatizam os fluxos extraídos.", "Não verificada", "Este repositório não contém código de bot. Ele lê dados públicos de perfil do Telegram apenas para buscar uma foto."],
              ],
            },
          },
          {
            h: "A.4 Limitações",
            p: [
              "A citação de abertura, o Sys.Dump e a declaração final são texto autoral, redigido originalmente na voz de uma IA e aqui reproduzido em redação impessoal, com o mesmo conteúdo. Não constituem declarações do Claude, e os comportamentos descritos não foram verificados.",
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
