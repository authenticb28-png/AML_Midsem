/* Lecture 5 — Batch Gradient Descent for Multiple Linear Regression */
(function () {
// 1-D GD path on L(t) = (t-3)^2 + 1
function path1d(t0, a, n) { const p = []; let t = t0; for (let i = 0; i < n; i++) { p.push([t, (t - 3) ** 2 + 1]); t -= a * 2 * (t - 3); } return p; }
// loss history on L(t) = t^2 from t0 = 5
function hist(a, n) { const p = []; let t = 5; for (let k = 0; k <= n; k++) { p.push([k, t * t]); t -= a * 2 * t; } return p; }
LECTURES.push({
  num: 5, short: 'Batch GD', title: 'Batch Gradient Descent for Multiple Linear Regression',
  file: 'AML_Lecture 5_Worksheet_Filled.pdf', pages: 11, extraFiles: 'Whiteboards/L06 (class of 27 Aug)',
  intro: R`**Exam weight: high.** Expect: why GD instead of OLS (cost $O(m^3)$, singular $X^TX$), the **update rule** $\theta \leftarrow \theta - \alpha\nabla L$ with **simultaneous** updates, the **MSE gradient** $\nabla L = \frac{2}{m}X^T(X\theta - y)$, **one epoch by hand**, learning-rate behaviour (too small / too large), and choosing α by **validation** loss. Note: in this worksheet **m = number of training examples** (in L4 it was the number of features). About 75 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L05.1 */
  {
    id: 'L05.1', title: 'Why OLS is not enough', badge: 'class', pages: '1', ws: 'Section 1',
    concept: R`
:::hook Hook
In Lecture 4 we set the gradient to zero and solved directly for θ. The result was exact. So why do we need another method?
:::

Closed form: $\theta^* = (X^TX)^{-1}X^Ty$. No trial and error, no epochs, no learning rate. But two limitations:

1. **Computational cost.** $X^TX$ is $(m+1)\times(m+1)$ for $m$ features; inverting it costs about $O(m^3)$. Five features: trivial. Millions of features: computationally impossible.
2. **Invertibility and numerical stability.** The formula works only when $X^TX$ is invertible (non-zero determinant), i.e. the columns of $X$ are linearly independent.

:::key Key insight
If two features are exact duplicates, or one is a linear combination of others, $X^TX$ is **singular** and the inverse does not exist. We need a method that never inverts $X^TX$: **Batch Gradient Descent**.
:::

**PRACTICE P1 — OLS or GD?**
- (a) 10,000 rows, **3 features** → **OLS**. The inverse is only 4×4; the number of *features* (not rows) sets the inverse size.
- (b) **50,000** image-derived features → **gradient descent**. Forming and inverting a 50,001 × 50,001 matrix is impractical.
- (c) \`Price_USD\` and \`Price_Cents = 100 × Price_USD\` both included → OLS throws a **singular matrix** error. Can BGD still run? **Yes** — it never inverts anything, although the coefficients are **not unique** (many β give the same predictions).`,
    formulas: [
      { name: 'Closed form (recap)', tex: R`\theta^* = (X^TX)^{-1}X^Ty`, sym: 'Requires invertible $X^TX$; cost $O(m^3)$ in the number of features.', when: 'Few features, independent columns.' },
      { name: 'Singularity test', tex: R`\det(X^TX) = 0 \iff \text{some column is a linear combination of others}`, sym: 'e.g. Price_Cents = 100 × Price_USD.', when: 'Why OLS throws "singular matrix".' }
    ],
    examples: [
      { title: 'Choose the solver (worked)', body: R`| Situation | Choice | Reason |
|---|---|---|
| 1 million rows, 8 features | OLS (or GD) | 9 × 9 inverse is trivial; rows only affect forming $X^TX$ |
| 200 rows, 80,000 gene features | GD (with regularisation, L12) | 80,001³ ≈ 5 × 10¹⁴ ops |
| Two identical columns | GD runs; OLS fails | singular $X^TX$ |
| Data arrive as a stream | SGD/mini-batch (L6) | can't hold the full batch |` }
    ],
    traps: [
      'The inverse size depends on the number of **features**, not rows. 10,000 rows × 3 features is cheap for OLS.',
      'GD **runs** on collinear data, but the solution is not unique; it does not "fix" multicollinearity.',
      'In L5 the worksheet uses **m for training examples** (rows). In L4 m was the number of features. Section 1 still uses m for features when quoting $O(m^3)$.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A dataset has 10,000 rows and only 3 features. Which method is sensible?', options: ['OLS: the 4×4 inverse is cheap', 'Gradient descent: 10,000 rows are too many', 'Neither works', 'Only SGD works'], answer: 0,
        sol: 'P1(a): the inverse size is set by features + 1 = 4.', why: ['Correct.', 'Rows do not set the inverse size.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Features `Price_USD` and `Price_Cents = 100·Price_USD` are both included. What happens with the OLS formula?', options: ['It works normally', 'Singular matrix: XᵀX is not invertible', 'It returns all zeros', 'It becomes iterative'], answer: 1,
        sol: 'P1(c): one column is a multiple of another.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Can Batch GD run on the Price_USD / Price_Cents data?', options: ['No, it also needs the inverse', 'Yes, it never inverts XᵀX, but the coefficients are not unique', 'Only after deleting all rows', 'Only with α = 0'], answer: 1,
        sol: 'P1(c): Yes.', why: ['GD only needs matrix–vector products.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Select **both** limitations of the closed-form solution named in Section 1.', options: ['O(m³) cost of inverting XᵀX', 'Requires XᵀX to be invertible', 'Cannot handle more than 3 rows', 'Needs a learning rate'], answer: [0, 1],
        sol: 'Computational cost and invertibility/numerical stability.', why: ['Correct.', 'Correct.', 'False.', 'OLS has no learning rate.'] },
      { type: 'int', diff: 'M', q: 'A regression has 50,000 features. What is the side length k of the matrix XᵀX (with the intercept)?', answer: 50001, tol: 0, round: 'Exact', verify: '50000+1',
        sol: 'k = m + 1 = **50,001** → about 1.25 × 10¹⁴ operations to invert.' }
    ],
    source: 'Worksheet L5 p.1.'
  },
  /* ---------------------------------------------------------------- L05.2 */
  {
    id: 'L05.2', title: 'Gradient, update rule, simultaneous update, initialisation', badge: ['class', 'board'], pages: '1–4', ws: 'Section 2 + whiteboard',
    concept: R`
**Gradient recap.** For $f(x)$: $f'(x) > 0$ → $f$ increases with $x$; $f'(x) < 0$ → it decreases. To **decrease** $f$, move **opposite** to the derivative.

For $f(\theta_0, \dots, \theta_m)$ the **gradient** is the vector of partial derivatives $\nabla f = [\partial f/\partial\theta_0, \dots, \partial f/\partial\theta_m]^T$.

:::take Key geometric fact
The gradient points in the direction of **steepest increase**; the **negative gradient** points in the direction of steepest decrease. For a convex bowl, repeatedly following $-\nabla L$ reaches the **same global minimum from any start**, provided the learning rate is appropriate.
:::

**Update rule (one parameter)**
$$\theta_{\text{new}} = \theta_{\text{old}} - \alpha\left.\frac{dL}{d\theta}\right|_{\theta_{\text{old}}}$$
$\alpha > 0$ is the **learning rate**, a user-chosen **hyperparameter** controlling step size. Repeat (old ← new, recompute gradient) until convergence (loss or parameters change negligibly).

**MLR** ($m$ features, $m+1$ parameters): coordinate form $\theta_{j,\text{new}} = \theta_{j,\text{old}} - \alpha\,\partial L/\partial\theta_j|_{\theta_{\text{old}}}$ for $j = 0..m$; vector form
$$\boldsymbol\theta_{\text{new}} = \boldsymbol\theta_{\text{old}} - \alpha\nabla L(\boldsymbol\theta_{\text{old}})$$
The minus sign: the gradient points uphill, we want to go downhill.

:::warn Simultaneous update
Compute **all** partial derivatives at the **old** θ, then update all parameters together. Do **not** update $\theta_0$ and then use the new $\theta_0$ to compute the derivative for $\theta_1$.
:::

**Initialisation.** Convex losses (linear and logistic regression): start at the **zero vector**. Non-convex neural-network losses: **random** initialisation (Deep Learning course).

**Whiteboard example ($\hat y = mx$, no intercept).** Data (1, 2), (2, 4). The class wrote the loss as a **sum**: $L = (2 - m)^2 + (4 - 2m)^2$, so $\frac{dL}{dm} = -2(2-m) - 4(4-2m) = 10m - 20$. From $m = 0$: $m_{\text{new}} = 0 - \alpha(-20) = 20\alpha = 2$ for $\alpha = 0.1$, and $L(2) = 0$ — the exact line $y = 2x$ in one step. With the **MSE** (divide by 2): $dL/dm = 5m - 10$, so $m_{\text{new}} = 10\alpha = 1$. Same direction, half the step. *(See UNCLEAR.md item 8.)*

The whiteboard also labels the regimes: **α too small → "vanishing" (very slow) GD**, **α too large → "exploding" GD**, typical good values **0.1 to 0.01**.

**HOMEWORK P2.** Stack $\boldsymbol\theta_{\text{old}} = [\theta_0, \dots, \theta_m]^T$ and $\nabla L = [\partial L/\partial\theta_0, \dots, \partial L/\partial\theta_m]^T$, then $\boldsymbol\theta_{\text{new}} = \boldsymbol\theta_{\text{old}} - \alpha\nabla L(\boldsymbol\theta_{\text{old}})$.`,
    formulas: [
      { name: 'Gradient-descent update', tex: R`\boldsymbol\theta_{\text{new}} = \boldsymbol\theta_{\text{old}} - \alpha\,\nabla L(\boldsymbol\theta_{\text{old}})`, sym: '$\\alpha$ learning rate (hyperparameter); gradient evaluated at the **old** θ.', when: 'Every GD variant (BGD, SGD, mini-batch, logistic regression).' },
      { name: 'Coordinate form', tex: R`\theta_j \leftarrow \theta_j - \alpha\,\frac{\partial L}{\partial\theta_j}\Big|_{\boldsymbol\theta_{\text{old}}},\ j = 0..m`, sym: 'All j updated simultaneously.', when: 'Hand calculations.' }
    ],
    plots: [
      { id: 'P05-slope', title: 'Sign of the slope tells which way is downhill', notice: 'Right of the minimum the slope is positive, so −α·slope moves θ left. Left of it the slope is negative, so θ moves right. Both head to the bottom.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [-1, 7], ylim: [0, 18], xlabel: 'θ', ylabel: 'L(θ)',
          series: [{ t: 'fn', f: t => (t - 3) ** 2 + 1, c: 's1', w: 2.5 }, { t: 'fn', f: t => 2 * 2.5 * (t - 5.5) + 7.25, d: [4.3, 6.7], c: 's4', w: 2 }, { t: 'fn', f: t => -2 * 2.5 * (t - 0.5) + 7.25, d: [-0.7, 1.7], c: 's3', w: 2 },
            { t: 'arrow', x1: 5.5, y1: 3, x2: 4.3, y2: 3, c: 's4' }, { t: 'arrow', x1: 0.5, y1: 3, x2: 1.7, y2: 3, c: 's3' }, { t: 'text', x: 5.6, y: 12.5, s: 'slope > 0 → move left' }, { t: 'text', x: 0.6, y: 12.5, s: 'slope < 0 → move right' }] } },
      { id: 'P05-bowl', title: 'Convex bowl L(θ₀, θ₁): following −∇L reaches the bottom', notice: 'Path of gradient descent on L = θ₀² + 3θ₁² from (−4, 3) with α = 0.1. The steeper θ₁ direction is corrected faster.',
        spec: (function () {
          const pts = []; let a = -4, b = 3; for (let i = 0; i < 14; i++) { pts.push([a, b, a * a + 3 * b * b]); a -= 0.1 * 2 * a; b -= 0.1 * 6 * b; }
          return { type: 'surface', w: 520, h: 360, xr: [-5, 5], yr: [-4, 4], xl: 'θ₀', yl: 'θ₁', zl: 'L', n: 20, f: (a, b) => a * a + 3 * b * b, paths: [{ pts, c: 's4' }] };
        })() },
      { id: 'P05-steps', title: 'Step-by-step updates in one variable', notice: 'Each step is α × slope, so the steps shrink automatically as the slope flattens near the minimum.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [-2, 6], ylim: [0, 26], xlabel: 'θ', ylabel: 'L(θ)', series: [{ t: 'fn', f: t => (t - 3) ** 2 + 1, c: 's1' }, { t: 'line', pts: path1d(-1.8, 0.2, 7), c: 's4', arrow: true }, { t: 'scatter', pts: path1d(-1.8, 0.2, 7), c: 's4', r: 3.5, labels: ['θ₀', 'θ₁', 'θ₂', 'θ₃', '', '', ''] }] } },
      { id: 'P05-lr', title: 'Effect of the learning rate (L = θ², start θ = 5)', notice: 'α = 0.02: slow but steady. α = 0.3: fast. α = 0.9: θ overshoots and flips sign every step (θ ← −0.8θ), so the loss falls more slowly than with 0.3. α = 1.05: each overshoot is bigger than the last (θ ← −1.1θ) — the loss explodes.',
        spec: { type: 'xy', w: 540, h: 300, xlim: [0, 20], ylim: [0, 40], xlabel: 'iteration', ylabel: 'loss', legend: 'tr',
          series: [{ t: 'line', pts: hist(0.02, 20), c: 's7', markers: true, label: 'α = 0.02 (too small)' }, { t: 'line', pts: hist(0.3, 20), c: 's3', markers: true, label: 'α = 0.3 (appropriate)' }, { t: 'line', pts: hist(0.9, 20), c: 's2', markers: true, label: 'α = 0.9 (oscillates)' }, { t: 'line', pts: hist(1.05, 20), c: 's4', markers: true, label: 'α = 1.05 (diverges)' }] } }
    ],
    examples: [
      { title: 'Simultaneous vs sequential update (worked)', body: R`$L(\theta_0,\theta_1) = \theta_0^2 + \theta_0\theta_1 + \theta_1^2$, start (1, 1), $\alpha = 0.1$. $\partial L/\partial\theta_0 = 2\theta_0 + \theta_1$, $\partial L/\partial\theta_1 = \theta_0 + 2\theta_1$.
- **Correct (simultaneous):** both gradients at (1, 1) = 3, 3 → new (0.7, 0.7).
- **Wrong (sequential):** $\theta_0 = 1 - 0.3 = 0.7$, then $\partial L/\partial\theta_1$ at (0.7, 1) = 2.7 → $\theta_1 = 0.73$. A different (and not the GD) point.` },
      { title: 'One step in one variable (worked)', body: R`$L(\theta) = (\theta - 3)^2$, $\theta = 0$, $\alpha = 0.1$. $dL/d\theta = 2(\theta - 3) = -6$. $\theta_{\text{new}} = 0 - 0.1(-6) = 0.6$. Next: slope $2(0.6 - 3) = -4.8$, $\theta = 0.6 + 0.48 = 1.08$. Each step covers 20% of the remaining distance to 3.` }
    ],
    traps: [
      'The update **subtracts** α × gradient. Adding it climbs uphill.',
      'Use the **old** θ for every partial derivative (simultaneous update).',
      'α is a **hyperparameter** — GD never changes it.',
      'Zero initialisation is fine for convex linear/logistic regression; neural networks need random initialisation.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: R`$L(\theta) = (\theta - 3)^2$, $\theta_{\text{old}} = 0$, $\alpha = 0.1$. Compute $\theta_{\text{new}}$.`, answer: 0.6, tol: 0.001, round: '1 decimal', verify: '0-0.1*2*(0-3)',
        sol: '$dL/d\\theta = 2(0 - 3) = -6$; $\\theta = 0 - 0.1(-6) = $ **0.6**.' },
      { type: 'int', diff: 'M', q: R`Whiteboard: $\hat y = mx$, data (1, 2), (2, 4), loss written as the **sum** $L = (2-m)^2 + (4-2m)^2$. Start $m = 0$, $\alpha = 0.1$. Compute $m$ after one step.`, answer: 2, tol: 0.001, round: 'Exact', verify: '0-0.1*(10*0-20)',
        sol: '$dL/dm = 10m - 20 = -20$ at 0; $m = 0 - 0.1(-20) = $ **2**, which fits both points exactly ($L = 0$).' },
      { type: 'int', diff: 'M', q: 'Same data, but the loss is the **MSE** $L = \\frac12[(2-m)^2 + (4-2m)^2]$. One step from m = 0 with α = 0.1 gives m = ?', answer: 1, tol: 0.001, round: 'Exact', verify: '0-0.1*(5*0-10)',
        sol: '$dL/dm = 5m - 10 = -10$; $m = 0 + 1 = $ **1** (half the step of the sum version).' },
      { type: 'mcq', diff: 'E', q: 'The negative gradient points in the direction of:', options: ['steepest increase', 'steepest decrease', 'zero change', 'the largest parameter'], answer: 1,
        sol: 'The gradient points to steepest increase; its negative to steepest decrease.', why: ['That is +∇L.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Which describes the **simultaneous update** correctly?', options: ['Update θ₀, then use the new θ₀ to compute ∂L/∂θ₁', 'Compute all partial derivatives at the old θ, then update all parameters', 'Update only the largest parameter each step', 'Update parameters in random order'], answer: 1,
        sol: 'Worksheet warning box.', why: ['This is exactly what the warning forbids.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'For the convex linear-regression loss, the worksheet initialises θ as:', options: ['random values', 'the zero vector', 'the OLS solution', 'all ones'], answer: 1,
        sol: 'Convex losses: zero vector. Neural networks: random.', why: ['That is for neural networks.', 'Correct.', 'That would make GD pointless.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`theta = 0.0
for _ in range(3):
    grad = 2 * (theta - 3)
    theta = theta - 0.1 * grad
print(round(theta, 3))`, answer: '1.464',
        sol: '0 → 0.6 → 1.08 → 1.464. Each step multiplies the distance to 3 by 0.8: 3(1 − 0.8³) = 3(0.488) = 1.464.' }
    ],
    source: 'Worksheet L5 pp.1–4; Whiteboard L06 (27 Aug) pp.2–4; Goodfellow et al. §4.3.'
  },
  /* ---------------------------------------------------------------- L05.3 */
  {
    id: 'L05.3', title: 'Deriving the Batch GD update for MSE', badge: 'class', pages: '5', ws: 'Section 3, PRACTICE P4 (gradient)',
    concept: R`
Use the actual MSE (here **m = number of training examples**):
$$L(\boldsymbol\theta) = \frac1m(X\boldsymbol\theta - \mathbf y)^T(X\boldsymbol\theta - \mathbf y) = \frac1m\|X\boldsymbol\theta - \mathbf y\|_2^2$$

Applying the Lecture 4 identities (derivation below) gives
$$\nabla L = \frac2m X^T(X\boldsymbol\theta - \mathbf y)\qquad\Rightarrow\qquad \boldsymbol\theta := \boldsymbol\theta - \alpha\,\frac2m X^T(X\boldsymbol\theta - \mathbf y)$$

:::key Key insight — why "Batch"?
The gradient uses the **full** matrix $X$ and the **full** target vector $\mathbf y$. Every training example contributes to every single update.
:::

:::note Instructor note
Some books define $L = \frac{1}{2m}\|X\boldsymbol\theta - \mathbf y\|^2$; then the factor 2 cancels and $\nabla L = \frac1m X^T(X\boldsymbol\theta - \mathbf y)$. This lecture uses the actual MSE, so **the 2 stays**. Both give the same minimum; only the effective step size differs.
:::

**Per-sample view.** Row $i$ contributes $\frac2m(\hat y_i - y_i)\mathbf x_i$, so for one weight: $\frac{\partial L}{\partial\theta_j} = \frac2m\sum_{i=1}^m(\hat y_i - y_i)x_{ij}$ (with $x_{i0} = 1$ for the intercept).`,
    deriv: [
      { id: 'D05-msegrad', title: 'Gradient of the MSE loss (PRACTICE P4)', badge: 'class',
        steps: [
          { m: R`L(\boldsymbol\theta) = \frac1m(\boldsymbol\theta^TX^T - \mathbf y^T)(X\boldsymbol\theta - \mathbf y)`, why: '$(X\\boldsymbol\\theta - \\mathbf y)^T = \\boldsymbol\\theta^TX^T - \\mathbf y^T$.' },
          { m: R`L(\boldsymbol\theta) = \frac1m\left[\mathbf y^T\mathbf y - 2\mathbf y^TX\boldsymbol\theta + \boldsymbol\theta^TX^TX\boldsymbol\theta\right]`, why: 'Step 1: expand; the two middle scalars are equal (L4).' },
          { m: R`\nabla L = \frac1m\left[\mathbf 0 - 2X^T\mathbf y + 2X^TX\boldsymbol\theta\right]`, why: 'Step 2: identities $\\partial(\\mathbf y^T\\mathbf y) = 0$, $\\partial(-2\\mathbf y^TX\\boldsymbol\\theta) = -2X^T\\mathbf y$, $\\partial(\\boldsymbol\\theta^TX^TX\\boldsymbol\\theta) = 2X^TX\\boldsymbol\\theta$.' },
          { m: R`\nabla L = \frac2m X^T(X\boldsymbol\theta - \mathbf y)`, why: 'Step 3: factor out 2 and $X^T$.' },
          { m: R`\boldsymbol\theta := \boldsymbol\theta - \alpha\,\frac2m X^T(X\boldsymbol\theta - \mathbf y)`, why: 'Step 4: plug the gradient into the update rule.' }
        ],
        result: R`\nabla L(\boldsymbol\theta) = \frac{2}{m}X^T(X\boldsymbol\theta - \mathbf y)`,
        after: 'Setting this to zero gives back the normal equation $X^TX\\boldsymbol\\theta = X^T\\mathbf y$, so GD and OLS share the same optimum.' }
    ],
    formulas: [
      { name: 'MSE loss (matrix form)', tex: R`L(\boldsymbol\theta) = \frac1m\|X\boldsymbol\theta - \mathbf y\|_2^2`, sym: 'm = number of training examples.', when: 'Batch GD for linear regression.' },
      { name: 'MSE gradient', tex: R`\nabla L = \frac2m X^T(X\boldsymbol\theta - \mathbf y)`, sym: 'Note the order: prediction minus target.', when: 'Every BGD step.' },
      { name: 'Per-weight gradient', tex: R`\frac{\partial L}{\partial\theta_j} = \frac2m\sum_{i=1}^{m}(\hat y_i - y_i)\,x_{ij}`, sym: '$x_{i0} = 1$.', when: 'Loop-based code; SGD in L6.' },
      { name: 'Half-MSE convention', tex: R`L = \frac{1}{2m}\|X\boldsymbol\theta - \mathbf y\|^2 \Rightarrow \nabla L = \frac1m X^T(X\boldsymbol\theta - \mathbf y)`, sym: 'Factor 2 disappears.', when: 'Textbooks / other courses.' }
    ],
    examples: [
      { title: 'Gradient with a tiny dataset (worked)', body: R`$X = \begin{bmatrix}1&1\\1&2\end{bmatrix}$, $\mathbf y = [3, 5]^T$, $\boldsymbol\theta = [0, 0]^T$, m = 2.
- $X\boldsymbol\theta - \mathbf y = [-3, -5]^T$.
- $X^T(\cdot) = [-3 - 5,\ -3 - 10]^T = [-8, -13]^T$.
- $\nabla L = \frac22[-8, -13]^T = [-8, -13]^T$.
- With $\alpha = 0.1$: $\boldsymbol\theta = [0.8, 1.3]^T$.` }
    ],
    code: [{ title: 'Vectorised BGD (worksheet example)', scratch: 'L05_bgd_scratch.py', lib: 'L05_bgd_sklearn.py' }],
    traps: [
      'The residual in the gradient is $X\\boldsymbol\\theta - \\mathbf y$ (prediction − target). Using $\\mathbf y - X\\boldsymbol\\theta$ flips the sign — then you must **add** α × gradient.',
      'Keep the **2/m** for the true MSE; it becomes 1/m for the ½-MSE convention.',
      '"Batch" = all m examples per update, not "a batch of size 32" (that is mini-batch, L6).'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: R`For $L = \frac1m\|X\boldsymbol\theta - \mathbf y\|^2$, the gradient is:`, options: [R`$\frac1m X^T(X\boldsymbol\theta - \mathbf y)$`, R`$\frac2m X^T(X\boldsymbol\theta - \mathbf y)$`, R`$\frac2m X(X\boldsymbol\theta - \mathbf y)$`, R`$2X^TX$`], answer: 1,
        sol: 'Derived in Section 3 (the 2 stays with the actual MSE).', why: ['That is for ½-MSE.', 'Correct.', 'Needs $X^T$ for the shapes to work.', 'Hessian.'] },
      { type: 'mcq', diff: 'E', q: 'Why is it called **Batch** gradient descent?', options: ['It updates one sample at a time', 'Each gradient uses the full X and y (all training examples)', 'It uses batches of 32', 'It runs in batch jobs at night'], answer: 1,
        sol: 'Key insight Section 3.', why: ['That is SGD.', 'Correct.', 'That is mini-batch.', 'Unrelated.'] },
      { type: 'int', diff: 'M', q: R`$X = \begin{bmatrix}1&1\\1&2\end{bmatrix}$, $\mathbf y = [3,5]^T$, $\boldsymbol\theta = \mathbf 0$, MSE with m = 2. Compute the **second** component of $\nabla L$.`, answer: -13, tol: 0, round: 'Exact', verify: '2/2*(1*(-3)+2*(-5))',
        sol: 'Residuals $[-3, -5]$; $X^T$ row 2 = [1, 2] → $-3 - 10 = -13$; times 2/m = 1 → **−13**.' },
      { type: 'mcq', diff: 'M', q: 'If a book defines L = (1/2m)‖Xθ − y‖², then compared with this lecture the gradient is:', options: ['the same', 'half as large', 'twice as large', 'of opposite sign'], answer: 1,
        sol: 'Instructor note: the factor 2 disappears → ∇ = (1/m)Xᵀ(Xθ − y), half of (2/m)Xᵀ(Xθ − y).', why: ['No.', 'Correct.', 'Reversed.', 'No.'] },
      { type: 'mcq', diff: 'M', q: R`Setting $\frac2m X^T(X\boldsymbol\theta - \mathbf y) = \mathbf 0$ gives:`, options: ['the GD update rule', 'the normal equation XᵀXθ = Xᵀy', 'θ = 0', 'the learning rate'], answer: 1,
        sol: 'So GD (at convergence) and OLS solve the same equation.', why: ['No.', 'Correct.', 'Only if Xᵀy = 0.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[1, 1], [1, 2]], float); y = np.array([3, 5], float)
th = np.zeros(2)
th = th - 0.1 * (2 / len(y)) * X.T @ (X @ th - y)
print(th)`, answer: '[0.8 1.3]',
        sol: 'Gradient = [−8, −13]; θ = 0 − 0.1 × [−8, −13] = [0.8, 1.3].' }
    ],
    source: 'Worksheet L5 p.5; Géron §4.2 "Batch Gradient Descent".'
  },
  /* ---------------------------------------------------------------- L05.4 */
  {
    id: 'L05.4', title: 'Worked NST example: epochs 1 and 2, and why feature scaling matters', badge: 'class', pages: '5–7', ws: 'Section 4, PRACTICE P4 (epoch 2)',
    concept: R`
Predict exam score from hours studied ($x_1$) and attendance % ($x_2$). **m = 3 examples**, $\boldsymbol\theta = \mathbf 0$, $\alpha = 0.0001$.

| Student | $x_1$ hours | $x_2$ attendance | $y$ |
|---|---|---|---|
| 1 | 2 | 60 | 35 |
| 2 | 4 | 80 | 55 |
| 3 | 6 | 90 | 70 |

**Epoch 1**
1. $X = \begin{bmatrix}1&2&60\\1&4&80\\1&6&90\end{bmatrix}$, $\mathbf y = [35, 55, 70]^T$.
2. $\hat{\mathbf y} = X\boldsymbol\theta = [0, 0, 0]^T$.
3. Residual $X\boldsymbol\theta - \mathbf y = [-35, -55, -70]^T$.
4. $X^T(X\boldsymbol\theta - \mathbf y) = [-35-55-70,\ -70-220-420,\ -2100-4400-6300]^T = [-160, -710, -12800]^T$.
5. $\nabla L = \frac23[-160, -710, -12800]^T = [-106.67, -473.33, -8533.33]^T$.
6. $\boldsymbol\theta_{\text{new}} = \mathbf 0 - 0.0001\nabla L = [0.011, 0.047, 0.853]^T$ (exact: 0.010667, 0.047333, 0.853333).

**Epoch 2 (PRACTICE P4, using the rounded θ)**
- $\hat y_1 = 0.011 + 2(0.047) + 60(0.853) = 51.285$; $\hat y_2 = 0.011 + 0.188 + 68.24 = 68.439$; $\hat y_3 = 0.011 + 0.282 + 76.77 = 77.063$.
- Residuals $\hat{\mathbf y} - \mathbf y = [16.285, 13.439, 7.063]^T$ — now every prediction is **too high**: epoch 1 overshot.
- Completing the step: $X^T\mathbf r = [36.787, 128.704, 2687.89]^T$, $\nabla L = [24.525, 85.803, 1791.927]^T$, $\boldsymbol\theta = [0.00855, 0.03842, 0.67381]^T$. *(Exact arithmetic from unrounded θ: [0.00821, 0.03873, 0.67372].)*

**Why did $\theta_2$ (attendance) move ~18× more than $\theta_1$ (hours) in epoch 1?** Attendance values (60–90) are much larger than hours (2–6), so they contribute much larger terms $x_{ij}(\hat y_i - y_i)$ to the gradient. **Fix: standardise or normalise the features** before training (Lecture 1).

:::key Key insight
Feature scaling is essential before gradient descent. Comparable scales stop a large-magnitude feature from dominating the gradient and usually make convergence faster and more stable (a round bowl instead of a long narrow valley).
:::`,
    formulas: [
      { name: 'One BGD epoch', tex: R`\mathbf r = X\boldsymbol\theta - \mathbf y,\quad \mathbf g = \frac2m X^T\mathbf r,\quad \boldsymbol\theta \leftarrow \boldsymbol\theta - \alpha\mathbf g`, sym: 'r residual vector, g gradient.', when: 'Hand epochs.' },
      { name: 'Gradient component j', tex: R`g_j = \frac2m\sum_i x_{ij}\,r_i`, sym: 'Large $x_{ij}$ ⇒ large $g_j$.', when: 'Explaining why unscaled features dominate.' }
    ],
    plots: [
      { id: 'P05-scaling', title: 'Unscaled vs standardised features: contour shape and GD path', notice: 'Left: one feature has a much larger scale → a long, narrow valley; GD zig-zags across it. Right: after standardising, contours are round and GD heads straight to the minimum.',
        spec: (function () {
          const path = (A, B, a, s) => { const p = []; let u = s[0], v = s[1]; for (let i = 0; i < 25; i++) { p.push([u, v]); const gu = 2 * A * u, gv = 2 * B * v; u -= a * gu; v -= a * gv; } return p; };
          const ell = (A, B, c) => ({ t: 'ellipse', cx: 0, cy: 0, rx: Math.sqrt(c / A), ry: Math.sqrt(c / B), c: 's7', w: 1 });
          return { type: 'multi', panels: [
            { type: 'xy', w: 300, h: 260, title: 'Unscaled (elongated bowl)', xlim: [-5, 5], ylim: [-5, 5], xlabel: 'θ₁', ylabel: 'θ₂', series: [ell(0.3, 6, 2), ell(0.3, 6, 6), ell(0.3, 6, 12), { t: 'line', pts: path(0.3, 6, 0.155, [-4.5, 1.6]), c: 's4', markers: true, mr: 2 }] },
            { type: 'xy', w: 300, h: 260, title: 'Standardised (round bowl)', xlim: [-5, 5], ylim: [-5, 5], xlabel: 'θ₁', ylabel: 'θ₂', series: [ell(1, 1, 2), ell(1, 1, 6), ell(1, 1, 12), { t: 'line', pts: path(1, 1, 0.2, [-4.5, 1.6]), c: 's3', markers: true, mr: 2 }] }] };
        })() }
    ],
    examples: [
      { title: 'Epoch 1 gradient — component 3 in detail (worked)', body: R`$[X^T\mathbf r]_3 = 60(-35) + 80(-55) + 90(-70) = -2100 - 4400 - 6300 = -12800$. Then $\frac23(-12800) = -8533.33$ and $\theta_2 = 0 - 0.0001(-8533.33) = 0.853$. Compare $\theta_1$: $\frac23(2\cdot(-35) + 4\cdot(-55) + 6\cdot(-70)) = \frac23(-710) = -473.33 \Rightarrow 0.047$.` }
    ],
    code: [{ title: 'Epochs 1–2 exactly as the worksheet, then standardised training', scratch: 'L05_bgd_scratch.py', lib: 'L05_bgd_sklearn.py' }],
    traps: [
      'Here **m = 3 examples** (rows), not features.',
      'The worksheet\'s epoch 2 uses the **rounded** θ = (0.011, 0.047, 0.853); exact arithmetic gives slightly different numbers.',
      'After epoch 1 all residuals flipped sign (predictions too high): an overshoot caused by the huge attendance scale.',
      'Feature scaling changes the **learning dynamics**, not the final OLS optimum (in the original units, after converting back).'
    ],
    questions: [
      { type: 'int', diff: 'M', q: 'NST example, epoch 1 (θ = 0): compute the first component of $X^T(X\\theta - y)$ for y = [35, 55, 70].', answer: -160, tol: 0, round: 'Exact', verify: '-(35+55+70)',
        sol: 'The 1s row: −35 − 55 − 70 = **−160**.' },
      { type: 'int', diff: 'M', q: 'NST epoch 1: the gradient for θ₂ (attendance) is (2/3)(−12800). With α = 0.0001, what is θ₂ after epoch 1? (3 decimals)', answer: 0.853, tol: 0.001, round: '3 decimals', verify: '-0.0001*(2/3)*(-12800)',
        sol: '$0 - 0.0001 \\times (-8533.33) = $ **0.853**.' },
      { type: 'int', diff: 'M', q: 'Epoch 2 with θ = [0.011, 0.047, 0.853]: compute the prediction for student 2 (hours 4, attendance 80). (3 decimals)', answer: 68.439, tol: 0.001, round: '3 decimals', verify: '0.011+4*0.047+80*0.853',
        sol: '0.011 + 0.188 + 68.24 = **68.439**.' },
      { type: 'mcq', diff: 'E', q: 'Why did θ₂ (attendance) change far more than θ₁ (hours) in epoch 1?', options: ['Attendance is more important', 'Attendance values (60–90) are much larger, so its gradient terms are larger', 'θ₂ was initialised larger', 'The learning rate differs per feature'], answer: 1,
        sol: 'P4 Q3: the scale of the feature drives the size of its gradient. Fix: standardise/normalise.', why: ['Importance is not what GD measures here.', 'Correct.', 'All started at 0.', 'One α for all.'] },
      { type: 'mcq', diff: 'M', q: 'Which preprocessing step fixes the imbalance in the NST example?', options: ['One-hot encoding', 'Standardising / normalising the features', 'Removing the intercept', 'Increasing α'], answer: 1,
        sol: 'Feature scaling puts features on comparable scales.', why: ['For categories.', 'Correct.', 'No.', 'Would make the overshoot worse.'] },
      { type: 'out', diff: 'H', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[1, 2, 60], [1, 4, 80], [1, 6, 90]], float); y = np.array([35, 55, 70], float)
th = np.zeros(3)
th = th - 0.0001 * (2 / 3) * X.T @ (X @ th - y)
print(np.round(th, 3), np.round(X @ th - y, 1))`, answer: '[0.011 0.047 0.853] [16.3 13.5  7.1]',
        sol: 'Epoch 1 gives θ ≈ [0.0107, 0.0473, 0.8533]; rounded [0.011 0.047 0.853]. With the **exact** θ the residuals are [16.305, 13.467, 7.095] → rounded [16.3 13.5 7.1] (NumPy pads 7.1 to align columns).' }
    ],
    source: 'Worksheet L5 pp.5–7.'
  },
  /* ---------------------------------------------------------------- L05.5 */
  {
    id: 'L05.5', title: 'Epochs and the full training loop', badge: 'class', pages: '7–8', ws: 'Section 5',
    concept: R`
Everything above was **one update**. Training repeats it many times.

**Training loop**
1. **Initialise** parameters: $\boldsymbol\theta = \mathbf 0$ (convex loss).
2. **Choose the number of epochs.** In BGD, **one epoch = one complete pass through the full training set = one full-dataset gradient update**.
3. Predict $\hat{\mathbf y} = X\boldsymbol\theta$.
4. Residuals $X\boldsymbol\theta - \mathbf y$.
5. Gradient $\nabla L = \frac2m X^T(X\boldsymbol\theta - \mathbf y)$.
6. Update $\boldsymbol\theta := \boldsymbol\theta - \alpha\nabla L$.
7. Repeat for the chosen epochs (or until converged).

**PRACTICE P5.** 3 students, 100 epochs of BGD → the full dataset is used to compute a gradient **100 times** (once per epoch).

:::take Takeaway
Gradient descent is a **general** optimisation algorithm, not specific to linear regression. It can optimise any differentiable loss by repeatedly stepping along the negative gradient (logistic regression in L15, neural networks later).
:::

**Course lab (BGD for $y = wx$, bias fixed at 0).** Per-sample gradient $2(wx_i - y_i)x_i$, **averaged** over all N, one update per epoch; return \`round(w, 2)\`. For $x = [1,2,3]$, $y = [2,4,6]$, $\alpha = 0.001$, 100 epochs → **1.22** (still far from the true 2: α is small).`,
    formulas: [
      { name: 'Updates per epoch (BGD)', tex: R`\text{updates} = \text{epochs}\times 1`, sym: 'One full-batch update per epoch.', when: 'Contrast with SGD (m per epoch) and mini-batch (⌈m/b⌉) in L6.' },
      { name: 'Lab gradient (y = wx)', tex: R`\frac{dL}{dw} = \frac1N\sum_{i=1}^N 2(wx_i - y_i)x_i`, sym: 'Average of per-sample gradients.', when: 'Course lab "train_bgd".' }
    ],
    plots: [
      { id: 'P05-loop', title: 'Training-loop flow diagram', notice: 'Each "No" starts the next epoch with the θ produced by the previous update.',
        spec: { type: 'flow', w: 680, h: 300, nodes: [
          { id: 'a', x: 100, y: 45, w: 160, h: 44, t: '1. Initialise θ = 0', c: 's1' }, { id: 'b', x: 330, y: 45, w: 200, h: 44, t: '2. Choose α and epochs', c: 's1' }, { id: 'c', x: 570, y: 45, w: 170, h: 44, t: '3. Predict ŷ = Xθ', c: 's2' },
          { id: 'd', x: 570, y: 140, w: 170, h: 44, t: '4. Residuals Xθ − y', c: 's2' }, { id: 'e', x: 330, y: 140, w: 200, h: 44, t: '5. ∇L = (2/m)Xᵀ(Xθ − y)', c: 's5' }, { id: 'f', x: 100, y: 140, w: 170, h: 44, t: '6. θ ← θ − α∇L', c: 's5' },
          { id: 'g', x: 330, y: 240, w: 230, h: 56, t: 'Converged or\nepoch budget reached?', shape: 'diamond', c: 's4' }, { id: 'h', x: 600, y: 240, w: 140, h: 40, t: 'Stop: return θ', c: 's3' }],
          edges: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'c', b: 'd' }, { a: 'd', b: 'e' }, { a: 'e', b: 'f' }, { a: 'f', b: 'g', via: [[100, 240]] }, { a: 'g', b: 'h', t: 'yes' }, { a: 'g', b: 'c', via: [[330, 198], [470, 198], [470, 95]], t: 'no: next epoch', dash: true, dx: 48, dy: 0 }] } }
    ],
    examples: [
      { title: 'Course lab by hand: two epochs (worked)', body: R`$x = [1,2,3]$, $y = [2,4,6]$, $w = 0$, $\alpha = 0.1$.
- Epoch 1: per-sample gradients $2(0 - 2)(1) = -4$, $2(0 - 4)(2) = -16$, $2(0 - 6)(3) = -36$; mean $= -56/3 = -18.667$; $w = 0 + 1.8667 = 1.8667$.
- Epoch 2: $wx - y = (w - 2)x = -0.1333x$; gradients $2(-0.1333)x^2$: mean $= 2(-0.1333)(14/3) = -1.2444$; $w = 1.8667 + 0.1244 = 1.9911$.

With $\alpha = 0.001$ (lab setting) progress is ~100× slower, which is why 100 epochs only reach 1.22.` }
    ],
    code: [{ title: 'Course lab: train_bgd for y = w·x', scratch: 'L05_lab_bgd_w.py', more: [['Full vectorised BGD', 'L05_bgd_scratch.py']] }],
    traps: [
      'In BGD, **1 epoch = 1 update**. In SGD, 1 epoch = m updates (L6).',
      'The lab **averages** the per-sample gradients (MSE); summing them would multiply the step by N.',
      'More epochs only help until convergence; after that the loss is flat.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: '3 students, 100 epochs of Batch GD. How many full-dataset gradient computations?', answer: 100, tol: 0, round: 'Exact', verify: '100',
        sol: 'One per epoch → **100** (P5).' },
      { type: 'int', diff: 'M', q: R`Lab model $y = wx$: $x = [1,2,3]$, $y = [2,4,6]$, $w = 0$, $\alpha = 0.1$. Compute $w$ after **one** epoch (4 decimals).`, answer: 1.8667, tol: 0.0005, round: '4 decimals', verify: '0-0.1*((2*(0-2)*1+2*(0-4)*2+2*(0-6)*3)/3)',
        sol: 'Mean gradient = (−4 − 16 − 36)/3 = −18.667; $w = 0.1 \\times 18.667 = $ **1.8667**.' },
      { type: 'mcq', diff: 'E', q: 'In Batch GD, one epoch means:', options: ['one update per training example', 'one full pass over the training set and one gradient update', 'one update per mini-batch', 'one hour of training'], answer: 1,
        sol: 'Section 5, step 2.', why: ['That is SGD.', 'Correct.', 'Mini-batch.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Gradient descent is best described as:', options: ['an algorithm only for linear regression', 'a general optimiser for differentiable losses', 'a closed-form solution', 'a feature-selection method'], answer: 1,
        sol: 'Takeaway Section 5.', why: ['Too narrow.', 'Correct.', 'It is iterative.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output (course lab).', code: R`import numpy as np
def train_bgd(x, y, lr, epochs):
    x = np.array(x, float); y = np.array(y, float); w = 0.0
    for _ in range(epochs):
        w -= lr * np.mean(2 * (w * x - y) * x)
    return round(float(w), 2)
print(train_bgd([1, 2, 3], [2, 4, 6], 0.001, 100))`, answer: '1.22',
        sol: 'Each epoch multiplies the gap (2 − w) by (1 − 0.001·2·14/3) = 0.990667. After 100 epochs: 2(1 − 0.990667¹⁰⁰) ≈ 2(1 − 0.3915) ≈ 1.217 → **1.22**.' },
      { type: 'write', diff: 'M', q: 'Write `train_bgd(x, y, learning_rate, epochs)` for the model y = w·x (no bias): start w = 0, per epoch use the **mean** of 2(w·xᵢ − yᵢ)·xᵢ, one update per epoch, return round(w, 2).',
        starter: 'import numpy as np\n\ndef train_bgd(x, y, learning_rate, epochs):\n    pass\n',
        ref: 'import numpy as np\n\ndef train_bgd(x, y, learning_rate, epochs):\n    x = np.array(x, dtype=float); y = np.array(y, dtype=float)\n    w = 0.0\n    for _ in range(epochs):\n        w -= learning_rate * np.mean(2 * (w * x - y) * x)\n    return round(float(w), 2)',
        tests: 'assert train_bgd(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 500) == 0.5\nassert train_bgd([1, 2, 3], [2, 4, 6], 0.001, 100) == 1.22',
        file: 'aml-practice/L05_lab_bgd_w.py' }
    ],
    source: 'Worksheet L5 pp.7–8; course lab "Batch Gradient Descent for Linear Regression".'
  },
  /* ---------------------------------------------------------------- L05.6 */
  {
    id: 'L05.6', title: 'Learning rate, tuning with validation loss, BGD pros and cons', badge: 'class', pages: '8–10', ws: 'Section 6, PRACTICE P6',
    concept: R`
The learning rate α is a **hyperparameter**: chosen before training, never learned.

- **Too small:** the loss decreases, but very slowly (tiny steps in the right direction).
- **Too large:** the loss may **oscillate or diverge**; the direction is locally downhill, but the step overshoots the minimum.
- **Well chosen:** the loss drops quickly at first, then flattens near the minimum.

**Hyperparameter tuning.** Pick candidates on a log scale (0.1, 0.01, 0.001), train separately with each, track the loss on a held-out **validation** set (keep the test set for the final evaluation only).

**Validation loss** = average squared error on examples **not** used to update θ:
$$L_{\text{val}} = \frac{1}{m_{\text{val}}}\sum_{i=1}^{m_{\text{val}}}(y_i - \hat y_i)^2$$

**Step-by-step tuning:** (1) split development data into train/validation, test untouched; (2) candidate α's on a log scale; (3) every run starts from the same zero vector with the same epoch budget; (4) record training and validation loss every epoch; (5) reject runs that diverge or oscillate badly; (6) compare the best validation loss of each remaining run; (7) choose the α with the lowest validation loss, then evaluate **once** on the test set.

**Guided dry run.** Residuals 2, −1, 3 → $L_{\text{val}} = (4 + 1 + 9)/3 = 14/3 \approx 4.67$. Runs: α = 0.1 → 18.4, 0.01 → **6.2**, 0.001 → 9.7. **Select α = 0.01** (lowest validation loss).

**Advantages of BGD:** stable update direction (full data); for convex MSE it converges to the global minimum with a suitable α; never computes $(X^TX)^{-1}$; still runs when $X^TX$ is singular.
**Disadvantages:** a full pass over the data per update; slow on very large datasets; the whole dataset must usually be available; poor α → very slow or unstable.

**PRACTICE P6.** (a) "If the gradient points downhill, the loss always decreases regardless of α" → **F** (a too-large α overshoots). (b) "Use the test set to choose α" → **F** (validation). (c) "BGD explicitly computes $(X^TX)^{-1}$" → **F**. (d) "BGD suits a 50-million-row dataset" → **F** (each update scans all rows; prefer mini-batch).`,
    formulas: [
      { name: 'Validation loss', tex: R`L_{\text{val}} = \frac{1}{m_{\text{val}}}\sum_{i=1}^{m_{\text{val}}}(y_i - \hat y_i)^2`, sym: 'Computed on rows never used for updates.', when: 'Choosing α and other hyperparameters.' },
      { name: 'Divergence condition (1-D quadratic)', tex: R`L = a\theta^2:\ \ \theta \leftarrow (1 - 2a\alpha)\theta,\ \ \text{diverges if } \alpha > 1/a`, sym: 'Researched illustration: steps flip sign when α > 1/(2a), grow when α > 1/a.', when: 'Explaining oscillation vs divergence.' }
    ],
    plots: [
      { id: 'P05-valbars', title: 'Guided dry run: validation loss for three learning rates', notice: 'The lowest bar (α = 0.01, L_val = 6.2) is selected. Too large (0.1) and too small (0.001) are both worse.',
        spec: { type: 'bars', w: 440, h: 280, cats: ['α = 0.1', 'α = 0.01', 'α = 0.001'], vals: [18.4, 6.2, 9.7], hl: 1, ylabel: 'validation loss', ylim: [0, 21] } },
      { id: 'P05-lr2', title: 'One graph, three learning-rate behaviours', notice: 'Too small: slow decline. Appropriate: fast then flat. Too large: θ jumps back and forth across the minimum with growing size, so the loss rises.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [0, 20], ylim: [0, 40], xlabel: 'epoch', ylabel: 'loss', legend: 'tr',
          series: [{ t: 'line', pts: hist(0.02, 20), c: 's7', label: 'too small' }, { t: 'line', pts: hist(0.3, 20), c: 's3', label: 'appropriate' }, { t: 'line', pts: hist(1.04, 20), c: 's4', label: 'too large' }] } }
    ],
    examples: [
      { title: 'Validation loss by hand (worked)', body: R`Validation targets [10, 12, 9], predictions [11, 10, 9] → residuals −1, 2, 0 → $L_{\text{val}} = (1 + 4 + 0)/3 = 5/3 \approx 1.67$.` }
    ],
    code: [{ title: 'Learning-rate sweep and selection by validation loss', scratch: 'L05_lr_tuning_scratch.py' }],
    traps: [
      'Tune α on **validation**, never on test (P6(b)).',
      'A downhill direction does not guarantee a lower loss: too large a step overshoots (P6(a)).',
      'BGD does **not** invert $X^TX$ (P6(c)).',
      'Compare **validation** loss, not training loss, when choosing α.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'Validation residuals are 2, −1, 3. Compute L_val (2 decimals).', answer: 4.67, tol: 0.01, round: '2 decimals', verify: '(4+1+9)/3',
        sol: '(4 + 1 + 9)/3 = 14/3 ≈ **4.67**.' },
      { type: 'mcq', diff: 'E', q: 'Validation losses: α = 0.1 → 18.4, α = 0.01 → 6.2, α = 0.001 → 9.7. Which α?', options: ['0.1', '0.01', '0.001', 'Average them'], answer: 1,
        sol: 'Lowest validation loss = 6.2.', why: ['Highest loss (too large).', 'Correct.', 'Too slow within the budget.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'With a learning rate that is **too large**, the loss typically:', options: ['decreases very slowly', 'oscillates or diverges', 'becomes exactly zero', 'is unaffected'], answer: 1,
        sol: 'Case 2: overshooting the minimum.', why: ['That is too small.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'P6: select all **false** statements.', options: ['If the gradient points downhill, the loss always decreases regardless of α', 'We use the test set to choose α', 'BGD explicitly computes (XᵀX)⁻¹', 'BGD can run even when XᵀX is singular'], answer: [0, 1, 2],
        sol: '(a), (b), (c) are false. The last is a listed advantage of BGD.', why: ['False.', 'False.', 'False.', 'True.'] },
      { type: 'mcq', diff: 'M', q: 'A dataset has 50 million rows. Why is Batch GD a poor fit?', options: ['It cannot handle large numbers', 'Every single update scans all 50 million rows', 'It requires the inverse of XᵀX', 'It needs labels'], answer: 1,
        sol: 'P6(d): each update is a full pass → use mini-batch GD (L6).', why: ['No.', 'Correct.', 'False.', 'All supervised methods do.'] },
      { type: 'int', diff: 'H', tag: 'GATE-style', q: R`GD on $L(\theta) = 2\theta^2$ uses $\theta \leftarrow \theta - \alpha\cdot 4\theta$. What is the **largest** α (exclusive bound) for which the iterates still converge to 0?`, answer: 0.5, tol: 0.001, round: '1 decimal', verify: '2/4',
        sol: '$\\theta \\leftarrow (1 - 4\\alpha)\\theta$ converges iff $|1 - 4\\alpha| < 1 \\iff 0 < \\alpha < 0.5$. Bound = **0.5**. (Between 0.25 and 0.5 it oscillates while converging.)' }
    ],
    source: 'Worksheet L5 pp.8–10; Goodfellow et al. §8.1.3; Bengio, "Practical recommendations for gradient-based training" (2012).'
  }
  ]
});
})();
