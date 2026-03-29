import { createContext, useContext, useState, useEffect } from 'react';

// Default content - will be replaced by Strapi API data
const defaultContent = {
  hero: {
    slides: [
      {
        id: 1,
        title: "Meilleure Solution De Cybersécurité & Vidéosurveillance Pour Vous",
        subtitle: "JK IT Solutions protège vos systèmes, vos données et vos infrastructures avec des technologies de pointe adaptées aux entreprises africaines.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
        cta1: { text: "Nos Services", link: "/services" },
        cta2: { text: "Devis Gratuit", link: "/contact" }
      },
      {
        id: 2,
        title: "Solutions De Sécurité Intelligentes Pour Toutes Les Entreprises",
        subtitle: "Tests d'intrusion, protection des données, surveillance réseau — nous sécurisons votre environnement numérique de bout en bout.",
        image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1600&q=80",
        cta1: { text: "Découvrir Plus", link: "/about" },
        cta2: { text: "Nous Contacter", link: "/contact" }
      },
      {
        id: 3,
        title: "Solutions IoT & Intégration Système Pour L'Entreprise Moderne",
        subtitle: "De la consultation IoT à l'analyse des données, nous accompagnons votre transformation digitale avec expertise et excellence.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
        cta1: { text: "Nos Formations", link: "/formations" },
        cta2: { text: "Devis Gratuit", link: "/contact" }
      }
    ]
  },
  about: {
    title: "À Propos De JK IT Solutions",
    text: "Fondée à Yaoundé, JK IT Solutions est une entreprise spécialisée dans la cybersécurité, la vidéosurveillance et les solutions IoT. Nous accompagnons les entreprises, institutions et particuliers dans leur transformation digitale avec rigueur, innovation et excellence. Notre équipe d'experts certifiés met son savoir-faire au service de votre sécurité et de votre performance.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    stats: [
      { label: "Clients Satisfaits", value: 150 },
      { label: "Projets Réalisés", value: 280 },
      { label: "Années d'Expérience", value: 8 },
      { label: "Experts Certifiés", value: 12 }
    ]
  },
  services: [
    { id: 1, icon: "fa-shield-halved", title: "Tests d'Intrusion", description: "Évaluation complète de la résistance de vos systèmes aux cyberattaques. Nos experts simulent des attaques réelles pour identifier vos vulnérabilités." },
    { id: 2, icon: "fa-video", title: "Vidéosurveillance", description: "Conception et installation de systèmes de surveillance intelligents. Caméras HD, analytics vidéo et monitoring en temps réel." },
    { id: 3, icon: "fa-network-wired", title: "Sécurité des Réseaux", description: "Architecture, configuration et maintenance de réseaux sécurisés. Firewall, VPN, détection d'intrusion et segmentation réseau." },
    { id: 4, icon: "fa-lock", title: "Protection des Données", description: "Mise en place de stratégies robustes pour protéger vos données sensibles. Chiffrement, sauvegarde et plan de reprise d'activité." },
    { id: 5, icon: "fa-magnifying-glass-chart", title: "Évaluation de la Sécurité", description: "Audit complet de votre posture de sécurité. Rapport détaillé avec recommandations priorisées et feuille de route." },
    { id: 6, icon: "fa-gauge-high", title: "Optimisation des Réseaux", description: "Analyse et optimisation de vos performances réseau. QoS, load balancing et monitoring proactif pour une infrastructure performante." },
    { id: 7, icon: "fa-microchip", title: "Consultation IoT", description: "Conseil et accompagnement dans vos projets IoT. Architecture, sécurité des objets connectés et intégration avec vos systèmes existants." },
    { id: 8, icon: "fa-gears", title: "Intégration Système", description: "Intégration de solutions technologiques complexes dans votre SI. APIs, middleware et interconnexion de vos outils métier." },
    { id: 9, icon: "fa-chalkboard-user", title: "Formation & Ateliers", description: "Programmes de formation personnalisés pour vos équipes. Cybersécurité, gestion des risques, bonnes pratiques IT." },
    { id: 10, icon: "fa-chart-line", title: "Analyse des Données IoT", description: "Collecte, traitement et visualisation des données de vos capteurs IoT. Tableaux de bord temps réel et alertes intelligentes." },
    { id: 11, icon: "fa-scale-balanced", title: "Conformité Réglementaire", description: "Accompagnement vers la conformité aux normes ISO 27001, RGPD et réglementations camerounaises en vigueur." },
    { id: 12, icon: "fa-flask", title: "Recherche & Développement", description: "Innovation technologique et développement de solutions sur mesure. Veille technologique et prototypage de nouvelles solutions de sécurité." }
  ],
  formations: [
    { id: 1, title: "Cybersécurité pour Non-Techniciens", duration: "2 jours", price: "75 000 FCFA", date: "15 Avril 2026", image: "https://images.unsplash.com/photo-1573165231977-3f0e27806045?w=600&q=80", description: "Comprendre les risques cyber et adopter les bonnes pratiques au quotidien. Idéal pour les managers et équipes non-techniques.", level: "Débutant" },
    { id: 2, title: "Administration Réseau & Sécurité", duration: "5 jours", price: "180 000 FCFA", date: "22 Avril 2026", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", description: "Configuration des équipements réseau, mise en place de pare-feux et VPN. Formation pratique sur matériel réel.", level: "Intermédiaire" },
    { id: 3, title: "Ethical Hacking & Pentest", duration: "5 jours", price: "250 000 FCFA", date: "6 Mai 2026", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80", description: "Techniques offensives pour mieux défendre. Kali Linux, Metasploit, OWASP. Préparation certification CEH.", level: "Avancé" },
    { id: 4, title: "Installation Systèmes de Surveillance", duration: "3 jours", price: "120 000 FCFA", date: "13 Mai 2026", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80", description: "Conception, installation et configuration de systèmes CCTV IP. Caméras PTZ, NVR, gestion à distance.", level: "Intermédiaire" },
    { id: 5, title: "Introduction à l'IoT & Sécurité", duration: "3 jours", price: "110 000 FCFA", date: "20 Mai 2026", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", description: "Fondamentaux de l'Internet des Objets, protocoles de communication et sécurisation des déploiements IoT.", level: "Débutant" },
    { id: 6, title: "ISO 27001 & Conformité", duration: "4 jours", price: "200 000 FCFA", date: "3 Juin 2026", image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&q=80", description: "Mise en place d'un SMSI conforme ISO 27001. Analyse de risques, politique de sécurité et audit interne.", level: "Avancé" }
  ],
  team: [
    { id: 1, name: "Jean-Kevin Nguetsop", role: "Fondateur & CEO", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", linkedin: "#", twitter: "#" },
    { id: 2, name: "Aline Fotso", role: "Directrice Technique", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80", linkedin: "#", twitter: "#" },
    { id: 3, name: "Boris Tchambou", role: "Expert Cybersécurité", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", linkedin: "#", twitter: "#" },
    { id: 4, name: "Carine Mballa", role: "Ingénieure Réseau", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", linkedin: "#", twitter: "#" }
  ],
  testimonials: [
    { id: 1, name: "Paul Etoa", role: "DSI, Banque Atlantique Cameroun", text: "JK IT Solutions a réalisé un audit complet de notre infrastructure. Leur professionnalisme et la qualité de leur rapport ont dépassé nos attentes. Les recommandations ont considérablement renforcé notre sécurité.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", rating: 5 },
    { id: 2, name: "Sandrine Beyala", role: "DG, Hôtel La Falaise Yaoundé", text: "L'installation de notre système de vidéosurveillance par JK IT Solutions a été impeccable. Interface intuitive, support réactif et prix compétitifs. Je recommande vivement.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", rating: 5 },
    { id: 3, name: "Romuald Nkomo", role: "Responsable IT, MTN Cameroun", text: "Nous faisons appel à JK IT Solutions pour nos formations en cybersécurité depuis 2 ans. Formateurs compétents, contenu adapté au contexte africain. Nos équipes sont montées en compétences rapidement.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", rating: 5 }
  ],
  contact: {
    address: "Quartier Nkomo, Yaoundé, Cameroun",
    email: "juslinkutche@gmail.com",
    phone: "+237 6 94 16 46 68",
    hours: "Lun - Ven : 8h - 18h",
    facebook: "https://web.facebook.com/profile.php?id=61574640522614",
    linkedin: "#",
    whatsapp: "+237694164668"
  },
  projects: [
    {
      id: 1,
      title: "Sécurisation Infrastructure Réseau",
      description: "Mise en place d'un système de détection d'intrusion et segmentation réseau complète pour une banque régionale avec 500+ postes.",
      category: "Cybersécurité",
      client: "Banque Atlantique Cameroun",
      progress: 85,
      status: "En cours",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
      startDate: "Janv. 2026",
      endDate: "Avr. 2026"
    },
    {
      id: 2,
      title: "Déploiement Vidéosurveillance Campus",
      description: "Installation de 120 caméras IP HD avec système d'analyse vidéo intelligente et monitoring centralisé 24/7.",
      category: "Vidéosurveillance",
      client: "ENSPY Yaoundé",
      progress: 100,
      status: "Terminé",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80",
      startDate: "Oct. 2025",
      endDate: "Janv. 2026"
    },
    {
      id: 3,
      title: "Plateforme IoT Gestion Énergie",
      description: "Développement d'une solution IoT pour monitorer et optimiser la consommation énergétique de bâtiments industriels en temps réel.",
      category: "IoT",
      client: "AES-SONEL",
      progress: 60,
      status: "En cours",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
      startDate: "Fév. 2026",
      endDate: "Juil. 2026"
    },
    {
      id: 4,
      title: "Audit ISO 27001 & Conformité",
      description: "Audit complet de la posture sécurité et accompagnement vers la certification ISO 27001 d'un opérateur télécom.",
      category: "Audit",
      client: "MTN Cameroun",
      progress: 40,
      status: "En cours",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&q=80",
      startDate: "Mars 2026",
      endDate: "Sept. 2026"
    },
    {
      id: 5,
      title: "Formation Cybersécurité Équipes IT",
      description: "Programme de formation intensive de 30 techniciens IT sur les meilleures pratiques de cybersécurité et la gestion des incidents.",
      category: "Formation",
      client: "Orange Cameroun",
      progress: 100,
      status: "Terminé",
      image: "https://images.unsplash.com/photo-1573165231977-3f0e27806045?w=600&q=80",
      startDate: "Janv. 2026",
      endDate: "Fév. 2026"
    }
  ],
  packs: [
    {
      id: 1,
      title: "Pack Essentiel CCTV",
      badge: "",
      featured: false,
      items: [
        "3 caméras IP HD 2MP",
        "1 disque dur 500 Go",
        "Installation complète",
        "Configuration à distance",
        "Support 30 jours"
      ],
      originalPrice: 350000,
      promoPrice: 299000,
      currency: "FCFA",
      expiresAt: "",
      cta: "Commander ce pack",
      active: true
    },
    {
      id: 2,
      title: "Pack Sécurité Pro",
      badge: "🔥 Best-seller",
      featured: true,
      items: [
        "8 caméras IP HD 4MP",
        "1 disque dur 2 To",
        "NVR 8 canaux inclus",
        "Installation & câblage",
        "Accès mobile (iOS/Android)",
        "Maintenance 3 mois offerte"
      ],
      originalPrice: 850000,
      promoPrice: 699000,
      currency: "FCFA",
      expiresAt: "2026-04-30",
      cta: "Profiter de l'offre",
      active: true
    },
    {
      id: 3,
      title: "Pack Audit + Pentest",
      badge: "⚡ Offre limitée",
      featured: false,
      items: [
        "Audit sécurité complet",
        "Test d'intrusion réseau",
        "Rapport détaillé PDF",
        "Recommandations priorisées",
        "Session de restitution 2h"
      ],
      originalPrice: 500000,
      promoPrice: 380000,
      currency: "FCFA",
      expiresAt: "2026-04-15",
      cta: "Réserver l'audit",
      active: true
    }
  ],
  siteConfig: {
    companyName: "JK IT Solutions",
    slogan: "Innovation · Expertise · Excellence",
    logo: null
  }
};

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('jkits_content');
      if (!saved) return defaultContent;
      const parsed = JSON.parse(saved);
      // Deep merge: ensure new keys added to defaultContent are always present
      return { ...defaultContent, ...parsed };
    } catch { return defaultContent; }
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('jkits_content', JSON.stringify(content));
  }, [content]);

  const updateContent = (section, data) => {
    setContent(prev => ({ ...prev, [section]: data }));
  };

  const updateNestedContent = (section, key, data) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: data }
    }));
  };

  const resetContent = () => {
    setContent(defaultContent);
    localStorage.removeItem('jkits_content');
  };

  return (
    <CMSContext.Provider value={{ content, updateContent, updateNestedContent, isAdmin, setIsAdmin, resetContent, defaultContent }}>
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used within CMSProvider');
  return ctx;
};
