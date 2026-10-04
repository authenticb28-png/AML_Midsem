/* core.js — globals shared by every data file. Loaded before any data/*.js. */
window.R = String.raw;              // R`\frac{a}{b}` keeps backslashes for KaTeX
window.LECTURES = [];               // data/lecNN.js push one object each
window.CODE = window.CODE || {};    // filled by data/code_bundle.js (generated from aml-practice/*.py)
window.EXTRA = { patterns: null, intDrill: [], codeDrill: [], mocks: {}, plan: null, revision: null };

/* Small numeric helpers that data files may use to build plots from real numbers. */
window.NUM = {
  linspace(a, b, n) { const out = []; for (let i = 0; i < n; i++) out.push(a + (b - a) * i / (n - 1)); return out; },
  mean(a) { return a.reduce((s, v) => s + v, 0) / a.length; },
  // deterministic pseudo-random generator (mulberry32) so plots look identical every load
  rng(seed) { let t = seed >>> 0; return function () { t += 0x6D2B79F5; let r = Math.imul(t ^ t >>> 15, 1 | t); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; }; },
  gauss(rand) { let u = 0, v = 0; while (u === 0) u = rand(); while (v === 0) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); },
  ols(xs, ys) { const mx = NUM.mean(xs), my = NUM.mean(ys); let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; }); const m = sxy / sxx; return { m, c: my - m * mx }; },
  // least-squares polynomial fit (normal equations with small ridge for stability)
  polyfit(xs, ys, deg, ridge = 1e-9) {
    const n = deg + 1, A = Array.from({ length: n }, () => Array(n).fill(0)), b = Array(n).fill(0);
    xs.forEach((x, k) => { const p = []; for (let i = 0; i < n; i++) p.push(x ** i); for (let i = 0; i < n; i++) { b[i] += p[i] * ys[k]; for (let j = 0; j < n; j++) A[i][j] += p[i] * p[j]; } });
    for (let i = 0; i < n; i++) A[i][i] += ridge;
    for (let i = 0; i < n; i++) { let piv = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[piv][i])) piv = r;[A[i], A[piv]] = [A[piv], A[i]];[b[i], b[piv]] = [b[piv], b[i]]; for (let r = i + 1; r < n; r++) { const f = A[r][i] / A[i][i]; for (let c = i; c < n; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; } }
    const w = Array(n).fill(0); for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let c = i + 1; c < n; c++) s -= A[i][c] * w[c]; w[i] = s / A[i][i]; }
    return x => w.reduce((s, wi, i) => s + wi * x ** i, 0);
  },
  sigmoid(z) { return 1 / (1 + Math.exp(-z)); }
};
