# Advanced Machine Learning — MCQs

## Lectures

### Programming Paradigms, Traditional Programming, Artificial Intelligence, Machine ... - Revision — your score 9/9

**Q1.** Which of these is an example of ***semi-structured data***?
- **A.** Relational SQL organized database tables
- **B.** Raw images from cameras
- **C.** Key value object in a JSON format
- **D.** Streaming real time IoT data

**Answer:** C. Key value object in a JSON format (you chose C ✓)

**Why:** **Correct:** JSON files are classic examples of semi-structured data.

**Q2.** Which ***encoding method*** is commonly used for categorical data?
- **A.** One-hot encoding
- **B.** Dimensionality reduction encoding
- **C.** Min-max scaling encoding
- **D.** Imputation encoding

**Answer:** A. One-hot encoding (you chose A ✓)

**Why:** **Correct:** One-hot encoding converts categories into binary format.

**Q3.** Your regression model achieves MAE = 11 on crop yield prediction. The baseline (simple average) achieves MAE = 12. Training costs 15 lakh rupees. The domain is agricultural insurance where a 1-unit MAE error equals 80000 rupees in incorrect claim payouts per farm. You have 500 farms. Should you deploy the complex model?
- **A.** No - a 1-unit MAE improvement is always too small to justify any cost
- **B.** Yes - any improvement over baseline always justifies deployment
- **C.** Yes - the 1-unit MAE improvement saves 4 crore rupees annually across 500 farms, far exceeding the 15 lakh training cost
- **D.** No - MAE is not the right metric for insurance decisions; only RMSE matters

**Answer:** C. Yes - the 1-unit MAE improvement saves 4 crore rupees annually across 500 farms, far exceeding the 15 lakh training cost (you chose C ✓)

**Why:** Business metric mapping: 1 MAE unit x 80000 rupees per farm x 500 farms = 4,00,00,000 rupees (4 crore) saved annually. The training cost is 15 lakh. The ROI is strongly positive, so deployment is justified. This illustrates why technical metrics must always be translated into business value before making deployment decisions.

### Linear Regression, Post-Deployment Monitoring, Model Drift, Retraining Cycle, Si ... - Revision — your score 12/15

**Q1.** The vertical gap between a data point and the regression line is called:
- **A.** Bias
- **B.** Residual (or error)
- **C.** Slope
- **D.** Intercept

**Answer:** B. Residual (or error) (you chose B ✓)

**Why:** The vertical difference between the observed value and the predicted value is called the residual (or error).

**Q2.** Absolute error loss |e| is robust to outliers, while squared error loss e² is sensitive to outliers. Consider two models:  
**Model A:** Uses squared error loss  
**Model B:** Uses absolute error loss  
  
Both models fit the same dataset, which contains one extreme outlier. Which statement is most accurate?
- **A.** Model A will ignore the outlier completely; Model B will overfit to it
- **B.** Model A will be more strongly influenced by the outlier than Model B
- **C.** Both models will give identical predictions because they minimize error in the same way
- **D.** Model B will always have a lower total error than Model A

**Answer:** B. Model A will be more strongly influenced by the outlier than Model B (you chose B ✓)

**Why:** Squared error magnifies large residuals, making OLS much more sensitive to outliers than absolute error loss.

**Q3.** In the OLS derivation, we first solve for the intercept **c** by taking the partial derivative ∂E/∂c = 0, obtaining **c = ȳ − m·x̄**. We then substitute this expression back into E(m, c) before solving for **m**. Why is this substitution performed before optimizing the slope?
- **A.** Because c must be computed before m in all machine learning algorithms
- **B.** Because it reduces the number of independent variables from 2 to 1, simplifying the optimization to a single-variable problem
- **C.** Because the intercept has no relationship with the slope
- **D.** Because absolute error formulas require this order

**Answer:** B. Because it reduces the number of independent variables from 2 to 1, simplifying the optimization to a single-variable problem (you chose B ✓)

**Why:** Substituting c = ȳ − m·x̄ reduces the optimization from two variables to one, simplifying the derivation.

**Q4.** You are given the dataset:

| x | y |
| --- | --- |
| 2 | 6 |
| 4 | 10 |
| 6 | 14 |

  
Calculate x̄ and ȳ, and verify whether the OLS regression line passes through (x̄, ȳ). Which statement is correct?
- **A.** x̄ = 4, ȳ = 10, and the line does NOT pass through (4, 10)
- **B.** x̄ = 6, ȳ = 14, and the line passes through (6, 14)
- **C.** x̄ = 4, ȳ = 10, and the line passes through (4, 10)
- **D.** x̄ = 3, ȳ = 8, and we cannot verify without computing m and c

**Answer:** C. x̄ = 4, ȳ = 10, and the line passes through (4, 10) (you chose A ✗)

**Why:** The means are x̄ = (2+4+6)/3 = 4 and ȳ = (6+10+14)/3 = 10. Every OLS regression line passes through (x̄, ȳ).

**Q5.** The denominator of the OLS slope formula is **Σ(xᵢ − x̄)²**. Which of the following does **NOT** correctly describe this term?
- **A.** It is the sum of squared deviations of x from its mean
- **B.** It is proportional to the variance of x
- **C.** It is the covariance between x and y
- **D.** It becomes zero if and only if all xᵢ values are identical

**Answer:** C. It is the covariance between x and y (you chose C ✓)

**Why:** The denominator measures the spread (variance-related quantity) of x only. Covariance involves both x and y and appears in the numerator.

### Gradient Descent, Multiple Linear Regression, Normal Equation, Optimization, Gra ... - Revision — your score None/71

**Q1.** The learning rate α is a hyperparameter. Which dataset should be used to evaluate and select the best α?
- **A.** The training set
- **B.** The test set
- **C.** A held-out validation set
- **D.** Any random sample from the test set

**Answer:** _not shown by Newton_

**Q2.** Despite having multiple input features, Multiple Linear Regression is still classified as a linear model. Why?
- **A.** Because the output y is always a positive number
- **B.** Because the prediction equation \hat{y}=w\_0+w\_1x\_1+w\_2x\_2+\cdots+w\_px\_p is linear in the parameters w\_0,w\_1,w\_2,\ldots,w\_p.
- **C.** Because the design matrix X always has the same number of rows and columns
- **D.** Because the residuals are always zero when the model is trained correctly

**Answer:** _not shown by Newton_

**Q3.** If a Multiple Linear Regression model has p = 5 input features, how many learnable parameters does the model have?
- **A.** 5
- **B.** 6
- **C.** 10
- **D.** 4

**Answer:** _not shown by Newton_

**Q4.** For a dataset with p features, how many parameters are in the vector θ for a Multiple Linear Regression model?
- **A.** p parameters
- **B.** p + 1 parameters
- **C.** 2p parameters
- **D.** n parameters (where n is dataset size)

**Answer:** _not shown by Newton_

**Q5.** Consider the following linear regression dataset: <inlineMath>(1,2)</inlineMath>, <inlineMath>(2,4)</inlineMath>, <inlineMath>(3,6)</inlineMath>, and <inlineMath>(4,8)</inlineMath>. Assume the initial parameters are <inlineMath>\theta\_0 = 0</inlineMath> and <inlineMath>\theta\_1 = 0</inlineMath>, and the learning rate is <inlineMath>\alpha = 0.1</inlineMath>. Using Batch Gradient Descent, compute the average gradient over the entire dataset after one epoch. Express your answer as <inlineMath>\left(\mathrm{grad}\_{\theta\_0}, \mathrm{grad}\_{\theta\_1}\right)</inlineMath>.
- **A.** (-5, -15)
- **B.** (-2, -8)
- **C.** (-20, -60)
- **D.** (-8, -32)

**Answer:** _not shown by Newton_

**Q6.** Consider the following linear regression dataset: <inlineMath>(1,2)</inlineMath>, <inlineMath>(2,4)</inlineMath>, <inlineMath>(3,6)</inlineMath>, and <inlineMath>(4,8)</inlineMath>. Assume the initial parameters are <inlineMath>\theta\_0 = 0</inlineMath> and <inlineMath>\theta\_1 = 0</inlineMath>, and the learning rate is <inlineMath>\alpha = 0.1</inlineMath>. After computing the average gradient over the entire dataset using Batch Gradient Descent, perform the parameter update for one epoch. What are the updated parameter values? Express your answer as <inlineMath>(\theta\_0,\theta\_1)</inlineMath>.
- **A.** \theta = (0.5, 1.5)
- **B.** \theta = (0.5, 0.5)
- **C.** \theta = (-0.5, -1.5)
- **D.** \theta = (5, 15)

**Answer:** _not shown by Newton_

**Q7.** In non-convex optimization (e.g., neural networks), why can SGD's noise sometimes be beneficial?
- **A.** It guarantees convergence to the global minimum
- **B.** It can help the optimizer bounce out of shallow local minima or flat/saddle regions
- **C.** It eliminates the need to choose a learning rate
- **D.** It reduces the number of model parameters

**Answer:** _not shown by Newton_

**Q8.** When the number of features p is very large, why is explicitly computing (XTX)-1 slow? Its cost grows approximately as:
- **A.** O(p)
- **B.** O(p2)
- **C.** O(p3)
- **D.** O(log p)

**Answer:** _not shown by Newton_

**Q9.** A recommendation model is trained on 500GB of user-item logs that cannot fit entirely in RAM. Which BGD limitation does this scenario primarily illustrate?
- **A.** Slow feedback
- **B.** Memory and I/O pressure
- **C.** Redundant work
- **D.** High cost per update from large d

**Answer:** _not shown by Newton_

