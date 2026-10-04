# UNCLEAR.md — things to check yourself

Each item lists the file, the physical page, what is unclear, and what the website does about it. Nothing here was guessed silently.

## Errors or inconsistencies inside the worksheets

1. **AML_Lecture 3_Worksheet_Filled.PDF, p.16–17 (Section 9, slope derivation).** The sheet defines `a_i = x_i − x̄` and `b_i = y_i − ȳ`, then writes `E(m) = Σ(a_i − m b_i)²`, which would make *a* the y-deviation. At the end it substitutes `b_i = x_i − x̄, a_i = y_i − ȳ`, the opposite of the definition. The whiteboard (Whiteboards/L04 p.8) uses the consistent version `a_i = y_i − ȳ`, `b_i = x_i − x̄`. The final formula is correct either way.
   *Site:* teaches one consistent naming, `a_i = x_i − x̄` and `b_i = y_i − ȳ`, so `E(m) = Σ(b_i − m a_i)²` and `m = Σa_i b_i / Σa_i²`, and adds a note about the worksheet typo.
2. **AML_Lecture 3, p.2 (Section 2 plot).** The plot legend shows candidate lines `ŷ = 7x − 8`, `ŷ = 9x − 22`, `ŷ = 12x − 40`, but the table beside it lists `10x − 30`, `12x − 40`, `8x − 10`.
   *Site:* redraws the plot using the table's three lines (and adds the true OLS line `ŷ = 14x − 57`).
3. **AML_Lecture 3, p.6 ("A Candidate Prediction Line" plot).** The line labelled `ŷ = 14.00x − 57.00` is the exact OLS fit of the CGPA→stipend table (x̄ = 7.5, ȳ = 48, Sxy = 70, Sxx = 5). The worksheet never says so.
   *Site:* states this explicitly and solves it by hand.
4. **AML_Lecture 1, p.9 (PRACTICE P7).** Cat=1, Dog=2, Fish=3, Bird=4 → Bird = `100` needs **3** bits. The key says "2 (or 3)". Two bits are enough only if you number from 0 (0–3).
   *Site:* explains both conventions; integer questions state which numbering is used.
5. **AML_Lecture 1, p.7 (Robust scaling).** The hand method (Q1/Q3 = medians of the lower and upper halves) gives Q1 = 125, Q3 = 25125. scikit-learn's `RobustScaler` uses linear-interpolated percentiles and gives Q1 = 150, Q3 = 250 for the same data, so the scaled values differ.
   *Site:* shows both and flags it as an exam trap. Hand questions use the worksheet method.
6. **AML_Lecture 5, p.5–6 (worked example).** Here `m` means the number of training examples, but in Lecture 4 `m` was the number of features. Epoch 2 uses rounded θ = (0.011, 0.047, 0.853), not the exact (0.010667, 0.047333, 0.853333).
   *Site:* follows the worksheet's rounding for the hand example and shows the exact-arithmetic result next to it.
7. **Whiteboards/L08 p.3 (handwritten).** Accuracy is written as `(TP+FP)/(TP+FP+TN+FN)`. It should be `(TP+TN)/(TP+TN+FP+FN)`.
   *Site:* uses the correct formula and lists this in the traps.
8. **Whiteboards/L06 p.4.** The class example drops the 1/m factor: `L = (2 − m)² + (4 − 2m)²`, so dL/dm = 10m − 20 and θ_new = 20α = 2 for α = 0.1. That is the gradient of the *sum* of squared errors, not of MSE.
   *Site:* reproduces it as given and shows the MSE version (θ_new = 10α = 1) for contrast.
9. **AML_Lecture 8, p.4 & answer key.** "Degree 5 → up to 4 bends." Correct as *turning points* (n − 1). Some textbooks count inflection points instead.
   *Site:* uses "turning points".

## Missing numbering (no content lost)

10. Practice-box numbering skips: L2 has no P8; L3 has no P1; L4 has no P8; L7 has no P1, P4, P5; L15 has no P4. These look like renumbering gaps, not missing pages. All pages were checked visually.
11. **AML_Lecture 6 (student copy, not teacher copy).** PRACTICE P1, P2, P3 (Step 4), P4, P5 (Mini-Batch 2), HOMEWORK P6 (Update 2), P7 and the Think & Discuss boxes have **blank answers**. The whiteboard (Whiteboards/L07) fills P4 (B, D, E, C, A) and iterations 1–3 of the SGD table.
    *Site:* every blank was solved and checked in Python (`aml-practice/L06_sgd_minibatch.py`). Compare these answers against your class notes.
