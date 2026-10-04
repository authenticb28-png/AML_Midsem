"""L9 researched: hyperparameter tuning with cross-validation — grid search vs random search (scikit-learn).
Hyperparameters (degree, alpha) are chosen on validation folds of the TRAINING set; the test set is used once."""
import numpy as np
from scipy.stats import loguniform
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV, KFold

rng = np.random.default_rng(0)
x = np.sort(rng.uniform(-3, 3, 120)).reshape(-1, 1)
y = 0.5 * x[:, 0] ** 3 - x[:, 0] ** 2 + rng.normal(0, 2.0, 120)
X_tr, X_te, y_tr, y_te = train_test_split(x, y, test_size=0.25, random_state=0)

pipe = make_pipeline(PolynomialFeatures(include_bias=False), StandardScaler(), Ridge())
grid = {"polynomialfeatures__degree": [1, 2, 3, 5, 9], "ridge__alpha": [0.01, 0.1, 1, 10]}
cv = KFold(n_splits=5, shuffle=True, random_state=0)

gs = GridSearchCV(pipe, grid, cv=cv, scoring="neg_mean_squared_error").fit(X_tr, y_tr)
print("grid search: combinations =", 5 * 4, "| model fits =", 5 * 4 * 5, "(+1 refit on all training data)")
print("  best params:", gs.best_params_)
print("  best CV MSE: %.3f" % -gs.best_score_)
print("  test MSE   : %.3f" % np.mean((gs.predict(X_te) - y_te) ** 2))

rs = RandomizedSearchCV(pipe, {"polynomialfeatures__degree": [1, 2, 3, 5, 9], "ridge__alpha": loguniform(1e-3, 1e2)},
                        n_iter=8, cv=cv, scoring="neg_mean_squared_error", random_state=0).fit(X_tr, y_tr)
print("random search: 8 sampled combinations | model fits =", 8 * 5)
print("  best degree:", rs.best_params_["polynomialfeatures__degree"], "| best alpha: %.3f" % rs.best_params_["ridge__alpha"])
print("  best CV MSE: %.3f" % -rs.best_score_)

# CV MSE by degree (alpha = 1) shows the U-shape from Lecture 9
res = gs.cv_results_
for d in [1, 2, 3, 5, 9]:
    i = [k for k, p in enumerate(res["params"]) if p["polynomialfeatures__degree"] == d and p["ridge__alpha"] == 1][0]
    print(f"  degree {d}: mean CV MSE = {-res['mean_test_score'][i]:.3f}")
assert gs.best_params_["polynomialfeatures__degree"] == 3
