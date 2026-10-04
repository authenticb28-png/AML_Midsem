/* 7-day study plan and the last-night revision sheet. */
EXTRA.plan = {
  title: '🗓️ 7-day study plan (1.5–2 hours a day)',
  body: R`The plan is built from three facts: the exam has only **MCQs, numerical answers and Python coding**; your course quizzes draw most heavily on **L4–L7 and L9–L12** (see [Quiz patterns](#/patterns)); and the five biggest quizzes (Gradient Descent, SGD, Metrics, PCA, Regularization) are the ones you have **not attempted yet**.

**Every study block follows the same loop** (about 20–40 minutes per lecture):
1. Read the lecture **intro** (its exam weight), then each unit's *Concept* and *Formula sheet*.
2. For units marked ★ below, go through the *Derivation* and *Worked examples* with pen and paper.
3. Do the unit's **practice set** without looking back. Press **Check**; read the solution even when you are right.
4. Tick **Mark as done**. Write every formula you got wrong on one A4 "mistakes" sheet.

:::warn Time budget
2 hours is tight for days 2–5. If a day runs long, skip the ⚠ researched blocks first (they are outside the worksheets), then the "Code" tabs you can already read. Never skip the practice sets: they are what the exam looks like.
:::`,
  blocks: [
    { md: R`| Day | Time | Lectures and focus | Must-do units (★ = derive or hand-calculate) | Finish with |
|---|---|---|---|---|
| **1** | 1 h 45 | [L0](#/lec/0) 15 min skim · [L1](#/lec/1) 35 min · [L2](#/lec/2) 20 min · [L3](#/lec/3) 35 min | L01.3 IQR fences, L01.5 ★ four scalers, L01.6 binary encoding count, L02.2 splitting and leakage, L03.5 ★ intercept, L03.6 ★ slope, L03.7 OLS by hand | All L3 practice sets |
| **2** | 2 h | [L4](#/lec/4) 45 min · [L5](#/lec/5) 40 min · [L6](#/lec/6) 35 min | L04.2 sizes, L04.5–L04.6 ★ identities and normal equation, L04.7 singular XᵀX and O(p³), L05.3 ★ BGD gradient, L05.4 one epoch by hand, L06.4 ★ one SGD epoch, L06.6 mini-batch | Patterns page §4 (chained numericals) |
| **3** | 2 h | [L7](#/lec/7) 60 min · [L8](#/lec/8) 30 min · [L9](#/lec/9) 30 min | L07.3 MAE/MAPE/MSE/RMSE, L07.4–L07.5 ★ R² and adjusted R², L07.7 P/R/F1, L07.8 macro/weighted/micro, L08.2 polynomial columns, L08.3–L08.7 the five assumptions, L09.5 ★ MSE = Bias² + Var + σ², L09.7 train/validation diagnosis | L7 practice sets (your weakest quiz) |
| **4** | 2 h | [L10](#/lec/10) 25 min · [L11](#/lec/11) 40 min · [L12](#/lec/12) 30 min · [Integer drill](#/int-drill) Q1–Q30 25 min | L10.1 bᵖ, L10.2 variance filter, L10.3 r = 0 for y = x², L10.5–L10.6 search counts, L11.3–L11.5 ★ covariance, eigenvalues, projection, L11.6 EVR and k, L12.2 ★ Ridge slope, L12.6 ★ Lasso zeros and clipping | Integer drill first half |
| **5** | 2 h | [L13](#/lec/13) 35 min · [L14](#/lec/14) 30 min · [L15](#/lec/15) 30 min · [Code drill](#/code-drill) 25 min | L13.1 no K-fold, L13.3–L13.4 stationarity and differencing, L13.5 AR(p), L13.6 ACF/PACF, L14.4 sigmoid, L14.6 ★ BCE, L15.2 ★ gradient (p̂ − y)x, L15.3 one update, L15.5 softmax, L15.6 cross-entropy | Integer drill Q31–Q65 if time remains |
| **6** | 2 h | [Mock 1](#/mock/1) — 90 min, timed, closed book | — | 30 min: read every wrong answer's solution; redo the weak-lecture practice sets the score table lists |
| **7** | 2 h | [Mock 2](#/mock/2) — 90 min, timed | — | 30 min weak topics · at night: [last-night sheet](#/revision) 30 min, then sleep |

**If you have only 3 days:** day 1 = L3–L7 (★ units only) + the patterns page; day 2 = L9, L11–L15 (★ units only) + the Integer drill; day 3 = Mock 1 + the revision sheet.

**Exam morning (15 minutes):** read your mistakes sheet and the "Numbers worth remembering" box on the revision page. Nothing new.` },
    { plot: { id: 'PLAN-minutes', title: 'Minutes per day by activity', notice: 'Days 1–5 are mostly learning (lectures); days 6–7 switch to timed papers and review.',
        spec: { type: 'bars', w: 600, h: 290, cats: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
          groups: [{ label: 'lectures', c: 's1', vals: [105, 120, 120, 95, 95, 0, 0] }, { label: 'drills / mocks', c: 's3', vals: [0, 0, 0, 25, 25, 90, 90] }, { label: 'review', c: 's5', vals: [0, 0, 0, 0, 0, 30, 60] }],
          ylabel: 'minutes', ylim: [0, 140] } } },
    { md: R`## Weekly checklist
- [ ] All 116 units ticked **done** (sidebar counters).
- [ ] Every practice set attempted; the [Progress](#/progress) page shows ≥ 70% per lecture.
- [ ] Integer drill: all 65 questions; redo the wrong ones the next day.
- [ ] Code drill: all 48 questions; run the write-the-function ones online at least once.
- [ ] Mock 1 and Mock 2 submitted; weak lectures (< 60%) revised.
- [ ] Revision sheet read the night before.` }
  ]
};