12. **AML_Lecture 0 (student copy).** PRACTICE P3, "Complete the 'What DL Does' column" and the Reflect prompts are blank.
    *Site:* answers were written from the worksheet's own definitions.
13. **AML_Lecture 9, p.5 and p.13–14.** Several typed answers are cut off at the page edge, e.g. "Its predictions are mostly stable regardles…" and "The model will suffer from…". The meaning is clear from the answer-key page (p.15), which the site uses.

## Handwriting

14. **L11 - Feature Selection.pdf (class note, 15 Sep).** It is an *earlier draft* of Worksheet 10. It has extra material not in the final sheet: a curse-of-dimensionality table (bᵖ cells), variance of a binary feature = q(1 − q), a "do not select with raw training R²" warning, and a P2(a) drill on x = [−2..2], y = x². The handwriting adds Spearman correlation (non-linear), embedded methods, Forward/Backward/RFE/RFECV, the RFE steps (start 10 features → keep 5), `df.corr()` heatmap, 2ᵖ − 1 and p(p+1)/2. Everything was legible.
    *Site:* all included, badged "From class whiteboard/note".
15. **Whiteboards/L08 p.2.** The handwritten Adjusted-R² argument "1 − (1 − R²)×C … R² = 0.70 → 0.71 with p = 2 → 3" uses unclear numbers for n.
    *Site:* explains the same idea with the worksheet's exact numbers (n = 8). Check your own notes if your teacher used a different example.

## Study Pack (course quizzes and labs)

16. **3 - Coding & Lab Questions.md, "Time Series Forecasting" lab.** The expected output (2918.42, 2947.53, 2975.61) could not be reproduced. ARIMA(p,d,q) with p,q ≤ 3, d ≤ 2 and any trend, Holt's linear method, AutoReg and a linear trend were all tried with statsmodels 0.14.6. The closest is ARIMA(2,0,0) with a constant: 2922.63, 2952.47, 2979.18. The grader probably used a specific model or library version that the question does not state.
    *Site:* teaches the method (difference → AR/ARIMA → forecast → ×1.10 for safety stock) without claiming the exact numbers.
17. **4 - MCQs.md.** Many course-quiz answers are "not shown by Newton".
    *Site:* every one of them was solved and checked. The site uses them only as *pattern evidence* and never copies them as "official answers".
18. **GATE DA tags.** No question is tagged with a GATE DA year. I could not confirm any specific item verbatim against an official paper here, so everything is tagged **"GATE-style"** (rule 6).

## Found while building Lectures 1–15

19. **AML_Lecture 2, macro loop.** Step 3 "prepare data" comes before step 4 "split". The same worksheet warns that preprocessing statistics must come from the training data only.
    *Site:* shows the loop as printed and adds a trap: split first, then fit the preprocessing on train.
20. **AML_Lecture 2, P11.3 vs course quiz.** The worksheet key answers "No" to the cost–benefit question in P11.3, where no business value per unit is given. A course-quiz item with ₹/unit given answers "Yes".
    *Site:* explains that the answer depends on whether a value per unit is given, and shows both.
21. **3 - Coding & Lab Questions.md, "Polynomial Regression Detective" lab.** The printed expected output for the sample input could not be reproduced with `PolynomialFeatures` + `LinearRegression`.
    *Site:* teaches the lab's exact grading rules. `aml-practice/L08_lab_poly_detective.py` checks them on a noisy-parabola dataset where underfit, good and overfit all occur.
22. **AML_Lecture 12, Lasso closed form.** The worksheet writes the 1-D Lasso solution as "OLS numerator − λ". Differentiating Σ(·)² + λ|m| exactly gives m = (Sxy − λ/2)/Sxx. The worksheet has absorbed a ½ into λ.
    *Site:* uses the worksheet's form in numericals and notes the exact form in a derivation and a trap.
23. **AML_Lecture 15, softmax cross-entropy.** −ln(0.245) = 1.407 with the rounded probability. The worksheet's code uses the unrounded 0.2447 and prints 1.408.
    *Site:* accepts 1.407 ± 0.002, which covers both.
24. **AML_Lecture 5, epoch 2 table.** The worksheet's θ after epoch 2 is [0.00855, 0.03842, 0.67381]. That comes from carrying rounded intermediates; exact arithmetic gives [0.00821, 0.03873, 0.67372].
    *Site:* shows the worksheet values with the exact values beside them. No question depends on this digit.
