# COVERAGE — AML Exam Prep (Lectures 0–15)

Source folder: `./Lectures/` (16 worksheets + 1 class note + 4 whiteboard PDFs). There is no `./source_pdfs/` folder; the files live in `./Lectures/`.
Sample questions: no `./sample_questions/` folder, but `./Study Pack/` holds your real course quizzes (`4 - MCQs.md`) and coding labs (`3 - Coding & Lab Questions.md`). These are analysed in Phase 1 (site page **Quiz Patterns**).

Page numbers are **physical PDF pages** (what a PDF viewer shows), not the printed footer number.
Badges: **C** = From class worksheet · **CW** = From class whiteboard/note · **R** = ⚠ Not covered in class – researched · **X** = Extra (beyond worksheet).
`Done` is ticked by `verify.py` (✅ = unit present in site data with explanation, formulas, ≥5 questions, listed derivations and plots).

## File → lecture map (identified from each file's content heading)

| File | Heading found inside | Lecture | Pages |
|---|---|---|---|
| AML_Lecture 0_Worksheet_Filled.pdf | "Worksheet for Lecture 0 — From Traditional Code to AI, ML & DL" | L0 Foundations | 10 |
| AML_Lecture 1_Worksheet_Filled.pdf | "Worksheet 01 Lecture 1 — The ML Project Lifecycle (Part 1)" | L1 | 9 |
| AML_Lecture 2_Worksheet_Filled.pdf | "Worksheet 02 Lecture 2 — The ML Project Lifecycle (Part 2)" | L2 | 11 |
| AML_Lecture 3_Worksheet_Filled.PDF | "Worksheet 03 — Lecture 3 (TEACHER COPY) — Simple Linear Regression Using the OLS Method" | L3 | 20 |
| AML_Lecture 4_Worksheet_Filled.pdf | "Worksheet 04 — Lecture 4 — Multiple Linear Regression (OLS)" | L4 | 14 |
| AML_Lecture 5_Worksheet_Filled.pdf | "Worksheet 05 — Lecture 5 — Batch Gradient Descent for MLR" | L5 | 11 |
| AML_Lecture 6_Worksheet_Filled.pdf | "Worksheet 06 — Lecture 6 — Stochastic & Mini-Batch GD" | L6 | 12 |
| AML_Lecture 7_Worksheet_Filled.pdf | "Worksheet 07 — Lecture 7 (TEACHER COPY) — Evaluation Metrics" | L7 | 13 |
| AML_Lecture 8_Worksheet_Filled.pdf | "Worksheet 08 — Lecture 8 — Polynomial Regression & Assumptions" | L8 | 13 |
| AML_Lecture 9_Worksheet_Filled.pdf | "Worksheet 09 — Lecture 9 — Bias, Variance and the Tradeoff" | L9 | 15 |
| AML_Lecture 10_Worksheet_Filled.pdf | "Worksheet 10 — Lecture 10 — Feature Selection" | L10 | 17 |
| L11 - Feature Selection.pdf | OneNote class note (15 Sep) of an *earlier draft* of Worksheet 10 + handwriting | L10 (class note) | 7 |
| AML_Lecture 11_Worksheet_Filled.pdf | "Worksheet 11 — Lecture 11 — Dimensionality Reduction and PCA" | L11 | 15 |
| AML_Lecture 12_Worksheet_Filled.pdf | "Worksheet 12 — Lecture 12 — Regularization (L1 and L2)" | L12 | 22 |
| Lecture13_Worksheet_Teacher.pdf | "Worksheet 13 — Lecture 13 — Time Series Analysis" | L13 | 22 |
| AML_Lecture14_Worksheet_Teacher (1).pdf | "Worksheet 14 — Lecture 14 — MLE and Logistic Regression" | L14 | 15 |
| AML_Lecture15_Worksheet_Teacher (1) (1).pdf | "Worksheet 15 — Lecture 15 — GD on Logistic Regression & Multiclass" | L15 | 13 |
| Whiteboards/L04 - 2026-08-20 … .pdf | OneNote whiteboard on Worksheet 3 (SLR/OLS) | L3 (whiteboard) | 10 |
| Whiteboards/L06 - 2026-08-27 … .pdf | OneNote whiteboard on Worksheet 5 (Batch GD) | L5 (whiteboard) | 6 |
| Whiteboards/L07 - 2026-09-01 … .pdf | OneNote whiteboard on Worksheet 6 (SGD/Mini-batch) | L6 (whiteboard) | 6 |
| Whiteboards/L08 - 2026-09-03 … .pdf | OneNote whiteboard on Worksheet 7 (Metrics) | L7 (whiteboard) | 6 |

