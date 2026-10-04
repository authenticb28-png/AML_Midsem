"""L3 · Signed vs absolute vs squared error, and how one outlier pulls the squared-error (OLS) line.
The absolute-error (MAE) line is found by a brute-force grid search (it has no clean closed form)."""
import numpy as np

errors = np.array([10, 5, 4, -10, -3, -6])
print("signed total   =", errors.sum(), "(cancellation trap: errors are not zero!)")
print("absolute total =", np.abs(errors).sum())
print("squared total  =", (errors ** 2).sum())
for e in [1, 2, 3, 5, 10, 20]:
    print(f"error {e:2d}: |e| = {abs(e):2d}   e^2 = {e*e:3d}")

# 1-D MAE curve from the worksheet whiteboard: J(w) = (1/3) * sum |y_i - w x_i|, kinks at w = y_i/x_i
x1 = np.array([2.0, 1.0, 3.0]); y1 = np.array([3.0, 2.0, 9.0])
for w in [0.0, 1.5, 2.0, 2.5, 3.0, 4.0]:
    print(f"J({w}) = {np.mean(np.abs(y1 - w * x1)):.4f}")
print("kinks (y/x):", (y1 / x1).tolist(), "-> flat minimum for w in [2, 3]")

# Outlier comparison on y = 2x + 6 data with two extreme outliers
x = np.arange(1, 11, dtype=float)
y = 2 * x + 6.0
y[2] = 60.0        # outlier above
y[7] = -20.0       # outlier below
X = np.column_stack([np.ones_like(x), x])
b_ols = np.linalg.lstsq(X, y, rcond=None)[0]                 # minimises sum of squares
grid_c = np.linspace(-10, 20, 301); grid_m = np.linspace(-2, 5, 351)
best = min(((np.abs(y - (c + m * x)).sum(), c, m) for c in grid_c for m in grid_m))
print(f"OLS  (squared) line: y = {b_ols[1]:.3f} x + {b_ols[0]:.3f}   <- dragged by outliers")
print(f"MAE (absolute) line: y = {best[2]:.3f} x + {best[1]:.3f}   <- stays near the true y = 2x + 6")
