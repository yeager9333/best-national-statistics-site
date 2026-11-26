// Nations by Numbers — pages and hash router.
// Every view is rendered from the dataset in data.js; every link and
// control on a page does what it says (search, sort, filter, compare).

import {
  COUNTRIES, WORLD_TOTALS, VINTAGE, SOURCE_LIST,
  findCountry, gdpPerCapita, peoplePerKm2, indicatorValue,
  topCountries, rankAmong, regions, worldMedian,
} from './data.js';
import { rankedBars, columnChart, gauge, fmtNumber, fmtMoney, fmtMoneyBillions } from './charts.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('.topnav a')];

export const INDICATORS = [
  { key: 'pop', label: 'Population', unit: 'million people', format: (c) => fmtNumber(c.pop, 1) + 'm', scale: 1500 },
  { key: 'gdp', label: 'GDP', unit: 'current US$ billions', format: (c) => fmtMoneyBillions(c.gdp), scale: 30000 },
  { key: 'gdppc', label: 'GDP per capita', unit: 'current US$', format: (c) => fmtMoney(gdpPerCapita(c)), scale: 100000 },
  { key: 'life', label: 'Life expectancy', unit: 'years at birth', format: (c) => fmtNumber(c.life, 1) + ' yrs', scale: 90 },
  { key: 'density', label: 'Population density', unit: 'people per km²', format: (c) => fmtNumber(peoplePerKm2(c), 1) + '/km²', scale: 8000 },
  { key: 'age', label: 'Median age', unit: 'years', format: (c) => fmtNumber(c.age, 1) + ' yrs', scale: 55 },
  { key: 'urban', label: 'Urban share', unit: '% of population', format: (c) => fmtNumber(c.urban, 1) + '%', scale: 100 },
  { key: 'children', label: 'Fertility rate', unit: 'children per woman', format: (c) => fmtNumber(c.children, 1), scale: 6 },
];