**Q10.** A fraud detection system must adapt immediately to new incoming transactions. Which BGD limitation is most relevant here?
- **A.** Slow feedback
- **B.** Memory and I/O pressure
- **C.** Redundant work
- **D.** Deterministic path

**Answer:** _not shown by Newton_

**Q11.** Identity 2 states that the derivative of <inlineMath>a^{T}w</inlineMath> with respect to <inlineMath>w</inlineMath> equals <inlineMath>a</inlineMath>. In the expanded loss function, the linear term is <inlineMath>-2y^{T}Xw</inlineMath>. What is the derivative of this term with respect to <inlineMath>w</inlineMath>?
- **A.** -2 \* XT \* y
- **B.** -2 \* yT \* X
- **C.** 2 \* XT \* X \* w
- **D.** The zero vector

**Answer:** _not shown by Newton_

**Q12.** After differentiating the expanded loss function and setting the gradient equal to zero, which equation is obtained?
- **A.** X \* w = y
- **B.** X^{T}Xw=X^{T}y
- **C.** w = XT \* y
- **D.** XT \* w = yT \* X

**Answer:** _not shown by Newton_

**Q13.** A dataset has <inlineMath>p=100</inlineMath> features. The closed-form OLS solution requires inverting the matrix <inlineMath>X^{T}X</inlineMath>. Approximately how many operations does this inversion require?
- **A.** 100 (linear in p)
- **B.** 10,000 (approximately p squared)
- **C.** 1,000,000 (approximately p cubed)
- **D.** 100,000,000 (approximately p to the fourth power)

**Answer:** _not shown by Newton_

**Q14.** In the Batch Gradient Descent update step, how are the multiple parameters in θ updated?
- **A.** Sequentially, using the newly updated parameters to compute gradients for the rest
- **B.** Simultaneously, using partial derivatives computed from the old parameter values
- **C.** Randomly, updating one parameter per epoch
- **D.** Only if their specific partial derivative is strictly positive

**Answer:** _not shown by Newton_

**Q15.** Which NumPy expression correctly represents the matrix-vector multiplication for computing predictions ŷ = Xθ?
- **A.** `X @ theta`
- **B.** `theta @ X.T`
- **C.** `X.T @ theta`
- **D.** `X * theta`

**Answer:** _not shown by Newton_

**Q16.** If the design matrix <inlineMath>X</inlineMath> has dimensions <inlineMath>n\times(p+1)</inlineMath>, what are the dimensions of the matrix <inlineMath>X^{T}X</inlineMath>?
- **A.** n x n
- **B.** (p+1) x n
- **C.** (p+1) x (p+1)
- **D.** n x (p+1)

**Answer:** _not shown by Newton_

**Q17.** A dataset contains 10 million nearly identical ad impressions. Which BGD limitation does this scenario create?
- **A.** Slow feedback
- **B.** Memory and I/O pressure
- **C.** Redundant work
- **D.** High cost per update

**Answer:** _not shown by Newton_

**Q18.** In the OLS derivation, when differentiating the quadratic term <inlineMath>w^{T}X^{T}Xw</inlineMath>, the identity for the derivative of a quadratic form requires the matrix to be symmetric. Why is <inlineMath>X^{T}X</inlineMath> always a symmetric matrix?
- **A.** Because X itself is always a square symmetric matrix
- **B.** Because the transpose of X^{T}X equals (X^{T}X)^{T}=X^{T}(X^{T})^{T}=X^{T}X, which is the same matrix.
- **C.** Because the column of 1s in X forces symmetry in the product
- **D.** Because the parameter vector w is always symmetric

**Answer:** _not shown by Newton_

**Q19.** A dataset has <inlineMath>3</inlineMath> features: <inlineMath>x\_1</inlineMath> (temperature in Celsius), <inlineMath>x\_2</inlineMath> (temperature in Fahrenheit), and <inlineMath>x\_3</inlineMath> (humidity). An engineer attempts to compute the OLS solution <inlineMath>w^{\*}=(X^{T}X)^{-1}X^{T}y</inlineMath> but gets an error that the matrix cannot be inverted. What is the most likely cause?
- **A.** The dataset has too many rows (n is too large) for the inverse to be computed
- **B.** The humidity feature x3 contains negative values, making the matrix singular
- **C.** Features x1 and x2 are linearly dependent (x2 = 1.8\*x1 + 32), causing multicollinearity and making XT\*X singular
- **D.** The intercept column of 1s was accidentally included twice in the design matrix

**Answer:** _not shown by Newton_

**Q20.** The proof that matrix inversion takes O(p3) time uses Gauss-Jordan elimination with three nested loops on the augmented matrix [A | I]. What does each loop iterate over?
- **A.** Outer: rows (n iterations), Middle: columns (p iterations), Inner: features (p iterations)
- **B.** Outer: columns for pivots (p iterations), Middle: rows to eliminate (p iterations), Inner: elements across the augmented row (~2p iterations)
- **C.** Outer: data points (n iterations), Middle: features (p iterations), Inner: parameters (p+1 iterations)
- **D.** Outer: elements of w (p+1 iterations), Middle: residuals (n iterations), Inner: loss function terms (3 iterations)

**Answer:** _not shown by Newton_

**Q21.** For a full-rank convex quadratic loss like Mean Squared Error (MSE), Batch Gradient Descent with an appropriately chosen learning rate will converge to:
- **A.** A random local minimum that depends on initialization
- **B.** A global minimum, which is identical to the OLS solution
- **C.** A local maximum
- **D.** An infinite loss value over time

**Answer:** _not shown by Newton_

**Q22.** In a dataset predicting scores, if attendance values are large (e.g., 70-100) and hours studied are small (e.g., 1-5), what happens during the first Batch Gradient Descent update?
- **A.** The hours coefficient changes more because small features have larger gradients
- **B.** The attendance coefficient updates much more because its larger numerical scale produces larger partial derivatives
- **C.** Both coefficients update by exactly the same amount because they share the learning rate α
- **D.** The bias term dominates, so neither feature coefficient updates

**Answer:** _not shown by Newton_

**Q23.** What is the correct vectorized Batch Gradient Descent update rule for MSE loss defined as 1/m ||Xθ - y||2?
- **A.** `θ = θ - α * XT(y - Xθ)`
- **B.** `θ = θ - α * 2/m XT(Xθ - y)`
- **C.** `θ = θ + α * 1/m X(Xθ - y)`
- **D.** `θ = θ - α * (XTX)-1XTy`

**Answer:** _not shown by Newton_

**Q24.** Which of the following is the CORRECT order of steps in the complete OLS derivation for Multiple Linear Regression?
- **A.** Define residual vector -> Write prediction equation -> Expand loss -> Set gradient to zero -> Matrix form -> Derive identities -> Solve for w\*
- **B.** Write prediction equation \hat{y}=Xw → Convert to matrix form \hat{y}=Xw → Define residual vector e=y-Xw → Write total squared error E=e^{T}e → Expand loss function → Derive matrix calculus identities → Differentiate and set the gradient to zero \frac{\partial E}{\partial w}=0 → Solve for w^{\*}=(X^{T}X)^{-1}X^{T}y.
- **C.** Derive identities -> Write prediction equation -> Define residual -> Solve for w\* -> Expand loss -> Set gradient to zero
- **D.** Convert to matrix form -> Solve for w\* -> Define residual -> Expand loss -> Derive identities -> Set gradient to zero

**Answer:** _not shown by Newton_

### Stochastic Gradient Descent, Mini-batch Gradient Descent - Revision — your score None/37

**Q1.** What exactly does SGD randomize at each iteration?
- **A.** The values of the model parameters \theta
- **B.** The learning rate \alpha
- **C.** The index i\_t of the training sample used to estimate the gradient
- **D.** The loss function itself

**Answer:** _not shown by Newton_

**Q2.** Why must the dataset be shuffled at the start of every SGD epoch?
- **A.** Shuffling speeds up matrix multiplication
- **B.** Without shuffling, consecutive updates may follow the dataset's inherent ordering pattern instead of the true learning signal
- **C.** Shuffling reduces the number of updates required per epoch
- **D.** Shuffling converts SGD into Mini-Batch GD

**Answer:** _not shown by Newton_

**Q3.** Consider the following linear regression dataset: <inlineMath>(1,2)</inlineMath>, <inlineMath>(2,4)</inlineMath>, <inlineMath>(3,6)</inlineMath>, and <inlineMath>(4,8)</inlineMath>. Assume the initial parameters are <inlineMath>\theta\_0 = 0</inlineMath> and <inlineMath>\theta\_1 = 0</inlineMath>, and the learning rate is <inlineMath>\alpha = 0.1</inlineMath>. During one epoch of Stochastic Gradient Descent (SGD), the shuffled visiting order is <inlineMath>\{\text{Sample }2,\ \text{Sample }4,\ \text{Sample }1,\ \text{Sample }3\}</inlineMath>. What are the updated parameter values immediately after the first SGD update using <inlineMath>\text{Sample }2</inlineMath>? Express your answer as <inlineMath>(\theta\_0,\theta\_1)</inlineMath>.
- **A.** (0.400, 0.800)
- **B.** (0.5, 1.5)
- **C.** (-4.000, -8.000)
- **D.** (0.840, 2.560)

**Answer:** _not shown by Newton_

**Q4.** According to the worksheet, why is the SGD gradient estimator described as 'unbiased'?
- **A.** It always points exactly toward the minimum
- **B.** Its average direction over many random sample choices equals the full-gradient direction \nabla J(\theta), even though any single draw can be far from that average
- **C.** It never changes value between iterations
- **D.** It equals zero on average

**Answer:** _not shown by Newton_

