/* Lecture 6 — Stochastic and Mini-Batch Gradient Descent */
(function () {
// Toy problem in the parameter plane: sample i has loss J_i = 0.5*||theta - c_i||^2, so the
// full-data loss is minimised at mean(c_i) and every sample gradient is (theta - c_i).
const rnd = NUM.rng(17), C = [];
for (let i = 0; i < 24; i++) C.push([NUM.gauss(rnd) * 1.6, NUM.gauss(rnd) * 1.0]);
const mu = [NUM.mean(C.map(c => c[0])), NUM.mean(C.map(c => c[1]))];
function run(b, steps, alpha, seed) {
  const r = NUM.rng(seed); let th = [-4.2, 3.4]; const pts = [th.slice()], loss = [];
  const full = t => NUM.mean(C.map(c => 0.5 * ((t[0] - c[0]) ** 2 + (t[1] - c[1]) ** 2)));
  loss.push(full(th));
  for (let s = 0; s < steps; s++) {
    let g = [0, 0];
    for (let k = 0; k < b; k++) { const c = C[Math.floor(r() * C.length)]; g[0] += (th[0] - c[0]) / b; g[1] += (th[1] - c[1]) / b; }
    if (b >= C.length) g = [th[0] - mu[0], th[1] - mu[1]];
    th = [th[0] - alpha * g[0], th[1] - alpha * g[1]]; pts.push(th.slice()); loss.push(full(th));
  }
  return { pts, loss };
}
const rings = [0.6, 1.4, 2.6, 4].map(rr => ({ t: 'ellipse', cx: mu[0], cy: mu[1], rx: rr, ry: rr, c: 's7', w: 1 }));
const opt = { t: 'scatter', pts: [mu], c: 'fg', m: 'x', r: 6 };
const BG = run(999, 12, 0.3, 1), SG = run(1, 40, 0.3, 5), MB = run(4, 20, 0.3, 9);
LECTURES.push({
  num: 6, short: 'SGD & Mini-batch', title: 'Stochastic & Mini-Batch Gradient Descent',
  file: 'AML_Lecture 6_Worksheet_Filled.pdf', pages: 12, extraFiles: 'Whiteboards/L07 (class of 1 Sep)',
  intro: R`**Exam weight: high.** Know the **updates-per-epoch** counts (BGD 1, SGD m, mini-batch $\lceil m/b\rceil$), cost per update ($O(md)$ vs $O(d)$), why SGD is **noisy but unbiased**, why we **shuffle**, the pseudocode difference (the update moves **inside** the sample loop), and be able to run **one epoch of SGD and mini-batch by hand**. This worksheet copy was blank in many places; every answer here was computed and checked in Python (\`aml-practice/L06_sgd_minibatch_scratch.py\`). About 75 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L06.1 */
  {
    id: 'L06.1', title: 'Revision: why Batch GD updates so rarely', badge: 'class', pages: '1–2', ws: 'Section 1, PRACTICE P1',
    concept: R`
**Notation (whole sheet):** $m$ = number of training examples; $d$ = number of features; $\boldsymbol\theta$ = parameters; $\alpha$ = learning rate; $J_i(\boldsymbol\theta)$ = loss of **one** example $i$; $J(\boldsymbol\theta) = \frac1m\sum_{i=1}^m J_i(\boldsymbol\theta)$ = average training cost. **Iteration** = one parameter update. **Epoch** = one complete pass over all m examples.

:::hook Hook
BGD's rhythm: scan all samples → average their gradients → update **once**. With m = 10,000,000, one BGD epoch makes **one** update. Is one update worth scanning 10 million samples?
:::

**Why BGD is attractive:** stable direction (noise averages out); deterministic, repeatable path; smooth convergence on simple convex losses; good for small datasets that fit in memory.

**Its limitations**

| Limitation | Why it happens | When serious | Example |
|---|---|---|---|
| Waits before update | averages over all m | a full pass takes hours | ad-click model, 100M rows |
| High cost per update | gradient for every sample | large m and d | image data |
| Memory / I/O pressure | data read repeatedly | data larger than RAM | recommendation logs |
| Slow feedback | learns only after a full scan | data change quickly | real-time fraud detection |
| Redundant work | similar samples → similar gradients | repeated patterns | identical ad impressions |

**One root cause:** BGD demands an **exact full-data gradient** before it moves. Exactness is useful, but for huge data it is too expensive.

**PRACTICE P1 (answered).** 1. Recommendation model on 500 GB of logs → **B. memory and I/O pressure**. 2. Fraud system that must adapt immediately → **A. slow feedback**. 3. 10 million identical ad impressions → **C. redundant work**.

This raises the question that starts Section 2: can we update θ **without waiting for the whole dataset**?`,
    formulas: [
      { name: 'Average training cost', tex: R`J(\boldsymbol\theta) = \frac1m\sum_{i=1}^{m}J_i(\boldsymbol\theta)`, sym: '$J_i$ = loss of example i.', when: 'Every GD variant minimises this same objective.' },
      { name: 'Full (batch) gradient', tex: R`\nabla J(\boldsymbol\theta) = \frac1m\sum_{i=1}^{m}\nabla J_i(\boldsymbol\theta)`, sym: 'Average of all m sample gradients.', when: 'BGD; the "exact" direction.' }
    ],
    examples: [
      { title: 'Count the updates (worked)', body: R`m = 10,000,000 rows, 3 epochs.
- BGD: 3 updates (each after reading 10 M rows).
- SGD: 3 × 10 M = 30,000,000 updates.
- Mini-batch b = 1000: 3 × ⌈10⁷/1000⌉ = 30,000 updates.` }
    ],
    traps: [
      'Iteration ≠ epoch. In BGD they coincide (1 update per epoch); in SGD they do not.',
      'BGD is not "wrong"; it is the best choice for small data. Its problem is cost per update on huge data.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'm = 10,000,000. How many parameter updates does **one BGD epoch** make?', answer: 1, tol: 0, round: 'Exact', verify: '1',
        sol: '**One** update after scanning all 10 M samples (Section 1 hook).' },
      { type: 'mcq', diff: 'E', q: 'A fraud system must adapt immediately to new transactions. The main BGD limitation is:', options: ['Redundant work', 'Slow feedback', 'Memory pressure', 'Deterministic path'], answer: 1,
        sol: 'P1(2) → A, slow feedback: BGD learns only after a full scan.', why: ['That is identical impressions.', 'Correct.', 'That is the 500 GB logs case.', 'That is an advantage.'] },
      { type: 'mcq', diff: 'E', q: 'A dataset contains 10 million **identical** ad impressions. The BGD limitation is:', options: ['Redundant work', 'Slow feedback', 'Memory pressure', 'Non-convexity'], answer: 0,
        sol: 'P1(3) → C: similar samples give similar gradients, so averaging all of them wastes computation.', why: ['Correct.', 'No.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** advantages of Batch GD listed in Section 1.', options: ['Stable direction', 'Deterministic, repeatable path', 'Fastest first update', 'Smooth convergence on simple convex losses'], answer: [0, 1, 3],
        sol: 'The fastest first update belongs to SGD.', why: ['Correct.', 'Correct.', 'BGD has the slowest first update.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'What is the single root cause of BGD\'s limitations on huge data?', options: ['It uses squared error', 'It demands an exact full-data gradient before each move', 'It needs a learning rate', 'It cannot use matrices'], answer: 1,
        sol: 'Section 1 summary.', why: ['Not the issue.', 'Correct.', 'All GD variants do.', 'False.'] }
    ],
    source: 'Worksheet L6 pp.1–2; Bottou, "Large-Scale ML with SGD" (2010).'
  },
  /* ---------------------------------------------------------------- L06.2 */
  {
    id: 'L06.2', title: 'SGD: update rule, workflow, shuffling, learning rate, misconceptions', badge: 'class', pages: '2–4', ws: 'Section 2, PRACTICE P2',
    concept: R`
:::think Think–pair–share
What is the smallest amount of data that still gives a direction to move θ? **One example.** The new danger: that one example's direction may be **noisy** (far from the true average direction).
:::

**SGD** asks **one randomly chosen example** for a quick direction and updates **immediately**.

*Analogy:* BGD polls the whole class before deciding; SGD asks one random student, acts at once, then asks another. Any single answer may be off, but decisions happen instantly.

*Core intuition:* each example gives a small "opinion" about how θ should move. One opinion may be biased, but chosen randomly, many opinions **average out to the full-data direction**. SGD does **not** change the loss function; it changes **how the gradient is estimated** before each update.

$$i_t \sim \text{Uniform}\{1,\dots,m\},\qquad \mathbf g_t = \nabla J_{i_t}(\boldsymbol\theta_t),\qquad \boldsymbol\theta_{t+1} = \boldsymbol\theta_t - \alpha\,\mathbf g_t$$

$\mathbf g_t$ is the gradient of the example picked at iteration t, evaluated at the **current** parameters $\boldsymbol\theta_t$.

:::key Key insight
SGD does not train on one sample forever. **One update uses one sample, but one epoch uses every sample once.** m = 1000 → 1000 updates per epoch; E epochs → $E\times m$ updates (BGD: only E).
:::

**SGD workflow:** 1. Initialise θ; choose α and epochs. 2. **Shuffle** at the start of each epoch. 3. Visit samples one by one in shuffled order. 4. For each: prediction → sample loss → sample gradient → **immediate update**. 5. Repeat for several epochs, watching the training/validation loss **trend**.

:::warn Shuffling
Real datasets are often ordered (by date, by class, by city). Without shuffling, consecutive SGD updates follow the ordering pattern instead of the true learning signal. Randomisation protects SGD from biased update sequences.
:::

**Learning rate and noise:** small α → safe but slow; large α → dangerous, a noisy gradient can cause a huge jump; **constant α** → θ may keep **bouncing near the optimum** instead of settling; **decreasing α** (a schedule) → explore with big steps early, settle with small steps later.

*Note:* a single SGD step can **temporarily increase** the full training loss. What matters is the downward **trend**.

| Misconception | Correction |
|---|---|
| SGD ignores most of the dataset | one update uses one sample, but an epoch uses all |
| Loss must decrease every update | the full loss can rise after a noisy update |
| More updates always means faster convergence | each update is cheaper but less accurate; wall-clock time and stability matter |
| "Stochastic" means random parameters | the randomness is in **sample selection**; the rule is precise |

**PRACTICE P2 (answered).** 1. One SGD update uses **1** sample. 2. m examples → **m** updates per epoch. 3. We must **shuffle** the dataset each epoch. 4. An outlier creates a large gradient → **large, unstable (noisy)** updates.`,
    formulas: [
      { name: 'SGD update', tex: R`\boldsymbol\theta_{t+1} = \boldsymbol\theta_t - \alpha\,\nabla J_{i_t}(\boldsymbol\theta_t),\quad i_t\sim\text{Uniform}\{1..m\}`, sym: 'One random example per update.', when: 'Online / streaming / huge data.' },
      { name: 'Updates after E epochs', tex: R`\text{BGD: } E,\qquad \text{SGD: } E\cdot m`, sym: '', when: 'Counting questions.' },
      { name: 'Unbiasedness (why it works)', tex: R`\mathbb E_{i}\big[\nabla J_i(\boldsymbol\theta)\big] = \frac1m\sum_{i=1}^{m}\nabla J_i(\boldsymbol\theta) = \nabla J(\boldsymbol\theta)`, sym: 'Average over a uniform random pick = full gradient.', when: '"Is the SGD gradient biased?" → no, but it has variance.' }
    ],
    examples: [
      { title: 'Why shuffle? (worked)', body: R`House data sorted by city: first 5,000 rows Mumbai (expensive), next 5,000 Patna (cheap). Unshuffled SGD spends the first half of each epoch pushing the intercept up toward Mumbai prices, then the second half pulling it down. The parameters chase the ordering, not the real relationship, and end each epoch biased toward whichever city came last.` }
    ],
    code: [{ title: 'SGD from scratch (and scikit-learn SGDRegressor)', scratch: 'L06_sgd_minibatch_scratch.py', lib: 'L06_sgd_sklearn.py' }],
    traps: [
      '"Stochastic" refers to **random sample selection**, not random parameters or a random update rule.',
      'The SGD gradient is **unbiased** (right on average) but **noisy** (high variance).',
      'With a constant α, SGD keeps bouncing around the optimum; a decaying α lets it settle.',
      'A single SGD step can increase the full loss; judge by the trend.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'A dataset has m = 1000 examples. How many parameter updates are in **one SGD epoch**?', answer: 1000, tol: 0, round: 'Exact', verify: '1000',
        sol: 'One update per sample → **1000**.' },
      { type: 'int', diff: 'E', q: 'm = 500 examples, 4 epochs of SGD. Total updates?', answer: 2000, tol: 0, round: 'Exact', verify: '4*500',
        sol: '$E\\times m = 4\\times500 = $ **2000** (BGD would make 4).' },
      { type: 'mcq', diff: 'E', q: 'Why do we shuffle the training data at the start of each SGD epoch?', options: ['To make the loss function convex', 'To prevent ordered data from creating biased update sequences', 'To reduce the number of samples', 'Because NumPy requires it'], answer: 1,
        sol: 'Warning box, Section 2.', why: ['Convexity is unrelated.', 'Correct.', 'Shuffling keeps all samples.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'In "Stochastic Gradient Descent", what is random?', options: ['The parameters', 'The update rule', 'Which training sample is used for each update', 'The loss function'], answer: 2,
        sol: 'Misconception table: randomness is in sample selection; the rule is precise.', why: ['No.', 'No.', 'Correct.', 'SGD minimises the same loss as BGD.'] },
      { type: 'mcq', diff: 'M', q: 'With a **constant** learning rate, SGD near the optimum typically:', options: ['converges exactly in one step', 'keeps bouncing around the optimum', 'diverges always', 'stops updating'], answer: 1,
        sol: 'Each sample gradient is non-zero even at the optimum, so θ keeps jittering. A decaying α settles it.', why: ['No.', 'Correct.', 'Not if α is reasonable.', 'Updates continue.'] },
      { type: 'mcq', diff: 'H', tag: 'GATE-style', q: 'Picking i uniformly at random, the expected value of the sample gradient ∇J_i(θ) equals:', options: ['zero', 'the full-batch gradient ∇J(θ)', 'the largest sample gradient', 'm times the full gradient'], answer: 1,
        sol: '$\\mathbb E[\\nabla J_i] = \\frac1m\\sum\\nabla J_i = \\nabla J$: the SGD estimate is **unbiased**.', why: ['Only at the optimum.', 'Correct.', 'No.', 'The 1/m in J removes the factor m.'] }
    ],
    source: 'Worksheet L6 pp.2–4; Robbins & Monro (1951); Bottou et al., "Optimization Methods for Large-Scale ML" (2018).'
  },
  /* ---------------------------------------------------------------- L06.3 */
  {
    id: 'L06.3', title: 'BGD vs SGD mathematically and visually', badge: 'class', pages: '4–5', ws: 'Sections 3–4',
    concept: R`
**Same objective, different gradient estimator.**

| Aspect | Batch GD | Stochastic GD |
|---|---|---|
| Gradient used | exact average over all m samples | gradient of one random sample |
| Update timing | after the full dataset | immediately after one sample |
| Updates per epoch | 1 | m |
| Cost per update | $O(md)$ | $O(d)$ |
| Cost per epoch | $O(md)$ | $O(md)$ overall, delivered as m small updates |
| Memory pattern | full pass before an update | can stream one sample at a time |
| Path | smooth, stable | noisy, often fast early progress |

**Why SGD gradients are noisy.** The full gradient is the average of all sample gradients. SGD picks one, so its gradient is a **random variable**. It is **unbiased** (its average equals the full gradient) but one pick can be far from the average. **Outliers, class imbalance and rare patterns increase the variance** → zig-zag path.

**Why noise can sometimes help.** In non-convex models (neural networks) the optimiser can get stuck in shallow local minima or flat regions; SGD's randomness can bounce it out. Too much noise slows or prevents convergence, so α and batch size must be chosen carefully.

**Visual intuition (Section 4).** BGD: smooth arrows toward the centre. SGD: arrows jump left and right while trending inward. Loss vs epoch: BGD smooth, SGD bumpy downward trend. In the parameter plane every arrow is one real step of θ; both head for the same optimum. On a loss plot, BGD has **1 point per epoch**, SGD has **m points per epoch**.

:::think Think & discuss (answered)
(i) BGD arrows do not change direction wildly because each one averages **all** sample gradients, so individual quirks cancel. (ii) Yes — one "bad-looking" SGD step is still an unbiased draw; over many steps the random errors cancel and the trend is downhill, and each step was cheap. (iii) **Wall-clock time** (or the number of samples processed) is the fairest x-axis: an SGD "iteration" is far cheaper than a BGD "iteration", and epochs hide how soon learning starts.
:::`,
    formulas: [
      { name: 'Cost per update', tex: R`\text{BGD: } O(md)\qquad \text{SGD: } O(d)`, sym: 'm examples, d features.', when: 'Complexity MCQs.' },
      { name: 'Cost per epoch', tex: R`\text{both } O(md)`, sym: 'SGD spreads it over m updates.', when: 'Trap: per-epoch cost is the same.' }
    ],
    plots: [
      { id: 'P06-paths', title: 'Parameter plane: Batch GD (smooth) vs SGD (noisy)', notice: 'Both start at the same θ and head to the same optimum (×). BGD steps along the exact average direction; each SGD step follows one random sample, so the path zig-zags and keeps jittering near the optimum with a constant α.',
        spec: { type: 'multi', panels: [
          { type: 'xy', w: 320, h: 280, title: 'Batch GD', xlim: [-5, 3], ylim: [-3, 4.5], xlabel: 'θ₀', ylabel: 'θ₁', series: [...rings, { t: 'line', pts: BG.pts, c: 's1', markers: true, mr: 2.5 }, opt] },
          { type: 'xy', w: 320, h: 280, title: 'Stochastic GD', xlim: [-5, 3], ylim: [-3, 4.5], xlabel: 'θ₀', ylabel: 'θ₁', series: [...rings, { t: 'line', pts: SG.pts, c: 's4', markers: true, mr: 2 }, opt] }] } },
      { id: 'P06-losscurves', title: 'Full training loss after each update', notice: 'BGD (12 updates) decreases smoothly. SGD (40 updates) has a bumpy downward trend and sometimes goes **up** after a step, then levels off at a noisy floor.',
        spec: { type: 'xy', w: 540, h: 290, xlim: [0, 40], ylim: [0, 16], xlabel: 'update number (iteration)', ylabel: 'full training loss J(θ)', legend: 'tr',
          series: [{ t: 'line', pts: BG.loss.map((v, i) => [i, v]), c: 's1', markers: true, label: 'Batch GD' }, { t: 'line', pts: SG.loss.map((v, i) => [i, v]), c: 's4', markers: true, mr: 2, label: 'SGD' }] } }
    ],
    examples: [
      { title: 'Cost arithmetic (worked)', body: R`m = 1,000,000, d = 100. One BGD update touches m·d = 10⁸ numbers. One SGD update touches d = 100 numbers — a million times cheaper — but SGD needs many more updates, and each is noisier. Per epoch, both touch 10⁸ numbers.` }
    ],
    traps: [
      'Per **epoch** BGD and SGD cost the same $O(md)$; per **update** SGD is m times cheaper.',
      'Noise in SGD comes from **which sample** is picked, and grows with outliers and imbalance.',
      'The SGD gradient is unbiased; "noisy" does not mean "wrong on average".'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Cost of **one** SGD update with d features:', options: ['O(md)', 'O(d)', 'O(m)', 'O(d³)'], answer: 1,
        sol: 'One sample, d gradient entries.', why: ['That is BGD.', 'Correct.', 'No.', 'That is matrix inversion.'] },
      { type: 'mcq', diff: 'M', q: 'Per **epoch**, the computational cost of BGD vs SGD is:', options: ['BGD O(md), SGD O(d)', 'both O(md)', 'BGD O(d), SGD O(md)', 'both O(d)'], answer: 1,
        sol: 'SGD does m updates of cost O(d) = O(md) per epoch.', why: ['That compares per-update costs.', 'Correct.', 'Reversed.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Which increase the variance (noise) of SGD gradients? (select all)', options: ['Outliers', 'Class imbalance', 'Rare patterns', 'Using the full batch'], answer: [0, 1, 2],
        sol: 'Section 3. The full batch has no sampling noise.', why: ['Correct.', 'Correct.', 'Correct.', 'That removes noise.'] },
      { type: 'mcq', diff: 'M', q: 'How can SGD\'s noise **help** in neural networks?', options: ['It makes the loss convex', 'It can bounce the optimiser out of shallow local minima / flat regions', 'It removes the need for a learning rate', 'It guarantees the global minimum'], answer: 1,
        sol: 'Section 3, "Why noise can sometimes help".', why: ['No.', 'Correct.', 'No.', 'No guarantee.'] },
      { type: 'mcq', diff: 'M', q: 'On a loss-vs-iteration plot for one epoch with m = 50, how many points does SGD contribute vs BGD?', options: ['50 vs 1', '1 vs 50', '50 vs 50', '1 vs 1'], answer: 0,
        sol: 'SGD: m points per epoch; BGD: 1.', why: ['Correct.', 'Reversed.', 'No.', 'No.'] }
    ],
    source: 'Worksheet L6 pp.4–5; Goodfellow et al. §8.3.1.'
  },
  /* ---------------------------------------------------------------- L06.4 */
  {
    id: 'L06.4', title: 'Dry run: one epoch of BGD and SGD by hand', badge: ['class', 'board'], pages: '5–7', ws: 'Section 5, PRACTICE P3 + whiteboard',
    concept: R`
Data $(x, y)$: (1, 2), (2, 4), (3, 6), (4, 8) — all exactly on $y = 2x$. Start $\theta_0 = \theta_1 = 0$, $\alpha = 0.1$. Per-example **half-squared** loss $J_i = \frac12(\hat y_i - y_i)^2$ with $\hat y_i = \theta_0 + \theta_1x_i$ and error $e_i = \hat y_i - y_i$, so $\partial J_i/\partial\theta_0 = e_i$ and $\partial J_i/\partial\theta_1 = e_ix_i$ (derivation below).

**Batch GD, one epoch** (all predictions at θ = [0, 0]):

| i | x | y | ŷ | e = ŷ − y | grad θ₀ | grad θ₁ |
|---|---|---|---|---|---|---|
| 1 | 1 | 2 | 0 | −2 | −2 | −2 |
| 2 | 2 | 4 | 0 | −4 | −4 | −8 |
| 3 | 3 | 6 | 0 | −6 | −6 | −18 |
| 4 | 4 | 8 | 0 | −8 | −8 | −32 |
| | | | | **average** | **−5** | **−15** |

$\boldsymbol\theta = [0, 0] - 0.1[-5, -15] = [0.5, 1.5]$ — **1 update total**. *Quick check:* θ did **not** change after sample 1 was processed; BGD only updates after the whole table.

**SGD, one epoch.** Shuffled order: sample 2, 4, 1, 3. θ changes after **every** row.

| Step | Sample | x | y | ŷ (current θ) | e | gradient [e, e·x] | new θ |
|---|---|---|---|---|---|---|---|
| 1 | 2 | 2 | 4 | 0.000 | −4 | [−4, −8] | [0.400, 0.800] |
| 2 | 4 | 4 | 8 | 0.4 + 3.2 = 3.600 | −4.4 | [−4.4, −17.6] | [0.840, 2.560] |
| 3 | 1 | 1 | 2 | 0.84 + 2.56 = 3.400 | +1.4 | [1.4, 1.4] | [0.700, 2.420] |
| 4 | 3 | 3 | 6 | 0.7 + 7.26 = **7.960** | **+1.96** | **[1.96, 5.88]** | **[0.504, 1.832]** |

**PRACTICE P3 (step 4):** prediction $0.7 + 2.42(3) = 7.96$; error $7.96 - 6 = 1.96$; gradient $[1.96, 1.96\times3] = [1.96, 5.88]$; new θ = $[0.7 - 0.196,\ 2.42 - 0.588] = [0.504, 1.832]$.

:::think Why did the sign of the error flip at step 3?
All points lie on $y = 2x$, yet sample 1 gave a **positive** error. Because step 2 (the large x = 4 sample) **overshot**: θ₁ jumped to 2.56 > 2 and θ₀ = 0.84 > 0, so the line now sits **above** the data and predicts too high. SGD's single-sample steps overshoot and then correct — the zig-zag of Section 4 in numbers.
:::`,
    deriv: [
      { id: 'D06-samplegrad', title: 'Gradient of one example\'s half-squared loss', badge: ['class', 'board'],
        steps: [
          { m: R`J_i(\theta_0,\theta_1) = \tfrac12(\theta_0 + \theta_1x_i - y_i)^2`, t: 'Loss for one example.' },
          { m: R`\frac{\partial J_i}{\partial\theta_0} = \tfrac12\cdot 2(\theta_0 + \theta_1x_i - y_i)\cdot 1 = \hat y_i - y_i = e_i`, why: 'Chain rule; inner derivative w.r.t. θ₀ is 1. The ½ cancels the 2.' },
          { m: R`\frac{\partial J_i}{\partial\theta_1} = \tfrac12\cdot 2(\theta_0 + \theta_1x_i - y_i)\cdot x_i = e_i\,x_i`, why: 'Inner derivative w.r.t. θ₁ is $x_i$.' }
        ],
        result: R`\nabla J_i(\boldsymbol\theta) = \begin{bmatrix} e_i \\ e_i x_i\end{bmatrix},\qquad e_i = \hat y_i - y_i`,
        after: 'This is the per-sample version of $\\frac1m X^T(X\\boldsymbol\\theta - \\mathbf y)$ from L5 with the ½-MSE convention (no factor 2).' }
    ],
    formulas: [
      { name: 'Per-sample gradient (½-squared loss)', tex: R`\nabla J_i = [\,e_i,\ e_ix_i\,]^T,\quad e_i = \hat y_i - y_i`, sym: 'With the full MSE (no ½) multiply by 2.', when: 'Every SGD/mini-batch hand step.' },
      { name: 'BGD gradient = average', tex: R`\bar{\mathbf g} = \frac1m\sum_i \nabla J_i`, sym: '', when: 'Batch table.' }
    ],
    examples: [
      { title: 'Where the step-2 numbers come from (worked)', body: R`θ = [0.4, 0.8], sample (4, 8): ŷ = 0.4 + 0.8·4 = 3.6, e = 3.6 − 8 = −4.4, gradient = [−4.4, −4.4·4] = [−4.4, −17.6]. New θ = [0.4 + 0.44, 0.8 + 1.76] = [0.84, 2.56].` }
    ],
    code: [{ title: 'Reproduces every table in this section', scratch: 'L06_sgd_minibatch_scratch.py' }],
    traps: [
      'In SGD the **next** sample uses the **updated** θ. In BGD every row uses the **same initial** θ.',
      'This worksheet uses the **½-squared** loss, so there is no factor 2 in the gradient (L5 used full MSE with 2/m).',
      'Error here is **ŷ − y** (prediction minus target). With y − ŷ you must flip the sign of the update.'
    ],
    questions: [
      { type: 'int', diff: 'M', q: 'BGD dry run (data (1,2),(2,4),(3,6),(4,8), θ = 0, α = 0.1, ½-squared loss). What is θ₁ after one epoch?', answer: 1.5, tol: 0.001, round: '1 decimal', verify: '0-0.1*(-2-8-18-32)/4',
        sol: 'Average grad θ₁ = (−2 − 8 − 18 − 32)/4 = −15; θ₁ = 0 + 1.5 = **1.5**.' },
      { type: 'int', diff: 'M', q: 'SGD step 4 (θ = [0.7, 2.42], sample x = 3, y = 6, α = 0.1). New θ₁? (3 decimals)', answer: 1.832, tol: 0.0005, round: '3 decimals', verify: '2.42-0.1*((0.7+2.42*3-6)*3)',
        sol: 'ŷ = 7.96, e = 1.96, grad θ₁ = 5.88; θ₁ = 2.42 − 0.588 = **1.832** (P3).' },
      { type: 'int', diff: 'M', q: 'SGD step 4: what is the new θ₀? (3 decimals)', answer: 0.504, tol: 0.0005, round: '3 decimals', verify: '0.7-0.1*(0.7+2.42*3-6)',
        sol: '0.7 − 0.1 × 1.96 = **0.504**.' },
      { type: 'mcq', diff: 'E', q: 'In the BGD table, did θ change after sample 1 was processed?', options: ['Yes', 'No — BGD updates only after all samples', 'Only θ₀ changed', 'Only θ₁ changed'], answer: 1,
        sol: 'One update per epoch, after averaging all four gradients.', why: ['That is SGD behaviour.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'At SGD step 3 the error for sample 1 is **positive** though the data lie on y = 2x. Why?', options: ['Sample 1 is an outlier', 'Step 2 overshot (θ₁ = 2.56 > 2), so the line now predicts too high', 'The learning rate became negative', 'The data were not shuffled'], answer: 1,
        sol: 'Think & discuss Section 5.', why: ['It lies exactly on the line.', 'Correct.', 'No.', 'They were shuffled.'] },
      { type: 'mcq', diff: 'M', q: R`For $J_i = \frac12(\theta_0 + \theta_1x_i - y_i)^2$, $\partial J_i/\partial\theta_1$ is:`, options: [R`$e_i$`, R`$e_ix_i$`, R`$2e_ix_i$`, R`$e_i^2$`], answer: 1,
        sol: 'The ½ cancels the 2 from the square; the inner derivative is $x_i$.', why: ['That is ∂/∂θ₀.', 'Correct.', 'That is without the ½.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
x = np.array([1, 2, 3, 4.]); y = 2 * x
th = np.zeros(2)
for i in [1, 3]:                       # samples 2 and 4 (0-based 1, 3)
    e = th[0] + th[1] * x[i] - y[i]
    th = th - 0.1 * np.array([e, e * x[i]])
print(np.round(th, 2))`, answer: '[0.84 2.56]',
        sol: 'First two SGD steps of the dry run: [0.4, 0.8] then [0.84, 2.56].' }
    ],
    source: 'Worksheet L6 pp.5–7; Whiteboard L07 (1 Sep) pp.3–4.'
  },
  /* ---------------------------------------------------------------- L06.5 */
  {
    id: 'L06.5', title: 'Pseudocode; SGD advantages and limitations', badge: ['class', 'board'], pages: '7–8', ws: 'Sections 6–8, PRACTICE P4',
    concept: R`
**Batch GD pseudocode**
\`\`\`
initialise θ
for epoch = 1 to E:
    grad = 0
    for i = 1 to m:
        grad = grad + ∇J_i(θ)
    grad = grad / m
    θ ← θ − α · grad          # one update per EPOCH
return θ
\`\`\`

**PRACTICE P4 — SGD pseudocode (answer B, D, E, C, A; matches the whiteboard):**
\`\`\`
B. for epoch = 1 to E:
D.     shuffle(Dataset)
E.     for i = 1 to m:
C.         ∇J_i(θ) = gradient_of_sample(x_i, y_i, θ)
A.         θ := θ − α ∇J_i(θ)    # one update per SAMPLE
\`\`\`

:::key Implementation warning
In SGD do **not** accumulate gradients through the whole sample loop before updating. That silently turns the code back into Batch GD.
:::

:::think Spot the difference (answered)
Exactly one line moves: the **update θ ← θ − α·grad moves from after the sample loop (BGD) to inside it (SGD)**. (The accumulate/average lines disappear and a shuffle is added each epoch.)
:::

**Advantages of SGD (Section 7):** faster first update (after one sample); lower memory (one sample, θ and one gradient); better scalability (per-update cost does not grow with m); suits massive datasets (an approximate direction is enough to start improving); better exploration (noise can escape flat/shallow regions in non-convex problems).

**Limitations (Section 8):** oscillating convergence (samples push in conflicting directions); noisy updates (an outlier causes a large jump); sensitive learning rate (α controls both step size and noise impact); many updates needed (each cheap but less informative); difficult stopping (iteration-level loss fluctuates); variance across runs (different shuffles → different paths).

**Course SGD lab ($y = wx$).** Seed 42 **before every shuffle**, update after every sample with $dw = 2(wx_i - y_i)x_i$. For $x = [1,2,3]$, $y = [2,4,6]$, α = 0.001, 100 epochs → **1.88** (vs 1.22 for BGD with the same α and epochs: 3× more updates).`,
    formulas: [
      { name: 'Lab SGD step (y = wx)', tex: R`w \leftarrow w - \alpha\cdot 2(wx_i - y_i)x_i`, sym: 'Full squared loss of one sample (factor 2 kept).', when: 'Course lab "train_sgd".' }
    ],
    examples: [
      { title: 'Why the lab SGD reaches 1.88 but BGD only 1.22 (worked)', body: R`Same α = 0.001 and 100 epochs. BGD makes 100 updates using the **averaged** gradient. SGD makes 100 × 3 = 300 updates, each using one sample's (un-averaged) gradient. More, larger effective steps → closer to the true w = 2 in the same number of epochs.` }
    ],
    code: [{ title: 'Course labs: SGD and mini-batch for y = w·x', scratch: 'L06_lab_sgd_w.py', more: [['Mini-batch lab', 'L06_lab_minibatch_w.py']] }],
    traps: [
      'If your "SGD" loop sums gradients over all samples and updates once, it is **BGD**.',
      'Shuffle **inside** the epoch loop (every epoch), not once before training.',
      'Different shuffles → different SGD paths and slightly different final θ (variance across runs).'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Correct nested order of SGD pseudocode lines A–E (P4)?', options: ['B, D, E, C, A', 'D, B, E, C, A', 'B, E, D, A, C', 'E, B, D, C, A'], answer: 0,
        sol: 'for epoch → shuffle → for i → compute sample gradient → update.', why: ['Correct.', 'Shuffle must be inside the epoch loop.', 'Shuffle cannot be inside the sample loop; gradient before update.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Which single line changes position between BGD and SGD pseudocode?', options: ['The shuffle', 'The parameter update θ ← θ − α·grad (moves inside the sample loop)', 'The epoch loop', 'The return statement'], answer: 1,
        sol: 'Think & discuss Section 6.', why: ['BGD has no shuffle at all.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** limitations of SGD (Section 8).', options: ['Oscillating convergence', 'Difficult stopping (fluctuating loss)', 'Needs the full dataset in memory', 'Variance across runs'], answer: [0, 1, 3],
        sol: 'Memory is an SGD **advantage**.', why: ['Correct.', 'Correct.', 'That is BGD.', 'Correct.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output (course SGD lab).', code: R`import numpy as np
def train_sgd(X, Y, lr, epochs):
    X = np.array(X, float); Y = np.array(Y, float); w = 0.0
    for _ in range(epochs):
        idx = np.arange(len(X)); np.random.seed(42); np.random.shuffle(idx)
        for i in idx:
            w -= lr * 2 * (w * X[i] - Y[i]) * X[i]
    return round(float(w), 2)
print(train_sgd([1, 2, 3], [2, 4, 6], 0.001, 100))`, answer: '1.88',
        sol: '300 single-sample updates move w much closer to 2 than BGD\'s 100 averaged updates (1.22).' },
      { type: 'write', diff: 'M', q: 'Write `train_sgd(X, Y, learning_rate, epochs)` for y = w·x (no bias): w = 0; each epoch set `np.random.seed(42)`, shuffle the indices with `np.random.shuffle`, and update after every sample with dw = 2(w·xᵢ − yᵢ)·xᵢ. Return round(w, 2).',
        starter: 'import numpy as np\n\ndef train_sgd(X, Y, learning_rate, epochs):\n    pass\n',
        ref: 'import numpy as np\n\ndef train_sgd(X, Y, learning_rate, epochs):\n    X = np.array(X, float); Y = np.array(Y, float); w = 0.0\n    for _ in range(epochs):\n        idx = np.arange(len(X))\n        np.random.seed(42)\n        np.random.shuffle(idx)\n        for i in idx:\n            w -= learning_rate * 2 * (w * X[i] - Y[i]) * X[i]\n    return round(float(w), 2)',
        tests: 'assert train_sgd(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 500) == 0.5\nassert train_sgd([1, 2, 3], [2, 4, 6], 0.001, 100) == 1.88',
        file: 'aml-practice/L06_lab_sgd_w.py' }
    ],
    source: 'Worksheet L6 pp.7–8; Whiteboard L07 p.5 (P4 answer B, D, E, C, A); course lab "SGD".'
  },
  /* ---------------------------------------------------------------- L06.6 */
  {
    id: 'L06.6', title: 'Mini-batch GD: motivation, algorithm, dry runs', badge: 'class', pages: '9–10', ws: 'Sections 9–11, PRACTICE P5, HOMEWORK P6',
    concept: R`
:::hook Hook
SGD solved the waiting problem but created noisy movement. One sample is too noisy; all samples are too expensive. What is the middle ground?
:::

**Average a small group.** Instead of asking the whole class or one student, ask a **small group**: less noisy than one person, much faster than everyone.

**Mini-batch GD** splits the shuffled data into groups of size **b** and updates with the **average gradient of one mini-batch**. The batch size is the compromise dial: **b = 1 → SGD**, **b = m → Batch GD**. One epoch makes $\lceil m/b\rceil$ updates (the last batch may be smaller).

**Workflow:** shuffle each epoch → split into mini-batches of size b → average gradient of the first batch → update immediately → continue until every sample is used once → repeat for more epochs.

**Practical points:** typical b = 16, 32, 64, 128, 256 (common, not compulsory). Powers of two suit GPU/hardware kernels; the maths does not require them. A single sample under-uses a GPU's parallel cores; a mini-batch keeps them busy. Only the current mini-batch must be in memory.

\`\`\`
for epoch = 1 to E:
    shuffle(D); split D into B_1 … B_K
    for each mini-batch B_k:
        grad = (1/|B_k|) Σ_{i∈B_k} ∇J_i(θ)
        θ ← θ − α · grad        # one update per MINI-BATCH
\`\`\`

**PRACTICE P5 (b = 2, order 2, 4, 1, 3).**
- Batch 1 = {S2, S4} at θ = [0, 0]: $\mathbf g_2 = [-4, -8]$, $\mathbf g_4 = [-8, -32]$; average $[-6, -20]$; θ = **[0.6, 2.0]**.
- Batch 2 = {S1, S3} at θ = [0.6, 2.0]: ŷ₁ = 2.6, e = 0.6, $\mathbf g_1 = [0.6, 0.6]$; ŷ₃ = 0.6 + 6 = 6.6, e = **0.6**, $\mathbf g_3 = $ **[0.6, 1.8]**; average **[0.6, 1.2]**; θ after epoch 1 = **[0.54, 1.88]**.

**HOMEWORK P6 (b = 3, uneven split).** $B_1$ = {S2, S4, S1}, $B_2$ = {S3}; $\lceil 4/3\rceil = $ **2** mini-batches.
- Update 1: $\bar{\mathbf g}_1 = \frac13([-4,-8] + [-8,-32] + [-2,-2]) = [-4.667, -14]$; θ = [0.467, 1.400].
- Update 2: ŷ₃ = 0.467 + 1.4(3) = **4.667**; e₃ = 4.667 − 6 = **−1.333**; $\bar{\mathbf g}_2$ = **[−1.333, −4.0]**; θ = [0.467 + 0.133, 1.4 + 0.4] = **[0.600, 1.800]**.`,
    formulas: [
      { name: 'Mini-batch update', tex: R`\boldsymbol\theta \leftarrow \boldsymbol\theta - \alpha\,\frac{1}{|B_k|}\sum_{i\in B_k}\nabla J_i(\boldsymbol\theta)`, sym: '$|B_k| = b$ except possibly the last batch.', when: 'Deep learning; large-scale ML.' },
      { name: 'Updates per epoch', tex: R`K = \left\lceil \frac{m}{b}\right\rceil`, sym: 'Ceiling: a leftover partial batch still causes an update.', when: 'Counting questions.' }
    ],
    examples: [
      { title: 'Counting mini-batches (worked)', body: R`| m | b | ⌈m/b⌉ | last batch size |
|---|---|---|---|
| 4 | 2 | 2 | 2 |
| 4 | 3 | 2 | 1 |
| 1000 | 100 | 10 | 100 |
| 1000 | 64 | 16 | 40 (15 × 64 = 960) |
| 200 | 32 | 7 | 8 |` }
    ],
    code: [{ title: 'Mini-batch dry runs (b = 2, b = 3) and the course lab', scratch: 'L06_sgd_minibatch_scratch.py', more: [['Course lab: mini-batch y = w·x', 'L06_lab_minibatch_w.py']] }],
    traps: [
      '⌈m/b⌉ uses the **ceiling**: m = 1000, b = 64 gives 16 updates, not 15.',
      'b = 1 is SGD; b = m is BGD (P7(b) True).',
      'Average over the **actual** size of the batch: the last batch in P6 has size 1, so its "average" is just that one gradient.',
      'Powers of two are a hardware convenience, not a mathematical requirement.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'm = 1000, b = 100. How many mini-batch updates in one epoch?', answer: 10, tol: 0, round: 'Exact', verify: 'import math; math.ceil(1000/100)',
        sol: '⌈1000/100⌉ = **10** (P7(c) is False: not 1000).' },
      { type: 'int', diff: 'M', q: 'm = 1000, b = 64. Updates per epoch?', answer: 16, tol: 0, round: 'Exact', verify: 'import math; math.ceil(1000/64)',
        sol: '1000/64 = 15.6 → ⌈·⌉ = **16** (the last batch has 40 samples).' },
      { type: 'int', diff: 'M', q: 'P5 batch 2: θ = [0.6, 2.0], batch {(1,2), (3,6)}, α = 0.1, ½-squared loss. New θ₁? (2 decimals)', answer: 1.88, tol: 0.001, round: '2 decimals', verify: '2.0-0.1*((0.6*1+0.6*3)/2)',
        sol: 'Errors 0.6 and 0.6; grads θ₁: 0.6 and 1.8; average 1.2; θ₁ = 2.0 − 0.12 = **1.88**.' },
      { type: 'int', diff: 'H', q: 'HOMEWORK P6 update 2: θ = [0.467, 1.400] (use exact 1.4 and 0.4667), batch {(3, 6)}, α = 0.1. New θ₁?', answer: 1.8, tol: 0.002, round: '1 decimal', verify: '1.4-0.1*((0.46667+1.4*3-6)*3)',
        sol: 'ŷ = 4.667, e = −1.333, grad θ₁ = −4.0; θ₁ = 1.4 + 0.4 = **1.8**.' },
      { type: 'mcq', diff: 'E', q: 'Mini-batch GD with b = 1 is:', options: ['Batch GD', 'SGD', 'Newton\'s method', 'invalid'], answer: 1,
        sol: 'One sample per update = SGD (P7(b) True).', why: ['That is b = m.', 'Correct.', 'No.', 'It is valid.'] },
      { type: 'mcq', diff: 'M', q: 'Why are batch sizes like 32, 64, 128 popular?', options: ['The maths requires powers of two', 'GPU/hardware kernels handle them efficiently', 'They make the loss convex', 'They remove noise completely'], answer: 1,
        sol: 'Practical points, Section 10.', why: ['The maths does not require them.', 'Correct.', 'No.', 'Noise only decreases.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import math
for m, b in [(4, 3), (200, 32), (1000, 1000), (7, 1)]:
    print(math.ceil(m / b), end=" ")`, answer: '2 7 1 7',
        sol: '⌈4/3⌉ = 2, ⌈200/32⌉ = 7 (6.25 → 7), ⌈1000/1000⌉ = 1 (BGD), ⌈7/1⌉ = 7 (SGD). `end=" "` prints them on one line.' }
    ],
    source: 'Worksheet L6 pp.9–10; Goodfellow et al. §8.1.3 (batch and minibatch algorithms).'
  },
  /* ---------------------------------------------------------------- L06.7 */
  {
    id: 'L06.7', title: 'Comprehensive comparison: BGD vs SGD vs mini-batch', badge: 'class', pages: '11–12', ws: 'Section 12, PRACTICE P7',
    concept: R`
| Aspect | Batch GD | Stochastic GD | Mini-batch GD |
|---|---|---|---|
| Gradient used | average of all m | one sample | average over b samples |
| Samples per update | m | 1 | b |
| Updates per epoch | 1 | m | ⌈m/b⌉ |
| Speed of first update | slowest (full pass) | fastest (1 sample) | intermediate |
| Memory need | high if materialised | lowest | moderate |
| Stability | most stable | least stable | usually stable enough |
| Noise | very low | high (sampling noise) | lower as b grows |
| Convergence | smooth, may be slow per update | noisy, may oscillate near the optimum | balanced; common practical choice |
| Scalability | weak for massive data | strong for streaming / huge data | strong for large datasets |
| Parallelisation | vectorisable but memory-heavy | poor hardware use per update | excellent matrix parallelism |
| GPU friendliness | may exceed memory | under-uses the GPU | best fit for GPUs |
| Typical use | small datasets, teaching baseline | online learning, streaming | deep learning / large-scale ML |

:::take Takeaway
Batch GD is accurate but slow to update; SGD is fast to update but noisy; **mini-batch GD is the practical compromise** most real systems use.
:::

**PRACTICE P7 (answered).** (a) "Loss is guaranteed to decrease after every SGD update" → **False** (a noisy single-sample step can raise the full loss). (b) "Mini-batch with b = 1 is identical to SGD" → **True** (one sample per update). (c) "m = 1000, b = 100 → 1000 updates per epoch" → **False** (⌈1000/100⌉ = 10).

**Choosing a method:** small data that fits in memory → BGD (or the normal equation); streaming / online data → SGD; deep learning or large tabular data on GPUs → mini-batch.`,
    formulas: [
      { name: 'Spectrum', tex: R`b = 1\ (\text{SGD})\ \longleftarrow\ 1 < b < m\ (\text{mini-batch})\ \longrightarrow\ b = m\ (\text{BGD})`, sym: 'Batch size is the dial between noise and cost.', when: 'Comparison MCQs.' }
    ],
    plots: [
      { id: 'P06-threepaths', title: 'Three paths to the same optimum', notice: 'Batch GD: smooth. Mini-batch (b = 4): small corrections. SGD (b = 1): larger zig-zags. All start at the same point.',
        spec: { type: 'xy', w: 560, h: 330, xlim: [-5, 3], ylim: [-3, 4.5], xlabel: 'θ₀', ylabel: 'θ₁', legend: 'tr',
          series: [...rings, { t: 'line', pts: SG.pts, c: 's4', w: 1.5, label: 'SGD (b = 1)' }, { t: 'line', pts: MB.pts, c: 's2', w: 2, label: 'Mini-batch (b = 4)' }, { t: 'line', pts: BG.pts, c: 's1', w: 2.5, markers: true, mr: 2.5, label: 'Batch GD' }, opt] } }
    ],
    examples: [
      { title: 'Pick the method (worked)', body: R`| Scenario | Method |
|---|---|
| 500 rows, 4 features, teaching demo | BGD (or OLS) |
| Clickstream arriving one event at a time | SGD (online learning) |
| Training a CNN on 1 M images with a GPU | mini-batch (e.g. b = 64) |
| 50 M rows of tabular data on a laptop | mini-batch (stream batches from disk) |` }
    ],
    code: [{ title: 'SGDRegressor: fit() vs partial_fit() in mini-batches', lib: 'L06_sgd_sklearn.py' }],
    traps: [
      'Most stable = BGD; least stable = SGD; mini-batch is "usually stable enough".',
      'GPU friendliness: mini-batch is best; SGD under-uses the GPU; full batch may not fit in memory.',
      'Noise **decreases** as b increases.'
    ],
    questions: [
      { type: 'msq', diff: 'M', q: 'P7: select all **true** statements.', options: ['The loss is guaranteed to decrease after every SGD update', 'Mini-batch GD with b = 1 is identical to SGD', 'With m = 1000 and b = 100, one mini-batch epoch performs 1000 updates', 'Mini-batch with b = m is identical to Batch GD'], answer: [1, 3],
        sol: '(a) False, (b) True, (c) False (10 updates). b = m is BGD.', why: ['False.', 'True.', 'False.', 'True.'] },
      { type: 'mcq', diff: 'E', q: 'Which method is the best fit for GPUs in deep learning?', options: ['Batch GD', 'SGD', 'Mini-batch GD', 'Normal equation'], answer: 2,
        sol: 'Comparison table: excellent matrix parallelism, moderate memory.', why: ['May exceed memory.', 'Under-uses parallel cores.', 'Correct.', 'Not for neural networks.'] },
      { type: 'mcq', diff: 'E', q: 'Which method gives the **fastest first update**?', options: ['Batch GD', 'SGD', 'Mini-batch GD', 'All are equal'], answer: 1,
        sol: 'SGD updates after one sample.', why: ['Slowest.', 'Correct.', 'Intermediate.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'An online-learning system receives one transaction at a time and must adapt continuously. Best choice?', options: ['Batch GD', 'SGD', 'Normal equation', 'Mini-batch with b = m'], answer: 1,
        sol: 'Typical use of SGD: online learning, streaming.', why: ['Needs the whole dataset.', 'Correct.', 'Needs all data and an inverse.', 'That is BGD.'] },
      { type: 'mcq', diff: 'M', q: 'As the mini-batch size b increases (toward m), the gradient noise:', options: ['increases', 'decreases', 'stays the same', 'becomes negative'], answer: 1,
        sol: 'Averaging more samples reduces variance (roughly ∝ 1/b).', why: ['Opposite.', 'Correct.', 'No.', 'Meaningless.'] }
    ],
    source: 'Worksheet L6 pp.11–12; Keskar et al., "On Large-Batch Training" (2017).'
  }
  ]
});
})();
