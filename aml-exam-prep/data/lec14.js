/* Lecture 14 — Maximum likelihood estimation and logistic regression (binary cross-entropy) */
(function () {
const sig = NUM.sigmoid, logit = p => Math.log(p / (1 - p));
const B0 = -5, B1 = 0.4, B2 = 0.6;
const cont = p => x1 => (logit(p) - B0 - B1 * x1) / B2;
LECTURES.push({
  num: 14, short: 'MLE & Logistic', title: 'Maximum Likelihood Estimation and Logistic Regression — probability vs likelihood, sigmoid, Bernoulli likelihood, binary cross-entropy',
  file: 'AML_Lecture14_Worksheet_Teacher (1).pdf', pages: 15,
  intro: R`**Exam weight: very high.** The chain is: **probability vs likelihood** (what is fixed?) → **MLE** $\hat\theta = \arg\max L(\theta; D)$ → linear score $z$ and boundary $z = 0$ → **sigmoid** $\sigma(z) = 1/(1 + e^{-z})$ → **Bernoulli** term $\hat p^{y}(1-\hat p)^{1-y}$ → product likelihood → log-likelihood → **BCE**. Numericals: binomial likelihoods, σ(z), products of probabilities, −log values. About 90 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L14.1 */
  {
    id: 'L14.1', title: 'Probability vs likelihood', badge: 'class', pages: '1–3', ws: 'Sections 1–2',
    concept: R`
**Probability: parameter fixed, outcome uncertain.** A coin has p = 0.7 (heads). X = number of heads in 10 independent tosses. One particular sequence with 7 heads and 3 tails has probability $0.7^7 0.3^3$; the binomial coefficient counts the positions for the heads:
$$P(X = 7 \mid p = 0.7) = \binom{10}{7}(0.7)^7(0.3)^3 \approx 0.2668$$

**Likelihood: data fixed, parameter varies.** Now we have **observed** 7 heads in 10 tosses and let p vary. The same expression, read as a function of p:
$$L(p;\,X = 7) = \binom{10}{7}p^7(1-p)^3$$

| Candidate p | Likelihood of 7 heads | Interpretation |
|---|---|---|
| 0.5 | 0.117 | possible, weaker support |
| 0.8 | 0.201 | better than 0.5 |
| **0.7** | **0.267** | highest among candidates |

The likelihood depends on the data: with **6 heads** observed, $L(p; X = 6) = \binom{10}{6}p^6(1-p)^4$ peaks at **p = 0.6** — the peak moves left.

:::take Takeaway
In a **probability** question the parameter is fixed and the outcome varies. In a **likelihood** question the observed data are fixed and the candidate parameter varies.
:::`,
    formulas: [{ name: 'Binomial probability', tex: R`P(X = k \mid p) = \binom{n}{k}p^k(1-p)^{n-k}`, sym: 'n tosses, k heads.', when: 'Coin examples.' }, { name: 'Likelihood', tex: R`L(p;\,X = k) = \binom{n}{k}p^k(1-p)^{n-k}`, sym: 'Same formula, p varies.', when: 'Comparing candidate parameters.' }],
    plots: [
      { id: 'P14-lik7', title: 'Likelihood of observing 7 heads in 10 tosses, as a function of p', notice: 'The data stay fixed; the curve peaks at p = 0.7 = 7/10.',
        spec: { type: 'xy', w: 520, h: 280, xlim: [0, 1], ylim: [0, 0.3], xlabel: 'candidate p', ylabel: 'L(p; X = 7)', series: [{ t: 'fn', f: p => 120 * p ** 7 * (1 - p) ** 3, c: 's1', w: 2.5 }, { t: 'scatter', pts: [[0.5, 0.1172], [0.7, 0.2668], [0.8, 0.2013]], c: 's4', labels: ['0.117', '0.267 (max)', '0.201'] }, { t: 'vline', x: 0.7, c: 's7', dash: true }] } },
      { id: 'P14-lik6', title: 'With 6 heads observed, the peak moves to p = 0.6', notice: 'Different data → different likelihood function → different best p.',
        spec: { type: 'xy', w: 520, h: 280, xlim: [0, 1], ylim: [0, 0.3], xlabel: 'candidate p', ylabel: 'likelihood', legend: 'tl', series: [{ t: 'fn', f: p => 120 * p ** 7 * (1 - p) ** 3, c: 's7', dash: true, label: '7 heads' }, { t: 'fn', f: p => 210 * p ** 6 * (1 - p) ** 4, c: 's2', w: 2.5, label: '6 heads' }, { t: 'vline', x: 0.6, c: 's2', dash: true }] } }
    ],
    examples: [{ title: 'Binomial likelihood by hand (worked)', body: R`$\binom{10}{7} = \frac{10!}{7!\,3!} = 120$.
- p = 0.5: $120 \times 0.5^{10} = 120/1024 = 0.1172$.
- p = 0.8: $120 \times 0.8^7 \times 0.2^3 = 120 \times 0.2097 \times 0.008 = 0.2013$.
- p = 0.7: $120 \times 0.0824 \times 0.027 = 0.2668$.` }],
    code: [{ title: 'Binomial likelihoods and ratios', scratch: 'L14_mle_bce_scratch.py', lib: 'L14_mle_bce_sklearn.py', libLabel: 'scipy / sklearn' }],
    traps: ['Same formula, different roles: what is **fixed** decides probability vs likelihood.', 'Remember the binomial coefficient in hand calculations (it does not move the maximiser, but it changes the values).'],
    questions: [
      { type: 'int', diff: 'M', q: 'A coin with p = 0.7 is tossed 10 times. P(exactly 7 heads)? (4 decimals)', answer: 0.2668, tol: 0.0001, round: '4 decimals', verify: 'import math; math.comb(10,7)*0.7**7*0.3**3', sol: '$120 \\times 0.7^7 \\times 0.3^3 \\approx$ **0.2668**.' },
      { type: 'int', diff: 'M', q: 'Observed 7 heads in 10. Likelihood at p = 0.5 (4 decimals)?', answer: 0.1172, tol: 0.0001, round: '4 decimals', verify: 'import math; math.comb(10,7)*0.5**10', sol: '120/1024 = **0.1172**.' },
      { type: 'mcq', diff: 'E', q: 'In a **likelihood** question, what is fixed?', options: ['the parameter', 'the observed data', 'both', 'neither'], answer: 1, sol: 'Data fixed, parameter varies.', why: ['That is probability.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'A coin with known p = 0.7 has not been tossed yet; we compare possible values of X. This is a:', options: ['likelihood problem', 'probability problem', 'MLE problem', 'regression problem'], answer: 1, sol: 'P1(b)(i).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: '6 heads observed in 10 tosses. Where does the likelihood peak?', options: ['0.5', '0.6', '0.7', '1.0'], answer: 1, sol: 'Peak moves to 0.6 = 6/10.', why: ['No.', 'Correct.', 'That is for 7 heads.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from math import comb
print(comb(10, 7), comb(10, 6), round(comb(10, 6) * 0.6**6 * 0.4**4, 4))`, answer: '120 210 0.2508', sol: 'C(10,7) = 120, C(10,6) = 210; L(0.6; X = 6) = 210 × 0.046656 × 0.0256 ≈ 0.2508.' }
    ],
    source: 'Worksheet L14 pp.1–3; Casella & Berger §6.3.'
  },
  /* ---------------------------------------------------------------- L14.2 */
  {
    id: 'L14.2', title: 'Maximum likelihood estimation', badge: ['class', 'res'], pages: '3', ws: 'Section 3, P1 + researched Bernoulli MLE proof',
    concept: R`
| Question | Probability | Likelihood |
|---|---|---|
| fixed | model / parameter | observed data |
| varies | possible data / outcome | candidate parameter values |
| notation | $P(\text{Data} \mid \text{Parameter})$ | $L(\text{Parameter};\,\text{Data})$ |
| plain language | "if this model is true, how likely is this outcome?" | "given this outcome, which parameter explains it best?" |

Likelihood is a **plausibility score over parameters** — **not** automatically a probability distribution over them. For data D and parameters θ:
$$\hat\theta = \arg\max_\theta L(\theta; D) = \arg\max_\theta P(D \mid \theta)$$

:::take Takeaway
MLE chooses the parameters that make the data we **actually observed** most likely. It does **not** choose a "most probable parameter".
:::

**PRACTICE P1.** (a) $L(0.7)/L(0.5) \approx$ **2.28** and $L(0.7)/L(0.8) \approx$ **1.33**: the observed 7 heads support p = 0.7 about 2.28× as strongly as 0.5 and 1.33× as strongly as 0.8 — comparisons of plausibility, **not posterior probabilities**. (b) (i) p fixed, X varies → probability; (ii) X = 7 fixed, p varies → likelihood → MLE picks the maximiser. (c) Likelihoods 0.18 (θ_A) and 0.24 (θ_B): MLE prefers **θ_B**; but $P(\theta_B \mid D) = 0.24$ is **wrong** — $P(D \mid \theta_B)$ is not the posterior.

**Researched: the closed-form Bernoulli/binomial MLE is $\hat p = k/n$** (proof below) — 7/10 = 0.7 and 6/10 = 0.6, exactly where the curves peaked.`,
    deriv: [{ id: 'D14-bernoulli-mle', title: 'MLE of p for k successes in n trials', badge: 'res',
      steps: [
        { m: R`L(p) = \binom{n}{k}p^k(1-p)^{n-k}`, t: 'Binomial likelihood.' },
        { m: R`\ell(p) = \log\binom{n}{k} + k\log p + (n-k)\log(1-p)`, why: 'Log is increasing, so it has the same maximiser.' },
        { m: R`\ell'(p) = \frac{k}{p} - \frac{n-k}{1-p} = 0`, why: 'The constant term disappears.' },
        { m: R`k(1-p) = (n-k)p \Rightarrow k = np`, why: 'Cross-multiply.' },
        { m: R`\ell''(p) = -\frac{k}{p^2} - \frac{n-k}{(1-p)^2} < 0`, why: 'Concave → maximum.' }
      ], result: R`\hat p_{MLE} = \frac{k}{n}` }],
    formulas: [{ name: 'MLE', tex: R`\hat\theta = \arg\max_\theta L(\theta;D)`, sym: '', when: 'Definition.' }, { name: 'Likelihood ratio', tex: R`\frac{L(\theta_1;D)}{L(\theta_2;D)}`, sym: '> 1: data support θ₁ more.', when: 'P1(a).' }],
    examples: [{ title: 'MLE for a defect rate (worked)', body: R`12 defective items in 200 inspected: $\hat p = 12/200 = 0.06$. Any other p (say 0.05 or 0.08) gives a smaller value of $p^{12}(1-p)^{188}$.` }],
    code: [{ title: 'Grid-search MLE = k/n', scratch: 'L14_mle_bce_scratch.py' }],
    traps: ['Likelihood ≠ posterior probability of the parameter.', 'Larger likelihood = better; ratios compare support.'],
    questions: [
      { type: 'int', diff: 'E', q: 'L(0.7; X=7) = 0.2668, L(0.5; X=7) = 0.1172. Likelihood ratio (2 decimals)?', answer: 2.28, tol: 0.01, round: '2 decimals', verify: '0.2668/0.1172', sol: '≈ **2.28**.' },
      { type: 'int', diff: 'E', q: '18 successes in 60 Bernoulli trials. MLE of p?', answer: 0.3, tol: 0.0001, round: '2 decimals', verify: '18/60', sol: 'k/n = **0.3**.' },
      { type: 'mcq', diff: 'M', q: 'Candidates θ_A and θ_B give likelihoods 0.18 and 0.24. Which statement is correct?', options: ['MLE prefers θ_A', 'MLE prefers θ_B, and P(θ_B | D) = 0.24', 'MLE prefers θ_B, but 0.24 is not P(θ_B | D)', 'Cannot compare'], answer: 2, sol: 'P1(c).', why: ['Smaller.', 'Likelihood is not the posterior.', 'Correct.', 'We can.'] },
      { type: 'mcq', diff: 'E', q: 'MLE chooses the parameter that:', options: ['is most probable a priori', 'makes the observed data most likely', 'minimises the number of parameters', 'equals 0.5'], answer: 1, sol: 'Takeaway Section 3.', why: ['That would be a prior/posterior idea.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'H', tag: 'GATE-style', q: 'For k successes in n Bernoulli trials, setting d/dp of the log-likelihood to 0 gives:', options: ['p = n/k', 'p = k/n', 'p = 0.5', 'p = k/(n − k)'], answer: 1, sol: 'k/p = (n − k)/(1 − p) ⇒ p = k/n.', why: ['Inverted.', 'Correct.', 'Only if k = n/2.', 'That is the odds.'] }
    ],
    researched: R`The worksheet uses grid comparison; the calculus proof $\hat p = k/n$ is from Casella & Berger, *Statistical Inference* Example 7.2.7.`,
    source: 'Worksheet L14 p.3; Casella & Berger ch.7.'
  },
  /* ---------------------------------------------------------------- L14.3 */
  {
    id: 'L14.3', title: 'Why accuracy is not enough; linear score and decision boundary', badge: 'class', pages: '3–4', ws: 'Sections 4–5',
    concept: R`
Students are points in (IQ, CGPA) space; target: placement completed (1) or not (0). A straight line splits the space into two predicted classes.

**Accuracy can reject a line that misclassifies points, but cannot break a tie:** if two lines both classify all four points correctly, both have zero errors. A hard 0/1 score cannot prefer either, even if one boundary supports the labels much more confidently.

:::key Key insight
The model needs a **soft score** that says how strongly it supports class 1 or class 0, is comparable across observations, and can be used inside a **likelihood**.
:::

**Linear score** (two features): $z = \beta_0 + \beta_1x_1 + \beta_2x_2$ — a real number, **not** a probability. The **decision boundary** is the set where **z = 0**; z > 0 on one side, z < 0 on the other. Changing $\beta_0$ **shifts** the line; changing the feature weights changes its **orientation** and sensitivity.

*Example:* $\beta_0 = -5$, $\beta_1 = 0.4$, $\beta_2 = 0.6$, point (8, 7): $z = -5 + 3.2 + 4.2 = $ **2.4**.

:::warn Signed score, not exact distance
Multiplying every weight (including the intercept) by the same positive constant leaves the line z = 0 unchanged but rescales z. The perpendicular distance is $z / \|(\beta_1, \beta_2)\|$.
:::`,
    formulas: [{ name: 'Linear score', tex: R`z = \beta_0 + \beta_1x_1 + \beta_2x_2 = \tilde{\mathbf x}^T\boldsymbol\beta`, sym: 'Real-valued.', when: 'Every logistic computation.' }, { name: 'Decision boundary', tex: R`z = 0 \iff \hat p = 0.5`, sym: '', when: 'Boundary questions.' }, { name: 'Distance to the boundary', tex: R`d = \frac{z}{\sqrt{\beta_1^2 + \beta_2^2}}`, sym: 'Signed.', when: 'Scaling trap.' }],
    plots: [{ id: 'P14-twolines', title: 'Accuracy can reject a bad line but cannot break a tie', notice: 'Left: the dashed line misclassifies a point. Right: both lines classify all four points correctly — accuracy cannot choose between them; likelihood can.',
      spec: (function () { const pos = [[105, 8.4], [112, 8.9]], neg = [[92, 6.6], [98, 6.1]];
        const base = { xlim: [85, 120], ylim: [5, 10], xlabel: 'IQ', ylabel: 'CGPA' };
        return { type: 'multi', panels: [
          Object.assign({ type: 'xy', w: 300, h: 250, title: 'One separates, one misclassifies' }, base, { series: [{ t: 'scatter', pts: pos, c: 's3', label: 'placed (1)' }, { t: 'scatter', pts: neg, c: 's4', m: 's', label: 'not placed (0)' }, { t: 'fn', f: x => 17.5 - 0.1 * x, c: 'fg' }, { t: 'fn', f: x => 8.65, c: 's7', dash: true }, { t: 'text', x: 105, y: 8.0, s: 'wrong side', size: 11 }], legend: false }),
          Object.assign({ type: 'xy', w: 300, h: 250, title: 'Both classify all points correctly' }, base, { series: [{ t: 'scatter', pts: pos, c: 's3' }, { t: 'scatter', pts: neg, c: 's4', m: 's' }, { t: 'fn', f: x => 17.5 - 0.1 * x, c: 'fg' }, { t: 'fn', f: x => 13.2 - 0.05 * x, c: 's1', dash: true }] })] }; })() }],
    examples: [{ title: 'Which side of the boundary? (worked)', body: R`β = (−5, 0.4, 0.6). Point (5, 4): z = −5 + 2 + 2.4 = −0.6 < 0 → class-0 side. Point (8, 7): z = 2.4 > 0 → class-1 side. Boundary: $x_2 = (5 - 0.4x_1)/0.6$; at $x_1 = 5$ it is $x_2 = 5$.` }],
    traps: ['z is a score, not a probability.', 'Scaling all β by c > 0 keeps the boundary but changes confidence.'],
    questions: [
      { type: 'int', diff: 'E', q: 'β₀ = −5, β₁ = 0.4, β₂ = 0.6; point (8, 7). Score z?', answer: 2.4, tol: 0.001, round: '1 decimal', verify: '-5+0.4*8+0.6*7', sol: '**2.4**.' },
      { type: 'int', diff: 'M', q: 'Same β; point (5, 4). Score z?', answer: -0.6, tol: 0.001, round: '1 decimal', verify: '-5+0.4*5+0.6*4', sol: '−5 + 2 + 2.4 = **−0.6** (class-0 side).' },
      { type: 'mcq', diff: 'E', q: 'The decision boundary of logistic regression is where:', options: ['z = 1', 'z = 0', 'p̂ = 1', 'β₀ = 0'], answer: 1, sol: 'Section 5.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Two lines both classify all training points correctly. Accuracy:', options: ['prefers the steeper line', 'cannot distinguish them', 'prefers the line with smaller β₀', 'is undefined'], answer: 1, sol: 'Section 4.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'All coefficients (incl. β₀) are multiplied by 3. The boundary:', options: ['moves', 'is unchanged, but scores (and confidence) change', 'rotates 90°', 'disappears'], answer: 1, sol: 'Warning box.', why: ['No.', 'Correct.', 'No.', 'No.'] }
    ],
    source: 'Worksheet L14 pp.3–4; ISLR §4.3.'
  },
  /* ---------------------------------------------------------------- L14.4 */
  {
    id: 'L14.4', title: 'Step function vs sigmoid; class probability', badge: 'class', pages: '5–7', ws: 'Sections 6–8, P2',
    concept: R`
**Hard step rule:** $\hat y_i = 1$ if $z_i \ge 0$, else 0. Useful for a final decision, unsuitable for **fitting**:
- z = 0.01 and z = 10 both become class 1 → confidence lost;
- many boundaries give the same hard labels → ties remain;
- flat almost everywhere with a jump at 0 → small parameter improvements are invisible.

**Sigmoid:**
$$\sigma(z) = \frac{1}{1 + e^{-z}}\in(0, 1)$$
Because $e^{-z} > 0$, the output is strictly between 0 and 1; it preserves the ordering of scores and changes smoothly.

| z | σ(z) | support for class 1 |
|---|---|---|
| −4 | 0.018 | very weak |
| −2 | 0.119 | low |
| 0 | 0.500 | on the boundary |
| 2 | 0.881 | strong |
| 4 | 0.982 | very strong |

z → −∞ ⇒ σ → 0; z = 0 ⇒ 0.5; z → +∞ ⇒ σ → 1. σ is the model's **estimated probability** of class 1, not a guarantee.

**Class probability:** $\hat p_i = P(Y_i = 1 \mid \mathbf x_i; \boldsymbol\beta) = \sigma(z_i)$, and $P(Y_i = 0 \mid \mathbf x_i;\boldsymbol\beta) = 1 - \hat p_i$ (they sum to 1). A boundary point has $z = 0$, $\hat p = 0.5$; the line $\hat p = 0.5$ is one **contour** in a probability field (others: $\hat p = 0.2, 0.8$).

**PRACTICE P2.** (a) z = 2.4 → $\hat p = \sigma(2.4) = $ **0.917** → class 1. (b) Multiply all β by 2: boundary **unchanged**; z' = 4.8, σ = **0.992** — same boundary, more confidence (and a different likelihood). (c) z = 0.01 and 10 → both class 1 under the step, but σ = 0.5025 vs 0.99995: the sigmoid keeps the **strength of support**.`,
    formulas: [{ name: 'Sigmoid', tex: R`\sigma(z) = \frac{1}{1+e^{-z}}`, sym: 'σ(0) = 0.5; σ(−z) = 1 − σ(z).', when: 'Turning scores into probabilities.' }, { name: 'Class probabilities', tex: R`\hat p = \sigma(z),\qquad P(Y=0) = 1 - \hat p`, sym: '', when: 'Every prediction.' }, { name: 'Inverse (logit)', tex: R`z = \log\frac{\hat p}{1-\hat p}`, sym: 'Contours p̂ = c ⇔ z = logit(c).', when: 'Contour lines; L15 log-odds.' }],
    plots: [
      { id: 'P14-step', title: 'Hard step function: only 0 or 1', notice: 'Flat everywhere except the jump at z = 0 — no gradient to learn from, no confidence.', spec: { type: 'xy', w: 460, h: 240, xlim: [-6, 6], ylim: [-0.1, 1.1], xlabel: 'z', ylabel: 'output', series: [{ t: 'line', pts: [[-6, 0], [0, 0]], c: 's4', w: 3 }, { t: 'line', pts: [[0, 1], [6, 1]], c: 's4', w: 3 }, { t: 'scatter', pts: [[0, 1]], c: 's4' }, { t: 'scatter', pts: [[0, 0]], c: 's4', hollow: true }] } },
      { id: 'P14-sigmoid', title: 'The sigmoid turns any score into a smooth probability', notice: 'Marked values: σ(−4) = 0.018, σ(−2) = 0.119, σ(0) = 0.5, σ(2) = 0.881, σ(4) = 0.982.',
        spec: { type: 'xy', w: 460, h: 260, xlim: [-6, 6], ylim: [0, 1], xlabel: 'z', ylabel: 'σ(z)', series: [{ t: 'fn', f: sig, c: 's1', w: 2.5 }, { t: 'hline', y: 0.5, c: 's7', dash: true }, { t: 'scatter', pts: [-4, -2, 0, 2, 4].map(z => [z, sig(z)]), c: 's4', labels: ['0.018', '0.119', '0.5', '0.881', '0.982'] }] } },
      { id: 'P14-contours', title: 'p̂ = 0.5 is one contour of a probability field', notice: 'β = (−5, 0.4, 0.6). Parallel lines p̂ = 0.2, 0.5, 0.8; the point (8, 7) has p̂ = 0.917.',
        spec: { type: 'xy', w: 460, h: 330, xlim: [0, 12], ylim: [0, 12], xlabel: 'x₁', ylabel: 'x₂', legend: 'tr', series: [{ t: 'fn', f: cont(0.2), c: 's4', dash: true, label: 'p̂ = 0.2' }, { t: 'fn', f: cont(0.5), c: 'fg', w: 2.5, label: 'p̂ = 0.5 (boundary)' }, { t: 'fn', f: cont(0.8), c: 's3', dash: true, label: 'p̂ = 0.8' }, { t: 'scatter', pts: [[8, 7]], c: 's1', labels: ['(8,7): 0.917'] }] } }
    ],
    examples: [{ title: 'σ by hand (worked)', body: R`$\sigma(2.4) = 1/(1 + e^{-2.4}) = 1/(1 + 0.0907) = 0.917$. $\sigma(-2.4) = 1 - 0.917 = 0.083$ (symmetry). $\sigma(4.8) = 1/(1 + 0.00823) = 0.992$.` }],
    code: [{ title: 'σ table, scaled coefficients, predict_proba', scratch: 'L14_mle_bce_scratch.py', lib: 'L14_mle_bce_sklearn.py' }],
    traps: ['σ(z) is a probability estimate, not the final class.', 'Threshold 0.5 ⇔ z = 0.', 'σ(−z) = 1 − σ(z).'],
    questions: [
      { type: 'int', diff: 'E', q: 'σ(2.4) (3 decimals)?', answer: 0.917, tol: 0.001, round: '3 decimals', verify: '1/(1+__import__("math").exp(-2.4))', sol: '1/(1 + 0.0907) = **0.917**.' },
      { type: 'int', diff: 'M', q: 'All coefficients doubled: z′ = 4.8. σ(z′) (3 decimals)?', answer: 0.992, tol: 0.001, round: '3 decimals', verify: '1/(1+__import__("math").exp(-4.8))', sol: '**0.992**.' },
      { type: 'int', diff: 'E', q: 'σ(0)?', answer: 0.5, tol: 0, round: '1 decimal', verify: '1/(1+1)', sol: '1/(1 + 1) = **0.5**.' },
      { type: 'int', diff: 'M', q: 'σ(z) = 0.119. What is σ(−z) (3 decimals)?', answer: 0.881, tol: 0.001, round: '3 decimals', verify: '1-0.119', sol: '1 − 0.119 = **0.881**.' },
      { type: 'mcq', diff: 'M', q: 'Why is the hard step function unsuitable for fitting?', options: ['It is too slow', 'It discards confidence, leaves ties and is flat except at 0', 'It outputs negative values', 'It needs labels'], answer: 1, sol: 'Section 6.', why: ['No.', 'Correct.', 'Outputs 0/1.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'p̂ᵢ = 0.8 for class 1. P(class 0)?', options: ['0.8', '0.2', '1.8', '0.5'], answer: 1, sol: '1 − p̂.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
z = np.array([-2, 0, 2])
print(np.round(1 / (1 + np.exp(-z)), 3))`, answer: '[0.119 0.5   0.881]', sol: 'NumPy pads 0.5 to align the columns.' }
    ],
    source: 'Worksheet L14 pp.5–7; ISLR §4.3.1.'
  },
  /* ---------------------------------------------------------------- L14.5 */
  {
    id: 'L14.5', title: 'Bernoulli likelihood for a whole dataset', badge: 'class', pages: '8–9', ws: 'Sections 9–12',
    concept: R`
**Probability of the label that actually occurred.** Keep $\hat p_i$ for a positive, $1 - \hat p_i$ for a negative:
$$q_i = P(y_i \mid \mathbf x_i;\boldsymbol\beta) = \hat p_i^{\,y_i}(1-\hat p_i)^{1-y_i},\qquad y_i\in\{0,1\}$$
The exponents act as **selectors**: $y_i = 1$ → $\hat p_i$; $y_i = 0$ → $1 - \hat p_i$. With the data fixed, $q_i$ is observation i's **likelihood contribution**. If $\hat p_i = 0.8$: label 1 contributes 0.8, label 0 contributes 0.2.

| Point | y | Model A: P(actual) | Model B: P(actual) |
|---|---|---|---|
| 1 | 1 | 0.90 | 0.60 |
| 2 | 1 | 0.80 | 0.55 |
| 3 | 0 | 0.85 (= 1 − 0.15) | 0.65 (= 1 − 0.35) |
| 4 | 0 | 0.75 (= 1 − 0.25) | 0.60 (= 1 − 0.40) |
| **product** | | **0.459** | **0.129** |

Both models have 100% training accuracy, but **A assigns more probability to what actually happened** → larger likelihood.

**Model assumptions (Section 10):** binary targets; $Y_i \mid \mathbf x_i \sim \text{Bernoulli}(\hat p_i)$ with $\hat p_i = \sigma(\tilde{\mathbf x}_i^T\tilde{\boldsymbol\beta})$; observations **conditionally independent**; log-odds linear in the features. ("Success" is just Bernoulli terminology.)

:::warn Connection to L13
Time-series observations depend on earlier ones — do not copy the independent-product likelihood blindly into a time-series setting.
:::

**Dataset likelihood (Section 12).** The whole dataset is one joint event; under conditional independence its probability is the **product**:
$$L(\boldsymbol\beta) = \prod_{i=1}^n \hat p_i^{\,y_i}(1-\hat p_i)^{1-y_i},\qquad \hat{\boldsymbol\beta} = \arg\max_{\boldsymbol\beta}L(\boldsymbol\beta)$$
Changing β changes every $z_i$, every $\hat p_i$ and the product. The goal is not just to put each $\hat p_i$ on the right side of 0.5 — it is to put **as much probability as possible on the observed labels**.`,
    deriv: [{ id: 'D14-bernoulli', title: 'The Bernoulli selector formula', badge: 'class',
      steps: [
        { m: R`P(y_i \mid \mathbf x_i) = \hat p_i^{\,y_i}(1-\hat p_i)^{1-y_i}`, t: 'Compact Bernoulli PMF.' },
        { m: R`y_i = 1:\ \hat p_i^{\,1}(1-\hat p_i)^{0} = \hat p_i`, why: 'Anything (non-zero) to the power 0 is 1.' },
        { m: R`y_i = 0:\ \hat p_i^{\,0}(1-\hat p_i)^{1} = 1 - \hat p_i`, why: 'The other factor survives.' },
        { m: R`L(\boldsymbol\beta) = \prod_i P(y_i \mid \mathbf x_i;\boldsymbol\beta)`, why: 'Conditional independence → multiply.' }
      ], result: R`L(\boldsymbol\beta) = \prod_{i=1}^{n}\hat p_i^{\,y_i}(1-\hat p_i)^{1-y_i}` }],
    formulas: [{ name: 'Bernoulli term', tex: R`q_i = \hat p_i^{\,y_i}(1-\hat p_i)^{1-y_i}`, sym: 'Probability of the observed label.', when: 'Building the likelihood.' }, { name: 'Dataset likelihood', tex: R`L(\boldsymbol\beta) = \prod_i q_i`, sym: 'Needs conditional independence.', when: 'Comparing models (Model A vs B).' }],
    examples: [{ title: 'Products by hand (worked)', body: R`Model A: 0.9 × 0.8 = 0.72; × 0.85 = 0.612; × 0.75 = **0.459**.
Model B: 0.6 × 0.55 = 0.33; × 0.65 = 0.2145; × 0.6 = **0.1287**.` }],
    code: [{ title: 'Likelihood of Models A and B', scratch: 'L14_mle_bce_scratch.py' }],
    traps: ['For y = 0 use **1 − p̂**, not p̂.', 'Equal accuracy does not imply equal likelihood (P4(d)(i) False).', 'The product requires conditional independence (problematic for time series).'],
    questions: [
      { type: 'int', diff: 'M', q: 'Probabilities of the actual class: 0.9, 0.8, 0.85, 0.75. Dataset likelihood (3 decimals)?', answer: 0.459, tol: 0.001, round: '3 decimals', verify: '0.9*0.8*0.85*0.75', sol: '**0.459**.' },
      { type: 'int', diff: 'M', q: 'y = [1, 1, 0, 0], p̂ = [0.6, 0.55, 0.35, 0.40]. Likelihood (4 decimals)?', answer: 0.1287, tol: 0.0001, round: '4 decimals', verify: '0.6*0.55*0.65*0.6', sol: '0.6 × 0.55 × 0.65 × 0.6 = **0.1287**.' },
      { type: 'int', diff: 'E', q: 'p̂ = 0.8 and the observed label is 0. Likelihood contribution?', answer: 0.2, tol: 0.0001, round: '1 decimal', verify: '1-0.8', sol: '(1 − 0.8) = **0.2**.' },
      { type: 'mcq', diff: 'M', q: 'Models A and B both have 100% training accuracy; L_A = 0.459, L_B = 0.129. MLE prefers:', options: ['B', 'A', 'neither (tie)', 'the one with more parameters'], answer: 1, sol: 'Higher likelihood.', why: ['No.', 'Correct.', 'Likelihood breaks the tie.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why are observation contributions **multiplied**?', options: ['Convention', 'Under conditional independence the joint probability is the product', 'To make numbers smaller', 'Because of the sigmoid'], answer: 1, sol: 'Section 12.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
y = np.array([1, 1, 0, 0]); p = np.array([0.9, 0.8, 0.15, 0.25])
q = p ** y * (1 - p) ** (1 - y)
print(q.tolist(), round(q.prod(), 3))`, answer: '[0.9, 0.8, 0.85, 0.75] 0.459', sol: 'Selectors keep p̂ for y = 1 and 1 − p̂ for y = 0.' }
    ],
    source: 'Worksheet L14 pp.8–9.'
  },
  /* ---------------------------------------------------------------- L14.6 */
  {
    id: 'L14.6', title: 'Log-likelihood → binary cross-entropy; how BCE behaves', badge: 'class', pages: '10–11', ws: 'Sections 13–15, P3',
    concept: R`
**Why take the log?** Products of many probabilities **underflow**: $0.5^{2000} \approx 10^{-602}$, below the range of 64-bit floats (it becomes 0.0). Log is **strictly increasing** — it keeps the same maximiser — and turns products into sums:
$$\ell(\boldsymbol\beta) = \log L(\boldsymbol\beta) = \sum_{i=1}^n\big[y_i\log\hat p_i + (1-y_i)\log(1-\hat p_i)\big]$$
Log-likelihoods are usually ≤ 0; **closer to 0 is better** (−20 beats −35).

**BCE.** Maximising ℓ = minimising −ℓ; dividing by n (a fixed positive constant) turns the total into an average without changing the best β:
$$\text{BCE}(\boldsymbol\beta) = -\frac1n\sum_{i=1}^n\big[y_i\log\hat p_i + (1-y_i)\log(1-\hat p_i)\big],\qquad L_i = \begin{cases}-\log\hat p_i & y_i = 1\\ -\log(1-\hat p_i) & y_i = 0\end{cases}$$

:::key Key insight
**Binary cross-entropy is the negative average Bernoulli log-likelihood** of the sigmoid model.
:::

**Behaviour.** *Correct confidence* (high probability on the true class) → −log(≈1) ≈ 0. *Wrong confidence* (probability of the true class → 0) → −log → ∞: a confidently wrong prediction gets a **huge** penalty.

| p̂ (class 1) | loss if y = 1 | loss if y = 0 |
|---|---|---|
| 0.90 | 0.105 | 2.303 |
| 0.60 | 0.511 | 0.916 |
| 0.10 | 2.303 | 0.105 |

:::take Takeaway
Accuracy asks only whether a probability crossed a threshold. **BCE asks how much probability the model assigned to the truth.**
:::

**PRACTICE P3.** (a) $L_A = 0.459$, $L_B = 0.1287$; $\ell_A = -0.779$, $\ell_B = -2.050$; $\text{BCE}_A = 0.195$, $\text{BCE}_B = 0.513$ — MLE and BCE choose the same model (A). (b) p̂ = 0.9: y = 1 → contribution 0.9, loss **0.105**; y = 0 → 0.1, loss **2.303**. (c) log (monotone, keeps the maximiser), then negate and divide by n (min instead of max; rescale). (d) A true-class probability of exactly 0 → L = 0, ℓ → −∞, BCE → +∞; implementations **clip** probabilities away from 0 and 1 or use stable formulas.`,
    deriv: [{ id: 'D14-bce', title: 'From likelihood to binary cross-entropy', badge: 'class',
      steps: [
        { m: R`L(\boldsymbol\beta) = \prod_{i=1}^n\hat p_i^{\,y_i}(1-\hat p_i)^{1-y_i}`, t: 'Dataset likelihood.' },
        { m: R`\ell(\boldsymbol\beta) = \sum_{i=1}^n\big[y_i\log\hat p_i + (1-y_i)\log(1-\hat p_i)\big]`, why: 'log(ab) = log a + log b and log(aᵇ) = b log a; log is increasing so the argmax is unchanged.' },
        { m: R`\arg\max_{\boldsymbol\beta}\ell = \arg\min_{\boldsymbol\beta}(-\ell)`, why: 'Negate: maximisation becomes minimisation.' },
        { m: R`\arg\min_{\boldsymbol\beta}(-\ell) = \arg\min_{\boldsymbol\beta}\Big(-\frac{\ell}{n}\Big)`, why: 'Dividing by fixed n > 0 only rescales.' }
      ], result: R`\text{BCE}(\boldsymbol\beta) = -\frac1n\sum_{i=1}^n\big[y_i\log\hat p_i + (1-y_i)\log(1-\hat p_i)\big]` }],
    formulas: [{ name: 'Log-likelihood', tex: R`\ell = \sum_i[y_i\log\hat p_i + (1-y_i)\log(1-\hat p_i)]`, sym: '≤ 0; larger is better.', when: 'Comparing fits.' }, { name: 'BCE (log loss)', tex: R`\text{BCE} = -\frac{\ell}{n}`, sym: '≥ 0; smaller is better. Natural log.', when: 'Training objective; `log_loss`.' }],
    plots: [{ id: 'P14-bce', title: 'BCE rewards correct confidence and punishes wrong confidence', notice: 'Solid: y = 1 (−log p̂). Dashed: y = 0 (−log(1 − p̂)). Each curve explodes as the probability of the true class goes to 0.',
      spec: { type: 'xy', w: 520, h: 290, xlim: [0, 1], ylim: [0, 5], xlabel: 'predicted probability p̂ for class 1', ylabel: 'loss for one observation', legend: 'tr', series: [{ t: 'fn', f: p => -Math.log(p), d: [0.005, 1], c: 's1', w: 2.5, label: 'y = 1: −log(p̂)' }, { t: 'fn', f: p => -Math.log(1 - p), d: [0, 0.995], c: 's4', w: 2.5, dash: true, label: 'y = 0: −log(1 − p̂)' }, { t: 'scatter', pts: [[0.9, 0.105], [0.6, 0.511], [0.1, 2.303]], c: 's1', labels: ['0.105', '0.511', '2.303'] }] } }],
    examples: [{ title: 'BCE for Model A by hand (worked)', body: R`−[ln 0.9 + ln 0.8 + ln 0.85 + ln 0.75]/4 = −[−0.1054 − 0.2231 − 0.1625 − 0.2877]/4 = 0.7787/4 = **0.195**. Equivalently −ln(0.459)/4.` }],
    code: [{ title: 'Log-likelihood, BCE, underflow demo; sklearn log_loss', scratch: 'L14_mle_bce_scratch.py', lib: 'L14_mle_bce_sklearn.py' }],
    traps: ['Use the **natural** log (as sklearn `log_loss`).', 'A barely-correct prediction still has positive loss (0.51 → 0.673).', 'Log-likelihood −20 is better than −35 (compare values, not magnitudes).'],
    questions: [
      { type: 'int', diff: 'E', q: 'p̂ = 0.9, y = 0. Per-observation BCE (3 decimals)?', answer: 2.303, tol: 0.001, round: '3 decimals', verify: '-__import__("math").log(0.1)', sol: '−ln(0.1) = **2.303**.' },
      { type: 'int', diff: 'E', q: 'p̂ = 0.9, y = 1. Per-observation BCE (3 decimals)?', answer: 0.105, tol: 0.001, round: '3 decimals', verify: '-__import__("math").log(0.9)', sol: '−ln(0.9) = **0.105**.' },
      { type: 'int', diff: 'M', q: 'Model A likelihood 0.459 on n = 4. Average BCE (3 decimals)?', answer: 0.195, tol: 0.001, round: '3 decimals', verify: '-__import__("math").log(0.459)/4', sol: '−ln(0.459)/4 = 0.779/4 = **0.195**.' },
      { type: 'int', diff: 'M', q: 'Positive example (y = 1): model predicts 0.51. BCE (3 decimals)?', answer: 0.673, tol: 0.001, round: '3 decimals', verify: '-__import__("math").log(0.51)', sol: '**0.673** — correct label, but low confidence still costs.' },
      { type: 'mcq', diff: 'E', q: 'Log-likelihoods −35 and −20. Which fit is better?', options: ['−35 (larger magnitude)', '−20 (larger value)', 'equal', 'cannot tell'], answer: 1, sol: 'P4(b).', why: ['Magnitude is not the rule.', 'Correct.', 'No.', 'We can.'] },
      { type: 'mcq', diff: 'M', q: 'Why take the log of the likelihood?', options: ['It changes the best β', 'Products underflow; log is monotone and turns products into sums', 'To make it positive', 'Because BCE is linear'], answer: 1, sol: 'Section 13.', why: ['It does not.', 'Correct.', 'Logs of probabilities are ≤ 0.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.metrics import log_loss
print(round(log_loss([1, 1, 0, 0], [0.9, 0.8, 0.15, 0.25]), 3))`, answer: '0.195', sol: 'Model A average BCE.' }
    ],
    source: 'Worksheet L14 pp.10–11; Bishop §4.3.2.'
  },
  /* ---------------------------------------------------------------- L14.7 */
  {
    id: 'L14.7', title: 'Training implications, misconceptions, the full story', badge: 'class', pages: '12–15', ws: 'Sections 16–18, P4',
    concept: R`
**BCE is convex** in the weights for binary logistic regression: a bowl-like structure with no separate bad local minima. **Convex ≠ quadratic and ≠ closed form**: the sigmoid couples weights to probabilities non-linearly, so the optimal weights **cannot** generally be isolated in one formula (unlike the normal equation). **Iterative optimisation is required** (gradient descent — Lecture 15).

Regularisation can be added: $J(\boldsymbol\beta) = \text{BCE}(\boldsymbol\beta) + \lambda R(\boldsymbol\beta)$ (R = L1 or L2), BCE remaining the data-fit term.

| Misconception | Correction |
|---|---|
| "Likelihood is P(parameter \| data)." | It is P(data \| parameter) viewed as a function of the parameter. |
| "The sigmoid output is the final class." | It is an estimated probability; a threshold may convert it later. |
| "Any correct prediction gets zero loss." | A barely correct probability still has positive BCE. |
| "BCE is just a formula to memorise." | It is the negative average Bernoulli log-likelihood. |
| "Convex means a direct formula exists." | Convexity is about shape; logistic regression still needs iterations. |

**The story:** features x → score $z = \mathbf x^T\boldsymbol\beta$ → sigmoid → $\hat p = P(y = 1 \mid \mathbf x)$ → Bernoulli term (probability of the observed label) → product likelihood → log → negate & average → **BCE**, minimised iteratively.

**PRACTICE P4.** (a) Positive example: A predicts 0.51 (BCE 0.673), B predicts 0.95 (0.051) → **B** preferred. If the label is 0: A → −ln 0.49 = 0.713, B → −ln 0.05 = 2.996 → **A** preferred. (c) Time series in an independent-product likelihood → examine **conditional independence**. (d) Same accuracy ⇒ same likelihood **F**; log can change the maximiser **F**; convex BCE ⇒ closed form **F**; adding λR(β) penalises weights in addition to fitting **T**. (e) $z_i = \beta_0 + \sum_j\beta_jx_{ij}$; $\hat p_i = \sigma(z_i)$; $P(y_i \mid \mathbf x_i;\boldsymbol\beta) = \hat p_i^{y_i}(1-\hat p_i)^{1-y_i}$; $L = \prod_i$; $\ell = \sum_i[\dots]$; $\text{BCE} = -\ell/n$.`,
    formulas: [{ name: 'Regularised logistic objective', tex: R`J(\boldsymbol\beta) = \text{BCE}(\boldsymbol\beta) + \lambda R(\boldsymbol\beta)`, sym: 'R = ‖β‖₁ or ‖β‖₂².', when: 'Overfitting control (L12 + L14).' }],
    plots: [{ id: 'P14-story', title: 'Binary logistic regression from features to BCE', notice: 'Top row builds the probability; bottom row turns it into the training objective.',
      spec: { type: 'flow', w: 680, h: 210, nodes: [
        { id: 'a', x: 80, y: 50, w: 130, h: 46, t: '1 Features x', c: 's7' }, { id: 'b', x: 250, y: 50, w: 140, h: 46, t: '2 Score\nz = xᵀβ', c: 's1' }, { id: 'c', x: 420, y: 50, w: 140, h: 46, t: '3 Sigmoid\nσ(z) ∈ (0,1)', c: 's1' }, { id: 'd', x: 590, y: 50, w: 140, h: 46, t: '4 p̂ = P(y=1|x)', c: 's3' },
        { id: 'e', x: 590, y: 160, w: 140, h: 46, t: '5 Bernoulli term\np̂ʸ(1−p̂)¹⁻ʸ', c: 's5' }, { id: 'f', x: 420, y: 160, w: 140, h: 46, t: '6 Likelihood\nproduct', c: 's5' }, { id: 'g', x: 250, y: 160, w: 140, h: 46, t: '7 Log + negate\n+ average', c: 's2' }, { id: 'h', x: 80, y: 160, w: 130, h: 46, t: '8 BCE\nminimise (GD)', c: 's4', bold: true }],
        edges: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'c', b: 'd' }, { a: 'd', b: 'e' }, { a: 'e', b: 'f' }, { a: 'f', b: 'g' }, { a: 'g', b: 'h' }] } }],
    examples: [{ title: 'Same label, different confidence (worked, P4(a))', body: R`| | p̂ = 0.51 | p̂ = 0.95 |
|---|---|---|
| y = 1 | 0.673 | **0.051** |
| y = 0 | **0.713** | 2.996 |
Whichever model put more probability on the actual label wins.` }],
    code: [{ title: 'sklearn LogisticRegression: predict_proba, decision_function, log-loss', lib: 'L14_mle_bce_sklearn.py' }],
    traps: ['Convex objective, but **no closed form** → gradient descent.', 'Regularisation is added to BCE; BCE stays the data-fit term.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Does convex BCE guarantee a closed-form solution for logistic regression?', options: ['Yes', 'No — the sigmoid coupling still requires iterative optimisation'], answer: 1, sol: 'P4(d)(iii).', why: ['No.', 'Correct.'] },
      { type: 'int', diff: 'M', q: 'Actual label 0; model predicts p̂ = 0.95. BCE (3 decimals)?', answer: 2.996, tol: 0.001, round: '3 decimals', verify: '-__import__("math").log(0.05)', sol: '−ln(0.05) = **2.996**.' },
      { type: 'msq', diff: 'M', q: 'P4(d): select all **true** statements.', options: ['Same accuracy implies same likelihood', 'Taking log can change the maximiser', 'Convex BCE guarantees a closed form', 'Adding λR(β) penalises weights in addition to fitting the data'], answer: [3], sol: 'F, F, F, T.', why: ['False.', 'False.', 'False.', 'True.'] },
      { type: 'mcq', diff: 'M', q: '"Any correct prediction gets zero loss." Correct?', options: ['Yes', 'No — a barely correct probability still has positive BCE'], answer: 1, sol: 'Misconception table.', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'Before using the independent-product likelihood on time-series data you must check:', options: ['feature scaling', 'conditional independence of observations', 'that labels are balanced', 'that n > 100'], answer: 1, sol: 'P4(c).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'In logistic regression BCE is minimised with:', options: ['the normal equation', 'an iterative optimiser such as gradient descent', 'PCA', 'k-fold CV'], answer: 1, sol: 'Section 16.', why: ['No closed form.', 'Correct.', 'No.', 'CV tunes, it does not optimise β.'] }
    ],
    source: 'Worksheet L14 pp.12–15.'
  }
  ]
});
})();
