"""L14 · scipy binomial pmf, sklearn log_loss, and LogisticRegression predict_proba vs predict."""
import numpy as np
from scipy.stats import binom
from sklearn.metrics import log_loss
from sklearn.linear_model import LogisticRegression

print("binom.pmf(7, 10, p):", [round(float(binom.pmf(7, 10, p)), 4) for p in [0.5, 0.7, 0.8]])
y = [1, 1, 0, 0]
print("log_loss Model A:", round(log_loss(y, [0.90, 0.80, 0.15, 0.25]), 3), " Model B:", round(log_loss(y, [0.60, 0.55, 0.35, 0.40]), 3))

# IQ/CGPA-like toy data -> placement (1/0)
X = np.array([[95, 6.0], [100, 6.5], [105, 7.0], [110, 7.2], [115, 8.0], [120, 8.4], [125, 8.8], [130, 9.1]], float)
t = np.array([0, 0, 0, 1, 0, 1, 1, 1])
clf = LogisticRegression(C=1e6, max_iter=5000).fit(X, t)              # large C ~ almost no regularization
p = clf.predict_proba([[112, 7.5]])[0]
print("predict_proba [P(0), P(1)] =", np.round(p, 4).tolist(), " sums to", round(float(p.sum()), 6))
print("predict (threshold 0.5)   =", int(clf.predict([[112, 7.5]])[0]))
z = clf.decision_function([[112, 7.5]])[0]
print("decision_function z =", round(float(z), 4), " sigmoid(z) =", round(float(1 / (1 + np.exp(-z))), 4))
print("training log-loss =", round(log_loss(t, clf.predict_proba(X)[:, 1]), 4))
