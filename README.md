# Nations by Numbers — National Statistics Explorer

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/yeager9333/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/yeager9333/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

An original, fully offline national statistics site: explore 30 countries with
real, sourced figures — population, GDP, GDP per capita, life expectancy,
density, urban share, median age and fertility — through a world-at-a-glance
overview, a searchable and sortable table, per-country profile pages with
charts, a side-by-side comparison tool for up to three countries, ranked bar
charts, and a sources &amp; method page. Every figure carries its source and
year (World Bank World Development Indicators 2024; UN World Population
Prospects 2024). No network requests, no external fonts or libraries, system
fonts only.

Referral code: `j4p3yzce`

## Run it

Serve `app/` with any static server and open `app/index.html`, or:

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

## Build (make.fun entrypoint)

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into the output directory and writes `dossier.json` with the vendored
`vendor/makefun-frontend.ts` library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Pages

- `#/` — World at a glance: headline figures, top-10 population and GDP charts, longest lives
- `#/countries` — Searchable, sortable table of all 30 countries, with region filter
- `#/country/<code>` — Country profile: stat cards, gauges, regional population chart, similar-sized countries
- `#/compare` — Compare up to three countries side by side
- `#/rankings` — Ranked bar charts for eight indicators, switchable with tabs
- `#/about` — Sources, data vintage and methodology

## License

MIT — see [LICENSE](LICENSE).
