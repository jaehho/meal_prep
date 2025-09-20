# Meal Prep Grocery Builder (YAML data)

A React + TypeScript app that lets you select meal-prep recipes and the number of batches, then auto-aggregates a tidy grocery list with standardized units. **Meals are stored in a human-readable YAML file.**

## ✨ Features
- Human‑readable data in `src/data/meals.yaml`
- Select any combination of meals and set batch counts
- Aggregated grocery list with consistent units (lb, oz, cups/tbsp/tsp, counts)
- Copy or download the list as CSV
- LocalStorage remembers your last selections
- Typed data model and simple structure for adding new meals

## 🛠️ Tech
- Vite + React + TypeScript
- `yaml` parser (build-time via Vite `?raw` import)
- Vitest for unit tests
- ESLint + Prettier

## 🚀 Quickstart

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## 🧪 Tests
```bash
npm test
```

## 🧩 Edit Meals (YAML)
Open `src/data/meals.yaml` and add entries like:

```yaml
- id: hot-creamy-chicken-pasta
  name: Hot Creamy Chicken Pasta
  servingsPerBatch: 4
  ingredients:
    - { name: Chicken Breast, unit: lb, qty: 1.0 }
    - { name: Pasta, unit: oz, qty: 12.0 }
```

Supported units: `lb`, `oz`, `cups`, `tbsp`, `tsp`, `cloves`, `slices`, `count`, `stalks`.

## 📦 Build
```bash
npm run build
npm run preview
```

## 🌐 Deploy
- **GitHub Pages**: `npm run build` then publish `dist/`.
- **Netlify / Vercel**: Build command `npm run build`, output `dist`.

## 📄 License
MIT
