/* Lecture 2 — The ML Project Lifecycle (Part 2): splitting, features, baseline, training loop, evaluation, deployment */
LECTURES.push({
  num: 2, short: 'Lifecycle II', title: 'ML Project Lifecycle (Part 2) — Splitting, Feature Engineering, Baseline, Training Loop, Evaluation, Deployment & Drift',
  file: 'AML_Lecture 2_Worksheet_Filled.pdf', pages: 11,
  intro: R`**Exam weight:** medium, mostly MCQs. Know **parameters vs hyperparameters**, **why you split before preprocessing (leakage)**, the **training loop order**, **which metric (MAE / RMSE / R²) for which situation**, **batch vs real-time** inference and **periodic vs triggered retraining**. One numerical type appears often: **MSE/MAE by hand** and **cost–benefit** arithmetic. About 50 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L02.1 */
  {
    id: 'L02.1', title: 'Roadmap (Phases 5–11) and parameters vs hyperparameters', badge: 'class', pages: '1–2', ws: 'Roadmap, Parameters vs Hyperparameters',
    concept: R`
**Roadmap.** Lecture 1 covered Phases 1–4 (problem → collection → EDA → preprocessing). Lecture 2 covers:

| Phase | Name |
|---|---|
| 5 | Data splitting — the golden barrier |
| 6 | Feature engineering — crafting perspective |
| 7 | Baseline establishment — setting the floor |
| 8 | The modelling loop — select, tune and train |
| 9 | Offline evaluation — the final exam |
| 10 | Model deployment — into the wild |
| 11 | Post-deployment — the living system |

**Parameters vs hyperparameters.** *Parameters* are the internal gears adjusted **automatically during training**. *Hyperparameters* are external dials **you set before training**; the algorithm cannot adjust them on its own.

| Type | Adjusted by | When | Example |
|---|---|---|---|
| **Parameter** | the model (automatically) | during training | weights $w_1, w_2$, intercept $w_0$ |
| **Hyperparameter** | the engineer (manually) | before training | \`max_depth\`, \`n_estimators\`, \`learning_rate\` |

Common production hyperparameters:
- **Decision trees — \`max_depth\`:** maximum splits allowed. Too low = too simple; too high = memorises the data.
- **Random forests — \`n_estimators\`:** how many trees to build in the ensemble.
- **Gradient descent — \`learning_rate\`:** step size toward the minimum. Too large = overshoots; too small = never converges (in practice: painfully slow).

**Hyperparameter tuning** = run several training cycles with different configurations, score each on the **validation** data, keep the best combination.

**PRACTICE P1 (answered):** (a) weight $w_1$ → **P**; (b) \`max_depth\` → **H**; (c) intercept $w_0$ → **P**; (d) \`learning_rate\` → **H**; (e) \`n_estimators\` → **H**; (f) bias term learned during back-propagation → **P**.

:::key Key insight
If the training algorithm **learns** it from data, it is a parameter. If **you choose** it before calling \`fit\`, it is a hyperparameter. Parameters need training data; hyperparameters need validation data.
:::`,
    formulas: [
      { name: 'Linear model parameters', tex: R`\hat y = w_0 + w_1x_1 + w_2x_2`, sym: '$w_0$ intercept, $w_1,w_2$ weights: all **parameters** (learned).', when: 'Identifying what training changes.' },
      { name: 'Hyperparameter tuning', tex: R`h^* = \arg\min_{h \in \mathcal H}\ \text{Loss}_{\text{val}}\big(\text{model trained on train with } h\big)`, sym: '$h$ = a configuration (e.g. max_depth, learning rate).', when: 'Choosing settings: always scored on **validation**, never on test.' }
    ],
    examples: [
      { title: 'P or H? (worked, extended)', body: R`| Item | P/H | Reason |
|---|---|---|
| slope $m$ in $\hat y = mx + c$ | P | learned by OLS / GD |
| λ (regularisation strength, L12) | H | chosen by you, tuned by CV |
| number of clusters K in K-means | H | set before running |
| centroid coordinates in K-means | P | computed from data |
| degree of a polynomial (L8) | H | you choose 2, 3, 5… |
| batch size in mini-batch GD (L6) | H | set before training |
| the β vector from the normal equation (L4) | P | computed from data |` }
    ],
    traps: [
      'The **learning rate** is a hyperparameter even though it controls training: the algorithm never updates it.',
      'A "bias" term in neural networks is a **parameter** (it is learned), not to be confused with statistical bias (L9).',
      'Hyperparameters are tuned on the **validation** set, not on the test set.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Which of these is a **hyperparameter**?', options: ['Weight $w_1$ in a regression', 'Intercept $w_0$', '`max_depth` of a decision tree', 'A bias term learned during back-propagation'], answer: 2,
        sol: 'max_depth is set by the engineer before training → hyperparameter (P1(b)).', why: ['Learned → parameter.', 'Learned → parameter.', 'Correct.', 'Learned → parameter (P1(f)).'] },
      { type: 'msq', diff: 'M', q: 'Select **all parameters** (learned from data).', options: ['Weights $w_1, w_2$', '`learning_rate`', 'Intercept $w_0$', '`n_estimators`'], answer: [0, 2],
        sol: 'Weights and intercept are adjusted automatically during training. learning_rate and n_estimators are set before training.', why: ['Correct.', 'Hyperparameter.', 'Correct.', 'Hyperparameter.'] },
      { type: 'mcq', diff: 'E', q: 'On which data are **hyperparameters** tuned?', options: ['Training set', 'Validation set', 'Test set', 'The full dataset before splitting'], answer: 1,
        sol: 'P2(c): validation. Training data fits the parameters; the test set is touched only once at the end.', why: ['Training data would reward memorisation.', 'Correct.', 'Using test for tuning leaks the exam answers.', 'Leakage.'] },
      { type: 'mcq', diff: 'M', q: 'A learning rate that is **too large** typically causes gradient descent to:', options: ['converge faster and more accurately', 'overshoot the minimum and possibly diverge', 'stop after one iteration', 'turn into stochastic gradient descent'], answer: 1,
        sol: 'Worksheet: too large = overshoots; too small = very slow convergence (L5 has the details).', why: ['Too large is not "more accurate".', 'Correct.', 'No.', 'SGD is about how many samples per update (L6), not step size.'] },
      { type: 'mcq', diff: 'M', q: 'A decision tree with a **very large `max_depth`** is most likely to:', options: ['underfit', 'memorise the training data (overfit)', 'ignore all features', 'train faster'], answer: 1,
        sol: 'Worksheet: too high = memorises data. Too low = too simple (underfits).', why: ['That is too low a depth.', 'Correct.', 'No.', 'Deeper trees take longer.'] }
    ],
    source: 'Worksheet L2 pp.1–2; scikit-learn glossary ("parameter", "hyperparameter").'
  },
  /* ---------------------------------------------------------------- L02.2 */
  {
    id: 'L02.2', title: 'Phase 5 — Data splitting and data leakage', badge: 'class', pages: '2–3', ws: 'Phase 5',
    concept: R`
:::hook Hook
A student who memorises last year's exam answers and scores 100% has not proved they understand the subject. If your model scores 100% on data it has already seen, does it know how to predict the future?
:::

Parameters need **training** data, hyperparameters need **validation** data, and the final grade needs **untouched test** data.

| Block | Share | Used for |
|---|---|---|
| **Training** | ~70% | fitting the parameters |
| **Validation** | ~15% | tuning hyperparameters, choosing models |
| **Test** | ~15% | one final, unbiased evaluation |

:::warn Senior engineer's warning — data leakage
Splitting must happen **before** any feature engineering. If you scale or impute using the **full** dataset, information from the validation and test sets leaks into training. You get artificially high scores and catastrophic failure on truly unseen production data.
:::

:::key Key insight
If you peek at the test data during development, you have leaked the exam answers and your final metrics are compromised forever.
:::

**PRACTICE P2 (answered).** (a) The **test** set is locked away until the very end to give an unbiased final grade. (b) "Calculate the mean of the ENTIRE dataset before splitting to replace missing values" → **False**. (c) Hyperparameters are tuned on the **validation** set. (d) Peeking at the test set invalidates your evaluation → **True**.

:::reflect Reflect 1 — mean salary from all 100,000 rows, then split, then impute the training set with it. Leakage?
**Yes.** The overall mean contains information about the test distribution, so the model implicitly learned from the test data.
:::

**The correct recipe.** Split → \`fit\` the imputer/scaler on **train only** → \`transform\` train, validation and test with those train statistics. A scikit-learn \`Pipeline\` does this automatically.

:::take Takeaway
Split FIRST, engineer SECOND. The test set is sacred: touch it only once, at the very end.
:::`,
    formulas: [
      { name: 'Split sizes', tex: R`n_{\text{train}} \approx 0.70n,\quad n_{\text{val}} \approx 0.15n,\quad n_{\text{test}} \approx 0.15n`, sym: '$n$ = number of rows.', when: 'Counting rows in each block.' },
      { name: 'Leak-free statistic', tex: R`\mu_{\text{impute}} = \frac{1}{|\text{train}|}\sum_{i\in\text{train}} x_i\quad(\text{never over val/test})`, sym: 'Every preprocessing statistic is computed from training rows only.', when: 'Imputation, scaling, encoding vocabularies, feature selection.' }
    ],
    plots: [
      { id: 'P02-split', title: 'The data-splitting framework (golden barrier)', notice: 'Only the training block feeds `fit`. Validation steers choices; the test block is opened once.',
        spec: { type: 'flow', w: 640, h: 170, nodes: [
          { id: 'tr', x: 205, y: 60, w: 380, h: 50, t: 'Training data ~70%\nfit parameters', c: 's1', bold: true },
          { id: 'va', x: 470, y: 60, w: 110, h: 50, t: 'Validation\n~15%', c: 's2', bold: true },
          { id: 'te', x: 580, y: 60, w: 100, h: 50, t: 'Test\n~15%', c: 's4', bold: true },
          { id: 'a', x: 205, y: 140, w: 220, h: 34, t: 'learn weights, scaler stats', c: 's1', shape: 'round' },
          { id: 'b', x: 445, y: 140, w: 150, h: 34, t: 'tune hyperparameters', c: 's2', shape: 'round' },
          { id: 'c', x: 590, y: 140, w: 90, h: 34, t: 'final grade', c: 's4', shape: 'round' }],
          edges: [{ a: 'tr', b: 'a' }, { a: 'va', b: 'b' }, { a: 'te', b: 'c' }] } }
    ],
    examples: [
      { title: 'How leakage inflates the imputed value (worked, matches the code)', body: R`Time-ordered salary data (₹ k): the first 10 rows (train) are around 30–38 with one missing; the last 10 (test) are around 90–100.
- Full-data mean (**wrong**): 65.79 → the missing training value is filled with a number the training period never saw.
- Train-only mean (**right**): 33.22.

The wrong version quietly tells the model that salaries near 66 occurred in the training period, which is information from the future.` },
      { title: 'Split sizes (worked)', body: R`n = 10,000 rows, 70/15/15 → train 7,000, validation 1,500, test 1,500.
With \`train_test_split\` you usually split twice: first 70% vs 30%, then split the 30% in half (15% + 15%).` }
    ],
    code: [{ title: '70/15/15 split and a leak-free pipeline', scratch: 'L02_split_leakage_scratch.py', lib: 'L02_split_leakage_sklearn.py' }],
    traps: [
      'Imputing or scaling with full-data statistics **before** splitting is leakage, even if the model itself never sees the test rows.',
      'Tuning on the test set = leakage. Tune on validation (or cross-validation, L9).',
      'The worksheet\'s macro loop lists "prepare data" before "split", but its own warning says preprocessing statistics must come from training data only. In practice: split, then fit preprocessing on train.',
      'Feature selection decisions (L10) must also be made on training data only.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A data scientist computes the mean salary from **all** 100,000 rows, then splits, then imputes the training set with that mean. This is:', options: ['Correct practice', 'Data leakage', 'Overfitting but not leakage', 'Feature selection'], answer: 1,
        sol: 'Reflect 1: test-set information (the overall mean) influenced training → leakage.', why: ['Statistics must come from train only.', 'Correct.', 'It is specifically leakage.', 'Unrelated.'] },
      { type: 'int', diff: 'E', q: 'A dataset has **12,000** rows split 70/15/15. How many rows are in the **test** set?', answer: 1800, tol: 0, round: 'Exact integer', verify: '0.15*12000',
        sol: '0.15 × 12,000 = **1,800** (train 8,400, validation 1,800).' },
      { type: 'mcq', diff: 'M', q: 'When should feature scaling statistics (min, max, mean, std) be computed?', options: ['On the full dataset before splitting', 'On the training set only, after splitting', 'On the test set only', 'Separately on each set'], answer: 1,
        sol: 'Fit on train, then transform val/test with the same statistics. Fitting separately on each set also breaks consistency (test is scaled differently).', why: ['Leakage.', 'Correct.', 'Leakage and wrong for training.', 'Inconsistent scales; also uses test statistics.'] },
      { type: 'mcq', diff: 'E', q: 'Which set is "locked away until the very end"?', options: ['Training', 'Validation', 'Test', 'None; all are used throughout'], answer: 2,
        sol: 'P2(a): the test set gives one unbiased final grade.', why: ['Used continuously.', 'Used for tuning.', 'Correct.', 'False.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.model_selection import train_test_split
X = np.arange(100).reshape(-1, 1)
X_tr, X_tmp = train_test_split(X, test_size=0.30, random_state=0)
X_va, X_te = train_test_split(X_tmp, test_size=0.50, random_state=0)
print(len(X_tr), len(X_va), len(X_te))`, answer: '70 15 15',
        sol: '30% of 100 = 30 rows are held out, then split in half: 15 and 15. Train keeps 70.' },
      { type: 'msq', diff: 'M', q: 'Which actions cause **data leakage**? (select all)', options: ['Fitting a StandardScaler on all rows before splitting', 'Choosing the best `max_depth` by looking at test accuracy', 'Fitting an imputer on the training rows inside a Pipeline', 'Selecting features by their correlation with the target over the full dataset'], answer: [0, 1, 3],
        sol: 'Any use of validation/test information during development leaks. A Pipeline fitted on train is the correct pattern.', why: ['Leakage.', 'Leakage (tuning on test).', 'Correct practice, no leakage.', 'Leakage: selection used test rows.'] }
    ],
    source: 'Worksheet L2 pp.2–3; Kaufman et al., "Leakage in Data Mining" (2012); scikit-learn "Common pitfalls" guide.'
  },
  /* ---------------------------------------------------------------- L02.3 */
  {
    id: 'L02.3', title: 'Phase 6 feature engineering and Phase 7 baseline', badge: 'class', pages: '3–4', ws: 'Phases 6–7',
    concept: R`
:::hook Hook
One student studies 10 hours but sleeps 0 and fails. Another sleeps 10 hours but studies 0 and also fails. Success depends on the **combination** of study **and** sleep. Can an algorithm see this if it looks at each column separately?
:::

Raw data is raw marble; feature engineering sculpts it so the structure becomes obvious. Two pillars:

**1. Feature creation** — generate new inputs from existing ones.
- *Domain knowledge:* turn raw temperature (41 °C) into **Cold (≤ 15 °C), Warm (16–30 °C), Hot (> 30 °C)**. This reduces endless decimal noise to meaningful categories.
- *Combining features:* \`Water_Availability_Index = Average_Rainfall × Soil_Moisture_%\`. One computed value represents the joint effect directly. (A product of two features is an **interaction term**.)

**2. Feature selection** — keep predictive inputs, drop noise (500 noisy features → confusion and overfitting).
- *Filter methods:* screen features **before** training with a statistic (e.g. correlation ≈ 0 with the target → drop).
- *Embedded methods:* selection happens **during** training; random forests report **feature-importance scores**.

:::key Key insight
With high-quality features even a simple algorithm predicts well; with poor features even the most complex neural network struggles.
:::

**PRACTICE P3.** (a) Length and Width → **Area = Length × Width**. (b) Dropping columns with 0.05 correlation → **C (filter)**; Rainfall × Soil_Moisture → **A (combining features)**; Random forest ranks importances → **B (embedded)**.

**Phase 7 — Baseline (the performance floor).** A baseline is the simplest possible model: the **historical average** (regression), the **majority class** (classification), or a primitive linear model.
- *Technical benchmark:* if a complex model cannot beat the baseline, its extra complexity is not justified.
- *Business benchmark:* is +2% accuracy worth millions more in cloud cost, training time and maintenance?

**PRACTICE P4.** Decision tree 80%; random forest 81% but ₹20 lakh more to deploy. (a) Is the 1% necessarily worth it? **No.** (b) Comparing with a baseline ensures that the extra complexity, cost and maintenance are justified by a **significant** gain over a simpler, cheaper alternative.

:::take Takeaway
Feature engineering = creation (new signals) + selection (remove noise), both **after** splitting. A baseline sets the floor; if the complex model cannot beat it, the extra cost is wasted.
:::`,
    formulas: [
      { name: 'Interaction feature', tex: R`x_{\text{new}} = x_1 \times x_2`, sym: 'e.g. Area = Length × Width; Water index = Rainfall × Moisture.', when: 'The effect of one input depends on another.' },
      { name: 'Mean baseline (regression)', tex: R`\hat y_{\text{base}} = \bar y_{\text{train}}`, sym: 'Always predict the training mean.', when: 'Performance floor for regression (also the R² reference, L7).' },
      { name: 'Majority baseline (classification)', tex: R`\hat y_{\text{base}} = \arg\max_c\ n_c`, sym: 'Always predict the most frequent class.', when: 'Performance floor for classification.' }
    ],
    examples: [
      { title: 'Why an interaction term helps (worked, matches the code)', body: R`House price depends on **area** = length × width. A linear model on raw length and width can only add their effects: $\hat y = w_0 + w_1L + w_2W$. It cannot represent a product.
- Baseline (predict mean) test MAE ≈ 200.7
- Linear on raw L, W: ≈ 48.6
- Linear + Area feature: ≈ **15.2**

The same simple algorithm became 3× better because of one engineered feature.` },
      { title: 'Temperature binning (worked)', body: R`Rule: Cold ≤ 15, Warm 16–30, Hot > 30. Readings [12, 16, 30, 41] → [Cold, Warm, Warm, Hot]. Note 30 is **Warm** (the boundary belongs to the lower band).` }
    ],
    code: [{ title: 'Interaction feature and a mean baseline', lib: 'L02_features_baseline_sklearn.py' }],
    traps: [
      'Filter = **before** training using statistics; embedded = **during** training (e.g. tree importances, Lasso in L12); wrapper = repeatedly training models (L10).',
      'A tiny improvement over the baseline is not automatically worth deploying. Do the cost–benefit arithmetic.',
      'Feature engineering also happens **after** splitting (statistics from train only).'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Creating `Area = Length × Width` is an example of:', options: ['Filter method', 'Embedded method', 'Combining features (interaction term)', 'Baseline'], answer: 2,
        sol: 'P3(a): a new feature from multiplying two existing ones.', why: ['Filters remove features.', 'Embedded selection happens inside training.', 'Correct.', 'Unrelated.'] },
      { type: 'mcq', diff: 'E', q: 'A random forest ranks features by importance during training. This is a(n):', options: ['Filter method', 'Embedded method', 'Domain-knowledge feature', 'Data split'], answer: 1,
        sol: 'P3(b): selection happens automatically during training → embedded.', why: ['Filters run before training.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'A decision tree scores 80%; a random forest scores 81% but costs ₹20 lakh more to deploy. The worksheet says:', options: ['Always deploy the better model', 'The 1% is not necessarily worth it; weigh cost against benefit', 'Random forests are always worth it', 'Accuracy cannot be compared'], answer: 1,
        sol: 'P4: No, the 1% gain is not necessarily worth ₹20 lakh. Business value must justify cost.', why: ['Ignores cost.', 'Correct.', 'No algorithm is always worth it.', 'They can be compared.'] },
      { type: 'int', diff: 'M', q: 'Baseline MAE = 12, new model MAE = 11. Each unit of MAE costs **₹80,000 per farm** in wrong payouts, and there are **500 farms**. Annual saving in ₹?', answer: 40000000, tol: 0, round: 'Exact integer (rupees)', verify: '(12-11)*80000*500',
        sol: 'Saving = 1 × 80,000 × 500 = ₹**4,00,00,000** (4 crore). If training costs ₹15 lakh, deploying is clearly worth it. (Contrast with P11.3, where no business value per unit is given and the key says "No".)' },
      { type: 'mcq', diff: 'E', q: 'For a classification task, the simplest **baseline** is:', options: ['A deep neural network', 'Always predicting the majority class', 'A random forest with 500 trees', 'Predicting the training mean'], answer: 1,
        sol: 'Majority-class guess for classification; historical mean for regression.', why: ['Not simple.', 'Correct.', 'Not simple.', 'That is the regression baseline.'] },
      { type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`def band(t):
    return "Cold" if t <= 15 else ("Warm" if t <= 30 else "Hot")
print([band(t) for t in [15, 16, 30, 31]])`, answer: "['Cold', 'Warm', 'Warm', 'Hot']",
        sol: '15 ≤ 15 → Cold; 16 and 30 ≤ 30 → Warm; 31 > 30 → Hot. Boundary values belong to the lower band.' }
    ],
    source: 'Worksheet L2 pp.3–4; Zheng & Casari, *Feature Engineering for ML* ch.1; scikit-learn `DummyRegressor`.'
  },
  /* ---------------------------------------------------------------- L02.4 */
  {
    id: 'L02.4', title: 'Phase 8 — Modelling loop: selection, training, MSE, gradient descent, convergence', badge: 'class', pages: '4–7', ws: 'Phase 8',
    concept: R`
:::hook Hook
A hospital must predict heart attacks. An **85%-accurate model explains its reasoning** step by step. A **92%-accurate model is a black box**. Which do you choose when a wrong prediction can be fatal?
:::

**Pillar A — Model selection** is an exercise in trade-offs, not "pick the most powerful".

| Factor | Meaning | Trade-off |
|---|---|---|
| Interpretability | can it explain its reasoning? | easier to audit, often lower accuracy |
| Accuracy | how correct are predictions? | better predictions, may be a black box |
| Training time | how long to train? | complex models take hours/days |
| Scalability | millions of rows? | simple models scale easily; DL needs GPUs |

Tasks → algorithms: regression (linear regression, random-forest regressor), classification (logistic regression, SVM, decision trees), clustering (K-means, DBSCAN).

**PRACTICE P5.** Hospital → **Model A (85%, explainable)**: lives are at stake; doctors must understand and trust the reasoning, and accountability matters. Self-driving car → usually still the explainable model for **safety and debugging**, although higher accuracy will be demanded over time.

**Pillar B — Model training.** Example: crop yield $y = w_0 + w_1x_1 + w_2x_2$ with $x_1$ = rainfall, $x_2$ = soil moisture. $w_1, w_2$ are weights (influence of each feature), $w_0$ is the intercept (baseline when all inputs are zero). Training finds the values that give the most accurate predictions.

**The measuring stick — MSE loss**
$$\text{MSE} = \frac1n\sum_{i=1}^n (y_i - \hat y_i)^2$$
We square so negative and positive errors do not cancel. Goal: MSE → 0 (as small as possible).

**Optimisation by gradient descent.** Standing on a foggy mountain, feel the slope and step downhill; repeat until the ground is flat. Altitude = loss; your coordinates = weights. GD computes the slope and moves the weights toward lower error.

**Convergence.** Near the bottom the slope → 0, so the steps become tiny and the loss curve flattens. Training stops and the parameters are locked.

**The training loop**

| Step | Action | What happens |
|---|---|---|
| 1 | Initialise | weights start as random numbers |
| 2 | Forward pass | compute $\hat y = w_0 + w_1x_1 + w_2x_2$ |
| 3 | Compute loss | MSE: how far from the truth? |
| 4 | Backward pass | gradient descent: slope → adjust weights downhill |
| 5 | Converged? | loss flat → stop; else repeat from step 2 |

**PRACTICE P6:** Initialise (1) → Forward pass (2) → Compute loss (3) → Gradient descent (4) → Convergence check (5).

:::take Takeaway
The modelling loop is iterative: select an algorithm → set hyperparameters → train (forward pass → loss → gradient descent) → check convergence → repeat.
:::`,
    formulas: [
      { name: 'Mean squared error', tex: R`\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i-\hat y_i)^2`, sym: '$n$ points, $y_i$ true, $\hat y_i$ predicted. Units: (units of y)².', when: 'Training loss for regression; evaluation (with RMSE).' },
      { name: 'Gradient-descent step (preview of L5)', tex: R`w \leftarrow w - \alpha\,\frac{\partial\,\text{Loss}}{\partial w}`, sym: '$\alpha$ = learning rate (hyperparameter).', when: 'The "backward pass" of the loop.' }
    ],
    plots: [
      { id: 'P02-lossbowl', title: 'Gradient descent on a 1-D loss curve', notice: 'Steps are large where the slope is steep and shrink automatically near the minimum, because each step is proportional to the slope.',
        spec: (function () {
          const L = w => (w - 3) ** 2 + 1, g = w => 2 * (w - 3), pts = []; let w = -1;
          for (let i = 0; i < 7; i++) { pts.push([w, L(w)]); w = w - 0.3 * g(w); }
          return { type: 'xy', w: 520, h: 300, xlim: [-1.5, 6], ylim: [0, 18], xlabel: 'weight value w', ylabel: 'loss', legend: 'tr',
            series: [{ t: 'fn', f: L, c: 's1', label: 'loss L(w)' }, { t: 'line', pts, c: 's4', arrow: true, label: 'GD steps (α = 0.3)' }, { t: 'scatter', pts: [[3, 1]], c: 's3', r: 6 }, { t: 'text', x: 3, y: 2.6, s: 'minimum loss &\ngood weight value' }] };
        })() },
      { id: 'P02-converge', title: 'Convergence: loss vs iterations', notice: 'The curve drops fast at first, then flattens. "Flat" = converged; extra iterations barely change the loss.',
        spec: { type: 'xy', w: 520, h: 280, xlim: [0, 700], ylim: [0, 100], xlabel: 'iterations', ylabel: 'loss (MSE)', series: [{ t: 'fn', f: x => 5 + 90 * Math.exp(-x / 90), c: 's1', w: 2.5 }, { t: 'hline', y: 5, c: 's3', dash: true }, { t: 'text', x: 520, y: 14, s: 'converged: slope ≈ 0' }] } }
    ],
    examples: [
      { title: 'MSE by hand (worked)', body: R`True y = [3, 5, 7, 10]; predicted ŷ = [2, 5, 9, 8].
| i | y | ŷ | e = y − ŷ | e² |
|---|---|---|---|---|
| 1 | 3 | 2 | 1 | 1 |
| 2 | 5 | 5 | 0 | 0 |
| 3 | 7 | 9 | −2 | 4 |
| 4 | 10 | 8 | 2 | 4 |
Sum of e² = 9 → **MSE = 9/4 = 2.25**. (Note Σe = 1: signed errors almost cancel, which is why we square.)` }
    ],
    code: [{ title: 'The full training loop (BGD) — preview of Lecture 5', scratch: 'L05_bgd_scratch.py', lib: 'L05_bgd_sklearn.py' }],
    traps: [
      'The loop order is **initialise → forward → loss → backward (GD) → check**. The loss is computed **before** the gradient step.',
      'Higher accuracy is not automatically the right choice: in safety-critical domains interpretability can win (P5).',
      'Converged means the loss **stopped changing**, not that it reached 0.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'y = [3, 5, 7, 10], ŷ = [2, 5, 9, 8]. Compute the **MSE**.', answer: 2.25, tol: 0.001, round: '2 decimals', verify: '((3-2)**2+(5-5)**2+(7-9)**2+(10-8)**2)/4',
        sol: 'Errors 1, 0, −2, 2; squares 1, 0, 4, 4; sum 9; MSE = 9/4 = **2.25**.' },
      { type: 'mcq', diff: 'E', q: 'What is the correct order of the training loop?', options: ['Forward pass → Initialise → Loss → GD → Check', 'Initialise → Forward pass → Loss → GD → Check', 'Initialise → GD → Forward pass → Loss → Check', 'Loss → Initialise → Forward pass → GD → Check'], answer: 1,
        sol: 'P6: 1 Initialise, 2 Forward pass, 3 Compute loss, 4 Gradient descent, 5 Convergence check.', why: ['You cannot predict before initialising.', 'Correct.', 'GD needs the loss first.', 'Loss needs predictions.'] },
      { type: 'mcq', diff: 'M', q: 'Why does MSE **square** the errors?', options: ['To make the computation faster', 'So negative and positive errors do not cancel (and big errors count more)', 'Because the data are always positive', 'To make the loss linear in the weights'], answer: 1,
        sol: 'Worksheet: squaring stops negatives cancelling positives. It also penalises large errors more heavily (L3).', why: ['Not the reason.', 'Correct.', 'Errors can be negative.', 'Squared loss is quadratic in the weights.'] },
      { type: 'mcq', diff: 'M', q: 'A hospital chooses between an 85%-accurate **explainable** model and a 92%-accurate **black box** for heart-attack prediction. The worksheet answer is:', options: ['The black box: higher accuracy saves more lives', 'The explainable model: doctors must understand and trust the reasoning', 'Neither: use the baseline', 'Average the two models'], answer: 1,
        sol: 'P5: in safety-critical healthcare, interpretability, accountability and trust come first.', why: ['Ignores liability and trust.', 'Correct.', 'No.', 'Not discussed.'] },
      { type: 'mcq', diff: 'E', q: 'As gradient descent approaches the minimum, the steps become:', options: ['larger', 'tiny, because the slope approaches zero', 'random', 'constant'], answer: 1,
        sol: 'The step is proportional to the slope, which → 0 at the minimum; the loss curve flattens (convergence).', why: ['Opposite.', 'Correct.', 'GD is deterministic.', 'Only with a sign-based method, not standard GD.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
y = np.array([4, 6, 8]); yhat = np.array([5, 6, 6])
print(np.mean((y - yhat) ** 2), np.sum(y - yhat))`, answer: '1.6666666666666667 1',
        sol: 'Errors −1, 0, 2: squares 1, 0, 4 → mean 5/3 = 1.6666666666666667. The signed sum is −1 + 0 + 2 = 1.' }
    ],
    source: 'Worksheet L2 pp.4–7; Géron ch.4 (training models).'
  },
  /* ---------------------------------------------------------------- L02.5 */
  {
    id: 'L02.5', title: 'Phase 9 — Offline evaluation and business mapping', badge: 'class', pages: '7–8', ws: 'Phase 9',
    concept: R`
After training converges, pass the **untouched test set** through the **locked** model.

**Regression metrics (overview — full treatment in Lecture 7)**

| Metric | What it does | Best for |
|---|---|---|
| **MAE** (mean absolute error) | average of \|true − predicted\|; treats all errors **linearly** | interpretability for non-technical people: "MAE 5.2 = off by 5.2 units on average" |
| **RMSE** (root mean squared error) | √(average squared error); **penalises large errors heavily** | when large errors are catastrophic: 9 small errors + 1 huge error → RMSE spikes |
| **R²** (coefficient of determination) | relative scale, usually 0 to 1; compares the model to the **mean-guess baseline** | "0.85 = model explains 85% of the variance"; shows improvement over baseline |

**Business metric mapping.** Technical results must translate into business value. *Example:* reducing RMSE by 1.5 units in agriculture → 12% less predicted crop failure → about ₹2,00,000 saved per hectare.

**PRACTICE P7.** (a) An error of 100 units is catastrophic → **RMSE**. (b) CEO asks "how much better than guessing?" → **R²**. (c) "On average, how many km off are our delivery estimates?" → **MAE**.

:::reflect Reflect 2 — why is improving RMSE by 1.5 units valuable?
It means fewer **extreme** prediction errors, which reduces catastrophic crop failures and saves revenue.
:::

:::take Takeaway
MAE for equal-penalty interpretation. RMSE when large errors are catastrophic. R² for performance relative to the baseline. Always translate metrics into business value.
:::`,
    formulas: [
      { name: 'MAE', tex: R`\text{MAE} = \frac1n\sum_{i=1}^n |y_i-\hat y_i|`, sym: 'Same units as y.', when: '"On average, how far off?"' },
      { name: 'RMSE', tex: R`\text{RMSE} = \sqrt{\frac1n\sum_{i=1}^n (y_i-\hat y_i)^2}`, sym: 'Same units as y; dominated by large errors.', when: 'Large errors are catastrophic.' },
      { name: 'R² (preview)', tex: R`R^2 = 1-\frac{\sum (y_i-\hat y_i)^2}{\sum (y_i-\bar y)^2}`, sym: R`Fraction of variance explained relative to predicting $\bar y$.`, when: '"How much better than the average guess?"' }
    ],
    examples: [
      { title: '9 small errors + 1 huge error (worked)', body: R`Errors: nine errors of 1 and one error of 20.
- MAE = (9 × 1 + 20)/10 = 29/10 = **2.9**
- MSE = (9 × 1 + 400)/10 = 409/10 = 40.9 → RMSE = √40.9 ≈ **6.40**

RMSE is more than twice the MAE because the single huge error is squared. If that error is catastrophic, RMSE is the metric that "notices" it.` }
    ],
    code: [{ title: 'MAE, MSE, RMSE, R² (full version in Lecture 7)', scratch: 'L07_regression_metrics_scratch.py', lib: 'L07_regression_metrics_sklearn.py' }],
    traps: [
      'RMSE ≥ MAE always (equal only when all absolute errors are the same).',
      'R² can be **negative** on test data if the model is worse than predicting the mean (L7).',
      'The test set is evaluated with the **locked** model: no more tuning after you look.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A medical prediction error of 100 units would be fatal. Which metric?', options: ['MAE', 'RMSE', 'R²', 'Accuracy'], answer: 1,
        sol: 'P7(a): RMSE squares errors, so large errors dominate it.', why: ['Treats errors linearly.', 'Correct.', 'Relative measure, not focused on large errors.', 'Regression task, not classification.'] },
      { type: 'mcq', diff: 'E', q: 'A logistics team asks "on average, how many km off are our delivery estimates?" Which metric?', options: ['MAE', 'RMSE', 'R²', 'MSE'], answer: 0,
        sol: 'P7(c): MAE is the average absolute error, in km.', why: ['Correct.', 'Not a plain average.', 'Unit-free.', 'In km², hard to interpret.'] },
      { type: 'mcq', diff: 'E', q: 'A CEO asks "how much better is the model than just guessing the average?" Which metric?', options: ['MAE', 'RMSE', 'R²', 'MSE'], answer: 2,
        sol: 'P7(b): R² compares the model to the mean baseline.', why: ['Absolute.', 'Absolute.', 'Correct.', 'Absolute.'] },
      { type: 'int', diff: 'M', q: 'Ten errors: nine are 1 and one is 20. Compute the **RMSE** (2 decimals).', answer: 6.4, tol: 0.01, round: '2 decimals', verify: '((9*1+400)/10)**0.5',
        sol: 'MSE = (9 + 400)/10 = 40.9. RMSE = √40.9 ≈ **6.40** (MAE is only 2.9).' },
      { type: 'int', diff: 'M', q: 'Same ten errors (nine of 1, one of 20). Compute the **MAE** (1 decimal).', answer: 2.9, tol: 0.001, round: '1 decimal', verify: '(9*1+20)/10',
        sol: 'MAE = (9 + 20)/10 = **2.9**.' },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.metrics import mean_absolute_error, mean_squared_error
y, p = [10, 20, 30], [12, 18, 33]
print(mean_absolute_error(y, p), round(mean_squared_error(y, p) ** 0.5, 3))`, answer: '2.3333333333333335 2.38',
        sol: 'Absolute errors 2, 2, 3 → MAE = 7/3 = 2.3333333333333335. Squared 4, 4, 9 → MSE = 17/3 ≈ 5.667 → RMSE ≈ 2.380, printed by round as 2.38.' }
    ],
    source: 'Worksheet L2 pp.7–8; Willmott & Matsuura (2005) on MAE vs RMSE.'
  },
  /* ---------------------------------------------------------------- L02.6 */
  {
    id: 'L02.6', title: 'Phases 10–11 — Deployment, drift, retraining and the macro loop', badge: 'class', pages: '8–11', ws: 'Phases 10–11, Macro loop, P9–P11',
    concept: R`
:::hook Hook
You spent months building an accurate model. It runs perfectly on your laptop, but customers cannot access your terminal. How do thousands of people use it?
:::

**Phase 10 — Deployment** packages the trained parameters into accessible formats inside production infrastructure.
1. **Export / serialisation:** \`.pkl\` (pickle) is the standard Python format for scikit-learn models.
2. **Infrastructure pathways:**

| Pathway | How it works |
|---|---|
| Web services (APIs) | wrap the model in Flask/FastAPI and expose an endpoint |
| Cloud platforms | deploy to AWS SageMaker, Google AI Platform, Azure |
| Edge deployment | compress the model onto local hardware (phone, IoT) |

3. **Ingestion strategies:**

| Strategy | How | Example |
|---|---|---|
| **Batch predictions** | run periodically (e.g. nightly) on massive datasets | weekly product recommendations |
| **Real-time inference** | runs instantly on demand, one request at a time | fraud detection at checkout |

:::hook Hook (Phase 11)
You deploy a model in 2019 to predict airline travel. In 2020 a global pandemic strikes. Your model was trained on 2010–2019 data. Is it still accurate?
:::

**Phase 11 — Post-deployment.** Traditional code runs identically forever; **ML models decay**. **Model drift** = prediction accuracy drops because the real-world environment changed, making the training insights outdated.

*Monitoring:* tools such as **Prometheus** and **MLflow** run in the background, track the statistical distributions of live data, and alert the team when performance drops below a baseline threshold.

| Retraining | How it works | Example |
|---|---|---|
| **Periodic** | fixed schedule (monthly/quarterly) **regardless of performance** | retrain on the 1st of every month |
| **Triggered** | starts when monitoring detects accuracy **below a threshold** | accuracy < 85% → retrain now |

**PRACTICE P9.** (a) Retrain every month regardless → **B, periodic**. (b) Accuracy fell 92% → 78% and auto-retrains → **A, triggered**. (c) Deploy and walk away without monitoring → **False**.

**The complete macro loop:** 1 define the problem → 2 collect data → 3 prepare data → 4 split → 5 engineer features → 6 baseline → 7 modelling loop → 8 evaluate on the test set → 9 deploy → 10 monitor and trigger retraining (loops back).

**PRACTICE P10 (order):** Data splitting (1) → Feature engineering (2) → Baseline (3) → Evaluation (4) → Deployment (5).

**PRACTICE P11 — crop-yield system (answered).** 1. Locked until the end → **Test**. 2. Interaction feature → **Water_Sun_Index = Rainfall × Sunlight_Hours**. 3. Baseline MAE 12, model MAE 11, training costs ₹15 lakh → key: **No**, a small improvement is unlikely to justify the cost *(unless a value per MAE unit is given; see the cost–benefit question in L02.3)*. 4. A 50-tonne error is catastrophic → **RMSE**. 5. Once per season for all 10,000 farms → **batch inference**. 6. A severe drought changes the weather patterns → **model drift**; handled automatically by **triggered retraining**.

:::take Takeaway
Serialise the model, choose a pathway (API, cloud, edge), pick batch vs real-time by latency. A model is a living system: monitor it and retrain it.
:::`,
    formulas: [
      { name: 'Triggered-retraining rule', tex: R`\text{if } \text{metric}_{\text{live}} < \tau \ \Rightarrow\ \text{retrain}`, sym: '$\\tau$ = acceptable threshold (e.g. 85% accuracy).', when: 'Distinguishing triggered from periodic retraining.' }
    ],
    plots: [
      { id: 'P02-decay', title: 'Model decay over time and triggered retraining', notice: 'Accuracy drifts down as the world changes. When it crosses the threshold, retraining restores it (saw-tooth pattern).',
        spec: (function () {
          const pts = []; let acc = 92, t = 0; const resets = [];
          for (let i = 0; i <= 120; i++) { t = i; acc -= 0.12 + 0.05 * Math.sin(i / 3); if (acc < 85) { resets.push(i); acc = 92; } pts.push([t, acc]); }
          return { type: 'xy', w: 560, h: 280, xlim: [0, 120], ylim: [80, 95], xlabel: 'time (weeks)', ylabel: 'model accuracy (%)', legend: 'br',
            series: [{ t: 'line', pts, c: 's1', label: 'live accuracy' }, { t: 'hline', y: 85, c: 's4', dash: true, label: 'threshold 85%' }, ...resets.map(x => ({ t: 'vline', x, c: 's3', dash: '2 3', w: 1.2 }))] };
        })() },
      { id: 'P02-lifecycle', title: 'The complete macro loop', notice: 'Step 10 (monitoring) feeds back into the loop: retraining reuses steps 2–9 with fresh data.',
        spec: { type: 'flow', w: 660, h: 270, nodes: [
          { id: 'n1', x: 80, y: 40, w: 130, h: 40, t: '1 Define problem', c: 's1' }, { id: 'n2', x: 240, y: 40, w: 130, h: 40, t: '2 Collect data', c: 's1' },
          { id: 'n3', x: 400, y: 40, w: 130, h: 40, t: '3 Prepare data', c: 's1' }, { id: 'n4', x: 565, y: 40, w: 130, h: 40, t: '4 Split', c: 's2' },
          { id: 'n5', x: 565, y: 130, w: 130, h: 40, t: '5 Features', c: 's2' }, { id: 'n6', x: 400, y: 130, w: 130, h: 40, t: '6 Baseline', c: 's2' },
          { id: 'n7', x: 240, y: 130, w: 130, h: 40, t: '7 Modelling loop', c: 's5' }, { id: 'n8', x: 80, y: 130, w: 130, h: 40, t: '8 Evaluate (test)', c: 's4' },
          { id: 'n9', x: 80, y: 225, w: 130, h: 40, t: '9 Deploy', c: 's3' }, { id: 'n10', x: 290, y: 225, w: 200, h: 40, t: '10 Monitor & retrain', c: 's3', bold: true }],
          edges: [{ a: 'n1', b: 'n2' }, { a: 'n2', b: 'n3' }, { a: 'n3', b: 'n4' }, { a: 'n4', b: 'n5' }, { a: 'n5', b: 'n6' }, { a: 'n6', b: 'n7' }, { a: 'n7', b: 'n8' }, { a: 'n8', b: 'n9' }, { a: 'n9', b: 'n10' },
            { a: 'n10', b: 'n2', via: [[560, 225], [640, 225], [640, 95], [240, 95]], t: 'retraining loop', dash: true, c: 's3', dy: -8 }] } }
    ],
    examples: [
      { title: 'Batch or real-time? Periodic or triggered? (worked)', body: R`| Scenario | Answer |
|---|---|
| Fraud check while the customer waits at checkout | real-time inference |
| Yield forecast for 10,000 farms once a season | batch inference |
| Weekly "recommended for you" e-mail | batch inference |
| Retrain every quarter on a calendar | periodic retraining |
| MLflow alert: accuracy 78% < 85% → retrain | triggered retraining |
| Pandemic changes travel patterns | model drift |` }
    ],
    code: [{ title: 'Serialise to .pkl, reload, batch vs real-time prediction', lib: 'L02_pickle_deploy.py', libLabel: 'pickle + scikit-learn' }],
    traps: [
      'Periodic = calendar-driven **regardless of performance**; triggered = **performance-driven** (a threshold).',
      'Drift does not mean the code has a bug; the code is fine, the world changed.',
      '"Deploy and walk away" is always wrong for ML (P9(c)).',
      'Batch vs real-time is chosen by **latency** needs, not by model accuracy.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A monitoring tool sees accuracy fall from 92% to 78% and automatically starts retraining. This is:', options: ['Periodic retraining', 'Triggered retraining', 'Batch inference', 'Feature selection'], answer: 1,
        sol: 'P9(b): retraining started by a performance threshold → triggered.', why: ['Periodic ignores performance.', 'Correct.', 'Inference mode, not retraining.', 'Unrelated.'] },
      { type: 'mcq', diff: 'E', q: 'Fraud detection at checkout should use:', options: ['Batch predictions', 'Real-time inference', 'Periodic retraining', 'Edge clustering'], answer: 1,
        sol: 'Each request must be scored instantly, one at a time → real-time inference.', why: ['Too late by the next night.', 'Correct.', 'That is a retraining schedule.', 'Not a concept here.'] },
      { type: 'mcq', diff: 'E', q: 'An airline-demand model trained on 2010–2019 performs badly in 2020 after a pandemic. This is called:', options: ['Overfitting', 'Data leakage', 'Model drift', 'Underfitting'], answer: 2,
        sol: 'The environment changed after training → model drift (Phase 11 hook).', why: ['Overfitting is about train vs test on the same distribution.', 'Leakage is test info in training.', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'The standard Python file format for saving a scikit-learn model is:', options: ['.csv', '.pkl (pickle)', '.png', '.ipynb'], answer: 1,
        sol: 'Serialisation with pickle → .pkl.', why: ['Data, not a model.', 'Correct.', 'Image.', 'Notebook.'] },
      { type: 'mcq', diff: 'M', q: 'Correct order for: Feature engineering, Deployment, Data splitting, Baseline, Evaluation?', options: ['Splitting → Features → Baseline → Evaluation → Deployment', 'Features → Splitting → Baseline → Deployment → Evaluation', 'Baseline → Splitting → Features → Evaluation → Deployment', 'Splitting → Baseline → Features → Deployment → Evaluation'], answer: 0,
        sol: 'P10: 1 splitting, 2 feature engineering, 3 baseline, 4 evaluation, 5 deployment.', why: ['Correct.', 'Features must come after splitting.', 'Baseline needs the split and features.', 'Evaluation must come before deployment.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** true statements about post-deployment.', options: ['ML models can decay even if the code is unchanged', 'Prometheus/MLflow can track live data distributions and alert', 'Periodic retraining waits for accuracy to drop', 'You can deploy and walk away without monitoring'], answer: [0, 1],
        sol: 'Models decay (drift); monitoring tools alert. Periodic retraining is calendar-based; walking away is false (P9(c)).', why: ['Correct.', 'Correct.', 'That describes triggered retraining.', 'False.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import pickle
from sklearn.linear_model import LinearRegression
m = LinearRegression().fit([[1], [2], [3]], [3, 5, 7])
m2 = pickle.loads(pickle.dumps(m))
print(round(float(m2.predict([[10]])[0]), 2))`, answer: '21.0',
        sol: 'The data follow y = 2x + 1. Pickling and unpickling preserves the parameters, so the prediction at 10 is 21.0.' }
    ],
    source: 'Worksheet L2 pp.8–11; Gama et al., "A survey on concept drift adaptation" (2014); MLflow docs.'
  }
  ]
});
