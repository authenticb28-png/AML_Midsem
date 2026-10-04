"""L3 lab (course 'Compute the Best-Fit Line'): return [m, b] rounded to 2 dp, or [-1.0, -1.0] if all x equal.
Input format: n / x values / y values. Here the sample input is hard-coded so the file runs on its own."""

def compute_ols(x, y):
    n = len(x)
    if n == 0:
        return [-1.0, -1.0]
    x_bar = sum(x) / n
    y_bar = sum(y) / n
    num = sum((xi - x_bar) * (yi - y_bar) for xi, yi in zip(x, y))
    den = sum((xi - x_bar) ** 2 for xi in x)
    if den == 0:
        return [-1.0, -1.0]
    m = num / den
    b = y_bar - m * x_bar
    return [round(m, 2), round(b, 2)]

sample_input = """5
1 2 3 4 5
2 4 5 4 5"""
lines = sample_input.split("\n")
x = list(map(float, lines[1].split())); y = list(map(float, lines[2].split()))
m, b = compute_ols(x, y)
print(f"{m:.2f} {b:.2f}")                    # expected: 0.60 2.20

# tests
assert compute_ols([1, 2, 3, 4, 5], [2, 4, 5, 4, 5]) == [0.6, 2.2]
assert compute_ols([3, 3, 3], [1, 2, 3]) == [-1.0, -1.0]
assert compute_ols([1, 3, 5, 7, 9], [25, 40, 55, 65, 80]) == [6.75, 19.25]
print("all tests passed")
