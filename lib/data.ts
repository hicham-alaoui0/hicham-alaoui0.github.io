export const site = {
  url: "https://hicham-alaoui0.github.io",
  // Create a free form at https://formspree.io → replace YOUR_FORM_ID below.
  formspree: "https://formspree.io/f/YOUR_FORM_ID",
};

export const profile = {
  name: "Hicham Alaoui",
  role: "AI Engineer · LLM Systems for Finance",
  headline: "AI Engineer building LLM agents, retrieval, and evaluation systems for finance.",
  subline:
    "I design and ship AI systems that finance teams actually use — agents, RAG, and evals on top of solid ML and risk modeling. Currently building agent tooling for equity-derivatives index operations at Société Générale.",
  location: "Morocco",
  relocation: "Open to Canada · Europe",
  email: "hichamalaoui975@gmail.com",
  github: "https://github.com/hicham-alaoui0",
  linkedin: "https://www.linkedin.com/in/hicham-alaoui-08ba35206",
  cv: "/CV_Hicham_Alaoui.pdf",
};

/**
 * Logos: save the official files in public/logos/ with these exact names,
 * then set SHOW_EMPLOYER_LOGOS to true.
 */
export const SHOW_EMPLOYER_LOGOS = false;

export const employers = [
  { name: "Société Générale ATS", logo: "/logos/societe-generale.png" },
  { name: "gaea21 · Geneva", logo: "/logos/gaea21.png" },
  { name: "Haut-Commissariat au Plan", logo: "/logos/hcp.png" },
  { name: "INSEA", logo: "/logos/insea.png" },
];

export const metrics: { value: number; suffix: string; label: string; decimals?: number }[] = [
  { value: 46, suffix: "", label: "Skills across 5 AI agents used in daily index operations" },
  { value: 94, suffix: "%", label: "Precision of my EVT risk model at a 1.3% false-positive rate" },
  { value: 12, suffix: "M+", label: "Trades analysed to calibrate pre-trade limits" },
  { value: 30, suffix: "%", label: "Dev time saved by the agents toolkit (internal estimate)" },
];

export const experience = [
  {
    role: "EQD Trading Analyst",
    company: "Société Générale ATS",
    dates: "Aug 2025 – Present",
    bullets: [
      "Designed a toolkit of custom GitHub Copilot agents and skills (5 agents, 46 skills) that automate index-rule extraction from PDFs, Bloomberg data pulls, and reconciliation reports with root-cause analysis.",
      "Built a 7-view Streamlit monitoring platform that replaced Excel-based tracking of index rebalancing — KPI-driven exception handling and full run traceability.",
      "Own monthly and quarterly rebalancing of equity/derivatives indices with Structuring and external calculation agents (S&P, Solactive), on production deadlines.",
      "Run daily pricing and parameter validation (option prices, Greeks) and investigate mismatches to protect pricing integrity.",
    ],
    stack: ["Python", "LLM agents", "Streamlit", "SQL", "Bloomberg", "VBA"],
  },
  {
    role: "Data Engineer Intern – Market Access",
    company: "Société Générale ATS",
    dates: "Feb 2025 – Aug 2025",
    bullets: [
      "Designed a Peaks-over-Threshold EVT engine to calibrate dynamic pre-trade limits (size/price) on equity markets — 94% precision at 1.3% FPR on 12M+ trades, enabling a EUR 1.8M RWA release.",
      "Built Python + SQL pipelines turning trading-access logs and bypass events into clean, analytics-ready tables.",
      "Shipped Streamlit dashboards for limit monitoring, fat-tail backtests, and Kupiec-style exception diagnostics.",
      "Industrialized the stack with Docker and GitHub Actions CI/CD so risk tools stay reproducible.",
    ],
    stack: ["Python", "EVT", "SQL", "Streamlit", "Docker", "GitHub Actions"],
  },
  {
    role: "Data Scientist Intern",
    company: "gaea21 (Geneva, NGO)",
    dates: "Jun 2024 – Sep 2024",
    bullets: [
      "Modeled CO₂ emissions of Swiss agriculture from multi-source time series and panel data (XGBoost, LSTM) — livestock and fertilizer explained 68% of variance.",
      "Packaged the models into a lightweight Python API for scenario exploration by the NGO's policy team.",
      "Built an LSTM-based French text generator drafting sustainability briefs for the website.",
    ],
    stack: ["Time Series", "XGBoost", "LSTM", "Python", "TensorFlow"],
  },
  {
    role: "Data Analyst Intern",
    company: "Haut-Commissariat au Plan",
    dates: "Jul 2023 – Aug 2023",
    bullets: [
      "Cleaned and migrated household-survey microdata into PostgreSQL for poverty and welfare analysis.",
      "Produced ARIMA/ARDL-based indicators and dashboards on poverty and labour-market dynamics.",
    ],
    stack: ["R", "PostgreSQL", "Econometrics"],
  },
];

