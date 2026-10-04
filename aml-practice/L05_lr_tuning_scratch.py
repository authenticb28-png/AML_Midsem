"""L5 · Effect of the learning rate (too small / good / too large) and choosing alpha by VALIDATION loss."""
import numpy as np

rng = np.random.default_rng(3)
x = rng.uniform(-2, 2, 40); y = 3 * x + 1 + rng.normal(0, 0.3, 40)
X = np.column_stack([np.ones_like(x), x])
Xtr, ytr, Xva, yva = X[:30], y[:30], X[30:], y[30:]

def train(alpha, epochs=50):
    th = np.zeros(2); hist = []
    for _ in range(epochs):
        th = th - alpha * (2 / len(ytr)) * Xtr.T @ (Xtr @ th - ytr)
        hist.append(np.mean((Xtr @ th - ytr) ** 2))
    return th, hist

for a in [0.001, 0.1, 0.9]:
    th, h = train(a)
    status = "diverged" if not np.isfinite(h[-1]) or h[-1] > h[0] else "decreasing"
    print(f"alpha={a:<6} train MSE after 1, 10, 50 epochs: {h[0]:9.3f} {h[9]:9.3f} {h[-1]:9.3f}  ({status})")

print("validation loss per alpha (pick the lowest):")
best = None
for a in [0.1, 0.01, 0.001]:
    th, _ = train(a, epochs=100)
    lval = float(np.mean((yva - Xva @ th) ** 2))
    print(f"  alpha={a:<6} L_val = {lval:.4f}")
    best = (lval, a) if best is None or lval < best[0] else best
print("selected alpha =", best[1])

# worksheet guided dry run: residuals 2, -1, 3
print("L_val for residuals [2,-1,3] =", round(np.mean(np.array([2, -1, 3]) ** 2), 4))
