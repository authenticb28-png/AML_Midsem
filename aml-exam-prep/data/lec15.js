/* Lecture 15 — Gradient descent for logistic regression; multiclass (OvR, softmax, cross-entropy) */
(function () {
const rnd = NUM.rng(15), G = () => NUM.gauss(rnd);
const cls = [[], [], []], ctr = [[2.5, 2.2], [6.8, 2.8], [4.6, 5.6]];
ctr.forEach((c, k) => { for (let i = 0; i < 14; i++) cls[k].push([c[0] + G() * 0.8, c[1] + G() * 0.7]); });
const ring = [], core = []; for (let i = 0; i < 40; i++) { const a = 2 * Math.PI * rnd(), r = 2.4 + G() * 0.25; ring.push([r * Math.cos(a), r * Math.sin(a) * 1.6]); const b = 2 * Math.PI * rnd(), s = 0.9 * Math.sqrt(rnd()); core.push([s * Math.cos(b), s * Math.sin(b) * 1.6]); }
LECTURES.push({
  num: 15, short: 'Logistic GD & Multiclass', title: 'Gradient Descent on Logistic Regression and Multiclass Classification — (p̂ − y)x, batch updates, One-vs-Rest, softmax, cross-entropy',
  file: 'AML_Lecture15_Worksheet_Teacher (1) (1).pdf', pages: 13,
  intro: R`**Exam weight: high.** The chain rule collapses to **$\partial L/\partial\beta_j = (\hat p - y)x_j$**; batch update $\boldsymbol\beta \leftarrow \boldsymbol\beta - \frac{\alpha}{n}X^T(\hat{\mathbf p} - \mathbf y)$; one full numerical update; **OvR** (K binary models, outputs need not sum to 1, $K(d+1)$ parameters) vs **softmax** ($\hat p_k = e^{z_k}/\sum e^{z_j}$, sums to 1, shift-invariant); cross-entropy $-\log\hat p_{\text{true}}$; **odds/log-odds** ($e^{\beta_j}$ multiplies the odds); polynomial features + regularisation. About 90 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L15.1 */
  {
    id: 'L15.1', title: 'The dependency chain and ∂L/∂p̂', badge: 'class', pages: '1–2', ws: 'Sections 1–3',
    concept: R`
Lecture 14 ended with the loss
$$J(\boldsymbol\beta) = -\frac1n\sum_{i=1}^n\big[y_i\log\hat p_i + (1-y_i)\log(1-\hat p_i)\big],\qquad \hat p_i = \sigma(\boldsymbol\beta^T\mathbf x_i)$$
It scores a candidate β but has **no closed-form normal equation**. Gradient descent uses the local slope: $\beta_j^{(t+1)} = \beta_j^{(t)} - \alpha\,\partial J/\partial\beta_j$ — the derivative gives direction and steepness, α how far to move.

**One training example:**

| Symbol | Meaning |
|---|---|
| $x_{ij}$ | feature j of observation i |
| $\beta_j$ | weight of feature j |
| $z_i = \beta_0 + \sum_j\beta_jx_{ij}$ | linear score |
| $\hat p_i = \sigma(z_i)$, $y_i$ | predicted class-1 probability, observed label |
| $L_i = -[y_i\log\hat p_i + (1-y_i)\log(1-\hat p_i)]$ | one-example BCE |

:::warn Notation clean-up
$L_i$ already contains the leading minus, so $J = \frac1n\sum_iL_i$ — do not add a second minus.
:::

**A weight reaches the loss through three links:** $\beta_j \to z_i \to \hat p_i \to L_i$, so
$$\frac{\partial L_i}{\partial\beta_j} = \frac{\partial L_i}{\partial\hat p_i}\cdot\frac{\partial\hat p_i}{\partial z_i}\cdot\frac{\partial z_i}{\partial\beta_j}$$

**First link (Section 3):** holding $y_i$ fixed,
$$\frac{\partial L_i}{\partial\hat p_i} = -\frac{y_i}{\hat p_i} + \frac{1-y_i}{1-\hat p_i} = \frac{\hat p_i - y_i}{\hat p_i(1-\hat p_i)}$$
(The second term is **positive** because $\frac{d}{d\hat p}\log(1-\hat p) = -\frac{1}{1-\hat p}$ and BCE already has a leading minus.)`,
    deriv: [{ id: 'D15-dLdp', title: '∂L/∂p̂ for binary cross-entropy', badge: 'class',
      steps: [
        { m: R`L = -y\log\hat p - (1-y)\log(1-\hat p)`, t: 'One example.' },
        { m: R`\frac{\partial L}{\partial\hat p} = -\frac{y}{\hat p} - (1-y)\cdot\frac{-1}{1-\hat p} = -\frac{y}{\hat p} + \frac{1-y}{1-\hat p}`, why: '$\\frac{d}{dp}\\log p = 1/p$; $\\frac{d}{dp}\\log(1-p) = -1/(1-p)$.' },
        { m: R`= \frac{-y(1-\hat p) + (1-y)\hat p}{\hat p(1-\hat p)}`, why: 'Common denominator.' },
        { m: R`= \frac{-y + y\hat p + \hat p - y\hat p}{\hat p(1-\hat p)}`, why: 'Expand; the $y\\hat p$ terms cancel.' }
      ], result: R`\frac{\partial L}{\partial\hat p} = \frac{\hat p - y}{\hat p(1-\hat p)}` }],
    formulas: [{ name: 'GD step', tex: R`\beta_j \leftarrow \beta_j - \alpha\frac{\partial J}{\partial\beta_j}`, sym: '', when: 'All updates.' }, { name: 'First link', tex: R`\frac{\partial L}{\partial\hat p} = \frac{\hat p - y}{\hat p(1-\hat p)}`, sym: '', when: 'Chain-rule questions.' }],
    plots: [{ id: 'P15-chain', title: 'One weight influences the loss through three local links', notice: 'Multiply the three local derivatives (chain rule).',
      spec: { type: 'flow', w: 760, h: 150, nodes: [{ id: 'b', x: 60, y: 60, w: 100, h: 44, t: 'βⱼ\nparameter', c: 's7' }, { id: 'z', x: 250, y: 60, w: 110, h: 44, t: 'zᵢ\nlinear score', c: 's1' }, { id: 'p', x: 500, y: 60, w: 120, h: 44, t: 'p̂ᵢ = σ(zᵢ)\nprobability', c: 's3' }, { id: 'l', x: 690, y: 60, w: 100, h: 44, t: 'Lᵢ\nBCE loss', c: 's4' }],
        edges: [{ a: 'b', b: 'z', t: '∂z/∂β = xⱼ' }, { a: 'z', b: 'p', t: '∂p̂/∂z = p̂(1−p̂)' }, { a: 'p', b: 'l', t: '∂L/∂p̂' }] } }],
    examples: [{ title: 'Evaluate ∂L/∂p̂ (worked)', body: R`y = 1, p̂ = 0.8: (0.8 − 1)/(0.8 × 0.2) = −0.2/0.16 = **−1.25** (raising p̂ lowers the loss). y = 0, p̂ = 0.8: 0.8/0.16 = **5** (raising p̂ raises the loss).` }],
    traps: ['Do not double the minus sign when averaging $L_i$.', 'The (1 − y) term has a **positive** derivative contribution.'],
    questions: [
      { type: 'int', diff: 'M', q: 'y = 1, p̂ = 0.8. ∂L/∂p̂ (2 decimals)?', answer: -1.25, tol: 0.001, round: '2 decimals', verify: '(0.8-1)/(0.8*0.2)', sol: '−0.2/0.16 = **−1.25**.' },
      { type: 'int', diff: 'M', q: 'y = 0, p̂ = 0.8. ∂L/∂p̂?', answer: 5, tol: 0.001, round: 'Exact', verify: '(0.8-0)/(0.8*0.2)', sol: '0.8/0.16 = **5**.' },
      { type: 'mcq', diff: 'E', q: 'Why is gradient descent needed for logistic regression?', options: ['BCE is not differentiable', 'There is no closed-form solution for the minimising β', 'GD is always faster', 'Logistic regression has no parameters'], answer: 1, sol: 'Section 1.', why: ['It is differentiable.', 'Correct.', 'Not the reason.', 'No.'] },
      { type: 'mcq', diff: 'M', q: R`$\frac{\partial}{\partial\hat p}\left[-(1-y)\log(1-\hat p)\right]$ equals:`, options: [R`$-\frac{1-y}{1-\hat p}$`, R`$\frac{1-y}{1-\hat p}$`, R`$\frac{y}{\hat p}$`, R`$-(1-y)$`], answer: 1, sol: 'Two minus signs cancel.', why: ['Sign error.', 'Correct.', 'Wrong term.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'The chain for one weight is:', options: ['β → p̂ → z → L', 'β → z → p̂ → L', 'z → β → L → p̂', 'L → p̂ → z → β'], answer: 1, sol: 'Section 2 diagram.', why: ['Order wrong.', 'Correct.', 'No.', 'That is the backward direction of derivatives, not dependence.'] }
    ],
    source: 'Worksheet L15 pp.1–2.'
  },
  /* ---------------------------------------------------------------- L15.2 */
  {
    id: 'L15.2', title: 'Sigmoid derivative; the chain rule collapses to (p̂ − y)x', badge: 'class', pages: '2–3', ws: 'Sections 4–5, P1',
    concept: R`
**Second link — sigmoid derivative:** $\dfrac{\partial\hat p}{\partial z} = \sigma(z)[1-\sigma(z)] = \hat p(1-\hat p)$. It is **largest at p̂ = 0.5** (value 0.25) and tiny near 0 or 1: probability changes fastest near the boundary and slowly in the saturated ends.

**Third link — linear score:** $\partial z_i/\partial\beta_j = x_{ij}$; for the intercept set $x_{i0} = 1$.

**Collapse:**
$$\frac{\partial L_i}{\partial\beta_j} = \frac{\hat p_i - y_i}{\hat p_i(1-\hat p_i)}\cdot\hat p_i(1-\hat p_i)\cdot x_{ij} = (\hat p_i - y_i)\,x_{ij}$$

:::key Key insight
The gradient is driven by **prediction minus target**. The feature value sets how strongly that observation influences a weight; a **negative** $x_{ij}$ reverses the direction for that weight. (Same form as linear regression's $(\hat y - y)x$.)
:::

**PRACTICE P1.** (c) y = 1, p̂ = 0.30, $x_j = -2$: error −0.70; gradient contribution $(-0.70)(-2) = $ **+1.40**; GD makes $\beta_j$ **fall**. No contradiction: with $x_j < 0$, decreasing $\beta_j$ **increases** $\beta_jx_j$, raising z and p̂. (d) Two positives with $x_j = 4$: p̂ = 0.95 → $(−0.05)(4) = $ **−0.20**; p̂ = 0.20 → $(−0.80)(4) = $ **−3.20**. The badly predicted example has much more influence (stronger upward correction).`,
    deriv: [
      { id: 'D15-sigmoid', title: 'Derivative of the sigmoid', badge: 'class',
        steps: [
          { m: R`\sigma(z) = (1 + e^{-z})^{-1}`, t: '' },
          { m: R`\sigma'(z) = -(1+e^{-z})^{-2}\cdot(-e^{-z}) = \frac{e^{-z}}{(1+e^{-z})^2}`, why: 'Chain rule.' },
          { m: R`= \frac{1}{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}} = \sigma(z)\cdot\big(1 - \sigma(z)\big)`, why: '$\\frac{e^{-z}}{1+e^{-z}} = 1 - \\frac{1}{1+e^{-z}}$.' }
        ], result: R`\sigma'(z) = \sigma(z)\,[1-\sigma(z)]` },
      { id: 'D15-grad', title: 'Per-example gradient of BCE', badge: 'class',
        steps: [
          { m: R`\frac{\partial L_i}{\partial\beta_j} = \frac{\partial L_i}{\partial\hat p_i}\cdot\frac{\partial\hat p_i}{\partial z_i}\cdot\frac{\partial z_i}{\partial\beta_j}`, t: 'Chain rule.' },
          { m: R`= \frac{\hat p_i - y_i}{\hat p_i(1-\hat p_i)}\cdot\hat p_i(1-\hat p_i)\cdot x_{ij}`, why: 'Substitute the three links.' }
        ], result: R`\frac{\partial L_i}{\partial\beta_j} = (\hat p_i - y_i)\,x_{ij}`, after: 'The $\\hat p(1-\\hat p)$ factors cancel exactly — this is why BCE pairs so well with the sigmoid (with MSE they would not cancel and gradients vanish when the sigmoid saturates).' }
    ],
    formulas: [{ name: 'Sigmoid derivative', tex: R`\sigma'(z) = \sigma(z)(1-\sigma(z))`, sym: 'Max 0.25 at z = 0.', when: 'Chain rule.' }, { name: 'Logistic gradient (one example)', tex: R`\frac{\partial L_i}{\partial\beta_j} = (\hat p_i - y_i)x_{ij}`, sym: '$x_{i0} = 1$.', when: 'Every GD step.' }],
    examples: [{ title: 'Gradient contributions (worked)', body: R`| y | p̂ | x_j | (p̂ − y)x_j | effect on β_j under GD |
|---|---|---|---|---|
| 1 | 0.30 | −2 | +1.40 | falls (raises z because x < 0) |
| 1 | 0.95 | 4 | −0.20 | rises a little |
| 1 | 0.20 | 4 | −3.20 | rises a lot |
| 0 | 0.70 | 3 | +2.10 | falls |` }],
    code: [{ title: 'Analytic vs numeric gradient check', scratch: 'L15_logistic_gd_scratch.py' }],
    traps: ['σ′(z) is largest (0.25) at z = 0, not at the extremes.', 'A negative feature value flips the direction of the weight update.', 'Gradient sign: (p̂ − y), not (y − p̂), when you **subtract** α × gradient.'],
    questions: [
      { type: 'int', diff: 'E', q: 'y = 1, p̂ = 0.30, xⱼ = −2. Gradient contribution (p̂ − y)xⱼ?', answer: 1.4, tol: 0.001, round: '2 decimals', verify: '(0.30-1)*(-2)', sol: '(−0.7)(−2) = **+1.40**.' },
      { type: 'int', diff: 'E', q: 'y = 1, p̂ = 0.20, xⱼ = 4. Gradient contribution?', answer: -3.2, tol: 0.001, round: '2 decimals', verify: '(0.20-1)*4', sol: '**−3.20**.' },
      { type: 'int', diff: 'M', q: 'σ(z) = 0.8. σ′(z)?', answer: 0.16, tol: 0.0001, round: '2 decimals', verify: '0.8*0.2', sol: '0.8 × 0.2 = **0.16**.' },
      { type: 'int', diff: 'E', q: 'Maximum value of σ′(z)?', answer: 0.25, tol: 0.0001, round: '2 decimals', verify: '0.5*0.5', sol: 'At z = 0: 0.5 × 0.5 = **0.25**.' },
      { type: 'mcq', diff: 'M', q: 'With y = 1, p̂ = 0.30, xⱼ = −2, GD makes βⱼ:', options: ['rise', 'fall', 'stay', 'become zero'], answer: 1, sol: 'Gradient +1.4 → β − α(1.4) falls; since x < 0 that raises z.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Two positive examples with the same xⱼ: p̂ = 0.95 and p̂ = 0.20. Which influences βⱼ more?', options: ['p̂ = 0.95', 'p̂ = 0.20', 'equal', 'neither'], answer: 1, sol: 'P1(d): |−3.20| > |−0.20|.', why: ['Small error.', 'Correct.', 'No.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import math
s = lambda z: 1 / (1 + math.exp(-z))
h = 1e-6
print(round((s(h) - s(-h)) / (2 * h), 4), round(s(0) * (1 - s(0)), 4))`, answer: '0.25 0.25', sol: 'Numerical derivative at 0 matches σ(0)(1 − σ(0)) = 0.25.' }
    ],
    source: 'Worksheet L15 pp.2–3; Bishop §4.3.2.'
  },
  /* ---------------------------------------------------------------- L15.3 */
  {
    id: 'L15.3', title: 'Batch gradient descent for logistic regression; one numerical update', badge: 'class', pages: '3–5', ws: 'Sections 6–7, P2',
    concept: R`
Average the per-example losses and gradients:
$$J = \frac1n\sum_iL_i,\qquad \frac{\partial J}{\partial\beta_j} = \frac1n\sum_{i=1}^n(\hat p_i - y_i)x_{ij},\qquad \beta_j \leftarrow \beta_j - \alpha\frac1n\sum_i(\hat p_i - y_i)x_{ij}$$
Vector form with a design matrix (first column of ones):
$$\nabla_{\boldsymbol\beta}J = \frac1nX^T(\hat{\mathbf p} - \mathbf y),\qquad \boldsymbol\beta \leftarrow \boldsymbol\beta - \alpha\nabla_{\boldsymbol\beta}J$$

| Object | Shape |
|---|---|
| X | n × (d + 1) |
| β | (d + 1) × 1 |
| $\hat{\mathbf p} - \mathbf y$ | n × 1 |
| $X^T(\hat{\mathbf p} - \mathbf y)$ | (d + 1) × 1 |

**One iteration:** choose β and α → compute z = Xβ and $\hat{\mathbf p} = \sigma(\mathbf z)$ → average BCE and $X^T(\hat{\mathbf p} - \mathbf y)/n$ → update **all** parameters simultaneously → repeat until loss/gradient barely changes or an iteration limit.

**Worked update (Section 7).** Observations (x = 1, y = 0) and (x = 2, y = 1); β₀ = β₁ = 0 → z = 0, p̂ = 0.5 for both; errors +0.5, −0.5.
- $\partial J/\partial\beta_0 = (0.5 - 0.5)/2 = 0$; $\partial J/\partial\beta_1 = (0.5\cdot1 - 0.5\cdot2)/2 = -0.25$.
- α = 0.4: β₀ = 0, β₁ = 0 − 0.4(−0.25) = **0.10**.
- New scores 0.10, 0.20 → p̂ ≈ 0.525, 0.550. Average BCE **0.693 → 0.671**.

The negative example got slightly worse (0.5 → 0.525) but the positive with the larger feature improved more; BGD balances all observations and the average loss falls.

**PRACTICE P2.** (a) $X^T(\hat{\mathbf p} - \mathbf y)/2$ with $X = [[1,1],[1,2]]$ and errors (0.5, −0.5) = [0, −0.25]. (b) β = (0.4, −0.1), gradient (−0.3, 0.5), α = 0.2 → **(0.46, −0.20)**. (c) Updating β₀, recomputing, then differentiating for β₁ breaks the simultaneous update — the components no longer belong to one gradient at one β. (d) Loss oscillates/NaN → **reduce α**, use a stable loss; loss falls extremely slowly with differently scaled features → **standardise**, tune α; loss never changes → inspect shapes, gradients and whether parameters are actually replaced. (e) Zero full-data gradient → no update; it may be a stationary point but could also be a bug, so still check.

:::warn Batch, stochastic, mini-batch
Batch uses all n observations per update; SGD/mini-batch (L6) change how many contribute — the gradient logic is the same.
:::`,
    formulas: [{ name: 'Batch gradient', tex: R`\nabla J = \frac1nX^T(\hat{\mathbf p} - \mathbf y)`, sym: '', when: 'Vectorised GD.' }, { name: 'Update', tex: R`\boldsymbol\beta \leftarrow \boldsymbol\beta - \frac{\alpha}{n}X^T(\sigma(X\boldsymbol\beta) - \mathbf y)`, sym: '', when: 'Code.' }],
    plots: [{ id: 'P15-loop', title: 'Logistic regression training loop', notice: 'Repeat until the loss or gradient stops changing meaningfully.',
      spec: { type: 'flow', w: 680, h: 170, nodes: [{ id: 'a', x: 60, y: 50, w: 100, h: 46, t: '1 Start β', c: 's7' }, { id: 'b', x: 175, y: 50, w: 100, h: 46, t: '2 Scores\nXβ', c: 's1' }, { id: 'c', x: 290, y: 50, w: 100, h: 46, t: '3 Sigmoid\np̂', c: 's3' }, { id: 'd', x: 405, y: 50, w: 100, h: 46, t: '4 Loss\nBCE', c: 's4' }, { id: 'e', x: 520, y: 50, w: 100, h: 46, t: '5 Gradient\nXᵀ(p̂−y)/n', c: 's5' }, { id: 'f', x: 630, y: 50, w: 90, h: 46, t: '6 Update\nβ', c: 's2' }],
        edges: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'c', b: 'd' }, { a: 'd', b: 'e' }, { a: 'e', b: 'f' }, { a: 'f', b: 'b', via: [[630, 130], [175, 130]], t: 'repeat', dash: true }] } }],
    examples: [{ title: 'BCE after the update (worked)', body: R`p̂₁ = σ(0.1) = 0.525 (y = 0) → loss −ln(0.475) = 0.744. p̂₂ = σ(0.2) = 0.550 (y = 1) → −ln(0.550) = 0.598. Average (0.744 + 0.598)/2 = **0.671** < 0.693 = ln 2.` }],
    code: [{ title: 'One update by hand, then full BGD for logistic regression', scratch: 'L15_logistic_gd_scratch.py', lib: 'L15_logistic_gd_sklearn.py' }],
    traps: ['Initial BCE with β = 0 is always ln 2 ≈ 0.693 (every p̂ = 0.5).', 'Update all components **simultaneously**.', 'Logistic gradient has **1/n** (no factor 2 as in MSE).'],
    questions: [
      { type: 'int', diff: 'M', q: 'Data (x=1, y=0), (x=2, y=1); β = 0. ∂J/∂β₁ (2 decimals)?', answer: -0.25, tol: 0.0001, round: '2 decimals', verify: '(0.5*1+(-0.5)*2)/2', sol: '(0.5 − 1)/2 = **−0.25**.' },
      { type: 'int', diff: 'E', q: 'Same; α = 0.4. β₁ after one update?', answer: 0.1, tol: 0.0001, round: '2 decimals', verify: '0-0.4*(-0.25)', sol: '**0.10**.' },
      { type: 'int', diff: 'M', q: 'After the update p̂ = (0.525, 0.550) for y = (0, 1). Average BCE (3 decimals)?', answer: 0.671, tol: 0.001, round: '3 decimals', verify: '-(__import__("math").log(1-0.524979)+__import__("math").log(0.549834))/2', sol: '(0.744 + 0.598)/2 = **0.671**.' },
      { type: 'int', diff: 'E', q: 'β = (0.4, −0.1), gradient (−0.3, 0.5), α = 0.2. New β₁?', answer: -0.2, tol: 0.0001, round: '2 decimals', verify: '-0.1-0.2*0.5', sol: '−0.1 − 0.1 = **−0.20** (β₀ = 0.46).' },
      { type: 'int', diff: 'E', q: 'All parameters start at 0. Initial average BCE (3 decimals)?', answer: 0.693, tol: 0.001, round: '3 decimals', verify: '__import__("math").log(2)', sol: 'Every p̂ = 0.5 → −ln 0.5 = **0.693**.' },
      { type: 'mcq', diff: 'M', q: 'Loss oscillates or becomes NaN during training. First response?', options: ['Increase α', 'Reduce α and use a stable loss implementation', 'Add more features', 'Remove the intercept'], answer: 1, sol: 'P2(d)(i).', why: ['Makes it worse.', 'Correct.', 'No.', 'No.'] },
      { type: 'write', diff: 'M', q: 'Write `logistic_step(X, y, beta, alpha)` that performs ONE batch-GD update and returns the new beta: p̂ = σ(Xβ), gradient Xᵀ(p̂ − y)/n. X already includes the column of ones.',
        starter: 'import numpy as np\n\ndef logistic_step(X, y, beta, alpha):\n    pass\n',
        ref: 'import numpy as np\n\ndef logistic_step(X, y, beta, alpha):\n    X = np.asarray(X, float); y = np.asarray(y, float); beta = np.asarray(beta, float)\n    p = 1 / (1 + np.exp(-X @ beta))\n    return beta - alpha * X.T @ (p - y) / len(y)',
        tests: 'b = logistic_step([[1, 1], [1, 2]], [0, 1], [0, 0], 0.4)\nassert np.allclose(b, [0.0, 0.1])\nb2 = logistic_step([[1, 0], [1, 0]], [1, 1], [0, 0], 1.0)\nassert np.allclose(b2, [0.5, 0.0])' }
    ],
    source: 'Worksheet L15 pp.3–5.'
  },
  /* ---------------------------------------------------------------- L15.4 */
  {
    id: 'L15.4', title: 'Multiclass: One-vs-Rest construction and prediction', badge: 'class', pages: '5–7', ws: 'Sections 8–10, P3',
    concept: R`
**Multiclass** = each observation gets **exactly one of K ≥ 3** mutually exclusive labels (e.g. placement: Yes, No, Opt out). A single sigmoid naturally gives p̂ and 1 − p̂ — two outcomes. Two routes: **One-vs-Rest (OvR)** — one binary logistic model per class; **multinomial / softmax regression** — all class scores fitted jointly.

| Task | Labels per observation | Example |
|---|---|---|
| binary | exactly one of 2 | placed / not placed |
| multiclass | exactly one of K | Yes / No / Opt out |
| multilabel | any subset | an image with car **and** person **and** bicycle |

**OvR construction** — binary indicator columns:

| Original | Model Y | Model N | Model O |
|---|---|---|---|
| Yes | 1 | 0 | 0 |
| No | 0 | 1 | 0 |
| Opt out | 0 | 0 | 1 |

Model Y: Yes = 1 vs (No or Opt out) = 0, etc. Each model has its own parameters, score, sigmoid, BCE and GD updates. Parameters: **K(d + 1)**.

**Prediction.** Independent outputs $q_Y = 0.60$, $q_N = 0.30$, $q_O = 0.50$ sum to **1.40, not 1**. Predict the **largest**: $\hat y = \arg\max_k q_k = $ **Y**. Normalising (÷ 1.40) gives 0.429, 0.214, 0.357 and **preserves the argmax**.

| OvR strengths | OvR limitations |
|---|---|
| reuses a reliable binary classifier | needs K separately fitted models |
| dedicated decision problem per class | outputs do not automatically sum to 1 |
| class-specific weighting/diagnostics | models do not compete during fitting |

**PRACTICE P3.** (a) Classes (Y, O, N, Y, N): Model Y (1,0,0,1,0); Model O (0,1,0,0,0); Model N (0,0,1,0,1). (b) (q_Y, q_N, q_O) = (0.42, 0.68, 0.55): predict **No**; sum **1.65**; normalised **0.255, 0.412, 0.333** (dividing by the same positive number keeps the order). (c) K = 6, d = 4: K(d + 1) = **30**. (d) mild/moderate/severe → **multiclass**; image with car, person, bicycle → **multilabel**; spam/not → **binary**.`,
    formulas: [{ name: 'OvR prediction', tex: R`\hat y = \arg\max_k q_k,\quad q_k = \sigma(\boldsymbol\beta_k^T\mathbf x)`, sym: 'q_k need not sum to 1.', when: 'OvR questions.' }, { name: 'Parameter count', tex: R`K(d+1)`, sym: 'K classes, d features + intercept.', when: 'Counting.' }],
    plots: [
      { id: 'P15-3class', title: 'One input must be assigned to one of three classes', notice: 'Three mutually exclusive placement classes in (IQ, CGPA) space.',
        spec: { type: 'xy', w: 480, h: 300, xlim: [0, 9.5], ylim: [0, 8], xlabel: 'IQ (scaled)', ylabel: 'CGPA (scaled)', legend: 'tl', series: [{ t: 'scatter', pts: cls[0], c: 's4', label: 'No' }, { t: 'scatter', pts: cls[1], c: 's3', m: 's', label: 'Yes' }, { t: 'scatter', pts: cls[2], c: 's5', m: '^', label: 'Opt out' }] } },
      { id: 'P15-ovr', title: 'OvR: one independent binary problem per class', notice: 'Each panel relabels the data: the highlighted class is positive (1), everything else negative (0).',
        spec: { type: 'multi', panels: ['No', 'Yes', 'Opt out'].map((nm, k) => ({ type: 'xy', w: 250, h: 220, title: nm + ' vs rest', xlim: [0, 9.5], ylim: [0, 8], xlabel: 'IQ', ylabel: 'CGPA', series: [0, 1, 2].map(j => ({ t: 'scatter', pts: cls[j], c: j === k ? ['s4', 's3', 's5'][k] : 's7', r: j === k ? 4.5 : 3, op: j === k ? 1 : 0.5 })) })) } }
    ],
    examples: [{ title: 'OvR with normalisation (worked)', body: R`(q_Y, q_N, q_O) = (0.42, 0.68, 0.55). Sum 1.65. q̃ = 0.42/1.65 = 0.255, 0.68/1.65 = 0.412, 0.55/1.65 = 0.333. Argmax unchanged: **No**. (scikit-learn's OvR \`predict_proba\` does exactly this normalisation.)` }],
    code: [{ title: 'OvR targets and prediction; sklearn OvR vs softmax', scratch: 'L15_multiclass_scratch.py', lib: 'L15_multiclass_sklearn.py' }],
    traps: ['OvR outputs **need not sum to 1**.', 'Multiclass ≠ multilabel.', 'Normalising OvR outputs never changes the predicted class.'],
    questions: [
      { type: 'int', diff: 'E', q: 'K = 6 classes, d = 4 features (+ intercept). OvR parameter entries K(d+1)?', answer: 30, tol: 0, round: 'Exact', verify: '6*(4+1)', sol: '**30**.' },
      { type: 'int', diff: 'E', q: 'OvR outputs (0.42, 0.68, 0.55). Sum?', answer: 1.65, tol: 0.0001, round: '2 decimals', verify: '0.42+0.68+0.55', sol: '**1.65**.' },
      { type: 'int', diff: 'M', q: 'Same outputs. Normalised value for class No (3 decimals)?', answer: 0.412, tol: 0.001, round: '3 decimals', verify: '0.68/1.65', sol: '0.68/1.65 = **0.412**.' },
      { type: 'mcq', diff: 'E', q: 'An image may contain a car, a person and a bicycle together. This label set is:', options: ['binary', 'multiclass', 'multilabel', 'regression'], answer: 2, sol: 'P3(d)(ii).', why: ['No.', 'Classes are not mutually exclusive.', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Classes (Y, O, N, Y, N). Binary target for Model N?', options: ['(1,0,0,1,0)', '(0,1,0,0,0)', '(0,0,1,0,1)', '(0,0,1,0,0)'], answer: 2, sol: 'P3(a).', why: ['Model Y.', 'Model O.', 'Correct.', 'Misses the last N.'] },
      { type: 'mcq', diff: 'M', q: 'Why does normalising OvR outputs not change the prediction?', options: ['It always does', 'All values are divided by the same positive number, so the order is kept', 'Because they already sum to 1', 'Because of the sigmoid'], answer: 1, sol: 'P3(b).', why: ['No.', 'Correct.', 'They do not.', 'No.'] }
    ],
    source: 'Worksheet L15 pp.5–7; scikit-learn `OneVsRestClassifier`.'
  },
  /* ---------------------------------------------------------------- L15.5 */
  {
    id: 'L15.5', title: 'Softmax', badge: 'class', pages: '8', ws: 'Sections 11–12',
    concept: R`
One **joint** multiclass model: each class k gets a **logit** $z_{ik} = \boldsymbol\beta_k^T\mathbf x_i$ (any real number; meaning is relative to the other logits). **Exponentiate and normalise:**
$$\hat p_{ik} = \frac{e^{z_{ik}}}{\sum_{j=1}^Ke^{z_{ij}}},\qquad \sum_{k=1}^K\hat p_{ik} = 1$$
Every probability is positive; predict the largest; adding the **same constant to all logits** leaves the distribution unchanged; parameter entries (d + 1)K.

**Worked example — logits (2, 1, 0):**

| Class | z | $e^z$ | softmax |
|---|---|---|---|
| Yes | 2 | 7.389 | 7.389/11.107 = **0.665** |
| No | 1 | 2.718 | 2.718/11.107 = **0.245** |
| Opt out | 0 | 1.000 | 1/11.107 = **0.090** |

Logits (102, 101, 100) give exactly the same probabilities (shift invariance, proof below) — which is also why implementations subtract $\max_k z_k$ before exponentiating to avoid overflow. With K = 2, softmax reduces to the sigmoid of the logit difference.`,
    deriv: [{ id: 'D15-shift', title: 'Softmax is unchanged by adding a constant to every logit', badge: 'class',
      steps: [
        { m: R`\frac{e^{z_k + c}}{\sum_j e^{z_j + c}} = \frac{e^{c}e^{z_k}}{e^{c}\sum_je^{z_j}}`, why: '$e^{a+b} = e^ae^b$.' },
        { m: R`= \frac{e^{z_k}}{\sum_j e^{z_j}}`, why: 'Cancel the common factor $e^c$.' },
        { m: R`K = 2:\ \ \hat p_1 = \frac{e^{z_1}}{e^{z_1} + e^{z_2}} = \frac{1}{1 + e^{-(z_1 - z_2)}} = \sigma(z_1 - z_2)`, why: 'Divide top and bottom by $e^{z_1}$: softmax generalises the sigmoid.' }
      ], result: R`\operatorname{softmax}(\mathbf z + c\mathbf 1) = \operatorname{softmax}(\mathbf z)` }],
    formulas: [{ name: 'Softmax', tex: R`\hat p_k = \frac{e^{z_k}}{\sum_{j=1}^Ke^{z_j}}`, sym: 'Sums to 1.', when: 'Multinomial logistic regression.' }, { name: 'Stable softmax', tex: R`\hat p_k = \frac{e^{z_k - \max_j z_j}}{\sum_je^{z_j - \max_j z_j}}`, sym: 'Same result, no overflow.', when: 'Implementation.' }],
    plots: [{ id: 'P15-softmax', title: 'Logits (2, 1, 0) → softmax probabilities (0.665, 0.245, 0.090)', notice: 'Relative scores become one probability distribution that sums to 1.',
      spec: { type: 'bars', w: 480, h: 280, cats: ['Yes', 'No', 'Opt out'], groups: [{ vals: [2, 1, 0], c: 's7', label: 'logit z' }, { vals: [0.665, 0.245, 0.09], c: 's1', label: 'softmax p̂' }], ylim: [0, 2.3] } }],
    examples: [{ title: 'Softmax with negative logits (worked)', body: R`z = (1, −1, 0): e^z = (2.718, 0.368, 1.000), sum 4.086 → p̂ = (0.665, 0.090, 0.245). It is the (2, 1, 0) example shifted by −1 and reordered.` }],
    code: [{ title: 'Softmax, shift invariance, softmax regression from scratch', scratch: 'L15_multiclass_scratch.py', lib: 'L15_multiclass_sklearn.py' }],
    traps: ['Softmax probabilities always sum to 1; OvR sigmoids need not.', 'Linear logits give **linear** boundaries (softmax does not curve them by itself).', 'Adding a constant to all logits does nothing; multiplying them does change the distribution.'],
    questions: [
      { type: 'int', diff: 'M', q: 'Logits (2, 1, 0). Softmax probability of the first class (3 decimals)?', answer: 0.665, tol: 0.001, round: '3 decimals', verify: '__import__("math").exp(2)/(__import__("math").exp(2)+__import__("math").exp(1)+1)', sol: '7.389/11.107 = **0.665**.' },
      { type: 'int', diff: 'M', q: 'Logits (102, 101, 100). Softmax of the last class (3 decimals)?', answer: 0.09, tol: 0.001, round: '3 decimals', verify: '1/(__import__("math").exp(2)+__import__("math").exp(1)+1)', sol: 'Shift-invariant → same as (2, 1, 0): **0.090**.' },
      { type: 'int', diff: 'M', q: 'Logits (0, 0, 0, 0). Softmax probability of each class?', answer: 0.25, tol: 0.0001, round: '2 decimals', verify: '1/4', sol: 'All equal → 1/4 = **0.25**.' },
      { type: 'mcq', diff: 'E', q: 'Softmax outputs for one observation always:', options: ['sum to 1', 'sum to K', 'are 0 or 1', 'can be negative'], answer: 0, sol: 'By construction.', why: ['Correct.', 'No.', 'No.', 'Exponentials are positive.'] },
      { type: 'mcq', diff: 'H', tag: 'GATE-style', q: 'For K = 2, softmax probability of class 1 equals:', options: ['σ(z₁)', 'σ(z₁ − z₂)', 'z₁/(z₁ + z₂)', 'e^{z₁}'], answer: 1, sol: 'Derivation step 3.', why: ['Ignores z₂.', 'Correct.', 'No exponentials.', 'Not normalised.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
z = np.array([2.0, 1.0, 0.0])
p = np.exp(z - z.max()) / np.exp(z - z.max()).sum()
print(np.round(p, 3), round(p.sum(), 6))`, answer: '[0.665 0.245 0.09 ] 1.0', sol: 'Stable softmax; NumPy pads 0.09 to align.' }
    ],
    source: 'Worksheet L15 p.8; Bishop §4.3.4.'
  },
  /* ---------------------------------------------------------------- L15.6 */
  {
    id: 'L15.6', title: 'Multiclass cross-entropy; its gradient; OvR vs softmax', badge: ['class', 'res'], pages: '9', ws: 'Sections 13–14 + researched gradient',
    concept: R`
With **one-hot** targets ($y_{ik} = 1$ for the class that occurred, 0 otherwise):
$$L_i = -\sum_{k=1}^Ky_{ik}\log\hat p_{ik} = -\log\hat p_{i,\text{true}}$$

| Observed | one-hot [Y, N, O] | surviving loss |
|---|---|---|
| Yes | [1, 0, 0] | −log p̂_Y |
| No | [0, 1, 0] | −log p̂_N |
| Opt out | [0, 0, 1] | −log p̂_O |

For the distribution (0.665, 0.245, 0.090): true class **No** → −log 0.245 ≈ **1.407**; true class **Yes** → −log 0.665 ≈ **0.408**. Dataset objective $J = -\frac1n\sum_i\sum_ky_{ik}\log\hat p_{ik}$ — the negative average log-likelihood of a **categorical** distribution (parallel to BCE for Bernoulli).

**Researched: the gradient is again "prediction − target":** $\partial L_i/\partial z_{ik} = \hat p_{ik} - y_{ik}$, so $\partial L_i/\partial\boldsymbol\beta_k = (\hat p_{ik} - y_{ik})\mathbf x_i$ (derivation below).

| Dimension | One-vs-Rest | Multinomial / softmax |
|---|---|---|
| training | K independent binary models | one joint K-class objective |
| outputs | K independent sigmoids | K coupled probabilities |
| sum to 1? | not automatically | yes |
| prediction | largest score/probability | largest softmax probability |
| class interaction | no competition during fitting | all classes share one denominator |
| interpretation | class k vs rest | one coherent distribution |

Use **OvR** for a simple binary reduction, binary-only estimators, or class-specific weighting/diagnostics. Use **softmax** when classes are mutually exclusive and a joint probability distribution is needed.

:::warn Class imbalance
Neither OvR nor softmax fixes class imbalance automatically: class weights, sampling, metrics (L7) and thresholds still need attention.
:::`,
    deriv: [
      { id: 'D15-ce', title: 'One-hot cross-entropy keeps only the true class', badge: 'class',
        steps: [
          { m: R`L_i = -\sum_k y_{ik}\log\hat p_{ik}`, t: '' },
          { m: R`y_{ik} = 0\ \text{for } k \neq \text{true} \Rightarrow \text{those terms vanish}`, why: 'One-hot selector.' },
          { m: R`L_i = -1\cdot\log\hat p_{i,\text{true}}`, t: '' }
        ], result: R`L_i = -\log\hat p_{i,\text{true}}`, after: 'With K = 2 and y ∈ {0,1} this is exactly binary cross-entropy.' },
      { id: 'D15-cegrad', title: 'Gradient of softmax cross-entropy w.r.t. the logits', badge: 'res',
        steps: [
          { m: R`L = -\sum_k y_k\log\hat p_k,\quad \log\hat p_k = z_k - \log\sum_j e^{z_j}`, why: 'Log of softmax.' },
          { m: R`L = -\sum_k y_kz_k + \Big(\sum_k y_k\Big)\log\sum_j e^{z_j} = -\sum_k y_kz_k + \log\sum_je^{z_j}`, why: 'One-hot: $\\sum_k y_k = 1$.' },
          { m: R`\frac{\partial L}{\partial z_m} = -y_m + \frac{e^{z_m}}{\sum_j e^{z_j}} = \hat p_m - y_m`, why: 'Differentiate the log-sum-exp.' },
          { m: R`\frac{\partial L}{\partial\boldsymbol\beta_m} = (\hat p_m - y_m)\,\mathbf x`, why: '$z_m = \\boldsymbol\\beta_m^T\\mathbf x$.' }
        ], result: R`\nabla_{\mathbf z}L = \hat{\mathbf p} - \mathbf y` }
    ],
    formulas: [{ name: 'Multiclass cross-entropy', tex: R`J = -\frac1n\sum_{i=1}^n\sum_{k=1}^Ky_{ik}\log\hat p_{ik}`, sym: 'One-hot y.', when: 'Softmax training objective.' }, { name: 'Gradient (researched)', tex: R`\frac{\partial L_i}{\partial z_{ik}} = \hat p_{ik} - y_{ik}`, sym: '', when: 'Softmax GD.' }],
    examples: [{ title: 'Logit gradient (worked)', body: R`p̂ = (0.665, 0.245, 0.090), true class No → y = (0, 1, 0). ∇_z L = (0.665, −0.755, 0.090): push the Yes and Opt-out logits down, the No logit up.` }],
    code: [{ title: 'Cross-entropy values; softmax regression trained by GD', scratch: 'L15_multiclass_scratch.py', lib: 'L15_multiclass_sklearn.py' }],
    traps: ['Only the true-class probability enters the loss (one-hot).', 'Neither method fixes class imbalance by itself.', 'scikit-learn ≥ 1.5 uses multinomial (softmax) by default for `LogisticRegression`; OvR needs `OneVsRestClassifier`.'],
    questions: [
      { type: 'int', diff: 'E', q: 'p̂ = (0.665, 0.245, 0.090), true class No (second). Cross-entropy (3 decimals)?', answer: 1.407, tol: 0.002, round: '3 decimals', verify: '-__import__("math").log(0.245)', sol: '−ln 0.245 ≈ **1.407**.' },
      { type: 'int', diff: 'E', q: 'Same p̂, true class Yes (first). Cross-entropy (3 decimals)?', answer: 0.408, tol: 0.001, round: '3 decimals', verify: '-__import__("math").log(0.665)', sol: '−ln 0.665 ≈ **0.408**.' },
      { type: 'int', diff: 'H', q: 'p̂ = (0.665, 0.245, 0.090), true class No. ∂L/∂z for the No logit (3 decimals)?', answer: -0.755, tol: 0.001, round: '3 decimals', verify: '0.245-1', sol: 'p̂ − y = 0.245 − 1 = **−0.755**.' },
      { type: 'mcq', diff: 'M', q: 'Which approach produces one coherent probability distribution over classes?', options: ['One-vs-Rest', 'Softmax', 'Both', 'Neither'], answer: 1, sol: 'Section 14 table.', why: ['Independent outputs.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Does softmax regression automatically solve class imbalance?', options: ['Yes', 'No — class weights, sampling, metrics and thresholds still matter'], answer: 1, sol: 'Warning, Section 14.', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'In OvR the K binary models:', options: ['share one denominator', 'are trained independently and do not compete', 'must output values summing to 1', 'need one-hot loss'], answer: 1, sol: 'Section 14.', why: ['That is softmax.', 'Correct.', 'No.', 'No.'] }
    ],
    researched: R`The softmax cross-entropy gradient is beyond the worksheet. Source: Bishop, *PRML* §4.3.4 (eq. 4.109); Goodfellow et al. §6.2.2.3.`,
    source: 'Worksheet L15 p.9; Bishop §4.3.4.'
  },
  /* ---------------------------------------------------------------- L15.7 */
  {
    id: 'L15.7', title: 'Assumptions, odds and log-odds, polynomial boundaries, regularisation', badge: 'class', pages: '10–13', ws: 'Sections 15–17, P5',
    concept: R`
**Four assumptions:** (1) the target matches the model (binary for binary LR; one mutually exclusive class for softmax); (2) observations independent (or dependence handled); (3) **continuous predictors are linear in the log-odds**; (4) no severe multicollinearity.

**Odds and log-odds:**
$$\text{odds}(p) = \frac{p}{1-p},\qquad \text{logit}(p) = \log\frac{p}{1-p}$$
From the sigmoid: $p = \frac{e^{\boldsymbol\beta^T\mathbf x}}{1 + e^{\boldsymbol\beta^T\mathbf x}}$, $1 - p = \frac{1}{1 + e^{\boldsymbol\beta^T\mathbf x}}$ ⇒ $\log\frac{p}{1-p} = \boldsymbol\beta^T\mathbf x$.

Holding other features fixed, **+1 unit of $x_j$ adds $\beta_j$ to the log-odds and multiplies the odds by $e^{\beta_j}$** — it does **not** add a fixed amount to the probability.

:::warn Practical checks
Grouped observations, repeated measurements or time-series rows may violate independence; strongly correlated features make coefficients unstable; curvature in the log-odds can motivate transformations or polynomial features.
:::

**Polynomial features → curved boundaries.** $z = \beta_0 + \beta_1x_1 + \beta_2x_2 + \beta_3x_1^2 + \beta_4x_1x_2 + \beta_5x_2^2$ is still **linear in the parameters** but the boundary z = 0 can be a circle/ellipse in the original plane. The task remains **classification** (features → linear score → sigmoid/softmax) — do not call it "polynomial regression first".

**Regularisation controls the flexibility:** $J_{L2} = J_{\text{data}} + \lambda\sum_{j\ge1}\beta_j^2$, $J_{L1} = J_{\text{data}} + \lambda\sum_{j\ge1}|\beta_j|$ (intercept excluded). L2 shrinks smoothly and stabilises correlated/expanded sets; L1 can zero coefficients (sparse). Scale features first. (scikit-learn uses **C = 1/λ**.)

**PRACTICE P5.** (a) $\beta_j = \log 1.5$ → odds × $e^{\log 1.5} = $ **1.5** (+50% odds, not a fixed probability increase). (b) p = 0.8 → odds **4**, log-odds ln 4 ≈ **1.386**. (c) repeated measurements of the same student → **independence**; near-exact linear combinations → **multicollinearity**; curved empirical log-odds → **linearity in log-odds** (transform / polynomial features). (d) After mapping to $(x_1, x_2, x_1^2, x_1x_2, x_2^2)$ the score is linear in the coefficients though the boundary is curved. (e) L2 shrinks and stabilises; L1 sets some exactly to zero (sparse selection).

| Misconception | Correction |
|---|---|
| OvR probabilities must sum to 1 | independent outputs; softmax enforces sum 1 |
| probability must be linear in x | **log-odds** are linear in the predictors |
| softmax automatically makes curved boundaries | linear logits → linear boundaries in the supplied feature space |
| update one weight before computing the next derivative | compute the whole gradient, then update all |

:::take Takeaway
BCE → chain rule → (p̂ − y)x → batch update → OvR or softmax → multiclass cross-entropy → assumptions, feature maps, regularisation.
:::`,
    deriv: [{ id: 'D15-logodds', title: 'The sigmoid makes the log-odds linear', badge: 'class',
      steps: [
        { m: R`p = \frac{1}{1+e^{-z}} = \frac{e^{z}}{1+e^{z}}`, why: 'Multiply top and bottom by $e^z$.' },
        { m: R`1-p = \frac{1}{1+e^{z}}`, t: '' },
        { m: R`\frac{p}{1-p} = e^{z}`, why: 'Divide.' },
        { m: R`\log\frac{p}{1-p} = z = \boldsymbol\beta^T\mathbf x`, t: '' },
        { m: R`x_j \to x_j + 1:\ \ \text{log-odds} + \beta_j,\ \ \text{odds}\times e^{\beta_j}`, why: 'Holding other features fixed.' }
      ], result: R`\operatorname{logit}(p) = \boldsymbol\beta^T\mathbf x,\qquad \text{odds ratio per unit} = e^{\beta_j}` }],
    formulas: [{ name: 'Odds / log-odds', tex: R`\text{odds} = \frac{p}{1-p},\quad \operatorname{logit}(p) = \log\frac{p}{1-p}`, sym: '', when: 'Interpreting coefficients.' }, { name: 'Odds ratio', tex: R`\text{OR}_j = e^{\beta_j}`, sym: 'Per +1 unit of $x_j$.', when: 'P5(a).' }, { name: 'Regularised logistic loss', tex: R`J = \text{BCE} + \lambda\sum_{j\ge1}\beta_j^2\ \ \text{or}\ \ +\lambda\sum_{j\ge1}|\beta_j|`, sym: 'sklearn C = 1/λ.', when: 'Polynomial expansions.' }],
    plots: [
      { id: 'P15-odds', title: 'Odds and log-odds as functions of p', notice: 'Odds explode as p → 1; log-odds are symmetric around 0 at p = 0.5 and span the whole real line — which is why a linear score can model them.',
        spec: { type: 'multi', panels: [{ type: 'xy', w: 300, h: 240, title: 'Odds p/(1 − p)', xlim: [0, 1], ylim: [0, 20], xlabel: 'p', ylabel: 'odds', series: [{ t: 'fn', f: p => p / (1 - p), d: [0, 0.96], c: 's1', w: 2.5 }, { t: 'scatter', pts: [[0.8, 4]], c: 's4', labels: ['p = 0.8 → 4'] }] }, { type: 'xy', w: 300, h: 240, title: 'Log-odds log[p/(1 − p)]', xlim: [0, 1], ylim: [-4.5, 4.5], xlabel: 'p', ylabel: 'log-odds', series: [{ t: 'fn', f: p => Math.log(p / (1 - p)), d: [0.01, 0.99], c: 's3', w: 2.5 }, { t: 'scatter', pts: [[0.8, Math.log(4)]], c: 's4', labels: ['1.386'] }] }] } },
      { id: 'P15-polyboundary', title: 'Polynomial features give a curved (elliptical) boundary', notice: 'Class 1 inside, class 0 on a ring. With x₁², x₂² features the boundary z = 0 is an ellipse; with only x₁, x₂ no straight line separates them.',
        spec: { type: 'xy', w: 440, h: 360, xlim: [-3.2, 3.2], ylim: [-5, 5], xlabel: 'x₁', ylabel: 'x₂', legend: 'tr', series: [{ t: 'scatter', pts: core, c: 's3', label: 'class 1' }, { t: 'scatter', pts: ring, c: 's4', m: 's', label: 'class 0' }, { t: 'ellipse', cx: 0, cy: 0, rx: 1.7, ry: 2.7, c: 'fg', w: 2.5, label: 'polynomial boundary' }] } }
    ],
    examples: [{ title: 'Interpreting a coefficient (worked)', body: R`β_hours = 0.7 in a pass/fail model. Each extra study hour multiplies the odds of passing by e^0.7 ≈ 2.01 (about double). From p = 0.5 (odds 1) → odds 2.01 → p = 0.668. From p = 0.9 (odds 9) → odds 18.1 → p = 0.948. Same coefficient, different probability changes.` }],
    code: [{ title: 'Odds ratios, C = 1/λ, quadratic features, L1 sparsity', lib: 'L15_logistic_gd_sklearn.py' }],
    traps: ['A coefficient changes **log-odds** linearly, not probability.', 'Polynomial-feature logistic regression is still classification.', 'Exclude the intercept from the penalty; scale features first.', 'sklearn `C` is the **inverse** of λ (small C = strong regularisation).'],
    questions: [
      { type: 'int', diff: 'E', q: 'p = 0.8. Odds?', answer: 4, tol: 0.0001, round: 'Exact', verify: '0.8/0.2', sol: '0.8/0.2 = **4**.' },
      { type: 'int', diff: 'E', q: 'p = 0.8. Log-odds (3 decimals)?', answer: 1.386, tol: 0.001, round: '3 decimals', verify: '__import__("math").log(4)', sol: 'ln 4 ≈ **1.386**.' },
      { type: 'int', diff: 'M', q: 'βⱼ = ln 1.5. By what factor do the odds change when xⱼ rises by 1?', answer: 1.5, tol: 0.0001, round: '1 decimal', verify: '__import__("math").exp(__import__("math").log(1.5))', sol: 'e^{ln 1.5} = **1.5** (+50% odds).' },
      { type: 'int', diff: 'H', q: 'Current p = 0.5 and βⱼ = 0.7. After xⱼ rises by 1, new p (3 decimals)?', answer: 0.668, tol: 0.001, round: '3 decimals', verify: '1/(1+__import__("math").exp(-0.7))', sol: 'Log-odds 0 → 0.7; p = σ(0.7) = **0.668**.' },
      { type: 'mcq', diff: 'M', q: 'In logistic regression, which quantity is linear in the predictors?', options: ['the probability p', 'the log-odds log(p/(1−p))', 'the odds', 'the BCE'], answer: 1, sol: 'Misconception table.', why: ['No.', 'Correct.', 'Odds are exponential in x.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Repeated measurements from the same student threaten which assumption?', options: ['linearity in log-odds', 'independence of observations', 'multicollinearity', 'binary target'], answer: 1, sol: 'P5(c)(i).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'A quadratic decision boundary from a model linear in its parameters is possible because:', options: ['softmax curves boundaries automatically', 'after mapping to (x₁, x₂, x₁², x₁x₂, x₂²) the score is still linear in the coefficients', 'the sigmoid is non-linear', 'it is impossible'], answer: 1, sol: 'P5(d).', why: ['Misconception.', 'Correct.', 'The boundary z = 0 does not depend on σ.', 'It is possible.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import math
beta = 0.7
for p in [0.5, 0.9]:
    odds = p / (1 - p) * math.exp(beta)
    print(round(odds / (1 + odds), 3))`, answer: '0.668\n0.948', sol: 'Same odds ratio e^0.7 ≈ 2.01, different probability changes: 0.5 → 0.668, 0.9 → 0.948.' }
    ],
    source: 'Worksheet L15 pp.10–13; ISLR §4.3.'
  }
  ]
});
})();
