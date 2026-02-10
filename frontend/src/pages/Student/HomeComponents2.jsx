import { forwardRef } from 'react';
import { Users, Star, Coffee, Zap, Moon } from 'lucide-react';

// Union Council Section
export const StudentUnionSection = forwardRef(({ visible }, ref) => (
    <div ref={ref} data-section="union" style={{
        padding: '8rem 2rem',
        background: '#0a1f1f',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out 0.3s'
    }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '3rem' }}>
            <div style={{
                background: 'linear-gradient(135deg, #1a4040 0%, #2d5555 100%)',
                borderRadius: '24px',
                padding: '3rem',
                border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(212, 175, 55, 0.15)',
                    borderRadius: '50px',
                    marginBottom: '2rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#d4af37'
                }}>
                    ◆ COMMUNITY NETWORK
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
                    Union Council
                </h2>
                <h3 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    background: 'linear-gradient(135deg, #d4af37, #f0d068)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1.5rem'
                }}>
                    Intelligence
                </h3>
                <p style={{ fontSize: '1rem', color: '#a0b0b0', lineHeight: 1.6, marginBottom: '2rem' }}>
                    The governing body dedicated to architecting an unparalleled campus lifestyle and scholar representation.
                </p>
            </div>
        </div>
    </div>
));

// Cafeteria Schedule Section
export const CafeteriaSchedule = forwardRef(({ visible }, ref) => (
    <div ref={ref} data-section="schedule" style={{
        padding: '8rem 2rem',
        background: '#0a1f1f',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out 0.4s'
    }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Coffee size={24} color="#d4af37" />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
                    Culinary Timing
                </h2>
            </div>
            <p style={{ fontSize: '1rem', color: '#a0b0b0', marginBottom: '3rem' }}>
                Meticulously scheduled nutrition windows for the optimal academic performance.
            </p>

            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '50px',
                marginBottom: '2rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: '#10b981'
            }}>
                ● MAIN HALL STATUS: OPEN
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {[
                    { icon: Coffee, label: 'Continental Breakfast', time: '07:00 — 09:30', status: 'COMPLETED', active: false },
                    { icon: Zap, label: 'Scholarly Lunch', time: '12:00 — 14:30', status: 'ACTIVE', active: true },
                    { icon: Moon, label: 'Grand Evening Dinner', time: '18:00 — 21:00', status: 'UPCOMING', active: false }
                ].map((meal, i) => {
                    const Icon = meal.icon;
                    return (
                        <div key={i} style={{
                            background: meal.active ? 'linear-gradient(135deg, #1a4040, #2d5555)' : 'linear-gradient(135deg, #0d2d2d, #1a4040)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: meal.active ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: meal.active ? 'rgba(212, 175, 55, 0.2)' : 'rgba(100, 116, 139, 0.15)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Icon size={28} color={meal.active ? '#d4af37' : '#64748b'} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                                {meal.label}
                            </h3>
                            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: meal.active ? '#d4af37' : '#a0b0b0', marginBottom: '1rem' }}>
                                {meal.time}
                            </div>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.375rem 0.875rem',
                                background: meal.active ? 'rgba(212, 175, 55, 0.2)' : 'rgba(100, 116, 139, 0.15)',
                                borderRadius: '50px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: meal.active ? '#d4af37' : '#708090'
                            }}>
                                {meal.status}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
));
