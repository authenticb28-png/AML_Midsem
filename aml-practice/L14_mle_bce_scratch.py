"""L14 · Likelihood, MLE, sigmoid and binary cross-entropy from scratch (all worksheet numbers)."""
import math
import numpy as np

def binom_lik(p, k=7, n=10):
    return math.comb(n, k) * p ** k * (1 - p) ** (n - k)
for p in [0.5, 0.7, 0.8]:
    print(f"L(p={p}; X=7) = {binom_lik(p):.4f}")
print("ratios: L(0.7)/L(0.5) =", round(binom_lik(0.7) / binom_lik(0.5), 2), " L(0.7)/L(0.8) =", round(binom_lik(0.7) / binom_lik(0.8), 2))
grid = np.linspace(0.001, 0.999, 999)
print("grid-search MLE for 7 heads:", round(float(grid[np.argmax([binom_lik(g) for g in grid])]), 3),
      "| for 6 heads:", round(float(grid[np.argmax([binom_lik(g, 6) for g in grid])]), 3), "(MLE = k/n)")

sigmoid = lambda z: 1 / (1 + np.exp(-z))
for z in [-4, -2, 0, 2, 4]:
    print(f"sigma({z:2d}) = {sigmoid(z):.3f}")
z = -5 + 0.4 * 8 + 0.6 * 7
print(f"z = {z:.1f}, p_hat = {sigmoid(z):.3f}, scaled z' = {2*z:.1f}, p_hat' = {sigmoid(2*z):.3f}")
print(f"sigma(0.01) = {sigmoid(0.01):.4f}, sigma(10) = {sigmoid(10):.5f}")

def bce(y, p, eps=1e-15):
    p = np.clip(np.asarray(p, float), eps, 1 - eps)          # clipping avoids log(0) = -inf
    y = np.asarray(y, float)
    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))
y = [1, 1, 0, 0]; pA = [0.90, 0.80, 0.15, 0.25]; pB = [0.60, 0.55, 0.35, 0.40]
for name, p in [("A", pA), ("B", pB)]:
    q = [pi if yi == 1 else 1 - pi for yi, pi in zip(y, p)]          # probability of the OBSERVED label
    L = float(np.prod(q))
    print(f"Model {name}: q = {q}  L = {L:.4f}  log L = {math.log(L):.3f}  BCE = {bce(y, p):.3f}")
for yy in [1, 0]:
    print(f"p_hat = 0.9, y = {yy}: contribution = {0.9 if yy else 0.1:.1f}, loss = {bce([yy], [0.9]):.3f}")
for p in [0.51, 0.95]:
    print(f"p_hat = {p}: loss if y=1 -> {bce([1], [p]):.3f}, if y=0 -> {bce([0], [p]):.3f}")
print("0.5**2000 underflows to", 0.5 ** 2000, "but 2000*log(0.5) =", round(2000 * math.log(0.5), 2))
