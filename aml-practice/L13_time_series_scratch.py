"""L13 · Differencing, lags, ACF (worksheet formula) and PACF from scratch; AR(p) fitted by OLS on lag features."""
import numpy as np

price = np.array([100, 105, 110, 115, 122], float)
print("stock differenced:", np.diff(price).tolist())
sales = np.array([200, 220, 250, 245, 270, 300], float)
d = np.diff(sales); print("monthly sales differenced:", d.tolist(), " mean =", d.mean())

def acf(y, k):
    """rho_k = sum_{t=k+1..N} (y_t - ybar)(y_{t-k} - ybar) / sum_{t=1..N} (y_t - ybar)^2"""
    yb = y.mean(); num = np.sum((y[k:] - yb) * (y[:-k] - yb)) if k else np.sum((y - yb) ** 2)
    return num / np.sum((y - yb) ** 2)
s = np.array([2, 4, 3, 5, 4, 6], float)
print("small series", s.tolist(), " mean =", s.mean())
print("ACF lag 1 =", round(float(acf(s, 1)), 4), " lag 2 =", round(float(acf(s, 2)), 4))

def lag_matrix(y, p):
    return np.column_stack([np.ones(len(y) - p)] + [y[p - i - 1:len(y) - i - 1] for i in range(p)]), y[p:]
def pacf(y, k):
    X, t = lag_matrix(y, k); return np.linalg.lstsq(X, t, rcond=None)[0][-1]   # last coefficient of AR(k)

# simulate AR(2): y_t = 0.6 y_{t-1} + 0.3 y_{t-2} + e_t
rng = np.random.default_rng(0); n = 2000; y = np.zeros(n)
for t in range(2, n): y[t] = 0.6 * y[t - 1] + 0.3 * y[t - 2] + rng.normal()
print("AR(2) ACF  lags 1-6:", [round(float(acf(y, k)), 3) for k in range(1, 7)], "<- tails off slowly")
print("AR(2) PACF lags 1-6:", [round(float(pacf(y, k)), 3) for k in range(1, 7)], "<- cuts off after lag 2")
print("95% band ~ +/-", round(1.96 / np.sqrt(n), 3))
X, t = lag_matrix(y, 2); c, phi1, phi2 = np.linalg.lstsq(X, t, rcond=None)[0]
print(f"AR(2) fitted by OLS on lags: c = {c:.3f}, phi1 = {phi1:.3f}, phi2 = {phi2:.3f}")
print("one-step forecast:", round(c + phi1 * y[-1] + phi2 * y[-2], 4))

# MA(1): y_t = e_t + 0.8 e_{t-1}  -> ACF cuts off after lag 1, PACF tails off
e = rng.normal(size=n + 1); m = e[1:] + 0.8 * e[:-1]
print("MA(1) ACF  lags 1-4:", [round(float(acf(m, k)), 3) for k in range(1, 5)])
print("MA(1) PACF lags 1-4:", [round(float(pacf(m, k)), 3) for k in range(1, 5)])
print("AR(1) worksheet MCQ: c=2, phi=0.9, y_{t-1}=50 ->", 2 + 0.9 * 50)
