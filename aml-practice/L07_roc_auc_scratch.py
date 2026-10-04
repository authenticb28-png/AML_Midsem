"""L7 (researched) · ROC curve and AUC from scratch: sweep the threshold, compute TPR and FPR, integrate."""
import numpy as np

y      = np.array([1, 1, 0, 1, 0, 1, 0, 0])
scores = np.array([0.9, 0.8, 0.7, 0.6, 0.55, 0.4, 0.3, 0.1])   # model's P(class 1)

P, N = y.sum(), (1 - y).sum()
pts = [(0.0, 0.0)]
for t in sorted(set(scores), reverse=True):                    # predict 1 when score >= t
    pred = (scores >= t).astype(int)
    tpr = ((pred == 1) & (y == 1)).sum() / P
    fpr = ((pred == 1) & (y == 0)).sum() / N
    pts.append((fpr, tpr))
    print(f"threshold {t:4.2f}: TPR = {tpr:.2f}  FPR = {fpr:.2f}")
pts = np.array(pts)
auc = np.trapezoid(pts[:, 1], pts[:, 0])
print("AUC (trapezoid rule) =", round(float(auc), 4))
# AUC = probability a random positive is scored above a random negative
pos, neg = scores[y == 1], scores[y == 0]
pairs = [(p > n) + 0.5 * (p == n) for p in pos for n in neg]
print("AUC (pairwise ranking) =", round(float(np.mean(pairs)), 4))

from sklearn.metrics import roc_auc_score, roc_curve
print("sklearn roc_auc_score  =", round(roc_auc_score(y, scores), 4))
fpr, tpr, thr = roc_curve(y, scores)
print("sklearn roc_curve FPR:", fpr.round(2).tolist())
print("sklearn roc_curve TPR:", tpr.round(2).tolist())
