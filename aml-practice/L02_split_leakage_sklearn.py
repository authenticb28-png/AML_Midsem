"""L2 · train/val/test with train_test_split twice + a Pipeline that fits preprocessing on train only."""
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression

rng = np.random.default_rng(0)
X = rng.normal(size=(100, 2)); y = 3 * X[:, 0] - 2 * X[:, 1] + rng.normal(scale=0.1, size=100)
X[5, 0] = np.nan                                           # one missing value

# 70 / 15 / 15: first carve out 30%, then split that 30% in half
X_tr, X_tmp, y_tr, y_tmp = train_test_split(X, y, test_size=0.30, random_state=42)
X_va, X_te, y_va, y_te = train_test_split(X_tmp, y_tmp, test_size=0.50, random_state=42)
print("train/val/test sizes:", len(X_tr), len(X_va), len(X_te))

# Imputer + scaler + model learn ONLY from X_tr inside .fit -> no leakage
pipe = make_pipeline(SimpleImputer(strategy="mean"), StandardScaler(), LinearRegression())
pipe.fit(X_tr, y_tr)
print("validation R^2:", round(pipe.score(X_va, y_va), 4))
print("test R^2 (touch once, at the end):", round(pipe.score(X_te, y_te), 4))
