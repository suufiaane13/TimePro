# TimePro — Registre de Présences & Heures Extraordinaires
### Product Requirements Document · v1.2

> **Stack :** React 18 + TypeScript + Tailwind CSS v4 · **Déploiement :** Netlify (SPA, gratuit)  
> **Audience MVP :** Salarié · **Priorité :** MVP en 3 semaines  
> **Langues :** Interface **italien / arabe (RTL)** · Export CSV **italien uniquement** (toujours)

---

## 0. Décisions de périmètre (verrouillées)

| Sujet | MVP (3 semaines) | V2+ |
|-------|------------------|-----|
| Interface utilisateur | **Italien + Arabe (RTL)** — sélecteur IT/AR | Améliorations i18n, polish RTL |
| Export CSV | **Italien uniquement** — indépendant de la langue UI | Inchangé (toujours IT) |
| Export Excel | Libellés italiens (modèle source officiel) | Inchangé (toujours IT) |
| Backend | **Aucun** — export 100 % côté client | Python FastAPI + openpyxl (option cloud) |
| Authentification | Non | Multi-employés + compte |
| Rôle Manager | Non | Validation / vue équipe |
| Stockage | localStorage | Netlify Blobs / sync cloud |

---

## 1. Contexte & Objectif

Application **mobile-first** permettant de saisir quotidiennement ses horaires de travail (matin + après-midi), calculer automatiquement les heures normales vs extraordinaires, et exporter un fichier Excel/CSV professionnel **identique** au registre *Foglio_Presenze_Maggio_2026.xlsx* analysé.

L'application a été conçue à partir du registre source italien, en adaptant les règles horaires pour toute PME, avec une priorité absolue sur la simplicité d'usage mobile et le mode hors ligne.

### Document source analysé (jeu de validation)

| Élément | Détail |
|---------|--------|
| Salarié test | Hamza EL-ALAOUI |
| Période | 01/05/2026 → 30/05/2026 |
| Référence horaire | Lun–Ven : 08h–12h / 13h–17h = **8h normales**, Sam = **0h** |
| Colonnes | Data, Giorno, Entrata mattina, Uscita mattina, Entrata PM, Uscita PM, Ore lavorate, Ore normali, Ore straordinarie |
| Mise en forme | Samedis en vert · Extras en rouge · TOTALE GENERALE fond rouge |
| Totaux mai 2026 | **222,5h** travaillées · **152,0h** normales · **70,5h** extra |

---

## 2. User stories MVP

| ID | En tant que… | Je veux… | Afin de… |
|----|--------------|----------|----------|
| US-01 | Salarié | Saisir 4 horaires par jour sur mobile | Enregistrer ma journée en < 30 secondes |
| US-02 | Salarié | Voir le calcul auto des heures normales/extra | Ne pas faire de calcul manuel |
| US-03 | Salarié | Naviguer dans un calendrier mensuel coloré | Repérer rapidement les jours incomplets ou avec extras |
| US-04 | Salarié | Consulter un dashboard avec totaux mensuels | Suivre mon volume d'heures |
| US-05 | Salarié | Exporter un .xlsx identique au modèle italien | Le transmettre à mon employeur / RH |
| US-06 | Salarié | Exporter un CSV compatible Excel Windows | L'importer dans d'autres outils |
| US-07 | Salarié | Configurer mon profil et horaire de référence | Adapter l'app à mon contrat |
| US-08 | Salarié | Utiliser l'app sans connexion internet | Saisir même sans réseau |
| US-09 | Salarié | Choisir entre italien et arabe pour l'interface | Utiliser l'app dans ma langue |
| US-10 | Salarié | Exporter un CSV avec en-têtes italiens | Fournir un fichier standard RH, quelle que soit ma langue UI |

---

## 2.1 Politique linguistique (verrouillée)

| Zone | Italien (IT) | Arabe (AR) | Règle |
|------|--------------|------------|-------|
| Interface (menus, labels, erreurs) | ✅ | ✅ (RTL) | Suit la langue choisie par l'utilisateur |
| Export CSV (en-têtes, colonnes) | ✅ | ❌ | **Toujours italien** — jamais traduit |
| Export Excel (.xlsx) | ✅ | ❌ | **Toujours italien** — fidèle au modèle source |
| Sélecteur de langue | IT / AR | IT / AR | Visible sur chaque écran · pas de français |

