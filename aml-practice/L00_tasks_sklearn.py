"""L0 · The three core tasks on tiny datasets (scikit-learn).
Regression -> a continuous number, Classification -> a discrete label, Clustering -> groups without labels.
"""
import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.cluster import KMeans

# 1) REGRESSION (supervised): house area (100 sq ft) -> price (lakh)
X_reg = np.array([[5], [7], [9], [11], [13]])
y_reg = np.array([30, 41, 50, 62, 70])
reg = LinearRegression().fit(X_reg, y_reg)
print("Regression  : predicted price for area 10 =", round(float(reg.predict([[10]])[0]), 2), "lakh (a continuous value)")

# 2) CLASSIFICATION (supervised): hours studied -> pass (1) / fail (0)
X_clf = np.array([[1], [2], [3], [4], [5], [6]])
y_clf = np.array([0, 0, 0, 1, 1, 1])
clf = LogisticRegression().fit(X_clf, y_clf)
print("Classification: label for 1.5 h =", int(clf.predict([[1.5]])[0]), "| label for 5.5 h =", int(clf.predict([[5.5]])[0]), "(discrete labels)")

# 3) CLUSTERING (unsupervised): no labels given, the algorithm finds groups
X_clu = np.array([[1, 1], [1.2, 0.8], [0.9, 1.1], [8, 8], [8.2, 7.9], [7.8, 8.1]])
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X_clu)
labels = km.labels_
same_first = labels[:3].tolist().count(labels[0]) == 3
same_last = labels[3:].tolist().count(labels[3]) == 3
print("Clustering  : first 3 points share a cluster:", same_first, "| last 3 share a cluster:", same_last,
      "| two different clusters:", labels[0] != labels[3])
