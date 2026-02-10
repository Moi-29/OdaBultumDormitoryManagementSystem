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


// Welcome Stats Section - Clean & Minimal
export const WelcomeStats = forwardRef(({ visible }, ref) => (
    <div 
        ref={ref}
        data-section="stats"
        style={{
            padding: '6rem 2rem',
            background: 'white',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out'
        }}
    >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                {[
                    { icon: Users, label: 'Active Students', value: '5,000+', color: '#10b981' },
                    { icon: Building2, label: 'Dormitory Blocks', value: '12', color: '#0f172a' },
                    { icon: Award, label: 'Campus Rating', value: '4.8/5', color: '#10b981' },
                    { icon: TrendingUp, label: 'Satisfaction Rate', value: '96%', color: '#0f172a' }
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} style={{
                            background: '#f8fafc',
                            padding: '2.5rem 2rem',
                            borderRadius: '16px',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                            e.currentTarget.style.borderColor = stat.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: `${stat.color}10`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Icon size={28} color={stat.color} strokeWidth={2} />
                            </div>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: '#0f172a',
                                marginBottom: '0.5rem'
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                color: '#64748b',
                                fontWeight: 600
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
));


// Discipline Section - Refined Accordion
export const DisciplineSection = forwardRef(({ visible }, ref) => {
    const [openIndex, setOpenIndex] = useState(null);
    
    const rules = [
        {
            title: 'Dormitory Rules & Regulations',
            icon: Shield,
            items: [
                'Respect quiet hours: 10 PM - 6 AM on weekdays',
                'No smoking or alcohol in dormitory premises',
                'Visitors must register at reception and leave by 8 PM',
                'Keep common areas clean and organized',
                'Report maintenance issues promptly to your proctor'
            ]
        },
        {
            title: 'Academic Conduct',
            icon: Award,
            items: [
                'Maintain minimum 2.0 GPA to retain dormitory privileges',
                'Attend all mandatory campus events and meetings',
                'Follow university dress code in common areas',
                'Participate in community service activities',
                'Respect intellectual property and academic integrity'
            ]
        },
        {
            title: 'Safety & Security',
            icon: AlertCircle,
            items: [
                'Always carry your student ID card',
                'Lock your room when leaving',
                'Report suspicious activities immediately',
                'Follow fire safety protocols and evacuation procedures',
                'Do not share room keys or access cards'
            ]
        }
    ];

    return (
        <div 
            ref={ref}
            data-section="discipline"
            style={{
                padding: '8rem 2rem',
                background: '#f8fafc',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(50px)',
                transition: 'all 0.8s ease-out 0.2s'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '1rem',
                        letterSpacing: '-0.01em'
                    }}>
                        Campus Guidelines
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#64748b',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Essential rules for a harmonious campus community
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {rules.map((rule, index) => {
                        const Icon = rule.icon;
                        const isOpen = openIndex === index;
                        
                        return (
                            <div key={index} style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                overflow: 'hidden',
                                transition: 'all 0.3s'
                            }}>
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    style={{
                                        width: '100%',
                                        padding: '1.5rem 2rem',
                                        background: isOpen ? '#f8fafc' : 'white',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: isOpen ? '#10b981' : '#f8fafc',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s'
                                    }}>
                                        <Icon size={24} color={isOpen ? 'white' : '#64748b'} strokeWidth={2} />
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'left' }}>
                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            color: '#0f172a',
                                            margin: 0
                                        }}>
                                            {rule.title}
                                        </h3>
                                    </div>
                                    <ChevronDown 
                                        size={20} 
                                        color="#64748b"
                                        style={{
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.3s'
                                        }}
                                    />
                                </button>
                                
                                <div style={{
                                    maxHeight: isOpen ? '500px' : '0',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s ease-out'
                                }}>
                                    <div style={{ padding: '0 2rem 2rem' }}>
                                        <ul style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            margin: 0
                                        }}>
                                            {rule.items.map((item, i) => (
                                                <li key={i} style={{
                                                    padding: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '1rem',
                                                    borderBottom: i < rule.items.length - 1 ? '1px solid #f1f5f9' : 'none'
                                                }}>
                                                    <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} strokeWidth={2} />
                                                    <span style={{
                                                        fontSize: '0.9375rem',
                                                        color: '#475569',
                                                        lineHeight: 1.6
                                                    }}>
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
