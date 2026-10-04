"""L3 · Simple Linear Regression with OLS from scratch.
m = sum((x-xbar)(y-ybar)) / sum((x-xbar)^2),   c = ybar - m*xbar
"""
import numpy as np

def ols_fit(x, y):
    x, y = np.asarray(x, float), np.asarray(y, float)
    a = x - x.mean()                  # deviations of x from its mean
    b = y - y.mean()                  # deviations of y from its mean
    sxx = np.sum(a * a)
    if sxx == 0:                      # all x identical -> slope undefined
        raise ValueError("all x values are identical; slope is undefined")
    m = np.sum(a * b) / sxx
    c = y.mean() - m * x.mean()
    return m, c

# Worksheet Section 11 / PRACTICE P10: study hours -> quiz score
hours = [1, 3, 5, 7, 9]; score = [25, 40, 55, 65, 80]
m, c = ols_fit(hours, score)
x = np.array(hours, float); y = np.array(score, float)
print("deviations a:", (x - x.mean()).tolist(), " b:", (y - y.mean()).tolist())
print("Sxy =", np.sum((x - x.mean()) * (y - y.mean())), " Sxx =", np.sum((x - x.mean()) ** 2))
print(f"model: y_hat = {m:.2f} x {c:+.2f}")
print("prediction for 6 hours:", round(m * 6 + c, 2))
print("line passes through (xbar, ybar):", np.isclose(m * x.mean() + c, y.mean()))

# Worksheet Section 1 data: CGPA -> stipend (thousand INR)
cgpa = [8.0, 9.0, 7.0, 7.5, 6.0]; stipend = [50, 75, 45, 40, 30]
m2, c2 = ols_fit(cgpa, stipend)
print(f"CGPA model: stipend_hat = {m2:.2f} * CGPA {c2:+.2f}")
res = np.array(stipend) - (m2 * np.array(cgpa) + c2)
print("residuals:", np.round(res, 2).tolist(), " sum of residuals =", round(float(res.sum()), 10))
print("SSE =", round(float(np.sum(res ** 2)), 2))

# Outlier impact (PRACTICE P12): add (10, 20)
m3, c3 = ols_fit(hours + [10], score + [20])
print(f"with outlier (10,20): y_hat = {m3:.4f} x {c3:+.4f}  (slope dropped from {m:.2f})")
