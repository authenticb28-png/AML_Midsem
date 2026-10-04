"""L12 · Ridge vs Lasso coefficient paths with scikit-learn (sklearn calls lambda 'alpha').
Ridge never produces exact zeros; Lasso switches features off one by one."""
import numpy as np
from sklearn.linear_model import Ridge, Lasso, LinearRegression
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
X = StandardScaler().fit_transform(rng.normal(size=(100, 5)))
y = 4 * X[:, 0] + 2 * X[:, 1] + rng.normal(0, 1, 100)

print("OLS  :", np.round(LinearRegression().fit(X, y).coef_, 3).tolist())
for a in [0.1, 10, 100, 1000]:
    print(f"Ridge alpha={a:<6}:", np.round(Ridge(alpha=a).fit(X, y).coef_, 4).tolist())
for a in [0.01, 0.5, 2.5, 5.0]:
    c = Lasso(alpha=a).fit(X, y).coef_
    print(f"Lasso alpha={a:<6}:", np.round(c, 4).tolist(), " zeros =", int(np.sum(c == 0)))
print("NOTE: sklearn Ridge minimises ||y-Xw||^2 + alpha||w||^2 ; Lasso minimises (1/2n)||y-Xw||^2 + alpha||w||_1")
print("intercept is never penalised: Ridge(alpha=1000).intercept_ =", round(float(Ridge(alpha=1000).fit(X, y).intercept_), 4), "= mean(y) =", round(float(y.mean()), 4))