> **Exemple :** un utilisateur en interface arabe exporte un CSV dont les colonnes restent `Data, Giorno, Entrata mattina…` — seule l'UI est en arabe.

---

## 3. Fonctionnalités MVP

### 3.1 Saisie journalière
- 4 pickers d'heure natifs mobile (`<input type="time">`) : entrée matin, sortie matin, entrée PM, sortie PM
- Calcul automatique en temps réel des heures travaillées, normales et extra
- Détection automatique du samedi et du dimanche
- Possibilité de laisser un jour entièrement vide (non travaillé)
- Bouton « Effacer la journée » pour réinitialiser une saisie

### 3.2 Calcul des heures — règles métier

#### Formules

```
duree_matin     = sortie_matin − entrée_matin   (si les deux sont renseignés, sinon 0)
duree_pm        = sortie_pm − entrée_pm         (si les deux sont renseignés, sinon 0)
heures_travaillées = duree_matin + duree_pm

heures_normales_ref = (fin_matin − début_matin) + (fin_pm − début_pm)   ← depuis le profil

heures_normales = si samedi ou dimanche → 0
                  si jour vide            → 0
                  sinon                   → min(heures_travaillées, heures_normales_ref)

heures_extra    = heures_travaillées − heures_normales
```

> **Défaut profil :** 08:00–12:00 + 13:00–17:00 → `heures_normales_ref = 8`

#### Règles par type de jour

| Jour | Comportement calendrier | heures_normales | heures_extra |
|------|-------------------------|-----------------|--------------|
| Lun–Ven saisi | Ligne exportée | min(travaillées, ref) | travaillées − normales |
| Samedi saisi | Fond vert | 0 | = travaillées |
| Dimanche | Masqué par défaut, saisie optionnelle via toggle | 0 | = travaillées |
| Jour vide | Gris au calendrier | 0 | 0 — non exporté |

### 3.3 Cas limites & validation

| Cas | Comportement |
|-----|--------------|
| Sortie < entrée (même créneau) | Erreur inline traduite (IT/AR selon langue UI) — pas de calcul |
| Saisie partielle (matin seul) | Autorisée — seule la durée matin est comptée |
| Créneau PM sans matin | Autorisé — seule la durée PM est comptée |
| Les deux créneaux vides | Jour considéré non travaillé |
| Changement d'horaire référence en cours de mois | Recalcul immédiat de tous les jours du mois affiché |
| Données localStorage corrompues | Reset vers état vide + toast « Données réinitialisées » |
| localStorage plein (~5 Mo) | Toast d'alerte + suggestion d'exporter puis purger les anciens mois |

### 3.4 Vue calendrier mensuelle
- Affichage du mois courant avec indicateur couleur par jour :
  - 🟢 Vert = jour rempli, sans heures extra
  - 🟠 Orange = heures extra > 0
  - ⬜ Gris = jour non saisi (ou dimanche non activé)
- Tap sur un jour → navigation vers écran Saisie pour cette date
- Navigation mois précédent / suivant

### 3.5 Dashboard mensuel
- Totaux : heures travaillées, normales, extra
- Mini graphe hebdomadaire (barres empilées normales / extra)
- Compteur : jours travaillés, samedis travaillés, jours avec extra

### 3.6 Export Excel .xlsx — fidélité au document source

**Implémentation MVP :** génération **100 % côté client** via `exceljs` (pas de backend).

| Élément Excel | Détail de mise en forme |
|---------------|-------------------------|
| Titre principal | `REGISTRO PRESENZE E ORE STRAORDINARIE` · centré · rouge `#C00000` · gras |
| Sous-titre | Dipendente / Periodo / Nazione / Calendario |
| Tableau référence horaire | Fond bleu foncé `#1F3864` · texte blanc |
| En-têtes colonnes | Fond bordeaux `#7B0C02` · texte blanc · gras |
| Lignes normales | Fond blanc · bordures fines |
| Samedis | Fond vert `#E2EFDA` · texte vert foncé `#375623` |
| Colonne ore straordinarie | Fond rouge clair `#FFC7CE` · texte rouge `#9C0006` |
| TOTALE GENERALE | Fond rouge foncé `#C00000` · texte blanc · gras |

