// Nations by Numbers — small SVG chart helpers (no libraries, no network).
// Every chart is plain inline SVG built from the numbers passed in, so the
// page works with JavaScript only and nothing is fetched at run time.

const BAR = '#0f766e';
const BAR_SOFT = '#99d5cf';
const HIGHLIGHT = '#b45309';
const GRID = '#e3ddd0';
const INK = '#26332f';

function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function fmtNumber(value, decimals = 0) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtMoneyBillions(value) {
  return '$' + fmtNumber(value) + 'bn';
}

export function fmtMoney(value) {
  return '$' + fmtNumber(value);
}

// Horizontal ranked bar chart. rows: [{ label, value, display, highlight? }]
export function rankedBars(rows, { width = 640, rowHeight = 30, labelWidth = 150, max = null } = {}) {
  const top = max === null ? Math.max(...rows.map((r) => r.value)) : max;
  const height = rows.length * rowHeight + 8;
  const plotWidth = width - labelWidth - 90;
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Ranked bar chart">`;
  rows.forEach((row, i) => {
    const y = i * rowHeight + 8;
    const barWidth = Math.max(2, (row.value / top) * plotWidth);
    const fill = row.highlight ? HIGHLIGHT : BAR;
    out += `<g>
      <text x="0" y="${y + 15}" font-size="13" fill="${INK}">${escapeText(row.label)}</text>
      <rect x="${labelWidth}" y="${y + 3}" width="${barWidth}" height="16" rx="3" fill="${fill}"></rect>
      <text x="${labelWidth + barWidth + 8}" y="${y + 16}" font-size="12" fill="${INK}">${escapeText(row.display)}</text>
    </g>`;
  });
  out += '</svg>';
  return out;
}

// Grouped vertical bars: one bar per entry, with a value label on top.
// entries: [{ label, value, display, highlight? }]
export function columnChart(entries, { width = 640, height = 220, max = null } = {}) {
  const top = max === null ? Math.max(...entries.map((e) => e.value)) : max;
  const floor = height - 34;
  const slot = width / entries.length;
  const barWidth = Math.min(64, slot * 0.6);
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Column chart">`;
  out += `<line x1="0" y1="${floor}" x2="${width}" y2="${floor}" stroke="${GRID}" stroke-width="1"></line>`;
  entries.forEach((entry, i) => {
    const barHeight = Math.max(2, ((entry.value / top) * (floor - 44)));
    const x = i * slot + (slot - barWidth) / 2;
    const y = floor - barHeight;
    const fill = entry.highlight ? HIGHLIGHT : (i % 2 ? BAR_SOFT : BAR);
    out += `<g>
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth}" height="${barHeight.toFixed(1)}" rx="3" fill="${fill}"></rect>
      <text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" font-size="12" text-anchor="middle" fill="${INK}">${escapeText(entry.display)}</text>
      <text x="${(x + barWidth / 2).toFixed(1)}" y="${floor + 18}" font-size="12" text-anchor="middle" fill="${INK}">${escapeText(entry.label)}</text>
    </g>`;
  });
  out += '</svg>';
  return out;
}

// A single indicator gauge: value on a 0..scale track with a marker.
// The viewBox is wide (640 units) so the label text stays small when the
// SVG stretches to fill its panel.
export function gauge(value, scale, display) {
  const pct = Math.max(0, Math.min(100, (value / scale) * 100));
  const x = (pct / 100) * 640;
  return `<svg viewBox="0 0 640 46" width="100%" role="img" aria-label="Gauge: ${escapeText(display)}">
    <rect x="0" y="10" width="640" height="10" rx="5" fill="${GRID}"></rect>
    <rect x="0" y="10" width="${x.toFixed(1)}" height="10" rx="5" fill="${BAR}"></rect>
    <circle cx="${x.toFixed(1)}" cy="15" r="8" fill="${HIGHLIGHT}" stroke="#fff" stroke-width="2"></circle>
    <text x="0" y="42" font-size="14" fill="${INK}">${escapeText(display)}</text>
  </svg>`;
}