**Q5.** If the mini-batch size b = 1, Mini-Batch GD becomes mathematically identical to:
- **A.** Batch GD
- **B.** SGD, since an update occurs after every single sample
- **C.** Neither, because mini-batch always averages more than one sample
- **D.** A hybrid method distinct from both

**Answer:** _not shown by Newton_

**Q6.** For m = 1000 and batch size b = 100, how many parameter updates occur in one Mini-Batch GD epoch?
- **A.** 1000
- **B.** 100
- **C.** 10
- **D.** 1

**Answer:** _not shown by Newton_

**Q7.** Consider the following linear regression dataset: <inlineMath>(1,2)</inlineMath>, <inlineMath>(2,4)</inlineMath>, <inlineMath>(3,6)</inlineMath>, and <inlineMath>(4,8)</inlineMath>. Assume the initial parameters are <inlineMath>\theta\_0 = 0</inlineMath> and <inlineMath>\theta\_1 = 0</inlineMath>, the learning rate is <inlineMath>\alpha = 0.1</inlineMath>, and the mini-batch size is <inlineMath>b = 2</inlineMath>. The shuffled order of the samples is <inlineMath>\{\text{Sample }2,\ \text{Sample }4\}</inlineMath> followed by <inlineMath>\{\text{Sample }1,\ \text{Sample }3\}</inlineMath>. After computing the average gradient for the first mini-batch, perform one Mini-Batch Gradient Descent update. What are the updated parameter values after Mini-Batch 1? Express your answer as <inlineMath>(\theta\_0,\theta\_1)</inlineMath>.
- **A.** (0.6, 2.0)
- **B.** (0.5, 1.5)
- **C.** (0.400, 0.800)
- **D.** (0.840, 2.560)

**Answer:** _not shown by Newton_

**Q8.** Why are batch sizes like 32, 64, or 128 commonly preferred over very small sizes such as 1 or 2 in deep learning?
- **A.** They are mathematically required for gradient descent to converge
- **B.** Powers of two fit efficiently into GPU parallel architectures, improving hardware utilization the underlying math does not require them
- **C.** They guarantee zero sampling noise
- **D.** They reduce the required number of epochs to exactly one

**Answer:** _not shown by Newton_

**Q9.** A student claims: 'The loss must decrease after every single SGD update.' Which correction applies?
- **A.** This claim is correct
- **B.** The full training loss can temporarily increase after a noisy update; the important trend is the decrease over many updates, not every single step
- **C.** Loss only decreases in BGD, never in SGD
- **D.** Loss is undefined for SGD

**Answer:** _not shown by Newton_

**Q10.** Consider the following linear regression dataset: <inlineMath>(1,2)</inlineMath>, <inlineMath>(2,4)</inlineMath>, <inlineMath>(3,6)</inlineMath>, and <inlineMath>(4,8)</inlineMath>. Assume the initial parameters are <inlineMath>\theta\_0 = 0</inlineMath> and <inlineMath>\theta\_1 = 0</inlineMath>, and the learning rate is <inlineMath>\alpha = 0.1</inlineMath>. During one epoch of Stochastic Gradient Descent (SGD), the shuffled visiting order is <inlineMath>\{\text{Sample }2,\ \text{Sample }4,\ \text{Sample }1,\ \text{Sample }3\}</inlineMath>. After Step 3, the parameter values are <inlineMath>\theta = (0.700,\ 2.420)</inlineMath>. Step 4 uses <inlineMath>\text{Sample }3</inlineMath>, where <inlineMath>(x,y)=(3,6)</inlineMath>. What are the updated parameter values after completing Step 4? Express your answer as <inlineMath>(\theta\_0,\theta\_1)</inlineMath>.
- **A.** (0.504, 1.832)
- **B.** (0.700, 2.420)
- **C.** (1.960, 5.880)
- **D.** (0.840, 2.560)

**Answer:** _not shown by Newton_

**Q11.** Which implementation mistake silently turns an SGD implementation back into Batch GD?
- **A.** Forgetting to shuffle the dataset each epoch
- **B.** Accumulating gradients across the full sample loop and updating theta only once, after the loop ends
- **C.** Using a decreasing learning rate schedule
- **D.** Computing the prediction before the gradient

**Answer:** _not shown by Newton_

**Q12.** Which of these is a genuine LIMITATION of SGD specifically (not of Batch GD)?
- **A.** Requires a full-dataset scan before any update can occur
- **B.** High cost per update proportional to O(md)
- **C.** Iteration-level loss fluctuates rapidly, making a clean stopping criterion harder to define
- **D.** Cannot be used at all on large datasets

**Answer:** _not shown by Newton_

**Q13.** Consider the following linear regression dataset: <inlineMath>(1,2)</inlineMath>, <inlineMath>(2,4)</inlineMath>, <inlineMath>(3,6)</inlineMath>, and <inlineMath>(4,8)</inlineMath>. Assume the initial parameters are <inlineMath>\theta\_0 = 0</inlineMath> and <inlineMath>\theta\_1 = 0</inlineMath>, the learning rate is <inlineMath>\alpha = 0.1</inlineMath>, and the mini-batch size is <inlineMath>b = 2</inlineMath>. The shuffled order of the samples is <inlineMath>\{\text{Sample }2,\ \text{Sample }4,\ \text{Sample }1,\ \text{Sample }3\}</inlineMath>. After the first mini-batch update, the parameter values are <inlineMath>\theta = (0.6,\ 2.0)</inlineMath>. The second mini-batch consists of <inlineMath>\{\text{Sample }1,\ \text{Sample }3\}</inlineMath>. What are the updated parameter values after completing the Mini-Batch 2 update? Express your answer as <inlineMath>(\theta\_0,\theta\_1)</inlineMath>.
- **A.** (0.540, 1.880)
- **B.** (0.6, 2.0)
- **C.** (0.700, 2.420)
- **D.** (0.504, 1.832)

**Answer:** _not shown by Newton_

**Q14.** How does SGD's per-step update differ from vanilla gradient descent's, and what is the main consequence?
- **A.** SGD uses the gradient from just one training example per step, which is noisier but much cheaper, letting it take many more updates in the same time
- **B.** SGD uses a larger dataset than vanilla GD, making it slower but more accurate
- **C.** SGD never updates the parameters, only vanilla GD does
- **D.** SGD is identical to vanilla GD but uses a different loss function

**Answer:** _not shown by Newton_

**Q15.** Which method offers the best overall balance of stability, update speed, and GPU/hardware efficiency for deep learning on large datasets?
- **A.** Batch GD
- **B.** Stochastic GD
- **C.** Mini-Batch GD
- **D.** All three are equivalent in this respect

**Answer:** _not shown by Newton_

### Evaluation Metrics, Regression Metrics, R-Squared Score, Adjusted R-Squared Scor ... - Revision — your score None/44

**Q1.** Which formula correctly defines Mean Absolute Error (MAE)?
- **A.** MAE = \frac{1}{n}\sum\_{i=1}^{n} (y\_i - \hat{y}\_i)
- **B.** MAE = \frac{1}{n}\sum\_{i=1}^{n} (y\_i - \hat{y}\_i)^2
- **C.** MAE = \frac{1}{n}\sum\_{i=1}^{n} |y\_i - \hat{y}\_i|
- **D.** MAE = \sum\_{i=1}^{n} |y\_i - \hat{y}\_i|

**Answer:** _not shown by Newton_

**Q2.** A regression model has finished training and produced predictions for all students. According to the worksheet, why can we not simply look at the predictions and declare the model 'good'?
- **A.** Because evaluation needs a numerical language for judging prediction quality
- **B.** Because predictions must always be integers
- **C.** Because the model has not yet been trained
- **D.** Because actual marks are always unknown

**Answer:** _not shown by Newton_

**Q3.** For the NST Marks Dataset, the absolute errors for students A-E are 5, 2, 2, 2, and 2 marks. What is the MAE?
- **A.** 13
- **B.** 2.6
- **C.** 2.0
- **D.** 3.25

**Answer:** _not shown by Newton_

**Q4.** In the NST table, the errors for students A-E are -5, -2, 2, -2, 2. Why does MAE use the absolute value of each error instead of the raw error?
- **A.** Because absolute values are always larger
- **B.** Because raw errors are impossible to calculate
- **C.** Because marks cannot be negative
- **D.** Because positive and negative raw errors can cancel out and hide how wrong the model really is

**Answer:** _not shown by Newton_

**Q5.** Which expression correctly defines the Absolute Percentage Error (APE) for a single student i?
- **A.** APE\_i = \frac{y\_i - \hat{y}\_i}{\hat{y}\_i} \times 100
- **B.** APE\_i = \frac{|y\_i - \hat{y}\_i|}{y\_i} \times 100
- **C.** APE\_i = |y\_i - \hat{y}\_i| \times 100
- **D.** APE\_i = \frac{|y\_i - \hat{y}\_i|}{n} \times 100

**Answer:** _not shown by Newton_

**Q6.** Student B actually scored 50 marks and the model predicted 52. What is the Absolute Percentage Error (APE) for Student B?
- **A.** 4.00%
- **B.** 2.00%
- **C.** 3.85%
- **D.** 96.15%

**Answer:** _not shown by Newton_

**Q7.** According to the worksheet, what happens to MAPE if a student's actual mark y\_i is zero?
- **A.** MAPE becomes exactly zero
- **B.** MAPE automatically switches to using the predicted mark instead
- **C.** MAPE becomes undefined, since it involves division by y\_i
- **D.** MAPE is simply ignored for that student

**Answer:** _not shown by Newton_

