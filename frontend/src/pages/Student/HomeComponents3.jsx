import { forwardRef } from 'react';
import { Star, Globe, Heart } from 'lucide-react';

// Dining Intelligence Section
export const CafeteriaQuality = forwardRef(({ visible }, ref) => (
    <div ref={ref} data-section="quality" style={{
        padding: '8rem 2rem',
        background: '#0a1f1f',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out 0.5s'
    }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
                Dining Intelligence
            </h2>
            <p style={{ fontSize: '1rem', color: '#a0b0b0', marginBottom: '3rem' }}>
                Peer-reviewed food quality, nutritional benchmarks, and culinary safety reports.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {[
                    { icon: Star, label: 'Nutritional Intelligence', score: '9.8', desc: 'Expertly curated menus focusing on student cognitive performance and sustained focus.' },
                    { icon: Star, label: 'Culinary Craftsmanship', score: '9.4', desc: 'A diverse range of local and international cuisines prepared by world-class campus chefs.' },
                    { icon: Heart, label: 'Purity Standards', score: '9.0', desc: 'Zero-tolerance policy for substandard hygiene, with daily purity audits and transparency.' }
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} style={{
                            background: 'linear-gradient(135deg, #0d2d2d, #1a4040)',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            border: '1px solid rgba(212, 175, 55, 0.2)'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'rgba(212, 175, 55, 0.15)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <Icon size={28} color="#d4af37" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                                {item.label}
                            </h3>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.375rem 0.875rem',
                                background: 'rgba(212, 175, 55, 0.2)',
                                borderRadius: '50px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#d4af37',
                                marginBottom: '1rem'
                            }}>
                                SCORE: {item.score}
                            </div>
                            <p style={{ fontSize: '0.9375rem', color: '#a0b0b0', lineHeight: 1.6 }}>
                                {item.desc}
                            </p>
                            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1rem' }}>
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={16} color="#d4af37" fill="#d4af37" />
                                ))}
                                <span style={{ fontSize: '0.75rem', color: '#708090', marginLeft: '0.5rem' }}>
                                    VERIFIED EXCELLENCE
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
));

// Cultural Intelligence Section
export const ToleranceSection = forwardRef(({ visible }, ref) => (
    <div ref={ref} data-section="tolerance" style={{
        padding: '8rem 2rem',
        background: '#0a1f1f',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out 0.6s'
    }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '3rem' }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Globe size={32} color="#d4af37" />
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
                        Cultural Intelligence
                    </h2>
                </div>
                <p style={{ fontSize: '1rem', color: '#a0b0b0', marginBottom: '3rem' }}>
                    Celebrating the rich tapestry of our diverse scholarly community.
                </p>

                <div style={{
                    background: 'linear-gradient(135deg, #1a4040, #2d5555)',
                    borderRadius: '24px',
                    padding: '3rem',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'rgba(212, 175, 55, 0.2)',
                        borderRadius: '50px',
                        marginBottom: '2rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        color: '#d4af37'
                    }}>
                        ◆ UNITY IN EXCELLENCE
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
                        Our Strength is Our
                    </h3>
                    <h3 style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        fontStyle: 'italic',
                        background: 'linear-gradient(135deg, #d4af37, #f0d068)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1.5rem'
                    }}>
                        Collective Heritage
                    </h3>
                    <p style={{ fontSize: '1rem', color: '#a0b0b0', lineHeight: 1.6 }}>
                        OBU is a sanctuary where global traditions converge. We believe that true world-class education is nurtured through mutual respect, cultural curiosity, and shared wisdom.
                    </p>
                </div>
            </div>
        </div>
    </div>
));
