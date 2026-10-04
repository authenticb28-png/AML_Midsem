"""L8 (researched) · Formal checks of the five assumptions with statsmodels: VIF, Durbin-Watson, Breusch-Pagan, Jarque-Bera."""
import numpy as np
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor
from statsmodels.stats.stattools import durbin_watson, jarque_bera
from statsmodels.stats.diagnostic import het_breuschpagan

rng = np.random.default_rng(0)
n = 200
x1 = rng.uniform(0, 10, n); x2 = rng.uniform(0, 10, n)
y_good = 2 + 3 * x1 - x2 + rng.normal(0, 1, n)                    # assumptions hold
y_het = 2 + 3 * x1 - x2 + rng.normal(0, 1, n) * (0.2 + x1)         # spread grows with x1 (funnel)
X = sm.add_constant(np.column_stack([x1, x2]))

for name, yy in [("well-behaved", y_good), ("heteroscedastic", y_het)]:
    res = sm.OLS(yy, X).fit()
    bp_p = het_breuschpagan(res.resid, X)[1]
    jb_p = jarque_bera(res.resid)[1]
    print(f"{name:15s} coef={np.round(res.params, 2).tolist()}  DW={durbin_watson(res.resid):.2f}  BP p={bp_p:.4f}  JB p={jb_p:.4f}")
print("DW ~ 2 -> no autocorrelation; BP p < 0.05 -> heteroscedasticity; JB p < 0.05 -> residuals not normal")

# autocorrelated errors (AR(1) residuals) -> Durbin-Watson well below 2
e = np.zeros(n)
for t in range(1, n): e[t] = 0.8 * e[t - 1] + rng.normal()
res_ac = sm.OLS(2 + 3 * x1 + e, sm.add_constant(x1)).fit()
print(f"autocorrelated errors: DW = {durbin_watson(res_ac.resid):.2f}")

x3 = x1 * 2 + rng.normal(0, 0.5, n)
Xv = sm.add_constant(np.column_stack([x1, x2, x3]))
print("VIF x1, x2, x3:", [round(float(variance_inflation_factor(Xv, j)), 1) for j in range(1, 4)])
