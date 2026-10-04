"""L4 lab (course 'OLS Method implementation'): fit_multiple_lr_beta(X, y) with the normal equation.
Sample input: first line 'N M', then N rows of M features followed by the target."""
import numpy as np

def fit_multiple_lr_beta(X, y):
    X = np.asarray(X, float); y = np.asarray(y, float)
    Xb = np.hstack([np.ones((X.shape[0], 1)), X])   # 1. prepend 1s
    XT = Xb.T                                       # 2. transpose
    XTX = XT @ Xb                                   # 3. X^T X
    XTX_inv = np.linalg.inv(XTX)                    # 4. inverse
    XTy = XT @ y                                    # 5. X^T y
    return XTX_inv @ XTy                            # 6. beta

sample = """5 2
3 98 60
1 81 44
5 100 51
4 85 55
2 70 40"""
rows = [list(map(float, r.split())) for r in sample.split("\n")[1:]]
data = np.array(rows)
beta = fit_multiple_lr_beta(data[:, :-1], data[:, -1])
print(np.round(beta, 2))                            # expected [6.62 0.31 0.49]

assert np.allclose(np.round(beta, 2), [6.62, 0.31, 0.49])
assert np.allclose(fit_multiple_lr_beta([[1, 0], [0, 1], [1, 1]], [2, 3, 6]), [-1, 3, 4])
print("all tests passed")
