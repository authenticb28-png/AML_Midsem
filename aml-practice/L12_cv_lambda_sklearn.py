"""L12 · Choosing lambda by k-fold cross-validation, with the scaler INSIDE the pipeline (no leakage)."""
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import Ridge, LassoCV, RidgeCV
from sklearn.model_selection import GridSearchCV, KFold, cross_val_score

rng = np.random.default_rng(3)
x = rng.uniform(-3, 3, (40, 1)); y = np.sin(x[:, 0]) * 3 + rng.normal(0, 0.5, 40)
cv = KFold(5, shuffle=True, random_state=0)

print("lambda  -> average validation MSE (degree-10 polynomial + ridge)")
for lam in [1e-6, 0.01, 0.1, 1, 10, 100]:
    pipe = make_pipeline(PolynomialFeatures(10, include_bias=False), StandardScaler(), Ridge(alpha=lam))
    mse = -cross_val_score(pipe, x, y, cv=cv, scoring="neg_mean_squared_error").mean()
    print(f"  {lam:<8} {mse:8.4f}")

grid = GridSearchCV(make_pipeline(PolynomialFeatures(10, include_bias=False), StandardScaler(), Ridge()),
                    {"ridge__alpha": [1e-6, 0.01, 0.1, 1, 10, 100]}, cv=cv, scoring="neg_mean_squared_error").fit(x, y)
print("GridSearchCV best lambda:", grid.best_params_["ridge__alpha"])
rcv = make_pipeline(PolynomialFeatures(10, include_bias=False), StandardScaler(), RidgeCV(alphas=[1e-6, 0.01, 0.1, 1, 10, 100])).fit(x, y)
print("RidgeCV chose alpha =", rcv[-1].alpha_)
lcv = make_pipeline(PolynomialFeatures(10, include_bias=False), StandardScaler(), LassoCV(cv=cv, max_iter=50000, random_state=0)).fit(x, y)
print("LassoCV chose alpha =", round(float(lcv[-1].alpha_), 5), " non-zero coefs =", int(np.sum(lcv[-1].coef_ != 0)), "of 10")
