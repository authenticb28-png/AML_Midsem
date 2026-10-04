"""L9 · K-fold cross-validation and a learning curve from scratch."""
import numpy as np

rng = np.random.default_rng(0)
n = 60
x = rng.uniform(-3, 3, n); y = np.sin(x) + rng.normal(0, 0.3, n)

def design(x, d): return np.column_stack([x ** k for k in range(d + 1)])
def fit_mse(xtr, ytr, xte, yte, d):
    b = np.linalg.lstsq(design(xtr, d), ytr, rcond=None)[0]
    return np.mean((ytr - design(xtr, d) @ b) ** 2), np.mean((yte - design(xte, d) @ b) ** 2)

def kfold_scores(d, k=5):
    idx = rng.permutation(n); folds = np.array_split(idx, k); scores = []
    for i in range(k):                                  # each fold takes one turn as the validation set
        va = folds[i]; tr = np.concatenate([folds[j] for j in range(k) if j != i])
        scores.append(fit_mse(x[tr], y[tr], x[va], y[va], d)[1])
    return np.array(scores)

for d in [1, 3, 12]:
    s = kfold_scores(d)
    print(f"degree {d:2d}: fold MSEs = {np.round(s, 3).tolist()}  mean = {s.mean():.3f}  std = {s.std():.3f}")

print("learning curve (degree 9, train vs validation MSE as data grows):")
idx = rng.permutation(n); va = idx[:15]; pool = idx[15:]
for m in [20, 30, 40, 45]:
    tr = pool[:m]; a, b = fit_mse(x[tr], y[tr], x[va], y[va], 9)
    print(f"  m = {m:2d}: train MSE = {a:.3f}   validation MSE = {b:.3f}")
