# Cost Manager — Starter Project

This project scaffolds the assignment requirements:
- React + MUI UI
- IndexedDB wrapper `idb.js` (vanilla) and `src/lib/idb.module.js` (ESM for React)
- Add Cost form, Monthly Report, Pie & Bar Charts, and Settings (fetch & store exchange rates)

## Run locally
1. Install Node 18+.
2. `npm install`
3. `npm run dev` — open the local URL Vite prints.

## Exchange rates
The Settings page lets you enter a URL that returns JSON like:
```json
{"USD":1, "GBP":1.8, "EURO":0.7, "ILS":3.4}
```
After fetching, the rates are saved to IndexedDB and used by `getReport`.

## Testing the vanilla idb.js
Open `public/idb.test.html` directly in Chrome. It loads `../idb.js` and prints results in the console.

## Build
`npm run build`

## Notes
- The Pie chart currently sums raw category values from the report items as entered. You can extend `getReport` to convert each item to the selected currency before grouping, if desired.
- The Bar chart uses the total from `getReport(year, m, currency)` for each month.
