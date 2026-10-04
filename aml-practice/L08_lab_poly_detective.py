"""L8 lab (course 'Polynomial Regression Detective'): fit each degree, MSE on train/test, pick best test MSE,
classify underfit / overfit / good with the lab's exact rules."""
import json
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

def analyse(data):
    Xtr, ytr = np.array(data["X_train"], float), np.array(data["y_train"], float)
    Xte, yte = np.array(data["X_test"], float), np.array(data["y_test"], float)
    tr_m, te_m, cls = [], [], []
    for d in data["degrees"]:
        pf = PolynomialFeatures(degree=d)
        model = LinearRegression().fit(pf.fit_transform(Xtr), ytr)
        tr = float(np.mean((ytr - model.predict(pf.transform(Xtr))) ** 2))
        te = float(np.mean((yte - model.predict(pf.transform(Xte))) ** 2))
        tr_m.append(tr); te_m.append(te)
        if tr > 0.3 and te > 0.3 and abs(tr - te) < 0.05:
            cls.append("underfit")
        elif tr < 0.1 and te > 0.15:
            cls.append("overfit")
        else:
            cls.append("good")
    best_idx = min(range(len(te_m)), key=lambda i: (te_m[i], data["degrees"][i]))
    return {"best_degree": data["degrees"][best_idx], "train_mses": [round(v, 4) for v in tr_m],
            "test_mses": [round(v, 4) for v in te_m], "classifications": cls}

sample = {"X_train": [[-2.0], [-1.5], [-1.0], [-0.5], [0.0], [0.5], [1.0], [1.5], [2.0]],
          "y_train": [-0.9093, -0.9975, -0.8415, -0.4794, 0.0, 0.4794, 0.8415, 0.9975, 0.9093],
          "X_test": [[-1.75], [-0.75], [0.25], [1.25], [1.75]],
          "y_test": [-0.9840, -0.6816, 0.2474, 0.9490, 0.9840], "degrees": [1, 3, 5, 10]}
out = analyse(sample)
print("course sample input ->", json.dumps(out))
print("NOTE: the course's printed expected output for this sample could not be reproduced with")
print("      PolynomialFeatures + LinearRegression (see UNCLEAR.md); the rules below are what is graded.")

# test on a noisy-parabola dataset where the three behaviours really occur
rng = np.random.default_rng(8)
xtr = np.sort(rng.uniform(-3, 3, 30)); ytr = xtr ** 2 + rng.normal(0, 0.3, 30)
xte = np.sort(rng.uniform(-3, 3, 30)); yte = xte ** 2 + rng.normal(0, 0.3, 30)
test = {"X_train": xtr.reshape(-1, 1).tolist(), "y_train": ytr.tolist(), "X_test": xte.reshape(-1, 1).tolist(),
        "y_test": yte.tolist(), "degrees": [1, 2, 12]}
res = analyse(test)
print("parabola test       ->", json.dumps(res))
assert res["classifications"] == ["underfit", "good", "overfit"] and res["best_degree"] == 2
print("all tests passed")