**Q8.** How does MSE modify the individual error e\_i = y\_i - \hat{y}\_i before averaging?
- **A.** It takes the absolute value, |e\_i|
- **B.** It divides the error by y\_i
- **C.** It leaves the error unchanged
- **D.** It squares the error, e\_i^2

**Answer:** _not shown by Newton_

**Q9.** For the NST data, MSE = 8.2. What is the unit of this value, and why is this considered a limitation of MSE?
- **A.** Marks squared, because the error was squared before averaging
- **B.** Marks, because MSE is always in the same unit as the target
- **C.** Percentage, because MSE is a relative measure
- **D.** Unitless, because squaring removes the unit

**Answer:** _not shown by Newton_

**Q10.** In the Adjusted R^2 formula, what does p represent?
- **A.** The number of input features, excluding the intercept
- **B.** The number of students being evaluated
- **C.** The predicted mark for a student
- **D.** The percentage error of the model

**Answer:** _not shown by Newton_

**Q11.** Consider two possible errors: Student X has an error of 2 marks, Student Y has an error of 5 marks. Under MAE, Student Y's mistake counts as 2.5 times worse than Student X's. Under MSE (before averaging), how many times worse is Student Y's squared error than Student X's squared error?
- **A.** 2.5 times
- **B.** 6.25 times
- **C.** 5 times
- **D.** 25 times

**Answer:** _not shown by Newton_

**Q12.** Two models predict marks for students F (actual = 30) and G (actual = 90). Model X predicts 25 and 85; Model Y predicts 28 and 82. Both models have the same MAE of 5.0, but Model Y has a lower MAPE than Model X. What does this tell us?
- **A.** MAE and MAPE must always agree, so one of the calculations is wrong
- **B.** Model Y made smaller absolute errors than Model X on both students
- **C.** MAE is always a more reliable metric than MAPE
- **D.** MAPE weighs each error relative to the actual mark, so Model X's larger relative miss on the lower-scoring student F costs it more under MAPE even though the absolute errors average out the same

**Answer:** _not shown by Newton_

**Q13.** A regression model is evaluated on a small class where the Total Sum of Squares (TSS) is 500 and the Residual Sum of Squares (RSS) is 150. What is R^2 for this model?
- **A.** 0.70
- **B.** 0.30
- **C.** 0.35
- **D.** 3.33

**Answer:** _not shown by Newton_

**Q14.** A team adds a new input feature to their regression model - the last digit of each student's roll number. This feature has no real relationship with marks. According to the worksheet, what typically happens to R^2 after adding this feature?
- **A.** R^2 always decreases sharply, because irrelevant features actively harm the model
- **B.** R^2 stays exactly the same, because irrelevant features are automatically excluded
- **C.** R^2 usually stays the same or increases slightly, because the feature may fit accidental noise and reduce RSS a little
- **D.** R^2 becomes undefined, because irrelevant features break the formula

**Answer:** _not shown by Newton_

**Q15.** A model is evaluated on n=50 students using p=4 features, achieving R^2 = 0.85. What is the Adjusted R^2? (Round to 4 decimal places.)
- **A.** 0.8500
- **B.** 0.8367
- **C.** 0.8200
- **D.** 0.7500

**Answer:** _not shown by Newton_

**Q16.** Two models predict marks for the same 60 students. Model 1 uses 3 features and achieves R^2=0.750. Model 2 uses 5 features and achieves R^2=0.758. Based on Adjusted R^2, which model should be preferred?
- **A.** Model 2, since more features always improve Adjusted R^2
- **B.** Both models are identical once n is this large
- **C.** Model 2, since it has the higher R^2
- **D.** Model 1, since its Adjusted R^2 (\approx 0.7366) is higher than Model 2's (\approx 0.7356) despite Model 2's higher R^2

**Answer:** _not shown by Newton_

**Q17.** A model's errors for three students are 3, 1, and 1 marks. A fourth student is added whose error is 15 marks (an outlier). By what factor does MAE increase, and by what factor does MSE increase?
- **A.** MAE increases about 16.1 times; MSE increases 3 times
- **B.** MAE increases 5 times; MSE increases 59 times
- **C.** MAE increases 3 times; MSE increases about 16.1 times
- **D.** Both MAE and MSE increase by the same factor, since they measure the same thing

**Answer:** _not shown by Newton_

**Q18.** A model achieves R^2=0.88 on a dataset where the Total Sum of Squares (TSS) is 2500. What is the Residual Sum of Squares (RSS)?
- **A.** 300
- **B.** 2200
- **C.** 220
- **D.** 2800

**Answer:** _not shown by Newton_

**Q19.** A fraud classifier is used where missing a real fraud case is much more costly than sending a legitimate transaction for manual review. The model currently has precision = 0.90 and recall = 0.45 for the Fraud class. Which change is most directly aligned with the business objective?
- **A.** Prioritize increasing recall, even if precision decreases somewhat.
- **B.** Prioritize increasing precision, even if recall decreases.
- **C.** Use accuracy as the only evaluation metric.
- **D.** Increase specificity while ignoring false negatives.

**Answer:** _not shown by Newton_

**Q20.** A classifier's overall accuracy increases from 70% to 78% after a model change. However, recall for an operationally critical minority class falls from 80% to 55%. Which evaluation decision is most appropriate?
- **A.** Automatically choose the new model because accuracy increased.
- **B.** Reject the new model automatically because any recall decrease is unacceptable.
- **C.** Evaluate the trade-off using the cost of missing that class and inspect class-wise metrics rather than relying on accuracy alone.
- **D.** Ignore recall because it is only useful for binary classification.

**Answer:** _not shown by Newton_

**Q21.** The worksheet presents six statements, in scrambled order, that together explain why R^2 can be misleading when a new feature is added: (i) This motivates the need for Adjusted R^2. (ii) The new feature fits accidental noise patterns in the data, slightly reducing RSS. (iii) A fair metric should penalize the added complexity if the gain is negligible. (iv) We add a new feature to the regression model. (v) R^2 reports that the model has improved. (vi) R^2 = 1-\frac{RSS}{TSS} increases whenever RSS decreases, regardless of the reason. What is the correct logical order of these six statements?
- **A.** i, ii, iii, iv, v, vi
- **B.** iv, vi, ii, v, iii, i
- **C.** iv, ii, v, vi, iii, i
- **D.** iv, ii, vi, v, iii, i

**Answer:** _not shown by Newton_

**Q22.** A model predicts marks reasonably well overall: its MAE is a modest 3 marks and its RMSE is close to that, showing no extreme outliers. However, most of this model's errors happen to fall on students who scored very low (under 10 marks), while high-scoring students are predicted almost perfectly. Which metric would most clearly expose that these errors are concentrated among low-scoring students, and why?
- **A.** Adjusted R^2, because it accounts for the number of features used
- **B.** MAPE, because it divides each error by the actual mark, so the same absolute error becomes a much larger percentage for low-scoring students
- **C.** MSE, because squaring always reveals which students are low-scoring
- **D.** RMSE, because it is expressed in the same unit as the marks

**Answer:** _not shown by Newton_

### Macro Average, Weighted Average, Micro Average, Polynomial Regression, Feature T ... - Revision — your score 3/6

**Q1.** Two classification models are evaluated on the same single-label multiclass test set. Model X has 80 correct predictions out of 100, while Model Y has 85 correct predictions. Which statement must be true?
- **A.** Model Y has higher micro precision, micro recall, and micro F1 than Model X.
- **B.** Model Y has higher macro F1 than Model X.
- **C.** Model Y has higher F1 for every individual class.
- **D.** Model Y has higher weighted F1 regardless of the class distribution.

**Answer:** A. Model Y has higher micro precision, micro recall, and micro F1 than Model X. (you chose A ✓)

**Why:** In single-label multiclass classification, micro precision, micro recall, and micro F1 equal accuracy. Therefore Model Y's micro metrics must be 0.85 versus 0.80 for Model X. Macro, class-wise, and weighted metrics need not improve simply because accuracy increased.

**Q2.** A team compares two multiclass classifiers on the same data. Model A has class-wise F1 scores of 0.95, 0.90, and 0.20. Model B has scores of 0.75, 0.75, and 0.75. The three classes have similar support. Which conclusion is most defensible if every class is equally important?
- **A.** Model A is preferable because its highest class-wise F1 is larger.
- **B.** Model B is preferable because macro F1 gives each class equal influence.
- **C.** Model A is preferable because weighted F1 always rewards the weakest class most.
- **D.** The models must have identical accuracy because their F1 scores are comparable.

**Answer:** B. Model B is preferable because macro F1 gives each class equal influence. (you chose C ✗)

**Why:** When every class is equally important, macro averaging is appropriate because each class receives one equal vote. Model A's macro F1 is (0.95+0.90+0.20)/3 ≈ 0.683, while Model B's is 0.75, so Model B is better under that objective.

### Model Tuning, Independence of Errors, Multicollinearity, Population True Functio ... - Revision — your score 37/42

**Q1.** True or False: 'Irreducible error can be reduced by choosing a more complex model.' What is the correct answer and justification?
- **A.** True, because complex models fit noise as well as signal
- **B.** False, because irreducible error is inherent noise that no model can eliminate
- **C.** True, but only for decision tree models
- **D.** False, because irreducible error is equal to the bias term

**Answer:** B. False, because irreducible error is inherent noise that no model can eliminate (you chose B ✓)

**Why:** This statement is False: irreducible error is inherent noise in the system and cannot be reduced by model choice.

**Q2.** What is the expected value of the random noise term, <inlineMath>E(\epsilon)</inlineMath>?
- **A.** 0
- **B.** 1
- **C.** \sigma^2
- **D.** It varies depending on the sample drawn

**Answer:** A. 0 (you chose A ✓)

