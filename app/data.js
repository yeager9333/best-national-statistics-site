// Nations by Numbers — country dataset, 2024.
// All figures are rounded 2024 estimates from the World Bank World
// Development Indicators (WDI 2024) and the United Nations World Population
// Prospects 2024 (medium variant).
//   pop      population, millions
//   gdp      gross domestic product, current US$ billions
//   life     life expectancy at birth, years
//   area     land area, square kilometres
//   urban    share of population living in urban areas, percent
//   age      median age, years
//   children total fertility rate, children per woman
// GDP per capita and population density are computed from pop, gdp and area.

export const VINTAGE = '2024';

export const SOURCE_LIST = [
  { name: 'World Bank, World Development Indicators 2024', covers: 'Population, GDP, GDP per capita, life expectancy, urban population, fertility, land area' },
  { name: 'United Nations, World Population Prospects 2024 (medium variant)', covers: 'Population, median age' },
];

export const WORLD_TOTALS = {
  population: 8162, // millions of people
  gdp: 111326, // current US$ billions
  lifeExpectancy: 73.3, // years
  urbanShare: 58, // percent
  medianAge: 30.5, // years
  fertility: 2.2, // children per woman
};

export const COUNTRIES = [
  { code: 'ind', name: 'India', region: 'South Asia', capital: 'New Delhi', languages: 'Hindi, English', pop: 1450.9, gdp: 3912, life: 68.4, area: 3287263, urban: 36.4, age: 28.7, children: 2.0 },
  { code: 'chn', name: 'China', region: 'East Asia', capital: 'Beijing', languages: 'Mandarin', pop: 1419.0, gdp: 18832, life: 78.9, area: 9596961, urban: 65.0, age: 39.5, children: 1.0 },
  { code: 'usa', name: 'United States', region: 'North America', capital: 'Washington, D.C.', languages: 'English', pop: 340.1, gdp: 29184, life: 79.6, area: 9833517, urban: 83.0, age: 38.5, children: 1.6 },
  { code: 'idn', name: 'Indonesia', region: 'Southeast Asia', capital: 'Jakarta', languages: 'Indonesian', pop: 283.5, gdp: 1403, life: 68.9, area: 1904569, urban: 59.0, age: 30.5, children: 2.0 },
  { code: 'pak', name: 'Pakistan', region: 'South Asia', capital: 'Islamabad', languages: 'Urdu, English', pop: 251.3, gdp: 373, life: 66.1, area: 881913, urban: 37.0, age: 20.6, children: 3.3 },
  { code: 'nga', name: 'Nigeria', region: 'West Africa', capital: 'Abuja', languages: 'English', pop: 232.7, gdp: 200, life: 54.6, area: 923768, urban: 54.0, age: 18.1, children: 4.6 },
  { code: 'bra', name: 'Brazil', region: 'South America', capital: 'Brasília', languages: 'Portuguese', pop: 216.4, gdp: 2174, life: 76.4, area: 8515767, urban: 87.0, age: 34.0, children: 1.6 },
  { code: 'bgd', name: 'Bangladesh', region: 'South Asia', capital: 'Dhaka', languages: 'Bengali', pop: 173.6, gdp: 451, life: 74.7, area: 147570, urban: 42.0, age: 28.2, children: 1.9 },
  { code: 'rus', name: 'Russia', region: 'Europe', capital: 'Moscow', languages: 'Russian', pop: 144.8, gdp: 2017, life: 71.7, area: 17098242, urban: 75.0, age: 41.0, children: 1.4 },
  { code: 'mex', name: 'Mexico', region: 'North America', capital: 'Mexico City', languages: 'Spanish', pop: 130.9, gdp: 1789, life: 75.4, area: 1964375, urban: 81.0, age: 29.8, children: 1.7 },
  { code: 'eth', name: 'Ethiopia', region: 'East Africa', capital: 'Addis Ababa', languages: 'Amharic', pop: 129.7, gdp: 205, life: 67.7, area: 1104300, urban: 23.0, age: 19.6, children: 4.0 },
  { code: 'jpn', name: 'Japan', region: 'East Asia', capital: 'Tokyo', languages: 'Japanese', pop: 124.4, gdp: 4066, life: 84.5, area: 377975, urban: 92.0, age: 49.6, children: 1.2 },
  { code: 'phl', name: 'Philippines', region: 'Southeast Asia', capital: 'Manila', languages: 'Filipino, English', pop: 115.8, gdp: 462, life: 72.3, area: 300000, urban: 48.0, age: 26.0, children: 1.9 },
  { code: 'egy', name: 'Egypt', region: 'North Africa', capital: 'Cairo', languages: 'Arabic', pop: 112.7, gdp: 380, life: 71.6, area: 1002450, urban: 43.0, age: 25.0, children: 2.8 },
  { code: 'cod', name: 'DR Congo', region: 'Central Africa', capital: 'Kinshasa', languages: 'French', pop: 105.8, gdp: 70, life: 62.5, area: 2344858, urban: 47.0, age: 17.3, children: 5.6 },
  { code: 'vnm', name: 'Vietnam', region: 'Southeast Asia', capital: 'Hanoi', languages: 'Vietnamese', pop: 101.0, gdp: 477, life: 75.6, area: 331212, urban: 40.0, age: 33.6, children: 1.9 },
  { code: 'irn', name: 'Iran', region: 'West Asia', capital: 'Tehran', languages: 'Persian', pop: 90.6, gdp: 436, life: 75.8, area: 1648195, urban: 76.0, age: 33.7, children: 1.7 },
  { code: 'tur', name: 'Türkiye', region: 'West Asia', capital: 'Ankara', languages: 'Turkish', pop: 85.6, gdp: 1344, life: 77.2, area: 783562, urban: 77.0, age: 34.4, children: 1.5 },
  { code: 'deu', name: 'Germany', region: 'Europe', capital: 'Berlin', languages: 'German', pop: 84.6, gdp: 4659, life: 81.7, area: 357588, urban: 78.0, age: 46.8, children: 1.4 },
  { code: 'tha', name: 'Thailand', region: 'Southeast Asia', capital: 'Bangkok', languages: 'Thai', pop: 71.7, gdp: 528, life: 76.9, area: 513120, urban: 53.0, age: 40.1, children: 1.3 },
  { code: 'gbr', name: 'United Kingdom', region: 'Europe', capital: 'London', languages: 'English', pop: 69.3, gdp: 3643, life: 81.8, area: 243610, urban: 84.0, age: 40.3, children: 1.5 },
  { code: 'fra', name: 'France', region: 'Europe', capital: 'Paris', languages: 'French', pop: 68.4, gdp: 3072, life: 83.3, area: 551695, urban: 81.0, age: 42.3, children: 1.7 },
  { code: 'ita', name: 'Italy', region: 'Europe', capital: 'Rome', languages: 'Italian', pop: 59.0, gdp: 2380, life: 83.5, area: 302073, urban: 71.0, age: 48.4, children: 1.2 },
  { code: 'kor', name: 'South Korea', region: 'East Asia', capital: 'Seoul', languages: 'Korean', pop: 51.7, gdp: 1713, life: 83.5, area: 100210, urban: 81.0, age: 45.5, children: 0.7 },
  { code: 'esp', name: 'Spain', region: 'Europe', capital: 'Madrid', languages: 'Spanish', pop: 48.7, gdp: 1647, life: 84.0, area: 505992, urban: 81.0, age: 45.8, children: 1.1 },
  { code: 'can', name: 'Canada', region: 'North America', capital: 'Ottawa', languages: 'English, French', pop: 40.0, gdp: 2242, life: 82.6, area: 9984670, urban: 82.0, age: 41.8, children: 1.3 },
  { code: 'aus', name: 'Australia', region: 'Oceania', capital: 'Canberra', languages: 'English', pop: 27.0, gdp: 1775, life: 83.3, area: 7692024, urban: 86.0, age: 37.9, children: 1.5 },
  { code: 'che', name: 'Switzerland', region: 'Europe', capital: 'Bern', languages: 'German, French, Italian', pop: 9.0, gdp: 938, life: 84.2, area: 41285, urban: 74.0, age: 43.5, children: 1.4 },
  { code: 'sgp', name: 'Singapore', region: 'Southeast Asia', capital: 'Singapore', languages: 'English, Mandarin, Malay', pop: 6.0, gdp: 530, life: 84.3, area: 734, urban: 100, age: 43.1, children: 1.0 },
  { code: 'nor', name: 'Norway', region: 'Europe', capital: 'Oslo', languages: 'Norwegian', pop: 5.6, gdp: 620, life: 83.2, area: 385207, urban: 83.0, age: 40.0, children: 1.4 },
];

export function findCountry(code) {
  const wanted = String(code || '').toLowerCase();
  return COUNTRIES.find((c) => c.code === wanted) || null;
}

export function gdpPerCapita(country) {
  return Math.round((country.gdp * 1e9) / (country.pop * 1e6));
}

export function peoplePerKm2(country) {
  return (country.pop * 1e6) / country.area;
}

// Value used for sorting / ranking on a named indicator.
export function indicatorValue(country, key) {
  if (key === 'gdppc') return gdpPerCapita(country);
  if (key === 'density') return peoplePerKm2(country);
  return country[key];
}

export function topCountries(key, count) {
  return [...COUNTRIES]
    .sort((a, b) => indicatorValue(b, key) - indicatorValue(a, key))
    .slice(0, count);
}

export function rankAmong(country, key) {
  const ordered = [...COUNTRIES].sort((a, b) => indicatorValue(b, key) - indicatorValue(a, key));
  return ordered.findIndex((c) => c.code === country.code) + 1;
}

export function regions() {
  return [...new Set(COUNTRIES.map((c) => c.region))].sort();
}

export function worldMedian(key) {
  const values = COUNTRIES.map((c) => indicatorValue(c, key)).sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}
