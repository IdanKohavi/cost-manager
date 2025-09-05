(function (global) {
  const DB_DEFAULT_NAME = 'costsdb';
  const DB_DEFAULT_VERSION = 1;
  const STORE_COSTS = 'costs';
  const STORE_SETTINGS = 'settings';

  function openIndexedDB(databaseName = DB_DEFAULT_NAME, databaseVersion = DB_DEFAULT_VERSION) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(databaseName, databaseVersion);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_COSTS)) {
          const store = db.createObjectStore(STORE_COSTS, { keyPath: 'id', autoIncrement: true });
          store.createIndex('byYear', 'year');
          store.createIndex('byMonth', 'month');
          store.createIndex('byYearMonth', ['year','month']);
          store.createIndex('byCategory', 'category');
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function openCostsDB(databaseName = DB_DEFAULT_NAME, databaseVersion = DB_DEFAULT_VERSION) {
    const db = await openIndexedDB(databaseName, databaseVersion);
    return {
      async addCost({ sum, currency, category, description }) {
        const now = new Date();
        const item = {
          sum: Number(sum),
          currency: String(currency),
          category: String(category),
          description: String(description || ''),
          day: now.getDate(),
          month: now.getMonth() + 1,
          year: now.getFullYear()
        };
        return await new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_COSTS, 'readwrite');
          tx.oncomplete = () => resolve(item);
          tx.onerror = () => reject(tx.error);
          tx.objectStore(STORE_COSTS).add(item);
        });
      },

      async getReport(year, month, targetCurrency) {
        const y = Number(year), m = Number(month);
        const rates = await new Promise((resolve) => {
          const tx = db.transaction(STORE_SETTINGS, 'readonly');
          const req = tx.objectStore(STORE_SETTINGS).get('rates');
          req.onsuccess = () => resolve(req.result?.value || { USD:1, ILS:3.4, GBP:1.8, EURO:0.7 });
          req.onerror = () => resolve({ USD:1, ILS:3.4, GBP:1.8, EURO:0.7 });
        });
        const toUSD = (sum, cur) => Number(sum) / Number(rates[cur] || 1);
        const fromUSD = (usd) => Number(usd) * Number(rates[targetCurrency] || 1);

        const costs = await new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_COSTS, 'readonly');
          const idx = tx.objectStore(STORE_COSTS).index('byYearMonth');
          const range = IDBKeyRange.only([y, m]);
          const out = [];
          idx.openCursor(range).onsuccess = (e) => {
            const cur = e.target.result;
            if (!cur) return resolve(out);
            out.push(cur.value);
            cur.continue();
          };
          idx.openCursor(range).onerror = () => reject(idx.error);
        });

        const totalUSD = costs.reduce((acc, c) => acc + toUSD(c.sum, c.currency), 0);
        const total = { currency: targetCurrency, total: Number(fromUSD(totalUSD).toFixed(2)) };
        return { year: y, month: m, costs, total };
      }
    };
  }

  global.idb = { openCostsDB };
})(window);
