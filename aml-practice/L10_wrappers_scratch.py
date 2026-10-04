"""L10 · Wrapper methods from scratch: forward selection and backward elimination scored by k-fold CV R^2."""
import numpy as np
from itertools import combinations

rng = np.random.default_rng(5)
n, p = 80, 4
X = rng.normal(size=(n, p))
y = 3 * X[:, 0] + 2 * X[:, 3] + 0.5 * X[:, 2] + rng.normal(0, 1, n)      # f1, f4 strong, f3 weak, f2 useless
folds = np.array_split(rng.permutation(n), 5)

def cv_r2(cols):
    if not cols: return 0.0
    scores = []
    for i in range(5):
        va = folds[i]; tr = np.concatenate([folds[j] for j in range(5) if j != i])
        A = np.column_stack([np.ones(len(tr)), X[np.ix_(tr, cols)]]); b = np.linalg.lstsq(A, y[tr], rcond=None)[0]
        pred = np.column_stack([np.ones(len(va)), X[np.ix_(va, cols)]]) @ b
        scores.append(1 - np.sum((y[va] - pred) ** 2) / np.sum((y[va] - y[va].mean()) ** 2))
    return float(np.mean(scores))
name = lambda cols: "{" + ", ".join(f"f{c + 1}" for c in sorted(cols)) + "}"

print("FORWARD SELECTION"); cur, path, fits = [], [], 0
while len(cur) < p:
    cand = [(cv_r2(cur + [j]), j) for j in range(p) if j not in cur]; fits += len(cand)
    for s, j in cand: print(f"  try {name(cur + [j]):18s} CV R^2 = {s:.3f}")
    s, j = max(cand); cur = cur + [j]; path.append((s, list(cur))); print(f"  -> add f{j + 1}")
best = max(path); print("best subset on the forward path:", name(best[1]), f"(CV R^2 = {best[0]:.3f}), models fitted = {fits}")

print("BACKWARD ELIMINATION"); cur = list(range(p)); path = [(cv_r2(cur), list(cur))]; fits = 1
while len(cur) > 1:
    cand = [(cv_r2([c for c in cur if c != j]), j) for j in cur]; fits += len(cand)
    s, j = max(cand); cur = [c for c in cur if c != j]; path.append((s, list(cur))); print(f"  remove f{j + 1} -> {name(cur)} CV R^2 = {s:.3f}")
best = max(path); print("best subset on the backward path:", name(best[1]), f"models fitted = {fits} = p(p+1)/2 = {p * (p + 1) // 2}")
print("exhaustive search would fit 2^p - 1 =", 2 ** p - 1, "models:", len([c for r in range(1, p + 1) for c in combinations(range(p), r)]))
