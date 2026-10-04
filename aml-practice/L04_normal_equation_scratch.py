"""L4 · Multiple Linear Regression with the normal equation, step by step (HOMEWORK P10)."""
import numpy as np

# data: x1, x2 -> y
X_feat = np.array([[1, 0], [0, 1], [1, 1]], dtype=float)
y = np.array([2, 3, 6], dtype=float)

X = np.column_stack([np.ones(len(X_feat)), X_feat])   # STEP 1: prepend the column of 1s
print("X =\n", X)
XT = X.T                                              # STEP 2
XTX = XT @ X                                          # STEP 3
print("X^T X =\n", XTX)
XTy = XT @ y                                          # STEP 4
print("X^T y =", XTy)
print("det(X^T X) =", round(np.linalg.det(XTX), 6))   # STEP 5: invertible if non-zero
XTX_inv = np.linalg.inv(XTX)                          # STEP 6
print("(X^T X)^-1 =\n", np.round(XTX_inv, 6))
beta = XTX_inv @ XTy                                  # STEP 7
print("beta* =", np.round(beta, 6))                   # [-1, 3, 4]
print("predictions =", X @ beta, "(perfect fit: 3 points, 3 parameters)")

# Numerically safer: solve X^T X beta = X^T y without forming the inverse
print("np.linalg.solve ->", np.round(np.linalg.solve(XTX, XTy), 6))

# PRACTICE P5: verify the expanded loss y^T y - 2 y^T X b + b^T X^T X b
X5 = np.array([[1, 2], [1, 3]], float); y5 = np.array([5, 7], float); b5 = np.array([1, 1], float)
e = y5 - X5 @ b5
print("P5: e =", e, " e^T e =", e @ e, " expanded =", y5 @ y5 - 2 * y5 @ X5 @ b5 + b5 @ X5.T @ X5 @ b5)

# Singular case (P9a): third column = first + second
Xs = np.column_stack([np.ones(4), [20, 25, 30, 35], [60, 55, 70, 40], [80, 80, 100, 75]])
print("multicollinear det(X^T X) =", round(np.linalg.det(Xs.T @ Xs), 6), " rank =", np.linalg.matrix_rank(Xs), "< 4 columns")