Nommage fichier : `presenze_NomPrenom_MMYYYY.xlsx`

### 3.7 Export CSV — italien uniquement
- Séparateur `;` · encodage UTF-8 BOM
- En-têtes **toujours en italien** (`Data, Giorno, Entrata mattina, Uscita mattina, Entrata PM, Uscita PM, Ore lavorate, Ore normali, Ore straordinarie`) — **jamais traduits**, même si l'UI est en arabe
- Nommage : `presenze_NomPrenom_MMYYYY.csv`
- Génération côté client (pas de backend)

### 3.8 Interface multilingue IT / AR
- Sélecteur de langue (IT / AR) accessible depuis chaque écran
- Arabe : layout RTL complet (`dir="rtl"`, mirroring navigation, alignements)
- Italien : layout LTR par défaut
- Traductions centralisées via `react-i18next` — fichiers `locales/it.json` et `locales/ar.json`
- Langue sauvegardée dans `localStorage` (via store Zustand)
- Langue par défaut au premier lancement : **italien**

### 3.9 Profil salarié configurable
- Nom et prénom
- Pays / Nazione (défaut : `Italia`)
- Horaire de référence : début matin, fin matin, début PM, fin PM
- `heures_normales_ref` calculé automatiquement depuis les créneaux (non éditable directement)

### 3.10 Stockage local
- `localStorage` clé `timepro-v1` — pas de login
- Persistance via Zustand middleware `persist`
- Volume estimé : ~200 Ko pour 12 mois × 31 jours

### 3.11 Confidentialité (RGPD)
- Données stockées **uniquement** sur l'appareil de l'utilisateur
- Aucune transmission serveur en MVP
- Export = action volontaire de l'utilisateur
- Mention légale dans Paramètres (traduite IT/AR) : données locales uniquement

---

## 4. Fonctionnalités V2 (post-MVP)

- Polish i18n : pluralisation arabe, formats de date localisés
- **Backend Python** (FastAPI sur Render/Railway) + `openpyxl` pour exports serveur si besoin
- Multi-employés / multi-mois sur un compte authentifié
- Rôle **Manager** : validation mensuelle, vue équipe, export groupé
- Gestion des congés et jours fériés par pays
- Synchronisation Google Sheets
- Notifications rappel quotidien (PWA)
- Stockage cloud (Netlify Blobs)

---

## 5. Modèle de données

### 5.1 Types TypeScript

```typescript
interface HoraireRef {
  debutMatin: string;   // "08:00"
  finMatin: string;     // "12:00"
  debutPm: string;      // "13:00"
  finPm: string;        // "17:00"
}

interface Profil {
  nom: string;
  prenom: string;
  pays: string;
  horaireRef: HoraireRef;
}

interface JourSaisie {
  date: string;           // "2026-05-04" (ISO)
  entreeMatin: string | null;
  sortieMatin: string | null;
  entreePm: string | null;
  sortiePm: string | null;
}

interface JourCalcule extends JourSaisie {
  heuresTravaillees: number;
  heuresNormales: number;
  heuresExtra: number;
  estSamedi: boolean;
  estDimanche: boolean;
}

interface MoisData {
  mois: string;           // "2026-05"
  jours: Record<string, JourSaisie>;  // clé = date ISO
}

type LangueUI = 'it' | 'ar';

interface AppState {
  profil: Profil;
  langue: LangueUI;       // langue interface — n'affecte PAS les exports
  moisActif: string;
  mois: Record<string, MoisData>;
  dimancheActif: boolean; // toggle global pour saisie dimanche
}
```

### 5.2 Exemple JSON localStorage

