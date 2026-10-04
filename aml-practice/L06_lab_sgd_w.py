"""L6 lab (course 'SGD'): model y = w*x (bias 0). Seed 42 before EVERY shuffle, update after every sample.
dw = 2*(w*x_i - y_i)*x_i ; w = w - lr*dw. Return round(w, 2)."""
import numpy as np

def train_sgd(X, Y, learning_rate, epochs):
    X = np.array(X, float); Y = np.array(Y, float); w = 0.0
    for _ in range(epochs):
        idx = np.arange(len(X))
        np.random.seed(42)              # the lab says: set the seed before every shuffle
        np.random.shuffle(idx)          # in-place shuffle of the index array
        for i in idx:
            pred = w * X[i]
            dw = 2 * (pred - Y[i]) * X[i]
            w = w - learning_rate * dw  # immediate update -> this is what makes it SGD
    return round(float(w), 2)

print(train_sgd(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 500))   # expected 0.5
print(train_sgd([1, 2, 3], [2, 4, 6], 0.001, 100))                                     # expected 1.88

assert train_sgd(list(range(1, 11)), [0.5 * k for k in range(1, 11)], 0.001, 500) == 0.5
assert train_sgd([1, 2, 3], [2, 4, 6], 0.001, 100) == 1.88
print("all tests passed")
