/* Lecture 4 — Multiple Linear Regression with OLS (matrix form, normal equation) */
LECTURES.push({
  num: 4, short: 'MLR & Normal Eq.', title: 'Multiple Linear Regression — matrix form, three matrix-calculus identities, the Normal Equation',
  file: 'AML_Lecture 4_Worksheet_Filled.pdf', pages: 14,
  intro: R`**Exam weight: high.** Know the **sizes** ($X$ is $n\times(m+1)$, $X^TX$ is $(m+1)\times(m+1)$), the **expansion** $L = y^Ty - 2y^TX\beta + \beta^TX^TX\beta$, the **three identities** ($\partial c = 0$, $\partial a^T\beta = a$, $\partial \beta^TA\beta = 2A\beta$), the **normal equation** $X^TX\beta = X^Ty$, when it fails (**multicollinearity**, singular $X^TX$) and why it is slow ($O(k^3)$). Numericals: matrix products, $e^Te$, a 3×3 OLS by hand. About 90 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L04.1 */
  {
    id: 'L04.1', title: 'The MLR dataset, equation and hyperplane', badge: 'class', pages: '1–2', ws: 'Sections 1–2',
    concept: R`
In Lecture 3 CGPA alone predicted the stipend. What if IQ, attendance and project scores also matter? We need **many features**.

| $X_1$ | $X_2$ | ⋯ | $X_m$ | $Y$ | $\hat Y$ |
|---|---|---|---|---|---|
| $x_{11}$ | $x_{12}$ | ⋯ | $x_{1m}$ | $y_1$ | $\hat y_1$ |
| ⋮ | ⋮ | | ⋮ | ⋮ | ⋮ |
| $x_{n1}$ | $x_{n2}$ | ⋯ | $x_{nm}$ | $y_n$ | $\hat y_n$ |

- **m** = number of **features** (input columns); **n** = number of **data points** (rows). $x_{ij}$ = row $i$, feature $j$.

The MLR prediction equation:
$$\hat y = \beta_0 + \beta_1x_1 + \beta_2x_2 + \dots + \beta_mx_m$$

:::key Key insight
This is a **hyperplane** in m dimensions. It is still a *linear* equation; only the number of inputs grew from 1 to m. It has **m + 1** parameters.
:::

**For each row** the same parameters are used, only the features change:
$$\hat y_i = \beta_0 + \beta_1x_{i1} + \beta_2x_{i2} + \dots + \beta_mx_{im}$$

**PRACTICE P1.** Rent from area, bedrooms, metro distance, floor: $\hat y = \beta_0 + \beta_1x_{\text{area}} + \beta_2x_{\text{beds}} + \beta_3x_{\text{metro}} + \beta_4x_{\text{floor}}$ → **5** β parameters. (b) Add "age of building": must $\beta_1$ stay the same? **No.** All coefficients are refitted **jointly**, and correlations between features can change $\beta_1$.

**PRACTICE P2.** Model $\hat y = 10 + 5x_1 + 2x_2$ (CGPA, study hours/week):

| Student | $x_1$ | $x_2$ | $\hat y$ |
|---|---|---|---|
| Arjun | 8 | 6 | 10 + 40 + 12 = **62** |
| Priya | 7 | 10 | 10 + 35 + 20 = **65** |
| Rahul | 9 | 4 | 10 + 45 + 8 = **63** |

(b) Priya is predicted highest (65). (c) New student Maya (8.5, 8): $10 + 42.5 + 16 = $ **68.5**. A new prediction needs **no retraining**.

:::take Takeaway
Every prediction uses the same β's; the vector $\hat{\mathbf y}$ holds all n predictions.
:::`,
    formulas: [
      { name: 'MLR model', tex: R`\hat y = \beta_0 + \sum_{j=1}^{m}\beta_jx_j`, sym: '$m$ features, $m+1$ parameters ($\\beta_0$ = intercept).', when: 'Any multi-feature linear model.' },
      { name: 'Prediction for row i', tex: R`\hat y_i = \beta_0 + \beta_1x_{i1} + \dots + \beta_mx_{im}`, sym: '$x_{ij}$: row i, column j.', when: 'Filling prediction tables (P2).' }
    ],
    examples: [
      { title: 'Interpreting a coefficient (worked)', body: R`In $\hat y = 10 + 5x_1 + 2x_2$, $\beta_2 = 2$ means: **holding CGPA fixed**, one more study hour per week adds 2 marks to the prediction. In MLR every coefficient is a "holding the others fixed" effect, which is why adding a correlated feature can change it (P1(b)).` }
    ],
    traps: [
      'In this lecture **m = number of features**. In Lecture 5 the worksheet reuses **m for the number of examples**. Read each question carefully.',
      'A model with m features has **m + 1** parameters (count the intercept).',
      'A hyperplane is still **linear in the parameters** and in the features.',
      'Coefficients are not fixed properties of a feature: they change when other features are added or removed.'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'A model predicts rent from area, bedrooms, metro distance and floor. How many β parameters, **including** the intercept?', answer: 5, tol: 0, round: 'Exact integer', verify: '4+1',
        sol: '4 features + 1 intercept = **5** (P1(a)).' },
      { type: 'int', diff: 'E', q: R`Model $\hat y = 10 + 5x_1 + 2x_2$. Predict for $x_1 = 8.5$, $x_2 = 8$.`, answer: 68.5, tol: 0.001, round: '1 decimal', verify: '10+5*8.5+2*8',
        sol: '10 + 42.5 + 16 = **68.5** (Maya, P2(c)).' },
      { type: 'mcq', diff: 'M', q: 'You add a fifth feature (building age) to the rent model and refit. The coefficient of area:', options: ['must stay exactly the same', 'may change, because all coefficients are refitted jointly', 'becomes zero', 'doubles'], answer: 1,
        sol: 'P1(b): coefficients are estimated together; correlation between age and area can shift $\\beta_1$.', why: ['Only if the new feature is uncorrelated with the others (and even then estimates change slightly).', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Geometrically, an MLR model with m features is a:', options: ['curve', 'hyperplane', 'circle', 'set of disconnected points'], answer: 1,
        sol: 'Key insight Section 1: a hyperplane in m dimensions (a line for m = 1, a plane for m = 2).', why: ['Still linear.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'A trained MLR model gets a new student. To predict her score you must:', options: ['retrain on all data including her', 'plug her features into the same equation', 'compute a new intercept', 'remove one feature'], answer: 1,
        sol: 'P2(c): prediction just evaluates $\\hat y$ with the learned β; no retraining.', why: ['Unnecessary (and she has no label yet).', 'Correct.', 'No.', 'No.'] }
    ],
    source: 'Worksheet L4 pp.1–2; ISLR §3.2.'
  },
  /* ---------------------------------------------------------------- L04.2 */
  {
    id: 'L04.2', title: 'Matrix form and the design matrix', badge: 'class', pages: '3', ws: 'Section 3',
    concept: R`
Writing n separate equations is tedious, so pack them into one:
$$\underbrace{\begin{bmatrix}\hat y_1\\\hat y_2\\\vdots\\\hat y_n\end{bmatrix}}_{\hat{\mathbf y}} = \underbrace{\begin{bmatrix}1 & x_{11} & \cdots & x_{1m}\\ 1 & x_{21} & \cdots & x_{2m}\\ \vdots & \vdots & & \vdots\\ 1 & x_{n1} & \cdots & x_{nm}\end{bmatrix}}_{X}\underbrace{\begin{bmatrix}\beta_0\\\beta_1\\\vdots\\\beta_m\end{bmatrix}}_{\boldsymbol\beta}$$

The **first column is all 1s** so that the intercept $\beta_0$ appears in every row.

| Object | Name | Size |
|---|---|---|
| $X$ | design matrix | $n \times (m+1)$ |
| $\boldsymbol\beta$ | parameter vector | $(m+1) \times 1$ |
| $\hat{\mathbf y}$ | prediction vector | $n \times 1$ |

Compact form: $\hat{\mathbf y} = X\boldsymbol\beta$.

**PRACTICE P3** (P2 data). (a) $X = \begin{bmatrix}1&8&6\\1&7&10\\1&9&4\end{bmatrix}$, **3×3**. (b) $\boldsymbol\beta = [10, 5, 2]^T$, **3×1**. (c) Row 1: $[1, 8, 6]\boldsymbol\beta = 10 + 40 + 12 = 62$ ✓ Arjun. (d) Adding a 4th student adds **one row to X only**; the number of columns and the length of β stay the same.`,
    formulas: [
      { name: 'Matrix form', tex: R`\hat{\mathbf y} = X\boldsymbol\beta`, sym: '$X$: $n\\times(m+1)$; $\\boldsymbol\\beta$: $(m+1)\\times 1$; $\\hat{\\mathbf y}$: $n\\times1$.', when: 'All MLR algebra and NumPy code (`X @ beta`).' },
      { name: 'Sizes of products', tex: R`X^TX:\ (m+1)\times(m+1),\qquad X^T\mathbf y:\ (m+1)\times 1`, sym: 'Independent of n.', when: 'Dimension MCQs.' }
    ],
    examples: [
      { title: 'Dimension check (worked)', body: R`200 rows, 5 features: $X$ is 200 × 6 (with the 1s column), $\boldsymbol\beta$ is 6 × 1, $\hat{\mathbf y} = X\boldsymbol\beta$ is 200 × 1, $X^TX$ is (6 × 200)(200 × 6) = **6 × 6**, $X^T\mathbf y$ is 6 × 1. Adding 1,000 more rows changes none of the last three sizes.` }
    ],
    code: [{ title: 'Design matrix, X @ beta, normal equation', scratch: 'L04_normal_equation_scratch.py', lib: 'L04_normal_equation_sklearn.py' }],
    traps: [
      'Forgetting the **column of 1s** drops the intercept (forces the hyperplane through the origin).',
      'More rows (data points) never change the size of $\\boldsymbol\\beta$ or $X^TX$.',
      'scikit-learn adds the intercept itself (`fit_intercept=True`); do **not** add a 1s column there as well.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Why does the design matrix X have a first column of 1s?', options: ['To make X square', 'So the intercept β₀ appears in every row', 'To normalise the data', 'To avoid multicollinearity'], answer: 1,
        sol: 'Row i of $X\\boldsymbol\\beta$ is $1\\cdot\\beta_0 + x_{i1}\\beta_1 + \\dots$.', why: ['X is usually tall, not square.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'X has 200 rows and 5 features (plus the intercept column). The size of $X^TX$ is:', options: ['200 × 200', '5 × 5', '6 × 6', '200 × 6'], answer: 2,
        sol: 'X is 200 × 6, so $X^TX$ is 6 × 6 (P11(d) True).', why: ['That would be $XX^T$.', 'Forgot the intercept column.', 'Correct.', 'That is X itself.'] },
      { type: 'mcq', diff: 'M', q: 'A 4th student is added to the 3-student dataset. What changes?', options: ['Number of columns of X', 'Number of rows of X only', 'Length of β', 'Both rows of X and length of β'], answer: 1,
        sol: 'P3(d): only X gains a row.', why: ['Columns = features + 1, unchanged.', 'Correct.', 'β depends on features only.', 'β unchanged.'] },
      { type: 'int', diff: 'E', q: R`$X = \begin{bmatrix}1&7&10\end{bmatrix}$ (one row), $\boldsymbol\beta = [10, 5, 2]^T$. Compute $X\boldsymbol\beta$.`, answer: 65, tol: 0, round: 'Exact', verify: '10+5*7+2*10',
        sol: '$1(10) + 7(5) + 10(2) = 65$ (Priya).' },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[1, 8, 6], [1, 7, 10], [1, 9, 4]])
beta = np.array([10, 5, 2])
print(X @ beta, X.T.shape, (X.T @ X).shape)`, answer: '[62 65 63] (3, 3) (3, 3)',
        sol: 'Row products give the P2 predictions 62, 65, 63 (integer array). X is 3 × 3 here, so both shapes are (3, 3).' }
    ],
    source: 'Worksheet L4 p.3; Strang, *Linear Algebra* §4.3.'
  },
  /* ---------------------------------------------------------------- L04.3 */
  {
    id: 'L04.3', title: 'The residual vector and the loss eᵀe', badge: 'class', pages: '4–5', ws: 'Sections 4–5',
    concept: R`
Residual at row $i$: $e_i = y_i - \hat y_i$. Squared: $e_i^2$. Total squared error (the loss):
$$L = e_1^2 + e_2^2 + \dots + e_n^2 = \sum_{i=1}^n(y_i-\hat y_i)^2$$

**Stack the residuals as a vector** $\mathbf e = \mathbf y - \hat{\mathbf y}$. Then
$$\mathbf e^T\mathbf e = [e_1, e_2, \dots, e_n]\begin{bmatrix}e_1\\\vdots\\e_n\end{bmatrix} = e_1^2 + \dots + e_n^2 = \sum_{i=1}^n (y_i-\hat y_i)^2$$

:::key Key insight
The dot product $\mathbf e^T\mathbf e$ computes the sum of squared residuals in **one** matrix operation.
:::

So the loss is $L = \mathbf e^T\mathbf e$, and substituting $\mathbf e = \mathbf y - X\boldsymbol\beta$:
$$L(\boldsymbol\beta) = (\mathbf y - X\boldsymbol\beta)^T(\mathbf y - X\boldsymbol\beta)$$
$L$ takes the **vector** β as input and returns **one number** (a scalar).

**PRACTICE P4 — two models, three stores**

| Store | Actual | Model A | Model B | $e_A$ | $e_B$ |
|---|---|---|---|---|---|
| 1 | 50 | 48 | 52 | 2 | −2 |
| 2 | 30 | 36 | 28 | **−6** | 2 |
| 3 | 45 | 44 | 46 | 1 | −1 |

(b) Model A's residual at store 2 is **negative** → A **over-predicted**. (c) $\text{TSE}_A = 4 + 36 + 1 = $ **41**; $\text{TSE}_B = 4 + 4 + 1 = $ **9**. **Model B** fits better.`,
    formulas: [
      { name: 'Residual vector', tex: R`\mathbf e = \mathbf y - X\boldsymbol\beta`, sym: '$n\\times1$.', when: 'Vectorised residuals.' },
      { name: 'Loss as a dot product', tex: R`L(\boldsymbol\beta) = \mathbf e^T\mathbf e = (\mathbf y - X\boldsymbol\beta)^T(\mathbf y - X\boldsymbol\beta)`, sym: 'Scalar; equals Σ e_i².', when: 'Start of the normal-equation derivation; `e @ e` in NumPy.' }
    ],
    examples: [
      { title: 'eᵀe vs eeᵀ (worked)', body: R`$\mathbf e = [2, 3]^T$.
- $\mathbf e^T\mathbf e = 2\cdot2 + 3\cdot3 = 13$: a **1×1 scalar** (the loss).
- $\mathbf e\mathbf e^T = \begin{bmatrix}4&6\\6&9\end{bmatrix}$: a 2×2 matrix, **not** the loss.` }
    ],
    traps: [
      '$\\mathbf e^T\\mathbf e$ (scalar) ≠ $\\mathbf e\\mathbf e^T$ (n × n matrix).',
      'Negative residual ⇒ prediction too **high** (over-prediction).',
      'Total squared error compares models **on the same data**; it grows with n, so do not compare TSE across datasets of different sizes (use MSE).'
    ],
    questions: [
      { type: 'int', diff: 'E', q: 'Actual sales [50, 30, 45]; model A predicts [48, 36, 44]. Total squared error of A?', answer: 41, tol: 0, round: 'Exact', verify: '(50-48)**2+(30-36)**2+(45-44)**2',
        sol: 'Residuals 2, −6, 1 → 4 + 36 + 1 = **41**.' },
      { type: 'int', diff: 'E', q: 'Same actuals [50, 30, 45]; model B predicts [52, 28, 46]. Total squared error of B?', answer: 9, tol: 0, round: 'Exact', verify: '(50-52)**2+(30-28)**2+(45-46)**2',
        sol: 'Residuals −2, 2, −1 → 4 + 4 + 1 = **9**. Model B fits better.' },
      { type: 'mcq', diff: 'E', q: R`For a residual vector $\mathbf e$ of length n, $\mathbf e^T\mathbf e$ is:`, options: ['an n × n matrix', 'a scalar equal to the sum of squared residuals', 'a vector of squared residuals', 'always zero'], answer: 1,
        sol: '(1 × n)(n × 1) = 1 × 1 = Σ e_i².', why: ['That is $\\mathbf e\\mathbf e^T$.', 'Correct.', 'That would be element-wise `e**2`.', 'Only for a perfect fit.'] },
      { type: 'mcq', diff: 'M', q: 'Model A predicts 36 when the actual is 30. Model A has:', options: ['a positive residual (under-prediction)', 'a negative residual (over-prediction)', 'zero residual', 'a residual of +6'], answer: 1,
        sol: '$e = 30 - 36 = -6 < 0$: the model predicted too high (P4(b)).', why: ['Sign reversed.', 'Correct.', 'No.', 'Wrong sign.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
y = np.array([50, 30, 45]); yhat = np.array([52, 28, 46])
e = y - yhat
print(e @ e, np.outer(e, e).shape)`, answer: '9 (3, 3)',
        sol: '`e @ e` for 1-D arrays is the dot product $\\mathbf e^T\\mathbf e = 9$. The outer product $\\mathbf e\\mathbf e^T$ is 3 × 3.' }
    ],
    source: 'Worksheet L4 pp.4–5.'
  },
  /* ---------------------------------------------------------------- L04.4 */
  {
    id: 'L04.4', title: 'Expanding the loss function', badge: 'class', pages: '5–6', ws: 'Section 6',
    concept: R`
$L(\boldsymbol\beta) = (\mathbf y - X\boldsymbol\beta)^T(\mathbf y - X\boldsymbol\beta)$ is compact but hard to differentiate, so expand it (full steps below):
$$L(\boldsymbol\beta) = \mathbf y^T\mathbf y - 2\,\mathbf y^TX\boldsymbol\beta + \boldsymbol\beta^TX^TX\boldsymbol\beta \qquad\text{(Equation 1)}$$

:::key Key insight
Three terms: $\mathbf y^T\mathbf y$ is **constant** in β, $-2\mathbf y^TX\boldsymbol\beta$ is **linear** in β, $\boldsymbol\beta^TX^TX\boldsymbol\beta$ is **quadratic** in β. The loss is **convex**: a minimum exists, and it is unique when $X^TX$ is invertible. $L:\mathbb R^{m+1}\to\mathbb R$ (vector in, scalar out). At the minimum all partial derivatives are zero.
:::

**PRACTICE P5 — verify with numbers.** $X = \begin{bmatrix}1&2\\1&3\end{bmatrix}$, $\mathbf y = [5, 7]^T$, $\boldsymbol\beta = [1, 1]^T$.
- (a) $X\boldsymbol\beta = [3, 4]^T$; $\mathbf e = [2, 3]^T$.
- (b) $\mathbf e^T\mathbf e = 4 + 9 = $ **13**.
- (c) $\mathbf y^T\mathbf y = 25 + 49 = 74$; $\mathbf y^TX\boldsymbol\beta = 5(3) + 7(4) = 43$; $\boldsymbol\beta^TX^TX\boldsymbol\beta = \|X\boldsymbol\beta\|^2 = 9 + 16 = 25$. Check: $74 - 2(43) + 25 = 13$ ✓.
- (d) $\boldsymbol\beta^TX^T\mathbf y = (X\boldsymbol\beta)^T\mathbf y = 3(5) + 4(7) = 43$ = $\mathbf y^TX\boldsymbol\beta$ ✓.`,
    deriv: [
      { id: 'D04-expand', title: 'Expanding (y − Xβ)ᵀ(y − Xβ)', badge: 'class',
        steps: [
          { m: R`L(\boldsymbol\beta) = (\mathbf y - X\boldsymbol\beta)^T(\mathbf y - X\boldsymbol\beta)`, t: 'Start.' },
          { m: R`(\mathbf y - X\boldsymbol\beta)^T = \mathbf y^T - \boldsymbol\beta^TX^T`, why: 'Transpose of a difference is the difference of transposes, and $(AB)^T = B^TA^T$.' },
          { m: R`L = (\mathbf y^T - \boldsymbol\beta^TX^T)(\mathbf y - X\boldsymbol\beta)`, t: 'Substitute.' },
          { m: R`L = \mathbf y^T\mathbf y - \mathbf y^TX\boldsymbol\beta - \boldsymbol\beta^TX^T\mathbf y + \boldsymbol\beta^TX^TX\boldsymbol\beta`, why: 'Multiply out like $(a-b)(c-d) = ac - ad - bc + bd$, keeping the order of matrix factors.' },
          { m: R`\mathbf y^TX\boldsymbol\beta:\ (1\times n)(n\times(m+1))((m+1)\times1) = 1\times1`, why: 'Each of the four terms is a scalar.' },
          { m: R`\boldsymbol\beta^TX^T\mathbf y = (\mathbf y^TX\boldsymbol\beta)^T = \mathbf y^TX\boldsymbol\beta`, why: 'The transpose of a scalar is itself, so the two middle terms are equal.' }
        ],
        result: R`L(\boldsymbol\beta) = \mathbf y^T\mathbf y - 2\,\mathbf y^TX\boldsymbol\beta + \boldsymbol\beta^TX^TX\boldsymbol\beta` }
    ],
    formulas: [
      { name: 'Expanded loss (Equation 1)', tex: R`L = \mathbf y^T\mathbf y - 2\mathbf y^TX\boldsymbol\beta + \boldsymbol\beta^TX^TX\boldsymbol\beta`, sym: 'constant − linear + quadratic in β.', when: 'Before differentiating.' },
      { name: 'Scalar transpose', tex: R`\mathbf y^TX\boldsymbol\beta = \boldsymbol\beta^TX^T\mathbf y`, sym: 'A 1×1 equals its transpose.', when: 'Combining the middle terms.' }
    ],
    examples: [
      { title: 'P5 in one table (worked)', body: R`| Term | Value |
|---|---|
| $\mathbf y^T\mathbf y$ | 74 |
| $-2\mathbf y^TX\boldsymbol\beta$ | −86 |
| $\boldsymbol\beta^TX^TX\boldsymbol\beta$ | 25 |
| **Sum** | **13** = $\mathbf e^T\mathbf e$ ✓ |` }
    ],
    traps: [
      '$(X\\boldsymbol\\beta)^T = \\boldsymbol\\beta^TX^T$ (order reverses), **not** $X^T\\boldsymbol\\beta^T$.',
      'The two middle terms are equal **scalars**, which is why the coefficient becomes −2.',
      '$\\boldsymbol\\beta^TX^TX\\boldsymbol\\beta = \\|X\\boldsymbol\\beta\\|^2 \\ge 0$ — a quick way to compute it.'
    ],
    questions: [
      { type: 'int', diff: 'M', q: R`$X = \begin{bmatrix}1&2\\1&3\end{bmatrix}$, $\mathbf y = [5,7]^T$, $\boldsymbol\beta = [1,1]^T$. Compute $\mathbf y^TX\boldsymbol\beta$.`, answer: 43, tol: 0, round: 'Exact', verify: '5*3+7*4',
        sol: '$X\\boldsymbol\\beta = [3, 4]^T$; $\\mathbf y^T X\\boldsymbol\\beta = 5(3) + 7(4) = $ **43**.' },
      { type: 'int', diff: 'M', q: R`Same data. Compute $\boldsymbol\beta^TX^TX\boldsymbol\beta$.`, answer: 25, tol: 0, round: 'Exact', verify: '3**2+4**2',
        sol: '$= \\|X\\boldsymbol\\beta\\|^2 = 3^2 + 4^2 = $ **25**.' },
      { type: 'int', diff: 'M', q: R`Same data. Use the expanded form to compute $L = \mathbf y^T\mathbf y - 2\mathbf y^TX\boldsymbol\beta + \boldsymbol\beta^TX^TX\boldsymbol\beta$.`, answer: 13, tol: 0, round: 'Exact', verify: '74-2*43+25',
        sol: '$74 - 86 + 25 = $ **13**, equal to $\\mathbf e^T\\mathbf e = 2^2 + 3^2$.' },
      { type: 'mcq', diff: 'M', q: R`Why can $-\mathbf y^TX\boldsymbol\beta - \boldsymbol\beta^TX^T\mathbf y$ be written as $-2\mathbf y^TX\boldsymbol\beta$?`, options: ['Because X is symmetric', 'Because both terms are scalars and one is the transpose of the other', 'Because y = Xβ', 'Because β is a unit vector'], answer: 1,
        sol: 'A 1 × 1 matrix equals its transpose.', why: ['X is generally not square.', 'Correct.', 'Not true in general.', 'No.'] },
      { type: 'msq', diff: 'M', q: R`Classify the terms of $L(\boldsymbol\beta)$: select all **true** statements.`, options: [R`$\mathbf y^T\mathbf y$ is constant in β`, R`$-2\mathbf y^TX\boldsymbol\beta$ is linear in β`, R`$\boldsymbol\beta^TX^TX\boldsymbol\beta$ is quadratic in β`, 'L is a vector'], answer: [0, 1, 2],
        sol: 'Constant, linear and quadratic; L itself is a scalar.', why: ['True.', 'True.', 'True.', 'False: L maps ℝ^(m+1) → ℝ.'] }
    ],
    source: 'Worksheet L4 pp.5–6; Petersen & Pedersen, *The Matrix Cookbook* §2.'
  },
  /* ---------------------------------------------------------------- L04.5 */
  {
    id: 'L04.5', title: 'The gradient condition and the three identities', badge: 'class', pages: '6–9', ws: 'Sections 7–10',
    concept: R`
At the bottom of a bowl every direction is flat: all partial derivatives are zero.
$$\frac{\partial L}{\partial\beta_0} = 0,\ \dots,\ \frac{\partial L}{\partial\beta_m} = 0 \iff \nabla L = \frac{\partial L}{\partial\boldsymbol\beta} = \mathbf 0$$

To differentiate Equation 1 we need one identity per type of term:

| # | Identity | Applied to our loss |
|---|---|---|
| 1 (Eq. 2) | $\dfrac{\partial c}{\partial\boldsymbol\beta} = \mathbf 0$ | $\dfrac{\partial(\mathbf y^T\mathbf y)}{\partial\boldsymbol\beta} = \mathbf 0$ |
| 2 (Eq. 3) | $\dfrac{\partial(\mathbf a^T\boldsymbol\beta)}{\partial\boldsymbol\beta} = \mathbf a$ | $\mathbf a^T = -2\mathbf y^TX \Rightarrow \mathbf a = -2X^T\mathbf y$ |
| 3 (Eq. 4) | $\dfrac{\partial(\boldsymbol\beta^TA\boldsymbol\beta)}{\partial\boldsymbol\beta} = 2A\boldsymbol\beta$ ($A$ symmetric) | $A = X^TX$ (symmetric) $\Rightarrow 2X^TX\boldsymbol\beta$ |

Identity 3 is the matrix version of $\frac{d}{dx}(ax^2) = 2ax$.

**Is $X^TX$ symmetric?** $(X^TX)^T = X^T(X^T)^T = X^TX$ ✓.

**PRACTICE P6.** (a) $f = 42$ → $\partial f/\partial\boldsymbol\beta = \mathbf 0$; a constant does not change when β changes. (b) $\mathbf a = [3,-1]^T$: $f = 3\beta_1 - \beta_2$; partials 3 and −1; stacked $[3,-1]^T = \mathbf a$ ✓. (c) If $X^T\mathbf y = [10, -4, 7]^T$, the derivative of $-2\mathbf y^TX\boldsymbol\beta$ is $-2X^T\mathbf y = [-20, 8, -14]^T$.

**PRACTICE P7.** $A = \begin{bmatrix}2&1\\1&3\end{bmatrix}$ (symmetric ✓). $A\boldsymbol\beta = [2\beta_1 + \beta_2,\ \beta_1 + 3\beta_2]^T$. $f = \boldsymbol\beta^TA\boldsymbol\beta = 2\beta_1^2 + 2\beta_1\beta_2 + 3\beta_2^2$. Partials: $4\beta_1 + 2\beta_2$ and $2\beta_1 + 6\beta_2$. Stacked = $2A\boldsymbol\beta$ ✓.`,
    deriv: [
      { id: 'D04-identities', title: 'Proving identities 2 and 3 component by component', badge: 'class',
        steps: [
          { m: R`f(\boldsymbol\beta) = \mathbf a^T\boldsymbol\beta = a_0\beta_0 + a_1\beta_1 + \dots + a_m\beta_m`, t: 'Identity 2: write the linear form as a sum.' },
          { m: R`\frac{\partial f}{\partial\beta_j} = a_j\ \ \text{for each } j \;\Rightarrow\; \frac{\partial(\mathbf a^T\boldsymbol\beta)}{\partial\boldsymbol\beta} = \mathbf a`, why: 'Only the j-th term contains $\\beta_j$.' },
          { m: R`A = \begin{bmatrix}a_{11}&a_{12}\\a_{12}&a_{22}\end{bmatrix},\quad A\boldsymbol\beta = \begin{bmatrix}a_{11}\beta_1 + a_{12}\beta_2\\ a_{12}\beta_1 + a_{22}\beta_2\end{bmatrix}`, t: 'Identity 3, 2×2 symmetric case. Step 1: compute Aβ.' },
          { m: R`\boldsymbol\beta^TA\boldsymbol\beta = a_{11}\beta_1^2 + 2a_{12}\beta_1\beta_2 + a_{22}\beta_2^2`, why: 'Step 2: dot β with Aβ; the two off-diagonal products combine because $A$ is symmetric.' },
          { m: R`\frac{\partial f}{\partial\beta_1} = 2a_{11}\beta_1 + 2a_{12}\beta_2,\qquad \frac{\partial f}{\partial\beta_2} = 2a_{12}\beta_1 + 2a_{22}\beta_2`, why: 'Step 3: ordinary partial derivatives.' },
          { m: R`\frac{\partial f}{\partial\boldsymbol\beta} = 2\begin{bmatrix}a_{11}&a_{12}\\a_{12}&a_{22}\end{bmatrix}\begin{bmatrix}\beta_1\\\beta_2\end{bmatrix} = 2A\boldsymbol\beta`, why: 'Step 4: stack and factor.' }
        ],
        result: R`\frac{\partial c}{\partial\boldsymbol\beta}=\mathbf 0,\quad \frac{\partial\,\mathbf a^T\boldsymbol\beta}{\partial\boldsymbol\beta}=\mathbf a,\quad \frac{\partial\,\boldsymbol\beta^TA\boldsymbol\beta}{\partial\boldsymbol\beta}=2A\boldsymbol\beta`,
        after: 'For a non-symmetric $A$ the general rule is $(A + A^T)\\boldsymbol\\beta$, which reduces to $2A\\boldsymbol\\beta$ when $A = A^T$.' }
    ],
    formulas: [
      { name: 'Identity 1', tex: R`\frac{\partial c}{\partial\boldsymbol\beta} = \mathbf 0`, sym: 'c does not depend on β.', when: '$\\mathbf y^T\\mathbf y$ term.' },
      { name: 'Identity 2', tex: R`\frac{\partial(\mathbf a^T\boldsymbol\beta)}{\partial\boldsymbol\beta} = \mathbf a`, sym: '$\\mathbf a$ constant vector.', when: 'Linear term → $-2X^T\\mathbf y$.' },
      { name: 'Identity 3', tex: R`\frac{\partial(\boldsymbol\beta^TA\boldsymbol\beta)}{\partial\boldsymbol\beta} = 2A\boldsymbol\beta\ \ (A = A^T)`, sym: 'Matrix analogue of $2ax$.', when: 'Quadratic term → $2X^TX\\boldsymbol\\beta$.' }
    ],
    examples: [
      { title: 'Gradient at a specific β (worked)', body: R`$A = \begin{bmatrix}2&1\\1&3\end{bmatrix}$, $\boldsymbol\beta = [1, 2]^T$: $A\boldsymbol\beta = [2 + 2, 1 + 6]^T = [4, 7]^T$, so $\nabla(\boldsymbol\beta^TA\boldsymbol\beta) = 2A\boldsymbol\beta = [8, 14]^T$.
Check with the scalar form $f = 2\beta_1^2 + 2\beta_1\beta_2 + 3\beta_2^2$: $\partial_1 = 4(1) + 2(2) = 8$ ✓, $\partial_2 = 2(1) + 6(2) = 14$ ✓.` }
    ],
    traps: [
      'Do not forget the **−2** when differentiating the linear term: the result is $-2X^T\\mathbf y$, not $X^T\\mathbf y$.',
      'Identity 3 needs **A symmetric**; $X^TX$ always is.',
      'The gradient of a scalar w.r.t. a vector is a **vector** of the same length as β.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: R`$\dfrac{\partial(\mathbf a^T\boldsymbol\beta)}{\partial\boldsymbol\beta}$ equals:`, options: [R`$\mathbf a^T\boldsymbol\beta$`, R`$\mathbf a$`, R`$2\mathbf a$`, R`$\mathbf 0$`], answer: 1,
        sol: 'Identity 2: each partial gives back $a_j$.', why: ['That is f itself.', 'Correct.', 'Confused with identity 3.', 'Only for constants.'] },
      { type: 'mcq', diff: 'E', q: R`For symmetric A, $\dfrac{\partial(\boldsymbol\beta^TA\boldsymbol\beta)}{\partial\boldsymbol\beta}$ equals:`, options: [R`$A\boldsymbol\beta$`, R`$2A\boldsymbol\beta$`, R`$\boldsymbol\beta^TA$`, R`$2A$`], answer: 1,
        sol: 'Identity 3 (matrix version of $d(ax^2)/dx = 2ax$).', why: ['Missing the 2.', 'Correct.', 'Wrong shape (a row).', 'That is the Hessian.'] },
      { type: 'int', diff: 'M', q: R`$A = \begin{bmatrix}2&1\\1&3\end{bmatrix}$, $\boldsymbol\beta = [1,2]^T$. The **second** component of $\nabla(\boldsymbol\beta^TA\boldsymbol\beta)$?`, answer: 14, tol: 0, round: 'Exact', verify: '2*(1*1+3*2)',
        sol: '$2A\\boldsymbol\\beta = 2[4, 7]^T = [8, 14]^T$ → **14**.' },
      { type: 'mcq', diff: 'M', q: R`If $X^T\mathbf y = [10, -4, 7]^T$, the gradient of $-2\mathbf y^TX\boldsymbol\beta$ is:`, options: ['[10, −4, 7]', '[−20, 8, −14]', '[20, −8, 14]', '[0, 0, 0]'], answer: 1,
        sol: 'P6(c): $-2X^T\\mathbf y = [-20, 8, -14]^T$.', why: ['Forgot −2.', 'Correct.', 'Sign error.', 'Not constant.'] },
      { type: 'mcq', diff: 'M', q: R`Why is $X^TX$ symmetric?`, options: ['Because X is square', R`Because $(X^TX)^T = X^T(X^T)^T = X^TX$`, 'Because the data are centred', 'It is not always symmetric'], answer: 1,
        sol: 'Transpose rule $(AB)^T = B^TA^T$.', why: ['X need not be square.', 'Correct.', 'Not needed.', 'It always is.'] },
      { type: 'int', diff: 'E', q: R`$f(\boldsymbol\beta) = 42$. What is the sum of the components of $\partial f/\partial\boldsymbol\beta$?`, answer: 0, tol: 0, round: 'Exact', verify: '0',
        sol: 'The gradient of a constant is the zero vector (P6(a)); its components sum to **0**.' }
    ],
    source: 'Worksheet L4 pp.6–9; *The Matrix Cookbook* eqs. (69), (81).'
  },
  /* ---------------------------------------------------------------- L04.6 */
  {
    id: 'L04.6', title: 'The Normal Equation; 8-step summary; SLR vs MLR', badge: 'class', pages: '9, 11–12', ws: 'Sections 11, 15',
    concept: R`
Apply the three identities to Equation 1 term by term and set the gradient to zero (steps below):
$$X^TX\boldsymbol\beta = X^T\mathbf y\quad\text{(Normal Equation)}\qquad\Rightarrow\qquad \boldsymbol\beta^* = (X^TX)^{-1}X^T\mathbf y$$

:::key Key insight
This is the **closed-form** OLS solution for MLR: compute $X^TX$, invert it, multiply by $X^T\mathbf y$. No iteration, no guessing.
:::

**The complete derivation in 8 steps**

| Step | Action | Result |
|---|---|---|
| 1 | MLR prediction | $\hat y_i = \beta_0 + \beta_1x_{i1} + \dots + \beta_mx_{im}$ |
| 2 | Stack as a vector | $\hat{\mathbf y} = X\boldsymbol\beta$ |
| 3 | Residual | $e_i = y_i - \hat y_i$ |
| 4 | Total squared error | $L = \mathbf e^T\mathbf e = (\mathbf y - X\boldsymbol\beta)^T(\mathbf y - X\boldsymbol\beta)$ |
| 5 | Expand | $L = \mathbf y^T\mathbf y - 2\mathbf y^TX\boldsymbol\beta + \boldsymbol\beta^TX^TX\boldsymbol\beta$ |
| 6 | Three identities | $\mathbf 0$, $\mathbf a$, $2A\boldsymbol\beta$ |
| 7 | Differentiate, set ∇ = 0 | $X^TX\boldsymbol\beta = X^T\mathbf y$ |
| 8 | Solve | $\boldsymbol\beta^* = (X^TX)^{-1}X^T\mathbf y$ |

**SLR vs MLR**

| Aspect | SLR (L3) | MLR (L4) |
|---|---|---|
| Parameters | $m, c$ | $\beta_0, \dots, \beta_m$ |
| Model | $\hat y = mx + c$ | $\hat{\mathbf y} = X\boldsymbol\beta$ |
| Error | $\sum(y_i - mx_i - c)^2$ | $(\mathbf y - X\boldsymbol\beta)^T(\mathbf y - X\boldsymbol\beta)$ |
| Minimise | $\partial L/\partial m = \partial L/\partial c = 0$ | $\partial L/\partial\boldsymbol\beta = \mathbf 0$ |
| Solution | formulas for m, c | $(X^TX)^{-1}X^T\mathbf y$ |
| Geometry | line | hyperplane |
| Condition | $\sum(x_i-\bar x)^2 \ne 0$ | $\det(X^TX) \ne 0$ |
| Limitation | 1 feature | $O(m^3)$ cost |

**HOMEWORK P11 — true/false.** (a) SLR is MLR with m = 1: **T**. (b) Doubling column $x_2$ still gives a valid β*: **T** (its coefficient halves; predictions unchanged). (c) OLS minimises absolute residuals: **F**. (d) 200 rows, 5 features → $X^TX$ is 6×6: **T**. (e) Multicollinearity = two features slightly correlated: **F** (it is (near-)exact linear dependence). (f) GD and OLS find different optimal β*: **F** (same convex loss → same optimum once GD converges). (g) Adding features **always reduces** training TSE: **F** (it cannot increase, but may stay the same). (h) Normal equation is $X^TX\boldsymbol\beta = X^T\mathbf y$: **T**. (i) If $n < m+1$, a perfect fit is always good: **F** (it interpolates and can overfit).`,
    deriv: [
      { id: 'D04-normal', title: 'From the expanded loss to the Normal Equation', badge: 'class',
        steps: [
          { m: R`L(\boldsymbol\beta) = \underbrace{\mathbf y^T\mathbf y}_{\text{Eq 2}} - \underbrace{2\mathbf y^TX\boldsymbol\beta}_{\text{Eq 3}} + \underbrace{\boldsymbol\beta^TX^TX\boldsymbol\beta}_{\text{Eq 4}}`, t: 'Equation 1, with the identity used for each term.' },
          { m: R`\frac{\partial L}{\partial\boldsymbol\beta} = \mathbf 0 - 2X^T\mathbf y + 2X^TX\boldsymbol\beta`, why: 'Identity 1 on the constant, identity 2 with $\\mathbf a = -2X^T\\mathbf y$, identity 3 with $A = X^TX$.' },
          { m: R`-2X^T\mathbf y + 2X^TX\boldsymbol\beta = \mathbf 0`, t: 'Set the gradient to the zero vector.' },
          { m: R`X^TX\boldsymbol\beta = X^T\mathbf y`, why: 'Divide by 2 and rearrange: the Normal Equation.' },
          { m: R`(X^TX)^{-1}X^TX\boldsymbol\beta = (X^TX)^{-1}X^T\mathbf y`, why: 'Left-multiply both sides by $(X^TX)^{-1}$ (requires it to exist).' }
        ],
        result: R`\boldsymbol\beta^* = (X^TX)^{-1}X^T\mathbf y`,
        after: 'Second-derivative (Hessian) $= 2X^TX$, which is positive semidefinite, confirming a minimum (convex loss).' }
    ],
    formulas: [
      { name: 'Normal Equation', tex: R`X^TX\boldsymbol\beta = X^T\mathbf y`, sym: '(m+1) linear equations in (m+1) unknowns.', when: 'Solve with `np.linalg.solve` (more stable than inverting).' },
      { name: 'Closed-form OLS', tex: R`\boldsymbol\beta^* = (X^TX)^{-1}X^T\mathbf y`, sym: 'Needs $X^TX$ invertible.', when: 'Small/medium number of features.' },
      { name: 'Gradient of the OLS loss', tex: R`\nabla L = 2X^TX\boldsymbol\beta - 2X^T\mathbf y = -2X^T(\mathbf y - X\boldsymbol\beta)`, sym: 'Reused for gradient descent in L5.', when: 'GD updates.' }
    ],
    examples: [
      { title: 'Normal equation for a simple line (worked)', body: R`Points (1, 2), (2, 3), (3, 5). $X = \begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}$, $\mathbf y = [2,3,5]^T$.
- $X^TX = \begin{bmatrix}3&6\\6&14\end{bmatrix}$, $\det = 42 - 36 = 6$.
- $(X^TX)^{-1} = \frac16\begin{bmatrix}14&-6\\-6&3\end{bmatrix}$.
- $X^T\mathbf y = [2+3+5,\ 2+6+15]^T = [10, 23]^T$.
- $\beta_0 = (14\cdot10 - 6\cdot23)/6 = 2/6 = 1/3$; $\beta_1 = (-6\cdot10 + 3\cdot23)/6 = 9/6 = 1.5$.

Check with L3: $\bar x = 2$, $\bar y = 10/3$, $S_{xy} = 3$, $S_{xx} = 2$ → $m = 1.5$, $c = 10/3 - 3 = 1/3$ ✓. SLR really is MLR with one feature.` }
    ],
    code: [{ title: 'Normal equation step by step; sklearn & lstsq', scratch: 'L04_normal_equation_scratch.py', lib: 'L04_normal_equation_sklearn.py', more: [['Course lab: fit_multiple_lr_beta', 'L04_lab_fit_multiple_lr_beta.py']] }],
    traps: [
      'Order matters: $(X^TX)^{-1}X^T\\mathbf y$, not $X^T(X^TX)^{-1}\\mathbf y$ or $(X^TX)^{-1}\\mathbf yX^T$.',
      'GD and the normal equation reach the **same** β* on the same convex loss (P11(f) is False).',
      'Adding a feature **cannot increase** training TSE but may leave it unchanged (P11(g) False because of "always reduces").',
      'In code prefer `np.linalg.solve(X.T @ X, X.T @ y)` or `lstsq` over `inv`; same answer, better numerics.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'The Normal Equation is:', options: [R`$X\boldsymbol\beta = \mathbf y^T$`, R`$X^TX\boldsymbol\beta = X^T\mathbf y$`, R`$XX^T\boldsymbol\beta = \mathbf y$`, R`$\boldsymbol\beta = X^T\mathbf y$`], answer: 1,
        sol: 'Setting $\\nabla L = -2X^T\\mathbf y + 2X^TX\\boldsymbol\\beta = 0$.', why: ['Wrong shapes.', 'Correct.', 'Wrong product.', 'Missing $(X^TX)^{-1}$.'] },
      { type: 'mcq', diff: 'M', q: R`$\partial L/\partial\boldsymbol\beta$ for $L = \mathbf y^T\mathbf y - 2\mathbf y^TX\boldsymbol\beta + \boldsymbol\beta^TX^TX\boldsymbol\beta$ is:`, options: [R`$-2X^T\mathbf y + 2X^TX\boldsymbol\beta$`, R`$-2\mathbf y^TX + X^TX\boldsymbol\beta$`, R`$2X^TX$`, R`$\mathbf y^T\mathbf y - 2X^T\mathbf y$`], answer: 0,
        sol: 'Identities 1–3 term by term.', why: ['Correct.', 'Wrong shape and missing 2.', 'That is the Hessian.', 'Constant does not survive differentiation.'] },
      { type: 'int', diff: 'M', q: 'Points (1, 2), (2, 3), (3, 5). Using the normal equation, what is the slope β₁?', answer: 1.5, tol: 0.001, round: '1 decimal', verify: '(-6*10+3*23)/6',
        sol: '$X^TX = [[3,6],[6,14]]$, det 6, $X^T\\mathbf y = [10, 23]$. $\\beta_1 = (-60 + 69)/6 = $ **1.5**.' },
      { type: 'mcq', diff: 'M', q: 'Gradient descent (converged) and the normal equation are both applied to the same OLS problem. They give:', options: ['different β*, GD is more accurate', 'the same β* (same convex loss)', 'different β*, OLS is biased', 'GD always diverges'], answer: 1,
        sol: 'P11(f) False: one convex loss, one minimum.', why: ['No.', 'Correct.', 'No.', 'Only with a too-large learning rate.'] },
      { type: 'mcq', diff: 'M', q: 'Is "adding more features always reduces the training TSE" true?', options: ['True', 'False: TSE cannot increase, but it may stay unchanged', 'False: it always increases', 'True, and it always improves test error'], answer: 1,
        sol: 'P11(g): the old model is still available (new coefficient = 0), so training TSE cannot go up, but "always reduces" is too strong.', why: ['Too strong.', 'Correct.', 'No.', 'Test error can get worse (overfitting).'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[1, 1], [1, 2], [1, 3]], float); y = np.array([2, 3, 5], float)
b = np.linalg.solve(X.T @ X, X.T @ y)
print(np.round(b, 3))`, answer: '[0.333 1.5  ]',
        sol: 'β = [1/3, 1.5]. NumPy prints the rounded array with aligned widths: `[0.333 1.5  ]`.' }
    ],
    source: 'Worksheet L4 pp.9, 11–14; ESL §3.2.'
  },
  /* ---------------------------------------------------------------- L04.7 */
  {
    id: 'L04.7', title: 'When it fails: invertibility, multicollinearity, O(k³) cost', badge: 'class', pages: '10–11', ws: 'Sections 12–14',
    concept: R`
**When does $\boldsymbol\beta^* = (X^TX)^{-1}X^T\mathbf y$ work?** $(X^TX)^{-1}$ must exist, which requires the **columns of X to be linearly independent**. If $\det(X^TX) = 0$, $X^TX$ is **singular** and has no inverse.

:::warn Multicollinearity
If any column of X is a linear combination of other columns, $X^TX$ is singular. This is **multicollinearity**, and the closed-form solution breaks down (proof in Lecture 8).
:::

**Computational limitation.** $X^TX$ is $(m+1)\times(m+1)$. Inverting a $k\times k$ matrix costs about $O(k^3)$. With $m = 10{,}000$ features: $10{,}000^3 = 10^{12}$ operations (one trillion).

:::key Key insight
With many features the closed form becomes impractical → use **iterative** methods such as gradient descent (Lecture 5).
:::

**Why $O(k^3)$? (Section 14)** Gauss–Jordan elimination on the augmented matrix $[A\,|\,I]$ has three nested loops: outer over $k$ pivot columns, middle over $k$ rows per pivot, inner over $\sim 2k$ elements per row (augmented). Total $k\cdot k\cdot 2k = 2k^3 \Rightarrow O(k^3)$.

**PRACTICE P9.** (a) Features: temperature, humidity, and **temperature + humidity**. OLS? **No.** The third column is the sum of the first two, so $X^TX$ is singular: **perfect multicollinearity**. (b) $m = 100{,}000$ features at $10^9$ ops/s: $(10^5)^3 = 10^{15}$ ops → $10^6$ s ≈ **11.6 days**. Not practical → **gradient descent**. (c) Two reasons not to "always use OLS": $X^TX$ may be **singular or numerically unstable**; inversion costs **$O(m^3)$**.`,
    deriv: [
      { id: 'D04-cubic', title: 'Counting operations in Gauss–Jordan inversion', badge: 'class',
        steps: [
          { m: R`[A \mid I]\ \longrightarrow\ [I \mid A^{-1}]`, t: 'Row-reduce the augmented k × 2k matrix.' },
          { m: R`\text{outer loop: } k \text{ pivot columns}`, why: 'Each column needs its own pivot.' },
          { m: R`\text{middle loop: } \approx k \text{ rows eliminated per pivot}`, why: 'Every other row gets a zero in the pivot column.' },
          { m: R`\text{inner loop: } \approx 2k \text{ entries updated per row}`, why: 'Rows of the augmented matrix have 2k entries.' },
          { m: R`k \times k \times 2k = 2k^3`, t: 'Multiply the loop counts.' }
        ],
        result: R`\text{cost of inverting a } k\times k \text{ matrix} = O(k^3)`,
        after: 'Forming $X^TX$ itself costs $O(nk^2)$. For huge k the cubic term dominates.' }
    ],
    formulas: [
      { name: 'Invertibility condition', tex: R`(X^TX)^{-1}\ \text{exists} \iff \det(X^TX)\neq 0 \iff \text{columns of } X \text{ independent}`, sym: 'Rank of X = m + 1.', when: 'Multicollinearity questions.' },
      { name: 'Inversion cost', tex: R`\approx 2k^3 = O(k^3),\quad k = m+1`, sym: 'k = size of $X^TX$.', when: '"How long would it take?" numericals.' }
    ],
    plots: [
      { id: 'P04-cubic', title: 'Operations to invert X^T X grow as k³ (log scale)', notice: 'Each 10× more features costs 1,000× more work. At 10⁹ ops/s, k = 10⁵ needs about 10⁶ s ≈ 11.6 days.',
        spec: { type: 'xy', w: 520, h: 290, xlim: [1, 5.2], ylim: [0, 16], xlabel: 'log10(number of features k)', ylabel: 'log10(operations ≈ k³)', xticks: [1, 2, 3, 4, 5], yticks: [0, 3, 6, 9, 12, 15],
          series: [{ t: 'fn', f: x => 3 * x, c: 's4', w: 2.5 }, { t: 'hline', y: 9, c: 's7', dash: true }, { t: 'text', x: 1.8, y: 10, s: '10⁹ ops ≈ 1 second' }, { t: 'scatter', pts: [[4, 12], [5, 15]], c: 's4', labels: ['10⁴: 10¹² (~17 min)', '10⁵: 10¹⁵ (~11.6 days)'] }] } }
    ],
    examples: [
      { title: 'Spotting a singular XᵀX (worked)', body: R`$X = \begin{bmatrix}1&1&2\\1&2&3\\1&3&4\end{bmatrix}$: column 3 = column 1 + column 2. Then $X\mathbf c = \mathbf 0$ for $\mathbf c = [1, 1, -1]^T$, so $X^TX\mathbf c = \mathbf 0$ too; $X^TX$ has a non-trivial null space, $\det(X^TX) = 0$, and the inverse does not exist. Infinitely many β give the same predictions.` }
    ],
    code: [{ title: 'det(XᵀX) = 0 for collinear columns (end of the script)', scratch: 'L04_normal_equation_scratch.py', lib: 'L04_normal_equation_sklearn.py', note: '`lstsq` still returns *a* solution for collinear data (the minimum-norm one), but it is not unique.' }],
    traps: [
      'Multicollinearity in the worksheet sense = a column is an (exact) **linear combination** of others, not merely "slightly correlated" (P11(e) False).',
      'The cost depends on the number of **features** (size of $X^TX$), not mainly on the number of rows.',
      'An exact sum or a scaled copy of another column (e.g. temperature in °C and in °F) both cause singularity.'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A dataset has columns temperature, humidity and (temperature + humidity). Applying OLS:', options: ['works perfectly', 'fails: XᵀX is singular (perfect multicollinearity)', 'works but is slow', 'requires feature scaling only'], answer: 1,
        sol: 'P9(a): the third column is a linear combination of the others.', why: ['No.', 'Correct.', 'Speed is not the issue.', 'Scaling does not fix dependence.'] },
      { type: 'int', diff: 'M', q: 'A computer does 10⁹ operations per second. Inverting XᵀX for 100,000 features costs about (10⁵)³ operations. How many **days** (2 decimals)?', answer: 11.57, tol: 0.02, round: '2 decimals', verify: '(1e5**3/1e9)/86400',
        sol: '$10^{15}/10^9 = 10^6$ s; $10^6/86{,}400 \\approx$ **11.57 days** (worksheet: ≈ 11.6).' },
      { type: 'int', diff: 'E', q: 'Using the worksheet count $k\\cdot k\\cdot 2k$, how many operations to invert a **10 × 10** matrix?', answer: 2000, tol: 0, round: 'Exact', verify: '10*10*2*10',
        sol: '$2k^3 = 2(1000) = $ **2,000**.' },
      { type: 'mcq', diff: 'M', q: 'Which condition guarantees $(X^TX)^{-1}$ exists?', options: ['n > 100', 'Columns of X are linearly independent', 'All features are positive', 'y has no outliers'], answer: 1,
        sol: 'Independent columns ⇔ full column rank ⇔ $X^TX$ invertible.', why: ['Number of rows alone is not enough.', 'Correct.', 'Irrelevant.', 'Irrelevant.'] },
      { type: 'msq', diff: 'M', q: 'Why is "always use the closed-form OLS" bad advice? (select all)', options: ['XᵀX may be singular or numerically unstable', 'Inversion costs O(m³), impractical for many features', 'OLS minimises absolute error, not squared error', 'The closed form gives a different optimum from GD'], answer: [0, 1],
        sol: 'P9(c).', why: ['Correct.', 'Correct.', 'False.', 'False.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
X = np.array([[1, 1, 2], [1, 2, 3], [1, 3, 4]], float)
print(np.linalg.matrix_rank(X), np.linalg.matrix_rank(X.T @ X))`, answer: '2 2',
        sol: 'Column 3 = column 1 + column 2, so only 2 independent columns. $X^TX$ has the same rank, so it is 3 × 3 with rank 2 → singular.' }
    ],
    source: 'Worksheet L4 pp.10–11; Golub & Van Loan, *Matrix Computations* §3.'
  },
  /* ---------------------------------------------------------------- L04.8 */
  {
    id: 'L04.8', title: 'Full OLS by hand (HOMEWORK P10)', badge: 'class', pages: '12–13', ws: 'Numerical practice, Reflect 1–2',
    concept: R`
| Student | $x_1$ | $x_2$ | $y$ |
|---|---|---|---|
| A | 1 | 0 | 2 |
| B | 0 | 1 | 3 |
| C | 1 | 1 | 6 |

1. $X = \begin{bmatrix}1&1&0\\1&0&1\\1&1&1\end{bmatrix}$, $\mathbf y = [2, 3, 6]^T$.
2. $X^T = \begin{bmatrix}1&1&1\\1&0&1\\0&1&1\end{bmatrix}$.
3. $X^TX$: (1,1) = 3, (1,2) = 1 + 0 + 1 = 2, (1,3) = 0 + 1 + 1 = 2, (2,2) = 2, (2,3) = 0 + 0 + 1 = 1, (3,3) = 2 → $X^TX = \begin{bmatrix}3&2&2\\2&2&1\\2&1&2\end{bmatrix}$ (symmetric ✓).
4. $X^T\mathbf y = [2+3+6,\ 2+0+6,\ 0+3+6]^T = [11, 8, 9]^T$.
5. $\det = 3(4-1) - 2(4-2) + 2(2-4) = 9 - 4 - 4 = $ **1** → invertible.
6. $(X^TX)^{-1} = \begin{bmatrix}3&-2&-2\\-2&2&1\\-2&1&2\end{bmatrix}$ (cofactors / det; det = 1).
7. $\boldsymbol\beta^* = (X^TX)^{-1}X^T\mathbf y$: $\beta_0 = 33 - 16 - 18 = -1$; $\beta_1 = -22 + 16 + 9 = 3$; $\beta_2 = -22 + 8 + 18 = 4$.
8. **$\hat y = -1 + 3x_1 + 4x_2$.**
9. Verify: A: −1 + 3 = 2 ✓; B: −1 + 4 = 3 ✓; C: −1 + 3 + 4 = 6 ✓.

**Reflect 1.** 3 points and 3 parameters → **perfect fit** (3 equations, 3 unknowns). With 100 points and 3 parameters, generally **no** perfect fit: there are more equations than unknowns, so OLS finds the best compromise. A perfect fit needs $n \le m+1$.

**Reflect 2.** Why prefer slow gradient descent? With $m = 10{,}000$ features the inverse costs ~$10^{12}$ operations, and $X^TX$ may be ill-conditioned. GD needs only matrix–vector products per step.`,
    formulas: [
      { name: '3×3 determinant (first row expansion)', tex: R`\det A = a_{11}(a_{22}a_{33}-a_{23}a_{32}) - a_{12}(a_{21}a_{33}-a_{23}a_{31}) + a_{13}(a_{21}a_{32}-a_{22}a_{31})`, sym: 'Cofactor expansion.', when: 'Checking invertibility by hand.' },
      { name: 'Inverse via adjugate', tex: R`A^{-1} = \frac{1}{\det A}\operatorname{adj}(A)`, sym: 'adj = transpose of the cofactor matrix.', when: 'Hand inversion (2×2: swap diagonal, negate off-diagonal).' },
      { name: '2×2 inverse', tex: R`\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1} = \frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}`, sym: '', when: 'SLR via the normal equation.' }
    ],
    examples: [
      { title: 'Cofactors of XᵀX (worked)', body: R`$A = \begin{bmatrix}3&2&2\\2&2&1\\2&1&2\end{bmatrix}$.
- $C_{11} = 2\cdot2 - 1\cdot1 = 3$, $C_{12} = -(2\cdot2 - 1\cdot2) = -2$, $C_{13} = 2\cdot1 - 2\cdot2 = -2$
- $C_{22} = 3\cdot2 - 2\cdot2 = 2$, $C_{23} = -(3\cdot1 - 2\cdot2) = 1$, $C_{33} = 3\cdot2 - 2\cdot2 = 2$
- Symmetric, so $\operatorname{adj}(A) = C^T = C$; with $\det = 1$, $A^{-1} = C$.` }
    ],
    code: [{ title: 'HOMEWORK P10 reproduced in NumPy', scratch: 'L04_normal_equation_scratch.py', lib: 'L04_normal_equation_sklearn.py', more: [['Course lab: fit_multiple_lr_beta', 'L04_lab_fit_multiple_lr_beta.py']] }],
    traps: [
      'Check $X^TX$ is symmetric; if it is not, you multiplied wrongly.',
      'A perfect training fit with $n \\le m+1$ is **not** necessarily good (overfitting, P11(i)).',
      'The 1s column belongs in X for the hand method; its row in $X^T\\mathbf y$ is just $\\sum y$.'
    ],
    questions: [
      { type: 'int', diff: 'M', q: R`For P10, $X^TX = \begin{bmatrix}3&2&2\\2&2&1\\2&1&2\end{bmatrix}$. Compute its determinant.`, answer: 1, tol: 0, round: 'Exact', verify: '3*(4-1)-2*(4-2)+2*(2-4)',
        sol: '$3(3) - 2(2) + 2(-2) = 9 - 4 - 4 = $ **1**.' },
      { type: 'int', diff: 'M', q: R`P10 data: rows $(x_1,x_2,y)$ = (1,0,2), (0,1,3), (1,1,6). Compute the first entry of $X^T\mathbf y$ (with the 1s column).`, answer: 11, tol: 0, round: 'Exact', verify: '2+3+6',
        sol: 'The 1s row of $X^T$ gives $\\sum y = 2 + 3 + 6 = $ **11**.' },
      { type: 'int', diff: 'H', q: 'P10: compute the OLS coefficient **β₂** (for x₂).', answer: 4, tol: 0, round: 'Exact', verify: '-2*11+1*8+2*9',
        sol: 'Row 3 of $(X^TX)^{-1}$ is $[-2, 1, 2]$; $\\beta_2 = -2(11) + 1(8) + 2(9) = $ **4**.' },
      { type: 'int', diff: 'M', q: R`Using $\hat y = -1 + 3x_1 + 4x_2$, predict for $x_1 = 2$, $x_2 = 1$.`, answer: 9, tol: 0, round: 'Exact', verify: '-1+3*2+4*1',
        sol: '−1 + 6 + 4 = **9**.' },
      { type: 'mcq', diff: 'M', q: 'With 100 data points and 3 parameters, OLS will generally:', options: ['fit all points exactly', 'find the best least-squares compromise, not an exact fit', 'fail because n > m + 1', 'need 100 parameters'], answer: 1,
        sol: 'Reflect 1: more equations than unknowns → no exact solution in general; OLS minimises the squared error.', why: ['Only if the data are exactly linear.', 'Correct.', 'That is the normal case.', 'No.'] },
      { type: 'write', diff: 'M', q: 'Write `fit_multiple_lr_beta(X, y)` that adds an intercept column and returns β from the normal equation (course lab).',
        starter: 'import numpy as np\n\ndef fit_multiple_lr_beta(X, y):\n    # X: (n, m) features, y: (n,)\n    pass\n',
        ref: 'import numpy as np\n\ndef fit_multiple_lr_beta(X, y):\n    X = np.asarray(X, float); y = np.asarray(y, float)\n    Xb = np.column_stack([np.ones(len(X)), X])\n    return np.linalg.solve(Xb.T @ Xb, Xb.T @ y)',
        tests: 'b = fit_multiple_lr_beta([[1, 0], [0, 1], [1, 1]], [2, 3, 6])\nassert np.allclose(b, [-1, 3, 4])\nb2 = fit_multiple_lr_beta([[1], [2], [3]], [2, 3, 5])\nassert np.allclose(b2, [1/3, 1.5])',
        file: 'aml-practice/L04_lab_fit_multiple_lr_beta.py' }
    ],
    source: 'Worksheet L4 pp.12–14; course lab "OLS Method implementation".'
  }
  ]
});
