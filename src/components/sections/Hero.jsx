import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import './Hero.css';

export default function Hero() {
  const { content } = useCMS();
  const { slides } = content.hero;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="hero">
      <div className={`hero-slide ${animating ? 'fade-out' : 'fade-in'}`}>
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-badge">
            <i className="fas fa-shield-halved" /> JK IT Solutions — Yaoundé, Cameroun
          </div>
          <h1 className="hero-title">{slide.title}</h1>
          <p className="hero-subtitle">{slide.subtitle}</p>
          <div className="hero-btns">
            <Link to={slide.cta1.link} className="btn btn-primary">
              {slide.cta1.text} <i className="fas fa-arrow-right" />
            </Link>
            <Link to={slide.cta2.link} className="btn btn-outline">
              {slide.cta2.text}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button className="hero-nav hero-prev" onClick={prev} aria-label="Précédent">
        <i className="fas fa-chevron-left" />
      </button>
      <button className="hero-nav hero-next" onClick={next} aria-label="Suivant">
        <i className="fas fa-chevron-right" />
      </button>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <span>Défiler</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