The expected map in the brief was correct. The only correction: "L11 - Feature Selection.pdf" is the **Lecture 10** class note, not Lecture 11. The whiteboard file numbers (L04, L06, L07, L08) are class-session numbers, not worksheet numbers.

## Teaching units

Columns: ID | Lecture | Section title (worksheet sections covered) | Page(s) | Derivations | Plots/diagrams | Formulas | Worked examples / PRACTICE boxes | Code / pseudocode | Done

| ID | Lec | Section title | Pages | Derivations | Plots/diagrams | Formulas | Worked examples / PRACTICE | Code | Done |
|---|---|---|---|---|---|---|---|---|---|
| L00.1 | L0 | Traditional programming & the paradigm flip (Parts 1, 3) [C] | 1–3 | – | P00-trad-flow, P00-ifelse, P00-flip | Data+Rules→Answers; Data+Answers→Rules | Hook spam filter, Reflect, Key insight, Takeaway | – | ✅ |
| L00.2 | L0 | AI ⊃ ML ⊃ DL; structured vs unstructured (Parts 2–4) [C] | 2–5 | – | P00-venn, P00-nn | DL ⊂ ML ⊂ AI | Key areas of AI, classic ML examples, DL examples | – | ✅ |
| L00.3 | L0 | Labelled vs unlabelled data (Part 5) [C] | 5–6 | – | P00-labelled | Labelled = input + label | PRACTICE P3, Reflect | – | ✅ |
| L00.4 | L0 | Four learning paradigms (Part 6) [C] + self-supervised [R] | 7–8 | – | P00-paradigms | – | Google Photos, drone case studies | – | ✅ |
| L00.5 | L0 | Core tasks: regression, classification, clustering (Part 7) [C] | 8–10 | – | P00-tasks | output-type table | Uber, medical screening, Netflix; complete-the-table | L00_tasks_demo.py | ✅ |
| L01.1 | L1 | Problem definition — five-step blueprint (Part 1) [C] | 1–2 | – | – | – | PRACTICE P1, Reflect 1 | – | ✅ |
| L01.2 | L1 | Data collection: sources, structures, feature types (Part 2) [C] | 2–4 | – | – | – | PRACTICE P2, Reflect 2 | – | ✅ |
| L01.3 | L1 | Exploratory Data Analysis (Part 3) [C] | 4–5 | – | P01-hist, P01-box, P01-corr | IQR = Q3−Q1 | PRACTICE P3, Reflect 3 | L01_eda_cleaning.py | ✅ |
| L01.4 | L1 | Preprocessing: missing values & inconsistent data (Part 4 steps 1–2) [C] | 5–6 | – | – | mean/median/mode imputation | lab: impute + dedup | L01_eda_cleaning.py | ✅ |
| L01.5 | L1 | Feature scaling: Min-Max, Z-score, Max-Abs, Robust (Step 3) [C] | 6–7 | – | P01-scalers | 4 scaling formulas | PRACTICE P4 A/B/C, P5, Reflect 4 | L01_scaling.py | ✅ |
| L01.6 | L1 | Categorical encoding: label, ordinal, one-hot, binary (Step 4) [C] | 7–9 | – | – | ⌈log2 N⌉ columns | worked one-hot & binary tables, PRACTICE P6, P7, Reflect 5 | L01_encoding.py | ✅ |
| L02.1 | L2 | Roadmap & parameters vs hyperparameters [C] | 1–2 | – | – | – | PRACTICE P1 | – | ✅ |
| L02.2 | L2 | Phase 5 Data splitting & leakage [C] | 2–3 | – | P02-split | 70/15/15 | PRACTICE P2, Reflect 1, Warning | L02_split_leakage.py | ✅ |
| L02.3 | L2 | Phase 6 Feature engineering & Phase 7 baseline [C] | 3–4 | – | – | interaction term | PRACTICE P3, P4 | L02_features_baseline.py | ✅ |
| L02.4 | L2 | Phase 8 Modeling loop: selection, training, MSE, GD, convergence [C] | 4–7 | – | P02-lossbowl, P02-converge | MSE | PRACTICE P5, P6 | (L05 code) | ✅ |
| L02.5 | L2 | Phase 9 Offline evaluation & business mapping [C] | 7–8 | – | – | MAE, RMSE, R² (preview) | PRACTICE P7, Reflect 2 | – | ✅ |
| L02.6 | L2 | Phases 10–11 Deployment, drift, retraining, macro loop [C] | 8–11 | – | P02-decay, P02-lifecycle | – | PRACTICE P9, P10, P11 | L02_pickle_deploy.py | ✅ |
| L03.1 | L3 | Storyline, ŷ=mx+c, infinite lines, two inputs → plane (S1–S3) [C] | 1–5 | – | P03-scatter, P03-candidates, P03-3d | ŷ=mx+c; ŷ=m1x1+m2x2+c | PRACTICE P2 | – | ✅ |
| L03.2 | L3 | Residuals and errors (S4) [C] | 5–8 | – | P03-residuals | e_i = y_i − ŷ_i | PRACTICE P3 | – | ✅ |
| L03.3 | L3 | Building the loss: signed, absolute, squared (S5) [C][CW] | 8–12 | – | P03-abs, P03-outlierfit, P03-maecurve, P03-abs-vs-sq, P03-surfaces | Σe, Σ | e | , Σe² | PRACTICE P4, P5 | L03_loss_outliers.py | ✅ |
| L03.4 | L3 | Closed-form vs iterative; error surface (S6–S7) [C] | 13–14 | – | P03-bowl | ∂E/∂m=∂E/∂c=0 | PRACTICE P6 | – | ✅ |
| L03.5 | L3 | Deriving the intercept c (S8) [C][CW] | 14–15 | D03-intercept | – | c = ȳ − m x̄ | PRACTICE P7 | – | ✅ |
| L03.6 | L3 | Deriving the slope m; final OLS model (S9–S10) [C][CW] | 16–18 | D03-slope | – | m = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)² = Cov/Var | PRACTICE P8, P9 | – | ✅ |
| L03.7 | L3 | OLS by hand; CGPA dataset; outlier impact (S11–S12) [C] | 18–20 | – | P03-fit | same | PRACTICE P10, P11, P12, Reflect 1–2, CGPA→stipend | L03_ols.py | ✅ |
| L04.1 | L4 | MLR dataset, equation, hyperplane (S1–S2) [C] | 1–2 | – | – | ŷ=β0+Σβjxj | PRACTICE P1, P2 | – | ✅ |
| L04.2 | L4 | Matrix form & design matrix (S3) [C] | 3 | – | – | ŷ = Xβ; sizes | PRACTICE P3 | L04_normal_equation.py | ✅ |
| L04.3 | L4 | Residual vector & loss eᵀe (S4–S5) [C] | 4–5 | – | – | L = eᵀe | PRACTICE P4 | – | ✅ |
| L04.4 | L4 | Expanding the loss (S6) [C] | 5–6 | D04-expand | – | L=yᵀy−2yᵀXβ+βᵀXᵀXβ | PRACTICE P5 | – | ✅ |
| L04.5 | L4 | Gradient condition & three identities (S7–S10) [C] | 6–9 | D04-identities | – | ∂c/∂β=0, ∂aᵀβ/∂β=a, ∂βᵀAβ/∂β=2Aβ | PRACTICE P6, P7 | – | ✅ |
| L04.6 | L4 | Normal equation; 8-step summary; SLR vs MLR (S11, S15) [C] | 9, 11–12 | D04-normal | – | XᵀXβ=Xᵀy; β*=(XᵀX)⁻¹Xᵀy | HOMEWORK P11 | L04_normal_equation.py | ✅ |
| L04.7 | L4 | When it fails: invertibility, multicollinearity, O(k³) (S12–S14) [C] | 10–11 | D04-cubic | – | O(k³) = k·k·2k | PRACTICE P9 | – | ✅ |
| L04.8 | L4 | Full OLS by hand (Numerical practice) [C] | 12–13 | – | – | 3×3 inverse | HOMEWORK P10, Reflect 1–2 | L04_normal_equation.py | ✅ |
| L05.1 | L5 | Why OLS is not enough (S1) [C] | 1 | – | – | O(m³) | PRACTICE P1 | – | ✅ |
| L05.2 | L5 | Gradient, update rule, simultaneous update, initialisation (S2) [C][CW] | 1–4 | – | P05-slope, P05-bowl, P05-steps, P05-lr | θnew = θold − α∇L | PRACTICE P2; whiteboard y=mx example | – | ✅ |
| L05.3 | L5 | Deriving the BGD update for MSE (S3) [C] | 5 | D05-msegrad | – | ∇L = (2/m)Xᵀ(Xθ−y) | PRACTICE P4 (gradient) | – | ✅ |
| L05.4 | L5 | Worked NST example: epoch 1 & 2, feature scaling (S4) [C] | 5–7 | – | – | same | Epoch 1 worked, PRACTICE P4 epoch 2 | L05_bgd.py | ✅ |
| L05.5 | L5 | Epochs & the training loop (S5) [C] | 7–8 | – | P05-loop | – | PRACTICE P5 | L05_bgd.py | ✅ |
| L05.6 | L5 | Learning rate, tuning, validation loss, BGD pros/cons (S6) [C] | 8–10 | – | P05-lr2, P05-valbars | L_val = (1/m_val)Σ(y−ŷ)² | Guided dry run, PRACTICE P6 | L05_lr_tuning.py, L05_lab_bgd_w.py | ✅ |
| L06.1 | L6 | Revision & BGD limitations (S1) [C] | 1–2 | – | – | J(θ)=(1/m)ΣJi | PRACTICE P1 | – | ✅ |
| L06.2 | L6 | SGD: update rule, workflow, shuffling, LR, misconceptions (S2) [C] | 2–4 | – | – | θt+1 = θt − α∇J_it(θt) | PRACTICE P2 | – | ✅ |
| L06.3 | L6 | BGD vs SGD maths & visual intuition (S3–S4) [C] | 4–5 | – | P06-paths, P06-losscurves | O(md) vs O(d) per update | Think & Discuss | – | ✅ |
| L06.4 | L6 | Dry run: one epoch of BGD and SGD (S5) [C][CW] | 5–7 | D06-samplegrad | – | ∂Ji/∂θ0 = e, ∂Ji/∂θ1 = e·x | Batch table, SGD table, PRACTICE P3 | L06_sgd_minibatch.py | ✅ |
| L06.5 | L6 | Pseudocode; SGD advantages & limitations (S6–S8) [C] | 7–8 | – | – | – | PRACTICE P4 | L06_sgd_minibatch.py, L06_lab_sgd_w.py | ✅ |
| L06.6 | L6 | Mini-batch GD: motivation, algorithm, dry runs (S9–S11) [C] | 9–10 | – | – | ⌈m/b⌉ updates/epoch | PRACTICE P5, HOMEWORK P6 | L06_sgd_minibatch.py, L06_lab_minibatch_w.py | ✅ |
| L06.7 | L6 | Comprehensive comparison (S12) [C] | 11–12 | – | P06-threepaths | – | PRACTICE P7 | – | ✅ |
| L07.1 | L7 | Training loss vs evaluation metric (S1) [C] | 1 | – | – | – | Checkpoint 1 | – | ✅ |
| L07.2 | L7 | Signed residuals; Master Test Data R (S2) [C] | 1–2 | – | – | e = y − ŷ | H1(a) | – | ✅ |
| L07.3 | L7 | MAE, MAPE, MSE, RMSE (S3) [C][CW] | 2–3 | – | – | MAE, MAPE, MSE, RMSE | PRACTICE P2, HOMEWORK H1 | L07_regression_metrics.py | ✅ |
| L07.4 | L7 | R² from the mean-only baseline (S4) [C] | 3–5 | – | P07-r2 | R² = 1 − RSS/TSS | PRACTICE P3 | L07_regression_metrics.py | ✅ |
| L07.5 | L7 | Adjusted R² (S5) [C][CW] | 5–6 | – | – | R²adj = 1−(1−R²)(n−1)/(n−p−1) | Worked comparison A vs B | L07_regression_metrics.py | ✅ |
| L07.6 | L7 | Bridge to classification; accuracy; confusion matrix (S6–S7) [C][CW] | 6–8 | – | P07-cm3, P07-cm2 | Accuracy | PRACTICE P6 | L07_classification_metrics.py | ✅ |
| L07.7 | L7 | Precision, recall, F1 (S8) + F-β, specificity [CW] | 8–10 | – | – | P, R, F1, Fβ, TNR | PRACTICE P7, P8, P9 | L07_classification_metrics.py | ✅ |
| L07.8 | L7 | Macro / weighted / micro averages; metric choice (S9–S10) [C] | 10–13 | – | – | macro, weighted, micro | PRACTICE P10, P11, Exit check | L07_classification_metrics.py | ✅ |
| L07.9 | L7 | ROC curve & AUC [R] | – | – | P07-roc | TPR, FPR, AUC | worked threshold sweep | L07_roc_auc.py | ✅ |
| L08.1 | L8 | Straight line fails; create x² (S1–S2) [C] | 1–2 | – | P08-linvscurve | ϕ(x)=(x,x²) | Example dataset table | L08_polynomial.py | ✅ |
| L08.2 | L8 | Curve becomes a plane; higher degree; overfitting (S3–S4) [C] | 2–4 | – | P08-degrees | y = Σβk x^k | PRACTICE P1 | L08_polynomial.py, L08_lab_poly_detective.py | ✅ |
| L08.3 | L8 | Assumptions overview & 1 Linearity (S5) [C] | 5–6 | – | P08-linearity, P08-resid-u | e = y − ŷ | – | – | ✅ |
| L08.4 | L8 | 2 Normality of residuals (S6) [C] | 6–7 | – | P08-hist | ε ~ N(0, σ²) | – | – | ✅ |
| L08.5 | L8 | 3 Homoscedasticity (S7) [C] | 7 | – | P08-funnel | constant Var(e) | – | – | ✅ |
| L08.6 | L8 | 4 No autocorrelation of errors (S8) [C] | 7–8 | – | P08-autocorr | – | PRACTICE P2 | – | ✅ |
| L08.7 | L8 | 5 Multicollinearity; proof XᵀX singular; 3×3 example (S9–S10) [C] | 8–13 | D08-singular | – | Xc=0 ⇒ XᵀXc=0 | PRACTICE P3, P4 | L08_multicollinearity.py | ✅ |
| L08.8 | L8 | Formal assumption tests: VIF, Durbin–Watson, Q–Q, Breusch–Pagan [R] | – | – | – | VIF = 1/(1−R²j); DW | – | L08_assumption_tests.py | ✅ |
| L09.1 | L9 | Y = f(X) + ε and white noise (S1) [C] | 1–2 | – | P09-whitenoise | E(ε)=0, Var(ε)=E(ε²) | – | – | ✅ |
| L09.2 | L9 | The estimator as a random variable (S2) [C] | 2–3 | – | P09-population | – | – | – | ✅ |
| L09.3 | L9 | God's-eye view: underfit vs overfit (S3) [C] | 3–5 | – | P09-truef, P09-case1, P09-case2 | f(x)=x² | PRACTICE P1 | L09_bias_variance_sim.py | ✅ |
| L09.4 | L9 | The bias–variance tradeoff (S4) [C] | 6 | – | P09-ucurve | – | – | – | ✅ |
| L09.5 | L9 | Bias, variance, MSE decomposition (S5–S6) [C] + full proof [R] | 6–7 | D09-decomp | P09-slopes | MSE = Bias² + Var + σ² | PRACTICE P2(a,b,e) | L09_bias_variance_sim.py | ✅ |
| L09.6 | L9 | Dartboard illustration (S7) [C] | 8 | – | P09-dartboard | – | PRACTICE P2(c,d) | – | ✅ |
| L09.7 | L9 | Real world: diagnosis from train/val, why split (S8–S10) [C] | 9–10 | – | – | – | PRACTICE P3(a,b) | – | ✅ |
| L09.8 | L9 | Cross-validation & learning curves (S11–S13) [C] + k-fold detail [R] | 10–15 | – | P09-kfold, P09-complexity, P09-learncurve | – | PRACTICE P3(c,d), P4 | L09_cv_learning_curve.py | ✅ |
| L09.9 | L9 | Hyperparameter tuning: grid search and random search with CV [R] | – | – | P09-tunecv, P09-gridrandom | fits = k × (product of list sizes) | counting fits, reading a search | L09_tuning_sklearn.py | ✅ |
| L10.1 | L10 | Why feature selection; feature types; curse of dimensionality (S1–S4) [C][CW] | 1–3 | – | P10-columns | cells = bᵖ | PRACTICE P1 | – | ✅ |
| L10.2 | L10 | Filters: duplicate removal & variance threshold (S5–S6) [C][CW] | 3–5 | – | P10-varfilter | Var = (1/n)Σ(x−x̄)²; binary q(1−q) | variance table | L10_filters.py | ✅ |
| L10.3 | L10 | Pearson correlation with target; nonlinear counterexample (S7) [C] | 5–6 | D10-rzero | P10-rscatter | r formula | y=x² r=0 worked | L10_filters.py | ✅ |
| L10.4 | L10 | Correlation among inputs; filter summary (S8) [C][CW] | 6–7 | – | P10-heatmap | – | PRACTICE P2 | L10_filters.py | ✅ |
| L10.5 | L10 | Wrapper loop & exhaustive search (S9–S10) [C] | 8–9 | – | P10-wrapperloop | 2ᵖ − 1 | – | – | ✅ |
| L10.6 | L10 | Backward elimination, forward selection, RFE (S11–S12) [C][CW] | 9–12 | – | P10-paths | p(p+1)/2 | PRACTICE P3 | L10_wrappers.py | ✅ |
| L10.7 | L10 | Filter vs wrapper; leakage; workflow (S13–S16) [C] | 13–17 | – | P10-workflow | – | PRACTICE P4 | L10_wrappers.py | ✅ |
| L11.1 | L11 | Why dimensionality reduction; selection vs extraction; what is PCA (Part I, S1) [C] | 1–3 | – | P11-pixels, P11-selvsext | – | Classroom question | – | ✅ |
| L11.2 | L11 | Notation, centering, standardization (S2.1–2.2) [C] | 3–4 | – | – | Xc = X − 1µᵀ; z=(x−µ)/s | – | L11_pca.py | ✅ |
| L11.3 | L11 | Axis-aligned vs diagonal variance; projection (S2.3–2.5) [C] | 4–5 | D11-projection | P11-axis, P11-rotate, P11-project | z = uᵀx | Student exercise proof, PRACTICE P2(a) | – | ✅ |
| L11.4 | L11 | Covariance matrix, eigenvalues, eigenvectors (S2.6, S3) [C] | 6–7 | – | P11-covsign, P11-eigen | Cov(x,y), Av=λv | Classroom question | – | ✅ |
| L11.5 | L11 | Finding the principal components; worked example (S4) [C] + Lagrange proof [R] | 7–9 | D11-eigen, D11-lagrange | – |  | S−λI | =0 | 3-house example, PRACTICE P1, P2(b) | L11_pca.py, L11_lab_pca_scratch.py | ✅ |
| L11.6 | L11 | PCA workflow; choosing k; EVR; scree (S5.1–5.2) [C] | 10–11 | – | P11-workflow, P11-scree | EVR, cumulative EVR | PRACTICE P3(a) | L11_pca.py | ✅ |
| L11.7 | L11 | When PCA fails; what it preserves; PCA vs selection (S5.3–5.5) [C] | 11–15 | – | P11-failures | – | PRACTICE P3(b), P4 | – | ✅ |
| L11.8 | L11 | PCA through the SVD (how scikit-learn computes it) [R] | – | D11-svd | P11-svd | X_c = UΣVᵀ, λ = s²/(n−1) | singular values → EVR | L11_pca_svd_scratch.py | ✅ |
| L12.1 | L12 | Overfitting, coefficient explosion, what regularization is (Part I) [C] | 1–3 | – | P12-steep, P12-modelAB | – | slope 4500 question | – | ✅ |
| L12.2 | L12 | Ridge in 2D: loss, closed-form slope, bias–variance mechanism (Part II) [C] | 3–5 | D12-ridge2d | P12-lambdafits | m_ridge = Sxy/(Sxx+λ) | regimes table | L12_ridge_lasso.py | ✅ |
| L12.3 | L12 | Multiple Ridge normal equation (N-dim) [C] + derivation [R] | 6, 9 | D12-ridgeN | – | β=(XᵀX+λI)⁻¹Xᵀy | PRACTICE P1(b) | L12_ridge_lasso.py | ✅ |
| L12.4 | L12 | Six Ridge properties (4.1–4.6) [C] | 6–10 | – | P12-path, P12-ucurve, P12-shift, P12-circle | – | PRACTICE P1(a), P1-B | – | ✅ |
| L12.5 | L12 | Lasso: L1 penalty, sparsity, when to use (Part III) [C] | 10–12 | – | – | λΣ | wj |  | analogy | L12_ridge_lasso.py | ✅ |
| L12.6 | L12 | Diamond vs circle; why Lasso gives exact zeros (proof) [C] | 12–15 | D12-lasso | P12-diamond | m=(N−λ)/D vs N/(D+λ) | PRACTICE P2 | L12_ridge_lasso.py | ✅ |
| L12.7 | L12 | Comparison, CV for λ, standardization, intercept, traps (Part IV) [C] | 16–22 | – | P12-cv, P12-scale | – | CV table, PRACTICE P3, P4 | L12_cv_lambda.py | ✅ |
| L12.8 | L12 | Elastic Net: L1 + L2 penalties [R] | – | – | P12-enball, P12-encoef | λ₁‖w‖₁ + λ₂‖w‖₂² | penalty by hand, correlated-features experiment | L12_elastic_net_sklearn.py | ✅ |
| L13.1 | L13 | Order matters; IID vs time series; no K-fold (Part I) [C] + TimeSeriesSplit [R] | 1–2 | – | P13-crossvsts | – | Classroom question | L13_time_series.py | ✅ |
| L13.2 | L13 | Components: trend, seasonality, noise [C] | 2–5 | – | P13-decomp | – | PRACTICE P1 | L13_time_series.py | ✅ |
| L13.3 | L13 | Stationarity (Part II) [C] | 6–7 | – | P13-stationary | constant µ, σ², autocov | PRACTICE P2(a) | – | ✅ |
| L13.4 | L13 | Lags and differencing [C] | 7–11 | – | P13-diff | ΔYt = Yt − Yt−1 | Stock table, PRACTICE P2(b,c,d) | L13_time_series.py | ✅ |
| L13.5 | L13 | Auto Regression AR(p) (Part III) [C] | 11–12 | – | – | yt = c + Σφi yt−i + εt | AR(2) example; p=365 question | L13_time_series.py | ✅ |
| L13.6 | L13 | ACF and PACF [C] | 12–16 | D13-acf | P13-acf, P13-pacf | ρk formula | PRACTICE P3 | L13_time_series.py | ✅ |
| L13.7 | L13 | Random shocks & MA(q); AR vs MA (Part IV) [C] | 16–22 | – | P13-shocks | yt = c + εt + Σθi εt−i | PRACTICE P4 | – | ✅ |
| L13.8 | L13 | ARMA/ARIMA notation, ADF test, seasonal differencing, ACF/PACF identification table [R] | – | – | – | ARIMA(p,d,q) | – | L13_arima_adf.py | ✅ |
| L14.1 | L14 | Probability vs likelihood (S1–S2) [C] | 1–3 | – | P14-lik7, P14-lik6 | C(10,7)p⁷(1−p)³ | likelihood table | L14_mle_bce.py | ✅ |
| L14.2 | L14 | Maximum likelihood estimation (S3) [C] + Bernoulli MLE proof [R] | 3 | D14-bernoulli-mle | – | θ̂ = argmax L(θ;D); p̂=k/n | PRACTICE P1 | L14_mle_bce.py | ✅ |
| L14.3 | L14 | Why accuracy is not enough; linear score; boundary (S4–S5) [C] | 3–4 | – | P14-twolines | z = β0+β1x1+β2x2 | z=2.4 example | – | ✅ |
| L14.4 | L14 | Step function vs sigmoid; class probability (S6–S8) [C] | 5–7 | – | P14-step, P14-sigmoid, P14-contours | σ(z)=1/(1+e^−z) | sigmoid table, PRACTICE P2 | L14_mle_bce.py | ✅ |
| L14.5 | L14 | Bernoulli likelihood for a dataset (S9–S12) [C] | 8–9 | D14-bernoulli | – | p̂^y(1−p̂)^(1−y); L(β)=Π | Model A vs B table | L14_mle_bce.py | ✅ |
| L14.6 | L14 | Log-likelihood → Binary cross-entropy; BCE behaviour (S13–S15) [C] | 10–11 | D14-bce | P14-bce | BCE | PRACTICE P3 | L14_mle_bce.py | ✅ |
| L14.7 | L14 | Training implications, misconceptions, the story (S16–S18) [C] | 12–15 | – | P14-story | J = BCE + λR | PRACTICE P4 | – | ✅ |
| L15.1 | L15 | Dependency chain; ∂L/∂p̂ (S1–S3) [C] | 1–2 | D15-dLdp | P15-chain | ∂L/∂p̂=(p̂−y)/[p̂(1−p̂)] | – | – | ✅ |
| L15.2 | L15 | Sigmoid derivative; chain rule collapses to (p̂−y)x (S4–S5) [C] | 2–3 | D15-sigmoid, D15-grad | – | σ' = σ(1−σ); ∂L/∂βj=(p̂−y)xj | PRACTICE P1 | – | ✅ |
| L15.3 | L15 | Batch GD for logistic regression; one numerical update (S6–S7) [C] | 3–5 | – | – | ∇J = Xᵀ(p̂−y)/n | Worked update, PRACTICE P2 | L15_logistic_gd.py | ✅ |
| L15.4 | L15 | Multiclass; One-vs-Rest construction & prediction (S8–S10) [C] | 5–7 | – | P15-3class, P15-ovr | K(d+1) params | PRACTICE P3 | L15_multiclass.py | ✅ |
| L15.5 | L15 | Softmax (S11–S12) [C] | 8 | D15-shift | P15-softmax | p̂k = e^zk/Σe^zj | logits (2,1,0) table | L15_multiclass.py | ✅ |
| L15.6 | L15 | Multiclass cross-entropy (S13), gradient [R], OvR vs Softmax (S14) [C] | 9 | D15-ce, D15-cegrad | – | L = −Σ yk log p̂k | (0.665,0.245,0.090) example | L15_multiclass.py | ✅ |
| L15.7 | L15 | Assumptions, odds & log-odds, polynomial boundaries, regularization (S15–S17) [C] | 10–13 | D15-logodds | P15-odds, P15-polyboundary | odds = p/(1−p); logit | PRACTICE P5 | L15_logistic_gd.py | ✅ |

