"""L7 · Regression metrics from scratch on Master Test Data R (stipend in thousand INR)."""
import numpy as np

y  = np.array([30, 35, 40, 45, 50, 55, 60, 65], float)
yA = np.array([32, 34, 43, 42, 49, 58, 56, 70], float)    # Model A (p = 2 predictors)
yB = np.array([32, 34, 43, 43, 49, 58, 56, 69], float)    # Model B (p = 3 predictors)

def mae(y, p):  return np.mean(np.abs(y - p))
def mse(y, p):  return np.mean((y - p) ** 2)
def rmse(y, p): return np.sqrt(mse(y, p))
def mape(y, p):
    keep = y != 0                                         # MAPE is undefined when y = 0 -> drop those rows
    return 100 * np.mean(np.abs((y[keep] - p[keep]) / y[keep]))
def r2(y, p):
    rss = np.sum((y - p) ** 2); tss = np.sum((y - y.mean()) ** 2)
    return 1 - rss / tss, rss, tss
def adj_r2(r2v, n, p):
    return 1 - (1 - r2v) * (n - 1) / (n - p - 1)

e = y - yA
print("signed residuals e_A:", e.tolist(), " sum =", e.sum())
print("|e| sum =", np.abs(e).sum(), " e^2 sum =", (e ** 2).sum(), " APE sum =", round(100 * np.sum(np.abs(e) / y), 2))
print(f"MAE  = {mae(y, yA):.2f}  MAPE = {mape(y, yA):.2f}%  MSE = {mse(y, yA):.2f}  RMSE = {rmse(y, yA):.2f}")
for name, p, k in [("A", yA, 2), ("B", yB, 3)]:
    r, rss, tss = r2(y, p)
    print(f"Model {name}: RSS = {rss:.0f}  TSS = {tss:.0f}  R^2 = {r:.4f}  adj R^2 = {adj_r2(r, len(y), k):.4f}")

# Course lab 'Regression Error Metrics Calculator' (sample): 2.60 8.20 2.86 5.04
a = np.array([40, 50, 60, 70, 80], float); p = np.array([45, 52, 58, 72, 78], float)
print(f"lab sample -> {mae(a,p):.2f} {mse(a,p):.2f} {rmse(a,p):.2f} {mape(a,p):.2f}")
z = np.array([0, 10, 20], float); zp = np.array([1, 12, 18], float)
print(f"MAPE ignoring the zero actual: {mape(z, zp):.2f}%")
