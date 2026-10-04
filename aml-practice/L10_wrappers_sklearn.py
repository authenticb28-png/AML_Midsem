"""L10 · SequentialFeatureSelector (forward/backward), RFE, RFECV, and leakage-free selection inside a Pipeline."""
import numpy as np
from sklearn.feature_selection import SequentialFeatureSelector, RFE, RFECV
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score, KFold

rng = np.random.default_rng(5)
X = rng.normal(size=(80, 4)); y = 3 * X[:, 0] + 2 * X[:, 3] + 0.5 * X[:, 2] + rng.normal(0, 1, 80)
cv = KFold(5, shuffle=True, random_state=0)
fwd = SequentialFeatureSelector(LinearRegression(), n_features_to_select=2, direction="forward", cv=cv).fit(X, y)
bwd = SequentialFeatureSelector(LinearRegression(), n_features_to_select=2, direction="backward", cv=cv).fit(X, y)
print("forward  keeps:", ["f%d" % (i + 1) for i in np.flatnonzero(fwd.get_support())])
print("backward keeps:", ["f%d" % (i + 1) for i in np.flatnonzero(bwd.get_support())])

rfe = RFE(LinearRegression(), n_features_to_select=2).fit(X, y)          # drops the smallest |coef| each round
print("RFE ranking (1 = kept):", rfe.ranking_.tolist())
rfecv = RFECV(LinearRegression(), cv=cv).fit(X, y)
print("RFECV chose", rfecv.n_features_, "features:", ["f%d" % (i + 1) for i in np.flatnonzero(rfecv.support_)])

# Right way: selection is a step INSIDE the pipeline, so each CV fold re-selects using only its training part.
pipe = make_pipeline(SequentialFeatureSelector(LinearRegression(), n_features_to_select=2, cv=3), LinearRegression())
print("leakage-free CV R^2 of select+fit pipeline:", round(cross_val_score(pipe, X, y, cv=cv).mean(), 4))