**Why:** By definition, the mean of white noise is 0, so E(\epsilon) = 0.

**Q3.** Given <inlineMath>Var(\epsilon) = \sigma^2 = E(\epsilon^2) - [E(\epsilon)]^2</inlineMath>, and knowing <inlineMath>E(\epsilon) = 0</inlineMath>, what does <inlineMath>Var(\epsilon)</inlineMath> simplify to?
- **A.** E(\epsilon)
- **B.** [E(\epsilon)]^2
- **C.** E(\epsilon^2)
- **D.** \sigma

**Answer:** C. E(\epsilon^2) (you chose C ✓)

**Why:** Because E(\epsilon)=0, the second term vanishes, leaving Var(\epsilon)=\sigma^2=E(\epsilon^2).

**Q4.** Which of the following is given as an example of an estimator?
- **A.** The irreducible error
- **B.** Linear Regression estimates
- **C.** Cross-validation
- **D.** The learning curve

**Answer:** B. Linear Regression estimates (you chose B ✓)

**Why:** Sample mean estimates, Linear Regression estimates, and Decision tree estimates are all given as examples of estimators.

**Q5.** Three people each fit a straight-line model to their own sample drawn from population data generated by <inlineMath>Y=x^2</inlineMath> plus noise. None of the lines fit their respective training data well, but all three lines look very similar to one another. What do these models exhibit?
- **A.** High Bias and Low Variance
- **B.** Low Bias and High Variance
- **C.** High Bias and High Variance
- **D.** Low Bias and Low Variance

**Answer:** A. High Bias and Low Variance (you chose A ✓)

**Why:** The straight-line models are too simple to capture the curve (High Bias), but since the 3 lines are very similar to each other, they have Low Variance.

**Q6.** Three people each increase the degree of their polynomial model until it exactly fits their own training data. The three resulting curves end up looking very different from one another. What do these models exhibit?
- **A.** High Bias and Low Variance
- **B.** High Bias and High Variance
- **C.** Low Bias and High Variance
- **D.** Low Bias and Low Variance

**Answer:** C. Low Bias and High Variance (you chose C ✓)

**Why:** These models fit their specific training data extremely well (Low Bias), but the resulting curves differ greatly from each other across the three samples (High Variance).

**Q7.** Which formula correctly gives the Bias-Variance Decomposition of MSE?
- **A.** MSE = Bias + Variance
- **B.** MSE = Bias^2 - Variance + Var(\epsilon)
- **C.** MSE = Bias + Variance^2 + Var(\epsilon)
- **D.** MSE = Bias^2 + Variance + Var(\epsilon)

**Answer:** D. MSE = Bias^2 + Variance + Var(\epsilon) (you chose D ✓)

**Why:** The Bias-Variance Decomposition result is MSE = Bias^2 + Variance + Var(\epsilon).

**Q8.** If feature x2 is exactly twice the value of feature x1 across all examples, what happens to XTX?
- **A.** It becomes the Identity matrix
- **B.** It becomes singular (not invertible) due to multicollinearity
- **C.** It becomes orthogonal
- **D.** Its dimensions change to n x p

**Answer:** B. It becomes singular (not invertible) due to multicollinearity (you chose B ✓)

**Why:** If one feature is a linear combination of another, the columns of the design matrix X are linearly dependent. This multicollinearity makes the product matrix XTX singular, meaning its inverse does not exist.

**Q9.** If <inlineMath>E[\hat{f}(x)] = 12</inlineMath> and <inlineMath>f(x) = 10</inlineMath> at a particular point x, what is the Bias?
- **A.** -2
- **B.** 0
- **C.** 22
- **D.** 2

**Answer:** D. 2 (you chose D ✓)

**Why:** Bias = E[\hat{f}(x)] - f(x) = 12 - 10 = 2.

**Q10.** What does it suggest about a model if its performance changes significantly across different cross-validation folds?
- **A.** The model has zero irreducible error
- **B.** The model is sensitive to the training data, indicating higher variance
- **C.** The model definitely has high bias
- **D.** The true function f(x) has been found

**Answer:** B. The model is sensitive to the training data, indicating higher variance (you chose B ✓)

**Why:** If performance changes significantly across folds, this suggests the model is sensitive to training data — a practical indication of higher variance.

**Q11.** What is the typical pattern of a High Bias (Underfitting) learning curve as training data size increases?
- **A.** Training error is very low but validation error is much higher
- **B.** Both errors drop rapidly to near zero
- **C.** Both training and validation errors remain high, even after adding more data
- **D.** Validation error decreases sharply while training error rises

**Answer:** C. Both training and validation errors remain high, even after adding more data (you chose C ✓)

**Why:** For High Bias, both training and validation errors remain high even after adding more data, since the model is too simple to capture the pattern.

**Q12.** Consider this Assertion-Reason pair: 'A: A linear regression model applied to a highly non-linear dataset is likely to have high bias. R: A linear model cannot capture non-linear patterns, so it will systematically underfit the data.' Which option correctly evaluates A and R?
- **A.** Both A and R are true, and R is the correct explanation of A
- **B.** Both A and R are true, but R is not the correct explanation of A
- **C.** A is true but R is false
- **D.** A is false but R is true

**Answer:** A. Both A and R are true, and R is the correct explanation of A (you chose A ✓)

**Why:** Both A and R are true, and R correctly explains why the linear model has high bias — it cannot capture non-linear patterns and hence underfits.

**Q13.** A model has <inlineMath>Bias^2 = 1</inlineMath>, Variance = 9, and <inlineMath>\sigma^2 = 2</inlineMath>. What is the total error, and which component dominates?
- **A.** Total error = 12; Bias^2 dominates
- **B.** Total error = 10; the irreducible error dominates
- **C.** Total error = 12; Variance dominates
- **D.** Total error = 3; Bias^2 and Variance contribute equally

**Answer:** C. Total error = 12; Variance dominates (you chose D ✗)

**Why:** MSE = Bias^2 + Variance + Var(\epsilon) = 1 + 9 + 2 = 12; since 9 is the largest of the three terms, the Variance component dominates.

**Q14.** A data scientist fits a degree-1 polynomial to data whose true relationship is <inlineMath>y = x^3 + 2x^2 - x + 5</inlineMath>. Based on the mismatch between model complexity and the true function's complexity, what will most likely happen?
- **A.** The model will overfit, showing low bias and high variance
- **B.** The model will be an unbiased estimator of the cubic relationship
- **C.** The model will show low bias and low variance, achieving a good fit
- **D.** The model will underfit, showing high bias and low variance, since a straight line cannot capture the cubic curve

**Answer:** D. The model will underfit, showing high bias and low variance, since a straight line cannot capture the cubic curve (you chose D ✓)

**Why:** The model will suffer from high bias and low variance and will underfit, because a degree-1 (straight-line) model is too simple to capture the cubic (x^3) relationship.

### Feature Selection, Curse of Dimensionality, Filter Methods, Variance Threshold,  ... - Revision — your score 3/3

**Q1.** What is the main goal of ***feature selection*** in ML?
- **A.** To increase the dataset size
- **B.** To retain the most important input features that helps in solving the real problem and that best describes the probability distribution of the data.
- **C.** To create new features from existing data
- **D.** To align stakeholders with project goals

**Answer:** B. To retain the most important input features that helps in solving the real problem and that best describes the probability distribution of the data. (you chose B ✓)

**Why:** **Correct:** Feature selection removes irrelevant features to boost efficiency.

### Feature Extraction, Forward Selection, Principal Component Analysis (PCA), Ortho ... - Revision — your score None/17

**Q1.** How does feature selection differ from PCA in terms of the underlying question being asked?
- **A.** Feature selection asks whether a lower-dimensional linear combination of columns is useful
- **B.** Feature selection asks which original columns should remain, while PCA asks whether the information spread across columns can be represented by newly constructed features
- **C.** Feature selection and PCA both construct entirely new axes as weighted combinations of the original columns
- **D.** Feature selection always requires computing a covariance matrix, while PCA never does

**Answer:** _not shown by Newton_

**Q2.** The centering step is written as <inlineMath>X\_c = X - \mathbf{1}\mu^T</inlineMath>. What is the purpose of this step?
- **A.** To rescale every feature to have unit variance
- **B.** To remove duplicate feature columns before analysis
- **C.** To divide each feature by its standard deviation
- **D.** To subtract the training mean of each feature so that every column of X\_c has mean zero

**Answer:** _not shown by Newton_

**Q3.** For a unit direction u and a centered observation <inlineMath>x\_i</inlineMath>, the scalar coordinate <inlineMath>z\_i = u^Tx\_i</inlineMath> represents what?
- **A.** The distance between x\_i and the origin
- **B.** The variance of the entire dataset along direction u
- **C.** The one-dimensional score of point x\_i projected onto direction u
- **D.** The eigenvalue associated with direction u

**Answer:** _not shown by Newton_

**Q4.** The equation <inlineMath>Av = \lambda v</inlineMath> describes an eigenvector v of matrix A. What does this equation mean?
- **A.** v is a direction that A rotates by 90 degrees
- **B.** v is any vector that becomes zero after the transformation A
- **C.** v is a direction whose length is always reduced to zero by A
- **D.** v is a non-zero direction that A does not rotate away from itself; it is only stretched, shrunk, or reversed by the factor \lambda

**Answer:** _not shown by Newton_

**Q5.** Why does the covariance matrix satisfy <inlineMath>S\_{jk} = S\_{kj}</inlineMath>?
- **A.** Because every covariance matrix has all entries equal to one another
- **B.** Because the matrix is always diagonal
- **C.** Because the matrix mirrors across the diagonal, reflecting that the covariance between feature j and k is the same as between k and j
- **D.** Because standardization forces this symmetry, but centering does not

