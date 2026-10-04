"""L9 · The God's-eye experiment: true f(x) = x^2 on [-15, 10] plus noise. Draw many training samples,
fit degree 1, degree 2 and a flexible degree-8 polynomial, then MEASURE bias^2 and variance."""
import numpy as np

rng = np.random.default_rng(42)
f = lambda x: x ** 2
sigma = 15.0                          # noise std -> irreducible error sigma^2 = 225
x_test = np.linspace(-13, 8, 40)      # fixed evaluation points (inside the data range)

def fit_predict(degree, n=30):
    x = rng.uniform(-15, 10, n); y = f(x) + rng.normal(0, sigma, n)
    xs = (x + 2.5) / 12.5             # rescale to [-1, 1] for a stable high-degree fit
    coefs = np.polynomial.polynomial.polyfit(xs, y, degree)
    return np.polynomial.polynomial.polyval((x_test + 2.5) / 12.5, coefs)

for degree in [1, 2, 8]:
    preds = np.array([fit_predict(degree) for _ in range(300)])        # 300 different training sets
    mean_pred = preds.mean(axis=0)                                     # E[f_hat(x)]
    bias2 = np.mean((mean_pred - f(x_test)) ** 2)                      # (E[f_hat] - f)^2, averaged over x
    var = np.mean(preds.var(axis=0))                                   # E[(f_hat - E f_hat)^2]
    # expected test MSE on fresh noisy targets
    y_new = f(x_test) + rng.normal(0, sigma, preds.shape)
    mse = np.mean((y_new - preds) ** 2)
    print(f"degree {degree:2d}: bias^2 = {bias2:9.1f}  variance = {var:8.1f}  sigma^2 = {sigma**2:.0f}  "
          f"sum = {bias2 + var + sigma**2:9.1f}  measured MSE = {mse:9.1f}")
print("degree 1 -> high bias / low variance (underfit); degree 8 -> low bias / higher variance (overfit); degree 2 -> best")
