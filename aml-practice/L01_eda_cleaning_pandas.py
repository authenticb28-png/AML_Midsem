"""L1 · EDA checklist + missing values + duplicates with pandas (mirrors the 'Basic Data Preprocessing' lab)."""
import numpy as np
import pandas as pd

df = pd.DataFrame({
    "Name":   ["Asha", "Ravi", "Meena", "Ravi", "John", "Zara"],
    "Age":    [25, np.nan, 31, np.nan, 45, 28],
    "Salary": [50000, 62000, np.nan, 62000, 90000, 58000],
    "Dept":   ["IT", "HR", "IT", "HR", None, "IT"],
})

# EDA step 1: structure
print("shape:", df.shape)
print("dtypes:", dict(df.dtypes.astype(str)))
# EDA step 2: missing values per column and in total
print("missing per column:", df.isnull().sum().to_dict())
print("total missing cells:", int(df.isnull().sum().sum()))
# EDA step 4: duplicates (Ravi appears twice, identical row)
print("duplicate rows:", int(df.duplicated().sum()))

# Preprocessing step 1: impute numeric columns with the mean, categorical with the mode
age_mean = df["Age"].mean()           # mean ignores NaN: (25+31+45+28)/4
sal_mean = df["Salary"].mean()        # (50000+62000+62000+90000+58000)/5
df["Age"] = df["Age"].fillna(age_mean)
df["Salary"] = df["Salary"].fillna(sal_mean)
df["Dept"] = df["Dept"].fillna(df["Dept"].mode()[0])
print("Age mean used:", age_mean, "| Salary mean used:", sal_mean)
print("missing after imputation:", int(df.isnull().sum().sum()))

# Preprocessing: remove duplicates
before = df.shape
df = df.drop_duplicates()
print("shape before/after dedup:", before, "->", df.shape)

# EDA step 5/6: summary statistics and a correlation
print("Age median:", df["Age"].median(), "| Salary IQR:", df["Salary"].quantile(0.75) - df["Salary"].quantile(0.25))
print("corr(Age, Salary) =", round(df["Age"].corr(df["Salary"]), 3))