**Answer:** _not shown by Newton_

**Q6.** For a unit direction u and centered data projected as <inlineMath>z = X\_c u</inlineMath>, the sample variance of z can be written as which expression?
- **A.** Var(z) = u + Su
- **B.** Var(z) = \lambda u
- **C.** Var(z) = X\_c u
- **D.** Var(z) = u^TSu

**Answer:** _not shown by Newton_

**Q7.** A high-variance lighting change in an image dominates the top principal components, while a subtle low-variance texture is what actually separates the classes. What does this illustrate about PCA?
- **A.** PCA operationalizes information as variance, so it can discard a low-variance direction even if that direction is highly predictive of the target
- **B.** PCA always preserves the features most useful for classification
- **C.** PCA cannot be applied to image data for this reason
- **D.** High variance always corresponds to useful target signal in PCA

**Answer:** _not shown by Newton_

**Q8.** Among all k-dimensional linear subspaces, what property does the top-k PCA subspace have regarding reconstruction of the original centered data?
- **A.** It maximizes the number of retained original feature columns
- **B.** It guarantees zero reconstruction error regardless of how many components are kept
- **C.** It minimizes the total squared reconstruction error, which is the same geometry as maximizing retained variance
- **D.** It always reconstructs the data using only the lowest-variance directions

**Answer:** _not shown by Newton_

**Q9.** For principal-component scores, <inlineMath>Cov(z\_r, z\_s) = v\_r^TSv\_s = \lambda\_s v\_r^Tv\_s = 0</inlineMath> for <inlineMath>r \neq s</inlineMath>. What does this result establish, and what does it not establish?
- **A.** It establishes that the component scores are statistically independent in every case
- **B.** It establishes that the eigenvalues are always equal to zero
- **C.** It establishes that all original features must be uncorrelated with each other
- **D.** It establishes that different principal-component score columns are uncorrelated (zero linear covariance), but this does not necessarily mean they are statistically independent

**Answer:** _not shown by Newton_

### Eigen values, Explained Variance Ratio, Scree Plot, Regularization, Ridge Regres ... - Revision — your score None/40

**Q1.** The standard OLS slope formula is <inlineMath>m = \frac{\sum(y\_i-\bar{y})(x\_i-\bar{x})}{\sum(x\_i-\bar{x})^2}</inlineMath>. How does the Ridge Regression slope formula <inlineMath>m = \frac{\sum(y\_i-\bar{y})(x\_i-\bar{x})}{\sum(x\_i-\bar{x})^2 + \lambda}</inlineMath> differ from it?
- **A.** The numerator is multiplied by \lambda
- **B.** The formula removes the mean-centering terms entirely
- **C.** The denominator is divided by \lambda instead of added to
- **D.** Ridge simply adds \lambda to the denominator, so because \lambda \geq 0, the denominator grows larger, driving the slope down asymptotically toward zero as \lambda \to \infty

**Answer:** _not shown by Newton_

**Q2.** What is the closed-form Normal Equation for Multiple Ridge Regression, given the unregularized OLS solution <inlineMath>W = (X^TX)^{-1}X^TY</inlineMath>?
- **A.** W = (X^TX + \lambda I)^{-1}X^TY
- **B.** W = (X^TX - \lambda I)^{-1}X^TY
- **C.** W = (X^TX)^{-1}X^TY + \lambda
- **D.** W = \lambda(X^TX)^{-1}X^TY

**Answer:** _not shown by Newton_

**Q3.** Why is Lasso Regression described as acting like an automatic Feature Selection mechanism?
- **A.** If a feature does not significantly contribute to predicting the target, Lasso forces its coefficient exactly to 0, effectively removing it from the model
- **B.** It always keeps every feature's coefficient non-zero, like Ridge Regression
- **C.** It requires the user to manually pick which features to remove
- **D.** It only works when there is exactly one input feature

**Answer:** _not shown by Newton_

**Q4.** Lasso Regression is described as creating 'sparsity' in the resulting model. What does this mean?
- **A.** The model always uses fewer training observations
- **B.** The intercept term is always removed
- **C.** The MSE term is dropped from the loss function
- **D.** Lasso can drive the coefficients of less important features exactly to zero, so the resulting weight vector has multiple zero entries

**Answer:** _not shown by Newton_

**Q5.** An overfitted linear regression model memorizes the noise and exact patterns of the training data rather than the underlying distribution. How is this typically characterized in terms of bias and variance?
- **A.** High Variance, Low Bias
- **B.** Low Variance, High Bias
- **C.** Low Variance, Low Bias
- **D.** High Variance, High Bias

**Answer:** _not shown by Newton_

**Q6.** What is regularization, as introduced to address overfitting in parametric models?
- **A.** A technique that increases the number of input features to capture more patterns
- **B.** A mathematical technique that induces an additional penalty into the model to reduce its complexity and prevent overfitting
- **C.** A technique that removes the intercept term from the regression equation
- **D.** A technique that always increases the slope coefficient to fit the data more closely

**Answer:** _not shown by Newton_

**Q7.** In the Ridge loss function <inlineMath>L\_{Ridge} = \sum\_{i=1}^{n}(y\_i-(mx\_i+b))^2 + \lambda m^2</inlineMath>, what does the hyperparameter <inlineMath>\lambda</inlineMath> control?
- **A.** The number of input features used by the model
- **B.** The mean value of the target variable
- **C.** Whether the intercept is included in the model
- **D.** The intensity of the penalty applied to the slope m

**Answer:** _not shown by Newton_

**Q8.** When a very large Ridge regularization value such as <inlineMath>\lambda = 200</inlineMath> is used, what happens to the model?
- **A.** The model fits the training data perfectly, with no bias at all
- **B.** The penalty heavily dominates the loss function, squashing the slope aggressively toward 0 so the regression line becomes essentially flat (y \approx b), underfitting the data
- **C.** The slope becomes exceptionally large, approaching infinity
- **D.** The penalty term has no effect on the slope at all

**Answer:** _not shown by Newton_

**Q9.** In a two-feature housing example where bedroom-area and washroom-area rise together, the covariance matrix produces eigenpairs <inlineMath>v\_1=(1/\sqrt{2})[1,1]^T</inlineMath> with <inlineMath>\lambda\_1=8</inlineMath> and <inlineMath>v\_2=(1/\sqrt{2})[1,-1]^T</inlineMath> with <inlineMath>\lambda\_2=0</inlineMath>. What does this result mean?
- **A.** The two features are unrelated, so PCA is not applicable
- **B.** PC2 captures all of the meaningful variation in the data
- **C.** PC1 captures all of the variance (100%), since the two features share one underlying degree of freedom and there is no remaining contrast variation
- **D.** The eigenvalue of PC1 has no relationship to the variance captured along that direction

**Answer:** _not shown by Newton_

**Q10.** Given eigenvalues 4.80, 2.70, 1.30, 0.70, 0.30, and 0.12 for six principal components in descending order, what is the cumulative explained variance through the first three components?
- **A.** 89%
- **B.** 48%
- **C.** 76%
- **D.** 96%

**Answer:** _not shown by Newton_

**Q11.** Given three unregularized OLS coefficients <inlineMath>w\_1 = 5000</inlineMath>, <inlineMath>w\_2 = 1000</inlineMath>, and <inlineMath>w\_3 = 1</inlineMath>, and given that the Ridge penalty term is <inlineMath>\lambda w^2</inlineMath>, why does <inlineMath>w\_1</inlineMath> shrink fastest as Ridge regularization is applied?
- **A.** All three coefficients shrink at exactly the same rate
- **B.** Because w\_1 = 5000 contributes 25{,}000{,}000\lambda to the loss while w\_3 = 1 only contributes 1\lambda, the optimization algorithm targets the large coefficient for the most aggressive reduction
- **C.** Because smaller coefficients always contribute more to the squared penalty term
- **D.** Because \lambda only affects coefficients above 1000

**Answer:** _not shown by Newton_

**Q12.** Ridge Regression can be viewed as a hard constraint problem: minimize the OLS loss subject to <inlineMath>w\_1^2+w\_2^2 \leq r^2</inlineMath>. Geometrically, why does the technique earn the name 'Ridge' Regression?
- **A.** Because the OLS contour ellipse always passes through the origin
- **B.** Because the radius r grows without bound as \lambda increases
- **C.** Because the solution is forced to lie on the boundary, or 'ridge,' of the constraint circle, at the point where the OLS contour ellipse is tangent to that boundary
- **D.** Because the constraint region has no boundary at all

**Answer:** _not shown by Newton_

**Q13.** A dataset has hundreds of columns, and many are suspected to be useless or highly correlated. Which regularization method is preferred in this scenario, and why?
- **A.** Ridge, because it never removes any features from the model
- **B.** Neither method should be used with high-dimensional data
- **C.** Ridge, because it is only useful when there is exactly one input feature
- **D.** Lasso, because it drops the irrelevant columns, simplifying the model and making it easier to interpret

**Answer:** _not shown by Newton_

**Q14.** According to the practical heuristic for applying Ridge Regression, when does Ridge Regression become genuinely useful?
- **A.** When the number of input features is N \geq 2, since Ridge manages multicollinearity and overfitting potential in multi-feature spaces
- **B.** Only when there is exactly one input feature (Simple Linear Regression)
- **C.** Only when the target variable is categorical
- **D.** Only when the regularization hyperparameter is set to exactly zero

**Answer:** _not shown by Newton_

