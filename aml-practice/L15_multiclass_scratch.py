"""L15 · One-vs-Rest targets and prediction, softmax, multiclass cross-entropy, and softmax regression by GD."""
import numpy as np

labels = ["Y", "O", "N", "Y", "N"]
for k in ["Y", "O", "N"]:
    print(f"OvR target for Model {k}:", [1 if l == k else 0 for l in labels])

q = np.array([0.42, 0.68, 0.55])                    # independent OvR sigmoid outputs (Y, N, O)
print("OvR predicts", ["Y", "N", "O"][int(np.argmax(q))], "| sum =", round(float(q.sum()), 2), "| normalised =", np.round(q / q.sum(), 3).tolist())

def softmax(z):
    z = np.asarray(z, float); e = np.exp(z - z.max())   # subtract max: same result, no overflow
    return e / e.sum()
p = softmax([2, 1, 0])
print("softmax(2,1,0) =", np.round(p, 3).tolist(), " e^z =", np.round(np.exp([2, 1, 0]), 3).tolist(), " sum e^z =", round(float(np.exp([2, 1, 0]).sum()), 3))
print("shift invariance: softmax(102,101,100) =", np.round(softmax([102, 101, 100]), 3).tolist())
print("CE if true = No :", round(-np.log(p[1]), 3), " | if true = Yes:", round(-np.log(p[0]), 3))
print("K(d+1) parameters for K=6, d=4:", 6 * (4 + 1))
print("odds at p=0.8:", round(0.8 / 0.2, 3), " log-odds:", round(np.log(4), 3))

# softmax regression by batch GD: gradient wrt logits = P - Y (one-hot)
rng = np.random.default_rng(1)
centers = np.array([[0, 0], [3, 3], [0, 4]])
X = np.vstack([c + rng.normal(0, 0.7, (40, 2)) for c in centers]); t = np.repeat([0, 1, 2], 40)
Xb = np.column_stack([np.ones(len(X)), X]); Y = np.eye(3)[t]; B = np.zeros((3, 3))
for it in range(2000):
    Z = Xb @ B; P = np.exp(Z - Z.max(1, keepdims=True)); P /= P.sum(1, keepdims=True)
    B -= 0.1 * Xb.T @ (P - Y) / len(X)
CE = -np.mean(np.sum(Y * np.log(P), axis=1))
print("softmax regression: cross-entropy =", round(float(CE), 4), " accuracy =", round(float(np.mean(P.argmax(1) == t)), 3),
      " rows of P sum to 1:", bool(np.allclose(P.sum(1), 1)))
