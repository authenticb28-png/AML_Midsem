/* Drills — the Integer/numerical drill (one or more questions for every formula in L1–L15) and the Code drill
   (predict the output, find the bug, fill the missing line, write the function). Every numerical answer has a
   Python `verify` expression and every code answer was produced by running the code (tools/check_questions.py). */
(function () {
  const I = [
    /* ---------------- L1 preprocessing */
    { lec: 1, type: 'int', diff: 'E', q: 'Feature values [10, 20, 25, 40]. Min-Max scale the value 25 to [0, 1].', answer: 0.5, tol: 0.001, round: '2 decimals', verify: '(25-10)/(40-10)',
      sol: R`$x' = \frac{x - x_{min}}{x_{max} - x_{min}} = \frac{25 - 10}{40 - 10} = \frac{15}{30} = $ **0.5**.` },
    { lec: 1, type: 'int', diff: 'E', q: 'A score of 70 in a column with mean 60 and standard deviation 5. Z-score?', answer: 2, tol: 0.001, round: 'Exact', verify: '(70-60)/5',
      sol: R`$z = (x - \mu)/\sigma = (70 - 60)/5 = $ **2** (two standard deviations above the mean).` },
    { lec: 1, type: 'int', diff: 'E', q: 'Robust scaling: x = 50, median 40, Q1 = 30, Q3 = 50. Scaled value?', answer: 0.5, tol: 0.001, round: '2 decimals', verify: '(50-40)/(50-30)',
      sol: R`$x' = (x - \text{median})/\text{IQR} = (50 - 40)/(50 - 30) = 10/20 = $ **0.5**.` },
    { lec: 1, type: 'int', diff: 'E', q: 'Max-Abs scaling of the column [−8, 2, 4]. Scaled value of 2?', answer: 0.25, tol: 0.001, round: '2 decimals', verify: '2/8',
      sol: 'Divide by max|x| = 8: 2/8 = **0.25**. (−8 → −1; the sign is kept.)' },
    { lec: 1, type: 'int', diff: 'E', q: 'A nominal feature has 37 categories. How many columns does **binary** encoding create?', answer: 6, tol: 0, round: 'Exact', verify: 'import math; math.ceil(math.log2(37))',
      sol: '⌈log₂ 37⌉ = ⌈5.21⌉ = **6** columns (2⁵ = 32 < 37 ≤ 64 = 2⁶). One-hot would need 37.' },
    { lec: 1, type: 'int', diff: 'M', q: 'Q1 = 20 and Q3 = 36. What is the **upper** outlier fence (Q3 + 1.5·IQR)?', answer: 60, tol: 0, round: 'Exact', verify: '36+1.5*(36-20)',
      sol: 'IQR = 36 − 20 = 16. Upper fence = 36 + 1.5 × 16 = 36 + 24 = **60**. Any value above 60 is flagged.' },
    /* ---------------- L2 lifecycle */
    { lec: 2, type: 'int', diff: 'E', q: '2,000 rows are split 70/15/15 into train/validation/test. How many validation rows?', answer: 300, tol: 0, round: 'Exact', verify: '2000*0.15',
      sol: '0.15 × 2000 = **300** (train 1400, test 300).' },
    { lec: 2, type: 'int', diff: 'M', q: 'A new model cuts MAE from 12 to 10 units. Each unit of error costs ₹500 per order, and there are 1,200 orders a month. Monthly saving in ₹?', answer: 1200000, tol: 0, round: 'Exact', verify: '(12-10)*500*1200',
      sol: 'Saving = ΔMAE × cost per unit × orders = 2 × 500 × 1200 = **₹12,00,000** per month. Compare this with the training/deployment cost (course-quiz pattern: translate the metric into money).' },
    /* ---------------- L3 SLR / OLS */
    { lec: 3, type: 'int', diff: 'M', q: 'x = [1, 2, 3, 4], y = [3, 5, 4, 8]. OLS slope m?', answer: 1.4, tol: 0.001, round: '2 decimals', verify: 'import numpy as np; x=np.array([1,2,3,4.]); y=np.array([3,5,4,8.]); ((x-x.mean())*(y-y.mean())).sum()/((x-x.mean())**2).sum()',
      sol: R`$\bar x = 2.5$, $\bar y = 5$. Deviations $x - \bar x$: −1.5, −0.5, 0.5, 1.5; $y - \bar y$: −2, 0, −1, 3. $\sum(x-\bar x)(y-\bar y) = 3 + 0 - 0.5 + 4.5 = 7$; $\sum(x-\bar x)^2 = 2.25 + 0.25 + 0.25 + 2.25 = 5$. $m = 7/5 = $ **1.4**.` },
    { lec: 3, type: 'int', diff: 'M', q: 'Same data (x = [1, 2, 3, 4], y = [3, 5, 4, 8], m = 1.4). Intercept c?', answer: 1.5, tol: 0.001, round: '2 decimals', verify: '5-1.4*2.5',
      sol: R`$c = \bar y - m\bar x = 5 - 1.4 \times 2.5 = 5 - 3.5 = $ **1.5**. The line passes through $(\bar x, \bar y) = (2.5, 5)$.` },
    { lec: 3, type: 'int', diff: 'E', q: 'Line ŷ = 2x on the points (1, 3), (2, 3), (3, 7). Sum of squared errors?', answer: 3, tol: 0, round: 'Exact', verify: 'sum((y-2*x)**2 for x,y in [(1,3),(2,3),(3,7)])',
      sol: 'Residuals y − ŷ: 3 − 2 = 1, 3 − 4 = −1, 7 − 6 = 1. SSE = 1 + 1 + 1 = **3**.' },
    { lec: 3, type: 'int', diff: 'M', q: 'Residuals of a fit are [1, −2, 1, 10]. Ratio SSE / SAE (sum of squared ÷ sum of absolute)?', answer: 7.571, tol: 0.002, round: '3 decimals', verify: '(1+4+1+100)/(1+2+1+10)',
      sol: 'SSE = 1 + 4 + 1 + 100 = 106, SAE = 1 + 2 + 1 + 10 = 14, ratio = 106/14 = **7.571**. The outlier (10) supplies 100 of the 106 squared units — squared loss is dominated by outliers.' },
    /* ---------------- L4 MLR */
    { lec: 4, type: 'int', diff: 'E', q: 'A Multiple Linear Regression has p = 7 input features. How many learnable parameters (with intercept)?', answer: 8, tol: 0, round: 'Exact', verify: '7+1',
      sol: 'p + 1 = **8** (β₀ plus one β per feature).' },
    { lec: 4, type: 'int', diff: 'M', q: 'Design matrix X is 200 × 6 (a column of 1s + 5 features). How many entries does XᵀX have?', answer: 36, tol: 0, round: 'Exact', verify: '6*6',
      sol: 'XᵀX is (p+1) × (p+1) = 6 × 6 = **36** entries, whatever n is.' },
    { lec: 4, type: 'int', diff: 'M', q: 'Points (0, 1), (1, 2), (2, 6). Fit y = β₀ + β₁x with the normal equation. β₀?', answer: 0.5, tol: 0.001, round: '2 decimals', verify: 'import numpy as np; X=np.array([[1,0],[1,1],[1,2.]]); y=np.array([1,2,6.]); np.linalg.solve(X.T@X, X.T@y)[0]',
      sol: R`$X^TX = \begin{bmatrix}3 & 3\\ 3 & 5\end{bmatrix}$, $X^Ty = [9, 14]^T$. Solve: $3\beta_0 + 3\beta_1 = 9$, $3\beta_0 + 5\beta_1 = 14$ ⇒ $2\beta_1 = 5$, $\beta_1 = 2.5$, $\beta_0 = 3 - 2.5 = $ **0.5**.` },
    { lec: 4, type: 'int', diff: 'E', q: 'Inverting XᵀX costs about p³ operations. Roughly how many for p = 50?', answer: 125000, tol: 0, round: 'Exact', verify: '50**3',
      sol: '50³ = **125,000**. Doubling p multiplies the cost by 8.' },
    /* ---------------- L5 BGD */
    { lec: 5, type: 'int', diff: 'M', q: 'BGD, MSE with ∇L = (2/m)Xᵀ(Xθ − y). Data (1, 2), (2, 4); θ = (0, 0); α = 0.1. θ₁ after one update?', answer: 1, tol: 0.001, round: '2 decimals', verify: 'import numpy as np; X=np.array([[1,1],[1,2.]]); y=np.array([2,4.]); th=np.zeros(2); (th-0.1*(2/2)*X.T@(X@th-y))[1]',
      sol: R`Residuals $X\theta - y = (-2, -4)$. $\partial L/\partial\theta_1 = \frac{2}{2}\left[(-2)(1) + (-4)(2)\right] = -10$. $\theta_1 = 0 - 0.1 \times (-10) = $ **1.0**. (θ₀: gradient −6 → 0.6.)` },
    { lec: 5, type: 'int', diff: 'M', q: 'Course-lab BGD for y = w·x (no bias): x = [1, 2, 3], y = [2, 4, 6], w = 0, learning rate 0.01, dw = mean(2(w·xᵢ − yᵢ)xᵢ). w after one epoch (4 decimals)?', answer: 0.1867, tol: 0.0001, round: '4 decimals', verify: 'import numpy as np; x=np.array([1,2,3.]); y=2*x; -0.01*np.mean(2*(0*x-y)*x)',
      sol: 'Gradient terms: 2(0 − 2)(1) = −4, 2(0 − 4)(2) = −16, 2(0 − 6)(3) = −36. Mean = −56/3 = −18.667. w = 0 − 0.01 × (−18.667) = **0.1867**.' },
    { lec: 5, type: 'int', diff: 'E', q: 'm = 5,000 rows, 40 epochs of Batch GD. How many parameter updates in total?', answer: 40, tol: 0, round: 'Exact', verify: '40',
      sol: 'Batch GD makes **one** update per epoch, so 40 updates (each one reads all 5,000 rows).' },
    /* ---------------- L6 SGD / mini-batch */
    { lec: 6, type: 'int', diff: 'E', q: 'm = 1,050 rows, mini-batch size b = 100. Parameter updates per epoch?', answer: 11, tol: 0, round: 'Exact', verify: 'import math; math.ceil(1050/100)',
      sol: '⌈1050/100⌉ = ⌈10.5⌉ = **11** (ten full batches + one batch of 50).' },
    { lec: 6, type: 'int', diff: 'E', q: 'SGD on m = 200 rows for 5 epochs. Total updates?', answer: 1000, tol: 0, round: 'Exact', verify: '200*5',
      sol: 'SGD updates once per sample: 200 × 5 = **1000**.' },
    { lec: 6, type: 'int', diff: 'M', q: 'SGD with ∂Jᵢ/∂θ₀ = eᵢ and ∂Jᵢ/∂θ₁ = eᵢxᵢ, where eᵢ = ŷᵢ − yᵢ. θ = (0, 0), α = 0.05, sample (x, y) = (2, 5). θ₁ after this update?', answer: 0.5, tol: 0.001, round: '2 decimals', verify: 'e=0-5; 0-0.05*e*2',
      sol: 'ŷ = 0, e = 0 − 5 = −5. θ₀ = 0 − 0.05(−5) = 0.25; θ₁ = 0 − 0.05(−5)(2) = **0.5**.' },
    { lec: 6, type: 'int', diff: 'H', q: 'Mini-batch GD (gradient = batch mean of e and e·x, e = ŷ − y). θ = (0, 0), α = 0.1, batch {(1, 2), (3, 6)}. θ₁ after the update?', answer: 1, tol: 0.001, round: '2 decimals', verify: 'import numpy as np; x=np.array([1,3.]); y=np.array([2,6.]); e=0*x-y; -0.1*np.mean(e*x)',
      sol: 'e = (−2, −6). Mean of e·x = (−2 − 18)/2 = −10. θ₁ = 0 − 0.1(−10) = **1.0** (θ₀: mean e = −4 → 0.4).' },
    /* ---------------- L7 metrics */
    { lec: 7, type: 'int', diff: 'E', q: 'Actual [50, 80, 100], predicted [55, 76, 90]. MAPE in % (2 decimals)?', answer: 8.33, tol: 0.01, round: '2 decimals', verify: '100*(5/50+4/80+10/100)/3',
      sol: 'APE: 5/50 = 10%, 4/80 = 5%, 10/100 = 10%. MAPE = 25/3 = **8.33%**.' },
    { lec: 7, type: 'int', diff: 'E', q: 'Errors [3, −4, 0, 5]. RMSE (3 decimals)?', answer: 3.536, tol: 0.001, round: '3 decimals', verify: '((9+16+0+25)/4)**0.5',
      sol: 'MSE = (9 + 16 + 0 + 25)/4 = 12.5. RMSE = √12.5 = **3.536**.' },
    { lec: 7, type: 'int', diff: 'E', q: 'RSS = 120 and TSS = 480. R²?', answer: 0.75, tol: 0.001, round: '2 decimals', verify: '1-120/480',
      sol: 'R² = 1 − 120/480 = 1 − 0.25 = **0.75**.' },
    { lec: 7, type: 'int', diff: 'M', q: 'n = 30, p = 5, R² = 0.80. Adjusted R² (4 decimals)?', answer: 0.7583, tol: 0.0001, round: '4 decimals', verify: '1-(1-0.8)*29/24',
      sol: R`$1 - (1 - 0.80)\frac{30 - 1}{30 - 5 - 1} = 1 - 0.2 \times \frac{29}{24} = 1 - 0.24167 = $ **0.7583**.` },
    { lec: 7, type: 'int', diff: 'M', q: 'TP = 40, FP = 10, FN = 40. F1 score (4 decimals)?', answer: 0.6154, tol: 0.0001, round: '4 decimals', verify: 'p=40/50; r=40/80; 2*p*r/(p+r)',
      sol: 'Precision = 40/50 = 0.8, recall = 40/80 = 0.5. F1 = 2(0.8)(0.5)/(1.3) = **0.6154**. (Shortcut: 2TP/(2TP + FP + FN) = 80/130.)' },
    { lec: 7, type: 'int', diff: 'M', q: 'Class F1 scores 0.9, 0.6, 0.3 with supports 50, 30, 20. **Weighted** F1?', answer: 0.69, tol: 0.001, round: '2 decimals', verify: '(0.9*50+0.6*30+0.3*20)/100',
      sol: '(0.9 × 50 + 0.6 × 30 + 0.3 × 20)/100 = (45 + 18 + 6)/100 = **0.69**. Macro F1 would be (0.9 + 0.6 + 0.3)/3 = 0.60.' },
    { lec: 7, type: 'int', diff: 'H', q: 'Precision 0.5, recall 0.8. F₂ score (4 decimals)?', answer: 0.7143, tol: 0.0001, round: '4 decimals', verify: 'p=0.5; r=0.8; 5*p*r/(4*p+r)',
      sol: R`$F_\beta = \frac{(1+\beta^2)PR}{\beta^2P + R} = \frac{5(0.5)(0.8)}{4(0.5) + 0.8} = \frac{2}{2.8} = $ **0.7143**. β = 2 weights recall more, so F₂ sits closer to R.` },
    { lec: 7, type: 'int', diff: 'M', q: 'Binary confusion matrix: TN = 50, FP = 10, FN = 5, TP = 35. Specificity (4 decimals)?', answer: 0.8333, tol: 0.0001, round: '4 decimals', verify: '50/60',
      sol: 'Specificity = TN/(TN + FP) = 50/60 = **0.8333**.' },
    /* ---------------- L8 polynomial / assumptions */
    { lec: 8, type: 'int', diff: 'E', q: 'One feature x, polynomial degree 4, with intercept. How many columns in the design matrix?', answer: 5, tol: 0, round: 'Exact', verify: '4+1',
      sol: '1, x, x², x³, x⁴ → **5** columns (degree n → n + 1).' },
    { lec: 8, type: 'int', diff: 'M', q: '`PolynomialFeatures(degree=2)` on two inputs (x₁, x₂). How many output columns (bias included)?', answer: 6, tol: 0, round: 'Exact', verify: 'from math import comb; comb(2+2,2)',
      sol: '1, x₁, x₂, x₁², x₁x₂, x₂² → **6** = C(p + d, d) = C(4, 2).' },
    { lec: 8, type: 'int', diff: 'E', q: 'Regressing feature xⱼ on the other features gives R²ⱼ = 0.9. VIF of xⱼ?', answer: 10, tol: 0.001, round: 'Exact', verify: '1/(1-0.9)',
      sol: 'VIF = 1/(1 − R²ⱼ) = 1/0.1 = **10** — the usual "serious multicollinearity" threshold.' },
    { lec: 8, type: 'int', diff: 'H', q: 'Residuals in time order: [1, −1, 1, −1]. Durbin–Watson statistic?', answer: 3, tol: 0.001, round: 'Exact', verify: 'e=[1,-1,1,-1]; sum((e[i]-e[i-1])**2 for i in range(1,4))/sum(v*v for v in e)',
      sol: 'Σ(eₜ − eₜ₋₁)² = 4 + 4 + 4 = 12; Σeₜ² = 4. DW = 12/4 = **3** (> 2: negative autocorrelation; ≈ 2 means none).' },
    /* ---------------- L9 bias-variance */
    { lec: 9, type: 'int', diff: 'E', q: 'At a point, f(x) = 10, E[f̂(x)] = 7, Var(f̂(x)) = 4, σ² = 1. Expected MSE?', answer: 14, tol: 0, round: 'Exact', verify: '(7-10)**2+4+1',
      sol: 'Bias = 7 − 10 = −3, Bias² = 9. MSE = 9 + 4 + 1 = **14**. Bias² dominates → the model underfits here.' },
    { lec: 9, type: 'int', diff: 'E', q: '5-fold cross-validation on 1,000 rows. How many rows does each fold model train on?', answer: 800, tol: 0, round: 'Exact', verify: '1000*4/5',
      sol: 'Each fold trains on k − 1 = 4 folds: 4 × 200 = **800**, and validates on 200.' },
    { lec: 9, type: 'int', diff: 'M', q: 'Three models fitted on three samples predict 9, 11, 13 at x₀; the true f(x₀) = 10. Variance of the predictions (population, ÷3)?', answer: 2.667, tol: 0.002, round: '3 decimals', verify: 'import numpy as np; np.var([9,11,13])',
      sol: 'Mean = 11 (so Bias = +1). Variance = ((−2)² + 0² + 2²)/3 = 8/3 = **2.667**.' },
    /* ---------------- L10 feature selection */
    { lec: 10, type: 'int', diff: 'E', q: 'Exhaustive search over p = 12 features (non-empty subsets). How many models?', answer: 4095, tol: 0, round: 'Exact', verify: '2**12-1',
      sol: '2¹² − 1 = **4095**.' },
    { lec: 10, type: 'int', diff: 'M', q: 'Forward selection run to the end on p = 10 features. Total models trained?', answer: 55, tol: 0, round: 'Exact', verify: '10*11//2',
      sol: '10 + 9 + … + 1 = p(p + 1)/2 = **55**, versus 1023 for exhaustive search.' },
    { lec: 10, type: 'int', diff: 'E', q: 'A binary feature is 1 in 10% of rows. Its variance q(1 − q)?', answer: 0.09, tol: 0.0001, round: '2 decimals', verify: '0.1*0.9',
      sol: '0.1 × 0.9 = **0.09**. A variance threshold of 0.1 would drop it.' },
    { lec: 10, type: 'int', diff: 'M', q: 'x = [1, 2, 3], y = [2, 4, 7]. Pearson r (4 decimals)?', answer: 0.9934, tol: 0.0001, round: '4 decimals', verify: 'import numpy as np; np.corrcoef([1,2,3],[2,4,7])[0,1]',
      sol: R`$\bar x = 2$, $\bar y = 13/3$. $S_{xy} = (-1)(-7/3) + 0 + (1)(8/3) = 5$, $S_{xx} = 2$, $S_{yy} = (49 + 1 + 64)/9 = 12.667$. $r = 5/\sqrt{2 \times 12.667} = $ **0.9934**.` },
    { lec: 10, type: 'int', diff: 'E', q: 'Each of p = 6 features is cut into b = 10 bins. How many grid cells?', answer: 1000000, tol: 0, round: 'Exact', verify: '10**6',
      sol: 'bᵖ = 10⁶ = **1,000,000** cells — most stay empty with realistic n (curse of dimensionality). (The course lab quiz trap: it is bᵖ, not p × b.)' },
    /* ---------------- L11 PCA */
    { lec: 11, type: 'int', diff: 'E', q: 'PCA eigenvalues 5, 3, 1.5, 0.5. Cumulative explained variance of the first two PCs, in %?', answer: 80, tol: 0.01, round: 'Exact', verify: '100*(5+3)/10',
      sol: '(5 + 3)/(5 + 3 + 1.5 + 0.5) = 8/10 = **80%**.' },
    { lec: 11, type: 'int', diff: 'M', q: 'Largest eigenvalue of S = [[3, 1], [1, 3]]?', answer: 4, tol: 0.001, round: 'Exact', verify: 'import numpy as np; max(np.linalg.eigvalsh([[3,1],[1,3]]))',
      sol: R`$|S - \lambda I| = (3 - \lambda)^2 - 1 = 0 \Rightarrow \lambda = 3 \pm 1$, so **4** (eigenvector $(1,1)/\sqrt2$) and 2.` },
    { lec: 11, type: 'int', diff: 'E', q: 'Unit direction u = (0.6, 0.8), centred point x = (2, 1). Projection score z = uᵀx?', answer: 2, tol: 0.001, round: '2 decimals', verify: '0.6*2+0.8*1',
      sol: '0.6 × 2 + 0.8 × 1 = 1.2 + 0.8 = **2.0**.' },
    { lec: 11, type: 'int', diff: 'M', q: 'x = [1, 2, 3, 4], y = [2, 4, 5, 9]. Sample covariance (divide by n − 1, 3 decimals)?', answer: 3.667, tol: 0.001, round: '3 decimals', verify: 'import numpy as np; np.cov([1,2,3,4],[2,4,5,9])[0,1]',
      sol: 'x̄ = 2.5, ȳ = 5. Σ(x − x̄)(y − ȳ) = (−1.5)(−3) + (−0.5)(−1) + (0.5)(0) + (1.5)(4) = 4.5 + 0.5 + 0 + 6 = 11. Divide by n − 1 = 3: **3.667**. (`np.cov` divides by n − 1 by default.)' },
    { lec: 11, type: 'int', diff: 'M', q: 'A dataset with 4 standardized features. PCA eigenvalues sum to what?', answer: 4, tol: 0.001, round: 'Exact', verify: '4',
      sol: 'Standardized features each have variance 1, and the eigenvalues sum to the trace of the correlation matrix = **4**.' },
    /* ---------------- L12 regularization */
    { lec: 12, type: 'int', diff: 'E', q: 'Ridge slope: Sxy = 60, Sxx = 20, λ = 10. m_ridge?', answer: 2, tol: 0.001, round: '2 decimals', verify: '60/(20+10)',
      sol: 'm = Sxy/(Sxx + λ) = 60/30 = **2** (OLS would give 3).' },
    { lec: 12, type: 'int', diff: 'M', q: 'Worksheet Lasso slope m = (Sxy − λ)/Sxx for m > 0. Sxy = 60, Sxx = 20, λ = 80. Final m?', answer: 0, tol: 0, round: 'Exact', verify: 'max(0,(60-80)/20)',
      sol: 'Formula gives (60 − 80)/20 = −1 < 0, which breaks the m > 0 assumption → the coefficient is clipped to **0**.' },
    { lec: 12, type: 'int', diff: 'M', q: 'Ridge, one feature, no intercept: x = [1, 2], y = [2, 3], λ = 1. w = (xᵀx + λ)⁻¹xᵀy (4 decimals)?', answer: 1.3333, tol: 0.0001, round: '4 decimals', verify: '(1*2+2*3)/(1+4+1)',
      sol: 'xᵀx = 5, xᵀy = 8. w = 8/(5 + 1) = **1.3333** (OLS: 8/5 = 1.6).' },
    /* ---------------- L13 time series */
    { lec: 13, type: 'int', diff: 'E', q: 'Series [10, 13, 15, 20]. Second-order difference at the last time step?', answer: 3, tol: 0, round: 'Exact', verify: '(20-15)-(15-13)',
      sol: 'First differences: 3, 2, 5. Second difference at t = 4: 5 − 2 = **3**.' },
    { lec: 13, type: 'int', diff: 'E', q: 'AR(1): yₜ = 2 + 0.6·yₜ₋₁ + εₜ. If yₜ₋₁ = 10, the point forecast for yₜ?', answer: 8, tol: 0.001, round: 'Exact', verify: '2+0.6*10',
      sol: '2 + 0.6 × 10 = **8** (the forecast sets εₜ = 0).' },
    { lec: 13, type: 'int', diff: 'M', q: 'Series [1, 2, 3, 4, 5]. Lag-1 sample ACF (worksheet formula, denominator Σ(yₜ − ȳ)²)?', answer: 0.4, tol: 0.001, round: '2 decimals', verify: 'y=[1,2,3,4,5]; m=3; sum((y[t]-m)*(y[t-1]-m) for t in range(1,5))/sum((v-m)**2 for v in y)',
      sol: 'ȳ = 3; deviations −2, −1, 0, 1, 2; Σ dev² = 10. Lag-1 products: (−1)(−2) + (0)(−1) + (1)(0) + (2)(1) = 4. ρ₁ = 4/10 = **0.4**.' },
    { lec: 13, type: 'int', diff: 'M', q: 'MA(1): yₜ = 50 + εₜ + 0.5·εₜ₋₁. With εₜ = 2 and εₜ₋₁ = −4, yₜ = ?', answer: 50, tol: 0.001, round: 'Exact', verify: '50+2+0.5*(-4)',
      sol: '50 + 2 + 0.5 × (−4) = 50 + 2 − 2 = **50**.' },
    /* ---------------- L14 MLE / logistic */
    { lec: 14, type: 'int', diff: 'M', q: '7 heads in 10 tosses. Likelihood C(10,7)p⁷(1 − p)³ at p = 0.7 (4 decimals)?', answer: 0.2668, tol: 0.0001, round: '4 decimals', verify: 'from math import comb; comb(10,7)*0.7**7*0.3**3',
      sol: '120 × 0.7⁷ × 0.3³ = 120 × 0.08235 × 0.027 = **0.2668** — the largest value over all p, because p̂ = 7/10.' },
    { lec: 14, type: 'int', diff: 'E', q: '13 successes in 20 Bernoulli trials. MLE p̂?', answer: 0.65, tol: 0.001, round: '2 decimals', verify: '13/20',
      sol: 'p̂ = k/n = 13/20 = **0.65**.' },
    { lec: 14, type: 'int', diff: 'E', q: 'σ(1.2) to 4 decimals?', answer: 0.7685, tol: 0.0001, round: '4 decimals', verify: 'import math; 1/(1+math.exp(-1.2))',
      sol: R`$1/(1 + e^{-1.2}) = 1/(1 + 0.3012) = $ **0.7685**.` },
    { lec: 14, type: 'int', diff: 'M', q: 'Labels y = [1, 0], predicted probabilities p̂ = [0.8, 0.3]. Mean BCE (natural log, 4 decimals)?', answer: 0.2899, tol: 0.0001, round: '4 decimals', verify: 'import math; (-math.log(0.8)-math.log(0.7))/2',
      sol: 'Row 1: −ln 0.8 = 0.2231. Row 2 (y = 0): −ln(1 − 0.3) = −ln 0.7 = 0.3567. Mean = 0.5798/2 = **0.2899**.' },
    { lec: 14, type: 'int', diff: 'M', q: 'z = −1 + 0.5x₁ + 0.25x₂ at x = (2, 4). P(y = 1) (4 decimals)?', answer: 0.7311, tol: 0.0001, round: '4 decimals', verify: 'import math; 1/(1+math.exp(-(-1+0.5*2+0.25*4)))',
      sol: 'z = −1 + 1 + 1 = 1, σ(1) = **0.7311** → class 1 at threshold 0.5.' },
    /* ---------------- L15 GD logistic / multiclass */
    { lec: 15, type: 'int', diff: 'M', q: 'Logistic GD, one row x = (1, 2) (1 = bias), y = 1, β = (0, 0), α = 0.1, gradient (p̂ − y)x. New β₁?', answer: 0.1, tol: 0.001, round: '2 decimals', verify: 'p=0.5; 0-0.1*(p-1)*2',
      sol: 'z = 0 → p̂ = 0.5. Gradient = (0.5 − 1)(1, 2) = (−0.5, −1). β = (0, 0) − 0.1(−0.5, −1) = (0.05, **0.1**).' },
    { lec: 15, type: 'int', diff: 'M', q: 'Softmax of logits (1, 0, −1). Probability of the first class (4 decimals)?', answer: 0.6652, tol: 0.0001, round: '4 decimals', verify: 'import math; math.e/(math.e+1+math.exp(-1))',
      sol: R`$e^1 = 2.7183$, $e^0 = 1$, $e^{-1} = 0.3679$; sum 4.0862. $\hat p_1 = 2.7183/4.0862 = $ **0.6652**. (Same as (2, 1, 0): adding a constant to every logit changes nothing.)` },
    { lec: 15, type: 'int', diff: 'E', q: 'p = 0.8. Log-odds ln(p/(1 − p)) (4 decimals)?', answer: 1.3863, tol: 0.0001, round: '4 decimals', verify: 'import math; math.log(4)',
      sol: 'Odds = 0.8/0.2 = 4; ln 4 = **1.3863**. This equals z, the linear score.' },
    { lec: 15, type: 'int', diff: 'E', q: 'One-vs-Rest logistic regression, K = 4 classes, d = 5 features. Total parameters (with intercepts)?', answer: 24, tol: 0, round: 'Exact', verify: '4*(5+1)',
      sol: 'K(d + 1) = 4 × 6 = **24**.' },
    { lec: 15, type: 'int', diff: 'E', q: 'Predicted p̂ = (0.7, 0.2, 0.1); the true class is the third. Cross-entropy (4 decimals)?', answer: 2.3026, tol: 0.0001, round: '4 decimals', verify: 'import math; -math.log(0.1)',
      sol: 'Only the true class counts: −ln 0.1 = **2.3026**.' }
  ];

  const C = [
    /* ================= predict the output ================= */
    { lec: 1, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.preprocessing import MinMaxScaler
X = np.array([[10], [20], [40]])
print(MinMaxScaler().fit_transform(X).ravel().round(3).tolist())`, answer: '[0.0, 0.333, 1.0]',
      sol: '(x − 10)/(40 − 10): 0, 10/30 = 0.333, 1.' },
    { lec: 1, type: 'out', diff: 'M', q: 'Predict the exact output. (Which standard deviation does `StandardScaler` use?)', code: R`import numpy as np
from sklearn.preprocessing import StandardScaler
X = np.array([[2.0], [4.0], [6.0]])
print(StandardScaler().fit_transform(X).ravel().round(3).tolist())`, answer: '[-1.225, 0.0, 1.225]',
      sol: 'Mean 4. `StandardScaler` uses the **population** std (divide by n): √(8/3) = 1.633. (2 − 4)/1.633 = −1.225. With the sample std (n − 1) you would get −1.0 — a classic trap.' },
    { lec: 1, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import pandas as pd
df = pd.DataFrame({'city': ['Pune', 'Delhi', 'Pune', 'Agra']})
print(list(pd.get_dummies(df, columns=['city']).columns))`, answer: "['city_Agra', 'city_Delhi', 'city_Pune']",
      sol: 'One column per category, named prefix_value, in **sorted** order.' },
    { lec: 1, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import pandas as pd
s = pd.Series([2, None, 4, None, 9])
print(s.fillna(s.mean()).tolist())`, answer: '[2.0, 5.0, 4.0, 5.0, 9.0]',
      sol: '`mean()` skips NaN: (2 + 4 + 9)/3 = 5. The column becomes float.' },
    { lec: 1, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import pandas as pd
df = pd.DataFrame({'name': ['A', 'B', 'A', 'C', 'B'], 'age': [20, 30, 20, 40, 31]})
print(df.duplicated().sum(), len(df.drop_duplicates()))`, answer: '1 4',
      sol: 'Only row 2 repeats an earlier row in **every** column (A, 20). B/31 differs from B/30. So 1 duplicate, 4 rows remain.' },
    { lec: 2, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.model_selection import train_test_split
X = np.arange(40).reshape(20, 2)
X_tr, X_te = train_test_split(X, test_size=0.25, random_state=0)
print(X_tr.shape, X_te.shape)`, answer: '(15, 2) (5, 2)',
      sol: '25% of 20 rows = 5 test rows; columns are unchanged.' },
    { lec: 3, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import numpy as np
m, c = np.polyfit([1, 2, 3, 4], [3, 5, 4, 8], 1)
print(round(m, 2), round(c, 2))`, answer: '1.4 1.5',
      sol: 'Degree-1 `polyfit` is OLS: m = Sxy/Sxx = 7/5, c = ȳ − m x̄ = 5 − 3.5. Coefficients come highest power first.' },
    { lec: 4, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import numpy as np
X = np.ones((50, 3))
Xb = np.c_[np.ones(50), X]
print(Xb.shape, (Xb.T @ Xb).shape)`, answer: '(50, 4) (4, 4)',
      sol: 'Adding the bias column gives n × (p + 1); XᵀX is (p + 1) × (p + 1).' },
    { lec: 4, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[1, 2, 4], [1, 3, 6], [1, 5, 10], [1, 7, 14]])
print(np.linalg.matrix_rank(X.T @ X))`, answer: '2',
      sol: 'Column 3 = 2 × column 2, so only 2 independent columns: XᵀX (3 × 3) has rank 2 and is **singular** — the normal equation cannot be solved.' },
    { lec: 5, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
x = np.array([1.0, 2.0]); y = np.array([2.0, 4.0])
w, lr = 0.0, 0.1
for epoch in range(2):
    dw = np.mean(2 * (w * x - y) * x)
    w = w - lr * dw
print(round(w, 2))`, answer: '1.5',
      sol: 'Epoch 1: terms 2(−2)(1) = −4, 2(−4)(2) = −16, mean −10 → w = 1.0. Epoch 2: errors (−1, −2) → terms −2, −8, mean −5 → w = 1.5.' },
    { lec: 6, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`m, b, epochs = 10, 4, 3
updates = 0
for _ in range(epochs):
    for start in range(0, m, b):
        updates += 1
print(updates)`, answer: '9',
      sol: 'range(0, 10, 4) → starts 0, 4, 8 → 3 batches (the last has 2 rows). 3 epochs × 3 = 9.' },
    { lec: 7, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`from sklearn.metrics import r2_score
print(r2_score([3, 5, 7], [2, 5, 8]))`, answer: '0.75',
      sol: 'RSS = 1 + 0 + 1 = 2, TSS = 4 + 0 + 4 = 8, R² = 1 − 2/8.' },
    { lec: 7, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.metrics import confusion_matrix
tn, fp, fn, tp = confusion_matrix([1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1]).ravel()
print(tn, fp, fn, tp)`, answer: '1 1 1 3',
      sol: 'Pairs (true, pred): (1,1) TP, (0,0) TN, (1,0) FN, (1,1) TP, (0,1) FP, (1,1) TP. sklearn orders `ravel()` as tn, fp, fn, tp.' },
    { lec: 7, type: 'out', diff: 'H', q: 'Predict the exact output.', code: R`from sklearn.metrics import precision_score
y_true = [0, 0, 1, 1, 2, 2]
y_pred = [0, 1, 1, 1, 2, 0]
print(round(precision_score(y_true, y_pred, average='macro'), 3))`, answer: '0.722',
      sol: 'Class 0: predicted at rows 0, 5 → 1 correct → 0.5. Class 1: predicted at rows 1, 2, 3 → 2 correct → 0.667. Class 2: predicted at row 4 → 1/1 = 1. Macro = (0.5 + 0.667 + 1)/3 = 0.722.' },
    { lec: 8, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.preprocessing import PolynomialFeatures
pf = PolynomialFeatures(degree=2).fit(np.zeros((1, 2)))
print(list(pf.get_feature_names_out()))`, answer: "['1', 'x0', 'x1', 'x0^2', 'x0 x1', 'x1^2']",
      sol: 'Bias, the two inputs, then all degree-2 terms including the **interaction** x0·x1: 6 columns.' },
    { lec: 9, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.model_selection import KFold
print([len(test) for _, test in KFold(n_splits=4).split(np.zeros(10))])`, answer: '[3, 3, 2, 2]',
      sol: '10 rows into 4 folds: the first 10 mod 4 = 2 folds get one extra row.' },
    { lec: 10, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.feature_selection import VarianceThreshold
X = np.array([[0, 5, 1], [0, 5, 2], [0, 5, 3], [1, 5, 4]])
print(VarianceThreshold(threshold=0.1).fit(X).get_support().tolist())`, answer: '[True, False, True]',
      sol: 'Variances (population): column 1 = 0.25 × 0.75 = 0.1875 > 0.1 (kept); column 2 = 0 (dropped); column 3 = 1.25 (kept).' },
    { lec: 10, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import numpy as np
x = np.array([-2, -1, 0, 1, 2])
r = np.corrcoef(x, x ** 2)[0, 1]
print(abs(round(r, 3)))`, answer: '0.0',
      sol: 'y = x² depends **perfectly** on x, yet Pearson r = 0: the relationship is not linear. A correlation filter would wrongly drop x.' },
    { lec: 11, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.decomposition import PCA
X = np.array([[1, 2], [2, 4], [3, 6], [4, 8]])
print(PCA().fit(X).explained_variance_ratio_.round(3).tolist())`, answer: '[1.0, 0.0]',
      sol: 'All points lie on the line y = 2x, so PC1 carries 100% of the variance; one dimension is lossless.' },
    { lec: 12, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.linear_model import Ridge
m = Ridge(alpha=1.0, fit_intercept=False).fit([[1], [2]], [2, 3])
print(round(m.coef_[0], 4))`, answer: '1.3333',
      sol: 'w = xᵀy/(xᵀx + λ) = 8/(5 + 1). OLS would give 8/5 = 1.6: Ridge shrinks.' },
    { lec: 12, type: 'out', diff: 'H', q: 'Predict the exact output. (sklearn\'s Lasso minimises (1/2n)‖y − Xw‖² + α‖w‖₁.)', code: R`from sklearn.linear_model import Lasso
X = [[1], [2], [3], [4]]; y = [1, 2, 3, 4]
print(round(Lasso(alpha=0.5).fit(X, y).coef_[0], 3), Lasso(alpha=10).fit(X, y).coef_[0])`, answer: '0.6 0.0',
      sol: 'Centred: Sxy/n = 5/4 = 1.25 and Sxx/n = 1.25. Soft-threshold: w = max(0, 1.25 − α)/1.25. α = 0.5 → 0.75/1.25 = 0.6. α = 10 → **exactly 0** (Lasso\'s numerator subtraction).' },
    { lec: 13, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import pandas as pd
s = pd.Series([10, 13, 15, 20])
print(s.diff().tolist())
print(s.shift(1).tolist())`, answer: '[nan, 3.0, 2.0, 5.0]\n[nan, 10.0, 13.0, 15.0]',
      sol: '`diff()` = yₜ − yₜ₋₁ (the first is undefined), `shift(1)` = lag-1 column.' },
    { lec: 13, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.model_selection import TimeSeriesSplit
print([(len(tr), len(te)) for tr, te in TimeSeriesSplit(n_splits=3).split(np.zeros(8))])`, answer: '[(2, 2), (4, 2), (6, 2)]',
      sol: 'Test size = 8 // (3 + 1) = 2. The training window **grows** and always ends before the test block — no future data leaks.' },
    { lec: 14, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`from sklearn.metrics import log_loss
print(round(log_loss([1, 0], [0.8, 0.3]), 4))`, answer: '0.2899',
      sol: 'The mean of −ln 0.8 and −ln 0.7.' },
    { lec: 14, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import numpy as np
z = np.array([-2, 0, 2])
print((1 / (1 + np.exp(-z))).round(3).tolist())`, answer: '[0.119, 0.5, 0.881]',
      sol: 'σ(0) = 0.5 and σ(−z) = 1 − σ(z), so 0.119 + 0.881 = 1.' },
    { lec: 15, type: 'out', diff: 'E', q: 'Predict the exact output.', code: R`import numpy as np
z = np.array([2.0, 1.0, 0.0])
p = np.exp(z) / np.exp(z).sum()
print(p.round(3).tolist(), round(p.sum(), 3))`, answer: '[0.665, 0.245, 0.09] 1.0',
      sol: 'The worksheet softmax table; probabilities sum to 1.' },
    { lec: 15, type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.linear_model import LogisticRegression
X = np.array([[0], [1], [2], [3], [4], [5]]); y = [0, 0, 1, 1, 2, 2]
m = LogisticRegression().fit(X, y)
print(m.coef_.shape, m.predict_proba(X).shape)`, answer: '(3, 1) (6, 3)',
      sol: 'With 3 classes there is one weight row per class (K × d = 3 × 1) and one probability per class for each of the 6 rows.' },

    /* ================= find the bug ================= */
    { lec: 5, type: 'bug', diff: 'M', q: 'This Batch GD for ŷ = θ₀ + θ₁x should update both parameters **simultaneously**. Which line breaks that?', code: R`for _ in range(epochs):
    pred = theta0 + theta1 * x                          # line 2
    theta0 = theta0 - lr * np.mean(pred - y)            # line 3
    pred = theta0 + theta1 * x                          # line 4
    theta1 = theta1 - lr * np.mean((pred - y) * x)      # line 5`,
      options: ['Line 2', 'Line 3', 'Line 4', 'Line 5'], answer: 2,
      sol: 'Line 4 recomputes the predictions with the **new** θ₀, so θ₁ is updated from a different point than θ₀. Delete it (or compute both gradients first, then update both).',
      why: ['Needed: predictions from the old θ.', 'Correct update for θ₀.', 'Correct — this makes the update sequential.', 'Fine once line 4 is gone.'],
      fixed: R`import numpy as np
x = np.array([1.0, 2.0, 3.0]); y = np.array([2.0, 4.0, 6.0])
theta0 = theta1 = 0.0; lr = 0.1
for _ in range(1):
    pred = theta0 + theta1 * x
    g0, g1 = np.mean(pred - y), np.mean((pred - y) * x)
    theta0, theta1 = theta0 - lr * g0, theta1 - lr * g1
assert abs(theta0 - 0.4) < 1e-9 and abs(theta1 - 28 / 30) < 1e-9
print(round(theta0, 3), round(theta1, 3))` },
    { lec: 6, type: 'bug', diff: 'M', q: 'This is meant to be **SGD**, but it behaves exactly like Batch GD. Which line is wrong?', code: R`for epoch in range(epochs):
    np.random.shuffle(idx)                     # line 2
    grad = 0.0                                 # line 3
    for i in idx:
        grad += 2 * (w * X[i] - Y[i]) * X[i]   # line 5
    w = w - lr * grad / len(idx)               # line 6`,
      options: ['Line 2 — shuffling is not allowed in SGD', 'Line 3', 'Line 5', 'Line 6 — the update must happen inside the loop, once per sample'], answer: 3,
      sol: 'Accumulating gradients over all samples and updating once after the loop **is** Batch GD (a course-quiz question). SGD updates w immediately for each sample: `w = w - lr * 2 * (w * X[i] - Y[i]) * X[i]` inside the loop.',
      why: ['Shuffling every epoch is required in SGD.', 'Harmless once the update is moved.', 'The per-sample gradient itself is right.', 'Correct.'],
      fixed: R`import numpy as np
X = np.array([1.0, 2.0, 3.0]); Y = np.array([2.0, 4.0, 6.0])
w, lr, idx = 0.0, 0.01, np.arange(3)
np.random.seed(42)
for epoch in range(100):
    np.random.shuffle(idx)
    for i in idx:
        w = w - lr * 2 * (w * X[i] - Y[i]) * X[i]
assert abs(w - 2) < 1e-6
print(round(w, 2))` },
    { lec: 7, type: 'bug', diff: 'E', q: 'Which line makes this MAPE wrong?', code: R`def mape(y_true, y_pred):
    total = 0                                          # line 2
    for a, p in zip(y_true, y_pred):                   # line 3
        total += abs(a - p) / abs(p) * 100             # line 4
    return total / len(y_true)                         # line 5`,
      options: ['Line 2', 'Line 3', 'Line 4 — divide by the actual value, not the prediction', 'Line 5'], answer: 2,
      sol: 'APEᵢ = |yᵢ − ŷᵢ| / |yᵢ| × 100. Dividing by ŷ is a different (and asymmetric) metric.',
      why: ['Fine.', 'Fine.', 'Correct.', 'Fine (if no actual is 0).'],
      fixed: R`def mape(y_true, y_pred):
    total = 0
    for a, p in zip(y_true, y_pred):
        total += abs(a - p) / abs(a) * 100
    return total / len(y_true)
assert round(mape([40, 50, 60, 70, 80], [45, 52, 58, 72, 78]), 2) == 5.04
print(round(mape([40, 50, 60, 70, 80], [45, 52, 58, 72, 78]), 2))` },
    { lec: 7, type: 'bug', diff: 'M', q: 'Which line makes this R² wrong?', code: R`def r2(y, yhat):
    n = len(y)
    mean = sum(yhat) / n                               # line 3
    rss = sum((a - b) ** 2 for a, b in zip(y, yhat))   # line 4
    tss = sum((a - mean) ** 2 for a in y)              # line 5
    return 1 - rss / tss                               # line 6`,
      options: ['Line 3 — the baseline is the mean of the **actual** values', 'Line 4', 'Line 5', 'Line 6'], answer: 0,
      sol: 'TSS measures spread around ȳ, the mean of the actual values (the mean-only baseline model). Using the mean of the predictions changes the baseline.',
      why: ['Correct.', 'RSS is right.', 'Right once the mean is right.', 'Right.'],
      fixed: R`def r2(y, yhat):
    n = len(y)
    mean = sum(y) / n
    rss = sum((a - b) ** 2 for a, b in zip(y, yhat))
    tss = sum((a - mean) ** 2 for a in y)
    return 1 - rss / tss
assert r2([3, 5, 7], [2, 5, 8]) == 0.75
print(r2([3, 5, 7], [2, 5, 8]))` },
    { lec: 7, type: 'bug', diff: 'M', q: 'Adjusted R² for n rows and p features. Which line is wrong?', code: R`def adj_r2(r2, n, p):
    if n - p - 1 <= 0:                                 # line 2
        return None                                    # line 3
    return 1 - (1 - r2) * (n - 1) / (n - p)            # line 4`,
      options: ['Line 2', 'Line 3', 'Line 4 — the denominator is n − p − 1', 'Nothing is wrong'], answer: 2,
      sol: 'R²adj = 1 − (1 − R²)(n − 1)/(n − p − 1). The −1 accounts for the intercept.',
      why: ['The guard is right.', 'Right (the lab returns None).', 'Correct.', 'Line 4 is wrong.'],
      fixed: R`def adj_r2(r2, n, p):
    if n - p - 1 <= 0:
        return None
    return 1 - (1 - r2) * (n - 1) / (n - p - 1)
assert round(adj_r2(0.85, 50, 4), 4) == 0.8367
print(round(adj_r2(0.85, 50, 4), 4))` },
    { lec: 2, type: 'bug', diff: 'M', q: 'Which line causes **data leakage**?', code: R`scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)                                  # line 2
X_tr, X_te, y_tr, y_te = train_test_split(X_scaled, y, test_size=0.2)  # line 3
model = LinearRegression().fit(X_tr, y_tr)                          # line 4
print(model.score(X_te, y_te))                                      # line 5`,
      options: ['Line 2 — the scaler sees the test rows before the split', 'Line 3', 'Line 4', 'Line 5'], answer: 0,
      sol: 'Split first, then `scaler.fit(X_tr)` and `transform` both sets. Otherwise the test set\'s mean and std influence training.',
      why: ['Correct.', 'Splitting is fine, but too late.', 'Fine.', 'Fine.'],
      fixed: R`import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
X = np.arange(20, dtype=float).reshape(10, 2); y = X[:, 0] * 2
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)
scaler = StandardScaler().fit(X_tr)
X_tr_s, X_te_s = scaler.transform(X_tr), scaler.transform(X_te)
assert np.allclose(X_tr_s.mean(axis=0), 0)
print(X_tr_s.shape, X_te_s.shape)` },
    { lec: 11, type: 'bug', diff: 'M', q: 'PCA from scratch. Which line is wrong?', code: R`Xc = X - X.mean(axis=0)                     # line 1
S = Xc.T @ Xc / (len(X) - 1)                # line 2
vals, vecs = np.linalg.eigh(S)              # line 3
W = vecs[:, :k]                             # line 4
Z = Xc @ W                                  # line 5`,
      options: ['Line 1', 'Line 2', 'Line 4 — `eigh` returns eigenvalues in ascending order, so this keeps the smallest', 'Line 5'], answer: 2,
      sol: 'Sort descending first: `order = np.argsort(vals)[::-1]; W = vecs[:, order[:k]]`.',
      why: ['Centering is right.', 'Covariance is right.', 'Correct.', 'Projection is right.'],
      fixed: R`import numpy as np
X = np.array([[1.0, 2.1], [2.0, 3.9], [3.0, 6.2], [4.0, 7.8]]); k = 1
Xc = X - X.mean(axis=0)
S = Xc.T @ Xc / (len(X) - 1)
vals, vecs = np.linalg.eigh(S)
order = np.argsort(vals)[::-1]
W = vecs[:, order[:k]]
Z = Xc @ W
assert np.isclose(Z.var(ddof=1), vals.max())
print(round(float(Z.var(ddof=1)), 3))` },
    { lec: 14, type: 'bug', diff: 'M', q: 'This BCE returns `nan` when a prediction is exactly 0 or 1. Which line needs fixing?', code: R`def bce(y, p):
    y, p = np.array(y, float), np.array(p, float)          # line 2
    loss = -(y * np.log(p) + (1 - y) * np.log(1 - p))      # line 3
    return loss.mean()                                     # line 4`,
      options: ['Line 2 — clip p into [ε, 1 − ε] before taking logs', 'Line 3 — swap y and 1 − y', 'Line 4 — use sum instead of mean', 'Nothing; nan is correct'], answer: 0,
      sol: '`p = np.clip(p, 1e-15, 1 - 1e-15)`. With p = 1 and y = 1, the second term is 0 × log 0 = 0 × (−∞) = nan. Libraries clip for this reason.',
      why: ['Correct.', 'The formula is right.', 'Mean is the usual definition.', 'nan breaks training.'],
      fixed: R`import numpy as np
def bce(y, p):
    y, p = np.array(y, float), np.clip(np.array(p, float), 1e-15, 1 - 1e-15)
    loss = -(y * np.log(p) + (1 - y) * np.log(1 - p))
    return loss.mean()
assert np.isfinite(bce([1, 0], [1.0, 0.0]))
assert round(bce([1, 0], [0.8, 0.3]), 4) == 0.2899
print(round(bce([1, 0], [0.8, 0.3]), 4))` },
    { lec: 15, type: 'bug', diff: 'H', q: '`softmax(np.array([1000., 999., 998.]))` returns `[nan, nan, nan]`. Which fix is right?', code: R`def softmax(z):
    e = np.exp(z)            # line 2
    return e / e.sum()       # line 3`,
      options: ['Use `np.exp(z - z.max())` on line 2', 'Divide by `len(z)` on line 3', 'Use `np.log` instead of `np.exp`', 'Use `abs(z)`'], answer: 0,
      sol: 'e¹⁰⁰⁰ overflows to inf, and inf/inf = nan. Subtracting the max is allowed because softmax is unchanged when the same constant is added to every logit (worksheet shift property). Result: (0.665, 0.245, 0.090).',
      why: ['Correct.', 'That is not softmax.', 'Wrong function.', 'Changes the answer.'],
      fixed: R`import numpy as np
def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()
p = softmax(np.array([1000.0, 999.0, 998.0]))
assert np.allclose(p, softmax(np.array([2.0, 1.0, 0.0])))
print(p.round(3).tolist())` },
    { lec: 3, type: 'bug', diff: 'E', q: 'OLS slope. Which line is wrong?', code: R`xb, yb = x.mean(), y.mean()                      # line 1
num = ((x - xb) * (y - yb)).sum()                # line 2
den = ((y - yb) ** 2).sum()                      # line 3
m = num / den; c = yb - m * xb                   # line 4`,
      options: ['Line 1', 'Line 2', 'Line 3 — the denominator is Σ(x − x̄)²', 'Line 4'], answer: 2,
      sol: 'm = Cov(x, y)/Var(x): the denominator uses x only (a course-quiz question asks what this term is NOT).',
      why: ['Fine.', 'Fine.', 'Correct.', 'Fine.'],
      fixed: R`import numpy as np
x = np.array([1, 2, 3, 4.]); y = np.array([3, 5, 4, 8.])
xb, yb = x.mean(), y.mean()
num = ((x - xb) * (y - yb)).sum()
den = ((x - xb) ** 2).sum()
m = num / den; c = yb - m * xb
assert np.isclose(m, 1.4) and np.isclose(c, 1.5)
print(round(m, 2), round(c, 2))` },

    /* ================= fill the missing line ================= */
    { lec: 4, type: 'fill', diff: 'E', q: 'Which line completes the normal-equation solver?', code: R`def fit_beta(X, y):
    Xb = np.c_[np.ones(len(X)), X]
    ______________________________
    return beta`,
      options: ['`beta = np.linalg.inv(Xb.T @ Xb) @ Xb.T @ y`', '`beta = np.linalg.inv(Xb @ Xb.T) @ Xb.T @ y`', '`beta = Xb.T @ y / len(y)`', '`beta = np.linalg.inv(Xb) @ y`'], answer: 0,
      sol: 'β = (XᵀX)⁻¹Xᵀy. XXᵀ is n × n (wrong size), and a non-square X has no inverse.',
      why: ['Correct.', 'Wrong product order.', 'Not OLS.', 'X is not square.'],
      fixed: R`import numpy as np
def fit_beta(X, y):
    Xb = np.c_[np.ones(len(X)), X]
    beta = np.linalg.inv(Xb.T @ Xb) @ Xb.T @ y
    return beta
b = fit_beta(np.array([[0.], [1.], [2.]]), np.array([1., 2., 6.]))
assert np.allclose(b, [0.5, 2.5])
print(b.round(2).tolist())` },
    { lec: 6, type: 'fill', diff: 'M', q: 'Mini-batch GD. Which line fills the gap?', code: R`for epoch in range(epochs):
    np.random.shuffle(order)
    for start in range(0, m, b):
        ______________________________
        w -= lr * np.mean(2 * (w * X[batch] - Y[batch]) * X[batch])`,
      options: ['`batch = order[start:start + b]`', '`batch = order[:b]`', '`batch = order[start]`', '`batch = range(start, m)`'], answer: 0,
      sol: 'Take the next b **shuffled** indices. `order[:b]` would reuse the same first batch every step; `order[start]` is SGD.',
      why: ['Correct.', 'Always the same batch.', 'One sample = SGD.', 'Everything after start.'],
      fixed: R`import numpy as np
X = np.arange(1, 11, dtype=float); Y = 0.5 * X
m, b, lr, w = 10, 2, 0.001, 0.0
order = np.arange(m); np.random.seed(42)
for epoch in range(500):
    np.random.shuffle(order)
    for start in range(0, m, b):
        batch = order[start:start + b]
        w -= lr * np.mean(2 * (w * X[batch] - Y[batch]) * X[batch])
assert round(w, 2) == 0.5
print(round(w, 2))` },
    { lec: 15, type: 'fill', diff: 'M', q: 'Batch GD for logistic regression (X has a bias column). Which line computes the gradient?', code: R`for _ in range(epochs):
    p = 1 / (1 + np.exp(-(X @ beta)))
    ______________________________
    beta = beta - alpha * grad`,
      options: ['`grad = X.T @ (p - y) / len(y)`', '`grad = X.T @ (y - p) / len(y)`', '`grad = (p - y) / (p * (1 - p))`', '`grad = X @ (p - y)`'], answer: 0,
      sol: '∇J = Xᵀ(p̂ − y)/n — the p̂(1 − p̂) factors cancel. With (y − p) the step would go uphill.',
      why: ['Correct.', 'Sign flipped: gradient ascent on the loss.', 'That is ∂L/∂p̂ only.', 'Wrong shape (n, not d).'],
      fixed: R`import numpy as np
X = np.array([[1, 0.5], [1, 1.5], [1, 2.5], [1, 3.5]]); y = np.array([0, 0, 1, 1.])
beta, alpha = np.zeros(2), 0.5
for _ in range(2000):
    p = 1 / (1 + np.exp(-(X @ beta)))
    grad = X.T @ (p - y) / len(y)
    beta = beta - alpha * grad
p = 1 / (1 + np.exp(-(X @ beta)))
assert ((p > 0.5) == (y == 1)).all()
print((p > 0.5).astype(int).tolist())` },
    { lec: 13, type: 'fill', diff: 'H', q: 'Lag-k autocorrelation. Which line computes the numerator?', code: R`def acf(y, k):
    y = np.asarray(y, float); d = y - y.mean()
    ______________________________
    return num / (d ** 2).sum()`,
      options: ['`num = (d[k:] * d[:-k]).sum()`', '`num = (d[k:] * d[k:]).sum()`', '`num = (y[k:] * y[:-k]).sum()`', '`num = d[k] * d[0]`'], answer: 0,
      sol: 'ρₖ = Σₜ (yₜ − ȳ)(yₜ₋ₖ − ȳ) / Σₜ (yₜ − ȳ)². Pair each value with the one k steps earlier, using deviations from the mean.',
      why: ['Correct.', 'No lag.', 'Not centred.', 'Only one pair.'],
      fixed: R`import numpy as np
def acf(y, k):
    y = np.asarray(y, float); d = y - y.mean()
    num = (d[k:] * d[:-k]).sum()
    return num / (d ** 2).sum()
assert np.isclose(acf([1, 2, 3, 4, 5], 1), 0.4)
print(acf([1, 2, 3, 4, 5], 1))` },
    { lec: 10, type: 'fill', diff: 'M', q: 'Variance-threshold filter. Which line keeps the right columns?', code: R`variances = X.var(axis=0)
______________________________
X_kept = X[:, keep]`,
      options: ['`keep = variances > threshold`', '`keep = variances < threshold`', '`keep = X.mean(axis=0) > threshold`', '`keep = np.argmax(variances)`'], answer: 0,
      sol: 'A filter keeps features whose variance **exceeds** the threshold; near-constant columns carry almost no information.',
      why: ['Correct.', 'Keeps the useless columns.', 'The mean is not the criterion.', 'Keeps one column only.'],
      fixed: R`import numpy as np
X = np.array([[0, 5, 1], [0, 5, 2], [0, 5, 3], [1, 5, 4]], float); threshold = 0.1
variances = X.var(axis=0)
keep = variances > threshold
X_kept = X[:, keep]
assert X_kept.shape == (4, 2)
print(keep.tolist())` },

    /* ================= write the function (course-lab style) ================= */
    { lec: 7, type: 'write', diff: 'M', q: 'Course lab "Regression Error Metrics Calculator". Write `regression_metrics(actual, predicted)` returning `(MAE, MSE, RMSE, MAPE)`, each rounded to 2 decimals. MAPE is in % and **skips rows whose actual value is 0**.',
      starter: 'def regression_metrics(actual, predicted):\n    pass\n',
      ref: 'def regression_metrics(actual, predicted):\n    n = len(actual)\n    errs = [a - p for a, p in zip(actual, predicted)]\n    mae = sum(abs(e) for e in errs) / n\n    mse = sum(e * e for e in errs) / n\n    rmse = mse ** 0.5\n    apes = [abs(a - p) / abs(a) * 100 for a, p in zip(actual, predicted) if a != 0]\n    mape = sum(apes) / len(apes) if apes else 0.0\n    return round(mae, 2), round(mse, 2), round(rmse, 2), round(mape, 2)',
      tests: 'assert regression_metrics([40, 50, 60, 70, 80], [45, 52, 58, 72, 78]) == (2.6, 8.2, 2.86, 5.04)\nassert regression_metrics([0, 10], [1, 12]) == (1.5, 2.5, 1.58, 20.0)' },
    { lec: 7, type: 'write', diff: 'M', q: 'Course lab "Regression Error Metrics R2". Write `goodness_of_fit(actual, predicted, p)` returning `(r2, adj_r2)` rounded to 2 decimals. If TSS = 0 return `(None, None)`; if n − p − 1 ≤ 0 return `(r2, None)`.',
      starter: 'def goodness_of_fit(actual, predicted, p):\n    pass\n',
      ref: 'def goodness_of_fit(actual, predicted, p):\n    n = len(actual)\n    mean = sum(actual) / n\n    rss = sum((a - q) ** 2 for a, q in zip(actual, predicted))\n    tss = sum((a - mean) ** 2 for a in actual)\n    if tss == 0:\n        return None, None\n    r2 = 1 - rss / tss\n    if n - p - 1 <= 0:\n        return round(r2, 2), None\n    adj = 1 - (1 - r2) * (n - 1) / (n - p - 1)\n    return round(r2, 2), round(adj, 2)',
      tests: 'assert goodness_of_fit([3, 5, 7, 9, 11], [2.8, 5.3, 6.8, 9.2, 10.9], 1) == (0.99, 0.99)\nassert goodness_of_fit([4, 4, 4], [3, 4, 5], 1) == (None, None)\nassert goodness_of_fit([1, 2, 3], [1, 2, 3.5], 2) == (0.88, None)' },
    { lec: 6, type: 'write', diff: 'M', q: 'Course lab "Mini-Batch GD". Write `train_minibatch(X, Y, learning_rate, batch_size, epochs)` for y = w·x: w = 0, `np.random.seed(42)` once, each epoch shuffle an index array with `np.random.shuffle`, walk it in groups of `batch_size` (last group may be smaller), update once per group with the group mean of 2(w·xᵢ − yᵢ)xᵢ. Return round(w, 2).',
      starter: 'import numpy as np\n\ndef train_minibatch(X, Y, learning_rate, batch_size, epochs):\n    pass\n',
      ref: 'import numpy as np\n\ndef train_minibatch(X, Y, learning_rate, batch_size, epochs):\n    X = np.array(X, float); Y = np.array(Y, float); N = len(X); w = 0.0\n    np.random.seed(42)\n    for _ in range(epochs):\n        idx = np.arange(N); np.random.shuffle(idx)\n        for s in range(0, N, batch_size):\n            g = idx[s:s + batch_size]\n            w -= learning_rate * np.mean(2 * (w * X[g] - Y[g]) * X[g])\n    return round(float(w), 2)',
      tests: 'assert train_minibatch(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 2, 500) == 0.5\nassert train_minibatch([1, 2, 3], [2, 4, 6], 0.001, 3, 100) == 1.22' },
    { lec: 11, type: 'write', diff: 'H', q: 'Course lab "PCA Implementation from scratch". Write `pca_project(data, k)`: standardise with `StandardScaler`, covariance with `np.cov(..., rowvar=False)`, keep the eigenvectors of the k **largest** eigenvalues, return the projected n × k array. (Eigenvector signs may flip; the tests compare absolute values.)',
      starter: 'import numpy as np\nfrom sklearn.preprocessing import StandardScaler\n\ndef pca_project(data, k):\n    pass\n',
      ref: 'import numpy as np\nfrom sklearn.preprocessing import StandardScaler\n\ndef pca_project(data, k):\n    Z = StandardScaler().fit_transform(np.array(data, float))\n    C = np.cov(Z, rowvar=False)\n    vals, vecs = np.linalg.eigh(C)\n    top = vecs[:, np.argsort(vals)[::-1][:k]]\n    return Z @ top',
      tests: 'import numpy as np\nd = [[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2], [3.1, 3.0], [2.3, 2.7], [2.0, 1.6], [1.0, 1.1], [1.5, 1.6], [1.1, 0.9]]\nout = pca_project(d, 1)\nassert out.shape == (10, 1)\nassert np.allclose(np.abs(out[:, 0]), np.abs([1.0864, -2.3089, 1.2419, 0.3408, 2.1843, 1.1607, -0.0926, -1.4821, -0.5672, -1.5633]), atol=1e-4)' },
    { lec: 7, type: 'write', diff: 'M', q: 'Write `prf(y_true, y_pred)` for binary labels (positive class = 1) returning `(precision, recall, f1)` rounded to 3 decimals. Return 0.0 for any metric whose denominator is 0.',
      starter: 'def prf(y_true, y_pred):\n    pass\n',
      ref: 'def prf(y_true, y_pred):\n    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\n    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\n    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\n    prec = tp / (tp + fp) if tp + fp else 0.0\n    rec = tp / (tp + fn) if tp + fn else 0.0\n    f1 = 2 * prec * rec / (prec + rec) if prec + rec else 0.0\n    return round(prec, 3), round(rec, 3), round(f1, 3)',
      tests: 'assert prf([1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1]) == (0.75, 0.75, 0.75)\nassert prf([1, 1, 0], [0, 0, 0]) == (0.0, 0.0, 0.0)\nassert prf([1, 1, 0, 0], [1, 1, 1, 0]) == (0.667, 1.0, 0.8)' },
    { lec: 15, type: 'write', diff: 'M', q: 'Write `softmax_ce(z, k)` that returns the cross-entropy −ln p̂ₖ of the true class index `k` for the logit list `z`, using a numerically stable softmax. Round to 4 decimals.',
      starter: 'import numpy as np\n\ndef softmax_ce(z, k):\n    pass\n',
      ref: 'import numpy as np\n\ndef softmax_ce(z, k):\n    z = np.array(z, float)\n    e = np.exp(z - z.max())\n    p = e / e.sum()\n    return round(float(-np.log(p[k])), 4)',
      tests: 'assert softmax_ce([2, 1, 0], 1) == 1.4076\nassert softmax_ce([1000, 999, 998], 0) == softmax_ce([2, 1, 0], 0)\nassert softmax_ce([0, 0], 0) == 0.6931' }
  ];
  EXTRA.intDrill.push(...I);
  EXTRA.codeDrill.push(...C);
})();
