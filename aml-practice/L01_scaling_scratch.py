"""L1 · The four feature-scaling formulas from scratch with NumPy (worksheet PRACTICE P4)."""
import numpy as np

def min_max(x):
    return (x - x.min()) / (x.max() - x.min())          # maps to [0, 1]

def z_score(x):
    return (x - x.mean()) / x.std()                      # population std (ddof=0), like the worksheet

def max_abs(x):
    return x / np.abs(x).max()                           # maps to [-1, 1], keeps zeros and sign

def robust_halves(x):
    """Worksheet method: Q1/Q3 = medians of the lower/upper halves (median excluded for odd n)."""
    s = np.sort(x); n = len(s); med = np.median(s)
    lower, upper = s[: n // 2], s[(n + 1) // 2:]
    q1, q3 = np.median(lower), np.median(upper)
    return (x - med) / (q3 - q1), med, q1, q3

A = np.array([10, 20, 30, 40, 50], dtype=float)
print("A. Min-Max of", A.tolist(), "->", min_max(A).tolist())

B = np.array([2, 4, 6, 8, 10], dtype=float)
print("B. mean =", B.mean(), " std =", round(B.std(), 4), " z =", np.round(z_score(B), 2).tolist())

C = np.array([100, 150, 200, 250, 50000], dtype=float)
scaled, med, q1, q3 = robust_halves(C)
print("C. median =", med, " Q1 =", q1, " Q3 =", q3, " IQR =", q3 - q1)
print("   robust-scaled:", np.round(scaled, 3).tolist())
print("   min-max of the same data:", np.round(min_max(C), 4).tolist(), "<- normal values squashed near 0")

D = np.array([-4, 0, 2, 8], dtype=float)
print("D. Max-Abs of", D.tolist(), "->", max_abs(D).tolist())
