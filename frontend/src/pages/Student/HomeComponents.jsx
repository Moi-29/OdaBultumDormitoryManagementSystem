import { forwardRef, useState } from 'react';
import { ChevronDown, Users, Building2, Award, TrendingUp, CheckCircle, Shield, AlertCircle, Heart, Droplet, Phone, MapPin, Mail, Clock, Bed, Home as HomeIcon } from 'lucide-react';

// Ultra Premium Hero Section - Minimal & Sophisticated
export const HeroSection = ({ scrollY }) => {
    const parallaxOffset = scrollY * 0.3;
    
    return (
        <div style={{
            position: 'relative',
            height: '90vh',
            minHeight: '600px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff'
        }}>
            {/* Subtle gradient background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                transform: `translateY(${parallaxOffset}px)`,
                transition: 'transform 0.1s ease-out'
            }}>
                {/* Minimal grid pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    opacity: 0.3
                }} />
            </div>

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                padding: '2rem',
                maxWidth: '900px',
                animation: 'fadeInUp 1s ease-out'
            }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.25rem',
                    background: '#10b981',
                    borderRadius: '50px',
                    marginBottom: '2rem',
                    animation: 'fadeIn 1.5s ease-out'
                }}>
                    <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.025em' }}>
                        STUDENT PORTAL
                    </span>
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '1.5rem',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    animation: 'fadeInUp 1.2s ease-out'
                }}>
                    Oda Bultum University
                </h1>

                <p style={{
                    fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                    color: '#64748b',
                    marginBottom: '3rem',
                    maxWidth: '700px',
                    margin: '0 auto 3rem',
                    lineHeight: 1.6,
                    fontWeight: 400,
                    animation: 'fadeInUp 1.4s ease-out'
                }}>
                    Your complete guide to campus life, services, and community
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    animation: 'fadeInUp 1.6s ease-out'
                }}>
                    <button style={{
                        padding: '1rem 2rem',
                        background: '#0f172a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.2)',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.01em'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.2)';
                    }}>
                        Explore Campus
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'bounce 2s infinite',
                zIndex: 2,
                opacity: 0.4
            }}>
                <ChevronDown size={28} color="#64748b" strokeWidth={2} />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-10px); }
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
