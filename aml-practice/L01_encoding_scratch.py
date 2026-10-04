"""L1 · Label, ordinal, one-hot and binary encoding from scratch (worksheet tables + PRACTICE P7)."""
import math

colors = ["Red", "Blue", "Green"]

# Label encoding: one integer per category (alphabetical, like sklearn's LabelEncoder)
label_map = {c: i for i, c in enumerate(sorted(set(colors)))}
print("label   :", label_map)

# Ordinal encoding: a controlled order that we choose
edu_order = ["HS", "Bachelor", "Master", "PhD"]
ordinal = {e: i for i, e in enumerate(edu_order)}
print("ordinal :", ordinal)

# One-hot: N binary columns (columns sorted alphabetically as in the worksheet table)
cols = sorted(set(colors))                      # ['Blue', 'Green', 'Red']
for c in colors:
    print("one-hot :", c, "->", [1 if c == k else 0 for k in cols], "columns", cols)

# Binary encoding: integer id -> binary digits split across columns
def binary_encode(categories, start=1):
    ids = {c: i + start for i, c in enumerate(categories)}
    width = max(ids.values()).bit_length()
    return {c: format(v, "0{}b".format(width)) for c, v in ids.items()}, width

animals = ["Cat", "Dog", "Fish", "Bird"]
codes, width = binary_encode(animals, start=1)
print("binary (ids 1..4):", codes, "bits needed =", width)
codes0, width0 = binary_encode(animals, start=0)
print("binary (ids 0..3):", codes0, "bits needed =", width0)

for n in [3, 4, 500, 1000]:
    print(f"N={n:4d} categories: one-hot cols = {n}, binary cols = ceil(log2(N)) = {math.ceil(math.log2(n))}")
