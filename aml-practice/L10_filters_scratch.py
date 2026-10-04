"""L10 · Filter methods from scratch: duplicates, variance threshold, Pearson r with target, input-input correlation."""
import numpy as np

rng = np.random.default_rng(10)
n = 40
cgpa = rng.uniform(6, 10, n)
projects = rng.integers(0, 6, n).astype(float)
student_id = np.arange(1001, 1001 + n, dtype=float)
random_number = rng.normal(0, 1, n)
const = np.full(n, 5.0)
stipend = 10 * cgpa + 6 * projects + rng.normal(0, 4, n)
F = {"CGPA": cgpa, "CGPA_copy": cgpa.copy(), "Projects": projects, "Student_ID": student_id,
     "Random_number": random_number, "Constant": const}

# 1) exact duplicates
names = list(F); dup = [(a, b) for i, a in enumerate(names) for b in names[i + 1:] if np.array_equal(F[a], F[b])]
print("exact duplicate pairs:", dup)

# 2) variance threshold, Var = (1/n) sum (x - mean)^2
for v in [[5, 5, 5, 5, 5], [0, 0, 0, 0, 1], [101, 102, 103, 104, 105]]:
    a = np.array(v, float); print("Var", v, "=", round(float(np.mean((a - a.mean()) ** 2)), 4))
q = 0.03; print("rare binary flag with q = 3% -> Var = q(1-q) =", round(q * (1 - q), 4))

def pearson(x, y):
    a, b = x - x.mean(), y - y.mean()
    den = np.sqrt(np.sum(a * a) * np.sum(b * b))
    return np.nan if den == 0 else float(np.sum(a * b) / den)

# 3) correlation with the target, keep |r| >= 0.30
for k, v in F.items():
    r = pearson(v, stipend)
    print(f"r({k:13s}, stipend) = {r: .3f}  ->", "undefined (constant)" if np.isnan(r) else ("keep" if abs(r) >= 0.30 else "remove"))

# nonlinear counterexample: y = x^2 is perfectly determined by x but r = 0
x = np.array([-2, -1, 0, 1, 2], float)
print("y = x^2 on symmetric x: numerator =", np.sum((x - x.mean()) * (x ** 2 - (x ** 2).mean())), " r =", pearson(x, x ** 2))

# 4) input-input correlation matrix (redundancy)
M = np.column_stack([cgpa, cgpa + rng.normal(0, 0.05, n), projects])
print("corr matrix [CGPA, CGPA_noisy, Projects]:\n", np.round(np.corrcoef(M, rowvar=False), 3))
