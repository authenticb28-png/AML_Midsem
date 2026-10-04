"""L3 · The same OLS fits with scikit-learn and numpy.polyfit (both minimise the sum of squared errors)."""
import numpy as np
from sklearn.linear_model import LinearRegression

hours = np.array([1, 3, 5, 7, 9], float).reshape(-1, 1)    # sklearn needs a 2-D X: (n_samples, n_features)
score = np.array([25, 40, 55, 65, 80], float)
lr = LinearRegression().fit(hours, score)
print("sklearn  slope m =", round(float(lr.coef_[0]), 4), " intercept c =", round(float(lr.intercept_), 4))
print("predict 6 hours  =", round(float(lr.predict([[6]])[0]), 2))
print("R^2 on training  =", round(lr.score(hours, score), 4))

cgpa = np.array([8.0, 9.0, 7.0, 7.5, 6.0]); stipend = np.array([50, 75, 45, 40, 30], float)
m, c = np.polyfit(cgpa, stipend, deg=1)                    # returns [slope, intercept]
print("polyfit  CGPA model: m =", round(m, 4), " c =", round(c, 4))
print("predict CGPA 8.5 ->", round(m * 8.5 + c, 2), "thousand INR")
