export const site = {
  url: "https://hicham-alaoui0.github.io",
  // Create a free form at https://formspree.io → replace YOUR_FORM_ID below.
  formspree: "https://formspree.io/f/YOUR_FORM_ID",
};

export const profile = {
  name: "Hicham Alaoui",
  role: "Data Scientist · EQD Trading Analyst",
  headline:
    "Applied Data Scientist building production ML and decision systems for finance, risk, and analytics.",
  subline:
    "I build end-to-end systems — from data pipelines to model deployment — turning ambiguous business problems into measurable operational outcomes.",
  location: "Rabat, Morocco",
  email: "hichamalaoui975@gmail.com",
  github: "https://github.com/hicham-alaoui0",
  linkedin: "https://www.linkedin.com/in/hicham-alaoui-08ba35206",
  cv: "/CV_Hicham_Alaoui.pdf",
};

export const metrics = [
  { value: 12, suffix: "M+", label: "Intraday trades processed by my production pipeline" },
  { value: 94, suffix: "%", label: "Precision — EVT pre-trade limit model (1.3% FPR)" },
  { value: 1.8, suffix: "M€", label: "Risk-weighted assets released", decimals: 1 },
  { value: 80, suffix: "%", label: "Faster processing after automation" },
];

export const experience = [
  {
    role: "EQD Trading Analyst",
    company: "Société Générale ATS",
    dates: "Aug 2025 – Present",
    bullets: [
      "Partner with Structuring to design, build, and maintain equity/derivatives index methodologies; translate product specs into robust operational processes.",
      "Own monthly/quarterly index rebalancing workflows, coordinating with external calculation agents (S&P, Solactive) to meet production deadlines.",
      "Lead daily pricing/parameter validation (Call/Put prices, key Greeks) and investigate mismatches to protect pricing integrity.",
      "Industrialize index production: automated controls and reporting, standardized multi-index outputs, streamlined Bloomberg data retrieval + ESG mapping.",
    ],
    stack: ["Python", "SQL", "Bloomberg", "VBA", "ML/Statistical Modeling"],
  },
  {
    role: "Data Engineer Intern – Market Access",
    company: "Société Générale ATS",
    dates: "Feb 2025 – Aug 2025",
    bullets: [
      "Designed a Peaks-over-Threshold EVT engine to calibrate dynamic pre-trade limits (size/price) on equity markets — 94% precision at 1.3% FPR on 12M+ trades, enabling EUR 1.8M RWA release.",
      "Built Python + SQL pipelines to ingest trading-access logs and bypasser events into clean, analytics-ready tables.",
      "Developed Streamlit dashboards for limit monitoring, fat-tail backtests, and Kupiec-style exception diagnostics.",
      "Industrialized the stack with Docker and GitHub Actions CI/CD to keep risk tools reproducible.",
    ],
    stack: ["Python", "EVT", "Streamlit", "Docker", "GitHub Actions"],
  },
  {
    role: "Data Scientist Intern",
    company: "gaea21 (Geneva, NGO)",
    dates: "Jun 2024 – Sep 2024",
    bullets: [
      "Built CO₂ emissions prediction models for Swiss agriculture from multi-source time series and panel data (XGBoost, LSTM).",
      "Implemented an LSTM-based French article generator producing sustainability briefs for the website.",
      "Packaged models into a lightweight Python API for scenario exploration and NGO decision support.",
    ],
    stack: ["Time Series", "NLP", "Python", "TensorFlow"],
  },
  {
    role: "Data Analyst Intern",
    company: "Haut-Commissariat au Plan",
    dates: "Jul 2023 – Aug 2023",
    bullets: [
      "Cleaned and migrated household survey microdata into PostgreSQL for poverty and welfare analysis.",
      "Produced ARIMA/ARDL-based indicators and dashboards on poverty and labour-market dynamics.",
    ],
    stack: ["R", "PostgreSQL", "Econometrics"],
  },
];

