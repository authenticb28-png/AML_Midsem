"""L12 · Ridge and Lasso from scratch: 2-D Ridge slope, N-dim Ridge normal equation, Lasso numerator rule,
and Lasso by coordinate descent (soft-thresholding) showing exact zeros."""
import numpy as np

# 2-D Ridge slope: m = Sxy / (Sxx + lambda), c = ybar - m xbar
x = np.array([1, 2, 3, 4, 5], float); y = np.array([2, 4, 5, 4, 5], float)
Sxy = np.sum((x - x.mean()) * (y - y.mean())); Sxx = np.sum((x - x.mean()) ** 2)
print(f"Sxy = {Sxy}, Sxx = {Sxx}")
for lam in [0, 1, 10, 100, 1e6]:
    m = Sxy / (Sxx + lam); c = y.mean() - m * x.mean()
    print(f"lambda = {lam:>9}: m = {m:.6f}  c = {c:.4f}")

# PRACTICE P1(b): beta_ridge = (X^T X + lambda I)^-1 X^T y
XtX = np.array([[4, 2], [2, 4]], float); Xty = np.array([10, 6], float); lam = 2
b_ridge = np.linalg.solve(XtX + lam * np.eye(2), Xty); b_ols = np.linalg.solve(XtX, Xty)
print("ridge beta =", np.round(b_ridge, 4).tolist(), " sum sq =", round(float(b_ridge @ b_ridge), 4))
print("OLS   beta =", np.round(b_ols, 4).tolist(), " sum sq =", round(float(b_ols @ b_ols), 4))

# Singular X^T X becomes invertible after adding lambda I
S = np.array([[1, 2], [2, 4]], float)
print("det(S) =", np.linalg.det(S), " det(S + 0.1 I) =", round(np.linalg.det(S + 0.1 * np.eye(2)), 4))

# Lasso 1-D rule from the worksheet: m = (N - lambda)/D for m > 0, clipped at 0
N, D = 80.0, 40.0
for lam in [30, 80, 120]:
    raw = (N - lam) / D
    print(f"lasso lambda = {lam:3d}: formula = {raw:5.2f} -> m = {max(raw, 0.0):.2f}")
print(f"ridge lambda = 1e6: m = {N / (D + 1e6):.8f} (tiny, never exactly 0)")

# L1 and L2 penalties of w = [5, -2, 8]
w = np.array([5, -2, 8.0]); print("L1 =", np.abs(w).sum(), " L2 (sum of squares) =", (w ** 2).sum())

# Lasso by coordinate descent on standardized features: objective (1/2n)||y - Xb||^2 + alpha*||b||_1
def soft(z, t): return np.sign(z) * max(abs(z) - t, 0.0)
def lasso_cd(X, y, alpha, iters=500):
    n, p = X.shape; b = np.zeros(p); yc = y - y.mean()
    for _ in range(iters):
        for j in range(p):
            r = yc - X @ b + X[:, j] * b[j]                  # partial residual without feature j
            b[j] = soft(X[:, j] @ r / n, alpha) / (X[:, j] @ X[:, j] / n)
    return b
rng = np.random.default_rng(0)
Xr = rng.normal(size=(100, 5)); Xr = (Xr - Xr.mean(0)) / Xr.std(0)
yr = 4 * Xr[:, 0] + 2 * Xr[:, 1] + rng.normal(0, 1, 100)     # only 2 of 5 features matter
for alpha in [0.01, 0.5, 2.5, 5.0]:
    b = lasso_cd(Xr, yr, alpha)
    print(f"lasso alpha = {alpha:4}: coef = {np.round(b, 3).tolist()}  zeros = {int(np.sum(b == 0))}")
