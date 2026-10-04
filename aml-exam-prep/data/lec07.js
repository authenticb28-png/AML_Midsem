/* Lecture 7 — Regression and classification evaluation metrics */
(function () {
const Y = [30, 35, 40, 45, 50, 55, 60, 65], YA = [32, 34, 43, 42, 49, 58, 56, 70];
const CM = [[6, 1, 1], [1, 4, 1], [0, 2, 2]];
LECTURES.push({
  num: 7, short: 'Evaluation metrics', title: 'Evaluation Metrics — MAE, MAPE, MSE, RMSE, R², Adjusted R², Confusion Matrix, Precision, Recall, F1, Averages',
  file: 'AML_Lecture 7_Worksheet_Filled.pdf', pages: 13, extraFiles: 'Whiteboards/L08 (class of 3 Sep)',
  intro: R`**Exam weight: very high** — the most numerical lecture. Practise on the two master tables until automatic: **MAE 2.75, MAPE 5.69%, MSE 9.25, RMSE 3.04, R² 0.9295, adj R² 0.9013 vs 0.9000**, and the 3-class confusion matrix (**accuracy 0.667; Support P = R = F1 = 0.5; macro F1 0.638; weighted 0.672; micro 0.667**). Know which metric fits which decision. ROC/AUC is a researched extra. About 2 hours.`,
  units: [
  /* ---------------------------------------------------------------- L07.1 */
  {
    id: 'L07.1', title: 'Training loss vs evaluation metric', badge: 'class', pages: '1', ws: 'Section 1, Checkpoint 1',
    concept: R`
:::hook Central question
How do we know whether a trained model is actually good? A useful metric must match the **kind and cost of error** that matters for the decision.
:::

| | Training loss | Evaluation metric |
|---|---|---|
| Main role | guides parameter updates **during** training | judges a **fixed** model **after** training |
| Typical data | training data | validation or test data (generalisation) |
| Example | MSE used by an optimiser | MSE, MAE, R², F1… reported after fitting |

:::key Key insight
The **same expression can play both roles**. MSE is a *loss* when it guides learning and a *metric* when it judges a finished model. Context decides the role.
:::

**Checkpoint 1 (answered).** (a) Calculated on a held-out test set after parameters are fixed → **E**. (b) The optimiser uses it to update coefficients → **L**. (c) Answers whether the finished model is acceptable → **E**. *Can one number tell everything?* **No.** Different metrics answer different questions: typical errors, large errors, relative errors, baselines, false alarms, missed classes, class imbalance.`,
    formulas: [
      { name: 'Same formula, two roles', tex: R`\text{MSE} = \frac1n\sum (y_i-\hat y_i)^2`, sym: 'Loss on training data; metric on test data.', when: 'L/E classification questions.' }
    ],
    examples: [{ title: 'Loss or metric? (worked)', body: R`| Statement | Role |
|---|---|
| Logistic regression minimises cross-entropy with GD | loss |
| We report F1 = 0.81 on the test set | metric |
| Ridge minimises MSE + λ‖w‖² | loss |
| We compare models by validation RMSE | metric |
| Accuracy (not differentiable, so rarely a loss) | metric |` }],
    traps: ['Accuracy is almost never a **training loss** (it is not differentiable); it is an evaluation metric.', 'A metric computed on training data says little about generalisation.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Which statement describes an **evaluation metric**?', options: ['The optimiser uses it to update coefficients', 'It is computed on held-out data after the parameters are fixed', 'It must be differentiable', 'It is only used during training'], answer: 1, sol: 'Checkpoint 1(a).', why: ['That is a training loss.', 'Correct.', 'Metrics need not be differentiable (accuracy).', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'MSE used by gradient descent to update θ is playing the role of a:', options: ['evaluation metric', 'training loss', 'baseline', 'hyperparameter'], answer: 1, sol: 'Checkpoint 1(b).', why: ['Not here.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Can one number tell us everything about a model?', options: ['Yes, accuracy', 'Yes, R²', 'No — different metrics answer different questions', 'Yes, MSE'], answer: 2, sol: 'Typical vs large vs relative error, baseline, false alarms, missed classes, imbalance.', why: ['No.', 'No.', 'Correct.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Which can serve as **both** a training loss and an evaluation metric? (select all)', options: ['MSE', 'MAE', 'Accuracy as a GD loss', 'Cross-entropy'], answer: [0, 1, 3], sol: 'Differentiable (or sub-differentiable) error measures can be both. Accuracy is a step function, so GD cannot use it.', why: ['Yes.', 'Yes (sub-gradient).', 'Not differentiable.', 'Yes (log loss).'] },
      { type: 'mcq', diff: 'E', q: 'An evaluation metric should ideally be computed on:', options: ['training data', 'validation or test data', 'the full dataset before splitting', 'random noise'], answer: 1, sol: 'To judge generalisation.', why: ['Optimistic.', 'Correct.', 'Leakage.', 'No.'] }
    ],
    source: 'Worksheet L7 p.1.'
  },
  /* ---------------------------------------------------------------- L07.2 */
  {
    id: 'L07.2', title: 'Signed residuals and Master Test Data R', badge: 'class', pages: '1–2', ws: 'Section 2, H1(a)',
    concept: R`
Model A predicts monthly internship stipend (₹ thousand). Signed residual $e_{A,i} = y_i - \hat y_{A,i}$: **positive → predicted too low**, **negative → predicted too high**. A residual preserves direction; it does not summarise the model.

**Master Test Data R (used for all of Part 1)**

| ID | $y$ | $\hat y_A$ | $\hat y_B$ | $e_A$ | $\lvert e_A\rvert$ | $e_A^2$ | APE$_A$ (%) | $e_B^2$ |
|---|---|---|---|---|---|---|---|---|
| S1 | 30 | 32 | 32 | −2 | 2 | 4 | 6.67 | 4 |
| S2 | 35 | 34 | 34 | +1 | 1 | 1 | 2.86 | 1 |
| S3 | 40 | 43 | 43 | −3 | 3 | 9 | 7.50 | 9 |
| S4 | 45 | 42 | 43 | +3 | 3 | 9 | 6.67 | 4 |
| S5 | 50 | 49 | 49 | +1 | 1 | 1 | 2.00 | 1 |
| S6 | 55 | 58 | 58 | −3 | 3 | 9 | 5.45 | 9 |
| S7 | 60 | 56 | 56 | +4 | 4 | 16 | 6.67 | 16 |
| S8 | 65 | 70 | 69 | −5 | 5 | 25 | 7.69 | 16 |
| **Total** | | | | **−4** | **22** | **74** | **45.50** | **60** |

$\text{APE}_{A,i} = 100\,\lvert e_{A,i}\rvert/y_i$. Worked row S1: $e = 30 - 32 = -2$ → Model A **over-predicted** by ₹2k. (The APE total uses unrounded fractions.)`,
    formulas: [{ name: 'Signed residual', tex: R`e_i = y_i - \hat y_i`, sym: '+ → under-prediction, − → over-prediction.', when: 'Direction of error.' }, { name: 'Absolute percentage error', tex: R`\text{APE}_i = 100\,\frac{|y_i-\hat y_i|}{|y_i|}`, sym: '%', when: 'Building MAPE.' }],
    plots: [{ id: 'P07-resid', title: 'Model A residuals on the 8 test students', notice: 'Signed residuals sum to −4: Model A over-predicts slightly more than it under-predicts. The sum hides the size of the errors (cancellation).', spec: { type: 'bars', w: 520, h: 260, cats: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'], vals: Y.map((y, i) => y - YA[i]), ylim: [-6, 5], ylabel: 'e = y − ŷ (₹k)' } }],
    examples: [{ title: 'Fill a row (worked)', body: R`S8: $y = 65$, $\hat y_A = 70$. $e = -5$ (over-predicted), $|e| = 5$, $e^2 = 25$, APE $= 100 \times 5/65 = 7.69\%$. Model B: $\hat y_B = 69$, $e_B^2 = 16$.` }],
    code: [{ title: 'All Part-1 regression metrics from the master table', scratch: 'L07_regression_metrics_scratch.py', lib: 'L07_regression_metrics_sklearn.py' }],
    traps: ['Here residual = **y − ŷ** (Lecture 5/6 used ŷ − y inside gradients). Check the definition each time.', 'The signed total (−4) is not a quality measure; errors cancel.'],
    questions: [
      { type: 'int', diff: 'E', q: 'S7: actual 60, predicted 56. Signed residual e = y − ŷ?', answer: 4, tol: 0, round: 'Exact', verify: '60-56', sol: '**+4**: the model predicted too low.' },
      { type: 'int', diff: 'E', q: 'S3: actual 40, predicted 43. APE in % (2 decimals)?', answer: 7.5, tol: 0.01, round: '2 decimals', verify: '100*3/40', sol: '100 × 3/40 = **7.50%**.' },
      { type: 'int', diff: 'E', q: 'Sum of the signed residuals of Model A on the master table?', answer: -4, tol: 0, round: 'Exact', verify: 'sum([-2,1,-3,3,1,-3,4,-5])', sol: '−2 + 1 − 3 + 3 + 1 − 3 + 4 − 5 = **−4**.' },
      { type: 'mcq', diff: 'E', q: 'A **negative** residual e = y − ŷ means the model:', options: ['under-predicted', 'over-predicted', 'was exact', 'diverged'], answer: 1, sol: 'ŷ > y.', why: ['Opposite.', 'Correct.', 'That is 0.', 'No.'] },
      { type: 'int', diff: 'M', q: 'Sum of $e_B^2$ for Model B over the 8 students?', answer: 60, tol: 0, round: 'Exact', verify: 'sum((y-p)**2 for y,p in zip([30,35,40,45,50,55,60,65],[32,34,43,43,49,58,56,69]))', sol: '4 + 1 + 9 + 4 + 1 + 9 + 16 + 16 = **60**.' }
    ],
    source: 'Worksheet L7 pp.1–2.'
  },
  /* ---------------------------------------------------------------- L07.3 */
  {
    id: 'L07.3', title: 'MAE, MAPE, MSE, RMSE', badge: ['class', 'board'], pages: '2–3', ws: 'Section 3, P2, H1',
    concept: R`
| Metric | Question it answers | Formula → Model A | Advantage | Disadvantage |
|---|---|---|---|---|
| **MAE** | typical absolute miss, original unit | $\frac1n\sum|e_i| = 22/8 = $ **2.75** ₹k | easy to read; equal linear weight | hides direction; scale-dependent; does not stress rare large misses |
| **MAPE** | typical error **relative** to the actual | $\frac{100}{n}\sum\left|\frac{e_i}{y_i}\right| = 45.50/8 \approx$ **5.69%** | scale-free percentage | **undefined at $y_i = 0$**, unstable near 0, over-weights small actuals |
| **MSE** | squared penalty | $\frac1n\sum e_i^2 = 74/8 = $ **9.25** (₹k)² | strongly penalises large misses; good for optimisation | squared units; outlier-sensitive |
| **RMSE** | large-error penalty in original units | $\sqrt{9.25} \approx$ **3.04** ₹k | back in target units | still scale-dependent; more outlier-sensitive than MAE |

**PRACTICE P2.** 1 typical miss, equal weight → **MAE**; 2 relative error across scales, actuals away from 0 → **MAPE**; 3 large misses extra influence, stipend units → **RMSE**; 4 squared penalty in optimisation → **MSE**.

*Concept check:* one absolute residual rising from 1 to 5 adds **4** to $\sum|e|$ but **24** to $\sum e^2$ → MSE/RMSE react more strongly. "MSE = 9.25 means a typical miss of 9.25 thousand" → **False** (squared units; RMSE ≈ 3.04 is comparable).

Always **RMSE ≥ MAE** (equal only when all |e| are equal).`,
    formulas: [
      { name: 'MAE', tex: R`\text{MAE} = \frac1n\sum_{i=1}^n|y_i-\hat y_i|`, sym: 'Units of y.', when: 'Typical miss.' },
      { name: 'MAPE', tex: R`\text{MAPE} = \frac{100}{n}\sum_{i=1}^n\left|\frac{y_i-\hat y_i}{y_i}\right|`, sym: '%; undefined if any $y_i = 0$.', when: 'Relative error.' },
      { name: 'MSE', tex: R`\text{MSE} = \frac1n\sum_{i=1}^n(y_i-\hat y_i)^2`, sym: 'Squared units.', when: 'Optimisation; large-error penalty.' },
      { name: 'RMSE', tex: R`\text{RMSE} = \sqrt{\text{MSE}}`, sym: 'Units of y.', when: 'Large-error penalty, interpretable units.' }
    ],
    examples: [{ title: 'Course lab sample (worked)', body: R`Actual [40, 50, 60, 70, 80], predicted [45, 52, 58, 72, 78]. Errors 5, 2, 2, 2, 2 (absolute).
- MAE = 13/5 = **2.60**
- MSE = (25 + 4 + 4 + 4 + 4)/5 = 41/5 = **8.20**
- RMSE = √8.2 = **2.86**
- MAPE = (100/5)(5/40 + 2/50 + 2/60 + 2/70 + 2/80) = 20(0.125 + 0.04 + 0.0333 + 0.0286 + 0.025) = **5.04%**

Lab output format: \`2.60 8.20 2.86 5.04\`. Note \`sklearn.metrics.mean_absolute_percentage_error\` returns a **fraction** (0.0504), not a percentage.` }],
    code: [{ title: 'MAE/MAPE/MSE/RMSE from scratch and with sklearn', scratch: 'L07_regression_metrics_scratch.py', lib: 'L07_regression_metrics_sklearn.py' }],
    traps: ['MSE is in **squared** units; never read it as "typical miss".', 'sklearn MAPE returns a **fraction**; multiply by 100.', 'MAPE breaks when any actual is 0.', 'RMSE ≥ MAE always.'],
    questions: [
      { type: 'int', diff: 'E', q: 'Master table: Σ|e_A| = 22 over n = 8. MAE?', answer: 2.75, tol: 0.001, round: '2 decimals', verify: '22/8', sol: '22/8 = **2.75** thousand INR.' },
      { type: 'int', diff: 'M', q: 'Master table: Σe_A² = 74. RMSE (2 decimals)?', answer: 3.04, tol: 0.01, round: '2 decimals', verify: '(74/8)**0.5', sol: 'MSE = 9.25; √9.25 ≈ **3.04**.' },
      { type: 'int', diff: 'M', q: 'Actual [40, 50, 60, 70, 80], predicted [45, 52, 58, 72, 78]. MAPE in % (2 decimals)?', answer: 5.04, tol: 0.01, round: '2 decimals', verify: '100/5*(5/40+2/50+2/60+2/70+2/80)', sol: '20 × (0.125 + 0.04 + 0.0333 + 0.0286 + 0.025) ≈ **5.04%**.' },
      { type: 'int', diff: 'M', q: 'One absolute residual rises from 1 to 5. By how much does its contribution to Σe² rise?', answer: 24, tol: 0, round: 'Exact', verify: '25-1', sol: '25 − 1 = **24** (vs 4 for Σ|e|).' },
      { type: 'mcq', diff: 'E', q: '"MSE = 9.25 means a typical miss of 9.25 thousand INR." This is:', options: ['True', 'False — MSE is in squared units; RMSE ≈ 3.04 is the comparable figure', 'True only for Model B', 'Undefined'], answer: 1, sol: 'Section 3 true/false.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'MAPE should **not** be used when:', options: ['actuals are large', 'some actual values are 0 or near 0', 'errors are small', 'n > 100'], answer: 1, sol: 'Division by $y_i$.', why: ['Fine.', 'Correct.', 'Fine.', 'Fine.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.metrics import mean_absolute_percentage_error as mape
print(round(mape([100, 200], [110, 180]), 3))`, answer: '0.1', sol: 'APEs 0.10 and 0.10 → mean **0.1** as a fraction (10%).' }
    ],
    source: 'Worksheet L7 pp.2–3; Hyndman & Koehler, "Another look at measures of forecast accuracy" (2006).'
  },
  /* ---------------------------------------------------------------- L07.4 */
  {
    id: 'L07.4', title: 'R² from the mean-only baseline', badge: 'class', pages: '3–5', ws: 'Section 4, P3',
    concept: R`
Is Model A meaningfully better than predicting the **same** stipend for everyone?

1. **Mean-only baseline:** $\bar y = 380/8 = 47.5$ for every student.
2. **Total variation:** $\text{TSS} = \sum(y_i - \bar y)^2 = 306.25 + 156.25 + 56.25 + 6.25 + 6.25 + 56.25 + 156.25 + 306.25 = $ **1050**. If we predict only the mean, all 1050 is unexplained.
3. **Left-over variation:** $\text{RSS} = \sum(y_i - \hat y_i)^2 = $ **74**.
4. $R^2 = 1 - \dfrac{\text{RSS}}{\text{TSS}} = 1 - \dfrac{74}{1050} = $ **0.9295** $= \dfrac{\text{TSS} - \text{RSS}}{\text{TSS}} = \dfrac{976}{1050}$.

:::key Key insight
Model A accounts for about **92.95%** of the squared variation around the mean baseline; ~7.05% remains unexplained.
:::

| Value | Meaning |
|---|---|
| $R^2 = 1$ | perfect fit, RSS = 0 |
| $R^2 = 0$ | no better than the mean, RSS = TSS |
| $0 < R^2 < 1$ | better than the mean, some variation unexplained |
| $R^2 < 0$ | **worse** than the mean on the evaluated data (RSS > TSS) |

:::warn Misconception
R² = 0.93 does **not** mean 93% accuracy, 93% of predictions correct, or 7% average error. It is a relative sum-of-squares comparison with the mean baseline. Report MAE/RMSE for error size.
:::

**PRACTICE P3.** Same RMSE, different R²? The **spread of the actual targets** changes TSS. Same RSS with a wider target spread → larger TSS → higher R².`,
    formulas: [
      { name: 'TSS', tex: R`\text{TSS} = \sum (y_i-\bar y)^2`, sym: 'Variation around the mean.', when: 'Denominator of R².' },
      { name: 'RSS', tex: R`\text{RSS} = \sum (y_i-\hat y_i)^2`, sym: 'Left-over variation.', when: 'Numerator.' },
      { name: 'R²', tex: R`R^2 = 1 - \frac{\text{RSS}}{\text{TSS}}`, sym: 'Can be negative on test data.', when: 'Comparison with the mean baseline.' }
    ],
    plots: [{ id: 'P07-r2', title: 'Actual stipends, Model A and the mean-only baseline', notice: 'Dotted gaps (actual → mean line) make up TSS = 1050. Solid gaps (actual → Model A) make up RSS = 74. Explained variation = 976 is a global difference, not a third set of gaps.',
      spec: { type: 'xy', w: 560, h: 320, xlim: [0.5, 8.5], ylim: [25, 72], xticks: [1, 2, 3, 4, 5, 6, 7, 8], xtl: { 1: 'S1', 2: 'S2', 3: 'S3', 4: 'S4', 5: 'S5', 6: 'S6', 7: 'S7', 8: 'S8' }, xlabel: 'student', ylabel: 'stipend ₹k', legend: 'tl',
        series: [{ t: 'hline', y: 47.5, c: 's4', dash: true, label: 'mean-only baseline 47.5' },
          { t: 'seg', segs: Y.map((y, i) => [i + 1 - 0.12, y, i + 1 - 0.12, 47.5]), c: 's4', w: 1.3, dash: '2 3' },
          { t: 'seg', segs: Y.map((y, i) => [i + 1 + 0.12, y, i + 1 + 0.12, YA[i]]), c: 's1', w: 2.5 },
          { t: 'line', pts: YA.map((p, i) => [i + 1, p]), c: 's7', label: 'Model A' }, { t: 'scatter', pts: YA.map((p, i) => [i + 1, p]), c: 's7', m: 's', r: 4 },
          { t: 'scatter', pts: Y.map((y, i) => [i + 1, y]), c: 'fg', label: 'actual' }] } }],
    examples: [{ title: 'Negative R² (worked)', body: R`Actual [1, 2, 3], predictions [3, 2, 1]. $\bar y = 2$, TSS = 1 + 0 + 1 = 2; RSS = 4 + 0 + 4 = 8. $R^2 = 1 - 8/2 = $ **−3**. The model is far worse than always predicting 2.` }, { title: 'Same RMSE, different R² (worked)', body: R`Both datasets have RSS = 10 with n = 5 (RMSE ≈ 1.41). Dataset 1: TSS = 20 → R² = 0.5. Dataset 2 (wider spread): TSS = 200 → R² = 0.95.` }],
    code: [{ title: 'R² by hand and with r2_score', scratch: 'L07_regression_metrics_scratch.py', lib: 'L07_regression_metrics_sklearn.py' }],
    traps: ['R² is not accuracy and not a percentage error.', 'R² can be **negative** on test data.', 'Same RMSE can give different R² (different TSS).'],
    questions: [
      { type: 'int', diff: 'M', q: 'Actual stipends [30, 35, 40, 45, 50, 55, 60, 65]. Compute TSS.', answer: 1050, tol: 0, round: 'Exact', verify: 'sum((y-47.5)**2 for y in [30,35,40,45,50,55,60,65])', sol: 'Mean 47.5; squared deviations sum to **1050**.' },
      { type: 'int', diff: 'M', q: 'RSS = 74, TSS = 1050. R² (4 decimals)?', answer: 0.9295, tol: 0.0001, round: '4 decimals', verify: '1-74/1050', sol: '1 − 74/1050 = **0.9295**.' },
      { type: 'int', diff: 'M', q: 'Actual [1, 2, 3], predicted [3, 2, 1]. R²?', answer: -3, tol: 0.001, round: 'Exact', verify: '1-8/2', sol: 'RSS 8, TSS 2 → **−3**.' },
      { type: 'mcq', diff: 'E', q: 'R² = 0 means:', options: ['perfect fit', 'no better than predicting the mean', 'worse than the mean', '0% accuracy'], answer: 1, sol: 'RSS = TSS.', why: ['That is 1.', 'Correct.', 'That is < 0.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Two datasets have the same RMSE but different R². What differs?', options: ['The number of features', 'The spread of the actual targets (TSS)', 'The learning rate', 'Nothing; impossible'], answer: 1, sol: 'P3.', why: ['No.', 'Correct.', 'No.', 'Possible.'] },
      { type: 'mcq', diff: 'M', q: 'R² = 0.93 means:', options: ['93% of predictions are correct', '93% accuracy', 'the model explains ~93% of the squared variation around the mean', 'average error is 7%'], answer: 2, sol: 'Misconception box.', why: ['No.', 'No.', 'Correct.', 'No.'] },
      { type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`from sklearn.metrics import r2_score
print(r2_score([1, 2, 3], [3, 2, 1]))`, answer: '-3.0', sol: 'RSS 8 / TSS 2 → 1 − 4 = −3.0.' }
    ],
    source: 'Worksheet L7 pp.3–5; ISLR §3.1.3.'
  },
  /* ---------------------------------------------------------------- L07.5 */
  {
    id: 'L07.5', title: 'Adjusted R²', badge: ['class', 'board'], pages: '5–6', ws: 'Section 5',
    concept: R`
:::hook Central question
Adding the **last digit of a student's roll number** raises training R² slightly. Has that predictor earned its place?
:::

For OLS with an intercept on the **training** data, adding a predictor **cannot increase RSS**, so training R² **cannot decrease** — even a useless feature can fit noise. R² rewards fit but does not charge for complexity.

$$R^2_{\text{adj}} = 1 - (1-R^2)\,\frac{n-1}{n-p-1}$$
- $1 - R^2$ = unexplained fraction; $n$ = observations; $p$ = predictors **excluding** the intercept; $n - p - 1$ = residual degrees of freedom.
- The factor $\frac{n-1}{n-p-1}$ **grows with p**, so a new predictor must reduce unexplained variation enough to beat the penalty.

| Model | Predictors | p | RSS | R² | Adj R² |
|---|---|---|---|---|---|
| A | CGPA + interview | 2 | 74 | 0.9295 | **0.9013** |
| B | A + roll-number digit | 3 | 60 | **0.9429** | 0.9000 |

$R^2_{\text{adj},A} = 1 - \frac{74}{1050}\cdot\frac{7}{5} = 0.9013$; $R^2_{\text{adj},B} = 1 - \frac{60}{1050}\cdot\frac74 = 0.9000$ (n = 8).

**Decision:** the roll-number feature **did not earn its place** — B has higher raw R² but lower adjusted R².

**What adjusted R² does and does not tell us:** useful to compare regression models on the **same target and observations** with different p; can **decrease** when a feature adds too little; normally $R^2_{\text{adj}} \le R^2$; **not** an automatic feature-selection oracle and **not** a substitute for validation/CV; requires $n > p + 1$.

*Whiteboard:* "case 1: irrelevant feature added → R² ↑ slightly, adj R² ↓; case 2: relevant feature added → both ↑." (The handwritten numbers for n are unclear; this site uses the worksheet's n = 8. See UNCLEAR.md item 15.)

:::take Takeaway
Signed residual → absolute size → relative size → large-error penalty → target units → mean baseline → feature-count penalty.
:::`,
    formulas: [{ name: 'Adjusted R²', tex: R`R^2_{\text{adj}} = 1-(1-R^2)\frac{n-1}{n-p-1} = 1-\frac{\text{RSS}}{\text{TSS}}\cdot\frac{n-1}{n-p-1}`, sym: 'p excludes the intercept; needs n > p + 1.', when: 'Comparing models with different numbers of predictors.' }],
    examples: [{ title: 'Course lab style (worked)', body: R`R² = 0.80, n = 21, p = 4: $R^2_{\text{adj}} = 1 - 0.2 \times 20/16 = 1 - 0.25 = 0.75$. With p = 1: $1 - 0.2 \times 20/19 = 0.7895$.` }],
    code: [{ title: 'Adjusted R² for models A and B', scratch: 'L07_regression_metrics_scratch.py', lib: 'L07_regression_metrics_sklearn.py' }],
    traps: ['p **excludes** the intercept.', 'Training R² never decreases when adding features (OLS with intercept); adjusted R² can.', 'Adjusted R² is not a replacement for validation.'],
    questions: [
      { type: 'int', diff: 'M', q: 'n = 8, p = 2, R² = 74/1050 unexplained (R² = 0.9295). Adjusted R² (4 decimals)?', answer: 0.9013, tol: 0.0001, round: '4 decimals', verify: '1-(74/1050)*7/5', sol: '1 − 0.07048 × 1.4 = **0.9013**.' },
      { type: 'int', diff: 'M', q: 'n = 8, p = 3, RSS = 60, TSS = 1050. Adjusted R² (4 decimals)?', answer: 0.9, tol: 0.0001, round: '4 decimals', verify: '1-(60/1050)*7/4', sol: '1 − 0.05714 × 1.75 = **0.9000**.' },
      { type: 'int', diff: 'E', q: 'R² = 0.80, n = 21, p = 4. Adjusted R² (2 decimals)?', answer: 0.75, tol: 0.001, round: '2 decimals', verify: '1-0.2*20/16', sol: '1 − 0.2 × 20/16 = **0.75**.' },
      { type: 'mcq', diff: 'M', q: 'Model B has higher R² but lower adjusted R² than Model A. Conclusion?', options: ['Keep B; higher R² wins', 'The extra feature did not earn its place', 'Both are equally good', 'Adjusted R² is wrong'], answer: 1, sol: 'Worked comparison decision.', why: ['R² ignores complexity.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'In the adjusted-R² formula, p is:', options: ['number of predictors including the intercept', 'number of predictors excluding the intercept', 'number of observations', 'the p-value'], answer: 1, sol: 'Excludes the intercept.', why: ['No.', 'Correct.', 'That is n.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'Select all true statements.', options: ['Adding a predictor to OLS (with intercept) cannot decrease training R²', 'Adjusted R² can decrease when a useless feature is added', 'Adjusted R² replaces cross-validation', 'Normally adjusted R² ≤ R²'], answer: [0, 1, 3], sol: 'Section 5 box.', why: ['True.', 'True.', 'False.', 'True.'] }
    ],
    source: 'Worksheet L7 pp.5–6; Whiteboard L08 p.2; Wooldridge, *Introductory Econometrics* §6.3.'
  },
  /* ---------------------------------------------------------------- L07.6 */
  {
    id: 'L07.6', title: 'Bridge to classification; accuracy; the confusion matrix', badge: ['class', 'board'], pages: '6–8', ws: 'Sections 6–7, P6',
    concept: R`
**Regression errors have size; classification errors have identity.** Predicting "Ready" instead of "Needs Practice" has no numerical distance; the question is *which label was confused with which*.

Three readiness bands: **Ready (R)**, **Needs Practice (P)**, **Needs Support (S)**. 18 test students (Master Test Data C): 12 correct, 6 errors.
$$\text{Accuracy} = \frac{\text{exact matches}}{\text{total}} = \frac{12}{18} = 0.667$$

:::warn Why accuracy is not enough
Every wrong label counts as one error whatever its type. *Missed Ready* (capable student labelled P or S) and *False Ready* (struggling student labelled R) both reduce accuracy by one, but have very different consequences. You need the **confusion matrix**, precision and recall to see which errors happen.
:::

**Convention:** rows = **actual**, columns = **predicted** (scikit-learn). Diagonal = exact matches; off-diagonal = specific confusions.

| Actual \\ Predicted | R | P | S | Actual total |
|---|---|---|---|---|
| **R** | **6** | 1 | 1 | 8 |
| **P** | 1 | **4** | 1 | 6 |
| **S** | 0 | 2 | **2** | 4 |
| Predicted total | 7 | 7 | 4 | 18 |

**PRACTICE P6.** A. Accuracy = (6 + 4 + 2)/18 = 0.667; off-diagonal total = 6. B. Actual members of a class → **row total**; times a class was predicted → **column total**; exact matches → **main diagonal**; one direction of error → **off-diagonal cell**. C. (i) (Actual R, Pred S) counts Ready students labelled Support → **True**; (ii) predicted-S total 4 means all four were Support → **False** (only 2); (iii) accuracy alone identifies every error direction → **False**. D. Correct S15 from P to S: (S,P) 2 → 1, (S,S) 2 → 3, accuracy 12/18 → **13/18 = 72.2%**, predicted-P total 7 → 6, predicted-S 4 → 5, row totals unchanged.

**Binary case (whiteboard):** with classes 0/1, $\begin{bmatrix}\text{TN} & \text{FP}\\ \text{FN} & \text{TP}\end{bmatrix}$ (rows actual 0, 1; columns predicted 0, 1), and $\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$. *(The whiteboard wrote TP + FP in the numerator — a slip; see UNCLEAR.md item 7.)*

:::warn Always state the orientation
Transposing rows and columns changes which real-world error each off-diagonal cell represents.
:::`,
    formulas: [{ name: 'Accuracy', tex: R`\text{Accuracy} = \frac{\text{trace}(C)}{\sum C} = \frac{TP+TN}{TP+TN+FP+FN}`, sym: 'C = confusion matrix.', when: 'All errors cost the same.' }],
    plots: [
      { id: 'P07-cm3', title: '3-class confusion matrix (rows actual, columns predicted)', notice: 'Green diagonal = correct (12). Red off-diagonal = specific confusions (6). Half of the Support students were predicted as Practice.',
        spec: { type: 'heat', rows: ['Actual R', 'Actual P', 'Actual S'], cols: ['Pred R', 'Pred P', 'Pred S'], vals: CM, diag: true, colTitle: 'Predicted', rowTitle: 'Actual' } },
      { id: 'P07-cm2', title: 'Support-vs-rest binary view', notice: 'Collapsing R and P into "Not Support": TP = 2, FN = 2, FP = 2, TN = 12.',
        spec: { type: 'heat', rows: ['Actual Support', 'Actual Not'], cols: ['Pred Support', 'Pred Not'], vals: [[2, 2], [2, 12]], diag: true, fmt: (v, i, j) => ({ '00': 'TP = ', '01': 'FN = ', '10': 'FP = ', '11': 'TN = ' })['' + i + j] + v } }
    ],
    examples: [{ title: 'Reading cells (worked)', body: R`Cell (Actual P, Pred R) = 1: one Needs-Practice student was labelled Ready (a "False Ready"). Column "Pred S" = 4 predictions of Support, of which 2 correct (S,S), 1 Ready student (R,S), 1 Practice student (P,S).` }],
    code: [{ title: 'Confusion matrix and per-class metrics', scratch: 'L07_classification_metrics_scratch.py', lib: 'L07_classification_metrics_sklearn.py' }],
    traps: ['scikit-learn: rows = actual, columns = predicted. Some textbooks transpose.', 'Accuracy = (TP + **TN**)/total — not (TP + FP)/total.', 'Row totals are fixed by the data; column totals depend on the model.'],
    questions: [
      { type: 'int', diff: 'E', q: 'Confusion matrix [[6,1,1],[1,4,1],[0,2,2]]. Accuracy (3 decimals)?', answer: 0.667, tol: 0.001, round: '3 decimals', verify: '12/18', sol: 'Diagonal 12 of 18 → **0.667**.' },
      { type: 'int', diff: 'M', q: 'If S15 is corrected from Predicted P to Predicted S, the new accuracy in % (1 decimal)?', answer: 72.2, tol: 0.05, round: '1 decimal', verify: '100*13/18', sol: '13/18 = **72.2%**.' },
      { type: 'mcq', diff: 'E', q: 'In a scikit-learn confusion matrix, the **row total** of a class is:', options: ['times the class was predicted', 'number of actual members of the class', 'exact matches', 'one error direction'], answer: 1, sol: 'P6 B: 1 → B.', why: ['Column total.', 'Correct.', 'Diagonal.', 'Off-diagonal.'] },
      { type: 'mcq', diff: 'M', q: 'The predicted-S column total is 4. Does that mean all four were actually Support?', options: ['Yes', 'No — only the (S,S) cell (2) were actually Support', 'Yes, by definition', 'Cannot know'], answer: 1, sol: 'P6 C(ii) False.', why: ['No.', 'Correct.', 'No.', 'The column shows it.'] },
      { type: 'mcq', diff: 'E', q: 'Binary accuracy is:', options: ['(TP+FP)/total', '(TP+TN)/total', 'TP/(TP+FN)', 'TP/(TP+FP)'], answer: 1, sol: 'Correct predictions are TP and TN.', why: ['Whiteboard slip.', 'Correct.', 'Recall.', 'Precision.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.metrics import confusion_matrix
print(confusion_matrix([1, 0, 1, 1, 0], [1, 1, 0, 1, 0]).tolist())`, answer: '[[1, 1], [1, 2]]', sol: 'Rows actual (0,1), columns predicted. Actual 0: one predicted 0 (TN), one predicted 1 (FP). Actual 1: one predicted 0 (FN), two predicted 1 (TP) → [[1, 1], [1, 2]].' }
    ],
    source: 'Worksheet L7 pp.6–8; Whiteboard L08 p.3; scikit-learn `confusion_matrix` docs.'
  },
  /* ---------------------------------------------------------------- L07.7 */
  {
    id: 'L07.7', title: 'Precision, recall, F1 (+ F-β and specificity)', badge: ['class', 'board'], pages: '8–10', ws: 'Section 8, P7–P9 + whiteboard',
    concept: R`
Make **Needs Support** the positive class; group Ready and Practice as "Not Support". *Positive* = the class being evaluated (not "good"); *True/False* = correct/incorrect in this binary view.

| Term | Actual | Predicted | Meaning |
|---|---|---|---|
| TP | Support | Support | correct Support alert |
| FN | Support | Not | Support student **missed** |
| FP | Not | Support | **false** Support alert |
| TN | Not | Not | Support label correctly rejected |

**PRACTICE P7.** S17 (S→S) **TP**; S15 (S→P) **FN**; S08 (R→S) **FP**; S07 (R→P) **TN** — wrong in the 3-class task but a correct rejection of Support. Collapsed: TP = 2, FN = 2, FP = 2, TN = 12.

| Metric | Formula | Meaning (Support) |
|---|---|---|
| **Precision** | $\frac{TP}{TP+FP}$ | of predicted Support alerts, how many are correct? |
| **Recall / TPR** | $\frac{TP}{TP+FN}$ | of actual Support students, how many are found? |
| **F1** | $\frac{2PR}{P+R} = \frac{2TP}{2TP+FP+FN}$ | harmonic balance; high only when both are high |

**PRACTICE P8:** Precision = 2/4 = **0.500**, Recall = 2/4 = **0.500**, F1 = 4/(4 + 2 + 2) = **0.500**.

**PRACTICE P9** (S15 corrected: TP 3, FP 2, FN 1, TN 12): Precision = 3/5 = **0.600**, Recall = 3/4 = **0.750**, F1 = 6/9 = **0.667**. Missing Support students costliest → **recall**; false alerts costliest → **precision**; both → **F1**.

:::key The important pattern
Overall accuracy 0.667, yet the model finds only 2 of 4 Support students. Overall correctness can hide weak performance on a small, important class.
:::

**Undefined cases:** never predicting a class → precision denominator 0; no actual examples → recall denominator 0. State how the library handled it (\`zero_division\`).

**From the whiteboard**
- **F-β score:** $F_\beta = \dfrac{(1+\beta^2)PR}{\beta^2P + R}$. β = 1 → F1; **β = 0.5 weights precision**; **β = 2 weights recall**. P9 numbers: $F_{0.5} = 0.625$, $F_2 = 0.714$.
- **Specificity (TNR, "recall of the negative class")** $= \frac{TN}{TN+FP}$. Support view: 12/14 = 0.857. **FPR = 1 − specificity** = FP/(FP + TN).`,
    formulas: [
      { name: 'Precision', tex: R`P = \frac{TP}{TP+FP}`, sym: 'Denominator = predicted positives.', when: 'False alarms are costly.' },
      { name: 'Recall / TPR / sensitivity', tex: R`R = \frac{TP}{TP+FN}`, sym: 'Denominator = actual positives.', when: 'Misses are costly.' },
      { name: 'F1', tex: R`F_1 = \frac{2PR}{P+R} = \frac{2TP}{2TP+FP+FN}`, sym: 'Harmonic mean; ignores TN.', when: 'Balance both.' },
      { name: 'F-β', tex: R`F_\beta = \frac{(1+\beta^2)PR}{\beta^2P+R}`, sym: 'β > 1 favours recall; β < 1 favours precision.', when: 'Unequal costs.' },
      { name: 'Specificity, FPR', tex: R`\text{TNR} = \frac{TN}{TN+FP},\qquad \text{FPR} = \frac{FP}{FP+TN} = 1-\text{TNR}`, sym: '', when: 'ROC curves; medical tests.' }
    ],
    examples: [{ title: 'A medical test (worked)', body: R`TP = 40, FN = 10, FP = 20, TN = 930.
- Precision = 40/60 = 0.667; Recall = 40/50 = 0.8; F1 = 80/(80 + 30) = 0.727.
- Specificity = 930/950 = 0.979; Accuracy = 970/1000 = 0.97.
- $F_2 = 5(0.667)(0.8)/(4(0.667) + 0.8) = 2.667/3.467 = 0.769$.` }],
    code: [{ title: 'Precision/recall/F1/F-β/specificity', scratch: 'L07_classification_metrics_scratch.py', lib: 'L07_classification_metrics_sklearn.py' }],
    traps: ['Precision divides by **predicted** positives; recall by **actual** positives.', 'F1 does not use TN.', 'β = 2 favours **recall**, β = 0.5 favours **precision**.', 'A Ready → Practice error is a TN in the Support-vs-rest view.'],
    questions: [
      { type: 'int', diff: 'E', q: 'TP = 3, FP = 2, FN = 1. Precision?', answer: 0.6, tol: 0.001, round: '3 decimals', verify: '3/5', sol: '3/5 = **0.600**.' },
      { type: 'int', diff: 'E', q: 'TP = 3, FP = 2, FN = 1. Recall?', answer: 0.75, tol: 0.001, round: '3 decimals', verify: '3/4', sol: '3/4 = **0.750**.' },
      { type: 'int', diff: 'M', q: 'TP = 3, FP = 2, FN = 1. F1 (3 decimals)?', answer: 0.667, tol: 0.001, round: '3 decimals', verify: '6/9', sol: '2·3/(6 + 2 + 1) = 6/9 = **0.667**.' },
      { type: 'int', diff: 'H', q: 'Precision 0.6, recall 0.75. Compute F₂ (3 decimals).', answer: 0.714, tol: 0.001, round: '3 decimals', verify: '5*0.6*0.75/(4*0.6+0.75)', sol: '5(0.45)/(2.4 + 0.75) = 2.25/3.15 = **0.714**.' },
      { type: 'int', diff: 'M', q: 'Support view: TN = 12, FP = 2. Specificity (3 decimals)?', answer: 0.857, tol: 0.001, round: '3 decimals', verify: '12/14', sol: '12/14 = **0.857**.' },
      { type: 'mcq', diff: 'E', q: 'Missing actual Needs-Support students is the costliest error. Prioritise:', options: ['Precision', 'Recall', 'Accuracy', 'Specificity'], answer: 1, sol: 'P9(a).', why: ['That is for false alerts.', 'Correct.', 'Hides class misses.', 'That is about negatives.'] },
      { type: 'mcq', diff: 'M', q: 'S07 (actual Ready, predicted Practice) in the Support-vs-rest view is:', options: ['TP', 'FP', 'FN', 'TN'], answer: 3, sol: 'Both actual and predicted are "Not Support".', why: ['No.', 'No Support predicted.', 'Not actual Support.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'Which F-β emphasises **recall**?', options: ['β = 0.5', 'β = 1', 'β = 2', 'β = 0'], answer: 2, sol: 'Whiteboard: β = 2 → recall, β = 0.5 → precision.', why: ['Precision.', 'Balanced.', 'Correct.', 'β = 0 gives precision only.'] }
    ],
    source: 'Worksheet L7 pp.8–10; Whiteboard L08 pp.3–4; van Rijsbergen, *Information Retrieval* (1979) for F-β.'
  },
  /* ---------------------------------------------------------------- L07.8 */
  {
    id: 'L07.8', title: 'Macro, weighted and micro averages; choosing a metric', badge: 'class', pages: '10–13', ws: 'Sections 9–10, P10, P11, Exit check',
    concept: R`
Per-class summaries (Master Test Data C):

| Class | Support (count) | Precision | Recall | F1 |
|---|---|---|---|---|
| Ready | 8 | 0.857 (6/7) | 0.750 | 0.800 |
| Practice | 6 | 0.571 (4/7) | 0.667 | 0.615 |
| Support | 4 | 0.500 | 0.500 | 0.500 |

**Macro** — every class one equal vote: $\frac{M_R + M_P + M_S}{3}$. Precision 0.643, recall 0.639, **F1 0.638**. Use when a small class matters as much as a large one.

**Weighted** — weight by actual count: $\frac{8M_R + 6M_P + 4M_S}{18}$. Precision $= \frac{8(6/7) + 6(4/7) + 4(1/2)}{18} = \frac{43}{63} \approx 0.683$, recall 0.667, **F1 0.672**.

**Micro** — pool all decisions first: TP = 12, FP = 6, FN = 6 → precision = recall = **F1 = 0.667 = accuracy**. In single-label multiclass every wrong prediction is one FP (for the predicted class) and one FN (for the true class), so micro P = R = F1 = accuracy.

| Summary | Precision | Recall | F1 | Interpretation |
|---|---|---|---|---|
| Accuracy | – | – | 0.667 | exact-label correctness |
| Macro | 0.643 | 0.639 | 0.638 | all classes equal |
| Weighted | 0.683 | 0.667 | 0.672 | reflects class proportions |
| Micro | 0.667 | 0.667 | 0.667 | pooled; = accuracy here |

**Why weighted F1 > macro F1 here?** Support is the weakest class but has only 4 of 18 students; weighting gives it less influence.

:::warn Misconception
Macro F1 is the **average of the class F1 scores**, not the harmonic mean of macro precision and macro recall (that would be 2(0.643)(0.639)/(1.282) ≈ 0.641 ≠ 0.638).
:::

**PRACTICE P11 — decision → metric:** typical regression error → MAE; large misses extra weight → RMSE/MSE; relative error, actuals away from 0 → MAPE; compare with mean baseline → R²; same-data models with different predictor counts → adjusted R² (+ validation); all label mistakes cost the same → accuracy; which labels are confused → confusion matrix; missing Support costly → recall; false Support alerts costly → precision; balance both → F1; every class equal → macro; class proportions → weighted.

**Exit check.** 1. Same RMSE, different R² → different target spread (TSS). 2. B has higher R² but lower adjusted R² → small RSS gain did not beat the penalty for a third predictor. 3. 66.7% accuracy but 50% Support recall → accuracy counts all 18; Support recall considers only the 4 Support students.

:::take Takeaway
A model is good when its **errors are acceptable for the decision**, on data that represents the world it will be used in — not because one score is high.
:::`,
    formulas: [
      { name: 'Macro average', tex: R`\text{Macro}(M) = \frac1K\sum_{k=1}^K M_k`, sym: 'K classes.', when: 'Small classes matter equally.' },
      { name: 'Weighted average', tex: R`\text{Weighted}(M) = \frac{\sum_k n_k M_k}{\sum_k n_k}`, sym: '$n_k$ = actual count (support).', when: 'Reflect class proportions.' },
      { name: 'Micro average', tex: R`P_{\text{micro}} = \frac{\sum TP_k}{\sum TP_k + \sum FP_k}`, sym: '= accuracy for single-label multiclass.', when: 'Pooled decisions.' }
    ],
    plots: [{ id: 'P07-avgs', title: 'F1 summaries for the 3-class model', notice: 'Macro (0.638) is pulled down most by the weak Support class; weighted (0.672) gives it less say; micro = accuracy (0.667).', spec: { type: 'bars', w: 520, h: 280, cats: ['F1 Ready', 'F1 Practice', 'F1 Support', 'Macro', 'Weighted', 'Micro'], vals: [0.8, 0.615, 0.5, 0.638, 0.672, 0.667], ylim: [0, 1], ylabel: 'F1' } }],
    examples: [{ title: 'Weighted recall by hand (worked)', body: R`$\frac{8(0.750) + 6(0.667) + 4(0.5)}{18} = \frac{6 + 4 + 2}{18} = \frac{12}{18} = 0.667$. (Weighted recall always equals accuracy in single-label multiclass, because $n_k \cdot \text{recall}_k = TP_k$.)` }],
    code: [{ title: 'classification_report: macro, weighted, micro', scratch: 'L07_classification_metrics_scratch.py', lib: 'L07_classification_metrics_sklearn.py' }],
    traps: ['Micro F1 = accuracy for single-label multiclass.', 'Weighted recall also equals accuracy.', 'Macro F1 ≠ harmonic mean of macro P and macro R.'],
    questions: [
      { type: 'int', diff: 'M', q: 'Class F1 scores 0.800, 0.615, 0.500. Macro F1 (3 decimals)?', answer: 0.638, tol: 0.001, round: '3 decimals', verify: '(0.8+0.615+0.5)/3', sol: '1.915/3 = **0.638**.' },
      { type: 'int', diff: 'M', q: 'Class F1 0.800, 0.615, 0.500 with supports 8, 6, 4. Weighted F1 (3 decimals)?', answer: 0.672, tol: 0.001, round: '3 decimals', verify: '(8*0.8+6*0.615+4*0.5)/18', sol: '(6.4 + 3.69 + 2)/18 = 12.09/18 = **0.672**.' },
      { type: 'int', diff: 'M', q: 'Pooled TP = 12, FP = 6, FN = 6. Micro F1 (3 decimals)?', answer: 0.667, tol: 0.001, round: '3 decimals', verify: '24/(24+12)', sol: '24/36 = **0.667** (= accuracy).' },
      { type: 'mcq', diff: 'E', q: 'Which averaging gives every class an equal vote?', options: ['Micro', 'Macro', 'Weighted', 'Accuracy'], answer: 1, sol: 'Macro.', why: ['Pools decisions.', 'Correct.', 'By size.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why is weighted F1 higher than macro F1 here?', options: ['Weighted uses TN', 'The weakest class (Support) is the smallest, so weighting gives it less influence', 'Weighted is always higher', 'Rounding'], answer: 1, sol: 'P10.', why: ['No.', 'Correct.', 'Not always.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'For a single-label multiclass classifier, micro-averaged F1 equals:', options: ['macro F1', 'accuracy', 'weighted precision', '0.5'], answer: 1, sol: 'Every error = 1 FP + 1 FN.', why: ['Generally not.', 'Correct.', 'Generally not.', 'No.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.metrics import f1_score
y = [0, 0, 1, 1, 2, 2]; p = [0, 1, 1, 1, 2, 0]
print(round(f1_score(y, p, average="micro"), 3), round(f1_score(y, p, average="macro"), 3))`, answer: '0.667 0.656',
        sol: 'Micro = accuracy = 4/6 = 0.667. Class F1: class 0 P = 1/2, R = 1/2 → 0.5; class 1 P = 2/3, R = 1 → 0.8; class 2 P = 1, R = 1/2 → 0.667. Macro = (0.5 + 0.8 + 0.667)/3 = **0.656**.' }
    ],
    source: 'Worksheet L7 pp.10–13; scikit-learn `precision_recall_fscore_support`.'
  },
  /* ---------------------------------------------------------------- L07.9 */
  {
    id: 'L07.9', title: 'ROC curve and AUC', badge: 'res', pages: '–', ws: 'Not in the worksheet (only named in L1 Reflect 3)',
    concept: R`
Most classifiers output a **score** (e.g. probability of class 1). A **threshold** t turns it into a label: predict 1 if score ≥ t. Each threshold gives one (FPR, TPR) pair.

- **TPR (recall)** = TP/(TP + FN); **FPR** = FP/(FP + TN) = 1 − specificity.
- Lowering t → more positives predicted → TPR ↑ and FPR ↑.
- **ROC curve** = TPR vs FPR over all thresholds, from (0, 0) (t = ∞) to (1, 1) (t = −∞).
- **AUC** = area under the ROC curve: 1 = perfect ranking; **0.5 = random guessing** (the diagonal); < 0.5 = worse than random (flip the labels).
- **Probabilistic meaning:** AUC = P(a random positive gets a higher score than a random negative).

**Worked sweep** (labels y = [1,1,0,1,0,1,0,0], scores [0.9, 0.8, 0.7, 0.6, 0.55, 0.4, 0.3, 0.1]; 4 positives, 4 negatives):

| t | TPR | FPR |
|---|---|---|
| 0.90 | 0.25 | 0 |
| 0.80 | 0.50 | 0 |
| 0.70 | 0.50 | 0.25 |
| 0.60 | 0.75 | 0.25 |
| 0.55 | 0.75 | 0.50 |
| 0.40 | 1.00 | 0.50 |
| 0.30 | 1.00 | 0.75 |
| 0.10 | 1.00 | 1.00 |

AUC (trapezoids) = **0.8125**. Pairwise check: of 16 (positive, negative) pairs, the positive scores higher in 13 → 13/16 = 0.8125.

ROC/AUC is **threshold-independent** and useful for comparing rankers; under heavy class imbalance a precision–recall curve is often more informative.`,
    formulas: [{ name: 'ROC axes', tex: R`\text{TPR} = \frac{TP}{TP+FN},\quad \text{FPR} = \frac{FP}{FP+TN}`, sym: '', when: 'Each threshold → one point.' }, { name: 'AUC as ranking probability', tex: R`\text{AUC} = P(s^+ > s^-)`, sym: 'ties count ½.', when: 'Quick AUC by hand.' }],
    plots: [{ id: 'P07-roc', title: 'ROC curve of the worked example (AUC = 0.8125)', notice: 'Staircase from (0,0) to (1,1). The dashed diagonal is a random classifier (AUC 0.5).',
      spec: { type: 'xy', w: 420, h: 380, xlim: [0, 1], ylim: [0, 1], xlabel: 'FPR', ylabel: 'TPR', legend: 'br',
        series: [{ t: 'poly', pts: [[0, 0], [0, 0.25], [0, 0.5], [0.25, 0.5], [0.25, 0.75], [0.5, 0.75], [0.5, 1], [1, 1], [1, 0]], c: 's1', fop: 0.12, w: 0 }, { t: 'line', pts: [[0, 0], [0, 0.25], [0, 0.5], [0.25, 0.5], [0.25, 0.75], [0.5, 0.75], [0.5, 1], [0.75, 1], [1, 1]], c: 's1', w: 2.5, markers: true, label: 'model' }, { t: 'line', pts: [[0, 0], [1, 1]], c: 's7', dash: true, label: 'random (0.5)' }] } }],
    examples: [{ title: 'AUC by counting pairs (worked)', body: R`Positives' scores 0.9, 0.8, 0.6, 0.4; negatives' 0.7, 0.55, 0.3, 0.1. Count negatives below each positive: 0.9 → 4, 0.8 → 4, 0.6 → 3, 0.4 → 2. Total 13 of 16 → AUC = 0.8125.` }],
    code: [{ title: 'ROC sweep, trapezoid AUC, pairwise AUC, sklearn', scratch: 'L07_roc_auc_scratch.py' }],
    traps: ['AUC 0.5 = random, not "bad but useful".', 'ROC uses FPR on the x-axis, not precision.', 'AUC does not depend on the threshold; precision/recall do.'],
    questions: [
      { type: 'mcq', diff: 'E', tag: 'GATE-style', q: 'An AUC of 0.5 indicates:', options: ['perfect classifier', 'random ranking', 'always wrong', '50% accuracy guaranteed'], answer: 1, sol: 'Diagonal ROC.', why: ['That is 1.', 'Correct.', 'That is 0.', 'No.'] },
      { type: 'int', diff: 'M', q: 'Positive scores [0.9, 0.6], negative scores [0.7, 0.2]. AUC via pairwise ranking?', answer: 0.75, tol: 0.001, round: '2 decimals', verify: '3/4', sol: 'Pairs: (0.9>0.7 ✓), (0.9>0.2 ✓), (0.6>0.7 ✗), (0.6>0.2 ✓) → 3/4 = **0.75**.' },
      { type: 'mcq', diff: 'M', q: 'Lowering the decision threshold generally:', options: ['decreases TPR and FPR', 'increases TPR and FPR', 'increases TPR, decreases FPR', 'has no effect'], answer: 1, sol: 'More positives predicted.', why: ['Opposite.', 'Correct.', 'Not generally.', 'No.'] },
      { type: 'int', diff: 'E', q: 'FP = 5, TN = 45. FPR?', answer: 0.1, tol: 0.001, round: '2 decimals', verify: '5/50', sol: '5/50 = **0.1**.' },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.metrics import roc_auc_score
print(roc_auc_score([0, 0, 1, 1], [0.1, 0.4, 0.35, 0.8]))`, answer: '0.75', sol: 'Positives 0.35, 0.8; negatives 0.1, 0.4. Pairs won: 0.35>0.1 ✓, 0.35>0.4 ✗, 0.8>both ✓✓ → 3/4.' }
    ],
    researched: R`Not covered in class — studied from Fawcett, "An introduction to ROC analysis" (2006) and the scikit-learn \`roc_curve\` / \`roc_auc_score\` docs.`,
    source: 'Fawcett (2006); scikit-learn docs.'
  }
  ]
});
})();
