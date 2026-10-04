"""L13 · statsmodels: acf/pacf, plot_acf/plot_pacf, ADF stationarity test, AutoReg, ARIMA, TimeSeriesSplit."""
import warnings
import numpy as np
import matplotlib
matplotlib.use("Agg")                          # draw without opening a window
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import acf, pacf, adfuller
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.ar_model import AutoReg
from statsmodels.tsa.arima.model import ARIMA
from sklearn.model_selection import TimeSeriesSplit
warnings.filterwarnings("ignore")

rng = np.random.default_rng(0); n = 400
ar = np.zeros(n)
for t in range(2, n): ar[t] = 0.6 * ar[t - 1] + 0.3 * ar[t - 2] + rng.normal()
print("acf  lags 1-5:", np.round(acf(ar, nlags=5)[1:], 3).tolist())
print("pacf lags 1-5:", np.round(pacf(ar, nlags=5)[1:], 3).tolist())
fig, axes = plt.subplots(1, 2, figsize=(8, 3)); plot_acf(ar, lags=15, ax=axes[0]); plot_pacf(ar, lags=15, ax=axes[1])
print("plot_acf / plot_pacf drew", len(axes), "panels (save with fig.savefig('acf.png'))"); plt.close(fig)

trend = np.cumsum(rng.normal(0.5, 1, 200))                  # random walk with drift: non-stationary
for name, s in [("trend series", trend), ("1st difference", np.diff(trend))]:
    stat, p = adfuller(s)[:2]
    print(f"ADF {name:15s}: statistic = {stat:7.3f}, p-value = {p:.4f} ->", "stationary" if p < 0.05 else "NON-stationary")

m = AutoReg(ar, lags=2).fit()
print("AutoReg(2) params [c, phi1, phi2]:", np.round(m.params, 3).tolist())
fit = ARIMA(trend, order=(1, 1, 0)).fit()                  # d = 1 -> model the differences
print("ARIMA(1,1,0) next 3 forecasts:", np.round(fit.forecast(3), 2).tolist())

demand = np.array([2500, 2530, 2565, 2600, 2635, 2675, 2710, 2745, 2780, 2820, 2855, 2890], float)
fc = ARIMA(demand, order=(2, 0, 0), trend="c").fit().forecast(3)
print("vaccine lab, ARIMA(2,0,0) forecast:", np.round(fc, 2).tolist(), " stock x1.10:", np.round(fc * 1.10, 2).tolist())

for i, (tr, te) in enumerate(TimeSeriesSplit(n_splits=3).split(np.arange(12))):
    print(f"TimeSeriesSplit fold {i + 1}: train {tr.min()}-{tr.max()}  test {te.min()}-{te.max()}  (train always BEFORE test)")