**Totals:** 116 teaching units · 29 derivation blocks · 125 plots/diagrams · 691 lecture practice questions + 196 in drills, mocks and the patterns page · 59 practice programs.

## Researched extras (exam-relevant, not in the worksheets)

Taught as clearly separated "⚠ Not covered in class – researched" blocks. Lower priority: study them only after the class material.

- **L0:** Self-supervised learning (you named it in the brief; the worksheet only has four paradigms).
- **L7:** ROC curve, AUC, threshold choice (worksheet mentions AUC-ROC only in L1 Reflect 3).
- **L8:** VIF, Durbin–Watson, Q–Q plot, Breusch–Pagan as formal tests for the five assumptions.
- **L9:** Full algebraic proof of MSE = Bias² + Variance + σ² (the worksheet says the proof is out of scope); k-fold CV mechanics; hyperparameter tuning with grid search and random search (unit L09.9, added after checking the mid-semester syllabus).
- **L11:** Why PCs are eigenvectors (Lagrange-multiplier proof); PCA via SVD as used by scikit-learn (unit L11.8).
- **L12:** Derivation of the Ridge normal equation; Lasso soft-thresholding/coordinate descent; Elastic Net (marked out of scope in L12, but asked in the course quiz; unit L12.8).
- **L13:** ARMA/ARIMA(p,d,q) notation, ADF stationarity test, seasonal differencing, "ACF cuts off for MA(q)" identification table, TimeSeriesSplit.
- **L14:** MLE for Bernoulli/binomial p̂ = k/n by calculus.
- **L15:** Softmax cross-entropy gradient ∂L/∂z_k = p̂_k − y_k; scikit-learn's handling of multiclass (OvR vs multinomial).

