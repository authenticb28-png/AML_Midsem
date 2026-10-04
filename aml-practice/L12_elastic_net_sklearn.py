"""L12 researched: Elastic Net = L1 + L2 penalty (Zou & Hastie 2005), compared with Ridge and Lasso.
scikit-learn objective: (1/2n)||y - Xw||^2 + alpha*l1_ratio*||w||_1 + 0.5*alpha*(1 - l1_ratio)*||w||_2^2."""
import numpy as np
from sklearn.linear_model import Ridge, Lasso, ElasticNet

rng = np.random.default_rng(1)
n = 200
z = rng.normal(size=n)
x1 = z + 0.05 * rng.normal(size=n)          # x1 and x2 are almost the same signal (r ~ 0.999)
x2 = z + 0.05 * rng.normal(size=n)
noise = rng.normal(size=(n, 3))             # three useless features
X = np.column_stack([x1, x2, noise])
y = 3 * z + rng.normal(0, 0.5, n)

print("corr(x1, x2) = %.3f" % np.corrcoef(x1, x2)[0, 1])
# same total strength alpha = 1.0: Lasso splits the shared signal unevenly, Elastic Net shares it (grouping effect)
for name, m in [("Ridge alpha=10", Ridge(alpha=10)), ("Lasso alpha=1.0", Lasso(alpha=1.0)),
                ("ElasticNet alpha=1.0 l1_ratio=0.5", ElasticNet(alpha=1.0, l1_ratio=0.5))]:
    print(f"{name:34s}", np.round(m.fit(X, y).coef_, 3) + 0.0)

# the two limits of l1_ratio
en1 = ElasticNet(alpha=0.1, l1_ratio=1.0).fit(X, y)
la = Lasso(alpha=0.1).fit(X, y)
print("l1_ratio = 1 equals Lasso:", np.allclose(en1.coef_, la.coef_))
# l1_ratio = 0 is a pure L2 penalty: same as Ridge with alpha_ridge = n * alpha (because of the 1/(2n) scaling)
en0 = ElasticNet(alpha=0.1, l1_ratio=0.0, tol=1e-10, max_iter=100000).fit(X, y)
rd = Ridge(alpha=n * 0.1).fit(X, y)
print("l1_ratio = 0 equals Ridge(alpha = n*alpha):", np.allclose(en0.coef_, rd.coef_, atol=1e-4))

# number of exact zeros as alpha grows (l1_ratio = 0.5)
for a in [0.01, 0.1, 0.5, 2.0]:
    c = ElasticNet(alpha=a, l1_ratio=0.5).fit(X, y).coef_
    print(f"alpha={a:<5} zeros={int(np.sum(c == 0))}  coef={np.round(c, 3) + 0.0}")
