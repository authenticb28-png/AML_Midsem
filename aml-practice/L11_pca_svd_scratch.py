"""L11 researched: PCA through the SVD of the centred data (what scikit-learn's PCA does internally).
Xc = U S V^T  ->  covariance S_cov = V (S^2/(n-1)) V^T, so eigenvectors = rows of V^T, eigenvalues = s^2/(n-1),
scores = Xc V = U S. No covariance matrix is formed."""
import numpy as np
from sklearn.decomposition import PCA

X = np.array([[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2], [3.1, 3.0],
              [2.3, 2.7], [2.0, 1.6], [1.0, 1.1], [1.5, 1.6], [1.1, 0.9]])
n = len(X)
Xc = X - X.mean(axis=0)

# route 1: eigen-decomposition of the covariance matrix
vals, vecs = np.linalg.eigh(np.cov(Xc, rowvar=False))
order = np.argsort(vals)[::-1]; vals, vecs = vals[order], vecs[:, order]

# route 2: SVD of the centred data
U, s, Vt = np.linalg.svd(Xc, full_matrices=False)
print("singular values s     :", s.round(4))
print("s^2/(n-1)             :", (s ** 2 / (n - 1)).round(4))
print("covariance eigenvalues:", vals.round(4))
print("PC1 from eigh :", vecs[:, 0].round(4), "| PC1 from SVD :", Vt[0].round(4), "(same up to sign)")
print("EVR           :", (s ** 2 / (s ** 2).sum()).round(4))
scores = U * s
print("first 3 scores on PC1, U*s  :", scores[:3, 0].round(4))
print("first 3 scores on PC1, Xc@v :", (Xc @ Vt[0])[:3].round(4))

pca = PCA(n_components=2).fit(X)
print("sklearn explained_variance_:", pca.explained_variance_.round(4))
print("sklearn singular_values_   :", pca.singular_values_.round(4))
assert np.allclose(s ** 2 / (n - 1), vals) and np.allclose(np.abs(Vt[0]), np.abs(vecs[:, 0]))
assert np.allclose(pca.explained_variance_, vals)
print("all checks passed")
