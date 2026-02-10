import { forwardRef, useState } from 'react';
import { ChevronDown, Users, Utensils, Heart, Droplet, Building2, CreditCard, Shield, Globe, Clock, Phone, MapPin, Award, Star, TrendingUp, CheckCircle, AlertCircle, Coffee, Sunrise, Sunset, Moon } from 'lucide-react';

// Hero Section Component
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
            justifyContent: 'center'
        }}>
            {/* Background with Parallax */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                transform: `translateY(${parallaxOffset}px)`,
                transition: 'transform 0.1s ease-out'
            }}>
                {/* Overlay Pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                    opacity: 0.3
                }} />
                
                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)'
                }} />
            </div>

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                padding: '2rem',
                maxWidth: '1200px',
                animation: 'fadeInUp 1s ease-out'
            }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50px',
                    marginBottom: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    animation: 'fadeIn 1.5s ease-out'
                }}>
                    <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                        🎓 Welcome to Your Campus Home
                    </span>
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '1.5rem',
                    lineHeight: 1.1,
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    animation: 'fadeInUp 1.2s ease-out'
                }}>
                    Oda Bultum University
                    <br />
                    <span style={{
                        background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Student Portal
                    </span>
                </h1>

                <p style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    marginBottom: '3rem',
                    maxWidth: '800px',
                    margin: '0 auto 3rem',
                    lineHeight: 1.6,
                    animation: 'fadeInUp 1.4s ease-out'
                }}>
                    Your complete guide to dorm life, campus services, and community at Oda Bultum
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    animation: 'fadeInUp 1.6s ease-out'
                }}>
                    <button style={{
                        padding: '1rem 2.5rem',
                        background: 'white',
                        color: '#059669',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                    }}>
                        <Building2 size={20} />
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
                zIndex: 2
            }}>
                <ChevronDown size={32} color="white" strokeWidth={3} />
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


// Welcome Stats Section
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
                    { icon: Building2, label: 'Dormitory Blocks', value: '12', color: '#3b82f6' },
                    { icon: Award, label: 'Campus Rating', value: '4.8/5', color: '#f59e0b' },
                    { icon: TrendingUp, label: 'Satisfaction Rate', value: '96%', color: '#8b5cf6' }
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} style={{
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                            padding: '2.5rem 2rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: `${stat.color}15`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Icon size={36} color={stat.color} strokeWidth={2.5} />
                            </div>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: '#1f2937',
                                marginBottom: '0.5rem'
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                color: '#6b7280',
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


// Discipline Section
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
                background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(50px)',
                transition: 'all 0.8s ease-out 0.2s'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        fontWeight: 800,
                        color: '#1f2937',
                        marginBottom: '1rem'
                    }}>
                        Campus Guidelines
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#6b7280',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Essential rules for a harmonious campus community
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {rules.map((rule, index) => {
                        const Icon = rule.icon;
                        const isOpen = openIndex === index;
                        
                        return (
                            <div key={index} style={{
                                background: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                overflow: 'hidden',
                                border: '2px solid',
                                borderColor: isOpen ? '#10b981' : '#e5e7eb',
                                transition: 'all 0.3s'
                            }}>
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    style={{
                                        width: '100%',
                                        padding: '2rem',
                                        background: isOpen ? 'linear-gradient(135deg, #10b98110 0%, #05966910 100%)' : 'white',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: isOpen ? '#10b981' : '#f3f4f6',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s'
                                    }}>
                                        <Icon size={28} color={isOpen ? 'white' : '#6b7280'} />
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'left' }}>
                                        <h3 style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            color: '#1f2937',
                                            margin: 0
                                        }}>
                                            {rule.title}
                                        </h3>
                                    </div>
                                    <ChevronDown 
                                        size={24} 
                                        color="#6b7280"
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
                                                    borderBottom: i < rule.items.length - 1 ? '1px solid #f3f4f6' : 'none'
                                                }}>
                                                    <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                    <span style={{
                                                        fontSize: '1.05rem',
                                                        color: '#4b5563',
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
