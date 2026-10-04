"""L15 · Multinomial (softmax) LogisticRegression vs OneVsRestClassifier.
scikit-learn >= 1.7 removed LogisticRegression(multi_class=...). Older code (and older exam questions) wrote
LogisticRegression(multi_class='ovr') or multi_class='multinomial'. Today: multinomial is the default for 3+ classes;
for OvR wrap the model: OneVsRestClassifier(LogisticRegression())."""
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier

rng = np.random.default_rng(1)
centers = np.array([[0, 0], [3, 3], [0, 4]])
X = np.vstack([c + rng.normal(0, 0.7, (40, 2)) for c in centers]); y = np.repeat([0, 1, 2], 40)

soft = LogisticRegression(max_iter=1000).fit(X, y)               # softmax / multinomial
ovr = OneVsRestClassifier(LogisticRegression(max_iter=1000)).fit(X, y)
x_new = [[1.5, 2.0]]
print("softmax predict_proba:", np.round(soft.predict_proba(x_new)[0], 4).tolist(), "sum =", round(float(soft.predict_proba(x_new).sum()), 6))
raw = np.array([e.predict_proba(x_new)[0, 1] for e in ovr.estimators_])
print("OvR raw sigmoid outputs:", np.round(raw, 4).tolist(), "sum =", round(float(raw.sum()), 4), "(not 1)")
print("OvR predict_proba (sklearn normalises them):", np.round(ovr.predict_proba(x_new)[0], 4).tolist())
print("coef_ shapes: softmax", soft.coef_.shape, "| OvR", len(ovr.estimators_), "x", ovr.estimators_[0].coef_.shape)
print("accuracies: softmax", round(soft.score(X, y), 3), "| OvR", round(ovr.score(X, y), 3))
