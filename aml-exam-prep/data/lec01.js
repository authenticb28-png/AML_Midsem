/* Lecture 1 — The ML Project Lifecycle (Part 1): problem, data, EDA, preprocessing */
LECTURES.push({
  num: 1, short: 'Lifecycle I', title: 'ML Project Lifecycle (Part 1) — Problem Definition, Data Collection, EDA, Preprocessing',
  file: 'AML_Lecture 1_Worksheet_Filled.pdf', pages: 9,
  intro: R`**Exam weight:** medium. Easy MCQs on the five-step blueprint, data structures and feature types, plus **numerical questions on scaling** (Min-Max, Z-score, Robust, Max-Abs) and on **binary encoding** (number of bits). Learn the four scaling formulas by heart and practise them by hand. About 60 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L01.1 */
  {
    id: 'L01.1', title: 'Problem definition — the five-step blueprint', badge: 'class', pages: '1–2', ws: 'Part 1',
    concept: R`
:::hook Hook (worksheet)
Your music-streaming company says: "Users are leaving! Build an AI to fix this!" If you open a laptop and start coding a linear regression right now, why are you almost guaranteed to fail?
:::

Because nobody has said **what number to predict, how success is measured, whether ML is even needed, or what is allowed**. An algorithm cannot guess the business need. Phase 1 turns a messy human problem into an explicit mathematical framework in five steps:

| Step | What you do | Example |
|---|---|---|
| 1. **Understand the problem** | Isolate the exact friction point | Users cancelling premium subscriptions = **churn** |
| 2. **Set quantifiable goals** | Define a measurable target | "Reduce churn by 10% over two quarters" |
| 3. **Assess ML feasibility** | Do we need ML? Do we have data? | Can a SQL query solve it? If yes, **skip ML** |
| 4. **Identify constraints** | Budget, latency, privacy laws (GDPR) | Predictions in < 10 ms on a phone? |
| 5. **Stakeholder alignment** | PMs, devs, execs agree on success | Shared definition of "success" |

**Blueprint in action.** *Vague:* "We want to improve our online retail store." *Rigorous:* "Using historical clickstreams and purchase data, predict which users will stop shopping within 3 months."

A rigorous statement names (i) the **data** used, (ii) the **target** being predicted, (iii) the **time window**, and ideally (iv) a **numeric success threshold**.

:::key Key insight
A poorly defined problem wastes more time than a bad algorithm. You cannot optimise "make it better": the algorithm needs a number to minimise.
:::

**PRACTICE P1 (answered).**
- (a) "Our hospital needs better patient care." → "Using patient vitals, lab results and admission records from the past 5 years, **predict which ICU patients are at risk of readmission within 30 days**, targeting a **15% reduction** in preventable readmissions."
- (b) "Make our email system smarter." → "Using email metadata (sender, subject, timestamps) and user-labelled spam/non-spam data, **classify incoming emails as spam or not-spam with ≥ 98% precision and ≥ 95% recall**."

:::reflect Reflect 1 — excellent data, but you are not permitted to train on it. Which step?
**Step 4: Identify constraints.** The data exists, but legal or regulatory constraints (GDPR, internal data-governance policy) forbid its use. This must be found *before* any effort goes into modelling.
:::

:::take Takeaway
Never touch code until you have a quantified target, confirmed data access and stakeholder agreement.
:::`,
    formulas: [
      { name: 'Rigorous problem statement (template)', tex: R`\text{Using }\underbrace{\text{data}}_{\text{inputs}}\text{, predict }\underbrace{\text{target}}_{y}\text{ within }\underbrace{\text{window}}_{\text{time}}\text{, achieving }\underbrace{\text{metric} \ge k}_{\text{goal}}`, sym: 'Data source, target, time window, measurable threshold.', when: 'Rewriting a vague request (PRACTICE P1-type MCQs).' }
    ],
    examples: [
      { title: 'Spot the failing step (worked)', body: R`| Situation | Step that is broken |
|---|---|
| "Make the app better" with no number | 2 — no quantifiable goal |
| The problem is "list users with no login in 90 days" | 3 — a SQL query solves it, ML not needed |
| Model must run on a phone in < 10 ms but the team built a 2 GB model | 4 — constraint (latency) ignored |
| Data science celebrates 90% accuracy, but the CEO wanted revenue up | 5 — no shared definition of success |
| Team predicts "user satisfaction" when the real pain is cancelled subscriptions | 1 — wrong friction point |` }
    ],
    traps: [
      'Step 3 can conclude **"do not use ML"**. That is a valid, correct outcome of the blueprint.',
      'GDPR / privacy / "not permitted to use the data" is a **constraint** (Step 4), not a data-collection problem.',
      'A rigorous statement must contain a **measurable** target ("reduce churn by 10%"), not an adjective ("better", "smarter").'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A company has excellent customer data but is **not legally permitted** to use it for training. At which step of the blueprint is this found?', options: ['Understand the problem', 'Set quantifiable goals', 'Assess ML feasibility', 'Identify constraints'], answer: 3,
        sol: 'Reflect 1: legal/regulatory limits (GDPR, data governance) are **constraints**, Step 4.', why: ['This step isolates the friction point.', 'This step sets the target number.', 'Feasibility asks whether ML is needed and whether data exists; here the data exists.', 'Correct.'] },
      { type: 'mcq', diff: 'E', q: 'Which is the most **rigorous** ML problem statement?', options: ['Improve our online retail store', 'Use AI to understand customers better', 'Using clickstreams and purchase data, predict which users will stop shopping within 3 months', 'Build the most accurate deep-learning model possible'], answer: 2,
        sol: 'It names the data, the target (stop shopping), and the time window (3 months). This is the worksheet\'s "blueprint in action" example.', why: ['Vague: no target or number.', 'Vague.', 'Correct.', 'No business target; the algorithm is chosen before the problem is defined.'] },
      { type: 'mcq', diff: 'M', q: 'The task is "list all users who have not logged in for 90 days". According to Step 3, you should:', options: ['Train a classifier on login history', 'Skip ML and write a database query', 'Collect more data first', 'Use reinforcement learning'], answer: 1,
        sol: '"Can a SQL query solve it? If yes, skip ML." This is a deterministic rule, so no learning is needed.', why: ['Unnecessary: the rule is exact.', 'Correct.', 'The data already answers the question.', 'No agent or reward.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** items that belong to **Step 4 — Identify constraints**.', options: ['Budget', 'Prediction latency (e.g. < 10 ms on a phone)', 'Privacy laws such as GDPR', 'Agreement among PMs and executives on success'], answer: [0, 1, 2],
        sol: 'The worksheet lists budget, latency and privacy laws as constraints. Agreement on success is Step 5 (stakeholder alignment).', why: ['Correct.', 'Correct.', 'Correct.', 'That is Step 5.'] },
      { type: 'mcq', diff: 'M', q: 'Why does the worksheet say a poorly defined problem is worse than a bad algorithm?', options: ['Algorithms are cheap to change', 'An optimiser needs a concrete number to minimise; "make it better" cannot be optimised', 'Business people do not understand ML', 'Bad algorithms are always detected in testing'], answer: 1,
        sol: 'Key insight: you cannot optimise "make it better". Without a measurable target, any model, however good, may solve the wrong problem.', why: ['Not the argument.', 'Correct.', 'Not the argument.', 'Not true, and not the argument.'] },
      { type: 'mcq', diff: 'E', q: '"Reduce churn by 10% over two quarters" is an example of which step?', options: ['Understand the problem', 'Set quantifiable goals', 'Assess feasibility', 'Stakeholder alignment'], answer: 1,
        sol: 'It is a measurable target with a number and a time frame → Step 2.', why: ['Step 1 would be "users cancel premium subscriptions".', 'Correct.', 'Feasibility asks whether ML/data are needed or available.', 'Alignment is agreement among people.'] }
    ],
    source: 'Worksheet L1 pp.1–2; Géron, *Hands-On ML* ch.2 ("Frame the problem").'
  },
  /* ---------------------------------------------------------------- L01.2 */
  {
    id: 'L01.2', title: 'Data collection: sources, structures and feature types', badge: 'class', pages: '2–4', ws: 'Part 2',
    concept: R`
:::hook Hook
Can you build an ML model without any data? An algorithm has no concept of reality; it only knows the world you show it in the training data. Flawed collection = broken model.
:::

**Five production data sources**

| Source | Example |
|---|---|
| Internal warehouses (SQL databases) | customer purchase history, transaction logs |
| Public repositories | Kaggle, UCI ML Repository |
| APIs | live stock prices, weather feeds |
| Web scraping | product prices from competitor sites |
| Manual labelling | radiologists labelling tumours on X-rays |

**Data structures**

| Type | Structure | Example |
|---|---|---|
| **Structured** | rigid rows and columns (SQL) | Order ID, Timestamp, Amount, User ID |
| **Unstructured** | no grid format | images, audio, video, free-text reviews |
| **Semi-structured** | tags/keys but no strict schema | **JSON, XML**, IoT sensor logs |
| **Time-series** | indexed over time intervals | daily stock prices, hourly weather |

**Feature types**

| Type | Nature | Example |
|---|---|---|
| Categorical **nominal** | labels, **no order** | colour, city, blood type (A/B/AB/O) |
| Categorical **ordinal** | labels **with rank** | education: HS < Bachelor < Master < PhD |
| Numerical **discrete** | countable integers | number of rooms, items in cart |
| Numerical **continuous** | infinitely divisible | income, temperature, weight |

:::key Key insight
An algorithm only knows the world you show it. **Garbage In = Garbage Out.**
:::

**PRACTICE P2 (answered)**

| Feature | Structure | Feature type |
|---|---|---|
| (a) delivery ratings 1–5 stars | Structured | Categorical (ordinal) |
| (b) body temperature every hour for 7 days | Time-series | Numerical (continuous) |
| (c) seller's free-text product description | Unstructured | N/A (text) |
| (d) PIN / postal code | Structured | Categorical (**nominal**) — a number used as a *code* |
| (e) wind speed every 10 min for a year | Time-series | Numerical (continuous) |

:::reflect Reflect 2 — 100k scraped reviews, 40% bot spam. Is more data always better?
No. More data is not better if it contains noise, bias or irrelevant samples. 40% bot spam would degrade the model. **Quality (clean, representative, relevant) beats raw volume**; filter the spam before training.
:::

:::take Takeaway
Know your sources, the structure and the feature types before you write a single line of code.
:::`,
    formulas: [
      { name: 'Garbage In, Garbage Out', tex: R`\text{quality}(\text{model}) \le \text{quality}(\text{training data})`, sym: 'Informal: a model cannot be better than the data it learns from.', when: 'MCQs on "is more data always better?"' }
    ],
    examples: [
      { title: 'Trick features (worked)', body: R`| Feature | Looks like | Actually | Why |
|---|---|---|---|
| PIN code 110001 | number | **categorical nominal** | arithmetic on PIN codes is meaningless (no "average PIN") |
| Star rating 1–5 | number | **categorical ordinal** (worksheet) | ordered labels; the gap between 1★ and 2★ is not guaranteed equal |
| Number of children | number | **numerical discrete** | countable |
| Body temperature 37.2 °C | number | **numerical continuous** | infinitely divisible |
| Blood group | text | **categorical nominal** | no order among A, B, AB, O |
| T-shirt size S/M/L/XL | text | **categorical ordinal** | natural rank |` }
    ],
    traps: [
      '**JSON / XML** = semi-structured (keys/tags, no fixed schema). A SQL table = structured. Course quizzes ask this directly.',
      'A **number used as an identifier** (PIN, roll number, phone) is categorical nominal, not numerical.',
      'Time-series is defined by the **time index**, not by the values being numbers.',
      '"More data is always better" is false when the extra data is noisy or biased (Reflect 2).'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Which is an example of **semi-structured** data?', options: ['A relational SQL table', 'Raw camera images', 'A key–value object in JSON format', 'A free-text review'], answer: 2,
        sol: 'JSON/XML carry tags or keys but no strict schema → semi-structured.', why: ['Structured.', 'Unstructured.', 'Correct.', 'Unstructured.'] },
      { type: 'mcq', diff: 'M', q: 'A government database stores each citizen\'s **PIN (postal) code**. The feature type is:', options: ['Numerical continuous', 'Numerical discrete', 'Categorical nominal', 'Categorical ordinal'], answer: 2,
        sol: 'PRACTICE P2(d): PIN codes are identifiers. They have no meaningful order or arithmetic → categorical nominal.', why: ['Not measured on a continuum.', 'They are integers, but counting/arithmetic is meaningless.', 'Correct.', 'There is no rank among PIN codes.'] },
      { type: 'mcq', diff: 'E', q: 'A weather station logs wind speed every 10 minutes for a year. Structure and feature type?', options: ['Structured, categorical', 'Time-series, numerical continuous', 'Unstructured, numerical discrete', 'Semi-structured, categorical ordinal'], answer: 1,
        sol: 'Indexed by time → time-series; wind speed is infinitely divisible → numerical continuous (P2(e)).', why: ['Wind speed is not a category.', 'Correct.', 'It has a regular structure, and the values are continuous.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** ordinal categorical features.', options: ['Education: HS < Bachelor < Master < PhD', 'Blood type A/B/AB/O', 'Customer rating 1–5 stars', 'City name'], answer: [0, 2],
        sol: 'Ordinal = labels with a natural rank. Education and star ratings are ranked; blood type and city are not.', why: ['Correct.', 'Nominal: no order.', 'Correct (worksheet P2(a)).', 'Nominal.'] },
      { type: 'mcq', diff: 'M', q: 'Your scraper collects 100,000 reviews, 40% of which are bot spam. What is the best action?', options: ['Keep all of it; more data is always better', 'Filter out the spam before training', 'Double the scraping to dilute the spam', 'Switch to deep learning, which ignores noise'], answer: 1,
        sol: 'Reflect 2: quality beats quantity. Remove noisy, unrepresentative samples first.', why: ['False: noise degrades the model.', 'Correct.', 'More spam at the same rate keeps 40% noise.', 'No model is immune to garbage labels/data.'] },
      { type: 'mcq', diff: 'E', q: 'Radiologists annotating tumours on X-rays is which data source?', options: ['Internal warehouse', 'API', 'Web scraping', 'Manual labelling'], answer: 3,
        sol: 'Experts creating labels by hand = manual labelling (worksheet table).', why: ['Not a database export.', 'Not a live feed.', 'Not from websites.', 'Correct.'] },
      { type: 'int', diff: 'E', q: 'A scraped set has 100,000 reviews and 40% are bot spam. How many **clean** reviews remain after filtering?', answer: 60000, tol: 0, round: 'Exact integer', verify: '100000*(1-0.40)',
        sol: 'Clean = 100,000 × (1 − 0.40) = **60,000**. A smaller clean set usually beats the larger noisy one.' }
    ],
    source: 'Worksheet L1 pp.2–4; Géron ch.2 ("Get the data").'
  },
  /* ---------------------------------------------------------------- L01.3 */
  {
    id: 'L01.3', title: 'Exploratory Data Analysis (EDA)', badge: 'class', pages: '4–5', ws: 'Part 3',
    concept: R`
:::hook Hook
You are handed 500,000 customer records. What is the very first thing you do? If you said "train a model", stop. A doctor does not prescribe treatment before examining the patient.
:::

**EDA is the diagnostic stage.** It turns raw data into actionable insight *before* any preprocessing.

**EDA checklist (7 goals)**

| Goal | What you check |
|---|---|
| 1. Dataset structure | rows, columns, data types, feature names |
| 2. Missing values | which columns, how many, random or systematic? |
| 3. Outliers | extreme values: data error? fraud? rare case? |
| 4. Duplicates | repeated rows from collection/merging errors |
| 5. Distributions | normal (bell) vs skewed (left/right) |
| 6. Relationships | correlation, dependency, redundant features |
| 7. Class imbalance | 95% non-fraud vs 5% fraud → **accuracy lies** |

**Analysis levels**
- **Univariate** (one variable): distribution, mean, median, IQR, outliers → histogram, box plot.
- **Bivariate** (two variables): correlation, trends → scatter plot, correlation heatmap.
- **Multivariate** (many variables): interaction effects → heatmap, pair plot.

**Which chart?**

| Chart | Use for |
|---|---|
| Histogram | distributions, skewness |
| Box plot | outliers, spread ($Q_1$, $Q_3$, IQR) |
| Bar chart | categorical comparisons |
| Scatter plot | relationship between two numerical variables |
| Correlation heatmap | feature correlations (+1, 0, −1) |

**Correlation:** *positive* (both rise: experience ↔ salary), *negative* (one up, other down: price ↔ demand), *none* (no clear relationship).

**Box-plot anatomy.** The box spans $Q_1$ to $Q_3$ (the middle 50%), the line inside is the median, and $\text{IQR}=Q_3-Q_1$. The usual outlier rule (Tukey) flags points below $Q_1-1.5\,\text{IQR}$ or above $Q_3+1.5\,\text{IQR}$.

**PRACTICE P3 (answered).** Dataset: 100,000 rows; Customer_ID, Age, Gender, Annual_Income, Spending_Score, City.
1. Check shape, data types and summary statistics: \`df.info()\`, \`df.describe()\`.
2. Check missing values and duplicates: \`df.isnull().sum()\`, \`df.duplicated().sum()\`.
3. Visualise distributions and outliers: histograms for Age/Income, box plot for Spending_Score.

Age distribution → **histogram**. Income vs Spending_Score → **scatter plot**. Does Gender affect Spending_Score? → **bar chart / box plot** (one box per gender).

:::reflect Reflect 3 — 95% class A, 5% class B; a model always predicts A and scores 95% accuracy. Useful?
No. Its **recall for class B is 0%**: it never detects the minority class. Accuracy is misleading under imbalance; use precision, recall, F1 or AUC-ROC (Lecture 7).
:::

:::key Key insight
Skip EDA and you risk training on missing values, outliers, duplicates and imbalanced classes, all of which silently destroy performance. EDA is not optional.
:::
:::take Takeaway
EDA first, algorithm later: understand structure → find issues → visualise patterns → then preprocess.
:::`,
    formulas: [
      { name: 'Interquartile range', tex: R`\text{IQR} = Q_3 - Q_1`, sym: '$Q_1$ = 25th percentile, $Q_3$ = 75th percentile (spread of the middle 50%).', when: 'Box plots, robust scaling, outlier detection.' },
      { name: 'Tukey outlier fences', tex: R`x < Q_1 - 1.5\,\text{IQR}\ \ \text{or}\ \ x > Q_3 + 1.5\,\text{IQR}`, sym: 'Whisker limits of a standard box plot.', when: 'Deciding which points a box plot draws as outliers.' },
      { name: 'Majority-class accuracy', tex: R`\text{Acc}_{\text{always majority}} = \frac{n_{\text{majority}}}{n}`, sym: 'Accuracy of a model that always predicts the biggest class.', when: 'Imbalance questions: 95/5 split → 95% with 0% minority recall.' }
    ],
    plots: [
      { id: 'P01-hist', title: 'Histogram: right-skewed annual income', notice: 'A long right tail: the **mean is pulled above the median** by a few very high incomes. A histogram reveals skew that summary numbers hide.',
        spec: (function () {
          const r = NUM.rng(11), v = []; for (let i = 0; i < 400; i++) v.push(Math.exp(3.4 + 0.55 * NUM.gauss(r)));
          const edges = NUM.linspace(0, 150, 16), xs = [], ys = [];
          for (let i = 0; i < 15; i++) { xs.push((edges[i] + edges[i + 1]) / 2); ys.push(v.filter(x => x >= edges[i] && x < edges[i + 1]).length); }
          const s = v.slice().sort((a, b) => a - b), med = s[200], mean = NUM.mean(v);
          return { type: 'xy', w: 560, h: 300, xlim: [0, 150], ylim: [0, 110], xlabel: 'annual income (₹ lakh)', ylabel: 'count', legend: 'tr',
            series: [{ t: 'bars', xs, ys, c: 's1', bw: 9.4 }, { t: 'vline', x: med, c: 's3', w: 2.5, label: 'median ' + med.toFixed(1) }, { t: 'vline', x: mean, c: 's4', w: 2.5, dash: true, label: 'mean ' + mean.toFixed(1) }] };
        })() },
      { id: 'P01-box', title: 'Box plot: reading Q1, median, Q3, IQR and outliers', notice: 'Data [2, 4, 6, 8, 10, 12, 14, 16, 40]. Q1 = 5, median = 10, Q3 = 15 (medians of the halves), IQR = 10, upper fence = 15 + 15 = 30, so **40 is an outlier**.',
        spec: { type: 'xy', w: 560, h: 220, xlim: [0, 44], ylim: [0, 2], yticks: false, xlabel: 'value', grid: false, zero: false,
          series: [
            { t: 'poly', pts: [[5, 0.65], [15, 0.65], [15, 1.35], [5, 1.35]], c: 's1', fop: 0.2 },
            { t: 'seg', segs: [[10, 0.65, 10, 1.35]], c: 's4', w: 3 },
            { t: 'seg', segs: [[2, 1, 5, 1], [15, 1, 16, 1], [2, 0.8, 2, 1.2], [16, 0.8, 16, 1.2]], c: 'fg', w: 1.5 },
            { t: 'vline', x: 30, c: 's4', dash: true, w: 1.2 },
            { t: 'scatter', pts: [[2, 1], [4, 1], [6, 1], [8, 1], [10, 1], [12, 1], [14, 1], [16, 1]], c: 's7', r: 3 },
            { t: 'scatter', pts: [[40, 1]], c: 's4', m: 'x', r: 6 },
            { t: 'text', x: 5, y: 1.6, s: 'Q1 = 5' }, { t: 'text', x: 10, y: 1.75, s: 'median 10' }, { t: 'text', x: 15, y: 1.6, s: 'Q3 = 15' },
            { t: 'text', x: 30, y: 1.6, s: 'fence 30' }, { t: 'text', x: 40, y: 1.4, s: 'outlier 40' }, { t: 'text', x: 10, y: 0.4, s: 'IQR = 10' }] } },
      { id: 'P01-corr', title: 'Correlation: positive, negative, none', notice: 'Scatter plots show the **direction** of a relationship. The correlation number r summarises it between −1 and +1.',
        spec: (function () {
          const r = NUM.rng(5), a = [], b = [], c = [];
          for (let i = 0; i < 30; i++) { const x = r() * 10; a.push([x, 20 + 3 * x + NUM.gauss(r) * 3]); b.push([x, 60 - 4 * x + NUM.gauss(r) * 3]); c.push([x, 10 + r() * 40]); }
          return { type: 'multi', panels: [
            { type: 'xy', w: 270, h: 220, title: 'Positive (experience ↔ salary)', xlim: [0, 10], ylim: [0, 60], xlabel: 'experience', ylabel: 'salary', series: [{ t: 'scatter', pts: a, c: 's3', r: 3.5 }] },
            { type: 'xy', w: 270, h: 220, title: 'Negative (price ↔ demand)', xlim: [0, 10], ylim: [0, 70], xlabel: 'price', ylabel: 'demand', series: [{ t: 'scatter', pts: b, c: 's4', r: 3.5 }] },
            { type: 'xy', w: 270, h: 220, title: 'None', xlim: [0, 10], ylim: [0, 60], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: c, c: 's7', r: 3.5 }] }] };
        })() }
    ],
    examples: [
      { title: 'Five-number summary and outlier fences by hand (worked)', body: R`Data: [2, 4, 6, 8, 10, 12, 14, 16, 40] (n = 9, already sorted).
1. Median = 5th value = **10**.
2. Lower half (exclude the median for odd n) = [2, 4, 6, 8] → $Q_1$ = (4 + 6)/2 = **5**.
3. Upper half = [12, 14, 16, 40] → $Q_3$ = (14 + 16)/2 = **15**.
4. IQR = 15 − 5 = **10**.
5. Fences: 5 − 1.5(10) = **−10**, 15 + 1.5(10) = **30**. Only 40 > 30, so **40 is an outlier**.

The mean = 112/9 ≈ 12.44 is above the median (10), which is a sign of right skew caused by the outlier.` },
      { title: 'Imbalance: why accuracy lies (worked)', body: R`10,000 transactions: 9,500 legitimate, 500 fraud. "Always predict legitimate":
- Accuracy = 9,500 / 10,000 = **95%**.
- Fraud caught = 0 of 500 → **recall(fraud) = 0%**.

The model is useless for the one thing the business cares about. EDA goal 7 (class imbalance) catches this before training.` }
    ],
    code: [{ title: 'EDA checklist + missing values + duplicates (pandas)', lib: 'L01_eda_cleaning_pandas.py', libLabel: 'pandas' }],
    traps: [
      'Histogram = one **numerical** variable\'s distribution. Bar chart = **categorical** comparison. Do not swap them.',
      'Box plot shows the **median**, not the mean.',
      'High accuracy on imbalanced data can hide 0% recall on the minority class.',
      'EDA comes **before** preprocessing and modelling.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Best chart to check the relationship between **Annual_Income and Spending_Score** (both numerical)?', options: ['Histogram', 'Bar chart', 'Scatter plot', 'Pie chart'], answer: 2,
        sol: 'Two numerical variables → scatter plot (PRACTICE P3).', why: ['One variable only.', 'For categories.', 'Correct.', 'Not in the worksheet list; for proportions.'] },
      { type: 'mcq', diff: 'E', q: 'Which chart is designed to show **outliers and spread (Q1, Q3, IQR)**?', options: ['Box plot', 'Scatter plot', 'Line chart', 'Correlation heatmap'], answer: 0,
        sol: 'The box spans Q1–Q3, and points beyond the whiskers are outliers.', why: ['Correct.', 'Two-variable relationship.', 'Trend over time.', 'Pairwise correlations.'] },
      { type: 'int', diff: 'M', q: 'Data: [2, 4, 6, 8, 10, 12, 14, 16]. Using the "median of each half" method, what is the **IQR**?', answer: 8, tol: 0, round: 'Exact', verify: '(14+12)/2 - (4+6)/2',
        sol: 'n = 8, so the halves are [2, 4, 6, 8] and [10, 12, 14, 16]. $Q_1$ = (4 + 6)/2 = 5, $Q_3$ = (12 + 14)/2 = 13. IQR = 13 − 5 = **8**.' },
      { type: 'int', diff: 'M', q: 'For the data above (Q1 = 5, Q3 = 13), what is the **upper Tukey fence** $Q_3 + 1.5\,\text{IQR}$?', answer: 25, tol: 0, round: 'Exact', verify: '13 + 1.5*8',
        sol: '13 + 1.5 × 8 = 13 + 12 = **25**. Any value above 25 would be drawn as an outlier.' },
      { type: 'mcq', diff: 'M', q: 'A dataset is 95% class A and 5% class B. A model always predicts A. Which statement is true?', options: ['It is excellent: 95% accuracy', 'Its recall for class B is 0%, so it is useless for B', 'Its precision for class B is 100%', 'Accuracy is the right metric here'], answer: 1,
        sol: 'Reflect 3: it never predicts B, so it detects 0% of B cases. Accuracy is misleading under imbalance.', why: ['Accuracy hides the failure.', 'Correct.', 'It makes no B predictions, so B-precision is undefined (0/0), not 100%.', 'Use recall/precision/F1/AUC instead.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import pandas as pd, numpy as np
df = pd.DataFrame({"a": [1, np.nan, 3, 3], "b": ["x", "y", None, "y"]})
print(df.isnull().sum().tolist())
print(df.duplicated().sum())`, answer: '[1, 1]\n0',
        sol: R`Column a has one NaN and column b has one None, so the missing counts are [1, 1]. Rows 2 and 3 are (3, None) and (3, "y"), which differ, so there are **0** duplicate rows.` },
      { type: 'msq', diff: 'M', q: 'Which are **bivariate** analyses? (select all)', options: ['Histogram of Age', 'Scatter plot of Income vs Spending_Score', 'Correlation between Experience and Salary', 'Box plot of one column'], answer: [1, 2],
        sol: 'Bivariate = two variables at a time: scatter plots and pairwise correlation. Histograms and a single box plot are univariate.', why: ['Univariate.', 'Correct.', 'Correct.', 'Univariate.'] }
    ],
    source: 'Worksheet L1 pp.4–5; Tukey, *Exploratory Data Analysis* (1977) for the 1.5·IQR rule; pandas docs.'
  },
  /* ---------------------------------------------------------------- L01.4 */
  {
    id: 'L01.4', title: 'Preprocessing: missing values and inconsistent data', badge: 'class', pages: '5–6', ws: 'Part 4, Steps 1–2',
    concept: R`
:::hook Hook
In textbooks data is always clean. In the real world it is messy, biased and incomplete. Can a sophisticated algorithm self-correct and ignore the garbage? **No. Garbage In, Garbage Out.**
:::

Algorithms see data as **matrices of numbers**. A missing value breaks the equation; a feature in the millions overwhelms one in single digits. Preprocessing builds a **clean numerical matrix**.

**Step 1 — Handling missing values**

| Strategy | Action | When to use | Danger |
|---|---|---|---|
| **Deletion** | drop rows or columns | < 1–2% of rows missing; or a column > 80% empty | discards information, can introduce bias |
| **Imputation** | fill with **mean/median** (numerical) or **mode** (categorical) | moderate missingness | may introduce artificial patterns |

*Mean vs median:* the mean is pulled by outliers; for skewed columns (income) the **median** is the safer fill value.

**Step 2 — Handling inconsistent data**

| Type | Issue | Fix |
|---|---|---|
| Mixed units | weight in both kg and lbs | standardise to a single unit |
| Typos | 'Californa', 'California', 'CA' | regex / Levenshtein-distance matching |
| Duplicates | same record logged twice | remove duplicate records |
| Inconsistent labels | Yes, Y, True, 1 all mean "yes" | map all to a single label format |

**Levenshtein distance** = the minimum number of single-character insertions, deletions or substitutions to turn one string into another. "Californa" → "California" needs 1 insertion, so the distance is 1: almost certainly a typo.

:::warn Leakage preview (Lecture 2)
Compute imputation statistics (mean, median, mode) on the **training set only**, then apply them to validation/test.
:::`,
    formulas: [
      { name: 'Mean imputation', tex: R`x_{\text{missing}} \leftarrow \bar x = \frac{1}{n_{\text{obs}}}\sum_{i\,\in\,\text{observed}} x_i`, sym: 'Average of the **observed** values only (NaNs are skipped).', when: 'Numerical column, roughly symmetric, moderate missingness.' },
      { name: 'Median imputation', tex: R`x_{\text{missing}} \leftarrow \operatorname{median}(x_{\text{observed}})`, sym: 'Middle observed value.', when: 'Numerical column with skew or outliers.' },
      { name: 'Mode imputation', tex: R`x_{\text{missing}} \leftarrow \arg\max_{c}\ \text{count}(c)`, sym: 'Most frequent category.', when: 'Categorical column.' }
    ],
    examples: [
      { title: 'Impute and de-duplicate by hand (worked, matches the code below)', body: R`| Name | Age | Salary | Dept |
|---|---|---|---|
| Asha | 25 | 50000 | IT |
| Ravi | NaN | 62000 | HR |
| Meena | 31 | NaN | IT |
| Ravi | NaN | 62000 | HR |
| John | 45 | 90000 | None |
| Zara | 28 | 58000 | IT |

- Missing: Age 2, Salary 1, Dept 1 → 4 cells.
- Age mean (observed only) = (25 + 31 + 45 + 28)/4 = 129/4 = **32.25**.
- Salary mean = (50000 + 62000 + 62000 + 90000 + 58000)/5 = **64,400**.
- Dept mode = **IT** (3 times).
- Rows 2 and 4 (Ravi) are identical → 1 duplicate; after removal the shape is (5, 4).` }
    ],
    code: [{ title: 'Impute + de-duplicate (pandas)', lib: 'L01_eda_cleaning_pandas.py', libLabel: 'pandas' }],
    traps: [
      'The mean of a column with NaNs is computed over the **observed** values only (pandas skips NaN by default).',
      'Use the **mode** for categorical columns; a mean of "IT" and "HR" is meaningless.',
      'Dropping a column that is > 80% empty is fine; dropping 30% of the rows usually is not.',
      'Duplicates found after imputation may differ from duplicates before it (imputation can make rows identical).'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'Age column: [25, NaN, 31, NaN, 45, 28]. What value does **mean imputation** fill in? (2 decimals)', answer: 32.25, tol: 0.005, round: '2 decimals', verify: '(25+31+45+28)/4',
        sol: 'Only the 4 observed values count: (25 + 31 + 45 + 28)/4 = 129/4 = **32.25**.' },
      { type: 'int', diff: 'M', q: 'Income (₹ k): [30, 32, 35, 38, 40, NaN, 900]. Using **median imputation**, what is filled in?', answer: 36.5, tol: 0.001, round: '1 decimal', verify: '(35+38)/2',
        sol: 'Observed sorted: [30, 32, 35, 38, 40, 900] (6 values). Median = (35 + 38)/2 = **36.5**. The mean would be 1075/6 ≈ 179.2, badly pulled by the 900 outlier.' },
      { type: 'mcq', diff: 'E', q: 'A categorical column "City" has a few missing values. The standard imputation is:', options: ['Mean', 'Median', 'Mode', 'Zero'], answer: 2,
        sol: 'Categorical → mode (most frequent category).', why: ['Undefined for text.', 'Undefined for nominal text.', 'Correct.', 'Creates a fake category.'] },
      { type: 'mcq', diff: 'M', q: 'A column is **85% empty**. According to the worksheet table, the usual choice is:', options: ['Impute with the mean', 'Drop the column', 'Drop all rows with missing values', 'Impute with the mode'], answer: 1,
        sol: 'Deletion is recommended when < 1–2% of rows are missing, or when a column is more than 80% empty.', why: ['Imputing 85% of a column invents most of it.', 'Correct.', 'Would destroy 85% of the rows.', 'Same problem as mean imputation.'] },
      { type: 'mcq', diff: 'E', q: '"Californa", "California" and "CA" in the same column are best fixed by:', options: ['One-hot encoding', 'Regex / Levenshtein-distance matching to one label', 'Min-Max scaling', 'Dropping the column'], answer: 1,
        sol: 'Typos and variant spellings → string matching (regex, Levenshtein) to map to one canonical label.', why: ['Would create three separate columns for one state.', 'Correct.', 'Text cannot be scaled.', 'Loses useful information.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import pandas as pd
s = pd.Series(["Yes", "Y", "True", "1", "No"])
m = {"Yes": 1, "Y": 1, "True": 1, "1": 1, "No": 0}
print(s.map(m).tolist(), s.map(m).sum())`, answer: '[1, 1, 1, 1, 0] 4',
        sol: 'Inconsistent labels are mapped to one format (Step 2). Four "yes" variants become 1, so the sum is 4.' }
    ],
    source: 'Worksheet L1 pp.5–6; scikit-learn `SimpleImputer` docs; Levenshtein (1966).'
  },
  /* ---------------------------------------------------------------- L01.5 */
  {
    id: 'L01.5', title: 'Feature scaling: Min-Max, Z-score, Max-Abs, Robust', badge: 'class', pages: '6–7', ws: 'Part 4, Step 3',
    concept: R`
When one feature ranges over 1–5 (bedrooms) and another over ₹20,000–₹500,000 (income), **distance-based algorithms (KNN, SVM) and gradient descent are dominated by the larger feature**. Scaling puts features on comparable ranges.

| Technique | Formula | Use when | Risk |
|---|---|---|---|
| **A. Min-Max** (normalisation) → [0, 1] | $\dfrac{X-X_{\min}}{X_{\max}-X_{\min}}$ | not Gaussian; neural nets; bounded ranges | **one outlier squashes everything near 0** |
| **B. Z-score** (standardisation) → mean 0, std 1 | $\dfrac{X-\mu}{\sigma}$ | data roughly normal | works best when features are ≈ Gaussian |
| **C. Max-Abs** → [−1, 1] | $\dfrac{X}{\max\lvert X\rvert}$ | sparse data (many zeros, bag-of-words) | preserves zeros and sign |
| **D. Robust** | $\dfrac{X-\text{median}}{Q_3-Q_1}$ | heavy outliers you cannot drop | ignores mean/std; uses median + middle 50% |

:::key Key insight
Min-Max is sensitive to outliers. Z-score assumes normality. **Robust scaling is the safety net when outliers are unavoidable.**
:::

**PRACTICE P4 (by hand).**
- **A. Min-Max**, X = [10, 20, 30, 40, 50]: 10 → 0/40 = **0.0**; 30 → 20/40 = **0.5**; 50 → 40/40 = **1.0**.
- **B. Z-score**, X = [2, 4, 6, 8, 10]: μ = 6, σ = √8 = 2√2 ≈ 2.83 (**population** std, divide by n). z(2) = −4/2.83 ≈ **−1.41**; z(6) = **0**; z(10) ≈ **1.41**.
- **C. Robust**, X = [100, 150, 200, 250, 50000]: median = 200; $Q_1$ = median of [100, 150] = 125; $Q_3$ = median of [250, 50000] = 25125; IQR = 25000. Scaled 100 → (100 − 200)/25000 = **−0.004**; 50000 → 49800/25000 = **1.992**.

**PRACTICE P5.** (a) Salaries ₹20k–₹5M with CEO outliers at ₹50M → **Robust** (median/IQR resist outliers). (b) Pixel values 0–255, no outliers → **Min-Max** (bounded range, maps to [0, 1]).

:::reflect Reflect 4 — why does Min-Max fail when one value is 50,000 and the rest are under 300?
The denominator $X_{\max}-X_{\min}$ becomes huge (≈ 49,700). All normal values are squashed into a tiny range near 0, and only the outlier maps to 1. The majority loses its meaningful variation.
:::

:::warn Exam trap — two ways to compute quartiles
The worksheet takes $Q_1$, $Q_3$ as **medians of the lower/upper halves** (gives 125 and 25125 above). scikit-learn's \`RobustScaler\` uses **linearly interpolated percentiles** (\`np.percentile\`): $Q_1$ = 150, $Q_3$ = 250, IQR = 100, so 50000 → 498 and 100 → −1. With the library, the four normal values keep a clear spread (−1, −0.5, 0, 0.5). Use the worksheet method for hand questions unless told otherwise.
:::

:::warn Fit on train only
\`scaler.fit(X_train)\` then \`scaler.transform(X_test)\`. A test value outside the training range can scale above 1 (or below 0) under Min-Max. That is fine and expected.
:::

:::take Takeaway
Min-Max for bounded/clean data, Z-score for Gaussian, Robust for outliers, Max-Abs for sparse.
:::`,
    formulas: [
      { name: 'Min-Max', tex: R`X' = \frac{X - X_{\min}}{X_{\max} - X_{\min}} \in [0,1]`, sym: '$X_{\min}, X_{\max}$ from the **training** data.', when: 'Bounded data without outliers (pixels, neural nets).' },
      { name: 'Z-score (standardisation)', tex: R`z = \frac{X-\mu}{\sigma},\quad \sigma=\sqrt{\tfrac1n\textstyle\sum (X_i-\mu)^2}`, sym: '$\mu$ mean, $\sigma$ **population** std (as in the worksheet and `StandardScaler`).', when: 'Roughly normal features; GD, PCA, regularisation.' },
      { name: 'Max-Abs', tex: R`X' = \frac{X}{\max_i |X_i|} \in [-1,1]`, sym: 'Keeps 0 at 0 and keeps the sign.', when: 'Sparse data (bag-of-words).' },
      { name: 'Robust', tex: R`X' = \frac{X - \operatorname{median}}{Q_3 - Q_1}`, sym: 'IQR = $Q_3-Q_1$ (middle 50%).', when: 'Heavy outliers you cannot drop.' }
    ],
    plots: [
      { id: 'P01-scalers', title: 'Same data, three scalers: 20 normal values + one outlier (2000)', notice: 'Min-Max squeezes the 20 normal values into a sliver near 0. Z-score also bunches them, because the outlier inflates σ. Robust scaling (median/IQR, library percentiles) keeps them spread over about [−1, 1]; the outlier is simply far away (off the chart at ≈ 25).',
        spec: (function () {
          const r = NUM.rng(21), v = []; for (let i = 0; i < 20; i++) v.push(Math.round(200 + 30 * NUM.gauss(r))); v.push(2000);
          const s = v.slice().sort((a, b) => a - b), n = s.length, pct = p => { const h = (n - 1) * p, lo = Math.floor(h); return s[lo] + (h - lo) * (s[Math.min(n - 1, lo + 1)] - s[lo]); };
          const mn = s[0], mx = s[n - 1], mu = NUM.mean(v), sd = Math.sqrt(NUM.mean(v.map(x => (x - mu) ** 2))), med = pct(0.5), iqr = pct(0.75) - pct(0.25);
          const row = (f, y) => v.map(x => [f(x), y]);
          const mm = row(x => (x - mn) / (mx - mn), 3), zz = row(x => (x - mu) / sd, 2), rb = row(x => (x - med) / iqr, 1);
          return { type: 'xy', w: 600, h: 260, xlim: [-2.5, 5], ylim: [0.3, 3.7], yticks: [1, 2, 3], ytl: { 1: 'Robust', 2: 'Z-score', 3: 'Min-Max' }, ml: 70, xlabel: 'scaled value',
            series: [{ t: 'scatter', pts: mm, c: 's1', r: 4, op: 0.7 }, { t: 'scatter', pts: zz, c: 's2', r: 4, op: 0.7 }, { t: 'scatter', pts: rb, c: 's3', r: 4, op: 0.7 },
              { t: 'text', x: 4.2, y: 1.35, s: 'outlier → ' + ((2000 - med) / iqr).toFixed(0) + ' →', size: 11 }] };
        })() }
    ],
    examples: [
      { title: 'All four scalers on one small dataset (worked)', body: R`X = [−4, 0, 2, 8] (n = 4).
- **Min-Max:** min −4, max 8, range 12. −4 → 0; 0 → 4/12 = 0.333; 2 → 6/12 = 0.5; 8 → 1.
- **Z-score:** μ = 6/4 = 1.5. Deviations −5.5, −1.5, 0.5, 6.5; squares 30.25, 2.25, 0.25, 42.25; sum 75; σ² = 75/4 = 18.75; σ ≈ 4.330. z(8) = 6.5/4.330 ≈ **1.501**.
- **Max-Abs:** max|X| = 8 → [−0.5, 0, 0.25, 1]. The zero stays zero.
- **Robust (halves):** median = (0 + 2)/2 = 1; lower half [−4, 0] → $Q_1$ = −2; upper half [2, 8] → $Q_3$ = 5; IQR = 7. 8 → (8 − 1)/7 = **1.0**.` }
    ],
    code: [{ title: 'The four scalers (P4 data)', scratch: 'L01_scaling_scratch.py', lib: 'L01_scaling_sklearn.py' }],
    traps: [
      'The worksheet Z-score uses the **population** std (÷ n). `np.std` and `StandardScaler` also use ÷ n; `pandas.Series.std()` uses ÷ (n − 1).',
      'Robust scaling by hand (median of halves) ≠ `RobustScaler` (interpolated percentiles). Check which one the question wants.',
      'Max-Abs keeps the **sign** and keeps zeros at zero; Min-Max moves the minimum to 0.',
      'Tree-based models do not need scaling; KNN, SVM, gradient descent, PCA and regularised models do.',
      'Fit the scaler on training data only, then transform test data with the same statistics.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'X = [5, 15, 25, 45]. Min-Max scale the value **15**.', answer: 0.25, tol: 0.001, round: '2 decimals', verify: '(15-5)/(45-5)',
        sol: '(15 − 5)/(45 − 5) = 10/40 = **0.25**.' },
      { type: 'int', diff: 'M', q: 'X = [1, 2, 3, 4, 5]. Z-score of **5** using the population standard deviation? (2 decimals)', answer: 1.41, tol: 0.01, round: '2 decimals', verify: '(5-3)/((4+1+0+1+4)/5)**0.5',
        sol: 'μ = 3. σ² = (4 + 1 + 0 + 1 + 4)/5 = 2, σ = √2 ≈ 1.414. z = (5 − 3)/1.414 ≈ **1.41**.' },
      { type: 'int', diff: 'H', q: 'X = [1, 2, 3, 4, 100]. Robust-scale **100** using the worksheet method (Q1, Q3 = medians of the lower and upper halves, median excluded). (2 decimals)', answer: 1.92, tol: 0.01, round: '2 decimals', verify: '(100-3)/((4+100)/2-(1+2)/2)',
        sol: 'Median = 3. Lower half [1, 2] → $Q_1$ = 1.5. Upper half [4, 100] → $Q_3$ = 52. IQR = 50.5. (100 − 3)/50.5 ≈ **1.92**.' },
      { type: 'int', diff: 'E', q: 'X = [−10, 5, 2]. Max-Abs scale the value **5**.', answer: 0.5, tol: 0.001, round: '1 decimal', verify: '5/10',
        sol: 'max|X| = 10, so 5/10 = **0.5**. (−10 → −1, 2 → 0.2.)' },
      { type: 'mcq', diff: 'E', q: 'Salaries range ₹20k–₹5M, with a few CEO outliers at ₹50M that you must keep. Which scaler?', options: ['Min-Max', 'Z-score', 'Robust', 'Max-Abs'], answer: 2,
        sol: 'PRACTICE P5(a): heavy outliers → Robust (median and IQR are not dragged by extremes).', why: ['The outlier sets the max and squashes everyone else.', 'μ and σ are both pulled by the outliers.', 'Correct.', 'Max is the outlier → same squashing problem.'] },
      { type: 'mcq', diff: 'M', q: 'Why does Min-Max scaling fail when one value is 50,000 and the rest are below 300?', options: ['It produces negative numbers', 'The range in the denominator becomes huge, squashing normal values near 0', 'It cannot handle integers', 'It changes the order of the values'], answer: 1,
        sol: 'Reflect 4: $X_{\\max}-X_{\\min}\\approx 49{,}700$, so every normal value maps to almost 0.', why: ['Min-Max output is in [0, 1].', 'Correct.', 'Irrelevant.', 'Scaling is monotonic; the order is kept.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.preprocessing import MinMaxScaler
sc = MinMaxScaler().fit(np.array([[1.0], [2.0], [3.0]]))
print(sc.transform(np.array([[10.0]])).ravel().tolist())`, answer: '[4.5]',
        sol: R`Fitted on train: min 1, max 3, range 2. Test value 10 → (10 − 1)/2 = **4.5**. Values outside the training range scale outside [0, 1]; this is correct behaviour, not a bug.` },
      { type: 'msq', diff: 'M', q: 'Which algorithms are **sensitive to feature scale**? (select all)', options: ['K-Nearest Neighbours', 'Gradient-descent-trained linear regression', 'Decision tree', 'SVM'], answer: [0, 1, 3],
        sol: 'The worksheet: distance-based algorithms (KNN, SVM) and gradient descent are dominated by large-range features. Trees split on thresholds per feature, so scale does not matter.', why: ['Correct.', 'Correct: an elongated loss bowl slows GD (L5).', 'Threshold splits are scale-invariant.', 'Correct.'] }
    ],
    source: 'Worksheet L1 pp.6–7; scikit-learn preprocessing user guide (MinMaxScaler, StandardScaler, MaxAbsScaler, RobustScaler).'
  },
  /* ---------------------------------------------------------------- L01.6 */
  {
    id: 'L01.6', title: 'Categorical encoding: label, ordinal, one-hot, binary', badge: 'class', pages: '7–9', ws: 'Part 4, Step 4',
    concept: R`
If we map Red = 0, Green = 1, Blue = 2, the model thinks Blue > Green > Red and that (Red + Blue)/2 = Green. **That is a mathematical lie.** Choose the encoding carefully.

| Encoding | How | Safe for | Danger |
|---|---|---|---|
| **Label** | one unique integer per category (Red = 0, Blue = 1, Green = 2) | **binary targets** (spam = 1/0); **tree-based** models (split, not distance) | implies a false order for distance-based models (KNN, SVM) |
| **Ordinal** | controlled rank mapping (Low = 0, Med = 1, High = 2) | categories with a **natural rank**; tree + linear models | wrong if the categories are actually unordered |
| **One-hot** | N binary columns (1 = present) | **unordered nominal** data with **few** unique values | curse of dimensionality with many categories |
| **Binary** | integer → binary digits split across $\lceil\log_2 N\rceil$ columns | **many** categories; space-efficient | lower-dimensional than one-hot |

**One-hot worked** (columns sorted alphabetically):

| Input | Color_Blue | Color_Green | Color_Red |
|---|---|---|---|
| Red | 0 | 0 | 1 |
| Blue | 1 | 0 | 0 |
| Green | 0 | 1 | 0 |

**Binary worked** (Blue = 1 → 01, Red = 2 → 10, Green = 3 → 11):

| Input | Bit_0 | Bit_1 |
|---|---|---|
| Red (10) | 1 | 0 |
| Green (11) | 1 | 1 |
| Blue (01) | 0 | 1 |

Here Bit_0 is the left (first written) digit of the code.

:::key Key insight
One-hot: 3 categories = 3 columns. Binary: 3 categories = 2 columns. For 1000 categories, one-hot = 1000 columns; binary ≈ 10.
:::

**PRACTICE P6.** (a) 500 city names, logistic regression → **binary** (one-hot = 500 columns; binary ≈ 9). (b) Education HS < Bachelor < Master < PhD, linear regression → **ordinal** (natural rank). (c) Colour (Red, Blue, Green), KNN → **one-hot** (nominal, few values, KNN uses distances).

**PRACTICE P7.** Cat = 1 → 01, Dog = 2 → 10, Fish = 3 → 11, **Bird = 4 → 100**. Bits needed: the key says "2 (or 3)". If you number **1–4** (as the worksheet does), 4 = 100 needs **3 bits**. If you number **0–3**, 2 bits suffice. One-hot needs **4** columns.

:::reflect Reflect 5 — why can label encoding mislead KNN but not a decision tree?
KNN computes distances, so arbitrary integers create false closeness (it thinks Blue is "closer" to Red than Green is). A tree only uses threshold splits (x ≤ 1); it never computes distances, so the magnitudes do not matter in the same way.
:::

:::take Takeaway
Ordinal for ranked categories, one-hot for nominal with few values, binary for nominal with many. Label only for tree models or binary targets.
:::`,
    formulas: [
      { name: 'Binary-encoding columns', tex: R`\text{cols} = \lceil \log_2 N \rceil\ \ (\text{ids } 0..N-1),\qquad \lfloor \log_2 N\rfloor + 1\ \ (\text{ids } 1..N)`, sym: '$N$ = number of categories.', when: '"How many columns/bits?" questions. State which numbering you use.' },
      { name: 'One-hot columns', tex: R`\text{cols} = N\quad(\text{or } N-1 \text{ with drop\_first})`, sym: 'One column per category.', when: 'Nominal data with few categories.' }
    ],
    examples: [
      { title: 'Columns needed: one-hot vs binary (worked)', body: R`| N categories | One-hot | Binary, ids 0..N−1: ⌈log₂N⌉ | Binary, ids 1..N |
|---|---|---|---|
| 3 | 3 | 2 | 2 |
| 4 | 4 | 2 | 3 (4 = 100) |
| 8 | 8 | 3 | 4 (8 = 1000) |
| 500 | 500 | 9 | 9 |
| 1000 | 1000 | 10 | 10 |

Check 500: 2⁸ = 256 < 500 ≤ 512 = 2⁹ → **9 bits**. The two numberings only disagree when N is an exact power of 2.` }
    ],
    code: [{ title: 'Label, ordinal, one-hot and binary encoding', scratch: 'L01_encoding_scratch.py', lib: 'L01_encoding_sklearn.py', libLabel: 'pandas / scikit-learn' }],
    traps: [
      '`LabelEncoder` numbers categories **alphabetically** (Blue = 0, Green = 1, Red = 2), not in order of appearance.',
      'Label encoding a nominal feature for KNN/SVM/linear models invents a false order and false distances.',
      'Ordinal encoding needs an order **you** specify (`OrdinalEncoder(categories=[[...]])`); the default is alphabetical, which would put "Bachelor" before "HS".',
      'P7 trap: Bird = 4 = 100 needs 3 bits if numbering starts at 1.',
      'One-hot with hundreds of categories → many sparse columns (curse of dimensionality, L10).'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'How many columns does **binary encoding** need for **500** city names? (use ⌈log₂ N⌉)', answer: 9, tol: 0, round: 'Exact integer', verify: 'import math; math.ceil(math.log2(500))',
        sol: '2⁸ = 256 < 500 ≤ 2⁹ = 512 → **9** columns (PRACTICE P6(a)). One-hot would need 500.' },
      { type: 'int', diff: 'M', q: 'Categories [Cat, Dog, Fish, Bird] are numbered **1 to 4** (worksheet P7). How many bits are needed to write Bird in binary?', answer: 3, tol: 0, round: 'Exact integer', verify: '(4).bit_length()',
        sol: 'Bird = 4 = **100** in binary → 3 bits. (Numbering 0–3 would need only 2 bits. The worksheet key says "2 (or 3)".)' },
      { type: 'mcq', diff: 'E', q: 'Education (HS < Bachelor < Master < PhD) for a linear regression. Best encoding?', options: ['One-hot', 'Ordinal', 'Binary', 'Label (alphabetical)'], answer: 1,
        sol: 'P6(b): a natural rank exists, so ordinal encoding preserves it.', why: ['Works, but throws away the order and adds columns.', 'Correct.', 'For many nominal categories.', 'Alphabetical order puts Bachelor < HS < Master < PhD, which is wrong.'] },
      { type: 'mcq', diff: 'E', q: 'Colour (Red, Blue, Green) for **KNN**. Best encoding?', options: ['Label', 'Ordinal', 'One-hot', 'No encoding needed'], answer: 2,
        sol: 'P6(c): nominal, few values, and KNN uses distances → one-hot (all colours are equally far apart).', why: ['False order and distances.', 'There is no natural order.', 'Correct.', 'KNN needs numbers.'] },
      { type: 'mcq', diff: 'M', q: 'Why is label encoding acceptable for a **decision tree** but risky for **KNN**?', options: ['Trees cannot read integers', 'Trees use threshold splits, KNN uses distances between encoded values', 'KNN only works with one-hot data by definition', 'Trees scale the data automatically'], answer: 1,
        sol: 'Reflect 5: KNN computes distances, so arbitrary integers create false closeness. A tree only asks "is x ≤ t?".', why: ['Trees read integers fine.', 'Correct.', 'KNN works with any numeric data; the encoding just has to make sense.', 'Trees do not scale anything.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.preprocessing import LabelEncoder
print(LabelEncoder().fit_transform(["Red", "Blue", "Green", "Blue"]).tolist())`, answer: '[2, 0, 1, 0]',
        sol: R`\`LabelEncoder\` sorts the classes alphabetically: Blue = 0, Green = 1, Red = 2. So Red, Blue, Green, Blue → [2, 0, 1, 0].` },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import pandas as pd
df = pd.DataFrame({"c": ["Red", "Blue", "Green"]})
print(pd.get_dummies(df, columns=["c"], dtype=int).values.tolist())`, answer: '[[0, 0, 1], [1, 0, 0], [0, 1, 0]]',
        sol: R`\`get_dummies\` creates columns c_Blue, c_Green, c_Red (alphabetical). Red → [0, 0, 1], Blue → [1, 0, 0], Green → [0, 1, 0]: the worksheet one-hot table.` }
    ],
    source: 'Worksheet L1 pp.7–9; scikit-learn `LabelEncoder`, `OrdinalEncoder`, `OneHotEncoder` docs; category_encoders `BinaryEncoder`.'
  }
  ]
});
