/* Lecture 13 — Time series analysis: stationarity, differencing, AR, ACF/PACF, MA */
(function () {
const rnd = NUM.rng(13), G = () => NUM.gauss(rnd);
const T = 72, trend = [], seas = [], noise = [], obs = [];
for (let t = 0; t < T; t++) { trend.push(20 + 0.6 * t); seas.push(15 * Math.sin(2 * Math.PI * t / 12)); noise.push(G() * 4); obs.push(trend[t] + seas[t] + noise[t]); }
const P = a => a.map((v, i) => [i, v]);
const stat = [], drift = [], fan = []; for (let t = 0; t < 120; t++) { stat.push([t, G()]); drift.push([t, 0.06 * t + G() * 0.8]); fan.push([t, G() * (0.5 + 0.06 * t)]); }
const walk = [100]; for (let t = 1; t < 60; t++) walk.push(walk[t - 1] + 5.5 + G() * 3);
// simulated AR(2) for ACF/PACF
const ar = [0, 0]; for (let t = 2; t < 300; t++) ar.push(0.6 * ar[t - 1] + 0.3 * ar[t - 2] + G());
function acf(x, K) { const n = x.length, m = NUM.mean(x), d = x.map(v => v - m), den = d.reduce((s, v) => s + v * v, 0), out = []; for (let k = 1; k <= K; k++) { let s = 0; for (let t = k; t < n; t++) s += d[t] * d[t - k]; out.push(s / den); } return out; }
function pacf(r) { // Durbin–Levinson from autocorrelations r[0]=rho1..
  const K = r.length, phi = [], out = []; let prev = [];
  for (let k = 1; k <= K; k++) { let num = r[k - 1], den = 1; for (let j = 1; j < k; j++) { num -= prev[j - 1] * r[k - j - 1]; den -= prev[j - 1] * r[j - 1]; } const pkk = num / den, cur = []; for (let j = 1; j < k; j++) cur.push(prev[j - 1] - pkk * prev[k - j - 1]); cur.push(pkk); prev = cur; out.push(pkk); }
  void phi; return out;
}
const A15 = acf(ar, 15), P15 = pacf(A15), band = 1.96 / Math.sqrt(ar.length); // approximate 95% band
const bars = (vals, c) => ({ t: 'stem', pts: vals.map((v, i) => [i + 1, v]), c });
const shockPath = [], pred = []; let e1 = 0; for (let t = 0; t < 40; t++) { const e = (t === 8 ? 9 : t === 22 ? -8 : t === 30 ? 7 : G() * 0.8); shockPath.push([t, 12 + e + 0.6 * e1]); pred.push([t, 12]); e1 = e; }
LECTURES.push({
  num: 13, short: 'Time Series', title: 'Time Series Analysis — components, stationarity, lags & differencing, AR, ACF/PACF, MA',
  file: 'Lecture13_Worksheet_Teacher.pdf', pages: 22,
  intro: R`**Exam weight: high (the course quiz on this lecture was all MCQs).** Know why time series break the **I.I.D.** assumption (no shuffling, no plain K-fold), **trend / seasonality / noise**, **stationarity** (constant mean, variance, autocovariance), **lags**, **differencing** $\Delta Y_t = Y_t - Y_{t-1}$, **AR(p)**, **ACF vs PACF** (**PACF → p for AR; ACF → q for MA**), **random shocks** and **MA(q)** (past errors, not a rolling mean). ARIMA/ADF/seasonal differencing are researched extras. About 90 minutes.`,
  units: [
  /* ---------------------------------------------------------------- L13.1 */
  {
    id: 'L13.1', title: 'Order matters: I.I.D. vs time series; no plain K-fold', badge: ['class', 'res'], pages: '1–2', ws: 'Part I + researched TimeSeriesSplit',
    concept: R`
:::hook Hook
Shuffle 500 house listings before fitting linear regression: predictions are identical. Shuffle a year of **hourly server traffic**: what happens?
:::

Classical ML assumes observations are **I.I.D.** (independent and identically distributed): row order does not matter; a house in Delhi is independent of one in Mumbai.

*Classroom question:* shuffle daily stock prices → the data become **meaningless noise**; the trend and the dependency between consecutive days are destroyed. Today's price depends heavily on yesterday's. For temporal data **the order of rows is information**: "row 5 happened right after row 4" is the most important feature.

:::key Key insight
**Time series analysis**: time is the primary dimension and the **past directly influences the future**. Shuffling destroys the meaning.
:::

A **time series** is a sequence of data points recorded at **successive, equally spaced** time intervals.

| Aspect | Cross-sectional | Time series |
|---|---|---|
| row index | arbitrary ID | timestamp |
| independence | independent (I.I.D.) | dependent on previous rows |
| standard K-fold CV | valid | **invalid** (leakage) |

**Why not K-fold?** Random folds can put 2026 data in training to predict 2024: it violates the **arrow of time** and leaks the future. Training data must come **before** test data.

**Researched: TimeSeriesSplit** (scikit-learn) — expanding-window CV: fold 1 trains on rows 0–2 and tests on 3–5, fold 2 trains on 0–5 and tests on 6–8, … — training always precedes testing.`,
    formulas: [{ name: 'Forward-chaining split', tex: R`\text{train} = \{1..t\},\ \text{test} = \{t+1..t+h\}`, sym: 'Always past → future.', when: 'Validating forecasters.' }],
    plots: [{ id: 'P13-crossvsts', title: 'Cross-sectional: order irrelevant. Time series: order carries the signal', notice: 'Shuffling the left plot changes nothing; shuffling the right destroys the trend the model needs.',
      spec: (function () { const h = []; for (let i = 0; i < 40; i++) { const x = 1000 + 4000 * rnd(); h.push([x, 0.25 * x + G() * 120]); } const s = walk.slice(0, 50).map((v, i) => [i, v]); return { type: 'multi', panels: [{ type: 'xy', w: 300, h: 230, title: 'Cross-sectional (houses)', xlim: [800, 5200], ylim: [0, 1600], xlabel: 'square footage', ylabel: 'price', series: [{ t: 'scatter', pts: h, c: 's1', r: 3 }] }, { type: 'xy', w: 300, h: 230, title: 'Time series', xlim: [0, 50], ylim: [80, 400], xlabel: 'time step t', ylabel: 'value', series: [{ t: 'line', pts: s, c: 's4', markers: true, mr: 2 }] }] }; })() }],
    examples: [{ title: 'TimeSeriesSplit on 12 rows (worked, from the code)', body: R`n_splits = 3: fold 1 train 0–2, test 3–5; fold 2 train 0–5, test 6–8; fold 3 train 0–8, test 9–11. The training window grows; no fold ever trains on the future.` }],
    code: [{ title: 'Time-series toolkit (TimeSeriesSplit at the end)', lib: 'L13_time_series_statsmodels.py', libLabel: 'statsmodels / sklearn' }],
    traps: ['Shuffling a time series is never harmless.', 'Standard K-fold on time series = leakage.', 'Classical models assume **equally spaced** intervals (P1(b) True).'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'You randomly shuffle a daily stock-price series. The result:', options: ['no change', 'the trend and temporal dependencies are destroyed', 'better accuracy', 'stationarity'], answer: 1, sol: 'Classroom question Part I.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Why is standard K-fold CV invalid for time series?', options: ['It is too slow', 'Random folds can train on the future to predict the past (leakage)', 'It requires labels', 'It needs stationarity'], answer: 1, sol: 'Arrow of time.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'A house-price dataset is cross-sectional and a stock-price dataset a time series because:', options: ['houses are bigger', 'house rows satisfy I.I.D.; stock rows depend on previous days', 'stocks have more rows', 'prices are numbers'], answer: 1, sol: 'P1(c).', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'msq', diff: 'M', q: 'P1(b): select all **true** statements.', options: ['Shuffling rows of a time series does not affect predictions', 'Classical time-series models generally assume equally spaced intervals', 'Standard K-fold can be used without modification', 'Patterned residuals mean the model captured all seasonality'], answer: [1], sol: 'Only the second is true.', why: ['False.', 'True.', 'False.', 'False — the opposite.'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import numpy as np
from sklearn.model_selection import TimeSeriesSplit
for tr, te in TimeSeriesSplit(n_splits=3).split(np.arange(8)):
    print(tr.max(), te.tolist())`, answer: '1 [2, 3]\n3 [4, 5]\n5 [6, 7]', sol: 'Test size = 8 // (3 + 1) = 2. Folds: train 0–1 → test 2–3; train 0–3 → 4–5; train 0–5 → 6–7.' }
    ],
    researched: R`TimeSeriesSplit is not in the worksheet. Source: scikit-learn \`TimeSeriesSplit\` docs; Hyndman & Athanasopoulos, *Forecasting: Principles and Practice* §5.10 (time-series cross-validation).`,
    source: 'Worksheet L13 pp.1–2.'
  },
  /* ---------------------------------------------------------------- L13.2 */
  {
    id: 'L13.2', title: 'Components: trend, seasonality, noise', badge: 'class', pages: '2–5', ws: 'Components, P1',
    concept: R`
:::hook Hook
Campus electricity over five years: dips at weekends and summer holidays, peaks in exam weeks, and an overall upward drift as servers are added. One line, several patterns stacked.
:::

An observed series decomposes into:
1. **Trend** — the long-term direction (ignoring day-to-day bumps).
2. **Seasonality** — short-term **repeating cycles at known, fixed frequencies**.
3. **Noise** (residual / random shocks) — random, unpredictable variation not explained by trend or seasonality.

(Additive view: $y_t = T_t + S_t + R_t$.)

*Classroom question:* a model's residuals look like pure random noise — no trend, no repeating pattern. Meaning? The model has captured **everything learnable** (all trend and seasonality); only unpredictable noise remains — the best possible outcome.

:::key Key insight
A forecaster tries to extract the rules of the trend and the cycles of the seasonality. **If its residuals are pure noise, it captured all systematic information.** A pattern left in the residuals = something the model missed.
:::

**PRACTICE P1(a).** Umbrella sales spike every monsoon → **seasonality**. GDP grew steadily for 30 years → **trend**. A factory fire disrupts production for one week → **noise** (unpredictable, non-repeating — duration does not matter). Electricity peaks every afternoon, dips at night → **seasonality**. Global temperature rising over a century → **trend**. A viral post causes a one-day spike → **noise**.`,
    formulas: [{ name: 'Additive decomposition', tex: R`y_t = T_t + S_t + R_t`, sym: 'trend + seasonal + residual.', when: 'Component questions.' }],
    plots: [{ id: 'P13-decomp', title: 'Observed series = trend + seasonality + noise', notice: 'The top panel is the sum of the three below: an upward trend, a 12-step seasonal cycle and random noise.',
      spec: { type: 'multi', panels: [
        { type: 'xy', w: 560, h: 180, ny: 3, title: 'Observed', xlim: [0, 71], ylim: [0, 90], xlabel: '', ylabel: 'y', series: [{ t: 'line', pts: P(obs), c: 'fg' }] },
        { type: 'xy', w: 560, h: 160, ny: 3, title: 'Trend', xlim: [0, 71], ylim: [0, 70], xlabel: '', ylabel: '', series: [{ t: 'line', pts: P(trend), c: 's1', w: 2.5 }] },
        { type: 'xy', w: 560, h: 160, ny: 3, title: 'Seasonal (period 12)', xlim: [0, 71], ylim: [-20, 20], xlabel: '', ylabel: '', series: [{ t: 'line', pts: P(seas), c: 's3' }] },
        { type: 'xy', w: 560, h: 170, ny: 3, title: 'Noise / residual', xlim: [0, 71], ylim: [-12, 12], xlabel: 'time t', ylabel: '', series: [{ t: 'line', pts: P(noise), c: 's7' }] }] } }],
    examples: [{ title: 'Read the residuals (worked)', body: R`After fitting, residuals spike every December. → The model did **not** capture the yearly seasonality (add a seasonal lag, seasonal differencing or month features). Residuals with no visible pattern → done.` }],
    code: [{ title: 'Series manipulation from scratch', scratch: 'L13_time_series_scratch.py' }],
    traps: ['Noise is defined by **unpredictability / non-repetition**, not by duration (a week-long fire is still noise).', 'Repeating residual patterns mean the model **failed** to capture seasonality.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Umbrella sales spike every monsoon season. Component?', options: ['Trend', 'Seasonality', 'Noise', 'Stationarity'], answer: 1, sol: 'P1(a).', why: ['No.', 'Correct.', 'It repeats.', 'Not a component.'] },
      { type: 'mcq', diff: 'E', q: 'An unexpected factory fire disrupts production for one week. Component?', options: ['Trend', 'Seasonality', 'Noise', 'Lag'], answer: 2, sol: 'Unpredictable, non-repeating.', why: ['No.', 'Not periodic.', 'Correct.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'GDP has grown steadily for 30 years. Component?', options: ['Trend', 'Seasonality', 'Noise', 'Shock'], answer: 0, sol: 'Long-term direction.', why: ['Correct.', 'No.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'A model\'s residuals show a repeating weekly pattern. Conclusion?', options: ['The model captured all seasonality', 'The model failed to capture some seasonality', 'The data are stationary', 'Nothing'], answer: 1, sol: 'P1(b) last row; P4(c)(iv).', why: ['Opposite.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'If residuals are pure random noise, the model:', options: ['underfits', 'has captured all learnable trend and seasonality', 'overfits', 'is non-stationary'], answer: 1, sol: 'Classroom question.', why: ['No.', 'Correct.', 'Not implied.', 'No.'] }
    ],
    source: 'Worksheet L13 pp.2–5; Hyndman & Athanasopoulos ch.3.'
  },
  /* ---------------------------------------------------------------- L13.3 */
  {
    id: 'L13.3', title: 'Stationarity', badge: 'class', pages: '6–7', ws: 'Part II, P2(a)',
    concept: R`
:::hook Hook
A startup's revenue grows 20% every year. Predict next year by averaging the last ten? The average is far below today's level — the baseline keeps moving. Forecasting needs **stable statistical properties**.
:::

A **stationary** series has statistical properties that **do not change over time**:

| Property | Requirement | Plain language |
|---|---|---|
| mean | constant | fluctuates around a flat horizontal line |
| variance | constant | spread of fluctuations stays the same |
| autocovariance | constant | relationship between observations depends on the **lag**, not on the point in time |

A **non-stationary** series has changing rules: a **drifting mean** (trend) or **expanding variance** (megaphone shape).

*Classroom question:* why do ML algorithms struggle with non-stationary data? They are **pattern-matching engines**; if the rules keep changing, patterns learned from the past do not apply to the future — like learning chess while someone keeps changing how the pieces move.

**PRACTICE P2(a).** Random around a constant 50 with similar spread → **stationary**. Steady upward climb over five years → **non-stationary (mean)**. Returns around zero but swings widen each year → **non-stationary (variance)**. Hourly temperature with no trend and similar variation all year → **stationary** (a consistent daily pattern with stable mean/variance is fine).`,
    formulas: [{ name: 'Weak stationarity', tex: R`E[y_t] = \mu,\quad \operatorname{Var}(y_t) = \sigma^2,\quad \operatorname{Cov}(y_t, y_{t-k}) = \gamma_k\ \ \forall t`, sym: 'γ depends only on the lag k.', when: 'Stationarity questions.' }],
    plots: [{ id: 'P13-stationary', title: 'Stationary vs two kinds of non-stationary', notice: 'Top: constant mean and variance. Middle: mean drifts upward (trend). Bottom: variance expands (megaphone).',
      spec: { type: 'multi', panels: [
        { type: 'xy', w: 560, h: 140, title: 'Stationary', xlim: [0, 120], ylim: [-4, 4], xlabel: '', ylabel: '', series: [{ t: 'line', pts: stat, c: 's3' }, { t: 'hline', y: 0, c: 'fg', dash: true }] },
        { type: 'xy', w: 560, h: 140, title: 'Non-stationary: mean drifts', xlim: [0, 120], ylim: [-3, 10], xlabel: '', ylabel: '', series: [{ t: 'line', pts: drift, c: 's4' }] },
        { type: 'xy', w: 560, h: 140, title: 'Non-stationary: variance expands', xlim: [0, 120], ylim: [-20, 20], xlabel: 'time t', ylabel: '', series: [{ t: 'line', pts: fan, c: 's5' }] }] } }],
    examples: [{ title: 'Moving baseline (worked)', body: R`Revenue 100 growing 20%/year for 10 years: 100, 120, 144, …, 516 (year 10). The 10-year mean ≈ 259.6, about half of the current 516 — a mean-based forecast is useless because the mean is not constant.` }],
    traps: ['Stationarity is about **statistical properties**, not about the values being constant.', 'A regular daily cycle with stable mean/variance can still be treated as stationary in the worksheet sense.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Which is **not** required for stationarity?', options: ['constant mean', 'constant variance', 'autocovariance depending only on the lag', 'all values equal'], answer: 3, sol: 'Values fluctuate; their properties are stable.', why: ['Required.', 'Required.', 'Required.', 'Correct — not required.'] },
      { type: 'mcq', diff: 'E', q: 'Stock returns oscillate around zero but the swings get wider each year. Which property is violated?', options: ['mean', 'variance', 'none', 'equal spacing'], answer: 1, sol: 'P2(a) row 3.', why: ['Mean ≈ 0.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'E', q: 'Sales show a steady upward climb over five years. The series is:', options: ['stationary', 'non-stationary (changing mean)', 'non-stationary (changing variance only)', 'white noise'], answer: 1, sol: 'P2(a) row 2.', why: ['No.', 'Correct.', 'The mean drifts.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Why do ML forecasters struggle with non-stationary data?', options: ['They need more features', 'The rules change, so past patterns do not transfer to the future', 'They cannot read timestamps', 'Variance is always zero'], answer: 1, sol: 'Key insight Part II.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'M', q: 'Revenue starts at 100 and grows 20% per year. Revenue in year 10 (start = year 1), to the nearest integer?', answer: 516, tol: 0.5, round: 'Nearest integer', verify: '100*1.2**9', sol: '100 × 1.2⁹ ≈ **516**.' }
    ],
    source: 'Worksheet L13 pp.6–7.'
  },
  /* ---------------------------------------------------------------- L13.4 */
  {
    id: 'L13.4', title: 'Lags and differencing', badge: 'class', pages: '7–11', ws: 'Lags, differencing, P2(b,c,d)',
    concept: R`
**Lags are the features of time series.** In time series we usually have only one column — the target's own past.

| Notation | Name | Meaning |
|---|---|---|
| $y_t$ | current | today |
| $y_{t-1}$ | lag 1 | yesterday |
| $y_{t-2}$ | lag 2 | day before yesterday |
| $y_{t-7}$ | lag 7 | same day last week (weekly seasonality, daily data) |
| $y_{t-k}$ | lag k | k steps ago |

Lags turn temporal structure into regression features.

**Differencing.** Models need stationary data but real data trend. Instead of the absolute value, model the **change**:
$$\Delta Y_t = Y_t - Y_{t-1}$$

| Day | Price $y_t$ | $\Delta Y_t$ |
|---|---|---|
| 1 | 100 | — |
| 2 | 105 | 5 |
| 3 | 110 | 5 |
| 4 | 115 | 5 |
| 5 | 122 | 7 |

The raw series trends upward; the differences (5, 5, 5, 7) fluctuate around ≈ 5.5 — roughly stationary. One observation is lost (no prior day).

:::key Key insight
Differencing removes the **trend** by converting absolute values into period-to-period changes. **First-order** differencing removes trend; **seasonal** differencing (subtract the same season last year, $y_t - y_{t-s}$) is a separate step for seasonality.
:::

**PRACTICE P2(b).** Sales 200, 220, 250, 245, 270, 300 → differences **20, 30, −5, 25, 30** (mean 20). Original: **not** stationary (rises 200 → 300). Differenced: **more** stationary (around ≈ 20, no clear trend) — a formal test (ADF) would confirm.
**P2(c).** "Temperature two days ago" → $y_{t-2}$; "last week's sales (weekly data)" → $y_{t-1}$ (or $y_{t-7}$ for daily data); "three steps ago" → $y_{t-3}$.
**P2(d).** A: differencing makes a non-stationary series stationary — **T**; R: it removes the trend by converting values to changes — **T**; R explains A — **T**.`,
    formulas: [{ name: 'First difference', tex: R`\Delta Y_t = Y_t - Y_{t-1}`, sym: 'Removes a linear trend.', when: 'Differencing tables.' }, { name: 'Seasonal difference (period s)', tex: R`\Delta_s Y_t = Y_t - Y_{t-s}`, sym: 's = 12 monthly, 7 daily-weekly.', when: 'Removing seasonality.' }, { name: 'Undoing a difference (forecast)', tex: R`\hat Y_{t+1} = Y_t + \widehat{\Delta Y}_{t+1}`, sym: '', when: 'Converting back to levels.' }],
    plots: [{ id: 'P13-diff', title: 'Original trending series vs its first difference', notice: 'Top: clear upward trend (non-stationary). Bottom: differences scatter around a constant mean ≈ 5.5.',
      spec: { type: 'multi', panels: [
        { type: 'xy', w: 560, h: 170, title: 'Original yₜ', xlim: [0, 59], ylim: [80, 450], xlabel: '', ylabel: 'y', series: [{ t: 'line', pts: P(walk), c: 's4' }] },
        { type: 'xy', w: 560, h: 170, title: 'Differenced Δyₜ = yₜ − yₜ₋₁', xlim: [0, 59], ylim: [-5, 15], xlabel: 'time t', ylabel: 'Δy', series: [{ t: 'line', pts: walk.slice(1).map((v, i) => [i + 1, v - walk[i]]), c: 's3' }, { t: 'hline', y: 5.5, c: 'fg', dash: true }] }] } }],
    examples: [{ title: 'Second-order differencing (worked)', body: R`Quadratic trend 1, 4, 9, 16, 25: first differences 3, 5, 7, 9 (still trending); second differences 2, 2, 2 (constant). In ARIMA notation that is d = 2.` }],
    code: [{ title: 'Differencing with NumPy / pandas', scratch: 'L13_time_series_scratch.py', lib: 'L13_time_series_statsmodels.py' }],
    traps: ['First-order differencing removes **trend**, not seasonality.', 'Differencing loses the first observation.', '"Last week" = $y_{t-1}$ for weekly data but $y_{t-7}$ for daily data.'],
    questions: [
      { type: 'int', diff: 'E', q: 'Sales: Mar 250, Apr 245. Differenced value for April?', answer: -5, tol: 0, round: 'Exact', verify: '245-250', sol: '**−5**.' },
      { type: 'int', diff: 'E', q: 'Prices 100, 105, 110, 115, 122. Mean of the differenced series?', answer: 5.5, tol: 0.001, round: '1 decimal', verify: '(5+5+5+7)/4', sol: '(5 + 5 + 5 + 7)/4 = **5.5**.' },
      { type: 'int', diff: 'M', q: 'Series 1, 4, 9, 16, 25. Value of the second difference?', answer: 2, tol: 0, round: 'Exact', verify: '(9-4)-(4-1)', sol: 'First differences 3, 5, 7, 9; second differences **2**.' },
      { type: 'mcq', diff: 'E', q: '"The temperature two days ago" in lag notation:', options: ['y_{t+2}', 'y_{t−2}', 'Δy_t', 'y_t'], answer: 1, sol: 'P2(c).', why: ['Future.', 'Correct.', 'Difference.', 'Today.'] },
      { type: 'mcq', diff: 'M', q: 'First-order differencing primarily removes:', options: ['seasonality', 'trend', 'noise', 'variance'], answer: 1, sol: 'Misconception note.', why: ['Needs seasonal differencing.', 'Correct.', 'No.', 'Not directly (use log).'] },
      { type: 'out', diff: 'M', q: 'Predict the exact output.', code: R`import pandas as pd
s = pd.Series([200, 220, 250, 245, 270, 300])
print(s.diff().dropna().astype(int).tolist(), s.diff().mean())`, answer: '[20, 30, -5, 25, 30] 20.0', sol: 'P2(b). `diff()` leaves NaN in the first position; `.mean()` skips it: 100/5 = 20.0.' }
    ],
    source: 'Worksheet L13 pp.7–11; Hyndman & Athanasopoulos §9.1.'
  },
  /* ---------------------------------------------------------------- L13.5 */
  {
    id: 'L13.5', title: 'Auto Regression AR(p)', badge: 'class', pages: '11–12', ws: 'Part III AR, P3(a,d)',
    concept: R`
:::hook Hook
In MLR we predicted Y from columns X₁, X₂, X₃. In time series we only have the target's past. Treat the **lags as features**: a regression of a variable on **historical versions of itself**.
:::

**AR(p)** ("auto" = self):
$$y_t = c + \phi_1y_{t-1} + \phi_2y_{t-2} + \dots + \phi_py_{t-p} + \varepsilon_t$$
- $y_t$ current value; c constant (baseline); $y_{t-1}$ lag 1 = feature 1; $\phi_1$ its weight; **p = order** (how many lags); $\varepsilon_t$ white-noise error today.
- AR(2) for daily temperature: $y_t = c + \phi_1y_{t-1} + \phi_2y_{t-2} + \varepsilon_t$ (yesterday and the day before).

:::key Key insight
AR works on **momentum**: high values yesterday and the day before, with positive φ's, carry forward to a high prediction today. It turns forecasting into a weighted sum — linear regression whose features are the variable's own past.
:::

**Choosing p.** *Classroom question:* p = 365 → 365 weights for tomorrow's temperature → complex, slow, **overfits** noise from a random day 8 months ago (Lecture 9). Too small p misses patterns. We need a tool that shows which lags carry **significant direct** signal → **PACF** (next unit).

**P3(a).** AR(3) daily sales: $y_t = c + \phi_1y_{t-1} + \phi_2y_{t-2} + \phi_3y_{t-3} + \varepsilon_t$ (don't forget c and ε).
**P3(d).** AR(1), φ₁ = 0.9, c = 2, $y_{t-1} = 50$: $\hat y_t = 2 + 0.9(50) = $ **47** (A). Forgetting c gives 45.

*Fitting:* build a design matrix with columns [1, $y_{t-1}$, …, $y_{t-p}$] and use OLS (L3–L4) — or \`statsmodels\` \`AutoReg\`.`,
    formulas: [{ name: 'AR(p)', tex: R`y_t = c + \sum_{i=1}^{p}\phi_iy_{t-i} + \varepsilon_t`, sym: 'p lags, p + 1 parameters (+ noise variance).', when: 'Writing / evaluating AR models.' }, { name: 'AR(1) long-run mean', tex: R`\mu = \frac{c}{1-\phi_1}\ \ (|\phi_1| < 1)`, sym: 'Researched; stationarity needs |φ₁| < 1.', when: 'GATE-style extensions.' }],
    examples: [{ title: 'Multi-step AR(2) forecast (worked)', body: R`$y_t = 1 + 0.5y_{t-1} + 0.3y_{t-2}$, last values $y_{10} = 20$, $y_9 = 18$.
- $\hat y_{11} = 1 + 0.5(20) + 0.3(18) = 1 + 10 + 5.4 = $ **16.4**.
- $\hat y_{12} = 1 + 0.5(16.4) + 0.3(20) = 1 + 8.2 + 6 = $ **15.2** (uses the forecast as an input).` }],
    code: [{ title: 'AR(2) by OLS on lag columns; AutoReg', scratch: 'L13_time_series_scratch.py', lib: 'L13_time_series_statsmodels.py' }],
    traps: ['Include the constant c and the error term in the equation.', 'Too many lags (p = 365) overfits.', 'In multi-step forecasts, earlier **forecasts** become inputs.'],
    questions: [
      { type: 'int', diff: 'E', q: 'AR(1): c = 2, φ₁ = 0.9, yₜ₋₁ = 50. Predicted yₜ (ignore ε)?', answer: 47, tol: 0, round: 'Exact', verify: '2+0.9*50', sol: '2 + 45 = **47** (P3(d)).' },
      { type: 'int', diff: 'M', q: 'AR(2): yₜ = 1 + 0.5yₜ₋₁ + 0.3yₜ₋₂, with yₜ₋₁ = 20, yₜ₋₂ = 18. Forecast (1 decimal)?', answer: 16.4, tol: 0.001, round: '1 decimal', verify: '1+0.5*20+0.3*18', sol: '1 + 10 + 5.4 = **16.4**.' },
      { type: 'int', diff: 'H', q: 'Same AR(2); the next step uses ŷ = 16.4 and 20. Two-step forecast (1 decimal)?', answer: 15.2, tol: 0.001, round: '1 decimal', verify: '1+0.5*16.4+0.3*20', sol: '1 + 8.2 + 6 = **15.2**.' },
      { type: 'mcq', diff: 'E', q: 'In AR(p), p is:', options: ['the number of past shocks', 'the number of lags (past values) used', 'the period of seasonality', 'the number of differences'], answer: 1, sol: 'Order of AR.', why: ['That is q (MA).', 'Correct.', 'No.', 'That is d (ARIMA).'] },
      { type: 'mcq', diff: 'M', q: 'Setting p = 365 for daily temperature most likely causes:', options: ['underfitting', 'overfitting (too many parameters fitting noise)', 'stationarity', 'nothing'], answer: 1, sol: 'Classroom question.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'M', q: 'An AR(3) model (with constant) has how many φ/c coefficients to learn?', answer: 4, tol: 0, round: 'Exact', verify: '3+1', sol: 'c, φ₁, φ₂, φ₃ → **4**.' },
      { type: 'write', diff: 'M', q: 'Write `ar_forecast(history, c, phis)` returning the one-step AR(p) forecast c + Σ φᵢ·y_{t−i}, where `phis[0]` multiplies the most recent value `history[-1]`.',
        starter: 'def ar_forecast(history, c, phis):\n    pass\n',
        ref: 'def ar_forecast(history, c, phis):\n    return c + sum(phi * history[-(i + 1)] for i, phi in enumerate(phis))',
        tests: 'assert abs(ar_forecast([50], 2, [0.9]) - 47) < 1e-9\nassert abs(ar_forecast([18, 20], 1, [0.5, 0.3]) - 16.4) < 1e-9\nassert abs(ar_forecast([1, 2, 3, 4], 0, [1, 0, 0]) - 4) < 1e-9' }
    ],
    source: 'Worksheet L13 pp.11–12; Box, Jenkins & Reinsel, *Time Series Analysis* ch.3.'
  },
  /* ---------------------------------------------------------------- L13.6 */
  {
    id: 'L13.6', title: 'ACF and PACF', badge: 'class', pages: '12–16', ws: 'ACF/PACF, P3(b,c,e)',
    concept: R`
**Autocorrelation (ACF)** — Pearson-style correlation between the series and a **lagged copy of itself**:
$$\rho_k = \frac{\sum_{t=k+1}^{N}(y_t - \bar y)(y_{t-k} - \bar y)}{\sum_{t=1}^{N}(y_t - \bar y)^2}$$

| ACF | Meaning |
|---|---|
| near +1 | past up → today up (momentum) |
| near −1 | past up → today down (mean-reverting) |
| near 0 | that lag gives no linear information |

**The problem: indirect correlation.** Today ~ yesterday, yesterday ~ the day before, so ACF shows today ~ the day before yesterday — mostly a **ripple** passing through yesterday. ACF measures the **total** (direct + indirect) effect and may suggest 10 lags when 1 lag is carrying a chain reaction.

**Partial autocorrelation (PACF)** — the **direct** correlation between $y_t$ and $y_{t-k}$ after removing the influence of all intermediate lags: the unique new information lag k brings.

**Reading a PACF to choose p:** look at the bars; find the shaded **confidence band** (≈ ±1.96/√N); count lags that stick out significantly before they fall into the noise; if only lags 1 and 2 are significant, **p = 2 → AR(2)**.

| Tool | Measures | AR process | Use for |
|---|---|---|---|
| **ACF** | total correlation | **tails off slowly** | order **q** of MA |
| **PACF** | direct correlation | **cuts off after lag p** | order **p** of AR |

**P3(b).** PACF lags 1–7: 0.85, 0.42, 0.05, −0.02, 0.03, −0.01, **0.38** (lags 1, 2, 7 significant). (i) From lags 1–6 → **p = 2**. (ii) Lag 7 in daily data → **weekly seasonality**. (iii) Include it — e.g. lags 1, 2 and 7 (specific lag selection; not necessarily all lags 3–6).
**P3(e).** "To choose p, count significant ACF bars" → **wrong tool**: ACF includes indirect ripples and overestimates p; use **PACF**.`,
    deriv: [{ id: 'D13-acf', title: 'ACF at lags 1 and 2 by hand', badge: 'class',
      intro: 'Series y = [2, 4, 3, 5, 4, 6], N = 6.',
      steps: [
        { m: R`\bar y = 24/6 = 4,\quad d_t = y_t - \bar y = [-2, 0, -1, 1, 0, 2]`, t: 'Deviations.' },
        { m: R`\sum d_t^2 = 4 + 0 + 1 + 1 + 0 + 4 = 10`, why: 'Denominator (all N terms).' },
        { m: R`\sum_{t=2}^{6} d_td_{t-1} = (0)(-2) + (-1)(0) + (1)(-1) + (0)(1) + (2)(0) = -1`, why: 'Lag-1 products.' },
        { m: R`\rho_1 = -1/10 = -0.1`, t: '' },
        { m: R`\sum_{t=3}^{6} d_td_{t-2} = (-1)(-2) + (1)(0) + (0)(-1) + (2)(1) = 4 \Rightarrow \rho_2 = 0.4`, why: 'Lag-2 products.' }
      ], result: R`\rho_1 = -0.1,\quad \rho_2 = 0.4`, after: 'The zig-zag (up, down, up…) gives a slightly negative lag-1 and a positive lag-2 autocorrelation.' }],
    formulas: [{ name: 'Sample ACF', tex: R`\rho_k = \frac{\sum_{t=k+1}^N(y_t-\bar y)(y_{t-k}-\bar y)}{\sum_{t=1}^N(y_t-\bar y)^2}`, sym: 'Same mean ȳ and full-length denominator.', when: 'Hand ACF.' }, { name: 'Significance band', tex: R`\pm\frac{1.96}{\sqrt N}`, sym: 'Approximate 95% band for white noise.', when: 'Reading plots.' }, { name: 'AR(1) ACF (researched)', tex: R`\rho_k = \phi^k`, sym: 'Geometric decay.', when: 'Why ACF tails off.' }],
    plots: [
      { id: 'P13-acf', title: 'ACF of a simulated AR(2) process: slow decay', notice: 'Lag-1 correlation ripples through lags 2, 3, … so many bars stay large. ACF alone would suggest many lags. Shaded band = ±1.96/√N (N = 300).',
        spec: { type: 'xy', w: 520, h: 260, xlim: [0.3, 15.7], ylim: [-0.25, 1], xticks: [1, 3, 5, 7, 9, 11, 13, 15], xlabel: 'lag', ylabel: 'correlation', series: [{ t: 'hband', y0: -band, y1: band, c: 's1', op: 0.15 }, bars(A15, 's1'), { t: 'hline', y: 0, c: 'fg' }] } },
      { id: 'P13-pacf', title: 'PACF of the same AR(2): sharp cut-off after lag 2', notice: 'Only lags 1 and 2 stand outside the band → choose p = 2.',
        spec: { type: 'xy', w: 520, h: 260, xlim: [0.3, 15.7], ylim: [-0.25, 1], xticks: [1, 3, 5, 7, 9, 11, 13, 15], xlabel: 'lag', ylabel: 'partial correlation', series: [{ t: 'hband', y0: -band, y1: band, c: 's4', op: 0.15 }, bars(P15, 's4'), { t: 'hline', y: 0, c: 'fg' }] } }
    ],
    examples: [{ title: 'Reading PACF bars (worked)', body: R`N = 400 → band ≈ ±1.96/20 = ±0.098. PACF = 0.72, 0.31, 0.06, −0.04, 0.02 → lags 1, 2 exceed 0.098 → **AR(2)**.` }],
    code: [{ title: 'ACF/PACF from scratch; plot_acf / plot_pacf', scratch: 'L13_time_series_scratch.py', lib: 'L13_time_series_statsmodels.py' }],
    traps: ['**PACF → p (AR); ACF → q (MA).** Reversing them is the classic error.', 'AR: ACF tails off, PACF cuts off. MA: ACF cuts off, PACF tails off.', 'A significant lag 7 in daily data = weekly seasonality.'],
    questions: [
      { type: 'int', diff: 'M', q: 'Series [2, 4, 3, 5, 4, 6]. ACF at lag 2 (1 decimal)?', answer: 0.4, tol: 0.001, round: '1 decimal', verify: '4/10', sol: 'Numerator 4, denominator 10 → **0.4**.' },
      { type: 'int', diff: 'M', q: 'Series [2, 4, 3, 5, 4, 6]. ACF at lag 1 (1 decimal)?', answer: -0.1, tol: 0.001, round: '1 decimal', verify: '-1/10', sol: '**−0.1**.' },
      { type: 'mcq', diff: 'E', q: 'To choose p for an AR model, count the significant bars in the:', options: ['ACF', 'PACF', 'histogram', 'residual plot'], answer: 1, sol: 'P3(e).', why: ['Includes ripples.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'M', q: 'PACF lags 1–6: 0.85, 0.42, 0.05, −0.02, 0.03, −0.01; only 1 and 2 significant. Chosen p?', answer: 2, tol: 0, round: 'Exact', verify: '2', sol: '**p = 2**.' },
      { type: 'mcq', diff: 'M', q: 'Daily data, PACF significant at lag 7. Likely meaning?', options: ['noise', 'weekly seasonality', 'a trend', 'an MA(7) process'], answer: 1, sol: 'P3(b)(ii).', why: ['Significant.', 'Correct.', 'No.', 'Not implied.'] },
      { type: 'mcq', diff: 'M', q: 'For a pure AR process, the ACF typically ___ and the PACF ___.', options: ['cuts off, tails off', 'tails off slowly, cuts off after p', 'is zero, is zero', 'is 1, is 1'], answer: 1, sol: 'P3(c).', why: ['That is MA.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'E', q: 'N = 400 observations. Approximate 95% band ±1.96/√N (3 decimals)?', answer: 0.098, tol: 0.001, round: '3 decimals', verify: '1.96/400**0.5', sol: '1.96/20 = **0.098**.' }
    ],
    source: 'Worksheet L13 pp.12–16; Box–Jenkins ch.3.'
  },
  /* ---------------------------------------------------------------- L13.7 */
  {
    id: 'L13.7', title: 'Random shocks and MA(q); AR vs MA', badge: 'class', pages: '16–22', ws: 'Part IV, P4',
    concept: R`
:::hook Hook
An AR model predicts tomorrow's stock price from the past two days. At 2 PM a surprise policy announcement crashes the market. Did yesterday's price predict that? No.
:::

Unpredictable external events are **random shocks** (innovations). Mathematically they are the **forecast errors**:
$$\text{random shock} = \text{actual} - \text{predicted} = \varepsilon_t$$
— the $\varepsilon_t$ already in the AR equation.

**Moving Average model MA(q)** — learn from the **shocks themselves**:
$$y_t = c + \varepsilon_t + \theta_1\varepsilon_{t-1} + \theta_2\varepsilon_{t-2} + \dots + \theta_q\varepsilon_{t-q}$$
c = constant mean; $\varepsilon_t$ = today's shock (unpredictable); $\varepsilon_{t-1}$ = yesterday's shock (forecast error); $\theta_1$ its weight; **q** = how many past shocks.

:::warn Not a rolling mean
The MA **model** uses **past forecast errors**, not a rolling average of past values (like a 50-day moving average on a stock chart). The name is misleading.
:::

| | AR | MA |
|---|---|---|
| predicts using | past **values** $y_{t-1}, y_{t-2}, \dots$ | past **errors** $\varepsilon_{t-1}, \varepsilon_{t-2}, \dots$ |
| assumes today is driven by | **signal** of the past | **noise / shocks** of the past |
| intuition | **momentum** | **shock absorption**: a bump fades over q steps |
| order | p | q |
| chosen with | PACF | ACF |

:::key Key insight
AR assumes momentum (high yesterday → high today). MA assumes a mostly flat baseline that temporary shocks (e.g. a marketing campaign) bump off, and the bump fades over q steps. Combining both gives **ARMA/ARIMA** (next lecture / researched below).
:::

**P4.** (b) Trend–F, seasonality–C, noise–E, stationarity–D, ACF–A, random shock–B. (c) Weekly sales, 3 years, upward trend + December spike: (i) **not stationary** (trend + seasonal spikes); (ii) first apply **first-order differencing**; (iii) PACF significant at lags 1–2 → **AR(2)**; (iv) residuals with a repeating weekly pattern → the model **missed seasonality** (add seasonal lags / a seasonal model).`,
    formulas: [{ name: 'MA(q)', tex: R`y_t = c + \varepsilon_t + \sum_{j=1}^{q}\theta_j\varepsilon_{t-j}`, sym: 'ε = past forecast errors (shocks).', when: 'MA questions.' }, { name: 'Shock', tex: R`\varepsilon_t = y_t - \hat y_t`, sym: '', when: 'Computing MA forecasts.' }],
    plots: [{ id: 'P13-shocks', title: 'Random shocks push the series off its predicted path', notice: 'Dashed: predicted baseline. A shock at t = 8 (positive), t = 22 (negative), t = 30 (positive); with MA(1) part of each bump carries into the next step, then fades.',
      spec: { type: 'xy', w: 560, h: 260, xlim: [0, 39], ylim: [0, 25], xlabel: 'time t', ylabel: 'value', series: [{ t: 'line', pts: pred, c: 's7', dash: true }, { t: 'line', pts: shockPath, c: 's1', markers: true, mr: 2.5 }, { t: 'text', x: 8, y: 22.5, s: 'positive shock' }, { t: 'text', x: 22, y: 2, s: 'negative shock' }] } }],
    examples: [{ title: 'MA(1) forecast (worked)', body: R`$y_t = 50 + \varepsilon_t + 0.6\varepsilon_{t-1}$. Yesterday's forecast was 50 but the actual was 55 → $\varepsilon_{t-1} = 5$. Today's forecast (E[ε_t] = 0): $50 + 0.6(5) = $ **53**. Tomorrow, if today has no new shock, the effect of yesterday's shock is gone (q = 1): forecast back to 50.` }],
    code: [{ title: 'MA(1) ACF cut-off vs AR(2)', scratch: 'L13_time_series_scratch.py' }],
    traps: ['MA uses **errors**, not values — not a rolling mean.', 'ACF of an MA(q) **cuts off after lag q**; PACF tails off.', 'Noise (component) vs random shock (a specific unpredictable event) — P4(b) distinguishes them.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'The MA(q) model predicts using:', options: ['a rolling average of past values', 'past forecast errors (random shocks)', 'future values', 'seasonal dummies'], answer: 1, sol: 'Warning box.', why: ['Classic misconception.', 'Correct.', 'No.', 'No.'] },
      { type: 'int', diff: 'M', q: 'MA(1): yₜ = 50 + εₜ + 0.6εₜ₋₁. Yesterday: forecast 50, actual 55. Today\'s forecast?', answer: 53, tol: 0.001, round: 'Exact', verify: '50+0.6*(55-50)', sol: 'ε_{t−1} = 5 → 50 + 3 = **53**.' },
      { type: 'mcq', diff: 'E', q: 'Which model assumes "momentum"?', options: ['AR', 'MA', 'Neither', 'Both equally'], answer: 0, sol: 'AR vs MA table.', why: ['Correct.', 'Shock absorption.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'The order q of an MA model is chosen from the:', options: ['PACF', 'ACF', 'histogram', 'scree plot'], answer: 1, sol: 'ACF cuts off after q for MA.', why: ['That is for p.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Weekly sales with a steady upward trend and a December spike. First transformation to address the trend?', options: ['Standardisation', 'First-order differencing', 'PCA', 'One-hot encoding'], answer: 1, sol: 'P4(c)(ii).', why: ['Does not remove trend.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'Match: "an unpredictable external event that causes forecast error" is a:', options: ['trend', 'random shock', 'seasonality', 'stationarity'], answer: 1, sol: 'P4(b): (6)–B.', why: ['No.', 'Correct.', 'No.', 'No.'] }
    ],
    source: 'Worksheet L13 pp.16–22; Box–Jenkins ch.3.'
  },
  /* ---------------------------------------------------------------- L13.8 */
  {
    id: 'L13.8', title: 'ARMA/ARIMA, ADF test, seasonal differencing, identification table', badge: 'res', pages: '–', ws: 'Researched (worksheet previews ARMA/ARIMA for the next lecture)',
    concept: R`
**ARMA(p, q)** combines both: $y_t = c + \sum_{i=1}^p\phi_iy_{t-i} + \varepsilon_t + \sum_{j=1}^q\theta_j\varepsilon_{t-j}$.

**ARIMA(p, d, q)** = ARMA(p, q) on the series **differenced d times** ("I" = integrated). d = 1 removes a linear trend, d = 2 a quadratic one. ARIMA(1,1,0) = AR(1) on first differences. **SARIMA** adds seasonal terms (P, D, Q)ₛ, e.g. seasonal differencing $y_t - y_{t-12}$ for monthly data.

**Augmented Dickey–Fuller (ADF) test** for stationarity: H₀ = the series has a **unit root** (non-stationary). **p < 0.05 → reject H₀ → stationary.** From the code: trending series ADF p = 0.69 (non-stationary); its first difference p ≈ 0.000 (stationary).

**Identification table (Box–Jenkins)**

| Model | ACF | PACF |
|---|---|---|
| AR(p) | tails off | **cuts off after p** |
| MA(q) | **cuts off after q** | tails off |
| ARMA(p, q) | tails off | tails off |

**Workflow:** plot → transform (log for growing variance) → difference until ADF says stationary (choose d) → read ACF/PACF (choose p, q) → fit → check residuals are white noise → forecast and undo the differencing.

**Course lab "Time Series Forecasting":** monthly vaccine demand with trend, no seasonality → forecast 3 months and add a 10% safety stock (×1.10). The expected output (2918.42, 2947.53, 2975.61) could not be reproduced exactly with the tried models; ARIMA(2,0,0) with a constant gives 2922.63, 2952.47, 2979.18 → stock 3214.89, 3247.72, 3277.09. (See UNCLEAR.md item 16.)`,
    formulas: [{ name: 'ARIMA(p,d,q)', tex: R`\Delta^d y_t = c + \sum_{i=1}^p\phi_i\Delta^d y_{t-i} + \varepsilon_t + \sum_{j=1}^q\theta_j\varepsilon_{t-j}`, sym: 'Δᵈ = difference d times.', when: 'Notation questions.' }, { name: 'ADF decision', tex: R`p < 0.05 \Rightarrow \text{reject unit root} \Rightarrow \text{stationary}`, sym: '', when: 'Interpreting adfuller output.' }],
    examples: [{ title: 'Name the model (worked)', body: R`| Description | Model |
|---|---|
| differenced once, PACF cuts off at 2, ACF tails off | ARIMA(2,1,0) |
| no differencing, ACF cuts off at 1, PACF tails off | ARIMA(0,0,1) = MA(1) |
| differenced twice, then white noise | ARIMA(0,2,0) |
| monthly data, seasonal difference at lag 12 | SARIMA with D = 1, s = 12 |` }],
    code: [{ title: 'ADF, AutoReg, ARIMA forecasts, vaccine lab', lib: 'L13_time_series_statsmodels.py', libLabel: 'statsmodels' }],
    traps: ['ADF null = **non-stationary**; small p ⇒ stationary.', 'In ARIMA(p,d,q) the middle number is the number of differences.', 'MA(q): ACF cuts off; AR(p): PACF cuts off.'],
    questions: [
      { type: 'mcq', diff: 'M', tag: 'GATE-style', q: 'An ADF test gives p-value 0.69. Conclusion?', options: ['Stationary', 'Cannot reject a unit root — treat as non-stationary', 'Seasonal', 'White noise'], answer: 1, sol: 'H₀: unit root.', why: ['No.', 'Correct.', 'No.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'In ARIMA(2, 1, 3), the "1" means:', options: ['one AR lag', 'the series is differenced once', 'one MA lag', 'one season'], answer: 1, sol: 'd = 1.', why: ['p = 2.', 'Correct.', 'q = 3.', 'No.'] },
      { type: 'mcq', diff: 'M', q: 'ACF cuts off sharply after lag 1; PACF tails off. Model?', options: ['AR(1)', 'MA(1)', 'ARMA(1,1)', 'White noise'], answer: 1, sol: 'Identification table.', why: ['AR would have PACF cut off.', 'Correct.', 'Both would tail off.', 'No significant lags then.'] },
      { type: 'int', diff: 'E', q: 'Lab: forecast demand 2922.63. Recommended stock with a 10% safety margin (2 decimals)?', answer: 3214.89, tol: 0.01, round: '2 decimals', verify: 'round(2922.63*1.10, 2)', sol: '2922.63 × 1.10 = **3214.89**.' },
      { type: 'mcq', diff: 'M', q: 'Monthly sales spike every December. Which transformation targets this?', options: ['First difference y_t − y_{t−1}', 'Seasonal difference y_t − y_{t−12}', 'Standardisation', 'Log only'], answer: 1, sol: 'Seasonal differencing.', why: ['Removes trend.', 'Correct.', 'No.', 'Stabilises variance.'] }
    ],
    researched: R`Beyond the worksheet. Sources: Hyndman & Athanasopoulos, *Forecasting: Principles and Practice* (3rd ed.) ch.9; statsmodels \`adfuller\`, \`ARIMA\`, \`AutoReg\` docs; Box, Jenkins & Reinsel.`,
    source: 'Hyndman & Athanasopoulos ch.9; statsmodels docs.'
  }
  ]
});
})();
