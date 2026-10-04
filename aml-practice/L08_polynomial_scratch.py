"""L8 · Polynomial regression = linear regression on new feature columns [1, x, x^2, ...] (normal equation)."""
import numpy as np

def poly_design(x, degree):
    return np.column_stack([x ** k for k in range(degree + 1)])     # [1, x, x^2, ..., x^degree]

def fit(x, y, degree):
    X = poly_design(x, degree)
    return np.linalg.lstsq(X, y, rcond=None)[0]                     # same OLS as Lecture 4

# Worksheet Section 2 dataset: project depth score -> stipend (x1000)
x = np.array([2, 4, 6, 8, 10], float); y = np.array([24, 42, 62, 91, 128], float)
print("x^2 column:", (x ** 2).tolist())
for d in [1, 2]:
    b = fit(x, y, d); pred = poly_design(x, d) @ b
    print(f"degree {d}: beta = {np.round(b, 4).tolist()}  train MSE = {np.mean((y - pred) ** 2):.4f}")

# Underfit / good / overfit on noisy quadratic data (train vs test error)
rng = np.random.default_rng(7)
xt = np.sort(rng.uniform(-3, 3, 12)); yt = xt ** 2 + rng.normal(0, 1.0, 12)
xv = np.linspace(-3, 3, 50); yv = xv ** 2 + rng.normal(0, 1.0, 50)
for d in [1, 2, 8]:
    b = fit(xt, yt, d)
    tr = np.mean((yt - poly_design(xt, d) @ b) ** 2); te = np.mean((yv - poly_design(xv, d) @ b) ** 2)
    print(f"degree {d}: columns = {d + 1}, train MSE = {tr:7.3f}, test MSE = {te:9.3f}")
