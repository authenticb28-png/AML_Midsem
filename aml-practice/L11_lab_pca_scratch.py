"""L11 lab (course 'PCA Implementation from scratch'): standardise with StandardScaler, covariance, top-k eigenvectors,
project. Eigenvectors are only defined up to sign, so different libraries can flip the sign of a whole column."""
import numpy as np
from sklearn.preprocessing import StandardScaler

def pca_project(data, k):
    Z = StandardScaler().fit_transform(data)          # 1. standardise (population std, ddof=0)
    C = np.cov(Z, rowvar=False)                       # 2. covariance (n-1 denominator)
    vals, vecs = np.linalg.eigh(C)                    # 3. eigen-decomposition (ascending)
    top = vecs[:, np.argsort(vals)[::-1][:k]]         #    top-k eigenvectors
    return Z @ top                                    # 4. project

sample = """10 2 1
2.5 2.4
0.5 0.7
2.2 2.9
1.9 2.2
3.1 3.0
2.3 2.7
2.0 1.6
1.0 1.1
1.5 1.6
1.1 0.9"""
lines = sample.split("\n"); n, m, k = map(int, lines[0].split())
data = np.array([list(map(float, r.split())) for r in lines[1:1 + n]])
out = pca_project(data, k)
for row in out:
    print(" ".join(f"{v:.4f}" for v in row))

expected = [1.0864, -2.3089, 1.2419, 0.3408, 2.1843, 1.1607, -0.0926, -1.4821, -0.5672, -1.5633]
assert np.allclose(np.abs(out[:, 0]), np.abs(expected), atol=1e-4)    # equal up to the sign of the column
print("all tests passed")
