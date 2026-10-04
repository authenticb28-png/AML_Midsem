"""L4 · MLR with scikit-learn and numpy.linalg.lstsq (what libraries actually do: no explicit inverse)."""
import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1, 0], [0, 1], [1, 1]], dtype=float); y = np.array([2, 3, 6], dtype=float)
lr = LinearRegression().fit(X, y)                  # fit_intercept=True adds beta0 for you
print("intercept_ =", round(float(lr.intercept_), 6), " coef_ =", np.round(lr.coef_, 6).tolist())

# P2 model: y = 10 + 5*CGPA + 2*hours -> predictions for Arjun, Priya, Rahul, Maya
B = np.array([10, 5, 2], float)
students = np.array([[1, 8, 6], [1, 7, 10], [1, 9, 4], [1, 8.5, 8]], float)
print("P2 predictions (X @ beta):", (students @ B).tolist())

# lstsq works even when X^T X is singular (returns the minimum-norm solution)
Xs = np.column_stack([np.ones(4), [1, 2, 3, 4], [2, 4, 6, 8]])          # col3 = 2*col2
ys = np.array([3, 5, 7, 9], float)
beta, *_ = np.linalg.lstsq(Xs, ys, rcond=None)
print("lstsq on collinear data:", np.round(beta, 4).tolist(), "-> predictions", np.round(Xs @ beta, 4).tolist())
