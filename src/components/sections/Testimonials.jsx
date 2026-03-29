import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import './Testimonials.css';

export default function Testimonials() {
  const { content } = useCMS();
  const { testimonials } = content;
  const [current, setCurrent] = useState(0);

  return (
    <section className="section-padding testimonials-section">
      <div className="container">
        <div className="section-header">
          <span className="badge">Ce qu'ils disent</span>
          <h2>Témoignages Clients</h2>
          <div className="divider" />
        </div>

        <div className="testimonials-wrapper">
          <div className="testimonial-card">
            <div className="quote-icon"><i className="fas fa-quote-left" /></div>
            <p className="testimonial-text">"{testimonials[current].text}"</p>
            <div className="testimonial-stars">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <i key={i} className="fas fa-star" />
              ))}
            </div>
            <div className="testimonial-author">
              <img src={testimonials[current].avatar} alt={testimonials[current].name} />
              <div>
                <strong>{testimonials[current].name}</strong>
                <span>{testimonials[current].role}</span>
              </div>
            </div>
          </div>

          <div className="testimonial-nav">
            {testimonials.map((t, i) => (
              <button
                key={i}
                className={`testimonial-thumb ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
              >
                <img src={t.avatar} alt={t.name} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
