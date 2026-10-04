"""L2 · Feature creation (interaction term) and a mean-prediction baseline (Phase 6 & 7)."""
import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

rng = np.random.default_rng(1)
length = rng.uniform(10, 30, 60); width = rng.uniform(10, 30, 60)
price = 2.0 * length * width + rng.normal(0, 20, 60)        # price depends on AREA = length x width

X_raw = np.column_stack([length, width])
X_eng = np.column_stack([length, width, length * width])     # engineered interaction feature "Area"

tr, te = slice(0, 45), slice(45, 60)
base = DummyRegressor(strategy="mean").fit(X_raw[tr], price[tr])
lin_raw = LinearRegression().fit(X_raw[tr], price[tr])
lin_eng = LinearRegression().fit(X_eng[tr], price[tr])
for name, m, X in [("baseline (predict mean)", base, X_raw), ("linear, raw L & W", lin_raw, X_raw), ("linear + Area feature", lin_eng, X_eng)]:
    print(f"{name:26s} test MAE = {mean_absolute_error(price[te], m.predict(X[te])):8.2f}")

# Phase 6 domain-knowledge binning: temperature -> Cold / Warm / Hot
def temp_band(t):
    return "Cold" if t <= 15 else ("Warm" if t <= 30 else "Hot")
print([temp_band(t) for t in [12, 16, 30, 41]])
