"""L7 · The same metrics with sklearn.metrics. Note: mean_absolute_percentage_error returns a FRACTION, not %."""
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error, r2_score

y  = np.array([30, 35, 40, 45, 50, 55, 60, 65], float)
yA = np.array([32, 34, 43, 42, 49, 58, 56, 70], float)
yB = np.array([32, 34, 43, 43, 49, 58, 56, 69], float)

print("MAE  :", mean_absolute_error(y, yA))
print("MSE  :", mean_squared_error(y, yA))
print("RMSE :", round(np.sqrt(mean_squared_error(y, yA)), 4))
print("MAPE :", round(mean_absolute_percentage_error(y, yA), 6), "<- fraction; x100 =", round(100 * mean_absolute_percentage_error(y, yA), 2), "%")
n = len(y)
for name, p, k in [("A", yA, 2), ("B", yB, 3)]:
    r2 = r2_score(y, p)                       # there is no adjusted-R^2 function in sklearn
    print(f"{name}: r2_score = {r2:.4f}  adjusted = {1 - (1 - r2) * (n - 1) / (n - k - 1):.4f}")

# Course lab 'Regression Error Metrics R2' (sample, p = 1): expected 0.99 0.99
act = [3, 5, 7, 9, 11]; pred = [2.8, 5.3, 6.8, 9.2, 10.9]
r2 = r2_score(act, pred); print(f"lab sample -> {r2:.2f} {1 - (1 - r2) * (5 - 1) / (5 - 1 - 1):.2f}")
print("R^2 can be negative: r2_score([1,2,3],[3,2,1]) =", r2_score([1, 2, 3], [3, 2, 1]))