## Build status (resume from here)

- DONE: Phase 0 (map, this file, UNCLEAR.md). Site engine: `aml-exam-prep/index.html`, `css/style.css`, `js/core.js`, `js/plots.js`, `js/app.js` (quiz engine, mocks, drills, progress, Pyodide). KaTeX and marked bundled in `vendor/`.
- DONE: 56 practice programs in `aml-practice/` (L0–L15, both from-scratch and library versions, plus course-lab replicas with tests). All run; `tools/build_code.py` bundles them into `data/code_bundle.js`.
- DONE: `data/lec00.js` (Lecture 0, 5 units, 27 questions), checked in the browser.
- DONE: `data/lec01.js` … `lec15.js`: all teaching units L01.1–L15.7. Totals for L0–L15: 113 units, 672 questions, 117 plots (plus 3 researched units added after the syllabus check: L09.9, L11.8, L12.8). Every unit has a concept, formulas, plots, examples, code links, traps, ≥ 5 questions and a source. Derivations are included where the worksheet derives something.
- DONE: `patterns.js` (analysis of the 134 course-quiz questions and 24 labs + 13 pattern-practice questions), `drills.js` (65 integer + 48 code questions), `mock1.js` and `mock2.js` (35 questions, 61 marks, 90 minutes each; every lecture covered), `plan.js` (7-day plan + last-night revision sheet), `tools/verify.py` (ticks the Done column), `tools/site_test.js` (full Playwright pass), `REPORT.md` (final report).
- Tools: `node tools/dump_data.js out.json` loads all data headlessly and renders every plot.
- Tools: `python3 tools/check_questions.py [lec nums]` checks answer indices and options. It runs every `out` snippet, `int` verify expression and `write` ref+tests, scans for LaTeX whose escapes were eaten, and requires ≥ 5 questions per unit. Current result: 868 questions (lectures, drills, mocks, patterns page), 0 problems.
- Tools: `python3 tools/lint_sources.py` flags single-quoted strings with backslash-letter sequences (use R`` for LaTeX).
- Tools: `python3 tools/verify.py` re-ticks the Done column and rewrites the Totals line. `NODE_PATH=$(npm root -g) node tools/site_test.js` renders all 25 pages at desktop and phone width and drives the quiz, mock and progress flows.
- Tools: `NODE_PATH=$(npm root -g) node tools/browser_check.js [lec nums]` renders each lecture in Chromium and counts KaTeX errors, plot/code errors and unrendered `$…$`. Current result: 0 for all of L0–L15.
