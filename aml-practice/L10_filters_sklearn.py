"""L10 · Filters with pandas / scikit-learn: drop duplicates (transpose trick), VarianceThreshold, df.corr() heatmap values."""
import numpy as np
import pandas as pd
from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_regression

rng = np.random.default_rng(10)
n = 40
df = pd.DataFrame({"CGPA": rng.uniform(6, 10, n), "Projects": rng.integers(0, 6, n).astype(float),
                   "Student_ID": np.arange(1001, 1001 + n, dtype=float), "Constant": 5.0,
                   "Flag": (rng.uniform(size=n) < 0.1).astype(float)})
df["CGPA_copy"] = df["CGPA"]
y = 10 * df["CGPA"] + 6 * df["Projects"] + rng.normal(0, 4, n)

dedup = df.T.drop_duplicates().T                         # duplicate COLUMNS = duplicate rows of the transpose
print("after dropping duplicate columns:", list(dedup.columns))

vt = VarianceThreshold(threshold=0.05).fit(dedup)      # removes features with variance below 0.05
print("variances:", dedup.var(ddof=0).round(3).to_dict())
print("VarianceThreshold(0.05) keeps:", list(dedup.columns[vt.get_support()]))

corr_y = dedup.drop(columns=["Constant"]).corrwith(y).round(3)
print("Pearson r with target:", corr_y.to_dict())
print("df.corr() (Pearson, the heatmap numbers):\n", dedup[["CGPA", "Projects", "Student_ID"]].corr().round(2))
print("Spearman (rank-based, catches monotonic non-linear):", round(pd.Series([1, 2, 3, 4, 5]).corr(pd.Series([1, 8, 27, 64, 125]), method="spearman"), 3))

skb = SelectKBest(score_func=f_regression, k=2).fit(dedup.drop(columns=["Constant"]), y)
print("SelectKBest(f_regression, k=2) keeps:", list(dedup.drop(columns=["Constant"]).columns[skb.get_support()]))
