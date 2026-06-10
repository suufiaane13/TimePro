# TimePro

Application web **mobile-first** pour saisir ses horaires, calculer les heures normales et supplémentaires, et exporter un registre de présences **Excel (.xlsx)**.

## Fonctionnalités

- Saisie journalière (matin / après-midi)
- Calendrier mensuel coloré
- Dashboard avec KPIs et graphique hebdomadaire
- Export Excel (libellés toujours en italien)
- Interface **italien** ou **darija marocaine** (RTL)
- Thème clair / sombre / système
- 100 % offline (`localStorage`)

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Zustand · react-i18next · ExcelJS · Recharts · Vitest

## Développement

```bash
npm install
npm run dev
```

## Tests & build

```bash
npm run test
npm run build
```

## Déploiement Netlify

Le fichier `netlify.toml` configure le build SPA. Branchez le dépôt sur Netlify — la commande de build est `npm run build`, le dossier publié est `dist`.

## Données

Toutes les données restent sur l'appareil (clé `timepro-v1` dans `localStorage`). Aucun backend.
