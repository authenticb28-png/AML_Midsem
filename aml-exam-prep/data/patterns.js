/* Course quiz patterns — analysis of the real course quizzes (Study Pack/4 - MCQs.md, 134 questions in 14 quizzes)
   and labs (Study Pack/3 - Coding & Lab Questions.md, 24 ML labs: 11 auto-graded coding + 13 notebooks). Counts were made question by question; the
   classification lists are in the comments below so they can be re-checked.
   Styles (question numbers in file order, 1–134):
     NUM    3 7 11 13 14 21 35 38 39 42 45 50 53 58 60 62 63 64 65 80 84 105 110 111 112
     SCEN   5 9 17 18 25 27 30 41 59 61 66 67 69 70 71 76 77 85 93 104 108 122 123
     FORM   12 16 19 20 23 24 31 48 52 74 78 92 96 97 120 124 125 132
     DEF    1 2 4 22 33 37 47 55 57 73 75 86 89 99 100 101 102 118 119 133
     STRUCT 8 32 68 72 83 134
     WHY    the remaining 42 */
EXTRA.patterns = {
  title: '🔎 Course quiz patterns — what your real quizzes ask, and how to answer',
  body: R`This page analyses **all 134 questions** in your 14 course quizzes (\`Study Pack/4 - MCQs.md\`) and the **24 ML labs** (\`Study Pack/3 - Coding & Lab Questions.md\`). The aim is to know the *shape* of the questions before the exam: which lectures they draw from, which question styles they use, which traps repeat, and what the auto-graded coding labs expect.

:::warn How to read the numbers
Your quiz bank is uneven: some quizzes are long (Gradient Descent: 24 questions), some have only 1–3 visible, and the Lecture 14 quiz ("Classification Models, Logistic Regression…") was never opened, so it contributes nothing. The counts show what your instructors **like to ask**, not the exact exam weights. Every lecture can still appear.
:::

**Sources analysed**

| Source | Items | Answer key visible |
|---|---|---|
| Lecture quizzes (13) | 131 questions | 41 (quizzes you attempted) |
| Lab quiz (Feature Selection) | 3 questions | 3 |
| Coding labs (auto-graded functions) | 11 | sample input/output given |
| Notebook labs (Newton Box) | 13 | — |

The 90 questions whose answers were "not shown by Newton" were all solved for this site; their topics feed the lecture practice sets, the drills and the mocks (never copied word for word).`,
  blocks: [
    { md: R`## 1. Where the questions come from` },
    { plot: { id: 'PAT-bylec', title: 'Course quiz questions by lecture (134 questions)', notice: 'Metrics (L7), regularization (L12), SGD (L6) and the MLR/GD block (L4–L5) supply over half of all questions. L0–L2, L8 and L14–L15 are thin in the bank — but L14 is thin only because its quiz was never opened.',
        spec: { type: 'bars', w: 640, h: 300, cats: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15'], vals: [2, 1, 5, 12, 12, 15, 24, 1, 13, 4, 13, 16, 8, 4, 4], ylabel: 'questions', ylim: [0, 28] } } },
    { md: R`How quizzes map to lectures: "Programming Paradigms…" → L1–L2 · "Linear Regression…" → L3 · "Gradient Descent, MLR, Normal Equation" → L4 (normal equation, identities, O(p³), collinearity) and L5 (BGD) · "SGD, Mini-batch" → L6 · "Evaluation Metrics" and "Macro Average…" → L7 · "Model Tuning…" → L9 (plus one L8 multicollinearity item) · "Feature Selection" quizzes → L10 · "Feature Extraction / PCA" → L11 · "Eigen values, EVR, Regularization" → L11 (EVR) and L12 · "Time Series" → L13 · "OvR, Multiclass, BCE" → L14 (BCE, likelihood) and L15 (gradient, regularized logistic).

**What this means for revision:** spend most time on L4–L7 and L9–L12 (two-thirds of the bank), but do not skip L13–L15: they are the newest lectures and the exam will cover them.` },
    { md: R`## 2. The six question styles` },
    { plot: { id: 'PAT-styles', title: 'Question styles across the 134 course questions', notice: 'Almost a third ask "why" — explain a mechanism in words. One in five is a calculation, and one in six is a scenario where you must diagnose or choose.',
        spec: { type: 'bars', w: 640, h: 300, cats: ['Why / mechanism', 'Calculation', 'Scenario', 'Definition', 'Formula pick', 'Order / A–R / NOT'], vals: [42, 25, 23, 20, 18, 6], ylabel: 'questions', ylim: [0, 50] } } },
    { md: R`| Style | Share | Typical stem (paraphrased) | How to attack it |
|---|---|---|---|
| **Why / mechanism** | 42 (31%) | "Why must the data be shuffled every SGD epoch?" · "Why does Lasso give exact zeros but Ridge does not?" | Recall the worksheet's **one-line reason**. Options that are true in general but do not answer *why* are distractors. |
| **Calculation** | 25 (19%) | "Using BGD on (1,2), (2,4), (3,6), (4,8) with θ = 0, α = 0.1, what is θ after one epoch?" · "n = 50, p = 4, R² = 0.85 — adjusted R²?" | Work it on paper; the wrong options are the **predictable slips** (forgot the 2/m, used n − p, sign flip, did not clip to 0). |
| **Scenario** | 23 (17%) | "A fraud system must adapt immediately — which BGD limitation?" · "Recall fell from 80% to 55% while accuracy rose — what do you do?" | Name the concept the story points to, then match the worksheet's label (e.g. *slow feedback*, *memory and I/O pressure*, *redundant work*). |
| **Definition** | 20 (15%) | "What is a lag?" · "What does SGD randomise each iteration?" | Pure recall. The correct option is usually the most precise wording. |
| **Formula pick** | 18 (13%) | "Which expression is APE?" · "Ridge normal equation?" · "Size of XᵀX?" | Check dimensions and edge cases: what happens at λ = 0, y = 0, b = 1? |
| **Order / assertion–reason / NOT / true–false** | 6 (4%) | "Correct order of the OLS derivation steps" · "Which does NOT describe Σ(x − x̄)²?" | Read the stem twice. For A–R, test A and R separately, then ask "does R explain A?". |` },
    { md: R`## 3. Patterns that repeat (learn these)

1. **Chained numericals on one tiny dataset.** The dataset (1, 2), (2, 4), (3, 6), (4, 8) with θ = (0, 0) and α = 0.1 is used **six times**: BGD gradient, BGD update, SGD step 1, SGD step 4, mini-batch 1 and mini-batch 2. Later questions **give you** the intermediate θ (e.g. "after step 3, θ = (0.700, 2.420)"). Always use the given value, so one early slip does not cost you every later mark. *(Drill: L6 practice sets and Integer drill.)*
2. **Know which gradient convention is in use.** The quiz numericals on that dataset (BGD, SGD and mini-batch alike) average eᵢ and eᵢxᵢ with **no factor 2** (e = ŷ − y): BGD's first average gradient is (−5, −15) and θ becomes (0.5, 1.5). The L5 worksheet derivation keeps the 2 (∇L = (2/m)Xᵀ(Xθ − y)), and the coding labs use 2(w·x − y)·x. When a question does not say, check which convention reproduces one of the options.
3. **The worksheet's own labels are the answers.** "Slow feedback", "Memory and I/O pressure", "Redundant work", "High cost per update" (BGD limitations); "unbiased" for the SGD gradient; "information = variance" for PCA; "ripple effect" for ACF vs PACF. Several stems say **"according to the worksheet"**: answer with the worksheet's wording, not a textbook's.
4. **Metric-to-money translation.** Improvement × cost per unit × volume (₹80,000 × 500 farms = ₹4 crore vs a ₹15 lakh training cost). Deploy if the saving clearly beats the cost.
5. **"Which metric exposes this?"** Outliers → compare RMSE with MAE; errors concentrated on small actual values → MAPE; extra useless feature → adjusted R²; imbalanced classes or one critical class → per-class recall/precision, macro-F1; equal class importance → macro; single-label multiclass → micro-F1 = accuracy.
6. **Bias–variance stories.** "Three people fit straight lines to samples of y = x² — lines similar but all poor" → high bias, low variance. "Each fits a high-degree curve that passes through every point; curves differ" → low bias, high variance. Numbers: MSE = Bias² + Var + σ², then name the **largest** term.
7. **Lasso clipping logic.** "OLS part 100/50, λ = 50 → m = 1; λ = 100 → 0; λ = 150 → formula says −1 but the assumption m > 0 is violated → stop at **0**." This chain appears three times (m > 0 and m < 0 versions).
8. **PCA with eigenvalues.** Cumulative EVR and "smallest k for ≥ 90%"; perfectly correlated features → one eigenvalue is 0 → PC1 = 100%, lossless 1-D compression; "uncorrelated ≠ independent".
9. **Matrix sizes and costs.** p features → p + 1 parameters; X is n × (p + 1); XᵀX is (p + 1) × (p + 1); inversion ~p³ (p = 100 → 10⁶ operations); collinear columns (°C and °F) → singular XᵀX.
10. **Logistic/BCE one-liners.** y = 1 → loss −ln p̂; y = 0 → −ln(1 − p̂); compact p̂ʸ(1 − p̂)¹⁻ʸ; dℓ/dz = p̂ − y after the p̂(1 − p̂) cancellation; large λ → underfitting.` },
    { md: R`## 4. Practice in each pattern (new questions)` },
    { qs: [
      { lec: 6, type: 'int', diff: 'M', tag: 'Pattern: chained numerical', q: 'Dataset (1, 3), (2, 5), (3, 7). θ = (0, 0), α = 0.1, SGD with ∂Jᵢ/∂θ₀ = e, ∂Jᵢ/∂θ₁ = e·x (e = ŷ − y). The shuffled order starts with sample 2 = (2, 5). θ₁ after this first update?', answer: 1, tol: 0.001, round: '2 decimals',
        verify: 'e=0-5; 0-0.1*e*2', sol: 'e = −5. θ₀ = 0.5, θ₁ = 0 − 0.1(−5)(2) = **1.0**.' },
      { lec: 6, type: 'int', diff: 'M', tag: 'Pattern: chained numerical', q: 'Continue: after step 1, θ = (0.5, 1.0). Step 2 uses sample 3 = (3, 7). θ₁ after step 2?', answer: 2.05, tol: 0.001, round: '2 decimals',
        verify: 'e=0.5+1.0*3-7; 1.0-0.1*e*3', sol: 'ŷ = 0.5 + 3 = 3.5, e = −3.5. θ₁ = 1.0 + 0.1 × 3.5 × 3 = **2.05** (θ₀ = 0.85). Use the given θ even if your step 1 differed.' },
      { lec: 5, type: 'mcq', diff: 'E', tag: 'Pattern: worksheet label', q: 'A medical-imaging model has 50 million pixels per row, so even one gradient over the whole training set takes hours to compute. Which BGD limitation does this illustrate?',
        options: ['Redundant work', 'High cost per update', 'Slow feedback', 'Deterministic path'], answer: 1,
        sol: 'Each update needs the gradient of every sample over a huge d: O(md) per update.', why: ['That needs near-identical samples.', 'Correct.', 'That is about data changing quickly.', 'Not a limitation in the worksheet\'s list.'] },
      { lec: 2, type: 'mcq', diff: 'M', tag: 'Pattern: metric → money', q: 'A delivery-time model improves MAE from 9 to 8 minutes. Each minute of error costs ₹20 per order; there are 30,000 orders a month. Upgrading costs ₹2 lakh once. Decision?',
        options: ['Deploy — it saves ₹6 lakh a month against a ₹2 lakh one-time cost', 'Do not deploy — a 1-minute gain is always too small', 'Deploy only if RMSE also falls', 'Do not deploy — MAE is not a business metric'], answer: 0,
        sol: '1 × ₹20 × 30,000 = ₹6,00,000 per month. It pays back within the first month.', why: ['Correct.', 'Size alone does not decide; money does.', 'Not required.', 'MAE converts directly into cost here.'] },
      { lec: 7, type: 'mcq', diff: 'M', tag: 'Pattern: which metric exposes it', q: 'Two models have the same MAE, but one has a much larger RMSE. What does that tell you?',
        options: ['Nothing — they are equally good', 'The larger-RMSE model makes a few large errors (outliers), because squaring amplifies big misses', 'The larger-RMSE model is better', 'MAPE must be identical too'], answer: 1,
        sol: 'RMSE ≥ MAE always; a big gap means a few large errors.', why: ['The gap is informative.', 'Correct.', 'No.', 'Unrelated.'] },
      { lec: 9, type: 'mcq', diff: 'E', tag: 'Pattern: bias–variance story', q: 'Three people fit degree-1 models to three samples drawn from y = sin(x) + noise. The three lines are almost identical, and all miss the curve badly. Which describes these models?',
        options: ['High bias, low variance', 'Low bias, high variance', 'Low bias, low variance', 'High bias, high variance'], answer: 0,
        sol: 'Similar lines = low variance; all miss the true curve = high bias.', why: ['Correct.', 'Opposite.', 'They miss the curve.', 'They agree with each other.'] },
      { lec: 12, type: 'int', diff: 'M', tag: 'Pattern: Lasso clipping', q: 'Lasso, m < 0 case: m = (Sxy + λ)/Sxx with Sxy = −60 and Sxx = 30. What is the final m when λ = 90?', answer: 0, tol: 0, round: 'Exact',
        verify: 'min(0,(-60+90)/30)', sol: 'The formula gives (−60 + 90)/30 = +1, which violates the m < 0 assumption → clip to **0**.' },
      { lec: 11, type: 'int', diff: 'M', tag: 'Pattern: PCA eigenvalues', q: 'Eigenvalues 3.0, 1.2, 0.5, 0.3. Smallest k with cumulative explained variance ≥ 90%?', answer: 3, tol: 0, round: 'Exact',
        verify: 'import numpy as np; v=np.cumsum([3,1.2,0.5,0.3])/5; int(np.argmax(v>=0.9))+1', sol: 'Total 5. Cumulative: 60%, 84%, 94% → **k = 3**.' },
      { lec: 4, type: 'mcq', diff: 'E', tag: 'Pattern: sizes and costs', q: 'A housing model uses 12 features plus an intercept, trained on 5,000 rows. Size of XᵀX?',
        options: ['5000 × 5000', '13 × 13', '12 × 12', '5000 × 13'], answer: 1,
        sol: '(p + 1) × (p + 1) = 13 × 13; it does not depend on n.', why: ['That is XXᵀ.', 'Correct.', 'Forgot the intercept column.', 'That is X itself.'] },
      { lec: 14, type: 'mcq', diff: 'E', tag: 'Pattern: BCE one-liner', q: 'A row has y = 0 and p̂ = 0.2. Which expression is its BCE?',
        options: ['−ln 0.2', '−ln 0.8', '0.2', '−ln 0.2 − ln 0.8'], answer: 1,
        sol: 'For y = 0 only the −ln(1 − p̂) term remains: −ln 0.8 ≈ 0.223.', why: ['That is the y = 1 term.', 'Correct.', 'No log.', 'Only one term is active.'] },
      { lec: 3, type: 'mcq', diff: 'M', tag: 'Pattern: NOT question', q: 'Which statement does **NOT** correctly describe the OLS slope numerator Σ(xᵢ − x̄)(yᵢ − ȳ)?',
        options: ['It is (n − 1) times the sample covariance of x and y', 'Its sign gives the sign of the slope', 'It is always non-negative', 'It is zero when x and y are linearly uncorrelated'], answer: 2,
        sol: 'The numerator is negative for a downward trend. The denominator Σ(x − x̄)² is the one that is never negative.', why: ['True.', 'True: the denominator is positive.', 'Correct — false statement.', 'True.'] },
      { lec: 10, type: 'mcq', diff: 'M', tag: 'Pattern: ordering', q: 'Put the filter-then-wrapper workflow in order: (i) evaluate on the test set once; (ii) remove duplicates and near-constant features; (iii) split train/validation/test; (iv) run forward selection with validation scores.',
        options: ['iii, ii, iv, i', 'ii, iii, iv, i', 'iii, iv, ii, i', 'i, ii, iii, iv'], answer: 0,
        sol: 'Split first (filters must not look at test rows), filter on training data, wrap with validation, then a single final test evaluation.', why: ['Correct.', 'Filtering before the split leaks test information.', 'Cheap filters come before the costly wrapper.', 'The test set comes last.'] },
      { lec: 13, type: 'mcq', diff: 'M', tag: 'Pattern: assertion–reason', q: 'A: K-fold cross-validation with shuffling is unsafe for time series. R: Observations in a time series are I.I.D.',
        options: ['Both true; R explains A', 'Both true; R does not explain A', 'A true, R false', 'A false, R true'], answer: 2,
        sol: 'A is true (training on the future leaks). R is false: time-series observations are **not** I.I.D.; that is exactly why A holds.', why: ['R is false.', 'R is false.', 'Correct.', 'A is true.'] }
    ] },
    { md: R`## 5. What the coding labs expect

**The 11 auto-graded coding labs** (stdin → your function → printed result):

| Lab | Lecture | Function you write | Output rule | Practice file |
|---|---|---|---|---|
| Batch GD for linear regression | L5 | \`train_bgd(x, y, learning_rate, epochs)\`, y = w·x, bias fixed at 0 | w, 2 decimals | \`L05_lab_bgd_w.py\` |
| Compute the best-fit line (OLS) | L3 | \`compute_ols(x, y)\` | [m, b], 2 decimals; [−1.0, −1.0] if all x equal | \`L03_lab_compute_ols.py\` |
| OLS method implementation | L4 | \`fit_multiple_lr_beta(X, y)\` via (XᵀX)⁻¹Xᵀy, **no sklearn** | β array, 2 decimals | \`L04_lab_fit_multiple_lr_beta.py\` |
| Evaluate a linear regression model | L7 | MAE and MSE | 2 decimals | Code drill |
| SGD | L6 | y = w·x, seed 42, shuffle indices in place each epoch, update per sample | w, 2 decimals | \`L06_lab_sgd_w.py\` |
| Mini-batch GD | L6 | groups of batch_size, last may be smaller, one update per group | w, 2 decimals | \`L06_lab_minibatch_w.py\` |
| Regression error metrics R² | L7 | R² and adjusted R²; None if TSS = 0; None if n − p − 1 ≤ 0 | 2 decimals | Code drill |
| Regression error metrics calculator | L7 | MAE, MSE, RMSE, MAPE (skip actual = 0 in MAPE) | 2 decimals | Code drill |
| Polynomial regression detective | L8 | fit degrees, train/test MSE, classify under/over/good, best degree | MSE 4 decimals, JSON dict | \`L08_lab_poly_detective.py\` |
| PCA from scratch | L11 | StandardScaler → covariance → top-k eigenvectors → project | 4 decimals | \`L11_lab_pca_scratch.py\` |
| Time-series forecasting | L13 | forecast 3 months, stock = forecast × 1.10 | 2 decimals | \`L13_time_series_statsmodels.py\` |

**The 13 notebook labs** use pandas and sklearn: clean data (missing values, duplicates, encoding, scaling), fit MLR and polynomial models and compare R²/MSE, find the number of PCA components for 96% variance, tune Ridge/Lasso, and decompose a time series to measure how much variance trend and seasonality explain.

:::key Coding conventions the graders rely on
- **Round exactly as asked** (\`round(x, 2)\`; 4 decimals for MSE lists and PCA). Round only at the end; the poly-detective rules use **unrounded** MSEs.
- **Edge cases are spelled out** — return \`[-1.0, -1.0]\`, \`None\`, or skip zeros exactly as written.
- **Seed and shuffle exactly as described:** \`np.random.seed(42)\` (once, or before every shuffle, as the lab says), then \`np.random.shuffle(idx)\` **in place**.
- **No-bias models (y = w·x)** in all three GD labs, with gradient 2(w·x − y)·x — note the factor 2, unlike the quiz numericals.
- **No sklearn when the lab forbids it** (normal equation). Use NumPy: \`np.c_\`, \`@\`, \`np.linalg.inv\` or \`solve\`.
- **StandardScaler uses the population std** (ddof = 0), but \`np.cov\` uses n − 1.
- **eigh returns eigenvalues in ascending order**; sort them descending before taking the top k.
:::` },
    { code: { title: 'The course labs, re-implemented and tested (each prints its sample output)', scratch: 'L05_lab_bgd_w.py', more: [['OLS line', 'L03_lab_compute_ols.py'], ['MLR normal equation', 'L04_lab_fit_multiple_lr_beta.py'], ['SGD', 'L06_lab_sgd_w.py'], ['Mini-batch', 'L06_lab_minibatch_w.py'], ['Poly detective', 'L08_lab_poly_detective.py'], ['PCA from scratch', 'L11_lab_pca_scratch.py']] } },
    { md: R`## 6. Your own record so far

| Quiz | Score | What was missed | Revise |
|---|---|---|---|
| Programming paradigms (L1–L2) | 9/9 | — | — |
| Linear regression / OLS (L3) | 12/15 | Whether the OLS line passes through (x̄, ȳ) — it **always** does | L03.5 |
| Macro/weighted/micro (L7) | 3/6 | "Every class equally important" → **macro**-F1, not weighted | L07.8 |
| Model tuning / bias–variance (L9) | 37/42 | Total error = 1 + 9 + 2 = 12, and **variance** dominates | L09.5 |
| Feature selection (L10) | 3/3 | — | — |
| Time series (L13) | 12/12 | — | — |
| OvR, multiclass, BCE (L14–L15) | 19/19 | — | — |
| Lab quiz: feature selection (L10) | 0/3 | Grid cells = **bᵖ** (not p × b); filter = simple rule without training; wrapper loop order | L10.1, L10.5 |

**Not attempted yet:** Gradient Descent / MLR (24 questions), SGD (15), Evaluation Metrics (22), PCA (9), Regularization (20) and the Lecture 14 logistic-regression quiz. These are the biggest quizzes in the bank, so they are the priority in the 7-day plan.

**Pattern in your mistakes:** all four errors are on **definitions under a twist** (a familiar fact phrased as a "verify" or "which is preferable" question), not on hard algebra. Slow down on the stem: identify exactly what is asked before reading the options.

:::note Answer-letter statistics (do not guess by letter)
Of the 44 questions with visible answers, the key was B 14 times, C 13, A 11 and D 6. The **longest option** was correct 28 times (64%), because correct options often carry the worksheet's full justification. Use this only to break a genuine tie after eliminating options on content.
:::` }
  ]
};
