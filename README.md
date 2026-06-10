# TimePro

Application web **mobile-first** pour enregistrer ses horaires de travail, calculer automatiquement les heures normales et supplémentaires, et exporter un **registre de présences Excel** prêt pour la RH.

Conçue pour les salariés qui doivent tenir un registre type *Foglio Presenze* (modèle italien), **sans compte, sans serveur, sans connexion internet**.

---

## Sommaire

- [À quoi sert TimePro ?](#à-quoi-sert-timepro-)
- [Première utilisation](#première-utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Règles de calcul](#règles-de-calcul)
- [Langues](#langues)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Installation & développement](#installation--développement)
- [Scripts disponibles](#scripts-disponibles)
- [Déploiement (Netlify)](#déploiement-netlify)
- [Données & confidentialité](#données--confidentialité)

---

## À quoi sert TimePro ?

| Besoin | Solution dans l'app |
|--------|---------------------|
| Saisir chaque jour ses heures | 4 champs horaires (matin + après-midi) |
| Savoir combien d'heures extra | Calcul automatique en temps réel |
| Voir le mois d'un coup d'œil | Calendrier coloré + dashboard |
| Envoyer un fichier à l'employeur | Export **.xlsx** au format professionnel |
| Utiliser sur téléphone | Interface optimisée mobile, barre de navigation en bas |
| Travailler sans réseau | Tout est stocké localement dans le navigateur |

---

## Première utilisation

Au **premier lancement**, l'application affiche :

1. **Écran de chargement** — logo TimePro avec spinner  
2. **Choix de langue** — Italiano ou الدارجة المغربية (obligatoire une seule fois)  
3. **Application** — prête à l'emploi  

Les visites suivantes passent directement à l'app (préférence mémorisée).

---

## Fonctionnalités

### Saisie (`/`)

- 4 champs `<input type="time">` : entrée/sortie matin, entrée/sortie après-midi  
- Récapitulatif instantané : heures travaillées, normales, extra  
- Navigation jour par jour (dimanche bloqué si désactivé dans les paramètres)  
- Boutons **Sauvegarder** et **Effacer la journée**  

### Calendrier (`/calendrier`)

- Vue mensuelle avec code couleur :
  - **Vert** — jour saisi sans heures extra  
  - **Orange** — jour avec heures extra  
  - **Gris** — jour vide ou dimanche bloqué  
- Tap sur un jour → ouvre la saisie de ce jour  

### Dashboard (`/dashboard`)

- KPIs du mois : heures travaillées, normales, extra  
- Nombre de jours travaillés, samedis travaillés, jours avec extra  
- Graphique en barres par semaine (normales vs extra)  
- Navigation mois précédent / suivant  

### Export (`/export`)

- Aperçu des totaux du mois  
- Téléchargement **Excel (.xlsx)** côté client  
- Fichier toujours en **italien** (colonnes RH standard), quelle que soit la langue de l'interface  

### Paramètres (`/parametres`)

- Nom, prénom, pays  
- Horaire de référence (ex. 08:00–12:00 / 13:00–17:00 = 8 h normales)  
- Activer ou non le travail le dimanche  
- Thème : clair, sombre ou système  

### Autres

- **Thème sombre** avec anti-flash au rechargement  
- **Animations légères** (changement de langue, navigation)  
- **Accessibilité** : labels ARIA, support RTL, `prefers-reduced-motion`  

---

## Règles de calcul

Horaire de référence par défaut : **8 h normales** (4 h matin + 4 h après-midi), du lundi au vendredi.

| Situation | Heures normales | Heures extra |
|-----------|-----------------|--------------|
| Jour ouvré, ≤ 8 h travaillées | = heures travaillées | 0 |
| Jour ouvré, > 8 h travaillées | 8 h max | le surplus |
| Samedi | 0 | toutes les heures travaillées |
| Dimanche (si activé) | 0 | toutes les heures travaillées |
| Dimanche (si désactivé) | saisie bloquée | — |

Format d'affichage : **`08h 30min`** (jamais de décimales). Valeur vide = **`-`**.

---

## Langues

| Zone | Italien | Darija (RTL) |
|------|---------|--------------|
| Interface (menus, labels, erreurs) | ✅ | ✅ |
| Export Excel | ✅ | ❌ (toujours italien) |

Fichiers de traduction : `src/locales/it.json` et `src/locales/ar.json`.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| UI | React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Routing | React Router v7 (lazy loading par page) |
| État | Zustand + persistance `localStorage` |
| i18n | react-i18next |
| Dates | date-fns |
| Graphiques | Recharts |
| Export | ExcelJS (chargé à la demande) |
| Tests | Vitest |
| Build | Vite 8 |
| Déploiement | Netlify (SPA) |

---

## Structure du projet

```
src/
├── pages/           # 5 écrans : Saisie, Calendrier, Dashboard, Export, Paramètres
├── components/      # UI réutilisable (KpiCard, MonthNavigator, AppLogo…)
│   ├── layout/      # AppShell, BottomNav, AnimatedOutlet
│   └── ui/          # Composants shadcn (Button, Card, Input…)
├── store/
│   └── usePresences.ts   # État global + localStorage (clé timepro-v1)
├── utils/
│   ├── calcHeures.ts     # Logique métier heures normales / extra
│   ├── statsMois.ts      # Agrégats mensuels & graphique
│   ├── exportData.ts     # Préparation des données export
│   ├── excelBuilder.ts   # Génération du fichier .xlsx
│   └── validateHeures.ts # Validation créneaux horaires
├── locales/         # Traductions IT / AR
├── constants/       # Métadonnées langues
└── types/           # Types TypeScript partagés

public/
├── logo.png         # Logo mode clair
├── logo-d.png       # Logo mode sombre
├── manifest.webmanifest
├── robots.txt
└── sitemap.xml
```

---

## Installation & développement

**Prérequis :** Node.js 22+ et npm.

```bash
# Cloner le dépôt
git clone https://github.com/suufiaane13/TimePro.git
cd TimePro

# Installer les dépendances
npm install

# Lancer le serveur de dev (http://localhost:5173)
npm run dev
```

Pour simuler une **première visite** (choix de langue) :

```js
// Console du navigateur
localStorage.removeItem('timepro-v1')
// Puis recharger la page
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Compilation TypeScript + build production → `dist/` |
| `npm run preview` | Prévisualiser le build local |
| `npm run test` | Tests unitaires (Vitest) |
| `npm run test:watch` | Tests en mode watch |
| `npm run lint` | Vérification ESLint |

---

## Déploiement (Netlify)

Le fichier `netlify.toml` est déjà configuré :

- **Build :** `npm run build`  
- **Publish :** `dist/`  
- **Node :** 22  
- **SPA :** toutes les routes redirigent vers `index.html`  
- **Headers sécurité** et cache des assets  

Étapes :

1. Connecter le dépôt GitHub à [Netlify](https://www.netlify.com)  
2. Netlify détecte automatiquement `netlify.toml`  
3. Chaque push sur `main` déclenche un déploiement  

Un workflow GitHub Actions (`.github/workflows/ci.yml`) exécute `test` + `build` à chaque push/PR.

---

## Données & confidentialité

- **Aucune donnée n'est envoyée sur un serveur.**  
- Tout est stocké dans le navigateur, clé `timepro-v1` (`localStorage`).  
- Pas de compte utilisateur, pas de cookies de tracking.  
- Effacer les données du site dans les paramètres du navigateur = reset complet.  

> Les données restent **uniquement sur l'appareil** utilisé.

---

## Licence

Projet privé — usage personnel / interne.
