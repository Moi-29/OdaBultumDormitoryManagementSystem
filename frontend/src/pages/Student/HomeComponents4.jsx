import { forwardRef } from 'react';
import { Heart, Droplet, Phone, Activity } from 'lucide-react';

// Wellness Sanctuary Section
export const HealthCenterSection = forwardRef(({ visible }, ref) => (
    <div ref={ref} data-section="health" style={{
        padding: '8rem 2rem',
        background: '#0a1f1f',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out 0.7s'
    }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '3rem' }}>
            <div style={{
                background: 'linear-gradient(135deg, #0d2d2d, #1a4040)',
                borderRadius: '24px',
                padding: '3rem',
                border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                }}>
                    <Heart size={32} color="#ef4444" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Heart size={24} color="#ef4444" />
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: 0 }}>
                        Wellness Sanctuary
                    </h2>
                </div>
                <p style={{ fontSize: '1rem', color: '#a0b0b0', marginBottom: '2rem' }}>
                    Your physical and mental health, prioritized.
                </p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>
                    Scholarly Vitality Services
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#a0b0b0', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Our premier medical facility provides 24/7 elite care, ensuring that every scholar maintains peak physical and psychological health for their academic journey.
                </p>

                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '50px',
                    marginBottom: '1.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#10b981'
                }}>
                    <Activity size={14} />
                    DOCTORS ONLINE
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>
                        BOOK CONSULT
                    </button>
                    <button style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        <Phone size={16} />
                        EMERGENCY
                    </button>
                </div>
            </div>
        </div>
    </div>
));

// Pure Hydration Section
export const WaterSection = forwardRef(({ visible }, ref) => (
    <div ref={ref} data-section="water" style={{
        padding: '8rem 2rem',
        background: '#0a1f1f',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out 0.8s'
    }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{
                background: 'linear-gradient(135deg, #1a4040, #2d5555)',
                borderRadius: '32px',
                padding: '3rem',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Droplet size={32} color="#06b6d4" />
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
                        Pure Hydration
                    </h2>
                </div>
                <p style={{ fontSize: '1rem', color: '#a0b0b0', marginBottom: '2rem' }}>
                    Monitoring campus sustainability and water purity.
                </p>

                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(6, 182, 212, 0.15)',
                    borderRadius: '50px',
                    marginBottom: '1.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#06b6d4'
                }}>
                    INTELLIGENCE STATUS
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '4rem', fontWeight: 800, color: 'white' }}>99.8</span>
                    <span style={{ fontSize: '1.5rem', color: '#a0b0b0' }}>%</span>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#a0b0b0' }}>💧 PURITY LEVEL</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '99.8%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #06b6d4, #22d3ee)',
                            borderRadius: '50px'
                        }} />
                    </div>
                </div>

                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#10b981'
                }}>
                    💧 SMART FILTRATION ACTIVE
                    <span style={{ marginLeft: '1rem', color: '#708090' }}>EST. FLOW: 1,240 L/H</span>
                </div>
            </div>
        </div>
    </div>
));
