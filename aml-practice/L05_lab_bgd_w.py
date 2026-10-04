"""L5 lab (course 'Batch Gradient Descent for Linear Regression'): model y = w*x, bias fixed at 0.
grad_i = 2*(w*x_i - y_i)*x_i, average over all N, update w once per epoch. Return round(w, 2)."""
import numpy as np

def train_bgd(x, y, learning_rate, epochs):
    np.random.seed(42)
    x = np.array(x, dtype=np.float64); y = np.array(y, dtype=np.float64)
    w = 0.0
    for _ in range(epochs):
        dw = np.mean(2 * (w * x - y) * x)      # average of the N per-sample gradients
        w = w - learning_rate * dw             # ONE update per epoch
    return round(float(w), 2)

print(train_bgd(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 500))   # expected 0.5
print(train_bgd([1, 2, 3], [2, 4, 6], 0.001, 100))                                     # expected 1.22

assert train_bgd(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 500) == 0.5
assert train_bgd([1, 2, 3], [2, 4, 6], 0.001, 100) == 1.22
print("all tests passed")