**Q15.** Given eigenvalues [6, 2, 1, 0.5] with a total variance of 9.5, the cumulative explained variance ratios are approximately 63.2%, 84.2%, 94.7%, and 100% for k = 1, 2, 3, and 4. What is the smallest k that retains at least 90% of the total variance?
- **A.** k = 1
- **B.** k = 2
- **C.** k = 3
- **D.** k = 4

**Answer:** _not shown by Newton_

**Q16.** For centered observations <inlineMath>x\_1=[-1,-1]^T</inlineMath>, <inlineMath>x\_2=[0,0]^T</inlineMath>, <inlineMath>x\_3=[1,1]^T</inlineMath>, the covariance matrix is <inlineMath>S=\begin{bmatrix}1 & 1\\1 & 1\end{bmatrix}</inlineMath> with eigenvalues 2 and 0. What is the explained variance ratio of PC1, and is one-dimensional compression lossless?
- **A.** PC1 explains 50% of the variance, and compression loses half the information
- **B.** PC1 explains 100% of the variance, so the centered points can be represented on one line without loss
- **C.** PC1 explains 0% of the variance, since the eigenvalue of PC2 is larger
- **D.** The explained variance ratio cannot be determined without knowing the eigenvectors

**Answer:** _not shown by Newton_

**Q17.** For the Lasso update equation when <inlineMath>m > 0</inlineMath>, suppose the OLS part evaluates to <inlineMath>100/50 = 2</inlineMath>. If the regularization hyperparameter is increased to <inlineMath>\lambda = 50</inlineMath>, the numerator becomes <inlineMath>100 - 50 = 50</inlineMath>. What is the resulting value of <inlineMath>m</inlineMath>?
- **A.** m = 2
- **B.** m = 0
- **C.** m = 50/50 = 1
- **D.** m = 100

**Answer:** _not shown by Newton_

**Q18.** Continuing the same Lasso example, if <inlineMath>\lambda</inlineMath> is increased to 100, the numerator becomes <inlineMath>100-100=0</inlineMath>, giving <inlineMath>m=0</inlineMath>. If <inlineMath>\lambda</inlineMath> is pushed further to 150, the formula for the <inlineMath>m>0</inlineMath> case would output a negative number. What does the optimization algorithm do in this situation?
- **A.** It allows m to become negative, since the formula must always be trusted
- **B.** It restarts the entire derivation using a different loss function
- **C.** It increases \lambda further until the negative result becomes positive again
- **D.** It recognizes that the negative output violates the assumption m>0 used to derive the formula, and halts exactly at m=0

**Answer:** _not shown by Newton_

**Q19.** Why does Lasso (L1) force coefficients exactly to zero, while Ridge (L2) only pushes them close to zero?
- **A.** Because Ridge places \lambda in the numerator as a subtractive term, while Lasso places it in the denominator as a scaling factor
- **B.** Because Lasso's \lambda acts as a constant subtractive/additive penalty in the numerator of the coefficient update equation, forcefully zeroing the coefficient once \lambda surpasses the feature's inherent correlation with the target, whereas Ridge's \lambda sits in the denominator and only asymptotically shrinks the coefficient
- **C.** Because Lasso and Ridge use mathematically identical update equations
- **D.** Because Ridge's penalty term is undifferentiable at zero, while Lasso's penalty term is always smooth

**Answer:** _not shown by Newton_

**Q20.** For the Lasso case when <inlineMath>m < 0</inlineMath>, suppose the OLS part is <inlineMath>-100/50 = -2</inlineMath>. As <inlineMath>\lambda</inlineMath> increases to 100, the numerator becomes <inlineMath>-100+100=0</inlineMath>, giving <inlineMath>m=0</inlineMath>. If <inlineMath>\lambda</inlineMath> is pushed to 150, the formula outputs a positive value of <inlineMath>m=1</inlineMath>. What does this reveal?
- **A.** That the m<0 formula remains valid for any output, positive or negative
- **B.** That Lasso coefficients can freely switch sign without any boundary condition
- **C.** That this behavior only occurs for the intercept term, not the slope
- **D.** That the positive output violates the starting assumption m<0, so the algorithm clips the value and the coefficient stops exactly at 0, mirroring the same clipping behavior seen for m>0

**Answer:** _not shown by Newton_

### Time Series Modelling, Time Series Data, Time Series Components, Trend, Seasonal ... - Revision — your score 12/12

**Q1.** In classical Machine Learning models such as Linear Regression, why does shuffling the order of rows in a dataset of house prices not change the model's predictions?
- **A.** Because the observations are assumed to be Independent and Identically Distributed (I.I.D.), so the order of rows does not matter
- **B.** Because Linear Regression automatically re-sorts the data by timestamp before training
- **C.** Because house price datasets always contain a hidden time column
- **D.** Because shuffling only affects classification models, not regression models

**Answer:** A. Because the observations are assumed to be Independent and Identically Distributed (I.I.D.), so the order of rows does not matter (you chose A ✓)

**Why:** Classical Machine Learning assumes observations are Independent and Identically Distributed (I.I.D.), so each row is an isolated, standalone event and the order of rows does not matter at all.

**Q2.** Why can standard Cross-Validation techniques like K-Fold cause a problem when applied directly to time series data?
- **A.** K-Fold requires more computational power than time series models can handle
- **B.** K-Fold only works when the dataset has fewer than 100 rows
- **C.** A random split could train on data from a later time (e.g. 2026) to predict an earlier time (e.g. 2024), violating the arrow of time and causing data leakage
- **D.** K-Fold cannot be used on any dataset that contains a timestamp column

**Answer:** C. A random split could train on data from a later time (e.g. 2026) to predict an earlier time (e.g. 2024), violating the arrow of time and causing data leakage (you chose C ✓)

**Why:** If a time series is randomly split, training data from a later time period could be used to predict an earlier time period, violating the arrow of time. This is called data leakage.

**Q3.** What does the 'Seasonality' component of a time series represent?
- **A.** The long-term upward or downward trajectory of the data
- **B.** Short-term, repeating cycles tied to specific timeframes, such as electricity usage dropping every weekend
- **C.** A constant intercept added to every observation
- **D.** The unpredictable forecast error at a single time step

**Answer:** B. Short-term, repeating cycles tied to specific timeframes, such as electricity usage dropping every weekend (you chose B ✓)

**Why:** Seasonality refers to short-term, repeating cycles tied to specific timeframes, such as the weekend drop in electricity usage or the summer spike in AC sales, repeating at known, fixed frequencies.

**Q4.** In Time Series forecasting, what is a 'Lag'?
- **A.** The constant intercept term in a regression equation
- **B.** The random shock or forecast error at the current time step
- **C.** A past observation, such as yesterday's value being Lag 1 (t-1) and the value from a week ago being Lag 7 (t-7)
- **D.** The correlation between two unrelated variables like Height and Weight

**Answer:** C. A past observation, such as yesterday's value being Lag 1 (t-1) and the value from a week ago being Lag 7 (t-7) (you chose C ✓)

**Why:** A Lag is a past observation of the series: if today is time t, yesterday's observation (t-1) is Lag 1, and the observation from a week ago (t-7) is Lag 7.

**Q5.** What is the Auto Regression equation of order p, denoted AR(p)?
- **A.** y\_t = c + \epsilon\_t + \theta\_1 \epsilon\_{t-1} + \dots + \theta\_q \epsilon\_{t-q}
- **B.** y'\_{t} = y\_{t} - y\_{t-1}
- **C.** y\_t = c \times \phi\_1 y\_{t-1}
- **D.** y\_t = c + \phi\_1 y\_{t-1} + \phi\_2 y\_{t-2} + \dots + \phi\_p y\_{t-p} + \epsilon\_{t}

**Answer:** D. y\_t = c + \phi\_1 y\_{t-1} + \phi\_2 y\_{t-2} + \dots + \phi\_p y\_{t-p} + \epsilon\_{t} (you chose D ✓)

**Why:** The AR(p) equation is y\_t = c + \phi\_1 y\_{t-1} + \phi\_2 y\_{t-2} + \dots + \phi\_p y\_{t-p} + \epsilon\_{t}, regressing the series against p of its own past values.

**Q6.** The Autocorrelation Function (ACF) at lag k measures the correlation between the original series <inlineMath>y\_t</inlineMath> and the shifted series <inlineMath>y\_{t-k}</inlineMath>, yielding a value between -1 and +1. What does a value near -1 indicate?
- **A.** No linear relationship at that lag
- **B.** The current value is identical to its value k steps ago
- **C.** A strong negative correlation: when the past went up, today tends to go down, i.e. mean-reverting behavior
- **D.** The autoregressive order p must equal k

**Answer:** C. A strong negative correlation: when the past went up, today tends to go down, i.e. mean-reverting behavior (you chose C ✓)

**Why:** A value near -1 means strong negative correlation: when the past went up, today tends to go down, indicating mean-reverting behavior.

**Q7.** What happens if the Auto Regression order p is set far too high, such as p = 365, when forecasting tomorrow's temperature?
- **A.** The model becomes overly complex, slow, and likely overfits by learning useless noise from a random day many months ago
- **B.** The model becomes too simple and misses all weekly patterns
- **C.** The model is guaranteed to become perfectly stationary
- **D.** The AR model automatically converts into an MA model

**Answer:** A. The model becomes overly complex, slow, and likely overfits by learning useless noise from a random day many months ago (you chose A ✓)

**Why:** Setting p too high, such as p = 365, forces the model to learn 365 weights, making it overly complex, slow, and likely to overfit by learning useless noise from a random day months ago.

