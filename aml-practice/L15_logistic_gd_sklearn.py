"""L15 · LogisticRegression in scikit-learn 1.9: odds ratios, regularization strength C (=1/lambda), and polynomial
features for a curved (circular) boundary. In sklearn >= 1.8 'penalty=' is deprecated: use l1_ratio (0 -> L2, 1 -> L1)."""
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.pipeline import make_pipeline

rng = np.random.default_rng(0)
X = rng.normal(size=(200, 2)); y = (X[:, 0] + 0.5 * X[:, 1] + rng.normal(0, 0.5, 200) > 0).astype(int)
for C in [0.01, 1, 100]:
    m = LogisticRegression(C=C).fit(X, y)
    print(f"C = {C:<5} (lambda = 1/C) coef = {np.round(m.coef_[0], 3).tolist()}  accuracy = {m.score(X, y):.3f}")
m = LogisticRegression(C=100).fit(X, y)
print("odds multiply by e^beta per +1 unit:", np.round(np.exp(m.coef_[0]), 3).tolist())

# circular classes: a straight boundary fails, quadratic features succeed
Xc = rng.uniform(-3, 3, size=(300, 2)); yc = (Xc[:, 0] ** 2 + Xc[:, 1] ** 2 < 4).astype(int)
lin = LogisticRegression().fit(Xc, yc)
poly = make_pipeline(PolynomialFeatures(2), StandardScaler(), LogisticRegression(C=100, max_iter=5000)).fit(Xc, yc)
print("linear boundary accuracy   :", round(lin.score(Xc, yc), 3))
print("quadratic features accuracy:", round(poly.score(Xc, yc), 3))
l1 = make_pipeline(PolynomialFeatures(2), StandardScaler(), LogisticRegression(C=0.5, l1_ratio=1.0, solver="saga", max_iter=20000)).fit(Xc, yc)
print("L1 (l1_ratio=1) zero coefficients:", int(np.sum(np.abs(l1[-1].coef_) < 1e-8)), "of", l1[-1].coef_.size)
