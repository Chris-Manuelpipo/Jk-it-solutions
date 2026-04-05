import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import '../../pages/Projects.css';

const CATEGORY_COLORS = {
    'Cybersécurité': { bg: '#1e40af', gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)' },
    'Vidéosurveillance': { bg: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
    'IoT': { bg: '#0891b2', gradient: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
    'Audit': { bg: '#b45309', gradient: 'linear-gradient(135deg, #b45309, #fbbf24)' },
    'Formation': { bg: '#16a34a', gradient: 'linear-gradient(135deg, #16a34a, #4ade80)' },
    'Réseau': { bg: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #f87171)' },
    'Autre': { bg: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)' },
};

const getColor = (cat) => CATEGORY_COLORS[cat] || { bg: '#1e40af', gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)' };

// Circular SVG gauge component
function CircularGauge({ progress, color, animated }) {
    const r = 27;
    const circ = 2 * Math.PI * r;
    const offset = animated ? circ - (progress / 100) * circ : circ;

    return (
        <div className="circular-gauge-wrap">
            <svg className="circular-gauge-svg" viewBox="0 0 68 68">
                <circle className="gauge-track" cx="34" cy="34" r={r} />
                <circle
                    className="gauge-fill"
                    cx="34"
                    cy="34"
                    r={r}
                    stroke={color}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="gauge-label">
                <span className="gauge-percent">{progress}</span>
                <span className="gauge-unit">%</span>
            </div>
        </div>
    );
}

function ProjectCard({ project }) {
    const ref = useRef(null);
    const [animated, setAnimated] = useState(false);
    const color = getColor(project.category);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect(); } },
            { threshold: 0.3 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="project-card" ref={ref}>
            <div className="project-card-img">
                <img src={project.image} alt={project.title} loading="lazy" />
                <span
                    className="project-category-badge"
                    style={{ background: color.gradient }}
                >
                    {project.category}
                </span>
                <span className={`project-status-badge ${project.status === 'Terminé' ? 'status-done' : 'status-progress'}`}>
                    {project.status === 'Terminé' ? '✓ Terminé' : '⟳ En cours'}
                </span>
            </div>

            <div className="project-card-body">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description}</p>
                <div className="project-card-meta">
                    <span><i className="fas fa-building" /> {project.client}</span>
                </div>
            </div>

            <div className="project-card-footer">
                <CircularGauge progress={project.progress} color={color.bg} animated={animated} />
                <div className="gauge-info">
                    <div className="gauge-info-label">Avancement du projet</div>
                    <div className="gauge-bar-wrapper">
                        <div
                            className="gauge-bar-fill"
                            style={{
                                width: animated ? `${project.progress}%` : '0%',
                                background: color.gradient,
                            }}
                        />
                    </div>
                    <div className="gauge-dates">
                        <i className="fas fa-calendar-alt" style={{ fontSize: '0.7rem' }} />
                        {project.startDate} → {project.endDate}
                    </div>
                </div>
            </div>
        </div>
    );
}

const ALL_CATEGORIES = 'Tous';

export default function ProjectsSection({ preview = false }) {
    const { content } = useCMS();
    const projects = content.projects || [];
    const [activeFilter, setActiveFilter] = useState(ALL_CATEGORIES);

    const categories = [ALL_CATEGORIES, ...new Set(projects.map(p => p.category))];
    const filtered = activeFilter === ALL_CATEGORIES
        ? (preview ? projects.slice(0, 3) : projects)
        : projects.filter(p => p.category === activeFilter);

    return (
        <section className="projects-section">
            <div className="container">
                <div className="section-header">
                    <span className="badge">Nos Réalisations</span>
                    <h2>Projets & Chantiers en Cours</h2>
                    <div className="divider" />
                    <p>Découvrez nos projets en temps réel — chaque avancement est mis à jour par notre équipe pour une transparence totale.</p>
                </div>

                {!preview && (
                    <div className="projects-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`projects-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                                onClick={() => setActiveFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                <div className="projects-grid">
                    {filtered.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {preview && projects.length > 3 && (
                    <div className="projects-cta">
                        <Link to="/projects" className="btn btn-primary">
                            <i className="fas fa-folder-open" /> Voir tous les projets
                        </Link>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                        <i className="fas fa-folder-open" style={{ fontSize: '2.5rem', opacity: 0.3, display: 'block', marginBottom: '1rem' }} />
                        Aucun projet dans cette catégorie.
                    </div>
                )}
            </div>
        </section>
    );
}
