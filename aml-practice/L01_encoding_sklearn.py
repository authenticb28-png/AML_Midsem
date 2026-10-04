"""L1 · Encoding with pandas / scikit-learn (mirrors the 'Data Preprocessing pipeline 1' lab)."""
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, OrdinalEncoder, OneHotEncoder, StandardScaler, MinMaxScaler

df = pd.DataFrame({
    "Gender": ["M", "F", np.nan, "F"],
    "City":   ["Delhi", "Pune", "Delhi", np.nan],
    "Age":    [20, np.nan, 30, 40],
    "Score":  [50, 70, np.nan, 90],
})
# 1-2) impute: numeric -> mean, categorical -> mode
for c in ["Age", "Score"]:
    df[c] = df[c].fillna(df[c].mean())
for c in ["Gender", "City"]:
    df[c] = df[c].fillna(df[c].mode()[0])
# 3) label-encode the binary column
df["Gender"] = LabelEncoder().fit_transform(df["Gender"])          # F->0, M->1
# 4) one-hot encode the nominal column
df = pd.get_dummies(df, columns=["City"], dtype=int)
# 5) standard-scale Age, min-max scale Score
df["Age"] = StandardScaler().fit_transform(df[["Age"]]).ravel().round(4)
df["Score"] = MinMaxScaler().fit_transform(df[["Score"]]).ravel().round(4)
print(df.to_string())

# OrdinalEncoder with an explicit order, and OneHotEncoder object
edu = np.array([["Master"], ["HS"], ["PhD"], ["Bachelor"]])
oe = OrdinalEncoder(categories=[["HS", "Bachelor", "Master", "PhD"]])
print("ordinal:", oe.fit_transform(edu).ravel().tolist())
ohe = OneHotEncoder(sparse_output=False)
print("one-hot columns:", ohe.fit(np.array([["Red"], ["Blue"], ["Green"]])).get_feature_names_out().tolist())
print("Red ->", ohe.transform([["Red"]]).ravel().tolist())
