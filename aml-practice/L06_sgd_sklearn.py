"""L6 · scikit-learn SGDRegressor: fit() = SGD over shuffled samples; partial_fit() on chunks = mini-batch style."""
import numpy as np
from sklearn.linear_model import SGDRegressor
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
X = rng.uniform(0, 10, size=(200, 1)); y = 2 * X[:, 0] + 1 + rng.normal(0, 0.5, 200)
Xs = StandardScaler().fit_transform(X)                     # SGD is scale-sensitive: always scale first

sgd = SGDRegressor(loss="squared_error", penalty=None, learning_rate="constant", eta0=0.01,
                   max_iter=50, tol=None, shuffle=True, random_state=0)
sgd.fit(Xs, y)
print("SGD fit():      coef =", np.round(sgd.coef_, 3), " intercept =", np.round(sgd.intercept_, 3), " R^2 =", round(sgd.score(Xs, y), 4))

mb = SGDRegressor(penalty=None, learning_rate="constant", eta0=0.01, random_state=0)
for epoch in range(50):
    idx = rng.permutation(len(y))                          # shuffle each epoch
    for s in range(0, len(y), 32):                         # chunks of 32 samples
        b = idx[s:s + 32]; mb.partial_fit(Xs[b], y[b])
print("partial_fit(32): coef =", np.round(mb.coef_, 3), " intercept =", np.round(mb.intercept_, 3), " R^2 =", round(mb.score(Xs, y), 4))
print("updates per epoch with b=32 on m=200:", int(np.ceil(200 / 32)))
