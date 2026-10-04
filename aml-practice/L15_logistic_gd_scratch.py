"""L15 · Batch Gradient Descent for logistic regression from scratch: gradient = X^T (p_hat - y) / n."""
import numpy as np

sigmoid = lambda z: 1 / (1 + np.exp(-z))
def bce(y, p): return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))
def grad(beta, X, y): return X.T @ (sigmoid(X @ beta) - y) / len(y)

# Worksheet Section 7: (x=1, y=0), (x=2, y=1), beta = 0, alpha = 0.4
X = np.array([[1, 1], [1, 2]], float); y = np.array([0, 1], float); beta = np.zeros(2)
p = sigmoid(X @ beta); print("p_hat =", p, " p_hat - y =", p - y)
g = grad(beta, X, y); print("gradient =", g, " BCE before =", round(bce(y, p), 3))
beta = beta - 0.4 * g; p = sigmoid(X @ beta)
print("beta after one update =", beta, " new p_hat =", np.round(p, 3), " BCE after =", round(bce(y, p), 3))

# PRACTICE P1(c), (d) and P2(b)
print("P1(c): (0.30 - 1) * (-2) =", round((0.30 - 1) * (-2), 2))
print("P1(d): contributions =", round((0.95 - 1) * 4, 2), round((0.20 - 1) * 4, 2))
print("P2(b): beta_new =", np.round(np.array([0.4, -0.1]) - 0.2 * np.array([-0.3, 0.5]), 2).tolist())

# gradient check: analytic vs numerical (central differences)
rng = np.random.default_rng(0)
Xr = np.column_stack([np.ones(50), rng.normal(size=(50, 2))]); yr = (Xr[:, 1] + 0.5 * Xr[:, 2] + rng.normal(0, 0.5, 50) > 0).astype(float)
b = rng.normal(size=3); h = 1e-6
num = [(bce(yr, sigmoid(Xr @ (b + h * e))) - bce(yr, sigmoid(Xr @ (b - h * e)))) / (2 * h) for e in np.eye(3)]
print("analytic grad:", np.round(grad(b, Xr, yr), 6).tolist())
print("numeric  grad:", np.round(num, 6).tolist())

# full training loop
b = np.zeros(3)
for it in range(3001):
    b -= 0.5 * grad(b, Xr, yr)
    if it in (0, 10, 100, 3000):
        print(f"iter {it:4d}: BCE = {bce(yr, sigmoid(Xr @ b)):.4f}")
acc = np.mean((sigmoid(Xr @ b) >= 0.5) == yr)
print("final beta =", np.round(b, 3).tolist(), " training accuracy =", acc)