```json
{
  "profil": {
    "nom": "EL-ALAOUI",
    "prenom": "Hamza",
    "pays": "Italia",
    "horaireRef": {
      "debutMatin": "08:00",
      "finMatin": "12:00",
      "debutPm": "13:00",
      "finPm": "17:00"
    }
  },
  "langue": "it",
  "moisActif": "2026-05",
  "dimancheActif": false,
  "mois": {
    "2026-05": {
      "mois": "2026-05",
      "jours": {
        "2026-05-04": {
          "date": "2026-05-04",
          "entreeMatin": "07:00",
          "sortieMatin": "12:30",
          "entreePm": "13:00",
          "sortiePm": "18:30"
        }
      }
    }
  }
}
```

---

## 6. Architecture technique

### 6.1 Frontend — React + TypeScript + Tailwind v4

```
src/
├── pages/
│   ├── Saisie.tsx           # Écran principal de saisie journalière
│   ├── Calendrier.tsx       # Vue mensuelle avec indicateurs couleur
│   ├── Dashboard.tsx        # Totaux et graphes
│   ├── Export.tsx           # Déclenchement export .xlsx / .csv
│   └── Parametres.tsx       # Profil salarié + horaire référence
├── components/
│   ├── TimePicker.tsx       # Picker heure natif mobile
│   ├── JourCard.tsx         # Carte résumé d'un jour
│   ├── StatCard.tsx         # Carte métrique (total heures...)
│   ├── MiniChart.tsx        # Graphe barres hebdo (recharts)
│   └── LanguageSwitcher.tsx # Sélecteur IT / AR
├── locales/
│   ├── it.json              # Traductions interface italienne
│   └── ar.json              # Traductions interface arabe (RTL)
├── store/
│   └── usePresences.ts      # Zustand — state global + persist localStorage
├── utils/
│   ├── calcHeures.ts        # Calcul heures normales/extra
│   ├── validateHeures.ts    # Validation saisie (sortie > entrée)
│   ├── excelBuilder.ts      # Génération .xlsx via exceljs (libellés IT fixes)
│   ├── csvBuilder.ts        # Génération .csv UTF-8 BOM (en-têtes IT fixes)
│   └── i18n.ts              # Config react-i18next
├── types/
│   └── index.ts             # Interfaces TypeScript
└── main.tsx
```

**Librairies frontend :**

| Librairie | Usage |
|-----------|-------|
| `react@18` + `typescript` | UI typée |
| `tailwindcss@4` | Styles (CSS-first, `@import "tailwindcss"`) |
| `vite` | Build & dev server |
| `react-router-dom@6` | Navigation |
| `zustand` | State + persistence |
| `react-hook-form` | Formulaire saisie |
| `date-fns` | Dates (jour semaine, formatage) |
| `recharts` | Graphe barres dashboard |
| `exceljs` | Export .xlsx avec mise en forme complète |
| `react-i18next` | Interface IT / AR · RTL arabe |

> **Pas de backend en MVP.** Exports CSV/Excel toujours en italien, quelle que soit la langue UI.

### 6.2 Backend Python — V2 uniquement

```
backend/                        # Déployé sur Render / Railway (V2)
├── main.py                     # FastAPI
├── excel_builder.py            # openpyxl — exports serveur (libellés IT)
├── csv_builder.py
└── requirements.txt
```

**Libs Python (V2) :** `fastapi`, `openpyxl`, `python-dateutil`, `babel`

### 6.3 Déploiement Netlify (MVP — SPA pure)

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

| Composant | Solution | Coût |
|-----------|----------|------|
| Frontend | Netlify CDN, build Vite | Gratuit |
| Backend MVP | Aucun (export client) | Gratuit |
| Stockage | localStorage | Gratuit |
| CI/CD | Push GitHub → deploy auto | Gratuit |

---

## 7. Roadmap de livraison

### Semaine 1 — Core UI, i18n & Calcul
- [ ] Setup Vite + React + TypeScript + Tailwind v4 + React Router
- [ ] Config `react-i18next` + `locales/it.json` + `locales/ar.json` + RTL arabe
- [ ] `LanguageSwitcher` + persistance langue dans Zustand
- [ ] Types TypeScript + store Zustand avec persist
- [ ] `calcHeures.ts` + `validateHeures.ts` + tests unitaires (Vitest)
- [ ] Écran Saisie avec 4 TimePickers + feedback erreurs traduit IT/AR
- [ ] Page Paramètres (profil + horaire référence)
- [ ] Validation calcul sur les 26 jours du fichier source Hamza