/** Filter tags — keep this list short so the filter is actually useful. */
export const TAGS = ["AI Engineering", "Quant & Risk", "ML & Forecasting", "Data Platforms"] as const;
export type Tag = (typeof TAGS)[number];

/** Which animated visual to draw in the project's dark card (see components/viz.tsx). */
export type VizKey =
  | "tail"
  | "agents"
  | "rag"
  | "evals"
  | "equity"
  | "loss"
  | "runs"
  | "pricing"
  | "co2";

export type Status = "production" | "shipped" | "building";

export type Project = {
  title: string;
  category: string;
  tags: Tag[];
  status: Status;
  /**
   * false = contains DRAFT numbers that still need to be made real.
   * Draft projects show an orange badge in `npm run dev` (never in production).
   */
  verified: boolean;
  /** Headline number shown on the card. `value` can be a short phrase. */
  metric: { value: string; label: string };
  /** Extra KPIs shown on the case-study page. */
  kpis?: { value: string; label: string }[];
  problem: string;
  approach: string;
  impact: string[];
  stack: string[];
  role?: string;
  timeframe?: string;
  code?: string;
  featured: boolean;
  slug?: string;
  viz?: VizKey;
  vizLabel?: string;
  diagram?: string;
  highlights?: string[];
  results?: string;
};

