/* Lecture 3 — Simple Linear Regression using the OLS method */
(function () {
const CG = [8.0, 9.0, 7.0, 7.5, 6.0], ST = [50, 75, 45, 40, 30];
const HR = [1, 3, 5, 7, 9], QS = [25, 40, 55, 65, 80];
const zip = (a, b) => a.map((v, i) => [v, b[i]]);
LECTURES.push({
  num: 3, short: 'SLR & OLS', title: 'Simple Linear Regression using the OLS Method — from scatter plot to the closed-form best-fit line',
  file: 'AML_Lecture 3_Worksheet_Filled.PDF', pages: 20, extraFiles: 'Whiteboards/L04 (class of 20 Aug)',
  intro: R`**Exam weight: high.** Expect (1) MCQs on **why squared error** (signed cancels, absolute is not differentiable at 0, squared is smooth but outlier-sensitive), (2) the **derivation steps** of $c=\bar y-m\bar x$ and $m=\dfrac{\sum(x-\bar x)(y-\bar y)}{\sum(x-\bar x)^2}$, and (3) **OLS by hand** numericals. Practise P10 until you can do it in 3 minutes. About 90 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L03.1 */
  {
    id: 'L03.1', title: 'Storyline: ŷ = mx + c, infinitely many lines, two inputs → a plane', badge: 'class', pages: '1–5', ws: 'Sections 1–3',
    concept: R`
:::hook Hook (worksheet)
I know the CGPA and internship stipend of some NST students. If a new student tells me their CGPA, can I predict the stipend they might get?
:::

| Student | CGPA (x) | Stipend ₹k (y) |
|---|---|---|
| A | 8.0 | 50 |
| B | 9.0 | 75 |
| C | 7.0 | 45 |
| D | 7.5 | 40 |
| E | 6.0 | 30 |

The scatter plot shows a roughly **linear** trend, so we model it with a straight line
$$\hat y = m\,x + c$$
- $\hat y$ (y-hat) = predicted output (predicted stipend); $x$ = input (CGPA);
- $m$ = **slope** (how steeply the stipend changes with CGPA); $c$ = **intercept** (predicted stipend when CGPA = 0).

We learn from examples whose correct answers are given → **supervised learning** (regression).

**Section 2 — infinitely many candidate models.** The model has **2 adjustable numbers, m and c**. Different students pick different values:

| Student | m | c | Model |
|---|---|---|---|
| 1 | 10 | −30 | ŷ = 10x − 30 |
| 2 | 12 | −40 | ŷ = 12x − 40 |
| 3 | 8 | −10 | ŷ = 8x − 10 |

Changing **m tilts** the line; changing **c shifts** it up or down. So there are infinitely many lines.

:::key Key insight
Engineering problem: out of infinitely many lines, which one? We need an **objective mathematical criterion**, not a visual guess.
:::

**Section 3 — two inputs.** Add IQ: $\hat y = m_1(\text{IQ}) + m_2(\text{CGPA}) + c$. With two features the model is a **plane in 3-D**, not a line, and again infinitely many planes exist. (Lecture 4 handles this with matrices.)

**PRACTICE P2.** (a) $\hat y = m_1\text{IQ} + m_2\text{CGPA} + c$ has **3** learnable parameters: $m_1, m_2, c$. (b) "Two input features produce a line in 3-D" → **False** (a plane). (c) One input → **line**; two inputs → **plane**.`,
    formulas: [
      { name: 'Simple linear regression model', tex: R`\hat y = m x + c`, sym: '$m$ slope, $c$ intercept (both learnable parameters).', when: 'One input feature.' },
      { name: 'Two inputs → plane', tex: R`\hat y = m_1x_1 + m_2x_2 + c`, sym: '3 parameters; geometric object = plane.', when: 'Counting parameters; line vs plane vs hyperplane.' },
      { name: 'Number of parameters', tex: R`\#\text{params} = (\#\text{features}) + 1`, sym: 'One weight per feature + one intercept.', when: 'P2(a)-type questions.' }
    ],
    plots: [
      { id: 'P03-scatter', title: 'CGPA vs stipend (worksheet data)', notice: 'The points roughly rise together: a linear trend, so a straight line is a sensible model.',
        spec: { type: 'xy', w: 520, h: 300, xlim: [5.5, 9.5], ylim: [20, 80], xlabel: 'CGPA (x)', ylabel: 'stipend ₹k (y)', series: [{ t: 'scatter', pts: zip(CG, ST), c: 's1', labels: ['A', 'B', 'C', 'D', 'E'] }] } },
      { id: 'P03-candidates', title: 'Three students\' candidate lines (and the true OLS line)', notice: 'Same structure, different m and c. The dashed line ŷ = 14x − 57 is the OLS best fit derived later in this lecture; it has the smallest total squared error (150).',
        spec: { type: 'xy', w: 540, h: 310, xlim: [5.5, 9.5], ylim: [20, 80], xlabel: 'CGPA', ylabel: 'stipend ₹k', legend: 'tl',
          series: [{ t: 'scatter', pts: zip(CG, ST), c: 'fg' }, { t: 'fn', f: x => 10 * x - 30, c: 's1', label: 'ŷ = 10x − 30 (SSE 275)' }, { t: 'fn', f: x => 12 * x - 40, c: 's2', label: 'ŷ = 12x − 40 (SSE 190)' }, { t: 'fn', f: x => 8 * x - 10, c: 's5', label: 'ŷ = 8x − 10 (SSE 350)' }, { t: 'fn', f: x => 14 * x - 57, c: 's3', dash: true, w: 2.5, label: 'OLS ŷ = 14x − 57 (SSE 150)' }] } },
      { id: 'P03-3d', title: 'Two inputs (IQ, CGPA): the model is a plane', notice: 'Plane fitted by least squares: ŷ ≈ 0.117·IQ + 12.89·CGPA − 60.70. Dotted drops show each student\'s height (stipend).',
        spec: { type: 'surface', w: 520, h: 360, xr: [85, 125], yr: [5.5, 9.5], xl: 'IQ', yl: 'CGPA', zl: 'stipend', zr: [10, 90],
          planes: [{ f: (a, b) => -60.699 + 0.11650 * a + 12.8932 * b, c: 's3' }],
          pts: [[110, 8, 50, 'A'], [120, 9, 75, 'B'], [90, 7, 45, 'C'], [100, 7.5, 40, 'D'], [95, 6, 30, 'E']] } }
    ],
    examples: [
      { title: 'Which candidate line is best? Compare total squared error (worked)', body: R`For each line compute the residuals $e = y - \hat y$ on the five students, then $\sum e^2$.

| Line | Predictions (A..E) | Residuals | $\sum e^2$ |
|---|---|---|---|
| 10x − 30 | 50, 60, 40, 45, 30 | 0, 15, 5, −5, 0 | **275** |
| 12x − 40 | 56, 68, 44, 50, 32 | −6, 7, 1, −10, −2 | **190** |
| 8x − 10 | 54, 62, 46, 50, 38 | −4, 13, −1, −10, −8 | **350** |
| 14x − 57 (OLS) | 55, 69, 41, 48, 27 | −5, 6, 4, −8, 3 | **150** |

Student 2's line is the best of the three guesses, but the OLS line beats all of them. That is what "best fit" means.` }
    ],
    traps: [
      'Two features → a **plane**, not a line (P2(b) is False). Three or more → a hyperplane.',
      'The intercept $c$ is a parameter too: $\\hat y = m_1x_1+m_2x_2+c$ has **3** parameters, not 2.',
      'The intercept is "the prediction at x = 0", which may be meaningless physically (CGPA 0 → −57 k stipend). That is fine; it is just where the line crosses the axis.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: R`How many learnable parameters does $\hat y = m_1(\text{IQ}) + m_2(\text{CGPA}) + c$ have?`, answer: 3, tol: 0, round: 'Exact integer', verify: '2+1',
        sol: 'Two slopes plus one intercept: $m_1, m_2, c$ → **3** (P2(a)).' },
      { type: 'mcq', diff: 'E', q: 'A regression model with **two input features** is geometrically a:', options: ['line in 2-D', 'line in 3-D', 'plane in 3-D', 'circle'], answer: 2,
        sol: 'P2(b,c): one input → line; two inputs → plane.', why: ['That is one input.', 'False (P2(b)).', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'E', q: R`In $\hat y = mx + c$, changing **c** (keeping m fixed):`, options: ['tilts the line', 'shifts the line up or down', 'changes the data', 'makes the line curved'], answer: 1,
        sol: 'm changes the tilt; c shifts the line vertically.', why: ['That is m.', 'Correct.', 'Parameters never change data.', 'Still a straight line.'] },
      { type: 'int', diff: 'M', q: R`For the CGPA data (8,50), (9,75), (7,45), (7.5,40), (6,30), compute the **sum of squared errors** of the line $\hat y = 12x - 40$.`, answer: 190, tol: 0, round: 'Exact integer', verify: 'sum((y-(12*x-40))**2 for x,y in [(8,50),(9,75),(7,45),(7.5,40),(6,30)])',
        sol: 'Predictions 56, 68, 44, 50, 32. Residuals −6, 7, 1, −10, −2. Squares 36 + 49 + 1 + 100 + 4 = **190**.' },
      { type: 'mcq', diff: 'M', q: 'Learning stipend from CGPA using examples where the stipend is known is:', options: ['unsupervised clustering', 'supervised regression', 'supervised classification', 'reinforcement learning'], answer: 1,
        sol: 'Labels (stipends) are given and the target is a continuous number → supervised regression.', why: ['Labels exist.', 'Correct.', 'The output is a number, not a class.', 'No rewards.'] },
      { type: 'mcq', diff: 'M', q: 'Why does the worksheet say we need a "mathematical criterion" to pick the line?', options: ['Because only one line can pass near the data', 'Because infinitely many (m, c) pairs exist and visual guessing is subjective', 'Because computers cannot draw lines', 'Because m must be positive'], answer: 1,
        sol: 'Key insight of Section 2: infinitely many lines; we need an objective rule (minimise the squared error).', why: ['Infinitely many lines are possible.', 'Correct.', 'Irrelevant.', 'Slopes can be negative.'] }
    ],
    source: 'Worksheet L3 pp.1–5; ISLR §3.1.'
  },
  /* ---------------------------------------------------------------- L03.2 */
  {
    id: 'L03.2', title: 'Residuals and errors', badge: 'class', pages: '5–8', ws: 'Section 4',
    concept: R`
General notation: $y$ = actual output, $x$ = input, data points $(x_i, y_i)$ for $i = 1, 2, \dots, n$.

Prediction for the $i$-th point: $\hat y_i = m x_i + c$.

The line usually does not pass through every point. The mismatch is the **error** or **residual**:
$$e_i = y_i - \hat y_i = y_i - (m x_i + c)$$

On a graph, residuals are the **vertical** gaps from each point to the line. We measure *vertical* distance because in regression $x$ is treated as fixed and we only predict $y$.

- $e_i > 0$: point is **above** the line (model under-predicts).
- $e_i < 0$: point is **below** the line (model over-predicts).
- $e_i = 0$: point lies exactly on the line.

:::key Key insight
Small errors → good model; large errors → bad model. Choose $m$ and $c$ to make the errors as small as possible.
:::

**PRACTICE P3.** Model $\hat y = 10x - 30$, point (8.0, 50): $\hat y = 10(8) - 30 = 50$; $e = 50 - 50 = 0$. The residual is **zero**: the prediction equals the actual value exactly.`,
    formulas: [
      { name: 'Residual', tex: R`e_i = y_i - \hat y_i = y_i - (mx_i + c)`, sym: 'Actual minus predicted (same units as y).', when: 'Every loss function and metric is built from residuals.' }
    ],
    plots: [
      { id: 'P03-residuals', title: 'Residuals are vertical gaps to the line ŷ = 10x − 30', notice: 'Green gaps: point above the line (e > 0). Red gaps: below (e < 0). Student A sits exactly on the line (e = 0).',
        spec: { type: 'xy', w: 540, h: 310, xlim: [5.5, 9.5], ylim: [20, 80], xlabel: 'CGPA', ylabel: 'stipend ₹k',
          series: [{ t: 'fn', f: x => 10 * x - 30, c: 's1' },
            { t: 'seg', segs: [[9, 60, 9, 75], [7, 40, 7, 45]], c: 's3', w: 2.5 }, { t: 'seg', segs: [[7.5, 45, 7.5, 40]], c: 's4', w: 2.5 },
            { t: 'scatter', pts: zip(CG, ST), c: 'fg', labels: ['A: e=0', 'B: e=+15', 'C: e=+5', 'D: e=−5', 'E: e=0'] }] } }
    ],
    examples: [
      { title: 'Residuals of the line ŷ = 10x − 30 (worked)', body: R`| Student | x | y | ŷ = 10x − 30 | e = y − ŷ |
|---|---|---|---|---|
| A | 8.0 | 50 | 50 | 0 |
| B | 9.0 | 75 | 60 | +15 |
| C | 7.0 | 45 | 40 | +5 |
| D | 7.5 | 40 | 45 | −5 |
| E | 6.0 | 30 | 30 | 0 |` }
    ],
    traps: [
      'Residual = **actual − predicted** ($y - \\hat y$), not the other way round. The sign matters for "above/below".',
      'Residuals are **vertical** distances, not perpendicular distances to the line.',
      'A residual of 0 at one point does not make the model good overall.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: R`Model $\hat y = 10x - 30$, point $(x, y) = (9, 75)$. Residual $e = y - \hat y$?`, answer: 15, tol: 0, round: 'Exact integer', verify: '75-(10*9-30)',
        sol: '$\\hat y = 90 - 30 = 60$; $e = 75 - 60 = $ **15** (point above the line).' },
      { type: 'int', diff: 'E', q: R`Model $\hat y = 12x - 40$, point $(7.5, 40)$. Residual?`, answer: -10, tol: 0, round: 'Exact integer', verify: '40-(12*7.5-40)',
        sol: '$\\hat y = 90 - 40 = 50$; $e = 40 - 50 = $ **−10** (point below the line; over-prediction).' },
      { type: 'mcq', diff: 'E', q: 'The vertical gap between a data point and the regression line is called:', options: ['Bias', 'Residual (error)', 'Slope', 'Intercept'], answer: 1,
        sol: 'Residual $e_i = y_i - \\hat y_i$.', why: ['Bias is a different concept (L9).', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why are residuals measured **vertically** in regression?', options: ['It is easier to draw', 'x is treated as fixed; we only predict y', 'Perpendicular distance is always larger', 'Because slopes are positive'], answer: 1,
        sol: 'Worksheet Section 4: x is given; error is only in the predicted y.', why: ['Not the reason.', 'Correct.', 'Perpendicular distance is actually smaller.', 'Irrelevant.'] },
      { type: 'mcq', diff: 'M', q: 'A residual is **negative**. This means the point lies:', options: ['above the line (model under-predicts)', 'below the line (model over-predicts)', 'on the line', 'outside the data range'], answer: 1,
        sol: '$e = y - \\hat y < 0 \\Rightarrow \\hat y > y$: the prediction is too high, the point is below the line.', why: ['That is e > 0.', 'Correct.', 'That is e = 0.', 'Unrelated.'] }
    ],
    source: 'Worksheet L3 pp.5–8; ISLR §3.1.1.'
  },
  /* ---------------------------------------------------------------- L03.3 */
  {
    id: 'L03.3', title: 'Building the loss: signed, absolute, squared', badge: ['class', 'board'], pages: '8–12', ws: 'Section 5 + whiteboard',
    concept: R`
How do we combine all residuals into **one number** measuring overall quality? That number is the **loss function**. Three attempts:

**Attempt 1 — total signed error** $\sum e_i$. Fatal problem: **positive and negative errors cancel**. Errors +10, +5, +4, −10, −3, −6 sum to **0**, yet no error is zero (PRACTICE P4). A total of 0 does **not** mean a perfect model.

**Attempt 2 — total absolute error** $\sum |e_i| = \sum|y_i - mx_i - c|$. No cancellation. But for the OLS derivation it has a difficulty:
- $\frac{d}{de}|e| = -1$ for $e<0$ and $+1$ for $e>0$;
- **at $e = 0$ the derivative is undefined** (sharp V-corner), so $|e|$ is not smoothly differentiable everywhere, which blocks the clean calculus derivation.

*Why absolute error is robust to outliers:* it penalises **linearly**. Error 1 → penalty 1; error 10 → penalty 10. A single outlier cannot dominate.

**Attempt 3 — total squared error ✓** (used by Ordinary Least Squares)
$$E(m,c) = \sum_{i=1}^n e_i^2 = \sum_{i=1}^n (y_i - m x_i - c)^2$$
- **always non-negative** (no cancellation);
- **differentiable everywhere** (the parabola $x^2$ has derivative $2x$, defined at 0);
- **penalises large errors quadratically**.

*Why squared error is sensitive to outliers:* error 1 → 1, error 2 → 4, error 10 → **100**. An error 10× larger gets a 100× larger penalty, so outliers pull the OLS line strongly.

| e | \|e\| | e² |
|---|---|---|
| 1 | 1 | 1 |
| 2 | 2 | 4 |
| 3 | 3 | 9 |
| 5 | 5 | 25 |
| 10 | 10 | 100 |
| 20 | 20 | 400 |

**PRACTICE P5.** (b) Signed error can total 0 with every error non-zero → **True**. (c) $|e|$ differentiable at 0 → **False**. (d) Squared error penalises an error of 10 exactly 10× more than 1 → **False** (100×). (e) Cancellation → **C (signed)**; smooth and differentiable → **A (squared)**; robust to outliers → **B (absolute)**.

**From the whiteboard — the MAE curve has kinks.** One-parameter model $\hat y = wx$ on points (2, 3), (1, 2), (3, 9): $J(w) = \frac13\sum|y_i - wx_i|$ is **piecewise linear**, with corners at $w = y_i/x_i$ = 1.5, 2, 3, and a **flat bottom** for $w \in [2, 3]$ (every $w$ there gives $J = 1.333$). The MSE curve for the same data is a smooth parabola with a single minimum. In 2-D the squared-error surface is a **smooth bowl**, while the absolute-error surface is a **faceted (polygonal) bowl**.

:::take Takeaway
Squared error is chosen because it is non-negative, differentiable everywhere (clean calculus), and strongly penalises large errors. The trade-off is **sensitivity to outliers**.
:::`,
    formulas: [
      { name: 'Signed total (fails)', tex: R`\sum_{i} e_i`, sym: 'Can be 0 with large individual errors.', when: 'Never as a loss.' },
      { name: 'Absolute total (robust)', tex: R`\sum_i |y_i - mx_i - c|`, sym: 'Linear penalty; derivative undefined at 0.', when: 'Outlier-robust fitting (MAE, L7).' },
      { name: 'Squared total (OLS loss)', tex: R`E(m,c) = \sum_i (y_i - mx_i - c)^2`, sym: 'Quadratic penalty; smooth.', when: 'OLS; closed-form derivation.' },
      { name: 'Derivatives', tex: R`\frac{d}{de}|e| = \operatorname{sign}(e)\ (e\neq 0),\qquad \frac{d}{de}e^2 = 2e`, sym: 'sign(e) = ±1; undefined at e = 0.', when: 'Why OLS uses e².' }
    ],
    plots: [
      { id: 'P03-abs', title: 'The V-shape of |e|: no derivative at e = 0', notice: 'Slope −1 on the left, +1 on the right, and a sharp corner at 0 where the derivative is undefined.',
        spec: { type: 'xy', w: 420, h: 260, xlim: [-3, 3], ylim: [-0.3, 3], xlabel: 'e', ylabel: '|e|', series: [{ t: 'fn', f: Math.abs, c: 's1', w: 2.5 }, { t: 'text', x: -1.7, y: 2.3, s: 'slope −1' }, { t: 'text', x: 1.7, y: 2.3, s: 'slope +1' }, { t: 'scatter', pts: [[0, 0]], c: 's4', r: 5 }, { t: 'text', x: 0, y: 0.45, s: 'corner: undefined' }] } },
      { id: 'P03-abs-vs-sq', title: 'Absolute vs squared penalty', notice: 'For |e| < 1 squared is smaller; beyond 1 it grows much faster. Error 10 costs 10 vs 100.',
        spec: { type: 'xy', w: 480, h: 280, xlim: [-5, 5], ylim: [0, 25], xlabel: 'error e', ylabel: 'penalty', legend: 'tl', series: [{ t: 'fn', f: Math.abs, c: 's3', label: '|e| (absolute)' }, { t: 'fn', f: e => e * e, c: 's4', label: 'e² (squared)' }] } },
      { id: 'P03-maecurve', title: 'Whiteboard: MAE vs MSE as functions of one weight w (ŷ = wx)', notice: 'Points (2,3), (1,2), (3,9). MAE has kinks at w = 1.5, 2, 3 and a flat minimum on [2, 3]. MSE is a smooth parabola with a unique minimum at w = Σxy/Σx² = 35/14 = 2.5.',
        spec: (function () {
          const X = [2, 1, 3], Y = [3, 2, 9];
          const mae = w => X.reduce((s, x, i) => s + Math.abs(Y[i] - w * x), 0) / 3, mse = w => X.reduce((s, x, i) => s + (Y[i] - w * x) ** 2, 0) / 3;
          return { type: 'xy', w: 540, h: 300, xlim: [0.5, 4.5], ylim: [0, 8], xlabel: 'weight w', ylabel: 'loss', legend: 'tr',
            series: [{ t: 'band', x0: 2, x1: 3, c: 's3', op: 0.15 }, { t: 'fn', f: mae, c: 's3', w: 2.5, label: 'MAE (kinks)' }, { t: 'fn', f: mse, c: 's4', label: 'MSE (smooth)', dash: true }, { t: 'scatter', pts: [[1.5, mae(1.5)], [2, mae(2)], [3, mae(3)]], c: 's3', r: 4 }] };
        })() },
      { id: 'P03-outlierfit', title: 'One outlier (10, 20) drags the squared-error line, not the absolute-error line', notice: 'Study-hours data + outlier. OLS slope collapses from 6.75 to 2.18; a least-absolute-error line stays near 6.3.',
        spec: { type: 'xy', w: 540, h: 310, xlim: [0, 11], ylim: [0, 100], xlabel: 'study hours', ylabel: 'quiz score', legend: 'tl',
          series: [{ t: 'scatter', pts: zip(HR, QS), c: 'fg' }, { t: 'scatter', pts: [[10, 20]], c: 's4', m: 'x', r: 7 },
            { t: 'fn', f: x => 6.75 * x + 19.25, c: 's7', dash: true, label: 'OLS without outlier: 6.75x + 19.25' },
            { t: 'fn', f: x => 2.1781 * x + 34.7945, c: 's4', label: 'OLS with outlier: 2.18x + 34.79' },
            { t: 'fn', f: x => 6.26 * x + 21.2, c: 's3', label: 'abs-error with outlier: ≈ 6.26x + 21.2' }] } },
      { id: 'P03-surfaces', title: 'Whiteboard: squared-error surface (smooth bowl) vs absolute-error surface (faceted bowl)', notice: 'Both over (m, c) for the CGPA data. The squared surface is smooth everywhere; the absolute surface has creases, which is why calculus is messy for MAE.',
        spec: { type: 'multi', panels: [
          { type: 'surface', w: 380, h: 300, title: 'Σe² (smooth)', xr: [8, 20], yr: [-100, -15], xl: 'm', yl: 'c', zl: 'E', n: 20, f: (m, c) => CG.reduce((s, x, i) => s + (ST[i] - m * x - c) ** 2, 0) },
          { type: 'surface', w: 380, h: 300, title: 'Σ|e| (creased)', xr: [8, 20], yr: [-100, -15], xl: 'm', yl: 'c', zl: 'E', n: 20, f: (m, c) => CG.reduce((s, x, i) => s + Math.abs(ST[i] - m * x - c), 0) }] } }
    ],
    examples: [
      { title: 'PRACTICE P4 — the cancellation trap (worked)', body: R`Errors +10, +5, +4, −10, −3, −6.
- Signed: 10 + 5 + 4 − 10 − 3 − 6 = **0** (misleading).
- Absolute: 10 + 5 + 4 + 10 + 3 + 6 = **38**.
- Squared: 100 + 25 + 16 + 100 + 9 + 36 = **286**.` },
      { title: 'Whiteboard MAE curve (worked)', body: R`$J(w) = \frac13(|3 - 2w| + |2 - w| + |9 - 3w|)$.
- $w = 0$: (3 + 2 + 9)/3 = 4.667
- $w = 2$: (1 + 0 + 3)/3 = 1.333
- $w = 2.5$: (2 + 0.5 + 1.5)/3 = 1.333
- $w = 3$: (3 + 1 + 0)/3 = 1.333
- $w = 4$: (5 + 2 + 3)/3 = 3.333

The minimum is **not unique** (all of [2, 3]). For MSE: $\frac{d}{dw}\sum(y_i - wx_i)^2 = 0 \Rightarrow w = \frac{\sum x_iy_i}{\sum x_i^2} = \frac{6+2+27}{4+1+9} = \frac{35}{14} = 2.5$, a unique minimum.` }
    ],
    code: [{ title: 'Signed vs absolute vs squared; MAE curve; outlier pull', scratch: 'L03_loss_outliers_scratch.py' }],
    traps: [
      'Total signed error = 0 does **not** mean a perfect model (cancellation).',
      'Squared error penalises an error of 10 **100×** (not 10×) more than an error of 1.',
      '**Absolute** error is robust to outliers; **squared** error is sensitive. Course quizzes ask "which model is more influenced by the outlier?" → the squared-error one.',
      '|e| is not differentiable **only at 0**; everywhere else its derivative is ±1.',
      'For |e| < 1, e² < |e|. Squared error only "punishes more" for errors larger than 1.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'Errors: +10, +5, +4, −10, −3, −6. What is the **total signed error**?', answer: 0, tol: 0, round: 'Exact', verify: '10+5+4-10-3-6',
        sol: 'They cancel to **0**, even though every error is non-zero (P4).' },
      { type: 'int', diff: 'E', q: 'Same errors (+10, +5, +4, −10, −3, −6). What is the **total squared error**?', answer: 286, tol: 0, round: 'Exact', verify: 'sum(e*e for e in [10,5,4,-10,-3,-6])',
        sol: '100 + 25 + 16 + 100 + 9 + 36 = **286**.' },
      { type: 'mcq', diff: 'M', q: 'Model A uses squared error, model B uses absolute error. The data contain one extreme outlier. Which is true?', options: ['A ignores the outlier; B overfits it', 'A is more strongly influenced by the outlier than B', 'Both give identical lines', 'B always has lower total error'], answer: 1,
        sol: 'Squared error magnifies large residuals quadratically, so the OLS line is pulled toward outliers.', why: ['Reversed.', 'Correct.', 'They differ when outliers exist.', 'Each minimises its own loss; no such guarantee.'] },
      { type: 'mcq', diff: 'E', q: 'Why is absolute error inconvenient for the OLS closed-form derivation?', options: ['It can be negative', '|e| is not differentiable at e = 0', 'It squares the errors', 'It is always zero'], answer: 1,
        sol: 'The V-shape has a corner at 0, so the derivative is undefined there (P5(c) False).', why: ['|e| ≥ 0.', 'Correct.', 'That is squared error.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Match: "robust to outliers" belongs to which loss?', options: ['Signed error', 'Absolute error', 'Squared error', 'None'], answer: 1,
        sol: 'P5(e): 1→C signed (cancellation), 2→A squared (smooth), 3→B absolute (robust).', why: ['Signed has the cancellation problem.', 'Correct.', 'Squared is sensitive.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** properties of squared error $e^2$.', options: ['Always non-negative', 'Differentiable everywhere', 'Penalises error 10 exactly 10× more than error 1', 'Sensitive to outliers'], answer: [0, 1, 3],
        sol: 'Non-negative, smooth, quadratic (10 → 100×, not 10×), hence outlier-sensitive.', why: ['Correct.', 'Correct.', 'False: 100×.', 'Correct.'] },
      { type: 'int', diff: 'H', q: R`Whiteboard example: $\hat y = wx$ fitted to (2, 3), (1, 2), (3, 9) by **MSE**. The minimising $w$ is $\sum x_iy_i / \sum x_i^2$. Compute it.`, answer: 2.5, tol: 0.001, round: '1 decimal', verify: '(2*3+1*2+3*9)/(4+1+9)',
        sol: '$\\sum xy = 6 + 2 + 27 = 35$, $\\sum x^2 = 4 + 1 + 9 = 14$, $w = 35/14 = $ **2.5**. (The MAE minimum is the whole interval [2, 3].)' },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
e = np.array([1, -2, 10])
print(np.abs(e).sum(), (e ** 2).sum(), e.sum())`, answer: '13 105 9',
        sol: 'Absolute 1 + 2 + 10 = 13; squared 1 + 4 + 100 = 105; signed 1 − 2 + 10 = 9.' }
    ],
    source: 'Worksheet L3 pp.8–12; Whiteboard L04 (20 Aug) pp.4–6; ESL §2.4 (loss functions).'
  },
  /* ---------------------------------------------------------------- L03.4 */
  {
    id: 'L03.4', title: 'Closed-form vs iterative; the error surface', badge: 'class', pages: '13–14', ws: 'Sections 6–7',
    concept: R`
**Two ways to solve an optimisation problem**

| Approach | Meaning | Example |
|---|---|---|
| **Closed-form** | an exact formula; plug data in, get the optimal parameters directly | **OLS** for simple linear regression (this lecture) |
| **Iterative** | start from initial guesses, update step by step until the error is small | **gradient descent** (Lectures 5–6) |

**PRACTICE P6.** "Direct formula, plug in and get the answer" → **A closed-form**. "Start random, improve over many rounds" → **B iterative**. "OLS for linear regression" → **A**.

**The error surface.** For every pair $(m, c)$ there is one value $E(m,c) = \sum (y_i - mx_i - c)^2$. Plot $m$ on one axis, $c$ on another and $E$ upward: for SLR this is a **convex, bowl-shaped** surface. The bottom of the bowl is the **global minimum**, the best $(m, c)$.

At the minimum the surface is **flat in both directions**:
$$\frac{\partial E}{\partial c} = 0 \quad\text{and}\quad \frac{\partial E}{\partial m} = 0$$
Because the surface is **convex**, this stationary point is guaranteed to be the global minimum, not just a local one.`,
    formulas: [
      { name: 'First-order conditions', tex: R`\frac{\partial E}{\partial m} = 0,\qquad \frac{\partial E}{\partial c} = 0`, sym: 'Gradient = 0 at the bottom of the bowl.', when: 'Starting point of the OLS derivation.' },
      { name: 'Error surface', tex: R`E(m,c) = \sum_{i=1}^{n}(y_i - mx_i - c)^2`, sym: 'Convex quadratic in (m, c) for SLR.', when: 'Visualising "best fit" as the lowest point.' }
    ],
    plots: [
      { id: 'P03-bowl', title: 'SSE surface E(m, c) for the study-hours data', notice: 'A single convex bowl. The minimum sits at m = 6.75, c = 19.25 (the OLS solution). Any stationary point of a convex bowl is the global minimum.',
        spec: { type: 'surface', w: 540, h: 380, xr: [2, 11.5], yr: [0, 40], xl: 'm', yl: 'c', zl: 'E(m,c)', n: 22,
          f: (m, c) => HR.reduce((s, x, i) => s + (QS[i] - m * x - c) ** 2, 0),
          pts: [[6.75, 19.25, 27.5, 'minimum (6.75, 19.25)']] } }
    ],
    examples: [
      { title: 'Closed-form or iterative? (worked)', body: R`| Method | Type |
|---|---|
| $m = S_{xy}/S_{xx}$, $c = \bar y - m\bar x$ | closed-form |
| Normal equation $\beta = (X^TX)^{-1}X^Ty$ (L4) | closed-form |
| Batch / stochastic / mini-batch gradient descent (L5–6) | iterative |
| Lasso (no general closed form, L12) | iterative (coordinate descent) |
| Logistic regression (L14–15) | iterative |` }
    ],
    traps: [
      'OLS is **closed-form**, not iterative (P11(f) False).',
      'Convexity is what guarantees the stationary point is the **global** minimum.',
      'The surface\'s axes are the **parameters** (m, c), not the data (x, y).'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'OLS for simple linear regression is a(n):', options: ['iterative solution', 'closed-form solution', 'random search', 'reinforcement method'], answer: 1,
        sol: 'P6: OLS gives exact formulas for m and c.', why: ['That is GD.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: '"I start with random values and improve them over many rounds" describes:', options: ['a closed-form solution', 'an iterative solution', 'the normal equation', 'OLS'], answer: 1,
        sol: 'P6(2) → B iterative (e.g. gradient descent).', why: ['Closed form is one shot.', 'Correct.', 'Closed form.', 'Closed form.'] },
      { type: 'mcq', diff: 'M', q: 'Why is the point where ∂E/∂m = ∂E/∂c = 0 guaranteed to be the **global** minimum for SLR?', options: ['Because E is always zero there', 'Because E(m, c) is convex (bowl-shaped)', 'Because m is positive', 'Because the data are linear'], answer: 1,
        sol: 'A convex function has no separate local minima; any stationary point is global.', why: ['E is usually positive at the minimum.', 'Correct.', 'Irrelevant.', 'Even for non-linear data, the SSE in (m, c) is convex.'] },
      { type: 'mcq', diff: 'M', q: 'In the error-surface picture, the horizontal axes are:', options: ['x and y (the data)', 'm and c (the parameters)', 'ŷ and e', 'n and i'], answer: 1,
        sol: 'Each point on the floor is a candidate line (m, c); the height is its total squared error.', why: ['The data are fixed.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Which are **iterative** methods? (select all)', options: ['Batch gradient descent', 'The normal equation', 'Stochastic gradient descent', 'OLS slope formula'], answer: [0, 2],
        sol: 'GD variants update step by step. The normal equation and OLS formulas are closed-form.', why: ['Correct.', 'Closed-form.', 'Correct.', 'Closed-form.'] }
    ],
    source: 'Worksheet L3 pp.13–14; Boyd & Vandenberghe, *Convex Optimization* §3.1 (convexity).'
  },
  /* ---------------------------------------------------------------- L03.5 */
  {
    id: 'L03.5', title: 'Deriving the intercept c = ȳ − m x̄', badge: ['class', 'board'], pages: '14–15', ws: 'Section 8 + whiteboard',
    concept: R`
Start from $E(m,c) = \sum_{i=1}^n (y_i - mx_i - c)^2$, set $\partial E/\partial c = 0$ and solve for $c$. The full steps are below.

:::key Key insight
$c = \bar y - m\bar x$ means $\bar y = m\bar x + c$: **the OLS line always passes through $(\bar x, \bar y)$**, the centre of the data.
:::

**PRACTICE P7.** (a) The mistaken step writes $\sum_{i=1}^n c = c$; the correct step is $\sum_{i=1}^n c = nc$ (c is added to itself n times). (b) "The intercept depends only on the mean of the outputs" → **False** (it also depends on m and $\bar x$). (c) "$\sum c = c$ is correct" → **False**. (d) $c = \bar y - m\bar x$ tells us the line passes through $(\bar x, \bar y)$.

**Bonus consequence.** The first-order condition $\sum (y_i - mx_i - c) = 0$ is literally $\sum e_i = 0$: **OLS residuals always sum to zero** (when an intercept is included). Check on the CGPA fit: −5 + 6 + 4 − 8 + 3 = 0.`,
    deriv: [
      { id: 'D03-intercept', title: 'Derivation of the intercept (Equation 1)', badge: ['class', 'board'],
        steps: [
          { m: R`E(m,c) = \sum_{i=1}^{n}\left(y_i - mx_i - c\right)^2`, t: 'Start from the squared-error loss.' },
          { m: R`\frac{\partial E}{\partial c} = 0`, t: 'At the minimum the slope in the c-direction is zero.' },
          { m: R`\frac{\partial E}{\partial c} = \sum_{i=1}^{n}\frac{\partial}{\partial c}\left(y_i - mx_i - c\right)^2`, why: 'The derivative of a sum is the sum of the derivatives.' },
          { m: R`\text{let } r_i = y_i - mx_i - c:\quad \frac{\partial}{\partial c} r_i^2 = 2r_i\frac{\partial r_i}{\partial c},\qquad \frac{\partial r_i}{\partial c} = -1`, why: 'Chain rule. $y_i$ and $mx_i$ are constants with respect to c; the derivative of −c is −1.' },
          { m: R`\frac{\partial E}{\partial c} = -2\sum_{i=1}^{n}\left(y_i - mx_i - c\right)`, t: 'Combine.' },
          { m: R`\sum_{i=1}^{n}\left(y_i - mx_i - c\right) = 0`, why: 'Set to zero and divide both sides by −2.' },
          { m: R`\sum_{i=1}^{n} y_i - m\sum_{i=1}^{n} x_i - \sum_{i=1}^{n} c = 0`, why: 'Split the sum; m is a constant so it comes outside.' },
          { m: R`\sum_{i=1}^{n} y_i - m\sum_{i=1}^{n} x_i - nc = 0`, why: '$\\sum_{i=1}^n c = nc$: the constant c is added to itself n times (P7 trap).' },
          { m: R`c = \frac1n\sum_{i=1}^{n} y_i - m\,\frac1n\sum_{i=1}^{n} x_i`, why: 'Move nc to the other side and divide by n.' },
          { m: R`\bar x = \frac1n\sum x_i,\quad \bar y = \frac1n\sum y_i`, t: 'Recognise the sample means.' }
        ],
        result: R`c = \bar y - m\,\bar x`,
        after: 'Substituting $x = \\bar x$ into $\\hat y = mx + c$ gives $m\\bar x + \\bar y - m\\bar x = \\bar y$: the line passes through $(\\bar x, \\bar y)$.' }
    ],
    formulas: [
      { name: 'Intercept (Equation 1)', tex: R`c = \bar y - m\,\bar x`, sym: '$\\bar x, \\bar y$ = sample means.', when: 'After computing m.' },
      { name: 'Residuals sum to zero', tex: R`\sum_{i=1}^n e_i = 0`, sym: 'Follows from ∂E/∂c = 0.', when: 'Checking a hand calculation; MCQs.' }
    ],
    examples: [
      { title: 'Using Equation 1 (worked)', body: R`Study data: $\bar x = 5$, $\bar y = 53$, $m = 6.75$ → $c = 53 - 6.75 \times 5 = 53 - 33.75 = $ **19.25**.
CGPA data: $\bar x = 7.5$, $\bar y = 48$, $m = 14$ → $c = 48 - 105 = $ **−57**.` }
    ],
    traps: [
      '$\\sum_{i=1}^n c = nc$, **not** c (the deliberate mistake in P7).',
      'c depends on m, $\\bar x$ **and** $\\bar y$, not only on $\\bar y$.',
      'You must compute **m first**, then c.',
      'Residuals sum to zero only when the model has an intercept.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: R`In the derivation, $\sum_{i=1}^n c$ equals:`, options: ['c', 'nc', 'c/n', '0'], answer: 1,
        sol: 'c is a constant added to itself n times → nc (P7).', why: ['The P7 mistake.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: R`What does $c = \bar y - m\bar x$ tell us about the OLS line?`, options: ['It passes through the origin', R`It passes through $(\bar x, \bar y)$`, 'It passes through every data point', R`Its slope is $\bar y/\bar x$`], answer: 1,
        sol: 'At $x = \\bar x$: $\\hat y = m\\bar x + \\bar y - m\\bar x = \\bar y$.', why: ['Only if $\\bar y = m\\bar x$.', 'Correct.', 'False (P11(a)).', 'No.'] },
      { type: 'int', diff: 'E', q: R`$\bar x = 4$, $\bar y = 20$, $m = 3$. Compute the OLS intercept c.`, answer: 8, tol: 0, round: 'Exact', verify: '20-3*4',
        sol: '$c = 20 - 3 \\times 4 = $ **8**.' },
      { type: 'mcq', diff: 'M', q: R`In $\partial(y_i - mx_i - c)^2/\partial c$, the inner derivative $\partial(y_i - mx_i - c)/\partial c$ is:`, options: ['1', '−1', '−x_i', '2'], answer: 1,
        sol: '$y_i$ and $mx_i$ do not depend on c; d(−c)/dc = −1. So the whole derivative is $-2(y_i - mx_i - c)$.', why: ['Sign error.', 'Correct.', 'That is the derivative w.r.t. m.', 'The 2 comes from the outer square.'] },
      { type: 'mcq', diff: 'M', q: 'In an OLS fit with an intercept, the sum of the residuals is always:', options: ['positive', 'zero', 'equal to n', 'equal to the SSE'], answer: 1,
        sol: '∂E/∂c = 0 gives $\\sum(y_i - mx_i - c) = \\sum e_i = 0$.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
x = np.array([8.0, 9.0, 7.0, 7.5, 6.0]); y = np.array([50, 75, 45, 40, 30])
m, c = np.polyfit(x, y, 1)
print(round(c, 2), abs(np.sum(y - (m * x + c))) < 1e-9)`, answer: '-57.0 True',
        sol: 'The OLS fit is ŷ = 14x − 57, and the residuals of an OLS fit with intercept sum to 0 (up to tiny floating-point noise), so the check prints True.',
        tag: 'GATE-style' }
    ],
    source: 'Worksheet L3 pp.14–15; Whiteboard L04 p.7; ISLR eq. (3.4).'
  },
  /* ---------------------------------------------------------------- L03.6 */
  {
    id: 'L03.6', title: 'Deriving the slope m; the final OLS model', badge: ['class', 'board'], pages: '16–18', ws: 'Sections 9–10 + whiteboard',
    concept: R`
Substitute $c = \bar y - m\bar x$ into $E$. This **reduces the loss to a function of the single unknown m** (P8(a)), which we then differentiate.

:::note Naming used on this site
The worksheet defines $a_i = x_i - \bar x$ and $b_i = y_i - \bar y$ but then writes the loss as $(a_i - mb_i)^2$, which swaps their roles, and fixes it at the very end. To stay consistent we use $a_i = x_i - \bar x$ (x-deviation) and $b_i = y_i - \bar y$ (y-deviation) throughout, so $E(m) = \sum(b_i - m a_i)^2$ and $m = \sum a_ib_i/\sum a_i^2$. The final formula is identical. (See UNCLEAR.md item 1.)
:::

:::key Key insight
Numerator $\sum(x_i-\bar x)(y_i-\bar y)$ measures how x and y **vary together** (covariance). Denominator $\sum(x_i-\bar x)^2$ measures how much x varies by itself (variance). So $m = \dfrac{\text{Cov}(x,y)}{\text{Var}(x)}$ (the 1/n factors cancel). This is how the whiteboard writes it.
:::

The formula needs the denominator ≠ 0. If **every x is the same**, all deviations are 0, the slope is **undefined**, and no unique line can be fitted (P8(e), Reflect 2).

**Section 10 — the final OLS model.** Step 1: compute m (Equation 2). Step 2: substitute into Equation 1 to get c. Step 3: write $\hat y = mx + c$. "Best fit" means precisely: **the line that minimises the total squared error.**

**PRACTICE P8.** (a) Substituting c first reduces the loss to one unknown, m. (b) $\frac{d}{dm}(b_i - ma_i)^2 = 2(b_i - ma_i)(-a_i)$. (c) Expanding $\sum a_i(b_i - ma_i) = 0$ gives $\sum a_ib_i - m\sum a_i^2 = 0$ so $m = \sum a_ib_i/\sum a_i^2$. (d) The denominator is the **variance of x** (B, up to the 1/n). (e) All $x_i$ equal → denominator 0 → slope undefined.

**PRACTICE P9 — order of the OLS steps:** 1 assume $\hat y = mx + c$ → 2 compute residual $e_i$ → 3 square each residual → 4 add to form $E(m,c)$ → 5 set $\partial E/\partial m = \partial E/\partial c = 0$ → 6 obtain closed-form m and c.`,
    deriv: [
      { id: 'D03-slope', title: 'Derivation of the slope (Equation 2)', badge: ['class', 'board'],
        steps: [
          { m: R`E = \sum_{i=1}^n\big(y_i - mx_i - (\bar y - m\bar x)\big)^2`, why: 'Substitute $c = \\bar y - m\\bar x$ (Equation 1).' },
          { m: R`E(m) = \sum_{i=1}^n\big((y_i - \bar y) - m(x_i - \bar x)\big)^2`, why: 'Regroup: $y_i - \\bar y$ and $-m x_i + m\\bar x = -m(x_i - \\bar x)$.' },
          { m: R`a_i = x_i - \bar x,\quad b_i = y_i - \bar y \;\Rightarrow\; E(m) = \sum_{i=1}^n (b_i - m a_i)^2`, t: 'Shorthand for the deviations from the means.' },
          { m: R`\frac{dE}{dm} = \sum_{i=1}^n 2(b_i - ma_i)\cdot\frac{d}{dm}(b_i - ma_i) = \sum_{i=1}^n 2(b_i - ma_i)(-a_i)`, why: 'Chain rule; $a_i, b_i$ are constants with respect to m.' },
          { m: R`-2\sum_{i=1}^n a_i(b_i - ma_i) = 0`, t: 'Set the derivative to zero for the minimum.' },
          { m: R`\sum_{i=1}^n a_i b_i - \sum_{i=1}^n m a_i^2 = 0`, why: 'Divide by −2 and expand.' },
          { m: R`\sum_{i=1}^n a_i b_i - m\sum_{i=1}^n a_i^2 = 0`, why: 'm does not depend on i, so it comes out of the sum.' },
          { m: R`m = \frac{\sum_{i=1}^n a_ib_i}{\sum_{i=1}^n a_i^2}`, t: 'Solve for m (requires $\\sum a_i^2 \\neq 0$).' }
        ],
        result: R`m = \frac{\sum_{i=1}^{n}(x_i-\bar x)(y_i-\bar y)}{\sum_{i=1}^{n}(x_i-\bar x)^2} = \frac{\operatorname{Cov}(x,y)}{\operatorname{Var}(x)}`,
        after: 'Then $c = \\bar y - m\\bar x$. Second-derivative check: $d^2E/dm^2 = 2\\sum a_i^2 > 0$, so this is a minimum.' }
    ],
    formulas: [
      { name: 'OLS slope (Equation 2)', tex: R`m = \frac{\sum (x_i-\bar x)(y_i-\bar y)}{\sum (x_i-\bar x)^2} = \frac{S_{xy}}{S_{xx}}`, sym: '$S_{xy}$ co-variation, $S_{xx}$ variation of x.', when: 'Every OLS-by-hand question.' },
      { name: 'Same slope, covariance form', tex: R`m = \frac{\operatorname{Cov}(x,y)}{\operatorname{Var}(x)}`, sym: 'The 1/n (or 1/(n−1)) factors cancel.', when: 'MCQs on what the slope "means".' },
      { name: 'Shortcut form', tex: R`m = \frac{n\sum x_iy_i - \sum x_i\sum y_i}{n\sum x_i^2 - (\sum x_i)^2}`, sym: 'Equivalent; uses raw sums.', when: 'When means are messy decimals.' }
    ],
    examples: [
      { title: 'Shortcut-form check (worked)', body: R`Study data $x = [1,3,5,7,9]$, $y = [25,40,55,65,80]$, $n = 5$.
$\sum x = 25$, $\sum y = 265$, $\sum xy = 25 + 120 + 275 + 455 + 720 = 1595$, $\sum x^2 = 1 + 9 + 25 + 49 + 81 = 165$.
$m = \dfrac{5(1595) - 25(265)}{5(165) - 625} = \dfrac{7975 - 6625}{825 - 625} = \dfrac{1350}{200} = 6.75$ ✓` }
    ],
    traps: [
      'The denominator is $\\sum(x_i - \\bar x)^2$ (x only), **not** $\\sum (y_i-\\bar y)^2$.',
      'If all $x_i$ are equal, the slope is **undefined** (division by zero), not zero.',
      'We substitute c first so the problem has one unknown; it is not because "c must always be computed first in ML".',
      'Worksheet typo: $a_i$/$b_i$ roles are swapped mid-derivation. The final formula is still correct.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: R`In $m = \dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}$, the denominator represents:`, options: ['Covariance of x and y', 'Variance of x (up to 1/n)', 'Mean of x', 'Mean squared error'], answer: 1,
        sol: 'P8(d): B, variance of x.', why: ['That is the numerator.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: R`Why do we substitute $c = \bar y - m\bar x$ into $E(m,c)$ before optimising m?`, options: ['c must always be computed before m in ML', 'It reduces the problem from two unknowns to one', 'c has no relation to m', 'Absolute error requires it'], answer: 1,
        sol: 'P8(a): the loss becomes a function of m alone.', why: ['Not a general rule.', 'Correct.', 'c depends on m.', 'Irrelevant.'] },
      { type: 'mcq', diff: 'E', q: 'If every student had the **same** study hours, the OLS slope would be:', options: ['0', '1', 'undefined', 'equal to ȳ'], answer: 2,
        sol: 'All deviations are 0, so the denominator is 0 → undefined (Reflect 2).', why: ['It is not zero, it is undefined.', 'No.', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'M', q: R`$\dfrac{d}{dm}(b_i - m a_i)^2$ equals:`, options: ['$2(b_i - ma_i)$', '$2(b_i - ma_i)(-a_i)$', '$-2a_i^2$', '$2(b_i - ma_i)(a_i)$'], answer: 1,
        sol: 'Chain rule: outer 2(·), inner derivative −a_i (P8(b)).', why: ['Missing the inner derivative.', 'Correct.', 'No.', 'Sign error.'] },
      { type: 'int', diff: 'M', q: R`Given $\sum (x_i-\bar x)(y_i-\bar y) = 70$ and $\sum (x_i-\bar x)^2 = 5$, compute m.`, answer: 14, tol: 0, round: 'Exact', verify: '70/5',
        sol: '$m = 70/5 = $ **14** (this is the CGPA dataset).' },
      { type: 'msq', diff: 'M', q: 'Correct order of the OLS procedure (P9)? Select the statements that are **true**.', options: ['Residuals are computed before they are squared', 'Partial derivatives are set to zero before forming E(m, c)', 'The model ŷ = mx + c is assumed first', 'The closed-form formulas are the last step'], answer: [0, 2, 3],
        sol: 'Order: assume model (1) → residuals (2) → square (3) → sum into E (4) → partial derivatives = 0 (5) → formulas (6).', why: ['True.', 'False: E must exist before you differentiate it.', 'True.', 'True.'] }
    ],
    source: 'Worksheet L3 pp.16–18; Whiteboard L04 pp.8–9; ISLR eq. (3.4).'
  },
  /* ---------------------------------------------------------------- L03.7 */
  {
    id: 'L03.7', title: 'OLS by hand; CGPA dataset; outlier impact', badge: 'class', pages: '18–20', ws: 'Sections 11–12, P10–P12',
    concept: R`
**PRACTICE P10 — OLS by hand (study hours → quiz score)**

| Student | x | y | $a = x-\bar x$ | $b = y-\bar y$ | $ab$ | $a^2$ |
|---|---|---|---|---|---|---|
| P | 1 | 25 | −4 | −28 | 112 | 16 |
| Q | 3 | 40 | −2 | −13 | 26 | 4 |
| R | 5 | 55 | 0 | 2 | 0 | 0 |
| S | 7 | 65 | 2 | 12 | 24 | 4 |
| T | 9 | 80 | 4 | 27 | 108 | 16 |
| **Σ** | 25 | 265 | 0 | 0 | **270** | **40** |

1. Means: $\bar x = 25/5 = 5$, $\bar y = 265/5 = 53$.
2. $m = 270/40 = $ **6.75**.
3. $c = 53 - 6.75 \times 5 = $ **19.25**.
4. Model: $\hat y = 6.75x + 19.25$. Prediction for 6 hours: $6.75(6) + 19.25 = $ **59.75**.

**Reflect 1** — passes through $(\bar x,\bar y)$? $\hat y(5) = 6.75(5) + 19.25 = 53 = \bar y$ ✓. **Reflect 2** — all study hours equal (say all 5) → $\sum(x_i-\bar x)^2 = 0$ → slope undefined; no unique line.

**The CGPA → stipend data solved (not stated in the worksheet).** $\bar x = 7.5$, $\bar y = 48$. Deviations $a = [0.5, 1.5, -0.5, 0, -1.5]$, $b = [2, 27, -3, -8, -18]$. $S_{xy} = 1 + 40.5 + 1.5 + 0 + 27 = 70$, $S_{xx} = 0.25 + 2.25 + 0.25 + 0 + 2.25 = 5$. So $m = 14$, $c = 48 - 105 = -57$: **ŷ = 14x − 57**, exactly the line drawn on worksheet p.6. A student with CGPA 8.5 is predicted ₹62k.

**PRACTICE P11 — true/false.** (a) passes through every point: **F**. (b) passes through $(\bar x,\bar y)$: **T**. (c) squared more robust than absolute: **F**. (d) derivative of |x| exists at 0: **F**. (e) m and c are the learnable parameters: **T**. (f) OLS is iterative: **F**. (g) all $x_i$ identical → slope undefined: **T**. (h) $E(m,c)$ is convex for SLR: **T**.

**PRACTICE P12 — outlier (10, 20) added.** (a) Absolute penalty $|20 - (10m + c)|$ grows **linearly**. (b) Squared penalty $(20 - \hat y)^2$ grows **quadratically**. (c) Squared error is more affected. (d) The OLS line **shifts toward the outlier**. Numerically: refitting the 6 points gives $\hat y = 2.178x + 34.795$; the slope collapses from 6.75 to 2.18.

:::take Takeaway
Story → scatter → line model → infinitely many lines → signed error fails → absolute error has issues → **squared error wins** → OLS derivation → best-fit model.
:::`,
    formulas: [
      { name: 'OLS recipe', tex: R`\bar x,\bar y \;\to\; S_{xy}=\sum ab,\ S_{xx}=\sum a^2 \;\to\; m=\frac{S_{xy}}{S_{xx}} \;\to\; c=\bar y-m\bar x`, sym: '$a = x-\\bar x$, $b = y-\\bar y$.', when: 'Any "fit by hand" question.' },
      { name: 'SSE of the fit', tex: R`\text{SSE} = \sum (y_i - \hat y_i)^2`, sym: 'CGPA fit: residuals −5, 6, 4, −8, 3 → SSE = 150.', when: 'Comparing lines; R² later (L7).' }
    ],
    plots: [
      { id: 'P03-fit', title: 'The OLS line for the study-hours data passes through (x̄, ȳ) = (5, 53)', notice: 'ŷ = 6.75x + 19.25. The star marks the mean point; every OLS line with an intercept goes through it.',
        spec: { type: 'xy', w: 520, h: 300, xlim: [0, 10], ylim: [10, 90], xlabel: 'study hours (x)', ylabel: 'quiz score (y)', legend: 'tl',
          series: [{ t: 'scatter', pts: zip(HR, QS), c: 's1', labels: ['P', 'Q', 'R', 'S', 'T'], label: 'students' }, { t: 'fn', f: x => 6.75 * x + 19.25, c: 's3', label: 'ŷ = 6.75x + 19.25' }, { t: 'scatter', pts: [[5, 53]], c: 's4', m: '^', r: 7, label: '(x̄, ȳ) = (5, 53)' }, { t: 'scatter', pts: [[6, 59.75]], c: 's2', m: 's', r: 5, label: 'prediction at 6 h: 59.75' }] } }
    ],
    examples: [
      { title: 'A fresh OLS-by-hand problem (worked)', body: R`x = [2, 4, 6, 8], y = [3, 7, 5, 9].
- $\bar x = 5$, $\bar y = 6$.
- $a = [-3, -1, 1, 3]$, $b = [-3, 1, -1, 3]$.
- $\sum ab = 9 - 1 - 1 + 9 = 16$; $\sum a^2 = 9 + 1 + 1 + 9 = 20$.
- $m = 16/20 = 0.8$; $c = 6 - 0.8 \times 5 = 2$. **ŷ = 0.8x + 2**; ŷ(10) = 10.` },
      { title: 'Course lab: compute_ols(x, y) (worked)', body: R`Input x = [1, 2, 3, 4, 5], y = [2, 4, 5, 4, 5]. $\bar x = 3$, $\bar y = 4$. $a = [-2,-1,0,1,2]$, $b = [-2, 0, 1, 0, 1]$. $\sum ab = 4 + 0 + 0 + 0 + 2 = 6$, $\sum a^2 = 10$. $m = 0.6$, $c = 4 - 1.8 = 2.2$ → output "0.60 2.20". If all x are equal, return [−1.0, −1.0].` }
    ],
    code: [{ title: 'OLS from scratch and with libraries (P10, CGPA data, outlier)', scratch: 'L03_ols_scratch.py', lib: 'L03_ols_sklearn.py', more: [['Course lab: compute_ols', 'L03_lab_compute_ols.py']] }],
    traps: [
      'Compute the means **first** and double-check that $\\sum a_i = 0$ and $\\sum b_i = 0$; if not, there is an arithmetic slip.',
      'scikit-learn needs a **2-D** X: `X.reshape(-1, 1)`; `np.polyfit(x, y, 1)` returns **[slope, intercept]**.',
      'The OLS line passes through $(\\bar x, \\bar y)$ but generally through **none** of the data points.',
      'Adding one outlier can change the slope dramatically (6.75 → 2.18).'
    ],
    questions: [
      { type: 'int', diff: 'M', q: 'Study hours x = [1, 3, 5, 7, 9], scores y = [25, 40, 55, 65, 80]. Compute the OLS **slope** m.', answer: 6.75, tol: 0.001, round: '2 decimals', verify: '270/40',
        sol: '$\\bar x = 5$, $\\bar y = 53$. $S_{xy} = 112 + 26 + 0 + 24 + 108 = 270$; $S_{xx} = 16 + 4 + 0 + 4 + 16 = 40$; $m = $ **6.75**.' },
      { type: 'int', diff: 'M', q: 'Same data. Predict the score for **6** study hours.', answer: 59.75, tol: 0.001, round: '2 decimals', verify: '6.75*6+19.25',
        sol: '$c = 53 - 6.75 \\times 5 = 19.25$; $\\hat y = 6.75 \\times 6 + 19.25 = $ **59.75**.' },
      { type: 'int', diff: 'M', q: 'x = [2, 4, 6, 8], y = [3, 7, 5, 9]. Compute the OLS **intercept** c.', answer: 2, tol: 0.001, round: 'Exact', verify: '6-0.8*5',
        sol: '$m = 16/20 = 0.8$; $c = 6 - 0.8 \\times 5 = $ **2**.' },
      { type: 'int', diff: 'H', q: 'CGPA x = [8, 9, 7, 7.5, 6], stipend y = [50, 75, 45, 40, 30]. Predict the stipend (₹k) for **CGPA 8.5** with the OLS line.', answer: 62, tol: 0.01, round: 'Nearest integer', verify: '14*8.5-57',
        sol: '$\\bar x = 7.5$, $\\bar y = 48$, $S_{xy} = 70$, $S_{xx} = 5$ → $m = 14$, $c = -57$. $\\hat y = 14(8.5) - 57 = $ **62**.' },
      { type: 'mcq', diff: 'M', q: 'A 6th student (10 hours, score 20) is added to the study data. The OLS line will:', options: ['not change', 'shift toward the outlier (slope drops)', 'shift away from the outlier', 'become vertical'], answer: 1,
        sol: 'P12(d): squared loss is dominated by the large residual, so the line tilts toward (10, 20); slope 6.75 → 2.18.', why: ['Every point influences OLS.', 'Correct.', 'Opposite.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'P11 rapid fire: select all **true** statements.', options: ['The OLS line passes through every data point', 'The OLS line passes through (x̄, ȳ)', 'OLS gives an iterative solution', 'E(m, c) is convex for SLR'], answer: [1, 3],
        sol: 'P11: (a) F, (b) T, (f) F, (h) T.', why: ['False.', 'True.', 'False: closed-form.', 'True.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.linear_model import LinearRegression
x = np.array([1, 2, 3, 4, 5]).reshape(-1, 1); y = np.array([2, 4, 5, 4, 5])
lr = LinearRegression().fit(x, y)
print(round(lr.coef_[0], 2), round(lr.intercept_, 2))`, answer: '0.6 2.2',
        sol: '$\\bar x = 3$, $\\bar y = 4$, $S_{xy} = 6$, $S_{xx} = 10$ → m = 0.6, c = 4 − 1.8 = 2.2 (the course lab sample).' },
      { type: 'write', diff: 'M', q: 'Write `compute_ols(x, y)` returning `[m, c]` rounded to 2 decimals, or `[-1.0, -1.0]` when all x are equal (course lab).',
        starter: 'def compute_ols(x, y):\n    # your code here\n    pass\n',
        ref: 'def compute_ols(x, y):\n    n = len(x)\n    xb, yb = sum(x) / n, sum(y) / n\n    num = sum((a - xb) * (b - yb) for a, b in zip(x, y))\n    den = sum((a - xb) ** 2 for a in x)\n    if den == 0:\n        return [-1.0, -1.0]\n    m = num / den\n    return [round(m, 2), round(yb - m * xb, 2)]',
        tests: 'assert compute_ols([1, 2, 3, 4, 5], [2, 4, 5, 4, 5]) == [0.6, 2.2]\nassert compute_ols([3, 3, 3], [1, 2, 3]) == [-1.0, -1.0]\nassert compute_ols([1, 3, 5, 7, 9], [25, 40, 55, 65, 80]) == [6.75, 19.25]',
        file: 'aml-practice/L03_lab_compute_ols.py' }
    ],
    source: 'Worksheet L3 pp.18–20; course lab "Compute the Best-Fit Line"; ISLR §3.1.1.'
  }
  ]
});
})();
