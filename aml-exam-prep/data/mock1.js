/* Mock paper 1 — 35 questions, 61 marks, 90 minutes. Every lecture L0–L15 appears at least once.
   All numerical answers have Python `verify` expressions and all code outputs were produced by running the code. */
EXTRA.mocks[1] = {
  title: 'Mock paper 1 (all lectures, 90 minutes)',
  minutes: 90,
  intro: R`Exam-style paper built from the patterns in your course quizzes: scenario MCQs, "which statement is true", assertion–reason, multi-correct, hand calculations and Python. Take it on **day 6** under timed conditions, with paper and a basic calculator. Do not look at the lecture pages while the timer runs.`,
  sections: [
    { name: 'A', desc: 'MCQ — exactly one correct option', marks: 1, questions: [
      { lec: 0, type: 'mcq', diff: 'E', q: 'A bank has transaction histories for 2 million customers but **no labels**. It wants to discover natural customer segments. Which learning setup fits?',
        options: ['Supervised classification', 'Unsupervised clustering', 'Reinforcement learning', 'Supervised regression'], answer: 1,
        sol: 'No labels and "find groups" → unsupervised learning, task = clustering.', why: ['Needs labelled classes.', 'Correct.', 'No agent, actions or rewards.', 'Needs a numeric label.'] },
      { lec: 1, type: 'mcq', diff: 'E', q: 'The column *Education* takes the values High School < Bachelor < Master < PhD. A linear model should see this order. Best encoding?',
        options: ['One-hot encoding', 'Ordinal encoding 0, 1, 2, 3 in that order', 'Binary encoding', 'Drop the column'], answer: 1,
        sol: 'Ordinal (ordered) categories → ordinal encoding with the order you specify.', why: ['Loses the order (and adds columns).', 'Correct.', 'For high-cardinality nominal data; order is lost.', 'Throws away information.'] },
      { lec: 2, type: 'mcq', diff: 'E', q: 'Which of these is a **hyperparameter**?',
        options: ['The slope m found by OLS', 'The learning rate α of gradient descent', 'The intercept c', 'A residual eᵢ'], answer: 1,
        sol: 'Hyperparameters are set **before** training and tuned on the validation set; parameters are learned from the data.', why: ['Learned parameter.', 'Correct.', 'Learned parameter.', 'Not a parameter at all.'] },
      { lec: 3, type: 'mcq', diff: 'M', q: 'Assertion (A): every OLS line passes through (x̄, ȳ). Reason (R): setting ∂E/∂c = 0 gives c = ȳ − m·x̄.',
        options: ['Both A and R are true, and R is the correct explanation of A', 'Both are true, but R does not explain A', 'A is true, R is false', 'A is false, R is true'], answer: 0,
        sol: 'Put x = x̄ into ŷ = mx + c: ŷ = m x̄ + ȳ − m x̄ = ȳ. The intercept condition is exactly why the line passes through the means.', why: ['Correct.', 'R does explain A.', 'R is true.', 'A is true.'] },
      { lec: 4, type: 'mcq', diff: 'M', q: 'X is n × (p + 1) and y is n × 1. Which product in the normal equation is a (p + 1) × 1 vector?',
        options: ['XᵀX', 'Xᵀy', 'yᵀX', 'XXᵀ'], answer: 1,
        sol: '(p+1)×n times n×1 = (p+1)×1.', why: ['(p+1)×(p+1).', 'Correct.', '1×(p+1), a row.', 'n×n.'] },
      { lec: 5, type: 'mcq', diff: 'M', q: 'After 100 epochs, the validation MSE for α = 0.001, 0.01, 0.1, 1.0 is 4.10, 1.25, 0.98 and 37.6 (still rising). Which α do you pick?',
        options: ['0.001 — the smallest is always safest', '0.01', '0.1', '1.0 — it moved the most'], answer: 2,
        sol: 'Pick the lowest **validation** loss among the runs that converged: 0.1. α = 1.0 is diverging; 0.001 is too slow.', why: ['Too slow: still far from the minimum.', 'Converging, but worse than 0.1.', 'Correct.', 'Rising loss = divergence.'] },
      { lec: 6, type: 'mcq', diff: 'M', q: 'Which statement about the SGD gradient is TRUE?',
        options: ['It always points exactly at the minimum', 'It is an unbiased but noisy estimate of the full gradient', 'It is biased, so SGD converges to a different minimum', 'It is identical to the batch gradient'], answer: 1,
        sol: 'Averaged over the random choice of sample, ∇Jᵢ equals the full gradient; any single draw can be far from it.', why: ['No single estimate does that.', 'Correct.', 'It is unbiased.', 'Only when m = 1.'] },
      { lec: 7, type: 'mcq', diff: 'M', q: 'An email filter moves "spam" to a hidden folder. Users lose important mail when a genuine email is flagged. Which metric for the spam class matters most?',
        options: ['Recall', 'Precision', 'Accuracy', 'MAPE'], answer: 1,
        sol: 'A false positive (genuine flagged as spam) is the costly error. Precision = TP/(TP + FP) penalises false positives.', why: ['Recall penalises missed spam (FN).', 'Correct.', 'Hides the error type.', 'A regression metric.'] },
      { lec: 8, type: 'mcq', diff: 'E', q: 'The residuals-vs-fitted plot fans out like a funnel: the spread grows with ŷ. Which assumption is violated?',
        options: ['Linearity', 'Homoscedasticity (constant error variance)', 'No multicollinearity', 'Independence of errors'], answer: 1,
        sol: 'A funnel = heteroscedasticity.', why: ['That shows as a curve (U-shape).', 'Correct.', 'Not visible in a residual plot.', 'That shows as runs/waves over time.'] },
      { lec: 9, type: 'mcq', diff: 'E', q: 'Training error 2%, validation error 25%. Diagnosis and a sensible first step?',
        options: ['High bias — use a more complex model', 'High variance — get more data or add regularization', 'Irreducible error — nothing can be done', 'The model is perfect'], answer: 1,
        sol: 'A big train–validation gap means overfitting (high variance).', why: ['High bias shows as both errors high.', 'Correct.', 'The gap is not noise.', 'No.'] },
      { lec: 10, type: 'mcq', diff: 'E', q: 'Why is a wrapper method usually much more expensive than a filter method?',
        options: ['It needs labelled data', 'It retrains and evaluates the model for every candidate subset', 'It computes a correlation matrix', 'It uses the test set'], answer: 1,
        sol: 'Generate subset → train → evaluate → repeat. Filters score each feature once with a simple rule.', why: ['Filters on the target need labels too.', 'Correct.', 'That is a filter step.', 'Neither should.'] },
      { lec: 11, type: 'mcq', diff: 'M', q: 'Features are height (cm, variance ≈ 100) and income (₹, variance ≈ 10¹⁰). PCA is run on the raw data. What happens?',
        options: ['PC1 ≈ the income axis, only because of its units', 'PCA ignores units automatically', 'PC1 ≈ the height axis', 'PCA fails with an error'], answer: 0,
        sol: 'PCA maximises variance, and income\'s variance dwarfs height\'s. Standardise first so each feature has variance 1.', why: ['Correct.', 'It does not.', 'Opposite.', 'It runs, but the result is misleading.'] },
      { lec: 12, type: 'mcq', diff: 'M', q: 'In 1-D Ridge, m = Sxy/(Sxx + λ). As λ grows very large, m:',
        options: ['becomes exactly 0 at some finite λ', 'approaches 0 but stays non-zero for any finite λ', 'becomes negative', 'is unchanged'], answer: 1,
        sol: 'λ in the **denominator** only shrinks m asymptotically. Exact zeros come from Lasso (λ in the numerator).', why: ['That is Lasso.', 'Correct.', 'Sign never flips.', 'It shrinks.'] },
      { lec: 13, type: 'mcq', diff: 'E', q: 'A series has a constant mean, but its spread grows steadily over time. Is it (weakly) stationary?',
        options: ['Yes — the mean is constant', 'No — the variance is not constant', 'Yes, if it has no seasonality', 'Only after shuffling'], answer: 1,
        sol: 'Stationarity needs a constant mean, a constant variance and an autocovariance that depends only on the lag.', why: ['Mean alone is not enough.', 'Correct.', 'Still non-constant variance.', 'Shuffling destroys the series.'] },
      { lec: 14, type: 'mcq', diff: 'M', q: 'How are logistic-regression coefficients chosen in the worksheet\'s story?',
        options: ['To maximise accuracy directly', 'To maximise the Bernoulli likelihood, i.e. minimise binary cross-entropy', 'To minimise MAE of the labels', 'By the normal equation'], answer: 1,
        sol: 'Likelihood → log-likelihood → negative log-likelihood = BCE. Accuracy is a step function and gives no gradient.', why: ['Accuracy is not differentiable.', 'Correct.', 'Not the course objective.', 'No closed form exists.'] }
    ] },
    { name: 'B', desc: 'MSQ — one or more correct; all must be chosen', marks: 2, questions: [
      { lec: 1, type: 'msq', diff: 'M', q: 'Which are valid ways to handle missing values?',
        options: ['Mean or median imputation for a numeric column', 'Mode imputation for a categorical column', 'Dropping the few rows that have missing values', 'Filling training gaps with the **test-set** mean'], answer: [0, 1, 2],
        sol: 'A, B and C are standard. D leaks test information into training.', why: ['Valid.', 'Valid.', 'Valid when few rows are affected.', 'Leakage.'] },
      { lec: 7, type: 'msq', diff: 'H', q: 'For a **single-label multiclass** classifier, which statements are always true?',
        options: ['Micro-F1 equals accuracy', 'Macro-F1 gives every class equal weight', 'Weighted-F1 is always at least macro-F1', 'Precision of class k = TP/(TP + FN)'], answer: [0, 1],
        sol: 'Micro pools all decisions (= accuracy). Macro is a plain mean over classes. Weighted can be lower than macro if a large class does badly. D is recall.', why: ['True.', 'True.', 'False in general.', 'That is recall.'] },
      { lec: 9, type: 'msq', diff: 'M', q: 'Which actions usually **reduce variance** (overfitting)?',
        options: ['Collecting more training data', 'Increasing the regularization strength λ', 'Raising the polynomial degree', 'Removing irrelevant features'], answer: [0, 1, 3],
        sol: 'More data, stronger penalties and fewer useless features all make the fit less sensitive to the sample. A higher degree adds variance.', why: ['Reduces variance.', 'Reduces variance.', 'Increases variance.', 'Reduces variance.'] },
      { lec: 12, type: 'msq', diff: 'M', q: 'Which statements about Ridge and Lasso are TRUE?',
        options: ['Lasso can set coefficients exactly to zero', 'Ridge has the closed form β = (XᵀX + λI)⁻¹Xᵀy', 'Features should be standardised before applying either penalty', 'Ridge performs automatic feature selection'], answer: [0, 1, 2],
        sol: 'D is false: Ridge only shrinks.', why: ['True.', 'True.', 'True — the penalty depends on scale.', 'False.'] },
      { lec: 15, type: 'msq', diff: 'M', q: 'Which are properties of softmax?',
        options: ['The outputs sum to 1', 'Adding the same constant to every logit leaves the outputs unchanged', 'The largest logit gets the largest probability', 'Multiplying every logit by 2 leaves the outputs unchanged'], answer: [0, 1, 2],
        sol: 'Scaling the logits sharpens or flattens the distribution, so D is false.', why: ['True.', 'True (shift property).', 'True (exp is increasing).', 'False.'] }
    ] },
    { name: 'C', desc: 'Numerical answer — type the value', marks: 2, questions: [
      { lec: 3, type: 'int', diff: 'M', q: 'x = [2, 4, 6, 8], y = [5, 9, 10, 16]. Fit OLS and predict ŷ at x = 10.', answer: 18.5, tol: 0.01, round: '2 decimals',
        verify: 'import numpy as np; x=np.array([2,4,6,8.]); y=np.array([5,9,10,16.]); m=((x-x.mean())*(y-y.mean())).sum()/((x-x.mean())**2).sum(); m*10+(y.mean()-m*x.mean())',
        sol: 'x̄ = 5, ȳ = 10. Sxy = (−3)(−5) + (−1)(−1) + (1)(0) + (3)(6) = 34; Sxx = 20. m = 1.7, c = 10 − 8.5 = 1.5. ŷ(10) = 17 + 1.5 = **18.5**.' },
      { lec: 5, type: 'int', diff: 'M', q: 'BGD with ∇L = (2/m)Xᵀ(Xθ − y). Data (1, 3), (2, 5), (3, 7); θ = (0, 0); α = 0.05. θ₁ after one update (3 decimals)?', answer: 1.133, tol: 0.001, round: '3 decimals',
        verify: 'import numpy as np; X=np.array([[1,1],[1,2],[1,3.]]); y=np.array([3,5,7.]); (-0.05*(2/3)*X.T@(X@np.zeros(2)-y))[1]',
        sol: 'Residuals Xθ − y = (−3, −5, −7). ∂L/∂θ₁ = (2/3)(−3 − 10 − 21) = −22.667. θ₁ = 0.05 × 22.667 = **1.133**.' },
      { lec: 6, type: 'int', diff: 'M', q: 'SGD with ∂Jᵢ/∂θ₀ = e, ∂Jᵢ/∂θ₁ = e·x, e = ŷ − y, α = 0.1. Current θ = (0.4, 0.8); the next sample is (3, 6). New θ₁?', answer: 1.76, tol: 0.001, round: '2 decimals',
        verify: 'e=0.4+0.8*3-6; 0.8-0.1*e*3',
        sol: 'ŷ = 0.4 + 2.4 = 2.8, e = −3.2. θ₁ = 0.8 − 0.1(−3.2)(3) = 0.8 + 0.96 = **1.76**.' },
      { lec: 7, type: 'int', diff: 'M', q: 'n = 25 rows, p = 4 features, R² = 0.72. Adjusted R² (3 decimals)?', answer: 0.664, tol: 0.001, round: '3 decimals',
        verify: '1-(1-0.72)*24/20', sol: '1 − 0.28 × 24/20 = 1 − 0.336 = **0.664**.' },
      { lec: 11, type: 'int', diff: 'M', q: 'PCA eigenvalues 6, 2.5, 1, 0.5. Smallest k that keeps **at least** 85% of the variance?', answer: 2, tol: 0, round: 'Exact',
        verify: 'import numpy as np; v=np.cumsum([6,2.5,1,0.5])/10; int(np.argmax(v>=0.85-1e-12))+1',
        sol: 'Total 10. Cumulative: 60%, 85%, 95%, 100%. 85% ≥ 85%, so **k = 2**.' },
      { lec: 12, type: 'int', diff: 'M', q: 'x = [1, 2, 3], y = [2, 4, 7]. 1-D Ridge slope with λ = 3 (m = Sxy/(Sxx + λ))?', answer: 1, tol: 0.001, round: '2 decimals',
        verify: 'import numpy as np; x=np.array([1,2,3.]); y=np.array([2,4,7.]); ((x-x.mean())*(y-y.mean())).sum()/(((x-x.mean())**2).sum()+3)',
        sol: 'Sxy = 5, Sxx = 2 (see the Pearson drill). m = 5/(2 + 3) = **1.0** (OLS: 2.5).' },
      { lec: 14, type: 'int', diff: 'E', q: 'True label y = 0, predicted p̂ = 0.9. BCE for this row (natural log, 4 decimals)?', answer: 2.3026, tol: 0.0001, round: '4 decimals',
        verify: 'import math; -math.log(1-0.9)', sol: 'y = 0 → −ln(1 − 0.9) = −ln 0.1 = **2.3026**: confidently wrong is expensive.' },
      { lec: 15, type: 'int', diff: 'H', q: 'Logistic GD: X = [[1, 1], [1, 2]] (first column = bias), y = [0, 1], β = (0, 0), α = 1, gradient Xᵀ(p̂ − y)/n. New β₁?', answer: 0.25, tol: 0.001, round: '2 decimals',
        verify: 'import numpy as np; X=np.array([[1,1],[1,2.]]); y=np.array([0,1.]); p=np.full(2,0.5); (-(X.T@(p-y))/2)[1]',
        sol: 'p̂ = (0.5, 0.5), p̂ − y = (0.5, −0.5). Xᵀ(p̂ − y) = (0, 0.5 − 1.0) = (0, −0.5); ÷2 → (0, −0.25). β = (0, **0.25**).' }
    ] },
    { name: 'D', desc: 'Python — predict the output, find the bug, fill the line', marks: 2, questions: [
      { lec: 1, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.preprocessing import LabelEncoder
print(LabelEncoder().fit_transform(['low', 'high', 'medium', 'low']).tolist())`, answer: '[1, 0, 2, 1]',
        sol: '`LabelEncoder` numbers classes in **alphabetical** order (high = 0, low = 1, medium = 2), not in the natural order. Use `OrdinalEncoder(categories=[...])` for ordered data.' },
      { lec: 4, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[1, 1], [1, 2], [1, 3]], float); y = np.array([2, 3, 5], float)
print(np.round(np.linalg.solve(X.T @ X, X.T @ y), 3).tolist())`, answer: '[0.333, 1.5]',
        sol: 'x̄ = 2, ȳ = 10/3. Sxy = 3, Sxx = 2 → β₁ = 1.5, β₀ = 10/3 − 3 = 0.333.' },
      { lec: 13, type: 'bug', diff: 'M', q: 'Model selection for a monthly sales series. Which line is the problem?', code: R`from sklearn.model_selection import KFold, cross_val_score
cv = KFold(n_splits=5, shuffle=True, random_state=0)          # line 2
scores = cross_val_score(model, X_lags, y, cv=cv)             # line 3
print(scores.mean())                                          # line 4`,
        options: ['Line 2 — shuffled K-fold trains on the future to predict the past', 'Line 3', 'Line 4', 'Nothing is wrong'], answer: 0,
        sol: 'Use `TimeSeriesSplit`: every training window ends before its test block.', why: ['Correct.', 'Fine with a proper splitter.', 'Fine.', 'Leakage.'],
        fixed: R`import numpy as np
from sklearn.model_selection import TimeSeriesSplit
for tr, te in TimeSeriesSplit(n_splits=5).split(np.zeros(24)):
    assert tr.max() < te.min()
print("no fold uses the future")` },
      { lec: 10, type: 'fill', diff: 'M', q: 'Drop one feature from every highly correlated pair. Which condition fills the gap?', code: R`corr = np.corrcoef(X, rowvar=False)
drop = set()
for i in range(p):
    for j in range(i + 1, p):
        if ______________________:
            drop.add(j)`,
        options: ['`abs(corr[i, j]) > 0.9`', '`corr[i, j] > 0.9`', '`corr[i, i] > 0.9`', '`abs(corr[i, j]) < 0.9`'], answer: 0,
        sol: 'Strong **negative** correlation is just as redundant, hence `abs`. The diagonal is always 1.', why: ['Correct.', 'Misses r = −0.95.', 'Always 1.', 'Drops the unrelated ones.'],
        fixed: R`import numpy as np
X = np.array([[1, 2, 5], [2, 4, 3], [3, 6, 4], [4, 8, 1]], float); p = 3
corr = np.corrcoef(X, rowvar=False)
drop = set()
for i in range(p):
    for j in range(i + 1, p):
        if abs(corr[i, j]) > 0.9:
            drop.add(j)
assert drop == {1}
print(sorted(drop))` },
      { lec: 14, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
y = np.array([1, 0, 1]); p = np.array([0.9, 0.2, 0.6])
print(round(float(np.prod(np.where(y == 1, p, 1 - p))), 3))`, answer: '0.432',
        sol: 'Bernoulli likelihood: 0.9 × (1 − 0.2) × 0.6 = 0.432.' }
    ] },
    { name: 'E', desc: 'Python — write the function (run the tests online, or self-mark against the reference)', marks: 5, questions: [
      { lec: 5, type: 'write', diff: 'M', q: 'Write `bgd_with_bias(x, y, lr, epochs)` for ŷ = w·x + b. Start w = b = 0. Each epoch compute dw = mean(2(ŷ − y)x) and db = mean(2(ŷ − y)) from the **same** predictions, update both, and finally return `(round(w, 2), round(b, 2))`.',
        starter: 'import numpy as np\n\ndef bgd_with_bias(x, y, lr, epochs):\n    pass\n',
        ref: 'import numpy as np\n\ndef bgd_with_bias(x, y, lr, epochs):\n    x = np.array(x, float); y = np.array(y, float); w = b = 0.0\n    for _ in range(epochs):\n        err = w * x + b - y\n        dw, db = np.mean(2 * err * x), np.mean(2 * err)\n        w, b = w - lr * dw, b - lr * db\n    return round(float(w), 2), round(float(b), 2)',
        tests: 'assert bgd_with_bias([1, 2], [2, 4], 0.1, 1) == (1.0, 0.6)\nassert bgd_with_bias([1, 2, 3, 4], [3, 5, 7, 9], 0.05, 2000) == (2.0, 1.0)' },
      { lec: 15, type: 'write', diff: 'M', q: 'One-vs-Rest prediction. `W` is a K × (d + 1) list of weight rows (bias first), `X` an n × d list. Write `ovr_predict(W, X)` returning the list of predicted class indices: for each row, the class whose σ(w₀ + w·x) is largest.',
        starter: 'import numpy as np\n\ndef ovr_predict(W, X):\n    pass\n',
        ref: 'import numpy as np\n\ndef ovr_predict(W, X):\n    W = np.array(W, float); X = np.array(X, float)\n    Xb = np.c_[np.ones(len(X)), X]\n    P = 1 / (1 + np.exp(-(Xb @ W.T)))\n    return P.argmax(axis=1).tolist()',
        tests: 'W = [[2, -1, 0], [-1, 1, -1], [-3, 0, 1]]\nassert ovr_predict(W, [[0, 0], [4, 0], [0, 6]]) == [0, 1, 2]\nassert ovr_predict([[0, 1], [0, -1]], [[3], [-3]]) == [0, 1]' }
    ] }
  ]
};
