import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import '../../pages/Packs.css';

function formatPrice(n) {
    return n?.toLocaleString('fr-FR') ?? '0';
}

function useCountdown(expiresAt) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!expiresAt) return;
        const target = new Date(expiresAt);
        target.setHours(23, 59, 59, 999);

        const compute = () => {
            const diff = target - new Date();
            if (diff <= 0) { setTimeLeft({ expired: true }); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft({ d, h, m, s, expired: false });
        };

        compute();
        const id = setInterval(compute, 1000);
        return () => clearInterval(id);
    }, [expiresAt]);

    return timeLeft;
}

function PackCard({ pack, whatsapp }) {
    const timeLeft = useCountdown(pack.expiresAt);
    const isExpired = timeLeft?.expired;
    const discount = pack.originalPrice > pack.promoPrice
        ? Math.round((1 - pack.promoPrice / pack.originalPrice) * 100)
        : 0;

    const waMessage = encodeURIComponent(
        `Bonjour, je suis intéressé(e) par le *${pack.title}* à ${formatPrice(pack.promoPrice)} FCFA. Pouvez-vous me donner plus d'informations ?`
    );
    const waLink = `https://wa.me/${(whatsapp || '').replace(/\D/g, '')}?text=${waMessage}`;

    return (
        <div className={`pack-card ${pack.featured ? 'featured' : ''} ${isExpired ? 'expired' : ''}`}>
            {pack.featured && <div className="pack-featured-label">⭐ Recommandé</div>}

            <div>
                <div className="pack-badge">{pack.badge || ' '}</div>
                <h3 className="pack-title">{pack.title}</h3>
            </div>

            {/* Pricing */}
            <div className="pack-pricing">
                <div className="pack-original-price">
                    {formatPrice(pack.originalPrice)} {pack.currency}
                </div>
                <div className="pack-promo-price">
                    {formatPrice(pack.promoPrice)} <span>{pack.currency}</span>
                </div>
                {discount > 0 && (
                    <span className="pack-discount-badge">−{discount}% de réduction</span>
                )}
            </div>

            {/* Countdown */}
            {pack.expiresAt && timeLeft && !timeLeft.expired && (
                <div className="pack-countdown">
                    <i className="fas fa-fire" />
                    <span>Expire dans</span>
                    <div className="countdown-units">
                        <div className="countdown-unit">
                            <span className="countdown-num">{String(timeLeft.d).padStart(2, '0')}</span>
                            <span className="countdown-label">j</span>
                        </div>
                        <span style={{ color: '#f59e0b', fontWeight: 800 }}>:</span>
                        <div className="countdown-unit">
                            <span className="countdown-num">{String(timeLeft.h).padStart(2, '0')}</span>
                            <span className="countdown-label">h</span>
                        </div>
                        <span style={{ color: '#f59e0b', fontWeight: 800 }}>:</span>
                        <div className="countdown-unit">
                            <span className="countdown-num">{String(timeLeft.m).padStart(2, '0')}</span>
                            <span className="countdown-label">m</span>
                        </div>
                        <span style={{ color: '#f59e0b', fontWeight: 800 }}>:</span>
                        <div className="countdown-unit">
                            <span className="countdown-num">{String(timeLeft.s).padStart(2, '0')}</span>
                            <span className="countdown-label">s</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Items */}
            <ul className="pack-items">
                {(pack.items || []).map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>

            {/* CTA */}
            <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className={`pack-cta ${pack.featured ? 'featured-cta' : 'default-cta'}`}
            >
                <i className="fab fa-whatsapp" />
                {pack.cta || 'Commander'}
            </a>
        </div>
    );
}

export default function PacksSection() {
    const { content } = useCMS();
    const packs = (content.packs || []).filter(p => p.active);
    const whatsapp = content.contact?.whatsapp || '';

    if (packs.length === 0) return null;

    return (
        <section className="packs-section">
            <div className="container">
                <div className="packs-header">
                    <div className="packs-tag">Offres Exclusives</div>
                    <h2 className="packs-title">
                        Nos <span>Packs & Promotions</span>
                    </h2>
                    <p className="packs-subtitle">
                        Des offres clés-en-main pensées pour votre budget. Durée limitée — saisissez l'opportunité avant qu'elle disparaisse.
                    </p>
                </div>

                <div className="packs-grid">
                    {packs.map(pack => (
                        <PackCard key={pack.id} pack={pack} whatsapp={whatsapp} />
                    ))}
                </div>
            </div>
        </section>
    );
}
