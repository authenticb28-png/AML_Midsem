# AML Exam Prep — final report

## What is built

Open `aml-exam-prep/index.html` in a browser. It works offline from `file://`. Progress is saved in that browser's localStorage.

| Part | Contents |
|---|---|
| Lectures L0–L15 | 116 teaching units. Each unit has a concept explanation, formula sheet, plots/diagrams, worked examples, code links, exam traps, ≥ 5 practice questions and a source. Derivations are included wherever the worksheet derives something (29 blocks). |
| Practice questions | 691 in the lecture units, plus 196 more on the pages below. |
| Plots | 125, drawn from real numbers by `js/plots.js`. |
| Course quiz patterns | Analysis of all 134 course-quiz questions and 24 labs: lectures, question styles, recurring traps, lab coding conventions, your scores and weak spots. Ends with a 13-question practice set covering each style. |
| Integer drill | 65 numerical questions covering every formula in L1–L15. |
| Code drill | 48 questions: 27 predict-the-output, 10 find-the-bug, 5 fill-the-line, 6 write-the-function in the course-lab style. |
| Mock papers 1 and 2 | 35 questions, 61 marks and 90 minutes each, with a timer. Sections: MCQ, MSQ, numerical, code reading and code writing. After submitting you get a per-lecture score table with links to weak topics. Each paper covers all 16 lectures. |
| 7-day plan | 1.5–2 h a day, prioritised by the quiz analysis. Also includes a 3-day fallback plan and a weekly checklist. |
| Last-night revision | One-page formula, fact and trap sheet per lecture block, plus numbers worth remembering. |
| Practice programs | 59 runnable Python files in `aml-practice/` (from scratch and with libraries, plus replicas of the course labs). |

## Mid-semester syllabus check

| # | Syllabus topic | Site lecture | Units |
|---|---|---|---|
| 1 | ML Project Lifecycle (Part 1) | L1 | 6 |
| 2 | ML Project Lifecycle (Part 2) | L2 | 6 |
| 3 | Simple Linear Regression (OLS) | L3 | 7 |
| 4 | Multiple Linear Regression (OLS) | L4 | 8 |
| 5 | Batch Gradient Descent | L5 | 6 |
| 6 | SGD and Mini-Batch GD | L6 | 7 |
| 7 | Evaluation Metrics | L7 | 9 |
| 8 | Polynomial Regression and Assumptions | L8 | 8 |
| 9 | Bias, Variance and Tradeoff | L9 | 9 (+ L09.9 tuning, researched) |
| 10 | Feature Selection | L10 | 7 |
| 11 | PCA | L11 | 8 (+ L11.8 PCA via SVD, researched) |
| 12 | Regularization | L12 | 8 (+ L12.8 Elastic Net, researched) |
| 13 | Time Series Analysis | L13 | 8 |
| 14 | MLE and Logistic Regression | L14 | 7 |
| 15 | GD on Logistic Regression and Multiclass | L15 | 7 |

All 156 topic tags in `Study Pack/1 - Syllabus.md` are taught. Three topics were missing or only mentioned, so they were researched from published sources and added as units in the same format: grid and random search (scikit-learn User Guide; Bergstra & Bengio 2012), PCA via SVD (Jolliffe & Cadima 2016; scikit-learn docs), and Elastic Net (Zou & Hastie 2005; ESL §3.4). Lecture 0 is extra foundations material that is not on the mid-semester syllabus.

## How it was verified

| Check | Command | Result |
|---|---|---|
| Coverage | `python3 tools/verify.py` | 116/116 units ticked ✅ in COVERAGE.md, 0 problems |
| Answers | `python3 tools/check_questions.py` | 887 questions checked, 0 problems |
| Source lint | `python3 tools/lint_sources.py` | 0 problems |
| Browser | `NODE_PATH=$(npm root -g) node tools/site_test.js` | all checks passed |

What `check_questions.py` verifies:
- Every predict-the-output answer is the real stdout of running the code.
- Every numerical answer matches a Python `verify` expression within its tolerance.
- Every write-the-function reference passes its tests.
- Every bug and fill-the-line question has corrected code that runs, including its asserts.

What `site_test.js` does:
- Renders all 25 pages at 1280 px and 390 px (phone) width. It checks for maths errors, plot or code errors, broken tables, unrendered `$…$` and horizontal scrolling.
- Answers questions through the real UI and grades them.
- Marks units done and opens the progress page.
- Sits both mocks with every answer correct. Each auto-marks 51/61, and the last 10 marks are the self-marked write-the-function questions. It also submits a blank paper (0/61, weak topics listed).
- Reloads the page to confirm progress and scores were saved, and toggles the dark theme.

## Fixes made during the final pass
- On phones, four lecture pages scrolled sideways. The causes were KaTeX's hidden MathML inside scrolling tables and long inline code. Both are fixed in `css/style.css`.
- COVERAGE.md listed plot P05-lr under L05.6; the plot built for that unit is P05-lr2. The table now says P05-lr2.

## Known limits
- **In-browser Python** (Pyodide) downloads about 10 MB the first time. It could not be tested here because this environment has no network. Offline, the site shows a message and the reference solution; every coding question also exists as a runnable file.
- **Course quizzes:** the Lecture 14 quiz was never opened, so it is missing from the pattern analysis. 90 of the 134 course questions had no visible answer key; they were solved independently.
- **UNCLEAR.md** lists 24 places where the source material is ambiguous or inconsistent, and what the site does about each one.
- **Exam format:** the mock format (90 minutes, 61 marks, no negative marking) is an assumption. Adjust it in your head if your exam differs.
