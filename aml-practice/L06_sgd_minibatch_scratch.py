"""L6 · One epoch of Batch GD, SGD and Mini-Batch GD on the worksheet data (x, y) = (1,2),(2,4),(3,6),(4,8).
Per-sample half-squared loss J_i = 0.5*(y_hat - y)^2  ->  dJ_i/dtheta0 = e,  dJ_i/dtheta1 = e*x   (e = y_hat - y)."""
import numpy as np

x = np.array([1, 2, 3, 4], float); y = np.array([2, 4, 6, 8], float)
alpha = 0.1

def sample_grad(theta, i):
    e = theta[0] + theta[1] * x[i] - y[i]
    return np.array([e, e * x[i]])

# ---------- Batch GD: average all 4 gradients at theta = [0,0], update ONCE ----------
theta = np.zeros(2)
G = np.array([sample_grad(theta, i) for i in range(4)])
print("BGD per-sample gradients:\n", G)
print("BGD average gradient:", G.mean(0))
theta = theta - alpha * G.mean(0)
print("BGD theta after 1 epoch (1 update):", theta)

# ---------- SGD: shuffled order Sample 2, 4, 1, 3 -> update after EVERY sample ----------
order = [1, 3, 0, 2]                     # zero-based indices of samples 2, 4, 1, 3
theta = np.zeros(2)
for step, i in enumerate(order, 1):
    pred = theta[0] + theta[1] * x[i]
    g = sample_grad(theta, i)
    theta = theta - alpha * g
    print(f"SGD step {step}: sample {i+1} x={x[i]:.0f} y={y[i]:.0f} pred={pred:.3f} grad={np.round(g,3)} new theta={np.round(theta,3)}")

# ---------- Mini-batch GD, b = 2: batches {S2,S4}, {S1,S3} ----------
theta = np.zeros(2)
for k, batch in enumerate([[1, 3], [0, 2]], 1):
    g = np.mean([sample_grad(theta, i) for i in batch], axis=0)
    theta = theta - alpha * g
    print(f"MBGD b=2 batch {k} {[i+1 for i in batch]}: avg grad={np.round(g,3)} theta={np.round(theta,3)}")

# ---------- Mini-batch GD, b = 3: batches {S2,S4,S1}, {S3} ----------
theta = np.zeros(2)
for k, batch in enumerate([[1, 3, 0], [2]], 1):
    g = np.mean([sample_grad(theta, i) for i in batch], axis=0)
    theta = theta - alpha * g
    print(f"MBGD b=3 batch {k} {[i+1 for i in batch]}: avg grad={np.round(g,3)} theta={np.round(theta,3)}")
print("updates per epoch: BGD 1 | SGD m = 4 | MBGD ceil(m/b): b=2 ->", int(np.ceil(4/2)), ", b=3 ->", int(np.ceil(4/3)))

# ---------- general mini-batch trainer (b=1 is SGD, b=m is BGD) ----------
def minibatch_gd(x, y, alpha, epochs, b, seed=0):
    rng = np.random.default_rng(seed); th = np.zeros(2); m = len(x)
    for _ in range(epochs):
        idx = rng.permutation(m)                          # shuffle every epoch
        for s in range(0, m, b):
            B = idx[s:s + b]; e = th[0] + th[1] * x[B] - y[B]
            th -= alpha * np.array([e.mean(), (e * x[B]).mean()])
    return th
for b in [1, 2, 4]:
    print(f"b={b}: theta after 200 epochs =", np.round(minibatch_gd(x, y, 0.05, 200, b), 4))
