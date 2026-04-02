# JK IT Solutions — Site Vitrine Professionnel

Site vitrine avec back-office intégré pour **JK IT Solutions**, entreprise camerounaise spécialisée en cybersécurité, vidéosurveillance et IoT.

---

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Démarrage](#démarrage)
- [Structure du Projet](#structure-du-projet)
- [Back-Office Admin](#back-office-admin)
- [API Strapi](#api-strapi)
- [Déploiement](#déploiement)
- [Personnalisation](#personnalisation)

---

## Fonctionnalités

### Pages Publiques
| Route | Description |
|-------|-------------|
| `/` | Accueil avec hero animé, statistiques, services, formations, témoignages |
| `/about` | À propos avec présentation et statistiques |
| `/services` | Catalogue complet des services (cybersécurité, vidéosurveillance, IoT) |
| `/formations` | Formations professionnelles avec niveaux et tarifs |
| `/projects` | Projets-realisations |
| `/packs` | Packs tarifaires |
| `/contact` | Formulaire de contact et informations |

### Back-Office Admin
- **Authentification** : Login sécurisé avec identifiants
- **Gestion du Hero** : Images, titres, descriptions, boutons CTA
- **Gestion des Services** : CRUD complet (ajouter, modifier, supprimer)
- **Gestion des Formations** : CRUD complet avec prix, dates, niveaux
- **Gestion des Projets** : Ajout, modification, suppression de projets
- **Gestion des Packs** : Gestion des offres tarifaires
- **Gestion des Témoignages** : CRUD avec notes et photos
- **Gestion À Propos** : Texte, image, statistiques
- **Gestion Contact** : Adresse, téléphone, email, réseaux sociaux

### Fonctionnalités Techniques
- Animations fluides avec Intersection Observer
- Carrousel Swiper pour le hero et les témoignages
- Compteurs animés avec CountUp
- Design responsive (mobile-first)
- Thème personnalisable via CSS variables
- API REST pour intégration Strapi
- Stockage local (localStorage) ou Strapi

---

## Technologies

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18.3.1 | Framework UI |
| **React Router DOM** | 6.26.0 | Routage |
| **Vite** | 5.4.1 | Build tool |
| **React Icons** | 5.3.0 | Icônes |
| **React CountUp** | 6.5.3 | Compteurs animés |
| **React Intersection Observer** | 9.13.0 | Animations au scroll |
| **Swiper** | 11.1.9 | Carrousels |
| **Axios** | 1.7.5 | Requêtes HTTP |

### Backend (Optionnel)
- **Strapi** : CMS headless pour la gestion de contenu

---

## Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd jk-it-solutions

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
# → http://localhost:3000
```

### Build Production

```bash
npm run build
# → Sortie dans /dist
```

---

## Structure du Projet

```
src/
├── api/
│   ├── strapi.js          # API client Strapi (lecture)
│   └── strapiAdmin.js     # API client Strapi (admin)
├── components/
│   ├── admin/             # Composants back-office
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminHero.jsx
│   │   ├── AdminServices.jsx
│   │   ├── AdminFormations.jsx
│   │   ├── AdminProjects.jsx
│   │   ├── AdminPacks.jsx
│   │   ├── AdminTestimonials.jsx
│   │   ├── AdminAbout.jsx
│   │   └── AdminContact.jsx
│   ├── layout/            # Structure du site
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── sections/          # Sections des pages
│   │   ├── Hero.jsx
│   │   ├── Stats.jsx
│   │   ├── ServicesPreview.jsx
│   │   ├── FormationsPreview.jsx
│   │   ├── Testimonials.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── PacksSection.jsx
│   │   ├── CTABanner.jsx
│   │   └── AboutPreview.jsx
│   └── ui/                # Composants réutilisables
│       └── PageHeader.jsx
├── context/
│   └── CMSContext.jsx     # Gestion globale du contenu
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Formations.jsx
│   ├── Projects.jsx
│   ├── Packs.jsx
│   ├── Contact.jsx
│   ├── Admin.jsx
│   └── NotFound.jsx
├── App.jsx                # Routing principal
├── main.jsx               # Point d'entrée
└── index.css              # Styles globaux (thème vert/noir)
```

---

## Back-Office Admin

### Accès
- **URL** : `http://localhost:3000/admin`

### Identification

Les identifiants sont ceux du CMS Strapi sur https://jk-strapi.onrender.com/

---

## API Strapi

Le CMS Strapi est déjà déployé et accessible à l'adresse :
**https://jk-strapi.onrender.com/**

### Collections créées

| Content Type | Champs |
|--------------|--------|
| `Hero` | image, title, subtitle, ctaText, ctaLink |
| `Service` | title, description, icon, isActive |
| `Formation` | title, description, price, level, date, image |
| `Project` | title, description, image, category |
| `Pack` | name, price, features, isPopular |
| `Temoignage` | name, role, text, rating, photo |
| `About` | title, content, image, stats |
| `Contact` | address, phone, email, socialLinks |

### Permissions

Aller dans Strapi → **Settings → Roles → Public** et activer `find` et `findOne` pour chaque collection.

### Configuration API

Le projet est déjà configuré pour utiliser Strapi via `src/api/strapi.js` et `src/api/strapiAdmin.js`.

---

## Personnalisation

### Couleurs

Modifier les variables CSS dans `src/index.css` :

```css
:root {
  --primary: #1a7a3c;       /* Vert principal */
  --primary-dark: #0f5228;  /* Vert foncé */
  --accent: #39d46a;        /* Vert lumineux */
  --dark: #0d0d0d;          /* Noir */
  --light: #ffffff;         /* Blanc */
  --gray: #6b7280;          /* Gris */
}
```

---

## Licence

Développé par **Chris** — ENSPY, Yaoundé, Cameroun