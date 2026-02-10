import { forwardRef, useState } from 'react';
import { Users, Utensils, Heart, Droplet, Building2, CreditCard, Clock, Phone, MapPin, Star, Coffee, Sunrise, Sunset, Moon, CheckCircle, TrendingUp } from 'lucide-react';

// Student Union Section
export const StudentUnionSection = forwardRef(({ visible }, ref) => (
    <div 
        ref={ref}
        data-section="union"
        style={{
            padding: '8rem 2rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            position: 'relative',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.3s'
        }}
    >
        {/* Background Pattern */}
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.5
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '1rem'
                }}>
                    Student Union
                </h2>
                <p style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255,255,255,0.9)',
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    Your voice, your community, your future
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
            }}>
                {[
                    { icon: Users, title: 'Active Members', value: '500+', desc: 'Engaged students' },
                    { icon: Star, title: 'Annual Events', value: '20+', desc: 'Cultural & academic' },
                    { icon: TrendingUp, title: 'Impact Score', value: '4.9/5', desc: 'Student satisfaction' }
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            padding: '2.5rem',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            textAlign: 'center',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                            <Icon size={40} color="white" strokeWidth={2} style={{ marginBottom: '1rem' }} />
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: 'white',
                                marginBottom: '0.5rem'
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: 'white',
                                marginBottom: '0.25rem'
                            }}>
                                {stat.title}
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.8)'
                            }}>
                                {stat.desc}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '24px',
                padding: '3rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
            }}>
                <h3 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    Our Mission & Values
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    {[
                        { title: 'Unity', desc: 'Building bridges across diverse student communities' },
                        { title: 'Excellence', desc: 'Promoting academic and personal growth' },
                        { title: 'Service', desc: 'Serving students with dedication and integrity' },
                        { title: 'Innovation', desc: 'Creating new opportunities for student success' }
                    ].map((value, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 800
                            }}>
                                {i + 1}
                            </div>
                            <h4 style={{
                                fontSize: '1.3rem',
                                fontWeight: 700,
                                color: '#1f2937',
                                marginBottom: '0.5rem'
                            }}>
                                {value.title}
                            </h4>
                            <p style={{
                                fontSize: '1rem',
                                color: '#6b7280',
                                lineHeight: 1.6
                            }}>
                                {value.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
));


// Cafeteria Schedule Section
export const CafeteriaSchedule = forwardRef(({ visible }, ref) => {
    const schedule = [
        { time: '12:30 PM - 2:00 PM', meal: 'Lunch', icon: Sunrise, color: '#10b981', desc: 'Traditional Ethiopian & Continental' },
        { time: '5:00 PM - 7:00 PM', meal: 'Dinner', icon: Sunset, color: '#3b82f6', desc: 'Hot meals & Vegetarian options' },
        { time: '11:00 PM - 1:00 AM', meal: 'Late Night', icon: Moon, color: '#8b5cf6', desc: 'Light snacks & Beverages' }
    ];

    return (
        <div 
            ref={ref}
            data-section="schedule"
            style={{
                padding: '8rem 2rem',
                background: 'white',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(50px)',
                transition: 'all 0.8s ease-out 0.4s'
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #10b98115, #05966915)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        marginBottom: '1.5rem'
                    }}>
                        <Utensils size={20} color="#10b981" />
                        <span style={{ color: '#10b981', fontWeight: 700 }}>Dining Services</span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        fontWeight: 800,
                        color: '#1f2937',
                        marginBottom: '1rem'
                    }}>
                        Cafeteria Schedule
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#6b7280',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Fresh, nutritious meals served daily
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {schedule.map((slot, i) => {
                        const Icon = slot.icon;
                        return (
                            <div key={i} style={{
                                background: `linear-gradient(135deg, ${slot.color}05 0%, ${slot.color}10 100%)`,
                                borderRadius: '24px',
                                padding: '2.5rem',
                                border: `2px solid ${slot.color}30`,
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                e.currentTarget.style.boxShadow = `0 20px 40px ${slot.color}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                {/* Background Icon */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    opacity: 0.1
                                }}>
                                    <Icon size={120} color={slot.color} />
                                </div>

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        width: '70px',
                                        height: '70px',
                                        background: slot.color,
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <Icon size={36} color="white" strokeWidth={2.5} />
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.8rem',
                                        fontWeight: 800,
                                        color: '#1f2937',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {slot.meal}
                                    </h3>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <Clock size={18} color={slot.color} />
                                        <span style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            color: slot.color
                                        }}>
                                            {slot.time}
                                        </span>
                                    </div>

                                    <p style={{
                                        fontSize: '1rem',
                                        color: '#6b7280',
                                        lineHeight: 1.6
                                    }}>
                                        {slot.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
