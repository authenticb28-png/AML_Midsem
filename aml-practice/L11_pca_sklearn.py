"""L11 · sklearn PCA: explained_variance_, explained_variance_ratio_, components_, n_components as a variance target,
and PCA inside a Pipeline so each CV fold fits its own scaler + PCA (no leakage)."""
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

X = np.array([[2, 1], [4, 3], [6, 5]], float)
p = PCA(n_components=2).fit(X)
print("explained_variance_ (eigenvalues of S):", np.round(p.explained_variance_, 6).tolist())
print("explained_variance_ratio_:", np.round(p.explained_variance_ratio_, 6).tolist())
print("components_ (rows = unit eigenvectors):", np.round(np.abs(p.components_[0]), 4).tolist(), "(sign may flip)")

rng = np.random.default_rng(1)
base = rng.normal(size=(300, 2))
D = np.column_stack([base[:, 0], base[:, 0] * 0.9 + 0.1 * rng.normal(size=300), base[:, 1],
                     base[:, 1] * 0.5 + rng.normal(size=300) * 0.1, rng.normal(size=300) * 0.05])
Ds = StandardScaler().fit_transform(D)
full = PCA().fit(Ds)
print("EVR per PC (%):", np.round(full.explained_variance_ratio_ * 100, 2).tolist())
print("cumulative (%):", np.round(np.cumsum(full.explained_variance_ratio_) * 100, 2).tolist())
p96 = PCA(n_components=0.96).fit(Ds)                       # smallest k reaching 96% of the variance
print("PCA(n_components=0.96) keeps k =", p96.n_components_)

y = (base[:, 0] + base[:, 1] > 0).astype(int)
pipe = make_pipeline(StandardScaler(), PCA(n_components=2), LogisticRegression())
print("CV accuracy with scaler+PCA fitted inside each fold:", round(cross_val_score(pipe, D, y, cv=5).mean(), 4))