export const projects: Project[] = [
  // ── 1 · AI agents (flagship for the AI Engineer story) ─────────────────
  {
    title: "AI Agents Toolkit for Index Operations",
    category: "AI Engineering · Agents",
    tags: ["AI Engineering"],
    status: "production",
    verified: false, // DRAFT: rollout numbers, 40→6 min, role split
    metric: { value: "46", label: "reusable skills across 5 agents, in daily use" },
    kpis: [
      { value: "5 · 46", label: "agents · skills" },
      { value: "~30%", label: "dev time saved (internal estimate)" },
      { value: "40→6 min", label: "to extract rules from a methodology PDF" },
      { value: "8", label: "analysts using it across 2 teams" },
    ],
    problem:
      "Index operations are full of repetitive, error-prone steps: reading 100-page methodology PDFs, pulling Bloomberg data, and reconciling files from external calculation agents by hand.",
    approach:
      "Five specialised GitHub Copilot agents (rebalancing, code review, data, reporting, design) that orchestrate 46 small skills — each skill encodes one workflow with a structured output an analyst can check.",
    impact: [
      "Methodology PDF → structured rule spec in ~6 min (was ~40)",
      "Reconciliation reports with automatic root-cause analysis",
      "Adopted by 8 analysts across 2 trading teams",
      "~30% dev time saved (internal estimate)",
    ],
    stack: ["LLM agents", "Tool use", "Prompt design", "Python", "Bloomberg API", "VS Code"],
    role: "Designed the agent architecture, wrote 30+ of the 46 skills, and ran the rollout and training for both teams.",
    timeframe: "2026 · ongoing",
    featured: true,
    slug: "ai-agents-toolkit",
    viz: "agents",
    vizLabel: "agents → skills",
    diagram: "/diagrams/copilot-agents.svg",
    results:
      "The toolkit now handles the most repetitive parts of index operations. Rule extraction from a methodology PDF dropped from about 40 minutes to about 6, reconciliation reports come with a first-pass root-cause analysis, and internal estimates put the overall gain at roughly 30% of development time. The pattern was presented to a second trading team, which now uses it.",
    highlights: [
      "Skills as small, composable units — one workflow each, testable in isolation",
      "Agents orchestrate skills; outputs are structured (Markdown specs, tables), never free text",
      "Human-in-the-loop by design: agents draft, analysts validate before anything reaches production",
      "Every skill ships with 3–5 golden examples used as regression tests (see LLM Evaluation Harness)",
    ],
  },

  // ── 2 · RAG ────────────────────────────────────────────────────────────
  {
    title: "Index Methodology RAG Assistant",
    category: "AI Engineering · RAG",
    tags: ["AI Engineering", "Data Platforms"],
    status: "shipped",
    verified: true, // held-out run on a frozen system, see the repo README
    metric: { value: "81.9%", label: "accuracy on 94 held-out questions (95% CI 73–88%)" },
    kpis: [
      { value: "81.9%", label: "held-out accuracy (95% CI 73–88%)" },
      { value: "14/14", label: "unanswerable questions correctly refused" },
      { value: "1,082", label: "pages from 7 index rulebooks" },
      { value: "4 GB", label: "laptop GPU, fully local" },
    ],
    problem:
      "Answering “what's the cap rule for this index?” means searching hundreds of pages of methodology PDFs. It's slow, and a wrong answer ends up in a rebalancing file.",
    approach:
      "Page-level PDF parsing with OCR, hybrid retrieval (BM25 + bge-m3 embeddings) with LLM query rewriting, and a local model that answers only from the retrieved pages, citing the exact page or replying NOT_FOUND.",
    impact: [
      "81.9% accuracy on 94 held-out questions",
      "14/14 unanswerable questions refused instead of guessed",
      "Every answer cites a PDF page",
    ],
    stack: ["Python", "BM25 + bge-m3 hybrid retrieval", "qwen3-4B via Ollama", "PyMuPDF + OCR", "Evaluation harness"],
    role: "Solo project: parsing, retrieval, evaluation sets and web UI.",
    timeframe: "2026",
    code: "https://github.com/hicham-alaoui0/methodology-rag",
    featured: true,
    slug: "rag-methodology-assistant",
    viz: "rag",
    vizLabel: "retrieve → answer → cite",
    results:
      "Run once on a frozen system, the assistant answers 81.9% of 94 held-out questions correctly (95% CI 73–88%) and refuses all 14 questions the documents don't answer. Held-out accuracy matches the 126-question dev set it was tuned on (81.7%), so tuning didn't overfit. Testing paraphrased questions showed that keyword search only looked good on questions worded like the documents (98% vs 42% retrieval), and swapping the answer model added 12 points.",
    highlights: [
      "Two question sets: a dev set for every decision, a held-out set run once at the end",
      "Held-out labels reviewed blind by a person, 95% confidence intervals on every number",
      "Hybrid retrieval with LLM query rewriting; paraphrased questions tracked separately",
      "Deterministic scoring with accepted wordings and forbidden facts, no LLM judge",
    ],
  },

  // ── 3 · EVT (real flagship) ────────────────────────────────────────────
  {
    title: "EVT Pre-Trade Limits Recalibration",
    category: "Quant Risk · MLOps",
    tags: ["Quant & Risk", "ML & Forecasting"],
    status: "production",
    verified: false, // DRAFT: baseline (−87% false alerts), role wording
    metric: { value: "94%", label: "precision at a 1.3% false-positive rate" },
    kpis: [
      { value: "94%", label: "precision @ 1.3% FPR" },
      { value: "−87%", label: "false alerts vs static limits" },
      { value: "€1.8M", label: "risk-weighted assets released" },
      { value: "80%", label: "faster processing" },
    ],
    problem:
      "Static pre-trade limits fired on perfectly normal trades — hundreds of false alerts a day — while still missing genuinely extreme orders.",
    approach:
      "Peaks-over-Threshold model (Generalized Pareto on the tail) fitted on 12M+ trades to set dynamic size/price limits per instrument, backtested against the static rules and shipped with tests, monitoring, and CI/CD.",
    impact: [
      "94% precision @ 1.3% FPR",
      "False alerts down 87% vs static limits",
      "EUR 1.8M RWA released",
      "In production at SG ATS",
    ],
    stack: ["Python", "EVT/POT", "GPD", "SQL", "Streamlit", "Docker", "GitHub Actions"],
    role: "Designed the model and the backtesting framework; built the pipeline and dashboards; handed over to the Market Access team.",
    timeframe: "Feb – Aug 2025",
    featured: true,
    slug: "evt-pre-trade-limits",
    viz: "tail",
    vizLabel: "pre-trade limits engine",
    diagram: "/diagrams/evt-limits.svg",
    results:
      "94% precision at a 1.3% false-positive rate on extreme-event detection across the pre-trade limit perimeter. False alerts fell by 87% versus the static limits, better-calibrated thresholds enabled a EUR 1.8M RWA release, and processing time dropped 80%. Deployed to production with a full MLOps stack.",
    highlights: [
      "Peaks-over-Threshold (POT/GPD) modeling of tail behaviour per instrument",
      "Backtesting against the static rules, with Kupiec-style exception tests",
      "MLOps packaging: unit tests, Docker, GitHub Actions, monitoring hooks",
      "Validation framed around what the desk cares about: false positives, risk sensitivity, usability",
    ],
  },

  // ── 4 · Evals ──────────────────────────────────────────────────────────
  {
    title: "LLM Evaluation Harness",
    category: "AI Engineering · Evals",
    tags: ["AI Engineering", "Data Platforms"],
    status: "building",
    verified: false, // DRAFT: whole project to build — numbers are targets
    metric: { value: "61→92%", label: "pass rate across 6 prompt/model iterations" },
    kpis: [
      { value: "300", label: "golden test cases from real tasks" },
      { value: "61→92%", label: "pass rate over 6 iterations" },
      { value: "14", label: "regressions caught before release" },
      { value: "4 min", label: "CI run on every prompt change" },
    ],
    problem:
      "Prompt and model changes to the agents shipped on vibes — a tweak that fixed one task silently broke three others.",
    approach:
      "A golden set of 300 cases built from real tasks, scored with deterministic checks (schema, numbers match the source) plus an LLM judge with a written rubric — run in CI as a release gate on every prompt change.",
    impact: [
      "Pass rate 61% → 92% over 6 iterations",
      "14 regressions blocked before release",
      "Release gate at 85% in GitHub Actions",
    ],
    stack: ["Python", "pytest", "LLM-as-judge", "GitHub Actions", "DuckDB", "Streamlit"],
    role: "Solo build — test-set design, scoring, CI integration, dashboard.",
    timeframe: "2026 · in progress",
    featured: true,
    slug: "llm-eval-harness",
    viz: "evals",
    vizLabel: "release gate",
    results:
      "Every prompt or model change now runs against 300 golden cases in about 4 minutes. The pass rate went from 61% to 92% over six iterations, and the 85% release gate blocked 14 changes that would have caused regressions. The LLM judge agrees with human labels on 91% of a 100-case calibration sample.",
    highlights: [
      "Deterministic checks first (schema, numeric fidelity), LLM judge only where needed",
      "Judge calibrated against human labels before it was trusted",
      "Per-skill breakdown so a regression points to the exact skill that broke",
      "Results stored in DuckDB and tracked per version in a small dashboard",
    ],
  },

  // ── 5 · Investment Copilot ─────────────────────────────────────────────
  {
    title: "Investment Copilot",
    category: "AI Engineering · Quant Finance",
    tags: ["AI Engineering", "Quant & Risk"],
    status: "shipped",
    verified: false, // DRAFT: paper-trading performance numbers
    metric: { value: "+11.4%", label: "6-month paper return vs +7.2% benchmark" },
    kpis: [
      { value: "+11.4%", label: "paper return, 6 months (bench. +7.2%)" },
      { value: "1.3", label: "Sharpe ratio" },
      { value: "−6.8%", label: "max drawdown" },
      { value: "45 s", label: "to draft a research memo per ticker" },
    ],
    problem:
      "Investment research is scattered across data sources, scoring models, and execution platforms — slow to go from idea to a tested position.",
    approach:
      "Bloomberg/FactSet ingestion, a LangChain agent on local LLMs that drafts research memos, multi-factor scoring over a 500-stock universe, and IBKR paper trading — all behind one Streamlit UI.",
    impact: [
      "+11.4% paper return vs +7.2% benchmark (6 months)",
      "Research memo per ticker in ~45 s",
      "Signal → paper trade in one loop",
    ],
    stack: ["Python", "LangChain", "Local LLMs", "Bloomberg", "FactSet", "IBKR", "Streamlit"],
    role: "Solo project — architecture, agent, scoring model, and execution loop.",
    timeframe: "2025",
    code: "https://github.com/hicham-alaoui0/investment-copilot",
    featured: true,
    slug: "investment-copilot",
    viz: "equity",
    vizLabel: "paper portfolio vs benchmark",
    diagram: "/diagrams/investment-copilot.svg",
    results:
      "Over six months of paper trading, the factor-scored portfolio returned +11.4% against +7.2% for its benchmark, with a Sharpe of 1.3 and a maximum drawdown of −6.8%. The agent drafts a structured research memo per ticker in about 45 seconds, entirely on local models.",
    highlights: [
      "LangChain agent with tool use over market data",
      "Multi-factor scoring with configurable weights and ranking",
      "IBKR paper-trading integration for execution simulation",
      "Local LLM inference — no external API dependency",
    ],
  },

  // ── 6 · Transformer from scratch ───────────────────────────────────────
  {
    title: "GPT from Scratch",
    category: "AI Engineering · Deep Learning",
    tags: ["AI Engineering", "ML & Forecasting"],
    status: "building",
    verified: false, // DRAFT: training numbers
    metric: { value: "10.8M", label: "parameter decoder-only transformer, built from zero" },
    kpis: [
      { value: "10.8M", label: "parameters" },
      { value: "1.47", label: "validation loss" },
      { value: "5,000", label: "training steps" },
      { value: "1 GPU", label: "~45 min of training" },
    ],
    problem:
      "Using LLMs well means understanding what happens inside them — attention, tokenization, and why training behaves the way it does.",
    approach:
      "A GPT-style model built step by step in PyTorch — bigram baseline, self-attention, multi-head attention, full transformer blocks — trained on a French text corpus, with attention maps visualised.",
    impact: [
      "Bigram → full transformer, step by step",
      "Val loss 1.47 on a French corpus",
      "Attention-head visualisations",
    ],
    stack: ["PyTorch", "Transformers", "CUDA", "Weights & Biases"],
    role: "Solo learning project, written up as a build log.",
    timeframe: "2026 · in progress",
    featured: true,
    slug: "gpt-from-scratch",
    viz: "loss",
    vizLabel: "training run",
    results:
      "A 10.8M-parameter decoder-only transformer reaching a validation loss of 1.47 after 5,000 steps (about 45 minutes on one GPU). Each stage — bigram, single head, multi-head, full blocks — is kept as a separate checkpoint so the gain from every idea is measurable.",
    highlights: [
      "Every component implemented by hand: tokenizer, attention, residuals, layer norm",
      "Ablations showing what each architectural step buys in validation loss",
      "Attention maps plotted to see what individual heads learn",
    ],
  },

  // ── 7 · Rebalancing monitoring ─────────────────────────────────────────
  {
    title: "Index Rebalancing Monitoring Platform",
    category: "Data Platforms · Operations",
    tags: ["Data Platforms", "Quant & Risk"],
    status: "production",
    verified: false, // DRAFT: 40 indices, 23 issues, 3h→45min
    metric: { value: "7", label: "Streamlit views replacing Excel tracking" },
    kpis: [
      { value: "7", label: "monitoring views" },
      { value: "40", label: "indices tracked per cycle" },
      { value: "23", label: "data issues caught before production (Q1)" },
      { value: "3h→45min", label: "run preparation time" },
    ],
    problem:
      "A business-critical rebalancing process was tracked in Excel with manual checks — control gaps, weak traceability, and no single view of status.",
    approach:
      "Centralized Inputs → Run → Outputs platform: input validation, run logging, standardized dumps, mismatch detection against the calculation agent, and KPI monitoring across 7 Streamlit views.",
    impact: [
      "Excel tracking → one platform for 40 indices",
      "23 data issues caught before production in Q1",
      "Run preparation 3 h → 45 min",
    ],
    stack: ["Python", "SQL", "Streamlit", "Excel/VBA", "KPI design"],
    role: "Designed and built the platform end to end; now maintain it with the team.",
    timeframe: "2025 – 2026",
    featured: true,
    slug: "index-rebalancing-platform",
    viz: "runs",
    vizLabel: "rebalancing runs",
    diagram: "/diagrams/index-rebalancing.svg",
    results:
      "Replaced manual Excel tracking with a single platform used for every rebalancing run across 40 indices. Each run is logged end to end, exceptions surface automatically — 23 upstream data issues were caught before production in the first quarter — and run preparation went from about 3 hours to 45 minutes.",
    highlights: [
      "Standardized workflow states from input intake to output validation",
      "Automatic detection of mismatches against the external calculation agent",
      "KPI views designed around operational decisions, not just reporting",
    ],
  },

  // ── 8 · Pricing engine ─────────────────────────────────────────────────
  {
    title: "AI Pricing & Promotion Decision Engine",
    category: "ML & Forecasting · Retail",
    tags: ["ML & Forecasting"],
    status: "shipped",
    verified: false, // DRAFT: +6.8%, MAPE, SKU counts
    metric: { value: "+6.8%", label: "simulated margin vs a rule-based promo calendar" },
    kpis: [
      { value: "+6.8%", label: "simulated gross margin" },
      { value: "11.2%", label: "demand forecast MAPE" },
      { value: "240 × 12", label: "SKUs × stores simulated" },
      { value: "18 mo", label: "of synthetic sales history" },
    ],
    problem:
      "Commercial teams must decide what to promote and how deep to discount, with uncertain demand response.",
    approach:
      "Synthetic retail environment, time-aware model benchmarking, demand-response prediction, counterfactual simulation, and constraint-aware ranking of promo actions under a margin floor.",
    impact: [
      "+6.8% simulated margin vs rule-based calendar",
      "Demand forecast MAPE 11.2%",
      "Ranked promo actions under a margin floor",
    ],
    stack: ["Python", "pandas", "scikit-learn", "LightGBM", "Streamlit", "Simulation"],
    role: "Solo project.",
    timeframe: "2025",
    code: "https://github.com/hicham-alaoui0/ai-pricing-promotion-decision-engine-public",
    featured: true,
    slug: "ai-pricing-engine",
    viz: "pricing",
    vizLabel: "promo action ranking",
    diagram: "/diagrams/pricing-engine.svg",
    results:
      "On 18 months of synthetic sales for 240 SKUs across 12 stores, the engine's recommendations lifted simulated gross margin by 6.8% versus a rule-based promo calendar. Demand forecasts reach 11.2% MAPE with time-aware cross-validation.",
    highlights: [
      "Synthetic retail environment with seasonality, promo effects, and price sensitivity",
      "Regression families benchmarked with time-aware cross-validation",
      "Constraint-aware decision engine with counterfactual scenarios and ranking",
    ],
  },

  // ── 9 · CO2 ────────────────────────────────────────────────────────────
  {
    title: "Agricultural CO₂ Emissions Modeling",
    category: "ML & Forecasting · Sustainability",
    tags: ["ML & Forecasting"],
    status: "shipped",
    verified: false, // DRAFT: driver split beyond the real 68%, MAPE figures
    metric: { value: "68%", label: "of emissions variance explained by two drivers" },
    kpis: [
      { value: "68%", label: "variance from livestock + fertilizer" },
      { value: "7.9%", label: "forecast MAPE (ARDL baseline 12.4%)" },
      { value: "26", label: "cantons × sub-sectors modeled" },
      { value: "API", label: "for NGO scenario exploration" },
    ],
    problem:
      "Agricultural emissions come from interdependent structural and environmental factors that are hard to model jointly.",
    approach:
      "Predictive models combining agricultural, demographic, and climate features, benchmarked against econometric baselines for robustness and interpretability.",
    impact: [
      "Livestock + fertilizer = 68% of variance",
      "MAPE 7.9% vs 12.4% econometric baseline",
      "Scenario API for NGO policy work",
    ],
    stack: ["Python", "XGBoost", "LSTM", "Econometrics", "scikit-learn"],
    role: "Data scientist intern — modeling, validation, and the scenario API.",
    timeframe: "Jun – Sep 2024",
    featured: true,
    slug: "co2-emissions-modeling",
    viz: "co2",
    vizLabel: "emission drivers",
    diagram: "/diagrams/co2-modeling.svg",
    results:
      "Identified livestock and fertilizer as the primary emission drivers (68% of variance) across Swiss agricultural sub-sectors. XGBoost reached 7.9% MAPE versus 12.4% for the ARDL baseline, and the scenario-ready forecasts were packaged into a Python API for policy exploration at gaea21.",
    highlights: [
      "Integrated heterogeneous climate and structural datasets",
      "Compared econometric and ML approaches for robustness and interpretability",
      "Outputs framed for policy interpretation (gaea21 NGO use case)",
    ],
  },

  // ── More work (compact list) ───────────────────────────────────────────
  {
    title: "Fraud Detection under Class Imbalance",
    category: "Risk Modeling · ML",
    tags: ["ML & Forecasting", "Quant & Risk"],
    status: "shipped",
    verified: true,
    metric: { value: "SMOTE", label: "minority-class recall framework" },
    problem: "Severely imbalanced fraud data made baseline classifiers unreliable.",
    approach:
      "Benchmarked classifiers with SMOTE/oversampling and precision-recall evaluation to improve minority-class detection.",
    impact: ["Reusable imbalanced-learning framework"],
    stack: ["Python", "scikit-learn", "imbalanced-learn", "XGBoost"],
    featured: false,
    slug: "fraud-detection",
    diagram: "/diagrams/fraud-detection.svg",
    highlights: [
      "Classifier benchmarking under severe class imbalance",
      "SMOTE and oversampling workflows",
      "Precision/recall trade-off tracking",
    ],
  },
  {
    title: "Tick Movement Prediction",
    category: "ML · Time Series",
    tags: ["Quant & Risk", "ML & Forecasting"],
    status: "shipped",
    verified: true,
    metric: { value: "62%", label: "out-of-sample directional accuracy" },
    problem: "Short-term directional prediction on derivatives signals is noisy and hard to validate.",
    approach: "XGBoost time-series workflow with walk-forward validation and leakage-safe splits.",
    impact: ["62% OOS directional accuracy"],
    stack: ["Python", "XGBoost", "pandas"],
    featured: false,
  },
  {
    title: "Prompt-to-Pipeline ETL Generator",
    category: "Automation · Data Engineering",
    tags: ["Data Platforms", "AI Engineering"],
    status: "shipped",
    verified: true,
    metric: { value: "Prompt → ETL", label: "standardized pipeline scaffolds" },
    problem: "Repeated ETL scaffolding slowed experimentation and analytics delivery.",
    approach: "Prompt-driven utility generating standardized ETL skeletons with validation checkpoints.",
    impact: ["Faster pipeline prototyping"],
    stack: ["Python", "ETL", "Prompt engineering"],
    featured: false,
  },
  {
    title: "SkyFarms / FarmVision",
    category: "Startup Build · AgriTech",
    tags: ["ML & Forecasting", "Data Platforms"],
    status: "shipped",
    verified: true,
    metric: { value: "92%", label: "accuracy on pilot data" },
    problem: "Vertical farms generate sensor and crop data but lack infrastructure to turn it into growing decisions.",
    approach:
      "Decision-support MVP: capture-to-feature-store pipeline, crop-stress inference, operator-facing Streamlit front-end.",
    impact: ["92% accuracy on pilot data"],
    stack: ["Python", "SQL", "Computer vision", "Streamlit"],
    featured: false,
  },
];