**Q8.** Today's temperature is highly correlated with yesterday's, and yesterday's was highly correlated with the day before yesterday. Standard Autocorrelation shows that today is correlated with the day before yesterday as well. Why might this be a 'ripple effect' rather than a direct relationship, and which tool addresses this?
- **A.** It is a genuine direct relationship, and both ACF and PACF would show the same value
- **B.** The relationship is caused entirely by seasonality, and neither ACF nor PACF can measure it
- **C.** The day before yesterday may only influence today indirectly by first influencing yesterday; PACF addresses this by removing the effect of the intermediate lag to isolate the direct relationship
- **D.** This ripple effect can only be removed by increasing the MA order q

**Answer:** C. The day before yesterday may only influence today indirectly by first influencing yesterday; PACF addresses this by removing the effect of the intermediate lag to isolate the direct relationship (you chose C ✓)

**Why:** The day before yesterday may only influence today indirectly, through its effect on yesterday first a ripple effect. Standard ACF captures this total (direct plus indirect) effect, while PACF removes the influence of the intermediate lag to isolate the true direct relationship.

### Classification Models, Logistic Regression, Decision boundary, Sigmoid Function, ... - Revision

_Skipped: not attempted yet and still open (opening it could start the timer). Attempt it on Newton, then rebuild._

### OvR (One-vs-Rest), Multiclass Classification, Binary Cross-Entropy, Multinomial  ... - Revision — your score 19/19

**Q1.** For a single observation, the loss formula unfolds into only one active term depending on the actual label. What is the loss when y = 1, and what is it when y = 0?
- **A.** When y = 1: loss = -\ln(p); when y = 0: loss = -\ln(1-p)
- **B.** When y = 1: loss = p; when y = 0: loss = 1-p, with no logarithm involved
- **C.** The loss is always -\ln(p), regardless of the actual label
- **D.** The loss is always zero unless the prediction is exactly wrong

**Answer:** A. When y = 1: loss = -\ln(p); when y = 0: loss = -\ln(1-p) (you chose A ✓)

**Why:** When y = 1, only the first term remains active: loss = -\ln(p). When y = 0, only the second term remains active: loss = -\ln(1-p).

**Q2.** What is the compact formula for the probability assigned to the observed label of row i, combining both the <inlineMath>y\_i=1</inlineMath> and <inlineMath>y\_i=0</inlineMath> cases?
- **A.** p\_i + (1-p\_i)
- **B.** p\_i - (1-p\_i)
- **C.** p\_i \times (1-p\_i)
- **D.** p\_i^{y\_i} (1-p\_i)^{1-y\_i}

**Answer:** D. p\_i^{y\_i} (1-p\_i)^{1-y\_i} (you chose D ✓)

**Why:** The probability of the observed label for row i is p\_i^{y\_i}(1-p\_i)^{1-y\_i}. When y\_i=1, the (1-p\_i) part disappears; when y\_i=0, the p\_i part disappears.

**Q3.** How should Binary Cross-Entropy (Log Loss) be understood in relation to Maximum Likelihood Estimation?
- **A.** It is an arbitrary penalty unrelated to any probability model
- **B.** It is the negative log-likelihood of the Bernoulli model used for binary classification
- **C.** It is only used when the Normal distribution is assumed
- **D.** It is a completely separate objective that has nothing to do with likelihood

**Answer:** B. It is the negative log-likelihood of the Bernoulli model used for binary classification (you chose B ✓)

**Why:** Log Loss is not an arbitrary penalty; it is the negative log-likelihood of the Bernoulli model used for binary classification.

**Q4.** How do L2 (Ridge), L1 (Lasso), and Elastic Net regularization differ in their main effect on coefficients?
- **A.** L2 shrinks coefficients toward zero but usually does not make them exactly zero; L1 can force some coefficients exactly to zero; Elastic Net combines both to balance sparsity and smooth shrinkage
- **B.** L2 always forces coefficients exactly to zero, while L1 never does
- **C.** All three methods produce mathematically identical coefficient values
- **D.** Elastic Net is only usable when there is exactly one feature in the model

**Answer:** A. L2 shrinks coefficients toward zero but usually does not make them exactly zero; L1 can force some coefficients exactly to zero; Elastic Net combines both to balance sparsity and smooth shrinkage (you chose A ✓)

**Why:** L2/Ridge shrinks coefficients toward zero but usually does not make them exactly zero. L1/Lasso can force some coefficients exactly to zero, useful for feature selection. Elastic Net combines both, balancing sparsity and smooth shrinkage.

**Q5.** For L2 regularization, the derivative of the penalty term <inlineMath>\lambda\beta\_j^2</inlineMath> is <inlineMath>2\lambda\beta\_j</inlineMath>, so the regularized gradient becomes <inlineMath>\text{BCE gradient} + 2\lambda\beta\_j</inlineMath>. What effect does this extra term have during training?
- **A.** It has no effect on the coefficient values at all
- **B.** It pushes every coefficient toward the same fixed positive value
- **C.** It only affects the intercept \beta\_0, never the feature coefficients
- **D.** It pulls \beta\_j toward zero, with a stronger pull for larger coefficients, which is why L2 regularization shrinks coefficients smoothly

**Answer:** D. It pulls \beta\_j toward zero, with a stronger pull for larger coefficients, which is why L2 regularization shrinks coefficients smoothly (you chose D ✓)

**Why:** The extra term 2\lambda\beta\_j pulls the coefficient toward zero during training, with a stronger pull for larger coefficients, which is why L2 regularization shrinks coefficients smoothly.

**Q6.** When deriving the gradient of the one-row loss with respect to z, the chain rule gives <inlineMath>\frac{d\ell}{dz} = \frac{d\ell}{dp}\cdot\frac{dp}{dz} = \frac{(p-y)}{p(1-p)}\times p(1-p)</inlineMath>. What is the key simplification that results from this cancellation?
- **A.** The result simplifies to \frac{d\ell}{dz} = 0 for every observation
- **B.** The result simplifies to \frac{d\ell}{dz} = p - y, meaning the model's probability error appears directly as the gradient signal
- **C.** The result simplifies to \frac{d\ell}{dz} = p(1-p), independent of y
- **D.** The result simplifies to \frac{d\ell}{dz} = y, independent of p

**Answer:** B. The result simplifies to \frac{d\ell}{dz} = p - y, meaning the model's probability error appears directly as the gradient signal (you chose B ✓)

**Why:** The p(1-p) terms cancel, leaving \frac{d\ell}{dz} = p - y. This cancellation is the key simplification: the model's probability error appears directly as the gradient signal.

**Q7.** For an actual positive case (y = 1), the loss at p = 0.90 is about 0.105, while the loss at p = 0.10 is about 2.303 (since <inlineMath>-\ln(0.10) \approx 2.303</inlineMath>). Why is the second loss so much larger?
- **A.** Because the model was confidently wrong: it assigned a low probability to the class that actually occurred, and the logarithm makes confident wrong predictions very expensive
- **B.** Because p = 0.10 is mathematically impossible and always produces an error
- **C.** Because the loss formula is different when p is below 0.50
- **D.** Because y = 1 always produces a fixed loss of 2.303 regardless of p

**Answer:** A. Because the model was confidently wrong: it assigned a low probability to the class that actually occurred, and the logarithm makes confident wrong predictions very expensive (you chose A ✓)

**Why:** At p = 0.10 for an actual positive case, the model is confidently wrong: it assigned a low probability to the class that actually occurred. The logarithm in the loss formula makes such confident wrong predictions very expensive.

**Q8.** If the regularization strength <inlineMath>\lambda</inlineMath> becomes very large in Regularized Logistic Regression, what will the model prioritize, and what is the risk?
- **A.** The model will prioritize fitting the training data perfectly, risking overfitting
- **B.** The model will prioritize keeping coefficients small over fitting the data, which risks underfitting
- **C.** The model will ignore the BCE term completely and produce undefined predictions
- **D.** The model becomes immune to both overfitting and underfitting at any value of \lambda

**Answer:** B. The model will prioritize keeping coefficients small over fitting the data, which risks underfitting (you chose B ✓)

**Why:** If \lambda becomes very large, the model cares more about keeping coefficients small than about fitting the data, and the model may underfit.

## Labs

### Feature Selection, Curse of Dimensionality, Filter Methods, Variance Threshold,  ... - Revision — your score 0/3

**Q1.** If a dataset has p features and each feature's range is divided into b equal bins, how many possible grid cells result?
- **A.** b^p
- **B.** p \times b
- **C.** p^b
- **D.** b + p

**Answer:** A. b^p (you chose B ✗)

**Why:** Dividing the range of every feature into b equal bins with p features gives b^p possible grid cells, illustrating how high-dimensional space grows much faster than the number of observations.

**Q2.** What does a filter method do during the feature screening step?
- **A.** It repeatedly trains the final predictive model on many candidate subsets
- **B.** It evaluates a feature using a simple rule without repeatedly training the final predictive model
- **C.** It always requires the target variable to be present
- **D.** It searches all possible subsets exhaustively

**Answer:** B. It evaluates a feature using a simple rule without repeatedly training the final predictive model

**Why:** A filter method acts like an admission gate: it evaluates a feature using a simple rule and decides whether that feature deserves to enter the modeling stage, without repeatedly training the final predictive model.

**Q3.** What is the correct order of steps in the wrapper-method loop?
- **A.** Evaluate a subset, then generate it, then train the model on it
- **B.** Train the model on all features once, then remove the target variable
- **C.** Generate a candidate subset, train the model on it, evaluate it, then generate the next candidate
- **D.** Stop the search immediately after generating the first candidate subset

**Answer:** C. Generate a candidate subset, train the model on it, evaluate it, then generate the next candidate

**Why:** The wrapper loop generates a candidate subset, trains the chosen model on it, evaluates it using validation or cross-validation, and then generates the next candidate subset according to the search strategy.
