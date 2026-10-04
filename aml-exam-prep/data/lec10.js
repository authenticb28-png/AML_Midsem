/* Lecture 10 — Feature selection: filters and wrappers */
(function () {
const NOTE = 'L11 - Feature Selection.pdf (class note of 15 Sep, an earlier draft of Worksheet 10 with handwriting)';
const rnd = NUM.rng(12), G = () => NUM.gauss(rnd);
const xs = [-2, -1, 0, 1, 2];
LECTURES.push({
  num: 10, short: 'Feature Selection', title: 'Feature Selection — duplicates, variance & correlation filters, wrapper search, validation discipline',
  file: 'AML_Lecture 10_Worksheet_Filled.pdf', pages: 17, extraFiles: NOTE,
  intro: R`**Exam weight: medium–high.** Know relevant / redundant / irrelevant features; the **curse of dimensionality** ($b^p$ cells); filters (**duplicates, variance threshold, Pearson r with the target, input–input correlation**) and their limits (the $y = x^2$, $r = 0$ counterexample; rare binary $q(1-q)$); wrappers (**exhaustive $2^p - 1$**, **backward / forward $p(p+1)/2$**, RFE); and the **leakage trap** (select inside each CV fold). About 70 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L10.1 */
  {
    id: 'L10.1', title: 'Why feature selection; feature types; curse of dimensionality', badge: ['class', 'board'], pages: '1–3', ws: 'Sections 1–4, P1 + class note',
    concept: R`
L8 *created* features (x²); L9 showed extra flexibility can raise variance. Now: **when a dataset already has many columns, which deserve to stay?**

Stipend candidates: CGPA, IQ, number of projects, attendance, **CGPA_copy** (exact copy), **Student_ID** (large variation, just an identifier), **Random_number**. *Would keeping all seven make the model better?* **No** — duplicate, irrelevant or unstable columns add no signal and can increase variance, computation and interpretability problems.

**Feature selection** = choose a **smaller subset of existing features** while preserving (ideally improving) performance on **unseen** data. "Most important" is not absolute: it depends on the target, model, metric, sample and the other features present.

| Type | Meaning | Example |
|---|---|---|
| **Relevant** | carries stable information about the target | number of projects |
| **Redundant** | repeats information another feature carries | CGPA_copy |
| **Irrelevant** | varies but has no stable relation to the target | Random_number |

**Selection ≠ transformation.** Transformation *creates* a new representation (x² from x) and expands the space; selection *keeps only some* existing columns. Both can appear in one pipeline: create candidates, then select.

**Why selection helps.** (1) **Generalisation:** irrelevant features let the model fit noise → higher variance. *Training error falls after adding ten features but validation error rises* → the features did **not** help; more flexibility, more variance. (2) **Curse of dimensionality** (class note): split each feature's range into b bins → $b^p$ cells. With b = 10: p = 2 → 100 cells; p = 4 → 10,000; p = 6 → 1,000,000 cells for maybe 1,000 observations — most cells empty, data coverage becomes **sparse**, stable patterns are hard to estimate. (3) **Efficiency** (smaller matrices, faster, less memory), **explainability**, **stability** (fewer redundant inputs → less multicollinearity).

**Two families:** **filter** methods (statistical checks *before* training; cheap) and **wrapper** methods (train the actual model on different subsets; expensive). The class note adds **embedded** methods (selection happens inside training: tree importances, Lasso in L12).

**PRACTICE P1.** (a) CGPA_copy → **remove** (exact duplicate); Student_ID → **flag/remove** (identifier, no generalisable signal); Scholarship_flag (3% ones) → **flag** (rare can still predict; inspect target relation); Random_number → **remove/flag** (strong candidate, but validate); Project_depth² → **keep/flag** (may encode curvature). (b) usefulness changes with target/model **T**; high-variance column must be predictive **F**; transformation and selection in one pipeline **T**; smallest subset always best **F**; nearly equal CV scores → prefer the smaller subset **T**.`,
    formulas: [{ name: 'Curse of dimensionality (grid cells)', tex: R`\#\text{cells} = b^p`, sym: 'b bins per feature, p features.', when: 'Sparsity questions (class note).' }],
    plots: [{ id: 'P10-columns', title: 'Grid cells explode with the number of features (b = 10 bins)', notice: 'Cells grow 10× per added feature. 1,000 observations fill a 2-D grid easily but occupy at most 0.1% of the cells in 6-D.',
      spec: { type: 'bars', w: 520, h: 280, cats: ['p = 1', 'p = 2', 'p = 3', 'p = 4', 'p = 5', 'p = 6'], vals: [1, 2, 3, 4, 5, 6], ylabel: 'log10(number of cells)', ylim: [0, 7], line: { vals: [100, 100, 100, 10, 1, 0.1], ylim: [0, 100], pct: true, c: 's4', label: 'max % of cells occupied by 1,000 points' } } }],
    examples: [{ title: 'Coverage arithmetic (worked)', body: R`1,000 observations, b = 10. p = 3: 10³ = 1,000 cells → at best 1 point per cell. p = 5: 100,000 cells → at least 99% of cells empty. p = 7: 10⁷ cells. Keeping n fixed while p grows makes the data ever sparser.` }],
    traps: ['High variance ≠ relevance (Student_ID).', 'The smallest subset is not automatically best; judge by validated performance.', 'Selection keeps existing columns; it does not create new ones.'],
    questions: [
      { type: 'int', diff: 'E', q: 'b = 10 bins per feature, p = 5 features. Number of grid cells?', answer: 100000, tol: 0, round: 'Exact', verify: '10**5', sol: '10⁵ = **100,000**.' },
      { type: 'mcq', diff: 'E', q: 'CGPA_copy repeats CGPA in every row. It is:', options: ['relevant', 'redundant', 'irrelevant', 'a transformation'], answer: 1, sol: 'Repeats information.', why: ['It adds nothing new.', 'Correct.', 'It is related to the target (via CGPA).', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Training error falls after adding ten features but validation error rises. Interpretation?', options: ['The features helped', 'More flexibility, more variance; generalisation got worse', 'High bias', 'Leakage fixed'], answer: 1, sol: 'Section 3.1 classroom question.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'P1(b): select all **true** statements.', options: ['A feature\'s usefulness can change when the target or model changes', 'A high-variance column must be predictive', 'Transformation and selection can both appear in one pipeline', 'With nearly equal CV performance, the smaller subset is usually preferred'], answer: [0, 2, 3], sol: 'T, F, T, (F), T.', why: ['True.', 'False.', 'True.', 'True.'] },
      { type: 'mcq', diff: 'M', q: 'Feature selection differs from feature transformation because it:', options: ['creates new columns such as x²', 'keeps only some existing columns', 'always increases dimensionality', 'needs labels'], answer: 1, sol: 'Section 2.3.', why: ['That is transformation.', 'Correct.', 'Opposite.', 'Filters may not.'] }
    ],
    source: 'Worksheet L10 pp.1–3; class note (curse-of-dimensionality table, embedded methods); Guyon & Elisseeff (2003).'
  },
  /* ---------------------------------------------------------------- L10.2 */
  {
    id: 'L10.2', title: 'Filters: duplicate removal and variance threshold', badge: ['class', 'board'], pages: '3–5', ws: 'Sections 5–6 + class note',
    concept: R`
A **filter** is an admission gate: a simple structural or statistical rule decides whether a feature enters modelling. The final model is **not** trained repeatedly. Some filters ignore the target; others compare the feature with the target.

**Duplicate removal.** If $f_a = f_b$ for every row, the second column adds no independent evidence; for linear models keeping both causes **perfect multicollinearity**. Which copy to keep? the clearer name; fewer missing/corrupted values; cheaper to collect at prediction time; and check the "duplicate" is not a **leakage** column created after the target was known. Duplicate removal is safe: it removes repeated information, not unique information.

**Variance threshold.** A feature that barely changes cannot distinguish observations.
$$\text{Var}(f_j) = \frac1n\sum_{i=1}^n(x_{ij} - \bar x_j)^2,\qquad \text{remove if } \text{Var}(f_j) < \tau$$
τ is a modelling choice, not a universal constant.

| Values | Variance | Filter sees | Remember |
|---|---|---|---|
| [5, 5, 5, 5, 5] | 0 | no variation → remove | a constant cannot separate observations |
| [0, 0, 0, 0, 1] | 0.16 | low → may be removed for high τ | a **rare event can still be strongly predictive** |
| [101, …, 105] | 2 | moderate → may be kept | an **identifier can vary and still be irrelevant** |

**Binary feature (class note):** if a fraction q of rows are 1, $\text{Var} = q(1-q)$ (max 0.25 at q = 0.5). Scholarship flag with q = 3% → 0.03 × 0.97 = **0.0291**.

**Limitations:** high variance ≠ relationship with the target; low variance can be highly predictive; ignores interactions; depends on **units and scaling** (scale first or set τ per feature).`,
    formulas: [{ name: 'Population variance', tex: R`\operatorname{Var}(f_j) = \frac1n\sum_{i}(x_{ij}-\bar x_j)^2`, sym: '÷ n (as VarianceThreshold).', when: 'Variance filter.' }, { name: 'Binary feature variance', tex: R`\operatorname{Var} = q(1-q)`, sym: 'q = fraction of ones.', when: 'Rare flags (class note).' }],
    plots: [{ id: 'P10-varfilter', title: 'Variance of a binary feature, q(1 − q)', notice: 'Peaks at 0.25 when half the rows are 1. A 3% flag has variance 0.029 and would fail a threshold of 0.05 — even if it is very predictive.',
      spec: { type: 'xy', w: 480, h: 270, xlim: [0, 1], ylim: [0, 0.3], xlabel: 'q = fraction of ones', ylabel: 'variance', series: [{ t: 'fn', f: q => q * (1 - q), c: 's1', w: 2.5 }, { t: 'hline', y: 0.05, c: 's4', dash: true }, { t: 'text', x: 0.5, y: 0.065, s: 'threshold τ = 0.05' }, { t: 'scatter', pts: [[0.03, 0.0291], [0.2, 0.16]], c: 's4', labels: ['q = 3%: 0.029', 'q = 0.2: 0.16'] }] } }],
    examples: [{ title: 'Variance by hand (worked)', body: R`[0, 0, 0, 0, 1]: mean 0.2; squared deviations 0.04 × 4 + 0.64 = 0.8; ÷ 5 = **0.16** = 0.2 × 0.8 ✓.
[101, 102, 103, 104, 105]: mean 103; deviations² 4, 1, 0, 1, 4 → 10/5 = **2**.` }],
    code: [{ title: 'Duplicates, variance threshold, correlation filters', scratch: 'L10_filters_scratch.py', lib: 'L10_filters_sklearn.py' }],
    traps: ['Variance measures spread, not relevance.', 'VarianceThreshold uses ÷ n.', 'Variance depends on units — 1 km vs 1000 m changes it by 10⁶.'],
    questions: [
      { type: 'int', diff: 'E', q: 'Variance (÷ n) of [0, 0, 0, 0, 1]?', answer: 0.16, tol: 0.001, round: '2 decimals', verify: '0.2*0.8', sol: 'q(1 − q) = 0.2 × 0.8 = **0.16**.' },
      { type: 'int', diff: 'E', q: 'Variance (÷ n) of [101, 102, 103, 104, 105]?', answer: 2, tol: 0.001, round: 'Exact', verify: '(4+1+0+1+4)/5', sol: '10/5 = **2**.' },
      { type: 'int', diff: 'M', q: 'A binary flag is 1 for 3% of rows. Its variance (4 decimals)?', answer: 0.0291, tol: 0.0001, round: '4 decimals', verify: '0.03*0.97', sol: '0.03 × 0.97 = **0.0291**.' },
      { type: 'mcq', diff: 'M', q: '"Student_ID has very high variance, so a variance filter proves it is useful." The mistake?', options: ['None', 'Variance measures spread, not relevance', 'Student_ID has low variance', 'Variance filters need labels'], answer: 1, sol: 'P2(b).', why: ['There is one.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Should Scholarship_flag (3% ones) be removed solely for low variance?', options: ['Yes', 'No — a rare binary feature can be strongly predictive'], answer: 1, sol: 'P2(c).', why: ['No.', 'Correct.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.feature_selection import VarianceThreshold
X = np.array([[5, 0, 101], [5, 0, 102], [5, 0, 103], [5, 0, 104], [5, 1, 105]])
print(VarianceThreshold(0.1).fit(X).get_support().tolist())`, answer: '[False, True, True]', sol: 'Variances 0, 0.16, 2. Threshold 0.1 removes only the constant column.' }
    ],
    source: 'Worksheet L10 pp.3–5; class note (q(1 − q)); scikit-learn `VarianceThreshold`.'
  },
  /* ---------------------------------------------------------------- L10.3 */
  {
    id: 'L10.3', title: 'Pearson correlation with the target; the non-linear counterexample', badge: 'class', pages: '5–6', ws: 'Section 7',
    concept: R`
Variance says whether a feature changes; **Pearson correlation** says whether it changes **linearly together with** the target:
$$r_{jY} = \frac{\sum_i(x_{ij}-\bar x_j)(y_i-\bar y)}{\sqrt{\sum_i(x_{ij}-\bar x_j)^2}\sqrt{\sum_i(y_i-\bar y)^2}}$$
$r \approx +1$ strong positive linear; $r \approx -1$ strong negative linear; $r \approx 0$ **weak linear** relationship — **not necessarily no relationship**.

Illustrative rule: remove $f_j$ if $|r_{jY}| < 0.30$ (the threshold must be validated).

| Feature | r with stipend | Decision | Caution |
|---|---|---|---|
| CGPA | 0.68 | keep | strong linear association in this sample |
| IQ | 0.18 | remove | could help jointly or non-linearly |
| Projects | 0.57 | keep | useful linear association |
| Attendance | 0.09 | remove | threshold must be validated |
| Student_ID | −0.02 | remove | large variance ≠ relevance |

**7.1 Non-linear counterexample.** x = −2, −1, 0, 1, 2 and y = x² = 4, 1, 0, 1, 4. $\bar x = 0$, $\bar y = 2$. Numerator $= (-2)(2) + (-1)(-1) + 0(-2) + 1(-1) + 2(2) = -4 + 1 + 0 - 1 + 4 = 0$ → **r = 0**. A |r| ≥ 0.3 filter would **remove x even though y is completely determined by x**.

:::key Key insight
Zero Pearson correlation can coexist with perfect (non-linear) predictability. Pearson measures **linear** association only. (Class note: **Spearman** rank correlation catches **monotonic** non-linear relations; neither catches the symmetric U above.)
:::

**Limitations of target correlation:** misses non-linear relations; one feature at a time (misses interactions); sensitive to outliers; threshold is context-dependent; correlation ≠ causation or future stability.`,
    deriv: [{ id: 'D10-rzero', title: 'Why r = 0 for y = x² on symmetric x', badge: 'class',
      steps: [
        { m: R`\bar x = 0,\quad \bar y = \tfrac{4+1+0+1+4}{5} = 2`, t: 'Means.' },
        { m: R`\sum (x_i-\bar x)(y_i-\bar y) = \sum x_i(x_i^2 - 2) = \sum x_i^3 - 2\sum x_i`, why: 'Because $\\bar x = 0$.' },
        { m: R`\sum x_i^3 = -8 - 1 + 0 + 1 + 8 = 0,\quad \sum x_i = 0`, why: 'Odd powers cancel on a symmetric grid.' },
        { m: R`\text{numerator} = 0 \Rightarrow r = 0`, t: 'Denominator is positive, so r is exactly 0.' }
      ],
      result: R`r_{x,\,x^2} = 0 \text{ for any } x \text{ symmetric about } 0` }],
    formulas: [{ name: 'Pearson r', tex: R`r = \frac{\sum(x-\bar x)(y-\bar y)}{\sqrt{\sum(x-\bar x)^2\sum(y-\bar y)^2}}`, sym: '−1 ≤ r ≤ 1; linear only.', when: 'Target-correlation filter.' }],
    plots: [{ id: 'P10-rscatter', title: 'r ≈ +1, r ≈ −1, and r = 0 with a perfect non-linear relation', notice: 'Right: y = x² is fully determined by x, yet Pearson r = 0.',
      spec: (function () { const a = [], b = []; for (let i = 0; i < 20; i++) { const x = i / 2; a.push([x, x + G() * 0.4]); b.push([x, 10 - x + G() * 0.4]); }
        return { type: 'multi', panels: [{ type: 'xy', w: 250, h: 220, title: 'r ≈ +1', xlim: [0, 10], ylim: [-1, 11], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: a, c: 's3', r: 3 }] }, { type: 'xy', w: 250, h: 220, title: 'r ≈ −1', xlim: [0, 10], ylim: [-1, 11], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: b, c: 's4', r: 3 }] }, { type: 'xy', w: 250, h: 220, title: 'y = x², r = 0', xlim: [-2.5, 2.5], ylim: [-0.5, 4.5], xlabel: 'x', ylabel: 'y', series: [{ t: 'fn', f: x => x * x, c: 's7', dash: true }, { t: 'scatter', pts: xs.map(x => [x, x * x]), c: 's1', r: 5 }] }] }; })() }],
    examples: [{ title: 'Pearson r by hand (worked)', body: R`x = [1, 2, 3], y = [2, 4, 7]. $\bar x = 2$, $\bar y = 13/3$. Deviations a = [−1, 0, 1], b = [−7/3, −1/3, 8/3]. $\sum ab = 7/3 + 8/3 = 5$; $\sum a^2 = 2$; $\sum b^2 = (49 + 1 + 64)/9 = 114/9 = 12.667$. $r = 5/\sqrt{2 \times 12.667} = 5/5.033 = 0.993$.` }],
    code: [{ title: 'Pearson r, Spearman, the y = x² counterexample', scratch: 'L10_filters_scratch.py', lib: 'L10_filters_sklearn.py' }],
    traps: ['r = 0 ⇏ independence.', 'A constant feature gives r undefined (0/0).', 'Spearman detects monotonic relations; neither detects a symmetric U.'],
    questions: [
      { type: 'int', diff: 'M', q: 'x = [−2, −1, 0, 1, 2], y = x². Pearson r?', answer: 0, tol: 1e-9, round: 'Exact', verify: '0', sol: 'Numerator −4 + 1 + 0 − 1 + 4 = 0 → **r = 0**.' },
      { type: 'int', diff: 'H', q: 'x = [1, 2, 3], y = [2, 4, 7]. Pearson r (3 decimals)?', answer: 0.993, tol: 0.001, round: '3 decimals', verify: '5/((2*114/9)**0.5)', sol: '5/√(2 × 12.667) = **0.993**.' },
      { type: 'mcq', diff: 'E', q: 'r ≈ 0 between a feature and the target means:', options: ['no relationship of any kind', 'weak **linear** relationship; non-linear may exist', 'perfect relationship', 'causation'], answer: 1, sol: 'Section 7.', why: ['Too strong.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Which correlation catches a **monotonic** non-linear relation (e.g. y = e^x)?', options: ['Pearson', 'Spearman', 'Neither', 'Variance'], answer: 1, sol: 'Rank-based (class note).', why: ['Linear only.', 'Correct.', 'Spearman does.', 'Not a correlation.'] },
      { type: 'msq', diff: 'M', q: 'Limitations of the target-correlation filter (select all):', options: ['Misses non-linear relationships', 'Misses interactions between features', 'Sensitive to outliers', 'Requires training the final model many times'], answer: [0, 1, 2], sol: 'That last one describes wrappers.', why: ['Yes.', 'Yes.', 'Yes.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
x = np.array([-2, -1, 0, 1, 2]); print(round(np.corrcoef(x, x ** 2)[0, 1], 6), round(np.corrcoef(x, x ** 3)[0, 1], 3))`, answer: '0.0 0.943', sol: 'x vs x²: 0. x vs x³: Σx·x³ = 34, Σx² = 10, Σx⁶ = 130 → 34/√1300 ≈ 0.943.' }
    ],
    source: 'Worksheet L10 pp.5–6; class note (Spearman).'
  },
  /* ---------------------------------------------------------------- L10.4 */
  {
    id: 'L10.4', title: 'Correlation among inputs; filter summary', badge: ['class', 'board'], pages: '6–7', ws: 'Section 8, P2 + class note',
    concept: R`
Correlation can also compare **input features with each other** to detect **redundancy** and reduce multicollinearity. If corr($f_1, f_2$) = 0.95, they carry very similar linear information; keep **one** representative — deliberately:
- the one with the stronger **validated** relationship with the target;
- less missingness and measurement noise;
- easier to interpret and collect;
- use domain knowledge before removing intentionally engineered terms.

:::warn Do not apply pairwise rules blindly
x and x² can be highly correlated, yet both may be needed for curvature. Check the decision through validation.
:::

Class note: compute the matrix with \`df.corr()\` and view it as a **heatmap**.

| Filter strengths | Filter limitations |
|---|---|
| simple, fast, scalable | usually ignores interactions |
| removes obvious problems cheaply | a statistical score may not match the final model |
| often model-independent, easy to explain | thresholds can be arbitrary/unstable |
| good first stage of a pipeline | univariate linear measures miss non-linear signal |

**PRACTICE P2.** (a) Two columns equal in every row → **C duplicate removal**; constant column → **D variance threshold**; weak linear association with y → **A target correlation**; two predictors with r = 0.97 → **B input–input correlation**. (d) Removing Project_depth² because it correlates with Project_depth → **not justified** (it may encode curvature; compare validation performance).`,
    formulas: [{ name: 'Correlation matrix', tex: R`R_{jk} = \operatorname{corr}(f_j, f_k),\ R_{jj} = 1`, sym: 'Symmetric.', when: 'Redundancy screening (`df.corr()`).' }],
    plots: [{ id: 'P10-heatmap', title: 'Correlation heatmap (df.corr())', notice: 'CGPA and CGPA_noisy are almost perfectly correlated (0.999): keep one. Projects is mildly negatively related to both.',
      spec: { type: 'heat', rows: ['CGPA', 'CGPA_noisy', 'Projects'], cols: ['CGPA', 'CGPA_noisy', 'Projects'], vals: [[1, 0.999, -0.371], [0.999, 1, -0.365], [-0.371, -0.365, 1]], diverging: true, max: 1, cw: 100 } }],
    examples: [{ title: 'Which one to keep? (worked)', body: R`Visitors and page views: r = 0.96. Visitors has r = 0.62 with revenue (validated), 0% missing; page views r = 0.58, 4% missing and a tracking bug last month. Keep **visitors**; then confirm with CV that dropping page views does not hurt.` }],
    code: [{ title: 'Correlation matrix / heatmap numbers', scratch: 'L10_filters_scratch.py', lib: 'L10_filters_sklearn.py' }],
    traps: ['High input–input correlation does not tell you which feature to drop.', 'Engineered pairs (x, x²) are correlated by construction.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A column is constant. Most direct screen?', options: ['Target correlation', 'Input–input correlation', 'Duplicate removal', 'Variance threshold'], answer: 3, sol: 'P2(a) 2 → D.', why: ['No.', 'No.', 'No.', 'Correct.'] },
      { type: 'mcq', diff: 'E', q: 'Two predictors have correlation 0.97. Most direct screen?', options: ['Target correlation', 'Input–input correlation', 'Variance threshold', 'None'], answer: 1, sol: '4 → B.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'A student removes Project_depth² because it correlates highly with Project_depth. Justified?', options: ['Yes, always remove one of a correlated pair', 'No — the squared term may be needed for curvature; validate', 'Yes, x² is never useful', 'Only if r = 1'], answer: 1, sol: 'P2(d).', why: ['Blind rule.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Strengths of filter methods (select all):', options: ['Fast and scalable', 'Capture interactions', 'Often model-independent', 'Good first stage of a pipeline'], answer: [0, 2, 3], sol: '8.1 summary.', why: ['Yes.', 'Usually not.', 'Yes.', 'Yes.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3, 4], "b": [2, 4, 6, 8], "c": [4, 3, 2, 1]})
print(df.corr().round(2).values.tolist())`, answer: '[[1.0, 1.0, -1.0], [1.0, 1.0, -1.0], [-1.0, -1.0, 1.0]]', sol: 'b = 2a (r = 1); c decreases exactly linearly (r = −1).' }
    ],
    source: 'Worksheet L10 pp.6–7; class note (df.corr heatmap).'
  },
  /* ---------------------------------------------------------------- L10.5 */
  {
    id: 'L10.5', title: 'Wrapper loop and exhaustive search', badge: 'class', pages: '8–9', ws: 'Sections 9–10',
    concept: R`
A feature weak alone can be useful with another; two useful features can be redundant together. **Wrappers evaluate whole subsets with the model we actually plan to use.** Filters judge one feature at a time, miss interactions, and their scores may not match how the model learns.

:::key Key insight
A wrapper "wraps" model training and validation around the selection process.
:::

**Wrapper loop:** 1 generate a candidate subset → 2 train the chosen model on it → 3 evaluate on validation data / **cross-validation** → 4 generate the next subset by the search strategy → 5 stop when the search finishes or a stopping rule is met.

:::warn Use cross-validated scores
Training performance almost always improves when features are added, even useless ones. Judge subsets by **CV** scores.
:::

**Exhaustive search** evaluates every non-empty subset: each of p features is in or out → $2^p - 1$ subsets.

| p | $2^p - 1$ |
|---|---|
| 4 | 15 |
| 6 | 63 |
| 20 | 1,048,575 |
| 30 | 1,073,741,823 |

+ finds the best subset in the search space (if every subset is evaluated correctly); − exponential cost; − testing many subsets can **overfit the validation procedure** (a chance winner); − result depends on the chosen model and metric.`,
    formulas: [{ name: 'Exhaustive subsets', tex: R`2^p - 1`, sym: 'Non-empty subsets of p features.', when: 'Counting.' }],
    plots: [{ id: 'P10-wrapperloop', title: 'The wrapper loop', notice: 'The model is retrained for every candidate subset — that is why wrappers are expensive.',
      spec: { type: 'flow', w: 640, h: 190, nodes: [{ id: 'a', x: 80, y: 60, w: 130, h: 44, t: 'Candidate\nsubset', c: 's1' }, { id: 'b', x: 240, y: 60, w: 130, h: 44, t: 'Train chosen\nmodel', c: 's5' }, { id: 'c', x: 400, y: 60, w: 140, h: 44, t: 'Cross-validated\nscore', c: 's2' }, { id: 'd', x: 565, y: 60, w: 130, h: 44, t: 'Stop or next\nsubset?', c: 's4' }],
        edges: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'c', b: 'd' }, { a: 'd', b: 'a', via: [[565, 150], [80, 150]], t: 'continue search', dash: true }] } }],
    examples: [{ title: 'Cost with CV (worked)', body: R`p = 10 features, 5-fold CV. Exhaustive: (2¹⁰ − 1) × 5 = 1023 × 5 = **5,115** model fits. Backward elimination path: p(p + 1)/2 × 5 = 55 × 5 = **275** fits.` }],
    traps: ['Count **non-empty** subsets: 2ᵖ − 1, not 2ᵖ.', 'Evaluating thousands of subsets on one validation set can select a lucky subset (overfitting the selection).'],
    questions: [
      { type: 'int', diff: 'E', q: 'p = 6 features. Number of non-empty subsets in exhaustive search?', answer: 63, tol: 0, round: 'Exact', verify: '2**6-1', sol: '2⁶ − 1 = **63**.' },
      { type: 'int', diff: 'M', q: 'p = 10 features, 5-fold CV for every subset. Total model fits for exhaustive search?', answer: 5115, tol: 0, round: 'Exact', verify: '(2**10-1)*5', sol: '1023 × 5 = **5,115**.' },
      { type: 'mcq', diff: 'E', q: 'Correct wrapper-loop order (E initial subset, C train, A evaluate, B next subset, D stop)?', options: ['E → C → A → B → D', 'C → E → A → D → B', 'E → A → C → B → D', 'A → C → E → B → D'], answer: 0, sol: 'P3(c).', why: ['Correct.', 'No.', 'Train before evaluate.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why must wrapper subsets be judged on CV rather than training scores?', options: ['Training scores are slower', 'Adding features almost always improves training scores, even useless ones', 'CV is required by sklearn', 'Training scores are negative'], answer: 1, sol: 'Warning box Section 9.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Assertion: exhaustive search evaluating every subset correctly can find the best subset. Reason: it evaluates all 2ᵖ − 1 subsets.', options: ['Both true, R explains A', 'Both true, R does not explain A', 'A true, R false', 'A false, R true'], answer: 0, sol: 'P3(d).', why: ['Correct.', 'No.', 'No.', 'No.'] }
    ],
    source: 'Worksheet L10 pp.8–9; Kohavi & John, "Wrappers for feature subset selection" (1997).'
  },
  /* ---------------------------------------------------------------- L10.6 */
  {
    id: 'L10.6', title: 'Backward elimination, forward selection, RFE', badge: ['class', 'board'], pages: '9–12', ws: 'Sections 11–12, P3 + class note',
    concept: R`
All scores are cross-validated R².

**Backward elimination** — start with all features; at each stage remove each remaining feature in turn, keep the best candidate.
- Start {f1, f2, f3, f4}: **0.89**.
- Remove one: {f2,f3,f4} 0.81, {f1,f3,f4} 0.71, **{f1,f2,f4} 0.91**, {f1,f2,f3} 0.65 → remove **f3** (score improved 0.89 → 0.91).
- From {f1,f2,f4}: {f2,f4} 0.79, {f1,f4} 0.81, **{f1,f2} 0.83** → remove **f4**.
- From {f1,f2}: **{f2} 0.63**, {f1} 0.53.
- **Choose the best subset seen on the path:** {f1,f2,f4} (0.91) — not the final or smallest one.
- Models fitted for p = 4: 1 + 4 + 3 + 2 = **10** (vs 15 exhaustive). In general $1 + p + (p-1) + \dots + 2 = \frac{p(p+1)}{2}$ → **quadratic** growth.

:::warn Greedy search
Each stage makes the locally best choice; a removed feature is **never reconsidered**, so the globally best combination can be missed.
:::

**Sequential forward selection** — start with **no** features (baseline predicts $\bar y$); add the feature giving the largest validation improvement; repeat.
- One feature: **{f1} 0.63**, {f2} 0.51, {f3} 0.43, {f4} 0.49 → add f1.
- Add to {f1}: {f1,f2} 0.63, {f1,f3} 0.71, **{f1,f4} 0.80** → add f4.
- Add to {f1,f4}: {f1,f4,f2} 0.81, **{f1,f4,f3} 0.85** → add f3.
- All four: 0.83 < 0.85 → best subset on the path **{f1, f4, f3}**.
Forward selection does **not** blindly add every feature: stop when improvement stops, or choose the best subset along the path.

**Which direction?** Large p, small final subset (keep ~10 of 100) → **forward**. Model can fit all p and you keep most (~90 of 100) → **backward**. Both are greedy and model-specific, so they may pick different subsets.

**Recursive Feature Elimination — RFE (class note):** start with all (e.g. 10) features and a target count (keep 5). Step 1 train the model; step 2 compute the score / **feature importance** (|coefficients| for linear regression, importances for trees); step 3 **drop the least important feature**; step 4 repeat until the desired number remains (10 → 9 → 8 → 7 → 6 → 5). **RFECV** chooses the number of features by cross-validation.

| Wrapper strengths | Wrapper limitations |
|---|---|
| optimises the chosen model & metric directly | expensive (especially with CV) |
| captures combinations/interactions | can overfit the search procedure |
| subset tailored to the modelling goal | may not transfer to a different model |
| sequential methods much cheaper than exhaustive | greedy methods can miss the global best |

**PRACTICE P3.** (a) from {f1,f2,f4}: continue with **{f1,f2}**, remove **f4**; can miss the global best because it is **greedy**. (b) p = 6: exhaustive **63**, backward path 6·7/2 = **21** (exponential vs quadratic). (e) keep ~10 of 100 → forward; keep ~90 → backward.`,
    formulas: [{ name: 'Sequential path cost', tex: R`1 + p + (p-1) + \dots + 2 = \frac{p(p+1)}{2}`, sym: 'Models fitted along a full backward (or forward incl. baseline) path.', when: 'Counting questions.' }],
    plots: [{ id: 'P10-paths', title: 'Backward and forward paths (worksheet CV R²)', notice: 'Backward peaks at 3 features {f1,f2,f4} = 0.91; forward peaks at 3 features {f1,f4,f3} = 0.85. Different greedy paths, different subsets.',
      spec: { type: 'xy', w: 520, h: 290, xlim: [0.5, 4.5], ylim: [0.4, 1], xticks: [1, 2, 3, 4], xlabel: 'number of features', ylabel: 'best CV R² at that size', legend: 'br',
        series: [{ t: 'line', pts: [[4, 0.89], [3, 0.91], [2, 0.83], [1, 0.63]], c: 's1', markers: true, mr: 4, label: 'backward elimination' }, { t: 'line', pts: [[1, 0.63], [2, 0.80], [3, 0.85], [4, 0.83]], c: 's4', markers: true, mr: 4, label: 'forward selection' }, { t: 'scatter', pts: [[3, 0.91], [3, 0.85]], c: 's3', r: 7, hollow: true }] } }],
    examples: [{ title: 'RFE by hand (worked)', body: R`Standardised linear-regression coefficients for 5 features: [2.1, −0.3, 1.4, 0.05, −0.9]. Keep 3. Drop f4 (|0.05|), refit; suppose new coefficients [2.0, −0.35, 1.5, −0.95]; drop f2 (|0.35|). Remaining: f1, f3, f5. (Coefficients must be on comparable scales — standardise first.)` }],
    code: [{ title: 'Forward/backward by hand; SequentialFeatureSelector, RFE, RFECV', scratch: 'L10_wrappers_scratch.py', lib: 'L10_wrappers_sklearn.py' }],
    traps: ['Choose the **best subset along the path**, not the last one.', 'p(p + 1)/2 is quadratic; 2ᵖ − 1 is exponential.', 'RFE needs comparable importances (standardise for linear models).'],
    questions: [
      { type: 'int', diff: 'E', q: 'p = 6. Models fitted on a full backward-elimination path, p(p + 1)/2?', answer: 21, tol: 0, round: 'Exact', verify: '6*7//2', sol: '**21**.' },
      { type: 'mcq', diff: 'E', q: 'Backward step from {f1, f2, f4}: {f2,f4} 0.79, {f1,f4} 0.81, {f1,f2} 0.83. Which feature is removed?', options: ['f1', 'f2', 'f4', 'none'], answer: 2, sol: 'Keep {f1,f2} → remove f4.', why: ['No.', 'No.', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'The backward path scored 0.89 (4 feats), 0.91 (3), 0.83 (2), 0.63 (1). Selected subset size?', options: ['4', '3', '2', '1'], answer: 1, sol: 'Highest CV R² along the path: 0.91.', why: ['No.', 'Correct.', 'Not the final.', 'Not the smallest.'] },
      { type: 'mcq', diff: 'M', q: 'From 100 features you expect to keep about 10. More natural method?', options: ['Backward elimination', 'Forward selection', 'Exhaustive search', 'No selection'], answer: 1, sol: 'P3(e).', why: ['For keeping ~90.', 'Correct.', 'Infeasible.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why can backward elimination miss the globally best subset?', options: ['It uses CV', 'It is greedy and never reconsiders removed features', 'It evaluates all subsets', 'It starts with no features'], answer: 1, sol: 'Warning, Section 11.6.', why: ['No.', 'Correct.', 'That is exhaustive.', 'That is forward.'] },
      { type: 'mcq', diff: 'M', q: 'RFE removes at each step the feature with:', options: ['highest variance', 'lowest importance (e.g. smallest |coefficient|)', 'highest correlation with y', 'most missing values'], answer: 1, sol: 'Class note RFE steps.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`p = 4
print(2 ** p - 1, p * (p + 1) // 2, 1 + sum(range(2, p + 1)))`, answer: '15 10 10', sol: 'Exhaustive 15; backward path 1 + 4 + 3 + 2 = 10 = p(p+1)/2.' }
    ],
    source: 'Worksheet L10 pp.9–12; class note (RFE steps, RFECV); scikit-learn `SequentialFeatureSelector`, `RFE`, `RFECV`.'
  },
  /* ---------------------------------------------------------------- L10.7 */
  {
    id: 'L10.7', title: 'Filter vs wrapper; leakage; end-to-end workflow', badge: 'class', pages: '13–17', ws: 'Sections 13–16, P4',
    concept: R`
| Criterion | Filter | Wrapper |
|---|---|---|
| uses final-model performance? | usually no | yes |
| captures interactions? | usually no | yes, if the model can represent them |
| model-specific? | usually no | yes |
| cost | low | high |
| best role | fast screening | careful subset search for a chosen model |

**Rules of thumb:** filters first when p is huge or obvious duplicates/near-constants exist; a wrapper when p is manageable, model-specific performance matters and compute is available; **combine** (filters, then a wrapper on the reduced set); always compare with the **all-feature baseline** using the same validation procedure.

:::warn The leakage trap
**Wrong:** select features on the **entire dataset**, then split / cross-validate → the validation data already influenced selection → falsely optimistic scores. **Right:** inside **every CV fold**, perform selection using only that fold's **training** part, then evaluate on its untouched validation part. The **test set is never used** to choose features; it is used once at the very end.
:::

**The selected subset is not universal:** change the target, model, metric or sample and the best subset can change. Report features **with** the dataset, target, model, metric and validation design.

**End-to-end workflow:** 1 define target, metric, goal → 2 split (train/val/test) before learning selection rules → 3 remove exact duplicates and unusable columns → 4 simple filters (mind their limits) → 5 wrapper if needed and feasible → 6 choose thresholds, counts, stopping rules **inside CV** → 7 compare with the all-feature baseline; prefer the simpler model only if generalisation holds → 8 evaluate **once** on the test set and report.

**PRACTICE P4.** (a) Correlations on the whole dataset → top 5 → 5-fold CV → report: **not trustworthy** — leakage; recompute the filter inside each training fold. (b) Thousands of duplicate/near-constant columns → **filters first**; manageable features with interactions and compute → **wrapper**; obvious problems then model-aware search → **filter, then wrapper**. (c) smallest set always best **F**; low-variance always useless **F**; wrappers cost more **T**; different models may select different features **T**; test set may choose the threshold **F**. (d) **C → B → D → E → A**. (e) 18 vs 7 features with nearly equal CV → prefer **7** unless domain, reliability or operational reasons justify more. (f) usefulness is conditional on target, model, metric, sample and validation design.`,
    formulas: [{ name: 'Leak-free selection', tex: R`\text{for each fold } k:\ S_k = \text{select}(D_{\text{train},k}),\ \text{score}_k = \text{eval}(\text{model}_{S_k}, D_{\text{val},k})`, sym: 'Selection is part of the fitted pipeline.', when: 'P4(a)-type questions.' }],
    plots: [{ id: 'P10-workflow', title: 'Feature selection belongs inside the training pipeline', notice: 'The selector is fitted on training folds only; the test set is touched once at the end.',
      spec: { type: 'flow', w: 680, h: 200, nodes: [{ id: 'a', x: 70, y: 60, w: 110, h: 40, t: 'Raw data', c: 's7' }, { id: 'b', x: 190, y: 60, w: 90, h: 40, t: 'Split', c: 's2' }, { id: 'c', x: 360, y: 60, w: 200, h: 50, t: 'Select features & fit\n(training fold only)', c: 's1', bold: true }, { id: 'd', x: 530, y: 60, w: 100, h: 40, t: 'Validate', c: 's5' }, { id: 'e', x: 620, y: 150, w: 110, h: 40, t: 'Final test\nonce', c: 's4' }],
        edges: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'c', b: 'd' }, { a: 'd', b: 'e' }] } }],
    examples: [{ title: 'How big is the leakage effect? (worked)', body: R`With 1,000 pure-noise features and 50 rows, choosing the 10 features most correlated with y on **all** rows and then cross-validating can show a CV R² well above 0 — although no feature carries any signal. Selecting inside each fold gives a CV R² near (or below) 0, the honest answer. scikit-learn: put the selector in a \`Pipeline\` and pass the pipeline to \`cross_val_score\`.` }],
    code: [{ title: 'Leakage-free select + fit pipeline', lib: 'L10_wrappers_sklearn.py' }],
    traps: ['Selecting on the full dataset before CV is **leakage**.', 'Never tune the selection threshold on the test set.', 'A subset that is best for one model may not be best for another.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A student computes correlations on the entire dataset, keeps the top 5, then runs 5-fold CV. Is the CV score trustworthy?', options: ['Yes', 'No — the validation folds influenced selection (leakage)'], answer: 1, sol: 'P4(a).', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'E', q: 'Trustworthy order: C define goal, B split, D fit selection inside CV, E compare with baseline, A final test.', options: ['C → B → D → E → A', 'B → C → D → A → E', 'C → D → B → E → A', 'D → C → B → E → A'], answer: 0, sol: 'P4(d).', why: ['Correct.', 'No.', 'Split first.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Thousands of columns, many exact duplicates and near-constants. Starting strategy?', options: ['Exhaustive search', 'Simple filters first', 'Backward elimination', 'No selection'], answer: 1, sol: 'P4(b).', why: ['Infeasible.', 'Correct.', 'Too expensive at this scale.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'P4(c): select all **true** statements.', options: ['The smallest feature set is always best', 'Wrapper methods usually cost more', 'Two different models can legitimately select different features', 'The test set may be used to choose the correlation threshold'], answer: [1, 2], sol: 'F, T, T, F.', why: ['False.', 'True.', 'True.', 'False.'] },
      { type: 'mcq', diff: 'M', q: 'Two subsets: 18 features and 7 features, nearly equal CV performance. Normally prefer:', options: ['18', '7', 'neither', 'average them'], answer: 1, sol: 'P4(e).', why: ['Needs a strong reason.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Which captures feature interactions?', options: ['Filters, usually', 'Wrappers, if the model can represent them', 'Variance threshold', 'Duplicate removal'], answer: 1, sol: 'Section 13 table.', why: ['Usually not.', 'Correct.', 'No.', 'No.'] }
    ],
    source: 'Worksheet L10 pp.13–17; Ambroise & McLachlan, "Selection bias in gene extraction" (2002).'
  }
  ]
});
})();
