import { forwardRef } from 'react';
import { Utensils, Heart, Droplet, Building2, CreditCard, Phone, MapPin, Star, CheckCircle, Globe, Users, TrendingUp } from 'lucide-react';

// Cafeteria Quality Section
export const CafeteriaQuality = forwardRef(({ visible }, ref) => (
    <div 
        ref={ref}
        data-section="quality"
        style={{
            padding: '8rem 2rem',
            background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.5s'
        }}
    >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '3rem',
                alignItems: 'center'
            }}>
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#fbbf2415',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        marginBottom: '1.5rem'
                    }}>
                        <Star size={20} color="#fbbf24" fill="#fbbf24" />
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>Premium Quality</span>
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        color: '#1f2937',
                        marginBottom: '1.5rem',
                        lineHeight: 1.2
                    }}>
                        Exceptional Dining Experience
                    </h2>

                    <p style={{
                        fontSize: '1.15rem',
                        color: '#6b7280',
                        lineHeight: 1.8,
                        marginBottom: '2rem'
                    }}>
                        Our cafeteria serves fresh, nutritious meals prepared by experienced chefs using locally-sourced ingredients. We cater to diverse dietary needs and cultural preferences.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            'Hygienically prepared meals',
                            'Balanced nutritional content',
                            'Vegetarian & vegan options',
                            'Halal certified kitchen',
                            'Regular quality inspections'
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: '#10b98115',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <CheckCircle size={18} color="#10b981" />
                                </div>
                                <span style={{
                                    fontSize: '1.05rem',
                                    color: '#4b5563',
                                    fontWeight: 500
                                }}>
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    borderRadius: '24px',
                    padding: '3rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%'
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: 800,
                            marginBottom: '1rem'
                        }}>
                            4.7/5
                        </div>
                        <div style={{
                            fontSize: '1.3rem',
                            fontWeight: 600,
                            marginBottom: '1rem'
                        }}>
                            Student Rating
                        </div>
                        <div style={{
                            fontSize: '1rem',
                            opacity: 0.9,
                            marginBottom: '2rem'
                        }}>
                            Based on 2,500+ reviews
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{
                                fontSize: '0.9rem',
                                fontStyle: 'italic',
                                marginBottom: '1rem',
                                lineHeight: 1.6
                            }}>
                                "The food quality has significantly improved. I especially love the variety of Ethiopian dishes!"
                            </div>
                            <div style={{
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                                - 3rd Year Engineering Student
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
));

// Tolerance & Diversity Section
export const ToleranceSection = forwardRef(({ visible }, ref) => (
    <div 
        ref={ref}
        data-section="tolerance"
        style={{
            padding: '8rem 2rem',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            position: 'relative',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.6s'
        }}
    >
        {/* Background Pattern */}
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.3
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <Globe size={60} color="white" strokeWidth={2} style={{ marginBottom: '1.5rem' }} />
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '1rem'
                }}>
                    Unity in Diversity
                </h2>
                <p style={{
                    fontSize: '1.3rem',
                    color: 'rgba(255,255,255,0.95)',
                    maxWidth: '800px',
                    margin: '0 auto',
                    lineHeight: 1.6
                }}>
                    At Oda Bultum University, we celebrate our differences and embrace our shared humanity. Our campus is a vibrant tapestry of cultures, beliefs, and perspectives.
                </p>
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '3rem',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {[
                        { icon: Users, label: '50+ Ethnicities', value: 'Represented' },
                        { icon: Globe, label: '15+ Languages', value: 'Spoken' },
                        { icon: Heart, label: '100% Respect', value: 'Guaranteed' }
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <Icon size={40} color="white" strokeWidth={2} style={{ marginBottom: '1rem' }} />
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    marginBottom: '0.5rem'
                                }}>
                                    {stat.label}
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    color: 'rgba(255,255,255,0.8)'
                                }}>
                                    {stat.value}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '16px',
                    padding: '2.5rem',
                    color: '#1f2937'
                }}>
                    <h3 style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        Our Commitment
                    </h3>
                    <p style={{
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        color: '#4b5563',
                        textAlign: 'center',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        We foster an inclusive environment where every student feels valued, respected, and empowered to succeed. Zero tolerance for discrimination, harassment, or prejudice of any kind. Together, we build a community that celebrates diversity as our greatest strength.
                    </p>
                </div>
            </div>
        </div>
    </div>
));
