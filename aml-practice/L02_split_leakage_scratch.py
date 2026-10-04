"""L2 · A 70/15/15 split from scratch, and why imputing with the FULL-data mean is leakage."""
import numpy as np

rng = np.random.default_rng(42)
n = 20
X = np.arange(n, dtype=float)            # pretend feature
idx = rng.permutation(n)                 # shuffle indices once
n_tr, n_va = int(0.70 * n), int(0.15 * n)
tr, va, te = idx[:n_tr], idx[n_tr:n_tr + n_va], idx[n_tr + n_va:]
print("sizes train/val/test:", len(tr), len(va), len(te))
print("no overlap:", len(set(tr) & set(va)) == 0 and len(set(tr) & set(te)) == 0 and len(set(va) & set(te)) == 0)

# Leakage demo: a salary column with a missing value in TRAIN
salary = np.array([30, 32, 35, 31, 33, 34, 36, 30, np.nan, 38, 90, 95, 100, 92, 98, 97, 93, 99, 91, 96], dtype=float)
train_part, test_part = salary[:10], salary[10:]          # time-ordered split for clarity
wrong_mean = np.nanmean(salary)                           # uses TEST values too -> leakage
right_mean = np.nanmean(train_part)                       # train-only statistic
print("full-data mean (WRONG, leaks test info):", round(wrong_mean, 2))
print("train-only mean (RIGHT):", round(right_mean, 2))
