"""L6 lab (course 'Mini-Batch GD'): y = w*x, seed 42 once, shuffle indices each epoch, groups of batch_size,
average the group's gradients, update once per group. batch_size=1 -> SGD, batch_size=N -> Batch GD."""
import numpy as np

def train_minibatch(X, Y, learning_rate, batch_size, epochs):
    X = np.array(X, float); Y = np.array(Y, float); N = len(X); w = 0.0
    np.random.seed(42)
    for _ in range(epochs):
        idx = np.arange(N); np.random.shuffle(idx)
        for s in range(0, N, batch_size):
            g = idx[s:s + batch_size]                      # last group may be smaller
            dw = np.mean(2 * (w * X[g] - Y[g]) * X[g])
            w = w - learning_rate * dw
    return round(float(w), 2)

print(train_minibatch(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 2, 500))   # expected 0.5
print(train_minibatch([1, 2, 3], [2, 4, 6], 0.001, 3, 100), "<- batch_size = N reproduces the Batch GD lab (1.22)")
print(train_minibatch([1, 2, 3], [2, 4, 6], 0.001, 1, 100), "<- batch_size = 1 behaves like SGD")

assert train_minibatch(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 2, 500) == 0.5
assert train_minibatch([1, 2, 3], [2, 4, 6], 0.001, 3, 100) == 1.22
print("all tests passed")
