/* plots.js — tiny SVG plotting library. Every chart on the site is drawn from numbers in the data files.
   PL.render(spec) -> HTML string. Spec types: xy, bars, heat, flow, surface, multi, svg. */
(function () {
  const PL = {};
  let UID = 0;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const COL = { s1: 'var(--s1)', s2: 'var(--s2)', s3: 'var(--s3)', s4: 'var(--s4)', s5: 'var(--s5)', s6: 'var(--s6)', s7: 'var(--s7)', fg: 'var(--fg)', muted: 'var(--muted)', axis: 'var(--axis)', accent: 'var(--accent)' };
  const col = c => COL[c] || c || 'var(--s1)';
  const ORDER = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];
  PL.esc = esc;

  function niceStep(span, n) { const raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p; }
  function ticks(a, b, n = 6) { const st = niceStep(b - a, n), t = []; for (let v = Math.ceil(a / st - 1e-9) * st; v <= b + st * 1e-6; v += st) t.push(+v.toFixed(10)); return t; }
  function fmt(v) { if (Math.abs(v) >= 10000) return v.toExponential(0); const r = Math.round(v * 1000) / 1000; return String(r); }
  function textLines(x, y, s, cls = 'lbl', anchor = 'middle', lh = 14, extra = '') {
    const lines = String(s).split('\n'); const y0 = y - (lines.length - 1) * lh / 2;
    return lines.map((l, i) => `<text class="${cls}" x="${x}" y="${y0 + i * lh}" text-anchor="${anchor}" dominant-baseline="middle" ${extra}>${esc(l)}</text>`).join('');
  }
  function markerDefs(id, colors) {
    return colors.map(c => `<marker id="${id}-${c.replace(/[^a-z0-9]/gi, '')}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${col(c)}"/></marker>`).join('');
  }
  const mref = (id, c) => `url(#${id}-${String(c).replace(/[^a-z0-9]/gi, '')})`;

  /* ---------------- XY plot ---------------- */
  PL.xy = function (s) {
    const id = 'p' + (++UID);
    const W = s.w || 560, H = s.h || 330;
    const m = { l: s.ml || 56, r: s.mr || 18, t: (s.title ? 30 : 14) + (s.mt || 0), b: s.mb || 46 };
    const [x0, x1] = s.xlim, [y0, y1] = s.ylim;
    const PW = W - m.l - m.r, PH = H - m.t - m.b;
    const sx = x => m.l + (x - x0) / (x1 - x0) * PW, sy = y => m.t + PH - (y - y0) / (y1 - y0) * PH;
    const series = s.series || [];
    const colors = new Set(['fg', 'axis']); series.forEach((se, i) => { if (!se.c) se.c = ORDER[i % ORDER.length]; colors.add(se.c); });
    let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${esc(s.title || 'plot')}" xmlns="http://www.w3.org/2000/svg">`;
    out += `<defs><clipPath id="${id}c"><rect x="${m.l}" y="${m.t}" width="${PW}" height="${PH}"/></clipPath>${markerDefs(id, [...colors])}</defs>`;
    if (s.title) out += `<text class="ttl" x="${W / 2}" y="18" text-anchor="middle">${esc(s.title)}</text>`;
    const xt = s.xticks === false ? [] : (s.xticks || ticks(x0, x1, s.nx || 7)), yt = s.yticks === false ? [] : (s.yticks || ticks(y0, y1, s.ny || 6));
    if (s.grid !== false) {
      xt.forEach(v => out += `<line class="gr" x1="${sx(v)}" y1="${m.t}" x2="${sx(v)}" y2="${m.t + PH}"/>`);
      yt.forEach(v => out += `<line class="gr" x1="${m.l}" y1="${sy(v)}" x2="${m.l + PW}" y2="${sy(v)}"/>`);
    }
    // axes: draw zero lines if inside range, else frame
    out += `<rect x="${m.l}" y="${m.t}" width="${PW}" height="${PH}" fill="none" class="ax" stroke-width="1"/>`;
    if (s.zero !== false) {
      if (x0 < 0 && x1 > 0) out += `<line class="ax" x1="${sx(0)}" y1="${m.t}" x2="${sx(0)}" y2="${m.t + PH}" stroke-width="1.2" opacity=".7"/>`;
      if (y0 < 0 && y1 > 0) out += `<line class="ax" x1="${m.l}" y1="${sy(0)}" x2="${m.l + PW}" y2="${sy(0)}" stroke-width="1.2" opacity=".7"/>`;
    }
    const xl = s.xtl || {}, yl = s.ytl || {};
    xt.forEach(v => out += `<text class="tk" x="${sx(v)}" y="${m.t + PH + 15}" text-anchor="middle">${esc(xl[v] !== undefined ? xl[v] : fmt(v))}</text>`);
    yt.forEach(v => out += `<text class="tk" x="${m.l - 6}" y="${sy(v) + 4}" text-anchor="end">${esc(yl[v] !== undefined ? yl[v] : fmt(v))}</text>`);
    if (s.xlabel) out += `<text class="lbl" x="${m.l + PW / 2}" y="${H - 8}" text-anchor="middle">${esc(s.xlabel)}</text>`;
    if (s.ylabel) out += `<text class="lbl" transform="translate(14 ${m.t + PH / 2}) rotate(-90)" text-anchor="middle">${esc(s.ylabel)}</text>`;
    out += `<g clip-path="url(#${id}c)">`;
    const legend = [];
    series.forEach(se => {
      const c = col(se.c), w = se.w || 2, dash = se.dash ? `stroke-dasharray="${se.dash === true ? '6 4' : se.dash}"` : '', op = se.op !== undefined ? `opacity="${se.op}"` : '';
      if (se.label) legend.push(se);
      switch (se.t) {
        case 'scatter': {
          const r = se.r || 4.5;
          se.pts.forEach((p, i) => {
            const X = sx(p[0]), Y = sy(p[1]);
            if (se.m === 'x') out += `<path d="M${X - r},${Y - r}L${X + r},${Y + r}M${X - r},${Y + r}L${X + r},${Y - r}" style="stroke:${c}" stroke-width="2" ${op}/>`;
            else if (se.m === 's') out += `<rect x="${X - r}" y="${Y - r}" width="${2 * r}" height="${2 * r}" style="fill:${se.hollow ? 'none' : c};stroke:${c}" stroke-width="1.5" ${op}/>`;
            else if (se.m === '^') out += `<path d="M${X},${Y - r * 1.2}L${X + r * 1.1},${Y + r * .8}L${X - r * 1.1},${Y + r * .8}z" style="fill:${se.hollow ? 'none' : c};stroke:${c}" stroke-width="1.5" ${op}/>`;
            else out += `<circle cx="${X}" cy="${Y}" r="${r}" style="fill:${se.hollow ? 'none' : c};stroke:${c}" stroke-width="1.5" ${op}/>`;
            if (se.labels && se.labels[i] !== undefined && se.labels[i] !== '') out += `<text class="tk" x="${X + 6}" y="${Y - 7}">${esc(se.labels[i])}</text>`;
          });
          break;
        }
        case 'fn': {
          const [a, b] = se.d || [x0, x1], n = se.n || 240; let d = '', pen = false;
          for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, y = se.f(x); if (!isFinite(y) || Math.abs(y) > 1e7) { pen = false; continue; } d += (pen ? 'L' : 'M') + sx(x).toFixed(2) + ',' + sy(y).toFixed(2); pen = true; }
          out += `<path d="${d}" fill="none" style="stroke:${c}" stroke-width="${w}" ${dash} ${op}/>`; break;
        }
        case 'line': case 'path': {
          const d = se.pts.map((p, i) => (i ? 'L' : 'M') + sx(p[0]).toFixed(2) + ',' + sy(p[1]).toFixed(2)).join('');
          if (se.arrow) { for (let i = 1; i < se.pts.length; i++) out += `<line x1="${sx(se.pts[i - 1][0])}" y1="${sy(se.pts[i - 1][1])}" x2="${sx(se.pts[i][0])}" y2="${sy(se.pts[i][1])}" style="stroke:${c}" stroke-width="${w}" marker-end="${mref(id, se.c)}" ${dash} ${op}/>`; }
          else out += `<path d="${d}" fill="none" style="stroke:${c}" stroke-width="${w}" ${dash} ${op} stroke-linejoin="round"/>`;
          if (se.markers) se.pts.forEach(p => out += `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="${se.mr || 3}" style="fill:${c}"/>`);
          break;
        }
        case 'seg': se.segs.forEach(g => out += `<line x1="${sx(g[0])}" y1="${sy(g[1])}" x2="${sx(g[2])}" y2="${sy(g[3])}" style="stroke:${c}" stroke-width="${w}" ${dash} ${op} ${se.arrow ? `marker-end="${mref(id, se.c)}"` : ''}/>`); break;
        case 'hline': out += `<line x1="${m.l}" y1="${sy(se.y)}" x2="${m.l + PW}" y2="${sy(se.y)}" style="stroke:${c}" stroke-width="${w}" ${dash} ${op}/>`; break;
        case 'vline': out += `<line x1="${sx(se.x)}" y1="${m.t}" x2="${sx(se.x)}" y2="${m.t + PH}" style="stroke:${c}" stroke-width="${w}" ${dash} ${op}/>`; break;
        case 'band': out += `<rect x="${sx(se.x0)}" y="${m.t}" width="${sx(se.x1) - sx(se.x0)}" height="${PH}" style="fill:${c}" opacity="${se.op || .15}"/>`; break;
        case 'hband': out += `<rect x="${m.l}" y="${sy(se.y1)}" width="${PW}" height="${sy(se.y0) - sy(se.y1)}" style="fill:${c}" opacity="${se.op || .15}"/>`; break;
        case 'ellipse': {
          const rx = Math.abs(sx(x0 + se.rx) - sx(x0)), ry = Math.abs(sy(y0 + se.ry) - sy(y0));
          out += `<ellipse cx="${sx(se.cx)}" cy="${sy(se.cy)}" rx="${rx}" ry="${ry}" transform="rotate(${-(se.rot || 0)} ${sx(se.cx)} ${sy(se.cy)})" style="fill:${se.fill ? c : 'none'};stroke:${c}" fill-opacity="${se.fop || .15}" stroke-width="${w}" ${dash} ${op}/>`; break;
        }
        case 'poly': out += `<path d="${se.pts.map((p, i) => (i ? 'L' : 'M') + sx(p[0]) + ',' + sy(p[1])).join('')}z" style="fill:${se.fill === false ? 'none' : c};stroke:${c}" fill-opacity="${se.fop || .18}" stroke-width="${w}" ${dash}/>`; break;
        case 'bars': {
          const bw = se.bw || ((se.xs.length > 1 ? (se.xs[1] - se.xs[0]) : 1) * 0.8);
          se.xs.forEach((x, i) => { const y = se.ys[i], top = sy(Math.max(y, 0)), bot = sy(Math.min(y, 0)); out += `<rect x="${sx(x - bw / 2)}" y="${top}" width="${Math.max(1, sx(x + bw / 2) - sx(x - bw / 2))}" height="${Math.max(0.5, bot - top)}" style="fill:${c}" opacity="${se.op || .85}"/>`; });
          break;
        }
        case 'stem': se.pts.forEach(p => { out += `<line x1="${sx(p[0])}" y1="${sy(0)}" x2="${sx(p[0])}" y2="${sy(p[1])}" style="stroke:${c}" stroke-width="${w + 1}"/><circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="3.5" style="fill:${c}"/>`; }); break;
        case 'text': out += textLines(sx(se.x), sy(se.y), se.s, 'lbl', se.anchor || 'middle', 14, `style="fill:${se.c === 'fg' || !se.c ? 'var(--fg)' : c};font-size:${se.size || 12}px;${se.bold ? 'font-weight:700' : ''}"`); break;
        case 'arrow': out += `<line x1="${sx(se.x1)}" y1="${sy(se.y1)}" x2="${sx(se.x2)}" y2="${sy(se.y2)}" style="stroke:${c}" stroke-width="${w}" marker-end="${mref(id, se.c)}" ${dash}/>`; break;
      }
    });
    out += `</g>`;
    // texts outside clip (annotations flagged noclip)
    if (legend.length && s.legend !== false) {
      const pos = s.legend || 'tr', lw = Math.max(...legend.map(l => l.label.length)) * 6.6 + 38, lh = 18, bh = legend.length * lh + 8;
      const lx = pos.includes('l') ? m.l + 8 : m.l + PW - lw - 8, ly = pos.includes('b') ? m.t + PH - bh - 8 : m.t + 8;
      out += `<rect x="${lx}" y="${ly}" width="${lw}" height="${bh}" rx="6" class="pn" style="stroke:var(--line)" opacity=".93"/>`;
      legend.forEach((l, i) => {
        const yy = ly + 13 + i * lh, c = col(l.c);
        if (l.t === 'scatter') out += `<circle cx="${lx + 14}" cy="${yy}" r="4" style="fill:${l.hollow ? 'none' : c};stroke:${c}"/>`;
        else if (l.t === 'bars' || l.t === 'band' || l.t === 'poly' || l.t === 'hband') out += `<rect x="${lx + 7}" y="${yy - 5}" width="14" height="10" style="fill:${c}" opacity=".7"/>`;
        else out += `<line x1="${lx + 5}" y1="${yy}" x2="${lx + 24}" y2="${yy}" style="stroke:${c}" stroke-width="2.5" ${l.dash ? 'stroke-dasharray="5 3"' : ''}/>`;
        out += `<text class="lbl" x="${lx + 30}" y="${yy + 4}" style="font-size:11.5px">${esc(l.label)}</text>`;
      });
    }
    return out + `</svg>`;
  };

  /* ---------------- Bar chart ---------------- */
  PL.bars = function (s) {
    const cats = s.cats, groups = s.groups || [{ vals: s.vals, c: s.c || 's1', label: s.label }];
    const W = s.w || 520, H = s.h || 300, m = { l: 56, r: s.line ? 50 : 16, t: s.title ? 30 : 14, b: 52 };
    const PW = W - m.l - m.r, PH = H - m.t - m.b;
    const all = groups.flatMap(g => g.vals); const ymax = s.ylim ? s.ylim[1] : Math.max(...all) * 1.15, ymin = s.ylim ? s.ylim[0] : Math.min(0, ...all);
    const sy = v => m.t + PH - (v - ymin) / (ymax - ymin) * PH, slot = PW / cats.length, bw = slot * 0.7 / groups.length;
    let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(s.title || 'bar chart')}">`;
    if (s.title) out += `<text class="ttl" x="${W / 2}" y="18" text-anchor="middle">${esc(s.title)}</text>`;
    ticks(ymin, ymax, 5).forEach(v => { out += `<line class="gr" x1="${m.l}" x2="${m.l + PW}" y1="${sy(v)}" y2="${sy(v)}"/><text class="tk" x="${m.l - 6}" y="${sy(v) + 4}" text-anchor="end">${fmt(v)}${s.pct ? '%' : ''}</text>`; });
    out += `<line class="ax" x1="${m.l}" x2="${m.l + PW}" y1="${sy(Math.max(0, ymin))}" y2="${sy(Math.max(0, ymin))}"/><line class="ax" x1="${m.l}" x2="${m.l}" y1="${m.t}" y2="${m.t + PH}"/>`;
    cats.forEach((cat, i) => {
      groups.forEach((g, j) => {
        const v = g.vals[i], x = m.l + slot * i + slot * 0.15 + j * bw, top = sy(Math.max(v, 0)), bot = sy(Math.min(v, 0) < ymin ? ymin : Math.min(v, 0));
        const hl = s.hl !== undefined && s.hl === i;
        out += `<rect x="${x}" y="${top}" width="${bw - 2}" height="${Math.max(0.5, bot - top)}" style="fill:${col(hl ? 's2' : g.c)};${hl ? 'stroke:var(--fg);stroke-width:2' : ''}" opacity=".88"/>`;
        if (s.values !== false) out += `<text class="tk" x="${x + bw / 2 - 1}" y="${top - 4}" text-anchor="middle">${fmt(v)}${s.pct ? '%' : ''}</text>`;
      });
      out += textLines(m.l + slot * (i + 0.5), m.t + PH + 16, cat, 'tk', 'middle', 12);
    });
    if (s.line) {
      const L = s.line, l0 = L.ylim ? L.ylim[0] : 0, l1 = L.ylim ? L.ylim[1] : 100, sy2 = v => m.t + PH - (v - l0) / (l1 - l0) * PH;
      const pts = L.vals.map((v, i) => [m.l + slot * (i + 0.5), sy2(v)]);
      out += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join('')}" fill="none" style="stroke:${col(L.c || 's4')}" stroke-width="2.5"/>`;
      pts.forEach((p, i) => out += `<circle cx="${p[0]}" cy="${p[1]}" r="4" style="fill:${col(L.c || 's4')}"/><text class="tk" x="${p[0] + 6}" y="${p[1] - 6}">${fmt(L.vals[i])}${L.pct ? '%' : ''}</text>`);
      ticks(l0, l1, 5).forEach(v => out += `<text class="tk" x="${m.l + PW + 6}" y="${sy2(v) + 4}">${fmt(v)}${L.pct ? '%' : ''}</text>`);
      if (L.ref !== undefined) out += `<line x1="${m.l}" x2="${m.l + PW}" y1="${sy2(L.ref)}" y2="${sy2(L.ref)}" style="stroke:${col('s4')}" stroke-dasharray="5 4"/><text class="tk" x="${m.l + 4}" y="${sy2(L.ref) - 4}">${esc(L.refLabel || '')}</text>`;
    }
    if (s.xlabel) out += `<text class="lbl" x="${m.l + PW / 2}" y="${H - 6}" text-anchor="middle">${esc(s.xlabel)}</text>`;
    if (s.ylabel) out += `<text class="lbl" transform="translate(14 ${m.t + PH / 2}) rotate(-90)" text-anchor="middle">${esc(s.ylabel)}</text>`;
    if (groups.length > 1 || (s.line && s.line.label)) {
      const items = groups.filter(g => g.label).map(g => [g.label, g.c]); if (s.line && s.line.label) items.push([s.line.label, s.line.c || 's4']);
      items.forEach((it, i) => out += `<rect x="${m.l + 8 + i * 150}" y="${m.t + 2}" width="12" height="10" style="fill:${col(it[1])}"/><text class="tk" x="${m.l + 24 + i * 150}" y="${m.t + 11}">${esc(it[0])}</text>`);
    }
    return out + `</svg>`;
  };

  /* ---------------- Heat map / confusion matrix ---------------- */
  PL.heat = function (s) {
    const R = s.rows.length, C = s.cols.length, cw = s.cw || 92, ch = s.ch || 46, ml = s.ml || 150, mt = (s.title ? 34 : 10) + 34;
    const W = ml + C * cw + 20, H = mt + R * ch + 30;
    const vals = s.vals.flat(), vmax = s.max !== undefined ? s.max : Math.max(...vals.map(Math.abs)), vmin = s.min !== undefined ? s.min : (s.diverging ? -vmax : 0);
    let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(s.title || 'matrix')}">`;
    if (s.title) out += `<text class="ttl" x="${W / 2}" y="18" text-anchor="middle">${esc(s.title)}</text>`;
    if (s.colTitle) out += `<text class="lbl" x="${ml + C * cw / 2}" y="${mt - 26}" text-anchor="middle" font-weight="600">${esc(s.colTitle)}</text>`;
    if (s.rowTitle) out += `<text class="lbl" transform="translate(14 ${mt + R * ch / 2}) rotate(-90)" text-anchor="middle" font-weight="600">${esc(s.rowTitle)}</text>`;
    s.cols.forEach((c, j) => out += `<text class="lbl" x="${ml + j * cw + cw / 2}" y="${mt - 8}" text-anchor="middle">${esc(c)}</text>`);
    s.rows.forEach((r, i) => {
      out += textLines(ml - 8, mt + i * ch + ch / 2, r, 'lbl', 'end', 13);
      s.cols.forEach((c, j) => {
        const v = s.vals[i][j]; let fill, a;
        if (s.diverging) { a = Math.min(1, Math.abs(v) / vmax); fill = v >= 0 ? 'var(--s1)' : 'var(--s4)'; }
        else { a = vmax === vmin ? 0 : (v - vmin) / (vmax - vmin); fill = (s.diag && i === j) ? 'var(--s3)' : 'var(--s1)'; if (s.diag && i !== j && v > 0) fill = 'var(--s4)'; }
        out += `<rect x="${ml + j * cw}" y="${mt + i * ch}" width="${cw - 2}" height="${ch - 2}" rx="4" style="fill:${fill}" fill-opacity="${0.08 + 0.72 * a}"/>`;
        out += `<text class="lbl" x="${ml + j * cw + cw / 2 - 1}" y="${mt + i * ch + ch / 2 + 4}" text-anchor="middle" font-weight="700">${esc(s.fmt ? s.fmt(v, i, j) : v)}</text>`;
      });
    });
    return out + `</svg>`;
  };

  /* ---------------- Flow / box-and-arrow diagram ---------------- */
  PL.flow = function (s) {
    const id = 'f' + (++UID), W = s.w || 640, H = s.h || 300, N = {};
    s.nodes.forEach(n => N[n.id] = Object.assign({ w: 130, h: 44 }, n));
    const cs = new Set(['axis', 'fg']); s.edges.forEach(e => cs.add(e.c || 'axis'));
    let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(s.title || 'diagram')}"><defs>${markerDefs(id, [...cs])}</defs>`;
    if (s.title) out += `<text class="ttl" x="${W / 2}" y="18" text-anchor="middle">${esc(s.title)}</text>`;
    const edgePt = (n, tx, ty) => { // point on node boundary toward (tx,ty)
      const dx = tx - n.x, dy = ty - n.y; if (dx === 0 && dy === 0) return [n.x, n.y];
      if (n.shape === 'ellipse' || n.shape === 'circle') { const a = n.w / 2, b = n.h / 2, t = 1 / Math.sqrt(dx * dx / (a * a) + dy * dy / (b * b)); return [n.x + dx * t, n.y + dy * t]; }
      const sx = (n.w / 2) / Math.abs(dx || 1e-9), sy = (n.h / 2) / Math.abs(dy || 1e-9), t = Math.min(sx, sy); return [n.x + dx * t, n.y + dy * t];
    };
    (s.edges || []).forEach(e => {
      const a = N[e.a], b = N[e.b], c = e.c || 'axis', dash = e.dash ? 'stroke-dasharray="6 4"' : '';
      if (e.via) { // polyline through via points
        const pts = [[a.x, a.y], ...e.via, [b.x, b.y]]; const p0 = edgePt(a, pts[1][0], pts[1][1]), pn = edgePt(b, pts[pts.length - 2][0], pts[pts.length - 2][1]);
        const all = [p0, ...e.via, pn]; out += `<path d="${all.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join('')}" fill="none" style="stroke:${col(c)}" stroke-width="1.8" ${dash} marker-end="${mref(id, c)}"/>`;
        if (e.t) { const mid = e.via[Math.floor(e.via.length / 2)]; out += textLines(mid[0] + (e.dx || 0), mid[1] + (e.dy || -9), e.t, 'tk', 'middle', 12); }
      } else {
        const p = edgePt(a, b.x, b.y), q = edgePt(b, a.x, a.y);
        if (e.bend) { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, nx = -(q[1] - p[1]), ny = q[0] - p[0], L = Math.hypot(nx, ny) || 1, cx = mx + nx / L * e.bend, cy = my + ny / L * e.bend; out += `<path d="M${p[0]},${p[1]} Q${cx},${cy} ${q[0]},${q[1]}" fill="none" style="stroke:${col(c)}" stroke-width="1.8" ${dash} marker-end="${mref(id, c)}"/>`; if (e.t) out += textLines(cx, cy, e.t, 'tk', 'middle', 12); }
        else { out += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" style="stroke:${col(c)}" stroke-width="1.8" ${dash} marker-end="${mref(id, c)}"/>`; if (e.t) out += textLines((p[0] + q[0]) / 2 + (e.dx || 0), (p[1] + q[1]) / 2 + (e.dy || -9), e.t, 'tk', 'middle', 12); }
      }
    });
    Object.values(N).forEach(n => {
      const c = n.c ? col(n.c) : 'var(--accent)', x = n.x - n.w / 2, y = n.y - n.h / 2;
      if (n.shape === 'diamond') out += `<path d="M${n.x},${y} L${x + n.w},${n.y} L${n.x},${y + n.h} L${x},${n.y} z" class="pn" style="stroke:${c}" stroke-width="1.8"/>`;
      else if (n.shape === 'ellipse' || n.shape === 'circle') out += `<ellipse cx="${n.x}" cy="${n.y}" rx="${n.w / 2}" ry="${n.h / 2}" class="pn" style="stroke:${c}" stroke-width="1.8"/>`;
      else if (n.shape === 'text') { }
      else out += `<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" rx="${n.shape === 'round' ? n.h / 2 : 8}" style="fill:${c};stroke:${c}" fill-opacity="${n.fill || 0.12}" stroke-width="1.8"/>`;
      out += textLines(n.x, n.y, n.t, 'lbl', 'middle', 14, n.bold ? 'font-weight="700"' : '');
    });
    (s.texts || []).forEach(t => out += textLines(t.x, t.y, t.s, 'tk', t.anchor || 'middle', 12, t.c ? `style="fill:${col(t.c)};font-size:${t.size || 12}px"` : ''));
    return out + `</svg>`;
  };

  /* ---------------- 3-D wireframe surface / scatter ---------------- */
  const VIR = ['#440154', '#46327e', '#365c8d', '#277f8e', '#1fa187', '#4ac16d', '#a0da39', '#fde725'];
  PL.surface = function (s) {
    const W = s.w || 520, H = s.h || 360, az = (s.az !== undefined ? s.az : -40) * Math.PI / 180, el = (s.el !== undefined ? s.el : 28) * Math.PI / 180;
    const [xa, xb] = s.xr, [ya, yb] = s.yr, n = s.n || 22;
    const zs = []; if (s.f) for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) zs.push(s.f(xa + (xb - xa) * i / n, ya + (yb - ya) * j / n));
    (s.pts || []).forEach(p => zs.push(p[2])); (s.planes || []).forEach(pl => [[xa, ya], [xa, yb], [xb, ya], [xb, yb]].forEach(q => zs.push(pl.f(q[0], q[1]))));
    const za = s.zr ? s.zr[0] : Math.min(...zs), zb = s.zr ? s.zr[1] : Math.max(...zs);
    const P = (x, y, z) => { const u = 2 * (x - xa) / (xb - xa) - 1, v = 2 * (y - ya) / (yb - ya) - 1, w = 2 * (z - za) / ((zb - za) || 1) - 1;
      const X = u * Math.cos(az) - v * Math.sin(az), Y = u * Math.sin(az) + v * Math.cos(az); const sx = X, sy = w * Math.cos(el) + Y * Math.sin(el);
      return [W / 2 + sx * W * 0.32, H * 0.52 - sy * H * 0.33]; };
    let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(s.title || '3D plot')}">`;
    if (s.title) out += `<text class="ttl" x="${W / 2}" y="18" text-anchor="middle">${esc(s.title)}</text>`;
    // floor box
    const fl = [[xa, ya], [xb, ya], [xb, yb], [xa, yb]].map(q => P(q[0], q[1], za));
    out += `<path d="${fl.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join('')}z" class="pn2" style="stroke:var(--grid)"/>`;
    const ax = (a, b, lbl, tx) => { const p = P(...a), q = P(...b); out += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" class="ax" stroke-width="1.3"/>`; if (lbl) out += `<text class="lbl" x="${q[0] + (tx || 0)}" y="${q[1] + 14}" text-anchor="middle">${esc(lbl)}</text>`; };
    ax([xa, ya, za], [xb, ya, za], s.xl || 'x'); ax([xa, ya, za], [xa, yb, za], s.yl || 'y'); ax([xa, ya, za], [xa, ya, zb], s.zl || 'z', -14);
    if (s.f) {
      const color = z => VIR[Math.min(VIR.length - 1, Math.max(0, Math.floor((z - za) / ((zb - za) || 1) * VIR.length)))];
      for (let i = 0; i <= n; i++) { // lines of constant x and constant y, drawn as short coloured segments
        for (let j = 0; j < n; j++) {
          const x = xa + (xb - xa) * i / n, y1 = ya + (yb - ya) * j / n, y2 = ya + (yb - ya) * (j + 1) / n, z1 = s.f(x, y1), z2 = s.f(x, y2);
          const p = P(x, y1, z1), q = P(x, y2, z2); out += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${color((z1 + z2) / 2)}" stroke-width="1.1"/>`;
          const y = ya + (yb - ya) * i / n, x1 = xa + (xb - xa) * j / n, x2 = xa + (xb - xa) * (j + 1) / n, w1 = s.f(x1, y), w2 = s.f(x2, y);
          const r = P(x1, y, w1), t = P(x2, y, w2); out += `<line x1="${r[0].toFixed(1)}" y1="${r[1].toFixed(1)}" x2="${t[0].toFixed(1)}" y2="${t[1].toFixed(1)}" stroke="${color((w1 + w2) / 2)}" stroke-width="1.1"/>`;
        }
      }
    }
    (s.planes || []).forEach(pl => { const cs = [[xa, ya], [xb, ya], [xb, yb], [xa, yb]].map(q => P(q[0], q[1], pl.f(q[0], q[1]))); out += `<path d="${cs.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join('')}z" style="fill:${col(pl.c)};stroke:${col(pl.c)}" fill-opacity=".22" stroke-width="1.5"/>`; });
    (s.pts || []).forEach(p => { const a = P(p[0], p[1], p[2]), b = P(p[0], p[1], za); out += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:var(--muted)" stroke-dasharray="2 3"/><circle cx="${a[0]}" cy="${a[1]}" r="5" style="fill:var(--s1)"/>${p[3] ? `<text class="tk" x="${a[0] + 7}" y="${a[1] - 6}">${esc(p[3])}</text>` : ''}`; });
    (s.paths || []).forEach(pa => { const pts = pa.pts.map(p => P(p[0], p[1], p[2])); out += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join('')}" fill="none" style="stroke:${col(pa.c || 's4')}" stroke-width="2.5"/>`; pts.forEach(p => out += `<circle cx="${p[0]}" cy="${p[1]}" r="3" style="fill:${col(pa.c || 's4')}"/>`); });
    return out + `</svg>`;
  };

  /* ---------------- Ready-made diagrams ---------------- */
  PL.dartboards = function () {
    const cases = [['Low bias,', 'low variance', 0, 0, 0.12], ['Low bias,', 'high variance', 0, 0, 0.62], ['High bias,', 'low variance', 0.55, 0.45, 0.1], ['High bias,', 'high variance', 0.45, 0.4, 0.55]];
    const rnd = NUM.rng(7); let out = `<svg viewBox="0 0 640 210" width="640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="dartboards">`;
    cases.forEach((c, k) => {
      const cx = 80 + k * 160, cy = 92; [70, 52, 34, 16].forEach((r, i) => out += `<circle cx="${cx}" cy="${cy}" r="${r}" class="${i % 2 ? 'pn2' : 'pn'}" style="stroke:var(--axis)"/>`);
      out += `<circle cx="${cx}" cy="${cy}" r="5" class="fg"/>`;
      for (let i = 0; i < 9; i++) { const dx = (c[2] + c[4] * NUM.gauss(rnd)) * 55, dy = (c[3] + c[4] * NUM.gauss(rnd)) * 55; out += `<circle cx="${cx + dx}" cy="${cy - dy}" r="3.6" style="fill:var(--s2);stroke:var(--fg)" stroke-width=".6"/>`; }
      out += `<text class="lbl" x="${cx}" y="182" text-anchor="middle" font-weight="600">${c[0]}</text><text class="lbl" x="${cx}" y="198" text-anchor="middle" font-weight="600">${c[1]}</text>`;
    });
    return out + `</svg>`;
  };
  PL.nested = function (labels, sub) { // concentric ellipses e.g. AI ⊃ ML ⊃ DL
    const W = 420, H = 260; let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="nested sets">`;
    const cs = ['s1', 's5', 's2', 's3'];
    labels.forEach((l, i) => { const rx = 200 - i * 52, ry = 122 - i * 32, cy = 130 + i * 22; out += `<ellipse cx="210" cy="${cy}" rx="${rx}" ry="${ry}" style="fill:${col(cs[i])};stroke:${col(cs[i])}" fill-opacity=".13" stroke-width="2"/><text class="lbl" x="210" y="${cy - ry + 20}" text-anchor="middle" font-weight="700">${esc(l)}</text>`; if (sub && sub[i]) out += `<text class="tk" x="210" y="${cy - ry + 36}" text-anchor="middle">${esc(sub[i])}</text>`; });
    return out + `</svg>`;
  };
  PL.nn = function (layers, names) { // simple fully-connected network drawing
    const W = 460, H = 230, gx = W / (layers.length + 1); let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="neural network">`;
    const pos = layers.map((n, l) => Array.from({ length: n }, (_, i) => [gx * (l + 1), (H - 30) / (n + 1) * (i + 1) + 10]));
    for (let l = 0; l < layers.length - 1; l++) pos[l].forEach(a => pos[l + 1].forEach(b => out += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:var(--grid)" stroke-width="1"/>`));
    pos.forEach((L, l) => L.forEach(p => out += `<circle cx="${p[0]}" cy="${p[1]}" r="10" style="fill:${col(l === 0 ? 's1' : l === layers.length - 1 ? 's3' : 's5')}" fill-opacity=".85"/>`));
    (names || []).forEach((t, l) => out += `<text class="tk" x="${gx * (l + 1)}" y="${H - 6}" text-anchor="middle">${esc(t)}</text>`);
    return out + `</svg>`;
  };

  /* ---------------- dispatcher ---------------- */
  PL.svgOf = function (spec) {
    switch (spec.type) {
      case 'xy': return PL.xy(spec);
      case 'bars': return PL.bars(spec);
      case 'heat': return PL.heat(spec);
      case 'flow': return PL.flow(spec);
      case 'surface': return PL.surface(spec);
      case 'svg': return typeof spec.svg === 'function' ? spec.svg() : spec.svg;
      case 'multi': return `<div class="multi">${spec.panels.map(p => `<div>${PL.svgOf(p)}</div>`).join('')}</div>`;
      default: return `<em>unknown plot type ${esc(spec.type)}</em>`;
    }
  };
  window.PL = PL;
})();
