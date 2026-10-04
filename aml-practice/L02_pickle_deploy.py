"""L2 · Phase 10: serialise a trained model to .pkl, load it back, and serve a prediction (batch vs real-time)."""
import os, pickle, tempfile
import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1.0], [2.0], [3.0], [4.0]]); y = np.array([3.0, 5.0, 7.0, 9.0])   # y = 2x + 1
model = LinearRegression().fit(X, y)

path = os.path.join(tempfile.gettempdir(), "aml_model.pkl")
with open(path, "wb") as f:
    pickle.dump(model, f)                    # export / serialise
with open(path, "rb") as f:
    loaded = pickle.load(f)                  # what an API server would do at start-up

print("real-time inference, one request x=10 ->", round(float(loaded.predict([[10.0]])[0]), 4))
batch = np.array([[5.0], [6.0], [7.0]])
print("batch inference (nightly job)        ->", np.round(loaded.predict(batch), 4).tolist())
print("parameters survived the round trip   :", round(float(loaded.coef_[0]), 4), round(float(loaded.intercept_), 4))
os.remove(path)
