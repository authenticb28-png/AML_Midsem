"""L11 · PCA from scratch: centre -> covariance S = Xc^T Xc/(n-1) -> eigen-decomposition -> sort -> project."""
import numpy as np

def pca(X, k, standardize=False):
    mu = X.mean(axis=0)
    Xc = X - mu                                         # Xc = X - 1 mu^T
    if standardize:
        Xc = Xc / X.std(axis=0, ddof=1)
    S = Xc.T @ Xc / (X.shape[0] - 1)                    # p x p sample covariance
    lam, V = np.linalg.eigh(S)                          # eigh: for symmetric matrices, ascending order
    order = np.argsort(lam)[::-1]                       # sort eigenpairs by DESCENDING eigenvalue
    lam, V = lam[order], V[:, order]
    W = V[:, :k]                                        # p x k
    Z = Xc @ W                                          # n x k scores
    return Z, lam, V, S

# Worksheet 4.4: three houses
X = np.array([[2, 1], [4, 3], [6, 5]], float)
Z, lam, V, S = pca(X, 1)
print("S =\n", S)
print("eigenvalues:", np.round(lam, 6).tolist())
v1 = V[:, 0] * np.sign(V[0, 0])                         # fix the sign so v1 = [+, +]
print("v1 =", np.round(v1, 4).tolist(), " (1/sqrt2 = 0.7071)")
print("z1 = Xc v1 =", np.round((X - X.mean(0)) @ v1, 4).tolist())
print("EVR of PC1 =", lam[0] / lam.sum())

# PRACTICE P2(a): projection of x = [3,1] onto u = [1,1]/sqrt(2)
x = np.array([3.0, 1.0]); u = np.array([1.0, 1.0]) / np.sqrt(2)
z = u @ x; proj = z * u; e = x - proj
print(f"||u|| = {np.linalg.norm(u):.4f}  z = {z:.4f}  projected point = {proj.round(4).tolist()}  residual = {e.round(4).tolist()}  u.e = {u @ e:.1e}")

# PRACTICE P3(a): choose k from eigenvalues [6, 2, 1, 0.5]
ev = np.array([6, 2, 1, 0.5]); cum = np.cumsum(ev) / ev.sum()
print("cumulative EVR:", np.round(cum * 100, 1).tolist(), "-> smallest k with >= 90% =", int(np.argmax(cum >= 0.90) + 1))

# PC scores are uncorrelated: Cov(Z) = W^T S W = diag(lambda)
rng = np.random.default_rng(0)
A = rng.normal(size=(200, 3)) @ np.array([[2, 1, 0], [0, 1, 0.5], [0, 0, 0.2]])
Z3, lam3, V3, S3 = pca(A, 3)
print("Cov of scores (should be diagonal):\n", np.round(np.cov(Z3, rowvar=False), 4))
print("eigenvalues:", np.round(lam3, 4).tolist())
# reconstruction from k = 2 components
Ac = A - A.mean(0); rec = (Ac @ V3[:, :2]) @ V3[:, :2].T
print("squared reconstruction error / (n-1) with k=2:", round(float(np.sum((Ac - rec) ** 2) / (len(A) - 1)), 4), "= lambda3 =", round(float(lam3[2]), 4))
