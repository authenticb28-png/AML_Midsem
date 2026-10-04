"""L8 · Perfect multicollinearity makes X^T X singular; near-multicollinearity makes coefficients unstable. VIF by hand."""
import numpy as np

# Worksheet 9.5: column 3 = column 1 + column 2
X = np.array([[1, 1, 2], [1, 2, 3], [1, 3, 4]], float)
XtX = X.T @ X
print("X^T X =\n", XtX)
print("det(X^T X) =", round(np.linalg.det(XtX), 10), " rank =", np.linalg.matrix_rank(XtX))
c = np.array([1, 1, -1])            # non-zero vector with X c = 0
print("X c =", X @ c, " -> (X^T X) c =", XtX @ c)

# Near-collinear: x2 = x1 + tiny noise. Coefficients swing wildly between two samples, predictions do not.
rng = np.random.default_rng(1)
for trial in range(2):
    x1 = rng.uniform(0, 10, 30); x2 = x1 + rng.normal(0, 0.01, 30); y = 3 * x1 + rng.normal(0, 1, 30)
    A = np.column_stack([np.ones(30), x1, x2]); b = np.linalg.lstsq(A, y, rcond=None)[0]
    print(f"sample {trial + 1}: b1 = {b[1]:8.2f}, b2 = {b[2]:8.2f}, b1 + b2 = {b[1] + b[2]:.2f}, pred at x=5: {b[0] + 5 * b[1] + 5 * b[2]:.2f}")

def vif(Xf, j):
    """VIF_j = 1 / (1 - R_j^2), where R_j^2 regresses feature j on all other features."""
    y = Xf[:, j]; others = np.delete(Xf, j, axis=1); A = np.column_stack([np.ones(len(y)), others])
    pred = A @ np.linalg.lstsq(A, y, rcond=None)[0]
    r2 = 1 - np.sum((y - pred) ** 2) / np.sum((y - y.mean()) ** 2)
    return 1 / (1 - r2)
x1 = rng.uniform(0, 10, 50); x2 = 2 * x1 + rng.normal(0, 1, 50); x3 = rng.uniform(0, 10, 50)
F = np.column_stack([x1, x2, x3])
print("VIF:", [round(float(vif(F, j)), 2) for j in range(3)], "(> 10 = serious multicollinearity; x3 ~ 1 is clean)")