export type Project = {
  title: string;
  category: string;
  problem: string;
  approach: string;
  impact: string[];
  stack: string[];
  code?: string;
  featured: boolean;
  slug?: string;
  diagram?: string;
  highlights?: string[];
  results?: string;
};

export const projects: Project[] = [
  {
    title: "EVT Pre-Trade Limits Recalibration",
    category: "Quant Risk · MLOps",
    problem:
      "Pre-trade control thresholds were hard to calibrate manually — a trade-off between excessive false alerts and weak risk sensitivity.",
    approach:
      "EVT Peaks-over-Threshold (GPD) framework on 12M+ trades estimating extreme behavior and proposing dynamic thresholds, packaged with tests, monitoring, and deployment logic.",
    impact: [
      "94% precision @ 1.3% FPR",
      "EUR 1.8M RWA released",
      "80% faster processing",
      "Production @ SG ATS",
    ],
    stack: ["Python", "EVT/POT", "GPD", "SQL", "Docker", "GitHub Actions"],
    featured: true,
    slug: "evt-pre-trade-limits",
    diagram: "/diagrams/evt-limits.svg",
    results:
      "94% precision at a 1.3% false-positive rate on extreme-event detection across the full pre-trade limit-monitoring perimeter at Société Générale ATS. Improved threshold accuracy enabled a EUR 1.8M RWA release and cut processing time by 80% versus the prior heuristic approach. Deployed to production with a full MLOps stack.",
    highlights: [
      "Peaks-over-Threshold (POT/GPD) modeling for tail-risk behavior estimation",
      "Backtesting and threshold comparison against heuristic benchmark rules",
      "MLOps packaging with unit tests, Docker, GitHub Actions, and monitoring hooks",
      "Business-oriented validation around false positives, risk sensitivity, and operational usability",
    ],
  },
  {
    title: "Investment Copilot",
    category: "LLM Agents · Quant Finance",
    problem:
      "Investment research is fragmented across data sources, scoring models, and execution platforms — slow to move from signal to tested position.",
    approach:
      "End-to-end AI research platform: Bloomberg/FactSet ingestion, LangChain agent with local LLM inference, multi-factor stock scoring, and IBKR paper trading via a Streamlit UI.",
    impact: [
      "Unified research + scoring pipeline",
      "Agentic equity research, local LLMs",
      "IBKR paper-trading execution loop",
    ],
    stack: ["Python", "LangChain", "LLMs", "Bloomberg", "FactSet", "IBKR", "Streamlit"],
    code: "https://github.com/hicham-alaoui0/investment-copilot",
    featured: true,
    slug: "investment-copilot",
    diagram: "/diagrams/investment-copilot.svg",
    results:
      "Integrated Bloomberg and FactSet data into a unified research and scoring pipeline, automated equity research with a LangChain agent running on local LLMs, and closed the loop with IBKR paper trading for end-to-end signal testing — all served through a Streamlit UI.",
    highlights: [
      "LangChain agent orchestration with tool use over live market data",
      "Multi-factor scoring with configurable factor weights and ranking",
      "IBKR paper-trading integration for execution simulation",
      "Local LLM inference — no external API dependency for research generation",
    ],
  },
  {
    title: "Index Rebalancing Control Platform",
    category: "Decision Systems · Operations",
    problem:
      "A business-critical rebalancing process depended on manual checks, creating control gaps and weak traceability.",
    approach:
      "Inputs → Run → Outputs platform with input validation, run logging, standardized dumps, mismatch detection, and KPI/KPA monitoring.",
    impact: [
      "Cut manual validation time",
      "Audit-ready run traceability",
      "Repeatable exception framework",
    ],
    stack: ["Python", "SQL", "Excel/VBA", "Workflow design", "KPI dashboards"],
    featured: true,
    slug: "index-rebalancing-platform",
    diagram: "/diagrams/index-rebalancing.svg",
    results:
      "Reduced manual control steps across rebalancing runs, cutting validation time significantly. Delivered full run traceability and audit-ready documentation for regulatory review, plus a repeatable exception framework that surfaced recurring upstream data issues.",
    highlights: [
      "Standardized workflow states from input intake to output validation",
      "Exception detection for mismatches and missing controls",
      "KPI/KPA monitoring structured for operational decision-making",
    ],
  },
  {
    title: "AI Pricing & Promotion Decision Engine",
    category: "Decision Science · Retail",
    problem:
      "Commercial teams must decide what to promote and how deeply to discount under uncertain demand behavior.",
    approach:
      "Synthetic retail data generation, time-aware model benchmarking, demand-response prediction, counterfactual simulation, and constraint-aware action ranking.",
    impact: [
      "Pricing → decision-support system",
      "Forecasts wired to promo actions",
      "Interactive Streamlit dashboard",
    ],
    stack: ["Python", "pandas", "scikit-learn", "Streamlit", "Simulation"],
    code: "https://github.com/hicham-alaoui0/ai-pricing-promotion-decision-engine-public",
    featured: true,
    slug: "ai-pricing-engine",
    diagram: "/diagrams/pricing-engine.svg",
    results:
      "Converted open-ended pricing questions into a structured decision-support system: ML demand forecasts wired to practical promotion recommendations, with counterfactual scenario simulation and business-facing outputs in an interactive Streamlit dashboard.",
    highlights: [
      "Realistic synthetic retail environment covering seasonality, promotion effects, and price sensitivity",
      "Benchmarked and tuned regression families using time-aware cross-validation",
      "Constraint-aware decision engine with scenario simulation and ranking logic",
    ],
  },
  {
    title: "Agricultural CO₂ Emissions Modeling",
    category: "Sustainability · Econometrics",
    problem:
      "Agricultural emissions are driven by interdependent structural and environmental factors that are hard to model jointly.",
    approach:
      "Predictive models combining agricultural, demographic, and climate features; econometric vs ML benchmarking for robustness and interpretability.",
    impact: [
      "Livestock + fertilizer = 68% of variance",
      "XGBoost/LSTM vs econometric baselines",
      "Scenario API for NGO policy work",
    ],
    stack: ["Python", "XGBoost", "LSTM", "Econometrics", "scikit-learn"],
    featured: true,
    slug: "co2-emissions-modeling",
    diagram: "/diagrams/co2-modeling.svg",
    results:
      "Identified livestock and fertilizer as primary emission drivers (68% of variance) across Swiss agricultural sub-sectors. Validated XGBoost and LSTM approaches against econometric benchmarks, and packaged scenario-ready forecasts into a Python API for NGO policy exploration at gaea21.",
    highlights: [
      "Integrated heterogeneous climate and structural datasets from multiple sources",
      "Compared econometric and ML approaches for robustness and interpretability",
      "Framed model outputs for policy-oriented interpretation (gaea21 NGO use case)",
    ],
  },
  {
    title: "Fraud Detection under Class Imbalance",
    category: "Risk Modeling · ML",
    problem:
      "Severely imbalanced fraud data made baseline classifiers unreliable for risk-sensitive detection.",
    approach:
      "Benchmarked classifiers with SMOTE/oversampling to improve minority-class detection, with rigorous precision-recall evaluation.",
    impact: [
      "Large recall gains on fraud class",
      "Reusable imbalanced-learning framework",
    ],
    stack: ["Python", "scikit-learn", "imbalanced-learn", "XGBoost"],
    featured: true,
    slug: "fraud-detection",
    diagram: "/diagrams/fraud-detection.svg",
    results:
      "Achieved significant recall improvement on the minority fraud class using SMOTE + XGBoost versus a naive baseline. Built a reusable model-comparison framework for class-imbalanced risk problems with a rigorous precision-recall evaluation workflow.",
    highlights: [
      "Classifier benchmarking under severe class-imbalance constraints",
      "SMOTE and oversampling workflows to improve minority signal capture",
      "Precision/recall trade-off tracking with operational relevance framing",
    ],
  },
  {
    title: "Tick Movement Prediction",
    category: "ML · Time Series",
    problem: "Short-term directional prediction on derivatives signals is noisy and hard to validate.",
    approach:
      "XGBoost time-series workflow with walk-forward validation and leakage-safe splits.",
    impact: ["62% OOS directional accuracy"],
    stack: ["Python", "XGBoost", "pandas"],
    featured: false,
  },
  {
    title: "AI Equity Selection & Allocation Engine",
    category: "Portfolio Analytics",
    problem: "Turning large issuer/market datasets into coherent allocation decisions is slow and inconsistent.",
    approach:
      "AI-driven workflow linking research signals, issuer scoring, ranking logic, and portfolio weighting.",
    impact: ["Research → allocation-ready decisions"],
    stack: ["Python", "Factor scoring", "Portfolio allocation"],
    featured: false,
  },
  {
    title: "Prompt-to-Pipeline ETL Generator",
    category: "Automation · Data Engineering",
    problem: "Repeated ETL scaffolding slowed experimentation and analytics delivery.",
    approach:
      "Prompt-driven utility generating standardized ETL skeletons with validation checkpoints.",
    impact: ["Faster pipeline prototyping"],
    stack: ["Python", "ETL", "Prompt engineering"],
    featured: false,
  },
  {
    title: "SkyFarms / FarmVision",
    category: "Startup Build · AgriTech",
    problem: "Vertical farms generate sensor and crop data but lack infrastructure to turn it into growing decisions.",
    approach:
      "Decision-support MVP: pipeline from capture to feature store, crop-stress inference, operator-facing Streamlit front-end.",
    impact: ["92% accuracy on pilot data"],
    stack: ["Python", "SQL", "Computer vision", "Streamlit"],
    featured: false,
  },
];