EXTRA.revision = {
  title: '⚡ Last-night revision sheet',
  body: R`One pass, about 30 minutes. Every line is a formula, a fact or a trap that your quizzes or labs actually test. Cover the right column and recite it.`,
  blocks: [
    { md: R`## L0–L2 · Foundations and the ML lifecycle
| Item | Remember |
|---|---|
| Paradigm flip | Traditional: data + rules → answers. ML: data + answers → rules. AI ⊃ ML ⊃ DL. |
| Paradigms | Supervised (labels), unsupervised (no labels: clustering), semi-supervised, reinforcement (rewards). Self-supervised = labels made from the data itself (researched). |
| Tasks | Regression → number; classification → class; clustering → groups without labels. |
| Data types | Structured (SQL tables), semi-structured (**JSON**, XML), unstructured (images, audio, text). |
| Scalers | Min-Max $\frac{x-\min}{\max-\min}$ · Z-score $\frac{x-\mu}{\sigma}$ · Max-Abs $\frac{x}{\max|x|}$ · Robust $\frac{x-\text{median}}{\text{IQR}}$ (outliers). |
| Encoders | Nominal → one-hot (N columns) or binary (⌈log₂N⌉ columns); ordered → ordinal; LabelEncoder sorts **alphabetically**. |
| Outliers | IQR = Q3 − Q1; fences Q1 − 1.5·IQR and Q3 + 1.5·IQR. |
| Split | e.g. 70/15/15. Fit the scaler, imputer and encoder on **train only** (leakage otherwise). Tune hyperparameters on validation; test once. |
| Parameters vs hyperparameters | Learned (m, c, β) vs set before training (α, λ, degree, k, batch size). |
| After deployment | Monitor → drift → retrain (the loop). Translate metrics into money: ΔMAE × ₹/unit × volume. |` },
    { md: R`## L3–L4 · OLS
| Item | Remember |
|---|---|
| Residual | $e_i = y_i - \hat y_i$ (vertical gap). Signed sums cancel; the absolute error has a kink at 0; e² is smooth but outlier-sensitive. |
| SLR | $m = \frac{\sum(x-\bar x)(y-\bar y)}{\sum(x-\bar x)^2} = \frac{\text{Cov}(x,y)}{\text{Var}(x)}$, $c = \bar y - m\bar x$. The line passes through $(\bar x, \bar y)$. |
| Order of derivation | ∂E/∂c = 0 → c = ȳ − m x̄ → substitute (2 variables → 1) → ∂E/∂m = 0 → m. |
| MLR | $\hat{\mathbf y} = X\boldsymbol\beta$, X is n × (p + 1), **p + 1 parameters**. |
| Loss and identities | $L = \mathbf y^T\mathbf y - 2\mathbf y^TX\boldsymbol\beta + \boldsymbol\beta^TX^TX\boldsymbol\beta$; $\partial(\mathbf a^T\boldsymbol\beta)/\partial\boldsymbol\beta = \mathbf a$; $\partial(\boldsymbol\beta^TA\boldsymbol\beta)/\partial\boldsymbol\beta = 2A\boldsymbol\beta$ (A symmetric; XᵀX is). |
| Normal equation | $X^TX\boldsymbol\beta = X^T\mathbf y$, $\boldsymbol\beta = (X^TX)^{-1}X^T\mathbf y$. XᵀX is (p + 1) × (p + 1). |
| Fails when | collinear columns (°C and °F, x₂ = 2x₁) → singular; p large → O(p³) (p = 100 → 10⁶). |` },
    { md: R`## L5–L6 · Gradient descent
| Item | Remember |
|---|---|
| Update | $\boldsymbol\theta \leftarrow \boldsymbol\theta - \alpha\nabla L$, all parameters **simultaneously** from the old θ. |
| MSE gradient | $\nabla L = \frac{2}{m}X^T(X\boldsymbol\theta - \mathbf y)$ (worksheet); quiz numericals often use $\frac1m\sum e_i$, $\frac1m\sum e_ix_i$ with e = ŷ − y. Labs: 2(w·x − y)·x. |
| α | Too small → slow; too large → oscillate/diverge. Choose α on the **validation** loss. Scale features first. |
| Updates per epoch | BGD 1 · SGD m · mini-batch ⌈m/b⌉. b = 1 → SGD, b = m → BGD. |
| Cost per update | BGD O(md), SGD O(d). |
| BGD limitations | high cost per update, memory and I/O pressure (500 GB logs), slow feedback (fraud), redundant work (identical impressions). |
| SGD | randomises the **sample index**; gradient is **unbiased but noisy**; shuffle every epoch; loss may rise on a single step; noise can escape shallow minima. Accumulating and updating once after the loop = BGD. |
| Mini-batch | best balance; batch sizes 32/64/128 suit GPUs (hardware, not maths). |` },
    { md: R`## L7 · Metrics
| Item | Remember |
|---|---|
| Regression | MAE $\frac1n\sum|e|$ · MAPE $\frac{100}{n}\sum\frac{|e|}{|y|}$ (undefined at y = 0; labs skip zeros) · MSE (squared units) · RMSE = √MSE ≥ MAE. |
| R² | $1 - \frac{RSS}{TSS}$, TSS around the mean of the **actual** y. Can be negative on test data. Never falls when a feature is added. |
| Adjusted R² | $1 - (1 - R^2)\frac{n-1}{n-p-1}$, p = features (no intercept). |
| Classification | Accuracy $\frac{TP+TN}{\text{all}}$ · Precision $\frac{TP}{TP+FP}$ · Recall $\frac{TP}{TP+FN}$ · F1 $\frac{2PR}{P+R}$ · Specificity $\frac{TN}{TN+FP}$ · $F_\beta = \frac{(1+\beta^2)PR}{\beta^2P+R}$. |
| Which to prioritise | Missing positives costly (fraud, disease) → recall. False alarms costly (spam folder) → precision. |
| Averages | Macro = plain mean (each class equal); weighted = by support; micro = pooled = **accuracy** for single-label multiclass. |
| sklearn | \`confusion_matrix(...).ravel()\` → tn, fp, fn, tp; MAPE returns a fraction. |` },
    { md: R`## L8–L9 · Polynomials, assumptions, bias–variance
| Item | Remember |
|---|---|
| Polynomial | Still linear in β. Degree n, one feature → n + 1 columns; turning points ≤ n − 1. PolynomialFeatures(2) on 2 inputs → 6 columns. |
| Assumptions | Linearity (U-shaped residuals), normal residuals (Q–Q plot), homoscedasticity (funnel), independent errors (DW ≈ 2), no multicollinearity (VIF = 1/(1 − R²ⱼ) > 10 is serious). |
| Noise | Y = f(X) + ε, E(ε) = 0, Var(ε) = σ² = E(ε²); irreducible. |
| Decomposition | $\text{MSE} = \text{Bias}^2 + \text{Var} + \sigma^2$; Bias = E[f̂] − f. Name the largest term. |
| Diagnosis | Both errors high → high bias (more complex model). Low train, high validation → high variance (more data, regularize, simpler model). |
| Dartboard | tight but off-centre = high bias, low variance; scattered around the centre = low bias, high variance. |
| CV | k-fold trains on (k − 1)/k of the data; unstable fold scores → high variance. |
| Tuning | Grid search fits = k × (product of list sizes) + 1 refit; random search = k × n_iter. Tune on CV of the training set, test once. |` },
    { md: R`## L10–L12 · Selection, PCA, regularization
| Item | Remember |
|---|---|
| Curse of dimensionality | b bins per feature → **bᵖ** cells. |
| Filters | simple rule, no model training: duplicates, variance threshold (binary q(1 − q)), Pearson r with target (misses y = x², r = 0), drop one of each correlated pair. |
| Wrappers | generate subset → train → evaluate → next. Exhaustive 2ᵖ − 1; forward/backward ≈ p(p + 1)/2; RFE drops the weakest repeatedly. |
| PCA steps | centre (and standardise if units differ) → covariance S → eigenpairs (sort **descending**) → project z = X_c v. |
| PCA facts | λ = variance along PC; EVR = λ/Σλ; PCs orthogonal and uncorrelated (≠ independent); unsupervised (can drop a predictive low-variance direction); best k-dim reconstruction. |
| Ridge | $m = \frac{S_{xy}}{S_{xx}+\lambda}$; $\boldsymbol\beta = (X^TX + \lambda I)^{-1}X^T\mathbf y$; shrinks, never exactly 0; circle constraint; big coefficients shrink fastest. |
| Lasso | worksheet $m = \frac{S_{xy} - \lambda}{S_{xx}}$ (m > 0) → clip at **0**; diamond constraint → corners → sparsity = feature selection. |
| Practice | standardise before penalising; do not penalise the intercept; choose λ by CV; λ → ∞ underfits. |
| Elastic Net | $\lambda_1\|\mathbf w\|_1 + \lambda_2\|\mathbf w\|_2^2$: zeros **and** grouping of correlated features; l1_ratio = 1 → Lasso, 0 → Ridge. |
| PCA via SVD | $X_c = U\Sigma V^T$: directions = V, eigenvalue = s²/(n − 1), scores = UΣ. |` },
    { md: R`## L13 · Time series
| Item | Remember |
|---|---|
| Order matters | Not I.I.D. → no shuffled K-fold; use TimeSeriesSplit (training window grows, always before the test block). |
| Components | trend (long-term), seasonality (fixed-period cycles), noise. |
| Stationary | constant mean, constant variance, autocovariance depends only on the lag. Fix with differencing ΔYₜ = Yₜ − Yₜ₋₁, log, seasonal differencing. |
| AR(p) | $y_t = c + \sum_{i=1}^p \phi_iy_{t-i} + \varepsilon_t$; p too large (365) → overfit. |
| MA(q) | $y_t = c + \varepsilon_t + \sum_{i=1}^q\theta_i\varepsilon_{t-i}$ (past shocks). |
| ACF/PACF | ACF = total (direct + ripple) correlation; PACF = direct only. AR(p): PACF cuts off after p. MA(q): ACF cuts off after q. |` },
    { md: R`## L14–L15 · Logistic regression
| Item | Remember |
|---|---|
| Likelihood | Probability: fixed θ, varying data. Likelihood: fixed data, varying θ. Bernoulli MLE p̂ = k/n. |
| Model | $z = \beta_0 + \boldsymbol\beta^T\mathbf x$, $\hat p = \sigma(z) = \frac{1}{1+e^{-z}}$; boundary z = 0 (p̂ = 0.5). |
| Row likelihood | $\hat p^{\,y}(1-\hat p)^{1-y}$; loss y = 1: −ln p̂; y = 0: −ln(1 − p̂). |
| BCE | $J = -\frac1n\sum[y\ln\hat p + (1-y)\ln(1-\hat p)]$ = negative Bernoulli log-likelihood; confidently wrong is expensive. |
| Gradient | σ′ = σ(1 − σ); ∂ℓ/∂z = p̂ − y; $\nabla J = \frac1n X^T(\hat{\mathbf p} - \mathbf y)$. No closed form → GD. |
| Multiclass | OvR: K binary models, K(d + 1) parameters, predict argmax. Softmax $\hat p_k = \frac{e^{z_k}}{\sum_j e^{z_j}}$, shift-invariant, K = 2 → sigmoid. CE = −ln p̂_true. |
| Odds | odds = p/(1 − p); ln odds = z (linear). Polynomial features → curved boundaries. L2 adds 2λβⱼ to the gradient; large λ → underfit. |` },
    { md: R`:::key Numbers worth remembering
σ(0) = 0.5 · σ(1) = 0.731 · σ(2) = 0.881 · ln 2 = 0.693 · ln 4 = 1.386 · −ln 0.1 = 2.303 · −ln 0.9 = 0.105 · e = 2.718 · e⁻¹ = 0.368 · softmax(2, 1, 0) = (0.665, 0.245, 0.090) · √2 = 1.414 · 2¹⁰ = 1024.
:::

:::warn The ten traps that cost marks
1. StandardScaler divides by the **population** std; \`np.cov\` uses n − 1.
2. Adjusted R² denominator is **n − p − 1**.
3. MAPE divides by the **actual** value.
4. Accuracy numerator is **TP + TN**.
5. TSS uses the mean of the **actual** values.
6. \`eigh\` sorts eigenvalues **ascending**.
7. Lasso formula going negative → coefficient **0**.
8. Simultaneous update: compute every gradient from the old θ first.
9. Fit preprocessing on **train only**; no shuffled K-fold on time series.
10. Read the gradient convention (with or without 2) from the question or its options.
:::` }
  ]
};
