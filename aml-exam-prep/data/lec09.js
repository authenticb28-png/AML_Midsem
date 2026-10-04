/* Lecture 9 — Bias, variance and the bias–variance tradeoff */
(function () {
const rnd = NUM.rng(99), G = () => NUM.gauss(rnd);
// population: y = x^2 + noise on [-15, 10]
const POP = []; for (let i = 0; i < 100; i++) { const x = -15 + 25 * rnd(); POP.push([x, x * x + G() * 15]); }
const sample = k => { const r = NUM.rng(200 + k), s = []; for (let i = 0; i < 14; i++) s.push(POP[Math.floor(r() * POP.length)]); return s; };
const S = [sample(1), sample(2), sample(3)];
const fitS = (pts, d) => { const p = NUM.polyfit(pts.map(q => q[0] / 15), pts.map(q => q[1]), d, 1e-7); return x => p(x / 15); };
const C = ['s1', 's2', 's5'];
const tf = { t: 'fn', f: x => x * x, c: 'fg', w: 2.5, dash: true, label: 'true f(x) = x²' };
const caseSeries = d => [tf, ...S.flatMap((s, k) => [{ t: 'scatter', pts: s, c: C[k], r: 3, op: 0.6 }, { t: 'fn', f: fitS(s, d), c: C[k], w: 2, label: 'model from train set ' + (k + 1) }])];
const noise = []; for (let t = 0; t < 120; t++) noise.push([t, G()]);
LECTURES.push({
  num: 9, short: 'Bias–Variance', title: 'Bias, Variance and the Bias–Variance Tradeoff — estimators, MSE decomposition, practical diagnosis',
  file: 'AML_Lecture 9_Worksheet_Filled.pdf', pages: 15,
  intro: R`**Exam weight: high (mostly MCQ + small numericals).** Know $Y = f(X) + \varepsilon$ with $E(\varepsilon) = 0$, $\text{Var}(\varepsilon) = E(\varepsilon^2) = \sigma^2$; why $\hat f(x)$ is a random variable; **Bias** $= E[\hat f(x)] - f(x)$; **Variance** $= E[(\hat f - E\hat f)^2]$; **MSE = Bias² + Variance + σ²**; the dartboards; and diagnosis from train/validation scores, CV and learning curves. About 70 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L09.1 */
  {
    id: 'L09.1', title: 'Y = f(X) + ε and white noise', badge: 'class', pages: '1–2', ws: 'Section 1',
    concept: R`
A student's stipend depends on CGPA ($X_1$), IQ ($X_2$) and number of projects ($X_3$). A **true hidden function** decides it, but the observed value still differs from the true pattern because of randomness:
$$Y = f(X) + \varepsilon$$
- $f(X)$ = actual hidden relationship (**true function**); $Y$ = observed output (target); $\varepsilon$ = **random noise / irreducible error**.
- In words: **observed output = true pattern + random noise**.

**Properties of white noise:** mean zero, $E(\varepsilon) = 0$; variance $\text{Var}(\varepsilon) = \sigma^2 = E(\varepsilon^2) - [E(\varepsilon)]^2 = E(\varepsilon^2)$ (because the mean is 0). σ is the standard deviation of the noise.

White noise looks like random fluctuations around zero with no pattern: knowing one value tells you nothing about the next.`,
    formulas: [
      { name: 'Data-generating model', tex: R`Y = f(X) + \varepsilon`, sym: 'f true function, ε noise.', when: 'Every bias–variance question.' },
      { name: 'Noise moments', tex: R`E(\varepsilon) = 0,\qquad \operatorname{Var}(\varepsilon) = \sigma^2 = E(\varepsilon^2)`, sym: 'Because Var = E(ε²) − [E(ε)]² and E(ε) = 0.', when: 'Simplifying expectations.' }
    ],
    plots: [{ id: 'P09-whitenoise', title: 'White noise: random fluctuations with zero mean', notice: 'No trend, no pattern, centred on 0. This part of Y can never be predicted from X.',
      spec: { type: 'xy', w: 560, h: 220, xlim: [0, 120], ylim: [-3.5, 3.5], xlabel: 'observation', ylabel: 'ε', series: [{ t: 'line', pts: noise, c: 's7', w: 1.2 }, { t: 'hline', y: 0, c: 's4', dash: true }] } }],
    examples: [{ title: 'Variance from E(ε²) (worked)', body: R`Noise values over a long run take −2, 0, +2 with equal probability. $E(\varepsilon) = 0$; $E(\varepsilon^2) = (4 + 0 + 4)/3 = 8/3$; so $\sigma^2 = 8/3 - 0^2 = 2.67$.` }],
    traps: ['ε is **irreducible**: no model, however complex, removes it.', 'Var(ε) = E(ε²) only because E(ε) = 0.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'In Y = f(X) + ε, the term ε represents:', options: ['the model\'s prediction', 'random noise / irreducible error', 'the true function', 'the bias'], answer: 1, sol: 'Section 1.', why: ['That is f̂.', 'Correct.', 'That is f.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'White noise has mean:', options: ['1', '0', 'σ', 'undefined'], answer: 1, sol: 'E(ε) = 0.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: R`Why is $\text{Var}(\varepsilon) = E(\varepsilon^2)$?`, options: ['Always true for any variable', R`Because $E(\varepsilon) = 0$, so $[E(\varepsilon)]^2 = 0$`, 'Because ε is positive', 'Because σ = 1'], answer: 1, sol: 'Var = E(ε²) − [E(ε)]².', why: ['Only for mean-zero variables.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'M', q: 'Noise takes −3, 0, +3 with equal probability. Var(ε)?', answer: 6, tol: 0.001, round: 'Exact', verify: '(9+0+9)/3', sol: 'E(ε) = 0; E(ε²) = 18/3 = **6**.' },
      { type: 'mcq', diff: 'E', q: '"Observed output = …"', options: ['true pattern + random noise', 'prediction + bias', 'variance + bias', 'model + residual'], answer: 0, sol: 'In words, Section 1.', why: ['Correct.', 'No.', 'No.', 'That describes a fit, not the data-generating process.'] }
    ],
    source: 'Worksheet L9 pp.1–2; ISLR §2.1.1.'
  },
  /* ---------------------------------------------------------------- L09.2 */
  {
    id: 'L09.2', title: 'The estimator is a random variable', badge: 'class', pages: '2–3', ws: 'Section 2',
    concept: R`
The true $f(X)$ exists for the whole **population**; we do not know it. We estimate it from a **sample** (training dataset) drawn from that population, building a model $\hat f(x)$ — an **estimator** of the true function.

Examples of estimators: the sample mean (estimates the population mean); linear regression (estimates the relationship); a decision tree (estimates the input→output mapping).

:::key Key insight
Sample dataset 1 → model 1; sample 2 → a slightly different model 2; sample 3 → model 3. **If the training sample changes, the estimator changes.** So for a **fixed input x, $\hat f(x)$ is a random variable.**
:::

Similarly $Y$ is a random variable even for the same x, because of the noise ε.`,
    formulas: [{ name: 'Estimator', tex: R`\hat f_D(x) \text{ depends on the training set } D \Rightarrow \hat f(x) \text{ is random}`, sym: 'Randomness comes from which sample D was drawn.', when: 'Defining bias and variance.' }],
    plots: [{ id: 'P09-population', title: 'Population (grey) and three random samples drawn from it', notice: 'Each coloured sample would train a slightly different model. That spread is what "variance" measures.',
      spec: { type: 'xy', w: 560, h: 300, xlim: [-16, 11], ylim: [-40, 270], xlabel: 'x', ylabel: 'y', legend: 'tr', series: [{ t: 'scatter', pts: POP, c: 's7', r: 2.5, op: 0.5, label: 'population (100 points)' }, ...S.map((s, k) => ({ t: 'scatter', pts: s, c: C[k], r: 4, label: 'sample ' + (k + 1) }))] } }],
    examples: [{ title: 'Sample mean is random (worked)', body: R`Population {2, 4, 6, 8}. Samples of size 2 (without replacement) give means 3, 4, 5, 5, 6, 7 — the estimator "sample mean" takes different values for different samples; its average over all samples is 5 = the population mean (unbiased).` }],
    traps: ['The randomness of f̂ comes from the **training sample**, not from the input x.', 'An estimator is a rule; an estimate is the number it produces on one sample.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Why is f̂(x) a random variable at a fixed x?', options: ['x is random', 'Different training samples produce different models', 'The true function changes', 'Floating-point error'], answer: 1, sol: 'Key insight Section 2.', why: ['x is fixed.', 'Correct.', 'f is fixed.', 'No.'] },
      { type: 'msq', diff: 'E', q: 'Which are estimators? (select all)', options: ['Sample mean', 'Linear regression', 'Decision tree', 'The true population function'], answer: [0, 1, 2], sol: 'Worksheet list.', why: ['Yes.', 'Yes.', 'Yes.', 'That is what is being estimated.'] },
      { type: 'int', diff: 'M', q: 'Population {2, 4, 6, 8}; all 6 samples of size 2 without replacement. Average of the 6 sample means?', answer: 5, tol: 0.001, round: 'Exact', verify: '(3+4+5+5+6+7)/6', sol: 'Means 3, 4, 5, 5, 6, 7 → average **5** = population mean.' },
      { type: 'mcq', diff: 'M', q: 'Y is also a random variable for the same x because:', options: ['of the noise ε', 'f is random', 'x is random', 'it is not'], answer: 0, sol: 'Y = f(x) + ε.', why: ['Correct.', 'No.', 'Fixed x.', 'It is.'] },
      { type: 'mcq', diff: 'M', q: 'A Kaggle CSV is best thought of as:', options: ['the entire population', 'one sample from a larger unknown population', 'the true function', 'noise only'], answer: 1, sol: 'Section 8 Q2.', why: ['No.', 'Correct.', 'No.', 'No.'] }
    ],
    source: 'Worksheet L9 pp.2–3; Wasserman, *All of Statistics* §6.'
  },
  /* ---------------------------------------------------------------- L09.3 */
  {
    id: 'L09.3', title: 'God\'s-eye view: underfit vs overfit', badge: 'class', pages: '3–5', ws: 'Section 3, P1',
    concept: R`
Pretend you are "God" and know the truth: $f(x) = x^2$, $x \in [-15, 10]$. Add noise to get 100 population points. Draw three random samples and give each to a different person.

**Case 1 — everyone fits a straight line.** The three lines are **very close to each other (low variance)** but none captures the parabola (**high bias**). They cannot even fit their own training data → **underfitted**.

**Case 2 — everyone uses a high-degree polynomial.** Each curve passes close to its own training points (**low bias**) but the three curves are **wildly different** (**high variance**) → **overfitted**.

**PRACTICE P1 (answered)**

| Model | Bias | Variance | Behaviour |
|---|---|---|---|
| Too simple (line for x²) | high | low | underfits |
| Too complex (degree 20) | low | high | overfits |
| Appropriately complex | low | low | good fit |

(b) "If the training data change, an underfitting model's predictions change drastically" → **False** (low variance: predictions stay stable). (c) "High bias always means high variance" → **False** (they generally move in opposite directions).`,
    formulas: [{ name: 'Truth used in the demo', tex: R`f(x) = x^2,\ x\in[-15, 10]`, sym: '', when: 'Section 3 plots.' }],
    plots: [
      { id: 'P09-truef', title: 'True function f(x) = x²', notice: 'Known only in the god\'s-eye thought experiment.', spec: { type: 'xy', w: 460, h: 240, xlim: [-16, 11], ylim: [-10, 240], xlabel: 'x', ylabel: 'f(x)', series: [{ t: 'fn', f: x => x * x, c: 'fg', w: 2.5 }] } },
      { id: 'P09-case1', title: 'Case 1: straight lines — low variance, high bias', notice: 'Three samples give three similar lines — far closer to each other than the Case 2 curves — and all are badly wrong at the ends and in the middle.', spec: { type: 'xy', w: 560, h: 320, xlim: [-16, 11], ylim: [-40, 270], xlabel: 'x', ylabel: 'y', legend: 'tr', series: caseSeries(1) } },
      { id: 'P09-case2', title: 'Case 2: high-degree polynomials (degree 9) — low bias, high variance', notice: 'Each curve chases its own points; between and beyond the samples the three curves disagree wildly.', spec: { type: 'xy', w: 560, h: 320, xlim: [-16, 11], ylim: [-40, 270], xlabel: 'x', ylabel: 'y', legend: 'tr', series: caseSeries(9) } }
    ],
    examples: [{ title: 'Simulation numbers (worked, from the code)', body: R`Fitting 200 random training sets from y = x² + noise (σ² = 225) and predicting at test points:
| degree | bias² | variance | σ² | sum | measured MSE |
|---|---|---|---|---|---|
| 1 | 1314.8 | 215.5 | 225 | 1755.3 | 1754.3 |
| 2 | 0.0 | 19.7 | 225 | 244.7 | 245.2 |
| 8 | 2.6 | 558.2 | 225 | 785.8 | 792.6 |
Degree 1: bias dominates. Degree 8: variance dominates. Degree 2 (the true form) wins.` }],
    code: [{ title: 'Bias–variance simulation (many training sets)', scratch: 'L09_bias_variance_sim_scratch.py' }],
    traps: ['High bias ↔ underfitting; high variance ↔ overfitting.', 'An underfit model is **stable** (low variance) — it is consistently wrong.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Three straight lines fitted to three samples of a parabola are nearly identical but miss the curve. They have:', options: ['low bias, high variance', 'high bias, low variance', 'low bias, low variance', 'high bias, high variance'], answer: 1, sol: 'Case 1.', why: ['Opposite.', 'Correct.', 'They miss the curve.', 'They agree with each other.'] },
      { type: 'mcq', diff: 'E', q: 'An overfitted model typically has:', options: ['high bias, low variance', 'low bias, high variance', 'zero variance', 'high irreducible error'], answer: 1, sol: 'Case 2 / P1.', why: ['Underfit.', 'Correct.', 'No.', 'Noise is the same for all models.'] },
      { type: 'mcq', diff: 'M', q: '"If the training data change, an underfitting model\'s predictions change drastically."', options: ['True', 'False — underfit models have low variance'], answer: 1, sol: 'P1(b).', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: '"A model with high bias always has high variance."', options: ['True', 'False'], answer: 1, sol: 'P1(c): generally inversely related.', why: ['No.', 'Correct.'] },
      { type: 'int', diff: 'M', q: 'Simulation: degree 8 has bias² = 2.6, variance = 558.2, σ² = 225. Expected test MSE (1 decimal)?', answer: 785.8, tol: 0.05, round: '1 decimal', verify: '2.6+558.2+225', sol: '2.6 + 558.2 + 225 = **785.8**.' }
    ],
    source: 'Worksheet L9 pp.3–5; Géron §4.4 (learning curves / bias–variance).'
  },
  /* ---------------------------------------------------------------- L09.4 */
  {
    id: 'L09.4', title: 'The bias–variance tradeoff', badge: 'class', pages: '6', ws: 'Section 4',
    concept: R`
When you **decrease bias** (make the model more complex), **variance starts increasing** — and vice versa. This is the **bias–variance tradeoff**: Bias ↑ ⇔ Variance ↓.

Both are forms of error. Plotted against **model complexity**:
- **Bias²** falls as complexity grows;
- **Variance** rises as complexity grows;
- **Total error** = Bias² + Variance + σ² is **U-shaped**: left side = underfitting, right side = overfitting, bottom = **optimal complexity**.

We aim for the complexity where total error is minimum. (The noise floor σ² is the same for every model.)`,
    formulas: [{ name: 'Total expected error', tex: R`\text{Error}(c) = \text{Bias}^2(c) + \text{Var}(c) + \sigma^2`, sym: 'c = model complexity.', when: 'U-curve questions.' }],
    plots: [{ id: 'P09-ucurve', title: 'Bias², variance and total error vs model complexity', notice: 'Total error is minimised where the falling bias² and rising variance balance — not at the simplest or the most complex model.',
      spec: { type: 'xy', w: 560, h: 320, xlim: [0, 10], ylim: [0, 12], xlabel: 'model complexity', ylabel: 'error', legend: 'tr', xticks: false,
        series: [{ t: 'fn', f: c => 9 * Math.exp(-0.55 * c), c: 's1', label: 'Bias²' }, { t: 'fn', f: c => 0.06 * c * c, c: 's4', label: 'Variance' }, { t: 'hline', y: 1, c: 's7', dash: true, label: 'σ² (irreducible)' }, { t: 'fn', f: c => 9 * Math.exp(-0.55 * c) + 0.06 * c * c + 1, c: 'fg', w: 3, label: 'Total error' },
          { t: 'vline', x: 3.9, c: 's3', dash: true }, { t: 'text', x: 3.9, y: 11.2, s: 'optimal' }, { t: 'text', x: 1.3, y: 11.2, s: 'underfitting' }, { t: 'text', x: 8.2, y: 6.8, s: 'overfitting' }] } }],
    examples: [{ title: 'Where is the optimum? (worked)', body: R`Suppose Bias²(c) = 16/c and Var(c) = c (c > 0), σ² = 1. Total = 16/c + c + 1. Derivative −16/c² + 1 = 0 → c = 4, total = 4 + 4 + 1 = **9**. At c = 1: 18; at c = 10: 12.6.` }],
    traps: ['The optimum is **not** where bias = 0 or variance = 0.', 'σ² shifts the whole curve up but does not move the optimum.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'As model complexity increases, bias typically ___ and variance ___.', options: ['increases, decreases', 'decreases, increases', 'increases, increases', 'stays, stays'], answer: 1, sol: 'Tradeoff.', why: ['Reversed.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'The total-error curve vs complexity is:', options: ['always decreasing', 'U-shaped', 'always increasing', 'flat'], answer: 1, sol: 'Section 4 graph.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'H', q: 'Bias²(c) = 16/c, Var(c) = c, σ² = 1. Minimum total error?', answer: 9, tol: 0.001, round: 'Exact', verify: '16/4+4+1', sol: 'c = 4 → 4 + 4 + 1 = **9**.' },
      { type: 'mcq', diff: 'M', q: 'The left side of the U-curve corresponds to:', options: ['overfitting', 'underfitting', 'irreducible error only', 'the optimum'], answer: 1, sol: 'Low complexity = high bias.', why: ['Right side.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Changing model complexity changes which term(s)?', options: ['Only σ²', 'Bias² and variance, not σ²', 'All three', 'None'], answer: 1, sol: 'σ² is irreducible.', why: ['No.', 'Correct.', 'σ² is fixed.', 'No.'] }
    ],
    source: 'Worksheet L9 p.6; ESL §7.3.'
  },
  /* ---------------------------------------------------------------- L09.5 */
  {
    id: 'L09.5', title: 'Bias, variance and the MSE decomposition', badge: ['class', 'res'], pages: '6–7', ws: 'Sections 5–6, P2(a,b,e) + researched proof',
    concept: R`
**Bias** — how far the **average** prediction (over many training sets) is from the truth:
$$\text{Bias}(\hat f(x)) = E[\hat f(x)] - f(x)$$
**Unbiased** predictor: bias = 0, i.e. $E[\hat f(x)] = f(x)$ for all x. *Example:* 5 models with slopes $m_1, \dots, m_5$; if their average slope equals the true slope γ, the slope estimator is unbiased.

**Variance** — how much predictions spread across training sets:
$$\text{Var}(\hat f(x)) = E\big[(\hat f(x) - E[\hat f(x)])^2\big]$$
(train on many datasets, observe the spread of predictions at x).

**MSE at a point** $\text{MSE}(x) = E[(Y - \hat f(x))^2]$ (expected prediction error) decomposes as
$$\text{MSE} = \underbrace{\text{Bias}^2 + \text{Variance}}_{\text{reducible}} + \underbrace{\text{Var}(\varepsilon) = \sigma^2}_{\text{irreducible}}$$

The worksheet states this without proof ("beyond scope"); the full derivation is below as a researched extra.

**PRACTICE P2.** (a) $E[\hat f(x)] = 12$, $f(x) = 10$ → bias = **2**. (b) bias 2, variance 3, σ² = 1 → MSE = 4 + 3 + 1 = **8**. (e) Bias² = 1, variance = 9, σ² = 2 → total = **12**; **variance dominates**.`,
    deriv: [{ id: 'D09-decomp', title: 'Proof: E[(Y − f̂)²] = Bias² + Var + σ²', badge: 'res',
      intro: 'Fix x; write $f = f(x)$, $\\hat f = \\hat f(x)$, $\\bar f = E[\\hat f]$. Assume the noise ε of the new point is independent of the training set (hence of $\\hat f$).',
      steps: [
        { m: R`E[(Y-\hat f)^2] = E[(f + \varepsilon - \hat f)^2]`, why: 'Substitute Y = f + ε.' },
        { m: R`= E[(f-\hat f)^2] + 2E[\varepsilon(f-\hat f)] + E[\varepsilon^2]`, why: 'Expand the square.' },
        { m: R`2E[\varepsilon(f-\hat f)] = 2E[\varepsilon]\,E[f-\hat f] = 0`, why: 'Independence, and E[ε] = 0.' },
        { m: R`E[\varepsilon^2] = \sigma^2`, why: 'Noise variance.' },
        { m: R`E[(f-\hat f)^2] = E[(f-\bar f + \bar f-\hat f)^2]`, why: 'Add and subtract the average prediction.' },
        { m: R`= (f-\bar f)^2 + 2(f-\bar f)E[\bar f-\hat f] + E[(\bar f-\hat f)^2]`, why: '$f - \\bar f$ is a constant.' },
        { m: R`E[\bar f-\hat f] = \bar f - E[\hat f] = 0`, why: 'Cross term vanishes.' },
        { m: R`E[(f-\hat f)^2] = \underbrace{(\bar f - f)^2}_{\text{Bias}^2} + \underbrace{E[(\hat f-\bar f)^2]}_{\text{Variance}}`, t: 'Collect.' }
      ],
      result: R`E[(Y-\hat f(x))^2] = \text{Bias}^2(\hat f(x)) + \operatorname{Var}(\hat f(x)) + \sigma^2` }],
    formulas: [
      { name: 'Bias', tex: R`\text{Bias}(\hat f(x)) = E[\hat f(x)] - f(x)`, sym: 'Expectation over training sets.', when: 'P2(a).' },
      { name: 'Variance', tex: R`\operatorname{Var}(\hat f(x)) = E[(\hat f(x) - E\hat f(x))^2]`, sym: '', when: 'Spread across training sets.' },
      { name: 'Decomposition', tex: R`\text{MSE} = \text{Bias}^2 + \text{Var} + \sigma^2`, sym: 'Bias **squared**.', when: 'P2(b,e).' }
    ],
    plots: [{ id: 'P09-slopes', title: 'Five fitted slopes around the true slope γ', notice: 'Individual slopes m₁…m₅ differ (variance), but if their average equals γ the slope estimator is unbiased.',
      spec: { type: 'xy', w: 480, h: 280, xlim: [0, 10], ylim: [0, 22], xlabel: 'x', ylabel: 'y', legend: 'tl', series: [{ t: 'fn', f: x => 2 * x, c: 'fg', w: 3, label: 'true slope γ = 2' }, ...[1.6, 1.8, 2.0, 2.2, 2.4].map((m, i) => ({ t: 'fn', f: x => m * x, c: ['s1', 's2', 's3', 's5', 's6'][i], dash: true, w: 1.5, label: 'm' + (i + 1) + ' = ' + m }))] } }],
    examples: [{ title: 'Bias and variance from 4 training sets (worked)', body: R`At x₀ the truth is f = 10. Four models predict 11, 13, 12, 12.
- $E[\hat f] = 48/4 = 12$ → bias = 2, bias² = 4.
- Variance = $[(−1)^2 + 1^2 + 0 + 0]/4 = 0.5$.
- With σ² = 1: expected MSE = 4 + 0.5 + 1 = **5.5**.` }],
    code: [{ title: 'Measured bias², variance and MSE from simulation', scratch: 'L09_bias_variance_sim_scratch.py' }],
    traps: ['MSE = **Bias²** + Var + σ² (not Bias).', 'Expectations are over **training sets** (and noise), not over x.', 'Irreducible error cannot be reduced by any model.'],
    questions: [
      { type: 'int', diff: 'E', q: 'E[f̂(x)] = 12, f(x) = 10. Bias?', answer: 2, tol: 0, round: 'Exact', verify: '12-10', sol: '**2** (P2(a)).' },
      { type: 'int', diff: 'E', q: 'Bias = 2, variance = 3, σ² = 1. MSE?', answer: 8, tol: 0, round: 'Exact', verify: '2**2+3+1', sol: '4 + 3 + 1 = **8** (P2(b)).' },
      { type: 'int', diff: 'M', q: 'Four models predict 11, 13, 12, 12 at a point where f = 10; σ² = 1. Expected MSE?', answer: 5.5, tol: 0.001, round: '1 decimal', verify: '(12-10)**2+((1+1+0+0)/4)+1', sol: 'bias² 4 + variance 0.5 + 1 = **5.5**.' },
      { type: 'mcq', diff: 'E', q: 'Which part of the MSE is irreducible?', options: ['Bias²', 'Variance', 'Var(ε) = σ²', 'All of it'], answer: 2, sol: 'Noise.', why: ['Reducible.', 'Reducible.', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Bias² = 1, Variance = 9, σ² = 2. Which component dominates?', options: ['Bias²', 'Variance', 'σ²', 'Equal'], answer: 1, sol: 'P2(e): total 12, variance 9.', why: ['1.', 'Correct.', '2.', 'No.'] },
      { type: 'mcq', diff: 'M', q: '"MSE = Bias + Variance + Irreducible error" is:', options: ['True', 'False — it is Bias squared'], answer: 1, sol: 'P4(b).', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'H', tag: 'GATE-style', q: 'In the proof, why does the cross term 2E[ε(f − f̂)] vanish?', options: ['f̂ = f', 'ε is independent of f̂ and E[ε] = 0', 'σ² = 0', 'f is random'], answer: 1, sol: 'Independence + zero mean.', why: ['No.', 'Correct.', 'No.', 'No.'] }
    ],
    researched: R`The full proof is not in the worksheet (marked "beyond scope"). Source: Hastie, Tibshirani & Friedman, *The Elements of Statistical Learning* §7.3; Geman, Bienenstock & Doursat (1992).`,
    source: 'Worksheet L9 pp.6–7; ESL §7.3.'
  },
  /* ---------------------------------------------------------------- L09.6 */
  {
    id: 'L09.6', title: 'Dartboard illustration', badge: 'class', pages: '8', ws: 'Section 7, P2(c,d)',
    concept: R`
Throw darts many times. Each throw = training a model on a different sample and making a prediction.
- **Bull's-eye** = the true value. **Rings** = increasing error. **Dots** = predictions from different training sets.

| Pattern | Meaning |
|---|---|
| tight cluster **on** the bull's-eye | low bias, low variance (ideal) |
| wide spread **around** the bull's-eye | low bias, high variance |
| tight cluster **away** from the bull's-eye | high bias, low variance |
| wide spread **away** from the bull's-eye | high bias, high variance |

*Bias = how far the centre of the cluster is from the bull's-eye. Variance = how spread the cluster is.*

**PRACTICE P2.** (c) 1 tight on bull's-eye → **B (low/low)**; 2 tight far away → **C (high bias, low var)**; 3 spread around bull's-eye → **D (low bias, high var)**; 4 spread far away → **A (high/high)**. (d) "Irreducible error can be reduced by a more complex model" → **False** — it is inherent noise.`,
    formulas: [{ name: 'Reading a dartboard', tex: R`\text{bias} = \lVert\text{cluster centre} - \text{bull's-eye}\rVert,\quad \text{variance} = \text{cluster spread}`, sym: '', when: 'Dartboard MCQs.' }],
    plots: [{ id: 'P09-dartboard', title: 'The four bias–variance combinations', notice: 'Centre offset = bias; scatter = variance.', spec: { type: 'svg', svg: () => PL.dartboards() } }],
    examples: [{ title: 'Classify the archer (worked)', body: R`Darts land at (3, 3), (3.2, 2.9), (2.9, 3.1) with the bull's-eye at (0, 0): tight cluster (low variance) far from the centre (high bias) — systematically wrong, like a straight line fitted to a parabola.` }],
    traps: ['Spread ≠ bias. A wide spread centred on the bull\'s-eye is **low bias**.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Dots tightly clustered far from the bull\'s-eye:', options: ['low bias, low variance', 'high bias, low variance', 'low bias, high variance', 'high bias, high variance'], answer: 1, sol: 'P2(c) 2 → C.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Dots spread widely around the bull\'s-eye:', options: ['low bias, high variance', 'high bias, low variance', 'low bias, low variance', 'high bias, high variance'], answer: 0, sol: 'P2(c) 3 → D.', why: ['Correct.', 'No.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Can irreducible error be reduced with a more complex model?', options: ['Yes', 'No — it is inherent noise'], answer: 1, sol: 'P2(d).', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'An overfitted model on the dartboard looks like:', options: ['tight on the bull\'s-eye', 'spread around the bull\'s-eye', 'tight far away', 'no darts'], answer: 1, sol: 'Low bias, high variance.', why: ['Ideal.', 'Correct.', 'Underfit.', 'No.'] },
      { type: 'int', diff: 'M', q: 'Bull\'s-eye at 0 (1-D). Predictions 3, 3, 3, 3. Bias² + variance?', answer: 9, tol: 0, round: 'Exact', verify: '3**2+0', sol: 'Bias 3 → 9; variance 0 → **9**: pure bias.' }
    ],
    source: 'Worksheet L9 p.8; Domingos, "A unified bias-variance decomposition" (2000).'
  },
  /* ---------------------------------------------------------------- L09.7 */
  {
    id: 'L09.7', title: 'Real world: diagnosis from train/validation and why we split', badge: 'class', pages: '9–10', ws: 'Sections 8–10, P3(a,b)',
    concept: R`
**Mathematical world vs real world.** Q1: do we know the true $f(x)$? **No** — if we did, we would not need ML. Q2: is a downloaded dataset the whole population? **No** — it is one sample.

Unknown population → **one** sample dataset → train **one** model.

:::key Key insight
True bias and variance **cannot be calculated** in practice: they need the true f and models trained on many datasets. They are **theoretical** quantities — but they explain why models err, why over/underfitting happens, and why more complexity is not always better.
:::

**Diagnose like a doctor (symptoms, not direct measurement):**
- **High bias (underfitting):** train 70%, validation 68% → **both low**; the model cannot even learn the training data → too simple.
- **High variance (overfitting):** train 99%, validation 82% → great on training, much worse on unseen data → memorised.

**Why split?** We cannot collect many datasets, so we simulate it: training set learns the model; validation set checks generalisation; test set is the final check. Good only on train → suspect **high variance**; poor on both → suspect **high bias**.

**PRACTICE P3(a):** (i) 98/97 → **good fit**; (ii) 65/63 → **high bias**; (iii) 99/72 → **high variance**; (iv) 55/54 → **high bias**. (b) Unlimited-depth tree, validation RMSE 3× training RMSE → **high variance (overfitting)**; fixes: **limit depth (prune)** and **add training data** (also: regularise, fewer features).

**P4(c) find the mistake:** "99% train, 98% validation → high variance because training accuracy is high" — wrong: variance shows as a **large gap**; a 1-point gap means a good fit.`,
    formulas: [{ name: 'Practical diagnosis', tex: R`\text{gap} = \text{train score} - \text{val score}`, sym: 'Large gap → high variance; both low → high bias.', when: 'P3(a)-type tables.' }],
    examples: [{ title: 'Fixes by diagnosis (worked)', body: R`| Diagnosis | Helps | Does not help |
|---|---|---|
| High bias | more complex model, more/better features, less regularisation | more data of the same kind |
| High variance | more data, simpler model, regularisation (L12), feature selection (L10), pruning | more complexity |` }],
    traps: ['High training accuracy alone does not mean overfitting; look at the **gap**.', 'More data does **not** fix high bias (P4(b)).'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Train 65%, validation 63%. Diagnosis?', options: ['Good fit', 'High bias', 'High variance', 'Leakage'], answer: 1, sol: 'P3(a)(ii).', why: ['Both low.', 'Correct.', 'Small gap.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Train 99%, validation 72%. Diagnosis?', options: ['Good fit', 'High bias', 'High variance', 'Underfit'], answer: 2, sol: 'P3(a)(iii).', why: ['No.', 'No.', 'Correct.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'A tree with no depth limit has validation RMSE 3× its training RMSE. Valid fixes (select all):', options: ['Limit depth / prune', 'Add more training data', 'Increase depth further', 'Regularise'], answer: [0, 1, 3], sol: 'P3(b).', why: ['Correct.', 'Correct.', 'Worse.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: '"99% train and 98% validation → high variance because training accuracy is high." The mistake is:', options: ['None', 'Variance shows as a large gap; this small gap means a good fit', '98% is too low', 'Should use RMSE'], answer: 1, sol: 'P4(c).', why: ['There is one.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why can\'t we compute true bias and variance in practice?', options: ['Computers are too slow', 'We do not know f and have only one sample dataset', 'Variance is always zero', 'Bias is undefined'], answer: 1, sol: 'Section 8.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'E', q: 'Train accuracy 99%, validation 82%. Gap in percentage points?', answer: 17, tol: 0, round: 'Exact', verify: '99-82', sol: '**17** points → high variance (Section 9.2).' }
    ],
    source: 'Worksheet L9 pp.9–10.'
  },
  /* ---------------------------------------------------------------- L09.8 */
  {
    id: 'L09.8', title: 'Cross-validation and learning curves', badge: ['class', 'res'], pages: '10–15', ws: 'Sections 11–13, P3(c,d), P4 + researched k-fold detail',
    concept: R`
**Cross-validation.** One split's result can depend heavily on that particular split. Instead, train several times on different train/validation splits and see how stable performance is. **Large changes across folds → the model is sensitive to the training data → higher variance.**

**k-fold CV (researched detail).** Split the data into k equal folds. For i = 1..k: train on the other k − 1 folds, validate on fold i. Report the **mean** (and std) of the k scores. Every point is used for validation exactly once and for training k − 1 times. Typical k = 5 or 10; k = n is leave-one-out. Use it for model/hyperparameter selection, then retrain on all training data. *(Do not shuffle time series — see L13.)*

**Learning curves.** Plot training and validation error against the **amount of training data**:
- **High bias:** both errors **high and close**, and they stay high as data is added → adding data will not help.
- **High variance:** training error **very low**, validation error **much higher**; as data grows the **validation error decreases** and the gap closes → more data helps.

The worksheet's Fig. 6 also shows errors vs **model complexity**: training error keeps falling; validation error is U-shaped.

**PRACTICE P3(c)** (low train curve, higher val curve falling with data): **high variance**; more data **helps**; more complexity **hurts**. (d) A: linear model on highly non-linear data has high bias; R: a line cannot capture non-linear patterns → **(i) both true, R explains A**.

**Final takeaway — practical tools:** train & validation performance (basic over/underfit); train–val–test split (generalisation to unseen data); cross-validation (stability across subsets); learning curves (need more data or more capacity?).

**P4 (homework, answered).** Key terms: estimator (rule that estimates an unknown from data); bias (inability to fit — systematic error); variance (how much predictions change when the training data change); underfitting (too simple: high bias, low variance); overfitting (memorises noise: low bias, high variance); irreducible error (inherent noise). True/false: true bias/variance always computable **F**; MSE = Bias + Var + σ² **F**; high train / low val → high variance **T**; more data always fixes high bias **F**; CV estimates stability **T**. (d) Degree-1 model for $y = x^3 + 2x^2 - x + 5$ → **high bias, low variance, underfits**.`,
    formulas: [{ name: 'k-fold CV score', tex: R`\text{CV}_k = \frac1k\sum_{i=1}^{k}\text{Err}_i`, sym: 'Err_i = validation error on fold i.', when: 'Model selection; stability.' }, { name: 'Training size per fold', tex: R`n_{\text{train}} = n\,\frac{k-1}{k}`, sym: '', when: 'k-fold counting questions.' }],
    plots: [
      { id: 'P09-kfold', title: '5-fold cross-validation', notice: 'Each fold takes one turn as the validation set (orange); the other four train the model.',
        spec: { type: 'flow', w: 560, h: 240, nodes: [].concat(...[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4].map(c => ({ id: 'n' + r + c, x: 120 + c * 90, y: 30 + r * 44, w: 84, h: 34, t: c === r ? 'validate' : 'train', c: c === r ? 's2' : 's1', fill: c === r ? 0.35 : 0.12 })))), edges: [],
          texts: [0, 1, 2, 3, 4].map(r => ({ x: 40, y: 30 + r * 44, s: 'run ' + (r + 1) })) } },
      { id: 'P09-complexity', title: 'Training and validation error vs model complexity', notice: 'Training error keeps falling with complexity; validation error falls then rises. Pick the bottom of the validation curve.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [0, 10], ylim: [0, 10], xlabel: 'model complexity', ylabel: 'error', xticks: false, legend: 'tr', series: [{ t: 'fn', f: c => 8 * Math.exp(-0.45 * c) + 0.3, c: 's1', label: 'training error' }, { t: 'fn', f: c => 8 * Math.exp(-0.45 * c) + 0.08 * c * c + 1, c: 's4', label: 'validation error' }, { t: 'vline', x: 3.8, c: 's3', dash: true }] } },
      { id: 'P09-learncurve', title: 'Learning curves: high bias vs high variance', notice: 'Left: both curves plateau high and close — more data will not help. Right: big gap that shrinks as data grows — more data helps.',
        spec: { type: 'multi', panels: [
          { type: 'xy', w: 300, h: 240, title: 'High bias', xlim: [0, 100], ylim: [0, 1.2], xlabel: 'training-set size', ylabel: 'error', legend: 'tr', series: [{ t: 'fn', f: n => 0.7 - 0.3 * Math.exp(-n / 15), d: [3, 100], c: 's1', label: 'train' }, { t: 'fn', f: n => 0.75 + 0.4 * Math.exp(-n / 15), d: [3, 100], c: 's4', label: 'validation' }] },
          { type: 'xy', w: 300, h: 240, title: 'High variance', xlim: [0, 100], ylim: [0, 1.2], xlabel: 'training-set size', ylabel: 'error', legend: 'tr', series: [{ t: 'fn', f: n => 0.05 + 0.1 * (1 - Math.exp(-n / 40)), d: [3, 100], c: 's1', label: 'train' }, { t: 'fn', f: n => 0.25 + 0.8 * Math.exp(-n / 35), d: [3, 100], c: 's4', label: 'validation' }] }] } }
    ],
    examples: [{ title: 'Reading CV folds (worked, from the code)', body: R`5-fold MSE per fold: degree 3 → [0.082, 0.079, 0.135, 0.105, 0.118], mean 0.104, std 0.021 (stable). Degree 12 → [0.091, **3.571**, 0.125, 0.322, 0.086], mean 0.839, std 1.369 — one fold explodes: the model is very sensitive to which data it saw → high variance.` }],
    code: [{ title: 'k-fold CV by hand and learning curves', scratch: 'L09_cv_learning_curve_scratch.py', lib: 'L09_cv_learning_curve_sklearn.py' }],
    traps: ['High-bias learning curves: **more data does not help**.', 'In k-fold every point is validated **exactly once**.', 'CV mean picks the model; CV spread signals variance.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Learning curve: training error very low, validation error much higher, gap shrinking with more data. Diagnosis?', options: ['High bias', 'High variance', 'Good fit', 'Leakage'], answer: 1, sol: 'P3(c).', why: ['No.', 'Correct.', 'Gap is large.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'For that high-variance learning curve, will adding training data likely help?', options: ['Yes', 'No'], answer: 0, sol: 'P3(c)(ii): the validation curve is still falling.', why: ['Correct.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Both training and validation errors are high and close, and stay flat as data grows. Best action?', options: ['Collect more data', 'Use a more complex model / better features', 'Add regularisation', 'Reduce features'], answer: 1, sol: 'High bias: add capacity.', why: ['Will not help.', 'Correct.', 'Makes bias worse.', 'Makes bias worse.'] },
      { type: 'int', diff: 'E', q: 'n = 1000, 5-fold CV. How many rows does each training run use?', answer: 800, tol: 0, round: 'Exact', verify: '1000*4/5', sol: '4/5 × 1000 = **800**.' },
      { type: 'int', diff: 'M', q: 'Fold MSEs [0.09, 3.57, 0.13, 0.32, 0.09]. Mean CV MSE (2 decimals)?', answer: 0.84, tol: 0.005, round: '2 decimals', verify: '(0.09+3.57+0.13+0.32+0.09)/5', sol: '4.20/5 = **0.84** — dominated by one unstable fold.' },
      { type: 'mcq', diff: 'M', q: 'Performance varies a lot across CV folds. This suggests:', options: ['high bias', 'higher variance (sensitivity to training data)', 'irreducible noise only', 'perfect fit'], answer: 1, sol: 'Section 11.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'A degree-1 model for y = x³ + 2x² − x + 5 will:', options: ['overfit', 'underfit (high bias, low variance)', 'fit perfectly', 'have high variance'], answer: 1, sol: 'P4(d).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.model_selection import KFold
import numpy as np
for tr, va in KFold(n_splits=3).split(np.arange(6)):
    print(va.tolist(), end=" ")`, answer: '[0, 1] [2, 3] [4, 5]', sol: 'Without shuffle, KFold takes consecutive blocks as validation folds.' }
    ],
    researched: R`k-fold mechanics, leave-one-out and fold statistics are beyond the worksheet ("study as homework"). Source: ISLR §5.1; scikit-learn \`KFold\`, \`cross_val_score\`, \`learning_curve\` docs.`,
    source: 'Worksheet L9 pp.10–15; ISLR §5.1.'
  }
  ]
});
})();
