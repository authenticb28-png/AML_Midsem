/* Lecture 8 — Polynomial Regression and the five assumptions of Linear Regression */
(function () {
const XS = [2, 4, 6, 8, 10], YS = [24, 42, 62, 91, 128];
const zip = (a, b) => a.map((v, i) => [v, b[i]]);
const r = NUM.rng(41), px = [], py = [];
for (let i = 0; i < 10; i++) { const x = 0.2 + i * 0.42; px.push(x); py.push(5.5 - 0.35 * (x - 2.2) ** 2 * 2 + NUM.gauss(r) * 0.45); }
const P = zip(px, py), f1 = NUM.polyfit(px, py, 1), f2 = NUM.polyfit(px, py, 2), f8 = NUM.polyfit(px, py, 8);
const rr = NUM.rng(7), g = () => NUM.gauss(rr);
const resGood = [], resU = [], resFun = [], resAuto = [], histN = [], histS = [];
for (let i = 0; i < 70; i++) { const yh = 10 + i * 0.6; resGood.push([yh, g() * 2]); resU.push([yh, 0.03 * (yh - 30) ** 2 - 6 + g() * 1.2]); resFun.push([yh, g() * (0.3 + 0.12 * (yh - 10))]); }
let e = 0; for (let t = 1; t <= 60; t++) { e = 0.85 * e + g() * 0.8; resAuto.push([t, e]); }
for (let i = 0; i < 300; i++) { histN.push(g()); histS.push(Math.exp(0.7 * g()) - 1.2); }
const bin = (v, a, b, k) => { const w = (b - a) / k, xs = [], ys = []; for (let j = 0; j < k; j++) { xs.push(a + w * (j + 0.5)); ys.push(v.filter(x => x >= a + w * j && x < a + w * (j + 1)).length); } return { xs, ys, w }; };
const hN = bin(histN, -3.5, 3.5, 14), hS = bin(histS, -1.5, 5.5, 14);
LECTURES.push({
  num: 8, short: 'Polynomial & Assumptions', title: 'Polynomial Regression & the Five Assumptions of Linear Regression',
  file: 'AML_Lecture 8_Worksheet_Filled.pdf', pages: 13,
  intro: R`**Exam weight: medium–high.** Polynomial regression = **feature transformation** (same OLS/GD, linear in β), column counts (degree n → n + 1 columns), overfitting with high degree; the five assumptions (**linearity, normality of residuals, homoscedasticity, no autocorrelation, no multicollinearity**) — how to check each and what to do; and the proof that dependent columns make $X^TX$ singular. Formal tests (VIF, Durbin–Watson, Q–Q, Breusch–Pagan) are a researched extra. About 75 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L08.1 */
  {
    id: 'L08.1', title: 'A straight line fails; create the feature x²', badge: 'class', pages: '1–2', ws: 'Sections 1–2',
    concept: R`
:::hook Hook
Predict an NST student's stipend from a **project depth score** (1 = basic, 10 = production-like). Going from 2 → 4 helps a little; 8 → 10 helps much more (better companies, referrals). The scatter curves **upward**.
:::

$y = \beta_0 + \beta_1x$ has **one constant slope**: one more unit of x changes the prediction by the same amount everywhere. Here the effect of x is larger at high x, so we need a model whose slope can change.

**The simple idea: create a new feature $x^2$.** Polynomial regression is **not a new algorithm** — it is a **feature transformation**: a new input column built from an existing one. $x = 4 \to x^2 = 16$; $x = 8 \to x^2 = 64$; $x^2$ grows faster for large x, letting the model bend upward.

| Student | x | $x^2$ | y (₹k) |
|---|---|---|---|
| A | 2 | 4 | 24 |
| B | 4 | 16 | 42 |
| C | 6 | 36 | 62 |
| D | 8 | 64 | 91 |
| E | 10 | 100 | 128 |

Model: $y = \beta_0 + \beta_1x + \beta_2x^2$; feature map $\phi(x) = (x, x^2)$.

:::key Key insight
A **feature space** is the coordinate system formed by the features we give the model. One feature → one coordinate per student; $x$ and $x^2$ → two coordinates. The target y is the vertical axis.
:::

Fitting this data: degree 1 gives $\hat y = -7.7 + 12.85x$ (train MSE 32.46); degree 2 gives $\hat y = 15.8 + 2.779x + 0.839x^2$ (train MSE **0.90**).`,
    formulas: [{ name: 'Quadratic model', tex: R`\hat y = \beta_0 + \beta_1x + \beta_2x^2`, sym: 'Linear in β; non-linear in x.', when: 'Curved relationship.' }, { name: 'Feature map', tex: R`\phi(x) = (x,\ x^2)`, sym: 'One raw input → two model features.', when: 'Describing the transformation.' }],
    plots: [{ id: 'P08-linvscurve', title: 'Stipend vs project depth: line vs quadratic', notice: 'The line under-predicts both ends and over-predicts the middle (residuals form a U). The quadratic follows the bend.',
      spec: { type: 'xy', w: 540, h: 310, xlim: [0, 11], ylim: [0, 140], xlabel: 'project depth x', ylabel: 'stipend ₹k', legend: 'tl', series: [{ t: 'scatter', pts: zip(XS, YS), c: 'fg', labels: ['A', 'B', 'C', 'D', 'E'] }, { t: 'fn', f: x => -7.7 + 12.85 * x, c: 's4', label: 'degree 1: −7.7 + 12.85x' }, { t: 'fn', f: x => 15.8 + 2.7786 * x + 0.8393 * x * x, c: 's3', label: 'degree 2: 15.8 + 2.78x + 0.84x²' }] } }],
    examples: [{ title: 'Changing slope (worked)', body: R`For $\hat y = 15.8 + 2.779x + 0.839x^2$ the slope is $d\hat y/dx = 2.779 + 1.679x$: at x = 2 it is 6.1 ₹k per point, at x = 9 it is 17.9 ₹k per point. A straight line would give 12.85 everywhere.` }],
    code: [{ title: 'x² column and degree-1 vs degree-2 fits', scratch: 'L08_polynomial_scratch.py', lib: 'L08_polynomial_sklearn.py' }],
    traps: ['Polynomial regression is still **linear regression** (linear in the parameters).', 'Create $x^2$ from **training** x; the same transformation is applied to test x.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Polynomial regression is best described as:', options: ['a new optimisation algorithm', 'linear regression on transformed features (x, x², …)', 'a classification method', 'non-linear in the parameters'], answer: 1, sol: 'Section 2 hook / takeaway.', why: ['Same OLS/GD.', 'Correct.', 'No.', 'It is linear in β.'] },
      { type: 'int', diff: 'E', q: 'x = 8. Value of the new feature x²?', answer: 64, tol: 0, round: 'Exact', verify: '8**2', sol: '**64**.' },
      { type: 'int', diff: 'M', q: R`Using $\hat y = 15.8 + 2.7786x + 0.8393x^2$, predict for x = 5 (2 decimals).`, answer: 50.68, tol: 0.01, round: '2 decimals', verify: '15.8+2.7786*5+0.8393*25', sol: '15.8 + 13.893 + 20.983 = **50.68**.' },
      { type: 'mcq', diff: 'M', q: 'Why does a straight line fail on the stipend data?', options: ['It has too many parameters', 'Its slope is constant, but the effect of x grows at high x', 'OLS cannot fit it', 'The data have outliers'], answer: 1, sol: 'Section 1.', why: ['It has too few.', 'Correct.', 'It fits, badly.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
x = np.array([2, 4, 6])
X = np.column_stack([np.ones(3), x, x ** 2])
print(X.shape, X[2].tolist())`, answer: '(3, 3) [1.0, 6.0, 36.0]', sol: 'Three columns (1, x, x²); row 3 is [1, 6, 36] as floats (np.ones is float).' }
    ],
    source: 'Worksheet L8 pp.1–2; ISLR §7.1.'
  },
  /* ---------------------------------------------------------------- L08.2 */
  {
    id: 'L08.2', title: 'A curve becomes a plane; higher degree; overfitting', badge: 'class', pages: '2–4', ws: 'Sections 3–4, P1',
    concept: R`
**3-D mental model.** Rename $z = x^2$: $y = \beta_0 + \beta_1x + \beta_2z$ — a **plane** in the (x, z, y) space. Viewed along the path $z = x^2$, the fitted plane looks like a **curve** in the original (x, y) plot.

:::take Takeaway
We gave linear regression a better **coordinate system**. The model is linear in $\beta_0, \beta_1, \beta_2$, non-linear only in the original x.
:::

**Degree** = highest power of x:
- degree 1: straight line; degree 2: U-shape / one bend; degree 3: more flexible bends;
- general: $y = \beta_0 + \beta_1x + \dots + \beta_nx^n$.

:::warn Overfitting
Overfitting = capturing **accidental fluctuations** in the training data instead of the stable pattern. A very high-degree polynomial can twist to reduce training error, but that does not guarantee better predictions on new students.
:::
*Classroom question:* degree 8 passes closer to every training point than degree 2 — prefer it automatically? **No.** Lower training error is not enough; the curve must represent the underlying relationship, not the noise.

**PRACTICE P1 (answered).** (a) $x^2$ = 4, 16, 36, 64, 100. (b) degree 2 → **3 columns** (1, x, x²). (c)

| Degree | Columns (incl. intercept) | Can it bend? |
|---|---|---|
| 1 | 2 | no (straight line) |
| 2 | 3 | yes (one bend) |
| 5 | 6 | yes (up to 4 bends) |
| n | n + 1 | yes (up to n − 1 bends = turning points) |

(d) "Polynomial regression uses a different optimisation algorithm" → **False** (same OLS/GD; only features change). (e) A: degree 20 on 25 points has lower training error than degree 2; R: more parameters let it twist closer to every point → **(i) both true, R explains A**.

**Course lab "Polynomial Regression Detective":** for each degree fit \`PolynomialFeatures\` + \`LinearRegression\`, compute train/test MSE, pick the **lowest test MSE** (ties → smallest degree), and label: **underfit** if train > 0.3 and test > 0.3 and |train − test| < 0.05; else **overfit** if train < 0.1 and test > 0.15; else **good**.`,
    formulas: [{ name: 'Degree-n polynomial', tex: R`\hat y = \sum_{k=0}^{n}\beta_kx^k`, sym: 'n + 1 columns incl. intercept; up to n − 1 turning points.', when: 'Counting columns/bends.' }, { name: 'Multi-input degree-2 features', tex: R`(x_1,x_2) \mapsto (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)`, sym: '`PolynomialFeatures(2)` with 2 inputs → 6 columns.', when: 'sklearn feature counts.' }],
    plots: [
      { id: 'P08-degrees', title: 'Degree 1 underfits, degree 2 fits, degree 8 overfits', notice: 'Same 10 noisy points from an arch-shaped (quadratic) pattern. Degree 8 wiggles through the noise: lowest training error, worst behaviour between and beyond the points.',
        spec: { type: 'multi', panels: [
          { type: 'xy', w: 260, h: 230, title: 'Degree 1 (underfits)', xlim: [0, 4.3], ylim: [-1, 7], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: P, c: 'fg', r: 3.5 }, { t: 'fn', f: f1, c: 's4' }] },
          { type: 'xy', w: 260, h: 230, title: 'Degree 2 (good fit)', xlim: [0, 4.3], ylim: [-1, 7], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: P, c: 'fg', r: 3.5 }, { t: 'fn', f: f2, c: 's3' }] },
          { type: 'xy', w: 260, h: 230, title: 'Degree 8 (overfits)', xlim: [0, 4.3], ylim: [-1, 7], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: P, c: 'fg', r: 3.5 }, { t: 'fn', f: f8, c: 's5', d: [0.1, 4.2], n: 400 }] }] } },
      { id: 'P08-plane', title: 'With z = x², the fitted model is a plane in (x, z, y)', notice: 'The data points lie on the curved path z = x²; the fitted plane passes near them. Viewed from the front, that path traces the curve.',
        spec: { type: 'surface', w: 520, h: 360, xr: [0, 11], yr: [0, 110], xl: 'x', yl: 'z = x²', zl: 'y', zr: [0, 140], planes: [{ f: (x, z) => 15.8 + 2.7786 * x + 0.8393 * z, c: 's3' }], pts: XS.map((x, i) => [x, x * x, YS[i], 'ABCDE'[i]]) } }
    ],
    examples: [{ title: 'Column counts with sklearn (worked)', body: R`\`PolynomialFeatures(degree=3)\` on one input → columns 1, x, x², x³ = 4. On two inputs with degree 2 → 1, x₁, x₂, x₁², x₁x₂, x₂² = 6 (the cross term x₁x₂ is an interaction feature, L2).` }],
    code: [{ title: 'Polynomial fits; course lab "Polynomial Regression Detective"', scratch: 'L08_polynomial_scratch.py', lib: 'L08_polynomial_sklearn.py', more: [['Course lab: poly detective', 'L08_lab_poly_detective.py']] }],
    traps: ['Degree n → **n + 1** columns (with intercept).', '"Bends" here = turning points: up to n − 1 (UNCLEAR item 9).', 'Lower **training** error with higher degree is expected; judge on validation/test.', 'Higher degree features (x⁸) explode in scale — scale them before GD.'],
    questions: [
      { type: 'int', diff: 'E', q: 'A degree-5 polynomial in one variable has how many columns in X (including the intercept)?', answer: 6, tol: 0, round: 'Exact', verify: '5+1', sol: 'n + 1 = **6**.' },
      { type: 'int', diff: 'M', q: 'PolynomialFeatures(degree=2) on **two** inputs (with bias). Number of output columns?', answer: 6, tol: 0, round: 'Exact', verify: 'len(["1","x1","x2","x1^2","x1x2","x2^2"])', sol: '1, x₁, x₂, x₁², x₁x₂, x₂² = **6**.' },
      { type: 'mcq', diff: 'M', q: 'Assertion: degree 20 on 25 points has lower training error than degree 2. Reason: more parameters let it twist closer to each point.', options: ['Both true, R explains A', 'Both true, R does not explain A', 'A true, R false', 'A false, R true'], answer: 0, sol: 'P1(e).', why: ['Correct.', 'R is the explanation.', 'R is true.', 'A is true.'] },
      { type: 'mcq', diff: 'E', q: 'Degree 8 passes closer to every training point than degree 2. Should we prefer it?', options: ['Yes, always', 'No — lower training error may just be fitting noise', 'Only if n > 8', 'Yes, if R² is higher'], answer: 1, sol: 'Classroom question.', why: ['No.', 'Correct.', 'Not the criterion.', 'R² rises anyway.'] },
      { type: 'mcq', diff: 'M', q: 'Course lab rule: train MSE 0.02, test MSE 0.40. Label?', options: ['underfit', 'overfit', 'good', 'undefined'], answer: 1, sol: 'Not underfit (train ≤ 0.3); train < 0.1 and test > 0.15 → **overfit**.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Course lab rule: train MSE 0.50, test MSE 0.52. Label?', options: ['underfit', 'overfit', 'good', 'best'], answer: 0, sol: 'Both > 0.3 and |diff| = 0.02 < 0.05 → **underfit**.', why: ['Correct.', 'Train is not < 0.1.', 'Underfit rule applies first.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.preprocessing import PolynomialFeatures
print(PolynomialFeatures(degree=3).fit_transform([[2]]).tolist())`, answer: '[[1.0, 2.0, 4.0, 8.0]]', sol: '1, x, x², x³ for x = 2.' }
    ],
    source: 'Worksheet L8 pp.2–4; course lab "Polynomial Regression Detective"; ISLR §7.1.'
  },
  /* ---------------------------------------------------------------- L08.3 */
  {
    id: 'L08.3', title: 'Why assumptions matter; Assumption 1 — Linearity', badge: 'class', pages: '5–6', ws: 'Part II intro, Section 5',
    concept: R`
After choosing a model we must ask whether it behaves in a **trustworthy** way. Linear regression relies on assumptions for valid, reliable estimates and **inference** (understanding relationships, interpreting coefficients, saying how changing inputs affects the output). Residual: $e = y - \hat y$.

**The five assumptions:** 1. Linearity · 2. Normality of residuals · 3. Homoscedasticity · 4. No autocorrelation of errors · 5. No (or little) multicollinearity.

**Assumption 1 — Linearity.** There is a linear relationship between the independent variables and the dependent variable; changes in inputs lead to **proportional** changes in the output. It does **not** mean every point lies exactly on a line — the **central trend** should be well represented by a straight line (or a linear combination of features).

*How to check:* (1) scatter plots of y against each x; (2) **residuals vs predicted values** — should be randomly scattered around 0 (a **U-shape** signals non-linearity); (3) add polynomial terms and compare fit — a big improvement suggests linearity was violated.

*If it fails:* transformations (log, square root, …) or polynomial terms.`,
    formulas: [{ name: 'Residual', tex: R`e_i = y_i - \hat y_i`, sym: 'Plotted against $\\hat y_i$ for diagnostics.', when: 'All residual plots.' }],
    plots: [
      { id: 'P08-linearity', title: 'Linearity satisfied vs violated', notice: 'Left: a straight central trend with scatter. Right: a curved trend — a line will be systematically wrong at the ends and middle.',
        spec: (function () { const a = [], b = []; for (let i = 0; i < 30; i++) { const x = 0.3 * i; a.push([x, 2 + 1.1 * x + g() * 0.9]); b.push([x, 1 + 0.15 * x * x + g() * 0.6]); }
          return { type: 'multi', panels: [{ type: 'xy', w: 300, h: 240, title: 'Linear relationship', xlim: [0, 9], ylim: [0, 14], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: a, c: 's1', r: 3.5 }, { t: 'fn', f: x => 2 + 1.1 * x, c: 's3' }] }, { type: 'xy', w: 300, h: 240, title: 'Non-linear relationship', xlim: [0, 9], ylim: [0, 14], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: b, c: 's4', r: 3.5 }, { t: 'fn', f: NUM.polyfit(b.map(p => p[0]), b.map(p => p[1]), 1), c: 's7', dash: true }] }] }; })() },
      { id: 'P08-resid-u', title: 'Residuals vs ŷ: random (good) vs U-shape (linearity violated)', notice: 'A U-shaped band means the model misses a curve: add x² or transform.',
        spec: { type: 'multi', panels: [{ type: 'xy', w: 300, h: 230, title: 'Random around 0', xlim: [8, 54], ylim: [-8, 10], xlabel: 'ŷ', ylabel: 'e', series: [{ t: 'scatter', pts: resGood, c: 's3', r: 3 }, { t: 'hline', y: 0, c: 'fg', dash: true }] }, { type: 'xy', w: 300, h: 230, title: 'U-shape', xlim: [8, 54], ylim: [-8, 12], xlabel: 'ŷ', ylabel: 'e', series: [{ t: 'scatter', pts: resU, c: 's4', r: 3 }, { t: 'hline', y: 0, c: 'fg', dash: true }] }] } }
    ],
    examples: [{ title: 'Residual pattern of the line on the stipend data (worked)', body: R`Line $\hat y = -7.7 + 12.85x$: predictions 18, 43.7, 69.4, 95.1, 120.8 → residuals +6, −1.7, −7.4, −4.1, +7.2. Positive at both ends, negative in the middle: a **U** → linearity violated → add $x^2$.` }],
    traps: ['Linearity ≠ every point on the line; only the central trend.', 'Diagnose with **residuals vs ŷ** (or vs x), not with R² alone.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Residuals form a clear U-shape against ŷ. Which assumption is violated?', options: ['Linearity', 'Homoscedasticity', 'Normality', 'Autocorrelation'], answer: 0, sol: 'P2(a).', why: ['Correct.', 'That is a funnel.', 'That is a skewed histogram.', 'That is runs over time.'] },
      { type: 'mcq', diff: 'E', q: 'Linearity requires:', options: ['every point exactly on a line', 'the central trend to be well represented by a linear combination of features', 'normally distributed x', 'no outliers'], answer: 1, sol: 'P4(b) last row: False for "every point".', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Ways to fix a linearity violation (select all):', options: ['Log or square-root transformation', 'Add polynomial terms', 'Remove the intercept', 'Collect the same data again'], answer: [0, 1], sol: 'Section 5.', why: ['Correct.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'M', q: 'Line ŷ = −7.7 + 12.85x on point (6, 62). Residual (1 decimal)?', answer: -7.4, tol: 0.01, round: '1 decimal', verify: '62-(-7.7+12.85*6)', sol: '62 − 69.4 = **−7.4** (middle point below the line → U-pattern).' },
      { type: 'mcq', diff: 'M', q: 'How many key assumptions of linear regression does the worksheet list?', options: ['3', '4', '5', '7'], answer: 2, sol: 'Linearity, normality, homoscedasticity, no autocorrelation, no multicollinearity.', why: ['No.', 'No.', 'Correct.', 'No.'] }
    ],
    source: 'Worksheet L8 pp.5–6; ISLR §3.3.3.'
  },
  /* ---------------------------------------------------------------- L08.4 */
  {
    id: 'L08.4', title: 'Assumption 2 — Normality of residuals', badge: 'class', pages: '6–7', ws: 'Section 6',
    concept: R`
The residuals roughly follow a **normal distribution with mean 0 and variance σ²**: $\varepsilon \sim \mathcal N(0, \sigma^2)$.
- **Mean zero:** residuals centred around 0.
- **Normal:** most residuals are small; very large positive or negative ones are rare.

*How to check:* a **histogram of residuals** — bell-shaped and centred at 0? We do not expect a perfect bell; we check rough **symmetry** and that extreme errors are not too frequent. (Researched: a **Q–Q plot** is the sharper tool, L08.8.)

*If it fails:* transform the target (e.g. log y), gather more data, look for outliers or a missing feature.

Why it matters: normality underlies the usual **confidence intervals and p-values** for coefficients (inference). OLS predictions themselves do not need it.`,
    formulas: [{ name: 'Error model', tex: R`\varepsilon_i \sim \mathcal N(0,\ \sigma^2)\ \ \text{i.i.d.}`, sym: 'Mean 0, constant variance σ², independent.', when: 'Assumptions 2–4 in one line.' }],
    plots: [{ id: 'P08-hist', title: 'Residual histograms: roughly normal vs skewed', notice: 'Left: symmetric bell around 0 (good). Right: long right tail (problematic) — consider log-transforming y.',
      spec: { type: 'multi', panels: [{ type: 'xy', w: 300, h: 230, title: 'Roughly normal (good)', xlim: [-3.5, 3.5], ylim: [0, 70], xlabel: 'residual', ylabel: 'frequency', series: [{ t: 'bars', xs: hN.xs, ys: hN.ys, bw: hN.w * 0.92, c: 's3' }, { t: 'vline', x: 0, c: 'fg', dash: true }] }, { type: 'xy', w: 300, h: 230, title: 'Right-skewed (problematic)', xlim: [-1.5, 5.5], ylim: [0, 110], xlabel: 'residual', ylabel: 'frequency', series: [{ t: 'bars', xs: hS.xs, ys: hS.ys, bw: hS.w * 0.92, c: 's4' }, { t: 'vline', x: 0, c: 'fg', dash: true }] }] } }],
    examples: [{ title: 'Quick symmetry check (worked)', body: R`Residuals [−3, −1, 0, 1, 2, 9]: mean = 8/6 = 1.33, median = 0.5. Mean > median and one large positive value → right skew; the normality assumption is doubtful (and 9 may be an outlier).` }],
    traps: ['The assumption is about **residuals**, not about x or y themselves.', 'A roughly symmetric bell is enough; perfection is not expected.', 'Normality matters mainly for inference (CIs, p-values), less for prediction.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'The histogram of residuals is heavily right-skewed. Violated assumption?', options: ['Linearity', 'Normality of residuals', 'Homoscedasticity', 'Multicollinearity'], answer: 1, sol: 'P2(c).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Normality of residuals means ε ~', options: ['Uniform(0, 1)', 'N(0, σ²)', 'N(μ_y, 1)', 'Exponential'], answer: 1, sol: 'Section 6.', why: ['No.', 'Correct.', 'Mean must be 0.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'The worksheet\'s tool for checking normality is:', options: ['Residual vs time plot', 'Histogram of residuals', 'Correlation matrix', 'VIF'], answer: 1, sol: 'Summary table.', why: ['Autocorrelation.', 'Correct.', 'Multicollinearity.', 'Multicollinearity.'] },
      { type: 'int', diff: 'M', q: 'Residuals [−3, −1, 0, 1, 2, 9]. Mean minus median (2 decimals)?', answer: 0.83, tol: 0.01, round: '2 decimals', verify: '8/6-0.5', sol: '1.333 − 0.5 = **0.83** > 0 → right skew.' },
      { type: 'msq', diff: 'M', q: 'Remedies when residuals are clearly non-normal (select all):', options: ['Transform the target (e.g. log y)', 'Collect more data', 'Add an exact copy of a feature', 'Check for outliers'], answer: [0, 1, 3], sol: 'Summary table + common practice.', why: ['Correct.', 'Correct.', 'Creates multicollinearity.', 'Correct.'] }
    ],
    source: 'Worksheet L8 pp.6–7.'
  },
  /* ---------------------------------------------------------------- L08.5 */
  {
    id: 'L08.5', title: 'Assumption 3 — Homoscedasticity', badge: 'class', pages: '7', ws: 'Section 7',
    concept: R`
The **spread of the residuals should be constant** across all levels of the independent variables (and of $\hat y$). If the spread changes systematically → **heteroscedasticity** ("hetero" = different, "scedastic" = scatter).

*How to check:* scatter plot of **residuals vs predicted values**. Good: an even horizontal band. Bad: a **funnel** (spread grows or shrinks with $\hat y$).

*If it fails:* transformations — **log, square-root or inverse** — to stabilise the variance (e.g. income, house prices: errors grow with the size of the value).

Consequence: coefficient estimates stay unbiased, but their **standard errors are wrong**, so confidence intervals and p-values are unreliable.`,
    formulas: [{ name: 'Homoscedasticity', tex: R`\operatorname{Var}(\varepsilon_i \mid \mathbf x_i) = \sigma^2\ \ \text{for all } i`, sym: 'Constant error variance.', when: 'Funnel-shape questions.' }],
    plots: [{ id: 'P08-funnel', title: 'Homoscedastic band vs heteroscedastic funnel', notice: 'Right: residual spread grows with ŷ — a log transform of y often fixes this.',
      spec: { type: 'multi', panels: [{ type: 'xy', w: 300, h: 230, title: 'Homoscedastic (good)', xlim: [8, 54], ylim: [-12, 12], xlabel: 'ŷ', ylabel: 'e', series: [{ t: 'scatter', pts: resGood, c: 's3', r: 3 }, { t: 'hline', y: 0, c: 'fg', dash: true }] }, { type: 'xy', w: 300, h: 230, title: 'Heteroscedastic (funnel)', xlim: [8, 54], ylim: [-12, 12], xlabel: 'ŷ', ylabel: 'e', series: [{ t: 'scatter', pts: resFun, c: 's4', r: 3 }, { t: 'hline', y: 0, c: 'fg', dash: true }] }] } }],
    examples: [{ title: 'Why log helps (worked)', body: R`If errors are roughly ±10% of the value, a ₹10k salary has errors of ±1k and a ₹1L salary ±10k: a funnel. In log space, ±10% becomes ±log(1.1) ≈ ±0.095 for **every** salary: constant spread.` }],
    traps: ['Funnel = heteroscedasticity; U-shape = non-linearity. Do not mix them up.', 'Heteroscedasticity does not bias β, but it breaks standard errors.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Residual spread grows wider as ŷ increases (funnel). Violated assumption?', options: ['Linearity', 'Homoscedasticity', 'Normality', 'No autocorrelation'], answer: 1, sol: 'P2(b).', why: ['U-shape.', 'Correct.', 'Histogram.', 'Time runs.'] },
      { type: 'mcq', diff: 'E', q: '"Heteroscedasticity means unequal error spread across the prediction range."', options: ['True', 'False'], answer: 0, sol: 'P4(b) row 3: True — the definition.', why: ['Correct.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Remedy for heteroscedasticity in the worksheet:', options: ['Add more features', 'Log / square-root / inverse transformation', 'Remove the intercept', 'Use accuracy'], answer: 1, sol: 'Section 7.', why: ['Not the listed fix.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Which plot checks homoscedasticity?', options: ['Histogram of y', 'Residuals vs predicted values', 'Correlation heatmap', 'ROC curve'], answer: 1, sol: 'Section 7.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'M', q: 'Errors are ±10% of the value. In log space the error is about ±ln(1.1). Value (3 decimals)?', answer: 0.095, tol: 0.001, round: '3 decimals', verify: 'import math; math.log(1.1)', sol: 'ln 1.1 ≈ **0.095**, the same for every value → constant spread.' }
    ],
    source: 'Worksheet L8 p.7; Wooldridge ch.8.'
  },
  /* ---------------------------------------------------------------- L08.6 */
  {
    id: 'L08.6', title: 'Assumption 4 — No autocorrelation of errors', badge: 'class', pages: '7–8', ws: 'Section 8, P2',
    concept: R`
There should be **no correlation or pattern in the residuals**: one residual should not help predict the next. Especially important when data have a natural **order (time series)**.

If residuals move in a pattern (long runs above zero, then long runs below), the model has left structure unexplained — e.g. a trend or seasonality not captured.

*How to check:* plot **residuals vs time (or order)**. (Researched: the Durbin–Watson statistic, L08.8.)
*If it fails:* add time features (lags, trend, season — Lecture 13).

**PRACTICE P2 (answered):** (a) U-shaped residuals vs ŷ → **linearity**; (b) funnel → **homoscedasticity**; (c) right-skewed histogram → **normality**; (d) long runs of positive then negative residuals in a time series → **autocorrelation**.`,
    formulas: [{ name: 'Independence of errors', tex: R`\operatorname{Corr}(\varepsilon_t,\ \varepsilon_{t-1}) = 0`, sym: 'Lag-1 correlation of residuals.', when: 'Time-ordered data.' }],
    plots: [{ id: 'P08-autocorr', title: 'Residuals over time: random vs autocorrelated', notice: 'Right: long runs on one side of zero — each residual predicts the next (positive autocorrelation).',
      spec: { type: 'multi', panels: [{ type: 'xy', w: 300, h: 220, title: 'Independent (healthy)', xlim: [0, 61], ylim: [-4, 4], xlabel: 'time', ylabel: 'e', series: [{ t: 'line', pts: resGood.slice(0, 60).map((p, i) => [i + 1, p[1] * 0.6]), c: 's3', markers: true, mr: 2 }, { t: 'hline', y: 0, c: 'fg', dash: true }] }, { type: 'xy', w: 300, h: 220, title: 'Autocorrelated (pattern)', xlim: [0, 61], ylim: [-4, 4], xlabel: 'time', ylabel: 'e', series: [{ t: 'line', pts: resAuto, c: 's4', markers: true, mr: 2 }, { t: 'hline', y: 0, c: 'fg', dash: true }] }] } }],
    examples: [{ title: 'Spot it (worked)', body: R`Monthly sales residuals: + + + + + − − − − − + + + + +. Long runs ⇒ positive autocorrelation; the model probably misses seasonality. A random sequence would switch sign about half the time.` }],
    traps: ['Autocorrelation is about the **residuals** over order/time, not about correlation between features (that is multicollinearity).', 'Shuffled cross-sectional data rarely shows it; time series often does.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Residuals of a time-series model show long runs of positives followed by long runs of negatives. Violated assumption?', options: ['Normality', 'No autocorrelation', 'Homoscedasticity', 'Linearity'], answer: 1, sol: 'P2(d).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Autocorrelation is most important to check when:', options: ['data have a natural order (time series)', 'features are categorical', 'n is small', 'the target is binary'], answer: 0, sol: 'Section 8.', why: ['Correct.', 'No.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'The worksheet fix for autocorrelated errors is to:', options: ['remove features', 'add time features', 'standardise x', 'use MAPE'], answer: 1, sol: 'Summary table.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Match plots to assumptions — select all **correct** pairs.', options: ['Funnel → homoscedasticity', 'Skewed histogram → normality', 'U-shape → autocorrelation', 'Runs over time → autocorrelation'], answer: [0, 1, 3], sol: 'U-shape → linearity.', why: ['Correct.', 'Correct.', 'Wrong.', 'Correct.'] },
      { type: 'int', diff: 'M', q: 'Residual signs over 15 months: 5 positive, then 5 negative, then 5 positive. How many sign changes?', answer: 2, tol: 0, round: 'Exact', verify: '2', sol: '**2** changes in 14 transitions — far fewer than ~7 expected if independent.' }
    ],
    source: 'Worksheet L8 pp.7–8.'
  },
  /* ---------------------------------------------------------------- L08.7 */
  {
    id: 'L08.7', title: 'Assumption 5 — Multicollinearity; proof that XᵀX is singular', badge: 'class', pages: '8–13', ws: 'Sections 9–10, P3, P4',
    concept: R`
**Multicollinearity:** two or more independent variables are **highly correlated** (strong linear relationship), so it is hard to isolate each variable's individual effect.

**9.1 Setup.** $Y = \beta_0 + \beta_1X_1 + \beta_2X_2 + \varepsilon_1$. If $X_1 = a_0 + a_1X_2 + \varepsilon_2$, substituting gives $Y \approx C_0 + C_1X_2 + \varepsilon_3$: effectively Y depends on $X_2$ alone, and the split between $\beta_1$ and $\beta_2$ is not identifiable.

:::key 9.2 Inference vs prediction
**Inference:** multicollinearity is bad — $\beta_1, \beta_2$ become unreliable. **Prediction only:** usually less harmful — the model may still predict well, though individual coefficients cannot be trusted.
:::

**9.3 Perfect multicollinearity:** $X_1 = a_0 + a_1X_2$ exactly (no error) → $X^TX$ singular → $\hat\beta = (X^TX)^{-1}X^Ty$ does not exist (proof below).

**9.5 Numerical example.** $X = \begin{bmatrix}1&1&2\\1&2&3\\1&3&4\end{bmatrix}$, column 3 = column 1 + column 2. $X^TX = \begin{bmatrix}3&6&9\\6&14&20\\9&20&29\end{bmatrix}$, $\det = 3(406 - 400) - 6(174 - 180) + 9(120 - 126) = 18 + 36 - 54 = $ **0** → singular.

**PRACTICE P3 — multicollinearity detective** (sales from visitors $X_1$, page views $X_2$, marketing spend $X_3$, ad clicks $X_4$, temperature $X_5$). (a) Likely pairs: **$X_1$ & $X_2$** (more visitors → more page views); **$X_3$ & $X_4$** (spend drives clicks). (b) corr($X_1, X_2$) = 0.98 with $\beta_1 = 15.2$, $\beta_2 = -14.8$: coefficients are **unstable and nearly cancel**; individually unreliable. (c) Only prediction → **no** big worry. (d) $X_4 = 0.5X_3$ exactly → **perfect multicollinearity**, $X^TX$ singular, det = 0, OLS cannot compute $\hat\beta$.

**PRACTICE P4.** (a) U-shaped scatter → **C (add polynomial terms)**; correlation > 0.95 → **D (remove one feature)**; spread widens with ŷ → **B (log/sqrt)**; are residuals bell-shaped? → **A (histogram)**. (b) Poly needs a different algorithm **F**; R² up when adding x³ means x³ always useful **F**; heteroscedasticity = unequal spread **T**; multicollinearity always makes predictions inaccurate **F**; linearity needs every point on a line **F**. (c) "det = 1 so invertible" — **wrong**: det = 0, singular. (d) Square footage, rooms and total room area (= sq ft × fraction) → the third is a linear combination → multicollinearity, $X^TX$ may be singular.

| Assumption | What it says | Check | If violated |
|---|---|---|---|
| Linearity | linear relation x → y | scatter / residual plots | transformations, polynomial terms |
| Normality | residuals ~ N(0, σ²) | histogram of residuals | transform target, more data |
| Homoscedasticity | constant residual spread | residual vs ŷ | log / sqrt transform |
| No autocorrelation | residuals independent | residual vs time | add time features |
| No multicollinearity | features not highly correlated | correlation matrix, VIF | drop or combine features |`,
    deriv: [{ id: 'D08-singular', title: 'Dependent columns ⇒ XᵀX is singular', badge: 'class',
      steps: [
        { m: R`\exists\ \mathbf c \neq \mathbf 0:\quad X\mathbf c = \mathbf 0`, t: 'Step 1: columns of X are linearly dependent.' },
        { m: R`X^TX\mathbf c = X^T\mathbf 0`, why: 'Step 2: multiply both sides by $X^T$.' },
        { m: R`X^TX\mathbf c = \mathbf 0`, why: 'Step 3.' },
        { m: R`\mathbf c \neq \mathbf 0 \Rightarrow X^TX \text{ has dependent columns}`, why: 'Step 4: it maps a non-zero vector to zero.' },
        { m: R`X^TX \text{ is singular} \iff \det(X^TX) = 0`, why: 'Steps 5–6.' }
      ],
      result: R`(X^TX)^{-1}\ \text{does not exist}`,
      after: 'Example: c = [1, 1, −1] for the 3×3 X above (col1 + col2 − col3 = 0). The converse also holds: if $X^TX\\mathbf c = 0$ then $\\mathbf c^TX^TX\\mathbf c = \\|X\\mathbf c\\|^2 = 0$, so $X\\mathbf c = 0$.' }],
    formulas: [{ name: 'Perfect multicollinearity', tex: R`X\mathbf c = \mathbf 0,\ \mathbf c\neq\mathbf 0 \Rightarrow \det(X^TX) = 0`, sym: '', when: 'Proof questions.' }, { name: 'Near multicollinearity', tex: R`|\operatorname{corr}(X_j, X_k)| \approx 1`, sym: 'Unstable, large, opposite-sign coefficients.', when: 'P3(b)-type questions.' }],
    examples: [{ title: 'Unstable coefficients (worked, from the code)', body: R`Two nearly identical features, two resamples of the same data: sample 1 gives $b_1 = 31.99$, $b_2 = -29.01$; sample 2 gives $b_1 = -1.92$, $b_2 = 4.85$. The **sums** are stable (2.98, 2.93) and so are predictions (14.88 vs 14.86 at x = 5) — prediction fine, inference meaningless.` }],
    code: [{ title: 'Singular XᵀX, unstable coefficients, VIF by hand', scratch: 'L08_multicollinearity_scratch.py' }],
    traps: ['Multicollinearity hurts **inference** (coefficients) more than **prediction**.', 'det = **0** (not 1) for perfect multicollinearity.', 'A scaled copy ($X_4 = 0.5X_3$) is perfectly collinear just like a sum.'],
    questions: [
      { type: 'int', diff: 'M', q: R`Compute $\det\begin{bmatrix}3&6&9\\6&14&20\\9&20&29\end{bmatrix}$.`, answer: 0, tol: 1e-9, round: 'Exact', verify: '3*(14*29-20*20)-6*(6*29-20*9)+9*(6*20-14*9)', sol: '3(6) − 6(−6) + 9(−6) = 18 + 36 − 54 = **0**.' },
      { type: 'mcq', diff: 'E', q: 'If the goal is **prediction only**, multicollinearity is:', options: ['catastrophic', 'usually less harmful; coefficients may be unreliable but predictions fine', 'irrelevant to coefficients', 'always fixed by GD'], answer: 1, sol: 'Key insight 9.2; P3(c).', why: ['No.', 'Correct.', 'Coefficients are affected.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'corr(X₁, X₂) = 0.98, β₁ = 15.2, β₂ = −14.8. What is wrong?', options: ['Nothing', 'Coefficients are unstable and nearly cancel — individually unreliable', 'The model underfits', 'Learning rate too high'], answer: 1, sol: 'P3(b).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'In the proof, after Xc = 0 with c ≠ 0 we multiply by Xᵀ to get:', options: ['XᵀXc = 0, so XᵀX is singular', 'c = 0', 'det(XᵀX) = 1', 'X is invertible'], answer: 0, sol: 'Steps 2–5.', why: ['Correct.', 'Contradicts c ≠ 0.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'A U-shaped scatter of y vs x. Best action (P4)?', options: ['Check histogram', 'Log transform', 'Add polynomial terms', 'Remove a correlated feature'], answer: 2, sol: '1 → C.', why: ['That is for normality.', 'For funnels.', 'Correct.', 'For multicollinearity.'] },
      { type: 'msq', diff: 'M', q: 'Which feature pairs in P3 are likely collinear? (select all)', options: ['Visitors & page views', 'Marketing spend & ad clicks', 'Temperature & page views', 'Visitors & temperature'], answer: [0, 1], sol: 'P3(a).', why: ['Correct.', 'Correct.', 'No obvious link.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[1, 1, 2], [1, 2, 3], [1, 3, 4]])
print((X.T @ X).tolist(), np.linalg.matrix_rank(X.T @ X))`, answer: '[[3, 6, 9], [6, 14, 20], [9, 20, 29]] 2', sol: 'Worksheet 9.5 matrix; rank 2 < 3 → singular.' }
    ],
    source: 'Worksheet L8 pp.8–13; Wooldridge §3.4.'
  },
  /* ---------------------------------------------------------------- L08.8 */
  {
    id: 'L08.8', title: 'Formal assumption tests: VIF, Durbin–Watson, Q–Q, Breusch–Pagan', badge: 'res', pages: '–', ws: 'Researched (summary table mentions VIF)',
    concept: R`
The worksheet checks assumptions with plots and names VIF once. Statistics courses (and GATE DA) use formal versions:

| Assumption | Test / diagnostic | Read it as |
|---|---|---|
| Multicollinearity | **VIF** $= \frac{1}{1-R_j^2}$, where $R_j^2$ is from regressing feature j on the other features | 1 = none; > 5 concerning; **> 10 serious** |
| Autocorrelation | **Durbin–Watson** $DW = \frac{\sum_{t=2}^n(e_t - e_{t-1})^2}{\sum_{t=1}^n e_t^2} \approx 2(1-\hat\rho)$ | ≈ 2 none; **< 2 positive** (near 0 strong); > 2 negative |
| Normality | **Q–Q plot** (sample vs theoretical quantiles); Shapiro–Wilk, Jarque–Bera | points on the 45° line = normal; p < 0.05 → reject normality |
| Homoscedasticity | **Breusch–Pagan** (regress $e^2$ on the features) | p < 0.05 → heteroscedastic |

**Tolerance** = 1/VIF = $1 - R_j^2$.`,
    formulas: [{ name: 'Variance inflation factor', tex: R`\text{VIF}_j = \frac{1}{1-R_j^2}`, sym: '$R_j^2$: feature j on the others.', when: 'Quantifying multicollinearity.' }, { name: 'Durbin–Watson', tex: R`DW = \frac{\sum_{t=2}^{n}(e_t-e_{t-1})^2}{\sum_{t=1}^{n}e_t^2}\in[0,4]`, sym: '≈ 2(1 − ρ̂₁).', when: 'Autocorrelation.' }],
    plots: [{ id: 'P08-qq', title: 'Q–Q plot: normal vs right-skewed residuals', notice: 'Normal residuals hug the line; skewed residuals curve upward at the right end.',
      spec: (function () { const n = 60, q = i => { const p = (i + 0.5) / n; const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p)); const z = t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t ** 3); return p < 0.5 ? -z : z; };
        const a = histN.slice(0, n).sort((x, y) => x - y), b = histS.slice(0, n).sort((x, y) => x - y), mb = NUM.mean(b), sb = Math.sqrt(NUM.mean(b.map(v => (v - mb) ** 2)));
        return { type: 'xy', w: 420, h: 330, xlim: [-2.6, 2.6], ylim: [-3, 4.5], xlabel: 'theoretical normal quantile', ylabel: 'standardised residual quantile', legend: 'tl', series: [{ t: 'fn', f: x => x, c: 'fg', dash: true }, { t: 'scatter', pts: a.map((v, i) => [q(i), v]), c: 's3', r: 3, label: 'normal' }, { t: 'scatter', pts: b.map((v, i) => [q(i), (v - mb) / sb]), c: 's4', r: 3, m: 's', label: 'skewed' }] }; })() }],
    examples: [{ title: 'VIF and DW by hand (worked)', body: R`Regressing $x_1$ on the other features gives $R_1^2 = 0.95$ → VIF = 1/0.05 = **20** (serious).
Residuals [1, 1, −1, −1]: differences 0, −2, 0 → numerator 4; $\sum e^2 = 4$ → DW = **1.0** (< 2: positive autocorrelation).` }],
    code: [{ title: 'Durbin–Watson, Breusch–Pagan, Jarque–Bera, VIF with statsmodels', lib: 'L08_assumption_tests_statsmodels.py', libLabel: 'statsmodels' }],
    traps: ['DW < 2 means **positive** autocorrelation (not negative).', 'VIF uses R² of a feature on the **other features**, not on y.'],
    questions: [
      { type: 'int', diff: 'E', q: 'R²_j = 0.9. VIF?', answer: 10, tol: 0.001, round: 'Exact', verify: '1/(1-0.9)', sol: '1/0.1 = **10**.' },
      { type: 'int', diff: 'M', q: 'Residuals [1, 1, −1, −1]. Durbin–Watson statistic?', answer: 1, tol: 0.001, round: 'Exact', verify: '((1-1)**2+(-1-1)**2+(-1+1)**2)/4', sol: '4/4 = **1.0**.' },
      { type: 'mcq', diff: 'M', tag: 'GATE-style', q: 'A Durbin–Watson value near 0.4 suggests:', options: ['no autocorrelation', 'strong positive autocorrelation', 'strong negative autocorrelation', 'heteroscedasticity'], answer: 1, sol: 'DW ≈ 2(1 − ρ) → ρ ≈ 0.8.', why: ['That is ≈ 2.', 'Correct.', 'That is near 4.', 'Different test.'] },
      { type: 'mcq', diff: 'M', q: 'Breusch–Pagan p-value = 0.001. Conclusion?', options: ['Residuals are normal', 'Heteroscedasticity is present', 'No multicollinearity', 'Linearity holds'], answer: 1, sol: 'p < 0.05 rejects constant variance.', why: ['Wrong test.', 'Correct.', 'Wrong test.', 'Wrong test.'] },
      { type: 'int', diff: 'E', q: 'VIF = 4. Tolerance?', answer: 0.25, tol: 0.001, round: '2 decimals', verify: '1/4', sol: '1/VIF = **0.25**.' }
    ],
    researched: R`Not covered in class. Sources: Wooldridge, *Introductory Econometrics* (ch.3, 8, 12); statsmodels docs (\`durbin_watson\`, \`het_breuschpagan\`, \`variance_inflation_factor\`).`,
    source: 'Wooldridge; statsmodels docs.'
  }
  ]
});
})();
