// src/context/CMSContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchStrapi, resolveImage } from '../api/strapi';

// ─── Données en dur (fallback + premières données du site) ───
const defaultContent = {
  hero: {
    slides: [
      {
        id: 1,
        title: "Meilleure Solution De Cybersécurité & Vidéosurveillance Pour Vous",
        subtitle: "JK IT Solutions protège vos systèmes avec des technologies de pointe adaptées aux entreprises africaines.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
        cta1: { text: "Nos Services", link: "/services" },
        cta2: { text: "Devis Gratuit", link: "/contact" },
      },
      {
        id: 2,
        title: "Solutions De Sécurité Intelligentes Pour Toutes Les Entreprises",
        subtitle: "Tests d'intrusion, protection des données, surveillance réseau — de bout en bout.",
        image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1600&q=80",
        cta1: { text: "Découvrir Plus", link: "/about" },
        cta2: { text: "Nous Contacter", link: "/contact" },
      },
      {
        id: 3,
        title: "Solutions IoT & Intégration Système Pour L'Entreprise Moderne",
        subtitle: "De la consultation IoT à l'analyse des données, nous accompagnons votre transformation digitale.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
        cta1: { text: "Nos Formations", link: "/formations" },
        cta2: { text: "Devis Gratuit", link: "/contact" },
      },
    ],
  },
  about: {
    title: "À Propos De JK IT Solutions",
    text: "Fondée à Yaoundé, JK IT Solutions est spécialisée dans la cybersécurité, la vidéosurveillance et les solutions IoT.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    stats: [
      { label: "Clients Satisfaits",  value: 150 },
      { label: "Projets Réalisés",    value: 280 },
      { label: "Années d'Expérience", value: 8   },
      { label: "Experts Certifiés",   value: 12  },
    ],
  },
  services: [
    { id: 1,  icon: "fa-shield-halved",        title: "Tests d'Intrusion",          description: "Évaluation complète de la résistance de vos systèmes aux cyberattaques." },
    { id: 2,  icon: "fa-video",                title: "Vidéosurveillance",           description: "Conception et installation de systèmes de surveillance intelligents." },
    { id: 3,  icon: "fa-network-wired",        title: "Sécurité des Réseaux",        description: "Architecture, configuration et maintenance de réseaux sécurisés." },
    { id: 4,  icon: "fa-lock",                 title: "Protection des Données",      description: "Stratégies robustes pour protéger vos données sensibles." },
    { id: 5,  icon: "fa-magnifying-glass-chart",title: "Évaluation de la Sécurité", description: "Audit complet de votre posture de sécurité." },
    { id: 6,  icon: "fa-gauge-high",           title: "Optimisation des Réseaux",    description: "Analyse et optimisation de vos performances réseau." },
    { id: 7,  icon: "fa-microchip",            title: "Consultation IoT",            description: "Conseil et accompagnement dans vos projets IoT." },
    { id: 8,  icon: "fa-gears",                title: "Intégration Système",         description: "Intégration de solutions technologiques complexes dans votre SI." },
    { id: 9,  icon: "fa-chalkboard-user",      title: "Formation & Ateliers",        description: "Programmes de formation personnalisés pour vos équipes." },
    { id: 10, icon: "fa-chart-line",           title: "Analyse des Données IoT",     description: "Collecte, traitement et visualisation des données de vos capteurs IoT." },
    { id: 11, icon: "fa-scale-balanced",       title: "Conformité Réglementaire",    description: "Accompagnement vers la conformité aux normes ISO 27001 et RGPD." },
    { id: 12, icon: "fa-flask",                title: "Recherche & Développement",   description: "Innovation technologique et développement de solutions sur mesure." },
  ],
  formations: [
    { id: 1, title: "Cybersécurité pour Non-Techniciens",    duration: "2 jours", price: "75 000 FCFA",  date: "15 Avril 2026", level: "Débutant",      image: "https://images.unsplash.com/photo-1573165231977-3f0e27806045?w=600&q=80", description: "Comprendre les risques cyber et adopter les bonnes pratiques." },
    { id: 2, title: "Administration Réseau & Sécurité",      duration: "5 jours", price: "180 000 FCFA", date: "22 Avril 2026", level: "Intermédiaire", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", description: "Configuration des équipements réseau, pare-feux et VPN." },
    { id: 3, title: "Ethical Hacking & Pentest",             duration: "5 jours", price: "250 000 FCFA", date: "6 Mai 2026",    level: "Avancé",        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80", description: "Techniques offensives pour mieux défendre. Kali Linux, Metasploit, OWASP." },
    { id: 4, title: "Installation Systèmes de Surveillance", duration: "3 jours", price: "120 000 FCFA", date: "13 Mai 2026",   level: "Intermédiaire", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80", description: "Conception, installation et configuration de systèmes CCTV IP." },
    { id: 5, title: "Introduction à l'IoT & Sécurité",       duration: "3 jours", price: "110 000 FCFA", date: "20 Mai 2026",   level: "Débutant",      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", description: "Fondamentaux de l'IoT, protocoles de communication et sécurisation." },
    { id: 6, title: "ISO 27001 & Conformité",                duration: "4 jours", price: "200 000 FCFA", date: "3 Juin 2026",   level: "Avancé",        image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&q=80", description: "Mise en place d'un SMSI conforme ISO 27001." },
  ],
  packs: [
    { id: 1, title: "Pack Essentiel CCTV",  badge: "",                featured: false, items: ["3 caméras IP HD 2MP","1 disque dur 500 Go","Installation complète","Configuration à distance","Support 30 jours"],                                                           originalPrice: 350000, promoPrice: 299000, currency: "FCFA", expiresAt: "",             cta: "Commander ce pack",  active: true },
    { id: 2, title: "Pack Sécurité Pro",    badge: "🔥 Best-seller",  featured: true,  items: ["8 caméras IP HD 4MP","1 disque dur 2 To","NVR 8 canaux inclus","Installation & câblage","Accès mobile (iOS/Android)","Maintenance 3 mois offerte"],                         originalPrice: 850000, promoPrice: 699000, currency: "FCFA", expiresAt: "2026-04-30",   cta: "Profiter de l'offre", active: true },
    { id: 3, title: "Pack Audit + Pentest", badge: "⚡ Offre limitée", featured: false, items: ["Audit sécurité complet","Test d'intrusion réseau","Rapport détaillé PDF","Recommandations priorisées","Session de restitution 2h"],                                          originalPrice: 500000, promoPrice: 380000, currency: "FCFA", expiresAt: "2026-04-15",   cta: "Réserver l'audit",   active: true },
  ],
  projects: [
    { id: 1, title: "Sécurisation Infrastructure MTN",        description: "Audit et sécurisation complète.",         category: "Cybersécurité",     client: "MTN Cameroun",     progress: 100, status: "Terminé",   image: "https://images.unsplash.com/photo-1573165231977-3f0e27806045?w=600&q=80", startDate: "Oct. 2025",  endDate: "Nov. 2025" },
    { id: 2, title: "Vidéosurveillance Hôtel La Falaise",     description: "Installation 24 caméras IP 4K.",          category: "Vidéosurveillance", client: "Hôtel La Falaise", progress: 100, status: "Terminé",   image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80", startDate: "Déc. 2025",  endDate: "Janv. 2026" },
    { id: 3, title: "Déploiement IoT Entrepôt Logistique",    description: "Capteurs IoT pour monitoring en temps réel.", category: "IoT",            client: "Campost",          progress: 75,  status: "En cours",  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", startDate: "Fév. 2026",  endDate: "" },
  ],
  testimonials: [
    { id: 1, name: "Paul Etoa",       role: "DSI, Banque Atlantique Cameroun", text: "JK IT Solutions a réalisé un audit complet de notre infrastructure. Leur professionnalisme a dépassé nos attentes.",                                                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", rating: 5 },
    { id: 2, name: "Sandrine Beyala", role: "DG, Hôtel La Falaise Yaoundé",    text: "L'installation de notre système de vidéosurveillance a été impeccable. Interface intuitive, support réactif.",                                                            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", rating: 5 },
    { id: 3, name: "Romuald Nkomo",   role: "Responsable IT, MTN Cameroun",    text: "Nous faisons appel à JK IT Solutions pour nos formations depuis 2 ans. Contenu adapté au contexte africain, équipes rapidement montées en compétences.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", rating: 5 },
  ],
  contact: {
    address:  "Quartier Nkomo, Yaoundé, Cameroun",
    email:    "juslinkutche@gmail.com",
    phone:    "+237 6 94 16 46 68",
    whatsapp: "+237694164668",
    hours:    "Lun - Ven : 8h - 18h",
    facebook: "https://web.facebook.com/profile.php?id=61574640522614",
    linkedin: "",
    instagram: "",
    tiktok: "",
  },
  siteConfig: {
    companyName: "JK IT Solutions",
    slogan:      "Innovation · Expertise · Excellence",
    logo: null,
  },
  team: [
    { id: 1, name: "Juslin Kutche", role: "Fondateur & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", linkedin: "" },
    { id: 2, name: "Sandrine Mbida", role: "Responsable Cybersécurité", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80", linkedin: "" },
    { id: 3, name: "Arnaud Foto", role: "Ingénieur IoT", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80", linkedin: "" },
    { id: 4, name: "Carine Nguema", role: "Formatrice Certifiée", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80", linkedin: "" },
  ],
};

// ─── Transformateurs Strapi → format des composants ───────────
const toSlide = (item) => ({
  id: item.id, documentId: item.documentId,
  title:    item.title,
  subtitle: item.subtitle,
  image:    resolveImage(item) || item.image_url || '',
  cta1: { text: item.cta1_text || 'Voir plus',     link: item.cta1_link || '/services' },
  cta2: { text: item.cta2_text || 'Devis Gratuit', link: item.cta2_link || '/contact'  },
});

const toService = (item) => ({
  id: item.id, documentId: item.documentId,
  icon: item.icon || 'fa-shield-halved', title: item.title, description: item.description, active: item.active !== false,
});

const toFormation = (item) => ({
  id: item.id, documentId: item.documentId,
  title: item.title, description: item.description, duration: item.duration || '',
  price: item.price || '', date: item.date || '', level: item.level || 'Débutant',
  image: resolveImage(item) || item.image_url || '',
});

const toPack = (item) => ({
  id: item.id, documentId: item.documentId,
  title: item.title, badge: item.badge || '', featured: item.featured || false, items: item.items || [],
  originalPrice: item.original_price ?? item.originalPrice ?? 0,
  promoPrice: item.promo_price ?? item.promoPrice ?? 0,
  currency: item.currency || 'FCFA', expiresAt: item.expires_at || item.expiresAt || '',
  cta: item.cta || 'Commander', active: item.active !== false,
});

const toProject = (item) => ({
  id: item.id, documentId: item.documentId,
  title: item.title, description: item.description, category: item.category || 'Autre',
  client: item.client || '', progress: item.progress ?? 100,
  status: item.statuse || 'Terminé',
  image: resolveImage(item) || item.image_url || '',
  startDate: item.start_date || item.startDate || '',
  endDate: item.end_date || item.endDate || '',
});

const toTestimonial = (item) => ({
  id: item.id, documentId: item.documentId,
  name: item.name, role: item.role, text: item.text,
  avatar: resolveImage(item) || item.avatar_url || '',
  rating: item.rating || 5,
});

const toAbout = (item) => ({
  id: item.id, documentId: item.documentId,
  title: item.title || '', text: item.text || '',
  image: resolveImage(item) || item.image_url || '',
  stats: [
    { label: "Clients Satisfaits",   value: item.stat_clients  || 0 },
    { label: "Projets Réalisés",     value: item.stat_projects || 0 },
    { label: "Années d'Expérience",  value: item.stat_years    || 0 },
    { label: "Experts Certifiés",    value: item.stat_experts  || 0 },
  ],
});

const toContact = (item) => ({
  id: item.id, documentId: item.documentId,
  address: item.address || '', email: item.email || '', phone: item.phone || '',
  whatsapp: item.whatsapp || '', hours: item.hours || '',
  facebook: item.facebook || '', linkedin: item.linkedin || '',
  tiktok: item.tiktok || '', instagram: item.instagram || '',
});

const toSiteConfig = (item) => ({
  id: item.id, documentId: item.documentId,
  companyName: item.company_name || 'JK IT Solutions',
  slogan: item.slogan || '', logo: resolveImage(item) || null,
});

const toTeamMember = (item) => ({
  id: item.id, documentId: item.documentId,
  name: item.name, role: item.role,
  image: resolveImage(item) || item.image_url || '',
  linkedin: item.linkedin || '', facebook: item.facebook || '', whatsapp: item.whatsapp || '',
});

// ─── Fetch complet depuis Strapi ──────────────────────────────
async function fetchAllFromStrapi() {
  const [
    heroSlides, services, formations, packs,
    projects, testimonials, about, contactInfo, siteConfig, team,
  ] = await Promise.all([
    fetchStrapi('hero-slides?sort[0]=order:asc&filters[active][$eq]=true&populate=*'),
    fetchStrapi('services?sort[0]=order:asc&filters[active][$eq]=true&populate=*'),
    fetchStrapi('formations?sort[0]=order:asc&populate=*'),
    fetchStrapi('packs?sort[0]=order:asc&filters[active][$eq]=true&populate=*'),
    fetchStrapi('projects?sort[0]=order:asc&populate=*'),
    fetchStrapi('testimonials?sort[0]=order:asc&populate=*'),
    fetchStrapi('abouts?populate=*'),
    fetchStrapi('contact-info?populate=*'),
    fetchStrapi('site-config?populate=*'),
    fetchStrapi('team-members?sort[0]=order:asc&populate=*'),
  ]);

  // Helper pour extraire les données (handle both array and single type responses)
  const extract = (data) => {
    if (!data) return null;
    if (Array.isArray(data)) return data;
    if (data.data) return Array.isArray(data.data) ? data.data : [data.data];
    return [data];
  };

  const heroData = extract(heroSlides);
  const servicesData = extract(services);
  const formationsData = extract(formations);
  const packsData = extract(packs);
  const projectsData = extract(projects);
  const testimonialsData = extract(testimonials);
  const aboutData = extract(about);
  const teamData = extract(team);

  // Single types (no array)
  const contactRaw = contactInfo?.data || contactInfo;
  const siteConfigRaw = siteConfig?.data || siteConfig;

  return {
    hero: {
      slides: (heroData && heroData.length > 0)
        ? heroData.map(toSlide)
        : defaultContent.hero.slides
    },
    services: (servicesData && servicesData.length > 0)
      ? servicesData.map(toService)
      : defaultContent.services,
    formations: (formationsData && formationsData.length > 0)
      ? formationsData.map(toFormation)
      : defaultContent.formations,
    packs: (packsData && packsData.length > 0)
      ? packsData.map(toPack)
      : defaultContent.packs,
    projects: (projectsData && projectsData.length > 0)
      ? projectsData.map(toProject)
      : defaultContent.projects,
    testimonials: (testimonialsData && testimonialsData.length > 0)
      ? testimonialsData.map(toTestimonial)
      : defaultContent.testimonials,
    about: (aboutData && aboutData.length > 0)
      ? toAbout(aboutData[0])
      : defaultContent.about,
    contact: contactRaw
      ? toContact(contactRaw)
      : defaultContent.contact,
    siteConfig: siteConfigRaw
      ? toSiteConfig(siteConfigRaw)
      : defaultContent.siteConfig,
    team: (teamData && teamData.length > 0)
      ? teamData.map(toTeamMember)
      : defaultContent.team,
  };
}

// ─── Context ──────────────────────────────────────────────────
const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  const [content, setContent]     = useState(defaultContent);
  const [isAdmin, setIsAdmin]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [strapiOk, setStrapiOk]   = useState(false);

  const refreshContent = async () => {
    try {
      const strapiData = await fetchAllFromStrapi();
      setContent(strapiData);
      setStrapiOk(true);
    } catch (err) {
      console.warn('Erreur refresh:', err.message);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const strapiData = await fetchAllFromStrapi();
        setContent(strapiData);
        setStrapiOk(true);
      } catch (err) {
        console.warn('Strapi indisponible, utilisation des données par défaut.', err.message);
        setStrapiOk(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateContent = (section, data) =>
    setContent(prev => ({ ...prev, [section]: data }));

  const updateNestedContent = (section, key, data) =>
    setContent(prev => ({ ...prev, [section]: { ...prev[section], [key]: data } }));

  return (
    <CMSContext.Provider value={{
      content,
      loading,
      strapiOk,
      isAdmin, setIsAdmin,
      updateContent,
      updateNestedContent,
      refreshContent,
      defaultContent,
    }}>
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used within CMSProvider');
  return ctx;
};