function indicator(key) {
  return INDICATORS.find((i) => i.key === key) || INDICATORS[0];
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sourceLine() {
  return `<p class="fine">Figures for ${VINTAGE}. Sources: World Bank World Development Indicators ${VINTAGE}; UN World Population Prospects ${VINTAGE} (medium variant). <a href="#/about">Sources &amp; method</a></p>`;
}

function markActive(section) {
  navLinks.forEach((a) => a.classList.toggle('active', a.dataset.nav === section));
}

// ---------- Overview ----------

function viewHome() {
  markActive('home');
  const topPop = topCountries('pop', 10);
  const topGdp = topCountries('gdp', 10);
  const topLife = topCountries('life', 5);
  const covered = COUNTRIES.reduce((sum, c) => sum + c.pop, 0);
  const coveredPct = Math.round((covered / WORLD_TOTALS.population) * 100);
  app.innerHTML = `
    <p class="eyebrow">World at a glance · ${VINTAGE}</p>
    <h1>How the world measures up</h1>
    <p class="lede">Thirty countries, one honest table of numbers: population, GDP, life
    expectancy, land, cities and age. Every figure is sourced and dated — start
    with the world, then drill into any country.</p>

    <div class="stat-grid">
      <div class="stat-card"><div class="num">${fmtNumber(WORLD_TOTALS.population)}m</div><div class="lbl">World population, ${VINTAGE}</div><div class="src">UN World Population Prospects</div></div>
      <div class="stat-card"><div class="num">$${fmtNumber(WORLD_TOTALS.gdp)}bn</div><div class="lbl">World GDP, current US$</div><div class="src">World Bank WDI ${VINTAGE}</div></div>
      <div class="stat-card"><div class="num">${fmtNumber(WORLD_TOTALS.lifeExpectancy, 1)} yrs</div><div class="lbl">World life expectancy at birth</div><div class="src">World Bank WDI ${VINTAGE}</div></div>
      <div class="stat-card"><div class="num">${coveredPct}%</div><div class="lbl">Of world population covered by these 30 countries</div><div class="src">${fmtNumber(covered, 1)}m people in the table</div></div>
    </div>

    <div class="two-col">
      <section class="panel">
        <h2>Largest populations</h2>
        ${rankedBars(topPop.map((c) => ({ label: c.name, value: c.pop, display: fmtNumber(c.pop, 1) + 'm' })))}
        <p class="chart-note">India passed China as the world's most populous country in 2023. Figures: UN WPP ${VINTAGE}.</p>
        <p><a href="#/rankings">See all rankings →</a></p>
      </section>
      <section class="panel">
        <h2>Largest economies</h2>
        ${rankedBars(topGdp.map((c) => ({ label: c.name, value: c.gdp, display: fmtMoneyBillions(c.gdp) })))}
        <p class="chart-note">GDP in current US dollars. Figures: World Bank WDI ${VINTAGE}.</p>
        <p><a href="#/countries">Browse the full table →</a></p>
      </section>
    </div>

    <section class="panel">
      <h2>Longest lives</h2>
      ${columnChart(topLife.map((c) => ({ label: c.name, value: c.life, display: fmtNumber(c.life, 1) })))}
      <p class="chart-note">Life expectancy at birth, years. Singapore, Switzerland and Japan lead the 30; the world average is ${fmtNumber(WORLD_TOTALS.lifeExpectancy, 1)} years.</p>
    </section>

    <div class="btnrow">
      <a class="btn" href="#/countries">Explore all 30 countries</a>
      <a class="btn ghost" href="#/compare">Compare three countries</a>
      <a class="btn ghost" href="#/about">How the numbers are made</a>
    </div>
    ${sourceLine()}`;
}

// ---------- Countries table ----------

let tableState = { query: '', region: 'all', sortKey: 'pop', sortDir: -1 };

const TABLE_COLUMNS = [
  { key: 'name', label: 'Country' },
  { key: 'region', label: 'Region' },
  { key: 'pop', label: 'Population (m)' },
  { key: 'gdp', label: 'GDP ($bn)' },
  { key: 'gdppc', label: 'GDP per capita ($)' },
  { key: 'life', label: 'Life exp. (yrs)' },
  { key: 'density', label: 'Density (/km²)' },
  { key: 'urban', label: 'Urban (%)' },
];

function filteredCountries() {
  const q = tableState.query.trim().toLowerCase();
  let rows = COUNTRIES.filter((c) => {
    const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q) || c.region.toLowerCase().includes(q);
    const matchesRegion = tableState.region === 'all' || c.region === tableState.region;
    return matchesQuery && matchesRegion;
  });
  const dir = tableState.sortDir;
  rows = [...rows].sort((a, b) => {
    const va = indicatorValue(a, tableState.sortKey);
    const vb = indicatorValue(b, tableState.sortKey);
    if (typeof va === 'string') return dir * va.localeCompare(vb);
    return dir * (va - vb);
  });
  return rows;
}