### Semaine 2 — Calendrier & Dashboard
- [ ] Vue calendrier mensuelle avec indicateurs couleur
- [ ] Navigation mois précédent / suivant + tap → Saisie
- [ ] Page Dashboard : totaux + mini graphe recharts
- [ ] UX mobile : tap targets 44px, feedback tactile, safe areas

### Semaine 3 — Export & Déploiement
- [ ] `excelBuilder.ts` avec exceljs — fidélité couleurs modèle source
- [ ] `csvBuilder.ts` — UTF-8 BOM, séparateur `;`, en-têtes IT fixes (test avec UI en AR)
- [ ] Page Export + nommage automatique fichiers
- [ ] Tests export : comparaison totaux avec fichier source
- [ ] `netlify.toml` + CI/CD GitHub + deploy preview
- [ ] Test hors ligne (mode avion)

### Post-MVP (Semaine 4+)
- [ ] Polish i18n arabe (pluriels, formats date)
- [ ] Backend Python FastAPI + openpyxl
- [ ] Rôle Manager + multi-employés
- [ ] PWA + notifications

---

## 8. Stratégie de tests

| Niveau | Outil | Cible |
|--------|-------|-------|
| Unitaire | Vitest | `calcHeures.ts`, `validateHeures.ts` |
| Unitaire | Vitest | `excelBuilder.ts` — totaux, nombre de lignes |
| Intégration | Testing Library | Saisie → calcul affiché → persistence |
| Validation métier | Fixture JSON | 26 jours Hamza mai 2026 → 222,5 / 152 / 70,5 |
| E2E manuel | Netlify preview | Export .xlsx ouvert dans Excel/LibreOffice |

---

## 9. Risques & Mitigations

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| exceljs limité vs openpyxl pour mise en forme | Faible | Couvrir tous les styles du modèle source en Semaine 3 ; openpyxl en V2 si besoin |
| localStorage limité (~5 Mo) | Faible | JSON compact ~200 Ko/an ; alerte utilisateur |
| Tailwind v4 API différente de v3 | Faible | Config CSS-first (`@import "tailwindcss"`) |
| Compatibilité mobile pickers | Faible | `<input type="time">` natif |
| Complexité i18n RTL arabe | Moyen | `dir="rtl"` global, tester sur mobile AR · exports restent IT |
| Fichier Excel rejeté par LibreOffice | Faible | Tester sur Excel Windows + LibreOffice avant release |

---

## 10. Critères d'acceptation MVP

- [ ] Saisie d'un jour complet en **moins de 30 secondes** sur mobile
- [ ] Calcul validé sur les **26 jours** du fichier source → totaux **222,5h / 152,0h / 70,5h**
- [ ] Export `.xlsx` ouvrable dans Excel et LibreOffice avec mise en forme identique au modèle
- [ ] Export `.csv` importable dans Excel Windows sans erreur d'encodage — **en-têtes italien même avec UI arabe**
- [ ] Erreur affichée si sortie < entrée sur un créneau
- [ ] Application fonctionnelle **hors ligne** (localStorage + export client)
- [ ] Déploiement Netlify sur URL publique fonctionnel
- [ ] Mention confidentialité visible dans Paramètres
- [ ] Sélecteur de langue **IT / AR** opérationnel sur tous les écrans
- [ ] Interface arabe en **RTL** complète (navigation, formulaires, calendrier)
- [ ] **Hors scope MVP vérifié** : pas de français, pas de backend, pas de login

---

## 11. Métriques de succès (post-launch)

| Métrique | Cible MVP |
|----------|-----------|
| Temps saisie 1 jour | < 30 s |
| Exactitude calcul vs source | 100 % sur jeu Hamza |
| Taux export réussi | > 95 % |
| Lighthouse mobile Performance | > 80 |

---

*PRD v1.2 — basé sur l'analyse de `Foglio_Presenze_Maggio_2026.xlsx` · Hamza EL-ALAOUI · Juin 2026*