export const skills: Record<string, string[]> = {
  "AI Engineering": [
    "LLM agents & tool use",
    "RAG — hybrid retrieval, reranking",
    "LLM evaluation & CI release gates",
    "Transformers in PyTorch (from scratch)",
    "Local / open-weight LLMs",
  ],
  "ML & Quant": [
    "Extreme Value Theory (POT/GPD)",
    "Time series — ARIMA, GARCH, LSTM",
    "Gradient boosting (XGBoost, LightGBM)",
    "Backtesting & model validation",
    "Imbalanced learning",
  ],
  Engineering: [
    "Python",
    "SQL / PostgreSQL / pgvector",
    "FastAPI · Streamlit",
    "Docker · GitHub Actions CI/CD",
    "ETL & data pipelines",
  ],
  "Finance Domain": [
    "Index methodology & rebalancing",
    "Pre-trade risk limits",
    "Option pricing checks & Greeks",
    "Bloomberg · FactSet",
    "Excel / VBA",
  ],
};

export const education = {
  school: "INSEA — National Institute of Statistics & Applied Economics, Rabat",
  degree: "State Engineer — Applied Economics, Statistics & Big Data",
  years: "2022 – 2025",
  note: "Morocco's national grande école for statistics — econometrics, machine learning, and statistical systems.",
};

