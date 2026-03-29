import { useEffect, useRef, useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import './Stats.css';

function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}</span>;
}

const icons = ['fa-users', 'fa-diagram-project', 'fa-calendar-check', 'fa-user-shield'];

export default function Stats() {
  const { content } = useCMS();
  const { stats } = content.about;

  return (
    <section className="stats-section">
      <div className="container stats-grid">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-icon">
              <i className={`fas ${icons[i % icons.length]}`} />
            </div>
            <div className="stat-value">
              <CountUp end={stat.value} />+
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
