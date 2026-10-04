"""L5 · Library view. scikit-learn has no 'batch GD regressor'; LinearRegression gives the closed-form target
that BGD converges to, and SGDRegressor (Lecture 6) is the iterative library estimator. Scaling first matters."""
import numpy as np
from sklearn.linear_model import LinearRegression, SGDRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

X = np.array([[2, 60], [4, 80], [6, 90], [3, 70], [5, 85], [7, 95]], float)
y = np.array([35, 55, 70, 46, 62, 78], float)

ols = LinearRegression().fit(X, y)
print("closed-form OLS: intercept =", round(float(ols.intercept_), 4), " coef =", np.round(ols.coef_, 4).tolist())

sgd = make_pipeline(StandardScaler(), SGDRegressor(max_iter=5000, tol=None, eta0=0.01, learning_rate="constant", random_state=0))
sgd.fit(X, y)
print("iterative (scaled) R^2 =", round(sgd.score(X, y), 4), " | OLS R^2 =", round(ols.score(X, y), 4))
print("prediction for (hours=5, attendance=80): OLS", round(float(ols.predict([[5, 80]])[0]), 2),
      "| iterative", round(float(sgd.predict([[5, 80]])[0]), 2))
