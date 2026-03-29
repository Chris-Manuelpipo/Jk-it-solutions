# JK IT Solutions — Site Vitrine React

Site vitrine professionnel avec back-office intégré pour **JK IT Solutions**, entreprise camerounaise spécialisée en cybersécurité, vidéosurveillance et IoT.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# 1. Aller dans le dossier du projet
cd jk-it-solutions

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
# → Ouvre http://localhost:3000
```

### Build production

```bash
npm run build
# Les fichiers sont dans le dossier /dist
```

---

## 🗂️ Structure du projet

```
src/
├── components/
│   ├── layout/          # Navbar, Footer, Layout
│   ├── sections/        # Hero, Stats, Services, Formations, etc.
│   ├── ui/              # PageHeader (réutilisable)
│   └── admin/           # Composants du back-office
├── context/
│   └── CMSContext.jsx   # Gestion du contenu éditable
├── pages/               # Home, About, Services, Formations, Contact, Admin
└── index.css            # Styles globaux (thème vert/noir/blanc)
```

---

## 🎨 Back-Office Admin

**URL d'accès :** `http://localhost:3000/admin`

**Identifiants par défaut :**
- Utilisateur : `admin`
- Mot de passe : `jkits2025`

### Ce que le client peut modifier :

| Section | Contenu modifiable |
|---|---|
| **Carousel Hero** | Images, titres, descriptions, boutons CTA |
| **À Propos** | Texte, image, statistiques |
| **Services** | Titre, description, icône — Ajouter/Supprimer |
| **Formations** | Titre, description, prix, date, image, niveau — CRUD complet |
| **Témoignages** | Nom, rôle, texte, photo, note — CRUD complet |
| **Contact** | Adresse, téléphone, email, réseaux sociaux, slogan |

> ⚠️ Pour le moment, les données sont sauvegardées dans `localStorage`. Pour une vraie persistance, connecter Strapi (voir section Migration).

---

## 📡 Migration vers Strapi CMS

### 1. Installer Strapi

```bash
npx create-strapi-app@latest jk-strapi --quickstart
# Lance sur http://localhost:1337/admin
```

### 2. Créer les Collections dans Strapi

Créer ces Content Types dans l'interface Strapi :
- `Hero` (slides)
- `Service`
- `Formation`
- `Temoignage`
- `About`
- `Contact`

### 3. Activer les permissions

Dans Strapi → Settings → Roles → Public → cocher `find` et `findOne` pour chaque collection.

### 4. Remplacer CMSContext

Modifier `src/context/CMSContext.jsx` pour fetcher depuis l'API :

```js
// Exemple pour les formations
const [formations, setFormations] = useState([]);

useEffect(() => {
  fetch('http://localhost:1337/api/formations')
    .then(r => r.json())
    .then(data => setFormations(data.data.map(d => d.attributes)));
}, []);
```

---

## 🌐 Déploiement

### Frontend React → Vercel (gratuit)

```bash
npm install -g vercel
vercel
```

### Strapi → Railway (gratuit tier hobby)

1. Créer un compte sur [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Ajouter les variables d'environnement Strapi

---

## 🎨 Personnalisation des couleurs

Modifier les variables CSS dans `src/index.css` :

```css
:root {
  --primary: #1a7a3c;      /* Vert principal */
  --primary-dark: #0f5228; /* Vert foncé */
  --accent: #39d46a;       /* Vert lumineux */
  --dark: #0d0d0d;         /* Noir */
}
```

---

## 📱 Pages du site

| Route | Page |
|---|---|
| `/` | Accueil |
| `/about` | À Propos |
| `/services` | Services |
| `/formations` | Formations |
| `/contact` | Contact |
| `/admin` | Back-Office |

---

## 🔒 Changer le mot de passe admin

Dans `src/pages/Admin.jsx`, modifier :

```js
const ADMIN_CREDENTIALS = { username: 'admin', password: 'jkits2025' };
```

> En production avec Strapi, utiliser le système d'authentification Strapi Users & Permissions.

---

## 📞 Contact développeur

Développé par **Chris** — ENSPY, Yaoundé, Cameroun
# Jk-it-solutions
