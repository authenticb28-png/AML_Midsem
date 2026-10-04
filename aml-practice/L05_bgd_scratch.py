"""L5 · Batch Gradient Descent for MLR from scratch, reproducing the NST worked example.
Loss L = (1/m)||X theta - y||^2,  gradient = (2/m) X^T (X theta - y),  theta := theta - alpha * gradient."""
import numpy as np

X = np.array([[1, 2, 60], [1, 4, 80], [1, 6, 90]], dtype=float)   # 1s, hours, attendance
y = np.array([35, 55, 70], dtype=float)
m = len(y)                                                          # number of training examples
alpha = 0.0001

def grad(theta):
    return (2 / m) * X.T @ (X @ theta - y)

theta = np.zeros(3)
print("Epoch 1")
r = X @ theta - y
print("  residual X@theta - y =", r)
print("  X^T(X@theta - y)     =", X.T @ r)
g = grad(theta); print("  gradient             =", np.round(g, 2))
theta = theta - alpha * g
print("  theta after epoch 1  =", np.round(theta, 6), "-> rounded", np.round(theta, 3))

print("Epoch 2 (worksheet uses the rounded theta = [0.011, 0.047, 0.853])")
t_r = np.array([0.011, 0.047, 0.853])
pred = X @ t_r; res = pred - y
print("  predictions =", np.round(pred, 3), " residuals =", np.round(res, 3))
g2 = (2 / m) * X.T @ res
print("  gradient    =", np.round(g2, 4))
print("  theta after epoch 2 =", np.round(t_r - alpha * g2, 6))
print("  (exact-arithmetic theta after epoch 2 =", np.round(theta - alpha * grad(theta), 6), ")")

# Why attendance moved most: its column is ~20x larger than hours. Standardise, then train longer.
mu, sd = X[:, 1:].mean(0), X[:, 1:].std(0)
Xs = np.column_stack([np.ones(m), (X[:, 1:] - mu) / sd])
th = np.zeros(3)
for epoch in range(20000):
    th -= 0.1 * (2 / m) * Xs.T @ (Xs @ th - y)
print("standardised features, alpha=0.1, 20000 epochs: theta =", np.round(th, 4), " MSE =", round(float(np.mean((Xs @ th - y) ** 2)), 6))
ols = np.linalg.lstsq(Xs, y, rcond=None)[0]
print("closed-form OLS on the same features        :", np.round(ols, 4), "(GD converged to the same optimum)")