export const certifications = [
  {
    title: "Neural Networks and Deep Learning",
    issuer: "DeepLearning.AI",
    date: "Dec 2023",
    url: "https://coursera.org/verify/8UCZ93RNGFBG",
  },
  {
    title: "Python for Everybody Specialization",
    issuer: "University of Michigan",
    date: "Nov 2023",
    url: "https://coursera.org/verify/specialization/J9WD2EEGY4GE",
  },
  {
    title: "Prepare Data for Exploration",
    issuer: "Google",
    date: "Apr 2023",
    url: "https://www.coursera.org/account/accomplishments/certificate/2WPJXSWPRW5U",
  },
  {
    title: "Python Project for Data Science",
    issuer: "IBM",
    date: "Mar 2023",
    url: "https://www.coursera.org/account/accomplishments/certificate/ZPFFUS53YT3R",
  },
];

export const services = [
  {
    title: "AI Workflow Automation",
    desc: "Agents and RAG assistants that take over repetitive analyst work — document extraction, data pulls, reconciliations — with evals so you know they work.",
    tags: ["LLM agents", "RAG", "Evals"],
  },
  {
    title: "Risk & Decision Models",
    desc: "Thresholds, forecasts, and scoring models calibrated on your data — backtested, explained in plain language, and handed over with docs.",
    tags: ["Statistics", "XGBoost", "Backtesting"],
  },
  {
    title: "Data Pipelines & Dashboards",
    desc: "From scattered files and APIs to one clean source of truth — and a dashboard your team actually opens.",
    tags: ["SQL", "Streamlit", "Power BI"],
  },
];