function renderTableBody() {
  const rows = filteredCountries();
  const body = document.getElementById('country-rows');
  const count = document.getElementById('result-count');
  if (count) count.textContent = `${rows.length} of ${COUNTRIES.length} countries`;
  if (!body) return;
  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="8" class="empty">No countries match that search. Try a different name, capital or region.</td></tr>`;
    return;
  }
  body.innerHTML = rows.map((c) => `
    <tr>
      <td><a href="#/country/${c.code}">${esc(c.name)}</a></td>
      <td>${esc(c.region)}</td>
      <td class="num">${fmtNumber(c.pop, 1)}</td>
      <td class="num">${fmtNumber(c.gdp)}</td>
      <td class="num">${fmtNumber(gdpPerCapita(c))}</td>
      <td class="num">${fmtNumber(c.life, 1)}</td>
      <td class="num">${fmtNumber(peoplePerKm2(c), 1)}</td>
      <td class="num">${fmtNumber(c.urban, 1)}</td>
    </tr>`).join('');
}

function viewCountries() {
  markActive('countries');
  const regionOptions = regions().map((r) => `<option value="${esc(r)}" ${tableState.region === r ? 'selected' : ''}>${esc(r)}</option>`).join('');
  app.innerHTML = `
    <p class="eyebrow">All countries · ${VINTAGE}</p>
    <h1>Countries A–Z, by the numbers</h1>
    <p class="lede">Search by name, capital or region, filter by region, and click any
    column heading to sort. Click a country name for its full profile.</p>
    <div class="toolbar">
      <input type="search" id="country-search" placeholder="Search countries, capitals, regions…" value="${esc(tableState.query)}" aria-label="Search countries">
      <select id="region-filter" aria-label="Filter by region">
        <option value="all" ${tableState.region === 'all' ? 'selected' : ''}>All regions</option>
        ${regionOptions}
      </select>
      <span class="count" id="result-count"></span>
    </div>
    <div class="table-wrap">
      <table class="data">
        <thead><tr>${TABLE_COLUMNS.map((col) => {
          const arrow = tableState.sortKey === col.key ? (tableState.sortDir === 1 ? ' ▲' : ' ▼') : '';
          return `<th><button data-sort="${col.key}">${col.label}${arrow}</button></th>`;
        }).join('')}</tr></thead>
        <tbody id="country-rows"></tbody>
      </table>
    </div>
    ${sourceLine()}`;
  renderTableBody();
  const search = document.getElementById('country-search');
  search.addEventListener('input', () => { tableState.query = search.value; renderTableBody(); });
  document.getElementById('region-filter').addEventListener('change', (e) => {
    tableState.region = e.target.value; renderTableBody();
  });
  app.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (tableState.sortKey === key) tableState.sortDir *= -1;
      else { tableState.sortKey = key; tableState.sortDir = key === 'name' || key === 'region' ? 1 : -1; }
      viewCountries();
      const after = document.getElementById('country-search');
      if (after) { after.focus(); after.setSelectionRange(after.value.length, after.value.length); }
    });
  });
}

// ---------- Country profile ----------

function viewCountry(code) {
  const country = findCountry(code);
  if (!country) {
    markActive('countries');
    app.innerHTML = `
      <p class="eyebrow">Not found</p>
      <h1>No country with that code</h1>
      <p class="lede">We only cover 30 countries in this edition. Pick one from the table instead.</p>
      <div class="btnrow"><a class="btn" href="#/countries">Back to the table</a></div>`;
    return;
  }
  markActive('countries');
  const peers = topCountries('pop', 10).some((c) => c.code === country.code);
  const regionPeers = COUNTRIES.filter((c) => c.region === country.region)
    .sort((a, b) => b.pop - a.pop);
  const others = COUNTRIES.filter((c) => c.code !== country.code)
    .sort((a, b) => Math.abs(a.pop - country.pop) - Math.abs(b.pop - country.pop))
    .slice(0, 3);
  app.innerHTML = `
    <p class="eyebrow">${esc(country.region)} · ${VINTAGE}</p>
    <h1>${esc(country.name)}</h1>
    <p class="lede">Capital ${esc(country.capital)} · Languages: ${esc(country.languages)} ·
    ranked #${rankAmong(country, 'pop')} of ${COUNTRIES.length} by population and
    #${rankAmong(country, 'gdppc')} by GDP per capita in this edition.</p>

    <div class="stat-grid">
      <div class="stat-card"><div class="num">${fmtNumber(country.pop, 1)}m</div><div class="lbl">Population (#${rankAmong(country, 'pop')} of ${COUNTRIES.length})</div><div class="src">UN WPP ${VINTAGE}</div></div>
      <div class="stat-card"><div class="num">${fmtMoneyBillions(country.gdp)}</div><div class="lbl">GDP, current US$ (#${rankAmong(country, 'gdp')})</div><div class="src">World Bank WDI ${VINTAGE}</div></div>
      <div class="stat-card"><div class="num">${fmtMoney(gdpPerCapita(country))}</div><div class="lbl">GDP per capita (#${rankAmong(country, 'gdppc')})</div><div class="src">Computed from GDP and population</div></div>
      <div class="stat-card"><div class="num">${fmtNumber(country.life, 1)} yrs</div><div class="lbl">Life expectancy at birth (#${rankAmong(country, 'life')})</div><div class="src">World Bank WDI ${VINTAGE}</div></div>
    </div>

    <div class="two-col">
      <section class="panel">
        <h2>Where ${esc(country.name)} stands</h2>
        <p>Population density: <strong>${fmtNumber(peoplePerKm2(country), 1)} people per km²</strong>
        (rank #${rankAmong(country, 'density')} of ${COUNTRIES.length}). Land area:
        <strong>${fmtNumber(country.area)} km²</strong>.</p>
        <p>Median age <strong>${fmtNumber(country.age, 1)} years</strong> — the median across
        these 30 countries is ${fmtNumber(worldMedian('age'), 1)} — and
        <strong>${fmtNumber(country.urban, 1)}%</strong> of people live in cities, against a world
        average of ${WORLD_TOTALS.urbanShare}%.</p>
        <p>Fertility: <strong>${fmtNumber(country.children, 1)} children per woman</strong>
        (world average ${fmtNumber(WORLD_TOTALS.fertility, 1)}).</p>
        <dl class="kv">
          <dt>Capital</dt><dd>${esc(country.capital)}</dd>
          <dt>Region</dt><dd>${esc(country.region)}</dd>
          <dt>Land area</dt><dd>${fmtNumber(country.area)} km²</dd>
          <dt>Languages</dt><dd>${esc(country.languages)}</dd>
        </dl>
      </section>
      <section class="panel">
        <h2>Life expectancy and urban life</h2>
        ${gauge(country.life, 90, 'Life expectancy: ' + fmtNumber(country.life, 1) + ' of 90 years')}
        ${gauge(country.urban, 100, 'Urban share: ' + fmtNumber(country.urban, 1) + '% of population')}
        ${gauge(country.age, 55, 'Median age: ' + fmtNumber(country.age, 1) + ' of 55 years')}
        <p class="chart-note">Gauges show the country's value on a fixed scale, so countries can be compared at a glance.</p>
      </section>
    </div>

    <section class="panel">
      <h2>Population in ${esc(country.region)}</h2>
      ${rankedBars(regionPeers.map((c) => ({
        label: c.name, value: c.pop, display: fmtNumber(c.pop, 1) + 'm',
        highlight: c.code === country.code,
      })))}
      <p class="chart-note">${esc(country.name)} is highlighted. Figures: UN WPP ${VINTAGE}.</p>
    </section>

    <section class="panel">
      <h2>Similar-sized countries</h2>
      <p>Countries closest to ${esc(country.name)} by population:</p>
      <p>${others.map((c) => `<a href="#/country/${c.code}">${esc(c.name)}</a> (${fmtNumber(c.pop, 1)}m)`).join(' · ')}</p>
      <div class="btnrow">
        <a class="btn" href="#/compare?a=${country.code}">Compare ${esc(country.name)} with others</a>
        <a class="btn ghost" href="#/countries">Back to all countries</a>
      </div>
    </section>
    ${sourceLine()}`;
  void peers;
}

// ---------- Compare ----------

function compareOptions(selected) {
  return COUNTRIES.map((c) => `<option value="${c.code}" ${c.code === selected ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
}

function viewCompare(params) {
  markActive('compare');
  const picks = [
    params.get('a') || 'usa',
    params.get('b') || 'chn',
    params.get('c') || 'ind',
  ].map((code) => findCountry(code) || COUNTRIES[0]);
  const maxPop = Math.max(...picks.map((c) => c.pop));
  const maxGdp = Math.max(...picks.map((c) => c.gdp));
  const maxGdppc = Math.max(...picks.map((c) => gdpPerCapita(c)));

  function card(country, index, key) {
    return `
    <div class="compare-card">
      <h3>${esc(country.name)}</h3>
      <p class="fine">${esc(country.region)} · capital ${esc(country.capital)}</p>
      <label>Country ${index}
        <select data-pick="${key}">${compareOptions(country.code)}</select>
      </label>
      <div class="cmp-row"><span class="k">Population</span><span class="v">${fmtNumber(country.pop, 1)}m</span></div>
      <div class="mini-bar"><span style="width:${Math.round((country.pop / maxPop) * 100)}%"></span></div>
      <div class="cmp-row"><span class="k">GDP</span><span class="v">${fmtMoneyBillions(country.gdp)}</span></div>
      <div class="mini-bar"><span style="width:${Math.round((country.gdp / maxGdp) * 100)}%"></span></div>
      <div class="cmp-row"><span class="k">GDP per capita</span><span class="v">${fmtMoney(gdpPerCapita(country))}</span></div>
      <div class="mini-bar"><span style="width:${Math.round((gdpPerCapita(country) / maxGdppc) * 100)}%"></span></div>
      <div class="cmp-row"><span class="k">Life expectancy</span><span class="v">${fmtNumber(country.life, 1)} yrs</span></div>
      <div class="cmp-row"><span class="k">Density</span><span class="v">${fmtNumber(peoplePerKm2(country), 1)}/km²</span></div>
      <div class="cmp-row"><span class="k">Median age</span><span class="v">${fmtNumber(country.age, 1)} yrs</span></div>
      <div class="cmp-row"><span class="k">Urban share</span><span class="v">${fmtNumber(country.urban, 1)}%</span></div>
      <div class="cmp-row"><span class="k">Fertility</span><span class="v">${fmtNumber(country.children, 1)}</span></div>
      <p><a href="#/country/${country.code}">Full profile →</a></p>
    </div>`;
  }

  app.innerHTML = `
    <p class="eyebrow">Side by side · ${VINTAGE}</p>
    <h1>Compare up to three countries</h1>
    <p class="lede">Pick any three of the 30 countries. Bars are scaled to the largest
    value among your three picks, so the longest bar always wins that row.</p>
    <div class="compare-grid">
      ${card(picks[0], 1, 'a')}
      ${card(picks[1], 2, 'b')}
      ${card(picks[2], 3, 'c')}
    </div>
    <div class="btnrow">
      <a class="btn ghost" href="#/compare?a=jpn&amp;b=kor&amp;c=sgp">Try: Japan · Korea · Singapore</a>
      <a class="btn ghost" href="#/compare?a=nga&amp;b=eth&amp;c=cod">Try: Nigeria · Ethiopia · DR Congo</a>
    </div>
    ${sourceLine()}`;

  app.querySelectorAll('[data-pick]').forEach((select) => {
    select.addEventListener('change', () => {
      const next = new URLSearchParams();
      next.set('a', document.querySelector('[data-pick="a"]').value);
      next.set('b', document.querySelector('[data-pick="b"]').value);
      next.set('c', document.querySelector('[data-pick="c"]').value);
      location.hash = '#/compare?' + next.toString();
    });
  });
}

// ---------- Rankings ----------

let rankingKey = 'pop';

function viewRankings() {
  markActive('rankings');
  const ind = indicator(rankingKey);
  const rows = topCountries(rankingKey, 10);
  app.innerHTML = `
    <p class="eyebrow">Top 10 · ${VINTAGE}</p>
    <h1>Rankings</h1>
    <p class="lede">The top 10 of 30 countries on each indicator. Switch indicators to
    re-rank the whole table — the chart, the ranks and the figures all update.</p>
    <div class="tabs" role="group" aria-label="Choose indicator">
      ${INDICATORS.map((i) => `<button data-ind="${i.key}" aria-pressed="${i.key === rankingKey}">${i.label}</button>`).join('')}
    </div>
    <section class="panel">
      <h2>Top 10 by ${ind.label} <span class="pill">${ind.unit}</span></h2>
      ${rankedBars(rows.map((c, i) => ({
        label: '#' + (i + 1) + ' ' + c.name,
        value: indicatorValue(c, rankingKey),
        display: ind.format(c),
        highlight: i === 0,
      })))}
      <p class="chart-note">${ind.label} (${ind.unit}), ${VINTAGE}. The leader is highlighted in amber. Full figures for every country are in the <a href="#/countries">countries table</a>.</p>
    </section>
    <section class="panel">
      <h2>All 30, ranked by ${ind.label}</h2>
      <p>${[...COUNTRIES].sort((a, b) => indicatorValue(b, rankingKey) - indicatorValue(a, rankingKey)).map((c, i) => `<span class="rank-badge">#${i + 1}</span><a href="#/country/${c.code}">${esc(c.name)}</a> — ${ind.format(c)}`).join('<br>')}</p>
    </section>
    ${sourceLine()}`;
  app.querySelectorAll('[data-ind]').forEach((btn) => {
    btn.addEventListener('click', () => { rankingKey = btn.dataset.ind; viewRankings(); });
  });
}

// ---------- Sources & method ----------

function viewAbout() {
  markActive('about');
  app.innerHTML = `
    <p class="eyebrow">Sources &amp; method</p>
    <h1>Where every number comes from</h1>
    <p class="lede">Nations by Numbers covers 30 countries with 2024 figures from two
    public sources. Nothing on this site is estimated by us, and nothing is
    fetched from the network — every figure is baked into the site's own files.</p>

    <section class="panel">
      <h2>Sources</h2>
      <ul class="src-list">
        ${SOURCE_LIST.map((s) => `<li><strong>${esc(s.name)}</strong> — ${esc(s.covers)}.</li>`).join('')}
      </ul>
      <p>World totals shown on the overview (8,162 million people, $111,326 billion
      GDP, 73.3 years life expectancy) are the World Bank / UN world aggregates for ${VINTAGE}.</p>
    </section>

    <section class="panel">
      <h2>Method</h2>
      <ul class="src-list">
        <li><strong>Population</strong> is the mid-year ${VINTAGE} estimate, in millions.</li>
        <li><strong>GDP</strong> is in current US dollars, in billions. <strong>GDP per capita</strong> is GDP divided by population, rounded to the nearest dollar.</li>
        <li><strong>Life expectancy</strong> is life expectancy at birth, in years.</li>
        <li><strong>Population density</strong> is population divided by land area, in people per km².</li>
        <li><strong>Urban share</strong> is the percentage of the population living in urban areas.</li>
        <li><strong>Median age</strong> and <strong>fertility</strong> (children per woman) come from UN World Population Prospects ${VINTAGE}, medium variant.</li>
        <li>Figures are rounded for readability; ranks are computed from the rounded values shown, so two very close countries can share neighbouring ranks.</li>
        <li>Country names follow common English usage (for example "Türkiye", "DR Congo"). Regions are the site's own grouping for browsing, not an official classification.</li>
      </ul>
    </section>

    <section class="panel">
      <h2>What this site does not do</h2>
      <p>It makes no network requests, sets no cookies and stores nothing about you.
      It covers 30 countries, not every country on earth — the table says so on
      every page. If a figure looks wrong, check the source publication for the
      unrounded value before quoting it.</p>
    </section>

    <div class="notice">Nations by Numbers is an original work, built for the make.fun
    national-statistics-site bounty. Data © World Bank and United Nations, as cited above.</div>`;
}

// ---------- Router ----------

export function route() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart || '');
  const segments = pathPart.split('/').filter(Boolean);
  window.scrollTo(0, 0);
  if (segments.length === 0) return viewHome();
  if (segments[0] === 'countries') return viewCountries();
  if (segments[0] === 'country' && segments[1]) return viewCountry(segments[1]);
  if (segments[0] === 'compare') return viewCompare(params);
  if (segments[0] === 'rankings') return viewRankings();
  if (segments[0] === 'about') return viewAbout();
  markActive('home');
  app.innerHTML = `
    <p class="eyebrow">Page not found</p>
    <h1>That page is not in the atlas</h1>
    <p class="lede">The link may be mistyped. The overview, the countries table, the
    comparison tool, the rankings and the sources page are all in the menu above.</p>
    <div class="btnrow"><a class="btn" href="#/">Back to the overview</a></div>`;
}
