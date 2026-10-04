/* Lecture 12 — Regularization: Ridge (L2) and Lasso (L1) */
(function () {
// small dataset for the 2-D ridge fits
const X = [1, 2, 3, 4, 5, 6], Y = [3.1, 3.9, 5.2, 5.8, 7.1, 16];
const mx = NUM.mean(X), my = NUM.mean(Y);
let Sxy = 0, Sxx = 0; X.forEach((x, i) => { Sxy += (x - mx) * (Y[i] - my); Sxx += (x - mx) ** 2; });
const ridgeLine = l => { const m = Sxy / (Sxx + l); return x => my + m * (x - mx); };
// ridge path for X^T X = [[4,2],[2,4]], X^T y = [10,6]
const rp = l => { const a = 4 + l, d = a * a - 4; return [(a * 10 - 2 * 6) / d, (-2 * 10 + a * 6) / d]; };
const lams = NUM.linspace(0, 30, 121);
// constraint geometry helper: find the minimiser of an elliptic quadratic on a boundary curve
function tangent(c, rx, ry, rotDeg, boundary) {
  const th = rotDeg * Math.PI / 180, q = p => { const dx = p[0] - c[0], dy = p[1] - c[1], u = dx * Math.cos(th) + dy * Math.sin(th), v = -dx * Math.sin(th) + dy * Math.cos(th); return u * u / (rx * rx) + v * v / (ry * ry); };
  let best = null; boundary.forEach(p => { const v = q(p); if (!best || v < best.v) best = { p, v }; });
  const s = Math.sqrt(best.v); return { pt: best.p, ell: [1, 1.6, 2.3].map(k => ({ t: 'ellipse', cx: c[0], cy: c[1], rx: rx * s * k, ry: ry * s * k, rot: rotDeg, c: 's4', w: k === 1 ? 2 : 1 })) };
}
const circ = [], diam = []; for (let i = 0; i < 720; i++) { const a = 2 * Math.PI * i / 720; circ.push([1.5 * Math.cos(a), 1.5 * Math.sin(a)]); }
for (let i = 0; i <= 400; i++) { const t = -1.5 + 3 * i / 400; diam.push([t, 1.5 - Math.abs(t)], [t, -(1.5 - Math.abs(t))]); }
const OLS = [1.6, 2.9], TR = tangent(OLS, 1.7, 0.75, -35, circ), TL = tangent(OLS, 1.7, 0.75, -35, diam);
const geo = (title, region, T, lbl) => ({ type: 'xy', w: 320, h: 320, title, xlim: [-2, 4], ylim: [-2, 4.5], xlabel: 'w₁', ylabel: 'w₂', series: [region, ...T.ell, { t: 'scatter', pts: [OLS], c: 'fg', r: 4, labels: ['ŵ_OLS'] }, { t: 'scatter', pts: [T.pt], c: 's3', r: 6, labels: [lbl] }] });
LECTURES.push({
  num: 12, short: 'Regularization', title: 'Regularization (L1 and L2) — overfitting, Ridge, Lasso, sparsity, choosing λ',
  file: 'AML_Lecture 12_Worksheet_Filled.pdf', pages: 22,
  intro: R`**Exam weight: very high.** Large coefficients = overfitting symptom; **Ridge** loss $\sum e^2 + \lambda m^2$ and the 2-D slope $m = \frac{S_{xy}}{S_{xx}+\lambda}$; $\beta = (X^TX + \lambda I)^{-1}X^Ty$; six Ridge properties (never exactly 0, big coefficients shrink most, bias↑ variance↓, shifting parabola, circle, N ≥ 2); **Lasso** $\lambda\sum|w_j|$, **sparsity**, λ in the **numerator** vs **denominator**; diamond vs circle; CV for λ; **standardise**, **don't penalise the intercept**. About 2 hours.`,
  units: [
  /* ---------------------------------------------------------------- L12.1 */
  {
    id: 'L12.1', title: 'Overfitting, coefficient explosion, what regularization is', badge: 'class', pages: '1–3', ws: 'Part I',
    concept: R`
:::hook Hook
When a model fits every noisy point, its slope becomes abnormally large and it fails to generalise. Regularization prevents this by **constraining coefficients**.
:::

**Overfitting** = excellent on training data, poor on unseen data; **high variance, low bias** — the model memorises noise. (Common slip: reversing the terms.)

**Geometric intuition.** An overfitted line contorts to pass through every point; it becomes hypersensitive to tiny changes in x, the slope can head toward infinity. **Abnormally large coefficients are a strong sign of overfitting.**

**Coefficient explosion in action** (house price in lakhs vs area in 1000 sq ft):

| | Model A: $y = 2x + 10$ | Model B: $y = 30x - 18$ |
|---|---|---|
| prediction at x = 1.0 | 12 | 12 |
| prediction at x = 1.5 | 13 | 27 |
| Δy for Δx = 0.5 | **1** | **15** |

Model B is hypersensitive (high variance) because of its large slope.

*Question:* what does a slope of **m = 4500** say about generalisation? Even Δx = 0.01 changes the prediction by **45**; the model has memorised noise and will be wildly inconsistent on new data (large slope → sensitivity → high variance → poor generalisation).

:::key Key insight
Large coefficients are the **symptom** of overfitting. We need a mechanism that controls coefficient magnitudes.
:::

**Regularization** = add a **penalty term** to the loss that discourages unnecessarily large coefficients. It is the fundamental control for parametric models (linear and logistic regression, perceptrons).

| Method | Mechanism |
|---|---|
| **Ridge (L2)** | constrains coefficient magnitudes (prevents exploding slopes) |
| **Lasso (L1)** | constrains coefficients **and** performs automatic feature selection |
| Elastic Net | combines L1 and L2 (out of scope) |`,
    formulas: [{ name: 'Regularized loss (general)', tex: R`J(\mathbf w) = \underbrace{\sum_i (y_i - \hat y_i)^2}_{\text{fit}} + \lambda\,\underbrace{R(\mathbf w)}_{\text{penalty}}`, sym: 'R = Σw² (Ridge) or Σ|w| (Lasso); λ ≥ 0 hyperparameter.', when: 'All of L12.' }, { name: 'Sensitivity', tex: R`\Delta\hat y = m\,\Delta x`, sym: '', when: 'Slope 4500 question.' }],
    plots: [
      { id: 'P12-steep', title: 'Simple gentle trend vs an overfit steep model', notice: 'The overfit curve chases every point; between and beyond the points its predictions swing wildly.',
        spec: (function () { const px = [0.5, 1.2, 2, 2.7, 3.4, 4.2, 5, 5.6], py = [45, 52, 50, 61, 58, 70, 66, 78], f = NUM.polyfit(px.map(v => v / 6), py, 7); return { type: 'xy', w: 520, h: 290, xlim: [0, 6], ylim: [20, 110], xlabel: 'study hours', ylabel: 'exam score', legend: 'tl', series: [{ t: 'scatter', pts: px.map((x, i) => [x, py[i]]), c: 'fg' }, { t: 'fn', f: NUM.polyfit(px, py, 1), c: 's3', label: 'simple model (gentle trend)' }, { t: 'fn', f: x => f(x / 6), c: 's4', label: 'overfit model (huge coefficients)', n: 400 }] }; })() },
      { id: 'P12-modelAB', title: 'Model A (m = 2) vs Model B (m = 30)', notice: 'Same prediction at x = 1, but a step of 0.5 changes A by 1 and B by 15.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [0.5, 2.5], ylim: [0, 60], xlabel: 'area (1000 sq ft)', ylabel: 'predicted price (lakhs)', legend: 'tl', series: [{ t: 'fn', f: x => 2 * x + 10, c: 's3', label: 'A: y = 2x + 10' }, { t: 'fn', f: x => 30 * x - 18, c: 's4', label: 'B: y = 30x − 18' }, { t: 'seg', segs: [[1.5, 13, 1.5, 27]], c: 's7', dash: true }, { t: 'text', x: 1.72, y: 20, s: 'Δy = 15 vs 1' }] } }
    ],
    examples: [{ title: 'Sensitivity arithmetic (worked)', body: R`m = 4500, Δx = 0.01 → Δŷ = 45. m = 2, Δx = 0.01 → Δŷ = 0.02. A measurement error of 1% of a unit moves model 1 by 45 units of target: unusable predictions.` }],
    traps: ['Overfitting = **high variance, low bias** (not the reverse).', 'Elastic Net is out of scope for this lecture.'],
    questions: [
      { type: 'int', diff: 'E', q: 'Model B: y = 30x − 18. Change in prediction when x goes from 1.0 to 1.5?', answer: 15, tol: 0, round: 'Exact', verify: '30*0.5', sol: '30 × 0.5 = **15** (model A: 1).' },
      { type: 'int', diff: 'E', q: 'Slope m = 4500. Change in prediction for Δx = 0.01?', answer: 45, tol: 0, round: 'Exact', verify: '4500*0.01', sol: '**45**.' },
      { type: 'mcq', diff: 'E', q: 'An overfitted model has:', options: ['high bias, low variance', 'high variance, low bias', 'low bias, low variance', 'high bias, high variance'], answer: 1, sol: 'Part I.', why: ['Underfit.', 'Correct.', 'Ideal.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Which modification discourages large coefficients?', options: ['Subtract coefficient values from the loss', 'Add a penalty proportional to squared coefficients', 'Multiply the loss by the number of features', 'Remove the intercept'], answer: 1, sol: 'Worksheet option (B).', why: ['Encourages larger ones.', 'Correct.', 'Irrelevant.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Which method performs automatic feature selection?', options: ['Ridge', 'Lasso', 'OLS', 'Polynomial regression'], answer: 1, sol: 'Types table.', why: ['Shrinks only.', 'Correct.', 'No.', 'No.'] }
    ],
    source: 'Worksheet L12 pp.1–3; ESL §3.4.'
  },
  /* ---------------------------------------------------------------- L12.2 */
  {
    id: 'L12.2', title: 'Ridge in 2-D: loss, closed-form slope, bias–variance mechanism', badge: 'class', pages: '3–5', ws: 'Part II (2-D)',
    concept: R`
OLS cost: $L_{OLS} = \sum(y_i - \hat y_i)^2$. **Ridge** appends a penalty on the squared slope:
$$L_{Ridge} = \sum_{i=1}^n(y_i - mx_i - c)^2 + \lambda m^2,\qquad \lambda \ge 0\ \text{(hyperparameter)}$$

**Mechanism.** (1) With λ = 0 (plain OLS), driving training error down can push m very large. (2) With λ > 0, a large m makes $\lambda m^2$ explode, so the total loss is high. Deriving the minimum (below) gives
$$m_{Ridge} = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2 + \lambda} = \frac{S_{xy}}{S_{xx} + \lambda},\qquad c = \bar y - m\bar x$$
(3) **Compromise:** λ sits in the **denominator**; as λ grows the numerator is fixed, so m shrinks — the optimiser accepts a little more training error (**slight bias**) to shrink m drastically. (4) **Result:** a flatter, smoother line, far less sensitive to noise and outliers → **much lower variance** → better generalisation.

| What happens | Bias | Variance | Net |
|---|---|---|---|
| m shrunk toward 0 | increases slightly | decreases significantly | better generalisation (variance drop > bias rise) |

(Common slip: thinking **both** decrease. Only variance does.)

**Three regimes of λ**

| λ | slope | regime |
|---|---|---|
| 0 | high; standard OLS | overfitting |
| optimal | moderate; main trend | good fit |
| → ∞ | m ≈ 0; flat line | underfitting |`,
    deriv: [{ id: 'D12-ridge2d', title: 'Closed-form Ridge slope in 2-D', badge: 'class',
      steps: [
        { m: R`L = \sum_i(y_i - mx_i - c)^2 + \lambda m^2`, t: 'Ridge loss (only the slope is penalised).' },
        { m: R`\frac{\partial L}{\partial c} = -2\sum_i(y_i - mx_i - c) = 0 \Rightarrow c = \bar y - m\bar x`, why: 'Step 1: same as OLS — the penalty has no c.' },
        { m: R`L(m) = \sum_i\big[(y_i-\bar y) - m(x_i-\bar x)\big]^2 + \lambda m^2`, why: 'Step 2: substitute c.' },
        { m: R`\frac{dL}{dm} = -2\sum_i(x_i-\bar x)\big[(y_i-\bar y) - m(x_i-\bar x)\big] + 2\lambda m = 0`, why: 'Step 3: chain rule; derivative of λm² is 2λm.' },
        { m: R`-\sum(x_i-\bar x)(y_i-\bar y) + m\sum(x_i-\bar x)^2 + \lambda m = 0`, why: 'Divide by 2 and expand.' },
        { m: R`m\Big(\sum(x_i-\bar x)^2 + \lambda\Big) = \sum(x_i-\bar x)(y_i-\bar y)`, why: 'Group the m terms.' }
      ], result: R`m_{Ridge} = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2 + \lambda}`, after: 'λ = 0 recovers the OLS slope of Lecture 3.' }],
    formulas: [{ name: 'Ridge loss (2-D)', tex: R`L_{Ridge} = \sum(y_i - mx_i - c)^2 + \lambda m^2`, sym: '', when: 'Definition.' }, { name: 'Ridge slope', tex: R`m_{Ridge} = \frac{S_{xy}}{S_{xx} + \lambda}`, sym: 'λ in the denominator.', when: 'Hand numericals.' }],
    plots: [{ id: 'P12-lambdafits', title: 'The same data fitted with λ = 0, 30 and 3000', notice: 'λ = 0: OLS is dragged by the high last point (steep). Moderate λ: flatter, robust trend. Huge λ: almost the flat mean line — underfitting.',
      spec: { type: 'multi', panels: [0, 30, 3000].map((l, k) => ({ type: 'xy', w: 260, h: 230, title: ['λ = 0 (overfitting)', 'λ = 30 (good fit)', 'λ = 3000 (underfitting)'][k], xlim: [0, 7], ylim: [0, 18], xlabel: 'x', ylabel: 'y', series: [{ t: 'scatter', pts: X.map((x, i) => [x, Y[i]]), c: 'fg', r: 3.5 }, { t: 'fn', f: ridgeLine(l), c: ['s4', 's3', 's7'][k], w: 2.5 }, { t: 'text', x: 2.3, y: 16, s: 'm = ' + (Sxy / (Sxx + l)).toFixed(2) }] })) } }],
    examples: [{ title: 'Ridge slope for several λ (worked, matches the code)', body: R`x = [1..5], y = [2, 4, 5, 4, 5]: $S_{xy} = 6$, $S_{xx} = 10$, $\bar x = 3$, $\bar y = 4$.
| λ | m = 6/(10 + λ) | c = 4 − 3m |
|---|---|---|
| 0 | 0.600 | 2.200 |
| 1 | 0.545 | 2.364 |
| 10 | 0.300 | 3.100 |
| 100 | 0.0545 | 3.836 |
| 10⁶ | 0.000006 | 4.000 |
m never reaches 0; c tends to ȳ = 4 (the mean line).` }],
    code: [{ title: 'Ridge slope vs λ by hand', scratch: 'L12_ridge_lasso_scratch.py' }],
    traps: ['Ridge raises **bias** slightly and lowers **variance**; it does not lower both.', 'The intercept formula is unchanged: c = ȳ − m x̄.', 'Training error **increases** with λ; test error usually falls first.'],
    questions: [
      { type: 'int', diff: 'M', q: 'Sxy = 6, Sxx = 10, λ = 10. Ridge slope?', answer: 0.3, tol: 0.0001, round: '2 decimals', verify: '6/(10+10)', sol: '6/20 = **0.3**.' },
      { type: 'int', diff: 'M', q: 'Same data (x̄ = 3, ȳ = 4), λ = 10. Intercept c?', answer: 3.1, tol: 0.0001, round: '1 decimal', verify: '4-3*0.3', sol: '4 − 3 × 0.3 = **3.1**.' },
      { type: 'mcq', diff: 'E', q: 'When Ridge shrinks m, bias ___ and variance ___.', options: ['decreases, decreases', 'increases slightly, decreases significantly', 'decreases, increases', 'unchanged, unchanged'], answer: 1, sol: 'Compromise table.', why: ['Misconception.', 'Correct.', 'Opposite.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'λ → ∞ in 2-D Ridge gives:', options: ['the OLS line', 'a nearly flat line at ȳ (underfitting)', 'a vertical line', 'exactly m = 0 at finite λ'], answer: 1, sol: 'Regimes table.', why: ['That is λ = 0.', 'Correct.', 'No.', 'Never exactly at finite λ.'] },
      { type: 'mcq', diff: 'M', q: 'In the Ridge derivation, the derivative of λm² w.r.t. m is:', options: ['λ', '2λm', 'λm', '2m'], answer: 1, sol: 'Step 3.', why: ['No.', 'Correct.', 'No.', 'Missing λ.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`Sxy, Sxx = 6.0, 10.0
print([round(Sxy / (Sxx + l), 4) for l in [0, 1, 10, 100]])`, answer: '[0.6, 0.5455, 0.3, 0.0545]', sol: '6/10, 6/11, 6/20, 6/110.' }
    ],
    source: 'Worksheet L12 pp.3–5; ESL §3.4.1.'
  },
  /* ---------------------------------------------------------------- L12.3 */
  {
    id: 'L12.3', title: 'Multiple Ridge regression: the Ridge normal equation', badge: ['class', 'res'], pages: '6, 9', ws: 'Part II (N-dim), P1(b) + researched derivation',
    concept: R`
For p features:
$$\boldsymbol\beta_{ridge} = (X^TX + \lambda I)^{-1}X^T\mathbf y\qquad\text{vs}\qquad \boldsymbol\beta_{OLS} = (X^TX)^{-1}X^T\mathbf y$$
(the worksheet calls the derivation out of scope; it is below as a researched extra.)

**Why it handles multicollinearity:** adding $\lambda I$ makes the matrix **always invertible** for λ > 0 — even when $X^TX$ is singular or nearly so. (Every eigenvalue of $X^TX$ is ≥ 0; adding λ makes all of them ≥ λ > 0.)

The 2-D example was for simplicity; the practical value of Ridge appears with **N ≥ 2** features.

**PRACTICE P1(b).** $X^TX = \begin{bmatrix}4&2\\2&4\end{bmatrix}$, $X^T\mathbf y = [10, 6]^T$, λ = 2.
- (i) $X^TX + \lambda I = \begin{bmatrix}6&2\\2&6\end{bmatrix}$.
- (ii) det = 36 − 4 = 32; inverse $= \frac{1}{32}\begin{bmatrix}6&-2\\-2&6\end{bmatrix}$; $\boldsymbol\beta_{ridge} = \frac{1}{32}[60 - 12,\ -20 + 36]^T = \frac{1}{32}[48, 16]^T = $ **[1.5, 0.5]**.
- (iii) OLS: det = 16 − 4 = 12; $\boldsymbol\beta_{OLS} = \frac{1}{12}[40 - 12,\ -20 + 24]^T = \frac1{12}[28, 4]^T = $ **[2.33, 0.33]**.
- (iv) $\sum\beta^2$: Ridge 2.25 + 0.25 = **2.50**; OLS 5.44 + 0.11 = **5.56**. Ridge is smaller — it explicitly minimises $\sum\beta_j^2$.

*In practice the intercept column is excluded from the penalty (centre the data, or put 0 in the intercept's diagonal position of I).*`,
    deriv: [{ id: 'D12-ridgeN', title: 'Ridge normal equation (matrix form)', badge: 'res',
      steps: [
        { m: R`J(\boldsymbol\beta) = (\mathbf y - X\boldsymbol\beta)^T(\mathbf y - X\boldsymbol\beta) + \lambda\boldsymbol\beta^T\boldsymbol\beta`, t: 'Loss with L2 penalty (centred data, no intercept).' },
        { m: R`J = \mathbf y^T\mathbf y - 2\mathbf y^TX\boldsymbol\beta + \boldsymbol\beta^TX^TX\boldsymbol\beta + \lambda\boldsymbol\beta^TI\boldsymbol\beta`, why: 'Expand as in Lecture 4.' },
        { m: R`\nabla J = -2X^T\mathbf y + 2X^TX\boldsymbol\beta + 2\lambda\boldsymbol\beta`, why: 'Identities 1–3; $\\partial(\\boldsymbol\\beta^TI\\boldsymbol\\beta) = 2\\boldsymbol\\beta$.' },
        { m: R`(X^TX + \lambda I)\boldsymbol\beta = X^T\mathbf y`, why: 'Set ∇J = 0.' }
      ], result: R`\boldsymbol\beta_{ridge} = (X^TX + \lambda I)^{-1}X^T\mathbf y`, after: 'With one centred feature, $X^TX = S_{xx}$ and $X^T\\mathbf y = S_{xy}$: this is exactly $m = S_{xy}/(S_{xx}+\\lambda)$.' }],
    formulas: [{ name: 'Ridge normal equation', tex: R`\boldsymbol\beta_{ridge} = (X^TX + \lambda I)^{-1}X^T\mathbf y`, sym: 'Always invertible for λ > 0.', when: 'Multi-feature Ridge.' }],
    examples: [{ title: 'Singular XᵀX made invertible (worked)', body: R`$S = \begin{bmatrix}1&1\\1&1\end{bmatrix}$ (two identical features): det 0. $S + 0.1I = \begin{bmatrix}1.1&1\\1&1.1\end{bmatrix}$: det = 1.21 − 1 = **0.21** > 0, invertible. (Code example uses a different singular S and gets det 0.51 for λ = 0.1.)` }],
    code: [{ title: 'Ridge normal equation vs OLS; sklearn Ridge', scratch: 'L12_ridge_lasso_scratch.py', lib: 'L12_ridge_lasso_sklearn.py' }],
    traps: ['λI is added to XᵀX, not to Xᵀy.', 'Ridge always has a closed form; Lasso does not.', 'sklearn `Ridge(alpha)` minimises ‖y − Xw‖² + α‖w‖², matching this formula.'],
    questions: [
      { type: 'int', diff: 'M', q: R`$X^TX = \begin{bmatrix}4&2\\2&4\end{bmatrix}$, $X^T\mathbf y = [10,6]^T$, λ = 2. First Ridge coefficient?`, answer: 1.5, tol: 0.001, round: '1 decimal', verify: '(6*10-2*6)/32', sol: '(60 − 12)/32 = **1.5**.' },
      { type: 'int', diff: 'M', q: 'Same data, OLS (λ = 0). First coefficient (2 decimals)?', answer: 2.33, tol: 0.01, round: '2 decimals', verify: '(4*10-2*6)/12', sol: '28/12 = **2.33**.' },
      { type: 'int', diff: 'M', q: 'Ridge β = [1.5, 0.5]. Σβ²?', answer: 2.5, tol: 0.001, round: '2 decimals', verify: '1.5**2+0.5**2', sol: '2.25 + 0.25 = **2.5** (OLS: 5.56).' },
      { type: 'mcq', diff: 'M', q: 'Why does Ridge handle multicollinearity?', options: ['It deletes correlated features', 'XᵀX + λI is invertible for any λ > 0', 'It uses absolute values', 'It removes the intercept'], answer: 1, sol: 'Observation, Part II.', why: ['That is closer to Lasso.', 'Correct.', 'That is Lasso.', 'No.'] },
      { type: 'int', diff: 'M', q: R`det of $\begin{bmatrix}1&1\\1&1\end{bmatrix} + 0.1I$?`, answer: 0.21, tol: 0.0001, round: '2 decimals', verify: '1.1*1.1-1', sol: '1.21 − 1 = **0.21**.' },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
A = np.array([[4, 2], [2, 4]], float); b = np.array([10, 6], float)
print(np.linalg.solve(A + 2 * np.eye(2), b))`, answer: '[1.5 0.5]', sol: 'P1(b)(ii).' }
    ],
    researched: R`Derivation of the Ridge normal equation (worksheet: "out of scope"). Source: Hoerl & Kennard (1970); ESL eq. (3.44).`,
    source: 'Worksheet L12 pp.6, 9; ESL §3.4.1.'
  },
  /* ---------------------------------------------------------------- L12.4 */
  {
    id: 'L12.4', title: 'Six key properties of Ridge', badge: 'class', pages: '6–10', ws: 'Sections 4.1–4.6, P1(a), P1-B',
    concept: R`
**4.1 Shrinkage — never exactly zero.** As λ → ∞ all coefficients shrink **asymptotically** toward 0, but **never become exactly 0** (e.g. 10⁻⁵). Ridge always uses **all** features.

**4.2 Asymmetric shrinkage.** OLS coefficients $w_1 = 5000$, $w_2 = 1000$, $w_3 = 1$ contribute $25{,}000{,}000\lambda$, $1{,}000{,}000\lambda$ and $1\lambda$ to the penalty. **The larger the coefficient, the harder it is penalised** — the optimiser targets $w_1$ first. On a **regularization path** (coefficient vs λ) the largest coefficients drop steeply first; all approach 0 but never touch the axis.

**4.3 Bias and variance.** Low λ: low bias, high variance (overfits). High λ: high bias, low variance (almost a flat line — the mean). The **sweet spot**, found by **cross-validation**, is where variance has dropped a lot and bias has risen only a little.

**4.4 The loss parabola shifts.** For λ = 0 the 1-D loss is a parabola minimised at a large m (27 in the figure); as λ grows (10, 100) the **vertex slides toward m = 0** (16, 6) and the parabola **narrows**, so GD converges to a smaller coefficient. With two weights, the centre of the elliptical contours moves diagonally toward (0, 0).

**4.5 Why "Ridge"? (optional, not examined)** Equivalent hard constraint: minimise $(XW - Y)^T(XW - Y)$ subject to $w_1^2 + \dots + w_n^2 \le r^2$ — a **circle** (radius r shrinks as λ grows). The solution lies where an OLS loss ellipse first **touches the circle's boundary** — the "ridge".

**4.6 Practical heuristic.** Ridge is genuinely useful with **N ≥ 2** features (multicollinearity, many features); with one feature it is rarely beneficial.

**PRACTICE P1(a).** 30 features, train RMSE 1,200, test RMSE 15,800, coefficients 8400, −6200, 5100: (i) **overfitting** — huge train/test gap and huge coefficients. (ii) With tuned Ridge: **train RMSE rises**, **test RMSE falls**, the gap shrinks. (iii) The three coefficients **decrease in magnitude**, the largest (8400) the most.

**P1-B.** (a) $w_1 = 200$, $w_2 = 3$: $w_1$ shrinks more in absolute terms (penalty 40,000λ vs 9λ). (d) "λ = 10¹² makes the coefficient exactly zero" — **incorrect**: $S_{xy}/(S_{xx} + 10^{12})$ is tiny (≈10⁻¹⁰) but not zero; dividing by a finite number never gives exactly 0 unless the numerator is 0.`,
    formulas: [{ name: 'Penalty contribution', tex: R`\lambda w_j^2`, sym: 'Grows with the square of the coefficient.', when: 'Asymmetric shrinkage questions.' }, { name: 'Hard-constraint form (optional)', tex: R`\min \|X\mathbf w - \mathbf y\|^2\ \text{s.t.}\ \sum w_j^2 \le r^2`, sym: 'Circle in 2-D.', when: 'Name "Ridge".' }],
    plots: [
      { id: 'P12-path', title: 'Ridge regularization path: β(λ) = (XᵀX + λI)⁻¹Xᵀy', notice: 'XᵀX = [[4,2],[2,4]], Xᵀy = [10,6]. β₁ starts at 2.33 and falls fastest; both coefficients approach 0 but never reach it (at λ = 2: [1.5, 0.5]).',
        spec: { type: 'xy', w: 520, h: 290, xlim: [0, 30], ylim: [-0.2, 2.6], xlabel: 'λ (penalty strength)', ylabel: 'coefficient value', legend: 'tr', series: [{ t: 'line', pts: lams.map(l => [l, rp(l)[0]]), c: 's1', label: 'β₁' }, { t: 'line', pts: lams.map(l => [l, rp(l)[1]]), c: 's4', label: 'β₂' }, { t: 'hline', y: 0, c: 'fg', dash: true }, { t: 'scatter', pts: [[2, 1.5], [2, 0.5]], c: 's3', r: 4 }] } },
      { id: 'P12-ucurve', title: 'Error vs λ: bias² rises, variance falls, total is U-shaped', notice: 'Small λ: overfitting zone. Large λ: underfitting zone. Pick the minimum by cross-validation.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [0, 10], ylim: [0, 10], xlabel: 'regularization strength λ →', ylabel: 'error', xticks: false, legend: 'tr', series: [{ t: 'fn', f: l => 0.6 + 0.07 * l * l, c: 's1', label: 'Bias²' }, { t: 'fn', f: l => 7 * Math.exp(-0.6 * l), c: 's4', label: 'Variance' }, { t: 'fn', f: l => 0.6 + 0.07 * l * l + 7 * Math.exp(-0.6 * l) + 0.5, c: 'fg', w: 3, label: 'Total error' }, { t: 'vline', x: 3.6, c: 's3', dash: true }, { t: 'text', x: 3.6, y: 9.3, s: 'optimal λ' }] } },
      { id: 'P12-shift', title: 'As λ grows the loss parabola shifts toward m = 0 and narrows', notice: 'Minima at m = 27 (λ = 0), 16 (λ = 10), 6 (λ = 100) — the values used in the worksheet figure.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [-5, 40], ylim: [0, 100], xlabel: 'coefficient m', ylabel: 'loss', legend: 'tr', series: [{ t: 'fn', f: m => 0.12 * (m - 27) ** 2 + 10, c: 's1', label: 'λ = 0 (OLS)' }, { t: 'fn', f: m => 0.25 * (m - 16) ** 2 + 25, c: 's2', label: 'λ = 10' }, { t: 'fn', f: m => 0.6 * (m - 6) ** 2 + 45, c: 's4', label: 'λ = 100' }, { t: 'scatter', pts: [[27, 10], [16, 25], [6, 45]], c: 'fg', r: 4, labels: ['27', '16', '6'] }] } },
      { id: 'P12-circle', title: 'Ridge constraint: the loss ellipse touches the circle off-axis', notice: 'OLS solution outside the circle; the Ridge solution is the first contact point — generally with both w₁ ≠ 0 and w₂ ≠ 0.',
        spec: geo('Ridge (L2): circle', { t: 'ellipse', cx: 0, cy: 0, rx: 1.5, ry: 1.5, c: 's1', fill: true, fop: 0.15, w: 2 }, TR, 'ŵ_Ridge') }
    ],
    examples: [{ title: 'Penalty contributions (worked)', body: R`w = [5000, 1000, 1] → λΣw² = λ(25,000,000 + 1,000,000 + 1). Halving w₁ alone cuts the penalty by 18,750,000λ; halving w₃ saves 0.75λ. The optimiser therefore attacks the big coefficient first.` }],
    code: [{ title: 'Ridge coefficients for several α (sklearn)', lib: 'L12_ridge_lasso_sklearn.py' }],
    traps: ['"Practically zero" ≠ exactly zero: Ridge **cannot** do feature selection.', 'After Ridge, **training** error goes **up**, test error (ideally) down.', 'Section 4.5 (hard constraint) is optional/not examined in class.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'As λ → ∞ in Ridge, coefficients:', options: ['become exactly zero at some finite λ', 'shrink asymptotically toward zero but never exactly zero', 'grow', 'stay the same'], answer: 1, sol: '4.1.', why: ['That is Lasso.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'OLS coefficients w₁ = 200, w₂ = 3. With moderate Ridge, which shrinks more in absolute terms?', options: ['w₁', 'w₂', 'equal', 'neither'], answer: 0, sol: 'P1-B: 40,000λ vs 9λ.', why: ['Correct.', 'No.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Train RMSE 1,200, test RMSE 15,800, large coefficients; apply tuned Ridge. Select all expected effects.', options: ['Train RMSE increases', 'Test RMSE decreases', 'Large coefficients shrink, the largest most', 'Some coefficients become exactly 0'], answer: [0, 1, 2], sol: 'P1(a).', why: ['Yes.', 'Yes.', 'Yes.', 'Not with Ridge.'] },
      { type: 'int', diff: 'E', q: 'w = [5000, 1000, 1], λ = 1. Ridge penalty Σw²?', answer: 26000001, tol: 0, round: 'Exact', verify: '5000**2+1000**2+1', sol: '25,000,000 + 1,000,000 + 1 = **26,000,001**.' },
      { type: 'mcq', diff: 'M', q: 'Student: "λ = 10¹² makes the Ridge slope exactly zero." Correct?', options: ['Yes', 'No — dividing by a huge finite number gives a tiny non-zero value'], answer: 1, sol: 'P1-B(d).', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'As λ increases, the 1-D Ridge loss parabola:', options: ['shifts away from 0 and widens', 'shifts toward m = 0 and narrows', 'is unchanged', 'becomes V-shaped'], answer: 1, sol: '4.4.', why: ['No.', 'Correct.', 'No.', 'That is Lasso\'s penalty.'] }
    ],
    source: 'Worksheet L12 pp.6–10.'
  },
  /* ---------------------------------------------------------------- L12.5 */
  {
    id: 'L12.5', title: 'Lasso: the L1 penalty, sparsity, when to use it', badge: 'class', pages: '10–12', ws: 'Part III',
    concept: R`
:::hook Hook
Ridge pulls coefficients near zero but never to zero. What if we want a model that also decides **which features matter** and discards the rest?
:::

*Analogy:* Ridge turns down the volume on every speaker — everyone still speaks, more softly. **Lasso is a talent-show judge** — only the best stay on stage; everyone else is sent home (coefficient = 0).

**Lasso** (Least Absolute Shrinkage and Selection Operator) penalises the **absolute** values:
$$L_{Lasso} = \underbrace{\sum_{i=1}^n(y_i - \hat y_i)^2}_{\text{OLS error}} + \underbrace{\lambda\sum_{j=1}^p|w_j|}_{\text{L1 penalty}}$$

| λ | coefficients | state |
|---|---|---|
| 0 | OLS values, possibly large | overfitting |
| intermediate | less important features hit **exactly 0**; the rest shrink | sweet spot for feature selection |
| very high | **all** forced to 0; flat line ŷ = c | underfitting |

**Sparsity.** Lasso drives coefficients of unhelpful features **exactly** to zero — **automatic feature selection**. A weight vector with many zeros is **sparse**.

| Scenario | Prefer | Reason |
|---|---|---|
| high-dimensional, many irrelevant features | **Lasso** | drops columns, simpler, easier to interpret |
| domain knowledge: all features contribute | **Ridge** | keeps all with reduced influence |

:::key Key insight
Ridge = coefficient **stabilisation** (dense model). Lasso = **dimensionality reduction** (sparse model). Neither is universally better.
:::

*Optimisation note:* Ridge has a **closed form**; Lasso needs **iterative** optimisation (e.g. **coordinate descent**) because |w| has a non-differentiable kink at 0.`,
    formulas: [{ name: 'Lasso loss', tex: R`L_{Lasso} = \sum_i(y_i-\hat y_i)^2 + \lambda\sum_{j=1}^p|w_j|`, sym: 'Intercept excluded from the penalty.', when: 'Definition.' }, { name: 'L1 vs L2 penalty', tex: R`\|\mathbf w\|_1 = \sum|w_j|,\qquad \|\mathbf w\|_2^2 = \sum w_j^2`, sym: '', when: 'Penalty arithmetic (P2(e)).' }],
    plots: [{ id: 'P12-lassopath', title: 'Lasso coefficients vs α (sklearn, 5 features)', notice: 'Coefficients hit exactly 0 one by one: 0 zeros at α = 0.01, 3 at 0.5, 4 at 2.5, all 5 at α = 5 (lines join the four computed α values).',
      spec: (function () { const al = [0.01, 0.5, 2.5, 5], C = [[3.926, 3.458, 1.565, 0], [2.08, 1.624, 0, 0], [0.04, 0, 0, 0], [0.035, 0, 0, 0], [0.023, 0, 0, 0]]; return { type: 'xy', w: 520, h: 290, xlim: [0, 5.2], ylim: [-0.2, 4.2], xlabel: 'α (λ)', ylabel: 'coefficient', legend: 'tr', series: C.map((r, j) => ({ t: 'line', pts: al.map((a, k) => [a, r[k]]), c: ['s1', 's2', 's3', 's5', 's6'][j], markers: true, label: 'w' + (j + 1) })) }; })() }],
    examples: [{ title: 'L1 vs L2 penalty (worked, P2(e))', body: R`w = [5, −2, 8]: L1 = 5 + 2 + 8 = **15** (Lasso); L2 = 25 + 4 + 64 = **93** (Ridge). Careful: |−2| = 2 but (−2)² = 4.` }],
    code: [{ title: 'Lasso: zeros appear as α grows', scratch: 'L12_ridge_lasso_scratch.py', lib: 'L12_ridge_lasso_sklearn.py' }],
    traps: ['Lasso → sparse (exact zeros); Ridge → dense.', 'Lasso has no closed form.', 'sklearn `Lasso` minimises (1/2n)‖y − Xw‖² + α‖w‖₁ — its α is on a different scale from `Ridge`.'],
    questions: [
      { type: 'int', diff: 'E', q: 'w = [5, −2, 8]. L1 penalty Σ|wⱼ|?', answer: 15, tol: 0, round: 'Exact', verify: '5+2+8', sol: '**15**.' },
      { type: 'int', diff: 'E', q: 'w = [5, −2, 8]. L2 penalty Σwⱼ²?', answer: 93, tol: 0, round: 'Exact', verify: '25+4+64', sol: '**93**.' },
      { type: 'mcq', diff: 'E', q: 'A model with many coefficients exactly zero is called:', options: ['dense', 'sparse', 'singular', 'biased'], answer: 1, sol: 'P2(a)(i).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Lasso on 50 hospital features keeps 8. If Ridge were used instead, about how many features stay in the model?', options: ['8', '42', '50', '0'], answer: 2, sol: 'P2(a)(ii): Ridge never zeros coefficients.', why: ['That is Lasso.', 'No.', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why does Lasso need iterative optimisation?', options: ['It has too many features', 'The L1 penalty has a non-differentiable kink at 0, so no closed form', 'It needs GPUs', 'It penalises the intercept'], answer: 1, sol: 'Optimisation note.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Very high λ in Lasso gives:', options: ['OLS', 'all coefficients 0 — flat line ŷ = c', 'exactly half the features', 'overfitting'], answer: 1, sol: 'λ table.', why: ['That is λ = 0.', 'Correct.', 'No.', 'Underfitting.'] }
    ],
    source: 'Worksheet L12 pp.10–12; Tibshirani (1996).'
  },
  /* ---------------------------------------------------------------- L12.6 */
  {
    id: 'L12.6', title: 'Diamond vs circle; why Lasso gives exact zeros', badge: 'class', pages: '12–15', ws: 'Geometric intuition, mathematical proof, P2',
    concept: R`
**Geometry (optional reading in the worksheet).** Lasso's constraint $\sum|w_j| \le t$ is a **diamond** (rotated square) with **sharp corners on the axes**; Ridge's is a smooth **circle**. RSS contours (ellipses around $\hat{\mathbf w}_{OLS}$) usually **first touch the diamond at a corner** — where a coefficient is exactly 0; they touch the circle at a smooth, generally off-axis point — no coefficient forced to 0. Lasso's loss also has a **V-shaped kink** at w = 0, Ridge's is a smooth parabola.

**Mathematical reason (single feature, slope m).** $L_{Lasso} = \sum(y_i - mx_i - c)^2 + \lambda|m|$; |m| is not differentiable at 0, so take cases (derivation below):
- **m > 0:** $m = \dfrac{\text{OLS numerator} - \lambda}{\text{denominator}}$ — λ **subtracts** in the numerator. Numerator 100: λ = 50 → m > 0; λ = 100 → **m = 0**; λ = 120 → formula negative, contradicting m > 0 → the algorithm **clips to m = 0**.
- **m < 0:** $m = \dfrac{\text{OLS numerator} + \lambda}{\text{denominator}}$ — λ pushes a negative m up toward 0, then clips at 0.

**Ridge:** $m = \dfrac{\text{OLS numerator}}{\text{denominator} + \lambda}$ — λ in the **denominator**; even λ = 10⁹ gives ~10⁻⁹, never exactly 0.

:::key Key insight
**Lasso (L1): λ in the numerator (subtraction)** → coefficient becomes exactly 0 once λ exceeds the feature's (scaled) correlation with the target. **Ridge (L2): λ in the denominator (division)** → asymptotic shrinkage, never exactly 0.
:::

**PRACTICE P2(b).** OLS numerator 80, denominator 40: Lasso λ = 30 → (80 − 30)/40 = **1.25**; λ = 80 → **0**; λ = 120 → formula −1, actual **0** (clipped). Ridge λ = 10⁶ → 80/1,000,040 ≈ **0.00008**, not 0.
**P2(d).** OLS at (3, 0.5): the **Lasso diamond** is more likely to give w₂ = 0, because its corner on the w₁-axis is where an ellipse centred near (3, 0.5) tends to touch first.

:::note Constant factors
Differentiating $\sum(\cdot)^2 + \lambda|m|$ exactly gives $m = (S_{xy} - \lambda/2)/S_{xx}$. The worksheet writes "OLS numerator − λ", i.e. it absorbs the ½ into λ (as if the loss were $\tfrac12\sum(\cdot)^2 + \lambda|m|$). The conclusion — subtraction in the numerator, hence exact zeros — is identical. Use the worksheet's form in numericals unless told otherwise.
:::`,
    deriv: [{ id: 'D12-lasso', title: 'Lasso slope by cases (soft-thresholding)', badge: 'class',
      intro: 'Centred data, one feature; write $N = S_{xy}$ (OLS numerator), $D = S_{xx}$ (denominator). Use the worksheet scaling $L = \\tfrac12\\sum(b_i - ma_i)^2 + \\lambda|m|$.',
      steps: [
        { m: R`m > 0:\quad \frac{dL}{dm} = -N + mD + \lambda = 0 \Rightarrow m = \frac{N - \lambda}{D}`, why: '$d|m|/dm = +1$.' },
        { m: R`\text{valid only if } N - \lambda > 0;\ \text{otherwise no positive solution}`, why: 'Assumption check.' },
        { m: R`m < 0:\quad -N + mD - \lambda = 0 \Rightarrow m = \frac{N + \lambda}{D}`, why: '$d|m|/dm = -1$; valid only if $N + \\lambda < 0$.' },
        { m: R`|N| \le \lambda \Rightarrow \text{neither case is valid} \Rightarrow m = 0`, why: 'The minimum sits at the kink.' }
      ], result: R`m_{Lasso} = \frac{\operatorname{sign}(N)\,\max(|N| - \lambda,\ 0)}{D}\qquad\text{vs}\qquad m_{Ridge} = \frac{N}{D + \lambda}`,
      after: 'This "soft-thresholding" operator is exactly what coordinate descent applies to each coefficient in turn (researched).' }],
    formulas: [{ name: 'Lasso slope (worksheet form)', tex: R`m = \frac{N - \lambda}{D}\ (m>0),\quad m = \frac{N+\lambda}{D}\ (m<0),\quad \text{else } 0`, sym: 'N = OLS numerator, D = denominator.', when: 'P2(b) numericals.' }, { name: 'Ridge slope', tex: R`m = \frac{N}{D + \lambda}`, sym: '', when: 'Comparison.' }],
    plots: [
      { id: 'P12-diamond', title: 'Circle (Ridge) vs diamond (Lasso): where the loss ellipse first touches', notice: 'Same OLS solution and contours. The ellipse touches the circle off-axis (both weights ≠ 0) but hits the diamond at its corner on the w₂-axis, so w₁ = 0 exactly.',
        spec: { type: 'multi', panels: [geo('Ridge (L2): circle', { t: 'ellipse', cx: 0, cy: 0, rx: 1.5, ry: 1.5, c: 's1', fill: true, fop: 0.15, w: 2 }, TR, 'ŵ_Ridge'), geo('Lasso (L1): diamond', { t: 'poly', pts: [[1.5, 0], [0, 1.5], [-1.5, 0], [0, -1.5]], c: 's2', fop: 0.2, w: 2 }, TL, 'ŵ_Lasso (w₁ = 0)')] } },
      { id: 'P12-soft', title: 'Slope vs λ: Lasso hits zero, Ridge only approaches it', notice: 'N = 80, D = 40. Lasso: (80 − λ)/40 reaches 0 at λ = 80 and stays there. Ridge: 80/(40 + λ) keeps shrinking but is still 0.67 at λ = 80.',
        spec: { type: 'xy', w: 520, h: 280, xlim: [0, 160], ylim: [0, 2.1], xlabel: 'λ', ylabel: 'slope m', legend: 'tr', series: [{ t: 'fn', f: l => Math.max(80 - l, 0) / 40, c: 's2', w: 2.5, label: 'Lasso (N − λ)/D' }, { t: 'fn', f: l => 80 / (40 + l), c: 's1', w: 2.5, label: 'Ridge N/(D + λ)' }, { t: 'scatter', pts: [[30, 1.25], [80, 0]], c: 's2', labels: ['1.25', '0'] }] } }
    ],
    examples: [{ title: 'Negative-slope case (worked)', body: R`N = −60, D = 30. λ = 20: m = (−60 + 20)/30 = −1.33. λ = 60: m = 0. λ = 90: formula (−60 + 90)/30 = +1 contradicts m < 0 → clipped to **0**.` }],
    code: [{ title: 'Lasso clipping vs Ridge denominator (P2(b))', scratch: 'L12_ridge_lasso_scratch.py' }],
    traps: ['λ in the **numerator** (Lasso) vs **denominator** (Ridge) — the interview favourite.', 'When the formula overshoots the sign assumption, the answer is **0**, not the negative number.', 'Worksheet absorbs a factor ½ into λ for Lasso.'],
    questions: [
      { type: 'int', diff: 'E', q: 'Lasso (worksheet form): N = 80, D = 40, λ = 30. m?', answer: 1.25, tol: 0.001, round: '2 decimals', verify: '(80-30)/40', sol: '50/40 = **1.25**.' },
      { type: 'int', diff: 'M', q: 'Lasso: N = 80, D = 40, λ = 120. Actual m?', answer: 0, tol: 0, round: 'Exact', verify: 'max(80-120,0)/40', sol: 'Formula gives −1, violating m > 0 → clipped to **0**.' },
      { type: 'int', diff: 'M', q: 'Ridge: N = 80, D = 40, λ = 10⁶. m (5 decimals)?', answer: 0.00008, tol: 0.000001, round: '5 decimals', verify: '80/(40+1e6)', sol: '80/1,000,040 ≈ **0.00008** — tiny but not zero.' },
      { type: 'int', diff: 'M', q: 'Lasso: N = −60, D = 30, λ = 20. m (2 decimals)?', answer: -1.33, tol: 0.005, round: '2 decimals', verify: '(-60+20)/30', sol: '(−60 + 20)/30 = **−1.33**.' },
      { type: 'mcq', diff: 'E', q: 'Why does Lasso create sparsity but Ridge does not?', options: ['Lasso uses more data', 'In Lasso λ subtracts in the numerator; in Ridge λ divides in the denominator', 'Ridge has no λ', 'Lasso is non-linear'], answer: 1, sol: 'Key insight.', why: ['No.', 'Correct.', 'It does.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'OLS solution at (3, 0.5). Which constraint region more likely yields w₂ = 0?', options: ['Ridge circle', 'Lasso diamond', 'both equally', 'neither'], answer: 1, sol: 'P2(d): corners on the axes.', why: ['Smooth, no corners.', 'Correct.', 'No.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`def lasso_m(N, D, lam):
    if N - lam > 0: return (N - lam) / D
    if N + lam < 0: return (N + lam) / D
    return 0.0
print([lasso_m(80, 40, l) for l in [30, 80, 120]], lasso_m(-60, 30, 90))`, answer: '[1.25, 0.0, 0.0] 0.0', sol: 'Soft-thresholding: 50/40; then 0 once λ ≥ |N|.' }
    ],
    source: 'Worksheet L12 pp.12–15; ESL §3.4.3 (soft thresholding).'
  },
  /* ---------------------------------------------------------------- L12.7 */
  {
    id: 'L12.7', title: 'Comparison, CV for λ, standardisation, intercept, traps', badge: 'class', pages: '16–22', ws: 'Part IV, P3, P4',
    concept: R`
| Aspect | Ridge (L2) | Lasso (L1) |
|---|---|---|
| penalty | $\lambda\sum w_j^2$ | $\lambda\sum|w_j|$ |
| shrinkage | toward 0, never exactly 0 | some exactly 0 |
| feature selection | no | yes |
| λ position | denominator (scaling) | numerator (subtraction) |
| constraint | circle | diamond |
| loss shape | smooth parabola | V-shaped kink at 0 |
| closed form | yes: $(X^TX + \lambda I)^{-1}X^Ty$ | no (numerical) |
| best when | all features contribute; multicollinearity | many irrelevant; interpretability |

**Choosing λ by cross-validation:** evaluate a grid of λ with k-fold CV; pick **λ_min** (lowest CV error) or **λ_1SE** (simplest model within one standard error of the minimum). *Classroom exercise:* λ = 0, 0.1, 1, 10 with CV MSE 150, 85, **72**, 310 → **λ = 1**; λ = 0 overfits, λ = 10 underfits (U-shape).

**Standardise first.** The penalty acts on raw coefficient sizes; a feature in large units (income in rupees) gets a tiny coefficient and is barely penalised, while a small-unit feature gets a large coefficient and is penalised heavily — or, for Lasso, a large-unit feature's small coefficient is easily crushed to 0. Standardise $x_j^{std} = (x_j - \mu_j)/\sigma_j$ (using **training** statistics) so the penalty is fair. **Do not regularise the intercept** $\beta_0$: it is the baseline (ȳ for centred data); penalising it biases predictions toward 0.

**Common mistakes:** regularising the intercept; standardising before the train–test split (leakage); assuming larger λ is always better; believing Ridge does feature selection; using raw unstandardised features.

**Interview traps (all False):** "Ridge performs feature selection"; "Ridge coefficients become exactly 0 for large λ"; "Lasso always beats Ridge"; "the intercept should be regularised".

**PRACTICE P3.** (a) Lasso zeroed Rainfall (200–2000 mm) and Soil pH (4.5–8) while keeping Temperature and Fertiliser cost: the team **skipped standardisation**; after standardising, Rainfall (truly important) should survive. (b) Path A (all 10 shrink smoothly, none touches 0) = **Ridge**, uses **10** features at λ = 100; Path B (hit zero one by one, 3 left) = **Lasso**, uses **3**. (c) Order: split → fit µ, σ on train → standardise with train stats → choose λ by CV → compute $(X^TX + \lambda I)^{-1}X^Ty$ → evaluate on test. (d) The intercept is the baseline, not model complexity; penalising it biases every prediction.

**PRACTICE P4.** (a) CLV with 80 features, ~10–15 matter → **Lasso**; train 97% / test 94% with CV-chosen λ → **good** (small gap). λ = 0 for best training accuracy → overfits; regularisation trades a little bias for a big variance cut. (b) "Ridge" cost with $\lambda\sum_{j=0}^p|\beta_j|$: **two errors** — |β| is L1 (Lasso), and j = 0 penalises the intercept. (c) Colleague B is right: Ridge with λ = 1000 gives tiny, not exactly zero, coefficients (rounding in the display). (e) Pharmaceutical model with 200 features needing regulatory interpretability → **Lasso**.`,
    formulas: [{ name: 'CV choice of λ', tex: R`\lambda^* = \arg\min_{\lambda\in\Lambda}\ \text{CV-MSE}(\lambda)`, sym: 'Or λ_1SE for a simpler model.', when: 'Tuning.' }, { name: 'Standardise', tex: R`x_j^{std} = \frac{x_j-\mu_j}{\sigma_j}`, sym: 'Training statistics.', when: 'Before any penalised fit.' }],
    plots: [
      { id: 'P12-cv', title: 'Classroom exercise: CV MSE for four λ values', notice: 'Lowest bar λ = 1 (72) is selected; the U-shape shows overfitting at λ = 0 and underfitting at λ = 10.',
        spec: { type: 'bars', w: 440, h: 280, cats: ['λ = 0', 'λ = 0.1', 'λ = 1', 'λ = 10'], vals: [150, 85, 72, 310], hl: 2, ylabel: 'average validation MSE', ylim: [0, 340] } },
      { id: 'P12-scale', title: 'Coefficient size depends on units: before vs after standardising', notice: 'Before: income (₹) has a tiny coefficient and experience (years) a large one — the penalty treats them unfairly. After: both on one scale.',
        spec: { type: 'bars', w: 480, h: 280, cats: ['Income', 'Experience'], groups: [{ vals: [0.2, 7.5], c: 's7', label: 'raw features' }, { vals: [5.1, 4.2], c: 's1', label: 'standardised' }], ylabel: '|coefficient|', ylim: [0, 9] } }
    ],
    examples: [{ title: 'Order the Ridge pipeline (worked, P3(c))', body: R`1 split → 2 fit µⱼ, σⱼ on train → 3 standardise using train stats → 4 select λ by CV → 5 compute $(X^TX + \lambda I)^{-1}X^T\mathbf y$ → 6 evaluate on test. Fitting µ, σ on all data leaks test information (overly optimistic).` }],
    code: [{ title: 'GridSearchCV / RidgeCV / LassoCV for λ', lib: 'L12_cv_lambda_sklearn.py', more: [['Ridge & Lasso coefficients (sklearn)', 'L12_ridge_lasso_sklearn.py']] }],
    traps: ['Penalty sums start at j = **1** (intercept excluded).', 'Standardise **after** splitting, with training statistics.', 'Larger λ is not always better.', '20 highly correlated sensors → **Ridge** (Lasso arbitrarily picks one of a correlated group).'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'CV MSE: λ = 0 → 150, 0.1 → 85, 1 → 72, 10 → 310. Choose λ:', options: ['0', '0.1', '1', '10'], answer: 2, sol: 'Lowest CV MSE.', why: ['Overfits.', 'Higher error.', 'Correct.', 'Underfits.'] },
      { type: 'mcq', diff: 'M', q: 'Lasso zeroes Rainfall (200–2000 mm) though experts say it matters. Most likely skipped step?', options: ['Cross-validation', 'Standardisation', 'Adding the intercept', 'Shuffling'], answer: 1, sol: 'P3(a).', why: ['Not the issue described.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: '20 highly correlated factory sensor readings. Ridge or Lasso?', options: ['Ridge — stabilises correlated features', 'Lasso — removes duplicates reliably', 'Neither', 'OLS'], answer: 0, sol: 'P2(c) sensor row (hardest).', why: ['Correct.', 'Lasso may arbitrarily pick one; unstable.', 'No.', 'Unstable.'] },
      { type: 'mcq', diff: 'M', q: 'A "Ridge" cost is written J = Σ(yᵢ − ŷᵢ)² + λ Σ_{j=0}^{p} |βⱼ|. Errors?', options: ['None', '|βⱼ| is L1 (Lasso), and j = 0 penalises the intercept', 'Only the j = 0 start', 'Only the absolute value'], answer: 1, sol: 'P4(b).', why: ['Two errors.', 'Correct.', 'Also the L1 term.', 'Also j = 0.'] },
      { type: 'mcq', diff: 'M', q: 'Path A: all 10 curves shrink smoothly, none hits 0. Path B: curves hit 0 one by one, 3 remain at λ = 100. Which is Ridge, and how many features does it use at λ = 100?', options: ['A, 10', 'B, 3', 'A, 3', 'B, 10'], answer: 0, sol: 'P3(b).', why: ['Correct.', 'B is Lasso.', 'Ridge keeps all 10.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Interview traps — select all **false** statements.', options: ['Ridge performs feature selection', 'Lasso always outperforms Ridge', 'The intercept should be regularised', 'λ is chosen by cross-validation'], answer: [0, 1, 2], sol: 'Interview-trap table; CV is correct practice.', why: ['False.', 'False.', 'False.', 'True.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.linear_model import Ridge
X = np.array([[1.0], [2.0], [3.0]]); y = np.array([10.0, 12.0, 14.0])
print(round(Ridge(alpha=1e9).fit(X, y).intercept_, 3))`, answer: '12.0', sol: 'The slope is shrunk to ~0 but the intercept is **not** penalised, so it tends to ȳ = 12.' }
    ],
    source: 'Worksheet L12 pp.16–22; scikit-learn `RidgeCV`, `LassoCV`, `GridSearchCV`.'
  },
  /* ---------------------------------------------------------------- L12.8 (researched) */
  {
    id: 'L12.8', title: 'Elastic Net: combining the L1 and L2 penalties', badge: 'res', pages: '–', ws: 'Named in Part I as "out of scope"; asked in the course quiz (OvR/BCE quiz Q4)',
    concept: R`
:::hook Hook
Lasso gives sparsity; Ridge copes well with correlated features. What if your data has **both** many useless columns **and** groups of strongly correlated useful ones (e.g. area in m² and area in ft² plus 50 noise columns)?
:::

**Elastic Net** adds both penalties to the squared-error loss (Zou & Hastie, 2005):
$$J(\mathbf w) = \sum_i(y_i - \hat y_i)^2 + \lambda_1\sum_j|w_j| + \lambda_2\sum_j w_j^2$$
- λ₂ = 0 → **Lasso**; λ₁ = 0 → **Ridge**.
- scikit-learn writes it with one strength **alpha** and a mix **l1_ratio** ∈ [0, 1]: $\frac{1}{2n}\|\mathbf y - X\mathbf w\|^2 + \alpha\,\rho\,\|\mathbf w\|_1 + \frac{\alpha(1-\rho)}{2}\|\mathbf w\|_2^2$, with ρ = l1_ratio. ρ = 1 is exactly Lasso; ρ = 0 is a pure L2 penalty (Ridge, up to how alpha is scaled).

**Why combine them? Two weaknesses of Lasso**
1. **Correlated groups:** among highly correlated features, Lasso tends to keep one and shrink the others arbitrarily, and the choice is unstable from sample to sample. The L2 part gives the **grouping effect**: correlated features get similar coefficients.
2. **p > n:** Lasso can select at most n features. Elastic Net has no such limit.

It keeps Lasso's **exact zeros** for useless features, because the L1 corner is still there.

**Experiment** (\`aml-practice/L12_elastic_net_sklearn.py\`): y = 3z + noise; x₁ and x₂ are two noisy copies of z (correlation 0.997); x₃–x₅ are pure noise; n = 200.

| Model | w₁ | w₂ | w₃ | w₄ | w₅ |
|---|---|---|---|---|---|
| Ridge (α = 10) | 1.457 | 1.438 | −0.004 | −0.080 | −0.029 |
| Lasso (α = 1.0) | **0.506** | **1.323** | 0 | 0 | 0 |
| Elastic Net (α = 1.0, l1_ratio = 0.5) | **0.932** | **0.937** | 0 | 0 | 0 |

Ridge shares the weight but keeps small non-zero noise weights. Lasso zeros the noise but splits the shared signal unevenly. Elastic Net does **both**: it zeros the noise and shares the weight equally.

**Geometry (compare L12.6).** The constraint region lies between Lasso's diamond and Ridge's circle. It keeps **corners** on the axes (so solutions can still land on an axis → zeros), but its edges are **curved** (so correlated directions are shared smoothly).

**When to use:** many features, some correlated groups, and you want a sparse model. Tune **both** alpha and l1_ratio by cross-validation (\`ElasticNetCV\`, or a grid search as in L09.9). Standardise features first, as for Ridge and Lasso.

:::take Takeaway
Elastic Net = L1 (sparsity) + L2 (stability and grouping). l1_ratio = 1 → Lasso; l1_ratio = 0 → Ridge. Use it for correlated, high-dimensional data. Tune alpha and l1_ratio by CV.
:::`,
    formulas: [
      { name: 'Elastic Net loss', tex: R`J(\mathbf w) = \sum_i (y_i-\hat y_i)^2 + \lambda_1\|\mathbf w\|_1 + \lambda_2\|\mathbf w\|_2^2`, sym: R`$\|\mathbf w\|_1 = \sum|w_j|$, $\|\mathbf w\|_2^2 = \sum w_j^2$.`, when: 'General form.' },
      { name: 'scikit-learn form', tex: R`\frac{1}{2n}\|\mathbf y - X\mathbf w\|_2^2 + \alpha\rho\|\mathbf w\|_1 + \frac{\alpha(1-\rho)}{2}\|\mathbf w\|_2^2`, sym: 'α = overall strength, ρ = l1_ratio.', when: '`ElasticNet(alpha, l1_ratio)`.' },
      { name: 'Special cases', tex: R`\rho = 1 \Rightarrow \text{Lasso},\qquad \rho = 0 \Rightarrow \text{Ridge}`, sym: '', when: 'MCQs on the relationship.' }
    ],
    plots: [
      { id: 'P12-enball', title: 'Constraint regions: Lasso, Ridge and Elastic Net (l1_ratio = 0.5)', notice: 'Elastic Net keeps the corners on the axes (sparsity) but bulges outward between them (smooth sharing between correlated weights).',
        spec: { type: 'xy', w: 400, h: 470, xlim: [-1.3, 1.3], ylim: [-1.3, 1.85], xlabel: 'w₁', ylabel: 'w₂', legend: 'tr',
          series: [
            { t: 'line', pts: [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]], c: 's4', w: 2.5, label: 'Lasso |w₁| + |w₂| = 1' },
            { t: 'line', pts: NUM.linspace(0, 2 * Math.PI, 121).map(a => [Math.cos(a), Math.sin(a)]), c: 's1', w: 2.5, label: 'Ridge w₁² + w₂² = 1' },
            { t: 'line', pts: NUM.linspace(0, 2 * Math.PI, 241).map(a => { const c = Math.cos(a), s = Math.sin(a), L1 = Math.abs(c) + Math.abs(s); const r = (-0.5 * L1 + Math.sqrt(0.25 * L1 * L1 + 2)) / 1; return [r * c, r * s]; }), c: 's3', w: 2.5, label: 'Elastic Net ½·L1 + ½·L2² = 1' }
          ] } },
      { id: 'P12-encoef', title: 'Coefficients on two nearly identical features (true shared weight 3)', notice: 'Lasso splits the signal unevenly (0.51 vs 1.32) and the split changes from sample to sample. Elastic Net shares it equally (0.93 vs 0.94). Both set the three noise features to exactly 0.',
        spec: { type: 'bars', w: 520, h: 290, cats: ['w₁ (x₁)', 'w₂ (x₂)', 'w₃ (noise)', 'w₄ (noise)', 'w₅ (noise)'],
          groups: [{ label: 'Ridge α=10', c: 's1', vals: [1.457, 1.438, -0.004, -0.08, -0.029] }, { label: 'Lasso α=1', c: 's4', vals: [0.506, 1.323, 0, 0, 0] }, { label: 'Elastic Net α=1, ρ=0.5', c: 's3', vals: [0.932, 0.937, 0, 0, 0] }],
          ylabel: 'coefficient', ylim: [-0.2, 1.6], values: false } }
    ],
    examples: [{ title: 'Evaluating the penalty (worked)', body: R`w = (2, −1, 0), λ₁ = 0.5, λ₂ = 0.25. L1 part: 0.5 × (2 + 1 + 0) = 1.5. L2 part: 0.25 × (4 + 1 + 0) = 1.25. Total penalty = **2.75**, added to the squared-error loss. In scikit-learn terms with α = 1 and l1_ratio = 0.5: 1 × 0.5 × 3 + (1 × 0.5/2) × 5 = 1.5 + 1.25 = 2.75.` }],
    code: [{ title: 'Ridge vs Lasso vs Elastic Net on correlated + noise features', lib: 'L12_elastic_net_sklearn.py', libLabel: 'scikit-learn' }],
    traps: ['l1_ratio = **1** is Lasso (not Ridge).', 'Elastic Net still produces exact zeros, unlike Ridge.', 'Two hyperparameters (alpha and l1_ratio) → tune both by CV.', 'Standardise features before fitting any penalised model.'],
    researched: R`Not covered in class (the worksheet marks Elastic Net out of scope), but your course quiz asks how L2, L1 and Elastic Net differ. Studied from Zou & Hastie, "Regularization and variable selection via the elastic net", J. R. Statist. Soc. B 67 (2005), ESL §3.4, and the scikit-learn \`ElasticNet\` documentation.`,
    questions: [
      { type: 'mcq', diff: 'E', tag: 'Course-quiz pattern', q: 'How do L2 (Ridge), L1 (Lasso) and Elastic Net differ in their main effect on coefficients?',
        options: ['L2 forces exact zeros; L1 never does; Elastic Net does neither', 'L2 shrinks smoothly without exact zeros; L1 can set coefficients exactly to zero; Elastic Net combines sparsity with smooth shrinkage', 'All three give identical coefficients', 'Elastic Net works only with one feature'], answer: 1,
        sol: 'This is the course quiz\'s idea, rephrased.', why: ['Reversed.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'M', q: 'w = (3, −2), λ₁ = 0.1, λ₂ = 0.05. Elastic Net penalty λ₁‖w‖₁ + λ₂‖w‖₂² ?', answer: 1.15, tol: 0.001, round: '2 decimals',
        verify: '0.1*5+0.05*13', sol: '0.1 × (3 + 2) + 0.05 × (9 + 4) = 0.5 + 0.65 = **1.15**.' },
      { type: 'mcq', diff: 'E', q: 'In scikit-learn, `ElasticNet(alpha=0.1, l1_ratio=1.0)` is the same as:',
        options: ['Ridge(alpha=0.1)', 'Lasso(alpha=0.1)', 'LinearRegression()', 'Nothing else'], answer: 1,
        sol: 'l1_ratio = 1 → only the L1 term remains, with the same scaling as Lasso.', why: ['That is l1_ratio = 0 (up to scaling).', 'Correct.', 'That is alpha = 0.', 'It equals Lasso.'] },
      { type: 'mcq', diff: 'M', q: 'Ten genes are almost perfectly correlated and all relevant. Which penalty tends to keep them together with similar weights?',
        options: ['Lasso', 'Elastic Net', 'No penalty', 'An L0 count penalty'], answer: 1,
        sol: 'The L2 part gives the grouping effect; Lasso tends to pick one arbitrarily.', why: ['Picks one, unstably.', 'Correct.', 'Unstable under collinearity.', 'Picks one.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.linear_model import ElasticNet, Lasso
X = np.array([[1, 2], [2, 1], [3, 4], [4, 3.]]); y = np.array([1, 2, 3, 4.])
a = ElasticNet(alpha=0.2, l1_ratio=1.0).fit(X, y).coef_
b = Lasso(alpha=0.2).fit(X, y).coef_
print(np.allclose(a, b))`, answer: 'True',
        sol: 'l1_ratio = 1 makes Elastic Net exactly Lasso.' },
      { type: 'mcq', diff: 'M', q: 'Which statement about Elastic Net is FALSE?',
        options: ['It can set coefficients exactly to zero', 'It has two hyperparameters to tune', 'It can select more than n features when p > n', 'It never shrinks any coefficient'], answer: 3,
        sol: 'Both penalties shrink coefficients.', why: ['True.', 'True.', 'True (Lasso cannot).', 'False — correct choice.'] }
    ],
    source: 'Zou & Hastie (2005); Hastie, Tibshirani & Friedman, ESL §3.4.3; scikit-learn ElasticNet docs.'
  }
  ]
});
})();
