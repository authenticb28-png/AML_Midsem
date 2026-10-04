/* Lecture 11 — Dimensionality reduction and PCA */
(function () {
const rnd = NUM.rng(31), G = () => NUM.gauss(rnd);
const diag = [], axis = [];
for (let i = 0; i < 60; i++) { const t = G() * 2.2, s = G() * 0.35; diag.push([5 + (t - s) / Math.SQRT2, 5 + (t + s) / Math.SQRT2]); axis.push([4.5 + G() * 2.1, 2 + G() * 0.22]); }
const ev = [48, 28, 13, 7, 3, 1];
const cum = ev.reduce((a, v) => (a.push((a.length ? a[a.length - 1] : 0) + v), a), []);
LECTURES.push({
  num: 11, short: 'PCA', title: 'Dimensionality Reduction and PCA — centering, projection, covariance, eigenvectors, explained variance',
  file: 'AML_Lecture 11_Worksheet_Filled.pdf', pages: 15,
  intro: R`**Exam weight: high.** Know selection vs extraction; centering/standardisation; the projection $z = u^Tx$ (unit u); covariance matrix anatomy; $Sv = \lambda v$, $|S - \lambda I| = 0$; **eigenvalue = variance along its PC**; sort eigenvalues → PC1, PC2…; **EVR and cumulative EVR** → choose k (90/95%, elbow, CV); failure cases; and fitting PCA **inside** CV folds. Practise the 2×2 PCA by hand. About 90 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L11.1 */
  {
    id: 'L11.1', title: 'Why dimensionality reduction; selection vs extraction; what PCA is', badge: 'class', pages: '1–3', ws: 'Part I, Section 1',
    concept: R`
:::hook Hook
Feature selection (L10) asked "which original columns remain?" But what if the information is **spread across several columns** and no single column captures it alone?
:::

**Many pixels, little extra signal.** To identify an object's shape in an m × m image: feed the full image, a tight n × n crop, or a perfect f × f crop of just the object? Accuracy **plateaus once the object is captured (f²)**, while cost keeps growing with the number of pixels (≈ $O(p^2)$). *Classroom question:* the extra background pixels contribute mostly **noise, redundant context and uninformative variation** — cost without discriminative signal.

High dimensionality is not automatically bad; the difficulty arises when **representation size grows faster than stable information**.

**Selection vs extraction.** *Feature selection* keeps original axes and **discards** whole features (e.g. drops $x_3$). *Feature extraction (PCA)* builds **new rotated orthogonal axes**, each a combination of the originals: $PC_1 = w_1x_1 + w_2x_2 + w_3x_3$.

**What is PCA?** It finds the few directions in which the data **vary most**, **rotates** the coordinate axes to point along them, keeps the top few (**principal components**) and discards the rest — "the best angle to look at the data so you see the most spread".

:::key Key insight
**PCA is an unsupervised, linear feature-extraction method** that finds a new set of **orthogonal** axes (principal components) along which the **variance** of the data is maximised.
:::`,
    formulas: [{ name: 'A principal component is a linear combination', tex: R`PC_j = v_{j1}x_1 + v_{j2}x_2 + \dots + v_{jp}x_p,\quad \|\mathbf v_j\| = 1`, sym: 'Weights = unit eigenvector entries.', when: 'Selection vs extraction questions.' }],
    plots: [
      { id: 'P11-pixels', title: 'Accuracy plateaus, cost keeps rising with pixels', notice: 'After the object is captured (f²), more background pixels add cost but almost no accuracy.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [0, 10], ylim: [0, 1.1], xlabel: 'number of pixels p', ylabel: 'metric (scaled)', xticks: [2, 5, 9], xtl: { 2: 'f²', 5: 'n²', 9: 'm²' }, yticks: false, legend: 'tl', series: [{ t: 'fn', f: p => 0.85 * (1 - Math.exp(-p / 0.9)), c: 's3', label: 'model accuracy' }, { t: 'fn', f: p => 0.011 * p * p, c: 's4', label: 'cost O(p²)' }, { t: 'band', x0: 2, x1: 10, c: 's7', op: 0.08 }, { t: 'text', x: 6, y: 0.95, s: 'diminishing returns zone' }] } },
      { id: 'P11-selvsext', title: 'Selection keeps original axes; PCA builds rotated axes', notice: 'Left: dropping a column keeps x₁, x₂ as they were. Right: PCA rotates to PC1 (along the spread) and PC2 (perpendicular).',
        spec: { type: 'multi', panels: [
          { type: 'xy', w: 300, h: 260, title: 'Feature selection', xlim: [0, 10], ylim: [0, 10], xlabel: 'x₁', ylabel: 'x₂', series: [{ t: 'scatter', pts: diag, c: 's7', r: 2.5 }, { t: 'arrow', x1: 0.3, y1: 0.3, x2: 9.5, y2: 0.3, c: 's1', w: 2.5 }, { t: 'arrow', x1: 0.3, y1: 0.3, x2: 0.3, y2: 9.5, c: 's1', w: 2.5 }] },
          { type: 'xy', w: 300, h: 260, title: 'Feature extraction (PCA)', xlim: [0, 10], ylim: [0, 10], xlabel: 'x₁', ylabel: 'x₂', series: [{ t: 'scatter', pts: diag, c: 's7', r: 2.5 }, { t: 'arrow', x1: 5, y1: 5, x2: 8.5, y2: 8.5, c: 's4', w: 2.5 }, { t: 'arrow', x1: 5, y1: 5, x2: 3.6, y2: 6.4, c: 's3', w: 2.5 }, { t: 'text', x: 8.6, y: 9.2, s: 'PC1' }, { t: 'text', x: 3.1, y: 6.9, s: 'PC2' }] }] } }
    ],
    examples: [{ title: 'Which tool? (worked)', body: R`| Situation | Tool |
|---|---|
| Two exact duplicate columns | selection (drop one) |
| Bedroom area and washroom area move together | PCA (one "size" component) |
| Rare but predictive binary flag | selection (PCA might discard its low variance) |
| 500-D embedding to plot on screen | PCA to 2-D/3-D |` }],
    traps: ['PCA is **unsupervised**: it never looks at y.', 'PCs are new axes; their meaning is a mix of the original features.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'PCA is best described as:', options: ['supervised feature selection', 'unsupervised linear feature extraction maximising variance', 'a non-linear classifier', 'a clustering algorithm'], answer: 1, sol: 'Key insight Section 1.', why: ['It uses no labels and builds new axes.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Feature selection vs PCA: which constructs **new** axes?', options: ['Feature selection', 'PCA', 'Both', 'Neither'], answer: 1, sol: 'Fig. 1.', why: ['Keeps original axes.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'The full m × m image gives nearly the same accuracy as the f × f crop but costs much more. The extra pixels mostly contribute:', options: ['essential signal', 'noise, redundant context and uninformative variation', 'labels', 'regularisation'], answer: 1, sol: 'Classroom question.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'P1(a): which scenarios call for PCA / extraction? (select all)', options: ['CGPA_copy duplicates CGPA', 'Bedroom and washroom area strongly correlated, both reflect size', 'A rare binary medical flag is strongly associated with the target', 'A 500-dim embedding must be plotted for inspection'], answer: [1, 3], sol: 'P1(a).', why: ['Selection.', 'PCA.', 'Selection (PCA could discard it).', 'PCA.'] },
      { type: 'int', diff: 'E', q: 'A 3-feature dataset. What is the maximum number of principal components?', answer: 3, tol: 0, round: 'Exact', verify: '3', sol: 'k ≤ p = **3**.' }
    ],
    source: 'Worksheet L11 pp.1–3; Jolliffe, *Principal Component Analysis* ch.1.'
  },
  /* ---------------------------------------------------------------- L11.2 */
  {
    id: 'L11.2', title: 'Notation, centering and standardisation', badge: 'class', pages: '3–4', ws: 'Sections 2.1–2.2',
    concept: R`
| Symbol | Size | Meaning |
|---|---|---|
| n, p, k | — | observations, original features, retained PCs (k ≤ p) |
| X | n × p | data; row i = observation $\mathbf x_i^T$ |
| µ | p × 1 | training feature means |
| $X_c$ | n × p | centred data |
| S | p × p | sample covariance matrix |
| $\mathbf v_j$, $\lambda_j$ | p × 1, — | unit eigenvector (PC j direction) and its eigenvalue (variance captured) |
| $W_k$ | p × k | first k eigenvectors as columns |
| Z | n × k | PC scores |

:::warn Split first
Fit means, standard deviations and PCA directions on the **training set only**; apply the same fitted transformation to validation and test.
:::

**Step 1 — mean centering:** $X_c = X - \mathbf 1\boldsymbol\mu^T$ → every column has mean 0.

**Standardisation** (different units, e.g. rupees vs years): $z_{ij} = \dfrac{x_{ij} - \mu_j}{s_j}$.
- **Centre only** when features share comparable units and their variances carry meaning.
- **Standardise** when units differ or no feature's scale should dominate (otherwise the large-unit feature dominates S and PC1).`,
    formulas: [{ name: 'Centering', tex: R`X_c = X - \mathbf 1\boldsymbol\mu^T`, sym: 'Subtract each column\'s training mean.', when: 'Always, before PCA.' }, { name: 'Standardising', tex: R`z_{ij} = \frac{x_{ij}-\mu_j}{s_j}`, sym: '$s_j$ training std.', when: 'Different units.' }],
    examples: [{ title: 'Why standardise? (worked)', body: R`Income (₹, variance ≈ 10¹⁰) and age (years, variance ≈ 100). Unstandardised S ≈ diag(10¹⁰, 100): PC1 ≈ the income axis alone, just because rupees are small units. After standardising both have variance 1 and PCA reflects their correlation, not their units.` }],
    code: [{ title: 'Centering, covariance, eigen-decomposition, projection', scratch: 'L11_pca_scratch.py', lib: 'L11_pca_sklearn.py' }],
    traps: ['Use the **training** means/stds for test data.', 'scikit-learn `PCA` centres automatically but does **not** standardise; add `StandardScaler` if needed.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'After mean centering, each feature column has mean:', options: ['1', '0', 'its std', 'undefined'], answer: 1, sol: 'Section 2.2.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Income in rupees and age in years. Before PCA you should:', options: ['only centre', 'standardise', 'do nothing', 'one-hot encode'], answer: 1, sol: 'Different units.', why: ['Income would dominate.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'E', q: 'Feature values [2, 4, 6]. Centred value of 6?', answer: 2, tol: 0, round: 'Exact', verify: '6-4', sol: 'Mean 4 → 6 − 4 = **2**.' },
      { type: 'mcq', diff: 'M', q: 'What is the size of W_k for p = 10 features, k = 3?', options: ['3 × 10', '10 × 3', 'n × 3', '10 × 10'], answer: 1, sol: 'p × k.', why: ['Transposed.', 'Correct.', 'That is Z.', 'That is S.'] },
      { type: 'mcq', diff: 'M', q: 'At test time the test data are centred using:', options: ['the test means', 'the training means', 'zero', 'the overall means'], answer: 1, sol: 'Warning box.', why: ['Leakage/inconsistency.', 'Correct.', 'No.', 'Leakage.'] }
    ],
    source: 'Worksheet L11 pp.3–4.'
  },
  /* ---------------------------------------------------------------- L11.3 */
  {
    id: 'L11.3', title: 'Axis-aligned vs diagonal variance; projection onto a direction', badge: 'class', pages: '4–5', ws: 'Sections 2.3–2.5, P2(a)',
    concept: R`
**Axis-aligned variance.** Number of rooms ($x_1$, Var ≈ 4.5) vs nearby grocery shops ($x_2$, Var ≈ 0.05): $x_1$ alone keeps > 98% of the variance → plain **feature selection is enough**.

**Diagonal data.** Bedroom area and washroom area rise together; the cloud lies **diagonally** and neither original axis follows the spread — projecting onto either axis discards a lot of variance. PCA **rotates** the axes so PC1 lies along the diagonal (≈ 96% of variance, "overall house size") and PC2 is perpendicular (the small contrast in how space is split). Keeping only PC1 turns 2 features into 1 with little loss. *The number of PCs is always ≤ the number of original features.*

**Problem formulation.** For a unit vector u (‖u‖ = 1), the scalar coordinate of centred $\mathbf x_i$ along u is $z_i = \mathbf u^T\mathbf x_i$ (proof below). Projected point $z_i\mathbf u$; residual $\mathbf e_i = \mathbf x_i - z_i\mathbf u$ is perpendicular to u, so **Pythagoras**: $\|\mathbf x_i\|^2 = z_i^2 + \|\mathbf e_i\|^2$. Since $\|\mathbf x_i\|$ is fixed, **maximising the variance of z ⇔ minimising the reconstruction error** $\sum\|\mathbf e_i\|^2$.

Variance along u: $\frac1n\sum_i(\mathbf u^T\mathbf X_i - \overline{\mathbf u^T\mathbf X})^2$. PCA finds the unit u maximising it. (Solving this is "beyond scope" in the worksheet; answer: **eigenvectors of the covariance matrix** — see L11.5.)

**PRACTICE P2(a).** $\mathbf x = [3, 1]^T$, $\mathbf u = \frac{1}{\sqrt2}[1, 1]^T$. (i) $\|\mathbf u\| = \sqrt{1/2 + 1/2} = 1$. (ii) $z = \frac{3}{\sqrt2} + \frac{1}{\sqrt2} = \frac{4}{\sqrt2} = 2\sqrt2 \approx 2.828$. (iii) $z\mathbf u = 2\sqrt2\cdot\frac{1}{\sqrt2}[1,1]^T = [2, 2]^T$. (iv) x is not on the line of u; the residual $\mathbf e = [1, -1]^T$ is orthogonal to u and is the information lost in the 1-D projection.`,
    deriv: [{ id: 'D11-projection', title: 'Scalar coordinate along a unit direction is uᵀx', badge: 'class',
      steps: [
        { m: R`\operatorname{proj}_{\mathbf u}(\mathbf x_i) = \frac{\mathbf u^T\mathbf x_i}{\|\mathbf u\|^2}\,\mathbf u`, t: 'Orthogonal projection onto the line spanned by u.' },
        { m: R`\|\mathbf u\| = 1 \Rightarrow \operatorname{proj}_{\mathbf u}(\mathbf x_i) = (\mathbf u^T\mathbf x_i)\,\mathbf u = z_i\mathbf u`, why: 'Unit vector.' },
        { m: R`\mathbf e_i = \mathbf x_i - z_i\mathbf u,\quad \mathbf u^T\mathbf e_i = z_i - z_i\,\mathbf u^T\mathbf u = 0`, why: 'Residual is perpendicular to u.' },
        { m: R`\|\mathbf x_i\|^2 = z_i^2 + \|\mathbf e_i\|^2`, why: 'Pythagoras.' }
      ],
      result: R`z_i = \mathbf u^T\mathbf x_i,\qquad \max_{\|\mathbf u\|=1}\sum z_i^2 \iff \min_{\|\mathbf u\|=1}\sum\|\mathbf e_i\|^2` }],
    formulas: [{ name: 'Projection score', tex: R`z_i = \mathbf u^T\mathbf x_i\ \ (\|\mathbf u\| = 1)`, sym: 'Centred $\\mathbf x_i$.', when: 'PC scores.' }, { name: 'Variance along u', tex: R`\operatorname{Var}(z) = \mathbf u^TS\mathbf u`, sym: 'S covariance matrix.', when: 'Link to eigenvectors.' }],
    plots: [
      { id: 'P11-axis', title: 'Axis-aligned spread: selecting x₁ keeps > 98% of variance', notice: 'Almost all variation is along rooms; grocery shops barely vary. Selection suffices.',
        spec: { type: 'xy', w: 520, h: 230, xlim: [0, 9], ylim: [1, 3], xlabel: 'number of rooms (x₁)', ylabel: 'nearby grocery shops (x₂)', series: [{ t: 'scatter', pts: axis, c: 's1', r: 3 }] } },
      { id: 'P11-rotate', title: 'Diagonal data: projections onto x₁ or x₂ lose spread; PC1 captures it', notice: 'PC1 runs along "overall size"; PC2 is the thin perpendicular contrast.',
        spec: { type: 'xy', w: 420, h: 380, xlim: [0, 10], ylim: [0, 10], xlabel: 'bedroom area (x₁)', ylabel: 'washroom area (x₂)', series: [{ t: 'scatter', pts: diag, c: 's7', r: 3 }, { t: 'fn', f: x => x, c: 's4', w: 2, dash: true }, { t: 'fn', f: x => 10 - x, d: [3.8, 6.2], c: 's3', w: 2, dash: true }, { t: 'text', x: 9, y: 8.3, s: 'PC1' }, { t: 'text', x: 3.4, y: 6.9, s: 'PC2' }] } },
      { id: 'P11-project', title: 'Projecting x = [3, 1] onto u = [1, 1]/√2', notice: 'z = uᵀx = 2√2 ≈ 2.83; projected point zu = [2, 2]; residual e = [1, −1] ⟂ u.',
        spec: { type: 'xy', w: 380, h: 340, xlim: [-0.5, 4], ylim: [-0.5, 4], xlabel: 'x₁', ylabel: 'x₂', series: [{ t: 'fn', f: x => x, c: 's7', dash: true }, { t: 'arrow', x1: 0, y1: 0, x2: 3, y2: 1, c: 's1', w: 2.5 }, { t: 'arrow', x1: 0, y1: 0, x2: 2, y2: 2, c: 's4', w: 2.5 }, { t: 'seg', segs: [[3, 1, 2, 2]], c: 's3', w: 2, dash: '4 3' }, { t: 'arrow', x1: 0, y1: 0, x2: 0.707, y2: 0.707, c: 'fg', w: 3 },
          { t: 'text', x: 3.25, y: 0.8, s: 'x' }, { t: 'text', x: 1.8, y: 2.3, s: 'zu = [2,2]' }, { t: 'text', x: 2.85, y: 1.7, s: 'e' }, { t: 'text', x: 0.95, y: 0.45, s: 'u' }] } }
    ],
    examples: [{ title: 'Variance along two directions (worked)', body: R`Centred points (−2, −2), (0, 0), (2, 2), (n − 1 = 2). Along $\mathbf u = [1, 0]$: scores −2, 0, 2 → variance 8/2 = 4. Along $\mathbf u = [1,1]/\sqrt2$: scores −2.83, 0, 2.83 → variance 16/2 = **8**. Along $[1, -1]/\sqrt2$: scores 0, 0, 0 → 0. The diagonal direction is PC1.` }],
    code: [{ title: 'Projection, residual orthogonality, reconstruction error', scratch: 'L11_pca_scratch.py' }],
    traps: ['u must be a **unit** vector for z = uᵀx to be the coordinate.', 'Max variance of projections = min reconstruction error (same problem).'],
    questions: [
      { type: 'int', diff: 'M', q: 'x = [3, 1], u = [1, 1]/√2. Score z = uᵀx (3 decimals)?', answer: 2.828, tol: 0.001, round: '3 decimals', verify: '4/2**0.5', sol: '4/√2 = 2√2 ≈ **2.828**.' },
      { type: 'int', diff: 'M', q: 'Same x and u. First component of the residual e = x − zu?', answer: 1, tol: 0.001, round: 'Exact', verify: '3-2', sol: 'zu = [2, 2] → e = [1, −1]; first component **1**.' },
      { type: 'mcq', diff: 'E', q: 'For z = uᵀx to be the coordinate along u, u must be:', options: ['the zero vector', 'a unit vector', 'equal to x', 'random'], answer: 1, sol: 'Section 2.5.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Maximising the variance of projections onto u is equivalent to:', options: ['maximising reconstruction error', 'minimising reconstruction error Σ‖eᵢ‖²', 'maximising ‖u‖', 'minimising the mean'], answer: 1, sol: 'Pythagoras with fixed ‖xᵢ‖.', why: ['Opposite.', 'Correct.', '‖u‖ = 1.', 'Already 0.'] },
      { type: 'int', diff: 'M', q: 'Centred points (−2, −2), (0, 0), (2, 2). Sample variance (÷ n−1) of the scores along [1,1]/√2?', answer: 8, tol: 0.001, round: 'Exact', verify: '(8+0+8)/2', sol: 'Scores −2√2, 0, 2√2 → (8 + 0 + 8)/2 = **8**.' }
    ],
    source: 'Worksheet L11 pp.4–5.'
  },
  /* ---------------------------------------------------------------- L11.4 */
  {
    id: 'L11.4', title: 'Covariance matrix, eigenvalues and eigenvectors', badge: 'class', pages: '6–7', ws: 'Sections 2.6, 3',
    concept: R`
**Covariance matrix S** (p × p) summarises how every pair of features varies together:

| | f₁ | f₂ | f₃ |
|---|---|---|---|
| **f₁** | Var(f₁) | Cov(f₁,f₂) | Cov(f₁,f₃) |
| **f₂** | Cov(f₂,f₁) | Var(f₂) | Cov(f₂,f₃) |
| **f₃** | Cov(f₃,f₁) | Cov(f₃,f₂) | Var(f₃) |

Diagonal = **variances**; off-diagonal = **covariances**; **symmetric** ($S_{jk} = S_{kj}$). With centred data: $S = \frac{1}{n-1}X_c^TX_c$.

**Covariance of two features:** $\text{Cov}(x, y) = \frac{1}{n-1}\sum(x_i - \bar x)(y_i - \bar y)$.
- **Positive:** above-average x with above-average y. **Negative:** above-average x with below-average y. **Near zero:** little *linear* co-movement — a non-linear relation may still exist.
- Covariance depends on units and is unbounded; **correlation** = covariance / (product of std devs) ∈ [−1, 1].
- *Classroom question:* zero covariance does **not** prove independence (y = x² symmetric about 0 has Cov = 0).

**Eigenvectors and eigenvalues.** For a square matrix A, an eigenvector v ≠ 0 keeps its direction under A and is only scaled: $A\mathbf v = \lambda\mathbf v$. A general vector w is rotated **and** stretched; an eigenvector is only stretched by λ.

**Connection to PCA:** with A = S, the **eigenvectors are the principal directions** and the **eigenvalues are the variances** captured along them.

**PRACTICE P1(b).** Study hours ↑ ⇒ practice score ↑: **positive**. Price ↑ ⇒ units sold ↓: **negative**. Symmetric U-shape around x = 0: **near zero** (symmetric cancellation).`,
    formulas: [{ name: 'Sample covariance', tex: R`\operatorname{Cov}(x,y) = \frac{1}{n-1}\sum_{i=1}^n(x_i-\bar x)(y_i-\bar y)`, sym: 'n − 1 (sample).', when: 'Entries of S.' }, { name: 'Covariance matrix', tex: R`S = \frac{1}{n-1}X_c^TX_c`, sym: 'p × p, symmetric.', when: 'PCA step 3.' }, { name: 'Eigen-equation', tex: R`A\mathbf v = \lambda\mathbf v,\ \mathbf v \neq \mathbf 0`, sym: '', when: 'Definition.' }],
    plots: [
      { id: 'P11-covsign', title: 'Sign of covariance', notice: 'Products (x − x̄)(y − ȳ) are positive in the top-right and bottom-left quadrants. A symmetric parabola balances them to zero.',
        spec: (function () { const a = [], b = [], c = []; for (let i = 0; i < 25; i++) { const x = G() * 1.5; a.push([x, 0.9 * x + G() * 0.5]); b.push([x, -0.9 * x + G() * 0.5]); } for (let x = -2; x <= 2.01; x += 0.25) c.push([x, x * x - 1.4]);
          return { type: 'multi', panels: [{ type: 'xy', w: 250, h: 220, title: 'Cov > 0', xlim: [-3, 3], ylim: [-3, 3], xlabel: 'x − x̄', ylabel: 'y − ȳ', series: [{ t: 'scatter', pts: a, c: 's3', r: 3 }] }, { type: 'xy', w: 250, h: 220, title: 'Cov < 0', xlim: [-3, 3], ylim: [-3, 3], xlabel: 'x − x̄', ylabel: 'y − ȳ', series: [{ t: 'scatter', pts: b, c: 's4', r: 3 }] }, { type: 'xy', w: 250, h: 220, title: 'Cov = 0 (y = x²)', xlim: [-3, 3], ylim: [-3, 3], xlabel: 'x − x̄', ylabel: 'y − ȳ', series: [{ t: 'scatter', pts: c, c: 's1', r: 3 }] }] }; })() },
      { id: 'P11-eigen', title: 'A = [[2, 1], [1, 2]]: a general vector is rotated; an eigenvector is only stretched', notice: 'w = [1, 0] → Aw = [2, 1] (direction changed). v = [1, 1] → Av = [3, 3] = 3v (same direction, λ = 3).',
        spec: { type: 'xy', w: 420, h: 360, xlim: [-0.5, 3.5], ylim: [-0.5, 3.5], xlabel: '', ylabel: '', series: [{ t: 'arrow', x1: 0, y1: 0, x2: 1, y2: 0, c: 's7', w: 2.5 }, { t: 'arrow', x1: 0, y1: 0, x2: 2, y2: 1, c: 's7', w: 2.5, dash: true }, { t: 'arrow', x1: 0, y1: 0, x2: 1, y2: 1, c: 's1', w: 3 }, { t: 'arrow', x1: 0, y1: 0, x2: 3, y2: 3, c: 's4', w: 2, dash: true },
          { t: 'text', x: 1, y: -0.25, s: 'w' }, { t: 'text', x: 2.2, y: 0.8, s: 'Aw' }, { t: 'text', x: 0.75, y: 1.15, s: 'v' }, { t: 'text', x: 2.7, y: 3.2, s: 'Av = 3v' }] } }
    ],
    examples: [{ title: 'Eigenvalues of a 2×2 (worked)', body: R`$A = \begin{bmatrix}2&1\\1&2\end{bmatrix}$. $|A - \lambda I| = (2-\lambda)^2 - 1 = 0 \Rightarrow \lambda = 3$ or $1$. For λ = 3: $(A - 3I)\mathbf v = 0 \Rightarrow -v_1 + v_2 = 0 \Rightarrow \mathbf v = [1,1]/\sqrt2$. For λ = 1: $\mathbf v = [1,-1]/\sqrt2$. Check: trace 4 = 3 + 1; det 3 = 3 × 1.` }],
    traps: ['Zero covariance ≠ independence.', 'Covariance is unit-dependent; correlation is not.', 'S uses ÷ (n − 1) in the worksheet; ÷ n gives the same eigenvectors.'],
    questions: [
      { type: 'int', diff: 'M', q: 'x = [1, 2, 3], y = [2, 4, 9]. Sample covariance (÷ n−1)?', answer: 3.5, tol: 0.001, round: '1 decimal', verify: '((1-2)*(2-5)+0+(3-2)*(9-5))/2', sol: 'x̄ = 2, ȳ = 5; products 3, 0, 4 → 7/2 = **3.5**.' },
      { type: 'int', diff: 'M', q: R`Largest eigenvalue of $\begin{bmatrix}2&1\\1&2\end{bmatrix}$?`, answer: 3, tol: 0.001, round: 'Exact', verify: '3', sol: '(2 − λ)² = 1 → λ = **3** or 1.' },
      { type: 'mcq', diff: 'E', q: 'The diagonal entries of a covariance matrix are:', options: ['covariances', 'variances of each feature', 'means', 'eigenvalues'], answer: 1, sol: 'Section 2.6.', why: ['Off-diagonal.', 'Correct.', 'No.', 'No (generally).'] },
      { type: 'mcq', diff: 'E', q: 'Product price ↑ ⇒ units sold ↓. Expected sign of covariance?', options: ['positive', 'negative', 'zero', 'undefined'], answer: 1, sol: 'P1(b).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Does zero covariance prove independence?', options: ['Yes', 'No — it only measures linear co-movement'], answer: 1, sol: 'Classroom question.', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'An eigenvector v of A satisfies:', options: ['Av ⟂ v', 'Av = λv (same line, scaled)', 'Av = 0 always', '‖Av‖ = ‖v‖'], answer: 1, sol: 'Definition.', why: ['No.', 'Correct.', 'Only for λ = 0.', 'Only if |λ| = 1.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[2, 1], [4, 3], [6, 5]], float)
print(np.cov(X, rowvar=False).tolist())`, answer: '[[4.0, 4.0], [4.0, 4.0]]', sol: 'Centred columns [−2, 0, 2] for both; Σ = 8; ÷ (n − 1 = 2) → 4 everywhere (worksheet 4.4).' }
    ],
    source: 'Worksheet L11 pp.6–7; Strang, *Linear Algebra* ch.6.'
  },
  /* ---------------------------------------------------------------- L11.5 */
  {
    id: 'L11.5', title: 'Finding the principal components; worked 3-house example', badge: ['class', 'res'], pages: '7–9', ws: 'Section 4, P1, P2(b) + researched Lagrange proof',
    concept: R`
Principal components = eigenpairs of S: $S\mathbf v = \lambda\mathbf v$, eigenvalues from $|S - \lambda I| = 0$.

**Ordering.** Sort eigenvalues **descending**. If $\lambda_1 > \lambda_3 > \lambda_2$ then PC1 = $\mathbf v_1$ (λ₁), **PC2 = $\mathbf v_3$** (λ₃), PC3 = $\mathbf v_2$ (λ₂). The eigenvector with the largest eigenvalue is PC1.

**Select and project:** keep the top k; each observation's score on a PC is $z_i = \mathbf u^T\mathbf X_i$ (u = unit eigenvector, $\mathbf X_i$ centred).

:::key Key insight
Each eigenvalue tells exactly how much variance is captured along its principal direction: $\text{Var}(z_j) = \mathbf v_j^TS\mathbf v_j = \lambda_j$. Larger eigenvalue = more information retained.
:::

**Worked example (Section 4.4).** Houses A, B, C: $(f_1, f_2) = (2, 1), (4, 3), (6, 5)$.
1. µ = [4, 3]; $X_c = \begin{bmatrix}-2&-2\\0&0\\2&2\end{bmatrix}$.
2. $S = \frac12 X_c^TX_c = \frac12\begin{bmatrix}8&8\\8&8\end{bmatrix} = \begin{bmatrix}4&4\\4&4\end{bmatrix}$.
3. $|S - \lambda I| = (4-\lambda)^2 - 16 = 0 \Rightarrow \lambda = 8, 0$. PC1: $\mathbf v_1 = \frac{1}{\sqrt2}[1, 1]^T$, λ₁ = **8** (both increase together). PC2: $\mathbf v_2 = \frac{1}{\sqrt2}[1, -1]^T$, λ₂ = **0** (no contrast variation).
4. $\mathbf z_1 = X_c\mathbf v_1 = [-2\sqrt2, 0, 2\sqrt2] \approx [-2.83, 0, 2.83]$.
5. PC1 captures 8/(8 + 0) = **100%**: all points lie on a single straight line ($y = x - 1$), so one component loses nothing. *Classroom question:* PC1 ≈ "overall house size".

**PRACTICE P2(b).** Centred $[-1,-1], [0,0], [1,1]$: $S = \frac12\begin{bmatrix}2&2\\2&2\end{bmatrix} = \begin{bmatrix}1&1\\1&1\end{bmatrix}$; $S\mathbf v_1 = 2\mathbf v_1$ (λ₁ = 2), $S\mathbf v_2 = 0$ (λ₂ = 0); EVR(PC1) = 2/2 = **100%**, lossless.

**Why eigenvectors? (researched)** Maximise $\mathbf u^TS\mathbf u$ subject to $\mathbf u^T\mathbf u = 1$ with a Lagrange multiplier (below).`,
    deriv: [
      { id: 'D11-eigen', title: 'The variance of the scores along an eigenvector equals its eigenvalue', badge: 'class',
        steps: [
          { m: R`z_i = \mathbf v^T\mathbf x_i \Rightarrow \bar z = \mathbf v^T\bar{\mathbf x} = 0`, why: 'Centred data.' },
          { m: R`\operatorname{Var}(z) = \frac{1}{n-1}\sum_i(\mathbf v^T\mathbf x_i)^2 = \mathbf v^T\Big(\frac{1}{n-1}\sum_i\mathbf x_i\mathbf x_i^T\Big)\mathbf v = \mathbf v^TS\mathbf v`, why: '$(\\mathbf v^T\\mathbf x)^2 = \\mathbf v^T\\mathbf x\\mathbf x^T\\mathbf v$.' },
          { m: R`S\mathbf v = \lambda\mathbf v \Rightarrow \mathbf v^TS\mathbf v = \lambda\,\mathbf v^T\mathbf v = \lambda`, why: 'Unit eigenvector.' }
        ], result: R`\operatorname{Var}(z_j) = \lambda_j` },
      { id: 'D11-lagrange', title: 'Why the best direction is the top eigenvector (Lagrange multipliers)', badge: 'res',
        steps: [
          { m: R`\max_{\mathbf u}\ \mathbf u^TS\mathbf u\quad\text{s.t.}\quad \mathbf u^T\mathbf u = 1`, t: 'Maximise variance along a unit direction.' },
          { m: R`\mathcal L(\mathbf u,\lambda) = \mathbf u^TS\mathbf u - \lambda(\mathbf u^T\mathbf u - 1)`, why: 'Lagrangian.' },
          { m: R`\nabla_{\mathbf u}\mathcal L = 2S\mathbf u - 2\lambda\mathbf u = \mathbf 0`, why: 'L4 identity 3 ($\\partial\\, \\mathbf u^TS\\mathbf u = 2S\\mathbf u$, S symmetric) and $\\partial\\, \\mathbf u^T\\mathbf u = 2\\mathbf u$.' },
          { m: R`S\mathbf u = \lambda\mathbf u`, why: 'Every stationary point is an eigenvector.' },
          { m: R`\mathbf u^TS\mathbf u = \lambda`, why: 'The objective value at an eigenvector is its eigenvalue, so pick the largest.' }
        ], result: R`\mathbf u^* = \mathbf v_1\ (\text{eigenvector of the largest eigenvalue}),\ \ \max\operatorname{Var} = \lambda_1`,
        after: 'PC2 maximises the same objective subject also to $\\mathbf u \\perp \\mathbf v_1$, giving $\\mathbf v_2$, and so on. Because S is symmetric, its eigenvectors are orthogonal, so the PC scores are uncorrelated: $W^TSW = \\Lambda$ (diagonal).' }
    ],
    formulas: [{ name: 'Characteristic equation', tex: R`|S - \lambda I| = 0`, sym: 'Gives the eigenvalues.', when: 'Hand PCA.' }, { name: 'Eigenvalue = PC variance', tex: R`\operatorname{Var}(z_j) = \mathbf v_j^TS\mathbf v_j = \lambda_j`, sym: '', when: 'EVR.' }, { name: '2×2 shortcut', tex: R`\lambda^2 - \operatorname{tr}(S)\lambda + \det S = 0`, sym: 'trace = λ₁ + λ₂, det = λ₁λ₂.', when: 'Quick eigenvalues.' }],
    examples: [{ title: 'A non-degenerate 2×2 PCA (worked)', body: R`$S = \begin{bmatrix}5&2\\2&2\end{bmatrix}$: trace 7, det 10 − 4 = 6 → $\lambda^2 - 7\lambda + 6 = 0$ → λ = 6, 1. PC1: $(S - 6I)\mathbf v = 0 \Rightarrow -v_1 + 2v_2 = 0 \Rightarrow \mathbf v_1 = [2, 1]/\sqrt5$. EVR(PC1) = 6/7 = **85.7%**.` }],
    code: [{ title: 'Hand PCA of the 3-house data; course lab: PCA from scratch', scratch: 'L11_pca_scratch.py', lib: 'L11_pca_sklearn.py', more: [['Course lab: pca_project', 'L11_lab_pca_scratch.py']] }],
    traps: ['Sort eigenvalues in **descending** order; PC numbering follows the sort, not the computation order (NumPy `eigh` returns ascending).', 'Eigenvectors are defined up to **sign**; libraries may flip a PC.', 'Eigenvalue = variance (squared units), not standard deviation.'],
    questions: [
      { type: 'int', diff: 'M', q: 'Houses (2,1), (4,3), (6,5). Largest eigenvalue of S (÷ n−1)?', answer: 8, tol: 0.001, round: 'Exact', verify: '8', sol: 'S = [[4,4],[4,4]] → λ = **8**, 0.' },
      { type: 'int', diff: 'M', q: 'Same data: PC1 score of house C (3 decimals)?', answer: 2.828, tol: 0.001, round: '3 decimals', verify: '(2+2)/2**0.5', sol: 'Centred C = [2, 2]; [2, 2]·[1, 1]/√2 = 4/√2 = **2.828**.' },
      { type: 'int', diff: 'H', q: R`$S = \begin{bmatrix}5&2\\2&2\end{bmatrix}$. EVR of PC1 in % (1 decimal)?`, answer: 85.7, tol: 0.05, round: '1 decimal', verify: '100*6/7', sol: 'λ = 6, 1 → 6/7 = **85.7%**.' },
      { type: 'mcq', diff: 'E', q: 'Eigenvalues λ₁ > λ₃ > λ₂. Which eigenvector is PC2?', options: ['v₁', 'v₂', 'v₃', 'none'], answer: 2, sol: 'Second-largest eigenvalue λ₃ → v₃ (Section 4.2).', why: ['PC1.', 'PC3.', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'The variance of the PC scores along vⱼ equals:', options: ['1', 'λⱼ', '√λⱼ', 'trace(S)'], answer: 1, sol: 'vⱼᵀSvⱼ = λⱼ.', why: ['No.', 'Correct.', 'That is the std.', 'That is total variance.'] },
      { type: 'mcq', diff: 'H', tag: 'GATE-style', q: 'Setting the gradient of uᵀSu − λ(uᵀu − 1) to zero gives:', options: ['u = 0', 'Su = λu', 'S = λI', 'uᵀu = λ'], answer: 1, sol: 'Lagrange proof.', why: ['Violates ‖u‖ = 1.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why are PC scores uncorrelated?', options: ['Because data are standardised', 'Because eigenvectors of a symmetric S are orthogonal, so WᵀSW is diagonal', 'Because λ = 0', 'They are not'], answer: 1, sol: 'P4(b) row 2.', why: ['Not required.', 'Correct.', 'No.', 'They are.'] }
    ],
    researched: R`The worksheet calls the optimisation "beyond scope". Lagrange-multiplier proof from Bishop, *Pattern Recognition and Machine Learning* §12.1.1; Jolliffe ch.1.`,
    source: 'Worksheet L11 pp.7–9; Bishop §12.1.'
  },
  /* ---------------------------------------------------------------- L11.6 */
  {
    id: 'L11.6', title: 'PCA workflow; choosing k; explained variance; scree plot', badge: 'class', pages: '10–11', ws: 'Sections 5.1–5.2, P3(a)',
    concept: R`
**Workflow** (Fig. 7):
1. **Split** first; test set locked.
2. Fit centering (and standardisation when appropriate) on **training** features; store µ (and s).
3. Covariance $S = \frac{1}{n-1}X_c^TX_c$ (p × p).
4. Eigenvalues and unit eigenvectors of S.
5. Sort by descending eigenvalue.
6. Choose k (explained variance, visualisation, downstream validation).
7. $W_k = [\mathbf v_1 \cdots \mathbf v_k]$, size **p × k**.
8. Transform: $Z_{\text{train}} = X_{c,\text{train}}W_k$; $Z_{\text{test}} = (X_{\text{test}} - \mathbf 1\boldsymbol\mu_{\text{tr}}^T)W_k$ — **never refit PCA or recompute µ on test data**.

**Choosing k.** Total variance $= \sum_j\lambda_j = \operatorname{trace}(S)$.
$$\text{EVR}(PC_j) = \frac{\lambda_j}{\sum_\ell\lambda_\ell},\qquad \text{cumulative EVR}(k) = \frac{\sum_{j\le k}\lambda_j}{\sum_\ell\lambda_\ell}$$
Rules: **cumulative threshold** — smallest k reaching 90% or 95%, then validate; **elbow / scree** — where eigenvalues flatten; **visualisation** — k = 2 or 3; **prediction** — treat k as a **hyperparameter in CV**.

*Classroom question:* first two PCs capture 76% — is k = 2 automatically right? **No.** If the task needs distinctions living in PC3 (13%), k = 2 underfits; tune k by CV.

**PRACTICE P3(a).** Eigenvalues [6, 2, 1, 0.5], total **9.5**. Cumulative: k = 1 → 63.2%; k = 2 → 84.2%; **k = 3 → 94.7%** (first ≥ 90%); k = 4 → 100%. k = 3 is only a **candidate**: the dropped 5.3% might carry the signal that predicts y — cross-validate.

**Course lab "PCA variance":** \`get_n_components(X)\` = smallest number of PCs explaining ≥ 96% of variance — e.g. \`np.argmax(np.cumsum(pca.explained_variance_ratio_) >= 0.96) + 1\`, or simply \`PCA(n_components=0.96)\`.`,
    formulas: [{ name: 'Explained variance ratio', tex: R`\text{EVR}_j = \frac{\lambda_j}{\sum_{\ell=1}^p\lambda_\ell}`, sym: '', when: 'Choosing k.' }, { name: 'Total variance', tex: R`\sum_j\lambda_j = \operatorname{trace}(S)`, sym: 'Sum of feature variances.', when: 'Denominator of EVR.' }, { name: 'Transform', tex: R`Z = X_cW_k\ \ (n\times k)`, sym: '', when: 'Projection step.' }],
    plots: [
      { id: 'P11-workflow', title: 'End-to-end PCA pipeline (fit on train, apply to test)', notice: 'µ, s and W_k come from the training split only, then are reused unchanged on test/production data.',
        spec: { type: 'flow', w: 650, h: 170, nodes: [{ id: 'a', x: 62, y: 60, w: 112, h: 50, t: '1 Split\n(test locked)', c: 's2' }, { id: 'b', x: 192, y: 60, w: 118, h: 50, t: '2 Centre/scale\nstore µ, s', c: 's1' }, { id: 'c', x: 324, y: 60, w: 112, h: 50, t: '3 Covariance S\np × p', c: 's1' }, { id: 'd', x: 456, y: 60, w: 118, h: 50, t: '4 Eigen-decomp\nsort λ', c: 's5' }, { id: 'e', x: 584, y: 60, w: 112, h: 50, t: '5 Z = X_c W_k\nn × k', c: 's3' }, { id: 't', x: 400, y: 145, w: 360, h: 36, t: 'Test: Z_test = (X_test − µ_train) W_k  — never refit', c: 's4', shape: 'round' }],
          edges: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'c', b: 'd' }, { a: 'd', b: 'e' }] } },
      { id: 'P11-scree', title: 'Scree plot (bars) with cumulative explained variance (line)', notice: 'Elbow around k = 2–3; the 90% line is first crossed at k = 4 (96%).',
        spec: { type: 'bars', w: 560, h: 300, cats: ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC6'], vals: ev, pct: true, ylabel: 'individual EVR (%)', ylim: [0, 60], line: { vals: cum, ylim: [0, 100], pct: true, c: 's4', ref: 90, refLabel: '90% target', label: 'cumulative EVR' } } }
    ],
    examples: [{ title: 'Smallest k for 95% (worked)', body: R`Eigenvalues [4.2, 2.1, 1.0, 0.4, 0.2, 0.1], total 8.0. Cumulative: 52.5%, 78.75%, 91.25%, 96.25% → **k = 4** for 95% (k = 3 for 90%).` }],
    code: [{ title: 'explained_variance_ratio_, PCA(n_components=0.96), PCA inside CV', lib: 'L11_pca_sklearn.py' }],
    traps: ['Cumulative EVR picks a **candidate** k; validate it on the real task.', 'Total variance = trace(S) = sum of eigenvalues.', '`explained_variance_` = eigenvalues; `explained_variance_ratio_` = EVR.'],
    questions: [
      { type: 'int', diff: 'E', q: 'Eigenvalues [6, 2, 1, 0.5]. Total variance?', answer: 9.5, tol: 0.001, round: '1 decimal', verify: '6+2+1+0.5', sol: '**9.5**.' },
      { type: 'int', diff: 'M', q: 'Eigenvalues [6, 2, 1, 0.5]. Smallest k with cumulative EVR ≥ 90%?', answer: 3, tol: 0, round: 'Exact', verify: '3', sol: '63.2%, 84.2%, **94.7%** → k = 3.' },
      { type: 'int', diff: 'M', q: 'Eigenvalues [6, 2, 1, 0.5]. Cumulative EVR for k = 2 in % (1 decimal)?', answer: 84.2, tol: 0.05, round: '1 decimal', verify: '100*8/9.5', sol: '8/9.5 = **84.2%**.' },
      { type: 'int', diff: 'M', q: 'Eigenvalues [4.2, 2.1, 1.0, 0.4, 0.2, 0.1]. Smallest k for ≥ 95%?', answer: 4, tol: 0, round: 'Exact', verify: '4', sol: '52.5, 78.75, 91.25, **96.25** → k = 4.' },
      { type: 'mcq', diff: 'M', q: 'First two PCs explain 76%. Is k = 2 automatically correct?', options: ['Yes', 'No — tune k by CV on the downstream task'], answer: 1, sol: 'Classroom question 5.2.', why: ['No.', 'Correct.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
evr = np.array([0.43, 0.3682, 0.1959, 0.0044, 0.0015])
print(int(np.argmax(np.cumsum(evr) >= 0.96) + 1))`, answer: '3', sol: 'Cumulative 0.43, 0.7982, 0.9941 → first ≥ 0.96 at index 2 → k = **3**.' },
      { type: 'write', diff: 'M', q: 'Write `get_n_components(X)` returning the smallest number of principal components that explain at least 96% of the variance (course lab). X is already standardised.',
        starter: 'import numpy as np\nfrom sklearn.decomposition import PCA\n\ndef get_n_components(X):\n    pass\n',
        ref: 'import numpy as np\nfrom sklearn.decomposition import PCA\n\ndef get_n_components(X):\n    evr = PCA().fit(X).explained_variance_ratio_\n    return int(np.argmax(np.cumsum(evr) >= 0.96) + 1)',
        tests: 'rng = np.random.default_rng(0)\nz = rng.normal(size=(200, 1))\nX = np.hstack([z, 2 * z + 0.01 * rng.normal(size=(200, 1)), rng.normal(size=(200, 1))])\nassert get_n_components(X) == 2\nassert get_n_components(rng.normal(size=(500, 3))) == 3' }
    ],
    source: 'Worksheet L11 pp.10–11; course labs "PCA Implementation from scratch", "PCA variance"; scikit-learn `PCA` docs.'
  },
  /* ---------------------------------------------------------------- L11.7 */
  {
    id: 'L11.7', title: 'When PCA fails; what it preserves; PCA vs selection', badge: 'class', pages: '11–15', ws: 'Sections 5.3–5.5, P3(b), P4',
    concept: R`
**Failure cases (Fig. 9):**
1. **Circular / isotropic data:** λ₁ ≈ λ₂ — no dominant direction; components are arbitrary.
2. **Symmetric classes:** the max-variance direction may run **along** both classes, and projecting onto PC1 **merges class A and class B** (PCA ignores labels).
3. **Non-linear structure:** curved data (y = x², spirals, concentric circles) — linear PCA cannot "unroll" a manifold.

**PCA can help with:** visualisation and compression; faster downstream learning; removing linear redundancy; noise reduction when low-variance directions are mostly noise.
**PCA does not guarantee:** better prediction; causal meaning or class separation; keeping a **low-variance but highly predictive** feature.

:::warn Inside CV
Do not fit scaling or PCA on all data and then cross-validate the model. Fit them **inside each fold** on the training portion only.
:::

| Criterion | Feature selection | Feature extraction (PCA) |
|---|---|---|
| what is reduced | number of original columns kept | number of new component coordinates |
| original meaning kept? | yes | usually not directly |
| treatment of correlation | keep one representative | combine shared variation into one direction |
| uses y? | depends on the method | no — standard PCA is unsupervised |
| mathematical idea | keep or discard columns | rotate the coordinate system, then project |

**PRACTICE P3(b).** Standardise the full data, fit PCA on all observations, keep 5 PCs, then 5-fold CV → **not trustworthy** (optimistic): µ, s, S and $W_k$ all saw the validation folds. Correct: in each fold compute µ, s on the training split; centre/scale; compute S and $W_k$ on train; $Z_{\text{train}} = X_{c,\text{train}}W_k$; $Z_{\text{val}} = (X_{\text{val}} - \boldsymbol\mu_{\text{train}})W_k$; train on $Z_{\text{train}}$, evaluate on $Z_{\text{val}}$.

**P4(b) true/false.** PCA uses y **F**; PCs are uncorrelated **T**; standardisation always necessary **F** (only when scales differ arbitrarily); eigenvalue = variance of the scores **T**; PCA can unfold a curved manifold **F**. **P4(c) highlights:** keeping fewer PCs (k < p) **lowers variance** (and multicollinearity) at the cost of **approximation bias**; √λⱼ is the semi-axis length of the data's scatter ellipse.`,
    formulas: [{ name: 'Reconstruction from k PCs', tex: R`\hat X_c = Z W_k^T = X_cW_kW_k^T`, sym: 'Error energy = sum of dropped eigenvalues × (n − 1).', when: 'Compression questions.' }],
    plots: [{ id: 'P11-failures', title: 'Three ways linear PCA fails', notice: 'Left: equal spread, no preferred axis. Middle: PC1 (max variance, horizontal) mixes the two classes; the separating direction is vertical (low variance). Right: a curve cannot be captured by one straight axis.',
      spec: (function () { const c = [], a = [], b = [], u = []; for (let i = 0; i < 50; i++) { c.push([G(), G()]); } for (let i = 0; i < 30; i++) { a.push([G() * 2.5, 0.6 + G() * 0.2]); b.push([G() * 2.5, -0.6 + G() * 0.2]); } for (let x = -2; x <= 2.01; x += 0.2) u.push([x, x * x - 1.5 + G() * 0.1]);
        return { type: 'multi', panels: [
          { type: 'xy', w: 250, h: 230, title: 'Circular: λ₁ ≈ λ₂', xlim: [-3, 3], ylim: [-3, 3], xlabel: 'x₁', ylabel: 'x₂', series: [{ t: 'scatter', pts: c, c: 's7', r: 3 }] },
          { type: 'xy', w: 250, h: 230, title: 'Classes merged on PC1', xlim: [-6, 6], ylim: [-3, 3], xlabel: 'x₁ (PC1)', ylabel: 'x₂', series: [{ t: 'scatter', pts: a, c: 's1', r: 3 }, { t: 'scatter', pts: b, c: 's4', r: 3, m: 's' }, { t: 'hline', y: 0, c: 'fg', dash: true }] },
          { type: 'xy', w: 250, h: 230, title: 'Non-linear (curve)', xlim: [-2.5, 2.5], ylim: [-2.5, 3], xlabel: 'x₁', ylabel: 'x₂', series: [{ t: 'scatter', pts: u, c: 's5', r: 3 }, { t: 'hline', y: 0.1, c: 'fg', dash: true }] }] }; })() }],
    examples: [{ title: 'Low variance, high value (worked)', body: R`Fraud data: "amount" varies hugely; "is_foreign_card" is 1 for 1% of rows (variance ≈ 0.0099) but is the strongest fraud signal. Standardised or not, a low-variance direction aligned with it may be dropped by PCA's 95% rule — the classifier then loses its best feature. Validate k on the actual task.` }],
    code: [{ title: 'Scaler + PCA inside a Pipeline evaluated with CV', lib: 'L11_pca_sklearn.py' }],
    traps: ['PCA can destroy class separability (unsupervised).', 'Linear PCA cannot unroll curves (use kernel PCA / manifold methods).', 'Fitting PCA before CV is leakage.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Does PCA use the target variable y?', options: ['Yes', 'No — standard PCA is unsupervised'], answer: 1, sol: 'P4(b).', why: ['No.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'A student fits a scaler and PCA on all data, then runs 5-fold CV. The score is:', options: ['trustworthy', 'optimistic — µ, s, S and W_k saw the validation folds', 'pessimistic', 'unaffected'], answer: 1, sol: 'P3(b).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Situations where linear PCA performs poorly (select all):', options: ['Circular data with λ₁ ≈ λ₂', 'Classes separated only along a low-variance direction', 'Data on a curved manifold', 'Two strongly correlated features'], answer: [0, 1, 2], sol: 'Fig. 9.', why: ['Yes.', 'Yes.', 'Yes.', 'That is PCA\'s ideal case.'] },
      { type: 'mcq', diff: 'M', q: 'Keeping fewer PCs (k < p) in a regression typically:', options: ['raises variance, lowers bias', 'lowers variance (and multicollinearity), adds approximation bias', 'changes nothing', 'always improves accuracy'], answer: 1, sol: 'P4(c)(vi).', why: ['Opposite.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Which preserves the original meaning of features?', options: ['Feature selection', 'PCA', 'Both', 'Neither'], answer: 0, sol: '5.5 table.', why: ['Correct.', 'PCs mix features.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: '"Standardisation is always necessary before PCA."', options: ['True', 'False — only when units/scales differ arbitrarily'], answer: 1, sol: 'P4(b).', why: ['No.', 'Correct.'] }
    ],
    source: 'Worksheet L11 pp.11–15; scikit-learn `Pipeline` docs.'
  },
  /* ---------------------------------------------------------------- L11.8 (researched) */
  {
    id: 'L11.8', title: 'PCA through the SVD (how scikit-learn computes it)', badge: 'res', pages: '–', ws: 'Not in the worksheet',
    concept: R`
:::hook Hook
The worksheet finds principal components as eigenvectors of the covariance matrix S. But scikit-learn's \`PCA\` never builds S. It factorises the centred data directly with the **singular value decomposition (SVD)**. Is that the same thing?
:::

**SVD.** Any n × p matrix can be written as
$$X_c = U\Sigma V^T$$
where U (n × r) and V (p × r) have **orthonormal columns** and Σ = diag(s₁ ≥ s₂ ≥ … ≥ 0) holds the **singular values**.

**Link to the covariance eigenproblem** (derivation below): $S = \frac{1}{n-1}X_c^TX_c = V\frac{\Sigma^2}{n-1}V^T$. This is exactly an eigen-decomposition of S, so:
- the **principal directions** are the columns of V (rows of \`Vt\`);
- the **eigenvalues** are $\lambda_j = s_j^2/(n-1)$;
- the **scores** are $Z = X_cV = U\Sigma$;
- $\text{EVR}_j = s_j^2/\sum_k s_k^2$.

**Check on the 10-point dataset** used in the PCA lab (\`aml-practice/L11_pca_svd_scratch.py\`):

| Quantity | Covariance route | SVD route |
|---|---|---|
| eigenvalues / s²/(n−1) | 1.284, 0.0491 | s = 3.3994, 0.6646 → 1.284, 0.0491 |
| PC1 | (0.6779, 0.7352) | (−0.6779, −0.7352) — same line, sign flipped |
| EVR | 0.9632, 0.0368 | 0.9632, 0.0368 |
| PC1 scores (first 3) | −0.828, 1.7776, −0.9922 | U·s gives the same |

**Why libraries prefer the SVD:** forming XᵀX squares the condition number, so small directions lose precision. The SVD works on X itself and is numerically stabler. It also gives the scores (UΣ) directly. The answers are the same as the covariance method, up to the sign of each component.

:::take Takeaway
PCA = SVD of the **centred** data. Directions = V, variances = s²/(n − 1), scores = UΣ. Signs are arbitrary, so compare absolute values.
:::`,
    deriv: [{ id: 'D11-svd', title: 'Covariance eigenvectors from the SVD', badge: 'res',
      intro: R`Start from the SVD of the centred data, $X_c = U\Sigma V^T$ with $U^TU = I$ and $V^TV = I$.`,
      steps: [
        { m: R`S = \frac{1}{n-1}X_c^TX_c`, t: 'Sample covariance of the centred data (L11.4).' },
        { m: R`X_c^TX_c = (U\Sigma V^T)^T(U\Sigma V^T) = V\Sigma U^TU\Sigma V^T`, why: R`$(ABC)^T = C^TB^TA^T$ and $\Sigma^T = \Sigma$ (diagonal).` },
        { m: R`= V\Sigma^2V^T`, why: R`$U^TU = I$.` },
        { m: R`S\,V = V\frac{\Sigma^2}{n-1}V^TV = V\frac{\Sigma^2}{n-1}`, why: R`$V^TV = I$: column j satisfies $S\mathbf v_j = \frac{s_j^2}{n-1}\mathbf v_j$ — the eigen-equation $S\mathbf v = \lambda\mathbf v$.` },
        { m: R`Z = X_cV = U\Sigma V^TV = U\Sigma`, why: 'Scores are the projections onto the directions (L11.3).' }
      ],
      result: R`\mathbf v_j = \text{column } j \text{ of } V,\qquad \lambda_j = \frac{s_j^2}{n-1},\qquad Z = U\Sigma`,
      after: 'So the eigenvalue route and the SVD route always give the same PCA.' }],
    formulas: [
      { name: 'SVD of centred data', tex: R`X_c = U\Sigma V^T`, sym: 'U: n×r, Σ: r×r diagonal (s₁ ≥ s₂ ≥ …), V: p×r; orthonormal columns.', when: 'How sklearn PCA computes.' },
      { name: 'Eigenvalue from singular value', tex: R`\lambda_j = \frac{s_j^2}{n-1}`, sym: '`explained_variance_` = `singular_values_**2/(n-1)`.', when: 'Converting between the two routes.' },
      { name: 'EVR from singular values', tex: R`\text{EVR}_j = \frac{s_j^2}{\sum_k s_k^2}`, sym: 'The (n − 1) cancels.', when: 'Explained variance without computing S.' },
      { name: 'Scores', tex: R`Z = X_cV = U\Sigma`, sym: 'n × k after keeping k columns.', when: 'Projected data.' }
    ],
    plots: [{ id: 'P11-svd', title: 'The lab data, centred, with PC1 and PC2 from the SVD', notice: 'PC1 (s²/(n−1) = 1.284) runs along the cloud; PC2 (0.049) is perpendicular. The SVD gives the same directions as the covariance eigenvectors (up to sign).',
      spec: { type: 'xy', w: 420, h: 380, xlim: [-1.6, 1.6], ylim: [-1.6, 1.6], xlabel: 'x₁ − x̄₁', ylabel: 'x₂ − x̄₂',
        series: [{ t: 'scatter', pts: [[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2], [3.1, 3.0], [2.3, 2.7], [2.0, 1.6], [1.0, 1.1], [1.5, 1.6], [1.1, 0.9]].map(p => [p[0] - 1.81, p[1] - 1.91]), c: 's1', r: 4 },
          { t: 'arrow', x1: 0, y1: 0, x2: 1.4 * 0.6779, y2: 1.4 * 0.7352, c: 's4', w: 2.5 }, { t: 'arrow', x1: 0, y1: 0, x2: -0.5 * 0.7352, y2: 0.5 * 0.6779, c: 's3', w: 2.5 },
          { t: 'text', x: 1.15, y: 1.2, s: 'PC1' }, { t: 'text', x: -0.55, y: 0.5, s: 'PC2' }] } }],
    examples: [{ title: 'From singular values to PCA quantities (worked)', body: R`Centred data with n = 6 has singular values s = (6, 3, 1). Eigenvalues: 36/5 = **7.2**, 9/5 = **1.8**, 1/5 = **0.2**. EVR: 36/46 = 0.783, 9/46 = 0.196, 1/46 = 0.022. Cumulative EVR for k = 2: 45/46 = **97.8%**.` }],
    code: [{ title: 'Covariance route vs SVD route vs sklearn PCA', scratch: 'L11_pca_svd_scratch.py' }],
    traps: ['Use the **centred** X in the SVD; uncentred data gives a different, wrong decomposition.', 'Eigenvalue = s²/(n − 1), **not** s.', 'Each component\'s sign is arbitrary; compare with absolute values.', '`np.linalg.svd` returns **Vt** (rows = directions), not V.'],
    researched: R`Not covered in class — studied from Jolliffe & Cadima, "Principal component analysis: a review and recent developments", Phil. Trans. R. Soc. A 374 (2016), the scikit-learn \`PCA\` documentation (uses an SVD of the centred data), and Strang, *Introduction to Linear Algebra* §7 (SVD).`,
    questions: [
      { type: 'int', diff: 'E', q: 'Centred data with n = 11 rows has largest singular value s₁ = 5. Variance along PC1 (eigenvalue)?', answer: 2.5, tol: 0.001, round: '1 decimal',
        verify: '5**2/10', sol: 'λ₁ = s₁²/(n − 1) = 25/10 = **2.5**.' },
      { type: 'int', diff: 'E', q: 'Singular values (4, 2). Explained variance ratio of PC1?', answer: 0.8, tol: 0.001, round: '2 decimals',
        verify: '16/(16+4)', sol: '16/(16 + 4) = **0.8**; the n − 1 cancels.' },
      { type: 'mcq', diff: 'M', q: 'In Xc = UΣVᵀ, the principal directions are:',
        options: ['the columns of U', 'the columns of V', 'the diagonal of Σ', 'the rows of Xc'], answer: 1,
        sol: 'XcᵀXc = VΣ²Vᵀ, so V holds the eigenvectors of the covariance matrix.', why: ['U holds the normalised scores.', 'Correct.', 'Those are singular values.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why does scikit-learn compute PCA with the SVD instead of forming XᵀX?',
        options: ['It gives different, better components', 'It is numerically stabler (XᵀX squares the condition number) and gives the scores directly', 'The SVD does not need centring', 'XᵀX cannot be computed for more than 2 features'], answer: 1,
        sol: 'Same PCA, better numerics.', why: ['Same components (up to sign).', 'Correct.', 'Centring is still needed.', 'False.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
Xc = np.array([[-1.0, -1.0], [0.0, 0.0], [1.0, 1.0]])
s = np.linalg.svd(Xc, compute_uv=False)
print(np.round(s ** 2 / (len(Xc) - 1), 3).tolist())`, answer: '[2.0, 0.0]',
        sol: 'The points lie on a line: one singular value √4 = 2 → eigenvalue 4/2 = 2; the other is 0. The same as the course quiz with S = [[1, 1], [1, 1]] (eigenvalues 2 and 0).' },
      { type: 'mcq', diff: 'E', q: 'Two programs report PC1 as (0.68, 0.74) and (−0.68, −0.74). Which is right?',
        options: ['The first', 'The second', 'Both: an eigenvector\'s sign is arbitrary', 'Neither'], answer: 2,
        sol: 'v and −v span the same line; the scores just flip sign.', why: ['Both.', 'Both.', 'Correct.', 'Both are valid.'] }
    ],
    source: 'Jolliffe & Cadima (2016); scikit-learn PCA docs; Strang, Introduction to Linear Algebra, ch. 7.'
  }
  ]
});
})();
