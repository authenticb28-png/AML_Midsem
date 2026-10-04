"""L1 · Feature scaling with scikit-learn. Note RobustScaler uses interpolated percentiles,
so its Q1/Q3 differ from the worksheet's 'median of halves' hand method (exam trap!)."""
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler, MaxAbsScaler, RobustScaler

A = np.array([[10], [20], [30], [40], [50]], dtype=float)
B = np.array([[2], [4], [6], [8], [10]], dtype=float)
C = np.array([[100], [150], [200], [250], [50000]], dtype=float)
D = np.array([[-4], [0], [2], [8]], dtype=float)

print("MinMaxScaler  :", MinMaxScaler().fit_transform(A).ravel().tolist())
sc = StandardScaler().fit(B)
print("StandardScaler: mean_ =", sc.mean_[0], " scale_ =", round(sc.scale_[0], 4), " z =", np.round(sc.transform(B).ravel(), 2).tolist())
print("MaxAbsScaler  :", MaxAbsScaler().fit_transform(D).ravel().tolist())
rs = RobustScaler().fit(C)
print("RobustScaler  : center_ (median) =", rs.center_[0], " scale_ (IQR) =", rs.scale_[0])
print("                scaled =", np.round(rs.transform(C).ravel(), 3).tolist())
print("np.percentile Q1, Q3 =", np.percentile(C, 25), np.percentile(C, 75), "(linear interpolation)")

# Correct usage: fit on TRAIN only, then transform test with the same statistics
train, test = np.array([[1.0], [2.0], [3.0]]), np.array([[10.0]])
mm = MinMaxScaler().fit(train)
print("test value 10 scaled with train min/max ->", mm.transform(test).ravel().tolist(), "(can exceed 1)")
