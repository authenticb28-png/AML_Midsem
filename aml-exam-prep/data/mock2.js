/* Mock paper 2 — 35 questions, 61 marks, 90 minutes. Every lecture L0–L15 appears at least once.
   All numerical answers have Python `verify` expressions and all code outputs were produced by running the code. */
EXTRA.mocks[2] = {
  title: 'Mock paper 2 (all lectures, 90 minutes)',
  minutes: 90,
  intro: R`Second full paper, a little harder than Mock 1, with more multi-step numericals and "which statement is NOT…" items. Take it on **day 7**. Afterwards, open the weak-topic links in your score table and redo those lectures' practice sets.`,
  sections: [
    { name: 'A', desc: 'MCQ — exactly one correct option', marks: 1, questions: [
      { lec: 0, type: 'mcq', diff: 'E', q: 'Which is **NOT** a typical property of deep learning compared with classic ML?',
        options: ['It learns features automatically from raw data', 'It usually needs much more data and compute', 'It works well on unstructured data such as images and audio', 'It requires hand-crafted features for images'], answer: 3,
        sol: 'Hand-crafted features are the classic-ML workflow; DL learns them.', why: ['True of DL.', 'True of DL.', 'True of DL.', 'Correct — this is NOT a DL property.'] },
      { lec: 1, type: 'mcq', diff: 'E', q: 'Income has a few extreme values (billionaires). You want a scaler whose result is **not** dominated by them. Which one?',
        options: ['Min-Max scaling', 'Max-Abs scaling', 'Robust scaling (median and IQR)', 'Z-score scaling'], answer: 2,
        sol: 'Median and IQR ignore the extreme tails.', why: ['min/max are the outliers themselves.', 'max|x| is the outlier.', 'Correct.', 'Mean and std are pulled by outliers.'] },
      { lec: 2, type: 'mcq', diff: 'E', q: 'A demand model was accurate at launch. Eight months later its error has doubled because customer habits changed. What is this, and what is the response?',
        options: ['Overfitting — add regularization', 'Model (data/concept) drift — monitor and retrain on recent data', 'Data leakage — re-split the data', 'Underfitting — use a bigger model'], answer: 1,
        sol: 'Phase 10–11: monitoring detects drift and triggers the retraining loop.', why: ['It was fine at launch.', 'Correct.', 'Leakage shows up as optimistic tests before launch.', 'Not the cause.'] },
      { lec: 3, type: 'mcq', diff: 'M', q: 'Why does the OLS derivation use squared errors rather than absolute errors?',
        options: ['Squared errors are always smaller', 'e² is differentiable everywhere, so setting the derivatives to zero gives a closed form; |e| has a kink at 0', 'Absolute errors can be negative', 'Squared errors ignore outliers'], answer: 1,
        sol: 'The worksheet\'s loss-building section: signed errors cancel, |e| is not differentiable at 0, e² is smooth.', why: ['Not true for |e| < 1.', 'Correct.', '|e| ≥ 0.', 'Opposite — squares amplify outliers.'] },
      { lec: 4, type: 'mcq', diff: 'M', q: 'Inverting XᵀX costs about p³ operations. If p doubles from 100 to 200, the cost is multiplied by:',
        options: ['2', '4', '8', '16'], answer: 2,
        sol: '(2p)³ = 8p³.', why: ['Linear.', 'Quadratic.', 'Correct.', 'Quartic.'] },
      { lec: 5, type: 'mcq', diff: 'M', q: 'Features: area (500–5000) and rooms (1–5), unscaled. What happens in Batch GD?',
        options: ['Nothing — GD is scale-invariant', 'The loss surface is a stretched bowl; the area weight gets huge gradients, so α must be tiny and progress on the rooms weight is slow', 'The rooms weight gets the bigger gradient', 'The closed-form solution changes'], answer: 1,
        sol: 'Partial derivatives scale with the feature values. Standardise first (worksheet section 4).', why: ['GD is not scale-invariant.', 'Correct.', 'Opposite.', 'The OLS optimum is the same; only GD\'s path suffers.'] },
      { lec: 6, type: 'mcq', diff: 'E', q: 'Mini-batch GD with batch size b = m (the whole training set) is the same as:',
        options: ['SGD', 'Batch GD', 'Neither', 'Newton\'s method'], answer: 1,
        sol: 'One batch containing everything → one update per epoch = Batch GD. b = 1 gives SGD.', why: ['That is b = 1.', 'Correct.', 'It is Batch GD.', 'Unrelated.'] },
      { lec: 7, type: 'mcq', diff: 'M', q: 'A model scores R² = −0.3 on the test set. What does this mean?',
        options: ['A calculation error — R² cannot be negative', 'The model is worse than always predicting the mean of the test targets', 'The model explains 30% of the variance', 'The model is perfect'], answer: 1,
        sol: 'R² = 1 − RSS/TSS is negative when RSS > TSS.', why: ['It can be negative on new data.', 'Correct.', 'That would be R² = 0.3.', 'No.'] },
      { lec: 8, type: 'mcq', diff: 'E', q: 'y = β₀ + β₁x + β₂x² is still called **linear** regression because:',
        options: ['The plot is a straight line', 'It is linear in the parameters β', 'x² is a linear function', 'It has no intercept'], answer: 1,
        sol: 'Treat x² as a new column; ŷ = Xβ is linear in β, so OLS still applies.', why: ['It is a parabola.', 'Correct.', 'No.', 'It has β₀.'] },
      { lec: 9, type: 'mcq', diff: 'E', q: 'Dartboard: all shots are tightly grouped but far from the bullseye. This is:',
        options: ['Low bias, low variance', 'High bias, low variance', 'Low bias, high variance', 'High bias, high variance'], answer: 1,
        sol: 'Tight group = low variance; off-centre = high bias.', why: ['Would hit the centre.', 'Correct.', 'Would be scattered around the centre.', 'Would be scattered and off-centre.'] },
      { lec: 10, type: 'mcq', diff: 'M', q: 'A Pearson-correlation filter keeps features with |r| > 0.3. The target is y = x² on x ∈ [−3, 3]. What happens to x?',
        options: ['Kept, because y depends on x', 'Dropped, because r ≈ 0 even though y depends perfectly on x', 'Kept, because r = 1', 'The filter cannot be computed'], answer: 1,
        sol: 'Pearson measures **linear** association only (worksheet counterexample).', why: ['The filter only sees r.', 'Correct.', 'r ≈ 0.', 'It can be computed.'] },
      { lec: 11, type: 'mcq', diff: 'H', q: 'PC scores satisfy Cov(z_r, z_s) = 0 for r ≠ s. Which conclusion is justified?',
        options: ['The scores are statistically independent', 'The scores are uncorrelated, which does not by itself imply independence', 'The original features were uncorrelated', 'All eigenvalues are equal'], answer: 1,
        sol: 'Zero covariance rules out linear dependence only.', why: ['Too strong.', 'Correct.', 'Not implied.', 'Not implied.'] },
      { lec: 13, type: 'mcq', diff: 'M', q: 'The ACF decays slowly and the PACF has two significant spikes (lags 1 and 2), then cuts off. Which model is suggested?',
        options: ['MA(2)', 'AR(2)', 'AR(1)', 'White noise'], answer: 1,
        sol: 'PACF cutting off after lag p → AR(p). (For MA(q) it is the ACF that cuts off.)', why: ['That pattern is the reverse.', 'Correct.', 'Two spikes, not one.', 'White noise has no spikes.'] },
      { lec: 14, type: 'mcq', diff: 'E', q: 'Why does logistic regression use the sigmoid instead of a hard step function?',
        options: ['The step function is not defined at 0', 'The sigmoid is smooth (gives gradients) and outputs a probability between 0 and 1', 'The sigmoid always gives higher accuracy', 'The step function needs labels'], answer: 1,
        sol: 'The step has zero gradient almost everywhere, so GD cannot learn; σ(z) is differentiable and interpretable as P(y = 1).', why: ['Not the main reason.', 'Correct.', 'Not guaranteed.', 'No.'] },
      { lec: 15, type: 'mcq', diff: 'E', q: 'One-vs-Rest on a 3-class problem trains how many binary classifiers?',
        options: ['1', '2', '3', '6'], answer: 2,
        sol: 'One per class (that class vs everything else). Prediction = the class with the highest score.', why: ['That is the softmax model count.', 'That is K − 1.', 'Correct.', 'That is one-vs-one ×2.'] }
    ] },
    { name: 'B', desc: 'MSQ — one or more correct; all must be chosen', marks: 2, questions: [
      { lec: 2, type: 'msq', diff: 'M', q: 'Which of these are **data leakage**?',
        options: ['Scaling with mean and std computed on the full dataset before splitting', 'A feature computed from the target value of the same row', 'Choosing hyperparameters on the validation set', 'Using next week\'s sales as a feature to predict this week\'s sales'], answer: [0, 1, 3],
        sol: 'Leakage = information the model would not have at prediction time. Tuning on validation is the correct procedure.', why: ['Leak.', 'Leak.', 'Correct practice.', 'Leak (future information).'] },
      { lec: 4, type: 'msq', diff: 'M', q: 'When is the normal equation β = (XᵀX)⁻¹Xᵀy impossible or impractical?',
        options: ['XᵀX is singular (perfectly collinear features)', 'p is very large (the inverse costs about p³)', 'n < p + 1 (fewer rows than parameters)', 'The features are not scaled'], answer: [0, 1, 2],
        sol: 'Scaling does not matter for the closed form; it matters for GD.', why: ['True.', 'True.', 'True — XᵀX is then rank-deficient.', 'False.'] },
      { lec: 8, type: 'msq', diff: 'E', q: 'Which are assumptions of linear regression listed in the worksheet?',
        options: ['Linearity between features and target', 'Normally distributed residuals', 'Constant residual variance (homoscedasticity)', 'Every feature must be normally distributed'], answer: [0, 1, 2],
        sol: 'Normality is about the **residuals**, not the features.', why: ['Assumption.', 'Assumption.', 'Assumption.', 'Not required.'] },
      { lec: 11, type: 'msq', diff: 'M', q: 'Which statements about PCA are TRUE?',
        options: ['Principal components are orthogonal directions', 'Each eigenvalue equals the variance of the data along its component', 'PCA uses the target y to choose the components', 'The data can be approximately reconstructed from the top-k scores'], answer: [0, 1, 3],
        sol: 'PCA is unsupervised: it never looks at y.', why: ['True.', 'True.', 'False.', 'True.'] },
      { lec: 13, type: 'msq', diff: 'M', q: 'Which transformations can help make a series stationary?',
        options: ['First differencing', 'A log transform when the variance grows with the level', 'Seasonal differencing (yₜ − yₜ₋ₛ)', 'Randomly shuffling the rows'], answer: [0, 1, 2],
        sol: 'Shuffling destroys the time structure.', why: ['Removes trend.', 'Stabilises variance.', 'Removes seasonality.', 'Never.'] }
    ] },
    { name: 'C', desc: 'Numerical answer — type the value', marks: 2, questions: [
      { lec: 1, type: 'int', diff: 'E', q: 'Min-Max scale the value 45 when the training column ranges from 30 to 80.', answer: 0.3, tol: 0.001, round: '2 decimals',
        verify: '(45-30)/(80-30)', sol: '(45 − 30)/(80 − 30) = 15/50 = **0.3**.' },
      { lec: 4, type: 'int', diff: 'M', q: 'Points (1, 1), (2, 3), (4, 4). OLS slope β₁ from the normal equation (3 decimals)?', answer: 0.929, tol: 0.001, round: '3 decimals',
        verify: 'import numpy as np; X=np.array([[1,1],[1,2],[1,4.]]); y=np.array([1,3,4.]); np.linalg.solve(X.T@X,X.T@y)[1]',
        sol: 'x̄ = 7/3, ȳ = 8/3. Sxy = (−4/3)(−5/3) + (−1/3)(1/3) + (5/3)(4/3) = (20 − 1 + 20)/9 = 39/9; Sxx = (16 + 1 + 25)/9 = 42/9. β₁ = 39/42 = **0.929**.' },
      { lec: 7, type: 'int', diff: 'M', q: 'TP = 30, FN = 20, FP = 10, TN = 40. F1 for the positive class (3 decimals)?', answer: 0.667, tol: 0.001, round: '3 decimals',
        verify: '2*30/(2*30+10+20)', sol: 'Precision 30/40 = 0.75, recall 30/50 = 0.6. F1 = 2(0.75)(0.6)/1.35 = 0.9/1.35 = **0.667**.' },
      { lec: 8, type: 'int', diff: 'E', q: 'Regressing x₃ on the other features gives R² = 0.8. VIF of x₃?', answer: 5, tol: 0.001, round: 'Exact',
        verify: '1/(1-0.8)', sol: '1/(1 − 0.8) = **5** (moderate collinearity).' },
      { lec: 9, type: 'int', diff: 'E', q: 'Bias² = 4, Variance = 1, irreducible error σ² = 0.5. Expected test MSE?', answer: 5.5, tol: 0.001, round: '1 decimal',
        verify: '4+1+0.5', sol: '4 + 1 + 0.5 = **5.5**; Bias² dominates, so the model is too simple.' },
      { lec: 10, type: 'int', diff: 'E', q: 'Forward selection run to completion on p = 8 features. Total models trained?', answer: 36, tol: 0, round: 'Exact',
        verify: '8*9//2', sol: '8 + 7 + … + 1 = 8 × 9/2 = **36** (exhaustive search: 255).' },
      { lec: 13, type: 'int', diff: 'M', q: 'AR(2): yₜ = 5 + 0.5yₜ₋₁ − 0.2yₜ₋₂ + εₜ. With yₜ₋₁ = 20 and yₜ₋₂ = 10, forecast yₜ.', answer: 13, tol: 0.001, round: 'Exact',
        verify: '5+0.5*20-0.2*10', sol: '5 + 10 − 2 = **13**.' },
      { lec: 15, type: 'int', diff: 'M', q: 'Two-class softmax with logits (0, ln 3). Probability of the second class?', answer: 0.75, tol: 0.001, round: '2 decimals',
        verify: 'import math; 3/(1+3)', sol: 'e⁰ = 1, e^{ln 3} = 3 → 3/(1 + 3) = **0.75**. Same as σ(ln 3): softmax with K = 2 is the sigmoid of the logit difference.' }
    ] },
    { name: 'D', desc: 'Python — predict the output, find the bug, fill the line', marks: 2, questions: [
      { lec: 2, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.model_selection import train_test_split
X = np.arange(12).reshape(12, 1); y = np.array([0] * 8 + [1] * 4)
_, _, _, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)
print(np.bincount(y_te).tolist())`, answer: '[2, 1]',
        sol: 'Test size 3. Stratification keeps the 2 : 1 class ratio → two 0s and one 1.' },
      { lec: 6, type: 'out', diff: 'M', q: 'Predict the exact output (no shuffling).', code: R`x = [1.0, 2.0]; y = [2.0, 4.0]
w, lr = 0.0, 0.1
for xi, yi in zip(x, y):
    w = w - lr * 2 * (w * xi - yi) * xi
print(round(w, 2))`, answer: '1.68',
        sol: 'Sample 1: gradient 2(0 − 2)(1) = −4 → w = 0.4. Sample 2: 2(0.8 − 4)(2) = −12.8 → w = 0.4 + 1.28 = 1.68. Each update uses the latest w.' },
      { lec: 7, type: 'bug', diff: 'E', q: 'Which line is wrong?', code: R`tp, tn, fp, fn = 40, 45, 5, 10
accuracy  = (tp + fp) / (tp + tn + fp + fn)     # line 2
precision = tp / (tp + fp)                      # line 3
recall    = tp / (tp + fn)                      # line 4`,
        options: ['Line 2 — accuracy counts the correct predictions, TP + TN', 'Line 3', 'Line 4', 'Nothing is wrong'], answer: 0,
        sol: 'The same slip appears on the L7 whiteboard. Accuracy = (TP + TN)/total = 85/100.', why: ['Correct.', 'Right.', 'Right.', 'Line 2 is wrong.'],
        fixed: R`tp, tn, fp, fn = 40, 45, 5, 10
accuracy = (tp + tn) / (tp + tn + fp + fn)
assert accuracy == 0.85
print(accuracy)` },
      { lec: 11, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
vals, vecs = np.linalg.eigh(np.array([[2.0, 0.0], [0.0, 1.0]]))
print(vals.tolist())`, answer: '[1.0, 2.0]',
        sol: '`eigh` returns eigenvalues in **ascending** order — reverse them before picking the top components.' },
      { lec: 12, type: 'fill', diff: 'M', q: 'Ridge from scratch. Which line fills the gap?', code: R`def ridge(X, y, lam):
    I = np.eye(X.shape[1])
    ______________________________
    return w`,
        options: ['`w = np.linalg.inv(X.T @ X + lam * I) @ X.T @ y`', '`w = np.linalg.inv(X.T @ X) @ X.T @ y + lam`', '`w = np.linalg.inv(X.T @ X - lam * I) @ X.T @ y`', '`w = lam * np.linalg.inv(X.T @ X) @ X.T @ y`'], answer: 0,
        sol: 'β = (XᵀX + λI)⁻¹Xᵀy. Adding λI also makes the matrix invertible.', why: ['Correct.', 'Not Ridge.', 'Wrong sign.', 'Not Ridge.'],
        fixed: R`import numpy as np
def ridge(X, y, lam):
    I = np.eye(X.shape[1])
    w = np.linalg.inv(X.T @ X + lam * I) @ X.T @ y
    return w
w = ridge(np.array([[1.0], [2.0]]), np.array([2.0, 3.0]), 1.0)
assert np.isclose(w[0], 8 / 6)
print(round(float(w[0]), 4))` }
    ] },
    { name: 'E', desc: 'Python — write the function (run the tests online, or self-mark against the reference)', marks: 5, questions: [
      { lec: 12, type: 'write', diff: 'M', q: 'Write `ridge_beta(X, y, lam)` returning β = (XᵀX + λI)⁻¹Xᵀy as a list rounded to 4 decimals. Use X exactly as given (do not add a bias column).',
        starter: 'import numpy as np\n\ndef ridge_beta(X, y, lam):\n    pass\n',
        ref: 'import numpy as np\n\ndef ridge_beta(X, y, lam):\n    X = np.array(X, float); y = np.array(y, float)\n    A = X.T @ X + lam * np.eye(X.shape[1])\n    return np.round(np.linalg.solve(A, X.T @ y), 4).tolist()',
        tests: 'assert ridge_beta([[1], [2]], [2, 3], 1) == [1.3333]\nassert ridge_beta([[1, 0], [0, 1], [1, 1]], [1, 2, 3], 0) == [1.0, 2.0]\nassert ridge_beta([[1, 0], [0, 1]], [4, 6], 1) == [2.0, 3.0]' },
      { lec: 14, type: 'write', diff: 'M', q: 'Write `mean_bce(y, z)` where `z` are **logits** (linear scores): compute p̂ = σ(z), clip it into [1e-15, 1 − 1e-15], and return the mean binary cross-entropy rounded to 4 decimals.',
        starter: 'import numpy as np\n\ndef mean_bce(y, z):\n    pass\n',
        ref: 'import numpy as np\n\ndef mean_bce(y, z):\n    y = np.array(y, float); z = np.array(z, float)\n    p = np.clip(1 / (1 + np.exp(-z)), 1e-15, 1 - 1e-15)\n    return round(float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))), 4)',
        tests: 'assert mean_bce([1, 0], [0, 0]) == 0.6931\nassert mean_bce([1], [2]) == 0.1269\nassert mean_bce([0, 1], [-50, 50]) == 0.0' }
    ] }
  ]
};