export const skills: Record<string, string[]> = {
  "ML & Quantitative": [
    "Extreme Value Theory",
    "Time Series (ARIMA/GARCH)",
    "XGBoost / Random Forests",
    "Neural Networks (LSTM/CNN)",
    "Feature Engineering",
    "Model Evaluation & Backtesting",
  ],
  "Decision Systems": [
    "Control analytics",
    "Monitoring & exception handling",
    "KPI/KPA design",
    "Decision workflow design",
    "Risk threshold calibration",
  ],
  Engineering: [
    "Python",
    "SQL",
    "R",
    "Docker",
    "Git / GitHub Actions",
    "ETL & data pipelines",
  ],
  Platforms: [
    "Streamlit",
    "Bloomberg",
    "Excel / VBA",
    "scikit-learn",
    "TensorFlow",
    "Power BI",
  ],
};

export const education = {
  school: "INSEA — National Institute of Statistics & Applied Economics, Rabat",
  degree: "State Engineer — Applied Economics, Statistics & Big Data",
  years: "2022 – 2025",
  note: "Morocco's top engineering school for statistics — econometrics, ML, and statistical systems.",
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
    title: "ETL & Data Pipelines",
    desc: "From scattered APIs, files, and databases to one clean, queryable source of truth — scheduled, tested, documented.",
    tags: ["Python", "SQL", "Airflow", "Docker"],
  },
  {
    title: "Reporting Automation",
    desc: "Weekly Excel, PDF, or email reports that build and send themselves — with validation checks so the numbers are right every time.",
    tags: ["Python", "pandas", "Automation"],
  },
  {
    title: "BI Dashboards",
    desc: "Live dashboards on top of your data — KPIs, monitoring, and drill-downs your team actually uses.",
    tags: ["Power BI", "Streamlit", "Grafana"],
  },
];
