import { forwardRef, useState } from 'react';
import { ChevronDown, Users, Building2, Award, TrendingUp, CheckCircle, Shield, AlertCircle } from 'lucide-react';

// Luxury Hero Section - Exact from Image
export const HeroSection = ({ scrollY }) => {
    const parallaxOffset = scrollY * 0.3;
    
    return (
        <div style={{
            position: 'relative',
            height: '100vh',
            minHeight: '700px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a1f1f 0%, #1a3535 50%, #2d4a4a 100%)'
        }}>
            {/* Grid Pattern Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
                transform: `translateY(${parallaxOffset}px)`,
                transition: 'transform 0.1s ease-out'
            }} />

            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 70%)'
            }} />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                padding: '2rem',
                maxWidth: '1000px',
                animation: 'luxuryFadeIn 1s ease-out'
            }}>
                {/* Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '50px',
                    marginBottom: '2.5rem',
                    animation: 'luxuryFadeIn 1.2s ease-out'
                }}>
                    <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#d4af37'
                    }}>
                        ◆ ESTABLISHED EXCELLENCE • 2026
                    </span>
                </div>

                {/* Main Title */}
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '0.5rem',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    animation: 'luxuryFadeIn 1.4s ease-out',
                    textTransform: 'uppercase'
                }}>
                    ELEVATE YOUR
                </h1>

                {/* Gold Italic Title */}
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #d4af37 0%, #f0d068 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '2rem',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    fontStyle: 'italic',
                    animation: 'luxuryFadeIn 1.6s ease-out'
                }}>
                    POTENTIAL
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '1.125rem',
                    color: '#a0b0b0',
                    marginBottom: '1rem',
                    maxWidth: '700px',
                    margin: '0 auto 1rem',
                    lineHeight: 1.6,
                    animation: 'luxuryFadeIn 1.8s ease-out'
                }}>
                    Welcome to the world's most sophisticated educational ecosystem.
                </p>
                <p style={{
                    fontSize: '1.125rem',
                    color: '#a0b0b0',
                    marginBottom: '3rem',
                    maxWidth: '700px',
                    margin: '0 auto 3rem',
                    lineHeight: 1.6,
                    animation: 'luxuryFadeIn 2s ease-out'
                }}>
                    A sanctuary for scholars where intelligence meets luxury.
                </p>

                {/* CTA Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    animation: 'luxuryFadeIn 2.2s ease-out'
                }}>
                    <button style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #d4af37 0%, #f0d068 100%)',
                        color: '#0a1f1f',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        letterSpacing: '0.025em',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.3)';
                    }}>
                        ENTER PORTAL →
                    </button>

                    <button style={{
                        padding: '1rem 2rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}>
                        ▶ VIRTUAL TOUR
                    </button>
                </div>
            </div>

            {/* Floating Icons at Bottom */}
            <div style={{
                position: 'absolute',
                bottom: '4rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8rem',
                zIndex: 2
            }}>
                {[
                    { icon: '🎓', color: '#3b82f6' },
                    { icon: '⚡', color: '#f59e0b' },
                    { icon: '🔬', color: '#10b981' },
                    { icon: '❤️', color: '#ef4444' }
                ].map((item, i) => (
                    <div key={i} style={{
                        width: '64px',
                        height: '64px',
                        background: `${item.color}15`,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: `1px solid ${item.color}30`,
                        animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`
                    }}>
                        {item.icon}
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes luxuryFadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>
        </div>
    );
};


// Stats Section - Luxury Dark Theme
export const WelcomeStats = forwardRef(({ visible }, ref) => (
    <div ref={ref} data-section="stats" style={{
        padding: '6rem 2rem',
        background: '#0a1f1f',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out'
    }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                {[
                    { label: 'LIVE IMPACT', value: '08', sublabel: 'VERIFIED', color: '#d4af37' },
                    { label: 'LIVE IMPACT', value: '3.92', sublabel: 'VERIFIED', color: '#d4af37' },
                    { label: 'LIVE IMPACT', value: '98%', sublabel: 'VERIFIED', color: '#d4af37' },
                    { label: 'LIVE IMPACT', value: '1,420', sublabel: 'VERIFIED', color: '#d4af37' }
                ].map((stat, i) => (
                    <div key={i} style={{
                        background: 'linear-gradient(135deg, #0d2d2d 0%, #1a4040 100%)',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        transition: 'all 0.3s'
                    }}>
                        <div style={{ fontSize: '0.75rem', color: '#708090', marginBottom: '1rem', letterSpacing: '0.1em' }}>
                            {stat.label}
                        </div>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span>●</span> {stat.sublabel}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
));

// Code of Excellence Section
export const DisciplineSection = forwardRef(({ visible }, ref) => {
    const [openIndex, setOpenIndex] = useState(null);
    
    return (
        <div ref={ref} data-section="discipline" style={{
            padding: '8rem 2rem',
            background: '#0a1f1f',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.2s'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3rem', marginBottom: '3rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                        <Shield size={32} color="#3b82f6" strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            color: 'white',
                            marginBottom: '1rem'
                        }}>
                            Code of Excellence
                        </h2>
                        <p style={{ fontSize: '1.125rem', color: '#a0b0b0', lineHeight: 1.6 }}>
                            The principles that define the elite scholarly community of Oda Bultum University.
                        </p>
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #0d2d2d 0%, #1a4040 100%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    overflow: 'hidden'
                }}>
                    <button onClick={() => setOpenIndex(openIndex === 0 ? null : 0)} style={{
                        width: '100%',
                        padding: '2rem',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        cursor: 'pointer',
                        color: 'white'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(212, 175, 55, 0.15)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Award size={24} color="#d4af37" />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                Academic Excellence Protocol
                            </h3>
                        </div>
                        <ChevronDown size={20} style={{
                            transform: openIndex === 0 ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.3s'
                        }} />
                    </button>
                    <div style={{
                        maxHeight: openIndex === 0 ? '500px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease-out'
                    }}>
                        <div style={{ padding: '0 2rem 2rem' }}>
                            {[
                                'Respect quiet hours: 10 PM - 6 AM on weekdays',
                                'No smoking or alcohol in dormitory premises',
                                'Visitors must register at reception and leave by 8 PM',
                                'Keep common areas clean and organized',
                                'Report maintenance issues promptly to your proctor'
                            ].map((item, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}>
                                    <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span style={{ fontSize: '0.9375rem', color: '#a0b0b0', lineHeight: 1.6 }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
