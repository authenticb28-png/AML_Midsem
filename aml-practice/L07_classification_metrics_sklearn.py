"""L7 · confusion_matrix, classification_report, precision_recall_fscore_support, fbeta_score."""
from sklearn.metrics import confusion_matrix, accuracy_score, precision_recall_fscore_support, f1_score, fbeta_score, classification_report

actual    = list("RRRRRRRR" + "PPPPPP" + "SSSS")
predicted = list("RRRRRRPS" + "RPPPPS" + "PPSS")
labels = ["R", "P", "S"]
print(confusion_matrix(actual, predicted, labels=labels))
print("accuracy:", round(accuracy_score(actual, predicted), 4))
p, r, f, s = precision_recall_fscore_support(actual, predicted, labels=labels, zero_division=0)
print("per-class precision:", p.round(3).tolist(), " recall:", r.round(3).tolist(), " f1:", f.round(3).tolist(), " support:", s.tolist())
for avg in ["macro", "weighted", "micro"]:
    print(f"{avg:8s} F1 = {f1_score(actual, predicted, average=avg):.3f}")
# binary view: Needs Support = positive
yb = [1 if a == "S" else 0 for a in actual]; pb = [1 if q == "S" else 0 for q in predicted]
print("Support-vs-rest confusion [[TN FP],[FN TP]]:", confusion_matrix(yb, pb).tolist())
print("F2 (recall-weighted) for Support:", round(fbeta_score(yb, pb, beta=2), 3))
print(classification_report(actual, predicted, labels=labels, digits=3, zero_division=0))
