"""L7 · Confusion matrix, precision/recall/F1, macro/weighted/micro averages from scratch (Master Test Data C)."""
import numpy as np

classes = ["R", "P", "S"]          # Ready, Needs Practice, Needs Support
actual    = list("RRRRRRRR" + "PPPPPP" + "SSSS")
predicted = list("RRRRRRPS" + "RPPPPS" + "PPSS")
k = {c: i for i, c in enumerate(classes)}

cm = np.zeros((3, 3), int)                     # rows = ACTUAL, columns = PREDICTED (sklearn convention)
for a, p in zip(actual, predicted):
    cm[k[a], k[p]] += 1
print("confusion matrix (rows actual R,P,S; cols predicted R,P,S):\n", cm)
acc = np.trace(cm) / cm.sum()
print("accuracy =", np.trace(cm), "/", cm.sum(), "=", round(acc, 4))

prec, rec, f1, sup = [], [], [], []
for i, c in enumerate(classes):
    tp = cm[i, i]; fp = cm[:, i].sum() - tp; fn = cm[i, :].sum() - tp; tn = cm.sum() - tp - fp - fn
    P = tp / (tp + fp); Rc = tp / (tp + fn); F = 2 * tp / (2 * tp + fp + fn)
    prec.append(P); rec.append(Rc); f1.append(F); sup.append(cm[i, :].sum())
    print(f"class {c}: TP={tp} FP={fp} FN={fn} TN={tn}  precision={P:.3f} recall={Rc:.3f} F1={F:.3f} specificity={tn/(tn+fp):.3f}")
prec, rec, f1, sup = map(np.array, (prec, rec, f1, sup))
print(f"macro    P={prec.mean():.3f} R={rec.mean():.3f} F1={f1.mean():.3f}")
print(f"weighted P={np.average(prec, weights=sup):.3f} R={np.average(rec, weights=sup):.3f} F1={np.average(f1, weights=sup):.3f}")
TP = np.trace(cm); FP = FN = cm.sum() - TP
print(f"micro    P={TP/(TP+FP):.3f} R={TP/(TP+FN):.3f} F1={2*TP/(2*TP+FP+FN):.3f}  (= accuracy for single-label multiclass)")

def f_beta(P, R, beta):
    return (1 + beta ** 2) * P * R / (beta ** 2 * P + R)
P, R = 0.6, 0.75          # Needs-Support after correcting S15 (PRACTICE P9)
print(f"P9: F1={f_beta(P,R,1):.3f}  F0.5={f_beta(P,R,0.5):.3f} (precision-heavy)  F2={f_beta(P,R,2):.3f} (recall-heavy)")
