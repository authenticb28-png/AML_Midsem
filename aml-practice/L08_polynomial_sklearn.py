"""L8 · PolynomialFeatures + LinearRegression (the 'ice-cream sales vs temperature' lab pattern)."""
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.metrics import r2_score, mean_squared_error

pf = PolynomialFeatures(degree=2, include_bias=True)
print("features for x=3:", pf.fit_transform([[3]]).tolist(), "->", pf.get_feature_names_out(["x"]).tolist())
print("two inputs, degree 2:", PolynomialFeatures(2).fit(np.zeros((1, 2))).get_feature_names_out(["x1", "x2"]).tolist())

temp = np.array([14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36], float).reshape(-1, 1)
sales = np.array([215, 250, 300, 360, 430, 510, 600, 700, 815, 940, 1075, 1220], float)
lin = LinearRegression().fit(temp, sales)
quad = make_pipeline(PolynomialFeatures(2), LinearRegression()).fit(temp, sales)
for name, m in [("linear   ", lin), ("degree 2 ", quad)]:
    p = m.predict(temp)
    print(f"{name} R^2 = {r2_score(sales, p):.4f}  MSE = {mean_squared_error(sales, p):9.2f}")
print("degree 2 wins because sales grow faster at high temperature (a curve, not a line).")
