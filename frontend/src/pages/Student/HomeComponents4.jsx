import { forwardRef } from 'react';
import { Heart, Droplet, Building2, CreditCard, Phone, MapPin, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

// Health Center Section
export const HealthCenterSection = forwardRef(({ visible }, ref) => (
    <div 
        ref={ref}
        data-section="health"
        style={{
            padding: '8rem 2rem',
            background: 'white',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.7s'
        }}
    >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#ef444415',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    marginBottom: '1.5rem'
                }}>
                    <Heart size={20} color="#ef4444" />
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>Healthcare Services</span>
                </div>
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 800,
                    color: '#1f2937',
                    marginBottom: '1rem'
                }}>
                    Campus Health Center
                </h2>
                <p style={{
                    fontSize: '1.2rem',
                    color: '#6b7280',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Professional medical care when you need it most
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #ef444410 0%, #dc262610 100%)',
                    borderRadius: '24px',
                    padding: '3rem',
                    border: '2px solid #ef444420'
                }}>
                    <Heart size={48} color="#ef4444" strokeWidth={2} style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        marginBottom: '1.5rem'
                    }}>
                        Medical Services
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {[
                            'General consultation',
                            'Emergency first aid',
                            'Prescription services',
                            'Health counseling',
                            'Vaccination programs',
                            'Mental health support'
                        ].map((service, i) => (
                            <li key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <CheckCircle size={20} color="#10b981" />
                                <span style={{
                                    fontSize: '1.05rem',
                                    color: '#4b5563'
                                }}>
                                    {service}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '24px',
                    padding: '3rem',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h3 style={{
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            marginBottom: '2rem'
                        }}>
                            Operating Hours
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Clock size={20} />
                                    <span style={{ fontWeight: 600 }}>Regular Hours</span>
                                </div>
                                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                                    Monday - Friday: 8:00 AM - 6:00 PM
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <AlertCircle size={20} />
                                    <span style={{ fontWeight: 600 }}>Emergency</span>
                                </div>
                                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                                    24/7 On-Call Service
                                </div>
                            </div>
                        </div>
                    </div>

                    <button style={{
                        marginTop: '2rem',
                        padding: '1.25rem',
                        background: 'white',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}>
                        <Phone size={20} />
                        Emergency: +251-911-000-000
                    </button>
                </div>
            </div>
        </div>
    </div>
));

// Water Section
export const WaterSection = forwardRef(({ visible }, ref) => (
    <div 
        ref={ref}
        data-section="water"
        style={{
            padding: '8rem 2rem',
            background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.8s'
        }}
    >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '32px',
                padding: '4rem 3rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
            }}>
                {/* Background Decoration */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-80px',
                    left: '-80px',
                    width: '250px',
                    height: '250px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Droplet size={64} color="white" strokeWidth={2} style={{ marginBottom: '2rem' }} />
                    
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        marginBottom: '1.5rem'
                    }}>
                        Clean Water Available 24/7
                    </h2>

                    <p style={{
                        fontSize: '1.2rem',
                        opacity: 0.95,
                        marginBottom: '3rem',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto 3rem'
                    }}>
                        Access to safe, filtered drinking water throughout all dormitory buildings. Our water undergoes regular quality testing to ensure your health and safety.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { label: 'Filtered', icon: CheckCircle },
                            { label: 'Tested Daily', icon: CheckCircle },
                            { label: '24/7 Access', icon: CheckCircle }
                        ].map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px',
                                    padding: '2rem 1.5rem',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}>
                                    <Icon size={32} color="white" strokeWidth={2.5} style={{ marginBottom: '1rem' }} />
                                    <div style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 700
                                    }}>
                                        {feature.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
));
