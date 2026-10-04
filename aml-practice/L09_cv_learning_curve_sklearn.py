"""L9 · KFold, cross_val_score, learning_curve with scikit-learn (diagnose bias vs variance)."""
import numpy as np
from sklearn.model_selection import KFold, cross_val_score, learning_curve
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression

rng = np.random.default_rng(0)
X = rng.uniform(-3, 3, (80, 1)); y = np.sin(X[:, 0]) + rng.normal(0, 0.3, 80)
cv = KFold(n_splits=5, shuffle=True, random_state=0)
for d in [1, 3, 12]:
    model = make_pipeline(PolynomialFeatures(d), StandardScaler(), LinearRegression())
    s = -cross_val_score(model, X, y, cv=cv, scoring="neg_mean_squared_error")
    print(f"degree {d:2d}: CV MSE per fold = {np.round(s, 3).tolist()}  mean = {s.mean():.3f}")

sizes, tr, va = learning_curve(make_pipeline(PolynomialFeatures(1), LinearRegression()), X, y, cv=cv,
                               train_sizes=[0.25, 0.5, 0.75, 1.0], scoring="neg_mean_squared_error")
print("degree 1 learning curve (high bias: both errors stay high and close):")
for n_, a, b in zip(sizes, -tr.mean(1), -va.mean(1)):
    print(f"  n = {n_:2d}: train MSE = {a:.3f}  val MSE = {b:.3f}")
